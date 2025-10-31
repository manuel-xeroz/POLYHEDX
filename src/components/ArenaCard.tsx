import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { Arena } from '../types';
import { useApp } from '../context/AppContext';
import { formatTimeRemaining, formatHBAR, getCategoryColor, cn } from '../utils';

interface ArenaCardProps {
  arena: Arena;
  onPredict?: (arenaId: string, choice: boolean) => void;
}

const ArenaCard: React.FC<ArenaCardProps> = ({ arena, onPredict }) => {
  const { state, makePrediction } = useApp();
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const timeRemaining = formatTimeRemaining(arena.deadline);
  const totalVotes = arena.yesVotes + arena.noVotes;
  const yesPercentage = totalVotes > 0 ? (arena.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (arena.noVotes / totalVotes) * 100 : 0;

  const handlePredict = async (choice: boolean) => {
    if (!state.isConnected || !state.user) {
      alert('Please connect your wallet first');
      return;
    }

    if (arena.isResolved) {
      alert('This arena is already resolved');
      return;
    }

    if (new Date() > arena.deadline) {
      alert('This arena has expired');
      return;
    }

    setSelectedChoice(choice);
    setIsPredicting(true);

    try {
      // Mock prediction with 1 HBAR
      await makePrediction(arena.id, choice, 1);
      onPredict?.(arena.id, choice);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Prediction failed. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/arena/${arena.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleCardClick}
      className={cn(
        'arena-card h-full flex flex-col cursor-pointer',
        arena.isResolved && 'opacity-75',
        new Date() > arena.deadline && 'opacity-50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-bold',
                getCategoryColor(arena.category)
              )}
            >
              {arena.category.toUpperCase()}
            </span>
            {arena.isResolved && (
              <span className="px-3 py-1 bg-text-muted/20 text-text-muted rounded-full text-xs font-bold">
                RESOLVED
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-text mb-3 line-clamp-2 leading-tight">{arena.title}</h3>
          <p className="text-text-secondary mb-4 leading-relaxed line-clamp-4 text-sm">{arena.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs text-text-secondary font-medium">{timeRemaining}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs text-text-secondary font-medium">{arena.participants.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-xs text-text-secondary font-medium">{formatHBAR(arena.poolSize)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-secondary font-medium">
            {arena.participants.length > 0 ? Math.round((arena.participants.length / 100) * 100) : 0}% filled
          </span>
        </div>
      </div>

      {/* Vote Distribution */}
      {totalVotes > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-2 font-medium">
            <span>Yes ({arena.yesVotes})</span>
            <span>No ({arena.noVotes})</span>
          </div>
          <div className="flex h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-success to-success-dark transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="bg-gradient-to-r from-error to-error transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1"></div>

      {/* Prediction Buttons */}
      {!arena.isResolved && new Date() <= arena.deadline && (
        <div className="flex space-x-3 mt-auto">
          <button
            onClick={() => handlePredict(true)}
            disabled={isPredicting || selectedChoice !== null}
            className={cn(
              'prediction-button prediction-yes flex items-center justify-center',
              selectedChoice === true && 'bg-success text-white',
              isPredicting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isPredicting && selectedChoice === true ? (
              'Predicting...'
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>YES</span>
              </>
            )}
          </button>
          <button
            onClick={() => handlePredict(false)}
            disabled={isPredicting || selectedChoice !== null}
            className={cn(
              'prediction-button prediction-no flex items-center justify-center',
              selectedChoice === false && 'bg-error text-white',
              isPredicting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isPredicting && selectedChoice === false ? (
              'Predicting...'
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-2" />
                <span>NO</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Success Message */}
      {selectedChoice !== null && !isPredicting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-success/20 to-success/10 text-success rounded-2xl text-center border border-success/30"
        >
          ✅ Prediction submitted! Good luck!
        </motion.div>
      )}
    </motion.div>
  );
};

export default ArenaCard;
