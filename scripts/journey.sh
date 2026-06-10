#!/usr/bin/env bash
#
# journey.sh — the deterministic toolbelt for the Journey Skill.
#
# One bash dispatcher (POSIX shell + awk/grep/sed, no Python/Node) that does the
# mechanical work the LLM should not: place, validate, log, query. The LLM decides
# *what* (composes node blocks, writes prose); this script enforces *how*
# (placement, validation, logging, search). See docs/data-layer.md for the design.
#
# Commands:
#   validate <journey>                 well-formed + field names ∈ schema
#   commit   <journey> <op> [args]     block-level node CRUD → place + validate + log
#   query    '<filter>'                structured filters across the dataset
#   search   <text>                    free-text search with step context
#   audit    [filters]                 read the changelogs (who / what / when)
#   help                               this message
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Paths & config
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

# The shared dataset. Override with JOURNEY_DIR for tests / shared storage.
JOURNEY_DIR="${JOURNEY_DIR:-./.journey}"

# The schema the validator derives its field vocabulary from. Shipped beside the
# script under references/; override with JOURNEY_SCHEMA.
JOURNEY_SCHEMA="${JOURNEY_SCHEMA:-$SCRIPT_DIR/../references/journey.schema.md}"

# Cache dir for the extracted field list (keyed on schema mtime).
CACHE_DIR="${TMPDIR:-/tmp}/journey-sh-cache"

die() { printf 'journey.sh: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Resolve a journey name (with or without .md) to a file path under JOURNEY_DIR.
_journey_file() {
  local name="$1" f
  name="${name%.md}"
  f="$JOURNEY_DIR/$name.md"
  [ -f "$f" ] || die "no such journey: $name ($f)"
  printf '%s' "$f"
}

# The author for a changelog entry: --author flag, else git, else $USER.
_default_author() {
  local a
  a="$(git config user.name 2>/dev/null || true)"
  [ -n "$a" ] && { printf '%s' "$a"; return; }
  printf '%s' "${USER:-unknown}"
}

_now_utc() { date -u +%Y-%m-%dT%H:%M:%SZ; }
_today_utc() { date -u +%Y-%m-%d; }

# Extract the field vocabulary from the schema (cached on mtime). A field name is
# any first-column table cell wrapped entirely in backticks, not ending in `_`
# (those are custom-field namespace prefixes, not fields).
_field_list() {
  [ -f "$JOURNEY_SCHEMA" ] || die "schema not found: $JOURNEY_SCHEMA"
  local mtime cache
  # portable mtime: try BSD stat then GNU stat
  mtime="$(stat -f %m "$JOURNEY_SCHEMA" 2>/dev/null || stat -c %Y "$JOURNEY_SCHEMA" 2>/dev/null || echo 0)"
  cache="$CACHE_DIR/fields-$mtime.txt"
  if [ ! -f "$cache" ]; then
    mkdir -p "$CACHE_DIR"
    awk -F'|' '
      /^\|/ {
        c=$2; gsub(/^[ \t]+|[ \t]+$/,"",c)
        if (c ~ /^`[^`]+`$/) { name=c; gsub(/`/,"",name); if (name !~ /_$/) print name }
      }' "$JOURNEY_SCHEMA" | sort -u > "$cache"
  fi
  printf '%s' "$cache"
}

