import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import useAuthStore from '../stores/authStore';
import useSocket from '../hooks/useSocket';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import styles from './CodingRoomStyles.module.css';

const CodingRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { socket, isConnected, emit } = useSocket();

  const [room, setRoom] = useState(null);
  const [code, setCode] = useState('// Write your code here\n\nfunction twoSum(nums, target) {\n  \n}');
  const [partnerCode, setPartnerCode] = useState('// Partner is typing...');
  
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle | queued | processing | result
  const [submissionResult, setSubmissionResult] = useState(null);
  
  // Basic warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (e) => {
      if (window.confirm("Are you sure you want to leave the active match? You will lose ELO rating!")) {
        window.removeEventListener('popstate', handlePopState);
        window.history.back();
      } else {
        window.history.pushState(null, null, window.location.pathname);
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

    emit('join-room', roomId);

    socket.on('room-joined', ({ room: roomData }) => {
      setRoom(roomData);
    });

    socket.on('code-sync', ({ userId, code }) => {
      if (userId !== user?.id) {
        setPartnerCode(code);
      }
    });

    socket.on('submission-queued', () => {
      setSubmissionStatus('queued');
    });

    socket.on('submission-result', (result) => {
      if (result.userId === user?.id) {
        setSubmissionStatus('result');
        setSubmissionResult(result);
      } else if (result.passed) {
        // Partner won!
        alert("Your partner has completed the problem and won the match!");
        navigate('/leaderboard');
      }
    });

    return () => {
      socket.off('room-joined');
      socket.off('code-sync');
      socket.off('submission-queued');
      socket.off('submission-result');
    };
  }, [socket, isConnected, emit, roomId, user?.id, navigate]);

  const handleEditorChange = (value) => {
    setCode(value);
    emit('sync-code', { roomId, code: value });
  };

  const handleSubmit = () => {
    setSubmissionStatus('processing');
    emit('submit-code', { roomId, code });
  };

  if (!room) return <div className="page"><Loader fullScreen text="Entering Arena..." /></div>;

  const currentQuestionObj = room.questions[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.statusInfo}>
          <h2>Competitive Match</h2>
          <span className={styles.badge}>{room.status.toUpperCase()}</span>
        </div>
        <div className={styles.actions}>
          {submissionStatus === 'queued' && <span className={styles.queuedText}>Queued for execution...</span>}
          {submissionStatus === 'result' && (
            <span className={submissionResult?.passed ? styles.passed : styles.failed}>
              {submissionResult.message} ({submissionResult.executionTime}ms) 
              {submissionResult.eloChange > 0 ? ` +${Math.round(submissionResult.eloChange)} ELO` : ''}
            </span>
          )}
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={submissionStatus === 'queued' || submissionStatus === 'processing' || submissionResult?.passed}
          >
            {submissionStatus === 'queued' || submissionStatus === 'processing' ? 'Submitting...' : 'Submit Code'}
          </Button>
        </div>
      </div>

      <div className={styles.splitView}>
        {/* Left Side - Problem Description */}
        <div className={`${styles.pane} ${styles.problemPane}`}>
          <h3 className={styles.problemTitle}>{currentQuestionObj?.question}</h3>
          <p className={styles.problemDesc}>{currentQuestionObj?.description}</p>
          
          <div className={styles.testCases}>
            <h4>Test Cases</h4>
            {currentQuestionObj?.testCases.map((tc, idx) => (
              <div key={idx} className={styles.testCase}>
                <strong>Input:</strong> <pre>{tc.input}</pre>
                <strong>Expected:</strong> <pre>{tc.expectedOutput}</pre>
              </div>
            ))}
          </div>

          <div className={styles.partnerView}>
            <h4>Partner's Progress (Live Sync)</h4>
            <div className={styles.partnerEditor}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={partnerCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 12
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Code Editor */}
        <div className={`${styles.pane} ${styles.editorPane}`}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnPaste: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodingRoom;

