import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff, FiArrowRight, FiUser, FiInfo, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import useSocket from '../hooks/useSocket';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import styles from './PeerRoom.module.css';

const PeerRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { socket, isConnected, emit } = useSocket();
  const { transcript, interimTranscript, isListening, start, stop, reset } = useSpeechRecognition();

  const [room, setRoom] = useState(null);
  const [partnerTranscript, setPartnerTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const timerRef = useRef(null);

  // Determine current role based on user ID and room state
  const myRole = room ? (room.roles.interviewer === user?.id ? 'interviewer' : 'interviewee') : null;
  const partnerRole = myRole === 'interviewer' ? 'interviewee' : 'interviewer';
  const currentQuestionObj = room ? room.questions[room.currentQuestion] : null;

  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // React Router back button intercept workaround
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (e) => {
      const confirmLeave = window.confirm("Are you sure you want to leave the active interview? Your partner will be left waiting.");
      if (!confirmLeave) {
        window.history.pushState(null, null, window.location.pathname);
      } else {
        window.removeEventListener('popstate', handlePopState);
        window.history.back();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join Room
    emit('join-room', roomId);

    // Socket Event Listeners
    socket.on('room-joined', ({ room: roomData }) => setRoom(roomData));
    
    socket.on('both-joined', () => {
      setPartnerJoined(true);
      setPartnerDisconnected(false);
    });

    socket.on('interview-started', () => {
      setRoom(prev => ({ ...prev, status: 'active' }));
      startTimer();
    });

    socket.on('question-changed', ({ currentQuestion }) => {
      setRoom(prev => ({ ...prev, currentQuestion }));
      setPartnerTranscript('');
      reset();
      startTimer(); // reset timer
    });

    socket.on('transcript-updated', (data) => {
      setPartnerTranscript(data);
    });

    socket.on('roles-swapped', ({ room: newRoomData }) => {
      setRoom(newRoomData);
      setPartnerTranscript('');
      reset();
      stop();
      startTimer();
    });

    socket.on('interview-ended', () => {
      setRoom(prev => ({ ...prev, status: 'completed' }));
      stopTimer();
      stop();
    });

    socket.on('partner-disconnected', () => {
      setPartnerDisconnected(true);
      stopTimer();
      stop();
    });

    return () => {
      socket.off('room-joined');
      socket.off('both-joined');
      socket.off('interview-started');
      socket.off('question-changed');
      socket.off('transcript-updated');
      socket.off('roles-swapped');
      socket.off('interview-ended');
      socket.off('partner-disconnected');
      stopTimer();
      stop();
    };
  }, [socket, isConnected, emit, roomId, stop, reset]);

  // Transmit local transcript to partner if we are interviewee
  useEffect(() => {
    if (myRole === 'interviewee') {
      const fullText = transcript + (interimTranscript ? ' ' + interimTranscript : '');
      emit('submit-transcript', { roomId, data: fullText });
    }
  }, [transcript, interimTranscript, myRole, emit, roomId]);

  // Timer utils
  const startTimer = () => {
    stopTimer();
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Actions
  const handleStartInterview = () => {
    emit('start-interview', roomId);
  };

  const handleNextQuestion = () => {
    const nextIdx = room.currentQuestion + 1;
    const isMidpoint = nextIdx === Math.floor(room.questions.length / 2) && !room.swapped;
    const isEnd = nextIdx >= room.questions.length;

    if (isMidpoint) {
      emit('swap-roles', roomId);
    } else if (isEnd) {
      emit('end-interview', roomId);
    } else {
      emit('next-question', roomId);
    }
  };

  const toggleRecording = () => {
    if (isListening) stop();
    else start();
  };

  // Renders
  if (!room) return <div className="page"><Loader fullScreen text="Joining Room..." /></div>;

  if (room.status === 'completed') {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={`${styles.card}`} style={{ textAlign: 'center', padding: '3rem' }}>
            <FiCheckCircle size={64} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
            <h2>Interview Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You've both finished your turns. The AI is generating feedback.</p>
            <Button variant="primary" onClick={() => navigate('/history')}>Go to History Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.container}>
        
        {partnerDisconnected && (
          <div className={styles.disconnectAlert}>
            <FiInfo size={20} />
            Partner disconnected. Waiting for them to return...
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.rolesRow}>
            <div className={`${styles.roleBadge} ${myRole === 'interviewer' ? styles.activeRole : ''}`}>
              <FiUser /> You: <span className={styles.roleName}>{myRole}</span>
            </div>
            <div className={styles.timer}>{formatTime(timer)}</div>
            <div className={`${styles.roleBadge} ${partnerRole === 'interviewer' ? styles.activeRole : ''}`}>
              <FiUser /> Partner: <span className={styles.roleName}>{partnerRole}</span>
            </div>
          </div>
          {room.status === 'waiting' && (
            <div className={styles.waitingNotice}>
              {!partnerJoined ? (
                <span>Waiting for partner to join...</span>
              ) : (
                <span>Partner joined! Ready to begin.</span>
              )}
              {myRole === 'interviewer' && partnerJoined && !partnerDisconnected && (
                <Button variant="primary" size="sm" onClick={handleStartInterview} style={{ marginLeft: '1rem' }}>
                  Start Interview
                </Button>
              )}
            </div>
          )}
        </div>

        {room.status === 'active' && currentQuestionObj && (
          <div className={styles.activeArea}>
            
            {/* Question Display */}
            <div className={`${styles.questionCard}`}>
              <span className={styles.categoryBadge}>{currentQuestionObj.category}</span>
              <h2 className={styles.questionText}>
                {currentQuestionObj.text}
              </h2>
            </div>

            {/* Main Action Area */}
            <div className={styles.workspace}>
              {myRole === 'interviewer' ? (
                <div className={`${styles.panel}`}>
                  <h3>Live Transcript (Partner's Answer)</h3>
                  <div className={styles.transcriptBox}>
                    {partnerTranscript ? partnerTranscript : <span className={styles.placeholder}>Waiting for partner to speak...</span>}
                  </div>
                  <div className={styles.controlsRight}>
                    <Button variant="primary" onClick={handleNextQuestion}>
                      {room.currentQuestion + 1 === Math.floor(room.questions.length / 2) && !room.swapped ? 'Swap Roles' : 
                       room.currentQuestion === room.questions.length - 1 ? 'End Interview' : 'Next Question'} 
                      <FiArrowRight />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`${styles.panel}`}>
                  <h3>Your Answer</h3>
                  <div className={styles.transcriptBox}>
                    {transcript || interimTranscript ? (
                      <>
                        <span className={styles.finalText}>{transcript}</span>
                        <span className={styles.interimText}>{interimTranscript}</span>
                      </>
                    ) : (
                      <span className={styles.placeholder}>Click the microphone when asked the question...</span>
                    )}
                  </div>
                  <div className={styles.controlsCenter}>
                    <button 
                      className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                      onClick={toggleRecording}
                    >
                      {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
                    </button>
                    <p className={styles.micHint}>{isListening ? 'Recording...' : 'Click to answer'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerRoom;
