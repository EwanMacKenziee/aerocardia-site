/* AeroCardia — fullscreen slide-in menu + topbar scroll state */
(function () {
  "use strict";

  /* ---------- Topbar: solid background once scrolled ---------- */
  var topbar = document.querySelector("[data-topbar]");
  if (topbar && !document.body.classList.contains("interior")) {
    var onScroll = function () {
      topbar.classList.toggle("is-solid", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu ---------- */
  var menu = document.getElementById("menu");
  var openBtn = document.getElementById("menu-open");
  if (!menu || !openBtn) return;

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    var focusTarget = open ? menu.querySelector("#menu-close") : openBtn;
    if (focusTarget) {
      try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); }
    }
  }

  openBtn.addEventListener("click", function () { setMenu(true); });

  menu.querySelectorAll("[data-menu-close]").forEach(function (el) {
    el.addEventListener("click", function () { setMenu(false); });
  });

  menu.querySelectorAll(".menu__link").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
  });
})();
