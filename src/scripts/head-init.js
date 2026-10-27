(function () {
  // data-js unlocks the scroll-reveal rules in global.css. Those rules hide content
  // until an observer reveals it, so they must never apply unless JavaScript is
  // demonstrably running — otherwise a script failure blanks the whole page.
  //
  // It has to run before the stylesheet paints: set any later and already-rendered
  // content would flash visible, then disappear.
  document.documentElement.setAttribute('data-js', '');
})();
