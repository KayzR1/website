(function () {
  "use strict";

  // Set to an IANA zone (e.g. "Asia/Kolkata") to show your own local time.
  // Left null, the clock shows the visitor's local time.
  var TIMEZONE = null;

  var root = document.documentElement;

  /* ---- Clock --------------------------------------------------------- */
  var clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    var opts = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "short" };
    if (TIMEZONE) opts.timeZone = TIMEZONE;
    var fmt = new Intl.DateTimeFormat("en-GB", opts);
    var tick = function () {
      var parts = fmt.formatToParts(new Date());
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        return "";
      };
      var s = get("hour") + ":" + get("minute") + ":" + get("second") + " " + get("timeZoneName");
      clocks.forEach(function (c) { c.textContent = s; });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Theme --------------------------------------------------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
  }
  function flipTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }
  applyTheme(root.getAttribute("data-theme") || "light");
  if (toggle) toggle.addEventListener("click", flipTheme);

  /* ---- Counts & year ------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var n = document.querySelectorAll("[data-entries] > li").length;
    el.textContent = "(" + String(n).padStart(2, "0") + ")";
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Fit the hero name to the full width -------------------------- */
  var fits = document.querySelectorAll("[data-fit]");
  function fit() {
    fits.forEach(function (el) {
      var box = el.parentElement;
      var avail = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) - parseFloat(getComputedStyle(box).paddingRight);
      el.style.fontSize = "100px";
      var w = el.scrollWidth;
      if (w > 0) el.style.fontSize = (100 * avail / w).toFixed(2) + "px";
    });
  }
  if (fits.length) {
    fit();
    window.addEventListener("resize", fit);
  }

  /* ---- Load-in ------------------------------------------------------- */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    if (fits.length) fit();
    requestAnimationFrame(function () { root.classList.add("loaded"); });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1000);
  } else {
    start();
  }

  /* ---- Reveal on scroll --------------------------------------------- */
  var items = document.querySelectorAll(".rise");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    var n = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", n * 70 + "ms");
      n++;
      el.classList.add("in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
  items.forEach(function (el) { io.observe(el); });
})();
