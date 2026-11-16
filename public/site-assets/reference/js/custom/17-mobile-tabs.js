/* billdrmobiletabs v2.4.0 — autorotate + determinate ring for .section_mobile.
   The ring closes a full circle over the dwell, then holds until the tab switches.

   Writes ONLY state/animation properties — opacity, --bd-p, transition. No margin /
   padding / gap / sizing: layout belongs to Webflow classes.
   The active label colour is NOT set here: `.mobile_item-wrap.w--current` carries
   `color: var(--text-color-primary)` and the label inherits it. (That inheritance was
   blocked until `color` was removed from `.mobile_item`, which sat in between.)

   Traps carried from billdrfeaturestabs / billdronboardingtabs:
     · the driver owns `idx` and NEVER reads .w--current inside a click handler
     · advance via link.click() so Webflow's own handler does the switching
     · setTimeout, not rAF — a backgrounded tab never delivers a frame and would stall
     · panes are opacity-pinned against Webflow's 100ms fade on a programmatic click
     · an IntersectionObserver gates the timer so it only runs on screen */
(function () {
  var root = document.currentScript && document.currentScript.closest('.section_mobile');
  if (!root || root.getAttribute('data-mb-tabs') === '1') return;
  root.setAttribute('data-mb-tabs', '1');

  var DWELL = 6000;

  function boot() {
    var wrap = root.querySelector('.mobile_layout');
    if (!wrap) return;
    var links = [].slice.call(wrap.querySelectorAll('.mobile_item-wrap')),
        panes = [].slice.call(wrap.querySelectorAll('.mobile_tab-content'));
    if (links.length < 2) return;

    var rings = links.map(function (l) { return l.querySelector('.mobile_item-ring'); }),
        reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        timer = null, inView = false, idx = 0, i;

    function reset(el) {
      if (!el) return;
      el.style.transition = 'none';
      el.style.setProperty('--bd-p', '0%');
    }

    /* 0% → forced reflow → 100% with the transition armed. The reflow is load-bearing:
       without it the browser collapses both writes and nothing animates. */
    function fill(el) {
      if (!el) return;
      el.style.transition = 'none';
      el.style.setProperty('--bd-p', '0%');
      void el.offsetWidth;
      if (reduce) { el.style.setProperty('--bd-p', '100%'); return; }
      el.style.transition = '--bd-p ' + DWELL + 'ms linear, opacity 300ms ease';
      el.style.setProperty('--bd-p', '100%');
    }

    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    function paint(n) {
      stop();
      for (var k = 0; k < links.length; k++) {
        if (rings[k]) { reset(rings[k]); rings[k].style.opacity = (k === n) ? '1' : '0'; }
        if (panes[k]) panes[k].style.opacity = (k === n) ? '1' : '';
      }
      fill(rings[n]);
      if (reduce || !inView) return;
      timer = setTimeout(function () { go((n + 1) % links.length); }, DWELL);
    }

    function go(n) { idx = n; links[n].click(); paint(n); }

    for (i = 0; i < links.length; i++) (function (n) {
      links[n].addEventListener('click', function () {
        if (n === idx) return;
        idx = n;
        paint(n);
      });
    })(i);

    /* read the Designer's starting tab ONCE, here — never inside a click handler */
    var cur = -1;
    for (var j = 0; j < links.length; j++) {
      if (links[j].classList.contains('w--current')) { cur = j; break; }
    }
    if (cur === -1) { links[0].click(); idx = 0; } else { idx = cur; }

    if (!('IntersectionObserver' in window)) { inView = true; paint(idx); return; }
    new IntersectionObserver(function (es) {
      for (var k = 0; k < es.length; k++) {
        if (es[k].isIntersecting) {
          if (!inView) { inView = true; paint(idx); }
        } else if (inView) { inView = false; stop(); }
      }
    }, { threshold: 0.25 }).observe(root);

    paint(idx);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
