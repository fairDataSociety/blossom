import './listeners'
import { SessionService } from './services/session.service'

const session = new SessionService()

session.load()
