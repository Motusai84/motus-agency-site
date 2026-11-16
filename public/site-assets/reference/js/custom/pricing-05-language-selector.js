(function(){
if(window.__billdrLang)return;window.__billdrLang=1;
function init(){
  var cur=(document.documentElement.lang||'en').slice(0,2).toLowerCase();
  var all=[].slice.call(document.querySelectorAll('.navbar_lang-link[data-lang]'));
  // Locale subdirectories come from the links themselves (data-lang-sub), so a locale change = edit the link only.
  var subs=all.map(function(a){return a.getAttribute('data-lang-sub');}).filter(Boolean);
  // Path with any locale prefix removed: /fr/pricing -> /pricing
  var p='/pricing',bare=p;
  subs.forEach(function(s){if(p==='/'+s||p.indexOf('/'+s+'/')===0)bare=p.slice(s.length+1)||'/';});
  document.querySelectorAll('.navbar_lang').forEach(function(dd){
    dd.querySelectorAll('.navbar_lang-link[data-lang]').forEach(function(a){
      var code=a.getAttribute('data-lang'),tag=a.getAttribute('hreflang'),sub=a.getAttribute('data-lang-sub'),href=null;
      // 1. Webflow's native Locales List (hidden in the navbar) - exact localized URL, translated CMS slugs included
      var lang=(tag||code||'').slice(0,2).toLowerCase();
      [].slice.call(document.querySelectorAll('[data-lang-source] a[href],.w-locales-list a[href]')).some(function(l){
        var lp;try{lp=new URL(l.href,location.href).pathname;}catch(e){return false;}
        // Locale of the link: its hreflang, else its subdirectory prefix (no prefix = default locale)
        var h=(l.getAttribute('hreflang')||'').slice(0,2).toLowerCase();
        if(!h){var ps=null;all.forEach(function(x){var s=x.getAttribute('data-lang-sub');if(s&&(lp==='/'+s||lp.indexOf('/'+s+'/')===0))ps=x.getAttribute('data-lang');});
          h=ps||(all.filter(function(x){return !x.getAttribute('data-lang-sub');})[0]||{getAttribute:function(){return '';}}).getAttribute('data-lang');}
        if(h!==lang)return false;href=lp;return true;
      });
      // 2. Webflow's own hreflang alternates (custom domain)
      var alt=!href&&tag&&document.querySelector('link[rel="alternate"][hreflang="'+tag+'"]');
      if(alt){try{href=new URL(alt.href,location.href).pathname;}catch(e){}}
      // 3. Fallback: swap the subdirectory prefix
      if(!href)href=sub?('/'+sub+(bare==='/'?'':bare)):bare;
      a.setAttribute('href', 'https://www.billdr.ai' + href + location.search + location.hash);
      if(code===cur){
        a.setAttribute('aria-current','true');
        var t=dd.querySelector('.navbar_lang-toggle');
        var f=a.querySelector('.navbar_lang-flag'),l=a.querySelector('[data-lang-label]');
        var tf=t&&t.querySelector('.navbar_lang-flag'),tl=t&&t.querySelector('[data-lang-current]');
        if(tf&&f)tf.innerHTML=f.innerHTML;
        // Mirror the option's icon (FR fleur-de-lys) onto the toggle, before the caret; spacing = the toggle's own gap.
        var ic=a.querySelector('.navbar_lang-fleur'),tc=t&&t.querySelector('.navbar_lang-caret');
        if(ic&&tc&&!t.querySelector('.navbar_lang-fleur'))t.insertBefore(ic.cloneNode(true),tc);
        if(tl&&l){tl.textContent=l.textContent;t.setAttribute('aria-label',({fr:'Langue',es:'Idioma'}[cur]||'Language')+' : '.slice(cur==='fr'?0:1)+l.textContent);}
      }
    });
  });
}
// This embed sits after the navbar markup, so run now (no English flash on /fr, /es); DOMContentLoaded is the fallback.
// Re-run on DOMContentLoaded so a Locales List placed after this embed is still picked up (init is idempotent).
if(document.querySelector('.navbar_lang'))init();document.addEventListener('DOMContentLoaded',init);
})();
