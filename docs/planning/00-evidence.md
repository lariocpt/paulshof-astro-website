# Evidence and scope

Captured on 26 October 2026 from the live XML sitemap: **38 pages**, **17 widths**, **646
page/width combinations** and **658 image tiles**, with no failed captures and 0
incomplete page heights after supplemental tiled captures.

Widths: 400, 479, 480, 576, 600, 767, 768, 782, 979, 980, 991, 992, 999, 1199, 1200, 1440,
1920 px. The eight overview widths were supplemented with the live CSS media-query
thresholds, including theme and widget breakpoints. These are exact sampled widths, not
every possible viewport or every breakpoint's ±1 boundary.

The browser used a fresh headless Chromium context, CPU/software rendering, reduced
motion, device scale factor 1 and 1000px viewport height. Pages resize between widths;
reload_each_width is available for initial-load-specific cases. Fonts, layout and lazy
images receive bounded settling/scrolling. Third-party embeds, animation/video frames and
network-dependent widgets may be incomplete. No form submission, booking or
navigation-menu interaction was performed.

The full [capture manifest](capture-manifest.json) includes local artifact paths, page
heights, overflow observations, tiles and per-page CSS/component metadata. Raw artifacts
persist on mini-mobile under ~/.local/share/lario-images/jobs/. Selected
[mobile](reference-images/home-400.jpg) and [desktop](reference-images/home-1440.jpg)
references are copied into this repo.

Long pages were tiled rather than silently losing the lower sections. The first image
remains an overview; the tiles list in the manifest gives complete vertical coverage
within the documented capture bounds.

The paired vision review used **RTX 3060 Ti** on representative mobile/desktop pages. Its
full report is retained separately and is not a substitute for DOM, keyboard, interaction
or accessibility testing. Screenshots are source evidence; new brand colours/components
are proposals. The application has not been rebuilt or published as the Paulshof site in
this phase.
