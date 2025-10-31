import React from 'react';
// WalletConnect polyfills for CRA/browser
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3Provider } from './providers/Web3Provider';

// No extra polyfills needed for HashConnect path

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);
