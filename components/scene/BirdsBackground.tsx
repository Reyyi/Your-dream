"use client";

import { useEffect, useRef } from "react";
import { useTimeStore } from "@/lib/store";

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number; // Scale/depth factor (8px to 17px)
  maxSpeed: number;
  maxForce: number;
  wingSpan: number;
  wingPhase: number;
  wingSpeed: number; // Flap frequency
  isGliding: boolean;
  glideTimer: number; // Remaining time in glide
  glideDuration: number;
  flapBurstRemaining: number; // Flaps left in current flap burst
  circleBias: number; // Tendency to circle (0 for straight, ±1 for circling)
  circleTimer: number;
  depthOpacity: number; // 0.38 to 0.72 based on distance
}

function getCurrentSkyHour(): number {
  const store = useTimeStore.getState();
  const now = new Date();
  const wallClock = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  return store.getTimeOfDay(wallClock, performance.now());
}

type TimePeriod = "pagi" | "siang" | "sore" | "malam";

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5.0 && hour < 10.0) return "pagi";
  if (hour >= 10.0 && hour < 15.0) return "siang";
  if (hour >= 15.0 && hour < 18.5) return "sore";
  return "malam";
}

export function BirdsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Active flock particles
    const birds: Bird[] = [];

    // Periodic random spawn timer
    let lastSpawnTime = performance.now();
    // Welcome flock spawns after 8 seconds, subsequent flocks spawn every 60-150s
    let nextSpawnDelay = 8000;

    const spawnFlock = () => {
      const hour = getCurrentSkyHour();
      const period = getTimePeriod(hour);

      // Determine flock count according to requirements:
      // Pagi (05:00 - 10:00): 3-7 ekor atau tunggal (1)
      // Siang (10:00 - 15:00): 1-2 ekor sesekali
      // Sore (15:00 - 18:30): 8-15 ekor (puncak kawanan pulang sarang)
      // Malam (18:30 - 04:59): 0 ekor (atau 1 burung malam sangat jarang)
      let count = 0;
      if (period === "pagi") {
        count = Math.random() < 0.25 ? 1 : Math.floor(3 + Math.random() * 5); // 3 to 7
      } else if (period === "siang") {
        count = Math.random() < 0.6 ? 1 : 2; // 1 to 2
      } else if (period === "sore") {
        count = Math.floor(8 + Math.random() * 8); // 8 to 15
      } else {
        // Malam: sangat jarang (1 ekor siluet lambat)
        count = Math.random() < 0.2 ? 1 : 0;
      }

      if (count === 0) return;

      // Random side: Left -> Right (heading ~0 rad) or Right -> Left (heading ~PI rad)
      const fromLeft = Math.random() > 0.45;
      const spawnX = fromLeft ? -60 : width + 60;
      // High in the sky: between 12% and 52% of screen height
      const spawnY = height * (0.12 + Math.random() * 0.40);

      // Base heading: slightly ascending or descending (-0.15 to +0.15 rad)
      const baseAngle = fromLeft
        ? (Math.random() - 0.45) * 0.25
        : Math.PI + (Math.random() - 0.55) * 0.25;

      const baseSpeed = 1.9 + Math.random() * 0.8;

      // Decide if 1 bird in the flock will do a graceful circling loop
      const circlingBirdIndex = count >= 3 ? Math.floor(Math.random() * count) : -1;

      for (let i = 0; i < count; i++) {
        // Natural loose V or echelon staggered flock offset
        const echelonRank = Math.floor((i + 1) / 2);
        const echelonSide = i % 2 === 0 ? 1 : -1;
        const offsetX = fromLeft
          ? -echelonRank * (28 + Math.random() * 16)
          : echelonRank * (28 + Math.random() * 16);
        const offsetY =
          echelonRank * echelonSide * (18 + Math.random() * 12) +
          (Math.random() - 0.5) * 14;

        // Depth variation: smaller birds in the distant background
        const depth = 0.55 + Math.random() * 0.55; // 0.55 to 1.1
        const size = 9 * depth + Math.random() * 3; // ~7px to 14px
        const maxSpeed = baseSpeed * (0.88 + Math.random() * 0.25) * (0.8 + depth * 0.25);
        const wingSpan = size * (1.5 + Math.random() * 0.35);

        // Heading with slight individual scatter
        const indAngle = baseAngle + (Math.random() - 0.5) * 0.12;
        const vx = Math.cos(indAngle) * maxSpeed;
        const vy = Math.sin(indAngle) * maxSpeed;

        const isCircling = i === circlingBirdIndex;

        birds.push({
          x: spawnX + offsetX,
          y: spawnY + offsetY,
          vx,
          vy,
          ax: 0,
          ay: 0,
          size,
          maxSpeed,
          maxForce: 0.045,
          wingSpan,
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 4.8 + Math.random() * 2.4,
          isGliding: Math.random() > 0.4,
          glideTimer: 1.5 + Math.random() * 2.5,
          glideDuration: 2.5 + Math.random() * 3.5,
          flapBurstRemaining: Math.floor(3 + Math.random() * 4),
          circleBias: isCircling ? (Math.random() > 0.5 ? 0.38 : -0.38) : 0,
          circleTimer: isCircling ? 4.5 + Math.random() * 3.0 : 0,
          depthOpacity: 0.38 + depth * 0.32, // 0.45 - 0.70
        });
      }
    };

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Clear full canvas
      ctx.clearRect(0, 0, width, height);

      // Check spawn interval
      if (currentTime - lastSpawnTime > nextSpawnDelay) {
        lastSpawnTime = currentTime;
        spawnFlock();

        const hour = getCurrentSkyHour();
        const period = getTimePeriod(hour);
        // Random interval between flock passes:
        // Pagi: 45 - 90 detik
        // Siang: 90 - 180 detik
        // Sore: 35 - 75 detik
        // Malam: 180 - 300 detik
        if (period === "pagi") {
          nextSpawnDelay = (45 + Math.random() * 45) * 1000;
        } else if (period === "siang") {
          nextSpawnDelay = (90 + Math.random() * 90) * 1000;
        } else if (period === "sore") {
          nextSpawnDelay = (35 + Math.random() * 40) * 1000;
        } else {
          nextSpawnDelay = (180 + Math.random() * 120) * 1000;
        }
      }

      const hour = getCurrentSkyHour();
      const period = getTimePeriod(hour);

      // Authentic atmospheric silhouette tint:
      // Pagi/Siang: deep charcoal-slate
      // Sore (Senja): warm dusky plum/amber
      // Malam: faint night bat silhouette
      let silhouetteColor = "32, 40, 52";
      if (period === "sore") {
        silhouetteColor = "54, 34, 46";
      } else if (period === "malam") {
        silhouetteColor = "18, 22, 30";
      }

      // Physics update: Boids flocking (Separation, Alignment, Cohesion)
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];

        let sepX = 0;
        let sepY = 0;
        let sepCount = 0;
        let alignVx = 0;
        let alignVy = 0;
        let alignCount = 0;
        let cohX = 0;
        let cohY = 0;
        let cohCount = 0;

        const sepDist = 32 * (b.size / 11);
        const neighborDist = 110 * (b.size / 11);

        for (let j = 0; j < birds.length; j++) {
          if (i === j) continue;
          const other = birds[j];
          const dx = b.x - other.x;
          const dy = b.y - other.y;
          const dist = Math.hypot(dx, dy);

          // 1. Separation
          if (dist > 0 && dist < sepDist) {
            sepX += (dx / dist) / dist;
            sepY += (dy / dist) / dist;
            sepCount++;
          }

          // 2. Alignment & 3. Cohesion
          if (dist > 0 && dist < neighborDist) {
            alignVx += other.vx;
            alignVy += other.vy;
            alignCount++;

            cohX += other.x;
            cohY += other.y;
            cohCount++;
          }
        }

        // Apply separation
        if (sepCount > 0) {
          b.ax += (sepX / sepCount) * 12.0;
          b.ay += (sepY / sepCount) * 12.0;
        }

        // Apply alignment
        if (alignCount > 0) {
          const avgVx = alignVx / alignCount;
          const avgVy = alignVy / alignCount;
          b.ax += (avgVx - b.vx) * 0.08;
          b.ay += (avgVy - b.vy) * 0.08;
        }

        // Apply cohesion
        if (cohCount > 0) {
          const targetX = cohX / cohCount;
          const targetY = cohY / cohCount;
          b.ax += (targetX - b.x) * 0.003;
          b.ay += (targetY - b.y) * 0.003;
        }

        // Gentle curved wind drift / ambient thermal turbulence
        const windSway = Math.sin(currentTime * 0.0012 + b.y * 0.005) * 0.04;
        b.ay += windSway;

        // Circling behavior for special birds
        if (b.circleTimer > 0) {
          b.circleTimer -= dt;
          // Apply perpendicular steering force
          b.ax += -b.vy * b.circleBias;
          b.ay += b.vx * b.circleBias;
        }

        // Update velocity with acceleration
        b.vx += b.ax * dt * 60;
        b.vy += b.ay * dt * 60;

        // Reset acceleration
        b.ax = 0;
        b.ay = 0;

        // Cap speed
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > b.maxSpeed) {
          b.vx = (b.vx / speed) * b.maxSpeed;
          b.vy = (b.vy / speed) * b.maxSpeed;
        } else if (speed < b.maxSpeed * 0.65) {
          b.vx = (b.vx / speed) * (b.maxSpeed * 0.65);
          b.vy = (b.vy / speed) * (b.maxSpeed * 0.65);
        }

        // Update position
        b.x += b.vx * (dt * 60);
        b.y += b.vy * (dt * 60);

        // Flapping vs Gliding logic
        if (b.isGliding) {
          b.glideTimer -= dt;
          if (b.glideTimer <= 0) {
            b.isGliding = false;
            b.flapBurstRemaining = Math.floor(3 + Math.random() * 5);
          }
        } else {
          // Flapping
          b.wingPhase += b.wingSpeed * dt;
          // When full flap cycle completes, decrease remaining flaps
          if (b.wingPhase >= Math.PI * 2) {
            b.wingPhase -= Math.PI * 2;
            b.flapBurstRemaining--;
            if (b.flapBurstRemaining <= 0) {
              b.isGliding = true;
              b.glideTimer = b.glideDuration;
            }
          }
        }

        // Render Bird on 2D Canvas
        ctx.save();
        ctx.translate(b.x, b.y);

        // Rotate along flight velocity vector
        const angle = Math.atan2(b.vy, b.vx);
        ctx.rotate(angle);

        ctx.fillStyle = `rgba(${silhouetteColor}, ${b.depthOpacity})`;

        // Flap factor:
        // When gliding: wings held in subtle upward dihedral arc (-0.18)
        // When flapping: oscillates between upstroke (-0.85) and downstroke (+0.75)
        const flap = b.isGliding
          ? -0.15
          : Math.sin(b.wingPhase);

        const s = b.size;
        const span = b.wingSpan;

        // Draw bird body (slender aerodynamic fuselage with tapered tail)
        ctx.beginPath();
        // Beak / head
        ctx.moveTo(s * 0.65, 0);
        // Chest curve
        ctx.quadraticCurveTo(s * 0.1, -s * 0.14, -s * 0.25, -s * 0.08);
        // Tail flare
        ctx.lineTo(-s * 0.75, -s * 0.15);
        ctx.lineTo(-s * 0.55, 0);
        ctx.lineTo(-s * 0.75, s * 0.15);
        // Back to flank
        ctx.quadraticCurveTo(s * 0.1, s * 0.14, s * 0.65, 0);
        ctx.fill();

        // Left wing (curved aerodynamic avian silhouette)
        ctx.beginPath();
        ctx.moveTo(s * 0.12, -s * 0.08); // Shoulder
        // Wing elbow / mid-span
        const leftElbowX = s * 0.05;
        const leftElbowY = -span * 0.52 + flap * s * 0.28;
        // Wing tip (swept back)
        const leftTipX = -s * 0.25;
        const leftTipY = -span + flap * s * 0.65;
        ctx.quadraticCurveTo(leftElbowX, leftElbowY, leftTipX, leftTipY);
        // Trailing edge curvature back to inner wing root
        ctx.quadraticCurveTo(-s * 0.15, -span * 0.45, -s * 0.22, -s * 0.06);
        ctx.closePath();
        ctx.fill();

        // Right wing (symmetrical)
        ctx.beginPath();
        ctx.moveTo(s * 0.12, s * 0.08);
        const rightElbowX = s * 0.05;
        const rightElbowY = span * 0.52 - flap * s * 0.28;
        const rightTipX = -s * 0.25;
        const rightTipY = span - flap * s * 0.65;
        ctx.quadraticCurveTo(rightElbowX, rightElbowY, rightTipX, rightTipY);
        ctx.quadraticCurveTo(-s * 0.15, span * 0.45, -s * 0.22, s * 0.06);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Memory cleanup: destroy birds that have flown far beyond the viewport boundaries
      for (let i = birds.length - 1; i >= 0; i--) {
        const b = birds[i];
        if (
          b.x < -140 ||
          b.x > width + 140 ||
          b.y < -140 ||
          b.y > height + 140
        ) {
          birds.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
    />
  );
}
