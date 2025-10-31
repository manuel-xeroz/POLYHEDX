import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Trophy, 
  MessageCircle,
  Wallet,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Activity,
  Share2,
  Bookmark,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatHBAR, formatAddress } from '../utils';
import { DataService, PriceDataPoint, MarketData } from '../services/dataService';

const ArenaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [sharesToBuy, setSharesToBuy] = useState(10);
  const [sharesToSell, setSharesToSell] = useState(10);
  const [isBuying, setIsBuying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: '0x1234...5678',
      text: 'This is looking very bullish! BTC has strong support at $65k',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12
    },
    {
      id: 2,
      user: '0x2345...6789',
      text: 'I disagree, the market is showing signs of weakness. No for me.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 8
    }
  ]);

  // Real data state
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const arena = state.arenas.find(a => a.id === id);
  const storagePrefix = `polyhedx_arena_${id}`;
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Array<{id:number;user:string;action:'Bought'|'Sold';shares:number;price:number;time:string}>>([]);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [coveragePercent, setCoveragePercent] = useState(0); // 0-80
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmSummary, setConfirmSummary] = useState<{ side: 'YES'|'NO'; qty: number; price: number; premium: number; total: number } | null>(null);
  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO'>('YES');

  useEffect(() => {
    if (!arena) {
      navigate('/arenas');
      return;
    }

    // Load initial market data
    const loadMarketData = async () => {
      setIsLoading(true);
      try {
        const [marketDataResult, priceHistoryResult] = await Promise.all([
          DataService.getArenaMarketData(arena.id),
          DataService.getPriceHistory(arena.id, timeframe)
        ]);
        
        setMarketData(marketDataResult);
        setPriceHistory(priceHistoryResult);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();

    // Load saved state (comments, saved flag, transactions)
    try {
      const savedFlag = localStorage.getItem(`${storagePrefix}_saved`);
      setIsSaved(savedFlag === '1');
      const savedComments = localStorage.getItem(`${storagePrefix}_comments`);
      if (savedComments) {
        const parsed = JSON.parse(savedComments);
        parsed.forEach((c: any) => (c.timestamp = new Date(c.timestamp)));
        setComments(parsed);
      }
      const savedTx = localStorage.getItem(`${storagePrefix}_txs`);
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        setTransactions(parsed);
      } else {
        setTransactions(mockTransactions);
      }
    } catch {}

    // Set up real-time updates
    const unsubscribe = DataService.subscribeToPriceUpdates(arena.id, (newData) => {
      setPriceHistory(prev => [...prev.slice(-100), newData]); // Keep last 100 points
      setLastUpdate(new Date());
    });

    // Refresh data every 30 seconds
    const refreshInterval = setInterval(loadMarketData, 30000);

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [arena, navigate, timeframe]);

  const totalVotes = arena ? (arena.yesVotes + arena.noVotes) : 0;
  const yesPercentage = totalVotes > 0 && arena ? (arena.yesVotes / totalVotes) * 100 : 50;
  const noPercentage = totalVotes > 0 && arena ? (arena.noVotes / totalVotes) * 100 : 50;

  const timeRemaining = () => {
    const now = new Date();
    const deadline = arena ? new Date(arena.deadline) : new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const connectWallet = () => {
    // Mock wallet connection
    setIsWalletConnected(true);
    setWalletAddress('0x1234...5678');
    setUserBalance(2500);
  };

  const openConfirmTrade = () => {
    const side: 'YES'|'NO' = selectedSide;
    const qty = isBuying ? sharesToBuy : sharesToSell;
    const price = Number((side === 'YES' ? currentYesPrice : currentNoPrice).toFixed(2));
    const total = qty * price + insurancePremium;
    setConfirmSummary({ side, qty, price, premium: insurancePremium, total });
    setIsConfirmOpen(true);
  };

  const executeTrade = () => {
    if (!isWalletConnected) {
      connectWallet();
      // Continue with trade after mock connect
    }
 
    const action: 'Bought'|'Sold' = isBuying ? 'Bought' : 'Sold';
    const qty = isBuying ? sharesToBuy : sharesToSell;
    const price = Number((selectedSide === 'YES' ? currentYesPrice : currentNoPrice).toFixed(2));
    const tx = {
      id: Date.now(),
      user: walletAddress || '0xAnon...User',
      action,
      shares: qty,
      price: Math.round(price * 100) / 100,
      time: 'just now'
    };
    setTransactions(prev => {
      const next = [tx, ...prev].slice(0, 30);
      try { localStorage.setItem(`${storagePrefix}_txs`, JSON.stringify(next)); } catch {}
      return next;
    });
    // Update local balance (mock) including premium if insurance is enabled
    const totalCost = qty * price + insurancePremium;
    setUserBalance(b => Math.max(0, b - totalCost));
    // Update arena votes locally (only on buys)
    try {
      const updated = { ...arena } as any;
      if (isBuying) {
        if (selectedSide === 'YES') updated.yesVotes = (updated.yesVotes || 0) + qty;
        else updated.noVotes = (updated.noVotes || 0) + qty;
      }
      dispatch({ type: 'UPDATE_ARENA', payload: updated });
    } catch {}

    // Persist trade with insurance fields
    try {
      const tradesRaw = localStorage.getItem(`${storagePrefix}_trades`);
      const trades = tradesRaw ? JSON.parse(tradesRaw) : [];
      trades.unshift({
        id: tx.id,
        side: selectedSide,
        stake: qty,
        price,
        coverage,
        premium: insurancePremium,
        timestamp: new Date().toISOString(),
        status: 'open',
        payout: 0,
      });
      localStorage.setItem(`${storagePrefix}_trades`, JSON.stringify(trades));
    } catch {}

    // Reset inputs & give success feedback
    setTradeSuccess(`${action} ${qty} ${selectedSide} shares successful`);
    setTimeout(() => setTradeSuccess(null), 2000);
    setSharesToBuy(10);
    setSharesToSell(10);
    setInsuranceEnabled(false);
    setCoveragePercent(0);
    setIsConfirmOpen(false);
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: walletAddress || 'Anonymous',
        text: newComment,
        timestamp: new Date(),
        likes: 0
      };
      const next = [comment, ...comments];
      setComments(next);
      try { localStorage.setItem(`${storagePrefix}_comments`, JSON.stringify(next)); } catch {}
      setNewComment('');
    }
  };

  const mockTransactions: Array<{id:number;user:string;action:'Bought'|'Sold';shares:number;price:number;time:string}> = [
    { id: 1, user: '0x1234...5678', action: 'Bought', shares: 50, price: 0.65, time: '2m ago' },
    { id: 2, user: '0x2345...6789', action: 'Sold', shares: 25, price: 0.63, time: '5m ago' },
    { id: 3, user: '0x3456...7890', action: 'Bought', shares: 100, price: 0.68, time: '8m ago' },
    { id: 4, user: '0x4567...8901', action: 'Bought', shares: 75, price: 0.67, time: '12m ago' },
    { id: 5, user: '0x5678...9012', action: 'Sold', shares: 30, price: 0.64, time: '15m ago' },
  ];

  // Use real data or fallback to arena data
  const yesBase = arena ? (arena.yesVotes / ((arena.yesVotes + arena.noVotes) || 1)) : 0.5;
  const noBase = arena ? (arena.noVotes / ((arena.yesVotes + arena.noVotes) || 1)) : 0.5;
  const currentYesPrice = (marketData?.currentYesPrice ?? yesBase) || 0.5;
  const currentNoPrice = (marketData?.currentNoPrice ?? noBase) || 0.5;
  const totalVolume = marketData?.totalVolume || (arena ? arena.poolSize : 0);
  const openInterest = marketData?.openInterest || (arena ? arena.participants.length * 100 : 0);

  // Insurance pricing (demo)
  const stake = isBuying ? sharesToBuy : sharesToSell;
  const marketProb = selectedSide === 'YES' ? currentYesPrice : currentNoPrice;
  const premiumRate = 0.05 + 0.10 * Math.abs(marketProb - 0.5);
  const coverage = Math.min(0.8, Math.max(0, coveragePercent / 100));
  const insurancePremium = insuranceEnabled ? stake * coverage * premiumRate : 0;
  const maxLossWithInsurance = insuranceEnabled ? stake * (1 - coverage) : stake;

  // Auto-add scrolling activity (animated) every 7s (guarded)
  useEffect(() => {
    if (!arena) return;
    const timer = setInterval(() => {
      const action: 'Bought'|'Sold' = Math.random() > 0.5 ? 'Bought' : 'Sold';
      const qty = Math.floor(10 + Math.random() * 90);
      const price = Math.round(((action === 'Bought' ? currentYesPrice : currentNoPrice) + (Math.random()-0.5)*0.02) * 100) / 100;
      const tx = {
        id: Date.now(),
        user: '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6),
        action,
        shares: qty,
        price,
        time: 'moments ago'
      } as {id:number;user:string;action:'Bought'|'Sold';shares:number;price:number;time:string};
      setTransactions(prev => {
        const next = [tx, ...prev].slice(0, 30);
        try { localStorage.setItem(`${storagePrefix}_txs`, JSON.stringify(next)); } catch {}
        return next;
      });
    }, 7000);
   
    return () => clearInterval(timer);
  }, [arena, currentYesPrice, currentNoPrice, storagePrefix]);

  // Auto-add scrolling activity (animated) every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      const action: 'Bought'|'Sold' = Math.random() > 0.5 ? 'Bought' : 'Sold';
      const qty = Math.floor(10 + Math.random() * 90);
      const price = Math.round(((action === 'Bought' ? currentYesPrice : currentNoPrice) + (Math.random()-0.5)*0.02) * 100) / 100;
      const tx = {
        id: Date.now(),
        user: '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6),
        action,
        shares: qty,
        price,
        time: 'moments ago'
      };
      setTransactions(prev => {
        const next = [tx, ...prev].slice(0, 30);
        try { localStorage.setItem(`${storagePrefix}_txs`, JSON.stringify(next)); } catch {}
        return next;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, [currentYesPrice, currentNoPrice]);

  const handleShare = async () => {
    const title = arena?.title || document.title;
    const text = arena?.description || '';
    const shareData = { title, text, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard');
      }
    } catch {}
  };

  const toggleSaved = () => {
    const next = !isSaved;
    setIsSaved(next);
    try { localStorage.setItem(`${storagePrefix}_saved`, next ? '1' : '0'); } catch {}
  };

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/arenas')}
            className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Arenas</span>
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                  {arena ? arena.category.toUpperCase() : ''}
                </span>
                <span className="px-3 py-1 bg-glass-bg text-text-secondary rounded-full text-sm font-bold">
                  {arena?.isResolved ? 'RESOLVED' : 'ACTIVE'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-text mb-4">
                {arena?.title || ''}
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed mb-6">
                {arena?.description || ''}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={handleShare} className="glass-card p-3 hover:shadow-xl transition-all duration-300">
                <Share2 className="w-5 h-5 text-text-secondary" />
              </button>
              <button onClick={toggleSaved} className={`glass-card p-3 hover:shadow-xl transition-all duration-300 ${isSaved ? 'border-primary/40' : ''}`}>
                <Bookmark className={`w-5 h-5 ${isSaved ? 'text-primary' : 'text-text-secondary'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-text">Market Price</h2>
                  {isLoading && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-success">{(currentYesPrice * 100).toFixed(0)}¢</div>
                    <div className="text-sm text-text-secondary">YES</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-error">{(currentNoPrice * 100).toFixed(0)}¢</div>
                    <div className="text-sm text-text-secondary">NO</div>
                  </div>
                </div>
              </div>
              
              {/* Timeframe selector */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-text-secondary">Timeframe:</span>
                {(['1h', '24h', '7d', '30d'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === tf
                        ? 'bg-primary text-black'
                        : 'bg-glass-bg text-text-secondary hover:text-text'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
                <span className="text-xs text-text-muted ml-4">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              
              {/* Price Chart */}
              <div className="h-64 bg-background-tertiary rounded-2xl p-6 mb-4 relative">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  {/* Grid lines */}
                  <defs>
                    <linearGradient id="yesLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00FF88" />
                      <stop offset="50%" stopColor="#66FFB3" />
                      <stop offset="100%" stopColor="#00FF88" />
                    </linearGradient>
                    <linearGradient id="yesAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00FF88" />
                      <stop offset="100%" stopColor="#00FF88" />
                    </linearGradient>
                    <linearGradient id="noLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="50%" stopColor="#FF8A65" />
                      <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                  </defs>
                  
                  {/* Horizontal grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  
                  {/* Convert price data to chart coordinates */}
                  {(() => {
                    if (priceHistory.length === 0) {
                      return (
                        <text x="200" y="50" textAnchor="middle" className="text-text-secondary">
                          Loading chart data...
                        </text>
                      );
                    }

                    const minPrice = Math.min(...priceHistory.map(p => Math.min(p.yesPrice, p.noPrice))) - 0.05;
                    const maxPrice = Math.max(...priceHistory.map(p => Math.max(p.yesPrice, p.noPrice))) + 0.05;
                    const priceRange = maxPrice - minPrice;
                    const chartHeight = 80;
                    const chartWidth = 400;
                    const stepX = chartWidth / Math.max(1, priceHistory.length - 1);
                    
                    // YES price line with area fill
                    const yesPoints = priceHistory.map((point, index) => {
                      const x = index * stepX;
                      const y = 20 + ((maxPrice - point.yesPrice) / priceRange) * chartHeight;
                      return `${x},${y}`;
                    }).join(' ');
                    
                    // NO price line
                    const noPoints = priceHistory.map((point, index) => {
                      const x = index * stepX;
                      const y = 20 + ((maxPrice - point.noPrice) / priceRange) * chartHeight;
                      return `${x},${y}`;
                    }).join(' ');
                    
                    return (
                      <>
                        {/* YES area fill */}
                        <path
                          d={`M0,100 ${yesPoints} L400,100 Z`}
                          fill="url(#yesAreaGradient)"
                          opacity="0.2"
                        />
                        
                        {/* YES price line */}
                        <polyline
                          points={yesPoints}
                          fill="none"
                          stroke="url(#yesLineGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* NO price line */}
                        <polyline
                          points={noPoints}
                          fill="none"
                          stroke="url(#noLineGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="4,4"
                        />
                        
                        {/* Key data points for YES (every 8th point) */}
                        {priceHistory.filter((_, index) => index % Math.max(1, Math.floor(priceHistory.length / 10)) === 0).map((point, index) => {
                          const originalIndex = index * Math.max(1, Math.floor(priceHistory.length / 10));
                          const x = originalIndex * stepX;
                          const y = 20 + ((maxPrice - point.yesPrice) / priceRange) * chartHeight;
                          return (
                            <circle
                              key={`yes-${index}`}
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#00FF88"
                              className="hover:r-4 transition-all duration-200"
                            />
                          );
                        })}
                        
                        {/* Key data points for NO (every 8th point) */}
                        {priceHistory.filter((_, index) => index % Math.max(1, Math.floor(priceHistory.length / 10)) === 0).map((point, index) => {
                          const originalIndex = index * Math.max(1, Math.floor(priceHistory.length / 10));
                          const x = originalIndex * stepX;
                          const y = 20 + ((maxPrice - point.noPrice) / priceRange) * chartHeight;
                          return (
                            <circle
                              key={`no-${index}`}
                              cx={x}
                              cy={y}
                              r="2"
                              fill="#FF6B35"
                              className="hover:r-3 transition-all duration-200"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
                
                {/* Price labels */}
                <div className="absolute top-2 left-2 text-xs text-text-secondary font-bold">80¢</div>
                <div className="absolute top-1/4 left-2 text-xs text-text-secondary">70¢</div>
                <div className="absolute top-1/2 left-2 text-xs text-text-secondary">60¢</div>
                <div className="absolute top-3/4 left-2 text-xs text-text-secondary">50¢</div>
                <div className="absolute bottom-2 left-2 text-xs text-text-secondary font-bold">20¢</div>
                <div className="absolute bottom-2 right-2 text-xs text-text-secondary font-bold">24h</div>
                
                {/* Legend */}
                <div className="absolute top-2 right-2 flex space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-0.5 bg-primary"></div>
                    <span className="text-text-secondary">YES</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-0.5 bg-accent border-dashed border-t"></div>
                    <span className="text-text-secondary">NO</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-text-secondary">
                <span>24h volume: {formatHBAR(priceHistory.reduce((sum, point) => sum + point.volume, 0))}</span>
                <span>Total liquidity: {formatHBAR(arena ? arena.poolSize : 0)}</span>
              </div>
              
              {/* Volume bars */}
              <div className="mt-4 h-8 flex items-end space-x-1">
                {priceHistory.filter((_, index) => index % Math.max(1, Math.floor(priceHistory.length / 20)) === 0).map((point, index) => {
                  const maxVolume = Math.max(...priceHistory.map(p => p.volume));
                  const height = maxVolume > 0 ? (point.volume / maxVolume) * 100 : 0;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-primary/30 to-primary/10 rounded-sm flex-1"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Trading Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold text-text mb-6">Trade Shares</h2>
              
              {!isWalletConnected ? (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text mb-2">Connect Your Wallet</h3>
                  <p className="text-text-secondary mb-6">Connect your wallet to start trading prediction shares</p>
                  <button
                    onClick={connectWallet}
                    className="gradient-button px-8 py-4 text-lg"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Wallet Info */}
                  <div className="flex items-center justify-between p-4 bg-glass-bg rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">Connected</div>
                        <div className="font-bold text-text">{formatAddress(walletAddress)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary">Balance</div>
                      <div className="font-bold text-text">{formatHBAR(userBalance)}</div>
                    </div>
                  </div>

                  {/* Side & Action Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex bg-glass-bg rounded-2xl p-1">
                      <button
                        onClick={() => setSelectedSide('YES')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                          selectedSide === 'YES' ? 'bg-primary text-black' : 'text-text-secondary'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => setSelectedSide('NO')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                          selectedSide === 'NO' ? 'bg-primary text-black' : 'text-text-secondary'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                    <div className="flex bg-glass-bg rounded-2xl p-1">
                      <button
                        onClick={() => setIsBuying(true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                          isBuying ? 'bg-primary text-black' : 'text-text-secondary'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setIsBuying(false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                          !isBuying ? 'bg-primary text-black' : 'text-text-secondary'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                  </div>

                  {/* Trade Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        {isBuying ? 'Buy' : 'Sell'} {selectedSide} shares
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="number"
                          value={isBuying ? sharesToBuy : sharesToSell}
                          onChange={(e) => isBuying ? setSharesToBuy(Number(e.target.value)) : setSharesToSell(Number(e.target.value))}
                          className="flex-1 px-4 py-3 bg-glass-bg border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
                          min="1"
                        />
                        <button className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors">
                          Max
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-glass-bg rounded-xl">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">Price per share</span>
                        <span className="text-text">
                          {selectedSide === 'YES' ? `${(currentYesPrice * 100).toFixed(0)}¢` : `${(currentNoPrice * 100).toFixed(0)}¢`}
                        </span>
                      </div>
                      {/* Insurance Controls */}
                      <div className="flex items-center justify-between text-sm mb-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={insuranceEnabled}
                            onChange={(e) => setInsuranceEnabled(e.target.checked)}
                            className="accent-primary"
                          />
                          <span className="text-text">Add Insurance</span>
                        </label>
                        <span className="text-text-secondary">Rate: {(premiumRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className={`mb-2 ${insuranceEnabled ? '' : 'opacity-50'}`}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-secondary">Coverage</span>
                          <span className="text-text">{coveragePercent}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={80}
                          step={5}
                          disabled={!insuranceEnabled}
                          value={coveragePercent}
                          onChange={(e) => setCoveragePercent(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">Premium</span>
                        <span className="text-text">{formatHBAR(insurancePremium)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">Total cost</span>
                        <span className="text-text">
                          {formatHBAR((isBuying ? sharesToBuy : sharesToSell) * (selectedSide === 'YES' ? currentYesPrice : currentNoPrice) + insurancePremium)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-text-secondary">You will receive</span>
                        <span className="text-text">{isBuying ? sharesToBuy : sharesToSell} shares</span>
                      </div>
                      {insuranceEnabled && (
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-text-secondary">Max loss with insurance</span>
                          <span className="text-text">{formatHBAR(maxLossWithInsurance)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={openConfirmTrade}
                      className="w-full gradient-button py-4 text-lg font-bold"
                    >
                      {isBuying ? 'Buy' : 'Sell'} {isBuying ? sharesToBuy : sharesToSell} {selectedSide} Shares
                    </button>
                    {tradeSuccess && (
                      <div className="text-center text-sm text-success mt-2">
                        {tradeSuccess}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Comments</h2>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length}</span>
                  {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showComments && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-glass-bg border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder-text-muted"
                    />
                    <button
                      onClick={addComment}
                      className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors"
                    >
                      Post
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-glass-bg rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-black">
                                {comment.user.slice(2, 4).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-bold text-text">{formatAddress(comment.user)}</div>
                              <div className="text-xs text-text-secondary">
                                {comment.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <button className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors">
                            <span className="text-sm">{comment.likes}</span>
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-text-secondary">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-text mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Volume</span>
                  <span className="font-bold text-text">{formatHBAR(12500)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Open Interest</span>
                  <span className="font-bold text-text">{formatHBAR(8500)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">24h Change</span>
                  <span className="font-bold text-success">+5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Liquidity</span>
                  <span className="font-bold text-text">{formatHBAR(arena ? arena.poolSize : 0)}</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-text mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {[...transactions].sort((a,b) => b.id - a.id).map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-3 bg-glass-bg rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${tx.action === 'Bought' ? 'bg-success' : 'bg-error'}`} />
                      <div>
                        <div className="text-sm font-bold text-text">{tx.action}</div>
                        <div className="text-xs text-text-secondary">{tx.shares} shares</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-text">{tx.price}¢</div>
                      <div className="text-xs text-text-secondary">{tx.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Arena Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-text mb-4">Arena Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-text-secondary">Deadline</div>
                    <div className="font-bold text-text">{timeRemaining()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-sm text-text-secondary">Participants</div>
                    <div className="font-bold text-text">{arena ? arena.participants.length : 0}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-sm text-text-secondary">Pool Size</div>
                    <div className="font-bold text-text">{formatHBAR(arena ? arena.poolSize : 0)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {isConfirmOpen && confirmSummary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="glass-card p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-text mb-4">Confirm Trade</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Side</span><span className="font-bold text-text">{confirmSummary.side}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Shares</span><span className="font-bold text-text">{confirmSummary.qty}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Price</span><span className="font-bold text-text">{(confirmSummary.price * 100).toFixed(0)}¢</span></div>
              {confirmSummary.premium > 0 && (
                <div className="flex justify-between"><span className="text-text-secondary">Premium</span><span className="font-bold text-text">{formatHBAR(confirmSummary.premium)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-text-secondary">Total</span><span className="font-bold text-text">{formatHBAR(confirmSummary.total)}</span></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 bg-text-muted/20 text-text rounded-xl hover:bg-text-muted/30 transition-colors">Cancel</button>
              <button onClick={executeTrade} className="px-4 py-2 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {tradeSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass-card px-4 py-3 text-sm text-success border border-success/30">{tradeSuccess}</div>
        </div>
      )}
    </div>
  );
};

export default ArenaDetails;
