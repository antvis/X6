import { ConnectionPoint } from '../connection-point'
import { Registry } from './registry'

export const ConnectionPointRegistry = Registry.create<
  ConnectionPoint.CommonDefinition,
  ConnectionPoint.Presets
>({
  type: 'connection point',
})

ConnectionPointRegistry.register(ConnectionPoint.presets, true)
