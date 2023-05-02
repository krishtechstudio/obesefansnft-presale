import { Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';

const binanceChain: Chain = {
    id: 97,
    name: 'Binance Smart Chain Testnet',
    network: 'Binance Smart Chain Testnet',
    iconUrl: 'https://bscscan.com/images/svg/brands/bnb.svg?v=1.3',
    iconBackground: '#fff',
    nativeCurrency: {
      decimals: 18,
      name: 'Binance Smart Chain Testnet',
      symbol: 'tBNB',
    },
    rpcUrls: {
      public: {
        http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      },
      default: {
        http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      },
    },
    blockExplorers: {
      default: { name: 'BscScan Testnet', url: 'https://explorer.binance.org/smart-testnet' },
      etherscan: { name: 'BscScan Testnet', url: 'https://explorer.binance.org/smart-testnet' },
    },
    testnet: true,
  };

module.exports = binanceChain;