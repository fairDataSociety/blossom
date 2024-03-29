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
    network1.fdsRegistrar === network2.fdsRegistrar &&
    network1.publicResolver === network2.publicResolver
  )
}

export function isUint8Array(data: unknown): data is Uint8Array {
  return ArrayBuffer.isView(data)
}

export function isPromise(value: unknown): value is Promise<unknown> {
  const promise = (value || {}) as Promise<unknown>

  return typeof promise.then === 'function' && typeof promise.catch === 'function'
}
