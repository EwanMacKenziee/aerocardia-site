/* AeroCardia — animated hero backdrop + liquid-glass card refraction.

   There is no background video file: the "loop" is generated live. Every frame
   we paint one scene (a deep teal aurora + the floating device render) to an
   offscreen canvas, then blit it to two places:
     1. #bg-stage      — the full-bleed fixed backdrop
     2. #dup-stage      — a viewport-sized copy positioned *behind the card*, which
                          carries filter:url(#liquid-glass-refraction) in CSS.
   The card's overflow:hidden + border-radius do the clipping, so the card reads
   as a glass window onto a refracted version of the same backdrop.

   To swap in a real clip later: drop an <video> into the hero, draw `video`
   instead of the generated scene in draw(), keep the rest. */
(function () {
  "use strict";

  var stage = document.getElementById("bg-stage");
  if (!stage) return;

  var card = document.querySelector("[data-glass-card]");
  var dup = document.getElementById("dup-stage");
  var dupWrap = document.getElementById("dup-stage-container");
  var sctx = stage.getContext("2d");
  var dctx = dup ? dup.getContext("2d") : null;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- device render, studio-grey keyed to transparent (once, on load) ---- */
  var keyed = null;
  var raw = new Image();
  raw.crossOrigin = "anonymous";
  raw.onload = function () {
    var oc = document.createElement("canvas");
    oc.width = raw.naturalWidth || raw.width;
    oc.height = raw.naturalHeight || raw.height;
    var octx = oc.getContext("2d");
    octx.drawImage(raw, 0, 0);
    try {
      var d = octx.getImageData(0, 0, oc.width, oc.height);
      var p = d.data;
      // average the four corners → the flat studio-grey key colour
      var idx = [
        0,
        (oc.width - 1) * 4,
        (oc.height - 1) * oc.width * 4,
        (oc.width * oc.height - 1) * 4
      ];
      var kr = 0, kg = 0, kb = 0, n = idx.length;
      idx.forEach(function (i) { kr += p[i]; kg += p[i + 1]; kb += p[i + 2]; });
      kr /= n; kg /= n; kb /= n;
      for (var i = 0; i < p.length; i += 4) {
        var r = p[i], g = p[i + 1], b = p[i + 2];
        var dist = Math.sqrt((r - kr) * (r - kr) + (g - kg) * (g - kg) + (b - kb) * (b - kb));
        var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        var sat = mx === 0 ? 0 : (mx - mn) / mx;
        var lum = 0.299 * r + 0.587 * g + 0.114 * b;
        var a = 255;
        if (dist < 48) a = 0;
        else if (dist < 96) a = ((dist - 48) / 48) * 255;
        // also drop bright, near-grey pixels the corner-key misses (soft edge glow)
        if (a > 0 && sat < 0.11 && lum > 150) a = Math.min(a, Math.max(0, 255 - (lum - 150) * 3.5));
        p[i + 3] = a;
      }
      octx.putImageData(d, 0, 0);
      keyed = oc;
    } catch (e) {
      // canvas tainted (image served without CORS) — fall back to the raw render
      keyed = raw;
    }
  };
  raw.onerror = function () { keyed = null; };
  raw.src = stage.getAttribute("data-render") || "assets/img/device-black-teal.png";

  /* ---- offscreen scene ---- */
  var scene = document.createElement("canvas");
  var xctx = scene.getContext("2d");
  var t0 = performance.now();

  function viewport() {
    return {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight
    };
  }

  function draw(ctx, w, h, time) {
    var d = reduce ? 0 : time;
    ctx.clearRect(0, 0, w, h);

    var g = ctx.createRadialGradient(
      w * 0.5 + Math.sin(d * 0.00006) * w * 0.12,
      h * 0.40 + Math.cos(d * 0.00004) * h * 0.10, 0,
      w * 0.5, h * 0.45, Math.max(w, h) * 0.82
    );
    g.addColorStop(0, "#123c3b");
    g.addColorStop(0.5, "#0c2025");
    g.addColorStop(1, "#06090d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < 3; i++) {
      var bx = w * (0.28 + 0.22 * i) + (reduce ? 0 : Math.sin(d * 0.00009 + i * 1.7) * w * 0.16);
      var by = h * 0.5 + (reduce ? 0 : Math.cos(d * 0.00012 + i * 2.1) * h * 0.22);
      var rg = ctx.createRadialGradient(bx, by, 0, bx, by, w * 0.30);
      rg.addColorStop(0, "rgba(41,176,166,0.10)");
      rg.addColorStop(1, "rgba(41,176,166,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = "source-over";

    if (keyed && keyed.width) {
      var srcH = keyed.height || keyed.naturalHeight;
      var srcW = keyed.width || keyed.naturalWidth;
      var scale = (Math.min(w, h) / srcH) * (w < 760 ? 0.94 : 0.72);
      var iw = srcW * scale, ih = srcH * scale;
      var cx = w * (w < 760 ? 0.5 : 0.45) + (reduce ? 0 : Math.sin(d * 0.00015) * w * 0.02);
      var cy = h * 0.47 + (reduce ? 0 : Math.cos(d * 0.00011) * h * 0.028);
      var rot = reduce ? 0 : Math.sin(d * 0.00008) * 0.05;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 55;
      ctx.shadowOffsetY = 38;
      ctx.drawImage(keyed, -iw / 2, -ih / 2, iw, ih);
      ctx.restore();
    }

    var vg = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.22, w / 2, h / 2, Math.max(w, h) * 0.72);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(4,7,10,0.6)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  function frame(now) {
    // pause the whole pipeline once the hero has scrolled out of view
    var hb = stage.getBoundingClientRect();
    if (hb.bottom < 0 || hb.top > (window.innerHeight || 0)) {
      requestAnimationFrame(frame);
      return;
    }

    var v = viewport();
    var w = v.w, h = v.h;

    if (scene.width !== w) scene.width = w;
    if (scene.height !== h) scene.height = h;
    if (stage.width !== w) stage.width = w;
    if (stage.height !== h) stage.height = h;

    draw(xctx, w, h, now - t0);
    sctx.clearRect(0, 0, w, h);
    sctx.drawImage(scene, 0, 0);

    if (card && dup && dupWrap && dctx) {
      var r = card.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        // negative offset lands the duplicate over the viewport origin, so its
        // pixels register 1:1 with the real backdrop behind the card.
        dupWrap.style.left = (-r.left) + "px";
        dupWrap.style.top = (-r.top) + "px";
        dupWrap.style.width = w + "px";
        dupWrap.style.height = h + "px";
        if (dup.width !== w) dup.width = w;
        if (dup.height !== h) dup.height = h;
        dctx.clearRect(0, 0, w, h);
        dctx.drawImage(scene, 0, 0);
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
