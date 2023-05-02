import { Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';

const binanceChain: Chain = {
    id: 56,
    name: 'Binance Smart Chain',
    network: 'Binance Smart Chain',
    iconUrl: 'https://bscscan.com/images/svg/brands/bnb.svg?v=1.3',
    iconBackground: '#fff',
    nativeCurrency: {
      decimals: 18,
      name: 'Binance Smart Chain',
      symbol: 'BNB',
    },
    rpcUrls: {
      public: {
        http: ['https://bsc-dataseed.binance.org/'],
      },
      default: {
        http: ['https://bsc-dataseed.binance.org/'],
      },
    },
    blockExplorers: {
      default: { name: 'BscScan', url: 'https://bscscan.com' },
      etherscan: { name: 'BscScan', url: 'https://bscscan.com' },
    },
    testnet: false,
  };

module.exports = binanceChain;