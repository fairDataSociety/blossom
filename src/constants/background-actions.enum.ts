enum BackgroundAction {
  LOGIN = 'login',
  REGISTER = 'register',
  CHECK_USERNAME = 'check-username',
  GET_LOCALES = 'get-locales',
  GENERATE_WALLET = 'generate-wallet',
  OPEN_AUTH_PAGE = 'open-auth-page',
  GET_BALANCE = 'get-balance',
  SETTINGS_GET_SELECTED_NETWORK = 'settings-get-selected-network',
  SETTINGS_GET_NETWORK_LIST = 'settings-get-network-list',
  SETTINGS_ADD_NETWORK = 'settings-add-network',
  SETTINGS_EDIT_NETWORK = 'settings-edit-network',
  SETTINGS_DELETE_NETWORK = 'settings-delete-network',
  SETTINGS_GET_SWARM = 'settings-get-swarm',
  SETTINGS_SET_SWARM = 'settings-set-swarm',
  ECHO = 'echo',
}

export default BackgroundAction
