/* AeroCardia — site interactions */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Nav: scroll state + mobile toggle ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = nav.querySelector(".nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    var fold = window.innerHeight * 0.88;
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top > fold) { el.classList.add("pre"); io.observe(el); }
    });
    // safety net: never leave content hidden if the observer misfires
    setTimeout(function () {
      document.querySelectorAll(".reveal.pre:not(.in)").forEach(function (el) { el.classList.add("in"); });
    }, 4000);
  }

  /* ---------- UCI country colour toggle ---------- */
  var flags = document.querySelectorAll(".flag");
  var shell = document.querySelector("[data-uci-shell]");
  if (flags.length && shell) {
    flags.forEach(function (f) {
      f.addEventListener("click", function () {
        flags.forEach(function (x) { x.classList.remove("is-active"); });
        f.classList.add("is-active");
        var c = f.getAttribute("data-accent");
        if (c) shell.style.setProperty("--shell-accent", c);
        var label = document.querySelector("[data-uci-label]");
        if (label) label.textContent = f.getAttribute("data-country") || f.getAttribute("data-cw") || "";
        var cw = document.querySelector("[data-uci-cw]");
        if (cw && f.getAttribute("data-cw")) cw.textContent = f.getAttribute("data-cw");
        var img = shell.querySelector("[data-uci-img]");
        if (img) {
          var src = f.getAttribute("data-img");
          if (src) img.src = src;
        }
      });
    });
  }

  /* ---------- Idle → speed up image strip ---------- */
  var strip = document.querySelector(".strip");
  if (strip) {
    var idleTimer;
    var goIdle = function () { strip.classList.add("is-idle"); };
    var wake = function () {
      strip.classList.remove("is-idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(goIdle, 3500);
    };
    ["mousemove", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, wake, { passive: true });
    });
    idleTimer = setTimeout(goIdle, 3500);
  }

  /* ---------- Scroll-scrub device rotation (how-it-works) ---------- */
  var scrub = document.querySelector("[data-scrub]");
  if (scrub) {
    var target = scrub.querySelector("[data-scrub-target]");
    var tick = function () {
      var r = scrub.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = 1 - (r.top + r.height / 2) / (vh + r.height / 2);
      progress = Math.max(0, Math.min(1, progress));
      if (target) {
        target.style.transform =
          "rotate(" + (progress * 320 - 30).toFixed(1) + "deg) scale(" + (0.9 + progress * 0.15).toFixed(3) + ")";
      }
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  }
})();
