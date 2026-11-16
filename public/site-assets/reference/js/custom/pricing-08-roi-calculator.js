/* billdr pricing ROI calculator v1.3.0 — EN/FR/ES built in. Language picked from <html lang> (or /fr, /es in the URL). */
(function(){
  if (window.__billdrRoi) return; window.__billdrRoi = 1;
  function init(){
    var root = document.querySelector('[data-roi]'); if (!root) return;

    // ---- Language: French, Spanish or English, based on the page ----
    var htmlLang = (document.documentElement.lang || '').toLowerCase(), path = location.pathname;
    var code = (/^fr/.test(htmlLang) || /^\/fr(\/|$)/.test(path)) ? 'fr'
             : (/^es/.test(htmlLang) || /^\/es(\/|$)/.test(path)) ? 'es'
             : 'en';
    var lang = {fr:'fr-CA', es:'es-US', en:'en-US'}[code];
    var TEXT = {
      en: {
        jobline: function(v){ return 'Win one extra ' + v.job + ' job a year at ' + v.margin + ' margin and you keep ' + v.profit + ', enough to cover ' + v.term + ' of ' + v.plan + '.'; },
        termYear: 'a full year',
        termMonths: function(m){ return m + (m === '1' ? ' month' : ' months'); },
        paybackOk: function(d){ return 'At these numbers the plan pays for itself in about ' + d + (d === 1 ? ' day' : ' days') + ' each month.'; },
        paybackLow: function(p){ return 'At these numbers the time saved covers ' + p + ' of the plan. Add the extra jobs you win and it usually tips over.'; }
      },
      fr: {
        jobline: function(v){ return 'Gagnez un contrat supplémentaire de ' + v.job + ' par an avec une marge de ' + v.margin + ' et vous conservez ' + v.profit + ', soit assez pour couvrir ' + v.term + ' de l\'abonnement ' + v.plan + '.'; },
        termYear: 'une année complète',
        termMonths: function(m){ return m + ' mois'; },
        paybackOk: function(d){ return 'Avec ces chiffres, le forfait est rentabilisé en environ ' + d + (d === 1 ? ' jour' : ' jours') + ' par mois.'; },
        paybackLow: function(p){ return 'Avec ces chiffres, le temps économisé couvre ' + p + ' du forfait. Ajoutez les contrats supplémentaires que vous remportez et la balance penche généralement en votre faveur.'; }
      },
      es: {
        jobline: function(v){ return 'Gane un contrato adicional de ' + v.job + ' al año con un margen de ' + v.margin + ' y se queda con ' + v.profit + ', suficiente para cubrir ' + v.term + ' del plan ' + v.plan + '.'; },
        termYear: 'un año completo',
        termMonths: function(m){ return m + (m === '1' ? ' mes' : ' meses'); },
        paybackOk: function(d){ return 'Con estas cifras, el plan se paga solo en unos ' + d + (d === 1 ? ' día' : ' días') + ' al mes.'; },
        paybackLow: function(p){ return 'Con estas cifras, el tiempo ahorrado cubre ' + p + ' del plan. Sume los contratos adicionales que gane y normalmente sale a cuenta.'; }
      }
    };
    var T = TEXT[code];

    // ---- Number formatting in the page's language ----
    var curFmt = new Intl.NumberFormat(lang, {style:'currency', currency:'USD', currencyDisplay:'narrowSymbol', maximumFractionDigits:0});
    var money = function(n){ return curFmt.format(Math.round(n)); };
    var oneDec = function(n){ return new Intl.NumberFormat(lang, {minimumFractionDigits:1, maximumFractionDigits:1}).format(n); };
    var upToOneDec = function(n){ return new Intl.NumberFormat(lang, {maximumFractionDigits:1}).format(n); };
    var pct = function(n){ return new Intl.NumberFormat(lang, {style:'percent', maximumFractionDigits:0}).format(n / 100); };

    var names = {starter:'Starter', premium:'Premium', titanium:'Titanium'};
    var s = {plan:'premium', price:550};
    var out = function(k, v){ root.querySelectorAll('[data-roi-out="'+k+'"]').forEach(function(el){ el.textContent = v; }); };
    var num = function(t){ t = (t || '').replace(/[^0-9.\-]/g, ''); return t === '' ? NaN : parseFloat(t); };
    var cfg = function(key){ var el = root.querySelector('[data-roi-cfg="' + key + '"]'); return el ? num(el.textContent) : NaN; };
    var sliders = [].slice.call(root.querySelectorAll('[data-roi-slider]'));
    sliders.forEach(function(el){
      var k = el.getAttribute('data-roi-slider');
      var mn = cfg(k + '-min'), mx = cfg(k + '-max'), v = cfg(k + '-value');
      if (isNaN(mn)) mn = +el.dataset.min; if (isNaN(mx)) mx = +el.dataset.max;
      if (!(mx > mn)) { mn = +el.dataset.min; mx = +el.dataset.max; }
      if (isNaN(v)) v = +el.dataset.value; v = Math.min(mx, Math.max(mn, v));
      el.dataset.min = mn; el.dataset.max = mx; el.dataset.value = v;
      el.setAttribute('aria-valuemin', mn); el.setAttribute('aria-valuemax', mx);
    });
    // plan prices from the Annual / Annuel / Anual plan cards
    (function(){
      var scope = root.closest('main') || document, pane = null;
      [].slice.call(scope.querySelectorAll('.w-tab-link')).some(function(a){
        if (!/^an(n)?u/.test(a.textContent.trim().toLowerCase())) return false;
        var tabs = a.closest('.w-tabs'); pane = tabs && tabs.querySelector('.w-tab-pane[data-w-tab="' + a.getAttribute('data-w-tab') + '"]');
        return !!pane;
      });
      if (!pane) return;
      [].slice.call(pane.querySelectorAll('.pricing_card')).forEach(function(card){
        var n = card.querySelector('.pricing_card-name'), pr = card.querySelector('.pricing_card-price');
        if (!n || !pr) return;
        var key = n.textContent.trim().toLowerCase(), price = num(pr.textContent);
        var pill = root.querySelector('[data-roi-plan="' + key + '"]');
        if (!pill || isNaN(price) || price <= 0) return;
        pill.setAttribute('data-price', price);
        pill.textContent = n.textContent.trim() + ' · ' + money(price);
        if (pill.classList.contains('is-active')) s.price = price;
      });
    })();
    sliders.forEach(function(el){ s[el.getAttribute('data-roi-slider')] = +el.getAttribute('data-value'); });
    function paint(el){
      var k = el.getAttribute('data-roi-slider'), mn = +el.dataset.min, mx = +el.dataset.max;
      var p = ((s[k] - mn) / (mx - mn)) * 100 + '%';
      el.querySelector('.pricing-v2_slider-fill').style.width = p;
      el.querySelector('.pricing-v2_slider-thumb').style.left = p;
      el.setAttribute('aria-valuenow', s[k]);
      var label = k==='hours' ? s[k]+' h' : (k==='rate' || k==='job') ? money(s[k]) : pct(s[k]);
      el.setAttribute('aria-valuetext', label); out(k, label);
    }
    function calc(){
      var hoursBack = s.hours * 52 / 12 * (s.share / 100);
      var value = hoursBack * s.rate, cost = s.price, multiple = value / cost;
      var payDays = Math.max(1, Math.round(cost / (value / 30)));
      var jobProfit = s.job * s.margin / 100, months = jobProfit / cost;
      out('value', money(value)); out('hoursback', Math.round(hoursBack));
      out('planname', names[s.plan]); out('cost', money(cost));
      out('multiple', oneDec(multiple) + '×');
      out('payback', multiple >= 1 ? T.paybackOk(payDays) : T.paybackLow(pct(multiple * 100)));
      out('jobline', T.jobline({
        job: money(s.job), margin: pct(s.margin), profit: money(jobProfit), plan: names[s.plan],
        term: months >= 12 ? T.termYear : T.termMonths(upToOneDec(months))
      }));
    }
    function set(el, v){
      var k = el.getAttribute('data-roi-slider'), mn = +el.dataset.min, mx = +el.dataset.max, st = +el.dataset.step;
      v = Math.min(mx, Math.max(mn, Math.round((v - mn) / st) * st + mn));
      if (v === s[k]) return; s[k] = v; paint(el); calc();
    }
    sliders.forEach(function(el){
      var mn = +el.dataset.min, mx = +el.dataset.max, st = +el.dataset.step, drag = false;
      function fromX(x){ var r = el.getBoundingClientRect(); set(el, mn + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (mx - mn)); }
      el.addEventListener('pointerdown', function(e){ drag = true; el.setPointerCapture(e.pointerId); fromX(e.clientX); e.preventDefault(); });
      el.addEventListener('pointermove', function(e){ if (drag) fromX(e.clientX); });
      el.addEventListener('pointerup', function(){ drag = false; });
      el.addEventListener('pointercancel', function(){ drag = false; });
      el.addEventListener('keydown', function(e){
        var k = el.getAttribute('data-roi-slider'), big = Math.max(st, (mx - mn) / 10), d = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = st; else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -st;
        else if (e.key === 'PageUp') d = big; else if (e.key === 'PageDown') d = -big;
        else if (e.key === 'Home') { set(el, mn); e.preventDefault(); return; } else if (e.key === 'End') { set(el, mx); e.preventDefault(); return; }
        if (d) { set(el, s[k] + d); e.preventDefault(); }
      });
      paint(el);
    });
    var pills = [].slice.call(root.querySelectorAll('[data-roi-plan]'));
    function pick(p){
      s.plan = p.getAttribute('data-roi-plan'); s.price = +p.getAttribute('data-price');
      pills.forEach(function(x){ var on = x === p; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      calc();
    }
    pills.forEach(function(p){
      p.addEventListener('click', function(){ pick(p); });
      p.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p); } });
    });
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
