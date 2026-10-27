"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, TrendingUp } from "lucide-react";
import type { ClientConfig } from "@/src/clients/business-impact";
import styles from "./BusinessImpact.module.css";

type Mode = "admin" | "enquiries";
type Origin = "example" | "edited" | "own";
type Frequency = "day" | "week" | "month";
type Period = "week" | "month" | "year";
type ValueMode = "example" | "own" | "time";
type SalesUnit = "booking" | "job" | "sale";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const preciseMoney = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const hours = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 3 });
const frequencyLabels = { day: "day", week: "working week", month: "active month" };

function duration(value: number) {
  const useMinutes = value > 0 && value < 1;
  const displayed = number.format(useMinutes ? value * 60 : value);
  const singular = displayed === "1";
  return { value: displayed, unit: useMinutes ? singular ? "minute" : "minutes" : singular ? "hour" : "hours" };
}

function amount(value: string, min = 0, max = 1_000_000, step = 0.01): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  // Reject fractional counts and values that cannot be represented by the control.
  const steps = (parsed - min) / step;
  return Math.abs(steps - Math.round(steps)) < 0.00001 ? parsed : null;
}

function formatMoney(value: number) {
  // Preserve pence so changing a price does not appear to leave the result unchanged.
  return Math.abs(value - Math.round(value)) > 0.000001 ? preciseMoney.format(value) : money.format(value);
}

function NumericControl({ id, label, value, onChange, min = 0, max = 1_000_000, sliderMax = 100, step = 1, prefix, suffix, hint, disabled = false, showErrors = false }: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  min?: number; max?: number; sliderMax?: number; step?: number;
  prefix?: string; suffix?: string; hint?: string; disabled?: boolean; showErrors?: boolean;
}) {
  const parsed = amount(value, min, max, step);
  const error = (value !== "" || showErrors) && parsed === null;
  // Keep the extended scale stable when dragging back from a large typed value.
  const [extendedMax, setExtendedMax] = useState(Math.max(sliderMax, parsed ?? min));
  const rangeMax = Math.min(max, Math.max(min, sliderMax, extendedMax));
  const progress = rangeMax > min ? ((parsed ?? min) - min) / (rangeMax - min) * 100 : 0;
  return <div className={styles.numeric}>
    <div className={styles.numericHeading}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.numberBox}>
        {prefix && <span aria-hidden="true">{prefix}</span>}
        <input id={id} type="number" inputMode={step < 1 ? "decimal" : "numeric"} min={min} max={max} step={step}
          value={value} disabled={disabled} aria-invalid={error || undefined}
          aria-describedby={hint || error ? `${id}-hint` : undefined}
          onChange={(event) => {
            const next = amount(event.target.value, min, max, step);
            if (next !== null) setExtendedMax((previous) => Math.max(previous, next));
            onChange(event.target.value);
          }} />
        {suffix && <span aria-hidden="true">{suffix}</span>}
      </div>
    </div>
    <input id={`${id}-slider`} type="range" min={min} max={rangeMax} step={step} disabled={disabled || max === min}
      value={parsed ?? min} aria-label={`${label}${prefix ? " in pounds" : ""} — slider`}
      style={{ "--impact-progress": `${progress}%` } as CSSProperties}
      onChange={(event) => onChange(event.target.value)} />
    {(hint || error) && <p id={`${id}-hint`} className={error ? styles.error : styles.hint}>
      {error ? `Enter ${step === 1 ? "a whole number" : "a number"} from ${number.format(min)} to ${number.format(max)}${step < 1 && step !== 0.01 ? `, in steps of ${step}` : ""}.${step === 0.01 ? " Use up to two decimal places." : ""}` : hint}
    </p>}
  </div>;
}

function PeriodButtons({ id, period, onChange, includeWeek = false }: {
  id: string; period: Period; onChange: (period: Period) => void; includeWeek?: boolean;
}) {
  const periods: Period[] = includeWeek ? ["week", "month", "year"] : ["month", "year"];
  return <div className={styles.periods} role="group" aria-label="Money view period">
    {periods.map((value) => <button id={`${id}-${value}`} key={value} type="button" aria-pressed={period === value}
      onClick={() => onChange(value)}>{value === "week" ? "Weekly" : value === "month" ? "Monthly" : "Yearly"}</button>)}
  </div>;
}

