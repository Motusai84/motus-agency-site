(function(){
  var s = document.currentScript;
  var root = s && s.closest ? s.closest('.onboarding_meet') : null;
  if (!root || root.getAttribute('data-meet-init')) return;
  root.setAttribute('data-meet-init','1');
  function init(){
    var card = root.querySelector('.onboarding_meet-card');
    if (!card) return;
    card.setAttribute('data-meet-card','');
    var order = ['.onboarding_meet-title','.onboarding_meet-headtext .onboarding_meet-meta','.onboarding_meet-avatar','.onboarding_meet-quote','.onboarding_meet-actions'];
    var BASE = 240, STEP = 85;
    order.forEach(function(sel, i){
      var el = card.querySelector(sel);
      if (!el) return;
      el.setAttribute('data-meet-anim','');
      el.style.transitionDelay = (BASE + i * STEP) + 'ms';
    });
    var run = function(){ root.classList.add('is-in'); };
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(card);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init, { once: true }); }
  else { init(); }
})();
