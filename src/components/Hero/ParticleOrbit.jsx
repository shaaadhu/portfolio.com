import { useEffect, useRef } from 'react';

/**
 * Rotating particle ring (canvas 2D) with cursor "void" interaction.
 *
 * - Particles sit on a tilted 3D ring, projected to 2D with perspective,
 *   so the ring reads as an ellipse with a near and far side.
 * - The whole ring rotates continuously, independent of the cursor.
 * - Near the cursor, particles are pushed away (smoothstep falloff: closest
 *   move most, distant ones untouched), opening a circular void. Each particle
 *   is a damped spring chasing its target, so it opens/closes fluidly.
 * - Listens on `window` (canvas has pointer-events: none), so it never blocks
 *   or reacts to the person image or any other hero content.
 * - Colors come from the project's CSS variables. Pauses when off-screen.
 */

const TAU = Math.PI * 2;
const TILT = (42 * Math.PI) / 180; // ring tilt toward the viewer
const SPIN = (-14 * Math.PI) / 180; // in-plane rotation of the ellipse
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);
const COS_S = Math.cos(SPIN);
const SIN_S = Math.sin(SPIN);

const ALPHA_LEVELS = 6;
const COLOR_COUNT = 3;
const STIFFNESS = 0.1;
const DAMPING = 0.8;

// Code-flavored tokens mixed into the ring alongside plain star particles.
const SYMBOL_TOKENS = ['</>', '!', '*', '=', '#',';', '=>' ,'{...}', '()', '[]', '||', '&&', '++', '--', '->', '=>', '===', '!==', '<>', '<=', '>=', '%', '$', '@', '^'];
const SYMBOL_CHANCE = 0.16; // fraction of particles rendered as a token, not a dot
const MONO_FONT = "'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Menlo, Consolas, monospace";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const smoothstep = (t) => t * t * (3 - 2 * t);
const gaussian = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};

function createParticles(w, h) {
  const ringRadius = w * 0.3;
  // Fewer particles than a pure dot-field: text tokens read as "busier"
  // than a bare dot at the same density, so the count is trimmed back to
  // keep the ring legible once symbols are mixed in.
  const count = Math.round(clamp((w * h) / 620, 260, 760));
  const list = [];

  for (let i = 0; i < count; i += 1) {
    const isSymbol = Math.random() < SYMBOL_CHANCE;
    const dust = !isSymbol && Math.random() < 0.09; // loose stragglers around the band
    const r = ringRadius * (1 + gaussian() * (dust ? 0.14 : 0.038));
    const roll = Math.random();
    list.push({
      angle: Math.random() * TAU,
      r,
      yOff: ringRadius * gaussian() * (dust ? 0.1 : 0.028),
      speed: 0.15 * Math.sqrt(ringRadius / r) * (0.85 + Math.random() * 0.3), // rad/s
      // Dots: tiny radius in px. Symbols: base font size in px (scaled by
      // depth/perspective the same way dots are, via the shared `size`
      // -> `drawSize` pipeline below) so both feel like one system.
      size: isSymbol ? 11 + Math.random() * 9 : (dust ? 0.5 : 0.6) + Math.random() * 1.3,
      twinkle: Math.random() * TAU,
      twinkleSpeed: 0.8 + Math.random() * 1.6,
      color: roll < 0.5 ? 0 : roll < 0.82 ? 1 : 2,
      type: isSymbol ? 'symbol' : 'dot',
      token: isSymbol ? SYMBOL_TOKENS[Math.floor(Math.random() * SYMBOL_TOKENS.length)] : null,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ready: false,
      bucket: 0,
      drawSize: 1,
    });
  }
  return { list, ringRadius };
}

