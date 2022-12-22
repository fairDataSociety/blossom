import BackgroundAction from '../../constants/background-actions.enum'
import { networks } from '../../constants/networks'
import { isDapp, isNetwork, isNetworkEditData, isString, isSwarm } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'
import { NetworkEditData } from '../../model/internal-messages.model'
import { Dapp } from '../../model/storage/dapps.model'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SessionService } from '../../services/session.service'
import { Storage } from '../../services/storage/storage.service'
import { createMessageHandler } from './message-handler'

const storage = new Storage()
const sessionService = new SessionService()

export function getSelectedNetwork(): Promise<Network> {
  return storage.getNetwork()
}

export function getNetworkList(): Promise<Network[]> {
  return storage.getNetworkList()
}

export function addNetwork(network: Network): Promise<void> {
  return storage.addNetworkToList(network)
}

export async function editNetwork({ label, network }: NetworkEditData): Promise<void> {
  await storage.updateNetworkInList(label, network)

  const currentNetwork = await storage.getNetwork()

  if (currentNetwork.label === network.label) {
    storage.setNetwork(network)
  }
}

export async function deleteNetwork(network: Network): Promise<void> {
  await storage.deleteNetworkFromList(network)

  const currentNetwork = await storage.getNetwork()

  if (currentNetwork.label === network.label) {
    storage.setNetwork(networks[0])
  }
}

export function getSwarmSettings(): Promise<Swarm> {
  return storage.getSwarm()
}

export function setSwarmSettings(swarm: Swarm): Promise<void> {
  return storage.setSwarm(swarm)
}

export async function getAllDappIds(): Promise<DappId[]> {
  const session = await sessionService.load()

  const dapps = await storage.getDappsBySession(session)

  return Object.keys(dapps)
}

export async function getDappSettings(dappId: DappId): Promise<Dapp> {
  const session = await sessionService.load()

  const dapp = await storage.getDappBySession(dappId, session)

  return dapp
}

export async function updateDappSettings(dapp: Dapp): Promise<void> {
  const session = await sessionService.load()

  return storage.updateDappBySession(dapp.dappId, dapp, session)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.SETTINGS_GET_SELECTED_NETWORK,
    handler: getSelectedNetwork,
  },
  {
    action: BackgroundAction.SETTINGS_GET_NETWORK_LIST,
    handler: getNetworkList,
  },
  {
    action: BackgroundAction.SETTINGS_ADD_NETWORK,
    assert: isNetwork,
    handler: addNetwork,
  },
  {
    action: BackgroundAction.SETTINGS_EDIT_NETWORK,
    assert: isNetworkEditData,
    handler: editNetwork,
  },
  {
    action: BackgroundAction.SETTINGS_DELETE_NETWORK,
    assert: isNetwork,
    handler: deleteNetwork,
  },
  {
    action: BackgroundAction.SETTINGS_GET_SWARM,
    handler: getSwarmSettings,
  },
  {
    action: BackgroundAction.SETTINGS_SET_SWARM,
    assert: isSwarm,
    handler: setSwarmSettings,
  },
  {
    action: BackgroundAction.GET_ALL_DAPP_IDS,
    handler: getAllDappIds,
  },
  {
    action: BackgroundAction.GET_DAPP_SETTINGS,
    assert: isString,
    handler: getDappSettings,
  },
  {
    action: BackgroundAction.UPDATE_DAPP_SETTINGS,
    assert: isDapp,
    handler: updateDappSettings,
  },
])

export default messageHandler
