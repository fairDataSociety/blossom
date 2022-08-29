import { BigNumber } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isAddress } from '../../messaging/message.asserts'
import { Address } from '../../model/general.types'
import { createMessageHandler } from './message-handler'
import { Blockchain } from '../../services/blockchain.service'

const blockchain = new Blockchain()

export function getAccountBalance(address: Address): Promise<BigNumber> {
  return blockchain.getAccountBalance(address)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.GET_BALANCE,
    assert: isAddress,
    handler: getAccountBalance,
  },
])

export default messageHandler
