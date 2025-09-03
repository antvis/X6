import type { ConnectionStrategyDefinition } from './index'

export const noop: ConnectionStrategyDefinition = (terminal) => terminal
