import React from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import Main from '../pages/main/main'
import Network from '../pages/network/network'
import NetworkAdd from '../pages/network/network-add'
import NetworkEdit from '../pages/network/network-edit'
import DappPermissions from '../pages/permissions/dapp-permissions/dapp-permissions.component'
import Permissions from '../pages/permissions/permissions'
import Swarm from '../pages/swarm/swarm'
import RouteCodes from './route-codes'
import WalletRoutes from '../../common/components/wallet/routes/wallet-routes'
import Configuration from '../pages/configuration/configuration.component'
import WalletConfig from '../pages/wallet-config/wallet-config.component'
import About from '../pages/about/about'
import PrivacyPolicy from '../pages/privacy-policy/privacy-plicy'

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={RouteCodes.home} element={<Main />} />
        <Route path={RouteCodes.settings} element={<Configuration />} />
        <Route path={RouteCodes.network} element={<Network />} />
        <Route path={RouteCodes.networkAdd} element={<NetworkAdd />} />
        <Route path={RouteCodes.networkEdit} element={<NetworkEdit />} />
        <Route path={RouteCodes.swarm} element={<Swarm />} />
        <Route path={RouteCodes.walletConfig} element={<WalletConfig />} />
        <Route path={RouteCodes.permissions} element={<Permissions />} />
        <Route path={RouteCodes.permissionsEdit} element={<DappPermissions />} />
        <Route path={`${RouteCodes.wallet}/*`} element={<WalletRoutes />} />
        <Route path={RouteCodes.about} element={<About />} />
        <Route path={RouteCodes.privacyPolicy} element={<PrivacyPolicy />} />
      </ReactRoutes>
    </>
  )
}

export default Routes
