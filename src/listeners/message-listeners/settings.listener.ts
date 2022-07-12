import BackgroundAction from '../../constants/background-actions.enum'
import { isNetwork, isNetworkEditData } from '../../messaging/message.asserts'
import { NetworkEditData } from '../../model/internal-messages.model'
import { Network } from '../../model/storage/network.model'
import { Storage } from '../../services/storage/storage.service'
import { createMessageHandler } from './message-handler'

const storage = new Storage()

export function getNetworkList(): Promise<Network[]> {
  return storage.getNetworkList()
}

export function addNetwork(network: Network): Promise<void> {
  return storage.addNetworkToList(network)
}

export function editNetwork({ label, network }: NetworkEditData): Promise<void> {
  return storage.updateNetworkInList(label, network)
}

export function deleteNetwork(network: Network): Promise<void> {
  return storage.deleteNetworkFromList(network)
}

const messageHandler = createMessageHandler([
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
])

export default messageHandler
