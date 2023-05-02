import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import binanceChain from '../chains/bsctestnet';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { ChakraProvider } from '@chakra-ui/react'

const { provider, chains } = configureChains(
  [binanceChain],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: binanceChain.rpcUrls.default.http[0] }),
    }),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Obesefans NFT',
  projectId: '9ff48e99aabb61a4532c70db90dcb18d',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
