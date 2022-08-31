import { BeeDebug } from '@ethersphere/bee-js'

/**
 * Gets postage batch ID from already created batches
 *
 * @param beeDebug BeeDebug instance for interaction
 */
export async function getBatchId(beeDebugUrl: string): Promise<string> {
  const beeDebug = new BeeDebug(beeDebugUrl)

  const batches = await beeDebug.getAllPostageBatch()

  if (batches.length === 0) {
    throw new Error('Postage batch not exists')
  }

  const batchId = batches.pop()?.batchID

  if (!batchId) {
    throw new Error('Incorrect batch id found')
  }

  return batchId
}
