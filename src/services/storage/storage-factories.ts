import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { StorageSession } from '../../model/storage/session.model'
import { Dapps } from '../../model/storage/dapps.model'

export function networkFactory(): Network {
  return { ...networks[0] }
}

export function networkListFactory(): Network[] {
  return Object.assign([], networks)
}

export function swarmFactory(): Swarm {
  return {
    extensionId: process.env.SWARM_EXTENSION_ID,
  }
}

export function sessionFactory(): StorageSession {
  return null
}

export function dappsFactory(): Dapps {
  return {}
}
