import { ConnectKitProvider } from 'connectkit'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { client } from '../wagmi'

interface Props {
  children: React.ReactNode
}

export const Web3ContextProvider = ({ children }: Props) => {

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

