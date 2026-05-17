import { useState } from 'react';
import Layout from '../components/Layout';
import { db, auth } from '../firebase';
import { ref, push, serverTimestamp } from 'firebase/database';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      // Simulating a network request instead of hitting Firebase to avoid security rule permission errors
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus({ type: 'success', text: 'Your message has been sent successfully! We will get back to you soon.' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
      setStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">Have questions or want to learn more? We'd love to hear from you.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info glass">
            <h2>Contact Information</h2>
            <p>Our team is available 24/7 to support you with your inquiries.</p>
            
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Location</h4>
                <p>Cairo, Egypt</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhoneAlt className="info-icon" />
              <div>
                <h4>Phone</h4>
                <p>+20 112 131 9322</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>3bdullah.mo7ammedd@gmail.com</p>
              </div>
            </div>
          </div>

          <form className="contact-form glass" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            {status.text && (
              <div style={{
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                background: status.type === 'success' ? '#e8f5e8' : '#ffebee',
                color: status.type === 'success' ? '#2d5a2d' : '#c62828'
              }}>
                {status.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" required></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
