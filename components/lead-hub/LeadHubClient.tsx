"use client";

import Link from "next/link";
import { getDemoEnquiryHref } from "@/lib/demo-catalog";
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Link2,
  Mail, MessageSquare, Phone, ShieldCheck, Globe2,
} from "lucide-react";

type SourceId = "website" | "phone" | "social" | "email" | "referral";
type Stage = "arrival" | "details" | "review" | "prepared" | "outcome";

type Choice = { id: string; title: string; description: string; preparedTitle: string; status: "Draft — not sent" | "Internal brief — not sent"; prepared: string; outcome: string };
type Source = { id: SourceId; label: string; format: string; time: string; title: string; message: string; name: string; company: string; owner: string; missing: string[]; fields: Array<[string, string]>; choices: Choice[]; related?: string };

const sources: Source[] = [
  { id: "website", label: "Website", format: "Form receipt", time: "09:41", title: "Commercial property in Leeds", message: "I’m looking to buy a commercial property in Leeds and would like to have a conversation about what might be possible.", name: "Daniel Mercer", company: "Northfield Property Group", owner: "Aisha Rahman", missing: ["Budget", "Purchase timeframe"], fields: [["Source", "Website form"], ["Contact", "Daniel Mercer"], ["Company", "Northfield Property Group"], ["Interest", "Commercial property purchase"]], related: "A possible introducer record exists. It is not automatically merged.", choices: [
    { id: "details", title: "Request missing purchase details", description: "Prepare a reply asking for the budget and expected purchase timeframe.", preparedTitle: "Information request ready", status: "Draft — not sent", prepared: "Hi Daniel, thank you for your enquiry. Before the team prepares for a conversation, could you confirm the expected purchase budget and your preferred timeframe?", outcome: "Aisha has the original enquiry and a draft asking only for the missing purchase details." },
    { id: "linked", title: "Keep the possible introducer record linked for review", description: "Preserve both records and flag the relationship for a person to check.", preparedTitle: "Related-record review ready", status: "Internal brief — not sent", prepared: "Possible related enquiry: an introducer record names Northfield Property Group. Keep both records intact and ask a team member to confirm whether they relate.", outcome: "The two records remain separate. A human review is ready; nothing has been merged." },
  ] },
  { id: "phone", label: "Phone", format: "Reception callback note", time: "10:08", title: "Callback about business protection", message: "Helen Shaw from Brookfield Manufacturing called reception asking for a callback about business protection.", name: "Helen Shaw", company: "Brookfield Manufacturing", owner: "Oliver Grant", missing: ["Preferred callback window"], fields: [["Source", "Reception call note"], ["Caller", "Helen Shaw"], ["Company", "Brookfield Manufacturing"], ["Interest", "Business protection"]], choices: [
    { id: "oliver", title: "Confirm Oliver’s callback brief", description: "Prepare the note for Oliver to confirm a suitable time before calling.", preparedTitle: "Callback brief ready", status: "Draft — not sent", prepared: "Callback brief for Oliver Grant: Helen Shaw asked reception to arrange a business-protection discussion. Confirm her preferred callback window before placing a call.", outcome: "Oliver has a callback brief with the original reception note and the one detail still needed." },
    { id: "queue", title: "Put it in the duty adviser queue", description: "Prepare a neutral queue brief without promising a named adviser will call.", preparedTitle: "Duty-adviser brief ready", status: "Internal brief — not sent", prepared: "Duty adviser queue: Helen Shaw asked reception for a business-protection callback. Confirm the preferred callback window, then assign the available adviser.", outcome: "The reception note is ready for the duty-adviser queue. No callback has been promised by a named person." },
  ] },
  { id: "social", label: "Social media", format: "LinkedIn message", time: "10:24", title: "A development project enquiry", message: "Hi, I’d like to ask a few questions about support for a development project. LinkedIn is easiest for me at the moment.", name: "Tariq Hussain", company: "Meridian Developments", owner: "Aisha Rahman", missing: ["Email address", "Permission to change channel"], fields: [["Source", "LinkedIn direct message"], ["Contact", "Tariq Hussain"], ["Company", "Meridian Developments"], ["Interest", "Development project"]], choices: [
    { id: "reply", title: "Prepare a LinkedIn reply", description: "Continue in the channel Tariq used.", preparedTitle: "LinkedIn reply ready", status: "Draft — not sent", prepared: "Thanks for getting in touch, Tariq. Could you share the project location and approximate timeline? Aisha can then prepare for an initial conversation.", outcome: "Aisha has a draft LinkedIn reply ready for review in the original channel." },
    { id: "email", title: "Ask permission to continue by email", description: "Prepare a short message requesting an email address and consent to move the conversation.", preparedTitle: "Channel-permission draft ready", status: "Draft — not sent", prepared: "Thanks for reaching out, Tariq. Would you be happy to continue by email? If so, please share the address you would like us to use.", outcome: "Aisha has a draft asking permission before the conversation moves away from LinkedIn." },
  ] },
  { id: "email", label: "Email", format: "Mail thread", time: "11:02", title: "Initial protection discussion", message: "Hello, I’m looking for an initial conversation about protection for our four partners. Could someone help us understand the next step?", name: "Olivia Bennett", company: "Westhaven Consulting", owner: "Oliver Grant", missing: ["Equity split", "Preferred availability"], fields: [["Source", "Shared enquiries inbox"], ["From", "Olivia Bennett"], ["Company", "Westhaven Consulting"], ["Known", "Four equity partners"]], choices: [
    { id: "details", title: "Request equity split and availability", description: "Prepare a reply that asks only for the missing information.", preparedTitle: "Information request ready", status: "Draft — not sent", prepared: "Hi Olivia, thank you for your email. To help Oliver prepare, could you share the partners’ equity split and a few suitable times for an initial conversation?", outcome: "Oliver has a focused draft ready to request the remaining context." },
    { id: "brief", title: "Prepare an internal adviser brief", description: "Package the original email and missing context for internal review.", preparedTitle: "Internal adviser brief ready", status: "Internal brief — not sent", prepared: "Internal brief for Oliver Grant: Westhaven Consulting has requested an initial protection discussion for four equity partners. Equity split and preferred availability remain to be confirmed.", outcome: "An internal adviser brief is ready. No meeting has been booked and no external reply has been sent." },
  ] },
  { id: "referral", label: "Referral", format: "Introducer note", time: "11:18", title: "Introducer referral for Daniel Mercer", message: "Priya Shah of Fenwick Introductions is introducing Daniel Mercer at Northfield Property Group, who may welcome a conversation about a commercial property purchase.", name: "Daniel Mercer", company: "Northfield Property Group", owner: "Aisha Rahman", missing: ["Client contact permission", "Introducer reference"], fields: [["Source", "Introducer email"], ["Introducer", "Priya Shah"], ["Firm", "Fenwick Introductions"], ["Prospective client", "Daniel Mercer"]], related: "A website enquiry from Northfield Property Group is visible for human review.", choices: [
    { id: "permission", title: "Ask the introducer for permission and reference", description: "Prepare a concise message to complete the referral record.", preparedTitle: "Introducer request ready", status: "Draft — not sent", prepared: "Hi Priya, thank you for the introduction. Before Aisha contacts Daniel, could you confirm the client’s contact permission and your introducer reference?", outcome: "Aisha has an introducer-only draft ready. Daniel is not contacted until the permission is confirmed." },
    { id: "linked", title: "Link the possible website enquiry for review", description: "Flag the potential relationship without assuming it is the same opportunity.", preparedTitle: "Related-record review ready", status: "Internal brief — not sent", prepared: "Possible related website enquiry: Northfield Property Group. Keep the introducer note and website enquiry as separate records for a human to review.", outcome: "The two records remain independent. A human review is ready; nothing has been merged." },
  ] },
];

