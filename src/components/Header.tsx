import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, User, LogOut, Loader2, X, AlertCircle, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatAddress, formatHBAR } from '../utils';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
const phdlogo = require('../assets/phdlogo.png');

const Header: React.FC = () => {
  const { state, connectWallet, disconnectWallet } = useApp();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  // wagmi balance (native)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Open AppKit modal (Wagmi + WalletConnect under the hood)
      open();
      
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    try { disconnect(); } catch {}
    disconnectWallet();
  };

  const { data: balanceData } = useBalance({
    address: (address as `0x${string}`) || undefined,
    query: { enabled: Boolean(isConnected && address) },
  });

  return (
    <header className="sticky top-0 z-50 bg-glass-bg backdrop-blur-2xl border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <a href="/" className="flex items-center group" aria-label="POLYHEDX Home">
              <img
                src={phdlogo}
                alt="POLYHEDX"
                className="h-[50px] w-auto rounded-2xl shadow-lg object-contain group-hover:scale-105 transition-transform"
              />
            </a>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/arenas" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Arenas
            </a>
            <a href="/leaderboard" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Leaderboard
            </a>
            <a href="/results" className="text-text-secondary hover:text-primary transition-colors font-medium">
              My Activity
            </a>
            <a href="/admin" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Admin
            </a>
          </nav>

          {/* Mobile toggles */}
          <div className="flex items-center md:hidden space-x-3">
            {(isConnected || (state.isConnected && state.user)) ? (
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="flex items-center space-x-2 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl px-3 py-2"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-text">
                  {address ? `${address.slice(0,6)}...${address.slice(-4)}` : (state.user ? formatAddress(state.user.address) : '...')}
                </span>
              </button>
            ) : null}
            <button
              onClick={() => setIsMobileOpen(v => !v)}
              className="p-2 bg-glass-bg border border-glass-border rounded-xl text-text-secondary hover:text-primary"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Wallet Connection (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {(isConnected || (state.isConnected && state.user)) ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
                  className="flex items-center space-x-2 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl px-4 py-3 hover:border-primary/40 transition-colors"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-text">
                    {address ? `${address.slice(0,6)}...${address.slice(-4)}` : (state.user ? formatAddress(state.user.address) : '...')}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-3 z-50">
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg">
                      <span className="text-sm text-text-secondary">Balance</span>
                      <span className="text-sm font-bold text-text">
                        {balanceData?.formatted
                          ? `${balanceData.formatted} ${balanceData.symbol || ''}`
                          : state.user
                          ? formatHBAR(state.user.balance)
                          : '0 HBAR'}
                      </span>
                    </div>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleDisconnectWallet}
                      className="w-full text-left px-2 py-2 mt-1 rounded-lg text-error hover:bg-error/10 transition-colors text-sm font-semibold"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="gradient-button px-6 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wallet className="w-4 h-4" />
                  )}
                  <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Popup Modal */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-error/95 backdrop-blur-xl border border-error/30 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">Connection Failed</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-glass-border bg-glass-bg backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <a href="/arenas" className="block text-text-secondary hover:text-primary font-medium">Arenas</a>
            <a href="/leaderboard" className="block text-text-secondary hover:text-primary font-medium">Leaderboard</a>
            <a href="/results" className="block text-text-secondary hover:text-primary font-medium">My Activity</a>
            <a href="/admin" className="block text-text-secondary hover:text-primary font-medium">Admin</a>
            {(isConnected || (state.isConnected && state.user)) ? (
                <div className="pt-2">
                <div className="flex items-center justify-between px-2 py-2 rounded-lg">
                  <span className="text-sm text-text-secondary">Balance</span>
                  <span className="text-sm font-bold text-text">
                    {balanceData?.formatted
                      ? `${balanceData.formatted} ${balanceData.symbol || ''}`
                      : state.user
                      ? formatHBAR(state.user.balance)
                      : '0 HBAR'}
                  </span>
                </div>
                <button onClick={handleDisconnectWallet} className="w-full text-left px-2 py-2 rounded-lg text-error hover:bg-error/10 transition-colors text-sm font-semibold">Disconnect</button>
              </div>
            ) : (
              <button onClick={handleConnectWallet} className="gradient-button w-full py-3 rounded-lg">Connect Wallet</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
