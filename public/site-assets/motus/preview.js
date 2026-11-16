/* Local preview. Enquiries send only on submit, through the same-origin relay. */
(() => {
  'use strict';
  const boot = () => {
    const client = window.MOTUS_CLIENT;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const contact = document.querySelector('#contact-dialog');
    const booking = document.querySelector('#booking-dialog');
    const enquiryForm = document.querySelector('#preview-enquiry');
    const enquiryStatus = document.querySelector('#enquiry-status');
    const enquirySubmit = document.querySelector('#preview-enquiry-submit');
    const enquiryFields = document.querySelector('#enquiry-fields');
    const enquiryNew = document.querySelector('#enquiry-new');
    const enquiryFallback = document.querySelector('#enquiry-email-fallback');
    const enquiryUi = client.enquiry;
    if(window.MOTUS_PHONE_REVIEW){
      contact.querySelector('.motus-preview-note').textContent='You can review this form on your phone. Enquiry sending is disabled in this Wi-Fi preview.';
      enquirySubmit.disabled=true;
      enquirySubmit.textContent='Sending disabled in phone preview';
      enquiryStatus.textContent='This Wi-Fi preview is for reviewing the website. No enquiry will be sent.';
    }
    let enquiryBusy = false, enquirySent = false, requestId = '', requestSignature = '';
    const resetEnquiry = () => {
      if (enquiryBusy) return;
      enquiryForm.reset(); enquirySent = false; requestId = ''; requestSignature = '';
      enquiryFields.hidden = false; enquirySubmit.hidden = false; enquiryNew.hidden = true;
      enquiryFallback.hidden = true; enquiryStatus.textContent = ''; enquiryStatus.removeAttribute('data-state');
      enquirySubmit.textContent = enquiryUi.submitLabel;
    };
    let returnFocus;
    const open = (dialog) => {
      returnFocus = document.activeElement;
      if (contact.open) contact.close();
      if (booking.open) booking.close();
      dialog.showModal();
    };
    const close = dialog => { dialog.close(); returnFocus?.focus(); };
    // Keep enquiry links from the existing public demos working after the swap.
    if(client.production && ['#contact','#review'].includes(location.hash)){
      const slug=new URLSearchParams(location.search).get('example');
      const demo=client.demos.find(item=>item.slug===slug);
      if(demo)document.querySelector('#enquiry-message').value=`I’d like to discuss something like ${demo.title}.`;
      if(location.hash==='#review')document.querySelector('#enquiry-topic').value='Free workflow review';
      open(contact);
    }
    document.addEventListener('click', e => {
      const a = e.target.closest('a');
      const href = a?.getAttribute('href');
      if (['#booking','#contact','#review'].includes(href)) {
        e.preventDefault();
        if (href === '#booking' && client.calendly) { window.open(client.calendly, '_blank', 'noopener'); return; }
        if (href === '#review' && !enquiryBusy) {
          if (enquirySent) resetEnquiry();
          document.querySelector('#enquiry-topic').value='Free workflow review';
        }
        open(href === '#booking' ? booking : contact);
      }
      if (e.target.closest('[data-open-contact]')) open(contact);
    });
    document.querySelector('#close-contact').addEventListener('click',()=>close(contact));
    document.querySelector('#close-booking').addEventListener('click',()=>close(booking));
    [contact,booking].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close(d);}}));
    enquiryNew.addEventListener('click',()=>{resetEnquiry();document.querySelector('#enquiry-name').focus();});
    enquiryForm.addEventListener('submit',async e=>{
      e.preventDefault();
      if(window.MOTUS_PHONE_REVIEW)return;
      if (enquiryBusy || enquirySent || !enquiryForm.reportValidity()) return;
      const values=Object.fromEntries(new FormData(enquiryForm));
      for (const key of Object.keys(values)) values[key]=values[key].trim();
      if (!values.name || !values.message) {
        enquiryStatus.textContent=enquiryUi.invalid; enquiryStatus.dataset.state='error';
        document.querySelector(!values.name?'#enquiry-name':'#enquiry-message').focus(); return;
      }
      const signature=JSON.stringify(values);
      if (signature!==requestSignature) { requestId=crypto.randomUUID();requestSignature=signature; }
      values.requestId=requestId;
      enquiryBusy=true; enquirySubmit.disabled=true; enquirySubmit.textContent=enquiryUi.sendingLabel;
      enquiryForm.setAttribute('aria-busy','true');
      enquiryFields.querySelectorAll('input,textarea,select').forEach(field=>{field.disabled=true;});
      enquiryStatus.textContent=''; enquiryFallback.hidden=true;
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),25000);
      try {
        // The published pages use the established live contract; localhost
        // continues to use its guarded Python relay.
        const payload=client.production ? {
          fullName:values.name,businessName:values.business||'Not provided',email:values.email,
          outcome:values.topic,headache:values.message,investment:'Not provided in the website form',
          existing:'Not provided in the website form',websiteUrl:'',website:'',system:''
        } : values;
        const response=await fetch(enquiryUi.endpoint,{
          method:'POST',headers:client.production?{'Content-Type':'application/json'}:{'Content-Type':'application/json','X-Motus-Preview':'1'},
          body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',redirect:'error'
        });
        const result=await response.json();
        if (response.ok && (client.production?result.message==='Request received.':result.ok===true)) {
          enquirySent=true; enquiryFields.hidden=true; enquirySubmit.hidden=true; enquiryNew.hidden=false;
          enquiryStatus.textContent=enquiryUi.success; enquiryStatus.dataset.state='success';
          enquirySubmit.textContent=enquiryUi.sentLabel;
        } else {
          const messages={invalid:enquiryUi.invalid,rate_limited:enquiryUi.rateLimited,rejected:enquiryUi.rejected};
          const code=client.production?({400:'invalid',429:'rate_limited'}[response.status]):result.code;
          enquiryStatus.textContent=messages[code] || enquiryUi.uncertain;
          enquiryStatus.dataset.state='error'; enquiryFallback.hidden=false;
        }
      } catch {
        enquiryStatus.textContent=enquiryUi.uncertain; enquiryStatus.dataset.state='error'; enquiryFallback.hidden=false;
      } finally {
        clearTimeout(timer); enquiryBusy=false; enquirySubmit.disabled=false;
        enquiryForm.removeAttribute('aria-busy');
        enquiryFields.querySelectorAll('input,textarea,select').forEach(field=>{field.disabled=false;});
        if (!enquirySent) enquirySubmit.textContent=enquiryUi.submitLabel;
        enquiryStatus.focus();
      }
    });
    document.querySelectorAll('.faq_item').forEach(item=>{
      const sync=()=>item.querySelector('.faq_answer').setAttribute('aria-hidden',String(!item.classList.contains('is-open')));
      sync();new MutationObserver(sync).observe(item,{attributes:true,attributeFilter:['class']});
    });

    // One selected picture at every width; retain the reference's expandable list.
    const section=document.querySelector('.section_features');
    if(section){
      const tabs=[...section.querySelectorAll('.features_tabs-menu .w-tab-link')];
      const panes=[...section.querySelectorAll('.features_tabs-content>.w-tab-pane')];
      const show=i=>{
        tabs.forEach((t,k)=>{
          t.classList.toggle('w--current',k===i);
          t.setAttribute('aria-selected',String(k===i));
          t.setAttribute('tabindex',k===i?'0':'-1');
          const rule=t.querySelector('.features_tab-rule');
          if(rule)rule.style.width=k===i?'100%':'0%';
        });
        panes.forEach((p,k)=>{
          p.classList.toggle('w--tab-active',k===i);
          p.hidden=k!==i;
          p.setAttribute('aria-hidden',String(k!==i));
          p.style.opacity='1';
        });
      };
      tabs.forEach((t,i)=>{
        t.addEventListener('click',e=>{
          if(e.target.closest('a')!==t)return;
          e.preventDefault();
          show(i);
        });
        t.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i);return;}
          if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(e.key)){
            e.preventDefault();
            const j=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+tabs.length)%tabs.length;
            show(j);tabs[j].focus();
          }
        });
      });
      show(0);
    }

    const task=document.querySelector('#calc-task');
    if(task){
      const count=document.querySelector('#calc-count'),before=document.querySelector('#calc-before'),after=document.querySelector('#calc-after'),rate=document.querySelector('#calc-rate'),weeks=document.querySelector('#calc-weeks');
      const ui=client.calculatorUi;
      const form=document.querySelector('#calc-form'),output=document.querySelector('#calc-output'),pending=document.querySelector('#calc-pending');
      let lastEstimate=null,hasCalculated=false;
      const pounds=new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:2,maximumFractionDigits:2});
      const time=n=>{const m=Math.round(n);return `${Math.floor(m/60)?Math.floor(m/60)+'h ':''}${m%60?m%60+'m':''}`.trim()||'0m';};
      const validateInputs=(show=false)=>{
        const invalid=[rate,weeks].filter(input=>!input.validity.valid&&(input===rate||rate.value!==''));
        [rate,weeks].forEach(input=>{const visible=show&&invalid.includes(input);input.setAttribute('aria-invalid',String(visible));document.querySelector('#'+input.id+'-error').hidden=!visible;});
        return invalid;
      };
      const invalidate=()=>{
        lastEstimate=null;output.hidden=true;pending.hidden=false;
        document.querySelector('#calc-pending-note').textContent=hasCalculated?ui.changedText:ui.pendingText;
        document.querySelector('#calc-form-error').textContent='';validateInputs();
      };
      const updateInputs=()=>{
        const d=client.calculator[Number(task.value)];
        after.max=before.value;if(+after.value>+before.value)after.value=before.value;
        document.querySelector('#calc-count-label').textContent=ui.countLabelTemplate.replace('{noun}',d.noun.replace(/\b\w/g,c=>c.toUpperCase()));
        document.querySelector('#calc-hint').textContent=d.hint;
        document.querySelector('#calc-example').textContent=d.example.button;
        document.querySelector('#calc-example-description').textContent=d.example.description;
        document.querySelector('#calc-count-out').textContent=count.value;
        document.querySelector('#calc-before-out').textContent=before.value+' min';
        document.querySelector('#calc-after-out').textContent=after.value+' min';
      };
      form.addEventListener('submit',e=>{
        e.preventDefault();updateInputs();
        const invalid=validateInputs(true);
        if(invalid.length){document.querySelector('#calc-form-error').textContent=ui.formError;invalid[0].focus();return;}
        document.querySelector('#calc-form-error').textContent='';
        const d=client.calculator[Number(task.value)],now=+count.value*+before.value,scenario=+count.value*+after.value,saved=now-scenario;
        const hasMoney=rate.value!=='',weekly=hasMoney?saved/60*rate.valueAsNumber:0,yearly=hasMoney?weekly*weeks.valueAsNumber:0;
        document.querySelector('#calc-result-task').textContent=d.name;
        document.querySelector('#calc-result-heading').textContent=hasMoney?ui.moneyTitle:ui.timeTitle;
        document.querySelector('#calc-primary-value').textContent=hasMoney?pounds.format(yearly/12):time(saved);
        document.querySelector('#calc-result-caption').textContent=hasMoney?ui.moneyCaption:ui.timeCaption;
        document.querySelector('#calc-money-details').hidden=!hasMoney;
        document.querySelector('#calc-time-summary').hidden=!hasMoney;
        document.querySelector('#calc-money-prompt').hidden=hasMoney;
        document.querySelector('#calc-result-note').textContent=hasMoney?ui.resultNote:ui.timeResultNote;
        document.querySelector('#calc-now').textContent=time(now);
        document.querySelector('#calc-scenario').textContent=time(scenario);
        document.querySelector('#calc-saved').textContent=time(saved);
        document.querySelector('#calc-result-label').textContent='Time freed up '+d.verb+' / week';
        document.querySelector('#calc-value-week').textContent=pounds.format(weekly);
        document.querySelector('#calc-value-year').textContent=pounds.format(yearly);
        document.querySelector('#calc-money-status').textContent=ui.basisTemplate.replace('{weeks}',weeks.value);
        lastEstimate={name:d.name,count:count.value,before:before.value,after:after.value,hasMoney,rate:rate.valueAsNumber,weeks:weeks.value};
        hasCalculated=true;pending.hidden=true;output.hidden=false;
        document.querySelector('#calc-result-heading').focus({preventScroll:true});
        output.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
      });
      const taskExample=()=>{const d=client.calculator[+task.value];count.value=d.count;before.value=d.before;after.max=d.before;after.value=d.after;updateInputs();invalidate();};
      task.addEventListener('change',()=>{taskExample();document.querySelector('#calc-example-note').textContent=ui.taskChangedNote;});[count,before,after,rate,weeks].forEach(n=>n.addEventListener('input',()=>{document.querySelector('#calc-example-note').textContent=ui.editedNote;updateInputs();invalidate();}));
      document.querySelector('#calc-example').addEventListener('click',()=>{
        const d=client.calculator[+task.value];rate.value=d.example.rate;weeks.value=d.example.weeks;taskExample();
        const values={count:d.count,noun:d.noun,before:d.before,after:d.after,rate:pounds.format(d.example.rate),weeks:d.example.weeks};
        document.querySelector('#calc-example-note').textContent=ui.exampleLoadedTemplate.replace(/\{(\w+)\}/g,(_,key)=>values[key]);
      });
      document.querySelector('#calc-discuss').addEventListener('click',()=>{
        if(!lastEstimate)return;
        if(enquiryBusy){open(contact);return;}
        if(enquirySent)resetEnquiry();
        const estimate=lastEstimate;
        document.querySelector('#enquiry-topic').value='Automation or workflow';
        document.querySelector('#enquiry-message').value=`I’d like to discuss ${estimate.name.toLowerCase()}. My scenario is ${estimate.count} per week, ${estimate.before} minutes each now and ${estimate.after} minutes each afterwards.`;
        if(estimate.hasMoney)document.querySelector('#enquiry-message').value+=` My hourly cost or time value is ${pounds.format(estimate.rate)}, based on ${estimate.weeks} working weeks per year.`;
        open(contact);
      });updateInputs();
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
