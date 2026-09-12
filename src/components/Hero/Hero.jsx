import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import './Hero.css';
import heroCharacter from '../../assets/hom.png';
import AnimatedCounter from '../common/AnimatedCounter';



const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-text">
        <motion.p className="hero-eyebrow" {...fadeUp(0.1)}>
          WELCOME TO MY PORTFOLIO
        </motion.p>

        <motion.h1 className="hero-title" {...fadeUp(0.25)}>
          Hi, I'm <span className="green-text">Shahad</span>{' '}
          <motion.span
            className="wave"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 20, -10, 20, 0] }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            
          </motion.span>
        </motion.h1>

        <motion.p className="hero-subtitle" {...fadeUp(0.4)}>
          Turning ideas into real world solutions through code and design.
        </motion.p>

        <motion.div className="hero-buttons" {...fadeUp(0.55)}>
          <motion.button
            className="btn-primary"
            whileHover={{ y: -2, scale: 1.02, boxShadow: '0 6px 20px rgba(217,164,65,0.35)' }}
            whileTap={{ scale: 0.98 }}
          >
            Hire Me
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Download Resume
          </motion.button>
        </motion.div>

        <motion.div className="hero-socials" {...fadeUp(0.7)}>
          <a href="#"><FiGithub /></a>
          <a href="#"><FiLinkedin /></a>
          <a href="#"><FiTwitter /></a>
          <a href="#"><FiInstagram /></a>
        </motion.div>

        <motion.div className="hero-stats" {...fadeUp(0.85)}>
          <div><AnimatedCounter target={200} suffix="+" /></div>
          <div><AnimatedCounter target={300} suffix="+" /></div>
          <div><AnimatedCounter target={7} suffix="+" /></div>
        </motion.div>
      </div>

      <motion.div
        className="hero-image-wrap"
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-backdrop" />
        <motion.img
          src={heroCharacter}
          alt="Shahad"
          className="hero-character"
          // animate={{ y: [0, -8, 0] }}
          // transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}