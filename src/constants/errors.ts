import { ErrorObject } from '../model/error.model'

export const errorMessages = {
  ACCESS_DENIED: 'Blossom: Access denied',
}

export enum ErrorCode {
  USER_NOT_LOGGED_IN,
}

export const errors: Record<ErrorCode, ErrorObject> = {
  [ErrorCode.USER_NOT_LOGGED_IN]: {
    code: ErrorCode.USER_NOT_LOGGED_IN,
    priority: 2,
    message: 'ERROR_USER_NOT_LOGGED_IN',
  },
}
