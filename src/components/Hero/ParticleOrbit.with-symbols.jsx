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
const SYMBOL_TOKENS = ['</>', '!Null', '*', 'CRUD', 'commit', 'build', '=>'];
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

// --- Graduation-cap morph -------------------------------------------------
// The whole formation periodically morphs from the orbit into a graduation
// cap (flat mortarboard + a short cylindrical base/stem + a hanging tassel
// with a tuft), holds there gently rotating, then morphs back — an endless
// loop. Every particle already has a fixed "cap" target position (computed
// once, at creation, in `assignCapTarget`); each frame we just blend that
// particle's live orbit position toward/away from its own cap target by a
// single global `morph` amount, so the whole thing flows as one continuous
// deformation rather than a crossfade between two separate drawings.
const CAP_HOLD_ORBIT = 6; // seconds spent as a pure orbit
const CAP_MORPH_TIME = 2.6; // seconds spent transitioning, each direction
const CAP_HOLD_CAP = 5; // seconds spent formed as the cap
const CAP_CYCLE = CAP_HOLD_ORBIT + CAP_MORPH_TIME + CAP_HOLD_CAP + CAP_MORPH_TIME;
const CAP_SPIN_SPEED = 0.12; // rad/s — slow, rigid rotation once formed

function capMorphAmount(t) {
  const c = t % CAP_CYCLE;
  if (c < CAP_HOLD_ORBIT) return 0;
  if (c < CAP_HOLD_ORBIT + CAP_MORPH_TIME) {
    return smoothstep((c - CAP_HOLD_ORBIT) / CAP_MORPH_TIME);
  }
  if (c < CAP_HOLD_ORBIT + CAP_MORPH_TIME + CAP_HOLD_CAP) return 1;
  const f = (c - CAP_HOLD_ORBIT - CAP_MORPH_TIME - CAP_HOLD_CAP) / CAP_MORPH_TIME;
  return 1 - smoothstep(f);
}

// Returns a fixed [x, y, z] target (world space, pre tilt/spin/perspective,
// same units as the ring) for one particle's spot in the cap formation.
// Called once per particle at creation, so each particle always flows to
// the same point in the cap — that consistency is what makes the morph
// read as one shape reorganizing rather than particles randomly landing.
// A particle's cap role also decides its color — still only the project's
// existing 3 theme colors (index 0 = gold-light, 1 = gold, 2 = text/white),
// just distributed by part instead of uniformly, so the formed cap reads
// as a pale board with a golden band + tassel (matching the reference)
// instead of an even speckle. This replaces the old fully-random color
// roll; the ring still looks lively while orbiting since both tones are
// still present throughout, just no longer independent of future role.
const goldTone = () => (Math.random() < 0.5 ? 0 : 1);

