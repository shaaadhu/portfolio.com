import { useEffect, useRef } from 'react';

/**
 * OrbitCapField — a single full-viewport, fixed-position canvas shared by
 * the Hero and Education sections.
 *
 * SCROLL-DRIVEN ONLY: The morph between orbit and graduation cap is
 * controlled entirely by scroll position. At Hero → orbit (morph=0).
 * As user scrolls toward Education → graduation cap (morph=1).
 * No time-based auto-cycling — the cap never appears at hero.
 */

const TAU = Math.PI * 2;
const TILT = (42 * Math.PI) / 180;
const SPIN = (-14 * Math.PI) / 180;
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);
const COS_S = Math.cos(SPIN);
const SIN_S = Math.sin(SPIN);

const ALPHA_LEVELS = 6;
const COLOR_COUNT = 3;
const STIFFNESS = 0.12;
const DAMPING = 0.8;
const PARTICLE_COUNT = 720;
const MAX_PARTICLE_COUNT = 1800;
const CAP_SPIN_SPEED = 0.1; // rad/s, rigid rotation once formed

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const smoothstep = (t) => t * t * (3 - 2 * t);
const gaussian = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};

// Colors are assigned by cap-role rather than uniformly at random, so the
// formed cap reads as a pale board with a warmer band/tassel — still only
// the project's existing 3 theme colors (0 = gold-light, 1 = gold,
// 2 = text), just redistributed by part instead of evenly mixed.
// All geometry below is in *unit* space (as if the ring radius were 1) so
// the whole formation can be rescaled live to match whichever anchor
// element it's currently interpolating toward — see `liveScale` in draw().
function assignCapTarget() {
  const bw = 0.9;
  const boardY = -0.4;
  const boardThickness = 0.035;
  const crownTopY = boardY + 0.12;
  const bandY = boardY + 0.82;
  const bandRadiusX = 0.56;
  const bandRadiusZ = 0.38;
  const cornerX = -bw * 0.95;
  const cornerZ = bw * 0.95;
  const buttonX = cornerX - 0.04;
  const buttonZ = cornerZ + 0.035;
  const buttonY = bandY - 0.08;

  const roll = Math.random();

  if (roll < 0.17) {
    const t = Math.random();
    const side = Math.floor(t * 4);
    const f = t * 4 - side;
    let x;
    let z;
    if (side === 0) { x = -bw + f * 2 * bw; z = -bw; }
    else if (side === 1) { x = bw; z = -bw + f * 2 * bw; }
    else if (side === 2) { x = bw - f * 2 * bw; z = bw; }
    else { x = -bw; z = bw - f * 2 * bw; }
    x += gaussian() * bw * 0.02;
    z += gaussian() * bw * 0.02;
    const edgeSide = Math.random() < 0.5 ? -1 : 1;
    return {
      pos: [x, boardY + edgeSide * boardThickness / 2 + gaussian() * 0.008, z],
      color: 0,
    };
  }

  if (roll < 0.49) {
    const x = (Math.random() * 2 - 1) * bw * 0.92;
    const z = (Math.random() * 2 - 1) * bw * 0.92;
    return { pos: [x, boardY + gaussian() * 0.01, z], color: 2 };
  }

  if (roll < 0.78) {
    const angle = Math.random() * TAU;
    const t = Math.random();
    const radiusX = bandRadiusX * (0.91 + 0.05 * t);
    const radiusZ = bandRadiusZ * (0.91 + 0.05 * t);
    return {
      pos: [
        Math.cos(angle) * radiusX + gaussian() * 0.01,
        crownTopY + (bandY - crownTopY) * t + gaussian() * 0.01,
        Math.sin(angle) * radiusZ + gaussian() * 0.01,
      ],
      color: Math.random() < 0.72 ? 2 : 0,
    };
  }

  if (roll < 0.88) {
    const radius = Math.sqrt(Math.random());
    const angle = Math.random() * TAU;
    return {
      pos: [
        Math.cos(angle) * radius * bandRadiusX * 0.9,
        crownTopY + gaussian() * 0.012,
        Math.sin(angle) * radius * bandRadiusZ * 0.9,
      ],
      color: 2,
    };
  }

  if (roll < 0.94) {
    const angle = Math.random() * TAU;
    const jitter = 1 + gaussian() * 0.05;
    const x = Math.cos(angle) * bandRadiusX * jitter;
    const z = Math.sin(angle) * bandRadiusZ * jitter;
    return {
      pos: [x, bandY + (Math.random() - 0.5) * 0.12 + gaussian() * 0.012, z],
      color: Math.random() < 0.72 ? 1 : 0,
    };
  }

  const sub = Math.random();

  if (sub < 0.36) {
    const t = Math.random();
    const sway = Math.sin(t * Math.PI) * 0.025;
    return {
      pos: [
        cornerX + (buttonX - cornerX) * t + sway,
        boardY + (buttonY - boardY) * t,
        cornerZ + (buttonZ - cornerZ) * t,
      ],
      color: Math.random() < 0.72 ? 1 : 0,
    };
  }

  if (sub < 0.48) {
    return {
      pos: [
        buttonX + gaussian() * 0.028,
        buttonY + gaussian() * 0.028,
        buttonZ + gaussian() * 0.028,
      ],
      color: Math.random() < 0.72 ? 1 : 0,
    };
  }

  const strand = Math.floor(Math.random() * 7);
  const t = Math.random();
  const spread = (strand - 3) * 0.026;
  const tipDrop = 0.38 + (strand % 3) * 0.08;
  return {
    pos: [buttonX + spread * t, buttonY + tipDrop * t, buttonZ + spread * 0.4 * t],
    color: Math.random() < 0.72 ? 1 : 0,
  };
}

