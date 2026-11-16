(function(){
if(window.__aiwfBob)return;window.__aiwfBob=1;
function boot(){
  var card=document.querySelector('.copilots_card[data-copilot-card="0"]');
  var stage=card&&card.querySelector('.aiwf_stage');
  if(!stage)return;
  var art=stage.querySelector('.aiwf_art'),
      comp=stage.querySelector('.aiwf_composer'),
      ctext=stage.querySelector('.aiwf_composer-text'),
      send=stage.querySelector('.aiwf_ibtn.is-send'),
      results=stage.querySelector('.aiwf_results'),
      boxes=[].slice.call(stage.querySelectorAll('.aiwf_box'));
  if(!art||!comp||!results)return;
  var ART_W=545, ART_H=420, TOP=46, PAD=24;
  var Q='Help me visualize my cashflow projections for the next 6 months given active projects and recent contracts signed.';
  /* SHELL = card shell -> its content; GAP = one card -> the next; STAGGER is
     the metric grid's own beat, which now runs as ONE staggered group rather
     than four cards waiting on each other. MOVE_HOLD lets the slide overlap
     the next card instead of stopping dead before it. */
  var TYPE=2900, SHELL=300, GAP=200, STAGGER=130, GTAIL=260,
      HEAD=200, CHART=860, MOVE_HOLD=380, HOLD=1800, FADE=420;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers=[], G=0;
  function wait(ms){return new Promise(function(r){timers.push(setTimeout(r,ms))})}
  function at(ms,fn){timers.push(setTimeout(fn,ms))}
  /* the artboard is authored at 545x420 and scaled to whatever the bed is,
     so nothing is ever clipped at a narrower breakpoint */
  function fit(){
    var w=stage.clientWidth,h=stage.clientHeight;
    if(!w||!h)return;
    art.style.setProperty('--aiwf-s',Math.min(w/ART_W,h/ART_H));
  }
  fit();
  if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);
  else addEventListener('resize',fit);
  /* The composer grows as the question is typed. The .32s height transition is
     dropped while .aiwf-typing is on (see the style block): rewriting height
     every frame restarted it on every tick, so the box chased a moving target
     and stuttered. It now steps one line at a time. */
  function grow(){comp.style.height='auto';comp.style.height=comp.scrollHeight+'px'}
  /* how far the answer must slide for this box to sit in frame */
  function need(box){return Math.max(0,box.offsetTop+box.offsetHeight+PAD-(ART_H-TOP))}
  function reset(){
    G++;timers.forEach(clearTimeout);timers=[];
    stage.classList.add('aiwf-notrans');
    comp.classList.remove('aiwf-in','aiwf-out','aiwf-typing');
    comp.style.height='';
    ctext.classList.remove('aiwf-typed');
    ctext.textContent='Type a message';
    if(send)send.classList.remove('aiwf-press');
    results.classList.remove('aiwf-fading');
    results.style.transform='';
    boxes.forEach(function(b){b.classList.remove('aiwf-show','aiwf-reveal','aiwf-card-in','aiwf-content-in')});
    void stage.offsetHeight;
    stage.classList.remove('aiwf-notrans');
  }
  function answer(my){
    var i=0,cur=0;
    /* how long to let the slide run before the next card starts landing */
    function slide(box){
      var t=need(box);
      if(t<=cur+1)return 0;
      cur=t;results.style.transform='translateY(-'+t+'px)';
      return MOVE_HOLD;
    }
    function step(){
      if(my!==G)return;
      if(i>=boxes.length){
        return wait(HOLD).then(function(){
          if(my!==G)return;
          results.classList.add('aiwf-fading');
          return wait(FADE).then(function(){if(my===G)play()});
        });
      }
      var box=boxes[i];
      /* the four metric tiles are one grid, so they stagger as a group; playing
         them strictly one-after-another is what read as slow */
      var par=box.parentNode,grp=null;
      if(par&&par.classList&&par.classList.contains('aiwf_metrics')){
        grp=boxes.filter(function(b){return b.parentNode===par});
      }
      if(grp&&grp.length>1){
        i+=grp.length;
        return wait(slide(grp[grp.length-1])).then(function(){
          if(my!==G)return;
          grp.forEach(function(b,k){
            at(k*STAGGER,function(){if(my===G)b.classList.add('aiwf-show')});
            at(k*STAGGER+SHELL,function(){if(my===G)b.classList.add('aiwf-reveal')});
          });
          return wait((grp.length-1)*STAGGER+SHELL+GTAIL).then(step);
        });
      }
      i++;
      return wait(slide(box)).then(function(){
        if(my!==G)return;
        if(box.classList.contains('is-chart')){
          box.classList.add('aiwf-show','aiwf-reveal');
          return wait(HEAD).then(function(){
            if(my!==G)return;
            box.classList.add('aiwf-card-in');
            return wait(SHELL);
          }).then(function(){
            if(my!==G)return;
            box.classList.add('aiwf-content-in');
            return wait(CHART);
          }).then(step);
        }
        box.classList.add('aiwf-show');
        return wait(SHELL).then(function(){
          if(my!==G)return;
          box.classList.add('aiwf-reveal');
          return wait(GAP);
        }).then(step);
      });
    }
    step();
  }
  function play(){
    reset();
    var my=G;
    if(reduced){
      comp.classList.add('aiwf-out');
      boxes.forEach(function(b){b.classList.add('aiwf-show','aiwf-reveal','aiwf-card-in','aiwf-content-in')});
      results.style.transform='translateY(-'+need(boxes[boxes.length-1])+'px)';
      return;
    }
    at(200,function(){if(my!==G)return;comp.classList.add('aiwf-in');grow()});
    at(1300,function(){
      if(my!==G)return;
      ctext.classList.add('aiwf-typed');
      ctext.innerHTML='<span class="aiwf_t"></span><i class="aiwf_caret"></i>';
      comp.classList.add('aiwf-typing');
      var span=ctext.querySelector('.aiwf_t'),t0=performance.now();
      (function type(){
        if(my!==G)return;
        /* driven off elapsed time, not per character, so the phrase always
           takes TYPE ms whatever the frame rate */
        var p=Math.min(1,(performance.now()-t0)/TYPE);
        span.textContent=Q.slice(0,Math.round(p*Q.length));
        grow();
        if(p<1)return timers.push(setTimeout(type,16));
        comp.classList.remove('aiwf-typing');
        at(560,function(){if(my===G&&send)send.classList.add('aiwf-press')});
        at(720,function(){if(my===G&&send)send.classList.remove('aiwf-press')});
        at(800,function(){if(my===G)comp.classList.add('aiwf-out')});
        at(1400,function(){if(my===G)answer(my)});
      })();
    });
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
