import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';
import { getSessionById } from '../services/interviewService';
import RadarChart from '../components/charts/RadarChart';
import ScoreCard from '../components/charts/ScoreCard';
import Loader from '../components/common/Loader';
import styles from './SessionDetail.module.css';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getSessionById(sessionId);
        setData(response); // { session, feedback }
      } catch (err) {
        setError('Failed to load session details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [sessionId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div className="page"><Loader fullScreen text="Loading session details..." /></div>;
  
  if (error || !data) {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className="" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-error)' }}>{error || 'Session not found'}</h2>
            <Link to="/history" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to History</Link>
          </div>
        </div>
      </div>
    );
  }

  const { session, feedback } = data;

  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.topNav}>
          <Link to="/history" className={styles.backLink}>
            <FiArrowLeft /> Back to History
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>{session.type} Interview</h1>
          <div className={styles.metaData}>
            <span className={styles.metaItem}>
              <FiClock /> {formatDate(session.createdAt || session.startedAt)}
            </span>
            <span className={styles.metaItem}>
              <FiUser /> {session.targetRole} • {session.experienceLevel}
            </span>
          </div>
        </div>

        {session.status !== 'completed' || !feedback ? (
          <div className="" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>Interview Incomplete</h2>
            <p style={{ color: 'var(--text-secondary)' }}>This session was abandoned or interrupted before feedback could be generated.</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsGrid}>
              <div className={`${styles.overviewCard}`}>
                <ScoreCard score={feedback.overallScore} label="Overall Rating" />
                <div className={styles.chartWrapper}>
                  <RadarChart scores={feedback.scores} />
                </div>
              </div>

              <div className={styles.detailsColumn}>
                <div className={`${styles.summaryCard}`}>
                  <h3 className={styles.sectionTitle}>AI Summary</h3>
                  <p className={styles.summaryText}>{feedback.summary}</p>
                </div>

                <div className={`${styles.suggestionsCard}`}>
                  <h3 className={styles.sectionTitle}>Key Suggestions</h3>
                  <ul className={styles.suggestionsList}>
                    {feedback.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>Transcript & Feedback</h3>
            <div className={styles.qaList}>
              {session.questions.map((q, i) => {
                const answerObj = session.transcript.find(t => t.questionIndex === i);
                const feedbackObj = feedback.perQuestion.find(f => f.questionIndex === i);
                
                return (
                  <div key={i} className={`${styles.qaCard}`}>
                    <div className={styles.questionSection}>
                      <span className={styles.categoryBadge}>{q.category}</span>
                      <h4>Q{i + 1}: {q.text}</h4>
                    </div>
                    
                    <div className={styles.answerSection}>
                      <h5>Your Answer:</h5>
                      <p className={styles.transcriptText}>
                        {answerObj ? answerObj.answer : <em>No answer recorded.</em>}
                      </p>
                    </div>

                    {feedbackObj && (
                      <div className={styles.feedbackSection}>
                        <div className={styles.feedbackHeader}>
                          <h5>Feedback:</h5>
                          <span className={styles.qaScore}>{feedbackObj.score}/10</span>
                        </div>
                        <p>{feedbackObj.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
