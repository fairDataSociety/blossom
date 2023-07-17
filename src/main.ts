import './listeners'
import { SessionService } from './services/session.service'
import './services/update.service'
import './live-reload'
import { Errors } from './services/error.service'

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const session = new SessionService()
const errors = new Errors()

;(async () => {
  await Promise.all([session.load(), errors.refreshGlobalError()])
})()
