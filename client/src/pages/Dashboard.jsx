import { Link } from 'react-router-dom';
import { FiMic, FiUsers, FiTrendingUp, FiClock, FiArrowRight, FiZap } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import Button from '../components/common/Button';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuthStore();

  const quickActions = [
    {
      icon: FiMic,
      title: 'Solo Interview',
      description: 'Practice with AI-generated questions and get instant feedback',
      link: '/interview',
      gradient: 'var(--gradient-primary)',
    },
    {
      icon: FiUsers,
      title: 'Peer Interview',
      description: 'Match with another candidate for a realistic mock interview',
      link: '/peer',
      gradient: 'var(--gradient-accent)',
    },
  ];

  return (
    <div className="page">
      <div className={styles.container}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className={styles.welcomeSubtitle}>
              {user?.targetRole
                ? `Keep preparing for your ${user.targetRole} role. You're doing great!`
                : 'Set your target role in your profile to get tailored questions.'}
            </p>
          </div>
          <div className={styles.welcomeGlow} />
        </div>

        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statIcon}><FiZap /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user?.stats?.sessionsCompleted || 0}</span>
              <span className={styles.statLabel}>Sessions Completed</span>
            </div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statIcon}><FiTrendingUp /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {user?.stats?.averageScore ? user.stats.averageScore.toFixed(1) : '—'}
              </span>
              <span className={styles.statLabel}>Average Score</span>
            </div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statIcon}><FiClock /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user?.experienceLevel || 'junior'}</span>
              <span className={styles.statLabel}>Experience Level</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Start Practicing</h2>
          <div className={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <div key={index} className={`${styles.actionCard} glass-card`}>
                <div className={styles.actionIconWrapper} style={{ background: action.gradient }}>
                  <action.icon size={28} color="white" />
                </div>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDesc}>{action.description}</p>
                {action.comingSoon ? (
                  <span className={styles.comingSoon}>Coming in Phase 4</span>
                ) : (
                  <Link to={action.link}>
                    <Button variant="secondary" size="sm">
                      Start Now <FiArrowRight />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Sessions Placeholder */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Sessions</h2>
            <Link to="/history" className={styles.viewAll}>View All <FiArrowRight size={14} /></Link>
          </div>
          <div className={`${styles.emptyState} glass-card`}>
            <FiClock size={40} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No sessions yet</h3>
            <p className={styles.emptyDesc}>Complete your first mock interview to see your results here.</p>
            <Link to="/interview">
              <Button variant="primary" size="sm">Start Your First Session</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
