## Polyhedx 🎲
Prediction arenas on Hedera — compete in curated, time‑boxed prediction battles across Crypto, Sports, and Culture. Connect your wallet, stake small amounts of HBAR, and climb the leaderboard. Win bragging rights, HBAR rewards, and collectible NFTs.

### 🚀 Overview
Millions love making predictions — markets, games, culture. But informal prediction games lack automation, transparency, and global reach. Polyhedx brings this experience onchain on Hedera: fast, low‑fee, and transparent. Arenas are curated contests where users vote Yes/No with HBAR, and results are resolved fairly via an admin flow today, with onchain automation on the roadmap.

### 💡 Key Features
- **Wallet Integration**: HashPack and Blade support; WalletConnect (Reown/AppKit) via Hedera RPC
- **Prediction Arenas**: Curated topics with deadlines, liquidity, and real‑time price vibes
- **Stakes & Rewards**: Stake HBAR on outcomes; earn points, HBAR rewards, and NFTs
- **Leaderboard**: Global rankings for accuracy and activity
- **Admin Tools**: Create arenas and resolve results during MVP
- **Polished UI**: Tailwind + Framer Motion, responsive, mobile‑first

### 🧱 Tech Stack
- **Frontend**: React 18, TypeScript, React Router
- **Styling/UX**: Tailwind CSS, Framer Motion, Lucide Icons
- **State/Data**: React Context + useReducer, TanStack Query
- **Web3 (Hedera)**: viem `defineChain` for Hedera 295/296, Wagmi, Reown/AppKit (WalletConnect), HashPack/Blade direct extension support
- **Build Tooling**: Create React App

### 🪙 Current Setup
- Network: Hedera Testnet by default
- RPC: Hashio (`https://testnet.hashio.io/api`)
- Explorer: HashScan Testnet
- Balance reads via Mirror Node
- Market data mocked with graceful fallback to demo APIs

### 🔧 Configuration
Create a `.env` in the project root with the following keys:

```env
# WalletConnect / Reown project id (one of these required)
REACT_APP_WC_PROJECT_ID=your_project_id

# Hedera network selection: mainnet | testnet | previewnet (defaults to testnet)
REACT_APP_NETWORK=testnet
```

### 🧪 Getting Started
1. Install Node.js 18+ and npm
2. Clone and install
   ```bash
   git clone https://github.com/manuel-xeroz/POLYHEDX.git
   cd polyhedx
   npm install
   ```
3. Configure environment (see ".env" above)
4. Run the app
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

Build for production:
```bash
npm run build
```

### 🎮 How It Works (MVP)
- Users connect with HashPack/Blade or via WalletConnect
- Browse arenas, place Yes/No stakes, view live stats and timers
- Admin resolves results; users see outcomes, claimables, and rankings
- Local storage persists demo state; APIs are mocked with upgrade path to real data

### 🌐 Why Onchain (Hedera)
- **Trust & Transparency**: Verifiable outcomes and fair rules
- **Speed & Cost**: Finality and low fees ideal for micro‑stakes
- **NFTs & Identity**: On‑platform reputation and collectibles

### 🧠 Challenges (During Hackathon)
- Dual wallet pathways (extensions + WC) UX edge cases
- Mirror node balance reads and rate limits
- Time constraints: onchain settlement and NFT minting scoped to roadmap

### 📈 Roadmap
- **Phase 1 – MVP (Current)**: Wallets, curated arenas, leaderboard, admin resolution
- **Phase 2 – Onchain**: Smart‑contract escrow for arenas, automated resolution, NFT minting
- **Phase 3 – Scale**: Oracle integrations, liquidity/AMM mechanics, advanced analytics, social

### 👥 Target Users
- Crypto‑native communities and degens
- Sports, culture, and market watchers
- Social communities running friendly prediction games

### 📁 Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/               # App pages (Landing, Arenas, Leaderboard, Results, Admin)
├── context/             # Global state (Context + useReducer)
├── services/            # Hedera wallet + data services
├── data/                # Mock data for demo
├── types/               # TypeScript domain types
└── utils/               # Helpers
```

### 🧹 Coding Practices
- Modular components, typed props, clear domain types
- Guard‑clause driven logic; minimal shared mutable state
- Separation of concerns: UI, state, web3, and data services

### 🔗 Links
- Live App: https://polyhedx.vercel.app/
- GitHub: https://github.com/manuel-xeroz/POLYHEDX.git
- Certification Link: https://ibb.co/4Z9dPRtV
- Pitch/Deck: https://drive.google.com/file/d/1Carif6UEFWs-4yCq1nFBG6_YzLO9iVIA/view?usp=drive_link
- YouTube video link: https://youtu.be/EV5Z6drH5HY


Built with ❤️ on Hedera
