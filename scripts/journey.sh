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

# Where the per-user saved author lives. MUST be per-machine (home config), never
# inside the shared ./.journey/ dataset — otherwise shared data would collide on a
# single author and attribution would be wrong. Override with JOURNEY_AUTHOR_FILE.
_author_file() {
  printf '%s' "${JOURNEY_AUTHOR_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/journey-skill/author}"
}

# Resolve author + its source. Precedence: saved config > git > OS-user fallback.
# (An explicit --author flag overrides all of this, handled at the call site.)
# Prints "<name>\t<source>".
_resolve_author() {
  local cf saved g
  cf="$(_author_file)"
  if [ -f "$cf" ]; then
    saved="$(awk 'NF{print; exit}' "$cf")"
    [ -n "$saved" ] && { printf '%s\tsaved' "$saved"; return; }
  fi
  g="$(git config user.name 2>/dev/null || true)"
  [ -n "$g" ] && { printf '%s\tgit' "$g"; return; }
  printf '%s\tfallback' "${USER:-unknown}"
}
_default_author() { _resolve_author | cut -f1; }

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
# Validate a journey file. Args: <file> <display-name> <quiet:0|1>.
# Structural validity + field-name vocabulary (+ registered custom fields) +
# provenance notation + id rules + cross-ref integrity.
# Exit 0 = OK (prints summary unless quiet), 1 = errors (always printed).
_validate_path() {
  local f="$1" disp="$2" quiet="$3" fields
  fields="$(_field_list)"
  awk -v FNAME="$disp" -v quiet="$quiet" '
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
          ctx=""; incf=0
        }
        next
      }
      if (fc<2) {
        # collect registered custom fields from the custom-fields: block
        if ($0 ~ /^custom-fields:/) { incf=1; next }
        if (incf) {
          if ($0 ~ /^[ \t]+-/) { cn=$0; sub(/^[ \t]+-[ \t]*/,"",cn); sub(/:.*/,"",cn); gsub(/[ \t]/,"",cn); if (cn!="") reg[cn]=1; next }
          else incf=0
        }
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
          if (!(fname in vocab)) {
            if (fname ~ /_/) {
              if (!(fname in reg))
                add(FNR,"custom field not registered in preamble: \"" fname "\" — run: journey.sh commit <journey> register-field " fname " \"<description>\"")
            } else {
              add(FNR,"unknown field (not in schema): \"" fname "\" — if user-confirmed, register it as a custom field with a namespace prefix (e.g. team_" fname ") via register-field")
            }
          }
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
      if (NE==0) { if (!quiet) printf "OK: %s (%d steps, %d milestones)\n", FNAME, ns, nm; exit 0 }
      for (i=1;i<=NE;i++)
        for (j=i+1;j<=NE;j++) if (EL[j]<EL[i]) { tl=EL[i];EL[i]=EL[j];EL[j]=tl; tm=EM[i];EM[i]=EM[j];EM[j]=tm }
      for (i=1;i<=NE;i++) printf "ERROR %s:%d: %s\n", FNAME, EL[i], EM[i]
      if (!quiet) printf "FAILED: %d error(s)\n", NE
      exit 1
    }
  ' "$fields" "$f"
}

