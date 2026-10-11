"use client";

import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type CSSProperties, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const finePointerQuery = "(hover: hover) and (pointer: fine)";
function subscribeToPointer(callback: () => void) {
  const query = window.matchMedia(finePointerQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Decorative light only: keeps the native cursor and never intercepts input. */
export function CursorGlow({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const x = useSpring(-400, { stiffness: 220, damping: 32, mass: .4 });
  const y = useSpring(-400, { stiffness: 220, damping: 32, mass: .4 });
  const opacity = useMotionValue(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !finePointer) return;
    let frame = 0;
    let positioned = false;
    let panel: HTMLElement | null = null;
    const clearPanel = () => { panel?.removeAttribute("data-glow-active"); panel = null; };
    const hide = () => { opacity.set(0); clearPanel(); if (frame) cancelAnimationFrame(frame); frame = 0; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!positioned) { x.jump(event.clientX); y.jump(event.clientY); positioned = true; }
      else { x.set(event.clientX); y.set(event.clientY); }
      opacity.set(1);
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = (event.target as HTMLElement).closest<HTMLElement>("[data-motion-panel]");
        if (next !== panel) clearPanel();
        panel = next;
        if (!panel) return;
        const bounds = panel.getBoundingClientRect();
        panel.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
        panel.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
        panel.setAttribute("data-glow-active", "true");
      });
    };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", clearPanel, { passive: true });
    document.addEventListener("keydown", hide);
    document.addEventListener("visibilitychange", hide);
    return () => {
      hide();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", clearPanel);
      document.removeEventListener("keydown", hide);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [rootRef, reduced, finePointer, x, y, opacity]);

  return <motion.div className="cursor-glow" style={{ x, y, opacity }} aria-hidden="true"><span /></motion.div>;
}

/** Stop decorative loops off screen, in background tabs, or for reduced motion. */
export function useAmbientEffects(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => root.setAttribute("data-effects-inactive", String(preference.matches || document.hidden));
    const ambient = root.querySelectorAll<HTMLElement>(".signal-field, .border-light, .hero-showcase");
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.setAttribute("data-visible", String(entry.isIntersecting)));
    });
    ambient.forEach((element) => { element.setAttribute("data-visible", "true"); observer?.observe(element); });
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootRef]);
}

/** A live routing field, behind the existing hero rather than a new section. */
export function SignalField() {
  const routes = [
    "M-80 570 H130 Q180 570 215 530 L365 365 Q400 330 455 330 H590",
    "M1480 590 H1290 Q1240 590 1205 550 L1045 385 Q1010 350 955 350 H810",
    "M-40 160 H145 Q180 160 210 190 L310 290 Q340 320 385 320",
    "M1440 120 H1260 Q1220 120 1190 150 L1100 240 Q1070 270 1025 270",
    "M180 800 V665 Q180 625 220 625 H395",
    "M1220 800 V685 Q1220 645 1180 645 H1005",
  ];
  return <div className="signal-field" aria-hidden="true">
    <div className="signal-atmosphere signal-atmosphere--left" /><div className="signal-atmosphere signal-atmosphere--right" />
    <div className="signal-grid" />
    <svg viewBox="0 0 1400 800" preserveAspectRatio="none" fill="none" focusable="false">
      {routes.map((route, index) => <g key={route} style={{ "--route-delay": `${index * -1.7}s` } as CSSProperties}>
        <path d={route} className="field-track" pathLength="100" />
        <path d={route} className="field-beam" pathLength="100" />
      </g>)}
      {[[145, 160], [210, 190], [365, 365], [180, 665], [1260, 120], [1190, 150], [1045, 385], [1220, 685]].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="3" className="field-node" style={{ animationDelay: `${index * -.6}s` }} />)}
    </svg>
  </div>;
}

export function BorderLight() {
  return <span className="border-light" aria-hidden="true" />;
}

