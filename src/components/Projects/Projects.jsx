import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiMonitor, FiSmartphone, FiX } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Projects.css';

import vidyenImg from '../../assets/vidyen.png';
import yenethicsImg from '../../assets/yenethics.png';
import twitterImg from '../../assets/twitter.png';

const EASE = [0.16, 1, 0.3, 1];

const PROJECTS = [
  { img: vidyenImg, title: 'Vidyen', desc: 'International dental education conference and a school management software platform.', tags: ['Flutter', 'MySQL', 'PHP', 'HTML', 'JavaScript'], webUrl: 'https://vidyen.yenepoya.in/', iosUrl: 'https://apps.apple.com/search?term=VIDYEN', androidUrl: 'https://play.google.com/store/apps/details?id=com.ytincubator.vidyen_app', sourceUrl: '' },
  { img: yenethicsImg, title: 'YenEthics', desc: 'The YEC-3 platform is a secure institutional portal designed to digitize and automate the entire ethical and scientific review workflow for human subject research.', tags: ['Flutter', 'MySQL', 'PHP'], webUrl: '', iosUrl: '', androidUrl: '', sourceUrl: '' },
  { img: twitterImg, title: 'Twitter clone', desc: 'The Twitter (X) clone is a high-performance microblogging platform designed to replicate the core real-time functionalities of X', tags: ['Java', 'React', 'TensorFlow'], webUrl: '', iosUrl: '', androidUrl: '', sourceUrl: '' },
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
  const [projectWithLinkOptions, setProjectWithLinkOptions] = useState(null);

  useEffect(() => {
    if (!projectWithLinkOptions) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProjectWithLinkOptions(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [projectWithLinkOptions]);

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
                {(() => {
                  const liveLinks = [
                    project.webUrl && { label: 'Web app', href: project.webUrl, Icon: FiMonitor },
                    project.iosUrl && { label: 'iOS app', href: project.iosUrl, Icon: FiSmartphone },
                    project.androidUrl && { label: 'Android app', href: project.androidUrl, Icon: FiSmartphone },
                  ].filter(Boolean);

                  if (liveLinks.length === 1) {
                    const [{ label, href }] = liveLinks;
                    return (
                      <a
                        href={href}
                        className="project-link-btn"
                        aria-label={`Open ${project.title} ${label}`}
                        title={`Open ${label}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiExternalLink />
                      </a>
                    );
                  }

                  if (liveLinks.length > 1) {
                    return (
                      <button
                        type="button"
                        className="project-link-btn"
                        aria-label={`Choose a version of ${project.title}`}
                        title="Choose a version"
                        aria-haspopup="dialog"
                        onClick={() => setProjectWithLinkOptions({ title: project.title, links: liveLinks })}
                      >
                        <FiExternalLink />
                      </button>
                    );
                  }

                  return null;
                })()}
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    className="project-link-btn"
                    aria-label={`View ${project.title} source`}
                    title="View source"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiGithub />
                  </a>
                )}
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

      {projectWithLinkOptions && (
        <div
          className="project-link-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setProjectWithLinkOptions(null);
          }}
        >
          <div
            className="project-link-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-link-dialog-title"
          >
            <button
              type="button"
              className="project-link-dialog-close"
              aria-label="Close"
              onClick={() => setProjectWithLinkOptions(null)}
            >
              <FiX />
            </button>
            <h3 id="project-link-dialog-title">Open {projectWithLinkOptions.title}</h3>
            <p>Choose which version you want to open.</p>
            <div className="project-link-dialog-options">
              {projectWithLinkOptions.links.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  <Icon />
                  {label}
                  <FiExternalLink />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}