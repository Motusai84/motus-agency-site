"use client";

import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, type MotionStyle } from "framer-motion";
import { salonDemo } from "@/src/clients/salon-demo";

const finePointerQuery = "(hover: hover) and (pointer: fine)";
function subscribeToPointer(callback: () => void) {
  const query = window.matchMedia(finePointerQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Decorative light only: keeps the native cursor and never intercepts input. */
export function CursorGlow({ rootRef, paused }: { rootRef: RefObject<HTMLElement | null>; paused: boolean }) {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const x = useSpring(-400, { stiffness: 220, damping: 32, mass: .4 });
  const y = useSpring(-400, { stiffness: 220, damping: 32, mass: .4 });
  const opacity = useMotionValue(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !finePointer || paused) return;
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
  }, [rootRef, reduced, finePointer, paused, x, y, opacity]);

  return <motion.div className="cursor-glow" style={{ x, y, opacity }} aria-hidden="true"><span /></motion.div>;
}

/** Pause decorative loops off screen, in background tabs, or on request. */
export function useAmbientEffects(rootRef: RefObject<HTMLElement | null>, paused: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const field = root.querySelector<HTMLElement>(".signal-field");
    const video = root.querySelector<HTMLVideoElement>(".background-video");
    let heroVisible = true;
    const sync = () => {
      const inactive = paused || preference.matches || document.hidden;
      root.setAttribute("data-effects-inactive", String(inactive));
      field?.setAttribute("data-visible", String(heroVisible));
      if (video) {
        if (inactive || !heroVisible) video.pause();
        else void video.play().catch(() => { /* Decorative video is optional. */ });
      }
    };
    const ambient = root.querySelectorAll<HTMLElement>(".signal-field, .border-light, .hero-showcase");
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute("data-visible", String(entry.isIntersecting));
        if (entry.target === field) heroVisible = entry.isIntersecting;
      });
      sync();
    });
    ambient.forEach((element) => { element.setAttribute("data-visible", "true"); observer?.observe(element); });
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video?.pause();
    };
  }, [rootRef, paused]);
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

