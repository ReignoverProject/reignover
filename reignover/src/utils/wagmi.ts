import { getDefaultClient } from 'connectkit'
import { chain, createClient } from 'wagmi'

const chains = [chain.hardhat, chain.polygonMumbai]

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'Reignover Project',
    chains,
  }),
)
