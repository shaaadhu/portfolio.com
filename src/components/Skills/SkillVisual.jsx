import { motion } from 'framer-motion';
import { FiCpu, FiZap, FiCode, FiLayers, FiTerminal } from 'react-icons/fi';
import './SkillVisual.css';

const EASE = [0.16, 1, 0.3, 1];

const ORBITING_ITEMS = [
  { label: 'React', icon: '⚛', angle: 0, delay: 0 },
  { label: 'Python', icon: '🐍', angle: 72, delay: 0.1 },
  { label: 'Flutter', icon: '⚡', angle: 144, delay: 0.2 },
  { label: 'Java', icon: '☕', angle: 216, delay: 0.3 },
  { label: 'MySQL', icon: '🗄️', angle: 288, delay: 0.4 },
];

export default function SkillVisual() {
  return (
    <motion.div
      className="skill-visual-stage"
      initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
    >
      {/* Background ambient gold-green radial glow */}
      <div className="skill-visual-glow" />

      {/* Floating badge 1: Top Right */}
      <motion.div
        className="skill-floating-pill pill-top"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
      >
        <span className="pill-icon-glow"><FiZap /></span>
        <div>
          <strong>Full-Stack</strong>
          <span>Developer</span>
        </div>
      </motion.div>

      {/* Floating badge 2: Bottom Left */}
      <motion.div
        className="skill-floating-pill pill-bottom"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
      >
        <span className="pill-icon-glow"><FiCpu /></span>
        <div>
          <strong>Mobile Apps</strong>
          <span>developer</span>
        </div>
      </motion.div>

      {/* 3D Tilted Orbital Arena */}
      <div className="orbital-arena">
        {/* Outer Ring with dashed golden track */}
        <div className="orbit-ring orbit-ring-outer">
          <div className="orbit-ring-rotator orbit-clockwise">
            {ORBITING_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className={`orbit-node orbit-node-${i}`}
                title={item.label}
              >
                <span className="node-icon">{item.icon}</span>
                <span className="node-tooltip">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Ring with subtle pulse */}
        <div className="orbit-ring orbit-ring-middle">
          <div className="orbit-ring-rotator orbit-counter">
            <span className="orbit-pulse-marker marker-1" />
            <span className="orbit-pulse-marker marker-2" />
          </div>
        </div>

        {/* Inner Ring */}
        <div className="orbit-ring orbit-ring-inner" />

        {/* Central Glowing Tech Core */}
        <div className="orbit-core">
          <div className="core-pulse-wave" />
          <div className="core-sphere">
            <div className="core-grid" />
            <FiCode className="core-symbol" />
          </div>
          <span className="core-reflection" />
        </div>
      </div>
    </motion.div>
  );
}
