import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { NFT } from '../types';
import { getRarityColor } from '../utils';

interface NFTCardProps {
  nft: NFT;
  onClaim?: (nftId: string) => void;
  isClaimed?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClaim, isClaimed = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="glass-card p-4 hover:shadow-xl transition-all duration-300"
    >
      {/* NFT Image */}
      <div className="relative mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-primary/50" />
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>
          {nft.rarity.toUpperCase()}
        </div>
      </div>

      {/* NFT Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text mb-2">{nft.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
      </div>

      {/* Claim Button */}
      {onClaim && (
        <button
          onClick={() => onClaim(nft.id)}
          disabled={isClaimed}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isClaimed
              ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
              : 'gradient-button hover:shadow-lg'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{isClaimed ? 'Claimed' : 'Claim NFT'}</span>
        </button>
      )}

      {/* Claimed Badge */}
      {isClaimed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-center"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success">
            ✅ Claimed Successfully
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NFTCard;
