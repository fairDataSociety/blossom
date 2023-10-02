import { RequireAtLeastOne } from '../utils/require-at-least-one'

export type Swarm = {
  extensionEnabled: boolean
} & RequireAtLeastOne<{
  swarmUrl?: string
  extensionId?: string
}>
