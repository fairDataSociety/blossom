import React from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import WalletRoutes from '../../common/components/wallet/routes/wallet-routes'

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={`/*`} element={<WalletRoutes />} />
      </ReactRoutes>
    </>
  )
}

export default Routes
