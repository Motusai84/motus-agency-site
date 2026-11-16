(function(){
  var s = document.currentScript;
  var root = s && s.closest ? s.closest('.onboarding_notifs') : null;
  if (!root || root.getAttribute('data-notif-init')) return;
  root.setAttribute('data-notif-init','1');
  function init(){
    var list = root.querySelector('.onboarding_notifs-list');
    if (!list) return;
    var cards = list.querySelectorAll('.onboarding_notif');
    if (!cards.length) return;
    var BASE = 180, STEP = 150, CHIP_LAG = 260, BADGE_LAG = 340;
    Array.prototype.forEach.call(cards, function(card, i){
      var t = BASE + i * STEP;
      card.setAttribute('data-notif-card','');
      card.style.transitionDelay = t + 'ms';
      var chip = card.querySelector('.onboarding_notif-chip');
      if (chip) { chip.setAttribute('data-notif-chip',''); chip.style.transitionDelay = (t + CHIP_LAG) + 'ms'; }
      var badge = card.querySelector('.onboarding_notif-badge');
      if (badge) { badge.setAttribute('data-notif-badge',''); badge.style.transitionDelay = (t + BADGE_LAG) + 'ms'; }
    });
    var run = function(){ root.classList.add('is-in'); };
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(list);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init, { once: true }); }
  else { init(); }
})();
