"use client";

import { useEffect } from "react";

function spawnSparkle(x: number, y: number) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  document.body.appendChild(sparkle);

  const removeDelay = 750;
  window.setTimeout(() => sparkle.remove(), removeDelay);
}

export default function CursorSparkles() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      spawnSparkle(event.clientX, event.clientY);

      // Add a couple of offset sparkles for a richer burst.
      spawnSparkle(event.clientX + 12, event.clientY - 8);
      spawnSparkle(event.clientX - 10, event.clientY + 10);
    };

    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  return null;
}
