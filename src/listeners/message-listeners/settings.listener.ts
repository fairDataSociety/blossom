import BackgroundAction from '../../constants/background-actions.enum'
import { networks } from '../../constants/networks'
import { isNetwork, isNetworkEditData, isSwarm } from '../../messaging/message.asserts'
import { NetworkEditData } from '../../model/internal-messages.model'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { Storage } from '../../services/storage/storage.service'
import { createMessageHandler } from './message-handler'

const storage = new Storage()

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
])

export default messageHandler
