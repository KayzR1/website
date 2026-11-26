// The hero's one effect (dot-terrain), the nav's scrolled state and the year.
import fx from './assets/fx/fx.js';

fx.mountAll(document, {
  bg: '#0b0b0a',
  surface: '#151513',
  ink: '#edebe6',
  muted: '#94928b',
  accent: '#ef6a32',
  accentInk: '#0b0b0a',
});

const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
