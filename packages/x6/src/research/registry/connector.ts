import { Connector } from '../connector'
import { Registry } from './registry'

export const ConnectorRegistry = new Registry<
  Connector.Definition,
  never,
  typeof Connector
>({
  onError(name) {
    throw new Error(`Connector with name '${name}' already registered.`)
  },
})

Object.keys(Connector).forEach(key => {
  const name = key as Connector.NativeNames
  const entity = Connector[name]
  if (typeof entity === 'function') {
    ConnectorRegistry.register(name, entity, true)
  }
})
