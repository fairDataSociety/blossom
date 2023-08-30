import { BeeDebug } from '@ethersphere/bee-js'
import { NULL_BATCH_ID } from '../constants/constants'

/**
 * Gets postage batch ID from already created batches
 *
 * @param beeDebugUrl URL of Bee debug API
 */
export async function getBatchId(beeDebugUrl: string): Promise<string> {
  try {
    if (!beeDebugUrl) {
      return NULL_BATCH_ID
    }

    const beeDebug = new BeeDebug(beeDebugUrl)

    const batches = await beeDebug.getAllPostageBatch()

    if (batches.length === 0) {
      throw new Error('Postage batch not exists')
    }

    const { batchID, usable } = batches.pop()

    if (!batchID || !usable) {
      throw new Error('Incorrect batch id found')
    }

    return batchID
  } catch (error) {
    console.warn(String(error))

    return NULL_BATCH_ID
  }
}
