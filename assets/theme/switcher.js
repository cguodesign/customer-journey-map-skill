/* ==========================================================================
   switcher.js — the theme control every rendering carries.

   A rendering ships dark. What it does NOT ship is a fixed identity: paper,
   brand and light are one click away, because that is the honest demonstration
   of a token layer — the reader re-seeds Tier 1 and watches the whole palette
   re-derive, rather than being shown four files that someone styled four times.

   Mechanism: presets are written as INLINE custom properties on <html>. Element
   style beats every stylesheet rule, so this sidesteps the specificity fight
   between a :root override and the token file's dark blocks entirely (see
   journey-tokens.css § OVERRIDING TIER 1). data-theme still selects which of
   the shipped palettes derives underneath.
   ========================================================================== */
(function () {
  var root = document.documentElement;

  var PRESETS = {
    dark:  { theme: "dark",  seeds: null, label: "Dark" },
    light: { theme: "light", seeds: null, label: "Light" },
    paper: { theme: "light", label: "Paper", seeds: {
      "--brand-surface":  "oklch(96.5% 0.011 85)",
      "--brand-text":     "oklch(19% 0.006 80)",
      "--brand-primary":  "oklch(58% 0.098 62)",
      "--brand-negative": "oklch(50% 0.155 28)"
    }},
    brand: { theme: "dark", label: "Brand", seeds: {
      "--brand-primary":    "#A97BF0",
      "--brand-surface":    "#14101c",
      "--brand-text":       "#ece8f5",
      "--brand-on-primary": "#14101c"
    }}
  };
  var SEED_KEYS = ["--brand-surface","--brand-text","--brand-primary","--brand-negative",
                   "--brand-secondary","--brand-positive","--brand-on-primary","--brand-attention"];

  function apply(name) {
    var p = PRESETS[name] || PRESETS.dark;
    SEED_KEYS.forEach(function (k) { root.style.removeProperty(k); });
    if (p.seeds) Object.keys(p.seeds).forEach(function (k) { root.style.setProperty(k, p.seeds[k]); });
    root.setAttribute("data-theme", p.theme);
    root.setAttribute("data-preset", name);
    try { sessionStorage.setItem("journey-theme", name); } catch (e) {}
    [].forEach.call(box.querySelectorAll("button"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.preset === name));
    });
  }

  var box = document.createElement("div");
  box.className = "journey-theme-switch";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Theme");
  box.innerHTML =
    '<style>' +
    '.journey-theme-switch{position:fixed;top:14px;right:14px;z-index:9999;display:flex;gap:2px;' +
      'padding:3px;border:1px solid var(--line);border-radius:999px;background:var(--surface-1);' +
      'font:500 10px/1 var(--font-sans,system-ui,sans-serif);letter-spacing:.09em;' +
      'text-transform:uppercase;box-shadow:0 2px 10px color-mix(in oklab,var(--shadow-ink) 22%,transparent)}' +
    '.journey-theme-switch button{border:0;background:none;color:var(--ink-muted);cursor:pointer;' +
      'padding:6px 10px;border-radius:999px;font:inherit;transition:color .12s,background .12s}' +
    '.journey-theme-switch button:hover{color:var(--ink)}' +
    '.journey-theme-switch button[aria-pressed="true"]{background:var(--accent-soft);color:var(--accent)}' +
    '.journey-theme-switch button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}' +
    '@media print{.journey-theme-switch{display:none}}' +
    '</style>' +
    Object.keys(PRESETS).map(function (k) {
      return '<button type="button" data-preset="' + k + '" aria-pressed="false">' +
             PRESETS[k].label + '</button>';
    }).join("");

  box.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-preset]");
    if (b) apply(b.dataset.preset);
  });

  function mount() {
    document.body.appendChild(box);
    var saved;
    try { saved = sessionStorage.getItem("journey-theme"); } catch (e) {}
    apply(saved && PRESETS[saved] ? saved : (root.getAttribute("data-preset") || "dark"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
