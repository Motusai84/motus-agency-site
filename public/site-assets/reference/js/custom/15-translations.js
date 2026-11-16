/* billdr-home-i18n v1.0.0: translates the Home mock-UI embeds (cash-flow chart, Site prep estimate, Bob/Billie chat composers) by <html lang>; English untouched. Scope: .section_features + .section_copilots only. Master: ~/Desktop/Claude Stuff/billdr-translation-2026-09-22/embed-i18n/home-i18n.html */
(function(){
var L=(document.documentElement.lang||'en').slice(0,2).toLowerCase();if(L!=='fr'&&L!=='es')return;
if(window.__billdrHomeI18n)return;window.__billdrHomeI18n=1;
var NB='  ';
var X={
fr:{d:{'Outflows':'Sorties','Payments received':'Paiements reçus','Sep 26':'sept. 26','Oct 26':'oct. 26','Nov 26':'nov. 26','Dec 26':'déc. 26','Jan 27':'janv. 27','Feb 27':'févr. 27',
  'Site prep':'Préparation du chantier','Task':'Tâche','Quantity':'Quantité','Material':'Matériaux','Labor':'Main-d’œuvre','Markup':'Majoration','Total':'Total',
  'Site protection during work':'Protection du chantier pendant les travaux','Delivery by crane':'Livraison par grue',
  'Supply and install temporary toilets':'Fourniture et installation de toilettes temporaires',
  'Temporary site installation (scaffolding)':'Installation temporaire de chantier (échafaudage)',
  'Temporary protection wall (2x4 framing, masonite, polythene, green tape, red tape.)':'Mur de protection temporaire (ossature 2x4, masonite, polyéthylène, ruban vert, ruban rouge)',
  'Floor protection (ram board, green tape, red tape)':'Protection des planchers (Ram Board, ruban vert, ruban rouge)',
  'Cleanup site':'Nettoyage du chantier','Framing':'Charpente','Type a message':'Écrivez un message'},
  net:'Flux de trésorerie net',labor:function(n){return n+' h de main-d’œuvre estimées';},each:function(n){return n+(n==='1'?' unité':' unités');},hours:function(n){return n+' heures';},
  q:'Aide-moi à visualiser mes projections de flux de trésorerie pour les 6 prochains mois selon les projets actifs et les contrats récemment signés.'},
es:{d:{'Outflows':'Egresos','Payments received':'Pagos recibidos','Sep 26':'sep 26','Oct 26':'oct 26','Nov 26':'nov 26','Dec 26':'dic 26','Jan 27':'ene 27','Feb 27':'feb 27',
  'Site prep':'Preparación de la obra','Task':'Tarea','Quantity':'Cantidad','Material':'Material','Labor':'Mano de obra','Markup':'Margen de utilidad','Total':'Total',
  'Site protection during work':'Protección de la obra durante los trabajos','Delivery by crane':'Entrega con grúa',
  'Supply and install temporary toilets':'Suministro e instalación de sanitarios temporales',
  'Temporary site installation (scaffolding)':'Instalación temporal de obra (andamios)',
  'Temporary protection wall (2x4 framing, masonite, polythene, green tape, red tape.)':'Muro de protección temporal (estructura 2x4, masonite, polietileno, cinta verde, cinta roja)',
  'Floor protection (ram board, green tape, red tape)':'Protección de pisos (Ram Board, cinta verde, cinta roja)',
  'Cleanup site':'Limpieza de la obra','Framing':'Estructura','Type a message':'Escribe un mensaje'},
  net:'Flujo de efectivo neto',labor:function(n){return n+' h de mano de obra estimadas';},each:function(n){return n+(n==='1'?' pieza':' piezas');},hours:function(n){return n+' horas';},
  q:'Ayúdame a visualizar mis proyecciones de flujo de efectivo para los próximos 6 meses según los proyectos activos y los contratos firmados recientemente.'}
}[L];
var D=X.d,QEN='Help me visualize my cashflow projections for the next 6 months given active projects and recent contracts signed.';
var P=[[/^—\s+Net cash flow$/,function(){return '—'+NB+X.net;}],
 [/^(\d+)h estimated labor$/,function(m){return X.labor(m[1]);}],
 [/^(\d+) each$/,function(m){return X.each(m[1]);}],
 [/^(\d+) hours$/,function(m){return X.hours(m[1]);}]];
function tr(s){if(s==null)return null;var k=s.trim();if(!k)return null;
  if(Object.prototype.hasOwnProperty.call(D,k))return s.replace(k,D[k]);
  for(var i=0;i<P.length;i++){var m=k.match(P[i][0]);if(m)return s.replace(k,P[i][1](m));}
  return null;}
/* Bob types QEN one slice at a time (span.textContent=Q.slice(0,n)); show the same share of the translated prompt. */
function typed(t){var v=t.nodeValue;if(!v||QEN.indexOf(v)!==0)return false;
  var n=Math.round(v.length/QEN.length*X.q.length);t.nodeValue=X.q.slice(0,n);return true;}
function tn(t){var p=t.parentNode;if(p&&p.classList&&p.classList.contains('aiwf_t')&&typed(t))return;
  var r=tr(t.nodeValue);if(r!==null&&r!==t.nodeValue)t.nodeValue=r;}
function run(n){var w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,null),t,a=[];
  while(t=w.nextNode()){var pn=t.parentNode&&t.parentNode.nodeName;if(pn!=='SCRIPT'&&pn!=='STYLE')a.push(t);}a.forEach(tn);}
function start(){[].forEach.call(document.querySelectorAll('.section_features,.section_copilots'),function(root){
  run(root);
  new MutationObserver(function(ms){ms.forEach(function(m){
    if(m.type==='characterData')tn(m.target);
    else m.addedNodes.forEach(function(a){if(a.nodeType===3)tn(a);else if(a.nodeType===1)run(a);});});
  }).observe(root,{childList:true,subtree:true,characterData:true});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
