import { ErrorCode, errors as globalErrors } from '../constants/errors'
import { ErrorObject } from '../model/error.model'
import { removeWarningBadge, setWarningBadge } from '../utils/extension'
import { Storage } from './storage/storage.service'
import { Errors as ErrorsModel } from '../model/storage/general.model'

export class Errors {
  private storage: Storage = new Storage()

  public async refreshGlobalError() {
    const errors = await this.getErrors()

    ;(this.hasErrors(errors) ? setWarningBadge : removeWarningBadge)()
  }

  public async getMostImportantMessage(): Promise<string | null> {
    const errors = await this.getErrors()

    const mostImportantError = Object.values(errors).reduce(
      (mostImportantError, currentError) => {
        return mostImportantError.priority < currentError.priority ? mostImportantError : currentError
      },
      { priority: 100 } as ErrorObject,
    )

    return mostImportantError ? mostImportantError.message : null
  }

  public async addGlobalError(errorCode: ErrorCode): Promise<ErrorObject> {
    const errors = await this.getErrors()

    const error = { ...globalErrors[errorCode] }

    errors[errorCode] = error

    await this.updateErrors(errors)

    setWarningBadge()

    return error
  }

  public async removeGlobalError(errorCode: ErrorCode) {
    const errors = await this.getErrors()

    delete errors[errorCode]

    await this.updateErrors(errors)

    if (this.hasErrors(errors)) {
      removeWarningBadge()
    }
  }

  private hasErrors(errors: ErrorsModel): boolean {
    return errors && Object.keys(errors).length === 0
  }

  private async getErrors(): Promise<ErrorsModel> {
    const { errors } = await this.storage.getGeneral()

    return errors
  }

  private updateErrors(errors: ErrorsModel): Promise<void> {
    return this.storage.updateGeneral({ errors })
  }
}