function assignCapTarget(ringRadius) {
  const scale = ringRadius * 1.15;
  const bw = scale * 0.74; // mortarboard half-width — large, flat, prominent
  const boardY = -scale * 0.38;
  const bandY = boardY + scale * 0.95; // golden band hangs clearly below the board
  const bandRadiusX = scale * 0.5;
  const bandRadiusZ = scale * 0.34; // squashed -> reads as an ellipse once tilted
  const cornerX = -bw * 0.95;
  const cornerZ = bw * 0.95;
  const buttonX = cornerX - scale * 0.08;
  const buttonZ = cornerZ + scale * 0.05;
  const buttonY = boardY + scale * 0.46;

  const roll = Math.random();

  if (roll < 0.36) {
    // mortarboard perimeter — the recognizable flat square silhouette
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
    return { pos: [x, boardY + gaussian() * scale * 0.012, z], color: 2 };
  }

  if (roll < 0.52) {
    // sparse fill across the board's face
    const x = (Math.random() * 2 - 1) * bw * 0.92;
    const z = (Math.random() * 2 - 1) * bw * 0.92;
    return { pos: [x, boardY + gaussian() * scale * 0.014, z], color: 2 };
  }

  if (roll < 0.86) {
    // golden band (a flat ellipse ring below the board — the head opening)
    const angle = Math.random() * TAU;
    const jitter = 1 + gaussian() * 0.05;
    const x = Math.cos(angle) * bandRadiusX * jitter;
    const z = Math.sin(angle) * bandRadiusZ * jitter;
    return { pos: [x, bandY + gaussian() * scale * 0.02, z], color: goldTone() };
  }

  // tassel: cord -> button -> a fan of hanging strands, all in gold
  const sub = Math.random();

  if (sub < 0.38) {
    // cord from the board corner down to the button
    const t = Math.random();
    const sway = Math.sin(t * Math.PI) * scale * 0.02;
    return {
      pos: [
        cornerX + (buttonX - cornerX) * t + sway,
        boardY + (buttonY - boardY) * t,
        cornerZ + (buttonZ - cornerZ) * t,
      ],
      color: goldTone(),
    };
  }

  if (sub < 0.5) {
    // the button: a small dense cluster where the strands meet
    return {
      pos: [
        buttonX + gaussian() * scale * 0.025,
        buttonY + gaussian() * scale * 0.025,
        buttonZ + gaussian() * scale * 0.025,
      ],
      color: goldTone(),
    };
  }

  // fan of strands hanging below the button, each ending at a slightly
  // different length so the tassel reads as several threads, not one cord
  const strand = Math.floor(Math.random() * 7);
  const t = Math.random();
  const spread = (strand - 3) * scale * 0.03;
  const tipDrop = scale * (0.34 + (strand % 3) * 0.07);
  return {
    pos: [
      buttonX + spread * t,
      buttonY + tipDrop * t,
      buttonZ + spread * 0.4 * t,
    ],
    color: goldTone(),
  };
}

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
    const cap = assignCapTarget(ringRadius);
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
      color: cap.color,
      type: isSymbol ? 'symbol' : 'dot',
      token: isSymbol ? SYMBOL_TOKENS[Math.floor(Math.random() * SYMBOL_TOKENS.length)] : null,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ready: false,
      bucket: 0,
      drawSize: 1,
      capTarget: cap.pos,
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

      // Cap-morph terms shared by every particle this frame: how far into
      // the cap shape we are (0 = pure orbit, 1 = fully formed cap), and
      // the cap's own slow rigid spin + gentle vertical hover once formed.
      const morph = capMorphAmount(time);
      const capSpin = time * CAP_SPIN_SPEED;
      const cosCapSpin = Math.cos(capSpin);
      const sinCapSpin = Math.sin(capSpin);
      const capHover = Math.sin(time * 0.5) * ringRadius * 0.03;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // 1) ideal orbit position (3D ring)
        const a = p.angle + time * p.speed;
        const orbitX = Math.cos(a) * p.r;
        const orbitZ = Math.sin(a) * p.r;
        const orbitY = p.yOff;

        // 1b) this particle's fixed spot in the cap, rigidly spun + hovered
        const [tx0, ty0, tz0] = p.capTarget;
        const capX = tx0 * cosCapSpin - tz0 * sinCapSpin;
        const capZ = tx0 * sinCapSpin + tz0 * cosCapSpin;
        const capY = ty0 + capHover;

        // 1c) blend orbit -> cap (or back) by the single global `morph`
        // amount, so the whole ring flows into/out of the cap as one
        // continuous deformation rather than two shapes cross-fading.
        const x3 = orbitX + (capX - orbitX) * morph;
        const y3 = orbitY + (capY - orbitY) * morph;
        const z3 = orbitZ + (capZ - orbitZ) * morph;

        // 1d) tilt -> in-plane rotate -> perspective (unchanged from before)
        const yT = y3 * COS_T - z3 * SIN_T;
        const zT = y3 * SIN_T + z3 * COS_T;
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
            // Shrink tokens as the cap forms — at full text size the code
            // words overwhelm the silhouette, so they scale down (never to
            // nothing) the closer `morph` gets to 1, and back up as it
            // unwinds back toward the orbit.
            const symbolScale = 1 - morph * 0.55;
            ctx.font = `${Math.max(6, p.drawSize * symbolScale)}px ${MONO_FONT}`;
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
