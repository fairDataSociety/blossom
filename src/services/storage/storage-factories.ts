import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { Session } from '../../model/storage/session.model'
import { AccountDapps, Dapp, Dapps } from '../../model/storage/dapps.model'
import { Accounts } from '../../model/storage/account.model'
import { DappId } from '../../model/general.types'
import { General } from '../../model/storage/general.model'
import { Wallets } from '../../model/storage/wallet.model'
import { DEFAULT_BEE_URL, LOCAL_BEE_URL } from '../../constants/constants'

export function networkFactory(): Network {
  return { ...networks[0] }
}

export function networkListFactory(): Network[] {
  return Object.assign([], networks)
}

export function swarmFactory(): Swarm {
  return {
    extensionEnabled: false,
    swarmUrl: process.env.ENVIRONMENT === 'development' ? LOCAL_BEE_URL : DEFAULT_BEE_URL,
    extensionId: process.env.SWARM_EXTENSION_ID,
  }
}

export function sessionFactory(): Session {
  return null
}

export function dappsFactory(): Dapps {
  return {}
}

export function accountDappsFactory(): AccountDapps {
  return {
    ens: {},
    local: {},
  }
}

export function dappFactory(dappId: DappId): Dapp {
  return {
    podPermissions: {},
    fullStorageAccess: false,
    accountInfoAccess: false,
    dappId,
  }
}

export function accountsFactory(): Accounts {
  return {}
}

export function generalFactory(): General {
  return {
    errors: {},
  }
}

export function walletsFactory(): Wallets {
  return {}
}

export function walletTransactionsFactory(wallets: Wallets, accountName: string, networkLabel?: string) {
  let wallet = wallets[accountName]

  if (!wallet) {
    wallet = wallets[accountName] = {
      transactionsByNetworkLabel: {},
      accounts: {},
      config: {},
      tokens: {},
    }
  }

  if (!wallet.transactionsByNetworkLabel) {
    wallet.transactionsByNetworkLabel = {}
  }

  if (!wallet.tokens) {
    wallet.tokens = {}
  }

  if (networkLabel && !wallet.transactionsByNetworkLabel[networkLabel]) {
    wallet.transactionsByNetworkLabel[networkLabel] = {
      regular: [],
      asset: [],
    }
  }

  if (networkLabel && !wallet.tokens[networkLabel]) {
    wallet.tokens[networkLabel] = []
  }
}
