import { PersonalStorage } from '@fairdatasociety/fdp-storage'
import { HDNode } from 'ethers/lib/utils'
import { IS_DAPP_POD_CREATED } from '../../constants/fdp-storage-methods'
import { getWalletByIndex } from '../../utils/ethers'

export async function isDappPodCreated(podName: string): Promise<boolean> {
  const personalStorage = this as PersonalStorage

  const podList = await personalStorage.list()

  return podList.pods.some((pod) => pod.name === podName)
}

export async function getPodWallet(seed: Uint8Array, podName: string): Promise<HDNode | null> {
  const podIndex = await getPodIndex(this, podName)

  return podIndex === null ? null : getWalletByIndex(seed, podIndex)
}

export type PersonalStorageExtension = {
  isDappPodCreated(podName: string): Promise<boolean>
  getPodWallet(seed: Uint8Array, podName: string): Promise<HDNode>
}

export type ExtendedPersonalStorage = PersonalStorage & PersonalStorageExtension

export function createPersonalStorageProxy(personalStorage: PersonalStorage): ExtendedPersonalStorage {
  return new Proxy<ExtendedPersonalStorage>(
    personalStorage as ExtendedPersonalStorage,
    {
      get(target: PersonalStorage, property: string) {
        if (property === IS_DAPP_POD_CREATED) {
          return isDappPodCreated.bind(target)
        }

        if (property === 'getPodWallet') {
          return getPodWallet.bind(target)
        }

        return target[property]
      },
    } as ProxyHandler<ExtendedPersonalStorage>,
  )
}

async function getPodIndex(personalStorage: PersonalStorage, podName: string): Promise<number | null> {
  const podList = await personalStorage.list()

  const pod = podList.pods.find((pod) => pod.name === podName)

  return pod ? pod.index : null
}
