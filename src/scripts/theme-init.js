(function () {
  // data-js unlocks the scroll-reveal rules in global.css. They hide content
  // until an observer reveals it, so they must never apply unless JS is
  // demonstrably running — otherwise a script failure blanks the whole page.
  document.documentElement.setAttribute('data-js', '');

  try {
    var choice = localStorage.getItem('theme');
    if (choice === 'dark' || choice === 'light') {
      document.documentElement.setAttribute('data-theme', choice);
    }
  } catch {
    /* storage unavailable — fall through to the OS preference */
  }
})();
