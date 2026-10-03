import { useState, useEffect } from "react"

// ─── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  canvas:  "#F7F4EF",
  ink:     "#1C1A18",
  inkSub:  "#3E3A36",
  muted:   "#9B9189",
  card:    "#FFFFFF",
  cardAlt: "#F0EDE7",
  border:  "#E5E0D8",
  accent:  "#C4622D",
  accentL: "#F5EAE2",
  green:   "#3B7A55",
  greenL:  "#E7F3EC",
}

const SERIF = "'Fraunces', serif"
const SANS  = "'Instrument Sans', sans-serif"

// ─── Fixture ──────────────────────────────────────────────────────────────────
const APT = {
  client:   "Maya Chen",
  service:  "Initial Consultation",
  date:     "Thursday, 29 August",
  shortDate:"Thu 29 Aug",
  time:     "2:30 pm",
  duration: "60 min",
  staff:    "Jordan",
  newStaff: "Sam",
  ref:      "APT-20840",
}

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 640)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return mobile
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Btn({
  label, onClick, variant = "dark", fullWidth = false, disabled = false,
}: {
  label: string; onClick: () => void; variant?: "dark" | "ghost"; fullWidth?: boolean; disabled?: boolean
}) {
  const [hover, setHover] = useState(false)
  const isDark = variant === "dark"
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
        width: fullWidth ? "100%" : "auto",
        padding: "13px 24px",
        background: isDark ? (hover ? T.accent : T.ink) : "transparent",
        color: isDark ? T.canvas : hover ? T.accent : T.muted,
        border: isDark ? "none" : `1px solid ${hover ? T.accent : T.border}`,
        fontFamily: SANS,
        fontSize: "14px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "2px",
        transition: "all 0.18s ease",
        letterSpacing: "0.01em",
        opacity: disabled ? 0.5 : 1,
        textAlign: "center" as const,
      }}
    >
      {label}
    </button>
  )
}

function Tag({ label, color }: { label: string; color: "green" | "amber" | "muted" | "red" }) {
  const map = {
    green:  { bg: T.greenL,         text: T.green  },
    amber:  { bg: T.accentL,        text: T.accent },
    muted:  { bg: T.cardAlt,        text: T.muted  },
    red:    { bg: "#FDEAEA",        text: "#B03030" },
  }
  const { bg, text } = map[color]
  return (
    <span style={{
      background: bg, color: text,
      fontFamily: SANS, fontSize: "11px", fontWeight: 600,
      padding: "3px 9px", borderRadius: "2px",
      letterSpacing: "0.06em", textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const,
    }}>
      {label}
    </span>
  )
}

// ─── Auto-advance progress bar ────────────────────────────────────────────────
function AutoAdvance({ duration, onComplete }: { duration: number; onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  }, [duration, onComplete])

  return (
    <div style={{ maxWidth: "540px", width: "100%", marginTop: "20px" }}>
      <div style={{ height: "2px", background: T.border, borderRadius: "1px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          background: T.accent,
          borderRadius: "1px",
          width: "0%",
          animation: `fillBar ${duration}ms linear forwards`,
        }} />
      </div>
    </div>
  )
}

// ─── Progress strip ───────────────────────────────────────────────────────────
function ProgressBar({ current, onBack, mobile }: { current: number; onBack: () => void; mobile: boolean }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: T.canvas, borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: `0 ${mobile ? "20px" : "40px"}`,
        display: "flex", alignItems: "center", height: "52px", gap: "16px",
      }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: SANS, fontSize: "12px", color: T.muted,
            background: "none", border: "none", cursor: "pointer",
            letterSpacing: "0.06em", flexShrink: 0, padding: 0,
            transition: "color 0.15s", whiteSpace: "nowrap" as const,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
        >
          ← {mobile ? "Back" : "Appointment Flow"}
        </button>
        <div style={{ flex: 1, display: "flex", gap: "3px" }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: "2px",
              background: i < current ? T.accent : T.border,
              transition: "background 0.4s ease",
              borderRadius: "1px",
            }} />
          ))}
        </div>
        <span style={{ fontFamily: SANS, fontSize: "12px", color: T.muted, flexShrink: 0 }}>
          {current} / 6
        </span>
      </div>
    </div>
  )
}

