import { getDefaultClient } from 'connectkit'
import { chain, createClient } from 'wagmi'

const chains = [chain.polygonMumbai, chain.hardhat]

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'Reignover Project',
    chains,
  }),
)
