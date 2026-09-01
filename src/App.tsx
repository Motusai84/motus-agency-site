import { ArrowDown, ArrowRight, Check, ChevronDown, Menu, Play, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const NAV = [
  { label: "Home", id: "home" },
  { label: "Pricing", id: "pricing" },
  { label: "Automation", id: "automation" },
  { label: "Contact", id: "contact" },
];

const OUTCOMES = [
  ["01", "Website · From GBP 495", "Get online professionally", "A website shaped around your offer, customer journey and the next step you need people to take."],
  ["02", "Tailored system · Scoped and quoted", "Never miss an enquiry", "Receive new interest, acknowledge it and make the useful next action visible to the right person."],
  ["03", "Tailored system · Scoped and quoted", "Fill more bookings", "Make it simple for customers to enquire, book and receive the right reminder without creating extra admin."],
  ["04", "Tailored system · Scoped and quoted", "Cut repeated admin", "Turn a recurring manual task into a clearer route, with the right person still in charge of exceptions."],
  ["05", "Tailored system · Scoped and quoted", "Stay on top of invoices", "Make invoice follow-up, payment status and the next owner action easier to see."],
  ["06", "Tailored system · Scoped and quoted", "See what needs attention", "Give the owner a useful view of work that is new, waiting, overdue or ready for a decision."],
] as const;

const WORKFLOW_STEPS = [
  ["New enquiry", "Acknowledge the customer and place the work where it belongs."],
  ["Reply", "Prepare a useful first response for the owner to review."],
  ["Assign", "Make the right next action visible to the right person."],
  ["Record update", "Keep one clear record instead of searching across tools."],
  ["Prepare invoice", "Bring completed work and the needed details together."],
  ["Follow up", "Make a sensible follow-up visible at the right time."],
] as const;

const PACKAGES = [
  ["Motus Launch", "GBP 495", "GBP 49/month technical care", "A focused professional website for a small business that needs a strong first impression and a clear way to enquire."],
  ["Motus Grow", "GBP 995", "GBP 79/month technical care", "A more complete website with room for services, examples, trust-building content and a clearer customer journey."],
  ["Motus Care", "Scoped after review", "For tailored systems", "Ongoing support for a system Motus has built, with boundaries that keep support useful and predictable."],
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Brand() {
  return <span className="brand" aria-label="Motus"><Sparkles aria-hidden="true" size={18} fill="currentColor" /><span>Motus</span></span>;
}

function OwnerView() {
  const [selectedAction, setSelectedAction] = useState("New enquiry");
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="owner-view-shell" aria-label="Illustrative owner view">
      <div className="owner-view">
        <aside className="owner-sidebar">
          <Brand />
          <div className="sidebar-search">⌕ <span>Search work, people and actions</span></div>
          <button className="sidebar-new" type="button" onClick={() => setSelectedAction("New enquiry")}>New enquiry</button>
          <div className="sidebar-links">
            {[["Overview", ""], ["Enquiries", "3"], ["Work queue", ""], ["Bookings", ""], ["Invoices", ""], ["Reports", ""], ["WORKFLOWS", "label"], ["Follow-ups", ""], ["Notifications", ""], ["Settings", ""]].map(([label, badge]) => (
              <button key={label} type="button" className={label === "Overview" ? "active" : badge === "label" ? "sidebar-label" : ""}>
                <span>{label}</span>{badge && badge !== "label" && <b>{badge}</b>}
              </button>
            ))}
          </div>
        </aside>
        <div className="owner-main">
          <div className="owner-topbar">
            <div><span className="owner-eyebrow">Illustrative owner view</span><h3>See what needs you.</h3></div>
            <button type="button" className="owner-expand" aria-label="Toggle owner view detail" onClick={() => setIsCompact(!isCompact)}>{isCompact ? "+" : "−"}</button>
          </div>
          <div className="owner-actions" aria-label="Illustrative work actions">
            {WORKFLOW_STEPS.map(([action]) => <button key={action} type="button" className={selectedAction === action ? "selected" : ""} onClick={() => setSelectedAction(action)}>{action}</button>)}
          </div>
          <p className="owner-note">This preview uses fictional local data only. Nothing is sent.</p>
          <div className={isCompact ? "owner-focus compact" : "owner-focus"}>
            <div className="owner-focus-copy"><span>Illustrative owner view</span><strong>{selectedAction}</strong><p>{selectedAction === "New enquiry" ? "A clear next step today" : "A simple place for the next useful action"}</p><div className="owner-counts"><b>New <em>3</em></b><b>Waiting <em>2</em></b><b>Overdue <em>1</em></b></div></div>
            {!isCompact && <div className="owner-chart" aria-hidden="true"><svg viewBox="0 0 270 100" preserveAspectRatio="none"><path d="M0,78 C18,70 29,77 45,58 S74,65 87,50 S113,61 129,39 S163,38 176,27 S201,43 217,21 S248,32 270,5" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M0,100 L0,78 C18,70 29,77 45,58 S74,65 87,50 S113,61 129,39 S163,38 176,27 S201,43 217,21 S248,32 270,5 L270,100 Z" fill="currentColor" opacity=".08" /></svg></div>}
          </div>
          {!isCompact && <div className="owner-work-list"><div><span>Work today</span><button type="button">+</button></div>{[["Growth consultation", "Needs you"], ["Invoice follow-up", "2 days"], ["Booking request", "Moving"]].map(([task, status]) => <p key={task}><b>{task}</b><span>{status}</span></p>)}</div>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightView, setLightView] = useState(false);
  const [teamSize, setTeamSize] = useState(4);
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(18);
  const [sent, setSent] = useState(false);
  const monthlyCost = useMemo(() => Math.round(teamSize * hours * rate * 4.33), [teamSize, hours, rate]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const go = (id: string) => { setMenuOpen(false); scrollTo(id); };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };

  return (
    <div className={lightView ? "motus-live light-view" : "motus-live"}>
      <header className="site-header">
        <button className="brand-button" type="button" onClick={() => go("home")} aria-label="Back to top"><Brand /></button>
        <nav className="desktop-nav" aria-label="Primary navigation">{NAV.map(item => <button type="button" key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav>
        <div className="header-actions"><button type="button" className="view-toggle" onClick={() => setLightView(!lightView)}>{lightView ? "Dark view" : "Light view"}</button><button type="button" className="header-cta" onClick={() => go("contact")}>Tell us what you need</button><button type="button" className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      {menuOpen && <div className="mobile-menu" id="mobile-navigation">{NAV.map(item => <button key={item.id} type="button" onClick={() => go(item.id)}>{item.label}<ArrowRight size={17} /></button>)}<button type="button" onClick={() => go("contact")}>Tell us what you need <ArrowRight size={17} /></button></div>}

      <main>
        <section className="hero" id="home">
          <div className="hero-copy"><p className="pill">Tailored digital systems for UK businesses</p><h1>Built around your business.<br /><em>Not the other way round.</em></h1><p className="hero-intro">Generic software asks your company to adapt to it. Motus adapts the system to your company.</p><div className="hero-actions"><button type="button" className="primary-button" onClick={() => go("contact")}>Tell us what you need</button><button type="button" className="play-button" aria-label="See how Motus works" onClick={() => go("automation")}><Play size={15} fill="currentColor" /></button></div></div>
          <OwnerView />
        </section>

        <section className="section outcomes" id="solutions"><div className="section-intro"><p className="kicker">01 / Start with the outcome</p><h2>What should work better?</h2><p>You do not need to choose the technology. Choose the outcome you recognise and Motus will shape the sensible route around how your business works.</p></div><div className="outcome-grid">{OUTCOMES.map(([number, meta, title, text]) => <article key={number}><span>{number}</span><p>{meta}</p><h3>{title}</h3><p>{text}</p><button type="button" onClick={() => go("contact")}>Discuss this outcome <ArrowRight size={16} /></button></article>)}</div></section>

        <section className="section workflow-section" id="automation"><div className="section-intro"><p className="kicker">02 / See the work, not the workflow</p><h2>One place to see what moved, what is waiting and what needs you.</h2><p>The starting point could be a website, booking screen, staff form, client portal, internal tool or owner view. Motus shapes the useful solution around the job your business is trying to do.</p></div><div className="workflow-layout"><div className="workflow-copy"><p className="mini-label">A simple route</p>{WORKFLOW_STEPS.slice(0, 4).map(([title, text], index) => <div className="route-line" key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><div className="workflow-card"><span className="mini-label">What stays visible</span><h3>Human decisions stay visible.</h3><p>Important or unclear cases stop for a person. Good systems make it easier to decide; they do not hide the decision.</p><ul><li><Check size={16} /> One agreed view of work</li><li><Check size={16} /> Plain-English handover</li><li><Check size={16} /> A clear route for exceptions</li></ul></div></div></section>

        <section className="section estimator" id="pricing"><div className="section-intro"><p className="kicker">03 / Illustrative calculator</p><h2>What might repeated admin be costing?</h2><p>Adjust three simple inputs to create a starting estimate for discussion. This is not a guaranteed saving, audit or quotation.</p></div><div className="estimator-card"><div className="slider-group"><label>People doing the task <output>{teamSize}</output></label><input id="team-size" type="range" min="1" max="15" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} /></div><div className="slider-group"><label>Hours each week <output>{hours}</output></label><input id="admin-hours" type="range" min="1" max="20" value={hours} onChange={e => setHours(Number(e.target.value))} /></div><div className="slider-group"><label>Typical hourly cost <output>GBP {rate}</output></label><input id="hourly-rate" type="range" min="12" max="50" value={rate} onChange={e => setRate(Number(e.target.value))} /></div><div className="estimate-result"><span>Illustrative monthly cost of this repeated work</span><strong>GBP {monthlyCost.toLocaleString("en-GB")}</strong><p>Not every task can or should be automated. We review the process first.</p></div></div><div className="package-grid">{PACKAGES.map(([name, price, care, text]) => <article key={name}><p className="mini-label">{name}</p><h3>{price}</h3><span>{care}</span><p>{text}</p><button type="button" onClick={() => go("contact")}>Discuss this <ArrowRight size={16} /></button></article>)}</div></section>

        <section className="contact-section" id="contact"><div><p className="kicker">04 / A useful first step</p><h2>Tell us what you need.</h2><p>Send a short description of the outcome you want and how work happens now. Motus normally replies by email within two business days with a website package, short fit check, paid discovery exercise or scoped quotation.</p><p className="contact-note">Sending this form is an enquiry only. It does not create a contract or require Motus to accept the work.</p></div><form onSubmit={handleSubmit}>{sent ? <div className="form-success"><Check size={22} /><h3>Enquiry noted.</h3><p>Thank you. Motus will reply by email within two business days.</p></div> : <><label>Your name<input id="name" required name="name" /></label><label>Business email<input id="email" required name="email" type="email" /></label><label>What outcome do you need?<select id="outcome" name="outcome" defaultValue=""><option value="" disabled>Select an outcome</option>{OUTCOMES.slice(0, 5).map(([, , title]) => <option key={title}>{title}</option>)}</select></label><label>What is happening now?<textarea id="message" name="message" required rows={4} placeholder="A short description is enough." /></label><button className="primary-button form-submit" type="submit">Send enquiry <ArrowRight size={17} /></button></>}</form></section>
      </main>
      <footer><Brand /><span>Tailored digital systems for UK businesses.</span><div><button type="button" onClick={() => go("solutions")}>Solutions</button><button type="button" onClick={() => go("pricing")}>Website pricing</button><button type="button" onClick={() => go("contact")}>Contact</button></div><small>© 2026 Oluwaseun Ayomide Oyepitan trading as Motus.</small></footer>
    </div>
  );
}
