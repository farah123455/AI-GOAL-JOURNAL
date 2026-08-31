import { useLayoutEffect, useRef } from "react";
import { animate, utils } from "animejs";
import { prefersReducedMotion, stopAnim } from "../animations/motion";

/**
 * GrowthField
 * Panshobh's global animated background layer: a sparse constellation of
 * soft dots and two thin connecting lines drifting VERY slowly — an
 * abstract representation of GOALS → HABITS → REFLECTION → GROWTH.
 *
 * - pointer-events: none (never blocks clicks/typing)
 * - transform/opacity only, few elements, slow loops (cheap)
 * - hidden below lg screens; static (no loops) for reduced motion
 */
export default function GrowthField() {
  const rootRef = useRef(null);
  const animsRef = useRef([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.innerWidth < 1024) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      // Static, barely-there dots.
      utils.set(root.querySelectorAll(".gf-dot"), { opacity: 0.5 });
      return;
    }

    const anims = [];
    const dots = root.querySelectorAll(".gf-dot");
    utils.set(dots, { opacity: 0 });

    // Dots fade in, then each drifts on its own slow sine loop.
    anims.push(
      animate(dots, {
        opacity: [0, (el) => Number(el.dataset.opacity) || 0.5],
        duration: 1600,
        delay: (el, i) => 200 + i * 90,
        ease: "out(2)",
      })
    );

    dots.forEach((dot, i) => {
      anims.push(
        animate(dot, {
          translateX: [
            { to: (i % 2 ? -1 : 1) * (10 + (i % 5) * 6), duration: 9000 + i * 900 },
            { to: 0, duration: 9000 + i * 900 },
          ],
          translateY: [
            { to: (i % 3 ? 1 : -1) * (8 + (i % 4) * 5), duration: 11000 + i * 700 },
            { to: 0, duration: 11000 + i * 700 },
          ],
          ease: "inOut(2)",
          loop: true,
        })
      );
      // A soft breathing shimmer on every third dot.
      if (i % 3 === 0) {
        anims.push(
          animate(dot, {
            opacity: [
              { to: Number(dot.dataset.opacity) * 0.4, duration: 2600 + i * 300 },
              { to: dot.dataset.opacity, duration: 2600 + i * 300 },
            ],
            ease: "inOut(2)",
            loop: true,
          })
        );
      }
    });

    // Two tiny "energy" pulses travelling the connecting lines.
    root.querySelectorAll(".gf-pulse").forEach((pulse, i) => {
      anims.push(
        animate(pulse, {
          opacity: [{ to: 0, duration: 1 }, { to: 0.7, duration: 2500 }, { to: 0, duration: 2500 }],
          translateX: { from: pulse.dataset.x1 * 1, to: pulse.dataset.x2 * 1 },
          translateY: { from: pulse.dataset.y1 * 1, to: pulse.dataset.y2 * 1 },
          duration: 18000 + i * 5000,
          ease: "inOut(2)",
          loop: true,
        })
      );
    });

    animsRef.current = anims;
    return () => {
      animsRef.current.forEach(stopAnim);
      animsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden select-none lg:block"
    >
      {/* Connecting lines */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="12" y1="24" x2="30" y2="60" stroke="#e0e7ff" strokeWidth="0.12" />
        <line x1="30" y1="60" x2="62" y2="34" stroke="#ede9fe" strokeWidth="0.12" />
        <line x1="62" y1="34" x2="86" y2="70" stroke="#e0e7ff" strokeWidth="0.12" />
        {/* Energy pulses travelling the lines (SVG circles animated via transform) */}
        <circle className="gf-pulse" data-x1="12" data-y1="24" data-x2="30" data-y2="60" r="0.35" cx="12" cy="24" fill="#818cf8" />
        <circle className="gf-pulse" data-x1="62" data-y1="34" data-x2="86" data-y2="70" r="0.3" cx="62" cy="34" fill="#a78bfa" />
      </svg>

      {/* Floating dots */}
      {[
        { x: "8%", y: "18%", s: 7, o: 0.55 },
        { x: "22%", y: "72%", s: 5, o: 0.4 },
        { x: "34%", y: "30%", s: 4, o: 0.45 },
        { x: "48%", y: "80%", s: 6, o: 0.35 },
        { x: "58%", y: "16%", s: 5, o: 0.5 },
        { x: "70%", y: "58%", s: 8, o: 0.4 },
        { x: "80%", y: "28%", s: 4, o: 0.5 },
        { x: "90%", y: "78%", s: 6, o: 0.35 },
        { x: "15%", y: "48%", s: 4, o: 0.4 },
        { x: "66%", y: "88%", s: 5, o: 0.45 },
        { x: "88%", y: "10%", s: 5, o: 0.4 },
        { x: "40%", y: "10%", s: 4, o: 0.35 },
      ].map((d, i) => (
        <span
          key={i}
          className="gf-dot absolute rounded-full bg-indigo-300/70"
          data-opacity={d.o}
          style={{ left: d.x, top: d.y, width: d.s, height: d.s, opacity: 0 }}
        />
      ))}
    </div>
  );
}
