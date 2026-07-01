import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiActivity, FiChevronRight, FiBriefcase, FiLayers } from 'react-icons/fi';
import { getSessions } from '../services/interviewService';
import Loader from '../components/common/Loader';
import styles from './SessionHistory.module.css';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        setError('Failed to load session history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div className="page"><Loader fullScreen text="Loading history..." /></div>;

  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Interview History</h1>
          <p className={styles.subtitle}>Review your past sessions and track your progress over time.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        {sessions.length === 0 && !error ? (
          <div className={`${styles.emptyState}`}>
            <FiActivity size={48} className={styles.emptyIcon} />
            <h3>No interviews yet</h3>
            <p>Start your first solo interview to see your history here.</p>
            <Link to="/interview" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Start Interview
            </Link>
          </div>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <Link to={`/history/${session._id}`} key={session._id} className={`${styles.sessionCard}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.typeIcon}>
                    {session.type === 'technical' ? <FiBriefcase size={20} /> : <FiLayers size={20} />}
                  </div>
                  <div>
                    <h3 className={styles.sessionType}>{session.type} Interview</h3>
                    <div className={styles.metaData}>
                      <span className={styles.metaItem}>
                        <FiClock size={14} /> {formatDate(session.createdAt || session.startedAt)}
                      </span>
                      <span className={styles.metaItem}>
                        {session.targetRole} • {session.experienceLevel}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardRight}>
                  <div className={styles.statusBadge}>
                    <span className={`${styles.statusDot} ${styles[session.status]}`}></span>
                    {session.status}
                  </div>
                  <FiChevronRight className={styles.chevron} size={24} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
