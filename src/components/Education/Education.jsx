import { motion } from 'framer-motion';
import { FiCalendar, FiAward } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import eduImage from '../../assets/hom.png';
import './Education.css';

const EDUCATION_DATA = [
  {
    title: 'Bachelor of Computer Science',
    school: 'State University of Technology',
    date: '2020 - 2022',
    desc: 'Focused on software development, data structures and modern technologies.',
    tag: 'Academic Excellence',
  },
  {
    title: 'Advanced Web Development',
    school: 'Tech Institute of Design',
    date: '2023 - 2026',
    desc: 'Specialized in modern web technologies, UI/UX and scalable applications.',
    tag: 'Academic Excellence',
  },
];

export default function Education() {
  return (
    <section id="education" className="education">
      <SectionReveal>
        <p className="section-eyebrow">LEARNING PATH</p>
        <h2 className="section-title">
          Education<span className="gold-text">.</span>
        </h2>
      </SectionReveal>

      <div className="education-grid">
        <SectionReveal delay={0.1} className="education-image-wrap">
          <img src={eduImage} alt="Education" className="education-image" />
        </SectionReveal>

        <div className="education-cards">
          {EDUCATION_DATA.map((item, i) => (
            <motion.div
              key={item.title}
              className="education-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(0,0,0,0.35)' }}
            >
              <div className="education-icon">
                <FiAward />
              </div>
              <div className="education-content">
                <div className="education-header">
                  <h3>{item.title}</h3>
                  <span className="education-date">
                    <FiCalendar size={12} /> {item.date}
                  </span>
                </div>
                <p className="education-school">{item.school}</p>
                <p className="education-desc">{item.desc}</p>
                <span className="education-tag">🎓 {item.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}