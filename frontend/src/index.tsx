import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Verify from './pages/Verify';
import Mint from './pages/Mint';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Chain,
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import theme from './theme'

const mumbaiChain: Chain = {
  id: 137,
  name: 'Mumbai',
  network: 'mumbai',
  iconUrl: 'pending',
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: 'https://rpc-mumbai.matic.today',
  },
  blockExplorers: {
    default: { name: 'Polygon Mumbai Explorer', url: 'https://rpc-mumbai.matic.today' },
    etherscan: { name: 'Polygon Mumbai Explorer', url: 'https://rpc-mumbai.matic.today' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [mumbaiChain],
  [
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'zkPOAPs',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={midnightTheme()} coolMode>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="verify" element={<Verify />} />
        <Route path="mint" element={<Mint />} />
        </Routes>
        </BrowserRouter>
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
    </ThemeProvider>
</React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();