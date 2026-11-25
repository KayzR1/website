(function () {
  "use strict";

  // Set to an IANA zone (e.g. "Asia/Kolkata") to show your own local time.
  // Left null, the clock shows the visitor's local time.
  var TIMEZONE = null;

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Smooth scroll ------------------------------------------------- */
  if (window.Lenis && !reduce) {
    var lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    var raf = function (t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  /* ---- Clock --------------------------------------------------------- */
  var clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    var opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" };
    if (TIMEZONE) opts.timeZone = TIMEZONE;
    var fmt = new Intl.DateTimeFormat("en-GB", opts);
    var tick = function () {
      var parts = fmt.formatToParts(new Date());
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        return "";
      };
      var s = get("hour") + ":" + get("minute") + " " + get("timeZoneName");
      clocks.forEach(function (c) { c.textContent = s; });
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---- Theme --------------------------------------------------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light" : "Dark";
      toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
  }
  function flipTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }
  applyTheme(root.getAttribute("data-theme") || "dark");
  if (toggle) toggle.addEventListener("click", flipTheme);

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
    if (e.key === "t" || e.key === "T") flipTheme();
  });

  /* ---- Counts & year ------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    el.textContent = String(document.querySelectorAll(".entries > li").length).padStart(2, "0");
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Statement: split into words ---------------------------------- */
  var statement = document.querySelector("[data-words]");
  var words = [];
  if (statement && !reduce) {
    var text = statement.textContent.trim().replace(/\s+/g, " ");
    statement.setAttribute("aria-label", text);
    statement.textContent = "";
    text.split(" ").forEach(function (w, i, arr) {
      var s = document.createElement("span");
      s.className = "w";
      s.setAttribute("aria-hidden", "true");
      s.textContent = w;
      statement.appendChild(s);
      if (i < arr.length - 1) statement.appendChild(document.createTextNode(" "));
      words.push(s);
    });
  }

  /* ---- Scroll-linked effects ---------------------------------------- */
  var header = document.querySelector(".site-header");
  var heroInner = document.querySelector(".hero-inner");
  var hero = document.querySelector(".hero");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 24);

    if (heroInner && hero && !reduce) {
      var p = Math.min(1, Math.max(0, y / (hero.offsetHeight * 0.9)));
      heroInner.style.transform = "translate3d(0," + (p * 18) + "vh,0) scale(" + (1 - p * 0.06) + ")";
      heroInner.style.opacity = String(1 - p * 1.1);
      heroInner.style.filter = p > 0.01 ? "blur(" + (p * 8).toFixed(2) + "px)" : "";
    }

    if (words.length) {
      var r = statement.getBoundingClientRect();
      var start = vh * 0.85;
      var span = r.height + vh * 0.35;
      var prog = Math.min(1, Math.max(0, (start - r.top) / span));
      var lit = prog * (words.length + 4);
      for (var i = 0; i < words.length; i++) {
        var o = Math.min(1, Math.max(0.14, lit - i));
        words[i].style.setProperty("--o", o.toFixed(3));
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- Key light follows the cursor, slowly ------------------------- */
  var lights = document.querySelectorAll(".hero-light");
  if (lights.length && !reduce && window.matchMedia("(hover: hover)").matches) {
    var tx = 62, ty = 30, cx = 62, cy = 30;
    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });
    var follow = function () {
      cx += (tx - cx) * 0.03;
      cy += (ty - cy) * 0.03;
      lights.forEach(function (l) {
        l.style.setProperty("--lx", cx.toFixed(2));
        l.style.setProperty("--ly", cy.toFixed(2));
      });
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  }

  /* ---- Load-in ------------------------------------------------------- */
  var start = function () { root.classList.add("loaded"); };
  if (document.fonts && document.fonts.ready) {
    var done = false;
    var go = function () { if (!done) { done = true; requestAnimationFrame(start); } };
    document.fonts.ready.then(go);
    setTimeout(go, 1200);
  } else {
    start();
  }

  /* ---- Reveal on scroll --------------------------------------------- */
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    var batch = 0;
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.setProperty("--d", batch * 90 + "ms");
        batch++;
        var el = entry.target;
        el.classList.add("in");
        io.unobserve(el);
        // Hand control back to the element's own hover transitions afterwards.
        setTimeout(function () {
          el.classList.remove("reveal", "in");
          el.style.removeProperty("--d");
        }, 1400 + batch * 90);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  items.forEach(function (el) { io.observe(el); });
})();
