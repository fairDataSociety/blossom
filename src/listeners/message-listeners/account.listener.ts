import { BigNumber } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isAccount } from '../../messaging/message.asserts'
import { Account } from '../../model/general.types'
import { createMessageHandler } from './message-handler'
import { Blockchain } from '../../services/blockchain.service'

const blockchain = new Blockchain()

export function getAccountBalance(account: Account): Promise<BigNumber> {
  return blockchain.getAccountBalance(account)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.GET_BALANCE,
    assert: isAccount,
    handler: getAccountBalance,
  },
])

export default messageHandler
