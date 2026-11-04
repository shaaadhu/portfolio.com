import { motion } from 'framer-motion';
import { FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Projects.css';

// Replace these with your actual project images from src/assets
import ecommerceImg from '../../assets/hero-character.png';
import fitnessImg from '../../assets/hero-character.png';
import aiImg from '../../assets/hero-character.png';

const EASE = [0.16, 1, 0.3, 1];

const PROJECTS = [
  { img: ecommerceImg, title: 'Vidyen', desc: 'International dental education conference and a school management software platform.', tags: ['Flutter', 'MySQL', 'PHP', 'HTML', 'JavaScript'] },
  { img: fitnessImg, title: 'YenEthics', desc: 'The YEC-3 platform is a secure institutional portal designed to digitize and automate the entire ethical and scientific review workflow for human subject research.', tags: ['Flutter', 'MySQL', 'PHP'] },
  { img: aiImg, title: 'Twitter clone', desc: 'The Twitter (X) clone is a high-performance microblogging platform designed to replicate the core real-time functionalities of X', tags: ['Java', 'React', 'TensorFlow'] },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      delay: (i % 3) * 0.12,
      ease: EASE,
    },
  }),
};

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <SectionReveal className="projects-header">
        <h2 className="section-title">
          Projects<span className="gold-text">.</span>
        </h2>
        {/* <a href="#" className="view-all-link">
          View All Projects <FiArrowRight />
        </a> */}
      </SectionReveal>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            className="project-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{
              y: -8,
              transition: { duration: 0.35, ease: EASE },
            }}
          >
            <div className="project-image-wrap">
              <img src={project.img} alt={project.title} className="project-image" />
              {/* Overlay that slides up on hover */}
              <div className="project-overlay">
                <a href="#" className="project-link-btn" aria-label="View live">
                  <FiExternalLink />
                </a>
                <a href="#" className="project-link-btn" aria-label="View source">
                  <FiGithub />
                </a>
              </div>
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}