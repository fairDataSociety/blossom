import { DappId } from '../general.types'

export enum DappPermissions {
  CREATE_POD = 'create-pod',
}

export enum PodActions {
  ALL = 'all',
}

export interface PodPermission {
  podName: string
  allowedActions: PodActions[]
}

export interface Dapp {
  podPermissions: Record<string, PodPermission>
  fullStorageAccess: boolean
}

export interface Dapps {
  [id: DappId]: Dapp
}

export interface AccountDapps {
  ens: Record<string, Dapps>
  local: Record<string, Dapps>
}
