import styles from './ScoreCard.module.css';

const ScoreCard = ({ score = 0, label = "Overall Score" }) => {
  const percentage = (score / 10) * 100;
  
  // Determine color based on score
  let colorClass = styles.good;
  if (score < 5) colorClass = styles.needsWork;
  else if (score < 8) colorClass = styles.average;

  return (
    <div className={styles.card}>
      <div className={styles.circle}>
        <svg viewBox="0 0 36 36" className={styles.circularChart}>
          <path className={styles.circleBg}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path className={`${styles.circlePath} ${colorClass}`}
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className={styles.scoreText}>
          <span className={styles.score}>{score.toFixed(1)}</span>
          <span className={styles.maxScore}>/10</span>
        </div>
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default ScoreCard;
