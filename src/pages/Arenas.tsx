import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ArenaCard from '../components/ArenaCard';
import { mockArenas } from '../data/mockData';

const Arenas: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');

  useEffect(() => {
    if (state.arenas.length === 0) {
      dispatch({ type: 'SET_ARENAS', payload: mockArenas });
    }
  }, [dispatch, state.arenas.length]);

  const categories = ['all', 'crypto', 'sports', 'culture'];

  const filteredArenas = state.arenas
    .filter(a => !a.isResolved)
    .filter(arena => {
      const matchesSearch = arena.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          arena.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || arena.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'pool':
          return b.poolSize - a.poolSize;
        case 'participants':
          return b.participants.length - a.participants.length;
        default:
          return 0;
      }
    });

  const handlePredict = (arenaId: string, choice: boolean) => {
    console.log(`Prediction made: Arena ${arenaId}, Choice: ${choice ? 'Yes' : 'No'}`);
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
          <h1 className="text-5xl font-black text-text mb-6">Prediction <span className="text-gradient">Arenas</span></h1>
          <p className="text-xl text-text-secondary">
            Join the battle of predictions and win rewards
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search arenas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder-text-muted"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-black'
                      : 'bg-glass-bg text-text-secondary hover:bg-glass-hover border border-glass-border'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="pool">Sort by Pool Size</option>
              <option value="participants">Sort by Participants</option>
            </select>
          </div>
        </motion.div>


        {/* Arenas Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredArenas.length > 0 ? (
            filteredArenas.map((arena, index) => (
              <motion.div
                key={arena.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <ArenaCard arena={arena} onPredict={handlePredict} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-primary mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">No arenas found</h3>
              <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Arenas;
