"use client";
import { useEffect } from "react";

export default function CursorTrail() {
  useEffect(() => {
    const dots: HTMLDivElement[] = [];
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("div");
      dot.classList.add("cursor-trail-dot");
      dot.style.cssText = `
        position: fixed;
        width: ${8 - i}px;
        height: ${8 - i}px;
        background: #c4dcfcff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - i * 0.12};
        box-shadow: 0 0 ${6 - i}px rgba(219, 234, 254, 0.5);
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(dot);
      dots.push(dot);
      positions.push({ x: 0, y: 0 });
    }

    let isMoving = false;
    let fadeTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      isMoving = true;

      positions.unshift({ x: e.clientX, y: e.clientY });
      positions.splice(8);

      dots.forEach((dot, i) => {
        if (positions[i]) {
          dot.style.left = positions[i].x + "px";
          dot.style.top = positions[i].y + "px";
          dot.style.opacity = `${1 - i * 0.12}`;
        }
      });

      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        isMoving = false;
        dots.forEach((dot) => (dot.style.opacity = "0"));
      }, 150);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(fadeTimeout);
      dots.forEach((dot) => {
        if (document.body.contains(dot)) {
          document.body.removeChild(dot);
        }
      });
    };
  }, []);

  return null;
}
