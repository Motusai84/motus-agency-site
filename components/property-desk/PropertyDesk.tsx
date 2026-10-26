"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { getDemoEnquiryHref } from "@/lib/demo-catalog";
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCheck, ChevronRight, CircleAlert,
  FileText, Inbox, Mail, Paperclip, PencilLine, RotateCcw, Flag, Archive, Trash2, OctagonAlert, Reply, Forward, Printer, ExternalLink, FolderInput, Undo2,
  Search, ShieldCheck, Star, Tag, UserRound, X, Menu, ChevronDown,
  ChevronLeft, MoreVertical, Settings, CircleHelp, Grip, SlidersHorizontal,
  Clock, Send, RefreshCw, CalendarDays, Lightbulb, CheckCircle2, Plus, Play, Pause,
} from "lucide-react";
import { propertyDesk as scenario, mailProviders, type AttentionTarget, type MailProvider, type DraftEvidence, type PropertyEmail, type PropertyKey } from "@/src/clients/property-desk";
import s from "./PropertyDesk.module.css";

type MailView = "inbox" | "starred" | "drafts" | "sent" | "snoozed" | PropertyKey;
const propertyKeys = Object.keys(scenario.properties) as PropertyKey[];
const categories = [...new Set(scenario.emails.map((email) => email.category))];

function Signal({ small = false }: { small?: boolean }) {
  return <span className={`${s.signal} ${small ? s.signalSmall : ""}`} aria-hidden="true"><span /><span /><span /></span>;
}

type AttentionCue = { target: AttentionTarget; text: string } | undefined;
function EmailBadge({ email }: { email: PropertyEmail }) {
  return <span className={s.badge} data-tone={email.tone}>{email.category}</span>;
}

function AttentionNote({ cue, target }: { cue: AttentionCue; target: AttentionTarget }) {
  return cue?.target === target ? <span className={s.attentionNote}><ArrowRight size={13} aria-hidden="true" />{cue.text}</span> : null;
}

function HighlightedReport({ body, step, cue }: { body: string; step: number; cue: AttentionCue }) {
  let parts: (string | { text: string; step: number })[] = [body];
  for (const highlight of scenario.reportHighlights) {
    parts = parts.flatMap(part => {
      if (typeof part !== "string") return [part];
      return part.split(highlight.text).flatMap((text, index) => index ? [highlight, text] : [text]);
    });
  }
  return parts.map((part, index) => typeof part === "string" ? part : <mark key={index} data-attention={cue?.target === (part.step === 1 ? "address" : "issue") && part.text === scenario.reportHighlights.find(item => item.step === part.step)?.text} data-lit={part.step === step}>{part.text}</mark>);
}

function MarkedText({ text, terms, attentionTerm }: { text: string; terms: string[]; attentionTerm?: string }) {
  let parts: (string | { text: string })[] = [text];
  for (const term of terms.filter(Boolean)) {
    parts = parts.flatMap(part => typeof part !== "string" ? [part] : part.split(term).flatMap((value, index) => index ? [{ text: term }, value] : [value]));
  }
  return parts.map((part, index) => typeof part === "string" ? part : <mark key={index} data-attention={part.text === attentionTerm} data-lit="true">{part.text}</mark>);
}

function EvidenceSource({ evidence, location, onClose, cue }: { cue?: AttentionCue; evidence: DraftEvidence; location: "desktop" | "mobile"; onClose: () => void }) {
  return <section id={`pd-source-${location}`} className={s.evidenceSource} aria-label="Source for the selected draft sentence">
    <p className={s.addonNote}>{scenario.delivery.sourceLabel}</p>
    <div className={s.evidenceHeading}><span><Mail size={15} />Original email{evidence.sources.length > 1 ? "s" : ""}</span><button id={`pd-close-source-${location}`} onClick={onClose} aria-label="Close source and return to draft sentence"><X size={16} /></button></div>
    {evidence.sources.map(source => {
      const email = scenario.emails.find(item => item.id === source.emailId)!;
      return <article key={email.id} className={s.sourceEmail}>
        <div><strong>{email.sender}</strong><time>{email.time} · 13 Oct</time></div>
        <small>{email.role}</small><h4>{email.subject}</h4>
        <AttentionNote cue={cue} target="source-quote" /><p><MarkedText text={email.body} terms={source.highlights} attentionTerm={cue?.target === "source-quote" ? "The inspection quote is £285." : undefined} /></p>
      </article>;
    })}
    <p className={s.evidenceNote}>{evidence.note}</p>
  </section>;
}

function LinkedDraft({ active, playing, onSelect, onClose, cue }: { cue?: AttentionCue; active?: DraftEvidence; playing: boolean; onSelect: (id: string) => void; onClose: () => void }) {
  return <div className={s.linkedDraft}>
    <p className={s.evidenceHint}>{playing ? active ? "The highlighted words connect this draft to the original email." : "Watch the quote move from its original email into this draft." : "Optional: select an underlined sentence to check its source."}</p>
    {scenario.draftParagraphs.map((paragraph, index) => {
      let parts: (string | DraftEvidence)[] = [paragraph];
      for (const evidence of scenario.draftEvidence) {
        parts = parts.flatMap(part => typeof part !== "string" ? [part] : part.split(evidence.text).flatMap((text, i) => i ? [evidence, text] : [text]));
      }
      return <div className={s.draftParagraph} key={index}>{parts.map(part => typeof part === "string" ? part : <Fragment key={part.id}>
        <AttentionNote cue={part.id === "quote" ? cue : undefined} target="draft-quote" /><button id={`pd-draft-fact-${part.id}`} data-attention={cue?.target === "draft-quote" && part.id === "quote"} className={s.draftFact} aria-expanded={active?.id === part.id} aria-controls={active?.id === part.id ? "pd-source-desktop pd-source-mobile" : undefined} onClick={() => onSelect(part.id)}>{part.text}<span className={s.sourceLinkLabel}>{active?.id === part.id ? "Source shown" : "Show source"}<ArrowRight size={12} /></span></button>
        {active?.id === part.id && <div className={s.mobileEvidence}><EvidenceSource evidence={part} location="mobile" onClose={onClose} cue={cue} /></div>}
      </Fragment>)}</div>;
    })}
  </div>;
}

