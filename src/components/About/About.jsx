import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import AnimatedCounter from '../common/AnimatedCounter';
import aboutImage from '../../assets/hom.png';
import './About.css';

export default function About() {
  return (
    <section id="about-me" className="about">
      <SectionReveal className="about-text">
        <h2 className="section-title">
          More <span className="gold-text">About</span> Me
        </h2>
        <p className="about-desc">
          I'm a creative developer who loves building digital experiences.
          I enjoy solving problems, learning new technologies and turning ideas
          into real world solutions. When I'm not coding, you'll find me exploring
          design, reading tech blogs, or working on personal projects.
        </p>

        <motion.button
          className="btn-primary about-cta"
          whileHover={{ y: -2, scale: 1.02, boxShadow: '0 6px 20px rgba(217,164,65,0.35)' }}
          whileTap={{ scale: 0.98 }}
        >
          Let's Talk <FiArrowRight />
        </motion.button>

        <div className="about-stats">
          <div className="about-stat-card">
            <AnimatedCounter target={200} suffix="" prefix="+" />
            <span>Clients</span>
          </div>
          <div className="about-stat-card">
            <AnimatedCounter target={300} suffix="" prefix="+" />
            <span>Projects</span>
          </div>
          <div className="about-stat-card">
            <AnimatedCounter target={7} suffix="" prefix="+" />
            <span>Years</span>
          </div>
        </div>
      </SectionReveal>

      <motion.div
        className="about-image-wrap"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-backdrop" />
        <img src={aboutImage} alt="About me" className="about-image" />
      </motion.div>
    </section>
  );
}