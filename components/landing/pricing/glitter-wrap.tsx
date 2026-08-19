"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  previousX: number;
  previousY: number;
  seed: number;
  velocity: number;
  colorIndex: number;
  flashUntil: number;
  nextFlash: number;
};

const COLORS = ["rgb(255, 247, 237)", "rgb(226, 127, 98)", "rgb(215, 170, 120)"];
const FOCAL_DEPTH = 0.13;
const DENSITY = 76;
const STAR_SCALE = 1.35;
const GLITTER = 0.3;
const TRAIL = 0.78;

function makeStar(): Star {
  return {
    x: 0,
    y: 0,
    z: 0,
    previousX: Number.NaN,
    previousY: Number.NaN,
    seed: 0,
    velocity: 1,
    colorIndex: 0,
    flashUntil: 0,
    nextFlash: 0,
  };
}

/**
 * OriginKit GlitterWrap, adapted for Boreas pricing cards.
 * https://www.originkit.dev/components/glitterwrap
 */
export function GlitterWrap({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = [];
    let elapsed = 0;
    let previousTime = performance.now();
    let frameId = 0;
    let visible = true;

    const resetStar = (star: Star, initial = false) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = (0.2 + Math.random() * 0.8) * (DENSITY / 15);

      star.x = Math.cos(angle) * radius;
      star.y = Math.sin(angle) * radius;
      star.z = initial ? Math.random() : 1;
      star.previousX = Number.NaN;
      star.previousY = Number.NaN;
      star.seed = Math.random() * 1000;
      star.velocity = 0.6 + Math.random() * 0.8;
      star.colorIndex = Math.floor(Math.random() * COLORS.length);
      star.flashUntil = 0;
      star.nextFlash = elapsed + 1 + Math.random() * 4 * (1 / GLITTER);
    };

    const resize = (entry?: ResizeObserverEntry) => {
      const rect = entry?.contentRect;
      const width = Math.max(
        1,
        Math.floor(rect?.width || container.clientWidth || container.getBoundingClientRect().width)
      );
      const height = Math.max(
        1,
        Math.floor(
          rect?.height || container.clientHeight || container.getBoundingClientRect().height
        )
      );
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const previous = sizeRef.current;

      if (previous.width === width && previous.height === height && previous.dpr === dpr) return;

      sizeRef.current = { width, height, dpr };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
    };

    const syncStars = () => {
      const { width, height } = sizeRef.current;
      const count = Math.max(130, Math.min(280, Math.round((width * height) / 1500)));

      while (stars.length < count) {
        const star = makeStar();
        resetStar(star, true);
        stars.push(star);
      }
      if (stars.length > count) stars.length = count;
    };

    const drawFrame = (deltaSeconds: number, staticFrame = false) => {
      syncStars();

      const { width, height } = sizeRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const projectionScale = Math.min(width, height) * 0.9;
      const delta = Math.max(0.001, Math.min(0.1, deltaSeconds)) * 60;
      const launch = Math.max(0, 1 - elapsed / 0.95);
      const speed = staticFrame ? 5 : 2.25 + launch * 7.75;
      const stepZ = speed * 0.0008;
      const brightness = staticFrame ? 0.34 : 0.38 + launch * 0.52;
      const keep = Math.pow(Math.min(0.98, TRAIL), delta);
      const trailAlpha = Math.max(0.02, 1 - keep);

      context.globalAlpha = 1;
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index];
        star.z -= stepZ * star.velocity * delta;

        if (star.z <= FOCAL_DEPTH) {
          resetStar(star);
          continue;
        }

        const perspective = FOCAL_DEPTH / Math.max(star.z, 0.0001);
        const x = centerX + star.x * perspective * projectionScale;
        const y = centerY + star.y * perspective * projectionScale;

        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) {
          resetStar(star);
          continue;
        }

        let flashMultiplier = 1;
        if (elapsed >= star.nextFlash && star.flashUntil < elapsed) {
          star.flashUntil = elapsed + 0.04 + Math.random() * 0.07;
          star.nextFlash = elapsed + 1 + Math.random() * 4 * (1 / GLITTER);
        }
        if (elapsed <= star.flashUntil) flashMultiplier = 1 + 2.5 * GLITTER;

        const perspectiveSize = Math.min(2.5, perspective * 0.6);
        const baseRadius = Math.max(0.25, STAR_SCALE * (0.4 + perspectiveSize));
        const maximumRadius = 1 + STAR_SCALE * 2.5;
        const radius = Math.min(baseRadius * flashMultiplier, maximumRadius);
        const life = 1 - star.z;
        const alpha =
          Math.min(1, life * 0.9 + 0.05) *
          brightness *
          (flashMultiplier > 1 ? 1 : 0.85);
        const color = COLORS[star.colorIndex];

        if (!Number.isNaN(star.previousX) && !Number.isNaN(star.previousY)) {
          context.globalAlpha = alpha * 0.5;
          context.strokeStyle = color;
          context.lineWidth = Math.max(0.4, radius * 0.4);
          context.beginPath();
          context.moveTo(star.previousX, star.previousY);
          context.lineTo(x, y);
          context.stroke();
        }

        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);

        if (flashMultiplier > 1) {
          const flashRadius = Math.min(radius * 1.4, maximumRadius * 1.4);
          context.globalAlpha = alpha * 0.5;
          context.fillRect(
            x - flashRadius,
            y - flashRadius,
            flashRadius * 2,
            flashRadius * 2
          );
        }

        star.previousX = x;
        star.previousY = y;
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      elapsed += Math.min(0.1, Math.max(0, deltaSeconds));
    };

    const resizeObserver = new ResizeObserver((entries) => resize(entries[0]));
    const loop = (time: number) => {
      const deltaSeconds = (time - previousTime) / 1000;
      previousTime = time;
      drawFrame(deltaSeconds);
      frameId = requestAnimationFrame(loop);
    };

    const syncActivity = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && frameId === 0) {
        previousTime = performance.now();
        frameId = requestAnimationFrame(loop);
      } else if (!shouldRun && frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!reducedMotion) syncActivity();
    });

    resizeObserver.observe(container);
    visibilityObserver.observe(container);
    resize();
    context.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height);

    if (reducedMotion) {
      for (let frame = 0; frame < 70; frame += 1) drawFrame(1 / 60, true);
    } else {
      document.addEventListener("visibilitychange", syncActivity);
      syncActivity();
    }

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", syncActivity);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(169,73,50,0.18),transparent_34%),linear-gradient(145deg,#211a17_0%,#161311_58%,#241914_100%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_24%,rgba(0,0,0,0.16))]" />
    </div>
  );
}
