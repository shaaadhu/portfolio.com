import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLinkedin, FiMapPin, FiArrowRight } from 'react-icons/fi';
import SectionReveal from '../common/SectionReveal';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

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
      <SectionReveal className="contact-info">
        <h2 className="section-title">
          Let's <span className="gold-text">Connect</span>.
        </h2>
        <p className="contact-desc">
          I'm always open to discussing new opportunities, interesting projects or just a friendly chat.
        </p>

        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-icon"><FiMail /></span>
            <div>
              <p className="contact-label">Email</p>
              <p className="contact-value">hello@example.com</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><FiLinkedin /></span>
            <div>
              <p className="contact-label">LinkedIn</p>
              <p className="contact-value">linkedin.com/in/kinich</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><FiPhone /></span>
            <div>
              <p className="contact-label">Phone</p>
              <p className="contact-value">+123 456 7890</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><FiMapPin /></span>
            <div>
              <p className="contact-label">Location</p>
              <p className="contact-value">New York, USA</p>
            </div>
          </div>
        </div>
      </SectionReveal>

      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Your Message</label>
          <textarea
            name="message"
            rows="4"
            placeholder="Tell me about your project..."
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="btn-primary contact-submit"
          whileHover={{ y: -2, scale: 1.02, boxShadow: '0 6px 20px rgba(217,164,65,0.35)' }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message <FiArrowRight />
        </motion.button>
      </motion.form>
    </section>
  );
}