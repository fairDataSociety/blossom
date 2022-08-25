import { DappId } from '../general.types'

export enum DappPermissions {
  CREATE_POD = 'create-pod',
}

export interface Dapp {
  permissions: DappPermissions[]
}

export interface Dapps {
  [id: DappId]: Dapp
}