cmd_validate() {
  [ $# -ge 1 ] || die "usage: journey.sh validate <journey>"
  local f; f="$(_journey_file "$1")"
  _validate_path "$f" "$1" 0
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
  if ! _validate_path "$tmp" "$name" 1 >/tmp/journey-validate.$$ 2>&1; then
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

cmd_commit() {
  [ $# -ge 2 ] || die "usage: journey.sh commit <journey> <op> [args]   (op: insert-step|replace-step|remove-step|insert-milestone|remove-milestone)"
  local name="$1" op="$2"; shift 2
  local f; f="$(_journey_file "$name")"

  local anchor="" pos="" target="" note="" author="" blockfile=""
  local -a pos_args=()
  while [ $# -gt 0 ]; do
    case "$1" in
      --after)      pos="after"; anchor="$2"; shift 2;;
      --before)     pos="before"; anchor="$2"; shift 2;;
      --block-file) blockfile="$2"; shift 2;;
      --note)       note="$2"; shift 2;;
      --author)     author="$2"; shift 2;;
      --*)          die "unknown flag: $1";;
      *)            pos_args+=("$1"); shift;;   # positionals (id; field+desc for register-field)
    esac
  done
  [ ${#pos_args[@]} -gt 0 ] && target="${pos_args[0]}"
  [ -n "$author" ] || author="$(_default_author)"

  # block content (insert/replace) from --block-file or stdin
  local blk=""
  case "$op" in
    insert-step|replace-step|insert-milestone)
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

    register-field)
      local field="${pos_args[0]:-}" desc="${pos_args[1]:-}"
      [ -n "$field" ] || die "register-field requires: <field_name> \"<description>\""
      [ -n "$desc" ]  || die "register-field requires a description: register-field $field \"<description>\""
      target="$field"
      case "$field" in
        *_*) ;;
        *) printf 'journey.sh: warning: custom field "%s" has no namespace prefix (team_/vertical_/experiment_); registering as-is (suggested, not enforced).\n' "$field" >&2;;
      esac
      # idempotency: already in the preamble custom-fields block?
      if awk -v ff="$field" 'BEGIN{fc=0} /^---$/{fc++} fc==1 && $0 ~ ("^[ \t]*-[ \t]*" ff ":") {print "Y"; exit}' "$f" | grep -q Y; then
        rm -f "$tmp"; die "custom field already registered: $field"
      fi
      awk -v field="$field" -v desc="$desc" '
        BEGIN{ fc=0; inserted=0; has_cf=0; in_cf=0 }
        function newline(){ return "  - " field ": \"" desc "\"" }
        /^---$/ {
          fc++
          if (fc==2 && !inserted) {
            if (!has_cf) { print "custom-fields:"; print newline() }
            else if (in_cf) { print newline() }
            inserted=1
          }
          print; next
        }
        fc==1 {
          if ($0 ~ /^custom-fields:[ \t]*$/) { has_cf=1; in_cf=1; print; next }
          if (in_cf) {
            if ($0 ~ /^[ \t]+-/) { print; next }
            else { if (!inserted) { print newline(); inserted=1 } in_cf=0; print; next }
          }
          print; next
        }
        { print }
      ' "$f" > "$tmp"
      [ -z "$note" ] && note="registered custom field $field"
      ;;

    *) rm -f "$tmp" "$blk" 2>/dev/null || true; die "unknown op: $op";;
  esac

  [ -n "${blk:-}" ] && rm -f "$blk" 2>/dev/null || true
  _finalize "$name" "$f" "$op" "$target" "$note" "$tmp" "$author"
}

# ---------------------------------------------------------------------------
# new — create a journey file (the create path; commit edits an existing one)
# ---------------------------------------------------------------------------
# The LLM composes the full initial journey (preamble + milestones + steps); the
# script validates it, writes it, and logs a `create` entry. Refuses to clobber an
# existing journey — use `commit` to edit that.
cmd_new() {
  [ $# -ge 1 ] || die "usage: journey.sh new <name>   (full journey markdown via --block-file or stdin)"
  local name="$1"; shift
  local note="" author="" blockfile=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --block-file) blockfile="$2"; shift 2;;
      --note)       note="$2"; shift 2;;
      --author)     author="$2"; shift 2;;
      --*)          die "unknown flag: $1";;
      *)            die "unexpected arg: $1";;
    esac
  done
  [ -n "$author" ] || author="$(_default_author)"
  name="${name%.md}"
  local f="$JOURNEY_DIR/$name.md"
  [ -f "$f" ] && die "journey already exists: $name (use 'commit' to edit it)"
  mkdir -p "$JOURNEY_DIR"
  local tmp; tmp="$(mktemp)"
  if [ -n "$blockfile" ]; then cp "$blockfile" "$tmp"; else cat > "$tmp"; fi
  [ -s "$tmp" ] || { rm -f "$tmp"; die "empty journey content (provide via --block-file or stdin)"; }
  [ -z "$note" ] && note="created journey"
  _finalize "$name" "$f" "create" "$name" "$note" "$tmp" "$author"
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
# whoami / set-author — change attribution identity
# ---------------------------------------------------------------------------
cmd_whoami() {
  local line name src
  line="$(_resolve_author)"
  name="$(printf '%s' "$line" | cut -f1)"
  src="$(printf '%s' "$line" | cut -f2)"
  printf 'author: %s\nsource: %s\n' "$name" "$src"
  if [ "$src" = fallback ]; then
    printf 'note: no git user.name and no saved author — using the OS username as a guess.\n'
    printf '      ask the user what name/team to attribute changes to, then run:\n'
    printf '        journey.sh set-author "<name>"\n'
  fi
}

