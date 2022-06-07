import BackgroundAction from '../constants/background-actions.enum'

export function isBackgroundAction(action: unknown): action is BackgroundAction {
  return (<any>Object).values(BackgroundAction).includes(action)
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}
