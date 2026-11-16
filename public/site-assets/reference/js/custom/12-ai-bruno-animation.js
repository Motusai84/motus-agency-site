(function(){
if(window.__aiwfBruno)return;window.__aiwfBruno=1;
function boot(){
  var card=document.querySelector('.copilots_card[data-copilot-card="1"]');
  var stage=card&&card.querySelector('.aiwf_stage');
  if(!stage)return;
  var art=stage.querySelector('.aiwf_art');
  if(!art)return;
  var stages=[].slice.call(stage.querySelectorAll('.aiwf_bstage')),
      opts=[].slice.call(stage.querySelectorAll('.aiwf_bopt')),
      drag=stage.querySelector('.aiwf_bdrag'),
      upload=stage.querySelector('.aiwf_bupload'),
      prev=stage.querySelector('.aiwf_bprev'),
      cta=stage.querySelector('.aiwf_bcta'),
      items=[].slice.call(stage.querySelectorAll('.aiwf_bwork-item')),
      heads=[].slice.call(stage.querySelectorAll('.aiwf_bwork-ghead')),
      qrows=[].slice.call(stage.querySelectorAll('.aiwf_qrow'));
  /* hands the stage over from the no-JS poster frame to the animated regime */
  stage.setAttribute('data-aiwf-anim','');
  var ART_W=545,ART_H=420;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers=[],G=0;
  function wait(ms){return new Promise(function(r){timers.push(setTimeout(r,ms))})}
  /* authored at 545x420 and scaled to whatever the bed is, so nothing clips */
  function fit(){var w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;art.style.setProperty('--aiwf-s',Math.min(w/ART_W,h/ART_H))}
  fit();
  if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);else addEventListener('resize',fit);
  function show(n){stages.forEach(function(s){s.classList.toggle('aiwf-on',+s.getAttribute('data-aiwf-s')===n)})}
  function reset(){
    G++;timers.forEach(clearTimeout);timers=[];
    stages.forEach(function(s){s.classList.remove('aiwf-on')});
    opts.forEach(function(o){o.classList.remove('aiwf-in')});
    if(drag)drag.classList.remove('aiwf-in','aiwf-drop');
    if(upload)upload.classList.remove('aiwf-hot');
    if(prev)prev.classList.remove('aiwf-in');
    if(cta)cta.classList.remove('aiwf-press');
    items.concat(heads).forEach(function(el){el.classList.remove('aiwf-ok')});
    qrows.forEach(function(r){r.classList.remove('aiwf-in')});
  }
  /* the checklist runs to 2.1s, the figure printed on the card. Each row
     lands at its own CUMULATIVE time, so the per-row durations shown add up
     to their group head and the two heads add up to the total:
     .4+.3+.2+.5 = 1.4  |  .2+.2+.3 = 0.7  |  1.4+0.7 = 2.1 */
  var WORK_AT=[400,700,900,1400,1600,1800,2100],GROUP_AT=[1400,2100];
  async function play(){
    reset();
    var my=G,i;
    if(reduced){show(6);qrows.forEach(function(r){r.classList.add('aiwf-in')});return}
    show(1);
    for(i=0;i<opts.length;i++){await wait(i?150:320);if(my!==G)return;opts[i].classList.add('aiwf-in')}
    await wait(1500);if(my!==G)return;
    show(2);
    await wait(420);if(my!==G)return;if(drag)drag.classList.add('aiwf-in');
    await wait(880);if(my!==G)return;if(upload)upload.classList.add('aiwf-hot');
    await wait(300);if(my!==G)return;if(drag)drag.classList.add('aiwf-drop');
    await wait(120);if(my!==G)return;
    show(3);
    await wait(260);if(my!==G)return;if(prev)prev.classList.add('aiwf-in');
    await wait(1500);if(my!==G)return;if(cta)cta.classList.add('aiwf-press');
    await wait(200);if(my!==G)return;if(cta)cta.classList.remove('aiwf-press');
    await wait(480);if(my!==G)return;
    show(4);
    WORK_AT.forEach(function(t,k){timers.push(setTimeout(function(){if(my===G&&items[k])items[k].classList.add('aiwf-ok')},t+400))});
    GROUP_AT.forEach(function(t,k){timers.push(setTimeout(function(){if(my===G&&heads[k])heads[k].classList.add('aiwf-ok')},t+400))});
    await wait(3200);if(my!==G)return;
    show(5);
    await wait(1600);if(my!==G)return;
    show(6);
    for(i=0;i<qrows.length;i++){await wait(i?110:260);if(my!==G)return;qrows[i].classList.add('aiwf-in')}
    await wait(2600);if(my!==G)return;
    play();
  }
  stage.addEventListener('click',play);
  /* the run is owned by two conditions: the card is on screen AND the browser
     tab is frontmost. It starts the moment any part of the card shows
     (threshold 0.01, not 0.4) and stops dead in a background tab, where
     throttled timers desync the beats and burn CPU for nobody. */
  var inview=false,running=false;
  function sync(){
    var go=inview&&!document.hidden;
    if(go===running)return;
    running=go;
    if(go)play();else reset();
  }
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(function(es){
    es.forEach(function(e){inview=e.isIntersecting});
    sync();
  },{threshold:0.01}).observe(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
