import { sendExtensionMessage } from '../messaging/e2e.messaging'
/**
 * Wrapper around sendExtensionMessage function.
 * Checks whether the request was successful and converts outcome to Promise
 * @param extensionId The Swarm extension ID
 * @param action Action of the Swarm extension
 * @param sessionId Session ID received by the Swarm extension
 * @param parameters Depends of the action
 * @returns Promise
 */
export async function sendSwarmExtensionMessage<Response>(
  extensionId: string,
  action: string,
  sessionId?: string,
  parameters?: unknown,
): Promise<Response> {
  const { data, error } = await sendExtensionMessage<{
    data: Response
    error: string
  }>(extensionId, { action, sessionId, parameters })

  if (error) {
    throw new Error(error)
  }

  return data
}
