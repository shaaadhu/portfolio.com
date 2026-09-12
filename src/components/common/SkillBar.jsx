import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SkillBar({ icon, label, percent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-bar-top">
        <span className="skill-icon">{icon}</span>
        <span className="skill-label">{label}</span>
        <span className="skill-percent">{percent}%</span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}