import { Link } from 'react-router-dom';
import { FiCommand, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Brand */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <FiCommand className={styles.logoIcon} />
              <span className={styles.logoText}>Interview<span className={styles.logoAccent}>AI</span></span>
            </Link>
            <p className={styles.tagline}>
              Ace your next technical interview with AI-powered practice and instant, actionable feedback.
            </p>
            <div className={styles.socials}>
              <a href="https://x.com/festverse0" target="_blank" rel="noreferrer"><FiTwitter /></a>
              <a href="https://github.com/festverse" target="_blank" rel="noreferrer"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/utsav-vasava-655b6240b/" target="_blank" rel="noreferrer"><FiLinkedin /></a>
            </div>
          </div>

          {/* Links: Platform */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Platform</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/interview">Solo Practice</Link>
            <Link to="/peer">Peer Practice</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>

          {/* Links: Company */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Blog</Link>
          </div>

          {/* Links: Legal */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/">Cookie Policy</Link>
          </div>

        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} InterviewAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