/** One website preview carried by the Motus signal; each transform has one owner. */
export function HeroShowcase({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const x = useSpring(0, { stiffness: 90, damping: 24, mass: .7 });
  const y = useSpring(0, { stiffness: 90, damping: 24, mass: .7 });
  const lightX = useSpring(50, { stiffness: 100, damping: 26 });
  const lightY = useSpring(25, { stiffness: 100, damping: 26 });

  useEffect(() => {
    const element = ref.current;
    const reset = (immediate = false) => {
      const method = immediate ? "jump" : "set";
      x[method](0); y[method](0); lightX[method](50); lightY[method](25);
    };
    if (!element || reduced || paused || !finePointer) { reset(true); return; }
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
        const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
        x.set(horizontal); y.set(vertical);
        lightX.set((horizontal + 1) * 50); lightY.set((vertical + 1) * 50);
      });
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focusin", settle);
    window.addEventListener("blur", settle);
    document.addEventListener("keydown", settle);
    document.addEventListener("visibilitychange", settle);
    return () => {
      cancel();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focusin", settle);
      window.removeEventListener("blur", settle);
      document.removeEventListener("keydown", settle);
      document.removeEventListener("visibilitychange", settle);
      reset(true);
    };
  }, [reduced, paused, finePointer, x, y, lightX, lightY]);

  return <motion.div ref={ref} className="hero-showcase" data-visible="false" style={{ "--scene-x": x, "--scene-y": y, "--scene-light-x": lightX, "--scene-light-y": lightY } as MotionStyle}>
    <div className="showcase-stage" aria-hidden="true">
      <div className="showcase-light" />
      <svg className="showcase-signal showcase-signal--back" viewBox="0 0 1200 430" fill="none" focusable="false">
        <defs><linearGradient id="showcase-signal-ink" x1="0" y1="430" x2="1200" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#9ba3ff" stopOpacity="0" /><stop offset=".3" stopColor="#9ba3ff" stopOpacity=".5" /><stop offset=".65" stopColor="#e3e8ff" stopOpacity=".7" /><stop offset="1" stopColor="#9ba3ff" stopOpacity="0" /></linearGradient></defs>
        <path className="showcase-trail" d="M-80 370 C100 385 120 130 335 115 C560 100 755 390 970 270 C1140 175 1100 35 1280 65" />
        <path className="showcase-current" pathLength="100" d="M-80 370 C100 385 120 130 335 115 C560 100 755 390 970 270 C1140 175 1100 35 1280 65" />
      </svg>
      <div className="showcase-website-anchor">
        <div className="showcase-arrival"><div className="showcase-drift">
          <div className="showcase-website">
            <div className="showcase-browser"><span /><span /><span /><small>Website demo</small></div>
            <div className="showcase-website-page">
              <Image src={salonDemo.hero.src} alt="" fill sizes="(max-width: 760px) 84vw, 600px" />
              <div className="showcase-website-copy"><small>{salonDemo.name}</small><strong>{salonDemo.headline[0]}<br /><em>{salonDemo.headline[1]}</em></strong><span>{salonDemo.tagline}</span></div>
            </div>
            <div className="showcase-website-footer"><span>Services</span><span>Our collection</span><span>Visit the studio <b>↗</b></span></div>
            <span className="showcase-reflection" />
          </div>
        </div></div>
      </div>
      <svg className="showcase-signal showcase-signal--front" viewBox="0 0 1200 430" fill="none" focusable="false">
        <path className="showcase-trail" d="M-60 385 C180 440 230 310 440 338 C650 366 755 460 985 344 C1090 290 1150 320 1260 300" />
        <path className="showcase-current" pathLength="100" d="M-60 385 C180 440 230 310 440 338 C650 366 755 460 985 344 C1090 290 1150 320 1260 300" />
      </svg>
      <div className="showcase-outcomes"><span>Customer messages</span><span>Bookings</span><span>Invoices</span></div>
    </div>
    <div className="showcase-caption"><span>A fictional salon website, built to explore.</span><a id="hero-salon-demo-link" href="/demos/salon-website">Try this website demo <b aria-hidden="true">↗</b></a></div>
  </motion.div>;
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
        const hero = gsap.timeline({ defaults: { ease: "power3.out", duration: .8 } });
        hero.fromTo(select(".hero-copy > [data-enter]:not(h1)"), { opacity: .35, y: 16 }, { opacity: 1, y: 0, stagger: .1, clearProps: "opacity,transform" });
        hero.fromTo(select("[data-title-reveal]"), { yPercent: 110 }, { yPercent: 0, stagger: .13, duration: .95, clearProps: "transform" }, .08);
        hero.fromTo(select(".showcase-arrival"), { opacity: .25, y: 36 }, { opacity: 1, y: 0, duration: 1.3, clearProps: "opacity,transform" }, .2);
        const scene = gsap.to(select(".hero-showcase"), { "--scene-scroll": 1, ease: "none", scrollTrigger: { trigger: root.querySelector(".hero"), start: "top top", end: "bottom top", scrub: .45 } });
        const syncEffects = () => {
          const inactive = root.dataset.effectsPaused === "true" || document.hidden;
          if (inactive) { hero.progress(1).pause(); scene.scrollTrigger?.disable(false); }
          else scene.scrollTrigger?.enable(false);
        };
        const effectsObserver = new MutationObserver(syncEffects);
        effectsObserver.observe(root, { attributes: true, attributeFilter: ["data-effects-paused"] });
        document.addEventListener("visibilitychange", syncEffects);
        syncEffects();

        select(".reveal").forEach((target: HTMLElement) => {
          const panel = target.hasAttribute("data-motion-panel");
          const currentViewport = target.getBoundingClientRect();
          // Do not conceal an anchor destination or a panel already on screen.
          if (currentViewport.top < window.innerHeight && currentViewport.bottom > 0) return;
          gsap.fromTo(target, panel ? { opacity: 0 } : { opacity: 0, y: 18 }, {
            opacity: 1, ...(panel ? {} : { y: 0 }), duration: .65, ease: "power3.out",
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
