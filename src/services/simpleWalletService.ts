// Simple Hedera Wallet Service for connecting to HashPack and Blade wallets
export interface WalletInfo {
  accountId: string;
  publicKey: string;
  balance: number;
  walletType: 'hashpack' | 'blade' | 'unknown';
}

class SimpleWalletService {
  private static instance: SimpleWalletService;
  private connection: {
    isConnected: boolean;
    walletInfo: WalletInfo | null;
  } = {
    isConnected: false,
    walletInfo: null,
  };

  private constructor() {}

  static getInstance(): SimpleWalletService {
    if (!SimpleWalletService.instance) {
      SimpleWalletService.instance = new SimpleWalletService();
    }
    return SimpleWalletService.instance;
  }

  // Check if HashPack is available
  private isHashPackAvailable(): boolean {
    return typeof window !== 'undefined' && 
           window.hasOwnProperty('hashpack') && 
           (window as any).hashpack?.isReady;
  }

  // Check if Blade is available
  private isBladeAvailable(): boolean {
    return typeof window !== 'undefined' && 
           window.hasOwnProperty('blade') && 
           (window as any).blade?.isReady;
  }

  // Connect to HashPack wallet
  async connectHashPack(): Promise<WalletInfo> {
    if (!this.isHashPackAvailable()) {
      throw new Error('HashPack wallet not found. Please install HashPack extension.');
    }

    try {
      const hashpack = (window as any).hashpack;
      
      // Request connection
      const response = await hashpack.request({
        method: 'connect',
        params: {
          network: 'testnet',
        },
      });

      if (!response.success) {
        throw new Error('Failed to connect to HashPack wallet');
      }

      const { accountId, publicKey } = response.data;
      
      // Mock balance for now - in real app, you'd query the actual balance
      const balance = Math.random() * 1000 + 100; // Random balance between 100-1100 HBAR

      const walletInfo: WalletInfo = {
        accountId,
        publicKey,
        balance,
        walletType: 'hashpack',
      };

      this.connection = {
        isConnected: true,
        walletInfo,
      };

      return walletInfo;
    } catch (error) {
      console.error('HashPack connection error:', error);
      throw new Error(`Failed to connect to HashPack: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Connect to Blade wallet
  async connectBlade(): Promise<WalletInfo> {
    if (!this.isBladeAvailable()) {
      throw new Error('Blade wallet not found. Please install Blade extension.');
    }

    try {
      const blade = (window as any).blade;
      
      // Request connection
      const response = await blade.request({
        method: 'connect',
        params: {
          network: 'testnet',
        },
      });

      if (!response.success) {
        throw new Error('Failed to connect to Blade wallet');
      }

      const { accountId, publicKey } = response.data;
      
      // Mock balance for now - in real app, you'd query the actual balance
      const balance = Math.random() * 1000 + 100; // Random balance between 100-1100 HBAR

      const walletInfo: WalletInfo = {
        accountId,
        publicKey,
        balance,
        walletType: 'blade',
      };

      this.connection = {
        isConnected: true,
        walletInfo,
      };

      return walletInfo;
    } catch (error) {
      console.error('Blade connection error:', error);
      throw new Error(`Failed to connect to Blade: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Auto-detect and connect to available wallet
  async connectWallet(): Promise<WalletInfo> {
    if (this.isHashPackAvailable()) {
      return this.connectHashPack();
    } else if (this.isBladeAvailable()) {
      return this.connectBlade();
    } else {
      throw new Error('No Hedera wallet found. Please install HashPack or Blade wallet.');
    }
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.connection = {
      isConnected: false,
      walletInfo: null,
    };
  }

  // Get current connection status
  getConnection() {
    return this.connection;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.connection.isConnected;
  }

  // Get wallet info
  getWalletInfo(): WalletInfo | null {
    return this.connection.walletInfo;
  }
}

// Export singleton instance
export const simpleWalletService = SimpleWalletService.getInstance();

// Type declarations for window object
declare global {
  interface Window {
    hashpack?: {
      isReady: boolean;
      request: (params: any) => Promise<any>;
    };
    blade?: {
      isReady: boolean;
      request: (params: any) => Promise<any>;
    };
  }
}
