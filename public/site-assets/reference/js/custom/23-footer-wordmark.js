(function () {
  // Idempotent: each root carries its own guard, so re-running this script or
  // placing two instances both behave.
  var DURATION = 2400;                                     // ms, whole drawing
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(root) {
    if (root.__blwm) return; root.__blwm = true;

    var draws  = root.querySelectorAll('.bl-draw');         // 14 logo subpaths
    var hatch  = root.querySelectorAll('.bl-hatchfill');
    var hcol   = root.querySelectorAll('.bl-hatchcol');
    var gx = [root.querySelector('#bl-g0-r'), root.querySelector('#bl-g1-r')];  // horizontals
    var gy = [root.querySelector('#bl-g2-r'), root.querySelector('#bl-g3-r')];  // verticals

    function ease(t) { return t * t * (3 - 2 * t); }
    function seg(p, a, b) {
      if (p <= a) return 0; if (p >= b) return 1;
      return ease((p - a) / (b - a));
    }

    function render(p) {
      // Each guide draws along its own length: horizontals left-to-right,
      // verticals top-to-bottom, staggered so the frame builds rather than snaps.
      for (var g = 0; g < gx.length; g++)
        gx[g].setAttribute('width',  (1440 * seg(p, 0.00 + g * 0.04, 0.18 + g * 0.04)).toFixed(2));
      for (var v = 0; v < gy.length; v++)
        gy[v].setAttribute('height', (538  * seg(p, 0.07 + v * 0.04, 0.25 + v * 0.04)).toFixed(2));

      var n = draws.length;
      for (var i = 0; i < n; i++) {
        var s = 0.16 + (i / n) * 0.40;
        draws[i].setAttribute('stroke-dasharray', seg(p, s, s + 0.22).toFixed(4) + ' 1');
      }

      var h = seg(p, 0.70, 1.00);
      for (var j = 0; j < hatch.length; j++) hatch[j].setAttribute('fill-opacity', h.toFixed(3));
      for (var q = 0; q < hcol.length;  q++) hcol[q].setAttribute('opacity', h.toFixed(3));
    }

    if (reduce) { render(1); return; }
    render(0);

    var started = false;
    function play() {
      if (started) return; started = true;
      var t0 = 0;
      requestAnimationFrame(function step(now) {
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / DURATION);
        render(p);
        if (p < 1) requestAnimationFrame(step);            // stops at 1 — plays once
      });
    }

    if (!('IntersectionObserver' in window)) { play(); return; }

    // threshold 0 + a bottom inset fires as soon as it is meaningfully on screen.
    // A high threshold can be skipped entirely by an instant jump past the element.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { done(); play(); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(root);

    // A jump that skips the element entirely (anchor link, End key, restored
    // scroll position) never changes the intersection ratio off 0, so IO fires
    // no callback at all. Catch that case here and show the finished drawing
    // rather than blank space. Self-removing either way.
    function onScroll() {
      if (started) { done(); return; }
      if (root.getBoundingClientRect().bottom <= 0) { done(); started = true; render(1); }
    }
    function done() {
      io.disconnect();
      removeEventListener('scroll', onScroll);
    }
    addEventListener('scroll', onScroll, { passive: true });
  }

  function boot() { document.querySelectorAll('[data-bl-watermark]').forEach(init); }
  // Run NOW, not on DOMContentLoaded: this script sits directly after its own
  // markup, so the root is already parsed and render(0) lands before the first
  // paint. Deferring would flash the finished drawing before it animates.
  boot();
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
})();
