(function(){
  var s = document.currentScript;
  var root = s && s.closest ? s.closest('.onboarding_files') : null;
  if (!root || root.getAttribute('data-files-init')) return;
  root.setAttribute('data-files-init','1');
  function init(){
    var grid = root.querySelector('.onboarding_files-grid');
    if (!grid) return;
    var tiles = grid.querySelectorAll('.onboarding_files-tile');
    if (!tiles.length) return;
    var BASE = 160, STEP = 110, BADGE_LAG = 300;
    Array.prototype.forEach.call(tiles, function(tile, i){
      var t = BASE + i * STEP;
      tile.setAttribute('data-files-tile','');
      tile.style.transitionDelay = t + 'ms';
      var badge = tile.querySelector('.onboarding_files-badge');
      if (badge) {
        badge.setAttribute('data-files-badge','');
        badge.style.transitionDelay = (t + BADGE_LAG) + 'ms';
      }
    });
    var run = function(){ root.classList.add('is-in'); };
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(grid);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init, { once: true }); }
  else { init(); }
})();
