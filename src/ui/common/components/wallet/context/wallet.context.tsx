import React, { useState } from 'react'
import { createContext, useContext } from 'react'
import { Network } from '../../../../../model/storage/network.model'
import { Token } from '../../../../../model/storage/wallet.model'

export interface IWalletContext {
  walletNetwork?: Network
  selectedToken?: Token
  setWalletNetwork: (walletNetwork: Network) => void
  setSelectedToken: (token?: Token) => void
}

const WalletContext = createContext<IWalletContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWalletNetwork: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedToken: () => {},
})

export const useWallet = () => useContext(WalletContext)

export interface WalletContextProps {
  children: React.ReactNode
}

export const WalletProvider = ({ children }: WalletContextProps) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [walletNetwork, setWalletNetwork] = useState<Network | null>(null)

  return (
    <WalletContext.Provider
      value={{
        selectedToken,
        walletNetwork,
        setWalletNetwork,
        setSelectedToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
