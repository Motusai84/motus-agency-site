(function(){
if(window.__billdrScatter)return;window.__billdrScatter=1;
var TOTAL=356,CH=240,RS=80,RV=36,SCRUB=0.7,TRAVEL=0.65;
var BG_END=0.18,WORD_END=0.58,WORD_DUR=0.10,MASK=115,WORD_EASE='power3.out',
SCALE_FROM=1.2,SCALE_WORD=12,SCALE_END=0.88,SCALE_EASE='power2.inOut',
A_SCALE=0.6,A_ALPHA=0.45,A_EASE='power2.out',PERSP=1100,RY=26,RX=18,RZ=5,A_END=0.66;
var RISE_END=0.46,RISE=90,
CFADE0=0.00,CFADE1=0.26,FADE_EASE='power1.in',
CV_START=0.02,CV_END=0.42,CV_EASE='power1.in',
CV_SCALE=0.30,CV_LIFT=0.16,CV_RISE=40,
CV_FADE0=0.85,CV_FADE1=1.00,
CV_WORD='billdr';
var RC_START=0.34,RC_END=0.50,RC_DUR=0.12,RC_PER=4,RC_EASE='power3.out',BGW0=0.55,BGW1=0.95;
var SR_Y=60,SR_EASE='power2.out',SR_FADE=620,SR_EYEBROW=85,
SEL_FEAT='.section_features',
SEL_HEAD='.heading_group.is-features .features_headline',
SEL_EYE='.heading_group.is-features .heading_eyebrow',
SEL_COPY='.problem_resolve .features_headline',
SEL_LAYER='.problem_resolve';
function boot(){
if(!window.gsap||!window.ScrollTrigger){return setTimeout(boot,60);}
gsap.registerPlugin(ScrollTrigger);
var sec=document.querySelector('.section_problem');if(!sec)return;
var ART=[
{s:'.problem_item.is-xls',          d:[-0.826,-0.563],t:0.03},
{s:'.problem_item.is-mail',         d:[-0.059,-0.998],t:0.055},
{s:'.problem_bubble.is-westmount',  d:[ 0.874,-0.486],t:0.08},
{s:'.problem_bubble.is-job247',     d:[-0.995,-0.101],t:0.105},
{s:'.problem_item.is-pdf-invoice',  d:[ 0.996,-0.004],t:0.13},
{s:'.problem_bubble.is-site-today', d:[-0.727, 0.687],t:0.155},
{s:'.problem_item.is-qb',           d:[ 0.893, 0.450],t:0.18},
{s:'.problem_item.is-pdf-plans',    d:[-0.908, 0.419],t:0.205},
{s:'.problem_item.is-photos',       d:[ 0.499, 0.867],t:0.23}
];
function c(f){return f*CH/TOTAL}
function r(f){return (CH+f*RS)/TOTAL}
function v(f){return (CH+RS+f*RV)/TOTAL}
function stag(span,dur,n){return (span-dur)/Math.max(1,n-1)}
function grp(span,dur,n,per){var s=(span-dur)/Math.max(1,Math.ceil(n/per)-1);
return function(i){return Math.floor(i/per)*s}}
function travel(){return Math.max(window.innerWidth,window.innerHeight)*TRAVEL}
function split(el){
var frag=document.createDocumentFragment(),out=[],pending=null;
function word(text,cls){
var a=document.createElement('span');a.className='reveal-word';
var b=document.createElement('span');
b.className='reveal-word-in'+(cls?' '+cls:'')+(pending?' features_headline-glyph':'');
if(pending){b.appendChild(pending);pending=null}
b.appendChild(document.createTextNode(text));
a.appendChild(b);
if(text.toLowerCase().replace(/[^a-z]/g,'')===CV_WORD)a.setAttribute('data-converge-target','');
frag.appendChild(a);frag.appendChild(document.createTextNode(' '));out.push(b)}
function walk(node,cls){
var kids=[].slice.call(node.childNodes);
for(var i=0;i<kids.length;i++){var n=kids[i];
if(n.nodeType===3){var w=(n.nodeValue||'').split(/\s+/);
for(var j=0;j<w.length;j++)if(w[j])word(w[j],cls)}
else if(n.nodeName==='BR')frag.appendChild(document.createElement('br'));
else if(n.nodeName==='IMG')pending=n.cloneNode(true);
else walk(n,(cls+' '+(n.getAttribute('class')||'')).trim())}}
walk(el,'');
while(el.firstChild)el.removeChild(el.firstChild);
el.appendChild(frag);
return out}
function from(d,sg){return{x:function(){return d[0]*travel()},y:function(){return d[1]*travel()},
scale:A_SCALE,autoAlpha:A_ALPHA,transformPerspective:PERSP,
rotationY:d[0]*RY,rotationX:-d[1]*RX,rotation:sg*RZ}}
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',function(){
var cw=[],rw=[];
[].slice.call(sec.querySelectorAll('.problem_scene .problem_line')).forEach(function(l){cw=cw.concat(split(l))});
var srcHead=document.querySelector(SEL_HEAD),resolveP=document.querySelector(SEL_COPY),
headHTML=srcHead?srcHead.innerHTML:'',copyHTML=resolveP?resolveP.innerHTML:'';
if(srcHead&&resolveP){
resolveP.innerHTML=headHTML;
split(srcHead);
rw=split(resolveP);
}
gsap.set(cw.concat(rw),{yPercent:MASK});
gsap.set('.problem_statement',{transformOrigin:'50% 50%'});
var layer=document.querySelector(SEL_LAYER),layerHome=layer&&layer.parentNode;
if(layer){document.body.appendChild(layer);
layer.style.position='fixed';layer.style.inset='0';layer.style.zIndex='40';}
var sels=ART.map(function(a){return a.s});
var tl=gsap.timeline({scrollTrigger:{trigger:sec,start:'top top',end:'bottom bottom',
scrub:SCRUB,invalidateOnRefresh:true}});
tl.fromTo('.problem_bg',{autoAlpha:0},{autoAlpha:1,ease:'none',duration:c(BG_END)},0);
tl.fromTo(cw,{yPercent:MASK},{yPercent:0,ease:WORD_EASE,duration:c(WORD_DUR),immediateRender:true,
stagger:{each:stag(c(WORD_END),c(WORD_DUR),cw.length)}},0);
var so=SCALE_WORD*stag(WORD_END,WORD_DUR,cw.length);
tl.fromTo('.problem_statement',{scale:SCALE_FROM},{scale:1,ease:SCALE_EASE,
duration:c(SCALE_END)-c(so)},c(so));
ART.forEach(function(a,i){
tl.fromTo(a.s,from(a.d,i%2===0?1:-1),
{x:0,y:0,scale:1,autoAlpha:1,rotationX:0,rotationY:0,rotation:0,
ease:A_EASE,duration:c(A_END)-c(a.t)},c(a.t));
});
tl.to('.problem_statement',{y:-RISE,ease:'none',duration:r(RISE_END)-r(0)},r(0));
tl.to('.problem_statement',{autoAlpha:0,ease:FADE_EASE,duration:r(CFADE1)-r(CFADE0)},r(CFADE0));
var cvS=r(CV_START),cvD=r(CV_END)-cvS,lanes={};
function untranslatedRect(el){
var k={x:gsap.getProperty(el,'x'),y:gsap.getProperty(el,'y'),scale:gsap.getProperty(el,'scale')};
gsap.set(el,{x:0,y:0,scale:1});
var b=el.getBoundingClientRect();
gsap.set(el,k);
return b}
function lane(el,i){
var a=untranslatedRect(el),
t=document.querySelector('.problem_resolve [data-converge-target]')||document.querySelector('.problem_scene'),
b=t.getBoundingClientRect(),
ox=b.left+b.width/2-(a.left+a.width/2),
oy=b.top+b.height/2-(a.top+a.height/2),
u=Math.hypot(ox,oy)||1,
d=CV_LIFT*u*(i%2===0?1:-1);
return {tx:ox,ty:oy,cx:ox/2+(-oy/u)*d,cy:oy/2+(ox/u)*d-CV_RISE}}
ART.forEach(function(a,i){
var el=document.querySelector(a.s);if(!el)return;
var p={t:0};
tl.to(p,{t:1,ease:CV_EASE,duration:cvD,onUpdate:function(){
var L=lanes[a.s]||(lanes[a.s]=lane(el,i)),t=p.t,m=1-t;
gsap.set(el,{x:2*m*t*L.cx+t*t*L.tx,y:2*m*t*L.cy+t*t*L.ty,scale:1+(CV_SCALE-1)*t});
}},cvS);
});
tl.to(sels,{autoAlpha:0,ease:FADE_EASE,duration:cvD*(CV_FADE1-CV_FADE0)},cvS+cvD*CV_FADE0);
var clear=function(){lanes={}};
ScrollTrigger.addEventListener('refresh',clear);
var span=v(RC_END)-r(RC_START),dur=span*RC_DUR;
tl.to(rw,{yPercent:0,ease:RC_EASE,duration:dur,stagger:grp(span,dur,rw.length,RC_PER)},r(RC_START));
tl.to('.problem_bg',{autoAlpha:0,ease:'none',duration:v(BGW1)-v(BGW0)},v(BGW0));
tl.set({},{},1);
var feat=document.querySelector(SEL_FEAT),
head=document.querySelector(SEL_HEAD),
eye=document.querySelector(SEL_EYE),
copy=document.querySelector(SEL_COPY),tick=null,natural=null;
if(feat&&head&&copy){
var swap=[head,eye].filter(Boolean),
ease=gsap.parseEase(SR_EASE),cl=gsap.utils.clamp(0,1);
gsap.set(swap,{autoAlpha:0});
gsap.set(feat,{autoAlpha:0,y:SR_Y});
/* LCP guard (2026-09-25): the fixed resolve copy stays hidden until its words start revealing, so its masked text never counts as the page's Largest Contentful Paint. */
var rvT=r(RC_START)-0.001;function rv(){return tl.time()>=rvT?1:0}
gsap.set(copy,{autoAlpha:0});
function rest(){if(!natural){gsap.set(copy,{x:0,y:0});natural=copy.getBoundingClientRect()}return natural}
tick=function(){
var fr=feat.getBoundingClientRect();
if(fr.top>=window.innerHeight){
gsap.set(feat,{y:SR_Y,autoAlpha:0});gsap.set(copy,{y:0,autoAlpha:rv()});gsap.set(swap,{autoAlpha:0});return}
if(fr.top<=0){
gsap.set(feat,{y:0,autoAlpha:1});gsap.set(copy,{autoAlpha:0});gsap.set(swap,{autoAlpha:1});return}
var hr=head.getBoundingClientRect(),
p=rest().top,
fy=gsap.getProperty(feat,'y')||0,
m=hr.top-fy,
x=m-p,
g=ease(cl(1-x/SR_FADE));
gsap.set(feat,{y:SR_Y*(1-g),autoAlpha:g});
var crossed=x<=0||fr.top<=0;
gsap.set(copy,{y:0,autoAlpha:crossed?0:rv()});
gsap.set(head,{autoAlpha:+!!crossed});
if(eye)gsap.set(eye,{autoAlpha:cl(1-x/SR_EYEBROW)});
};
gsap.ticker.add(tick);
}
var clearRest=function(){natural=null};
ScrollTrigger.addEventListener('refresh',clearRest);
return function(){ScrollTrigger.removeEventListener('refresh',clear);
ScrollTrigger.removeEventListener('refresh',clearRest);
if(srcHead)srcHead.innerHTML=headHTML;
if(resolveP)resolveP.innerHTML=copyHTML;
if(tick)gsap.ticker.remove(tick);
if(layer&&layerHome){layer.style.position='';layer.style.inset='';layer.style.zIndex='';
layerHome.appendChild(layer)}
gsap.set([feat,head,eye].filter(Boolean),{clearProps:'all'});
if(tl.scrollTrigger)tl.scrollTrigger.kill();tl.kill()};
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ScrollTrigger.refresh()});
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}
})();
