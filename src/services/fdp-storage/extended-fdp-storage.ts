import type { FdpStorage as OriginalFdpStorage } from '@fairdatasociety/fdp-storage'
import { ExtendedPersonalStorage } from './extended-personal-storage'

export type ExtendedFdpStorage = Omit<OriginalFdpStorage, 'personalStorage'> & {
  personalStorage: ExtendedPersonalStorage
}
