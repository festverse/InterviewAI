import { Link } from 'react-router-dom';
import { FiCommand, FiUsers, FiBarChart2, FiMic, FiArrowRight, FiShield, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import useAuthStore from '../stores/authStore';
import styles from './Landing.module.css';

const features = [
  {
    icon: FiMic,
    title: 'AI-Powered Interviews',
    description: 'Practice with dynamically generated questions tailored to your role and experience level.',
    gradient: 'var(--gradient-primary)',
  },
  {
    icon: FiUsers,
    title: 'Peer Practice Rooms',
    description: 'Match with other candidates for realistic mock interviews with role switching.',
    gradient: 'var(--gradient-accent)',
  },
  {
    icon: FiBarChart2,
    title: 'Detailed Feedback',
    description: 'Get scored on clarity, technical depth, structure, pacing, and filler words.',
    gradient: 'var(--gradient-warm)',
  },
];

const stats = [
  { value: '5', label: 'Scoring Dimensions' },
  { value: 'AI', label: 'Powered Analysis' },
  { value: '∞', label: 'Practice Sessions' },
  { value: '0', label: 'Cost to You' },
];

const Landing = () => {
  const { user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className={styles.badge}>
            <FiCommand size={14} />
            <span>AI-Powered Interview Preparation</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className={styles.heroTitle}>
            Ace Your Next
            <br />
            <span className="gradient-text">Technical Interview</span>
          </motion.h1>
          <motion.p variants={itemVariants} className={styles.heroSubtitle}>
            Practice with AI-generated questions tailored to your role, get instant
            feedback on your responses, and track your improvement over time.
          </motion.p>
          <motion.div variants={itemVariants} className={styles.heroCta}>
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Go to Dashboard
                  <FiArrowRight />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Start Practicing Free
                    <FiArrowRight />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className={styles.statsRow}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need to <span className="gradient-text">prepare</span></h2>
          <p className={styles.sectionSubtitle}>
            A complete interview preparation toolkit powered by AI
          </p>
        </div>
        <motion.div 
          className={styles.featureGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, translateY: -5 }}
              className={`${styles.featureCard} glass-card`}
            >
              <div className={styles.featureIconWrapper} style={{ background: feature.gradient }}>
                <feature.icon size={24} color="black" />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How it <span className="gradient-text">works</span></h2>
        </div>
        <motion.div 
          className={styles.steps}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {[
            { icon: FiShield, title: 'Create your profile', desc: 'Set your target role and experience level so questions match your goals.' },
            { icon: FiMic, title: 'Start an interview', desc: 'Choose solo AI mode or join a peer room. Answer questions using your microphone.' },
            { icon: FiBarChart2, title: 'Get AI feedback', desc: 'Receive detailed scoring and actionable suggestions to improve.' },
            { icon: FiClock, title: 'Track progress', desc: 'Review past sessions and watch your scores trend upward over time.' },
          ].map((step, index) => (
            <motion.div 
              key={index} 
              className={styles.step}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 10 }}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div 
          className={`${styles.ctaCard} glass-card`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <h2 className={styles.ctaTitle}>Ready to ace your next interview?</h2>
          <p className={styles.ctaSubtitle}>Start practicing today — it's completely free.</p>
          <Link to={user ? '/dashboard' : '/register'}>
            <Button variant="primary" size="lg">
              {user ? 'Go to Dashboard' : 'Get Started'}
              <FiArrowRight />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <FiCommand className={styles.logoIcon} />
              <span>Interview<span className="gradient-text">AI</span></span>
            </div>
            <p className={styles.footerDesc}>
              The ultimate AI-powered interview preparation toolkit. Practice, learn, and land your dream job.
            </p>
          </div>
          
          <div className={styles.footerLinksGrid}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Product</h4>
              <Link to="/register" className={styles.footerLink}>Get Started</Link>
              <Link to="/interview" className={styles.footerLink}>Solo Practice</Link>
              <Link to="/peer" className={styles.footerLink}>Peer Interviews</Link>
              <Link to="/leaderboard" className={styles.footerLink}>Leaderboard</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Account</h4>
              <Link to="/dashboard" className={styles.footerLink}>Dashboard</Link>
              <Link to="/profile" className={styles.footerLink}>Profile</Link>
              <Link to="/history" className={styles.footerLink}>History</Link>
              <Link to="/login" className={styles.footerLink}>Sign In</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} InterviewAI. All rights reserved by Utsav Vasava.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
