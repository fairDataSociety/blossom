import BackgroundAction from '../../constants/background-actions.enum'

/**
 * This interface describes how an action should be processed and how data should be validated
 * for that action
 */
export interface ActionHandler<Data> {
  action: BackgroundAction
  assert?: (data: unknown) => data is Data
  handler: (data: Data) => Promise<unknown>
}

/**
 * Utility function that creates a message handler function for a list of possible actions
 * @param handlers Array of action handler objects
 * @returns A message handler function used to pocess actions
 */
export function createMessageHandler(
  handlers: ActionHandler<unknown>[],
): (action: BackgroundAction, data: unknown) => Promise<unknown> {
  return (action: BackgroundAction, data: unknown): Promise<unknown> => {
    const handlerObject = handlers.find((handler) => handler.action === action)

    if (!handlerObject) {
      return null
    }

    const { assert, handler } = handlerObject

    if (assert && !assert(data)) {
      return Promise.reject(`Blossom: Invalid message data for action ${action}`)
    }

    return handler(data)
  }
}
