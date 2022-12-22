import './listeners'
import { SessionService } from './services/session.service'
import './services/update.service'
import './live-reload'

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const session = new SessionService()

try {
  session.load()
  // eslint-disable-next-line no-empty
} catch (error) {}
