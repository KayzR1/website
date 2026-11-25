# website

Personal site for kartavyahirani.com, served by GitHub Pages. Plain HTML, CSS and a little JS: no build step.

- `style.css`: design tokens (dark and light themes) and all styles
- `script.js`: live clock, theme toggle, `1`–`5` / `T` keyboard shortcuts, scroll reveal, entry counts
- `favicon.svg`: site icon

## Editing content

- **Add an entry** (project, book, movie, thought): copy an existing `<li class="row ...">` block in that page's `<ol class="rows entries">`. The count next to the page title updates automatically.
- **Home page counts** ("02 entries") are written by hand in `index.html`. Update them when you add entries.
- **Add a page**: copy one of the sub-pages, then add the link to the nav and the footer sitemap in every page.
- **Clock timezone**: set `TIMEZONE` at the top of `script.js` (e.g. `"Asia/Kolkata"`). Left null, it shows the visitor's local time.
- **Contact links**: the footer's Email / LinkedIn / GitHub links are still `#` in every page.
