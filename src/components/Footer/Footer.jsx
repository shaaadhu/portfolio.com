import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiArrowUp } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-logo">
        PORTFOLIO<span className="dot">.</span>
      </div>

      <div className="footer-socials">
        <a href="#"><FiGithub /></a>
        <a href="#"><FiLinkedin /></a>
        <a href="#"><FiTwitter /></a>
        <a href="#"><FiInstagram /></a>
      </div>

      <p className="footer-copyright">
        © {new Date().getFullYear()} Kinich. All rights reserved.
      </p>

      <button className="footer-back-top" onClick={scrollToTop}>
        Back to top <FiArrowUp />
      </button>
    </footer>
  );
}