# website

Personal site for kartavyahirani.com. Plain HTML, CSS and a little JS: no build step.

- `style.css`: light/dark tokens, the 12-column grid and all styles. Fonts: Switzer (Fontshare) and Geist Mono (Google Fonts).
- `script.js`: clock, theme toggle, fitting the hero name to the page width, entry counts, fade-in on scroll.
- `favicon.svg`: site icon.

## Editing content

- **Projects**: copy an `<li class="rise">` tile in `projects.html` (and the home page). To use a real screenshot, replace the `<div class="editor">…</div>` inside `.shot` with `<img src="…" alt="…">`.
- **Books / Movies**: copy an `<li class="rise">` cover or poster. Change the colour with `--c` (background) and, for books, `--ink` (text). Fill in author/director and year where the `—` dashes are.
- **Thoughts**: copy an `<li class="entry grid rise">` row, newest first.
- The home page shows a preview of each section, so add new entries there too.
- The count next to each page title updates automatically.
- **Clock timezone**: set `TIMEZONE` at the top of `script.js` (e.g. `"Asia/Kolkata"`). Left null, it shows the visitor's local time.
- **Contact links**: Email / LinkedIn / GitHub and "Say hello" are still `#`.
