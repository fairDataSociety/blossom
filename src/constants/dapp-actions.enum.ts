import BackgroundAction from './background-actions.enum'

export const DAPP_ACTIONS: string[] = [
  BackgroundAction.FDP_STORAGE,
  BackgroundAction.SIGNER_SIGN_MESSAGE,
  BackgroundAction.SEND_TRANSACTION,
  BackgroundAction.GET_USER_BALANCE,
  BackgroundAction.GET_USER_INFO,
  BackgroundAction.ECHO,
]

export const E2E_ACTIONS: string[] = [
  BackgroundAction.FDP_STORAGE,
  BackgroundAction.SIGNER_SIGN_MESSAGE,
  BackgroundAction.SEND_TRANSACTION,
  BackgroundAction.GET_USER_BALANCE,
  BackgroundAction.GET_USER_INFO,
  BackgroundAction.ECHO,
]