// Golden spiral / Fibonacci sphere distribution for a compact 3D particle sphere
function assignSphereTarget(index, total) {
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;

  // 80% on spherical outer shell, 20% inner glowing stardust core
  const isCore = index % 5 === 0;
  const baseR = isCore ? 0.2 + ((index % 13) / 13) * 0.22 : 0.54;
  const r = baseR + gaussian() * 0.02;

  const x = Math.sin(phi) * Math.cos(theta) * r;
  const y = Math.cos(phi) * r;
  const z = Math.sin(phi) * Math.sin(theta) * r;

  return [x, y, z];
}

function createParticles(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const dust = Math.random() < 0.09;
    const r = 1 + gaussian() * (dust ? 0.14 : 0.038);
    const cap = assignCapTarget();
    const sphere = assignSphereTarget(i, count);
    list.push({
      angle: Math.random() * TAU,
      r,
      yOff: gaussian() * (dust ? 0.1 : 0.028),
      speed: 0.15 * Math.sqrt(1 / r) * (0.85 + Math.random() * 0.3),
      size: (dust ? 0.5 : 0.6) + Math.random() * 1.3,
      twinkle: Math.random() * TAU,
      twinkleSpeed: 0.8 + Math.random() * 1.6,
      color: cap.color,
      capTarget: cap.pos,
      sphereTarget: sphere,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ready: false,
      bucket: 0,
      drawSize: 1,
    });
  }
  return list;
}

// Reference anchor size the geometry constants above were tuned against
// (roughly the Hero character box), so visual particle/dot sizes stay
// consistent with the project's original orbit at that size.
const REFERENCE_SCALE = 130;

function getRect(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, size: Math.min(r.width, r.height) };
}

/**
 * Compute scroll progress across sections:
 * - p1: 0 = hero, 1 = education (Orbit -> Graduation Cap)
 * - p2: 0 = education, 1 = about me (Graduation Cap -> Small Sphere)
 * Seamlessly reversible when scrolling up.
 */
function computeScrollProgress() {
  const heroEl = document.getElementById('hero');
  const eduEl = document.getElementById('education');
  const aboutEl = document.getElementById('about-me');
  if (!heroEl || !eduEl) return { p1: 0, p2: 0 };

  const vh = window.innerHeight;
  const heroRect = heroEl.getBoundingClientRect();
  const eduRect = eduEl.getBoundingClientRect();

  // Progress 1: Hero -> Education
  const startThreshold1 = vh * 0.9;
  const endThreshold1 = vh * 0.35;
  const eduTop = eduRect.top;

  let p1 = 0;
  if (heroRect.bottom >= startThreshold1 && eduTop >= vh) {
    p1 = 0;
  } else if (eduTop <= endThreshold1) {
    p1 = 1;
  } else {
    p1 = clamp((vh - eduTop) / (vh - endThreshold1), 0, 1);
  }

  // Progress 2: Education -> About Me
  let p2 = 0;
  if (aboutEl) {
    const aboutRect = aboutEl.getBoundingClientRect();
    const aboutTop = aboutRect.top;
    const startThreshold2 = vh * 0.85;
    const endThreshold2 = vh * 0.35;

    if (p1 >= 0.95) {
      if (aboutTop >= startThreshold2) {
        p2 = 0;
      } else if (aboutTop <= endThreshold2) {
        p2 = 1;
      } else {
        p2 = clamp((startThreshold2 - aboutTop) / (startThreshold2 - endThreshold2), 0, 1);
      }
    }
  }

  return { p1, p2 };
}

