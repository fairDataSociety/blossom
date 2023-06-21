import React from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import WalletRouteCodes from './wallet-route-codes'
import Wallet from '../components/wallet'

const WalletRoutes = () => {
  return (
    <ReactRoutes>
      <Route path={WalletRouteCodes.home} element={<Wallet />} />
      <Route path={WalletRouteCodes.send} element={null} />
      <Route path={WalletRouteCodes.settings} element={null} />
    </ReactRoutes>
  )
}

export default WalletRoutes