function SignalMark() {
  return <svg className="signal-mark" viewBox="0 0 240 240" fill="none" focusable="false">
    <defs>
      <linearGradient id="motus-metal" x1="25" y1="25" x2="215" y2="215" gradientUnits="userSpaceOnUse"><stop className="metal-stop--bright" /><stop offset=".46" className="metal-stop--mid" /><stop offset="1" className="metal-stop--dark" /></linearGradient>
      <linearGradient id="motus-facet" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse"><stop className="facet-stop--bright" /><stop offset="1" className="facet-stop--dark" /></linearGradient>
    </defs>
    <path className="mark-body" d="M120 4C138 89 151 102 236 120C151 138 138 151 120 236C102 151 89 138 4 120C89 102 102 89 120 4Z" />
    <path className="mark-facet" d="M120 4L120 120L236 120C151 102 138 89 120 4Z" />
    <path className="mark-facet mark-facet--lower" d="M4 120L120 120L120 236C102 151 89 138 4 120Z" />
    <path className="mark-seam" d="M120 4V236M4 120H236" />
  </svg>;
}

/** The same landing page with three reviewable, lightweight art directions. */
export function HeroShowcase({ direction = "type" }: { direction?: "signal" | "flow" | "type" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const x = useSpring(0, { stiffness: 150, damping: 26, mass: .5 });
  const y = useSpring(0, { stiffness: 150, damping: 26, mass: .5 });
  // Transform only the small art layer; avoid inheritable pointer variables.
  const transform = useTransform([x, y], ([horizontal, vertical]) => `perspective(1000px) translate3d(${Number(horizontal) * 9}px, ${Number(vertical) * -5}px, 0) rotateY(${Number(horizontal) * 9}deg) rotateX(${Number(vertical) * -6}deg)`);

  useEffect(() => {
    const element = ref.current;
    const reset = (immediate = false) => { const method = immediate ? "jump" : "set"; x[method](0); y[method](0); };
    if (!element || direction === "type" || reduced || !finePointer) { reset(true); return; }
    let frame = 0;
    const cancel = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const leave = () => { cancel(); reset(); };
    const settle = () => { cancel(); reset(true); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || document.hidden) return;
      cancel();
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = element.getBoundingClientRect();
        x.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
        y.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
      });
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    window.addEventListener("blur", settle);
    document.addEventListener("keydown", settle);
    document.addEventListener("visibilitychange", settle);
    return () => {
      cancel(); element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", settle); document.removeEventListener("keydown", settle);
      document.removeEventListener("visibilitychange", settle); reset(true);
    };
  }, [direction, reduced, finePointer, x, y]);

  const inputs = [
    { name: "Messages", y: 64, icon: "M-12-8H12V7H-3L-10 13V7H-12Z M-6-2H6 M-6 3H2" },
    { name: "Bookings", y: 150, icon: "M-11-8H11V11H-11Z M-11-2H11 M-6-12V-5 M6-12V-5 M-5 3H-1 M3 3H7 M-5 7H-1" },
    { name: "Invoices", y: 236, icon: "M-9-12H5L11-6V12H-9Z M5-12V-6H11 M-4-2H6 M-4 3H6 M-4 8H2" },
  ];

  return <div ref={ref} className={`hero-showcase hero-showcase--${direction}`} data-visible="false" aria-hidden="true">
    <div className="showcase-arrival">
      <div className="showcase-aura" />
      {direction === "type" ? <div className="showcase-words">
        <div className="showcase-type-light" />
        <div className="showcase-word-window"><div className="showcase-word-track">
          <span>Your customers.</span><span>Your team.</span><span>Your business.</span><span>Your customers.</span>
        </div></div>
        <div className="showcase-word-rule"><span /></div>
      </div> : direction === "signal" ? <>
        <svg className="showcase-ribbons" viewBox="0 0 1200 300" fill="none" focusable="false">
          {["M-60 240C160 270 310 70 506 145", "M694 145C870 220 995 20 1260 60", "M-60 260C245 330 370 195 508 159", "M692 159C880 105 1020 240 1260 180"].map((path, index) => <g key={path} style={{ "--signal-delay": `${index * -1.4}s` } as CSSProperties}><path className="ribbon-track" d={path} /><path className="ribbon-pulse" pathLength="100" d={path} /></g>)}
        </svg>
        <div className="showcase-mark-position"><motion.div className="showcase-pointer" style={{ transform }}><div className="showcase-mark-drift"><SignalMark /></div></motion.div></div>
      </> : <>
        <svg className="showcase-flow showcase-flow--desktop" viewBox="0 0 1100 300" fill="none" focusable="false">
          {inputs.map(({ name, y: inputY, icon }, index) => <g key={name} style={{ "--signal-delay": `${index * .5}s` } as CSSProperties}>
            <path className="flow-track" d={`M245 ${inputY}C345 ${inputY} 340 150 484 150`} />
            <path className="flow-pulse flow-pulse--in" pathLength="100" d={`M245 ${inputY}C345 ${inputY} 340 150 484 150`} />
            <g className="flow-input" transform={`translate(220 ${inputY})`}><circle r="24" /><path d={icon} /></g>
            <text className="flow-label" x="181" y={inputY + 5} textAnchor="end">{name}</text>
          </g>)}
          <path className="flow-track" d="M616 150H856" />
          <path className="flow-pulse flow-pulse--out" pathLength="100" d="M616 150H856" />
          <g className="flow-result" transform="translate(881 150)"><circle r="25" /><path d="M-10 0L-3 7L11-8" /></g>
          <text className="flow-label flow-label--result" x="881" y="203" textAnchor="middle">Ready for you</text>
        </svg>
        <svg className="showcase-flow showcase-flow--mobile" viewBox="0 0 360 310" fill="none" focusable="false">
          {inputs.map(({ name, icon }, index) => {
            const inputX = 60 + index * 120;
            return <g key={name} style={{ "--signal-delay": `${index * .5}s` } as CSSProperties}>
              <path className="flow-track" d={`M${inputX} 74C${inputX} 133 180 111 180 134`} />
              <path className="flow-pulse flow-pulse--in" pathLength="100" d={`M${inputX} 74C${inputX} 133 180 111 180 134`} />
              <g className="flow-input" transform={`translate(${inputX} 50)`}><circle r="24" /><path d={icon} /></g>
              <text className="flow-label" x={inputX} y="13" textAnchor="middle">{name}</text>
            </g>;
          })}
          <path className="flow-track" d="M180 206V249" />
          <path className="flow-pulse flow-pulse--out" pathLength="100" d="M180 206V249" />
          <g className="flow-result" transform="translate(180 270)"><circle r="21" /><path d="M-9 0L-3 6L10-7" /></g>
          <text className="flow-label flow-label--result" x="180" y="307" textAnchor="middle">Ready for you</text>
        </svg>
        <div className="showcase-mark-position"><motion.div className="showcase-pointer" style={{ transform }}><div className="showcase-flow-mark"><SignalMark /></div></motion.div></div>
      </>}
    </div>
  </div>;
}

