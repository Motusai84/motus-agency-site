/* Onboarding rail follows the active step (<=991).
   The section's own scroll-stepper toggles .is-active on .onboarding_tab as you scroll the
   page, but the rail is a horizontal scroller that can be wider than the screen, so a later
   step can be off to the right and invisible. Watch for the class moving and bring that tab
   into view. Read-only w.r.t. layout: this only sets scrollLeft on an already-scrollable
   element, and early-outs entirely when the rail does not overflow (e.g. wide tablets). */
(function(){
if(!matchMedia('(max-width:991px)').matches)return;
function boot(){
var menu=document.querySelector('.onboarding_tabs-menu');if(!menu)return;
if(!menu.querySelector('.onboarding_tab'))return;
var last=null,LEAD=16;
function sync(){
var a=menu.querySelector('.onboarding_tab.is-active');
if(!a||a===last)return;
last=a;
var max=menu.scrollWidth-menu.clientWidth;
if(max<=0)return;
var target=menu.scrollLeft+(a.getBoundingClientRect().left-menu.getBoundingClientRect().left)-LEAD;
target=Math.max(0,Math.min(target,max));
if(Math.abs(target-menu.scrollLeft)<2)return;
try{menu.scrollTo({left:target,behavior:'smooth'})}catch(e){menu.scrollLeft=target}
}
/* the stepper rewrites class lists on the tabs (and on the progress bars inside them),
   so filter to class changes and let sync() early-out when the active tab is unchanged */
new MutationObserver(sync).observe(menu,{subtree:true,attributes:true,attributeFilter:['class']});
sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
