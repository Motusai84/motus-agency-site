(function(){
if(window.__billdrTabs)return;window.__billdrTabs=1;
var me=document.currentScript;
var HIT='.features_scene-card,.features_scene-tcard,.features_scene-qbox,.features_scene-sendbtn,.features_scene-abtn,.features_scene-tmrow,.features_scene-tkbox,.features_scene-paybtn';

var STAG=200, MSTAG=130, ESTAG=150, PSTAG=130, ZOOM=1.12, HOTX=7, HOTY=3, IDLE=6000;
/* Each tab's beats from the prototype. A tab's total IS its dwell - one clock
   drives both the progress rule and the auto-advance, so they cannot drift.
   The seven totals sum to 52550ms: the prototype's 53350 minus tab 7's
   dropped capture beat (it now taps Done instead of taking a shot). */
var T={stack:STAG*3+900,cursorIn:320,travel:1100,click:160,release:300,hold:900};
var LEADS=T.stack+T.cursorIn+T.travel+T.click+T.release+T.hold;
var Q={fadeOut:220,stack:STAG*2+900,toCard:1100,click:300,reveal:650,toField:800,
       type:1300,settle:450,scroll:1300,toSend:800,send:500,hold:900};
var QUOTE=Q.fadeOut+Q.stack+Q.toCard+Q.click+Q.reveal+Q.toField+Q.type+Q.settle+
          Q.scroll+Q.toSend+Q.send+Q.hold;
var W={fadeOut:220,cardIn:750,toAccept:1000,click:320,swap:650,write:2050,toSign:800,
       sign:500,hold:900};
var WIN=W.fadeOut+W.cardIn+W.toAccept+W.click+W.swap+W.write+W.toSign+W.sign+W.hold;
var TM={fadeOut:220,cardIn:450,members:MSTAG*4+550,toMember:900,click:320,toGantt:700,
        toTask:950,toTasks:650,toCheck:800,cascade:900,hold:1100};
var TEAM=TM.fadeOut+TM.cardIn+TM.members+TM.toMember+TM.click+TM.toGantt+TM.toTask+
         TM.click+TM.toTasks+TM.toCheck+TM.click+TM.cascade+TM.hold;
var BL={fadeOut:220,receiptIn:550,scan:2000,settle:350,swap:600,rows:ESTAG*2+500,hold:1100};
var BILL=BL.fadeOut+BL.receiptIn+BL.scan+BL.settle+BL.swap+BL.rows+BL.hold;
var IV={fadeOut:220,cardIn:1250,swap:650,rows:PSTAG*3+500,toPay:800,click:400,hold:1000};
var INVOICE=IV.fadeOut+IV.cardIn+IV.swap+IV.rows+IV.toPay+IV.click+IV.hold;
var FD={fadeOut:220,phoneIn:900,hold1:500,pan:1550,beforeTap:600,tap:620,appOpen:950,
        beforeDone:900,toForm:950,beforeSave:700,save:700,toLogs:1000,hold:1100};
var FIELD=FD.fadeOut+FD.phoneIn+FD.hold1+FD.pan+FD.beforeTap+FD.tap+FD.appOpen+
          FD.beforeDone+FD.tap+FD.toForm+FD.beforeSave+FD.tap+FD.save+
          FD.toLogs+FD.hold;
/* Keyed by the scene's OWN identity (data-bd-scene), never by tab order, so
   reordering or inserting tabs in the Designer cannot desync the timings. An
   unrecognised or missing key simply falls back to IDLE with no scene. */
var DUR={leads:LEADS,quote:QUOTE,win:WIN,team:TEAM,bill:BILL,invoice:INVOICE,field:FIELD};

var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var seq=[],timer=null,visible=false,hoverRaf=0,idx=-1,root,wrap,links,panes;
function at(ms,fn){seq.push(setTimeout(fn,ms))}
function clearSeq(){seq.forEach(clearTimeout);seq=[];cancelAnimationFrame(hoverRaf)}
function q(p,s){return p.querySelector(s)}

/* the cursor is a real bound element in each visual; nothing is injected */
function cursorOf(pane){var v=q(pane,'.features_tab-visual');return v?q(v,'.features_scene-cursor'):null}
function resetCursor(c){if(!c)return;c.classList.remove('is-show','is-click','is-hover');c.style.transition='none';c.style.transform='translate(-40px,700px)'}
/* hit-test each frame so the hand appears exactly when the tip is over a target */
function watchHover(c){cancelAnimationFrame(hoverRaf);var step=function(){
 var r=c.getBoundingClientRect(),el=document.elementFromPoint(r.left+HOTX,r.top+HOTY);
 if(el&&el.closest(HIT)){c.classList.add('is-hover');return}
 hoverRaf=requestAnimationFrame(step)};hoverRaf=requestAnimationFrame(step)}
function cursorTo(c,v,el,fx,fy,dur,scale,ox,oy){
 if(!c||!v||!el)return;
 var vb=v.getBoundingClientRect(),cb=el.getBoundingClientRect();
 var x=(cb.left-vb.left)+cb.width*fx,y=(cb.top-vb.top)+cb.height*fy;
 if(scale){x=ox+(x-ox)*scale;y=oy+(y-oy)*scale}
 c.style.transition='transform '+dur+'ms cubic-bezier(.3,.8,.3,1)';
 c.style.transform='translate('+(x-HOTX)+'px,'+(y-HOTY)+'px)';
 c.classList.add('is-show');watchHover(c)}
function press(c,el,ms){ms=ms||130;
 if(c)c.classList.add('is-click');
 if(el)el.classList.add('is-press');
 at(ms,function(){if(el)el.classList.remove('is-press')});
 at(ms+170,function(){if(c)c.classList.remove('is-click')})}

function rewind(pane){
 var st=q(pane,'.features_scene-stack'),ph=q(pane,'.features_tab-photo'),
     tpl=q(pane,'.features_scene-templates'),quote=q(pane,'.features_scene-quote');
 resetCursor(cursorOf(pane));
 if(st){st.classList.remove('is-in','is-done');st.style.transform='scale(1)';
  [].slice.call(st.children).forEach(function(k){k.classList.remove('is-press','is-picked')});
  void st.offsetWidth}
 if(tpl){tpl.classList.remove('is-in','is-done','is-off');
  [].slice.call(tpl.children).forEach(function(k){k.classList.remove('is-press','is-picked')});
  void tpl.offsetWidth}
 if(quote){quote.classList.remove('is-on','is-enter');
  var sc=q(quote,'.features_scene-qscroll');
  if(sc){sc.style.transition='none';sc.style.transform='translateY(0)';void sc.offsetWidth;sc.style.transition=''}
  var row=quote.querySelectorAll('.features_scene-qrow')[1];
  if(row){var box=q(row,'.features_scene-c-lab .features_scene-qbox'),
              val=box&&q(box,'.features_scene-qval'),
              tot=q(row,'.features_scene-c-tot');
   if(box)box.classList.remove('is-editing');
   if(val)val.textContent='$75';
   if(tot)tot.textContent='$705.00'}
  var sb=q(quote,'.features_scene-sendbtn');if(sb)sb.classList.remove('is-press')}
 var act=q(pane,'.features_scene-actions'),sign=q(pane,'.features_scene-signcard');
 if(act){act.classList.remove('is-on','is-enter');void act.offsetWidth}
 if(sign){sign.classList.remove('is-on','is-enter','is-writing');void sign.offsetWidth}
 [].slice.call(pane.querySelectorAll('.features_scene-abtn')).forEach(function(b){b.classList.remove('is-press')});
 var team=q(pane,'.features_scene-team'),gantt=q(pane,'.features_scene-gantt'),tasks=q(pane,'.features_scene-tasks');
 if(team){team.classList.remove('is-on','is-enter','is-in');
  [].slice.call(team.querySelectorAll('.features_scene-tmrow')).forEach(function(r){r.classList.remove('is-press')});
  void team.offsetWidth}
 if(gantt){gantt.classList.remove('is-on','is-enter');void gantt.offsetWidth}
 var rec=q(pane,'.features_scene-receipt'),exp=q(pane,'.features_scene-expenses');
 if(rec){rec.classList.remove('is-on','is-enter','is-scanning');void rec.offsetWidth}
 if(exp){exp.classList.remove('is-on','is-enter','is-in');void exp.offsetWidth}
 var inv=q(pane,'.features_scene-invoice'),pay=q(pane,'.features_scene-paycard');
 if(inv){inv.classList.remove('is-on','is-enter');void inv.offsetWidth}
 if(pay){pay.classList.remove('is-on','is-enter','is-in');
  var pb=q(pay,'.features_scene-paybtn');if(pb)pb.classList.remove('is-press');
  void pay.offsetWidth}
 if(tasks){tasks.classList.remove('is-on','is-enter');
  [].slice.call(tasks.querySelectorAll('.features_scene-tkrow')).forEach(function(r){r.classList.remove('is-checked')});
  void tasks.offsetWidth}
 var fone=q(pane,'.features_scene-phone');
 if(fone){fone.classList.remove('is-on','is-enter','is-zoom','is-pan','is-zoomf');
  fone.style.transition='none';fone.style.transform='';void fone.offsetWidth;
  fone.style.transition='';fone.style.transitionDuration='';
  var bl=q(fone,'.features_scene-phblink');if(bl)bl.classList.remove('is-snap');
  var chp=q(fone,'.features_scene-phchip');if(chp)chp.classList.remove('is-fly');
  [].slice.call(fone.querySelectorAll('.features_scene-phhit')).forEach(function(h){h.classList.remove('is-tapped')});
  var scn=q(fone,'.features_scene-phscreen');
  if(scn){[].slice.call(scn.querySelectorAll('.features_scene-phimg')).forEach(function(im,i){
    im.classList.remove('is-push','is-launch');
    if(i===0){im.classList.remove('is-off')}else{im.classList.add('is-off')}})}
  void fone.offsetWidth}
 if(ph){ph.style.transition='none';ph.style.transform='scale(1)';void ph.offsetWidth;ph.style.transition=''}}

function playLeads(pane){
 var v=q(pane,'.features_tab-visual'),st=q(pane,'.features_scene-stack'),
     ph=q(pane,'.features_tab-photo'),c=cursorOf(pane);
 if(!st)return;
 [].slice.call(st.children).forEach(function(k,i){k.style.setProperty('--d',(i*STAG)+'ms')});
 st.classList.add('is-in');
 at(T.stack,function(){st.classList.add('is-done')});
 if(rm)return;
 at(T.stack+T.cursorIn,function(){
  var first=st.children[0];if(!first||!v)return;
  var vb=v.getBoundingClientRect(),cb=first.getBoundingClientRect(),sb=st.getBoundingClientRect();
  var cx=(cb.left-vb.left)+cb.width/2, cy=(cb.top-vb.top)+cb.height/2;
  /* stack and photo push in on the same panel point; each origin is that
     point expressed against its own box */
  st.style.transformOrigin=((cx-(sb.left-vb.left))/sb.width*100)+'% '+((cy-(sb.top-vb.top))/sb.height*100)+'%';
  st.style.transform='scale('+ZOOM+')';
  if(ph){var pb=ph.getBoundingClientRect();
   ph.style.transformOrigin=((cx-(pb.left-vb.left))/pb.width*100)+'% '+((cy-(pb.top-vb.top))/pb.height*100)+'%';
   ph.style.transform='scale('+ZOOM+')'}
  cursorTo(c,v,first,.74,.58,T.travel,ZOOM,cx,cy)});
 var tClick=T.stack+T.cursorIn+T.travel+T.click;
 at(tClick,function(){press(c,st.children[0])});
 at(tClick+130,function(){if(st.children[0])st.children[0].classList.add('is-picked')})}

function playQuote(pane){
 var v=q(pane,'.features_tab-visual'),tpl=q(pane,'.features_scene-templates'),
     quote=q(pane,'.features_scene-quote'),c=cursorOf(pane);
 if(!tpl||!quote)return;
 var cards=[].slice.call(tpl.children);
 cards.forEach(function(k,i){k.style.setProperty('--d',(i*STAG)+'ms')});
 /* 1 - the three templates stack in */
 at(Q.fadeOut,function(){tpl.classList.add('is-in')});
 var tPick=Q.fadeOut+Q.stack;
 at(tPick,function(){tpl.classList.add('is-done')});
 /* 2 - the cursor picks Home Addition, the middle template */
 var home=cards[1];
 if(!rm){
  at(tPick,function(){cursorTo(c,v,home,.5,.5,Q.toCard)});
  at(tPick+Q.toCard,function(){press(c,home)});
  at(tPick+Q.toCard+130,function(){if(home)home.classList.add('is-picked')});
 }
 /* 3 - the pick opens the quote */
 var tQuote=tPick+Q.toCard+Q.click;
 at(tQuote,function(){tpl.classList.add('is-off');quote.classList.add('is-on','is-enter')});
 if(rm)return;
 /* 4 - the cursor edits the Labor box on the Delivery by crane row (row 2) */
 var row=quote.querySelectorAll('.features_scene-qrow')[1];
 var box=row&&q(row,'.features_scene-c-lab .features_scene-qbox');
 var val=box&&q(box,'.features_scene-qval');
 var tot=row&&q(row,'.features_scene-c-tot');
 var tField=tQuote+Q.reveal;
 at(tField,function(){cursorTo(c,v,box,.5,.5,Q.toField)});
 at(tField+Q.toField,function(){press(c,box);if(box)box.classList.add('is-editing')});
 /* type the new figure one character at a time */
 var typed='$95',tType=tField+Q.toField+160;
 at(tType,function(){if(val)val.textContent='$'});
 for(var i=2;i<=typed.length;i++){(function(n){
   at(tType+(n-1)*(Q.type/typed.length),function(){if(val)val.textContent=typed.slice(0,n)})
 })(i)}
 var tSettle=tType+Q.type;
 at(tSettle,function(){if(box)box.classList.remove('is-editing');if(tot)tot.textContent='$725.00'});
 /* 5 - scroll the body to the bottom. Measured, not hardcoded. offsetHeight,
        not getBoundingClientRect - the latter reports the reveal scale. */
 var tScroll=tSettle+Q.settle;
 at(tScroll,function(){
  var body=q(quote,'.features_scene-qbody'),sc=q(quote,'.features_scene-qscroll');
  if(!body||!sc)return;
  var max=Math.max(0,sc.offsetHeight-body.offsetHeight);
  sc.style.transition='transform '+Q.scroll+'ms cubic-bezier(.33,.9,.25,1)';
  sc.style.transform='translateY(-'+max+'px)'});
 /* 6 - and send it */
 var sb=q(quote,'.features_scene-sendbtn'),tSend=tScroll+Q.scroll;
 at(tSend,function(){cursorTo(c,v,sb,.5,.5,Q.toSend)});
 at(tSend+Q.toSend,function(){press(c,sb,200)})}

/* The signature is 14KB of mask paths, too big to inline, so it is fetched once
   and injected into .spad. The URL comes from a BOUND <img> in the pad, never a
   literal - so renaming, moving or recompressing the asset follows the binding. */
function loadSig(pane){
 var pad=q(pane,'.features_scene-spad');
 if(!pad||q(pad,'.bd-sigsvg'))return;
 var src=q(pad,'.features_scene-sigsrc'),url=src&&(src.currentSrc||src.src);
 if(!url)return;
 fetch(url).then(function(r){return r.ok?r.text():''}).then(function(t){
  if(t&&!q(pad,'.bd-sigsvg'))pad.insertAdjacentHTML('beforeend',t)}).catch(function(){})}

function playWin(pane){
 var v=q(pane,'.features_tab-visual'),act=q(pane,'.features_scene-actions'),
     sign=q(pane,'.features_scene-signcard'),c=cursorOf(pane);
 if(!act||!sign)return;
 loadSig(pane);
 /* 1 - the quote-received card arrives */
 at(W.fadeOut,function(){act.classList.add('is-on','is-enter')});
 /* 2 - the cursor accepts */
 var accept=q(act,'.features_scene-abtn.is-primary'),tAccept=W.fadeOut+W.cardIn;
 if(!rm){
  at(tAccept,function(){cursorTo(c,v,accept,.5,.5,W.toAccept)});
  at(tAccept+W.toAccept,function(){press(c,accept,170)});
 }
 /* 3 - the sign modal takes its place */
 var tSign=tAccept+W.toAccept+W.click;
 at(tSign,function(){act.classList.remove('is-on');sign.classList.add('is-on','is-enter')});
 /* 4 - the signature draws itself once the modal has landed */
 at(tSign+W.swap,function(){sign.classList.add('is-writing')});
 if(rm)return;
 /* 5 - and the contractor is hired */
 var signbtn=q(sign,'.features_scene-abtn.is-sign'),tHire=tSign+W.swap+W.write;
 at(tHire,function(){cursorTo(c,v,signbtn,.5,.5,W.toSign)});
 at(tHire+W.toSign,function(){press(c,signbtn,200)})}

function playTeam(pane){
 var v=q(pane,'.features_tab-visual'),team=q(pane,'.features_scene-team'),
     gantt=q(pane,'.features_scene-gantt'),tasks=q(pane,'.features_scene-tasks'),c=cursorOf(pane);
 if(!team||!gantt||!tasks)return;
 var list=q(team,'.features_scene-tmlist'),rows=list?[].slice.call(list.children):[];
 rows.forEach(function(k,i){k.style.setProperty('--d',(i*MSTAG)+'ms')});
 /* 1 - the card lands, then the members arrive one after another */
 at(TM.fadeOut,function(){team.classList.add('is-on','is-enter')});
 at(TM.fadeOut+TM.cardIn,function(){team.classList.add('is-in')});
 /* 2 - the cursor picks one of them */
 var tPick=TM.fadeOut+TM.cardIn+TM.members;
 if(!rm){
  at(tPick,function(){cursorTo(c,v,rows[0],.45,.5,TM.toMember)});
  at(tPick+TM.toMember,function(){press(c,rows[0],170)});
 }
 /* 3 - which opens their schedule */
 var tGantt=tPick+TM.toMember+TM.click;
 at(tGantt,function(){team.classList.remove('is-on');gantt.classList.add('is-on','is-enter')});
 /* 4 - the cursor opens a task on it. The hit target is pointer-events:none,
        so force the hand rather than waiting on the hover hit-test. */
 var hit=q(gantt,'.features_scene-gantthit'),tTask=tGantt+TM.toGantt;
 if(!rm){
  at(tTask,function(){cursorTo(c,v,hit,.5,.5,TM.toTask);if(c)c.classList.add('is-hover')});
  at(tTask+TM.toTask,function(){press(c,null,260)});
 }
 /* 5 - the task detail opens */
 var tDetail=tTask+TM.toTask+TM.click;
 at(tDetail,function(){gantt.classList.remove('is-on');tasks.classList.add('is-on','is-enter')});
 /* 6 - ticking the parent cascades its subtasks */
 var tk=[].slice.call(tasks.querySelectorAll('.features_scene-tkrow')),tCheck=tDetail+TM.toTasks;
 if(!tk.length)return;
 if(!rm)at(tCheck,function(){cursorTo(c,v,q(tk[0],'.features_scene-tkbox'),.5,.5,TM.toCheck)});
 at(tCheck+TM.toCheck,function(){press(c,null,170);tk[0].classList.add('is-checked')});
 tk.slice(1).forEach(function(row,i){
  at(tCheck+TM.toCheck+260+i*200,function(){row.classList.add('is-checked')})})}

function playBill(pane){
 var rec=q(pane,'.features_scene-receipt'),exp=q(pane,'.features_scene-expenses');
 if(!rec||!exp)return;
 var rows=[].slice.call(exp.children).filter(function(r){
   return r.className.indexOf('is-head')<0});
 rows.forEach(function(k,i){k.style.setProperty('--d',(i*ESTAG)+'ms')});
 /* 1 - the receipt lands */
 at(BL.fadeOut,function(){rec.classList.add('is-on','is-enter')});
 /* 2 - the scan sweeps it top to bottom */
 var tScan=BL.fadeOut+BL.receiptIn;
 at(tScan,function(){rec.style.setProperty('--scan',BL.scan+'ms');rec.classList.add('is-scanning')});
 /* 3 - which resolves into the expense table, its rows arriving in turn */
 var tTable=tScan+BL.scan+BL.settle;
 at(tTable,function(){rec.classList.remove('is-on');exp.classList.add('is-on','is-enter')});
 at(tTable+BL.swap,function(){exp.classList.add('is-in')})}

function playInvoice(pane){
 var v=q(pane,'.features_tab-visual'),inv=q(pane,'.features_scene-invoice'),
     pay=q(pane,'.features_scene-paycard'),c=cursorOf(pane);
 if(!inv||!pay)return;
 var list=q(pay,'.features_scene-paylist'),rows=list?[].slice.call(list.children):[];
 rows.forEach(function(k,i){k.style.setProperty('--d',(i*PSTAG)+'ms')});
 var btn=q(pay,'.features_scene-paybtn');
 if(btn)btn.style.setProperty('--d',(rows.length*PSTAG)+'ms');
 /* 1 - the invoice appears, then sits for a beat */
 at(IV.fadeOut,function(){inv.classList.add('is-on','is-enter')});
 /* 2 - it gives way to the payment methods, which stagger in */
 var tPay=IV.fadeOut+IV.cardIn;
 at(tPay,function(){inv.classList.remove('is-on');pay.classList.add('is-on','is-enter')});
 at(tPay+IV.swap,function(){pay.classList.add('is-in')});
 if(rm)return;
 /* 3 - and the cursor pays it */
 var tBtn=tPay+IV.swap+IV.rows;
 at(tBtn,function(){cursorTo(c,v,btn,.5,.5,IV.toPay)});
 at(tBtn+IV.toPay,function(){press(c,btn,200)})}

/* a fingertip landing on a control */
function tapHit(el){if(!el)return;
 el.classList.remove('is-tapped');void el.offsetWidth;el.classList.add('is-tapped');
 at(750,function(){el.classList.remove('is-tapped')})}
/* one screen at a time; `push` lets the incoming one arrive like a sheet */
function phShow(screens,el,push){if(!el)return;
 screens.forEach(function(s){if(s!==el){s.classList.add('is-off');s.classList.remove('is-push')}});
 if(push){el.classList.add('is-push');void el.offsetWidth}
 el.classList.remove('is-off','is-push')}

function playField(pane){
 var ph=q(pane,'.features_scene-phone');if(!ph)return;
 var scr=q(ph,'.features_scene-phscreen');
 var screens=scr?[].slice.call(scr.querySelectorAll('.features_scene-phimg')):[];
 if(screens.length<4)return;
 var cam=screens[1],edit=screens[2],logs=screens[3];
 var fab=q(ph,'.features_scene-phhit.is-fab'),done=q(ph,'.features_scene-phhit.is-done'),
     sav=q(ph,'.features_scene-phhit.is-save');
 /* 1 - the device arrives already framed on the top of the home screen */
 var tIn=FD.fadeOut;
 at(tIn,function(){ph.classList.add('is-on','is-zoom','is-enter')});
 if(rm){at(tIn+FD.phoneIn,function(){phShow(screens,logs)});return}
 /* 2 - the camera pans down the screen to the tab bar */
 var tPan=tIn+FD.phoneIn+FD.hold1;
 at(tPan,function(){ph.style.transitionDuration='.5s, '+FD.pan+'ms';
  ph.classList.remove('is-zoom');ph.classList.add('is-pan')});
 /* 3 - a thumb comes down on the + button waiting there */
 var tFab=tPan+FD.pan+FD.beforeTap;
 at(tFab,function(){tapHit(fab)});
 /* 4 - the camera app opens, and the device pulls back to full */
 var tCam=tFab+FD.tap;
 at(tCam,function(){ph.style.transitionDuration='.5s, '+FD.appOpen+'ms';ph.classList.remove('is-pan')});
 at(tCam+130,function(){phShow(screens,cam);cam.classList.add('is-launch')});
 at(tCam+690,function(){cam.classList.remove('is-launch')});
 /* 5 - the shots are already in the strip, so the thumb taps Done (5). There
        is no capture beat: its flying chip carried the Photo/Video toggle. */
 var tDone=tCam+FD.appOpen+FD.beforeDone;
 at(tDone,function(){tapHit(done)});
 /* 6 - the shots become a daily log, and the camera pushes back in on it */
 var tForm=tDone+FD.tap;
 at(tForm,function(){
  ph.style.transitionDuration='.5s, '+FD.toForm+'ms';ph.classList.add('is-zoomf');
  phShow(screens,edit,true)});
 /* 7 - Save, and it lands in the project's log list */
 var tSave=tForm+FD.toForm+FD.beforeSave;
 at(tSave,function(){tapHit(sav)});
 at(tSave+FD.tap+FD.save,function(){
  ph.style.transitionDuration='.5s, '+FD.toLogs+'ms';ph.classList.remove('is-zoomf');
  phShow(screens,logs,true)})}

var PLAY={leads:playLeads,quote:playQuote,win:playWin,team:playTeam,
          bill:playBill,invoice:playInvoice,field:playField};
function sceneKey(pane){var s=q(pane,'.features_scene');return s?s.getAttribute('data-bd-scene'):null}

function rule(l){return l?q(l,'.features_tab-rule'):null}
function clearAll(){links.forEach(function(l){var r=rule(l);if(r){r.style.transition='none';r.style.width='0%'}})}
function fill(l,ms){var r=rule(l);if(!r)return;void r.offsetWidth;r.style.transition='width '+ms+'ms linear';r.style.width='100%'}

/* `idx` is the source of truth, NOT `.w--current`: Webflow has not finished
   switching tabs while our click handler runs, so the DOM returns the OUTGOING
   tab and the scene replays against the wrong pane forever. */
function go(n){
 idx=n;
 clearTimeout(timer);clearSeq();clearAll();
 var l=links[n],key=sceneKey(panes[n]),d=(key&&DUR[key])||IDLE;
 /* Webflow's tab handler is synchronous. Do NOT defer into rAF: a backgrounded
    tab never delivers the frame and the whole section sits dead. */
 if(!l.classList.contains('w--current'))l.click();
 /* Webflow's 100ms tab fade can strand a pane at the outgoing opacity:0 when a
    programmatic click lands mid-transition. Pin the incoming pane open. */
 panes.forEach(function(p,k){if(k===n){p.style.opacity='1'}else{p.style.removeProperty('opacity')}});
 panes.forEach(rewind);
 fill(l,d);
 if(key&&PLAY[key]&&panes[n])PLAY[key](panes[n]);
 if(rm||!visible)return;
 timer=setTimeout(function(){go((idx+1)%links.length)},d)}

function init(){
 root=(me&&me.closest&&me.closest('.section_features'))||document.querySelector('.section_features');
 if(!root||root.hasAttribute('data-bd-anim'))return;
 wrap=q(root,'.features_tabs');if(!wrap)return;
 links=[].slice.call(wrap.querySelectorAll('.w-tab-link'));if(links.length<2)return;
 panes=[].slice.call(wrap.querySelectorAll('.w-tab-pane'));
 root.setAttribute('data-bd-anim','');
 links.forEach(function(l,n){l.addEventListener('click',function(){if(n!==idx)go(n)})});
 if('IntersectionObserver' in window){
  new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v===visible)return;visible=v;
   if(v){go(idx<0?0:idx)}else{clearTimeout(timer);clearSeq()}},{threshold:.25}).observe(wrap)}
 else{visible=true;go(0)}}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
