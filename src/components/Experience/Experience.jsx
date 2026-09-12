import { motion } from 'framer-motion';
import { FiShield, FiX } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Experience.css';

const EXPERIENCE_DATA = [
  {
    icon: <FiShield />,
    role: 'Software Engineer',
    company: 'Microsoft',
    date: 'Mar 2024 - Sep 2025',
    desc: 'Working on scalable web applications and cloud solutions.',
  },
  {
    icon: <FiX />,
    role: 'Frontend Developer',
    company: 'Spotify',
    date: 'Mar 2025 - Sep 2026',
    desc: 'Building interactive user interfaces and enhancing user experience.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience">
      <SectionReveal>
        <h2 className="section-title">
          Work <span className="gold-text">Experience</span>
        </h2>
      </SectionReveal>

      <div className="experience-timeline">
        <div className="timeline-line" />
        {EXPERIENCE_DATA.map((item, i) => (
          <motion.div
            key={item.role}
            className="experience-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(0,0,0,0.35)' }}
          >
            <div className="experience-icon">{item.icon}</div>
            <div className="experience-content">
              <div className="experience-header">
                <h3>{item.role}</h3>
              </div>
              <p className="experience-company">
                {item.company} <span className="experience-date">{item.date}</span>
              </p>
              <p className="experience-desc">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}