const stages: Array<{ key: Stage; label: string }> = [
  { key: "arrival", label: "Original enquiry" }, { key: "details", label: "Organised details" }, { key: "review", label: "Employee review" }, { key: "prepared", label: "Prepared next step" }, { key: "outcome", label: "Outcome" },
];

function ChannelIcon({ id, size = 17 }: { id: SourceId; size?: number }) {
  const props = { size, strokeWidth: 1.7, "aria-hidden": true } as const;
  if (id === "website") return <Globe2 {...props} />;
  if (id === "phone") return <Phone {...props} />;
  if (id === "social") return <MessageSquare {...props} />;
  if (id === "email") return <Mail {...props} />;
  return <Link2 {...props} />;
}

export default function LeadHubClient() {
  const [sourceId, setSourceId] = useState<SourceId>("website");
  const [stage, setStage] = useState<Stage>("arrival");
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const source = useMemo(() => sources.find((item) => item.id === sourceId)!, [sourceId]);
  const choice = source.choices.find((item) => item.id === choiceId);
  const stageIndex = stages.findIndex((item) => item.key === stage);

  function chooseSource(next: SourceId) { setSourceId(next); setStage("arrival"); setChoiceId(null); }
  function restart() { chooseSource("website"); }
  function beginAnotherSource() { setStage("arrival"); setChoiceId(null); }
  function back() { const previous = stages[Math.max(0, stageIndex - 1)]; setStage(previous.key); }
  function selectChoice(id: string) { setChoiceId(id); }
  function changeDecision() { setChoiceId(null); setStage("review"); }

  return <main className="lead-hub-route" id="lead-hub-main">
    <header className="lead-hub-masthead">
      <Link id="lead-hub-return-to-showroom" href="/demos" className="lead-hub-brand"><span aria-hidden="true">M</span> Motus / Lead Hub</Link>
      <p><ShieldCheck size={15} aria-hidden="true" /> Fictional demo · Nothing is sent</p>
    </header>

    <section className="lead-hub-shell" aria-labelledby="lead-hub-title">
      <div className="lead-hub-intro">
        <div><p className="lead-hub-kicker">Lead Hub demonstration</p><h1 id="lead-hub-title">It starts with a conversation.</h1></div>
        <p>Choose where an enquiry arrives. See how the original context becomes a clear next step for your team.</p>
      </div>

      <nav className="lead-hub-sources" aria-label="Choose enquiry source">
        <span>An enquiry arrives via</span>
        {sources.map((item) => <button key={item.id} id={`lead-hub-source-${item.id}`} type="button" aria-pressed={sourceId === item.id} className={sourceId === item.id ? "is-selected" : ""} onClick={() => chooseSource(item.id)}><ChannelIcon id={item.id} />{item.label}</button>)}
      </nav>

      <p className="lead-hub-progress-mobile" aria-hidden="true">Step {stageIndex + 1} of {stages.length} · {stages[stageIndex].label}</p>
      <ol className="lead-hub-progress" aria-label="Journey progress">{stages.map((item, index) => <li key={item.key} className={index === stageIndex ? "is-current" : index < stageIndex ? "is-complete" : ""} aria-current={index === stageIndex ? "step" : undefined}><span>{index < stageIndex ? <Check size={12} aria-hidden="true" /> : index + 1}</span>{item.label}</li>)}</ol>

      <section className="lead-hub-stage" aria-live="polite">
        <div className="lead-hub-sheet-top"><span><ChannelIcon id={source.id} />{source.format}</span><time>{source.time}</time></div>
        {stage === "arrival" && <Arrival source={source} onNext={() => setStage("details")} onRestart={restart} />}
        {stage === "details" && <Details source={source} onBack={back} onNext={() => setStage("review")} />}
        {stage === "review" && <Review source={source} selected={choiceId} onSelect={selectChoice} onBack={back} onNext={() => choiceId && setStage("prepared")} />}
        {stage === "prepared" && choice && <Prepared source={source} choice={choice} onBack={back} onChange={changeDecision} onNext={() => setStage("outcome")} />}
        {stage === "outcome" && choice && <Outcome source={source} choice={choice} onReview={() => setStage("prepared")} onAnother={beginAnotherSource} />}
      </section>
      <Link id="lead-hub-enquiry-link" href={getDemoEnquiryHref("lead-hub")} className="lead-hub-discuss">Ask about this for your business <ArrowRight size={16} aria-hidden="true" /></Link>
      <p className="lead-hub-boundary">This illustrative journey prepares work for an employee to review. It does not send messages, schedule meetings, make advice decisions or merge records.</p>
    </section>
  </main>;
}

