(function(){
if(window.__billdrNav)return;window.__billdrNav=1;
function init(){
  document.querySelectorAll('.navbar_component').forEach(function(nav){
    var b=nav.querySelector('.navbar_burger'),p=nav.querySelector('.navbar_menu');
    if(!b||!p||b.dataset.bound)return;b.dataset.bound='1';
    // close every open mega menu through Webflow's own dropdown API so its internal state stays in sync
    function closeAll(){var $=window.jQuery;if($)$(p).find('.w-dropdown').triggerHandler('w-close.w-dropdown');}
    function set(o){b.classList.toggle('is-open',o);p.classList.toggle('is-open',o);b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Close menu':'Menu');document.documentElement.classList.toggle('nav-locked',o);if(!o){closeAll();p.scrollTop=0;}}
    b.setAttribute('role','button');b.setAttribute('tabindex','0');set(false);
    b.addEventListener('click',function(){set(!p.classList.contains('is-open'));});
    b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!p.classList.contains('is-open'));}});
    p.addEventListener('click',function(e){if(p.classList.contains('is-open')&&e.target.closest('a[href]'))set(false);});
    window.addEventListener('resize',function(){if(window.innerWidth>991&&p.classList.contains('is-open'))set(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&p.classList.contains('is-open'))set(false);});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
