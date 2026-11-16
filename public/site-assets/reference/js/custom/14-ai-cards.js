(function () {
  var me = document.currentScript;

  function boot() {
    var root = (me && me.closest && me.closest('.section_copilots')) ||
               document.querySelector('.section_copilots');
    if (!root || root.getAttribute('data-copilots-init')) return;
    root.setAttribute('data-copilots-init', '1');

    var nav   = root.querySelector('.copilots_nav');
    var tabs  = [].slice.call(root.querySelectorAll('.copilots_tab'));
    var cards = [].slice.call(root.querySelectorAll('.copilots_card'));
    if (!nav || !tabs.length || !cards.length) return;

    var reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = -1;
    var ticking = false;
    var gen     = 0;   /* bumping this cancels any run in flight */

    function mark(el, on) { if (el) el.classList.toggle('is-active', on); }

    function setActive(i) {
      if (i === current) return;
      current = i;
      tabs.forEach(function (tab, n) {
        var on = n === i;
        mark(tab, on);
        mark(tab.querySelector('.copilots_tab-label'), on);
        mark(tab.querySelector('.copilots_tab-dot'), on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
      });
      cards.forEach(function (card, n) { mark(card, n === i); });
    }

    function stickyTop() {
      var t = parseFloat(getComputedStyle(nav).top);
      return isNaN(t) ? 96 : t;
    }

    /* Scrolling DOWN: the last card whose top has reached the nav — it activates the
       moment it sits flush, which is what "no y offset" means. */
    function flushIdx() {
      var line = nav.getBoundingClientRect().top + 1, idx = 0;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().top <= line) idx = i;
      }
      return idx;
    }

    /* Scrolling UP: whichever card covers most of the band under the nav. Going up, the
       previous card reappears as a sliver at the top long before it takes over, so the
       flush rule would hand the highlight back far too early. */
    function areaIdx() {
      var top = stickyTop(), bot = window.innerHeight, best = -1, bestA = 0;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        var a = Math.max(0, Math.min(r.bottom, bot) - Math.max(r.top, top));
        if (a > bestA) { bestA = a; best = i; }
      }
      return best;
    }

    var lastY = window.pageYOffset;

    function pick() {
      var y = window.pageYOffset, down = y >= lastY;
      lastY = y;
      var f = flushIdx();
      if (down) return f;
      var a = areaIdx();
      return a < 0 ? f : a;   /* a < 0 = section off screen, clamp to the flush rule */
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; setActive(pick()); });
    }

    /* px this card still needs to move to sit flush under the nav */
    function delta(i) { return cards[i].getBoundingClientRect().top - stickyTop(); }

    /* Exponential ease-out toward a LIVE target: each frame we re-read the remaining
       distance and close a fraction of it. Because the target is re-measured rather
       than precomputed, anything that shifts the document mid-scroll is absorbed
       smoothly instead of surfacing as a jump at the end. */
    function glide(i) {
      var my = ++gen;
      var t0 = performance.now();
      (function step() {
        if (my !== gen) return;                  /* superseded, or user took over */
        var d = delta(i);
        if (Math.abs(d) < 0.5 || performance.now() - t0 > 1500) {
          if (my === gen && Math.abs(d) < 40) window.scrollBy({ top: d, behavior: 'auto' });
          return;                                /* sub-pixel landing, invisible */
        }
        var stepPx = d * 0.16;
        if (Math.abs(stepPx) < 0.6) stepPx = d;  /* don't crawl the last pixel */
        window.scrollBy({ top: stepPx, behavior: 'auto' });
        requestAnimationFrame(step);
      })();
    }

    function goTo(i) {
      if (reduce) { gen++; window.scrollBy({ top: delta(i), behavior: 'auto' }); return; }
      glide(i);
    }

    /* the moment the user scrolls themselves, stop driving */
    function yield_() { gen++; }
    addEventListener('wheel', yield_, { passive: true });
    addEventListener('touchstart', yield_, { passive: true });

    nav.setAttribute('role', 'tablist');
    tabs.forEach(function (tab, i) {
      var last = tabs.length - 1;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '-1');
      tab.addEventListener('click', function () { goTo(i); });
      tab.addEventListener('keydown', function (e) {
        var k = e.key, j = -1;
        if (k === 'Enter' || k === ' ') j = i;
        else if (k === 'ArrowDown' || k === 'ArrowRight') j = Math.min(i + 1, last);
        else if (k === 'ArrowUp' || k === 'ArrowLeft') j = Math.max(i - 1, 0);
        if (j < 0) return;
        e.preventDefault();
        tabs[j].focus();
        goTo(j);
      });
    });

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    setActive(pick());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
