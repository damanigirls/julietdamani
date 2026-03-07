"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    const end = Date.now() + 2000;

    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }

    frame();
  }, []);

  return null;
}
