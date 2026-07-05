import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Layout & Common
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SoloInterview from './pages/SoloInterview';
import SessionHistory from './pages/SessionHistory';
import SessionDetail from './pages/SessionDetail';
import PeerLobby from './pages/PeerLobby';
import PeerRoom from './pages/PeerRoom';
import CodingRoom from './pages/CodingRoom';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [initialize]);

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Phase 2 Routes */}
          <Route path="/interview" element={
            <ProtectedRoute>
              <SoloInterview />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <SessionHistory />
            </ProtectedRoute>
          } />
          <Route path="/history/:sessionId" element={
            <ProtectedRoute>
              <SessionDetail />
            </ProtectedRoute>
          } />

          {/* Phase 4 Routes */}
          <Route path="/peer" element={
            <ProtectedRoute>
              <PeerLobby />
            </ProtectedRoute>
          } />
          <Route path="/peer-room/:roomId" element={
            <ProtectedRoute>
              <PeerRoom />
            </ProtectedRoute>
          } />
          <Route path="/coding-room/:roomId" element={
            <ProtectedRoute>
              <CodingRoom />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
