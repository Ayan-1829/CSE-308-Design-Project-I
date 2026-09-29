DESIGN PROJECT I (CSE 308): INTERACTIVE COURSE NOTES, VERSION 1
==============================================================

Open index.html in any modern browser. No server or build step is needed.
The Google Fonts link and KaTeX (maths in the LaTeX playground) load from the internet
when available; without it the pages fall back to system fonts and show maths as source.

Folder layout
-------------
index.html            topic list
topics/*.html         nine slide decks (arrow keys, F full screen, M slide list, pen button to draw)
practice.html         every practice problem with answers
reference.html        searchable cheat sheet (UML, DFD, SRS, SDLC, LaTeX, UI/UX)
projects.html         lab-report checklists (saved in the browser) and a LaTeX report template
resources.html        curated links, tools and books per topic
404.html              "page not found" page for GitHub Pages
css/style.css         all styling (colour tokens at the top; light and dark themes)
js/core.js            helpers, theme toggle, storage
js/diagram.js         SVG kit for DFD / UML / process diagrams, and the sequence-diagram builder
js/figs.js            every figure (FIGS[id]) used by <figure class="fig" data-fig="id">
js/latex.js           LaTeX/BibTeX highlighter and the in-browser LaTeX previewer
js/demos.js           interactive tools (DEMOS[id]) used by <div data-demo="id">
js/quiz.js, js/page.js, js/slides.js, js/annotate.js   quiz, mounting, slide engine, drawing layer
img/                  logo, favicons, social-share images (img/og/)
robots.txt, sitemap.xml, site.webmanifest   SEO files. The site address is https://ayan-1829.github.io/CSE-308-Design-Project-I/
                      (search-and-replace it everywhere if you publish somewhere else).

Topics
------
   1. Team Formation, Project Assignment & Planning (Lab I, 31 slides)
   2. Technical Report Writing with LaTeX (Labs II–III, 32 slides)
   3. IEEE Software Requirements Specification (SRS) (Lab IV · open-ended, 26 slides)
   4. SDLC Model Selection (Lab V, 24 slides)
   5. Data Flow Diagrams (DFD): Level 0 and Level 1 (Lab VI, 23 slides)
   6. UML Use Case Diagrams (Lab VII, 23 slides)
   7. UML Sequence & Communication Diagrams (Lab VIII, 23 slides)
   8. UML Class Diagrams (Labs IX–X, 26 slides)
   9. UI/UX Foundations & Figma Wireframing (Lab: UI/UX, 26 slides)

Editing a slide
---------------
Each slide is a <section class="slide" data-title="..."> inside a topic file; copy one, edit the
text and save. The slide counter and slide list update automatically.
