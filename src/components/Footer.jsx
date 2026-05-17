import { FaFacebook, FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="company-info">
          <p className="company-description">
            NetClaks was established in 2013, is one of the largest car trading
            companies in Egypt, and offers flexible sales services, international car brands, excellent customer
            service, and installment facilities.
          </p>
          <div className="social-media">
            <a href="https://web.facebook.com/abdullah.mohamed.440592" target="_blank" rel="noreferrer" className="social-icon">
              <FaFacebook className="icon-svg" />
            </a>
            <a href="https://wa.me/201121319322" target="_blank" rel="noreferrer" className="social-icon">
              <FaWhatsapp className="icon-svg" />
            </a>
            <a href="https://linkedin.com/in/abdullah-mohamedd" target="_blank" rel="noreferrer" className="social-icon">
              <FaLinkedin className="icon-svg" />
            </a>
            <a href="https://github.com/Abdullah-Mohammed456" target="_blank" rel="noreferrer" className="social-icon">
              <FaGithub className="icon-svg" />
            </a>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>Copyright &copy; {new Date().getFullYear()} NetClaks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
