/* Billdr — testimonial slider controls v1.0.1
   The arrows live in .heading_wrap (outside the native Webflow slider), so they drive it through
   its own dots. Adds follow-the-cursor drag (mouse, pen and touch) and horizontal wheel/trackpad paging.
   Only transform/state is touched from here — no layout values. */
(function(){
if(window.__billdrResultsCtl)return;window.__billdrResultsCtl=1;
function init(sec){
var slider=sec.querySelector('.results_slider'),mask=sec.querySelector('.results_slider-mask');
if(!slider||!mask||slider.__ctl)return;slider.__ctl=1;
var prev=sec.querySelector('[data-results-prev]'),next=sec.querySelector('[data-results-next]');
var n=mask.querySelectorAll('.w-slide').length;
var DUR=parseInt(slider.getAttribute('data-duration'),10)||500;
function dots(){return slider.querySelectorAll('.w-slider-dot')}
function cur(){var d=dots();for(var i=0;i<d.length;i++)if(d[i].classList.contains('w-active'))return i;return 0}
function go(i){if(i<0||i>=n||i===cur())return false;var d=dots()[i];if(!d)return false;d.click();return true}
function flag(b,off){if(!b)return;b.classList.toggle('is-disabled',off);b.setAttribute('aria-disabled',off?'true':'false')}
function sync(){var i=cur();flag(prev,i<=0);flag(next,i>=n-1)}
if(prev)prev.addEventListener('click',function(){go(cur()-1)});
if(next)next.addEventListener('click',function(){go(cur()+1)});
var nav=slider.querySelector('.w-slider-nav');
if(nav)new MutationObserver(sync).observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
sync();

/* no native image drag */
[].forEach.call(mask.querySelectorAll('img'),function(im){im.setAttribute('draggable','false')});
mask.addEventListener('dragstart',function(e){e.preventDefault()});

/* keep Webflow's own swipe out of it, or a drag would page twice */
['mousedown','touchstart'].forEach(function(t){mask.addEventListener(t,function(e){e.stopPropagation()},{passive:true})});

var down=false,axis=null,x0=0,y0=0,dx=0,pid=null,suppress=false;
function offset(v,anim){
mask.style.transition=anim?'transform '+DUR+'ms ease':'none';
mask.style.transform=v?'translate3d('+v+'px,0,0)':'';
}
mask.addEventListener('pointerdown',function(e){
if(e.pointerType==='mouse'&&e.button!==0)return;
down=true;axis=null;dx=0;x0=e.clientX;y0=e.clientY;pid=e.pointerId;
});
mask.addEventListener('pointermove',function(e){
if(!down||e.pointerId!==pid)return;
var mx=e.clientX-x0,my=e.clientY-y0;
if(!axis){
if(Math.abs(mx)<6&&Math.abs(my)<6)return;
axis=Math.abs(mx)>Math.abs(my)?'x':'y';
if(axis==='y'){down=false;return}
try{mask.setPointerCapture(pid)}catch(err){}
slider.setAttribute('data-dragging','');
}
var i=cur();
dx=((i<=0&&mx>0)||(i>=n-1&&mx<0))?mx*.3:mx; /* rubber-band at the ends */
offset(dx,false);
});
function end(e){
if(!down||(e&&e.pointerId!==pid))return;
down=false;
if(axis!=='x')return;
slider.removeAttribute('data-dragging');
suppress=true;setTimeout(function(){suppress=false},0);
var w=mask.getBoundingClientRect().width,th=Math.min(80,w*.15),i=cur();
if(dx<=-th)go(i+1);else if(dx>=th)go(i-1);
/* the slides animate over DUR with 'ease'; easing the drag offset back to 0 on the same curve
   makes the two sum to one continuous glide from where the cursor let go */
offset(0,true);
}
mask.addEventListener('pointerup',end);
mask.addEventListener('pointercancel',end);
/* touch: the browser implicitly captures the pointer on the child under the finger; moving capture to the
   mask fires lostpointercapture on that child, which bubbles here. Only the mask's own capture loss ends a drag. */
mask.addEventListener('lostpointercapture',function(e){if(e.target===mask)end(e)});
/* a drag that ends on a link or the play button must not also click it */
mask.addEventListener('click',function(e){if(suppress){e.preventDefault();e.stopPropagation()}},true);

/* trackpad / shift+wheel: one slide per gesture */
var acc=0,locked=false,quiet=null;
slider.addEventListener('wheel',function(e){
var h=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);
if(!h)return;
var i=cur();
if(!locked&&((h>0&&i>=n-1)||(h<0&&i<=0))){acc=0;return}
e.preventDefault();
clearTimeout(quiet);quiet=setTimeout(function(){locked=false;acc=0},200);
if(locked)return;
acc+=h;
if(Math.abs(acc)>=40){locked=true;acc=0;go(i+(h>0?1:-1))}
},{passive:false});
}
function boot(){[].forEach.call(document.querySelectorAll('.section_results'),init)}
window.Webflow=window.Webflow||[];window.Webflow.push(boot);
})();
