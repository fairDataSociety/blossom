import BackgroundAction from '../constants/background-actions.enum'
import { Network } from '../model/storage/network.model'

export const EthAddressRegex = /0x[0-9a-fA-F]{40}/g

export function isBackgroundAction(action: unknown): action is BackgroundAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<any>Object).values(BackgroundAction).includes(action)
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function areNetworksEqual(network1: Network, network2: Network): boolean {
  return (
    network1.label === network2.label &&
    network1.rpc === network2.rpc &&
    network1.ensRegistry === network2.ensRegistry &&
    network1.subdomainRegistrar === network2.subdomainRegistrar &&
    network1.publicResolver === network2.publicResolver
  )
}