# ---------------------------------------------------------------------------
# validate
# ---------------------------------------------------------------------------
# Structural validity + field-name vocabulary + provenance notation + id rules +
# cross-ref integrity. Exit 0 = OK, 1 = errors found.
cmd_validate() {
  [ $# -ge 1 ] || die "usage: journey.sh validate <journey>"
  local f fields
  f="$(_journey_file "$1")"
  fields="$(_field_list)"

  awk -v FNAME="$1" '
    NR==FNR { if ($0!="") vocab[$0]=1; next }

    function add(l,m){ NE++; EL[NE]=l; EM[NE]=m }
    function flush(){
      if (ctx=="milestone") {
        if (!hT) add(bl,"milestone \"" cid "\": missing required field: title")
        if (!hD) add(bl,"milestone \"" cid "\": missing required field: description")
      } else if (ctx=="step") {
        if (!hP) add(bl,"step \"" cid "\": missing required field: persona")
        if (!hD) add(bl,"step \"" cid "\": missing required field: description")
      }
    }

    {
      # --- preamble fence tracking ---
      if ($0=="---") {
        fc++
        if (fc==2) {
          if (!p_j) add(1,"preamble missing required key: journey")
          if (!p_c) add(1,"preamble missing required key: created")
          if (!p_l) add(1,"preamble missing required key: last-modified")
          if (!p_p) add(1,"preamble missing required key: personas")
          ctx=""
        }
        next
      }
      if (fc<2) {
        if ($0 ~ /^journey:/)       p_j=1
        if ($0 ~ /^created:/)       p_c=1
        if ($0 ~ /^last-modified:/) p_l=1
        if ($0 ~ /^personas:/)      p_p=1
        next
      }

      # --- milestone header ---
      if ($0 ~ /^## Milestone:/) {
        flush()
        ctx="milestone"; bl=FNR; hT=0; hD=0
        id=$0; sub(/^## Milestone:[ \t]*/,"",id); gsub(/[ \t]+$/,"",id); cid=id
        if (id !~ /^[a-z0-9]+(-[a-z0-9]+)*$/) add(FNR,"milestone id not kebab-case: \"" id "\"")
        if (id in mseen) add(FNR,"duplicate milestone id: \"" id "\""); mseen[id]=1
        next
      }
      # --- step header ---
      if ($0 ~ /^### Step:/) {
        flush()
        ctx="step"; bl=FNR; hP=0; hD=0
        id=$0; sub(/^### Step:[ \t]*/,"",id); gsub(/[ \t]+$/,"",id); cid=id
        if (id !~ /^[a-z0-9]+(-[a-z0-9]+)*$/) add(FNR,"step id not kebab-case: \"" id "\"")
        if (id in sseen) add(FNR,"duplicate step id: \"" id "\""); sseen[id]=1
        next
      }

      # --- provenance notation (any indentation) ---
      if ($0 ~ /_provenance:/) {
        pv=$0; sub(/^.*_provenance:[ \t]*/,"",pv); gsub(/[ \t]+$/,"",pv)
        if (pv ~ /^user-modified, [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/) {}
        else if (pv ~ /^source:[ \t]*.+/) {}
        else if (pv ~ /^auto-composite$/) {}
        else add(FNR,"malformed _provenance: \"" pv "\"")
        next
      }

      # --- top-level field line within a milestone/step ---
      if ($0 ~ /^- [a-zA-Z][a-zA-Z0-9_-]*:/) {
        fname=$0; sub(/^- /,"",fname); sub(/:.*/,"",fname)
        if (ctx=="milestone") {
          if (fname=="title") hT=1
          if (fname=="description") hD=1
        } else if (ctx=="step") {
          if (fname=="persona") hP=1
          if (fname=="description") hD=1
          if (fname !~ /_/ && !(fname in vocab))
            add(FNR,"unknown field (not in schema): \"" fname "\"")
        }
      }

      # --- collect cross-references (→ step-id) ---
      if (index($0,"→")>0) {
        n=split($0,P,"→")
        for (i=2;i<=n;i++) {
          t=P[i]; sub(/^[ \t]+/,"",t)
          if (match(t,/^[a-z0-9][a-z0-9-]*/)) {
            NR2++; RT[NR2]=substr(t,1,RLENGTH); RL[NR2]=FNR
          }
        }
      }
    }

    END {
      flush()
      for (i=1;i<=NR2;i++) if (!(RT[i] in sseen)) add(RL[i],"dangling cross-ref: → " RT[i] " (no such step)")
      ns=0; for (k in sseen) ns++
      nm=0; for (k in mseen) nm++
      if (NE==0) { printf "OK: %s (%d steps, %d milestones)\n", FNAME, ns, nm; exit 0 }
      # print errors in line order
      for (i=1;i<=NE;i++) {
        # simple insertion sort by line for readability
        for (j=i+1;j<=NE;j++) if (EL[j]<EL[i]) { tl=EL[i];EL[i]=EL[j];EL[j]=tl; tm=EM[i];EM[i]=EM[j];EM[j]=tm }
      }
      for (i=1;i<=NE;i++) printf "ERROR %s:%d: %s\n", FNAME, EL[i], EM[i]
      printf "FAILED: %d error(s)\n", NE
      exit 1
    }
  ' "$fields" "$f"
}

# ---------------------------------------------------------------------------
# commit — block-level node CRUD (the write path)
# ---------------------------------------------------------------------------
# Collapse runs of 3+ blank lines to a single blank line.
_tidy() {
  awk 'NF==0{blank++; if(blank<=1)print; next} {blank=0; print}' "$1"
}

# Carry provenance forward on replace: for each top-level field in the OLD block
# that carried a _provenance line, if the NEW block has the identical field line
# (value unchanged) and no provenance of its own, re-attach the old provenance.
# (Phase 1: top-level fields only; nested provenance is left to the LLM.)
_preserve_provenance() {
  local oldb="$1" newb="$2"
  awk '
    NR==FNR {
      if ($0 ~ /^- [a-zA-Z]/) { lastline=$0; have=1 }
      else if (have && $0 ~ /^[ ]+- _provenance:/) { prov[lastline]=$0; have=0 }
      else have=0
      next
    }
    { A[++N]=$0 }
    END {
      for (i=1;i<=N;i++) {
        print A[i]
        if (A[i] in prov) {
          nxt = (i<N)?A[i+1]:""
          if (nxt !~ /_provenance:/) print prov[A[i]]
        }
      }
    }
  ' "$oldb" "$newb"
}

# Atomic write + validate + changelog. Args: journey-name file op target note tmpfile
_finalize() {
  local name="$1" f="$2" op="$3" target="$4" note="$5" tmp="$6" author="$7"
  # stamp last-modified
  awk -v d="$(_today_utc)" '
    BEGIN{fc=0}
    /^---$/{fc++}
    fc<2 && /^last-modified:/ { print "last-modified: " d; next }
    { print }
  ' "$tmp" > "$tmp.stamp" && mv "$tmp.stamp" "$tmp"

  # validate the candidate before it touches the real file
  if ! JOURNEY_DIR="$(dirname "$f")" cmd_validate_file "$tmp" >/tmp/journey-validate.$$ 2>&1; then
    cat /tmp/journey-validate.$$ >&2
    rm -f "$tmp" /tmp/journey-validate.$$
    die "commit rejected: result would be invalid (no changes written)"
  fi
  rm -f /tmp/journey-validate.$$
  _tidy "$tmp" > "$tmp.tidy" && mv "$tmp.tidy" "$tmp"
  mv "$tmp" "$f"

  # changelog: per-journey sidecar TSV
  local log="$JOURNEY_DIR/$name.log"
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(_now_utc)" "$author" "$name" "$op" "$target" "$note" >> "$log"
  printf 'committed %s %s on %s — logged to %s\n' "$op" "$target" "$name" "$log"
}

# Validate an arbitrary file path (used for the pre-write candidate check).
cmd_validate_file() {
  local f="$1" fields
  fields="$(_field_list)"
  awk -v FNAME="$f" '
    NR==FNR { if ($0!="") vocab[$0]=1; next }
    function add(l,m){ NE++; EL[NE]=l; EM[NE]=m }
    function flush(){
      if (ctx=="milestone") { if(!hT) add(bl,"milestone \"" cid "\": missing title"); if(!hD) add(bl,"milestone \"" cid "\": missing description") }
      else if (ctx=="step") { if(!hP) add(bl,"step \"" cid "\": missing persona"); if(!hD) add(bl,"step \"" cid "\": missing description") }
    }
    {
      if ($0=="---") { fc++; if(fc==2){ if(!p_j)add(1,"missing journey"); if(!p_c)add(1,"missing created"); if(!p_l)add(1,"missing last-modified"); if(!p_p)add(1,"missing personas"); ctx="" } next }
      if (fc<2) { if($0~/^journey:/)p_j=1; if($0~/^created:/)p_c=1; if($0~/^last-modified:/)p_l=1; if($0~/^personas:/)p_p=1; next }
      if ($0 ~ /^## Milestone:/) { flush(); ctx="milestone"; bl=FNR; hT=0;hD=0; id=$0;sub(/^## Milestone:[ \t]*/,"",id);gsub(/[ \t]+$/,"",id);cid=id
        if(id!~/^[a-z0-9]+(-[a-z0-9]+)*$/)add(FNR,"milestone id not kebab: \"" id "\""); if(id in mseen)add(FNR,"dup milestone id: \"" id "\""); mseen[id]=1; next }
      if ($0 ~ /^### Step:/) { flush(); ctx="step"; bl=FNR; hP=0;hD=0; id=$0;sub(/^### Step:[ \t]*/,"",id);gsub(/[ \t]+$/,"",id);cid=id
        if(id!~/^[a-z0-9]+(-[a-z0-9]+)*$/)add(FNR,"step id not kebab: \"" id "\""); if(id in sseen)add(FNR,"dup step id: \"" id "\""); sseen[id]=1; next }
      if ($0 ~ /_provenance:/) { pv=$0;sub(/^.*_provenance:[ \t]*/,"",pv);gsub(/[ \t]+$/,"",pv)
        if(pv~/^user-modified, [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/){} else if(pv~/^source:[ \t]*.+/){} else if(pv~/^auto-composite$/){} else add(FNR,"malformed _provenance: \"" pv "\""); next }
      if ($0 ~ /^- [a-zA-Z][a-zA-Z0-9_-]*:/) { fname=$0;sub(/^- /,"",fname);sub(/:.*/,"",fname)
        if(ctx=="milestone"){ if(fname=="title")hT=1; if(fname=="description")hD=1 }
        else if(ctx=="step"){ if(fname=="persona")hP=1; if(fname=="description")hD=1; if(fname!~/_/ && !(fname in vocab))add(FNR,"unknown field: \"" fname "\"") } }
      if (index($0,"→")>0){ n=split($0,P,"→"); for(i=2;i<=n;i++){ t=P[i];sub(/^[ \t]+/,"",t); if(match(t,/^[a-z0-9][a-z0-9-]*/)){ NR2++;RT[NR2]=substr(t,1,RLENGTH);RL[NR2]=FNR } } }
    }
    END {
      flush()
      for(i=1;i<=NR2;i++) if(!(RT[i] in sseen)) add(RL[i],"dangling cross-ref: → " RT[i])
      if(NE==0){ exit 0 }
      for(i=1;i<=NE;i++) printf "ERROR %s:%d: %s\n", FNAME, EL[i], EM[i]
      exit 1
    }
  ' "$fields" "$f"
}

cmd_commit() {
  [ $# -ge 2 ] || die "usage: journey.sh commit <journey> <op> [args]   (op: insert-step|replace-step|remove-step|insert-milestone|remove-milestone)"
  local name="$1" op="$2"; shift 2
  local f; f="$(_journey_file "$name")"

  local anchor="" pos="" target="" note="" author="" blockfile=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --after)      pos="after"; anchor="$2"; shift 2;;
      --before)     pos="before"; anchor="$2"; shift 2;;
      --block-file) blockfile="$2"; shift 2;;
      --note)       note="$2"; shift 2;;
      --author)     author="$2"; shift 2;;
      --*)          die "unknown flag: $1";;
      *)            target="$1"; shift;;   # positional id (for replace/remove)
    esac
  done
  [ -n "$author" ] || author="$(_default_author)"

  # block content (insert/replace) from --block-file or stdin
  local blk=""
  case "$op" in
    insert-*|replace-*)
      blk="$(mktemp)"
      if [ -n "$blockfile" ]; then cp "$blockfile" "$blk"; else cat > "$blk"; fi
      # strip trailing blank lines from the supplied block
      awk 'NF{last=NR} {L[NR]=$0} END{for(i=1;i<=last;i++)print L[i]}' "$blk" > "$blk.t" && mv "$blk.t" "$blk"
      [ -s "$blk" ] || die "empty block (provide via --block-file or stdin)"
      ;;
  esac

  local tmp; tmp="$(mktemp)"

  case "$op" in
    insert-step)
      [ -n "$anchor" ] || die "insert-step requires --after <id> or --before <id>"
      target="$anchor"
      awk -v id="$anchor" -v pos="$pos" -v bf="$blk" '
        BEGIN{ while((getline l<bf)>0) B[++nb]=l }
        function emit(){ print ""; for(i=1;i<=nb;i++) print B[i] }
        pos=="before" && $0 ~ ("^### Step: " id "$") && !done { for(i=1;i<=nb;i++)print B[i]; print ""; done=1; print; seen=1; next }
        $0 ~ ("^### Step: " id "$") { seen=1; found=1; print; next }
        seen==1 && ($0 ~ /^### Step:/ || $0 ~ /^## Milestone:/ || $0=="---") && pos=="after" { emit(); seen=2; print; next }
        $0 ~ ("^### Step: " id "$") { found=1 }
        { print }
        END{ if(pos=="after" && seen==1){ emit() }
             if(!found && pos=="before" && !done){ exit 3 }
             if(!found && pos=="after" && seen==0){ exit 3 } }
      ' "$f" > "$tmp" || { rm -f "$tmp" "$blk"; die "insert-step: anchor step not found: $anchor"; }
      # mark found for before-case
      grep -qE "^### Step: $anchor$" "$f" || { rm -f "$tmp" "$blk"; die "insert-step: anchor step not found: $anchor"; }
      [ -z "$note" ] && note="inserted step $pos $anchor"
      ;;

    replace-step)
      [ -n "$target" ] || die "replace-step requires a step id"
      grep -qE "^### Step: $target$" "$f" || { rm -f "$tmp" "$blk"; die "replace-step: step not found: $target"; }
      # extract old block for provenance preservation
      local oldb; oldb="$(mktemp)"
      awk -v id="$target" '
        $0 ~ ("^### Step: " id "$") { grab=1 }
        grab==1 && NR>1 && ($0 ~ /^### Step:/ || $0 ~ /^## Milestone:/ || $0=="---") && !(($0 ~ ("^### Step: " id "$"))) { if(started)exit }
        grab==1 { if(started && ($0 ~ /^### Step:/ && $0 !~ ("^### Step: " id "$"))) exit; print; started=1 }
      ' "$f" > "$oldb"
      _preserve_provenance "$oldb" "$blk" > "$blk.merged" && mv "$blk.merged" "$blk"
      rm -f "$oldb"
      awk -v id="$target" -v bf="$blk" '
        BEGIN{ while((getline l<bf)>0) B[++nb]=l }
        skip==1 { if($0 ~ /^### Step:/ || $0 ~ /^## Milestone:/ || $0=="---"){skip=0} else next }
        $0 ~ ("^### Step: " id "$") { for(i=1;i<=nb;i++)print B[i]; print ""; skip=1; found=1; next }
        { print }
        END{ if(!found) exit 3 }
      ' "$f" > "$tmp" || { rm -f "$tmp" "$blk"; die "replace-step: step not found: $target"; }
      [ -z "$note" ] && note="replaced step $target"
      ;;

    remove-step)
      [ -n "$target" ] || die "remove-step requires a step id"
      grep -qE "^### Step: $target$" "$f" || { rm -f "$tmp" "$blk"; die "remove-step: step not found: $target"; }
      awk -v id="$target" '
        skip==1 { if($0 ~ /^### Step:/ || $0 ~ /^## Milestone:/ || $0=="---"){skip=0} else next }
        $0 ~ ("^### Step: " id "$") { skip=1; found=1; next }
        { print }
        END{ if(!found) exit 3 }
      ' "$f" > "$tmp" || { rm -f "$tmp"; die "remove-step: step not found: $target"; }
      [ -z "$note" ] && note="removed step $target"
      ;;

    insert-milestone)
      [ -n "$anchor" ] || die "insert-milestone requires --after <id> or --before <id>"
      target="$anchor"
      awk -v id="$anchor" -v pos="$pos" -v bf="$blk" '
        BEGIN{ while((getline l<bf)>0) B[++nb]=l }
        function emit(){ print ""; print "---"; print ""; for(i=1;i<=nb;i++) print B[i] }
        pos=="before" && $0 ~ ("^## Milestone: " id "$") && !done { for(i=1;i<=nb;i++)print B[i]; print ""; print "---"; print ""; done=1; found=1; print; next }
        $0 ~ ("^## Milestone: " id "$") { seen=1; found=1; print; next }
        seen==1 && $0 ~ /^## Milestone:/ && pos=="after" { emit(); seen=2; print; next }
        { print }
        END{ if(pos=="after" && seen==1) emit(); if(!found) exit 3 }
      ' "$f" > "$tmp" || { rm -f "$tmp" "$blk"; die "insert-milestone: anchor not found: $anchor"; }
      [ -z "$note" ] && note="inserted milestone $pos $anchor"
      ;;

    remove-milestone)
      [ -n "$target" ] || die "remove-milestone requires a milestone id"
      grep -qE "^## Milestone: $target$" "$f" || { rm -f "$tmp"; die "remove-milestone: not found: $target"; }
      awk -v id="$target" '
        skip==1 { if($0 ~ /^## Milestone:/){skip=0} else next }
        $0 ~ ("^## Milestone: " id "$") { skip=1; found=1; next }
        { print }
        END{ if(!found) exit 3 }
      ' "$f" > "$tmp" || { rm -f "$tmp"; die "remove-milestone: not found: $target"; }
      [ -z "$note" ] && note="removed milestone $target"
      ;;

    *) rm -f "$tmp" "$blk" 2>/dev/null || true; die "unknown op: $op";;
  esac

  [ -n "${blk:-}" ] && rm -f "$blk" 2>/dev/null || true
  _finalize "$name" "$f" "$op" "$target" "$note" "$tmp" "$author"
}

# ---------------------------------------------------------------------------
# search — free text across the dataset, with step context
# ---------------------------------------------------------------------------
cmd_search() {
  [ $# -ge 1 ] || die "usage: journey.sh search <text>"
  local pat="$1" any=0
  shopt -s nullglob
  for f in "$JOURNEY_DIR"/*.md; do
    any=1
    awk -v J="$(basename "${f%.md}")" -v pat="$pat" '
      /^## Milestone:/ { m=$0; sub(/^## Milestone:[ \t]*/,"",m) }
      /^### Step:/     { s=$0; sub(/^### Step:[ \t]*/,"",s) }
      index(tolower($0),tolower(pat))>0 && $0 !~ /^### Step:/ {
        printf "%s\t%s\t%s\t%s\n", J, (s==""?"-":s), FNR, $0
      }
    ' "$f"
  done
  [ "$any" = 1 ] || die "no journeys found in $JOURNEY_DIR"
}

# ---------------------------------------------------------------------------
# query — structured filters across the dataset
# ---------------------------------------------------------------------------
# Filters:
#   failure-no-recovery   steps with failureMode but no recoveryPath
#   moment-no-evidence    steps with momentOfTruth but no source/metric/evidence
#   user-modified         steps carrying any user-modified provenance
#   persona:<name>        steps whose persona array includes <name>
#   field:<name>          steps that have field <name>
#   missing:<name>        steps that lack field <name>
cmd_query() {
  [ $# -ge 1 ] || die "usage: journey.sh query '<filter>'   (failure-no-recovery|moment-no-evidence|user-modified|persona:X|field:X|missing:X)"
  local filter="$1" mode arg
  case "$filter" in
    persona:*) mode="persona"; arg="${filter#persona:}";;
    field:*)   mode="field";   arg="${filter#field:}";;
    missing:*) mode="missing"; arg="${filter#missing:}";;
    *)         mode="$filter"; arg="";;
  esac

  shopt -s nullglob
  local any=0
  for f in "$JOURNEY_DIR"/*.md; do
    any=1
    awk -v J="$(basename "${f%.md}")" -v mode="$mode" -v arg="$arg" '
      function flush(){
        if (sid=="") return
        hit=0; why=""
        if (mode=="failure-no-recovery")      { if (f_failure && !f_recovery){hit=1; why="failureMode without recoveryPath"} }
        else if (mode=="moment-no-evidence")  { if (f_moment && !f_evidence){hit=1; why="momentOfTruth without source/metric"} }
        else if (mode=="user-modified")       { if (f_usermod){hit=1; why="has user-modified field(s)"} }
        else if (mode=="field")               { if (f_has){hit=1; why="has " arg} }
        else if (mode=="missing")             { if (!f_has){hit=1; why="missing " arg} }
        else if (mode=="persona")             { if (f_persona){hit=1; why="persona includes " arg} }
        if (hit) printf "%s\t%s\t%s\n", J, sid, why
      }
      /^### Step:/ {
        flush()
        sid=$0; sub(/^### Step:[ \t]*/,"",sid); gsub(/[ \t]+$/,"",sid)
        f_failure=f_recovery=f_moment=f_evidence=f_usermod=f_has=f_persona=0
        next
      }
      /^## Milestone:/ { flush(); sid=""; next }
      sid!="" {
        if ($0 ~ /^- failureMode:/)   f_failure=1
        if ($0 ~ /^- recoveryPath:/)  f_recovery=1
        if ($0 ~ /^- momentOfTruth:/) f_moment=1
        if ($0 ~ /_provenance:[ \t]*source:/ || $0 ~ /^- metric:/ || $0 ~ /^- kpi:/ || $0 ~ /^- dropoffRate:/) f_evidence=1
        if ($0 ~ /_provenance:[ \t]*user-modified/) f_usermod=1
        if (mode=="field"   && $0 ~ ("^- " arg ":")) f_has=1
        if (mode=="missing" && $0 ~ ("^- " arg ":")) f_has=1
        if (mode=="persona" && $0 ~ /^- persona:/ && index($0,arg)>0) f_persona=1
      }
      END{ flush() }
    ' "$f"
  done
  [ "$any" = 1 ] || die "no journeys found in $JOURNEY_DIR"
}

