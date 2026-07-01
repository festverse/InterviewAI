import { useState, useEffect } from 'react';
import { FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchLeaderboard = async (pageNum) => {
    try {
      setLoading(true);
      const res = await api.get(`/leaderboard?page=${pageNum}&limit=10`);
      if (res.data.success) {
        setUsers(res.data.data.leaderboard);
        setPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
        setTotalUsers(res.data.data.totalUsers);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <FiAward size={32} />
          </div>
          <h1 className={styles.title}>Global Leaderboard</h1>
          <p className={styles.subtitle}>See how you rank against other candidates in Competitive Coding Mode.</p>
        </div>

        <div className={`${styles.boardCard}`}>
          {loading ? (
            <Loader size="md" text="Loading rankings..." />
          ) : error ? (
            <div className="error-text">{error}</div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Candidate Name</th>
                    <th>Matches Played</th>
                    <th className={styles.eloCol}>ELO Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="4" className={styles.empty}>No candidates found.</td></tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={idx} className={idx < 3 && page === 1 ? styles[`top${idx + 1}`] : ''}>
                        <td>
                          {page === 1 && idx === 0 ? '🥇 1' : page === 1 && idx === 1 ? '🥈 2' : page === 1 && idx === 2 ? '🥉 3' : ((page - 1) * 10 + idx + 1)}
                        </td>
                        <td className={styles.name}>{user.name}</td>
                        <td>{user.stats?.sessionsCompleted || 0}</td>
                        <td className={styles.eloCell}>{user.eloRating}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  <FiChevronLeft /> Prev
                </Button>
                <span className={styles.pageInfo}>Page {page} of {totalPages || 1}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <FiChevronRight />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
