import { motion } from 'framer-motion';
import { FiActivity, FiCheckCircle, FiCompass, FiBriefcase, FiMapPin, FiTerminal } from 'react-icons/fi';
import './ExperienceVisual.css';

const EASE = [0.16, 1, 0.3, 1];

export default function ExperienceVisual() {
  return (
    <motion.div
      className="exp-visual-stage"
      initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {/* Background ambient glow */}
      <div className="exp-visual-glow" />

      {/* Main Glassmorphic Radar / Career HUD Card */}
      <div className="exp-hud-card">
        {/* Terminal Header */}
        <div className="hud-header">
          <div className="hud-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="hud-status-badge">
            <span className="live-beacon" />
            <span>ACTIVE DEVELOPER</span>
          </div>
        </div>

        {/* Radar Scanner Sphere */}
        <div className="hud-radar-wrap">
          <div className="radar-circle radar-ring-3" />
          <div className="radar-circle radar-ring-2" />
          <div className="radar-circle radar-ring-1" />

          {/* Crosshair lines */}
          <div className="radar-axis radar-axis-x" />
          <div className="radar-axis radar-axis-y" />

          {/* Sweeping radar beam */}
          <div className="radar-sweep" />

          {/* Radar Blip 1: Yenepoya (Center-Right) */}
          <div className="radar-blip blip-current" title="Current Role: Yenepoya">
            <span className="blip-pulse" />
            <span className="blip-core" />
            <span className="blip-label">Yenepoya TI</span>
          </div>

          {/* Radar Blip 2: MalDsAi (Bottom-Left) */}
          <div className="radar-blip blip-prev" title="Internship: MalDsAi">
            <span className="blip-pulse" />
            <span className="blip-core" />
            <span className="blip-label">MalDsAi Lab</span>
          </div>

          {/* Center Compass Origin */}
          <div className="radar-center-origin">
            <FiCompass className="origin-icon" />
          </div>
        </div>

        {/* Milestone Quick Summary Cards */}
        <div className="hud-milestones">
          <div className="hud-milestone-item active-milestone">
            <div className="milestone-badge">
              <FiBriefcase />
            </div>
            <div className="milestone-info">
              <strong>Yenepoya Tech Incubator</strong>
              <p>Software Developer • Web & Mobile</p>
            </div>
            <span className="milestone-pill">Present</span>
          </div>

          <div className="hud-milestone-item">
            <div className="milestone-badge">
              <FiTerminal />
            </div>
            <div className="milestone-info">
              <strong>MalDsAi Laboratory</strong>
              <p>Web Developer Intern • UI Engineering</p>
            </div>
            <span className="milestone-pill done">Done</span>
          </div>
        </div>

        {/* HUD Footer Details */}
        <div className="hud-footer">
          <span className="hud-meta"><FiMapPin size={12} /> Mangalore, India</span>
          <span className="hud-meta"><FiActivity size={12} /> Scalable Apps</span>
        </div>
      </div>

      {/* Floating Accent Card (Bottom Right overlap) */}
      <motion.div
        className="exp-floating-badge"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
      >
        <span className="badge-glow-icon"><FiCheckCircle /></span>
        <div>
          <strong>Production Ready</strong>
          <span>Full lifecycle delivery</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
