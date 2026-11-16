/* Mobile + tablet (<=991) scene playback + fluid scale.
   The driver is left ENABLED (do NOT set __billdrTabs, and do NOT pre-set data-bd-anim --
   every offstage scene rule is scoped to [data-bd-anim], so forcing that attribute on
   blanks every card).
   Its own auto-advance never starts here: it gates on an IntersectionObserver with
   threshold 0.25 watching .features_tabs, which once stacked is thousands of px tall in a
   viewport under ~1000px -- the ratio can never reach 0.25. That only skips the timer; PLAY
   still runs on demand. So we trigger per card instead: the most-visible card plays.
   Clicking a tab link is the driver's public entry point. */
(function(){
if(!matchMedia('(max-width:991px)').matches)return;
function boot(){
var sec=document.querySelector('.section_features');if(!sec)return;
var links=[].slice.call(sec.querySelectorAll('.w-tab-link'));
var panes=[].slice.call(sec.querySelectorAll('.w-tab-pane'));
if(!links.length||links.length!==panes.length)return;

/* --fs = paneWidth / 760. CSS cannot divide one length by another, so this factor has to
   be measured. It is a render scale for the animation, not layout spacing -- the pane's
   size still comes entirely from its Webflow classes. */
function fit(){for(var i=0;i<panes.length;i++){var w=panes[i].clientWidth;
if(w)panes[i].style.setProperty('--fs',(w/760).toFixed(5))}}
fit();
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(fit,150)},{passive:true});
if(window.ResizeObserver&&panes[0])new ResizeObserver(fit).observe(panes[0]);

if(!('IntersectionObserver' in window))return;
/* two cards can each be >55% visible at once, so pick the MOST visible rather than
   whichever entry happened to come last in the callback. */
var ratio=[],last=-1,i;
for(i=0;i<panes.length;i++)ratio[i]=0;
var io=new IntersectionObserver(function(es){
for(var k=0;k<es.length;k++){var j=panes.indexOf(es[k].target);if(j>=0)ratio[j]=es[k].intersectionRatio}
var best=-1,bv=0.55;
for(var n=0;n<ratio.length;n++){if(ratio[n]>bv){bv=ratio[n];best=n}}
/* track our own index rather than reading .w--current: the driver owns idx, and on load
   pane 0 is already marked current, which would otherwise suppress its first play */
if(best>=0&&best!==last){last=best;links[best].click()}
},{threshold:[0,0.25,0.4,0.55,0.7,0.85,1]});
panes.forEach(function(p){io.observe(p)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
