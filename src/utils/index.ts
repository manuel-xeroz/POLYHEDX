import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatHBAR(amount: number): string {
  return `${amount.toLocaleString()} HBAR`;
}

export function formatAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'crypto':
      return 'text-warning bg-warning/20 border border-warning/30';
    case 'sports':
      return 'text-success bg-success/20 border border-success/30';
    case 'culture':
      return 'text-accent bg-accent/20 border border-accent/30';
    default:
      return 'text-text-muted bg-text-muted/20 border border-text-muted/30';
  }
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-text-muted bg-text-muted/20 border border-text-muted/30';
    case 'rare':
      return 'text-primary bg-primary/20 border border-primary/30';
    case 'epic':
      return 'text-accent bg-accent/20 border border-accent/30';
    case 'legendary':
      return 'text-warning bg-warning/20 border border-warning/30';
    default:
      return 'text-text-muted bg-text-muted/20 border border-text-muted/30';
  }
}