cmd_set_author() {
  [ $# -ge 1 ] || die "usage: journey.sh set-author <name>"
  local name="$1" cf dir
  cf="$(_author_file)"; dir="$(dirname "$cf")"
  mkdir -p "$dir"
  printf '%s\n' "$name" > "$cf"
  printf 'saved author: %s → %s\n' "$name" "$cf"
}

# ---------------------------------------------------------------------------
# usage / dispatch
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# theme — the token layer inside a rendering
# ---------------------------------------------------------------------------

THEME_DIR="${JOURNEY_THEME:-$SCRIPT_DIR/../assets/theme}"

# A rendering must be self-contained (one file, works offline, survives being
# emailed), so the token layer is inlined rather than linked. Two marked regions
# carry it: tokens = the shipped three-tier system, theme = this artifact's own
# Tier-1 seeds. Everything between the markers is generated; everything outside
# is the author's.
_TOK_BEGIN='/* tokens:begin */'
_TOK_END='/* tokens:end */'
_THM_BEGIN='/* theme:begin */'
_THM_END='/* theme:end */'

# Light or dark? Read it off the surface colour instead of asking, because the
# answer decides a specificity fight the author cannot see: the token file's dark
# blocks are selected by :root:not([data-theme="light"]), which out-specifies a
# bare :root override. Seed a dark surface without pinning dark and the theme
# silently does nothing for half the readers.
_theme_mode_for_surface() {
  local c="$1"
  case "$c" in
    oklch\(*)                                  # oklch(15% ...) — L is the first number
      awk -v s="$c" 'BEGIN{ sub(/^[^(]*\(/,"",s); l=s+0; print (l<50)?"dark":"light" }' ;;
    \#*)                                       # hex — perceived luminance.
      # Hand-rolled hex parsing: strtonum() is a gawk extension and this script
      # has to run under the awk that ships with macOS.
      awk -v s="$c" 'function hx(p,   i,n,d){ n=0
          for(i=1;i<=length(p);i++){ d=index("0123456789abcdef",substr(p,i,1))-1
            if(d<0) d=0; n=n*16+d }
          return n }
        BEGIN{
          gsub(/#/,"",s); s=tolower(s)
          if (length(s)==3) s=substr(s,1,1) substr(s,1,1) substr(s,2,1) substr(s,2,1) substr(s,3,1) substr(s,3,1)
          r=hx(substr(s,1,2)); g=hx(substr(s,3,2)); b=hx(substr(s,5,2))
          print (0.2126*r + 0.7152*g + 0.0722*b < 128) ? "dark" : "light" }' ;;
    *) printf 'light' ;;
  esac
}

