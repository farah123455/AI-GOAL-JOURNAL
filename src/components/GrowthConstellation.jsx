import { useLayoutEffect, useRef } from "react";
import { animate, utils } from "animejs";
import { prefersReducedMotion, stopAnim } from "../animations/motion";

/**
 * GrowthConstellation
 * The Dashboard's signature ambient element: a faint constellation of
 * growth points (goals/habits/reflections) with two slow-moving pulses
 * travelling along the connections. Communicates "everything the user
 * does contributes to one larger journey".
 * Purely decorative: aria-hidden, pointer-events off, disabled for
 * reduced-motion users, tiny node count, transform/opacity only.
 */
export default function GrowthConstellation({ className = "" }) {
  const svgRef = useRef(null);
  const animsRef = useRef([]);

  useLayoutEffect(() => {
    if (!svgRef.current || prefersReducedMotion()) return;

    const svg = svgRef.current;
    const pulses = svg.querySelectorAll(".gc-pulse");
    const nodes = svg.querySelectorAll(".gc-node");

    // Set initial states.
    utils.set(pulses, { opacity: 0 });
    utils.set(nodes, { scale: 0, transformOrigin: "center" });

    const anims = [];
    anims.push(
      animate(nodes, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 900,
        delay: (el, i) => 300 + i * 120,
        ease: "outBack(1.6)",
      })
    );

    // Two pulses endlessly drift along their paths — calm, ~14s cycles.
    svg.querySelectorAll(".gc-path").forEach((path, i) => {
      const pulse = pulses[i];
      if (!pulse) return;
      anims.push(
        animate(pulse, {
          opacity: [{ to: 0, duration: 1 }, { to: 0.9, duration: 2000 }, { to: 0, duration: 2000 }],
          translateX: { from: path.dataset.x1 * 1, to: path.dataset.x2 * 1 },
          translateY: { from: path.dataset.y1 * 1, to: path.dataset.y2 * 1 },
          duration: 14000 + i * 3500,
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
    <svg
      ref={svgRef}
      viewBox="0 0 220 90"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Connections */}
      <path className="gc-path" data-x1="10" data-y1="62" data-x2="70" data-y2="28" d="M10 62 L70 28" stroke="url(#gcGrad)" strokeWidth="1" fill="none" />
      <path className="gc-path" data-x1="70" data-y1="28" data-x2="128" data-y2="58" d="M70 28 L128 58" stroke="url(#gcGrad)" strokeWidth="1" fill="none" />
      <path className="gc-path" data-x1="128" data-y1="58" data-x2="184" data-y2="22" d="M128 58 L184 22" stroke="url(#gcGrad)" strokeWidth="1" fill="none" />
      <path className="gc-path" data-x1="70" data-y1="28" data-x2="126" data-y2="14" d="M70 28 L126 14" stroke="url(#gcGrad)" strokeWidth="1" fill="none" opacity="0.5" />
      <defs>
        <linearGradient id="gcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
      </defs>

      {/* Growth nodes */}
      <circle className="gc-node" cx="10" cy="62" r="4" fill="#6366f1" opacity="0.85" />
      <circle className="gc-node" cx="70" cy="28" r="5" fill="#818cf8" opacity="0.9" />
      <circle className="gc-node" cx="126" cy="14" r="3" fill="#a78bfa" opacity="0.7" />
      <circle className="gc-node" cx="128" cy="58" r="4" fill="#7c3aed" opacity="0.8" />
      <circle className="gc-node" cx="184" cy="22" r="5.5" fill="#4f46e5" opacity="0.95" />

      {/* Travelling pulses */}
      <circle className="gc-pulse" r="2.5" fill="#4f46e5" />
      <circle className="gc-pulse" r="2" fill="#a78bfa" />
    </svg>
  );
}
