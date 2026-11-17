/* AeroCardia — EN/FR content toggle.
   Convention: any element carrying user-facing text adds data-fr="<french
   html>"; this script swaps innerHTML and remembers the authored English on
   first toggle so it can switch back. For attributes (alt, aria-label, the
   meta description's content, …) list the attribute names in data-fr-attrs
   ("alt aria-label") and give each one a data-fr-attr-<name> value. See
   README.md "Translating new content" before adding a page or section. */
(function () {
  "use strict";

  var STORAGE_KEY = "ac-lang";

  function getStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function frAttrKey(attr) {
    return "frAttr" + attr.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })
                          .replace(/^([a-z])/, function (_, c) { return c.toUpperCase(); });
  }

  function applyLang(lang) {
    var isFr = lang === "fr";
    document.documentElement.lang = isFr ? "fr" : "en";

    document.querySelectorAll("[data-fr]").forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = isFr ? el.dataset.fr : el.dataset.en;
    });

    document.querySelectorAll("[data-fr-attrs]").forEach(function (el) {
      el.dataset.frAttrs.split(/\s+/).filter(Boolean).forEach(function (attr) {
        var enStoreAttr = "data-en-attr-" + attr;
        if (!el.hasAttribute(enStoreAttr)) el.setAttribute(enStoreAttr, el.getAttribute(attr) || "");
        var frValue = el.dataset[frAttrKey(attr)];
        el.setAttribute(attr, isFr ? frValue : el.getAttribute(enStoreAttr));
      });
    });

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.textContent = isFr ? "EN" : "FR";
      btn.setAttribute("aria-pressed", String(isFr));
      btn.setAttribute("aria-label", isFr ? "Switch to English" : "Passer en français");
    });

    document.dispatchEvent(new Event("ac:langchange"));
  }

  function toggleLang() {
    var next = document.documentElement.lang === "fr" ? "en" : "fr";
    storeLang(next);
    applyLang(next);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var stored = getStoredLang();
    var initial = stored || ((navigator.language || "").slice(0, 2) === "fr" ? "fr" : "en");
    applyLang(initial);

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", toggleLang);
    });
  });

  window.AC_I18N = { applyLang: applyLang, toggleLang: toggleLang };
})();
