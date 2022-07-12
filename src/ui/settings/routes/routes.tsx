import React from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import Main from '../pages/main/main'
import Network from '../pages/network/network'
import NetworkAdd from '../pages/network/network-add'
import NetworkEdit from '../pages/network/network-edit'
import RouteCodes from './route-codes'

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={RouteCodes.home} element={<Main />} />
        <Route path={RouteCodes.network} element={<Network />} />
        <Route path={RouteCodes.networkAdd} element={<NetworkAdd />} />
        <Route path={RouteCodes.networkEdit} element={<NetworkEdit />} />
      </ReactRoutes>
    </>
  )
}

export default Routes