/** Motion owns panel transforms; GSAP only reveals their opacity. */
export function MotionPanel(props: Omit<ComponentProps<"article">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">) {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  return <motion.article {...props} data-motion-panel="true" whileHover={!reduced && finePointer ? { transform: "translateY(-4px)" } : undefined} transition={{ duration: .22, ease: [.22, 1, .36, 1] }}>
    {props.className?.split(" ").includes("featured") && <BorderLight />}
    {props.children}
  </motion.article>;
}

/** Progressive enhancement: text remains visible if animation modules cannot load. */
export function useSiteMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const select = gsap.utils.selector(root);
        const hero = gsap.timeline({ defaults: { ease: "power3.out", duration: .5 } });
        hero.fromTo(select(".hero-copy > [data-enter]:not(h1)"), { opacity: .35, y: 16 }, { opacity: 1, y: 0, stagger: .06, clearProps: "opacity,transform" });
        hero.fromTo(select("[data-title-reveal]"), { yPercent: 110 }, { yPercent: 0, stagger: .08, duration: .65, clearProps: "transform" }, .08);
        hero.fromTo(select(".showcase-arrival"), { opacity: .4, y: 18 }, { opacity: 1, y: 0, duration: .75, clearProps: "opacity,transform" }, .2);
        const syncEffects = () => {
          const inactive = root.dataset.effectsInactive === "true" || document.hidden;
          if (inactive) hero.progress(1).pause();
        };
        const effectsObserver = new MutationObserver(syncEffects);
        effectsObserver.observe(root, { attributes: true, attributeFilter: ["data-effects-inactive"] });
        document.addEventListener("visibilitychange", syncEffects);
        syncEffects();

        select(".reveal").forEach((target: HTMLElement) => {
          const panel = target.hasAttribute("data-motion-panel");
          const currentViewport = target.getBoundingClientRect();
          // Do not conceal an anchor destination or a panel already on screen.
          if (currentViewport.top < window.innerHeight && currentViewport.bottom > 0) return;
          gsap.fromTo(target, panel ? { opacity: 0 } : { opacity: 0, y: 18 }, {
            opacity: 1, ...(panel ? {} : { y: 0 }), duration: .45, ease: "power3.out",
            clearProps: panel ? "opacity" : "opacity,transform",
            scrollTrigger: { trigger: target, start: "top 94%", once: true },
          });
        });
        gsap.fromTo(select(".reading-progress span"), { scaleX: 0 }, {
          scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .2 },
        });
        const revealFocus = (event: FocusEvent) => {
          if ((event.target as HTMLElement).closest(".hero")) hero.progress(1).pause();
          const target = (event.target as HTMLElement).closest<HTMLElement>(".reveal");
          if (!target) return;
          gsap.killTweensOf(target);
          gsap.set(target, { opacity: 1, ...(target.hasAttribute("data-motion-panel") ? {} : { y: 0 }) });
        };
        root.addEventListener("focusin", revealFocus);
        return () => {
          effectsObserver.disconnect();
          document.removeEventListener("visibilitychange", syncEffects);
          root.removeEventListener("focusin", revealFocus);
        };
      }, root);
      dispose = () => media.revert();
    }).catch(() => { /* The static page is the fallback. */ });
    return () => { cancelled = true; dispose?.(); };
  }, [rootRef]);
}