export default function ParticleOrbit({ className = '' }) {
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

    let w = 0;
    let h = 0;
    let particles = [];
    let ringRadius = 0;
    let repelRadius = 90;
    let raf = 0;
    let running = false;
    let last = 0;
    let time = 0;

    const mouse = { x: 0, y: 0, sx: 0, sy: 0, active: false, strength: 0 };
    const bucketCounts = new Array(COLOR_COUNT * ALPHA_LEVELS).fill(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'lighter'; // soft glow where particles overlap
      ({ list: particles, ringRadius } = createParticles(w, h));
      repelRadius = clamp(Math.min(w, h) * 0.22, 60, 130);
      if (reduce) draw(0);
    };

    const draw = (f) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const focal = ringRadius * 4;
      const damp = Math.pow(DAMPING, f);
      const rr = repelRadius;
      const strength = mouse.strength;
      bucketCounts.fill(0);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // 1) ideal orbit position (3D ring -> tilt -> in-plane rotate -> perspective)
        const a = p.angle + time * p.speed;
        const x3 = Math.cos(a) * p.r;
        const z3 = Math.sin(a) * p.r;
        const yT = p.yOff * COS_T - z3 * SIN_T;
        const zT = p.yOff * SIN_T + z3 * COS_T;
        const xr = x3 * COS_S - yT * SIN_S;
        const yr = x3 * SIN_S + yT * COS_S;
        const persp = focal / (focal - zT);
        const ix = cx + xr * persp;
        const iy = cy + yr * persp;
        const depth = clamp((zT / ringRadius + 1) / 2, 0, 1);

        // 2) cursor repulsion -> target position
        let tx = ix;
        let ty = iy;
        if (strength > 0.001) {
          const dx = ix - mouse.sx;
          const dy = iy - mouse.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < rr * rr) {
            const d = Math.sqrt(d2) || 0.0001;
            const push = smoothstep(1 - d / rr) * rr * 0.85 * strength;
            tx = ix + (dx / d) * push;
            ty = iy + (dy / d) * push;
          }
        }

        // 3) damped spring toward target (opens and closes fluidly)
        if (!p.ready) {
          p.x = tx;
          p.y = ty;
          p.ready = true;
        }
        p.vx = (p.vx + (tx - p.x) * STIFFNESS * f) * damp;
        p.vy = (p.vy + (ty - p.y) * STIFFNESS * f) * damp;
        p.x += p.vx * f;
        p.y += p.vy * f;

        // 4) depth + twinkle -> alpha bucket / size
        const tw = 0.75 + 0.25 * Math.sin(time * p.twinkleSpeed * 2 + p.twinkle);
        const alpha = clamp((0.2 + 0.8 * depth) * tw, 0, 0.999);
        p.bucket = p.color * ALPHA_LEVELS + Math.floor(alpha * ALPHA_LEVELS);
        p.drawSize = p.size * (0.55 + 0.75 * depth) * persp;
        bucketCounts[p.bucket] += 1;
      }

      // Batched drawing: one fill per (color, alpha) bucket. Dots are
      // collected into a single path and filled once; symbol tokens share
      // the same fillStyle/globalAlpha for their bucket but are drawn with
      // fillText (a path can't hold text), so they're issued inline as the
      // bucket is walked, between building and flushing the dot path.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let b = 0; b < bucketCounts.length; b += 1) {
        if (!bucketCounts[b]) continue;
        ctx.fillStyle = colors[Math.floor(b / ALPHA_LEVELS)];
        ctx.globalAlpha = ((b % ALPHA_LEVELS) + 0.5) / ALPHA_LEVELS;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          if (p.bucket !== b) continue;
          if (p.type === 'symbol') {
            ctx.font = `${Math.max(8, p.drawSize)}px ${MONO_FONT}`;
            ctx.fillText(p.token, p.x, p.y);
          } else {
            ctx.moveTo(p.x + p.drawSize, p.y);
            ctx.arc(p.x, p.y, p.drawSize, 0, TAU);
          }
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

      time += dt / 1000; // rotation never stops, even during interaction

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
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pad = repelRadius;
      const inside = x > -pad && x < w + pad && y > -pad && y < h + pad;
      if (inside && mouse.strength < 0.02) {
        mouse.sx = x; // don't sweep in from an old position
        mouse.sy = y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.active = inside;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`particle-orbit-canvas ${className}`} aria-hidden="true" />;
}
