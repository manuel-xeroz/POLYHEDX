import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Arenas from './pages/Arenas';
import ArenaDetails from './pages/ArenaDetails';
import Leaderboard from './pages/Leaderboard';
import Results from './pages/Results';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen hero-gradient">
          <Header />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/arenas" element={<Arenas />} />
            <Route path="/arena/:id" element={<ArenaDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

// Protect routes that require a connected wallet
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { state } = useApp();
  const { isConnected } = useAccount();
  if (!(state.isConnected || isConnected)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default App;
