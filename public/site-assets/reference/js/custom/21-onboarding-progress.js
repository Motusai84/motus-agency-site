/* billdronboardingprogress v1.0.0 — scroll-driven stepper for .section_onboarding
   (Billdr Home). NOT a tab switcher: .onboarding_tabs-menu is position:sticky and the
   three .onboarding_card blocks are stacked beneath it, so this is a reading-progress
   spy over one continuous scroll.

     · the reading line = the BOTTOM of the sticky menu
     · active tab      = the last card whose top has passed that line
     · .progress-bar   = width 0%→100% across that card's own scroll span
     · at 100% the next card has arrived, so .is-active moves to it

   .progress-bar_wrap show/hide is written as an INLINE style on purpose: the rule
   required is `.onboarding_tab.is-active .progress-bar_wrap`, a descendant selector,
   which Webflow classes cannot express. Base opacity:0 lives on the class, so no FOUC.

   No width transition on .progress-bar — it is scrubbed by scroll and a transition
   would make it lag. rAF only throttles the scroll handler, it never drives a timer. */
(function () {
  var root = document.currentScript && document.currentScript.closest('.section_onboarding');
  if (!root || root.getAttribute('data-ob-prog') === '1') return;
  root.setAttribute('data-ob-prog', '1');

  function boot() {
    var menu = root.querySelector('.onboarding_tabs-menu'),
        content = root.querySelector('.onboarding_tabs-content'),
        tabs = [].slice.call(root.querySelectorAll('.onboarding_tab')),
        cards = content ? [].slice.call(content.querySelectorAll('.onboarding_card')) : [];
    if (!menu || !content || tabs.length < 2 || cards.length < 2) return;

    var n = Math.min(tabs.length, cards.length),
        wraps = [], bars = [], i;
    for (i = 0; i < n; i++) {
      wraps.push(tabs[i].querySelector('.progress-bar_wrap'));
      bars.push(tabs[i].querySelector('.progress-bar'));
    }

    function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    var lastA = -1, lastP = -1;

    function paint() {
      var line = menu.getBoundingClientRect().bottom,
          tops = [], k;
      for (k = 0; k < n; k++) tops.push(cards[k].getBoundingClientRect().top);
      var end = content.getBoundingClientRect().bottom,
          a = 0;
      for (k = 0; k < n; k++) if (tops[k] <= line) a = k;

      var before = tops[0] > line,
          segT = tops[a],
          segB = (a + 1 < n) ? tops[a + 1] : end,
          span = segB - segT,
          p = before ? 0 : (span > 0 ? cl((line - segT) / span) : (line >= segB ? 1 : 0));
      if (before) a = 0;

      var pr = Math.round(p * 1000) / 10;
      if (a === lastA && pr === lastP) return;
      lastA = a; lastP = pr;

      for (k = 0; k < n; k++) {
        var on = (k === a);
        tabs[k].classList[on ? 'add' : 'remove']('is-active');
        if (wraps[k]) wraps[k].style.opacity = on ? '1' : '0';
        if (bars[k]) bars[k].style.width = (on ? pr : (k < a ? 100 : 0)) + '%';
      }
    }

    var ticking = false;
    function req() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; paint(); });
    }

    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', req);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(req);

    /* .onboarding_tab is cursor:pointer, so make a click jump to that card */
    for (i = 0; i < n; i++) (function (k) {
      tabs[k].addEventListener('click', function () {
        var line = menu.getBoundingClientRect().bottom,
            top = cards[k].getBoundingClientRect().top,
            rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: pageYOffset + (top - line) + 1, behavior: rm ? 'auto' : 'smooth' });
      });
    })(i);

    paint();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
