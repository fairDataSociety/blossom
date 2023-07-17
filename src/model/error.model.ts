import { ErrorCode } from '../constants/errors'

export interface ErrorObject {
  code: ErrorCode
  priority: number
  message: string
}
