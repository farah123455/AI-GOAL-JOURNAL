import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { animate } from "animejs";
import { pageEntrance, stopAnim, prefersReducedMotion } from "../animations/motion";

/**
 * PageTransition
 * Cinematic-but-fast navigation transition (~550ms):
 *  1. an indigo "energy line" sweeps across the top of the content
 *  2. the new page rises/springs into place
 *  3. [data-motion] sections stagger into position
 * Remounts on every pathname change.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const animsRef = useRef([]);

  useLayoutEffect(() => {
    const anims = [];
    const reduced = prefersReducedMotion();

    if (!reduced && rootRef.current) {
      // Page body: spring rise.
      anims.push(
        animate(rootRef.current, {
          opacity: [0, 1],
          translateY: [10, 0],
          scale: [0.992, 1],
          duration: 480,
          ease: "out(3)",
        })
      );
    }

    if (!reduced && barRef.current) {
      // Signature "energy sweep" line.
      anims.push(
        animate(barRef.current, {
          scaleX: [0, 1],
          opacity: [{ from: 0.9, to: 0.9, duration: 380 }, { to: 0, duration: 220 }],
          duration: 600,
          ease: "out(3)",
        })
      );
    }

    anims.push(pageEntrance(rootRef.current, { maxY: 22, duration: 560 }));

    animsRef.current = anims;
    return () => {
      animsRef.current.forEach(stopAnim);
      animsRef.current = [];
    };
  }, [location.pathname]);

  return (
    <div className="relative outline-none">
      {/* Energy sweep line (decorative) */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 h-[2.5px] w-full origin-left rounded-full bg-gradient-to-r from-indigo-500 via-violet-400 to-transparent"
      />
      <div key={location.pathname} ref={rootRef}>
        {children}
      </div>
    </div>
  );
}
