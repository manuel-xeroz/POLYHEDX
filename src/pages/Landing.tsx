import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gift, Zap, Shield, ShieldCheck, Brain, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Arena } from '../types';
import ArenaCard from '../components/ArenaCard';
import { mockArenas } from '../data/mockData';

const Landing: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Seed mock data only if no arenas are in state (preserve localStorage)
    if (state.arenas.length === 0) {
      dispatch({ type: 'SET_ARENAS', payload: mockArenas });
    }
  }, [dispatch, state.arenas.length]);

  const featuredArenas: Arena[] = (state.arenas.length > 0 ? state.arenas : mockArenas)
    .filter((a: Arena) => !a.isResolved)
    .slice(0, 4);

  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-6xl md:text-8xl font-black text-text mb-8">
                <span className="text-gradient">Play.</span> <span className="text-gradient">Predict.</span> <span className="text-gradient">Win.</span>
              </h1>
              <p className="text-lg text-text-muted mb-16 max-w-3xl mx-auto leading-relaxed">
                Join prediction battles powered by Hedera Hashgraph. Win rewards, earn NFTs, and climb the leaderboard in the ultimate Web3 gaming experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={() => navigate('/arenas')}
                className="gradient-button text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Enter Arenas</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="glass-card px-8 py-4 text-lg font-bold text-text hover:shadow-2xl transition-all duration-300 border border-glass-border"
              >
                View Leaderboard
              </button>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-text mb-6">Why Choose <span className="text-gradient">POLYHEDX</span>?</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Experience the future of prediction markets with cutting-edge technology and fair gameplay.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="glass-card p-10 text-center hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Zap className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6">Lightning Fast</h3>
              <p className="text-text-secondary leading-relaxed">
                Built on Hedera Hashgraph for instant transactions and minimal fees.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="glass-card p-10 text-center hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Gift className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6">Win Rewards</h3>
              <p className="text-text-secondary leading-relaxed">
                Earn HBAR tokens and exclusive NFTs for accurate predictions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass-card p-10 text-center hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6">Secure & Fair</h3>
              <p className="text-text-secondary leading-relaxed">
                Transparent smart contracts ensure fair play and secure payouts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What’s Next */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-text mb-6">What’s <span className="text-gradient">Next</span></h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              We’re building features that make predicting safer, smarter, and community-driven.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Insurance Protocol */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">Insurance on Every Event</h3>
              <p className="text-text-secondary leading-relaxed">
                We’ll add an insurance layer on top of each pool, so if you’re wrong you don’t lose everything.
                Choose coverage levels to reduce downside and play more confidently.
              </p>
            </motion.div>

            {/* AI Assistance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass-card p-8 hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">AI–Powered Predictions</h3>
              <p className="text-text-secondary leading-relaxed">
                Future upgrade: AI that surfaces facts, historical performance and context to help you decide better.
                Faster analysis, clearer insights, smarter calls.
              </p>
            </motion.div>

            {/* Community Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-card p-8 hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">Community–Created Markets</h3>
              <p className="text-text-secondary leading-relaxed">
                We’ll support user–generated events with transparent, public resolution. Create, compete and
                collaborate on the markets you care about.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Arenas */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-text mb-6">Featured <span className="accent-gradient">Arenas</span></h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Join the hottest prediction battles happening right now.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArenas.map((arena) => (
              <ArenaCard key={arena.id} arena={arena} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-16"
          >
            <button 
              onClick={() => navigate('/arenas')}
              className="gradient-button text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <span>View All Arenas</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