/** Anime.js owns only this decorative SVG, never page layout or text. */
export function SignalRoute({ variant = "workspace" }: { variant?: "hero" | "workspace" }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let cancelled = false;
    let scope: { revert: () => void } | undefined;
    let observer: IntersectionObserver | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { scope?.revert(); scope = undefined; };
    const play = async () => {
      if (preference.matches || cancelled) return;
      const { animate, createScope, svg, stagger } = await import("animejs");
      if (cancelled || preference.matches) return;
      stop();
      scope = createScope({ root: element }).add(() => {
        animate(svg.createDrawable(element.querySelectorAll(".signal-trace")), {
          draw: ["0 0", "0 1"], duration: 1600, delay: stagger(120), ease: "inOutCubic",
        });
        animate(svg.createDrawable(element.querySelectorAll(".signal-pulse")), {
          draw: ["0 .06", ".94 1"], duration: 2400, delay: 350, ease: "inOutSine",
        });
        animate(element.querySelectorAll(".signal-node"), {
          opacity: [.35, 1], duration: 500, delay: stagger(160, { start: 250 }), ease: "outCubic",
        });
      });
    };
    if (!preference.matches && typeof IntersectionObserver === "undefined") {
      void play().catch(stop);
    } else if (!preference.matches) {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        void play().catch(stop);
      }, { threshold: .4 });
      observer.observe(element);
    }
    const onPreference = () => {
      observer?.disconnect();
      stop();
      if (!preference.matches) void play().catch(stop);
    };
    preference.addEventListener("change", onPreference);
    return () => { cancelled = true; observer?.disconnect(); preference.removeEventListener("change", onPreference); stop(); };
  }, []);

  const route = variant === "hero"
    ? "M24 18 H198 Q214 18 226 30 L246 50 Q258 62 274 62 H526 Q542 62 554 50 L574 30 Q586 18 602 18 H776"
    : "M24 32 H168 Q184 32 194 22 L202 14 Q212 4 228 4 H364 Q380 4 390 14 L406 30 Q416 40 432 40 H608 Q624 40 634 30 L650 14 Q660 4 676 4 H776";
  return (
    <svg ref={ref} className={`signal-route signal-route--${variant}`} viewBox="0 0 800 80" fill="none" aria-hidden="true" focusable="false">
      <path d={route} className="signal-track" />
      <path d={route} className="signal-trace" />
      <path d={route} className="signal-pulse" />
      {[24, 274, 526, 776].map((x, index) => <g className="signal-node" key={x}>
        <circle cx={x} cy={variant === "hero" ? (index === 1 || index === 2 ? 62 : 18) : (index === 0 ? 32 : index === 1 ? 4 : index === 2 ? 40 : 4)} r="8" className="signal-node-halo" />
        <circle cx={x} cy={variant === "hero" ? (index === 1 || index === 2 ? 62 : 18) : (index === 0 ? 32 : index === 1 ? 4 : index === 2 ? 40 : 4)} r="3" className="signal-node-core" />
      </g>)}
    </svg>
  );
}
