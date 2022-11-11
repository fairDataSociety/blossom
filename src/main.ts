import './listeners'
import { SessionService } from './services/session.service'
import { UpdateService } from './services/update.service'
import './live-reload'

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const updater = new UpdateService()
const session = new SessionService()

session.load()
