import { Dapp, PodActions } from '../model/storage/dapps.model'

export function isPodActionAllowed(
  dapp: Dapp,
  podName: string,
  action: PodActions = PodActions.ALL,
): boolean {
  const podPermission = dapp.podPermissions[podName]
  const allowedActions = (podPermission || {}).allowedActions || []

  return dapp.fullStorageAccess || allowedActions.includes(PodActions.ALL) || allowedActions.includes(action)
}
