import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Projects.css';

// Replace these with your actual project images from src/assets
import ecommerceImg from '../../assets/hero-character.png';
import fitnessImg from '../../assets/hero-character.png';
import aiImg from '../../assets/hero-character.png';
import portfolioImg from '../../assets/hero-character.png';
import taskImg from '../../assets/hero-character.png';
import weatherImg from '../../assets/hero-character.png';

const PROJECTS = [
  { img: ecommerceImg, title: 'E-Commerce Platform', desc: 'Modern e-commerce solution', tags: ['React', 'Node.js', 'MongoDB'] },
  { img: fitnessImg, title: 'Fitness Tracker', desc: 'Track workouts and nutrition', tags: ['React Native', 'Firebase'] },
  { img: aiImg, title: 'AI Image Generator', desc: 'Generate images from text', tags: ['Python', 'React', 'TensorFlow'] },
  { img: portfolioImg, title: 'Portfolio Website', desc: 'Personal portfolio website', tags: ['React', 'Tailwind CSS'] },
  { img: taskImg, title: 'Task Management App', desc: 'Organize your work efficiently', tags: ['Next.js', 'TypeScript'] },
  { img: weatherImg, title: 'Weather Dashboard', desc: 'Real-time weather information', tags: ['React', 'OpenWeather'] },
];

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <SectionReveal className="projects-header">
        <h2 className="section-title">
          Projects<span className="gold-text">.</span>
        </h2>
        <a href="#" className="view-all-link">
          View All Projects <FiArrowRight />
        </a>
      </SectionReveal>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, boxShadow: '0 12px 28px rgba(0,0,0,0.4)' }}
          >
            <div className="project-image-wrap">
              <img src={project.img} alt={project.title} className="project-image" />
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