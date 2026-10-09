"use client";

import { useState, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import Link from 'next/link'
import { getDemoEnquiryHref } from '@/lib/demo-catalog'

// ─── Types ───────────────────────────────────────────────────────────────────

type PatternId = 'recurring' | 'milestone' | 'job'
type Decision = 'approve' | 'hold' | null

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerReducedMotion = () => false

interface PatternData {
  id: PatternId
  label: string
  sublabel: string
  client: string
  workItem: string
  evidenceDate: string
  trigger: string
  approvedAmount: number
  olderRecord: number
  difference: number
  evidenceTypes: [string, string, string]
  email: { from: string; subject: string; message: string }
  scopeDoc: { project: string; milestone: string; agreedAmount: number }
  deliveryRecord: { label: string; status: string; date: string }
  clientRecord: { project: string; billingContact: string; billingPattern: string; confidence: string }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const fmt = (n: number) => '£' + n.toLocaleString('en-GB')

const PATTERNS: Record<PatternId, PatternData> = {
  recurring: {
    id: 'recurring',
    label: 'Recurring service',
    sublabel: 'A regular service period has finished.',
    client: 'Northstar Studio',
    workItem: 'September service period',
    evidenceDate: '11 September 2026',
    trigger: 'September service log completed',
    approvedAmount: 900,
    olderRecord: 850,
    difference: 50,
    evidenceTypes: ['Service log', 'Recurring agreement', 'Completion confirmation'],
    email: {
      from: 'Northstar Studio',
      subject: 'September service period – completed',
      message: 'The September service period has been completed in full and meets the agreed terms. Please proceed with the regular service invoice.',
    },
    scopeDoc: { project: 'Northstar Studio support', milestone: 'September service period', agreedAmount: 900 },
    deliveryRecord: { label: 'September service log', status: 'Completed', date: '11 September 2026' },
    clientRecord: { project: 'Ongoing support agreement', billingContact: 'billing@northstar-example.co.uk', billingPattern: 'Recurring service', confidence: 'Strong match' },
  },
  milestone: {
    id: 'milestone',
    label: 'Project milestone',
    sublabel: 'The client has approved a stage of work.',
    client: 'Alder & Co.',
    workItem: 'Final project milestone',
    evidenceDate: '11 September 2026',
    trigger: 'Final delivery approved',
    approvedAmount: 1850,
    olderRecord: 1650,
    difference: 200,
    evidenceTypes: ['Client approval', 'Agreed project scope', 'Final delivery record'],
    email: {
      from: 'Alder & Co.',
      subject: 'Final delivery approved',
      message: 'Everything in the final delivery has been reviewed and approved. Please proceed with the agreed final milestone.',
    },
    scopeDoc: { project: 'Alder & Co. digital project', milestone: 'Final delivery', agreedAmount: 1850 },
    deliveryRecord: { label: 'Final project files', status: 'Completed', date: '11 September 2026' },
    clientRecord: { project: 'Digital delivery project', billingContact: 'accounts@alder-example.co.uk', billingPattern: 'Project milestone', confidence: 'Strong match' },
  },
  job: {
    id: 'job',
    label: 'Completed job',
    sublabel: 'The job has been marked complete.',
    client: 'Riverside Property Care',
    workItem: 'Completed installation',
    evidenceDate: '11 September 2026',
    trigger: 'Installation signed off',
    approvedAmount: 1250,
    olderRecord: 1200,
    difference: 50,
    evidenceTypes: ['Signed job sheet', 'Completion photographs', 'Original quotation'],
    email: {
      from: 'Riverside Property Care',
      subject: 'Installation sign-off confirmed',
      message: 'The installation has been completed and signed off on site. Please proceed with the agreed quotation amount.',
    },
    scopeDoc: { project: 'Riverside Property Care', milestone: 'Completed installation', agreedAmount: 1250 },
    deliveryRecord: { label: 'Signed job sheet', status: 'Completed', date: '11 September 2026' },
    clientRecord: { project: 'Property installation project', billingContact: 'office@riverside-example.co.uk', billingPattern: 'Completed job', confidence: 'Strong match' },
  },
}

const STAGE_LABELS = ['Recognise', 'Evidence', 'Gather', 'Match', 'Review', 'Ready']

// ─── Shared UI ───────────────────────────────────────────────────────────────

function Disclosure({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs tracking-wide ${className}`}
      style={{ color: '#9B9189' }}
      role="note"
      aria-label="This is a fictional demonstration. Nothing is sent or changed."
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#9B9189' }} aria-hidden="true" />
      Fictional demonstration. Nothing is sent or changed.
    </span>
  )
}

function Btn({
  onClick, children, variant = 'primary', fullWidth = false, disabled = false,
}: {
  onClick: () => void; children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'gold'
  fullWidth?: boolean; disabled?: boolean
}) {
  const base = `inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none px-5 py-[11px] rounded-[9px] ${fullWidth ? 'w-full' : ''}`
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#1C1A18', color: '#EDF1F3', transition: 'background-color 0.18s ease' },
    secondary: { backgroundColor: 'transparent', color: '#1C1A18', border: '1px solid #E5E0D8', transition: 'background-color 0.18s ease, border-color 0.18s ease' },
    ghost: { backgroundColor: 'transparent', color: '#9B9189', transition: 'color 0.18s ease' },
    gold: { backgroundColor: '#C7A76C', color: '#1C1A18', transition: 'background-color 0.18s ease' },
  }
  const hovers: Record<string, Partial<React.CSSProperties>> = {
    primary: { backgroundColor: '#2E2C2A' },
    secondary: { backgroundColor: '#EDE8E2', borderColor: '#CCC7BE' },
    ghost: { color: '#1C1A18' },
    gold: { backgroundColor: '#D4B87C' },
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={base}
      style={styles[variant]}
      onMouseEnter={e => { if (!disabled) Object.assign((e.currentTarget as HTMLButtonElement).style, hovers[variant]) }}
      onMouseLeave={e => { if (!disabled) Object.assign((e.currentTarget as HTMLButtonElement).style, styles[variant]) }}
    >
      {children}
    </button>
  )
}

function StatusTag({ status }: { status: 'paid' | 'awaiting' | 'completed' | 'ready' | 'attention' }) {
  const cfgs: Record<string, { label: string; bg: string; color: string; symbol: string }> = {
    paid: { label: 'Paid', bg: 'rgba(59,122,85,0.12)', color: '#3B7A55', symbol: '✓' },
    awaiting: { label: 'Awaiting payment', bg: 'rgba(199,167,108,0.18)', color: '#7A5F28', symbol: '○' },
    completed: { label: 'Completed — not invoiced', bg: 'rgba(196,98,45,0.1)', color: '#C4622D', symbol: '●' },
    ready: { label: 'Ready for review', bg: 'rgba(59,122,85,0.12)', color: '#3B7A55', symbol: '✓' },
    attention: { label: 'Needs attention', bg: 'rgba(196,98,45,0.1)', color: '#C4622D', symbol: '!' },
  }
  const { label, bg, color, symbol } = cfgs[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
      aria-label={label}
    >
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  )
}

function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.18em] uppercase font-semibold mb-4" style={{ color: '#9B9189' }}>
      {children}
    </p>
  )
}

function StageWrap({ children }: { children: ReactNode }) {
  return (
    <section style={{ backgroundColor: '#F7F4EF', minHeight: '60vh' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-16" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        {children}
      </div>
    </section>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────
// Minimal header — real Motus navigation will be inherited on the live site.

function Nav() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#0D1012', borderBottom: '1px solid rgba(237,241,243,0.07)' }}
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-16 h-14 flex items-center justify-between">
        <Link
          id="ledger-desk-home-link"
          href="/"
          className="text-[13px] font-semibold tracking-[0.13em] uppercase"
          style={{ color: '#EDF1F3', textDecoration: 'none' }}
        >
          Motus
        </Link>
        <a
          id="ledger-desk-back-to-portfolio"
          href="/demos"
          className="text-[12px] tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C] rounded-sm"
          style={{ color: '#9B9189', borderBottom: '1px solid transparent', transition: 'color 0.15s ease, border-color 0.15s ease', textDecoration: 'none' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color = '#C7A76C'
            el.style.borderBottomColor = '#C7A76C'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color = '#9B9189'
            el.style.borderBottomColor = 'transparent'
          }}
          aria-label="Back to Motus portfolio"
        >
          ← Back to portfolio
        </a>
      </div>
    </header>
  )
}

// ─── Opening Section ─────────────────────────────────────────────────────────

function PatternRow({ label, sublabel, selected, onSelect }: {
  label: string; sublabel: string; selected: boolean; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C] rounded-[10px]"
      style={{
        padding: '14px 18px',
        borderRadius: '10px',
        border: selected ? '1px solid rgba(199,167,108,0.6)' : '1px solid #E5E0D8',
        backgroundColor: selected ? 'rgba(199,167,108,0.06)' : '#FDFBF8',
        transition: 'border-color 0.18s ease, background-color 0.18s ease',
        minHeight: '56px',
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(199,167,108,0.35)'
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E0D8'
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm mb-0.5" style={{ color: '#1C1A18', fontWeight: selected ? 600 : 500 }}>
            {label}
          </p>
          <p className="text-xs" style={{ color: '#9B9189' }}>{sublabel}</p>
        </div>
        <div
          className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
          style={{ borderColor: selected ? '#C7A76C' : '#D5D0C8', transition: 'border-color 0.18s ease' }}
          aria-hidden="true"
        >
          {selected && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C7A76C' }} />}
        </div>
      </div>
    </button>
  )
}

function OpeningSection({ pattern, onSelectPattern }: {
  pattern: PatternId; onSelectPattern: (p: PatternId) => void
}) {
  return (
    <section style={{ backgroundColor: '#F7F4EF', borderBottom: '1px solid #E5E0D8' }}>
      <div
        className="max-w-[1240px] mx-auto px-5 md:px-16"
        style={{ paddingTop: '56px', paddingBottom: '56px' }}
      >
        <div className="grid md:grid-cols-[1fr_1px_1fr] gap-10 md:gap-0 items-start">
          {/* Left: heading, copy, disclosure */}
          <div className="md:pr-16">
            <EyebrowLabel>Interactive System Preview</EyebrowLabel>
            <h1
              className="mb-5 leading-[1.13]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: 'clamp(30px, 3.8vw, 46px)',
                letterSpacing: '-0.025em',
                color: '#1C1A18',
              }}
            >
              What tells you it is time to invoice?
            </h1>
            <p
              className="text-[15px] leading-relaxed mb-8"
              style={{ color: '#4A4744', maxWidth: '380px' }}
            >
              Choose how your business charges, then follow one piece of completed work as it becomes ready for invoice review.
            </p>
            <div className="flex flex-col gap-2">
              <Disclosure />
              <p className="text-xs leading-relaxed" style={{ color: '#9B9189', maxWidth: '320px' }}>
                One example of a system Motus can tailor around the way your business already works.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block self-stretch"
            style={{ backgroundColor: '#E5E0D8', width: '1px' }}
            aria-hidden="true"
          />

          {/* Right: pattern selector */}
          <div className="md:pl-16">
            <EyebrowLabel>How do you bill for completed work?</EyebrowLabel>
            <div className="flex flex-col gap-3" role="group" aria-label="Choose a billing pattern">
              {(Object.values(PATTERNS) as PatternData[]).map(p => (
                <PatternRow
                  key={p.id}
                  label={p.label}
                  sublabel={p.sublabel}
                  selected={pattern === p.id}
                  onSelect={() => onSelectPattern(p.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Work Strip ───────────────────────────────────────────────────────────────
// Shown only when the visitor has not yet started following an item.

function WorkStrip({ data, onFollow }: { data: PatternData; onFollow: () => void }) {
  return (
    <section style={{ backgroundColor: '#F7F4EF', borderBottom: '1px solid #E5E0D8' }}>
      <div
        className="max-w-[1240px] mx-auto px-5 md:px-16"
        style={{ paddingTop: '40px', paddingBottom: '40px' }}
      >
        <EyebrowLabel>Current work</EyebrowLabel>
        <div className="flex flex-col gap-3 max-w-2xl">
          {[
            { label: 'Oak & Reed — August support', status: 'paid' as const },
            { label: 'Kite House — Website deposit', status: 'awaiting' as const },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-4 px-5 rounded-xl"
              style={{ border: '1px solid #E5E0D8', backgroundColor: '#FDFBF8' }}
            >
              <p className="text-sm font-medium truncate" style={{ color: '#1C1A18' }}>{item.label}</p>
              <StatusTag status={item.status} />
            </div>
          ))}

          {/* Subject item — the one the visitor follows */}
          <div
            className="flex items-center justify-between gap-4 py-4 px-5 rounded-xl"
            style={{
              border: '1px solid rgba(199,167,108,0.5)',
              backgroundColor: 'rgba(199,167,108,0.04)',
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1.5 truncate" style={{ color: '#1C1A18' }}>
                {data.client} — {data.workItem}
              </p>
              <StatusTag status="completed" />
            </div>
            <Btn onClick={onFollow}>Follow this item</Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Progress Bar (with compact context row) ─────────────────────────────────

function ProgressBar({ stage, data, decision }: { stage: number; data: PatternData; decision: Decision }) {
  return (
    <div
      className="sticky z-40"
      style={{ top: '56px', backgroundColor: '#EDE9E3', borderBottom: '1px solid #D8D3CB' }}
      role="navigation"
      aria-label="Stage progress"
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-16 py-3">

        {/* Desktop progress steps */}
        <div className="hidden md:flex items-center gap-1 mb-2" aria-hidden="true">
          {STAGE_LABELS.map((label, i) => {
            const n = i + 1
            const active = n === stage
            const done = n < stage
            return (
              <div key={n} className="flex items-center">
                <div className="flex items-center gap-2 px-2 py-1">
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: done ? '#3B7A55' : active ? '#1C1A18' : 'transparent',
                      border: done || active ? 'none' : '1px solid #C5C0B8',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold leading-none"
                      style={{ color: done || active ? '#F7F4EF' : '#9B9189' }}
                    >
                      {done ? '✓' : `${n}`}
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-medium tracking-wide"
                    style={{
                      color: active ? '#1C1A18' : done ? '#6B6560' : '#B5B0A8',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < 5 && (
                  <div
                    className="w-6 h-px mx-0.5"
                    style={{ backgroundColor: done ? '#3B7A55' : '#D0CBC3', transition: 'background-color 0.3s ease' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile progress indicator */}
        <div className="flex md:hidden items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1C1A18' }}
              aria-hidden="true"
            >
              <span className="text-[11px] font-semibold" style={{ color: '#F7F4EF' }}>{stage}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-none mb-0.5" style={{ color: '#1C1A18' }}>
                {STAGE_LABELS[stage - 1]}
              </p>
              <p className="text-[11px]" style={{ color: '#9B9189' }}>Stage {stage} of 6</p>
            </div>
          </div>
          <div className="flex items-center gap-1" aria-hidden="true">
            {STAGE_LABELS.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full"
                style={{
                  width: i + 1 === stage ? '18px' : '6px',
                  backgroundColor: i + 1 < stage ? '#3B7A55' : i + 1 === stage ? '#1C1A18' : '#D0CBC3',
                  transition: 'background-color 0.3s ease, width 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Compact context row — replaces the full work strip above the stages */}
        <div
          className="flex items-center gap-2 flex-wrap pt-2"
          style={{ borderTop: '1px solid #D8D3CB' }}
        >
          <span className="text-[11px] font-medium" style={{ color: '#9B9189' }}>Following</span>
          <span className="text-[11px] font-semibold" style={{ color: '#1C1A18' }}>
            {data.client} — {data.workItem}
          </span>
          <StatusTag status={stage === 6 ? (decision === 'approve' ? 'ready' : 'attention') : 'completed'} />
        </div>

      </div>
    </div>
  )
}

// ─── Draft Document (shared) ──────────────────────────────────────────────────

function DraftDocument({ data, highlight = [] }: { data: PatternData; highlight?: string[] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #E5E0D8', boxShadow: '0 4px 20px rgba(28,26,24,0.07)' }}
    >
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#1C1A18' }}>
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
          Draft for review
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#6B6560' }}>DEMO-DRAFT-01</span>
      </div>
      <div className="px-5 py-5" style={{ backgroundColor: '#FDFBF8' }}>
        <div className="flex flex-col gap-1">
          {[
            { key: 'client', label: 'Client', value: data.client },
            { key: 'description', label: 'Description', value: data.workItem },
            { key: 'date', label: 'Completion date', value: data.evidenceDate },
            { key: 'amount', label: 'Approved amount', value: fmt(data.approvedAmount) },
          ].map(field => {
            const hl = highlight.includes(field.key)
            return (
              <div
                key={field.key}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: hl ? 'rgba(199,167,108,0.09)' : 'transparent',
                  borderLeft: `2px solid ${hl ? '#C7A76C' : 'transparent'}`,
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                }}
              >
                <span className="text-[11px] w-28 flex-shrink-0" style={{ color: '#9B9189' }}>{field.label}</span>
                <span className="text-sm font-medium" style={{ color: '#1C1A18' }}>{field.value}</span>
              </div>
            )
          })}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1" style={{ backgroundColor: 'rgba(196,98,45,0.05)' }}>
            <span className="text-[11px] w-28 flex-shrink-0" style={{ color: '#9B9189' }}>Status</span>
            <span className="text-[11px] font-medium" style={{ color: '#C4622D' }}>Details gathered — not sent</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stage 1 — Recognise ─────────────────────────────────────────────────────

function Stage1({ data, onAdvance }: { data: PatternData; onAdvance: () => void }) {
  return (
    <StageWrap>
      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 01 — Recognise the trigger</EyebrowLabel>
        <p className="text-[15px] leading-relaxed" style={{ color: '#4A4744' }}>
          Here is why this item has entered the billing handoff.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
        {/* Work record card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #E5E0D8', boxShadow: '0 6px 28px rgba(28,26,24,0.08)' }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ backgroundColor: '#1C1A18' }}
          >
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
              Project record
            </span>
            <span
              className="text-[10px] tracking-wide uppercase font-semibold px-2.5 py-1 rounded-full"
              style={{ color: '#C4622D', backgroundColor: 'rgba(196,98,45,0.14)' }}
            >
              Not invoiced
            </span>
          </div>
          <div className="px-6 py-6" style={{ backgroundColor: '#FDFBF8' }}>
            <h2
              className="mb-1"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: '24px',
                letterSpacing: '-0.015em',
                color: '#1C1A18',
              }}
            >
              {data.client}
            </h2>
            <p className="text-[15px] mb-6" style={{ color: '#4A4744' }}>{data.workItem}</p>
            <div
              className="flex flex-col gap-3 pb-5 mb-5"
              style={{ borderBottom: '1px solid #EDE8E2' }}
            >
              {[
                { label: 'Completed', value: data.evidenceDate },
                { label: 'Trigger', value: data.trigger },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="text-[11px] w-24 flex-shrink-0 pt-0.5" style={{ color: '#9B9189' }}>{row.label}</span>
                  <span className="text-sm font-medium" style={{ color: '#1C1A18' }}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <span className="text-[11px] w-24 flex-shrink-0 pt-0.5" style={{ color: '#9B9189' }}>Status</span>
                <StatusTag status="completed" />
              </div>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(59,122,85,0.09)', border: '1px solid rgba(59,122,85,0.22)' }}
            >
              <span style={{ color: '#3B7A55', fontSize: '12px' }} aria-hidden="true">✓</span>
              <span className="text-[11px] font-semibold" style={{ color: '#3B7A55' }}>Approval received</span>
            </div>
          </div>
        </div>

        {/* Right explanation */}
        <div>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: '#4A4744' }}>
            The work is complete and the client has approved it. It has not yet been invoiced.
          </p>
          <p
            className="text-sm leading-relaxed pb-6 mb-6"
            style={{ color: '#9B9189', borderBottom: '1px solid #E5E0D8' }}
          >
            Ledger Desk recognised this item because it carries a completion record and an approval, but no billing action has been taken.
          </p>
          <Btn onClick={onAdvance}>View what finished</Btn>
        </div>
      </div>
    </StageWrap>
  )
}

// ─── Stage 2 — Evidence ──────────────────────────────────────────────────────

function EvidenceCard({ icon, type, children }: { icon: string; type: string; children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: '#FDFBF8', border: '1px solid #E5E0D8', boxShadow: '0 2px 12px rgba(28,26,24,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
          style={{ backgroundColor: 'rgba(199,167,108,0.14)', color: '#C7A76C' }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <span className="text-[10px] tracking-[0.16em] uppercase font-semibold" style={{ color: '#9B9189' }}>
          {type}
        </span>
      </div>
      {children}
    </div>
  )
}

function Stage2({ data, onAdvance }: { data: PatternData; onAdvance: () => void }) {
  return (
    <StageWrap>
      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 02 — See what finished</EyebrowLabel>
        <p className="text-[15px] leading-relaxed" style={{ color: '#4A4744' }}>
          Ledger Desk brings the evidence behind the completed work into one reviewable place.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <EvidenceCard icon="✉" type={data.evidenceTypes[0]}>
          <div className="flex flex-col gap-1.5 mb-3">
            {[
              { label: 'From', value: data.email.from },
              { label: 'Re', value: data.email.subject },
              { label: 'Date', value: data.evidenceDate },
            ].map(row => (
              <div key={row.label} className="flex gap-2">
                <span className="text-[11px] w-8 flex-shrink-0 pt-0.5" style={{ color: '#9B9189' }}>{row.label}</span>
                <span className="text-[11px] font-medium" style={{ color: '#1C1A18' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed pt-3" style={{ color: '#4A4744', borderTop: '1px solid #EDE8E2' }}>
            {data.email.message}
          </p>
        </EvidenceCard>

        <EvidenceCard icon="◻" type={data.evidenceTypes[1]}>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Project', value: data.scopeDoc.project },
              { label: 'Milestone', value: data.scopeDoc.milestone },
            ].map(row => (
              <div key={row.label}>
                <p className="text-[10px] mb-0.5" style={{ color: '#9B9189' }}>{row.label}</p>
                <p className="text-xs font-medium" style={{ color: '#1C1A18' }}>{row.value}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] mb-1" style={{ color: '#9B9189' }}>Agreed amount</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: '20px', color: '#1C1A18' }}>
                {fmt(data.scopeDoc.agreedAmount)}
              </p>
            </div>
            <span
              className="text-[10px] tracking-wide px-2.5 py-1 rounded-full font-semibold inline-block w-fit"
              style={{ backgroundColor: 'rgba(59,122,85,0.12)', color: '#3B7A55' }}
            >
              Approved
            </span>
          </div>
        </EvidenceCard>

        <EvidenceCard icon="◈" type={data.evidenceTypes[2]}>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Delivery', value: data.deliveryRecord.label },
              { label: 'Status', value: `✓ ${data.deliveryRecord.status}`, color: '#3B7A55' as const },
              { label: 'Completed', value: data.deliveryRecord.date },
            ].map(row => (
              <div key={row.label}>
                <p className="text-[10px] mb-0.5" style={{ color: '#9B9189' }}>{row.label}</p>
                <p className="text-xs font-medium" style={{ color: (row as { color?: string }).color ?? '#1C1A18' }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </EvidenceCard>
      </div>

      <Btn onClick={onAdvance}>Bring the details together</Btn>
    </StageWrap>
  )
}

// ─── Stage 3 — Gather (field-mapping animation) ───────────────────────────────
// Evidence source cards on the left; draft document builds field-by-field on the right.
// Highlights source and destination simultaneously to show the mapping clearly.

function EvidenceSourceCard({
  icon, type, active, children,
}: {
  icon: string; type: string; active: boolean; children: ReactNode
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: '#FDFBF8',
        border: active ? '1px solid rgba(199,167,108,0.55)' : '1px solid #E5E0D8',
        boxShadow: active ? '0 0 0 3px rgba(199,167,108,0.08)' : '0 2px 8px rgba(28,26,24,0.04)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
          style={{
            backgroundColor: active ? 'rgba(199,167,108,0.22)' : 'rgba(199,167,108,0.12)',
            color: '#C7A76C',
            transition: 'background-color 0.2s ease',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <span
          className="text-[10px] tracking-[0.16em] uppercase font-semibold"
          style={{ color: active ? '#B8944E' : '#9B9189', transition: 'color 0.2s ease' }}
        >
          {type}
        </span>
      </div>
      {children}
    </div>
  )
}

function Stage3({ data, onAdvance, reducedMotion }: {
  data: PatternData; onAdvance: () => void; reducedMotion: boolean
}) {
  // step 0 = waiting, 1-4 = each field populates, 5 = all done
  const [step, setStep] = useState(0)
  const [showButton, setShowButton] = useState(false)
  // Announce completion to assistive technology
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const start = reducedMotion ? 120 : 620
    const gap = reducedMotion ? 200 : 420

    const t1 = setTimeout(() => { setStep(1); setAnnouncement(`Client field: ${data.client}`) }, start)
    const t2 = setTimeout(() => { setStep(2); setAnnouncement(`Description: ${data.workItem}`) }, start + gap)
    const t3 = setTimeout(() => { setStep(3); setAnnouncement(`Completion date: ${data.evidenceDate}`) }, start + gap * 2)
    const t4 = setTimeout(() => { setStep(4); setAnnouncement(`Approved amount: ${fmt(data.approvedAmount)}`) }, start + gap * 3)
    const tb = setTimeout(() => {
      setShowButton(true)
      setAnnouncement('Draft document complete. All four fields populated. Check the client record button is now available.')
    }, start + gap * 4 + 160)

    return () => { [t1, t2, t3, t4, tb].forEach(clearTimeout) }
  }, [data.client, data.workItem, data.evidenceDate, data.approvedAmount, reducedMotion])

  // Which evidence card is the current active source
  const card0Active = step === 1
  const card1Active = step === 2 || step === 4
  const card2Active = step === 3

  // Draft fields — each knows which step populates it
  const draftFields = [
    { key: 'client',      label: 'Client',           value: data.client,              populatedAt: 1 },
    { key: 'description', label: 'Description',       value: data.workItem,            populatedAt: 2 },
    { key: 'date',        label: 'Completion date',   value: data.evidenceDate,        populatedAt: 3 },
    { key: 'amount',      label: 'Approved amount',   value: fmt(data.approvedAmount), populatedAt: 4 },
  ]

  // Inline highlight style for source text tokens
  const hl = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? 'rgba(199,167,108,0.24)' : 'transparent',
    borderRadius: '3px',
    padding: '0 2px',
    transition: 'background-color 0.2s ease',
  })

  return (
    <StageWrap>
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="max-w-xl mb-8">
        <EyebrowLabel>Stage 03 — Bring the details together</EyebrowLabel>
        <p className="text-[15px] leading-relaxed" style={{ color: '#4A4744' }}>
          {step < 4
            ? 'Each piece of evidence is being matched to the corresponding field in the draft.'
            : "The completed work has been organised into a draft. It still needs to be checked against the client’s billing record."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

        {/* ── LEFT: Evidence sources ── */}
        <div className="flex flex-col gap-3">

          {/* Card 0: email / approval → maps client name */}
          <EvidenceSourceCard icon="✉" type={data.evidenceTypes[0]} active={card0Active}>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 items-baseline">
                <span className="text-[11px] w-9 flex-shrink-0" style={{ color: '#9B9189' }}>From</span>
                <span className="text-[11px] font-medium" style={{ color: '#1C1A18', ...hl(step === 1) }}>
                  {data.client}
                </span>
                {step === 1 && (
                  <span className="text-[11px] ml-1 font-medium" style={{ color: '#C7A76C' }} aria-hidden="true">→</span>
                )}
              </div>
              <div className="flex gap-2">
                <span className="text-[11px] w-9 flex-shrink-0" style={{ color: '#9B9189' }}>Re</span>
                <span className="text-[11px]" style={{ color: '#4A4744' }}>{data.email.subject}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[11px] w-9 flex-shrink-0" style={{ color: '#9B9189' }}>Date</span>
                <span className="text-[11px]" style={{ color: '#4A4744' }}>{data.evidenceDate}</span>
              </div>
            </div>
          </EvidenceSourceCard>

          {/* Card 1: scope → maps description (step 2) and amount (step 4) */}
          <EvidenceSourceCard icon="◻" type={data.evidenceTypes[1]} active={card1Active}>
            <div className="flex flex-col gap-2.5">
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#9B9189' }}>Milestone</p>
                <span className="text-xs font-medium" style={{ color: '#1C1A18', ...hl(step === 2) }}>
                  {data.workItem}
                </span>
                {step === 2 && (
                  <span className="text-[11px] ml-1 font-medium" style={{ color: '#C7A76C' }} aria-hidden="true">→</span>
                )}
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#9B9189' }}>Agreed amount</p>
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 400,
                    fontSize: '18px',
                    color: '#1C1A18',
                    ...hl(step === 4),
                  }}
                >
                  {fmt(data.approvedAmount)}
                </span>
                {step === 4 && (
                  <span className="text-[11px] ml-1 font-medium" style={{ color: '#C7A76C' }} aria-hidden="true">→</span>
                )}
              </div>
              <span
                className="text-[10px] px-2.5 py-1 rounded-full font-semibold w-fit"
                style={{ backgroundColor: 'rgba(59,122,85,0.12)', color: '#3B7A55' }}
              >
                Approved
              </span>
            </div>
          </EvidenceSourceCard>

          {/* Card 2: delivery record → maps date (step 3) */}
          <EvidenceSourceCard icon="◈" type={data.evidenceTypes[2]} active={card2Active}>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#9B9189' }}>Delivery</p>
                <p className="text-xs font-medium" style={{ color: '#1C1A18' }}>{data.deliveryRecord.label}</p>
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#9B9189' }}>Completion date</p>
                <span className="text-xs font-medium" style={{ color: '#1C1A18', ...hl(step === 3) }}>
                  {data.evidenceDate}
                </span>
                {step === 3 && (
                  <span className="text-[11px] ml-1 font-medium" style={{ color: '#C7A76C' }} aria-hidden="true">→</span>
                )}
              </div>
              <p className="text-xs font-medium" style={{ color: '#3B7A55' }}>
                ✓ {data.deliveryRecord.status}
              </p>
            </div>
          </EvidenceSourceCard>
        </div>

        {/* ── RIGHT: Draft document building ── */}
        <div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #E5E0D8', boxShadow: '0 4px 20px rgba(28,26,24,0.07)' }}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ backgroundColor: '#1C1A18' }}
            >
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
                {step >= 4 ? 'Draft for review' : 'Draft — receiving details'}
              </span>
              <span className="text-[10px] font-mono" style={{ color: '#6B6560' }}>DEMO-DRAFT-01</span>
            </div>

            <div className="px-5 py-5" style={{ backgroundColor: '#FDFBF8' }}>
              <div className="flex flex-col gap-1">
                {draftFields.map(field => {
                  const populated = step >= field.populatedAt
                  const justArrived = step === field.populatedAt
                  return (
                    <div
                      key={field.key}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                      style={{
                        backgroundColor: justArrived
                          ? 'rgba(199,167,108,0.14)'
                          : populated
                          ? 'rgba(199,167,108,0.05)'
                          : 'transparent',
                        borderLeft: `2px solid ${populated ? '#C7A76C' : '#E5E0D8'}`,
                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      }}
                    >
                      <span className="text-[11px] w-28 flex-shrink-0" style={{ color: '#9B9189' }}>
                        {field.label}
                      </span>

                      {populated ? (
                        /* Value slides in from the left when it first appears */
                        <span
                          key={`${field.key}-${data.id}-${field.populatedAt}`}
                          className={reducedMotion ? '' : 'field-value-appear'}
                          style={{ color: '#1C1A18', fontSize: '13px', fontWeight: 500 }}
                        >
                          {field.value}
                        </span>
                      ) : (
                        <span style={{ color: '#C5C0B8', fontSize: '12px', fontStyle: 'italic' }}>—</span>
                      )}
                    </div>
                  )
                })}

                {/* Status field — appears once all four fields are populated */}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
                  style={{
                    backgroundColor: 'rgba(196,98,45,0.05)',
                    opacity: step >= 4 ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                  aria-hidden={step < 4}
                >
                  <span className="text-[11px] w-28 flex-shrink-0" style={{ color: '#9B9189' }}>Status</span>
                  <span className="text-[11px] font-medium" style={{ color: '#C4622D' }}>
                    Details gathered — not sent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advance button appears after the draft is complete */}
          <div
            className="mt-5"
            style={{
              opacity: showButton ? 1 : 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: showButton ? 'auto' : 'none',
            }}
          >
            <Btn onClick={onAdvance} disabled={!showButton}>Check the client record</Btn>
          </div>
        </div>
      </div>
    </StageWrap>
  )
}

// ─── Stage 4 — Match ─────────────────────────────────────────────────────────

function Stage4({ data, onAdvance }: { data: PatternData; onAdvance: () => void }) {
  return (
    <StageWrap>
      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 04 — Match the record</EyebrowLabel>
        <p className="text-[15px] leading-relaxed" style={{ color: '#4A4744' }}>
          The draft has been connected to a suggested client and project record. The client name, project reference and approved milestone all point to the same record.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-3" style={{ color: '#9B9189' }}>Draft</p>
          <DraftDocument data={data} highlight={['client', 'description', 'amount']} />
        </div>

        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-3" style={{ color: '#9B9189' }}>
            Suggested client record
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #E5E0D8', boxShadow: '0 4px 20px rgba(28,26,24,0.07)' }}
          >
            <div className="px-5 py-3" style={{ backgroundColor: '#1C1A18' }}>
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
                Client record
              </span>
            </div>
            <div className="px-5 py-5" style={{ backgroundColor: '#FDFBF8' }}>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Client', value: data.client, hl: true },
                  { label: 'Project', value: data.clientRecord.project, hl: false },
                  { label: 'Billing contact', value: data.clientRecord.billingContact, hl: false },
                  { label: 'Billing pattern', value: data.clientRecord.billingPattern, hl: true },
                ].map(f => (
                  <div
                    key={f.label}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                    style={{
                      backgroundColor: f.hl ? 'rgba(199,167,108,0.09)' : 'transparent',
                      borderLeft: `2px solid ${f.hl ? '#C7A76C' : 'transparent'}`,
                    }}
                  >
                    <span className="text-[11px] w-28 flex-shrink-0 pt-0.5" style={{ color: '#9B9189' }}>{f.label}</span>
                    <span className="text-[11px] font-medium break-all" style={{ color: '#1C1A18' }}>{f.value}</span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
                  style={{ backgroundColor: 'rgba(59,122,85,0.06)' }}
                >
                  <span className="text-[11px] w-28 flex-shrink-0" style={{ color: '#9B9189' }}>Record match</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#3B7A55' }}>
                    ✓ {data.clientRecord.confidence}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amount discrepancy warning */}
      <div
        className="flex items-start gap-4 p-5 rounded-xl mb-8 max-w-2xl"
        style={{ backgroundColor: 'rgba(196,98,45,0.05)', border: '1px solid rgba(196,98,45,0.18)' }}
        role="alert"
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(196,98,45,0.15)' }}
          aria-hidden="true"
        >
          <span className="text-[11px] font-bold" style={{ color: '#C4622D' }}>!</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#1C1A18' }}>
          One amount does not agree with the older billing record.
        </p>
      </div>

      <Btn onClick={onAdvance}>Review the difference</Btn>
    </StageWrap>
  )
}

// ─── Stage 5 — Review ────────────────────────────────────────────────────────

function Stage5({ data, decision, setDecision, onAdvance }: {
  data: PatternData; decision: Decision; setDecision: (d: Decision) => void; onAdvance: () => void
}) {
  const amtLabel = data.id === 'recurring' ? 'Approved service amount' : data.id === 'job' ? 'Approved job amount' : 'Approved milestone'
  const scopeRef = data.id === 'recurring' ? 'service agreement' : data.id === 'job' ? 'quotation' : 'project scope'
  const decisionLabel = data.id === 'recurring' ? 'service' : data.id === 'job' ? 'job' : 'milestone'

  return (
    <StageWrap>
      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 05 — Surface the exception</EyebrowLabel>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#4A4744' }}>
          This is where Ledger Desk stops. The owner needs to choose which amount should be used.
        </p>
        <Disclosure />
      </div>

      {/* Amount comparison */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8 max-w-3xl">
        {/* Approved */}
        <div
          className="rounded-xl p-5 md:p-6"
          style={{ backgroundColor: '#FDFBF8', border: '1px solid #E5E0D8' }}
        >
          <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-3" style={{ color: '#9B9189' }}>
            {amtLabel}
          </p>
          <p
            className="mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: '36px', color: '#1C1A18', letterSpacing: '-0.02em' }}
          >
            {fmt(data.approvedAmount)}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#9B9189' }}>
            Source: Client approval and agreed {scopeRef}
          </p>
        </div>

        {/* Difference callout */}
        <div className="flex justify-center items-center">
          <div
            className="px-4 py-2.5 rounded-full"
            style={{ backgroundColor: 'rgba(196,98,45,0.09)', border: '1px solid rgba(196,98,45,0.22)' }}
          >
            <p className="text-xs font-semibold tracking-wide text-center whitespace-nowrap" style={{ color: '#C4622D' }}>
              {fmt(data.difference)} difference
            </p>
          </div>
        </div>

        {/* Older record */}
        <div
          className="rounded-xl p-5 md:p-6"
          style={{ backgroundColor: '#FDFBF8', border: '1px solid #E5E0D8', opacity: 0.72 }}
        >
          <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-3" style={{ color: '#9B9189' }}>
            Older billing record
          </p>
          <p
            className="mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: '36px', color: '#9B9189', letterSpacing: '-0.02em' }}
          >
            {fmt(data.olderRecord)}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#9B9189' }}>
            Source: Existing client billing record
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div
        className="rounded-xl p-5 mb-8 max-w-3xl"
        style={{ backgroundColor: 'rgba(196,98,45,0.04)', border: '1px solid rgba(196,98,45,0.14)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#1C1A18' }}>
          The approved amount is{' '}
          <strong style={{ color: '#C4622D' }}>{fmt(data.difference)} higher</strong>{' '}
          than the amount stored in the older billing record. Ledger Desk has paused here because the owner
          needs to choose which amount should be used.
        </p>
      </div>

      {/* Decision */}
      <div>
        <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-4" style={{ color: '#9B9189' }}>
          Your decision
        </p>
        <div className="grid md:grid-cols-2 gap-3 max-w-3xl mb-6" role="group" aria-label="Choose what to do with the amount difference">
          {/* Use approved */}
          <button
            type="button"
            onClick={() => setDecision('approve')}
            aria-pressed={decision === 'approve'}
            className="text-left p-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C]"
            style={{
              border: decision === 'approve' ? '1px solid #1C1A18' : '1px solid #E5E0D8',
              backgroundColor: decision === 'approve' ? '#1C1A18' : '#FDFBF8',
              transition: 'border-color 0.18s ease, background-color 0.18s ease',
              minHeight: '80px',
            }}
            onMouseEnter={e => { if (decision !== 'approve') (e.currentTarget as HTMLButtonElement).style.borderColor = '#9B9189' }}
            onMouseLeave={e => { if (decision !== 'approve') (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E0D8' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={{ borderColor: decision === 'approve' ? '#F7F4EF' : '#D0CBC3', transition: 'border-color 0.18s ease' }}
                aria-hidden="true"
              >
                {decision === 'approve' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F7F4EF' }} />}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: decision === 'approve' ? '#EDF1F3' : '#1C1A18' }}>
                  Use approved {decisionLabel} amount
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: decision === 'approve' ? 'rgba(237,241,243,0.65)' : '#9B9189' }}>
                  Continue with the {fmt(data.approvedAmount)} amount supported by the approval and agreed {scopeRef}.
                </p>
              </div>
            </div>
          </button>

          {/* Hold */}
          <button
            type="button"
            onClick={() => setDecision('hold')}
            aria-pressed={decision === 'hold'}
            className="text-left p-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
            style={{
              border: decision === 'hold' ? '1px solid rgba(196,98,45,0.5)' : '1px solid #E5E0D8',
              backgroundColor: decision === 'hold' ? 'rgba(196,98,45,0.05)' : '#FDFBF8',
              transition: 'border-color 0.18s ease, background-color 0.18s ease',
              minHeight: '80px',
            }}
            onMouseEnter={e => { if (decision !== 'hold') (e.currentTarget as HTMLButtonElement).style.borderColor = '#9B9189' }}
            onMouseLeave={e => { if (decision !== 'hold') (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E0D8' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={{ borderColor: decision === 'hold' ? '#C4622D' : '#D0CBC3', transition: 'border-color 0.18s ease' }}
                aria-hidden="true"
              >
                {decision === 'hold' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C4622D' }} />}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: decision === 'hold' ? '#C4622D' : '#1C1A18' }}>
                  Hold for checking
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: '#9B9189' }}>
                  Keep the draft paused until the older billing record has been checked.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div
          style={{
            opacity: decision ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: decision ? 'auto' : 'none',
          }}
        >
          <Btn onClick={onAdvance} disabled={!decision}>
            {decision === 'approve'
              ? 'Confirm and continue'
              : decision === 'hold'
              ? 'Hold and continue'
              : 'Choose an option above'}
          </Btn>
        </div>
      </div>
    </StageWrap>
  )
}

// ─── Stage 6A — Ready ────────────────────────────────────────────────────────
// Primary outcome: owner chose to use the approved amount.

function Stage6A({ data, onRestart }: { data: PatternData; onRestart: () => void }) {
  const decLabel = data.id === 'recurring' ? 'service' : data.id === 'job' ? 'job' : 'milestone'
  return (
    <StageWrap>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Stage complete. Draft ready for final review. The {fmt(data.approvedAmount)} amount has been confirmed.
      </div>

      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 06 — Return control</EyebrowLabel>
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '-0.02em',
            color: '#1C1A18',
            lineHeight: '1.2',
          }}
        >
          Ready for your final review
        </h2>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#4A4744' }}>
          The draft now uses the approved {fmt(data.approvedAmount)} {decLabel} amount. No invoice has been
          sent and no accounting record has been changed.
        </p>
        <Disclosure />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Confirmed draft */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#3B7A55' }}
              aria-hidden="true"
            >
              <span className="text-[9px] font-bold" style={{ color: '#fff' }}>✓</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: '#3B7A55' }}>Amount confirmed</span>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(59,122,85,0.3)', boxShadow: '0 4px 20px rgba(59,122,85,0.07)' }}
          >
            <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#1C1A18' }}>
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
                Draft for review
              </span>
              <span className="text-[10px] font-mono" style={{ color: '#6B6560' }}>DEMO-DRAFT-01</span>
            </div>
            <div className="px-5 py-5" style={{ backgroundColor: '#FDFBF8' }}>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Client', value: data.client },
                  { label: 'Description', value: data.workItem },
                  { label: 'Amount', value: fmt(data.approvedAmount) },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-[11px] w-24 flex-shrink-0" style={{ color: '#9B9189' }}>{f.label}</span>
                    <span className="text-sm font-medium" style={{ color: '#1C1A18' }}>{f.value}</span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
                  style={{ backgroundColor: 'rgba(59,122,85,0.09)', border: '1px solid rgba(59,122,85,0.18)' }}
                >
                  <span className="text-[11px] w-24 flex-shrink-0" style={{ color: '#9B9189' }}>Status</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#3B7A55' }}>✓ Ready for final review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational strip + what needs me */}
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-3" style={{ color: '#9B9189' }}>
            Current work
          </p>
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid #E5E0D8' }}>
            {[
              { label: 'Oak & Reed — August support', status: 'Paid', fg: '#3B7A55', bg: 'rgba(59,122,85,0.09)', sym: '✓' },
              { label: 'Kite House — Website deposit', status: 'Awaiting payment', fg: '#7A5F28', bg: 'rgba(199,167,108,0.15)', sym: '○' },
              { label: `${data.client} — ${data.workItem}`, status: 'Ready for review', fg: '#3B7A55', bg: 'rgba(59,122,85,0.09)', sym: '✓', highlight: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 gap-3"
                style={{
                  borderBottom: i < 2 ? '1px solid #E5E0D8' : 'none',
                  backgroundColor: item.highlight ? 'rgba(59,122,85,0.025)' : 'transparent',
                }}
              >
                <span className="text-[12px] font-medium truncate" style={{ color: '#1C1A18' }}>{item.label}</span>
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1"
                  style={{ backgroundColor: item.bg, color: item.fg }}
                  aria-label={item.status}
                >
                  <span aria-hidden="true">{item.sym}</span>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-5 mb-6"
            style={{ backgroundColor: 'rgba(199,167,108,0.07)', border: '1px solid rgba(199,167,108,0.22)' }}
          >
            <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-2" style={{ color: '#C7A76C' }}>
              What needs me now?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#1C1A18' }}>
              Review the draft and choose when it should be sent.
            </p>
          </div>

          <Btn onClick={onRestart} variant="secondary">Restart preview</Btn>
        </div>
      </div>
    </StageWrap>
  )
}

// ─── Stage 6B — Hold ─────────────────────────────────────────────────────────
// Hold outcome: owner chose to pause and check the difference.

function Stage6B({ data, onReturn, onRestart }: {
  data: PatternData; onReturn: () => void; onRestart: () => void
}) {
  return (
    <StageWrap>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Draft held for checking. No invoice has been sent and no record has been changed.
      </div>

      <div className="max-w-lg mb-10">
        <EyebrowLabel>Stage 06 — Return control</EyebrowLabel>
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '-0.02em',
            color: '#1C1A18',
            lineHeight: '1.2',
          }}
        >
          Held for checking
        </h2>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#4A4744' }}>
          The draft remains paused while the {fmt(data.difference)} difference is checked. No invoice has
          been sent and no accounting record has been changed.
        </p>
        <Disclosure />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Held draft */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(196,98,45,0.15)' }}
              aria-hidden="true"
            >
              <span className="text-[10px] font-bold" style={{ color: '#C4622D' }}>!</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: '#C4622D' }}>Needs attention</span>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(196,98,45,0.28)', boxShadow: '0 4px 20px rgba(196,98,45,0.05)' }}
          >
            <div className="px-5 py-3" style={{ backgroundColor: '#1C1A18' }}>
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#9B9189' }}>
                Draft — held
              </span>
            </div>
            <div className="px-5 py-5" style={{ backgroundColor: '#FDFBF8' }}>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Client', value: data.client },
                  { label: 'Description', value: data.workItem },
                  { label: 'Approved evidence', value: fmt(data.approvedAmount) },
                  { label: 'Older record', value: fmt(data.olderRecord) },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-[11px] w-32 flex-shrink-0" style={{ color: '#9B9189' }}>{f.label}</span>
                    <span className="text-sm font-medium" style={{ color: '#1C1A18' }}>{f.value}</span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
                  style={{ backgroundColor: 'rgba(196,98,45,0.07)', border: '1px solid rgba(196,98,45,0.18)' }}
                >
                  <span className="text-[11px] w-32 flex-shrink-0" style={{ color: '#9B9189' }}>Status</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#C4622D' }}>Needs attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What needs me now + controls */}
        <div>
          <div
            className="rounded-xl p-5 mb-6"
            style={{ backgroundColor: 'rgba(196,98,45,0.04)', border: '1px solid rgba(196,98,45,0.16)' }}
          >
            <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-2" style={{ color: '#C4622D' }}>
              What needs me now?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#1C1A18' }}>
              Check the older billing record before approving the draft.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Btn onClick={onReturn} variant="secondary">Return to decision</Btn>
            <Btn onClick={onRestart} variant="ghost">Restart preview</Btn>
          </div>
        </div>
      </div>
    </StageWrap>
  )
}

// ─── Closing Section ──────────────────────────────────────────────────────────
// Single primary portfolio CTA — no duplication with Stage 6 controls.

function ClosingSection() {
  return (
    <section style={{ backgroundColor: '#0D1012' }}>
      <div
        className="max-w-[1240px] mx-auto px-5 md:px-16"
        style={{ paddingTop: '80px', paddingBottom: '96px' }}
      >
        <p
          className="text-[11px] tracking-[0.18em] uppercase font-semibold mb-7"
          style={{ color: '#6B6560' }}
        >
          Built around how you already work
        </p>
        <h2
          className="mb-6"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 48px)',
            letterSpacing: '-0.025em',
            color: '#EDF1F3',
            lineHeight: '1.18',
            maxWidth: '520px',
          }}
        >
          This is one example. Yours would fit your business.
        </h2>
        <p
          className="text-[15px] leading-relaxed mb-4 max-w-lg"
          style={{ color: '#9B9189' }}
        >
          Bring finished work and billing details together in a way that fits your business,
          with a chance to check the invoice before it is sent.
        </p>
        <p
          className="text-sm leading-relaxed mb-10 max-w-lg"
          style={{ color: '#514E4A' }}
        >
          This could suit regular services, project stages or individual jobs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <Link
            id="ledger-desk-discuss-workflow"
            href={getDemoEnquiryHref("ledger-desk")}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C] focus-visible:ring-offset-2 px-5 py-[11px] rounded-[9px]"
            style={{ backgroundColor: '#C7A76C', color: '#1C1A18', textDecoration: 'none' }}
          >
            Ask about this for your business
          </Link>
          <a
            id="ledger-desk-return-to-portfolio"
            href="/demos"
            className="inline-flex items-center text-sm font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C] rounded-sm px-5 py-[11px]"
            style={{ color: '#9B9189', transition: 'color 0.18s ease', textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#EDF1F3' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9B9189' }}
            aria-label="Return to Motus portfolio"
          >
            Return to portfolio
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [pattern, setPattern] = useState<PatternId>('milestone')
  const [stage, setStage] = useState(0)
  const [following, setFollowing] = useState(false)
  const [decision, setDecision] = useState<Decision>(null)
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion)
  const stageAreaRef = useRef<HTMLDivElement>(null)

  const data = PATTERNS[pattern]

  // Scroll stage area into view when following begins or stage advances
  useEffect(() => {
    if (!following || !stageAreaRef.current) return
    const offset = 56 + 72 // nav height + progress bar height
    const top = stageAreaRef.current.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [stage, following, reducedMotion])

  const selectPattern = (p: PatternId) => {
    setPattern(p)
    setStage(0)
    setFollowing(false)
    setDecision(null)
  }

  const follow = () => {
    setFollowing(true)
    setStage(1)
  }

  const advance = () => {
    if (stage < 6) setStage(s => s + 1)
  }

  const restart = () => {
    setStage(0)
    setFollowing(false)
    setDecision(null)
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="ledger-desk-demo" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <Nav />
      <OpeningSection pattern={pattern} onSelectPattern={selectPattern} />

      {/* Work strip — only shown before the visitor starts following */}
      {!following && <WorkStrip data={data} onFollow={follow} />}

      {following && (
        <div>
          <ProgressBar stage={stage} data={data} decision={decision} />
          <div ref={stageAreaRef}>
            {/* key forces remount when pattern or stage changes, restarting any entry animations */}
            <div key={`${pattern}-${stage}`}>
              {stage === 1 && <Stage1 data={data} onAdvance={advance} />}
              {stage === 2 && <Stage2 data={data} onAdvance={advance} />}
              {stage === 3 && <Stage3 key={`${pattern}-${reducedMotion}`} data={data} onAdvance={advance} reducedMotion={reducedMotion} />}
              {stage === 4 && <Stage4 data={data} onAdvance={advance} />}
              {stage === 5 && (
                <Stage5
                  data={data}
                  decision={decision}
                  setDecision={setDecision}
                  onAdvance={advance}
                />
              )}
              {stage === 6 && decision === 'approve' && (
                <Stage6A data={data} onRestart={restart} />
              )}
              {stage === 6 && decision === 'hold' && (
                <Stage6B
                  data={data}
                  onReturn={() => { setDecision(null); setStage(5) }}
                  onRestart={restart}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <ClosingSection />
    </div>
  )
}
