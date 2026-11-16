(function () {
  var me = document.currentScript;

  function boot() {
    /* Scope to this instance's own root so several tickers can coexist on a page. */
    var root = (me && me.closest && me.closest('.logo-ticker_pad')) ||
               document.querySelector('.logo-ticker_pad:not([data-ticker-init])');
    if (!root || root.getAttribute('data-ticker-init')) return;
    root.setAttribute('data-ticker-init', '1');

    var marquee = root.querySelector('.logo-ticker_marquee');
    var list    = root.querySelector('.logo-ticker_list');
    if (!marquee || !list) return;

    var SPEED   = 60;    /* px per second, constant however many clones we need */
    var EPSILON = 0.5;   /* px of drift we tolerate before re-syncing */

    /* One "set" is the original run of logos. Everything past index setCount is a clone. */
    var setCount = list.children.length;
    if (!setCount) return;

    /* ⛔ The logos ship as loading="lazy" with no width/height attrs and width:auto, so an
       undecoded one measures 0px wide. Everything below depends on real widths — go eager. */
    eagerize(list);

    var tpl = document.createElement('div');
    tpl.innerHTML = list.innerHTML;   /* snapshot AFTER eagerize, so clones inherit eager too */

    var sets    = 1;   /* sets currently in the track, always kept even once built */
    var applied = 0;   /* the shift the running animation is actually travelling */
    var dur     = 0;
    var lastMarqueeW = 0;
    var syncing = false;

    function eagerize(scope) {
      var imgs = scope.querySelectorAll('img');
      for (var i = 0; i < imgs.length; i++) {
        /* setAttribute, not .loading — the content attribute is what the loading algorithm
           reads, and flipping lazy→eager on an image whose load has not started begins it now. */
        if (imgs[i].getAttribute('loading') !== 'eager') imgs[i].setAttribute('loading', 'eager');
      }
      return imgs;
    }

    function marginRight(el) {
      var v = parseFloat(window.getComputedStyle(el).marginRight);
      return v || 0;
    }

    /* Width of one set, read off the LIVE first set — no innerHTML churn, so a re-measure can
       never knock an image back to its undecoded zero-width state. Includes the trailing margin,
       which scrollWidth drops. A running transform offsets both edges equally, so the difference
       stays exact and we never have to stop the animation to measure. */
    function measurePeriod() {
      var kids = list.children;
      if (kids.length < setCount) return 0;
      var first = kids[0], last = kids[setCount - 1];
      return last.getBoundingClientRect().right + marginRight(last) -
             first.getBoundingClientRect().left;
    }

    /* Exact half-track: first item → its clone halfway down the track. Subpixel-exact by
       construction, and immune to the list's own width (see trap 1). */
    function measureShift() {
      var kids = list.children;
      /* Needs an even, already-cloned track — before the first clone pass there is no boundary. */
      if (sets < 2 || sets % 2) return 0;
      var boundary = (sets / 2) * setCount;
      if (!kids[boundary]) return 0;
      return kids[boundary].getBoundingClientRect().left - kids[0].getBoundingClientRect().left;
    }

    function addSets(n) {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < n; i++) {
        var copy = tpl.cloneNode(true);
        while (copy.firstChild) frag.appendChild(copy.firstChild);
      }
      eagerize(frag);
      list.appendChild(frag);
      sets += n;
    }

    /* Fraction of the current cycle already travelled, so a re-sync can resume in place
       instead of snapping back to translateX(0). */
    function progress() {
      if (!dur || !list.getAnimations) return 0;
      var anims = list.getAnimations();
      for (var i = 0; i < anims.length; i++) {
        var t = anims[i].currentTime;
        if (typeof t === 'number') {
          var ms = dur * 1000;
          return ((t % ms) + ms) % ms / ms;
        }
      }
      return 0;
    }

    function sync() {
      if (syncing) return;
      syncing = true;

      var period = measurePeriod();
      if (period > 0) {
        /* One half of the track must always exceed the marquee, or the seam shows through. */
        var need = Math.ceil((marquee.offsetWidth + period) / period) * 2;
        if (need > sets) addSets(need - sets);
      }

      var shift = measureShift();
      if (shift > 0 && Math.abs(shift - applied) > EPSILON) {
        var ph = progress();
        applied = shift;
        dur = shift / SPEED;
        list.style.setProperty('--btk-shift', (-shift) + 'px');
        list.style.animation = 'btkLogoTicker ' + dur + 's linear infinite';
        /* Negative delay = start partway in, so the correction is invisible. */
        list.style.animationDelay = (-ph * dur) + 's';
        if (reduced.matches) list.style.animationPlayState = 'paused';
      }

      lastMarqueeW = Math.round(marquee.offsetWidth);
      syncing = false;
    }

    /* Re-sync whenever a logo finishes decoding — this is what catches the lazy-image pop that
       used to strand the track at a stale shift. */
    function watchImages() {
      var imgs = list.querySelectorAll('img');
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].complete) continue;
        imgs[i].addEventListener('load', schedule, { once: true });
        imgs[i].addEventListener('error', schedule, { once: true });
      }
    }

    var timer = null;
    function schedule() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { timer = null; watchImages(); sync(); }, 80);
    }

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    /* Hover-pause only where hovering is a real thing — on a phone a tap fires mouseenter and
       the marquee would sit paused until you tapped somewhere else. */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      marquee.addEventListener('mouseenter', function () { list.style.animationPlayState = 'paused'; });
      marquee.addEventListener('mouseleave', function () { list.style.animationPlayState = 'running'; });
    }
    if (reduced.addEventListener) reduced.addEventListener('change', function () {
      list.style.animationPlayState = reduced.matches ? 'paused' : 'running';
    });

    sync();
    watchImages();

    if (window.ResizeObserver) {
      /* Observe the MARQUEE, not the list: the list is pinned to the marquee's width, so this
         fires on real layout changes (orientation, container) and never on our own cloning. */
      new ResizeObserver(function () {
        /* Width-only guard: a mobile URL-bar collapse changes height only and must not re-sync. */
        if (Math.round(marquee.offsetWidth) === lastMarqueeW) return;
        sync();
      }).observe(marquee);
    } else {
      window.addEventListener('resize', function () {
        if (Math.round(marquee.offsetWidth) === lastMarqueeW) return;
        sync();
      });
    }

    /* Belt and braces for late webfont/layout settling and any decode the load events missed. */
    if (document.readyState !== 'complete') window.addEventListener('load', schedule);
    setTimeout(sync, 400);
    setTimeout(sync, 1500);
    setTimeout(sync, 4000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
