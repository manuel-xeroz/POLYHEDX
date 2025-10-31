import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { formatAddress, formatHBAR } from '../utils';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  index: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ entry, index }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-warning to-warning/80 text-black';
      case 2:
        return 'bg-gradient-to-r from-text-muted to-text-muted/80 text-white';
      case 3:
        return 'bg-gradient-to-r from-accent to-accent/80 text-white';
      default:
        return 'bg-glass-bg text-text border border-glass-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-4 hover:shadow-xl transition-all duration-300 hover:scale-102"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${getRankColor(entry.rank)} shadow-md`}>
            {getRankIcon(entry.rank)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-text">{formatAddress(entry.user.address)}</span>
              {entry.rank <= 3 && (
                <span className="text-xs bg-gradient-to-r from-accent/20 to-accent/10 text-accent px-2 py-1 rounded-full border border-accent/30 font-bold">
                  TOP {entry.rank}
                </span>
              )}
            </div>
            <div className="text-xs text-text-secondary">
              {entry.correctPredictions} correct predictions
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-black text-gradient">
            {formatHBAR(entry.totalRewards)}
          </div>
          <div className="text-xs text-text-secondary">
            {entry.winRate}% win rate
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Win Rate</span>
          <span>{entry.winRate}%</span>
        </div>
        <div className="w-full bg-background-tertiary rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${entry.winRate}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;
