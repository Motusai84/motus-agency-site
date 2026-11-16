(function(){
if(window.__aiwfBillie)return;window.__aiwfBillie=1;
function boot(){
  var card=document.querySelector('.copilots_card[data-copilot-card="2"]');
  var stage=card&&card.querySelector('.aiwf_stage');
  if(!stage)return;
  var art=stage.querySelector('.aiwf_art');
  if(!art)return;
  var msgs=[].slice.call(stage.querySelectorAll('.aiwf_msg')),
      pills=stage.querySelector('.aiwf_pills'),
      cmp=stage.querySelector('.aiwf_cmp'),
      input=stage.querySelector('.aiwf_cmp-text'),
      send=stage.querySelector('.aiwf_ibtn.is-send');
  if(!msgs.length||!pills||!cmp||!input)return;
  stage.setAttribute('data-aiwf-anim','');
  var ART_W=545,ART_H=420,PH='Type a message';
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers=[],G=0;
  function wait(ms){return new Promise(function(r){timers.push(setTimeout(r,ms))})}
  function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
  function fit(){var w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;art.style.setProperty('--aiwf-s',Math.min(w/ART_W,h/ART_H))}
  fit();
  if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);else addEventListener('resize',fit);
  function reset(){
    G++;timers.forEach(clearTimeout);timers=[];
    msgs.forEach(function(m){m.classList.remove('aiwf-in')});
    pills.classList.remove('aiwf-in');
    cmp.classList.remove('aiwf-typing');
    if(send)send.classList.remove('aiwf-press');
    input.classList.remove('aiwf-typed');
    input.textContent=PH;
  }
  /* type the message out in the input, press send, and only then let it appear
     in the thread — the composer clears the way a real one would */
  function typeAndSend(i,dur,my){
    var text=msgs[i].querySelector('.aiwf_msg-bub').textContent.trim();
    cmp.classList.add('aiwf-typing');
    input.classList.add('aiwf-typed');
    var t0=performance.now();
    return new Promise(function(done){
      (function step(){
        if(my!==G)return done();
        var p=Math.min(1,(performance.now()-t0)/dur);
        input.innerHTML=esc(text.slice(0,Math.round(p*text.length)))+'<i class="aiwf_ccaret"></i>';
        if(p<1)timers.push(setTimeout(step,16));else done();
      })();
    }).then(function(){
      if(my!==G)return;
      return wait(340);
    }).then(function(){
      if(my!==G)return;
      cmp.classList.remove('aiwf-typing');
      if(send)send.classList.add('aiwf-press');
      return wait(170);
    }).then(function(){
      if(my!==G)return;
      if(send)send.classList.remove('aiwf-press');
      msgs[i].classList.add('aiwf-in');
      input.classList.remove('aiwf-typed');
      input.textContent=PH;
    });
  }
  async function play(){
    reset();
    var my=G;
    if(reduced){msgs.forEach(function(m){m.classList.add('aiwf-in')});pills.classList.add('aiwf-in');return}
    /* the run opens on Billie's greeting already sitting there, everything
       else staged out of sight */
    msgs[0].classList.add('aiwf-in');
    await wait(1400);if(my!==G)return;
    await typeAndSend(1,1500,my);if(my!==G)return;
    await wait(850);if(my!==G)return;msgs[2].classList.add('aiwf-in');
    await wait(950);if(my!==G)return;
    await typeAndSend(3,950,my);if(my!==G)return;
    await wait(800);if(my!==G)return;msgs[4].classList.add('aiwf-in');
    await wait(750);if(my!==G)return;msgs[5].classList.add('aiwf-in');
    await wait(700);if(my!==G)return;pills.classList.add('aiwf-in');
    await wait(3200);if(my!==G)return;
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
