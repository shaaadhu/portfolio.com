import { FiArrowUp } from 'react-icons/fi';
import './Footer.css';
import socialLinks from '../../socialLinks';

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
        {socialLinks.map(({ label, href, Icon }) => (
          <a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noreferrer">
            <Icon />
          </a>
        ))}
      </div>

      <p className="footer-copyright">
        © {new Date().getFullYear()} shaadhu. All rights reserved.
      </p>

      <button className="footer-back-top" onClick={scrollToTop}>
        Back to top <FiArrowUp />
      </button>
    </footer>
  );
}