# Replace a marked region in place. Creates the region after <style> if absent.
_theme_write_region() {
  local file="$1" begin="$2" end="$3" body="$4" tmp
  tmp="$(mktemp)"
  BEGIN="$begin" END="$end" BODY="$body" awk '
    BEGIN { b=ENVIRON["BEGIN"]; e=ENVIRON["END"]; body=ENVIRON["BODY"]; done=0; skip=0 }
    index($0,b) { print b; if (body!="") print body; print e; skip=1; done=1; next }
    skip && index($0,e) { skip=0; next }
    skip { next }
    { print }
    END { if (!done) exit 3 }
  ' "$file" > "$tmp" || { rm -f "$tmp"; return 3; }
  mv "$tmp" "$file"
}

# Insert both regions into the first <style> of a file that has neither.
_theme_scaffold() {
  local file="$1" tmp
  tmp="$(mktemp)"
  awk -v tb="$_TOK_BEGIN" -v te="$_TOK_END" -v hb="$_THM_BEGIN" -v he="$_THM_END" '
    !done && /<style>/ { print; print tb; print te; print hb; print he; done=1; next }
    { print }
    END { if (!done) exit 3 }
  ' "$file" > "$tmp" || { rm -f "$tmp"; return 3; }
  mv "$tmp" "$file"
}

# Pin (or clear) data-theme on <html>. This is the half of theming that is pure
# mechanism, and the half authors get wrong.
_theme_pin_mode() {
  local file="$1" mode="$2" tmp
  tmp="$(mktemp)"
  awk -v mode="$mode" '
    !done && /^[[:space:]]*<html[ >]/ {
      sub(/ *data-theme="[a-z]*"/, "")
      if (mode != "auto") sub(/<html/, "<html data-theme=\"" mode "\"")
      done=1
    }
    { print }
  ' "$file" > "$tmp"
  mv "$tmp" "$file"
}

