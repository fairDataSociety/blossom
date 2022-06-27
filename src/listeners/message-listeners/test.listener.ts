import BackgroundAction from '../../constants/background-actions.enum'

export default function handler(action: BackgroundAction, data: unknown): Promise<unknown> {
  if (action === BackgroundAction.ECHO) {
    return new Promise((resolve) => {
      resolve(data)
    })
  }

  return null
}
