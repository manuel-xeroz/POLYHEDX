import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, MessageCircle, Github, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center">
                  <span className="text-black font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold text-gradient">POLYHEDX</span>
              </div>
              <p className="text-text-secondary mb-6 max-w-sm">
                The ultimate prediction battle platform powered by Hedera Hashgraph. 
                Predict, earn, and compete in the Web3 future.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/polyhedx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl flex items-center justify-center hover:bg-glass-hover transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="https://discord.gg/polyhedx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl flex items-center justify-center hover:bg-glass-hover transition-all duration-300 group"
                >
                  <MessageCircle className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="https://github.com/polyhedx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl flex items-center justify-center hover:bg-glass-hover transition-all duration-300 group"
                >
                  <Github className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                </a>
              </div>
            </motion.div>

            {/* Platform Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-text mb-6">Platform</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/arenas" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Prediction Arenas
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/leaderboard" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Leaderboard
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/results" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Results & Rewards
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/admin" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Admin Dashboard
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-text mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Documentation
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    API Reference
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Smart Contracts
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center group">
                    Whitepaper
                    <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-text mb-6">Stay Updated</h3>
              <p className="text-text-secondary mb-6">
                Get the latest updates on new arenas, features, and Web3 developments.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-l-2xl text-text placeholder-text-muted focus:outline-none focus:border-primary/50"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-black font-bold rounded-r-2xl hover:from-primary-dark hover:to-primary transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Live on Hedera Testnet</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-glass-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-text-muted text-sm">
                © {currentYear} POLYHEDX. All rights reserved. Built on Hedera Hashgraph.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-text-muted hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
