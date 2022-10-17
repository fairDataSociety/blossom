import './listeners'
import { SessionService } from './services/session.service'
import './live-reload'

const session = new SessionService()

session.load()
