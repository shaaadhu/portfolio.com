import { motion } from 'framer-motion';
import {
  FiCode, FiCpu, FiFigma,
  FiSmartphone, FiDatabase, FiGitBranch, FiTerminal,
  FiServer, FiBox, FiCoffee,
} from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import SkillVisual from './SkillVisual';
import './Skills.css';

const SKILLS = [
  { icon: <FiCode />, label: 'HTML & CSS' },
  { icon: <FiCpu />, label: 'React js' },
  { icon: <FiTerminal />, label: 'Javascript' },
  { icon: <FiFigma />, label: 'Figma' },
  { icon: <FiSmartphone />, label: 'Flutter' },
  { icon: <FiDatabase />, label: 'MySQL' },
  { icon: <FiGitBranch />, label: 'Git' },
  { icon: <FiServer />, label: 'PHP' },
  { icon: <FiBox />, label: 'Python' },
  { icon: <FiCoffee />, label: 'Java' },
];

/* Shared easing with Hero section */
const EASE = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.88, filter: 'blur(6px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      delay: i * 0.06,
      ease: EASE,
    },
  }),
};

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="skills-layout">
        {/* Left column: Headings + Skill Cards */}
        <div className="skills-content-col">
          <SectionReveal>
            <h2 className="section-title">
              Technical <span className="gold-text">Skills</span>
            </h2>
            <p className="skills-subtitle">
              Technologies and tools I use to build scalable web and mobile solutions.
            </p>
          </SectionReveal>

          <div className="skills-grid">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.label}
                className="skill-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(93,131,49,0.25)',
                  transition: { duration: 0.3, ease: EASE },
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Animated glow ring behind the icon */}
                <span className="skill-glow" />
                <span className="skill-icon-wrap">
                  {skill.icon}
                </span>
                <span className="skill-label">{skill.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column: 3D Orbital Tech Animation */}
        <div className="skills-visual-col">
          <SkillVisual />
        </div>
      </div>
    </section>
  );
}