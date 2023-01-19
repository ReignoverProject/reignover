import { getDefaultClient } from 'connectkit'
import { configureChains, createClient } from 'wagmi'
import { hardhat, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

// const chains = [chain.hardhat, chain.polygonMumbai]

const { chains, provider } = configureChains([hardhat, polygonMumbai], [publicProvider()])

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'Reignover Project',
    chains,
    provider,
  }),
)
 