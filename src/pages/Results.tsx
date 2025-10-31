import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Trophy, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NFTCard from '../components/NFTCard';
import { mockArenas, mockNFTs } from '../data/mockData';
import { formatHBAR } from '../utils';

const Results: React.FC = () => {
  const { state, dispatch } = useApp();
  const [claimedNFTs, setClaimedNFTs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (state.arenas.length === 0) {
      dispatch({ type: 'SET_ARENAS', payload: mockArenas });
    }
    if (state.nfts.length === 0) {
      dispatch({ type: 'SET_NFTS', payload: mockNFTs });
    }
  }, [dispatch, state.arenas.length, state.nfts.length]);

  // Build activity from local trades across arenas
  const trades = state.arenas.flatMap((arena) => {
    try {
      const raw = localStorage.getItem(`polyhedx_arena_${arena.id}_trades`);
      const arr = raw ? JSON.parse(raw) : [];
      return arr.map((t: any) => ({
        arenaId: arena.id,
        title: arena.title,
        correctAnswer: arena.correctAnswer,
        isResolved: arena.isResolved,
        userPrediction: t.side === 'YES',
        stake: t.stake,
        coverage: t.coverage || 0,
        premium: t.premium || 0,
        payout: t.payout || 0,
        status: t.status || 'open',
        timestamp: new Date(t.timestamp || Date.now()),
      }));
    } catch {
      return [] as any[];
    }
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Derive stats
  const totalRewards = trades.filter(t => t.status !== 'open').reduce((sum, t) => sum + (t.status === 'won' ? t.payout : 0), 0);
  const winCount = trades.filter(t => t.status === 'won').length;
  const totalPredictions = trades.length;
  const winRate = totalPredictions > 0 ? (winCount / totalPredictions) * 100 : 0;

  const handleClaimNFT = (nftId: string) => {
    setClaimedNFTs(prev => new Set(Array.from(prev).concat(nftId)));
    console.log(`Claiming NFT: ${nftId}`);
  };

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
            <span className="text-gradient">My</span> <span className="accent-gradient">Activity</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Your predictions, outcomes and rewards in one place
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-success mb-2">{winCount}</div>
            <div className="text-sm text-text-secondary font-medium">Correct Predictions</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-accent mb-2">{formatHBAR(totalRewards)}</div>
            <div className="text-sm text-text-secondary font-medium">Total Rewards</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-primary mb-2">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-text-secondary font-medium">Win Rate</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-3xl font-black text-text mb-2">{state.nfts.length}</div>
            <div className="text-sm text-text-secondary font-medium">NFTs Earned</div>
          </div>
        </motion.div>

        {/* Your Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black text-text mb-8">Your <span className="accent-gradient">Trades</span></h2>
          <div className="space-y-4">
            {trades.length === 0 && (
              <div className="glass-card p-6 text-center text-text-secondary">No trades yet</div>
            )}
            {trades.map((t, index) => (
              <motion.div
                key={`${t.arenaId}-${index}-${t.timestamp.getTime()}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-text flex-1">{t.title}</h3>
                      <div className="ml-4">
                        {t.status === 'won' ? (
                          <span className="px-2 py-1 bg-success/20 text-success rounded-full text-xs font-bold border border-success/30">WON</span>
                        ) : t.status === 'lost' ? (
                          <span className="px-2 py-1 bg-error/20 text-error rounded-full text-xs font-bold border border-error/30">LOST</span>
                        ) : (
                          <span className="px-2 py-1 bg-text-muted/20 text-text-muted rounded-full text-xs font-bold border border-text-muted/30">PENDING</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-text-secondary mb-3">
                      <span>Your prediction: <span className="font-semibold text-text">{t.userPrediction ? 'Yes' : 'No'}</span></span>
                      {t.isResolved && (
                        <span>Correct answer: <span className="font-semibold text-text">{t.correctAnswer ? 'Yes' : 'No'}</span></span>
                      )}
                      <span>Stake: <span className="font-semibold text-text">{formatHBAR(t.stake)}</span></span>
                      {t.coverage > 0 && (
                        <span>Coverage: <span className="font-semibold text-text">{Math.round(t.coverage * 100)}%</span></span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-text-muted">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        <span>Placed: {t.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {t.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        {t.isResolved && <span>Resolved</span>}
                      </div>
                      <div className={`text-lg font-bold ${t.status === 'won' ? 'text-success' : t.status === 'lost' ? 'text-error' : 'text-text-secondary'}`}>
                        {t.status === 'won' ? `+${formatHBAR(t.payout)}` : t.status === 'lost' ? `-${formatHBAR(Math.max(0, t.stake - t.payout))}` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NFT Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-black text-text">NFT <span className="text-gradient">Rewards</span></h2>
            <div className="flex items-center space-x-2 text-sm text-text-secondary bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl px-4 py-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="font-medium">Earned for correct predictions</span>
            </div>
          </div>

          {state.nfts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.nfts.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NFTCard
                    nft={nft}
                    onClaim={handleClaimNFT}
                    isClaimed={claimedNFTs.has(nft.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="text-primary mb-6">
                  <Gift className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-4">No NFTs yet</h3>
                <p className="text-text-secondary leading-relaxed">Make correct predictions to earn exclusive NFTs!</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Achievement Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold text-text">Achievement Summary</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-success mb-2">{winCount}</div>
              <div className="text-sm text-gray-600">Correct Predictions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">{formatHBAR(totalRewards)}</div>
              <div className="text-sm text-gray-600">Total Rewards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{winRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="gradient-button px-8 py-3 flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Continue Predicting</span>
            </button>
            <button className="glass-card px-8 py-3 text-text font-semibold hover:shadow-lg transition-all duration-300">
              View Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