function Arrival({ source, onNext, onRestart }: { source: Source; onNext: () => void; onRestart: () => void }) { return <div className="lead-hub-arrival">
  <div className={`lead-hub-message lead-hub-message--${source.id}`}><div className="lead-hub-message-copy"><p className="lead-hub-message-label">{source.id === "phone" ? "Received by reception" : source.id === "email" ? "From Olivia Bennett · Westhaven Consulting" : source.id === "referral" ? "Introducer: Priya Shah · Fenwick Introductions" : source.id === "social" ? "Incoming direct message" : "Submitted enquiry"}</p><h2>{source.title}</h2><p>{source.message}</p><strong>{source.name}</strong><span>{source.company}</span></div><TeamNote source={source} /></div>
  <div className="lead-hub-actions"><button id="lead-hub-see-organised" type="button" className="lead-hub-primary" onClick={onNext}>See it organised <ArrowRight size={17} aria-hidden="true" /></button><button id="lead-hub-restart-arrival" type="button" className="lead-hub-text" onClick={onRestart}>Restart</button></div>
</div>; }

function TeamNote({ source }: { source: Source }) { return <aside className="lead-hub-team-note"><p>For your team</p><span>Review owner · <strong>{source.owner}</strong></span><span>Still to confirm · <strong>{source.missing.join(" and ")}</strong></span></aside>; }

