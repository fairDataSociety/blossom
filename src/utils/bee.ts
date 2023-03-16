import { BeeDebug } from '@ethersphere/bee-js'

/**
 * Gets postage batch ID from already created batches
 *
 * @param beeDebugUrl URL of Bee debug API
 */
export async function getBatchId(beeDebugUrl: string): Promise<string> {
  try {
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

    return '0'
  }
}
