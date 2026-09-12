import { motion } from 'framer-motion';
import { FiCode, FiCpu, FiMusic, FiFigma } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import SkillBar from '../common/SkillBar';
import './Skills.css';
const SKILLS = [
  { icon: <FiCode />, label: 'HTML & CSS', percent: 85 },
  { icon: <FiCpu />, label: 'React js', percent: 70 },
  { icon: <FiMusic />, label: 'Javascript', percent: 98 },
  { icon: <FiFigma />, label: 'Figma', percent: 91 },
];

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <SectionReveal>
        <h2 className="section-title">
          Technical <span className="gold-text">Skills</span>
        </h2>
      </SectionReveal>

      <div className="skills-list">
        {SKILLS.map((skill, i) => (
          <motion.div
            key={skill.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkillBar icon={skill.icon} label={skill.label} percent={skill.percent} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}