cmd_theme() {
  local file="" preset="" mode="" clear=0 init=0 show=1
  local primary="" surface="" text="" on_primary="" secondary="" positive="" negative=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --preset)      preset="${2:-}"; shift 2; show=0 ;;
      --primary)     primary="${2:-}"; shift 2; show=0 ;;
      --surface)     surface="${2:-}"; shift 2; show=0 ;;
      --text)        text="${2:-}"; shift 2; show=0 ;;
      --on-primary)  on_primary="${2:-}"; shift 2; show=0 ;;
      --secondary)   secondary="${2:-}"; shift 2; show=0 ;;
      --positive)    positive="${2:-}"; shift 2; show=0 ;;
      --negative)    negative="${2:-}"; shift 2; show=0 ;;
      --mode)        mode="${2:-}"; shift 2; show=0 ;;
      --clear)       clear=1; shift; show=0 ;;
      --init)        init=1; shift; show=0 ;;
      -*)            die "theme: unknown flag: $1" ;;
      *)             file="$1"; shift ;;
    esac
  done
  [ -n "$file" ] || die "theme: need a file (journey.sh theme <file.html> [options])"
  [ -f "$file" ] || die "theme: no such file: $file"

  local tokens="$THEME_DIR/journey-tokens.css"
  [ -f "$tokens" ] || die "theme: token file missing: $tokens (set JOURNEY_THEME)"

  # --- show ---------------------------------------------------------------
  if [ "$show" -eq 1 ]; then
    local has_tok has_thm seeds pinned
    has_tok=$(grep -cF "$_TOK_BEGIN" "$file" || true)
    has_thm=$(grep -cF "$_THM_BEGIN" "$file" || true)
    # first <html> line in the file — the token block's own header shows a
    # `<html data-theme="light">` example, and that is documentation, not this
    # document's tag
    pinned=$(grep -m1 '<html' "$file" | sed -n 's/.*data-theme="\([a-z]*\)".*/\1/p')
    printf '%s\n' "$file"
    printf '  token layer : %s\n' "$([ "$has_tok" -gt 0 ] && echo present || echo 'MISSING — run --init')"
    printf '  theme       : %s\n' "$([ "$has_thm" -gt 0 ] && echo 'region present' || echo 'no region')"
    printf '  mode        : %s\n' "${pinned:-auto (follows the reader)}"
    if [ "$has_thm" -gt 0 ]; then
      seeds=$(awk -v b="$_THM_BEGIN" -v e="$_THM_END" 'index($0,b){f=1;next} index($0,e){f=0} f' "$file" \
              | grep -o -- '--brand-[a-z-]*:[^;]*;' || true)
      [ -n "$seeds" ] && printf '  seeds       :\n%s\n' "$(printf '%s\n' "$seeds" | sed 's/^/    /')" \
                      || printf '  seeds       : none (default palette)\n'
    fi
    return 0
  fi

  # --- init / refresh the token layer ------------------------------------
  if [ "$init" -eq 1 ] || ! grep -qF "$_TOK_BEGIN" "$file"; then
    grep -qF "$_TOK_BEGIN" "$file" || _theme_scaffold "$file" \
      || die "theme: no <style> block found in $file — add one, then re-run"
    # add the theme region directly after the token region, once
    if ! grep -qF "$_THM_BEGIN" "$file"; then
      awk -v te="$_TOK_END" -v hb="$_THM_BEGIN" -v he="$_THM_END" '
        { print }
        index($0,te) && !d { print hb; print he; d=1 }
      ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
    _theme_write_region "$file" "$_TOK_BEGIN" "$_TOK_END" "$(cat "$tokens")" \
      || die "theme: could not write the token region in $file"
    printf 'journey.sh: token layer written to %s\n' "$file"
  fi

  # --init on its own is a complete job: the file now carries the default
  # palette and follows the reader's theme. Nothing further to apply.
  if [ "$init" -eq 1 ] && [ "$clear" -eq 0 ] \
     && [ -z "$preset$primary$secondary$surface$text$on_primary$positive$negative" ]; then
    [ -n "$mode" ] && _theme_pin_mode "$file" "$mode"
    printf 'journey.sh: %s → default palette, mode %s\n' "$file" "${mode:-auto}"
    return 0
  fi

  # --- clear --------------------------------------------------------------
  if [ "$clear" -eq 1 ]; then
    _theme_write_region "$file" "$_THM_BEGIN" "$_THM_END" "" || die "theme: no theme region in $file"
    _theme_pin_mode "$file" "${mode:-auto}"
    printf 'journey.sh: %s → default palette, mode %s\n' "$file" "${mode:-auto}"
    return 0
  fi

  # --- preset -------------------------------------------------------------
  local body=""
  if [ -n "$preset" ]; then
    local pf="$THEME_DIR/presets/$preset.css"
    [ -f "$pf" ] || die "theme: no such preset: $preset (have: $(ls "$THEME_DIR/presets" 2>/dev/null | sed 's/\.css$//' | tr '\n' ' '))"
    body="$(cat "$pf")"
    [ -n "$mode" ] || mode="$(sed -n 's/.*mode: *\([a-z]*\).*/\1/p' "$pf" | head -1)"
    [ -n "$surface" ] || surface="$(grep -o -- '--brand-surface: *[^;]*' "$pf" | head -1 | sed 's/.*: *//')"
  fi

  # --- explicit seeds -----------------------------------------------------
  local seedlines=""
  # `return 0` is load-bearing: under `set -e` a helper whose last command is a
  # failed test takes the whole script down with it.
  _seed() {
    [ -n "$2" ] || return 0
    seedlines="$seedlines  --brand-$1: $2;
"
    return 0
  }
  _seed primary    "$primary"
  _seed secondary  "$secondary"
  _seed surface    "$surface"
  _seed text       "$text"
  _seed on-primary "$on_primary"
  _seed positive   "$positive"
  _seed negative   "$negative"

  if [ -n "$seedlines" ]; then
    if [ -n "$body" ]; then body="$body
