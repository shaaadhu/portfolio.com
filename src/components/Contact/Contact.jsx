import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLinkedin, FiMapPin, FiArrowRight, FiSend } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Contact.css';

const EASE = [0.16, 1, 0.3, 1];

const contactItems = [
  { icon: <FiMail />, label: 'Email', value: 'mhdshaadhu@gmail.com' },
  { icon: <FiLinkedin />, label: 'LinkedIn', value: 'linkedin.com/in/kinich' },
  { icon: <FiPhone />, label: 'Phone', value: '+91 94836 65213' },
  { icon: <FiMapPin />, label: 'Location', value: 'Mangalore, India' },
];

const itemVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
  }),
};

const formVariants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // hook up to email service (e.g. EmailJS) later
    alert('Message sent! (demo only, not yet connected to a backend)');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-info">
        <SectionReveal>
          <h2 className="section-title">
            Let's <span className="gold-text">Connect</span>.
          </h2>
          <p className="contact-desc">
            I'm always open to discussing new opportunities, interesting projects or just a friendly chat.
          </p>
        </SectionReveal>

        <div className="contact-list">
          {contactItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="contact-item"
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                x: 8,
                transition: { duration: 0.3, ease: EASE },
              }}
            >
              <span className="contact-icon">{item.icon}</span>
              <div>
                <p className="contact-label">{item.label}</p>
                <p className="contact-value">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="form-row">
          <div className={`form-group ${focused === 'name' ? 'is-focused' : ''}`}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              required
            />
          </div>
          <div className={`form-group ${focused === 'email' ? 'is-focused' : ''}`}>
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              required
            />
          </div>
        </div>
        <div className={`form-group ${focused === 'message' ? 'is-focused' : ''}`}>
          <label>Your Message</label>
          <textarea
            name="message"
            rows="4"
            placeholder="Tell me about your project..."
            value={form.message}
            onChange={handleChange}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="btn-primary contact-submit"
          whileHover={{
            y: -2,
            scale: 1.03,
            boxShadow: '0 8px 28px rgba(93,131,49,0.3)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Send Message <FiSend />
        </motion.button>
      </motion.form>
    </section>
  );
}