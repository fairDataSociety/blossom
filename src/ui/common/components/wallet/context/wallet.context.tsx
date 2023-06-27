import React, { useState } from 'react'
import { createContext, useContext } from 'react'
import { Network } from '../../../../../model/storage/network.model'

export interface IWalletContext {
  walletNetwork?: Network
  setWalletNetwork: (walletNetwork: Network) => void
}

const WalletContext = createContext<IWalletContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWalletNetwork: () => {},
})

export const useWallet = () => useContext(WalletContext)

export interface WalletContextProps {
  children: React.ReactNode
}

export const WalletProvider = ({ children }: WalletContextProps) => {
  const [walletNetwork, setWalletNetwork] = useState<Network | null>(null)

  return (
    <WalletContext.Provider
      value={{
        walletNetwork,
        setWalletNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
