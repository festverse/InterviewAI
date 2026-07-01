import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff, FiCheck, FiArrowRight, FiPlay, FiBriefcase, FiLayers, FiRefreshCcw, FiVolume2, FiVolumeX } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { startInterview, submitAnswer, analyzeInterview } from '../services/interviewService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import RadarChart from '../components/charts/RadarChart';
import ScoreCard from '../components/charts/ScoreCard';
import styles from './SoloInterview.module.css';

const SoloInterview = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { transcript, interimTranscript, isListening, isSupported, start, stop, reset } = useSpeechRecognition();
  const { speak, cancel, isMuted, toggleMute } = useTextToSpeech();
  
  // State
  const [step, setStep] = useState('setup'); // setup, ready, active, analyzing, results
  const [interviewType, setInterviewType] = useState('technical');
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Timer tracking
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Stop timer and mic when unmounting
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stop();
      cancel();
    };
  }, [stop, cancel]);

  // Setup Screen
  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const targetRole = user?.targetRole || 'Software Engineer';
      const experienceLevel = user?.experienceLevel || 'junior';
      
      const newSession = await startInterview(interviewType, targetRole, experienceLevel);
      setSession(newSession);
      setStep('ready');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Check quota or LLM key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Begin actual questions
  const beginQuestions = () => {
    setStep('active');
    setCurrentQuestionIndex(0);
    reset();
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  // Trigger TTS when entering 'active' step or changing questions
  useEffect(() => {
    if (step === 'active' && session?.questions) {
      const text = session.questions[currentQuestionIndex].text;
      speak(text);
    }
  }, [step, currentQuestionIndex, session, speak]);

  // Toggle Microphone
  const toggleRecording = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  // Submit Answer & Go to Next
  const handleNext = async () => {
    try {
      // Pause timer & mic
      clearInterval(timerRef.current);
      stop();
      setIsLoading(true);

      const finalAnswer = transcript + (interimTranscript ? ' ' + interimTranscript : '');
      
      await submitAnswer(session.sessionId, currentQuestionIndex, finalAnswer, timer);

      if (currentQuestionIndex < session.questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        reset();
        setTimer(0);
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        setIsLoading(false);
      } else {
        // Finished all questions!
        setStep('analyzing');
        const feedbackData = await analyzeInterview(session.sessionId);
        setFeedback(feedbackData);
        setStep('results');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer.');
      setIsLoading(false);
    }
  };

  // Format timer MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isSupported) {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={`${styles.card}`}>
            <h2>Speech Recognition Not Supported</h2>
            <p>Your browser doesn't support the Web Speech API. Please try Chrome, Edge, or Safari.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER STEPS ---

  if (step === 'setup') {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={`${styles.setupCard}`}>
            <h1 className={styles.title}>Start Solo Interview</h1>
            <p className={styles.subtitle}>Our AI will generate tailored questions based on your profile.</p>
            
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.profileSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Target Role</span>
                <span className={styles.summaryValue}>{user?.targetRole || 'Not Set (Default: SWE)'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Experience</span>
                <span className={styles.summaryValue} style={{ textTransform: 'capitalize' }}>{user?.experienceLevel || 'Junior'}</span>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>Select Interview Type:</h3>
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
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={handleStartInterview} 
              isLoading={isLoading}
            >
              Generate Questions <FiArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'ready') {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={`${styles.readyCard}`}>
            <div className={styles.successIcon}><FiCheck size={32} /></div>
            <h2>Questions Generated!</h2>
            <p>We've created {session.questions.length} {interviewType} questions for you.</p>
            <ul className={styles.rulesList}>
              <li>Ensure you are in a quiet environment.</li>
              <li>Speak clearly into your microphone.</li>
              <li>You can pause recording at any time.</li>
            </ul>
            <Button variant="primary" size="lg" onClick={beginQuestions}>
              <FiPlay /> Start Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'active') {
    const currentQuestion = session.questions[currentQuestionIndex];
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={styles.progressHeader}>
            <span className={styles.questionCounter}>Question {currentQuestionIndex + 1} of {session.questions.length}</span>
            <span className={styles.timer}>{formatTime(timer)}</span>
          </div>
          
          <div className={`${styles.questionCard}`}>
            <div className={styles.questionCardHeader}>
              <span className={styles.categoryBadge}>{currentQuestion.category}</span>
              <button 
                className={styles.volumeToggle} 
                onClick={toggleMute}
                title={isMuted ? "Unmute AI" : "Mute AI"}
              >
                {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </button>
            </div>
            <h2 className={styles.questionText}>{currentQuestion.text}</h2>
          </div>

          <div className={`${styles.recordingSection}`}>
            <div className={styles.transcriptBox}>
              {transcript || interimTranscript ? (
                <>
                  <span className={styles.finalText}>{transcript}</span>
                  <span className={styles.interimText}>{interimTranscript}</span>
                </>
              ) : (
                <span className={styles.placeholderText}>Click the microphone and start speaking...</span>
              )}
            </div>
            
            <div className={styles.controls}>
              <button 
                className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                onClick={toggleRecording}
                disabled={isLoading}
              >
                {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
              </button>
              
              <Button 
                variant="primary" 
                onClick={handleNext} 
                isLoading={isLoading}
                disabled={(!transcript && !interimTranscript) && !isLoading}
              >
                {currentQuestionIndex === session.questions.length - 1 ? 'Finish & Analyze' : 'Next Question'} <FiArrowRight />
              </Button>
            </div>
          </div>
          {error && <div className={styles.errorAlert} style={{ marginTop: '1rem' }}>{error}</div>}
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="page">
        <Loader fullScreen text="AI is analyzing your responses... This may take a minute." size="lg" />
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="page">
        <div className={styles.container}>
          <div className={styles.resultsHeader}>
            <h1 className={styles.title}>Interview Results</h1>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          <div className={styles.resultsGrid}>
            <div className={`${styles.overviewCard}`}>
              <ScoreCard score={feedback.overallScore} label="Overall Rating" />
              <div className={styles.chartWrapper}>
                <RadarChart scores={feedback.scores} />
              </div>
            </div>

            <div className={styles.detailsColumn}>
              <div className={`${styles.summaryCard}`}>
                <h3 className={styles.sectionTitle}>Summary</h3>
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

          <h3 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Detailed Breakdown</h3>
          <div className={styles.qaList}>
            {feedback.perQuestion.map((pq, i) => (
              <div key={i} className={`${styles.qaCard}`}>
                <div className={styles.qaHeader}>
                  <h4>Q{i + 1}: {session.questions[i].text}</h4>
                  <span className={styles.qaScore}>{pq.score}/10</span>
                </div>
                <div className={styles.qaFeedback}>
                  <p>{pq.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SoloInterview;
