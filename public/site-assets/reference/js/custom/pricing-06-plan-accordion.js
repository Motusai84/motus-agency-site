(function () {
  var me = document.currentScript;

  function boot() {
    var root = (me && me.closest && me.closest('.section_faq')) ||
               document.querySelector('.section_faq');
    if (!root || root.getAttribute('data-faq-init')) return;
    root.setAttribute('data-faq-init', '1');

    /* Rows whose Question prop is empty (an unused slot in 6-8) stay hidden. */
    var items = [].slice.call(root.querySelectorAll('.faq_item')).filter(function (item) {
      var q = item.querySelector('.faq_question');
      if (q && !q.textContent.trim()) { item.style.display = 'none'; return false; }
      return true;
    });
    if (!items.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function parts(item) {
      return {
        head:   item.querySelector('.faq_head'),
        answer: item.querySelector('.faq_answer'),
        vbar:   item.querySelector('.faq_icon-v'),
        dot:    item.querySelector('.faq_dot')
      };
    }

    function setOpen(item, open, animate) {
      var p = parts(item);
      item.classList.toggle('is-open', open);
      if (p.vbar) p.vbar.classList.toggle('is-open', open);
      if (p.dot)  p.dot.classList.toggle('is-open', open);
      if (p.head) p.head.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!p.answer) return;

      var target = open ? p.answer.scrollHeight : 0;
      if (!animate || reduce) {
        p.answer.style.transition = 'none';
        p.answer.style.height = target + 'px';
        void p.answer.offsetWidth;
        p.answer.style.transition = '';
      } else {
        p.answer.style.height = target + 'px';
      }
      /* Let an open panel reflow with its content once the transition ends. */
      if (open) {
        var done = function () {
          p.answer.style.height = 'auto';
          p.answer.removeEventListener('transitionend', done);
        };
        if (animate && !reduce) p.answer.addEventListener('transitionend', done);
        else p.answer.style.height = 'auto';
      }
    }

    function collapseAll(except) {
      items.forEach(function (other) {
        if (other === except) return;
        if (!other.classList.contains('is-open')) return;
        var a = other.querySelector('.faq_answer');
        /* height:auto cannot transition — pin it to a number first. */
        if (a) { a.style.height = a.scrollHeight + 'px'; void a.offsetWidth; }
        setOpen(other, false, true);
      });
    }

    items.forEach(function (item) {
      var p = parts(item);
      if (!p.head) return;
      p.head.setAttribute('role', 'button');
      p.head.setAttribute('tabindex', '0');
      p.head.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

      function toggle() {
        var willOpen = !item.classList.contains('is-open');
        if (willOpen) collapseAll(item);
        else if (p.answer) { p.answer.style.height = p.answer.scrollHeight + 'px'; void p.answer.offsetWidth; }
        setOpen(item, willOpen, true);
      }

      p.head.addEventListener('click', toggle);
      p.head.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });

      setOpen(item, item.classList.contains('is-open'), false);
    });

    /* Keep an open panel correct if the copy rewraps on resize. */
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      items.forEach(function (item) {
        var a = item.querySelector('.faq_answer');
        if (a && item.classList.contains('is-open')) a.style.height = 'auto';
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