export default function BusinessImpact({ config, onDiscuss }: { config: ClientConfig; onDiscuss: (topic: string) => void }) {
  const [mode, setMode] = useState<Mode>("admin");
  const adminTab = useRef<HTMLButtonElement>(null);
  const enquiriesTab = useRef<HTMLButtonElement>(null);
  const a = config.adminExample;
  const e = config.enquiryExample;
  const [adminOrigin, setAdminOrigin] = useState<Origin>("example");
  const [enquiryOrigin, setEnquiryOrigin] = useState<Origin>("example");
  const [areaId, setAreaId] = useState(a.area);
  const [taskId, setTaskId] = useState(a.task);
  const [otherTask, setOtherTask] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("week");
  const [count, setCount] = useState(String(a.count));
  const [before, setBefore] = useState(String(a.before));
  const [whoseTime, setWhoseTime] = useState("owner");
  const [valueMode, setValueMode] = useState<ValueMode>("example");
  const [exampleRate, setExampleRate] = useState(String(a.hourlyValue));
  const [ownRate, setOwnRate] = useState("");
  const [weeks, setWeeks] = useState(String(a.workingWeeks));
  const [days, setDays] = useState(String(a.workingDays));
  const [adminMonths, setAdminMonths] = useState(String(a.activeMonths));
  const [adminPeriod, setAdminPeriod] = useState<Period>("year");
  const [salesUnit, setSalesUnit] = useState<SalesUnit>("booking");
  const [enquiries, setEnquiries] = useState(String(e.enquiries));
  const [customers, setCustomers] = useState(String(e.customers));
  const [saleValue, setSaleValue] = useState(String(e.saleValue));
  const [includeCosts, setIncludeCosts] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(String(e.deliveryCost));
  const [salesMonths, setSalesMonths] = useState(String(e.activeMonths));
  const [salesPeriod, setSalesPeriod] = useState<Period>("month");
  const [capacity, setCapacity] = useState("unsure");

  const area = config.areas.find((item) => item.id === areaId) ?? config.areas[0];
  const task = area.tasks.find((item) => item.id === taskId) ?? area.tasks[0];
  const markAdmin = () => setAdminOrigin((origin) => origin === "example" ? "edited" : origin);
  const markEnquiry = () => setEnquiryOrigin((origin) => origin === "example" ? "edited" : origin);
  const changeAdmin = (setter: (value: string) => void) => (value: string) => { markAdmin(); setter(value); };
  const changeEnquiry = (setter: (value: string) => void) => (value: string) => { markEnquiry(); setter(value); };

  const taskCount = amount(count, 0, 1_000_000, 1);
  const beforeMinutes = amount(before, 0, 1440, 0.5);
  const reductionPercent = Math.min(100, Math.max(0, config.illustration.timeReductionPercent));
  const afterMinutes = beforeMinutes === null ? null : beforeMinutes * (1 - reductionPercent / 100);
  const workingWeeks = amount(weeks, 1, 52, 1);
  const workingDays = amount(days, 1, 7, 1);
  const activeAdminMonths = amount(adminMonths, 1, 12, 1);
  const hourlyRate = valueMode === "time" ? 0 : amount(valueMode === "example" ? exampleRate : ownRate, 0, 10_000);
  const adminValid = taskCount !== null && beforeMinutes !== null && afterMinutes !== null && afterMinutes <= beforeMinutes && hourlyRate !== null
    && (frequency === "month" ? activeAdminMonths !== null : workingWeeks !== null && (frequency !== "day" || workingDays !== null));
  const occurrencesPerPeriod = (taskCount ?? 0) * (frequency === "day" ? workingDays ?? 0 : 1);
  const currentHours = occurrencesPerPeriod * (beforeMinutes ?? 0) / 60;
  const proposedHours = occurrencesPerPeriod * (afterMinutes ?? 0) / 60;
  const freedHours = Math.max(0, currentHours - proposedHours);
  const currentDuration = duration(currentHours);
  const proposedDuration = duration(proposedHours);
  const freedDuration = duration(freedHours);
  const annualHours = freedHours * (frequency === "month" ? activeAdminMonths ?? 0 : workingWeeks ?? 0);
  const annualValue = annualHours * (hourlyRate ?? 0);
  const timeUnit = frequency === "month" ? "active month" : "working week";

  const enquiryCount = amount(enquiries, 0, 1_000_000, 1);
  const customerCount = amount(customers, 0, enquiryCount ?? 1_000_000, 1);
  const available = enquiryCount !== null && customerCount !== null ? enquiryCount - customerCount : 0;
  const extraCount = enquiryCount !== null && customerCount !== null
    ? Math.min(Math.max(0, Math.floor(config.illustration.additionalCustomers)), available) : null;
  const averageValue = amount(saleValue, 0, 10_000_000);
  const costPerSale = amount(deliveryCost, 0, 10_000_000);
  const activeSalesMonths = amount(salesMonths, 1, 12, 1);
  const salesValid = enquiryCount !== null && customerCount !== null && extraCount !== null && averageValue !== null
    && activeSalesMonths !== null && (!includeCosts || costPerSale !== null);
  const unitPlural = salesUnit === "booking" ? "bookings" : salesUnit === "job" ? "jobs" : "sales";
  const illustratedSalesCount = extraCount ?? config.illustration.additionalCustomers;
  const exampleSalesLabel = illustratedSalesCount === 1 ? `one additional ${salesUnit}` : `${number.format(illustratedSalesCount)} additional ${unitPlural}`;
  const origin = mode === "admin" ? adminOrigin : enquiryOrigin;

  // Draft answers and the last submitted calculation are deliberately separate.
  // Changing a control never silently changes a result or its supporting labels.
  const adminCandidate = {
    key: JSON.stringify({ areaId, taskId, otherTask, frequency, count, before, whoseTime, valueMode, exampleRate, ownRate, weeks, days, adminMonths }),
    adminValid, area, task, otherTask, frequency, reductionPercent, beforeMinutes, afterMinutes,
    occurrencesPerPeriod, currentDuration, proposedDuration, freedDuration, freedHours, annualHours,
    annualValue, hourlyRate, valueMode, workingWeeks, activeAdminMonths, timeUnit,
  };
  const salesCandidate = {
    key: JSON.stringify({ salesUnit, enquiries, customers, saleValue, includeCosts, deliveryCost, salesMonths, capacity }),
    salesValid, enquiryCount, customerCount, available, extraCount, averageValue, costPerSale,
    activeSalesMonths, salesUnit, unitPlural, exampleSalesLabel, includeCosts, capacity,
  };
  const [adminCalculation, setAdminCalculation] = useState<typeof adminCandidate | null>(null);
  const [salesCalculation, setSalesCalculation] = useState<typeof salesCandidate | null>(null);
  const adminPending = adminCalculation !== null && adminCalculation.key !== adminCandidate.key;
  const salesPending = salesCalculation !== null && salesCalculation.key !== salesCandidate.key;
  const adminErrors = adminCalculation !== null && !adminCalculation.adminValid;
  const salesErrors = salesCalculation !== null && !salesCalculation.salesValid;

  function calculateAdmin() { setAdminCalculation(adminCandidate); }
  function calculateSales() { setSalesCalculation(salesCandidate); }

  function resetAdmin(own: boolean) {
    setAdminCalculation(null);
    setAdminOrigin(own ? "own" : "example"); setAreaId(a.area); setTaskId(a.task); setOtherTask("");
    setFrequency("week"); setCount(own ? "" : String(a.count)); setBefore(own ? "" : String(a.before));
    setWhoseTime("owner"); setValueMode("example"); setOwnRate(""); setExampleRate(String(a.hourlyValue));
    setWeeks(String(a.workingWeeks)); setDays(String(a.workingDays)); setAdminMonths(String(a.activeMonths)); setAdminPeriod("year");
  }

  function resetEnquiry(own: boolean) {
    setSalesCalculation(null);
    setEnquiryOrigin(own ? "own" : "example"); setSalesUnit("booking"); setEnquiries(own ? "" : String(e.enquiries));
    setCustomers(own ? "" : String(e.customers));
    setSaleValue(own ? "" : String(e.saleValue)); setIncludeCosts(false); setDeliveryCost(own ? "" : String(e.deliveryCost));
    setSalesMonths(String(e.activeMonths)); setSalesPeriod("month"); setCapacity("unsure");
  }

  function changeEnquiries(value: string) {
    markEnquiry(); setEnquiries(value);
    // Do not overwrite another answer while an owner types (for example 20 → 40).
    // An inconsistent booking count is shown as invalid until corrected.
  }

  function changeCustomers(value: string) {
    markEnquiry(); setCustomers(value);
  }

  function tabKey(key: string) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return false;
    const next = key === "Home" ? "admin" : key === "End" ? "enquiries" : mode === "admin" ? "enquiries" : "admin";
    setMode(next); (next === "admin" ? adminTab : enquiriesTab).current?.focus(); return true;
  }

  function renderAdminResult() {
    if (!adminCalculation) return <div className={styles.emptyResult}><Clock3 size={30} aria-hidden="true" /><h4>Ready when you are.</h4><p>Enter your figures, then press <strong>Calculate admin impact</strong> to see the time and value that could be freed up.</p><p>This uses an illustrative improvement, not a guaranteed result.</p></div>;
    const { adminValid, area, task, otherTask, frequency, reductionPercent, currentDuration, proposedDuration, freedDuration, freedHours, annualValue, hourlyRate, valueMode, workingWeeks, activeAdminMonths, timeUnit } = adminCalculation;
    const adminMoney = adminPeriod === "year" ? annualValue : adminPeriod === "month" ? annualValue / 12 : frequency === "month" ? annualValue / 52 : freedHours * (hourlyRate ?? 0);
    const moneyLabel = `${adminPeriod === "year" ? "Annual" : adminPeriod === "month" ? "Monthly" : "Weekly"} value of time freed up${adminPeriod === "week" && frequency !== "month" ? " per working week" : ""}`;
    return <>
      {adminPending && <p className={styles.pendingNotice}>Figures changed. These are your previous results. Press <strong>Calculate admin impact</strong> to update.</p>}
            <div className={styles.resultTop}><span className={styles.eyebrow}>An illustrative improvement</span><Clock3 size={20} aria-hidden="true" /></div>
            <h4 className={styles.illustrationTitle}>{reductionPercent === 50 ? "Imagine this taking half the time." : `Imagine spending ${reductionPercent}% less time on this task.`}</h4>
            {adminValid && valueMode !== "time" && <><p className={styles.viewLabel}>Money view</p><PeriodButtons id="calculator-admin-period" period={adminPeriod} onChange={setAdminPeriod} includeWeek /></>}
            {adminValid ? <>
              <p className={styles.taskCaption}>{area.id === "other" && otherTask.trim() ? otherTask.trim() : task.label}</p>
              <div className={styles.comparison}>
                <div><span>Time now</span><strong>{currentDuration.value}<small>{currentDuration.unit}</small></strong></div>
                <ArrowRight size={21} aria-hidden="true" />
                <div><span>In this example</span><strong>{proposedDuration.value}<small>{proposedDuration.unit}</small></strong></div>
              </div>
              <p className={styles.unitNote}>Per {timeUnit} · {frequency === "month" ? activeAdminMonths : workingWeeks} {frequency === "month" ? "active months" : "working weeks"} a year</p>
              <div className={styles.timeResult}><strong>{freedDuration.value} {freedDuration.unit}</strong><span>freed up per {timeUnit} in this example</span></div>
              {valueMode !== "time" && hourlyRate !== null
                ? <div className={styles.moneyResult}><strong>{formatMoney(adminMoney)}</strong><span>{moneyLabel}</span></div>
                : valueMode === "time" ? <p className={styles.resultMessage}>Your time has value even without a pound figure. Choose an hourly value to explore it.</p>
                  : <p className={styles.resultMessage}>Enter an hourly figure to see the financial value, or choose an example.</p>}
              {freedHours === 0 && <p className={styles.resultMessage}>There is no time spent on this task in your current figures. Choose another task to explore its value.</p>}
              {adminMoney > 0 && valueMode !== "time" && <p className={styles.basis}>
                {valueMode === "example" ? "Example hourly value" : "Your hourly figure"}: {preciseMoney.format(hourlyRate ?? 0)}.
                {adminPeriod === "month" || adminPeriod === "week" && frequency === "month" ? " Averaged across the calendar year." : ""}
              </p>}
            </> : <div className={styles.emptyResult}><Clock3 size={30} aria-hidden="true" /><h4>Check your figures.</h4><p>Tell us roughly how often it happens and how long it takes today. We’ll show the value of an illustrative improvement.</p><p>If you changed the working assumptions, check those figures too, then press Calculate again.</p></div>}
            <p className={styles.resultBoundary}>We review your process before estimating achievable savings. The figure values time freed up; cash is saved where spending falls. Motus and software costs are not deducted.</p>
            <div className={styles.resultActions}>
              <a id="calculator-enquiry-link" href={config.contactHref} onClick={() => onDiscuss("Free workflow review")}>Discuss this task <ArrowRight size={17} aria-hidden="true" /></a>
              <Link id="calculator-admin-demo" href={area.demo.href}>{area.demo.label} <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
    </>;
  }

  function renderSalesResult() {
    if (!salesCalculation) return <div className={styles.emptyResult}><TrendingUp size={30} aria-hidden="true" /><h4>Ready when you are.</h4><p>Enter your figures, then press <strong>Calculate enquiry value</strong> to see what one additional customer could be worth.</p><p>This uses an illustrative improvement, not a guaranteed result.</p></div>;
    const { salesValid, enquiryCount, customerCount, available, extraCount, averageValue, costPerSale, activeSalesMonths, salesUnit, unitPlural, exampleSalesLabel, includeCosts, capacity } = salesCalculation;
    const salesMultiplier = salesPeriod === "year" ? activeSalesMonths ?? 0 : 1;
    const additionalSales = (extraCount ?? 0) * (averageValue ?? 0) * salesMultiplier;
    const contribution = (extraCount ?? 0) * ((averageValue ?? 0) - (costPerSale ?? 0)) * salesMultiplier;
    return <>
      {salesPending && <p className={styles.pendingNotice}>Figures changed. These are your previous results. Press <strong>Calculate enquiry value</strong> to update.</p>}
            <div className={styles.resultTop}><span className={styles.eyebrow}>An illustrative improvement</span><TrendingUp size={20} aria-hidden="true" /></div>
            <h4 className={styles.illustrationTitle}>{enquiryCount !== null && customerCount !== null && available === 0 ? "What your current figures show." : `Imagine ${exampleSalesLabel} each month.`}</h4>
            {salesValid && <><p className={styles.viewLabel}>Money view</p>
            <PeriodButtons id="calculator-sales-period" period={salesPeriod} onChange={setSalesPeriod} /></>}
            {salesValid ? <>
              <div className={styles.comparison}>
                <div><span>{unitPlural} now</span><strong>{number.format(customerCount ?? 0)}</strong></div><ArrowRight size={21} aria-hidden="true" />
                <div><span>In this example</span><strong>{number.format((customerCount ?? 0) + (extraCount ?? 0))}</strong></div>
              </div>
              <p className={styles.unitNote}>From {number.format(enquiryCount ?? 0)} enquiries in your typical month</p>
              <div className={styles.moneyResult}><strong>{formatMoney(additionalSales)}</strong><span>Additional {salesPeriod === "year" ? "annual" : "monthly"} sales in this example</span></div>
              <p className={styles.basis}>{extraCount === 1 ? `1 additional ${salesUnit}` : `${number.format(extraCount ?? 0)} additional ${unitPlural}`} × {preciseMoney.format(averageValue ?? 0)}{salesPeriod === "year" ? ` × ${activeSalesMonths} active months` : ""}. Sales before costs.</p>
              {(extraCount ?? 0) > 0 && <p className={styles.basis}>This values {exampleSalesLabel}. Changing enquiry volume alone does not change the value of that {salesUnit}.</p>}
              {includeCosts && (costPerSale !== null ? <div className={styles.contribution}>
                <span>After direct delivery costs</span><strong>{formatMoney(contribution)}</strong>
                <small>Per {salesPeriod}. Before overheads, Motus and software costs.</small>
                {contribution < 0 && <p>The direct cost exceeds the sale value. This scenario would lose money before overheads.</p>}
              </div> : <p className={styles.resultMessage}>Enter a delivery cost to see what remains after direct costs. Sales above are before costs.</p>)}
              {enquiryCount === 0 ? <p className={styles.resultMessage}>There are no existing enquiries to convert here. A clearer website could help customers understand your offer; we would first discuss how people will find it.</p>
                : available === 0 ? <p className={styles.resultMessage}>Your figures already convert every enquiry. More sales would need a separate source of demand or a different offer.</p>
                  : null}
              {capacity === "no" && (extraCount ?? 0) > 0 && <div className={styles.capacityNote}>
                <strong>Capacity comes first.</strong>
                <p>You would need room to deliver these extra {unitPlural}. Explore whether reducing admin could help.</p>
                <button id="calculator-explore-capacity" type="button" onClick={() => { setMode("admin"); adminTab.current?.focus(); }}>Explore admin time <ArrowRight size={14} aria-hidden="true" /></button>
              </div>}
            </> : <div className={styles.emptyResult}><TrendingUp size={30} aria-hidden="true" /><h4>Check your figures.</h4><p>Enter rough enquiries, the {unitPlural} won from them and a typical value. We’ll illustrate what one additional {salesUnit} could mean.</p><p>Current {unitPlural} cannot exceed your enquiries. Check any costs or annual settings you changed too, then press Calculate again.</p></div>}
            <p className={styles.resultBoundary}>An illustration, not a forecast. We review your website, demand, capacity and follow-up before recommending changes. Motus and software costs are not deducted.</p>
            <div className={styles.resultActions}>
              <a id="calculator-sales-contact" href={config.contactHref} onClick={() => onDiscuss("Keep track of enquiries")}>Discuss your enquiry process <ArrowRight size={17} aria-hidden="true" /></a>
              <Link id="calculator-sales-demo" href={salesUnit === "booking" ? "/demos/appointment-flow" : "/demos/lead-hub"}>{salesUnit === "booking" ? "Try Appointment Flow" : "Try Lead Hub"} <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
    </>;
  }

  return <section id="calculator" className={`site-section ${styles.section}`} aria-labelledby="calculator-title">
    <div className={`section-intro ${styles.intro}`}>
      <span>Make it relevant to you</span>
      <h2 id="calculator-title">{config.heading}</h2>
      <p>{config.introduction}</p>
    </div>
    <div className={styles.console}>
      <div className={styles.tabs} role="tablist" aria-label="Explore the potential impact">
        <button id="calculator-tab-admin" ref={adminTab} role="tab" type="button" aria-selected={mode === "admin"}
          aria-controls="calculator-panel-admin" tabIndex={mode === "admin" ? 0 : -1} onClick={() => setMode("admin")}
          onKeyDown={(event) => { if (tabKey(event.key)) event.preventDefault(); }}>
          <Clock3 size={19} aria-hidden="true" /><span>Reduce admin<small>Time and its financial value</small></span>
        </button>
        <button id="calculator-tab-enquiries" ref={enquiriesTab} role="tab" type="button" aria-selected={mode === "enquiries"}
          aria-controls="calculator-panel-enquiries" tabIndex={mode === "enquiries" ? 0 : -1} onClick={() => setMode("enquiries")}
          onKeyDown={(event) => { if (tabKey(event.key)) event.preventDefault(); }}>
          <TrendingUp size={19} aria-hidden="true" /><span>Win more business<small>Enquiries into customers</small></span>
        </button>
      </div>
      <div className={styles.scenarioBar}>
        <p><span className={styles.statusDot} aria-hidden="true" />
          {origin === "example" ? "Starting with an example business" : origin === "edited" ? "Example figures adjusted" : "Your business today"}
          <small>{origin === "example" ? "Adjust the figures, then press Calculate below." : origin === "edited" ? "Check the remaining example figures, then press Calculate." : "Rough estimates are fine. Press Calculate when ready."}</small>
        </p>
        <div className={styles.startButtons}>
          <button id={`calculator-${mode}-example`} type="button" onClick={() => mode === "admin" ? resetAdmin(false) : resetEnquiry(false)}>Not sure? Try an example</button>
          <button id={`calculator-${mode}-own-figures`} type="button" onClick={() => mode === "admin" ? resetAdmin(true) : resetEnquiry(true)}>Use my figures <ArrowRight size={14} aria-hidden="true" /></button>
        </div>
      </div>

      <div id="calculator-panel-admin" role="tabpanel" aria-labelledby="calculator-tab-admin" hidden={mode !== "admin"} tabIndex={0}>
        <div className={styles.body}>
          <form className={styles.inputs} noValidate onSubmit={(event) => { event.preventDefault(); calculateAdmin(); }}>
            <span className={styles.eyebrow}>Your business today</span>
            <h3>What does this task take today?</h3>
            <p className={styles.lead}>Choose a task and roughly how much time it takes. We’ll show what spending less time on it could mean.</p>
            <div className={styles.fieldPair}>
              <label className={styles.selectField} htmlFor="calculator-area">What would you like to organise?
                <select id="calculator-area" value={areaId} onChange={(event) => {
                  markAdmin(); setAreaId(event.target.value);
                  setTaskId(config.areas.find((item) => item.id === event.target.value)?.tasks[0].id ?? a.task);
                }}>{config.areas.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
              </label>
              <label className={styles.selectField} htmlFor="calculator-task">Which task takes your time?
                <select id="calculator-task" value={task.id} onChange={(event) => { markAdmin(); setTaskId(event.target.value); }}>
                  {area.tasks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
            </div>
            {areaId === "other" && <label className={styles.selectField} htmlFor="calculator-other-task">Describe your task <small>(optional)</small>
              <input id="calculator-other-task" value={otherTask} maxLength={100} placeholder="For example, preparing a weekly update" onChange={(event) => { markAdmin(); setOtherTask(event.target.value); }} />
            </label>}
            <div className={styles.frequencyRow}>
              <span>How often does it happen?</span>
              <label className={styles.srOnly} htmlFor="calculator-frequency">Count tasks per</label>
              <select id="calculator-frequency" value={frequency} onChange={(event) => { markAdmin(); setFrequency(event.target.value as Frequency); }}>
                <option value="day">Per working day</option><option value="week">Per working week</option><option value="month">Per active month</option>
              </select>
            </div>
            <NumericControl id="calculator-task-count" label={`${task.countLabel} per ${frequencyLabels[frequency]}`} value={count} onChange={changeAdmin(setCount)} sliderMax={100} showErrors={adminErrors} />
            <NumericControl id="calculator-minutes-before" label={`About how many minutes per ${task.item}?`} value={before} onChange={changeAdmin(setBefore)} max={1440} sliderMax={30} step={0.5} suffix="min" hint="Include the total time spent by everyone involved. An estimate is fine." showErrors={adminErrors} />
            <div className={styles.helpBlock}><span className={styles.eyebrow}>How Motus could help</span><p>{area.help}</p></div>
            <details className={styles.details}>
              <summary id="calculator-admin-assumptions">View or adjust the calculation <span aria-hidden="true">+</span></summary>
              <div className={styles.detailsContent}>
                <p>The illustration shows {reductionPercent}% less time on this task. This is an example, not an expected result. We review what is achievable, including any human checks, before proposing the work.</p>
            <div className={styles.fieldPair}>
              <label className={styles.selectField} htmlFor="calculator-whose-time">Whose time does this take?
                <select id="calculator-whose-time" value={whoseTime} onChange={(event) => { markAdmin(); setWhoseTime(event.target.value); }}>
                  <option value="owner">My own</option><option value="team">Someone in my team</option><option value="both">Both</option>
                </select>
              </label>
              <label className={styles.selectField} htmlFor="calculator-value-mode">How should we value that time?
                <select id="calculator-value-mode" value={valueMode} onChange={(event) => { markAdmin(); setValueMode(event.target.value as ValueMode); }}>
                  <option value="example">Show me an example</option><option value="own">Use my hourly figure</option><option value="time">Show time only</option>
                </select>
              </label>
            </div>
            {valueMode !== "time" && <NumericControl id="calculator-hourly-value" label={valueMode === "example" ? "Illustrative hourly value" : whoseTime === "both" ? "Average hourly value across the people involved" : whoseTime === "team" ? "Hourly cost of the person doing this work" : "What you value an hour of your time at"}
              value={valueMode === "example" ? exampleRate : ownRate} onChange={changeAdmin(valueMode === "example" ? setExampleRate : setOwnRate)} max={10_000} sliderMax={100} step={0.01} prefix="£"
              showErrors={adminErrors}
              hint={valueMode === "example" ? "An adjustable example, not a UK average or measured saving." : "If you do not know, use an example or choose ‘Show time only’."} />}
                <p>These starting values are illustrative. Change them for holidays, part-time or seasonal work.</p>
                {frequency === "day" && <NumericControl id="calculator-working-days" label="Working days per week" value={days} onChange={changeAdmin(setDays)} min={1} max={7} sliderMax={7} showErrors={adminErrors} />}
                {frequency === "month"
                  ? <NumericControl id="calculator-admin-months" label="Months this task happens each year" value={adminMonths} onChange={changeAdmin(setAdminMonths)} min={1} max={12} sliderMax={12} showErrors={adminErrors} />
                  : <NumericControl id="calculator-working-weeks" label="Weeks this task happens each year" value={weeks} onChange={changeAdmin(setWeeks)} min={1} max={52} sliderMax={52} showErrors={adminErrors} />}
              </div>
            </details>
            <div className={styles.calculateActions}>
              <button id="calculator-calculate-admin" className={styles.calculateButton} type="submit" aria-controls="calculator-admin-result">Calculate admin impact <ArrowRight size={18} aria-hidden="true" /></button>
              <p>{adminPending ? "Figures changed. Press Calculate to update your result." : "Your result appears when you press Calculate."}</p>
              {adminErrors && <p className={styles.error} role="alert">Check the task count, minutes and any settings under “View or adjust the calculation”, then press Calculate again.</p>}
            </div>
          </form>
          <aside id="calculator-admin-result" className={styles.results} aria-label="Admin scenario result">
            {renderAdminResult()}
          </aside>
        </div>
        <details className={styles.calculations}>
          <summary id="calculator-admin-calculation">How we calculated this <span aria-hidden="true">+</span></summary>
          <div className={styles.calculationContent}>
            <p>Motus has selected a {reductionPercent}% time reduction to illustrate the value, not to predict performance. Time freed up = task count × current minutes × {reductionPercent}% ÷ 60. Daily counts also use your working days per week.</p>
            <p>Annual time value = time freed up per working week × working weeks × hourly value. For monthly counts, we use your active months instead. Monthly money figures are annual value ÷ 12; weekly figures for monthly tasks are annual value ÷ 52.</p>
            {adminCalculation?.adminValid && <p><strong>Last calculated scenario:</strong> {number.format(adminCalculation.occurrencesPerPeriod)} × ({number.format(adminCalculation.beforeMinutes ?? 0)} − {number.format(adminCalculation.afterMinutes ?? 0)}) ÷ 60 ≈ {hours.format(adminCalculation.freedHours)} hours per {adminCalculation.timeUnit}. Annual time freed up: {hours.format(adminCalculation.annualHours)} hours. Displayed time and money figures are rounded.</p>}
            <p>Include all the people involved in your task times once. “Whose time” changes the guidance; it does not multiply the result. Every task uses the same clearly labelled illustration. A tailored estimate requires a review.</p>
          </div>
        </details>
      </div>

      <div id="calculator-panel-enquiries" role="tabpanel" aria-labelledby="calculator-tab-enquiries" hidden={mode !== "enquiries"} tabIndex={0}>
        <div className={styles.body}>
          <form className={styles.inputs} noValidate onSubmit={(event) => { event.preventDefault(); calculateSales(); }}>
            <span className={styles.eyebrow}>Your business today</span>
            <h3>Tell us about your enquiries.</h3>
            <p className={styles.lead}>Use a typical month. We’ll show what one additional booking, job or sale could be worth.</p>
            <label className={styles.selectField} htmlFor="calculator-sale-unit">What does a successful enquiry become?
              <select id="calculator-sale-unit" value={salesUnit} onChange={(event) => { markEnquiry(); setSalesUnit(event.target.value as SalesUnit); }}>
                <option value="booking">A booking</option><option value="job">A job</option><option value="sale">A sale</option>
              </select>
            </label>
            <NumericControl id="calculator-monthly-enquiries" label="Roughly how many enquiries each month?" value={enquiries} onChange={changeEnquiries} sliderMax={100} hint="Include website, phone, email and social enquiries. Count each opportunity once." showErrors={salesErrors} />
            <NumericControl id="calculator-current-customers" label={`How many of those enquiries become ${unitPlural}?`} value={customers} onChange={changeCustomers} max={enquiryCount ?? 1_000_000} sliderMax={Math.min(enquiryCount ?? 100, 100)}
              hint="A rough estimate is fine. Use the outcomes from those enquiries, even if they take longer to decide." showErrors={salesErrors} />
            <NumericControl id="calculator-average-value" label={`What is a typical ${salesUnit} worth?`} value={saleValue} onChange={changeEnquiry(setSaleValue)} max={10_000_000} sliderMax={2000} step={0.01} prefix="£"
              hint="Use the first booking, job or purchase value, before costs." showErrors={salesErrors} />
            <div className={styles.helpBlock}><span className={styles.eyebrow}>How Motus could help</span><p>A clearer website, easier {salesUnit === "booking" ? "booking" : "enquiry"} process and organised follow-up can help customers take the next step.</p></div>
            <details className={styles.details}>
              <summary id="calculator-sales-assumptions">View or adjust the calculation <span aria-hidden="true">+</span></summary>
              <div className={styles.detailsContent}>
                <p>We illustrate {config.illustration.additionalCustomers === 1 ? "one additional customer" : `${config.illustration.additionalCustomers} additional customers`} from the enquiries you already receive. This is not a forecast. You can add direct costs or adjust the annual view below.</p>
            <label className={styles.selectField} htmlFor="calculator-capacity">Could you take on that extra work?
              <select id="calculator-capacity" value={capacity} onChange={(event) => { markEnquiry(); setCapacity(event.target.value); }}>
                <option value="unsure">Not sure yet</option><option value="yes">Yes</option><option value="no">Not at the moment</option>
              </select>
            </label>
            <label className={styles.costSwitch} htmlFor="calculator-include-costs">
              <input id="calculator-include-costs" type="checkbox" checked={includeCosts} onChange={(event) => { markEnquiry(); setIncludeCosts(event.target.checked); }} />
              <span>Account for delivery costs<small>See what remains after the direct cost of the extra work.</small></span>
            </label>
            {includeCosts && <NumericControl id="calculator-delivery-cost" label={`Direct cost of one additional ${salesUnit}`} value={deliveryCost} onChange={changeEnquiry(setDeliveryCost)} max={10_000_000} sliderMax={2000} step={0.01} prefix="£"
              showErrors={salesErrors}
              hint="Include extra materials, travel, transaction charges or paid labour needed for that sale. Use the same VAT basis as your sale value." />}
                <p>The monthly result describes your chosen typical month. For a yearly view, choose how many months that pattern applies.</p>
                <NumericControl id="calculator-sales-months" label="Months this pattern applies each year" value={salesMonths} onChange={changeEnquiry(setSalesMonths)} min={1} max={12} sliderMax={12} showErrors={salesErrors} />
              </div>
            </details>
            <div className={styles.calculateActions}>
              <button id="calculator-calculate-enquiries" className={styles.calculateButton} type="submit" aria-controls="calculator-sales-result">Calculate enquiry value <ArrowRight size={18} aria-hidden="true" /></button>
              <p>{salesPending ? "Figures changed. Press Calculate to update your result." : "Your result appears when you press Calculate."}</p>
              {salesErrors && <p className={styles.error} role="alert">Check your enquiries, {unitPlural} and value, plus any optional costs or annual settings, then press Calculate again.</p>}
            </div>
          </form>
          <aside id="calculator-sales-result" className={styles.results} aria-label="Enquiry scenario result">
            {renderSalesResult()}
          </aside>
        </div>
        <details className={styles.calculations}>
          <summary id="calculator-sales-calculation">How we calculated this <span aria-hidden="true">+</span></summary>
          <div className={styles.calculationContent}>
            <p>We illustrate up to {config.illustration.additionalCustomers} additional {config.illustration.additionalCustomers === 1 ? (salesCalculation?.salesUnit ?? salesUnit) : (salesCalculation?.unitPlural ?? unitPlural)}, limited to the enquiries that have not already converted. Additional monthly sales = illustrated additional customers × average value. The yearly view uses your selected active months.</p>
            <p>After direct delivery costs = additional customers × (average value − direct cost per customer). Overheads, Motus fees and software costs are not deducted; this is not net profit or return on investment.</p>
            <p>All your current figures describe the same group of enquiries. The improvement is selected by Motus for illustration; it is not predicted from those figures. No new traffic or repeat business is added.</p>
            <p>Time freed up and additional sales are kept separate. Adding both could count the same benefit twice.</p>
          </div>
        </details>
      </div>
      <p className={styles.footerNote}>Illustrative improvements. We review what is achievable before proposing the work. Your calculator inputs are not submitted or saved. No email needed.</p>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {mode === "admin"
          ? !adminCalculation ? "Press Calculate admin impact to see your result." : adminPending ? "Figures changed. Press Calculate admin impact to update." : adminCalculation.adminValid ? "Admin calculation updated." : "Check your figures, then press Calculate admin impact again."
          : !salesCalculation ? "Press Calculate enquiry value to see your result." : salesPending ? "Figures changed. Press Calculate enquiry value to update." : salesCalculation.salesValid ? "Enquiry calculation updated." : "Check your figures, then press Calculate enquiry value again."}
      </p>
    </div>
  </section>;
}
