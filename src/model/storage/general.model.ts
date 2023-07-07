import { ErrorCode } from '../../constants/errors'
import { ErrorObject } from '../error.model'

export type Errors = Partial<Record<ErrorCode, ErrorObject>>

export interface General {
  errors: Errors
  lockStart?: number
}
