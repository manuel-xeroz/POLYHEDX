import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { mockArenas } from '../data/mockData';
import { User, Arena, Prediction, NFT, LeaderboardEntry, WalletType } from '../types';
import { simpleWalletService, WalletInfo } from '../services/simpleWalletService';

interface AppState {
  user: User | null;
  walletType: WalletType;
  isConnected: boolean;
  walletInfo: WalletInfo | null;
  arenas: Arena[];
  predictions: Prediction[];
  nfts: NFT[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_WALLET_TYPE'; payload: WalletType }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_WALLET_INFO'; payload: WalletInfo | null }
  | { type: 'SET_ARENAS'; payload: Arena[] }
  | { type: 'ADD_ARENA'; payload: Arena }
  | { type: 'UPDATE_ARENA'; payload: Arena }
  | { type: 'RESOLVE_ARENA'; payload: { arenaId: string; correctAnswer: boolean } }
  | { type: 'ADD_PREDICTION'; payload: Prediction }
  | { type: 'SET_NFTS'; payload: NFT[] }
  | { type: 'ADD_NFT'; payload: NFT }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  walletType: null,
  isConnected: false,
  walletInfo: null,
  arenas: [],
  predictions: [],
  nfts: [],
  leaderboard: [],
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_WALLET_TYPE':
      return { ...state, walletType: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_WALLET_INFO':
      return { ...state, walletInfo: action.payload };
    case 'SET_ARENAS':
      return { ...state, arenas: action.payload };
    case 'ADD_ARENA':
      return { ...state, arenas: [action.payload, ...state.arenas] };
    case 'UPDATE_ARENA':
      return {
        ...state,
        arenas: state.arenas.map(arena =>
          arena.id === action.payload.id ? action.payload : arena
        ),
      };
    case 'RESOLVE_ARENA':
      return {
        ...state,
        arenas: state.arenas.map(arena =>
          arena.id === action.payload.arenaId
            ? { ...arena, isResolved: true, correctAnswer: action.payload.correctAnswer }
            : arena
        ),
      };
    case 'ADD_PREDICTION':
      return { ...state, predictions: [...state.predictions, action.payload] };
    case 'SET_NFTS':
      return { ...state, nfts: action.payload };
    case 'ADD_NFT':
      return { ...state, nfts: [...state.nfts, action.payload] };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  makePrediction: (arenaId: string, choice: boolean, amount: number) => Promise<void>;
  claimReward: (predictionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (base) => {
    try {
      const arenasRaw = localStorage.getItem('polyhedx_arenas');
      const predsRaw = localStorage.getItem('polyhedx_predictions');
      const init: AppState = { ...base } as any;
      // hydrate arenas
      if (arenasRaw) {
        const arr = JSON.parse(arenasRaw);
        init.arenas = Array.isArray(arr)
          ? arr.map((a: any) => ({ ...a, deadline: new Date(a.deadline) }))
          : [];
      } else {
        // seed with mocks on first run
        init.arenas = mockArenas;
      }
      // hydrate predictions
      if (predsRaw) {
        const arr = JSON.parse(predsRaw);
        init.predictions = Array.isArray(arr)
          ? arr.map((p: any) => ({ ...p, timestamp: new Date(p.timestamp) }))
          : [];
      }
      return init;
    } catch {
      return { ...base, arenas: mockArenas } as any;
    }
  });

  // (No async hydration needed; done in reducer initializer)

  // Persist arenas and predictions whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('polyhedx_arenas', JSON.stringify(state.arenas));
    } catch {}
  }, [state.arenas]);

  useEffect(() => {
    try {
      localStorage.setItem('polyhedx_predictions', JSON.stringify(state.predictions));
    } catch {}
  }, [state.predictions]);

  const connectWallet = async (walletType: WalletType) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Connect via direct extension (HashPack/Blade)
      const extInfo = await simpleWalletService.connectWallet();
      const walletInfo: WalletInfo = extInfo;
      const inferredType: WalletType = (extInfo.walletType as WalletType) || walletType;
      
      // Create user object from wallet info
      let balance = 0;
      try {
        // Fetch balance from mirror node
        const network = (process.env.REACT_APP_NETWORK || 'testnet').toLowerCase();
        const base = network === 'mainnet'
          ? 'https://mainnet-public.mirrornode.hedera.com/api/v1'
          : network === 'previewnet'
          ? 'https://previewnet.mirrornode.hedera.com/api/v1'
          : 'https://testnet.mirrornode.hedera.com/api/v1';
        const res = await fetch(`${base}/accounts/${encodeURIComponent(walletInfo.accountId)}`);
        if (res.ok) {
          const data = await res.json();
          const tinybar = data?.balance?.balance ?? 0;
          balance = Number(tinybar) / 100_000_000;
        }
      } catch (e) {
        console.warn('Failed to fetch balance from mirror node:', e);
      }
      const user: User = {
        id: walletInfo.accountId,
        address: walletInfo.accountId,
        balance,
        totalPredictions: 0,
        correctPredictions: 0,
        totalRewards: 0,
        nfts: [],
      };
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_WALLET_TYPE', payload: inferredType || walletInfo.walletType as WalletType });
      const walletInfoWithBalance: WalletInfo = { ...walletInfo, balance };
      dispatch({ type: 'SET_WALLET_INFO', payload: walletInfoWithBalance });
      dispatch({ type: 'SET_CONNECTED', payload: true });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectWallet = () => {
    try { simpleWalletService.disconnectWallet(); } catch {}
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_WALLET_TYPE', payload: null });
    dispatch({ type: 'SET_WALLET_INFO', payload: null });
    dispatch({ type: 'SET_CONNECTED', payload: false });
  };

  const makePrediction = async (arenaId: string, choice: boolean, amount: number) => {
    if (!state.user) return;

    const prediction: Prediction = {
      id: Date.now().toString(),
      userId: state.user.id,
      arenaId,
      choice,
      amount,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_PREDICTION', payload: prediction });

    // Update arena votes
    const arena = state.arenas.find(a => a.id === arenaId);
    if (arena) {
      const updatedArena = {
        ...arena,
        yesVotes: choice ? arena.yesVotes + 1 : arena.yesVotes,
        noVotes: choice ? arena.noVotes : arena.noVotes + 1,
        participants: [...arena.participants, state.user.id],
      };
      dispatch({ type: 'UPDATE_ARENA', payload: updatedArena });
    }
  };

  const claimReward = async (predictionId: string) => {
    // Mock reward claiming
    console.log('Claiming reward for prediction:', predictionId);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        connectWallet,
        disconnectWallet,
        makePrediction,
        claimReward,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
