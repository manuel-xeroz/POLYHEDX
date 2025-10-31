// Data service for fetching real market data
export interface PriceDataPoint {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
  volume: number;
  time: string;
}

export interface MarketData {
  currentYesPrice: number;
  currentNoPrice: number;
  priceHistory: PriceDataPoint[];
  totalVolume: number;
  openInterest: number;
  liquidity: number;
}

// Mock API endpoints - replace with real APIs
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.polyhedx.com';

export class DataService {
  // Fetch real-time price data for an arena
  static async getArenaMarketData(arenaId: string): Promise<MarketData> {
    try {
      // For now, return enhanced mock data
      // Replace this with actual API call
      const response = await fetch(`${API_BASE_URL}/api/arenas/${arenaId}/market-data`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Using mock data due to API error:', error);
      return this.getMockMarketData(arenaId);
    }
  }

  // Fetch historical price data
  static async getPriceHistory(arenaId: string, timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<PriceDataPoint[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/arenas/${arenaId}/price-history?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Using mock data due to API error:', error);
      return this.getMockPriceHistory(timeframe);
    }
  }

  // Subscribe to real-time price updates
  static subscribeToPriceUpdates(arenaId: string, callback: (data: PriceDataPoint) => void): () => void {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`wss://api.polyhedx.com/ws/arenas/${arenaId}/prices`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Return unsubscribe function
    return () => {
      ws.close();
    };
  }

  // Enhanced mock data that simulates real market behavior
  private static getMockMarketData(arenaId: string): MarketData {
    const basePrice = 0.65;
    const volatility = 0.15;
    const currentTime = Date.now();
    
    // Simulate some price movement based on arena ID
    const seed = arenaId.charCodeAt(0) % 100;
    const priceVariation = (Math.sin(currentTime / 1000000) + Math.sin(seed / 10)) * volatility;
    
    const currentYesPrice = Math.max(0.1, Math.min(0.9, basePrice + priceVariation));
    const currentNoPrice = 1 - currentYesPrice;
    
    return {
      currentYesPrice,
      currentNoPrice,
      priceHistory: this.getMockPriceHistory('24h'),
      totalVolume: 15000 + Math.random() * 10000,
      openInterest: 8500 + Math.random() * 5000,
      liquidity: 25000 + Math.random() * 15000,
    };
  }

  private static getMockPriceHistory(timeframe: '1h' | '24h' | '7d' | '30d'): PriceDataPoint[] {
    const now = Date.now();
    const intervals = {
      '1h': 5 * 60 * 1000,    // 5 minutes
      '24h': 30 * 60 * 1000,  // 30 minutes
      '7d': 2 * 60 * 60 * 1000, // 2 hours
      '30d': 6 * 60 * 60 * 1000, // 6 hours
    };
    
    const interval = intervals[timeframe];
    const points = timeframe === '1h' ? 12 : timeframe === '24h' ? 48 : timeframe === '7d' ? 84 : 120;
    
    const data: PriceDataPoint[] = [];
    let basePrice = 0.65;
    let trend = 0;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (points - i) * interval;
      const time = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      // Simulate realistic price movement
      const randomWalk = (Math.random() - 0.5) * 0.02;
      const trendComponent = Math.sin(i / 10) * 0.01;
      const volatility = Math.random() * 0.01;
      
      trend += randomWalk + trendComponent;
      basePrice += trend;
      
      // Keep prices within bounds
      basePrice = Math.max(0.1, Math.min(0.9, basePrice));
      
      const yesPrice = basePrice;
      const noPrice = 1 - yesPrice;
      
      // Volume correlates with price movement
      const volumeMultiplier = 1 + Math.abs(trend) * 10;
      const baseVolume = timeframe === '1h' ? 500 : timeframe === '24h' ? 1000 : 2000;
      const volume = baseVolume * volumeMultiplier * (0.8 + Math.random() * 0.4);
      
      data.push({
        timestamp,
        yesPrice,
        noPrice,
        volume,
        time,
      });
    }
    
    return data;
  }
}

// Real API integration examples
export class RealDataIntegrations {
  // Example: Integrate with Polymarket API
  static async getPolymarketData(marketId: string): Promise<MarketData> {
    try {
      const response = await fetch(`https://gamma-api.polymarket.com/markets/${marketId}`);
      const data = await response.json();
      
      return {
        currentYesPrice: data.outcomeTokens[0]?.price || 0.5,
        currentNoPrice: data.outcomeTokens[1]?.price || 0.5,
        priceHistory: data.priceHistory || [],
        totalVolume: data.volume || 0,
        openInterest: data.openInterest || 0,
        liquidity: data.liquidity || 0,
      };
    } catch (error) {
      console.error('Polymarket API error:', error);
      throw error;
    }
  }

  // Example: Integrate with CoinGecko for crypto prices
  static async getCryptoPrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error('CoinGecko API error:', error);
      throw error;
    }
  }

  // Example: Integrate with sports APIs
  static async getSportsOdds(eventId: string): Promise<{ home: number; away: number }> {
    try {
      const response = await fetch(`https://api.sportsdata.io/v3/nfl/odds/json/GameOddsByWeek/2023/1`);
      const data = await response.json();
      // Process sports data to get odds
      return { home: 0.6, away: 0.4 }; // Mock return
    } catch (error) {
      console.error('Sports API error:', error);
      throw error;
    }
  }
}
