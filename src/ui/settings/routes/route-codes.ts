enum RouteCodes {
  home = '/',
  settings = '/settings',
  network = '/settings/network',
  networkAdd = '/settings/add-network',
  networkEdit = '/settings/network/:label',
  swarm = '/settings/swarm',
  walletConfig = '/settings/wallet',
  permissions = '/permissions',
  permissionsEdit = '/permissions/:dappId',
  wallet = '/wallet',
  about = '/about',
  privacyPolicy = '/privacy-policy',
}

export default RouteCodes
