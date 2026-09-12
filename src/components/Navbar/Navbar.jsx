import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';


const NAV_LINKS = [ 'About Me','Education', 'Skills', 'Projects'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <motion.div
        className="navbar-logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Shaadhu<span className="dot">.</span>
      </motion.div>

      {/* Desktop links */}
      <ul className="navbar-links">
        {NAV_LINKS.map((label, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={() => scrollTo(label.toLowerCase().replace(' ', '-'))}>
              {label}
            </button>
          </motion.li>
        ))}
      </ul>

      <motion.button
        className="navbar-cta"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 + NAV_LINKS.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2, scale: 1.02, boxShadow: '0 6px 20px rgba(217,164,65,0.35)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => scrollTo('contact')}
      >
        Contact Me
      </motion.button>

      {/* Mobile toggle */}
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.ul
          className="navbar-mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {NAV_LINKS.map((label) => (
            <li key={label}>
              <button onClick={() => scrollTo(label.toLowerCase().replace(' ', '-'))}>
                {label}
              </button>
            </li>
          ))}
          <li>
            <button className="navbar-cta" onClick={() => scrollTo('contact')}>
              Contact Me
            </button>
          </li>
        </motion.ul>
      )}
    </nav>
  );
}