import type {
  FdpStorage as OriginalFdpStorage,
  PersonalStorage as OriginalPersonalStorage,
} from '@fairdatasociety/fdp-storage'

export type PersonalStorage = OriginalPersonalStorage & {
  /**
   * Checks whether dapp's pod is already created
   */
  isDappPodCreated(): Promise<boolean>

  /**
   * Asks the user for full access of personal storage (access all pods).
   * If full access is not already allowed, user will be asked to allow
   * via popup and return result. If it's already allowed, it will return
   * true and won't show any popup to the user.
   */
  requestFullAccess(): Promise<boolean>
}

export type FdpStorage = Omit<OriginalFdpStorage, 'personalStorage'> & { personalStorage: PersonalStorage }
