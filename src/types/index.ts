export interface User {
  id: string;
  address: string;
  balance: number;
  totalPredictions: number;
  correctPredictions: number;
  totalRewards: number;
  nfts: NFT[];
}

export interface Arena {
  id: string;
  title: string;
  description: string;
  category: 'crypto' | 'sports' | 'culture';
  deadline: Date;
  poolSize: number;
  yesVotes: number;
  noVotes: number;
  correctAnswer?: boolean;
  isResolved: boolean;
  participants: string[];
}

export interface Prediction {
  id: string;
  userId: string;
  arenaId: string;
  choice: boolean; // true for Yes, false for No
  amount: number;
  timestamp: Date;
  isCorrect?: boolean;
  reward?: number;
}

export interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  arenaId: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  correctPredictions: number;
  totalRewards: number;
  winRate: number;
}

export type WalletType = 'hashpack' | 'blade' | null;