export default function OrbitCapField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const css = getComputedStyle(document.documentElement);
    const colors = [
      css.getPropertyValue('--color-gold-light').trim() || '#bde877',
      css.getPropertyValue('--color-gold').trim() || '#5d8331',
      css.getPropertyValue('--color-text').trim() || '#F5F1EA',
    ];

    let vw = 0;
    let vh = 0;
    let particles = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let time = 0;
    let scrollProgress1 = 0;
    let scrollProgress2 = 0;

    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false, strength: 0 };
    const bucketCounts = new Array(COLOR_COUNT * ALPHA_LEVELS).fill(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      const anchor = getRect('.hero-image-wrap');
      const liveScale = Math.min(
        (anchor?.size ?? Math.min(vw, vh)) * 0.63,
        vw * 0.38,
        vh * 0.32
      );
      const count = clamp(
        Math.round(PARTICLE_COUNT * (liveScale / REFERENCE_SCALE) ** 2),
        480,
        MAX_PARTICLE_COUNT
      );
      particles = createParticles(count);
    };

    const onScroll = () => {
      const res = computeScrollProgress();
      scrollProgress1 = res.p1;
      scrollProgress2 = res.p2;
    };

    const draw = (f) => {
      ctx.clearRect(0, 0, vw, vh);

      const hero = getRect('.hero-image-wrap');
      const edu = getRect('.education-image-wrap');
      const about = getRect('.about-image-wrap');
      if (!hero || !edu) return;

      const m1 = smoothstep(scrollProgress1);
      const m2 = smoothstep(scrollProgress2);

      let anchorSize, cx, cy;

      if (m2 > 0 && about) {
        // Between Education and About Me
        const startSize = edu.size;
        const startCx = edu.cx;
        const startCy = edu.cy + edu.size * 0.08;

        const targetSize = about.size;
        const targetCx = about.cx;
        const targetCy = about.cy;

        anchorSize = startSize + (targetSize - startSize) * m2;
        cx = startCx + (targetCx - startCx) * m2;
        cy = startCy + (targetCy - startCy) * m2;
      } else {
        // Between Hero and Education
        anchorSize = hero.size + (edu.size - hero.size) * m1;
        cx = hero.cx + (edu.cx - hero.cx) * m1;
        cy = hero.cy + (edu.cy - hero.cy) * m1 + (edu.size * 0.08) * m1;
      }

      const liveScale = Math.min(anchorSize * 0.63, vw * 0.38, vh * 0.32);
      const sizeFactor = liveScale / REFERENCE_SCALE;

      // Skip drawing once the formation has scrolled well outside viewport
      const margin = liveScale * 2.2;
      if (cy < -margin || cy > vh + margin || cx < -margin || cx > vw + margin) return;

      const focal = liveScale * 4;
      const damp = Math.pow(DAMPING, f);
      const rr = Math.min(120, liveScale * 0.6);
      const strength = mouse.strength;
      bucketCounts.fill(0);

      // Rotations
      const capSpin = m1 > 0.01 ? time * CAP_SPIN_SPEED : 0;
      const cosCapSpin = Math.cos(capSpin);
      const sinCapSpin = Math.sin(capSpin);
      const capHover = m1 > 0.01 ? Math.sin(time * 0.5) * 0.03 : 0;

      const sphereSpin = time * 0.28;
      const cosSphereSpin = Math.cos(sphereSpin);
      const sinSphereSpin = Math.sin(sphereSpin);
      const SPHERE_TILT = (22 * Math.PI) / 180;
      const cosSphereTilt = Math.cos(SPHERE_TILT);
      const sinSphereTilt = Math.sin(SPHERE_TILT);
      const sphereHover = Math.sin(time * 0.7) * 0.025;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // 1. Orbit target
        const a = p.angle + time * p.speed;
        const orbitX = Math.cos(a) * p.r;
        const orbitZ = Math.sin(a) * p.r;
        const orbitY = p.yOff;

        // 2. Cap target
        const [tx0, ty0, tz0] = p.capTarget;
        const capX = tx0 * cosCapSpin - tz0 * sinCapSpin;
        const capZ = tx0 * sinCapSpin + tz0 * cosCapSpin;
        const capY = ty0 + capHover;

        // 3. Small sphere target
        const [sx0, sy0, sz0] = p.sphereTarget;
        const sx1 = sx0 * cosSphereSpin - sz0 * sinSphereSpin;
        const sz1 = sx0 * sinSphereSpin + sz0 * cosSphereSpin;
        const sy1 = sy0 + sphereHover;
        const sphereX = sx1;
        const sphereY = sy1 * cosSphereTilt - sz1 * sinSphereTilt;
        const sphereZ = sy1 * sinSphereTilt + sz1 * cosSphereTilt;

        let ux, uy, uz;
        if (m2 > 0) {
          ux = capX + (sphereX - capX) * m2;
          uy = capY + (sphereY - capY) * m2;
          uz = capZ + (sphereZ - capZ) * m2;
        } else {
          ux = orbitX + (capX - orbitX) * m1;
          uy = orbitY + (capY - orbitY) * m1;
          uz = orbitZ + (capZ - orbitZ) * m1;
        }

        const x3 = ux * liveScale;
        const y3 = uy * liveScale;
        const z3 = uz * liveScale;

        const yT = y3 * COS_T - z3 * SIN_T;
        const zT = y3 * SIN_T + z3 * COS_T;
        const xr = x3 * COS_S - yT * SIN_S;
        const yr = x3 * SIN_S + yT * COS_S;
        const persp = focal / (focal - zT);
        const ix = cx + xr * persp;
        const iy = cy + yr * persp;
        const depth = clamp((zT / liveScale + 1) / 2, 0, 1);

        let targetX = ix;
        let targetY = iy;
        if (strength > 0.001) {
          const dx = ix - mouse.sx;
          const dy = iy - mouse.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < rr * rr) {
            const d = Math.sqrt(d2) || 0.0001;
            const push = smoothstep(1 - d / rr) * rr * 0.85 * strength;
            targetX = ix + (dx / d) * push;
            targetY = iy + (dy / d) * push;
          }
        }

        if (!p.ready) {
          p.x = targetX;
          p.y = targetY;
          p.ready = true;
        }
        p.vx = (p.vx + (targetX - p.x) * STIFFNESS * f) * damp;
        p.vy = (p.vy + (targetY - p.y) * STIFFNESS * f) * damp;
        p.x += p.vx * f;
        p.y += p.vy * f;

        const tw = 0.75 + 0.25 * Math.sin(time * p.twinkleSpeed * 2 + p.twinkle);
        const alpha = clamp((0.2 + 0.8 * depth) * tw, 0, 0.999);
        p.bucket = p.color * ALPHA_LEVELS + Math.floor(alpha * ALPHA_LEVELS);
        p.drawSize = p.size * (0.55 + 0.75 * depth) * persp * sizeFactor;
        bucketCounts[p.bucket] += 1;
      }

      for (let b = 0; b < bucketCounts.length; b += 1) {
        if (!bucketCounts[b]) continue;
        ctx.fillStyle = colors[Math.floor(b / ALPHA_LEVELS)];
        ctx.globalAlpha = ((b % ALPHA_LEVELS) + 0.5) / ALPHA_LEVELS;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          if (p.bucket !== b) continue;
          ctx.moveTo(p.x + p.drawSize, p.y);
          ctx.arc(p.x, p.y, p.drawSize, 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50);
      last = now;
      const f = dt / 16.667;
      time += dt / 1000;

      const follow = 1 - Math.pow(1 - 0.2, f);
      mouse.sx += (mouse.x - mouse.sx) * follow;
      mouse.sy += (mouse.y - mouse.sy) * follow;
      const target = mouse.active ? 1 : 0;
      mouse.strength += (target - mouse.strength) * (1 - Math.pow(1 - 0.08, f));

      draw(f);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e) => {
      if (reduce || e.pointerType === 'touch') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.active) {
        mouse.sx = e.clientX;
        mouse.sy = e.clientY;
      }
      mouse.active = true;
    };
    const onPointerLeave = () => {
      mouse.active = false;
    };

    resize();
    onScroll();
    if (reduce) draw(0);

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="orbit-cap-field" aria-hidden="true" />;
}
