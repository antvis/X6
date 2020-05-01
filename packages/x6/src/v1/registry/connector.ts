import { Connector } from '../connector'
import { Registry } from './registry'

export const ConnectorRegistry = Registry.create<
  Connector.Definition,
  Connector.Presets
>({
  type: 'connector',
})

ConnectorRegistry.register(Connector.presets, true)