function Details({ source, onBack, onNext }: { source: Source; onBack: () => void; onNext: () => void }) { return <div className="lead-hub-details"><header><p>Organised details</p><h2>Everything useful, without a guess.</h2></header><dl>{source.fields.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl><div className="lead-hub-detail-lower"><div><p>Original message</p><blockquote>“{source.message}”</blockquote></div><div><p>Still to confirm</p><ul>{source.missing.map((item) => <li key={item}>{item}<span>Not provided</span></li>)}</ul></div></div>{source.related && <p className="lead-hub-related"><Link2 size={16} aria-hidden="true" /> {source.related}</p>}<StageActions back={onBack} next={onNext} nextLabel="Review with your team" /></div>; }

function Review({ source, selected, onSelect, onBack, onNext }: { source: Source; selected: string | null; onSelect: (id: string) => void; onBack: () => void; onNext: () => void }) { return <div className="lead-hub-review"><header><p>Employee review</p><h2>Choose the next step.</h2><span>The context is clear. A person chooses what happens next.</span></header><div className="lead-hub-choice-list" role="group" aria-label="Employee decision">{source.choices.map((item) => <button key={item.id} id={`lead-hub-decision-${source.id}-${item.id}`} type="button" className={selected === item.id ? "is-selected" : ""} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}><span>{selected === item.id && <Check size={14} aria-hidden="true" />}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></button>)}</div><p className="lead-hub-decision-status">{selected ? "Decision selected. The next step can now be prepared." : "Select one option to prepare the next step."}</p><StageActions back={onBack} next={onNext} nextLabel="Prepare next step" disabled={!selected} /></div>; }

function Prepared({ source, choice, onBack, onChange, onNext }: { source: Source; choice: Choice; onBack: () => void; onChange: () => void; onNext: () => void }) { return <div className="lead-hub-prepared"><header><div><p>Prepared next step</p><h2>{choice.preparedTitle}</h2></div><span className="lead-hub-status">{choice.status}</span></header><div className="lead-hub-prepared-meta"><span>Review owner <strong>{source.owner}</strong></span><span>Source <strong>{source.format}</strong></span></div><p className="lead-hub-prepared-copy">{choice.prepared}</p><p className="lead-hub-safe"><ShieldCheck size={16} aria-hidden="true" /> An employee reviews this before any follow-up happens.</p><div className="lead-hub-actions"><button id="lead-hub-back-prepared" type="button" className="lead-hub-text" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> Back to review</button><button id="lead-hub-change-decision" type="button" className="lead-hub-text" onClick={onChange}>Change decision</button><button id="lead-hub-see-outcome" type="button" className="lead-hub-primary" onClick={onNext}>See what is ready <ArrowRight size={17} aria-hidden="true" /></button></div></div>; }

function Outcome({ source, choice, onReview, onAnother }: { source: Source; choice: Choice; onReview: () => void; onAnother: () => void }) { return <div className="lead-hub-outcome"><Check className="lead-hub-outcome-check" size={22} aria-hidden="true" /><p>Ready for your team</p><h2>{choice.outcome}</h2><dl><div><dt>Original source</dt><dd>{source.format}</dd></div><div><dt>Review owner</dt><dd>{source.owner}</dd></div><div><dt>Prepared item</dt><dd>{choice.preparedTitle}</dd></div><div><dt>Still controlled by a person</dt><dd>Review and follow-up</dd></div></dl><div className="lead-hub-actions"><button id="lead-hub-review-prepared" type="button" className="lead-hub-text" onClick={onReview}><ArrowLeft size={16} aria-hidden="true" /> Review prepared step</button><button id="lead-hub-choose-another" type="button" className="lead-hub-primary" onClick={onAnother}>Choose another source <ChevronRight size={17} aria-hidden="true" /></button><Link id="lead-hub-discuss-workflow" href={getDemoEnquiryHref("lead-hub")} className="lead-hub-discuss">Ask about this for your business <ArrowRight size={16} aria-hidden="true" /></Link></div></div>; }

function StageActions({ back, next, nextLabel, disabled = false }: { back: () => void; next: () => void; nextLabel: string; disabled?: boolean }) { return <div className="lead-hub-actions"><button id="lead-hub-stage-back" type="button" className="lead-hub-text" onClick={back}><ArrowLeft size={16} aria-hidden="true" /> Back</button><button id="lead-hub-stage-next" type="button" className="lead-hub-primary" disabled={disabled} onClick={next}>{nextLabel} <ArrowRight size={17} aria-hidden="true" /></button></div>; }
