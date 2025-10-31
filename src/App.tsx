import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
            <Route path="/results" element={<Results />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
