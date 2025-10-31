import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LeaderboardCard from '../components/LeaderboardCard';
import { mockLeaderboard } from '../data/mockData';

const Leaderboard: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    dispatch({ type: 'SET_LEADERBOARD', payload: mockLeaderboard });
  }, [dispatch]);

  const rest = state.leaderboard;

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-text mb-6">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Top predictors competing for the ultimate prize. Will you be the next champion?
          </p>
        </motion.div>

        {/* Podium removed per request */}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-primary mb-2">
              {state.leaderboard.length}
            </div>
            <div className="text-sm text-text-secondary font-medium">Total Players</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-accent mb-2">
              {state.leaderboard.reduce((sum, entry) => sum + entry.totalRewards, 0).toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary font-medium">Total Rewards (HBAR)</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-success mb-2">
              {Math.round(state.leaderboard.reduce((sum, entry) => sum + entry.winRate, 0) / state.leaderboard.length)}%
            </div>
            <div className="text-sm text-text-secondary font-medium">Average Win Rate</div>
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-black text-text">Full <span className="accent-gradient">Rankings</span></h2>
            <div className="flex items-center space-x-2 text-sm text-text-secondary bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl px-4 py-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-medium">Updated in real-time</span>
            </div>
          </div>

          <div className="grid gap-4">
            {rest.map((entry, index) => (
              <LeaderboardCard
                key={entry.user.id}
                entry={{ ...entry, rank: index + 4 }}
                index={index}
              />
            ))}
          </div>

          {state.leaderboard.length === 0 && (
            <div className="text-center py-16">
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="text-primary mb-6">
                  <Trophy className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-4">No rankings yet</h3>
                <p className="text-text-secondary leading-relaxed">Be the first to make predictions and climb the leaderboard!</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
