import { motion, useInView } from 'framer-motion';
import { FiShield, FiCode } from 'react-icons/fi';
import { useRef } from 'react';
import SectionReveal from '../common/SectionReveal';
import ExperienceVisual from './ExperienceVisual';
import './Experience.css';

const EASE = [0.16, 1, 0.3, 1];

const EXPERIENCE_DATA = [
  {
    icon: <FiShield />,
    role: 'Software Developer',
    company: 'Yenepoya Technology Incubator',
    date: 'Oct 2025 - Present',
    desc: 'Working on scalable web applications and Mobile Application.',
    tags: ['Flutter', 'React', 'MySQL'],
  },
  {
    icon: <FiCode />,
    role: 'Web developer Intern',
    company: 'MalDsAi Laboratory',
    date: 'Aug 2024 - Mar 2025',
    desc: 'Building interactive user interfaces and enhancing user experience.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
];

/* Animated timeline dot that pulses once when the card enters */
function TimelineDot({ index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.span
      ref={ref}
      className="timeline-dot"
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.18 + 0.15, ease: EASE }}
    />
  );
}

/* Animated line that "draws down" on scroll */
function TimelineProgress() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className="timeline-line-fill"
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 1.4, ease: EASE }}
    />
  );
}

const cardVariants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.18, ease: EASE },
  }),
};

export default function Experience() {
  return (
    <section id="experience" className="experience">
      <div className="experience-layout">
        {/* Left column: Animated Career Radar / Engineering Visual */}
        <div className="experience-visual-col">
          <ExperienceVisual />
        </div>

        {/* Right column: Work Experience Heading & Timeline */}
        <div className="experience-content-col">
          <SectionReveal>
            <h2 className="section-title">
              Work <span className="gold-text">Experience</span>
            </h2>
            <p className="experience-subtitle">
              My professional journey and impactful roles in software development.
            </p>
          </SectionReveal>

          <div className="experience-timeline">
            {/* Background static line + animated progress */}
            <div className="timeline-line">
              <TimelineProgress />
            </div>

            {EXPERIENCE_DATA.map((item, i) => (
              <div className="experience-row" key={item.role}>
                <TimelineDot index={i} />

                <motion.div
                  className="experience-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 12px 32px rgba(93,131,49,0.18)',
                    borderColor: 'rgba(93,131,49,0.35)',
                    transition: { duration: 0.35, ease: EASE },
                  }}
                >
                  <div className="experience-icon">{item.icon}</div>
                  <div className="experience-content">
                    <div className="experience-header">
                      <h3>{item.role}</h3>
                      <span className="experience-date">{item.date}</span>
                    </div>
                    <p className="experience-company">{item.company}</p>
                    <p className="experience-desc">{item.desc}</p>
                    {item.tags && (
                      <div className="experience-tags">
                        {item.tags.map((tag) => (
                          <span key={tag} className="experience-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}