// ─── Scene shell ──────────────────────────────────────────────────────────────
function Shell({ step, narrative, lead, children, mobile }: {
  step: number; narrative: string; lead: string; children: React.ReactNode; mobile: boolean
}) {
  const px = mobile ? "20px" : "40px"
  const py = mobile ? "36px 36px 52px" : "52px 40px 64px"
  return (
    <div style={{
      minHeight: "calc(100vh - 52px)", marginTop: "52px",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: py, paddingLeft: px, paddingRight: px,
    }}>
      <div style={{ maxWidth: "540px", width: "100%", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: T.accent, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: SANS, fontSize: "11px", fontWeight: 600, color: "#fff" }}>{step}</span>
          </div>
          <span style={{
            fontFamily: SANS, fontSize: "11px", color: T.muted,
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            Step {step} of 6
          </span>
        </div>
        <h2 style={{
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
          fontSize: mobile ? "26px" : "clamp(28px, 4vw, 38px)",
          lineHeight: 1.12, color: T.ink, marginBottom: "12px",
        }}>
          {narrative}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: mobile ? "14px" : "15px", color: T.inkSub, lineHeight: 1.68 }}>
          {lead}
        </p>
      </div>
      {children}
    </div>
  )
}

// ─── SCENE 0: Landing ─────────────────────────────────────────────────────────
function Scene0({ onStart }: { onStart: () => void }) {
  const mobile = useIsMobile()
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: mobile ? "48px 20px 56px" : "60px 40px",
    }}>
      <div style={{
        maxWidth: 1060, margin: "0 auto", width: "100%",
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
        gap: mobile ? "40px" : "80px",
        alignItems: "center",
      }}>
        {/* Left */}
        <div>
          <p style={{
            fontFamily: SANS, fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: T.muted, marginBottom: "28px",
          }}>
            Appointment Flow · Illustrative demo
          </p>
          <h1 style={{
            fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
            fontSize: mobile ? "36px" : "clamp(38px, 5.5vw, 64px)",
            lineHeight: 1.06, color: T.ink, marginBottom: "22px",
          }}>
            What happens after<br />a customer books?
          </h1>
          <p style={{
            fontFamily: SANS, fontSize: mobile ? "15px" : "17px",
            lineHeight: 1.68, color: T.inkSub,
            maxWidth: "400px", marginBottom: "48px",
          }}>
            A short illustrated walkthrough of every moment in the booking journey — from time selection through to a safely stored record.
          </p>

          {/* CTA with hand-drawn circle */}
          <div style={{ display: "inline-block", position: "relative" }}>
            <svg
              viewBox="0 0 256 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                top: "-16px", left: "-22px",
                width: "calc(100% + 44px)",
                height: "calc(100% + 32px)",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <path
                d="M 16,38 C 10,14 58,5 128,5 C 198,5 247,14 252,36 C 257,58 208,71 128,71 C 48,71 14,59 16,38 Z"
                stroke={T.accent}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 720,
                  strokeDashoffset: 720,
                  animation: "drawCircle 1.6s cubic-bezier(0.4,0,0.2,1) 0.5s forwards",
                }}
              />
            </svg>
            <Btn label="See how it works" onClick={onStart} />
          </div>
        </div>

        {/* Right: booking card */}
        <div>
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: "4px", padding: mobile ? "24px" : "32px",
            boxShadow: "0 6px 32px rgba(28,26,24,0.07)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "24px",
            }}>
              <span style={{
                fontFamily: SANS, fontSize: "12px",
                color: T.muted, letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Booking illustration
              </span>
              <Tag label="Confirmed" color="green" />
            </div>

            <h3 style={{
              fontFamily: SERIF, fontSize: mobile ? "22px" : "26px",
              fontWeight: 400, color: T.ink, marginBottom: "4px",
            }}>
              {APT.client}
            </h3>
            <p style={{ fontFamily: SANS, fontSize: "14px", color: T.muted, marginBottom: "24px" }}>
              {APT.service}
            </p>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                ["Date",  APT.date],
                ["Time",  `${APT.time} · ${APT.duration}`],
                ["With",  APT.staff],
                ["Ref",   APT.ref],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                  <span style={{
                    fontFamily: SANS, fontSize: "11px",
                    color: T.muted, textTransform: "uppercase",
                    letterSpacing: "0.09em", flexShrink: 0,
                  }}>{label}</span>
                  <span style={{ fontFamily: SANS, fontSize: "14px", color: T.ink, textAlign: "right" as const }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "22px", padding: "13px 14px",
              background: T.accentL, borderRadius: "2px",
              display: "flex", alignItems: "flex-start", gap: "10px",
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: T.accent, flexShrink: 0, marginTop: "4px",
                animation: "pulseDot 2s ease infinite",
              }} />
              <span style={{ fontFamily: SANS, fontSize: "13px", color: T.accent, lineHeight: 1.5 }}>
                Fictional illustration. Walk through what happens after a booking.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCENE 1: Time selection ──────────────────────────────────────────────────
const SLOTS   = ["9:00 am","9:30 am","10:00 am","10:30 am","11:00 am","11:30 am","1:00 pm","1:30 pm","2:00 pm","2:30 pm","3:00 pm","3:30 pm"]
const UNAVAIL = ["9:30 am","11:00 am","1:00 pm","3:00 pm"]

function Scene1({ onNext }: { onNext: () => void }) {
  const mobile = useIsMobile()
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Auto-select Maya's slot after 1.8s to illustrate the customer choosing
  useEffect(() => {
    const t = setTimeout(() => setSelected("2:30 pm"), 1800)
    return () => clearTimeout(t)
  }, [])

  // Once selected, confirm after 1.4s then advance
  useEffect(() => {
    if (!selected) return
    const t1 = setTimeout(() => setConfirmed(true), 1400)
    const t2 = setTimeout(() => onNext(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [selected, onNext])

  return (
    <Shell
      step={1}
      narrative="The customer picks a time"
      lead={`In this illustration, Maya opens a booking link. She sees the available slots for ${APT.date} and selects the time that works for her.`}
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", overflow: "hidden",
        maxWidth: "520px", width: "100%",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Date header */}
        <div style={{
          padding: mobile ? "16px 20px" : "20px 24px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: "12px",
        }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: mobile ? "16px" : "18px", fontWeight: 400, color: T.ink }}>
              {APT.date}
            </div>
            <div style={{ fontFamily: SANS, fontSize: "13px", color: T.muted, marginTop: "3px" }}>
              {APT.service} · {APT.duration}
            </div>
          </div>
          {!mobile && (
            <div style={{ display: "flex", gap: "4px" }}>
              {[["Wed","28"],["Thu","29"],["Fri","30"],["Sat","31"]].map(([d, n], i) => (
                <div key={d} style={{
                  width: "40px", height: "40px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: i === 1 ? T.ink : "transparent",
                  borderRadius: "2px",
                }}>
                  <span style={{ fontFamily: SANS, fontSize: "9px", color: i === 1 ? "rgba(255,255,255,0.55)" : T.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</span>
                  <span style={{ fontFamily: SANS, fontSize: "15px", fontWeight: 500, color: i === 1 ? "#fff" : T.ink, marginTop: "1px" }}>{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slots */}
        <div style={{
          padding: mobile ? "16px 20px" : "20px 24px",
          display: "grid",
          gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: "7px",
        }}>
          {SLOTS.map(slot => {
            const busy   = UNAVAIL.includes(slot)
            const active = selected === slot
            return <SlotBtn key={slot} slot={slot} busy={busy} active={active} onClick={() => !busy && !selected && setSelected(slot)} />
          })}
        </div>

        {/* Confirm strip */}
        <div style={{
          padding: mobile ? "14px 20px 20px" : "16px 24px 24px",
          borderTop: `1px solid ${T.border}`,
          opacity: selected ? 1 : 0,
          transform: selected ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.3s, transform 0.3s",
        }}>
          <div style={{ fontFamily: SANS, fontSize: "13px", color: T.muted, marginBottom: "12px" }}>
            Selected:{" "}
            <strong style={{ color: T.ink, fontWeight: 600 }}>{selected}</strong>
            {" "}· {APT.duration} · {APT.service}
          </div>
          <div style={{
            padding: "12px 16px",
            background: confirmed ? T.greenL : T.ink,
            color: confirmed ? T.green : T.canvas,
            fontFamily: SANS, fontSize: "14px", fontWeight: 500,
            borderRadius: "2px",
            transition: "all 0.35s ease",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {confirmed ? (
              <>
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                  <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke={T.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Booking confirmed
              </>
            ) : "Confirming booking…"}
          </div>
        </div>
      </div>
    </Shell>
  )
}

function SlotBtn({ slot, busy, active, onClick }: { slot: string; busy: boolean; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={busy}
      onMouseEnter={() => !busy && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "9px 10px",
        border: `1px solid ${active ? T.accent : hover ? T.accent : T.border}`,
        background: active ? T.accent : busy ? T.cardAlt : T.card,
        color: active ? "#fff" : busy ? T.muted : T.ink,
        fontFamily: SANS, fontSize: "13px",
        cursor: busy ? "not-allowed" : "pointer",
        borderRadius: "2px",
        transition: "all 0.14s",
        textDecoration: busy ? "line-through" : "none",
        opacity: busy ? 0.45 : 1,
        letterSpacing: "0.01em",
      }}
    >
      {slot}
    </button>
  )
}

// ─── SCENE 2: Confirmation email ──────────────────────────────────────────────
function Scene2({ onNext }: { onNext: () => void }) {
  const mobile = useIsMobile()
  return (
    <Shell
      step={2}
      narrative="A confirmation is prepared"
      lead="A confirmation email is prepared and queued for delivery to Maya's inbox. This is a fictional illustration of the kind of message a customer might receive."
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", overflow: "hidden",
        maxWidth: "580px", width: "100%",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Chrome bar */}
        <div style={{
          background: T.cardAlt, padding: "10px 16px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {["#E47070","#E4C457","#5EC472"].map(c => (
              <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.6)",
            border: `1px solid ${T.border}`, borderRadius: "2px",
            padding: "4px 12px",
            fontFamily: SANS, fontSize: "11px", color: T.muted,
          }}>
            {mobile ? "Inbox · Nova Mail (fictional)" : "Inbox · Nova Mail — fictional illustration"}
          </div>
        </div>

        {/* Email list + body */}
        <div style={{ display: "flex" }}>
          {/* Sidebar — hidden on mobile */}
          {!mobile && (
            <div style={{ width: "190px", borderRight: `1px solid ${T.border}`, flexShrink: 0 }}>
              <div style={{
                padding: "14px 16px",
                background: T.accentL,
                borderLeft: `3px solid ${T.accent}`,
                animation: "slideIn 0.35s ease 0.2s both",
              }}>
                <div style={{ fontFamily: SANS, fontSize: "12px", fontWeight: 600, color: T.ink, marginBottom: "3px" }}>
                  Appointments
                </div>
                <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Your booking is confirmed
                </div>
                <div style={{ fontFamily: SANS, fontSize: "10px", color: T.accent, marginTop: "4px" }}>
                  Illustrative · Unread
                </div>
              </div>
              {["Newsletter · 2h ago","Team update · Yesterday","Receipt · Mon"].map(e => (
                <div key={e} style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted }}>{e}</div>
                </div>
              ))}
            </div>
          )}

          {/* Email body */}
          <div style={{ flex: 1, padding: mobile ? "20px" : "24px", overflowY: "auto", maxHeight: "440px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted, marginBottom: "4px" }}>
                From: <span style={{ color: T.inkSub }}>Appointments · no-reply@bookings.example</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted, marginBottom: "10px" }}>
                To: <span style={{ color: T.inkSub }}>maya.chen@example.com</span>
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: mobile ? "17px" : "20px", fontWeight: 400, color: T.ink }}>
                Your appointment is confirmed
              </h3>
            </div>

            {/* Email content */}
            <div style={{
              background: T.canvas, border: `1px solid ${T.border}`,
              borderRadius: "2px", padding: mobile ? "18px" : "22px",
            }}>
              <p style={{ fontFamily: SANS, fontSize: "14px", color: T.inkSub, lineHeight: 1.65, marginBottom: "18px" }}>
                Hi Maya,<br /><br />
                Your appointment is confirmed and ready. We look forward to seeing you.
              </p>

              <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: "2px", overflow: "hidden", marginBottom: "18px",
              }}>
                <div style={{
                  padding: "10px 16px", background: T.accentL,
                  borderBottom: `1px solid ${T.border}`,
                }}>
                  <span style={{ fontFamily: SANS, fontSize: "11px", fontWeight: 600, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Booking details
                  </span>
                </div>
                {[
                  ["Service",  APT.service],
                  ["Date",     APT.date],
                  ["Time",     `${APT.time} · ${APT.duration}`],
                  ["With",     APT.staff],
                  ["Reference",APT.ref],
                ].map(([l, v]) => (
                  <div key={l} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "9px 16px", borderBottom: `1px solid ${T.border}`,
                    gap: "12px",
                  }}>
                    <span style={{ fontFamily: SANS, fontSize: "12px", color: T.muted, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontFamily: SANS, fontSize: "12px", color: T.ink, fontWeight: 500, textAlign: "right" as const }}>{v}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: SANS, fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                Need to change or cancel? Reply to this email at any time.<br />
                Reference: <span style={{ fontFamily: "'Courier New', monospace", color: T.ink }}>{APT.ref}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <AutoAdvance duration={5200} onComplete={onNext} />
    </Shell>
  )
}

// ─── SCENE 3: Team calendar ───────────────────────────────────────────────────
function Scene3({ onNext }: { onNext: () => void }) {
  const mobile = useIsMobile()

  // Mobile: simplified vertical list; Desktop: full grid
  const DAYS_FULL = [["Mon","26"],["Tue","27"],["Wed","28"],["Thu","29"],["Fri","30"],["Sat","31"]]
  const DAYS_MOB  = [["Wed","28"],["Thu","29"],["Fri","30"]]
  const DAYS      = mobile ? DAYS_MOB : DAYS_FULL
  const THU_IDX   = mobile ? 1 : 3
  const HOURS     = ["9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm"]

  type OtherMap = Record<string, string>
  const OTHER_FULL: OtherMap = { "0-1":"Booked", "2-3":"Booked", "1-6":"Team call", "4-2":"Booked" }
  const OTHER_MOB:  OtherMap = { "0-1":"Booked", "2-2":"Booked" }
  const OTHER = mobile ? OTHER_MOB : OTHER_FULL

  return (
    <Shell
      step={3}
      narrative="The appointment appears in the calendar"
      lead="The same appointment is shown in the team calendar illustration. Fictional entries from other team members fill out the week."
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", overflow: "hidden",
        maxWidth: mobile ? "100%" : "660px", width: "100%",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Toolbar */}
        <div style={{
          padding: mobile ? "12px 16px" : "14px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: SERIF, fontSize: mobile ? "14px" : "16px", fontWeight: 400, color: T.ink }}>
            August 2024 · Week view
          </span>
          {!mobile && (
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {["Jordan","Sam","All"].map((n, i) => (
                <span key={n} style={{
                  fontFamily: SANS, fontSize: "12px",
                  color: i === 2 ? T.accent : T.muted,
                  fontWeight: i === 2 ? 600 : 400,
                }}>{n}</span>
              ))}
            </div>
          )}
        </div>

        {/* Day headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `44px repeat(${DAYS.length}, 1fr)`,
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div />
          {DAYS.map(([d, n], i) => (
            <div key={d} style={{
              padding: "8px 4px", textAlign: "center",
              borderLeft: `1px solid ${T.border}`,
              background: i === THU_IDX ? T.accentL : "transparent",
            }}>
              <div style={{ fontFamily: SANS, fontSize: "10px", color: i === THU_IDX ? T.accent : T.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</div>
              <div style={{ fontFamily: SANS, fontSize: "16px", fontWeight: i === THU_IDX ? 600 : 400, color: i === THU_IDX ? T.accent : T.ink, marginTop: "1px" }}>{n}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
          {HOURS.map((h, hi) => (
            <div key={h} style={{
              display: "grid",
              gridTemplateColumns: `44px repeat(${DAYS.length}, 1fr)`,
              borderBottom: `1px solid ${T.border}`,
              minHeight: "36px",
            }}>
              <div style={{ padding: "4px 8px 0", fontFamily: SANS, fontSize: "10px", color: T.muted }}>{h}</div>
              {DAYS.map((_, di) => {
                const isAppt   = di === THU_IDX && hi === 5
                const otherKey = `${di}-${hi}`
                const other    = OTHER[otherKey]
                return (
                  <div key={di} style={{
                    borderLeft: `1px solid ${T.border}`,
                    background: di === THU_IDX ? "#FBF8F5" : "transparent",
                    position: "relative", padding: "2px 3px",
                  }}>
                    {isAppt && (
                      <div style={{
                        position: "absolute", inset: "2px 3px",
                        background: T.accent, borderRadius: "2px",
                        padding: "3px 6px",
                        animation: "fadeUp 0.4s ease 0.2s both",
                      }}>
                        <div style={{ fontFamily: SANS, fontSize: "9px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {APT.client}
                        </div>
                        {!mobile && (
                          <div style={{ fontFamily: SANS, fontSize: "8px", color: "rgba(255,255,255,0.72)", whiteSpace: "nowrap" as const }}>
                            {APT.time} · Consultation
                          </div>
                        )}
                      </div>
                    )}
                    {other && !isAppt && (
                      <div style={{
                        position: "absolute", inset: "2px 3px",
                        background: T.cardAlt, borderRadius: "2px",
                        border: `1px solid ${T.border}`, padding: "3px 5px",
                      }}>
                        <div style={{ fontFamily: SANS, fontSize: "8px", color: T.muted }}>{other}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <AutoAdvance duration={4500} onComplete={onNext} />
    </Shell>
  )
}

// ─── SCENE 4: Phone message ───────────────────────────────────────────────────
function Scene4({ onNext }: { onNext: () => void }) {
  const mobile = useIsMobile()
  const [show,  setShow]  = useState(false)
  const [reply, setReply] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true),  550)
    const t2 = setTimeout(() => setReply(true), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <Shell
      step={4}
      narrative="A team member is notified"
      lead="In this illustration, Jordan receives a short fictional message with the booking details — no app login or inbox search needed."
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", maxWidth: "340px", width: "100%",
        overflow: "hidden",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Phone chrome */}
        <div style={{
          background: T.cardAlt, padding: "14px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: T.ink, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: SANS, fontSize: "13px", fontWeight: 600, color: "#fff" }}>J</span>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 600, color: T.ink }}>Jordan</div>
            <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted }}>Team member · fictional</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: SANS, fontSize: "10px", color: T.muted }}>
            Nova Messages
          </div>
        </div>

        {/* Thread */}
        <div style={{
          padding: "20px 18px",
          minHeight: "220px",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <div style={{ textAlign: "center", fontFamily: SANS, fontSize: "10px", color: T.muted }}>Today · Illustration</div>

          <div style={{
            alignSelf: "flex-start", maxWidth: "88%",
            background: T.cardAlt, borderRadius: "3px 12px 12px 12px",
            padding: "11px 14px",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.38s ease, transform 0.38s ease",
          }}>
            <div style={{ fontFamily: SANS, fontSize: "12px", fontWeight: 600, color: T.ink, marginBottom: "8px" }}>
              New booking confirmed
            </div>
            <div style={{ fontFamily: SANS, fontSize: "13px", color: T.inkSub, lineHeight: 1.55 }}>
              <strong style={{ color: T.ink }}>{APT.client}</strong><br />
              {APT.service}<br />
              {APT.shortDate} at {APT.time}<br />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: T.muted }}>{APT.ref}</span>
            </div>
          </div>

          {reply && (
            <div style={{
              alignSelf: "flex-end", maxWidth: "72%",
              background: T.ink, borderRadius: "12px 3px 12px 12px",
              padding: "10px 14px",
              animation: "fadeUp 0.38s ease both",
            }}>
              <span style={{ fontFamily: SANS, fontSize: "13px", color: "#fff" }}>
                Got it, thanks ✓
              </span>
            </div>
          )}
        </div>

        <div style={{
          padding: "10px 16px", borderTop: `1px solid ${T.border}`,
          display: "flex", gap: "8px",
        }}>
          <div style={{
            flex: 1, background: T.cardAlt, borderRadius: "20px",
            padding: "7px 14px", fontFamily: SANS, fontSize: "12px", color: T.muted,
          }}>
            Reply…
          </div>
        </div>
      </div>
      <AutoAdvance duration={5000} onComplete={onNext} />
    </Shell>
  )
}

// ─── SCENE 5: Exception ───────────────────────────────────────────────────────
function Scene5({ onNext }: { onNext: () => void }) {
  const mobile = useIsMobile()
  const [status, setStatus] = useState<"open" | "working" | "resolved" | "cancelled">("open")

  const reassign = () => {
    setStatus("working")
    setTimeout(() => setStatus("resolved"), 1100)
  }

  const cancel = () => {
    setStatus("cancelled")
  }

  if (status === "resolved") {
    return (
      <Shell
        step={5}
        narrative="Exception resolved"
        lead="The conflict is resolved. Sam takes the appointment and is notified. This outcome is part of the fictional illustration."
        mobile={mobile}
      >
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: "4px", maxWidth: "480px", width: "100%",
          padding: "32px",
          boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: T.greenL, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M1.5 6L6 10.5L14.5 1.5" stroke={T.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: "11px", color: T.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Resolved · fictional</div>
              <div style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 400, color: T.ink }}>Reassigned to Sam</div>
            </div>
          </div>
          <p style={{ fontFamily: SANS, fontSize: "14px", color: T.muted, lineHeight: 1.65, marginBottom: "26px" }}>
            {APT.client}{"'"}s booking remains confirmed. Sam has been notified. The exception is marked resolved and logged against {APT.ref}.
          </p>
          <Btn label="See the final record →" onClick={onNext} />
        </div>
      </Shell>
    )
  }

  if (status === "cancelled") {
    return (
      <Shell
        step={5}
        narrative="Appointment cancelled"
        lead="In this fictional illustration, the appointment has been cancelled and Maya would be notified. No real customer data is involved."
        mobile={mobile}
      >
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: "4px", maxWidth: "480px", width: "100%",
          padding: "32px",
          boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#FDEAEA", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="#B03030" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: "11px", color: "#B03030", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Cancelled · fictional</div>
              <div style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 400, color: T.ink }}>Appointment cancelled</div>
            </div>
          </div>
          <p style={{ fontFamily: SANS, fontSize: "14px", color: T.muted, lineHeight: 1.65, marginBottom: "26px" }}>
            In this illustration, Maya{"'"}s appointment has been cancelled and she would receive a notification. The record is updated accordingly and logged against {APT.ref}.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
            <Btn label="See the final record →" onClick={onNext} />
            <Btn label="Try reassign instead" onClick={() => setStatus("open")} variant="ghost" />
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      step={5}
      narrative="An exception is shown for review"
      lead="A scheduling conflict is shown for the owner to review. This is the one moment in the walkthrough that requires a decision."
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", maxWidth: "480px", width: "100%",
        overflow: "hidden",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Alert header */}
        <div style={{
          padding: mobile ? "18px 20px" : "22px 24px",
          borderBottom: `1px solid ${T.border}`,
          background: "#FEF7F3",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: T.accent, flexShrink: 0,
              animation: "pulseDot 1.8s ease infinite",
            }} />
            <span style={{
              fontFamily: SANS, fontSize: "11px", fontWeight: 600,
              color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Owner review · fictional
            </span>
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: mobile ? "19px" : "22px", fontWeight: 400, color: T.ink, marginBottom: "10px" }}>
            Scheduling conflict
          </h3>
          <p style={{ fontFamily: SANS, fontSize: "14px", color: T.inkSub, lineHeight: 1.62 }}>
            Jordan has marked <strong>Thursday 29 August</strong> as leave. {APT.client}{"'"}s {APT.time} booking currently has no assigned team member.
          </p>
        </div>

        {/* Detail row */}
        <div style={{
          padding: mobile ? "14px 20px" : "16px 24px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", gap: mobile ? "16px" : "24px", flexWrap: "wrap" as const,
        }}>
          {[["Booking", APT.ref], ["Client", APT.client], ["Time", APT.time]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: SANS, fontSize: "10px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{l}</div>
              <div style={{ fontFamily: SANS, fontSize: "13px", color: T.ink }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: mobile ? "16px 20px 20px" : "20px 24px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
            Choose an action
          </div>
          <Btn
            label={status === "working" ? "Reassigning to Sam…" : "Reassign to Sam →"}
            onClick={reassign}
            disabled={status === "working"}
            fullWidth
          />
          <Btn label="Cancel and notify Maya" onClick={cancel} variant="ghost" fullWidth />
        </div>
      </div>
    </Shell>
  )
}

// ─── SCENE 6: Final record ────────────────────────────────────────────────────
function Scene6({ onRestart }: { onRestart: () => void }) {
  const mobile = useIsMobile()
  return (
    <Shell
      step={6}
      narrative="Safely recorded and recoverable"
      lead="This fictional record shows every action in the illustrated journey. In a real system, records like this would be findable, auditable, and recoverable."
      mobile={mobile}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "4px", maxWidth: "540px", width: "100%",
        overflow: "hidden",
        boxShadow: "0 2px 18px rgba(28,26,24,0.06)",
      }}>
        {/* Header */}
        <div style={{ padding: mobile ? "20px" : "24px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div>
              <div style={{
                fontFamily: SANS, fontSize: "11px", color: T.muted,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px",
              }}>
                Fictional record · {APT.ref}
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: mobile ? "20px" : "24px", fontWeight: 400, color: T.ink }}>{APT.client}</h3>
              <p style={{ fontFamily: SANS, fontSize: "13px", color: T.muted, marginTop: "3px" }}>{APT.service}</p>
            </div>
            <Tag label="Completed" color="green" />
          </div>
        </div>

        {/* Details grid */}
        <div style={{
          padding: mobile ? "18px 20px" : "20px 24px",
          borderBottom: `1px solid ${T.border}`,
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? "14px" : "18px",
        }}>
          {[
            ["Date",        APT.date],
            ["Time",        APT.time],
            ["Duration",    APT.duration],
            ["Assigned to", APT.newStaff],
            ["Client",      APT.client],
            ["Channel",     "Online booking"],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: SANS, fontSize: "10px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "3px" }}>{l}</div>
              <div style={{ fontFamily: SANS, fontSize: "14px", color: T.ink }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <div style={{ padding: mobile ? "18px 20px" : "20px 24px" }}>
          <div style={{ fontFamily: SANS, fontSize: "10px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
            Illustrated activity log
          </div>
          {[
            ["2:08 pm", "Booking created by Maya Chen",               false],
            ["2:08 pm", "Confirmation prepared for delivery",          false],
            ["2:08 pm", "Shown in team calendar illustration",         false],
            ["2:09 pm", "Jordan notified via illustrated message",     false],
            ["2:11 pm", "Conflict shown for owner review",             false],
            ["2:12 pm", `Reassigned to Sam · resolved by owner`,       true ],
          ].map(([time, event, isLast], i, arr) => (
            <div key={i} style={{ display: "flex", gap: "14px", paddingBottom: i < arr.length - 1 ? "14px" : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "12px" }}>
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", marginTop: "4px",
                  background: isLast ? T.accent : T.border,
                  border: `1.5px solid ${isLast ? T.accent : T.muted}`,
                  flexShrink: 0,
                }} />
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, width: "1px", background: T.border, marginTop: "2px" }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: "13px", color: isLast ? T.ink : T.inkSub, lineHeight: 1.45, fontWeight: isLast ? 500 : 400 }}>
                  {event}
                </div>
                <div style={{ fontFamily: SANS, fontSize: "11px", color: T.muted, marginTop: "2px" }}>{time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing */}
      <div style={{ maxWidth: "540px", width: "100%", paddingTop: "36px" }}>
        <p style={{
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 300,
          fontSize: mobile ? "17px" : "clamp(18px, 2.5vw, 22px)",
          color: T.ink, lineHeight: 1.55, marginBottom: "28px",
        }}>
          That{"'"}s the full illustrated journey — from a customer choosing a time to a safely stored, fully auditable record.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
          <Btn label="← Start over" onClick={onRestart} variant="ghost" />
          <Btn label="Step 1 again →" onClick={onRestart} />
        </div>
      </div>
    </Shell>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [scene,   setScene]   = useState(0)
  const [visible, setVisible] = useState(true)
  const mobile = useIsMobile()

  const goTo = (n: number) => {
    setVisible(false)
    setTimeout(() => {
      setScene(n)
      window.scrollTo({ top: 0 })
      setTimeout(() => setVisible(true), 40)
    }, 240)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: T.canvas,
      color: T.ink,
      fontFamily: SANS,
    }}>
      {scene > 0 && (
        <ProgressBar current={scene} onBack={() => goTo(0)} mobile={mobile} />
      )}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.24s ease, transform 0.24s ease",
      }}>
        {scene === 0 && <Scene0 onStart={() => goTo(1)} />}
        {scene === 1 && <Scene1 onNext={() => goTo(2)} />}
        {scene === 2 && <Scene2 onNext={() => goTo(3)} />}
        {scene === 3 && <Scene3 onNext={() => goTo(4)} />}
        {scene === 4 && <Scene4 onNext={() => goTo(5)} />}
        {scene === 5 && <Scene5 onNext={() => goTo(6)} />}
        {scene === 6 && <Scene6 onRestart={() => goTo(0)} />}
      </div>
    </div>
  )
}