export default function PropertyDesk() {
  const [provider, setProvider] = useState<MailProvider>("gmail");
  const outlook = provider === "outlook";
  const mailUi = mailProviders[provider];
  const SavedIcon = outlook ? Flag : Star;
  function providerCopy(text: string) {
    return outlook ? text.replace(/labelled/g, "categorised").replace(/labels/g, "categories").replace(/label/g, "category") : text;
  }
  const [guided, setGuided] = useState(true);
  const [frameIndex, setFrameIndex] = useState(-1);
  const frame = scenario.storyFrames[frameIndex];
  const tourStep = frame?.step ?? -1;
  const relatedCount = frame?.relatedCount ?? 4;
  const [playing, setPlaying] = useState(false);
  const playbackClock = useRef({ key: "", elapsed: 0 });
  const playbackProgress = useRef<HTMLDivElement>(null);
  const playbackFill = useRef<HTMLSpanElement>(null);
  const playbackSteps = useRef<HTMLSpanElement>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [contextEmailId, setContextEmailId] = useState<string | null>(null);
  const evidenceReturn = useRef<string | null>(null);
  // Suppress story annotations while the viewer inspects a different source.
  const cue: AttentionCue = guided && frame && (contextEmailId ?? undefined) === frame.contextEmailId && (evidenceId ?? undefined) === frame.evidenceId
    ? { target: frame.attention, text: providerCopy(frame.annotation) } : undefined;
  const activeEvidence = guided && tourStep >= 4 ? scenario.draftEvidence.find(item => item.id === evidenceId) : undefined;
  const [replayCount, setReplayCount] = useState(0);
  const tourPanel = useRef<HTMLElement>(null);
  const tour = scenario.walkthrough[tourStep];
  const finalStep = tourStep === scenario.walkthrough.length - 1;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const [refreshed, setRefreshed] = useState(false);
  const [inboxOrganised, setOrganised] = useState(false);
  const organised = guided ? tourStep >= 2 && frame.attention !== "issue" : inboxOrganised;
  const showProperty = guided ? tourStep >= 1 && frame.attention !== "address" : inboxOrganised;
  const showRelated = guided ? tourStep >= 3 : inboxOrganised;
  const tourDraft = guided && tourStep >= 4;
  const [routeConfirmed, setConfirmed] = useState(false);
  const confirmed = !guided && routeConfirmed;
  const [view, setView] = useState<MailView>("inbox");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [starred, setStarred] = useState<string[]>([]);
  const [inboxRead, setRead] = useState<string[]>([]);
  const read = guided ? (tourStep >= 0 ? ["leak"] : []) : inboxRead;
  const [inboxHasDraft, setHasDraft] = useState(false);
  const hasDraft = guided ? tourStep >= 4 : inboxHasDraft;
  const [saved, setSaved] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualDraft, setManualDraft] = useState({ to: "", subject: "", body: "", saved: false });
  const [draftSubject, setDraftSubject] = useState(scenario.draftSubject);
  const [draftBody, setDraftBody] = useState(scenario.draftBody);
  const [announcement, setAnnouncement] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const selected = scenario.emails.find((email) => email.id === (guided ? (tourStep === 3 ? contextEmailId ?? "leak" : tourStep >= 0 ? "leak" : null) : selectedId));
  const currentProperty = selected ? scenario.properties[selected.property] : null;
  const alderSelected = selected?.property === "alder";
  const draftVisible = hasDraft && `${draftSubject} Nadia Ellis ${draftBody}`.toLowerCase().includes(query.toLowerCase());
  const manualVisible = manualDraft.saved && `${manualDraft.to} ${manualDraft.subject} ${manualDraft.body}`.toLowerCase().includes(query.toLowerCase());
  const draftCount = Number(draftVisible) + Number(manualVisible);
  const anyDraft = hasDraft || manualDraft.saved;
  const filtered = scenario.emails.filter((email) => {
    if (view === "drafts" || view === "sent" || view === "snoozed") return false;
    if (view === "starred" && !starred.includes(email.id)) return false;
    if (propertyKeys.includes(view as PropertyKey) && email.property !== view) return false;
    if (category && email.category !== category) return false;
    const property = scenario.properties[email.property];
    return `${email.sender} ${email.subject} ${email.body} ${email.category} ${property.name} ${property.flat}`
      .toLowerCase().includes(query.trim().toLowerCase());
  });
  const visibleCount = view === "drafts" ? draftCount : filtered.length;
  const viewTitle = category ?? (view === "inbox" ? "Inbox" : view === "starred" ? mailUi.saved : view === "drafts" ? "Drafts" : view === "sent" ? mailUi.sent : view === "snoozed" ? "Snoozed" : scenario.properties[view].name);

  useEffect(() => {
    if (selectedId) detailTitle.current?.focus({ preventScroll: true });
  }, [selectedId]);

  useEffect(() => {
    const key = `${frameIndex}:${replayCount}`;
    if (playbackClock.current.key !== key) playbackClock.current = { key, elapsed: 0 };
    const clock = playbackClock.current;
    const duration = (frame?.seconds ?? 0) * 1000;
    const paintProgress = () => {
      const fraction = duration ? Math.min(clock.elapsed / duration, 1) : 0;
      // One clock drives the visual fill and scene changes; no per-frame React render.
      if (playbackFill.current) playbackFill.current.style.transform = `scaleX(${fraction})`;
      if (playbackSteps.current) playbackSteps.current.style.transform = `scaleX(${Math.floor(fraction * 4) / 4})`;
      playbackProgress.current?.setAttribute("aria-valuenow", String(Math.floor(fraction * 100)));
    };
    paintProgress();
    if (!guided || !playing || !duration) return;
    const started = performance.now();
    const elapsedBeforePlay = clock.elapsed;
    let tickId = 0;
    const tick = (now: number) => {
      clock.elapsed = Math.min(duration, elapsedBeforePlay + now - started);
      paintProgress();
      if (clock.elapsed < duration) { tickId = requestAnimationFrame(tick); return; }
      const nextFrame = scenario.storyFrames[frameIndex + 1];
      if (!nextFrame) { setPlaying(false); return; }
      setFrameIndex(frameIndex + 1);
      setEvidenceId(nextFrame.evidenceId ?? null);
      setContextEmailId(nextFrame.contextEmailId ?? null);
      setWhyOpen(false);
      if (!nextFrame.seconds) setPlaying(false);
    };
    tickId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(tickId);
      clock.elapsed = Math.min(duration, elapsedBeforePlay + performance.now() - started);
      paintProgress();
    };
  }, [guided, playing, frameIndex, frame, replayCount]);

  const attention = cue?.target;
  useEffect(() => {
    if (!guided || tourStep < 0) return;
    // Let the browser settle scroll bounds after swapping the context/source pane.
    let settledFrame = 0;
    let alignmentFrame = 0;
    const alignReadingTarget = () => {
      cancelAnimationFrame(alignmentFrame); cancelAnimationFrame(settledFrame);
      alignmentFrame = requestAnimationFrame(() => { settledFrame = requestAnimationFrame(() => {
      const returnId = evidenceReturn.current;
      evidenceReturn.current = null;
      const narrow = window.matchMedia("(max-width: 900px)").matches;
      const sourceTarget = narrow ? `#pd-draft-fact-${evidenceId}` : "#pd-source-desktop";
      const attentionTarget = attention === "property" || attention === "category" ? `.${s.labelAttention}`
        : attention?.startsWith("related-") ? `#pd-${attention}`
        : attention && ["report", "address", "issue", "quote"].includes(attention) ? `.${s.bodyAttention}` : undefined;
      let target = document.querySelector<HTMLElement>(returnId ? `#pd-draft-fact-${returnId}` : activeEvidence ? sourceTarget : attentionTarget ?? (tourStep === 3 && !contextEmailId ? `.${s.propertyPane}` : tourStep === 4 ? `.${s.tourDraftHeader}` : tourStep === 5 ? `.${s.tourReview}` : `.${s.messageBody}`));
      if (!returnId && narrow && attention === "draft-quote") target = target?.closest<HTMLElement>(`.${s.draftParagraph}`) ?? target;
      if (!target || !tourPanel.current) return;
      if (returnId) target.focus({ preventScroll: true });
      const captionHeight = tourPanel.current.getBoundingClientRect().height;
      if (!returnId && narrow && attention === "source-quote") {
        const price = document.querySelector<HTMLElement>('#pd-source-mobile [data-attention="true"]');
        // When the pair cannot fit, show the original source for this beat.
        // The following beat returns to the matching draft sentence.
        if (price && price.getBoundingClientRect().bottom - target.getBoundingClientRect().top > window.innerHeight - captionHeight - 32) {
          target = price.closest<HTMLElement>(`.${s.sourceEmail}`) ?? price;
        }
      }
      const bounds = target.getBoundingClientRect();
      const preceding = target.previousElementSibling;
      const anchorTop = preceding?.classList.contains(s.attentionNote) ? preceding.getBoundingClientRect().top : bounds.top;
      if ((activeEvidence && narrow) || anchorTop < captionHeight + 12 || bounds.bottom > window.innerHeight - 16) {
        window.scrollTo({ top: window.scrollY + anchorTop - captionHeight - 16, behavior: keyboard || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }
      }); });
    };
    alignReadingTarget();
    window.addEventListener("resize", alignReadingTarget);
    return () => { window.removeEventListener("resize", alignReadingTarget); cancelAnimationFrame(alignmentFrame); cancelAnimationFrame(settledFrame); };
  }, [guided, playing, tourStep, replayCount, keyboard, evidenceId, activeEvidence, contextEmailId, frameIndex, attention, provider]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  function startTour() {
    setEvidenceId(null); setContextEmailId(null);
    setGuided(true); setFrameIndex(0); setPlaying(true); setWhyOpen(false); setComposerOpen(false);
    setReplayCount(previous => previous + 1);
    setView("inbox"); setCategory(null); setQuery(""); setChecked([]); setSidebarOpen(true);
    setSelectedId(null); setRefreshed(false);
    requestAnimationFrame(() => tourPanel.current?.scrollIntoView({ block: "start", behavior: "instant" }));
  }

  function selectEvidence(id: string) {
    if (id === evidenceId) { closeEvidence(); return; }
    setPlaying(false); setWhyOpen(false); setEvidenceId(id);
    setAnnouncement(`${scenario.draftEvidence.find(item => item.id === id)?.note} Playback paused.`);
  }

  function closeEvidence() {
    evidenceReturn.current = evidenceId;
    setPlaying(false); setEvidenceId(null);
  }

  function goToFrame(index: number, keepPlaying = false) {
    const nextFrame = scenario.storyFrames[index];
    if (!nextFrame) return;
    setPlaying(keepPlaying && nextFrame.seconds > 0); setWhyOpen(false);
    setFrameIndex(index);
    setEvidenceId(nextFrame.evidenceId ?? null);
    setContextEmailId(nextFrame.contextEmailId ?? null);
    setReplayCount(previous => previous + 1);
  }

  function showPropertyEmails() {
    goToFrame(scenario.storyFrames.findIndex(item => item.step === 3 && item.relatedCount === 4));
  }

  function togglePlayback() {
    if (playing) { setPlaying(false); return; }
    setEvidenceId(frame.evidenceId ?? null);
    setContextEmailId(frame.contextEmailId ?? null);
    setWhyOpen(false); setPlaying(true);
  }

  function explore() {
    setPlaying(false); setGuided(false); setOrganised(tourStep >= 2);
    setSelectedId(tourStep >= 0 ? "leak" : null);
    if (tourStep >= 4) { setHasDraft(true); setSaved(false); }
  }

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (composerOpen && !element.open) element.showModal();
    if (!composerOpen && element.open) element.close();
  }, [composerOpen]);

  function navigate(next: MailView, nextCategory: string | null = null) {
    setRefreshed(false);
    setView(next);
    setCategory(nextCategory);
    setSelectedId(null);
    setQuery("");
    setChecked([]);
  }

  function openEmail(id: string) {
    setSelectedId(id);
    setRead((previous) => previous.includes(id) ? previous : [...previous, id]);
  }

  function organise() {
    setOrganised(true);
    navigate("inbox");
    setAnnouncement("Seven emails organised by work type and property. The leak report needs prompt staff review. Suggested staff routes still need confirmation.");
  }

  function confirmRoute() {
    setConfirmed(true);
    setAnnouncement("Alder Court property match and route to Amara confirmed in this preview. No email has been forwarded or sent.");
  }

  function openDraft() {
    setManualMode(false);
    setHasDraft(true);
    setComposerOpen(true);
  }

  function reset() {
    setEvidenceId(null); setContextEmailId(null);
    setGuided(true); setFrameIndex(-1); setPlaying(false); setWhyOpen(false);
    setChecked([]); setSidebarOpen(true);
    setRefreshed(false);
    setManualMode(false); setManualDraft({ to: "", subject: "", body: "", saved: false });
    setOrganised(false); setConfirmed(false); setView("inbox"); setCategory(null);
    setQuery(""); setSelectedId(null); setStarred([]); setRead([]); setHasDraft(false);
    setSaved(false); setComposerOpen(false); setDraftSubject(scenario.draftSubject);
    setDraftBody(scenario.draftBody); setAnnouncement("Preview restarted. Seven unorganised emails are in the inbox.");
  }

  function replyToSelected() {
    if (!selected) return;
    setManualMode(true);
    setManualDraft({ to: selected.sender, subject: `Re: ${selected.subject}`, body: "", saved: false });
    setComposerOpen(true);
  }

  function toggleStar(id: string) {
    setStarred((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  }

  return (
    <div className={s.root} data-provider={provider} data-keyboard={keyboard} data-watching={guided && tourStep >= 0} data-story-frame={guided ? frameIndex : undefined} data-playing={playing} data-reading-source={!!activeEvidence}
      onKeyDownCapture={() => setKeyboard(true)} onPointerDownCapture={() => setKeyboard(false)}>
      <a id="pd-skip" href="#pd-mailbox" className={s.skip}>Skip to inbox</a>
      <header className={s.topbar}>
        <Link id="pd-motus-home" href="/" className={s.wordmark}><Signal small /> Motus</Link>
        <div className={s.previewTitle}><span /> Property Desk <span className={s.previewDivider}>/</span> <span className={s.previewLabel}>Interactive demo</span></div>
        <div className={s.providerSwitch} role="group" aria-label="Choose email interface">
          {(["gmail", "outlook"] as const).map(option => <button key={option} id={`pd-provider-${option}`} aria-pressed={provider === option} onClick={() => {
            if (provider === option) return;
            setProvider(option); setPlaying(false);
            setAnnouncement(`${mailProviders[option].name} view selected. Your place is kept.${guided && tourStep >= 0 && !finalStep ? " Press Continue to resume." : ""}`);
          }}>{mailProviders[option].name}</button>)}
        </div>
        <button id="pd-reset" aria-label="Restart preview" className={s.reset} onClick={reset}><RotateCcw size={14} /> <span>Restart preview</span></button>
      </header>

      <main className={s.main}>
        <section className={s.intro} aria-labelledby="pd-title">
          <div><p className={s.eyebrow}>A morning in lettings</p><h1 id="pd-title">Same inbox. <em>Clearer next steps.</em></h1>
            <p className={s.introCopy}>Property emails organised. Relevant messages brought together. Replies prepared for your team to check.</p>
          </div>
          <div className={s.providerArea}><span className={s.simulationLabel}>Interactive simulation</span><span className={s.providerCaption}>{mailUi.name} walkthrough · fictional lettings agency</span></div>
        </section>

        <section ref={tourPanel} className={s.walkthrough} aria-label="Guided explanation">
          {guided ? <div className={s.tourGuide}>
            {tourStep < 0 ? <>
              <div className={s.tourWelcome}><span className={s.tourEyebrow}>ONE CLICK · ABOUT 90 SECONDS</span><h2>From a leak report to a landlord update.</h2><p>{scenario.delivery.welcome}</p></div>
              <div className={s.tourControls}><button id="pd-watch" className={s.primaryButton} onClick={startTour}>Watch how it works <Play size={16} /></button><button id="pd-explore" className={s.tourTextButton} onClick={explore}>Explore it myself <ArrowRight size={14} /></button></div>
            </> : <>
              <ol className={s.tourSteps} aria-label="Three chapters">{scenario.chapters.map((chapter, index) => <li key={chapter} aria-current={index === tour.chapter ? "step" : undefined} data-done={index < tour.chapter}><span>{index < tour.chapter ? <Check size={12} /> : index + 1}</span>{chapter}</li>)}</ol>
              <div className={s.tourExplanation}>
                <div aria-live="polite" aria-atomic="true"><span className={s.tourEyebrow}>{mailUi.name} · MOTUS DEMONSTRATION · {tour.label}</span><h2>{activeEvidence ? (playing ? frame.title : "Check the sentence against its source.") : providerCopy(frame.title ?? tour.title)}</h2><div className={s.tourChange}><ArrowRight size={15} /><span>{!playing && tourStep === 3 && contextEmailId ? "The original message is open. Its property wording is highlighted." : providerCopy(frame.caption ?? tour.change)}</span></div></div>
                <button id="pd-tour-why" className={s.tourWhyButton} aria-expanded={whyOpen} aria-controls="pd-tour-reason" onClick={() => { setPlaying(false); setWhyOpen(!whyOpen); }}>Why this happens <ChevronDown size={13} /></button>
                <p id="pd-tour-reason" className={s.tourReason} hidden={!whyOpen}>{providerCopy(tour.explanation)}</p>
              </div>
              <div className={s.tourControls}>
                {finalStep ? <button id="pd-tour-explore" className={s.primaryButton} onClick={explore}>Explore the inbox<ArrowRight size={16} /></button> : <div className={s.tourActions}>
                  <button id="pd-tour-play" className={s.tourTextButton} onClick={togglePlayback}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? "Pause" : "Continue"}</button>
                  <button id="pd-tour-next" className={s.primaryButton} onClick={() => goToFrame(frameIndex + 1, playing)}>Next<ChevronRight size={16} /></button>
                </div>}
                <div className={s.tourSecondary}>
                  <button id="pd-tour-back" className={s.tourTextButton} disabled={frameIndex === 0} onClick={() => goToFrame(frameIndex - 1)}><ChevronLeft size={14} />Previous</button>
                  <span id="pd-tour-position" className={s.tourPosition}>Step {frameIndex + 1} of {scenario.storyFrames.length}</span>
                </div>
                {finalStep && <button id="pd-tour-replay" className={s.tourTextButton} onClick={startTour}><RotateCcw size={13} />Watch again</button>}
                <div className={s.playbackStatus}>
                  <span id="pd-playback-state" className={s.playbackState} role="status">{finalStep ? <Check size={12} /> : playing ? <Play size={11} /> : <Pause size={11} />}{finalStep ? "Finished · ready for review" : playing ? "Playing · advances automatically" : "Paused · continue when ready"}</span>
                  {!finalStep && <>
                    <div id="pd-playback-progress" ref={playbackProgress} className={s.playbackTrack} role="progressbar" aria-label="Current walkthrough moment" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                      <span ref={playbackFill} className={s.playbackFill} aria-hidden="true" /><span ref={playbackSteps} className={s.playbackSteps} aria-hidden="true" />
                    </div>
                    <span id="pd-playback-next" className={s.playbackNext}>Up next: {providerCopy(frame.upNext ?? "team review")}</span>
                  </>}
                </div>
              </div>
            </>}
          </div> : <>
          <button id="pd-return-tour" className={s.returnTour} onClick={startTour}><Play size={13} />Follow the guided example</button>              <div className={s.guide} data-complete={saved}>
                <div className={s.guideIcon}>{saved ? <CheckCheck size={21} /> : <Signal small />}</div>
                <div className={s.guideCopy}>
                  <strong>{saved ? "Ready for a person to review." : !organised ? "Give this morning’s inbox a head start." : confirmed ? "The right property. A clear handoff." : alderSelected ? "One property. Four conversations." : "Seven emails. Each with a next step."}</strong>
                  <span>{saved ? "Your landlord draft is saved in this preview. Nothing has been sent." : !organised ? "Organise the mail by property and what needs doing next." : confirmed ? "Now bring the known facts into one landlord update." : alderSelected ? "Check the related emails, then confirm the handoff to Amara." : "Start with the leak report and follow the related conversations."}</span>
                </div>
                {!organised ? <button id="pd-organise" className={s.primaryButton} onClick={organise}>Play automation <ArrowRight size={15} /></button>
                  : confirmed ? <button id="pd-open-draft" className={s.primaryButton} onClick={openDraft}>{hasDraft ? "Open draft" : "Prepare update"}<PencilLine size={15} /></button>
                  : alderSelected ? <button id="pd-confirm-route-top" className={s.primaryButton} onClick={confirmRoute}>Confirm handoff <Check size={15} /></button>
                  : <button id="pd-open-leak" className={s.primaryButton} onClick={() => openEmail("leak")}>Open leak report <ArrowRight size={15} /></button>}
              </div>

          </>}
        </section>

        <div className={s.mailFrame}>
        <section id="pd-mailbox" className={s.mailbox} aria-label={`${mailUi.name} simulation for fictional ${scenario.agency}`} tabIndex={-1} data-organised={organised} data-sidebar={sidebarOpen} data-tour-step={guided ? tourStep : undefined}>
          <div className={s.mailHeader}>
            <div className={s.agency}><button disabled={guided} id="pd-toggle-navigation" className={s.iconButton} aria-label="Toggle mailbox navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button>{outlook ? <><span className={s.outlookMark} aria-hidden="true"><span>O</span><Mail size={26} /></span><span className={s.outlookName}>Outlook</span></> : <><svg className={s.gmailMark} viewBox="0 0 32 24" aria-hidden="true"><path fill="#4285f4" d="M2 24h5V10L0 5v17a2 2 0 0 0 2 2"/><path fill="#34a853" d="M25 24h5a2 2 0 0 0 2-2V5l-7 5"/><path fill="#ea4335" d="M7 10v-7l9 7 9-7v7l-9 7"/><path fill="#fbbc04" d="M25 3v7l7-5V3a3 3 0 0 0-4.8-2.4"/><path fill="#c5221f" d="M0 3v2l7 5V3L4.8.6A3 3 0 0 0 0 3"/></svg><span className={s.gmailName}>Gmail</span></>}</div>
            <div className={s.searchBox}><Search size={18} /><label className={s.srOnly} htmlFor="pd-search">Search example emails</label>
              <input disabled={guided} id="pd-search" type="search" placeholder={outlook ? "Search" : "Search mail"} value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(null); setChecked([]); }} /><SlidersHorizontal size={20} aria-hidden="true" />
              {query && <button disabled={guided} id="pd-clear-search" aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button>}
            </div>
            <div className={s.account}><button disabled={guided} id="pd-compose-mobile" className={s.mobileCompose} aria-label="Compose example message" onClick={() => { setManualMode(true); setComposerOpen(true); }}><PencilLine size={20} /></button><span className={s.chromeIcons} aria-hidden="true"><CircleHelp size={21} /><Settings size={21} /><Grip size={21} /></span><span className={s.accountAvatar} title="Amara Lewis · Northline Lettings · fictional account">A</span></div>
          </div>

          {outlook && <div className={s.outlookRibbon}>
            <div className={s.ribbonTabs} aria-hidden="true"><span className={s.outlookHome}>Home</span><span>View</span><span>Help</span></div>
            <button id="pd-outlook-new-mail" disabled={guided} onClick={() => { setManualMode(true); setComposerOpen(true); }}><PencilLine size={17} />New mail<ChevronDown size={13} /></button>
            <span className={s.ribbonDecorations} aria-hidden="true"><Trash2 size={17} /><Archive size={17} /><OctagonAlert size={17} /><span /><Undo2 size={17} /><Reply size={17} /><Forward size={17} /></span>
            <button id="pd-outlook-read" className={s.ribbonSecondary} disabled={guided || (!selected && checked.length === 0)} onClick={() => { const ids = selected ? [selected.id] : checked; setRead(previous => [...new Set([...previous, ...ids])]); setAnnouncement("Marked as read in this preview."); }}><Mail size={17} /><span>Mark as read</span></button>
            <span className={s.ribbonDecorations} aria-hidden="true"><Tag size={17} /><Flag size={17} /><Clock size={17} /><MoreVertical size={17} /></span>
            <span className={s.outlookAgency}>{scenario.agency}</span>
          </div>}
          <div className={s.mailBody}>
            <aside className={s.sidebar} aria-label="Mailbox navigation">
              <button disabled={guided} id="pd-compose" className={s.composeButton} onClick={() => { setManualMode(true); setComposerOpen(true); }}><PencilLine size={23} /><span>{mailUi.compose}</span></button>
              {outlook && <h2 className={s.outlookFolderHeading}><ChevronDown size={13} />Folders</h2>}
              <nav aria-label="Email folders" className={s.folderNav}>
                <button disabled={guided} id="pd-nav-inbox" className={view === "inbox" && !category ? s.navActive : ""} aria-current={view === "inbox" && !category ? "page" : undefined} onClick={() => navigate("inbox")}><Inbox size={17} /><span>Inbox</span><b>{scenario.emails.length - read.length}</b></button>
                <button disabled={guided} id="pd-nav-starred" className={view === "starred" ? s.navActive : ""} aria-current={view === "starred" ? "page" : undefined} onClick={() => navigate("starred")}><SavedIcon size={17} /><span>{mailUi.saved}</span>{starred.length > 0 && <b>{starred.length}</b>}</button>
                <button disabled={guided} id="pd-nav-snoozed" className={view === "snoozed" ? s.navActive : ""} onClick={() => navigate("snoozed")}><Clock size={17} /><span>Snoozed</span></button>
                <button disabled={guided} id="pd-nav-sent" className={view === "sent" ? s.navActive : ""} onClick={() => navigate("sent")}><Send size={17} /><span>{mailUi.sent}</span></button>
                <button disabled={guided} id="pd-nav-drafts" className={view === "drafts" ? s.navActive : ""} aria-current={view === "drafts" ? "page" : undefined} onClick={() => navigate("drafts")}><FileText size={17} /><span>Drafts</span>{(hasDraft || (!guided && manualDraft.saved)) && <b>{Number(hasDraft) + Number(!guided && manualDraft.saved)}</b>}</button>
              </nav>
              <div className={s.labelSection}><h2>{mailUi.grouping} <Plus size={17} aria-hidden="true" /></h2>
                {showProperty ? <nav aria-label="Filter by property">{(guided ? ["alder" as PropertyKey] : propertyKeys).map((key) => <button disabled={guided} id={`pd-property-${key}`} key={key} onClick={() => navigate(key)} className={view === key ? s.propertyActive : ""} aria-current={view === key ? "page" : undefined}><Tag size={14} /><span>{scenario.properties[key].name}</span>{(!guided || tourStep >= 3) && <b>{scenario.emails.filter((email) => email.property === key).length}</b>}</button>)}</nav>
                  : <p className={s.labelPlaceholder}>A place for every<br />property conversation.</p>}
              </div>
              {organised && !guided && <div className={s.categorySection}><h2>Type of work</h2><nav aria-label="Filter by work type">{categories.map((name) => {
                const email = scenario.emails.find((item) => item.category === name)!;
                return <button disabled={guided} id={`pd-category-${email.id}`} key={name} aria-current={category === name ? "page" : undefined} onClick={() => navigate("inbox", name)}><span className={s.categoryDot} data-tone={email.tone} />{name}</button>;
              })}</nav></div>}
              <div className={s.sidebarFoot}><ShieldCheck size={16} /><p>Fictional messages.<br />Nothing is sent.</p></div>
            </aside>

            <div className={s.mailMain}>
              <div className={s.mailToolbar}>
                <div className={s.toolbarActions}>
                  {selected && !outlook && <span className={s.gmailMessageTools} aria-hidden="true"><Archive size={18} /><OctagonAlert size={18} /><Trash2 size={18} /><span /><Mail size={18} /><Clock size={18} /><FolderInput size={18} /><Tag size={18} /><MoreVertical size={18} /></span>}
                  {!selected && view !== "drafts" && <input disabled={guided || !filtered.length} id="pd-select-all" type="checkbox" aria-label="Select all visible messages" checked={filtered.length > 0 && filtered.every(email => checked.includes(email.id))}  onChange={event => setChecked(event.target.checked ? filtered.map(email => email.id) : [])} />}
                  {!selected && <ChevronDown size={12} aria-hidden="true" />}
                  {checked.length > 0 ? <button disabled={guided} id="pd-mark-read" className={s.iconButton} aria-label="Mark selected messages as read" title="Mark as read" onClick={() => { setRead(previous => [...new Set([...previous, ...checked])]); setChecked([]); setAnnouncement("Selected messages marked as read in this preview."); }}><Mail size={18} /></button> : !selected && <button disabled={guided} id="pd-refresh-mail" className={s.iconButton} aria-label="Refresh example inbox" title="Refresh" onClick={() => { setRefreshed(true); setAnnouncement("Example inbox up to date. Seven fictional messages; no live connection."); }}><RefreshCw size={17} /></button>}
                  {!selected && <MoreVertical size={18} aria-hidden="true" />}
                </div>
                {selected ? <button disabled={guided} id="pd-back-to-inbox" className={s.backButton} onClick={() => { setSelectedId(null); requestAnimationFrame(() => (document.getElementById(`pd-email-${selected.id}`) ?? document.getElementById("pd-search"))?.focus()); }}><ArrowLeft size={17} /> {viewTitle}</button> : <h2 className={s.folderTitle}>{viewTitle} <span>{view === "drafts" ? `${draftCount} ${draftCount === 1 ? "draft" : "drafts"}` : `${filtered.length} ${filtered.length === 1 ? "message" : "messages"}`}</span></h2>}
                <div className={s.toolbarRight}>{selected && showProperty ? <div className={s.labelAttention}><AttentionNote cue={cue} target="property" /><AttentionNote cue={cue} target="category" /><div className={s.tourMailLabels}>{guided && tourStep >= 2 ? <button id="pd-label-related" className={`${s.propertyChip} ${s.propertyLink}`} onClick={showPropertyEmails} aria-label="Show emails linked to Alder Court, Flat 2"><Tag size={12} />{currentProperty?.name} · {currentProperty?.flat}<ChevronRight size={12} /></button> : <span className={s.propertyChip} data-attention={cue?.target === "property"}>{currentProperty?.name} · {currentProperty?.flat}</span>}{organised && <span data-attention={cue?.target === "category"}><EmailBadge email={selected} /></span>}</div></div> : <span>{refreshed ? "Up to date" : visibleCount ? `1–${visibleCount} of ${visibleCount}` : "0 messages"}</span>}<span className={s.pagingIcons} aria-hidden="true"><ChevronLeft size={18} /><ChevronRight size={18} /></span></div>
              </div>

              <div className={s.readingWorkspace} data-open={!!selected}>
              {outlook && selected && <aside className={s.outlookMessageList} aria-label="Outlook message list">
                <div className={s.messageListHeading}><strong>Inbox</strong><span>By date <ChevronDown size={12} /></span></div>
                <div className={s.messageDateGroup}>Today</div>
                {tourDraft && <div className={s.outlookDraftSelected}><PencilLine size={15} /><div><strong>Draft · Nadia Ellis</strong><span>{scenario.draftSubject}</span><small>Ready for review</small></div></div>}
                {scenario.emails.map(email => <button key={email.id} id={`pd-reading-list-${email.id}`} disabled={guided} aria-current={!tourDraft && selected.id === email.id ? "true" : undefined} onClick={() => openEmail(email.id)} className={s.outlookListItem}>
                  <span className={s.listAvatar} data-tone={email.tone}>{email.initials}</span><span><strong>{email.sender}</strong><span>{email.subject}</span><small>{email.body.replaceAll("\n", " ")}</small></span><time>{email.time}</time>
                </button>)}
              </aside>}
              {!selected ? <div className={s.listArea}>{view === "inbox" && !category && !query && <div className={s.primaryTab}><Inbox size={18} /><span>{outlook ? "All" : "Primary"}</span>{outlook && <span className={s.outlookSort}>By date <ChevronDown size={12} /></span>}</div>}
                {organised && <div className={s.mobileFilters}><label className={s.srOnly} htmlFor="pd-mobile-property">Filter by property</label><select disabled={guided} id="pd-mobile-property" value={propertyKeys.includes(view as PropertyKey) ? view : "inbox"} onChange={(event) => navigate(event.target.value as MailView)}><option value="inbox">All properties</option>{propertyKeys.map((key) => <option key={key} value={key}>{scenario.properties[key].name}</option>)}</select><span>Suggested matches until reviewed</span></div>}
                {view === "drafts" ? <>{draftCount > 0 ? <>{manualVisible && <button disabled={guided} id="pd-manual-draft-row" className={s.draftRow} onClick={() => { setManualMode(true); setComposerOpen(true); }}><FileText size={20} /><span><b>{manualDraft.subject}</b><span>To {manualDraft.to} · Saved in this preview</span></span><span className={s.badge}>Unsent</span></button>}{draftVisible && <button disabled={guided} id="pd-draft-row" className={s.draftRow} onClick={openDraft}><span className={s.draftIcon}><FileText size={23} /></span><span><b>{draftSubject}</b><span>To Nadia Ellis · {saved ? "Saved in this preview" : "Draft ready for review"}</span></span><span className={s.badge} data-tone="violet">Unsent</span><ChevronRight size={17} /></button>}</> : <div className={s.empty}><FileText size={30} /><h3>{anyDraft ? "No matching draft" : "A considered reply starts here."}</h3><p>{anyDraft ? "Try a different search." : "Follow the leak report to prepare a landlord update."}</p><button disabled={guided} id="pd-empty-drafts-action" className={s.textButton} onClick={() => anyDraft ? setQuery("") : organised ? openEmail("leak") : organise()}>{anyDraft ? "Clear search" : organised ? "Open leak report" : "Organise inbox"}<ArrowRight size={15} /></button></div>}</>
                  : filtered.length ? <ul className={s.emailList}>{filtered.map((email, index) => {
                    const property = scenario.properties[email.property];
                    return <li key={email.id} className={s.emailRow} data-read={read.includes(email.id)} data-priority={organised && email.id === "leak"} data-checked={checked.includes(email.id)} style={{ "--row-delay": `${index * 35}ms` } as CSSProperties}>
                      <input disabled={guided} id={`pd-select-${email.id}`} className={s.rowCheckbox} type="checkbox" aria-label={`Select ${email.subject}`} checked={checked.includes(email.id)} onChange={event => setChecked(previous => event.target.checked ? [...previous, email.id] : previous.filter(id => id !== email.id))} />
                      <button disabled={guided} id={`pd-star-${email.id}`} aria-label={`${starred.includes(email.id) ? mailUi.unmark : mailUi.mark} ${email.subject}`} aria-pressed={starred.includes(email.id)} className={s.starButton} onClick={() => toggleStar(email.id)}><SavedIcon size={17} fill={starred.includes(email.id) ? "currentColor" : "none"} /></button>
                      <button disabled={guided} id={`pd-email-${email.id}`} className={s.emailButton} onClick={() => openEmail(email.id)}>
                        <span className={s.senderCell}><span className={s.sender}>{email.sender}</span><span className={s.senderRole}>{email.role}</span></span>
                        <span className={s.subjectCell}><span className={s.subject}>{email.subject}{organised && email.id === "leak" && <span className={s.urgentDot} />}</span><span className={s.snippet}>{email.body.replaceAll("\n", " ")}</span>{organised && <span className={s.rowLabels}><EmailBadge email={email} /><span className={s.propertyChip}><Building2 size={11} />{property.name} · {property.flat}</span></span>}</span>
                        <span className={s.timeCell}><time>{email.time}</time>{organised && email.id === "leak" ? <span className={s.reviewFlag}>Review now</span> : email.attachment ? <Paperclip size={14} /> : null}</span>
                      </button>
                    </li>;
                  })}</ul> : <div className={s.empty}><Search size={30} /><h3>{view === "sent" ? "No sent messages" : view === "snoozed" ? "No snoozed messages" : view === "starred" && !query ? "Keep the important ones close." : "No matching messages"}</h3><p>{view === "sent" ? "This simulation never sends an email." : view === "snoozed" ? "No messages are snoozed in this example." : view === "starred" && !query ? `${mailUi.mark} a message in the inbox to find it here.` : "Try a sender, property name or a different folder."}</p><button disabled={guided} id="pd-empty-inbox-action" className={s.textButton} onClick={() => navigate("inbox")}>Return to inbox <ArrowRight size={15} /></button></div>}
                <div className={s.listFooter}><span>{organised ? "Property matches and staff routes are suggestions until checked." : "Seven different requests. One familiar place to start."}</span><Mail size={15} /></div>
              </div> : <div className={s.detailGrid} data-evidence={!!activeEvidence}>
                <article className={s.message} aria-labelledby="pd-message-title">
                  {tourDraft ? <div className={s.tourDraft}>
                    <AttentionNote cue={cue} target="draft" /><div className={s.tourDraftHeader} data-attention={cue?.target === "draft"}><PencilLine size={16} /><strong>Prepared landlord update</strong><span>Unsent draft</span></div>
                    <div className={s.tourDraftTo}>To <strong>Nadia Ellis</strong><span>Landlord</span></div>
                    <h2 id="pd-message-title">{scenario.draftSubject}</h2>
                    <LinkedDraft playing={playing} active={activeEvidence} onSelect={selectEvidence} onClose={closeEvidence} cue={cue} />
                    <AttentionNote cue={cue} target="review" /><div className={s.tourReview} data-attention={cue?.target === "review"}><ShieldCheck size={20} /><div><strong>A person reviews this before sending.</strong><span><b>Motus prepared:</b> the property match, related context and landlord draft.</span><span><b>Your team checks:</b> the claim reference, quote and next steps before sending.</span></div></div>
                  </div> : <>
                  {guided && <div className={s.sourceCue}>{cue?.target === "property" ? providerCopy("The address is now linked to the suggested property label") : cue?.target === "category" ? "The reported issue is now categorised for staff review" : tourStep === 0 ? "Start here: the tenant's original email" : tourStep === 1 ? "Look at the address in the original message" : tourStep === 2 ? "Look at the problem the tenant describes" : frame.contextEmailId === "quote" ? "The contractor’s original quote" : playing ? "Related messages are being gathered automatically" : "Select a related message to check the property match"}</div>}
                  <div className={s.messageHeading}><h2 id="pd-message-title" ref={detailTitle} tabIndex={-1}>{guided && tourStep === 3 ? <MarkedText text={selected.subject} terms={[selected.propertyMatch?.subject ?? ""]} /> : selected.subject}</h2>{!outlook && <span className={s.messageUtilities} aria-hidden="true"><Printer size={17} /><ExternalLink size={17} /></span>}<button disabled={guided} id="pd-detail-star" className={s.starButton} aria-label={`${starred.includes(selected.id) ? mailUi.unmark : mailUi.mark} this message`} aria-pressed={starred.includes(selected.id)} onClick={() => toggleStar(selected.id)}><SavedIcon size={18} fill={starred.includes(selected.id) ? "currentColor" : "none"} /></button></div>
                  <div className={s.messageSender}><span className={s.senderAvatar} data-tone={selected.tone}>{selected.initials}</span><div><strong>{selected.sender}</strong><span>{selected.role} · {outlook ? `To: ${scenario.agency}` : "to me"}</span></div><time>{selected.time}<span>13 Oct</span></time></div>
                  <div className={s.messageActions}>
                    <button id="pd-reply-message" disabled={guided} onClick={replyToSelected}><Reply size={16} /><span>Reply</span></button>
                    <span aria-hidden="true"><Forward size={16} /><MoreVertical size={16} /></span>
                  </div>
                  <div className={s.bodyAttention}><AttentionNote cue={cue} target="report" /><AttentionNote cue={cue} target="address" /><AttentionNote cue={cue} target="issue" /><AttentionNote cue={cue} target="quote" /></div><p className={s.messageBody} data-attention={cue?.target === "report"}>{guided ? tourStep === 3 ? <MarkedText text={selected.body} terms={contextEmailId === "quote" && frame.contextEmailId === "quote" ? ["£285", "Please confirm before I book the visit."] : [selected.propertyMatch?.body ?? ""]} attentionTerm={cue?.target === "quote" ? "£285" : undefined} /> : <HighlightedReport body={selected.body} step={tourStep} cue={cue} /> : selected.body}</p>
                  {guided && tourStep === 1 && showProperty && <div className={s.propertyConnection}><span>Address in the email</span><ArrowRight size={14} /><span>{providerCopy("Suggested property label")}</span></div>}
                  {guided && tourStep === 3 && selected.propertyMatch && <p className={s.matchReason}><Tag size={14} />{selected.propertyMatch.note}</p>}
                  {guided && tourStep >= 1 && <div className={s.tourMemory} aria-label="What we know so far"><span>WHAT WE KNOW SO FAR</span><p><Check size={14} /><b>Property</b> {currentProperty?.name}, {currentProperty?.flat}</p>{tourStep >= 2 && <p><Check size={14} /><b>Reported issue</b> Maintenance · staff review needed</p>}{tourStep >= 3 && <p><Check size={14} /><b>Context</b> {relatedCount} suggested related {relatedCount === 1 ? "email" : "emails"}</p>}</div>}
                  {selected.attachment && <div className={s.attachment}><Paperclip size={16} /><span>{selected.attachment}<small>Illustrative attachment reference; no file supplied</small></span></div>}
                  {!guided && (organised ? <div className={s.nextAction}><div className={s.nextActionHeading}>{selected.id === "leak" ? <CircleAlert size={18} /> : <ArrowRight size={18} />}<span>{selected.id === "leak" ? "Needs a person’s attention" : "Suggested next step"}</span><small>Motus</small></div><h3>{selected.next}</h3><p>{selected.explanation}</p><div className={s.routeLine}><UserRound size={15} /><span>{confirmed && alderSelected ? "Route confirmed" : "Suggested route"}</span><b>{selected.owner}</b>{confirmed && alderSelected && <Check size={15} />}</div></div>
                    : <div className={s.unorganisedNote}><Tag size={18} /><p>Organise the inbox to see the suggested property, staff route and next step for this message.</p><button disabled={guided} id="pd-organise-detail" className={s.textButton} onClick={organise}>Organise inbox <ArrowRight size={15} /></button></div>)}
                  {organised && !guided && alderSelected && <div className={s.contextNote}><ShieldCheck size={16} /><p>The tenant report needs staff review. The quote is not accepted, the visit is not booked, and the insurance evidence is still pending.</p></div>}
                  </>}
                </article>

                {activeEvidence && <aside className={`${s.propertyPane} ${s.desktopEvidence}`} aria-label="Draft source evidence"><EvidenceSource evidence={activeEvidence} location="desktop" onClose={closeEvidence} cue={cue} /></aside>}
                {showRelated && currentProperty && !activeEvidence && <aside className={s.propertyPane}  aria-label="Related property emails and staff handoff">
                  <div className={s.motusPanelLabel}><Signal small /><strong>Motus</strong><span>{scenario.delivery.panelBadge}</span></div><p className={s.addonNote}>{scenario.delivery.panelNote}</p><p className={s.paneEyebrow}><Building2 size={14} /> {confirmed && alderSelected ? "Confirmed property" : "Suggested property"}</p>
                  <h3>{currentProperty.name}<span>{currentProperty.flat} <span>·</span> {currentProperty.area}</span></h3>
                  {alderSelected ? <>
                    <div className={s.relatedHeader}><span>Suggested related emails</span><span>{guided ? relatedCount : 4}</span></div>{guided && <p className={s.relatedHint}>{playing ? (tourDraft ? "These messages provide the context for the landlord update." : "Messages appear one at a time as their context is found.") : tourDraft ? "Choose an underlined draft sentence to check its source." : "Optional: select a message to see why it is linked."}</p>}
                    <div className={s.relatedList}>{scenario.emails.filter((email) => email.property === "alder").slice(0, guided ? relatedCount : 4).map((email) => <button data-attention={cue?.target === `related-${email.id}`} disabled={tourDraft} id={`pd-related-${email.id}`} key={email.id} className={email.id === selected.id ? s.relatedActive : ""} aria-current={email.id === selected.id ? "true" : undefined} onClick={() => { if (guided) { setPlaying(false); setContextEmailId(email.id); } else openEmail(email.id); }}><span className={s.relatedDot} data-tone={email.tone} /><span><AttentionNote cue={cue} target={`related-${email.id}` as AttentionTarget} /><strong>{email.role}</strong><span>{guided ? email.draftFact ?? email.subject : email.subject}</span></span><time>{email.time}</time></button>)}</div>
                    {!guided && <><details className={s.history}><summary id="pd-earlier-email"><Mail size={13} /> Earlier email · 12 Oct, 15:40 <ChevronRight size={13} /></summary><p>Talia first reported a kitchen ceiling leak at Alder Court, Flat 2. Inspection not yet booked.</p></details>
                    <div className={s.handoff} data-confirmed={confirmed}><span className={s.handoffAvatar}>AL</span><span><strong>Amara Lewis</strong><small>{confirmed ? "Route confirmed in preview" : "Suggested property manager"}</small></span>{confirmed && <Check size={17} />}</div>
                    {!confirmed ? <button disabled={guided} id="pd-confirm-route" className={s.confirmButton} onClick={confirmRoute}>Confirm property & route <Check size={15} /></button> : <button disabled={guided} id="pd-prepare-draft" className={s.confirmButton} onClick={openDraft}>{hasDraft ? "Review landlord draft" : "Prepare landlord update"}<PencilLine size={15} /></button>}
                    <p className={s.routeNote}>{confirmed ? "Handoff demonstrated. No message forwarded." : "Check the match before confirming the handoff."}</p></>}
                  </> : <div className={s.otherProperty}><Tag size={18} /><p>{selected.property === "canal" ? "A viewing enquiry, ready for the lettings team to check before arranging a visit." : "Finance correspondence stays linked to the property. The tenancy and ledger remain in the existing property system."}</p><button disabled={guided} id="pd-view-property-mail" className={s.textButton} onClick={() => navigate(selected.property)}>View property emails <ArrowRight size={14} /></button></div>}
                  <div className={s.systemNote}><Building2 size={14} /><span>Property system remains your record of truth.</span></div>
                </aside>}
              </div>}
              {outlook && !selected && <div className={s.outlookEmptyReader} aria-label="Empty Outlook reading pane"><Mail size={44} strokeWidth={1} /><strong>Select an item to read</strong><span>Nothing is selected</span></div>}
              </div>
            </div>
          </div>
          <div className={s.utilityRail} aria-hidden="true">{outlook ? <><Mail size={20} /><CalendarDays size={20} /><UserRound size={20} /><CheckCircle2 size={20} /><span /><Grip size={20} /></> : <><CalendarDays size={19} /><Lightbulb size={19} /><CheckCircle2 size={19} /><UserRound size={19} /><span /><Plus size={19} /></>}</div><div className={s.mailBottom}><span><span className={s.smallDot} /> Fictional scenario · no connected mailbox</span><span>Northline Lettings · Demonstration account</span></div>
        </section>
        </div>

        <section className={s.servicePromise} aria-label="How this fits your agency">
          <div><span>YOUR INBOX. YOUR PROCESS.</span><h2>Less searching and rewriting.<br />A clear update ready to check.</h2></div>
          <p>{scenario.delivery.explanation}</p>
        </section>
        <section className={s.afterword} aria-label="About this example">
          <div className={s.sourceNote}><Signal small /><p>Informed by a real conversation with a lettings professional.<br /><span>{mailUi.name} interface recreated for illustration. Motus additions are marked. No {mailUi.vendor} affiliation.</span></p></div>
          <Link id="pd-workflow-enquiry" href={getDemoEnquiryHref("property-desk")} className={s.enquiry}>Make your inbox easier to run <ArrowRight size={16} /></Link>
        </section>
        <div className={s.srOnly} role="status" aria-live="polite">{announcement}</div>
      </main>

      <dialog ref={dialog} className={s.composer} aria-labelledby="pd-compose-title" onCancel={() => setComposerOpen(false)} onClose={() => setComposerOpen(false)}>
        <div className={s.composerHeader}><div><PencilLine size={17} /><h2 id="pd-compose-title">{manualMode ? "New message" : "Landlord update"}</h2><span>Unsent draft</span></div><button id="pd-close-draft" aria-label="Close draft" onClick={() => setComposerOpen(false)}><X size={19} /></button></div>
        <div className={s.recipientLine}>{manualMode ? <><label htmlFor="pd-draft-to">To</label><input id="pd-draft-to" aria-label="Example recipient" placeholder="Recipient (simulation only)" value={manualDraft.to} maxLength={180} onChange={event => setManualDraft({ ...manualDraft, to: event.target.value, saved: false })} /></> : <><span>To</span><span className={s.recipient}>Nadia Ellis <small>Landlord</small></span></>}</div>
        <label className={s.subjectInput} htmlFor="pd-draft-subject"><span>Subject</span><input id="pd-draft-subject" value={manualMode ? manualDraft.subject : draftSubject} maxLength={180} onChange={(event) => { if (manualMode) setManualDraft({ ...manualDraft, subject: event.target.value, saved: false }); else { setDraftSubject(event.target.value); setSaved(false); } }} /></label>
        <label className={s.srOnly} htmlFor="pd-draft-body">{manualMode ? "Message body" : "Edit landlord update"}</label><textarea id="pd-draft-body" value={manualMode ? manualDraft.body : draftBody} onChange={(event) => { if (manualMode) setManualDraft({ ...manualDraft, body: event.target.value, saved: false }); else { setDraftBody(event.target.value); setSaved(false); } }} maxLength={6000} />
        {!manualMode && <div className={s.draftEvidence}><ShieldCheck size={17} /><div><strong>Known facts, ready for your review.</strong><p>Prepared from the tenant report, contractor quote and insurer email. Inspection and evidence remain pending.</p></div></div>}
        <div className={s.composerFooter}><button id="pd-save-draft" className={s.primaryButton} disabled={manualMode ? !manualDraft.to.trim() || !manualDraft.subject.trim() || !manualDraft.body.trim() : !draftBody.trim() || !draftSubject.trim()} onClick={() => { if (manualMode) setManualDraft({ ...manualDraft, saved: true }); else setSaved(true); setComposerOpen(false); setAnnouncement("Draft saved in this preview. It is unsent and will reset when the page is refreshed."); }}>Save draft <Check size={16} /></button><span>Saved only in this preview. Never sent.</span></div>
      </dialog>
    </div>
  );
}
