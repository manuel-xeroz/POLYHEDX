import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, Tag, Save, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Arena } from '../types';
import { mockArenas } from '../data/mockData';

const Admin: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Load mock data if arenas are empty
    if (state.arenas.length === 0) {
      dispatch({ type: 'SET_ARENAS', payload: mockArenas });
    }
  }, [dispatch, state.arenas.length]);

  // Update current time every second for countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const [newArena, setNewArena] = useState({
    title: '',
    description: '',
    category: 'crypto' as 'crypto' | 'sports' | 'culture',
    deadline: '',
    poolSize: 1000,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Countdown timer function
  const getCountdown = (deadline: Date) => {
    const now = currentTime;
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'EXPIRED';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleCreateArena = () => {
    if (!newArena.title || !newArena.description || !newArena.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const arena: Arena = {
      id: Date.now().toString(),
      title: newArena.title,
      description: newArena.description,
      category: newArena.category,
      deadline: new Date(newArena.deadline),
      poolSize: newArena.poolSize,
      yesVotes: 0,
      noVotes: 0,
      isResolved: false,
      participants: [],
    };

    dispatch({ type: 'ADD_ARENA', payload: arena });
    
    // Reset form
    setNewArena({
      title: '',
      description: '',
      category: 'crypto',
      deadline: '',
      poolSize: 1000,
    });
    setIsCreating(false);
  };

  const handleResolveArena = (arenaId: string, correctAnswer: boolean) => {
    const arena = state.arenas.find(a => a.id === arenaId);
    if (arena) {
      const updatedArena = {
        ...arena,
        isResolved: true,
        correctAnswer,
      };
      dispatch({ type: 'UPDATE_ARENA', payload: updatedArena });

      // Settle local trades persisted for this arena (demo payouts)
      try {
        const keyTrades = `polyhedx_arena_${arenaId}_trades`;
        const keyTxs = `polyhedx_arena_${arenaId}_txs`;
        const tradesRaw = localStorage.getItem(keyTrades);
        const txsRaw = localStorage.getItem(keyTxs);
        const trades = tradesRaw ? JSON.parse(tradesRaw) : [];
        const txs = txsRaw ? JSON.parse(txsRaw) : [];
        const settled = trades.map((t: any) => {
          const won = (correctAnswer && t.side === 'YES') || (!correctAnswer && t.side === 'NO');
          if (won) {
            // Dummy win payout: 1.5x stake
            const payout = Math.round(t.stake * 1.5);
            txs.unshift({ id: Date.now() + Math.random(), user: 'system', action: 'Payout', shares: 0, price: payout, time: 'settled' });
            return { ...t, status: 'won', payout };
          } else {
            // Refund insured portion only
            const payout = Math.round(t.stake * (t.coverage || 0));
            if (payout > 0) txs.unshift({ id: Date.now() + Math.random(), user: 'system', action: 'Insurance Payout', shares: 0, price: payout, time: 'settled' });
            return { ...t, status: 'lost', payout };
          }
        });
        localStorage.setItem(keyTrades, JSON.stringify(settled));
        localStorage.setItem(keyTxs, JSON.stringify(txs.slice(0, 50)));
      } catch {}
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-text mb-6">
            <span className="text-gradient">Admin</span> <span className="accent-gradient">Dashboard</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Manage prediction arenas and monitor platform activity
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-2xl font-black text-primary mb-2">{state.arenas.length}</div>
            <div className="text-sm text-text-secondary font-medium">Total Arenas</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-2xl font-black text-accent mb-2">
              {state.arenas.filter(a => !a.isResolved).length}
            </div>
            <div className="text-sm text-text-secondary font-medium">Active Arenas</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-2xl font-black text-success mb-2">
              {state.arenas.reduce((sum, arena) => sum + arena.participants.length, 0)}
            </div>
            <div className="text-sm text-text-secondary font-medium">Total Participants</div>
          </div>
          <div className="glass-card p-6 text-center hover:scale-102 transition-all duration-300">
            <div className="text-2xl font-black text-text mb-2">
              {state.arenas.reduce((sum, arena) => sum + arena.poolSize, 0).toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary font-medium">Total Pool (HBAR)</div>
          </div>
        </motion.div>

        {/* Create Arena */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-black text-text">Arena <span className="accent-gradient">Management</span></h2>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="gradient-button px-6 py-3 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{isCreating ? 'Cancel' : 'Create Arena'}</span>
            </button>
          </div>

          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card p-8 mb-8"
            >
              <h3 className="text-2xl font-bold text-text mb-6">Create New Arena</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newArena.title}
                    onChange={(e) => setNewArena({ ...newArena, title: e.target.value })}
                    className="w-full px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder-text-muted"
                    placeholder="e.g., BTC > $70k by Sunday?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Category *
                  </label>
                  <select
                    value={newArena.category}
                    onChange={(e) => setNewArena({ ...newArena, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
                  >
                    <option value="crypto">Crypto</option>
                    <option value="sports">Sports</option>
                    <option value="culture">Culture</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text mb-3">
                    Description *
                  </label>
                  <textarea
                    value={newArena.description}
                    onChange={(e) => setNewArena({ ...newArena, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder-text-muted"
                    placeholder="Describe the prediction question..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={newArena.deadline}
                    onChange={(e) => setNewArena({ ...newArena, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Pool Size (HBAR)
                  </label>
                  <input
                    type="number"
                    value={newArena.poolSize}
                    onChange={(e) => setNewArena({ ...newArena, poolSize: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
                    min="100"
                    step="100"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 bg-text-muted/20 text-text-muted rounded-2xl hover:bg-text-muted/30 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateArena}
                  className="gradient-button px-6 py-3 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Create Arena</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Arena List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-black text-text mb-8">All <span className="accent-gradient">Arenas</span></h2>
          <div className="space-y-4">
            {state.arenas.map((arena, index) => (
              <motion.div
                key={arena.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center space-x-3 mb-3">
                      <h3 className="text-lg font-bold text-text">{arena.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        arena.category === 'crypto' ? 'bg-warning/20 text-warning border border-warning/30' :
                        arena.category === 'sports' ? 'bg-success/20 text-success border border-success/30' :
                        'bg-accent/20 text-accent border border-accent/30'
                      }`}>
                        {arena.category.toUpperCase()}
                      </span>
                      {arena.isResolved && (
                        <span className="px-3 py-1 bg-text-muted/20 text-text-muted rounded-full text-xs font-bold border border-text-muted/30">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary mb-4 leading-relaxed">{arena.description}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">Deadline: {arena.deadline.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-warning" />
                        <span className={`font-bold ${getCountdown(arena.deadline) === 'EXPIRED' ? 'text-error' : 'text-warning'}`}>
                          {getCountdown(arena.deadline)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-accent" />
                        <span className="font-medium">Pool: {arena.poolSize.toLocaleString()} HBAR</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-success" />
                        <span className="font-medium">Participants: {arena.participants.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!arena.isResolved && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleResolveArena(arena.id, true)}
                        className="px-4 py-2 bg-gradient-to-r from-success/20 to-success/10 text-success rounded-2xl hover:from-success hover:to-success hover:text-white transition-all duration-300 text-sm font-bold border border-success/30"
                      >
                        Resolve: Yes
                      </button>
                      <button
                        onClick={() => handleResolveArena(arena.id, false)}
                        className="px-4 py-2 bg-gradient-to-r from-error/20 to-error/10 text-error rounded-2xl hover:from-error hover:to-error hover:text-white transition-all duration-300 text-sm font-bold border border-error/30"
                      >
                        Resolve: No
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
