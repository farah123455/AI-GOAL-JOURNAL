import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, createTimeline, utils } from "animejs";
import { prefersReducedMotion, stopAnim, pressPop } from "../animations/motion";
import { Sparkle, PenLine, BookOpen } from "lucide-react";

/**
 * ReflectionSeed
 * ---------------------------------------------------------------
 * Panshobh's signature entry point into a reflection.
 * A small glowing "thought seed" that floats, breathes, ripples and
 * reacts magnetically as the cursor approaches — then, on click,
 * plays "a thought becoming a reflection" before opening /journal.
 *
 * Interactive object > button. All motion via Anime.js timelines,
 * refs only, cleaned up on unmount, reduced-motion aware.
 * ---------------------------------------------------------------
 */
export default function ReflectionSeed({ onOpen }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const symbolRef = useRef(null);
  const haloRef = useRef(null);
  const labelRef = useRef(null);
  const particlesRef = useRef(null);
  const animsRef = useRef([]);
  const busyRef = useRef(false);

  /* ---------- IDLE: float + breathe + occasional ripple ---------- */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const anims = [];

    // Gentle vertical float (the seed drifts, never bounces).
    anims.push(
      animate(orbRef.current, {
        translateY: [-5, 5],
        duration: 3400,
        ease: "inOut(2)",
        alternate: true,
        loop: true,
      })
    );

    // Slow breathing scale on the inner glow.
    anims.push(
      animate(haloRef.current, {
        scale: [1, 1.12],
        opacity: [0.5, 0.75],
        duration: 2600,
        ease: "inOut(2)",
        alternate: true,
        loop: true,
      })
    );

    // Occasional tiny halo ripple every ~5s (short burst, not a loop).
    const rippleTimer = setInterval(() => {
      if (busyRef.current) return;
      anims.push(
        animate(haloRef.current, {
          scale: [1, 1.45],
          opacity: [0.7, 0],
          duration: 1100,
          ease: "out(3)",
          onComplete: () => utils.set(haloRef.current, { opacity: 0.5 }),
        })
      );
    }, 5200);

    animsRef.current = anims;
    return () => {
      clearInterval(rippleTimer);
      anims.forEach(stopAnim);
      animsRef.current = [];
    };
  }, []);

  /* ---------- HOVER: magnetic tilt + particle pull + label reveal ---------- */
  function handleApproach(e) {
    if (busyRef.current || prefersReducedMotion()) return;
    const root = rootRef.current;
    const rect = root.getBoundingClientRect();
    // Vector from orb center to cursor — drives the magnetic tilt.
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const max = 10;

    animate(orbRef.current, {
      rotate: Math.max(-max, Math.min(max, dx * 0.12)),
      translateX: Math.max(-6, Math.min(6, dx * 0.08)),
      duration: 500,
      ease: "out(3)",
    });

    // Ambient particles drift toward the seed.
    animate(".seed-particle", {
      translateX: (_el, i) => (i % 2 ? -8 : 6),
      translateY: (_el, i) => (i % 3 ? -6 : 4),
      opacity: 0.9,
      duration: 500,
      ease: "out(3)",
    });

    utils.set(haloRef.current, { opacity: 0.8 });

    // Label reveals with motion — never display:block.
    utils.set(labelRef.current, { display: "block" });
    animate(labelRef.current, {
      opacity: [0, 1],
      translateY: [8, 0],
      scale: [0.9, 1],
      duration: 420,
      ease: "outBack(1.6)",
    });

    // Symbol transforms on approach.
    animate(symbolRef.current, {
      rotate: "1turn",
      scale: [1, 1.2],
      duration: 700,
      ease: "outBack(1.4)",
    });
  }

  function handleLeave() {
    if (busyRef.current || prefersReducedMotion()) return;
    animate(orbRef.current, { rotate: 0, translateX: 0, duration: 600, ease: "outBack(1.8)" });
    animate(".seed-particle", { translateX: 0, translateY: 0, opacity: 0.4, duration: 600, ease: "out(3)" });
    utils.set(haloRef.current, { opacity: 0.5 });
    animate(labelRef.current, {
      opacity: [1, 0],
      translateY: [0, -6],
      scale: [1, 0.92],
      duration: 280,
      ease: "in(2)",
      onComplete: () => utils.set(labelRef.current, { display: "none" }),
    });
    animate(symbolRef.current, { rotate: 0, scale: 1, duration: 500, ease: "out(3)" });
  }

  /* ---------- CLICK: a thought becoming a reflection ---------- */
  function handleClick() {
    if (busyRef.current) return;
    busyRef.current = true;

    pressPop(orbRef.current);

    // With an onOpen callback the seed opens the in-page Journal editor
    // (used by the Journal page portal); without it, it navigates to /journal.
    const done = () => (onOpen ? onOpen() : navigate("/journal"));
    if (prefersReducedMotion()) {
      done();
      return;
    }

    const tl = createTimeline({ defaults: { ease: "out(3)" } });

    // 1. Seed gathers energy.
    tl.add(orbRef.current, { scale: 1.18, duration: 260 });
    // 2. Surrounding particles rush inward.
    tl.add(
      ".seed-particle",
      {
        translateX: 0,
        translateY: 0,
        opacity: 0,
        scale: 0.2,
        duration: 380,
        delay: (_el, i) => i * 25,
      },
      "-=120"
    );
    // 3. Radial ripple expands.
    tl.add(haloRef.current, { scale: [1, 2.4], opacity: [0.9, 0], duration: 520 }, "-=80");
    // 4. Symbol morphs: thought (✦) → pen → journal.
    tl.add(
      symbolRef.current,
      {
        scale: [1.2, 0.2],
        rotate: "1turn",
        opacity: [1, 0],
        duration: 320,
        onComplete: () => {
          symbolRef.current.style.display = "none";
          rootRef.current.querySelector(".seed-pen").style.display = "block";
          rootRef.current.querySelector(".seed-book").style.display = "block";
        },
      },
      "-=100"
    );
    tl.add(
      [rootRef.current.querySelector(".seed-pen"), rootRef.current.querySelector(".seed-book")],
      {
        scale: [0.2, 1],
        opacity: [0, 1],
        duration: 340,
        delay: (_el, i) => i * 160,
        ease: "outBack(2)",
      }
    );
    // 5. The seed blooms away, then the Journal takes over.
    tl.add(orbRef.current, { scale: 0, opacity: 0, duration: 340, delay: 400, ease: "in(2)" });
    tl.add(
      rootRef.current,
      { scale: [1, 0.92], opacity: [1, 0], duration: 300, onComplete: done },
      "-=140"
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Start a reflection — opens the Journal"
      onMouseMove={handleApproach}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="relative flex cursor-pointer select-none items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      {/* The seed orb */}
      <div ref={orbRef} className="relative h-16 w-16 will-change-transform">
        {/* Halo (breathes + ripples) */}
        <div
          ref={haloRef}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200/70 to-purple-200/50 blur-md"
        />
        {/* Core */}
        <div className="absolute inset-1.5 flex items-center justify-center rounded-full border border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50 to-purple-100 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.45)]">
          {/* ✦ thought symbol */}
          <Sparkle ref={symbolRef} size={20} className="text-indigo-500 will-change-transform" />
          {/* ✍ pen (hidden until click morph) */}
          <PenLine size={18} className="seed-pen hidden text-indigo-500" />
          {/* 📖 journal (hidden until click morph) */}
          <BookOpen size={18} className="seed-book hidden text-purple-500" />
        </div>
        {/* Ambient particles */}
        <span className="seed-particle absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-indigo-400 opacity-40" />
        <span className="seed-particle absolute top-1/2 -left-2 h-1 w-1 rounded-full bg-purple-400 opacity-40" />
        <span className="seed-particle absolute -bottom-1 right-1 h-1 w-1 rounded-full bg-indigo-300 opacity-40" />
        <span className="seed-particle absolute -top-2 left-3 h-1 w-1 rounded-full bg-violet-400 opacity-30" />
      </div>

      {/* Revealed label — animated in, never display-toggled from React */}
      <div
        ref={labelRef}
        style={{ display: "none" }}
        className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-2xl border border-indigo-200/80 bg-white/95 px-4 py-2 text-xs font-bold text-indigo-700 shadow-md backdrop-blur-sm"
      >
        Start a reflection
        <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
          ✦ thought → ✍ reflection
        </span>
      </div>
    </div>
  );
}