$seedlines"; else body="$seedlines"; fi
  fi
  [ -n "$body" ] || die "theme: nothing to apply (give --preset, seed flags, or --clear)"

  [ -n "$mode" ] || mode="$(_theme_mode_for_surface "${surface:-}")"

  # The selector has to match the mode, and the asymmetry is the whole reason
  # this command exists. Pinning light is enough on its own — the token file's
  # dark blocks are :root:not([data-theme="light"]), which then cannot match.
  # Pinning dark is NOT: :root[data-theme="dark"] out-specifies a bare :root, so
  # a dark override written at :root loses to the defaults it meant to replace.
  # Match that specificity and win on source order instead.
  local sel
  case "$mode" in
    dark)  sel=':root, :root[data-theme="dark"]' ;;
    light) sel=':root' ;;
    *)     sel=':root, :root[data-theme="dark"], :root:not([data-theme="light"])' ;;
  esac

  # Wrap the seeds. The comment is not decoration: it tells the next reader that
  # this is the ONE place a literal colour is allowed to live.
  body="/* Tier 1 override — the whole theme. Every colour in this file derives
   from these; nothing below Tier 1 may hold a literal. Written by
   \`journey.sh theme\`; edit here or re-run the command. */
$sel{
$(printf '%s' "$body" | sed 's/^  *--/  --/')
}"

  _theme_write_region "$file" "$_THM_BEGIN" "$_THM_END" "$body" \
    || die "theme: no theme region in $file — run with --init first"
  _theme_pin_mode "$file" "$mode"

  printf 'journey.sh: %s → %s, mode %s\n' "$file" "${preset:-custom seeds}" "$mode"
  [ "$mode" = auto ] && printf 'journey.sh: note — mode auto means the reader'"'"'s dark preference re-seeds Tier 1 and your override is ignored in dark. Pin --mode light|dark to own the palette.\n' >&2
  return 0
}

usage() {
  cat <<'EOF'
journey.sh — deterministic toolbelt for the Journey Skill

USAGE
  journey.sh validate <journey>
  journey.sh new      <journey>            (full journey markdown via --block-file or stdin)
  journey.sh commit   <journey> <op> [args]
  journey.sh query    '<filter>'
  journey.sh search   <text>
  journey.sh audit    [--journey X] [--since DATE] [--author A] [--target T]
  journey.sh whoami
  journey.sh set-author <name>
  journey.sh theme    <file.html> [--init | --preset <name> | --clear | seed flags]

COMMIT OPS
  insert-step      --after <id> | --before <id>   (block from --block-file or stdin)
  replace-step     <id>                            (block from --block-file or stdin)
  remove-step      <id>
  insert-milestone --after <id> | --before <id>    (block from --block-file or stdin)
  remove-milestone <id>
  register-field   <field_name> "<description>"    (adds to preamble custom-fields)
  common flags: --note <text>  --author <name>

THEME
  --init                 write/refresh the shipped token layer into the file
  --preset <name>        paper | midnight | blueprint | contrast
  --primary/--surface/--text/--on-primary/--secondary/--positive/--negative <c>
  --mode light|dark|auto pin the artifact's theme (default: read off the surface)
  --clear                back to the default palette
  (no flags)             report what theme the file currently carries

QUERY FILTERS
  failure-no-recovery   moment-no-evidence   user-modified
  persona:<name>        field:<name>         missing:<name>

ENV
  JOURNEY_DIR          dataset dir (default ./.journey)
  JOURNEY_SCHEMA       schema file (default <script>/../references/journey.schema.md)
  JOURNEY_AUTHOR_FILE  saved-author file (default $XDG_CONFIG_HOME/journey-skill/author)
EOF
}

main() {
  [ $# -ge 1 ] || { usage; exit 2; }
  local cmd="$1"; shift
  case "$cmd" in
    validate)   cmd_validate "$@";;
    new)        cmd_new "$@";;
    commit)     cmd_commit "$@";;
    query)      cmd_query "$@";;
    search)     cmd_search "$@";;
    audit)      cmd_audit "$@";;
    whoami)     cmd_whoami "$@";;
    set-author) cmd_set_author "$@";;
    theme)      cmd_theme "$@";;
    help|-h|--help) usage;;
    *) die "unknown command: $cmd (try: journey.sh help)";;
  esac
}

main "$@"
