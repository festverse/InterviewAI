import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiLogOut, FiMenu, FiX, FiCommand } from 'react-icons/fi';
import { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import Button from '../common/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FiCommand className={styles.logoIcon} />
          <span className={styles.logoText}>Interview<span className={styles.logoAccent}>AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/interview"
                className={`${styles.navLink} ${isActive('/interview') ? styles.active : ''}`}
              >
                Practice
              </Link>
              <Link
                to="/history"
                className={`${styles.navLink} ${isActive('/history') ? styles.active : ''}`}
              >
                History
              </Link>
              <Link
                to="/leaderboard"
                className={`${styles.navLink} ${isActive('/leaderboard') ? styles.active : ''}`}
              >
                Leaderboard
              </Link>
              <div className={styles.divider} />
              <Link to="/profile" className={styles.profileButton}>
                <FiUser size={16} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
                <FiLogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {user ? (
            <>
              <Link to="/dashboard" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/interview" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Practice</Link>
              <Link to="/history" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>History</Link>
              <Link to="/leaderboard" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Leaderboard</Link>
              <Link to="/profile" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className={styles.mobileLink}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