# ---------------------------------------------------------------------------
# audit — read the changelogs (who / what / when)
# ---------------------------------------------------------------------------
cmd_audit() {
  local journey="" since="" author="" target=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --journey) journey="$2"; shift 2;;
      --since)   since="$2"; shift 2;;
      --author)  author="$2"; shift 2;;
      --target)  target="$2"; shift 2;;
      *) die "audit: unknown arg: $1";;
    esac
  done
  shopt -s nullglob
  local logs=()
  if [ -n "$journey" ]; then
    [ -f "$JOURNEY_DIR/$journey.log" ] && logs=("$JOURNEY_DIR/$journey.log")
  else
    logs=("$JOURNEY_DIR"/*.log)
  fi
  [ ${#logs[@]} -gt 0 ] || { printf '(no changelog entries)\n'; return 0; }
  awk -F'\t' -v since="$since" -v author="$author" -v target="$target" '
    { if (since!="" && $1<since) next
      if (author!="" && $2!=author) next
      if (target!="" && $5!=target) next
      print }
  ' "${logs[@]}" | sort
}

# ---------------------------------------------------------------------------
# usage / dispatch
# ---------------------------------------------------------------------------
usage() {
  cat <<'EOF'
journey.sh — deterministic toolbelt for the Journey Skill

USAGE
  journey.sh validate <journey>
  journey.sh commit   <journey> <op> [args]
  journey.sh query    '<filter>'
  journey.sh search   <text>
  journey.sh audit    [--journey X] [--since DATE] [--author A] [--target T]

COMMIT OPS
  insert-step      --after <id> | --before <id>   (block from --block-file or stdin)
  replace-step     <id>                            (block from --block-file or stdin)
  remove-step      <id>
  insert-milestone --after <id> | --before <id>    (block from --block-file or stdin)
  remove-milestone <id>
  common flags: --note <text>  --author <name>

QUERY FILTERS
  failure-no-recovery   moment-no-evidence   user-modified
  persona:<name>        field:<name>         missing:<name>

ENV
  JOURNEY_DIR     dataset dir (default ./.journey)
  JOURNEY_SCHEMA  schema file (default <script>/../references/journey.schema.md)
EOF
}

main() {
  [ $# -ge 1 ] || { usage; exit 2; }
  local cmd="$1"; shift
  case "$cmd" in
    validate) cmd_validate "$@";;
    commit)   cmd_commit "$@";;
    query)    cmd_query "$@";;
    search)   cmd_search "$@";;
    audit)    cmd_audit "$@";;
    help|-h|--help) usage;;
    *) die "unknown command: $cmd (try: journey.sh help)";;
  esac
}

main "$@"
