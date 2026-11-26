# website

Personal site for kartavyahirani.com: one dark page, plain HTML, CSS and a little JS, no build step. Vercel deploys `main`.

- `index.html`: the whole site. Sections: hero, Work, Shelf, Notes, Contact.
- `style.css`: tokens at the top, then each section.
- `script.js`: mounts the hero's dot-terrain ground, the nav's scrolled state, the year.
- `assets/fx/`: the WebGL dot-terrain effect (shows one still frame under reduced motion; a CSS fallback without WebGL).
- `assets/moments/`: the pinned-chapters scroll moment used by Work (desktop only; phones and reduced motion get static rows).
- `assets/frank.jpg`, `assets/ember.jpg`: screenshots of the live sites. `assets/share.jpg`: link preview image.
- `projects.html`, `books.html`, `movies.html`, `thoughts.html`: redirects to the matching section, for old links.

## Editing

- **A project**: copy an `<li class="mo-pc__step">` in `#work` (2 to 4 steps fit). Each needs a title, a short paragraph and one picture (4:3).
- **A book or film**: copy an `<li>` in `.shelf` and give the cover a modifier class with its colours in `style.css`.
- **A note**: copy an `<li class="note">` in `.notes`.
