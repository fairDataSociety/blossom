import React from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import WalletRouteCodes from './wallet-route-codes'
import Wallet from '../components/wallet.component'
import WalletSend from '../components/send/wallet-send.component'
import { WalletProvider } from '../context/wallet.context'

const WalletRoutes = () => {
  return (
    <WalletProvider>
      <ReactRoutes>
        <Route path={WalletRouteCodes.home} element={<Wallet />} />
        <Route path={WalletRouteCodes.send} element={<WalletSend />} />
        <Route path={WalletRouteCodes.settings} element={null} />
      </ReactRoutes>
    </WalletProvider>
  )
}

export default WalletRoutes
