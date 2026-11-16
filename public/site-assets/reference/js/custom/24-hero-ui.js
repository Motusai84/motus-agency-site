(function(){
if(window.__billdrHeroUI)return;window.__billdrHeroUI=1;
var UI_Y=-28,CARD_Y=20,TICK_Y=24,
UI_T0=0.00,UI_T1=0.12,
CARD_T0=0.03,CARD_T1=0.15,
TICK_T0=0.00,TICK_T1=0.13;
function boot(){
var sec=document.querySelector('.section_hero');if(!sec)return;
if(matchMedia('(max-width:767px)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var C=sec.querySelector('.hero_content'),
K=sec.querySelector('.hero_card'),
T=sec.querySelector('.logo-ticker_pad');
if(!C&&!K&&!T)return;
function cl(v){return v<0?0:v>1?1:v}
function one(el,t0,t1,ty,p){
if(!el)return;
var u=cl((p-t0)/(t1-t0)),e=u*u;
el.style.opacity=String(1-e);
el.style.transform=u?'translate3d(0,'+(ty*e).toFixed(2)+'px,0)':'';
el.style.pointerEvents=(1-e)<0.05?'none':'';
}
function tick(){
var span=sec.offsetHeight-window.innerHeight,
p=span>0?cl(-sec.getBoundingClientRect().top/span):0;
one(C,UI_T0,UI_T1,UI_Y,p);
one(K,CARD_T0,CARD_T1,CARD_Y,p);
one(T,TICK_T0,TICK_T1,TICK_Y,p);
requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
