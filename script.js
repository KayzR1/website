(function () {
  "use strict";

  // Set to an IANA zone (e.g. "Asia/Kolkata") to show your own local time.
  // Left null, the clock shows the visitor's local time.
  var TIMEZONE = null;

  var root = document.documentElement;

  /* ---- Live clock ---------------------------------------------------- */
  var clock = document.querySelector("[data-clock]");
  if (clock) {
    var opts = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    };
    if (TIMEZONE) opts.timeZone = TIMEZONE;
    var fmt = new Intl.DateTimeFormat("en-GB", opts);
    var tick = function () {
      var parts = fmt.formatToParts(new Date());
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        return "";
      };
      clock.textContent =
        get("timeZoneName") + " " + get("hour") + ":" + get("minute") + ":" + get("second");
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Theme toggle -------------------------------------------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.textContent = theme === "dark" ? "[ dark ]" : "[ light ]";
      toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
  }
  function flipTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  }
  applyTheme(root.getAttribute("data-theme") || "dark");
  if (toggle) toggle.addEventListener("click", flipTheme);

  /* ---- Entry counts -------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var n = document.querySelectorAll(".entries > li").length;
    el.textContent = String(n).padStart(2, "0");
  });

  /* ---- Year ---------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Keyboard shortcuts: 1–5 navigate, T toggles theme ------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
    var idx = parseInt(e.key, 10);
    if (idx >= 1 && idx <= navLinks.length) {
      window.location.href = navLinks[idx - 1].href;
    } else if (e.key === "t" || e.key === "T") {
      flipTheme();
    }
  });

  /* ---- Reveal on scroll --------------------------------------------- */
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  items.forEach(function (el, i) {
    if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(i, 6) * 60 + "ms");
    io.observe(el);
  });
})();
