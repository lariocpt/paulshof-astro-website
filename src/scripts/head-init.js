(function () {
  // data-js unlocks the scroll-reveal rules in global.css. Those rules hide content
  // until an observer reveals it, so they must never apply unless JavaScript is
  // demonstrably running — otherwise a script failure blanks the whole page.
  //
  // It has to run before the stylesheet paints: set any later and already-rendered
  // content would flash visible, then disappear.
  //
  // ClientRouter's swap deletes this attribute — the swap re-applies only the
  // server-rendered attributes on <html> — and this inline script is never re-run,
  // so the Layout script reasserts it on every `astro:after-swap`. Keep the two in
  // step; `verify-source.mjs` enforces that any runtime <html> attribute is.
  document.documentElement.setAttribute('data-js', '');
})();
