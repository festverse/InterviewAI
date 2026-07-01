import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBriefcase, FiLayers, FiX, FiAlertTriangle, FiCode } from 'react-icons/fi';
import useSocket from '../hooks/useSocket';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import api from '../services/api';
import styles from './PeerLobby.module.css';

const PeerLobby = () => {
  const { socket, isConnected, emit } = useSocket();
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);
  const [interviewType, setInterviewType] = useState('technical');
  const [elapsed, setElapsed] = useState(0);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeRoomType, setActiveRoomType] = useState('technical');

  useEffect(() => {
    // Check if user has an active room
    api.get('/api/interview/peer/current').then(res => {
      if (res.data.success && res.data.data) {
        setActiveRoomId(res.data.data.roomId);
        setActiveRoomType(res.data.data.type || 'technical');
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('match-found', ({ roomId, type }) => {
      setIsWaiting(false);
      navigate(type === 'competitive' ? `/coding-room/${roomId}` : `/peer-room/${roomId}`);
    });

    return () => {
      socket.off('match-found');
    };
  }, [socket, navigate]);

  useEffect(() => {
    let interval;
    if (isWaiting) {
      interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isWaiting]);

  const handleJoinQueue = () => {
    setIsWaiting(true);
    emit('join-queue', interviewType);
  };

  const handleLeaveQueue = () => {
    setIsWaiting(false);
    emit('leave-queue');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="page">
      <div className={styles.container}>
        {activeRoomId ? (
          <div className={`${styles.lobbyCard}`} style={{ border: '1px solid var(--color-warning)' }}>
            <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(255,165,0,0.2)', color: 'var(--color-warning)' }}>
              <FiAlertTriangle size={32} />
            </div>
            <h1 className={styles.title}>Interview in Progress!</h1>
            <p className={styles.subtitle}>You left an active peer interview. Your partner might be waiting for you.</p>
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate(activeRoomType === 'competitive' ? `/coding-room/${activeRoomId}` : `/peer-room/${activeRoomId}`)}>
              Rejoin Room
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveRoomId(null)} style={{ marginTop: '1rem', width: '100%' }}>
              Abandon Room & Start New
            </Button>
          </div>
        ) : !isWaiting ? (
          <div className={`${styles.lobbyCard}`}>
            <div className={styles.iconWrapper}><FiUsers size={32} /></div>
            <h1 className={styles.title}>Peer Interview Lobby</h1>
            <p className={styles.subtitle}>Practice live with another person. You will both take turns being the interviewer and the interviewee.</p>
            
            <h3 className={styles.sectionTitle}>Select Type:</h3>
            <div className={styles.typeGrid}>
              <button 
                className={`${styles.typeOption} ${interviewType === 'technical' ? styles.selected : ''}`}
                onClick={() => setInterviewType('technical')}
              >
                <FiBriefcase size={24} />
                <span>Technical</span>
              </button>
              <button 
                className={`${styles.typeOption} ${interviewType === 'behavioral' ? styles.selected : ''}`}
                onClick={() => setInterviewType('behavioral')}
              >
                <FiLayers size={24} />
                <span>Behavioral</span>
              </button>
              <button 
                className={`${styles.typeOption} ${interviewType === 'competitive' ? styles.selected : ''}`}
                onClick={() => setInterviewType('competitive')}
              >
                <FiCode size={24} />
                <span>Coding (ELO)</span>
              </button>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleJoinQueue} disabled={!isConnected}>
              {isConnected ? 'Find a Match' : 'Connecting to Server...'}
            </Button>
          </div>
        ) : (
          <div className={`${styles.waitingCard}`}>
            <Loader size="lg" text="Searching for a partner..." />
            <div className={styles.timer}>{formatTime(elapsed)}</div>
            <p className={styles.waitingText}>We are matching you with someone practicing {interviewType} interviews.</p>
            
            <Button variant="outline" onClick={handleLeaveQueue} className={styles.cancelBtn}>
              <FiX /> Cancel Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerLobby;
