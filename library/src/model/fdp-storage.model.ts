import type {
  FdpStorage as OriginalFdpStorage,
  PersonalStorage as OriginalPersonalStorage,
} from '@fairdatasociety/fdp-storage'

export type PersonalStorage = OriginalPersonalStorage & {
  /**
   * Checks whether dapp's pod is already created
   */
  isDappPodCreated(): Promise<boolean>
}

export type FdpStorage = Omit<OriginalFdpStorage, 'personalStorage'> & { personalStorage: PersonalStorage }
