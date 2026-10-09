"use client";

import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

const finePointerQuery = "(hover: hover) and (pointer: fine)";
function subscribeToPointer(callback: () => void) {
  const query = window.matchMedia(finePointerQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Motion owns panel transforms; GSAP only reveals their opacity. */
export function MotionPanel(props: Omit<ComponentProps<"article">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">) {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToPointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  return <motion.article {...props} data-motion-panel="true" whileHover={!reduced && finePointer ? { transform: "translateY(-4px)" } : undefined} transition={{ duration: .22, ease: [.22, 1, .36, 1] }} />;
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
        const hero = gsap.timeline({ defaults: { ease: "power3.out", duration: .7 } });
        hero.fromTo(select(".hero-copy > [data-enter]"), { opacity: .55, y: 12 }, { opacity: 1, y: 0, stagger: .075, clearProps: "opacity,transform" });
        hero.fromTo(select(".dashboard-preview"), { opacity: .7, y: 24, scale: .985 }, { opacity: 1, y: 0, scale: 1, clearProps: "opacity,transform", duration: .85 }, .22);

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
          const target = (event.target as HTMLElement).closest<HTMLElement>(".reveal");
          if (!target) return;
          gsap.killTweensOf(target);
          gsap.set(target, { opacity: 1, ...(target.hasAttribute("data-motion-panel") ? {} : { y: 0 }) });
        };
        root.addEventListener("focusin", revealFocus);
        return () => root.removeEventListener("focusin", revealFocus);
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
