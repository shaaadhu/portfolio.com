import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import './Hero.css';
import heroCharacter from '../../assets/am.png';
import AnimatedCounter from '../common/AnimatedCounter';
import TypingText from '../common/TypingText';
import ParticleOrbit from './ParticleOrbit';
// import ParticleOrbit from './ParticleOrbit.dots-only';
import HeroLens from './HeroLens';



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
      Hello! , I'm
        </motion.p>

        <motion.div
          className="hero-name-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-name-line hero-name-first">Mahammad</span>
          <span className="hero-name-line hero-name-last">Shahad</span>
          <HeroLens />
        </motion.div>

        <motion.p className="hero-subtitle" {...fadeUp(0.4)}>
          <TypingText
            prefix="SOFTWARE ENGINEER -"
            phrases={[
              'FullStack developer',
              'Mobile App developer',
            ]}
          />
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

        {/* <motion.div className="hero-stats" {...fadeUp(0.85)}>
        
          <motion.p className="hero-eyebrow" {...fadeUp(0.1)}>
        <span> SOFTWARE ENGINEER</span> FROM INDIA
        </motion.p>
        </motion.div> */}
      </div>

      <motion.div
        className="hero-image-wrap"
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-backdrop" />
        <ParticleOrbit className="hero-orbit" />
        {/* Static placeholder — swap for the transparent person image later.
            It sits above the orbit and never reacts to cursor movement. */}
        <img
          src={heroCharacter}
          alt="Gabriel Lucas"
          className="hero-character"
        />
      </motion.div>
    </section>
  );
}