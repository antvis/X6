import { KeyValue } from '../../types'
import { Connector } from '../connector'
import { registerEntity, getEntity } from './util'

export namespace ConnectorRegistry {
  const connectors: {
    [name: string]: Connector.Definition<Connector.BaseOptions>
  } = {}

  export function register<T extends Connector.NativeNames>(
    name: T,
    fn: Connector.Definition<Connector.OptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: Connector.Definition<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: Connector.Definition<T>,
    force: boolean = false,
  ) {
    registerEntity(connectors, name, fn, force, () => {
      throw new Error(`Router with name '${name}' already registered.`)
    })
  }

  export function getConnector<T extends Connector.NativeNames>(
    name: T,
  ): Connector.Definition<Connector.OptionsMap[T]>
  export function getConnector<T extends KeyValue = KeyValue>(
    name: string,
  ): Connector.Definition<T> | null
  export function getConnector(name: string) {
    return getEntity(connectors, name)
  }

  export function getConnectorNames() {
    return Object.keys(connectors)
  }
}

// Regiter native routers
// ----
Object.keys(Connector).forEach(key => {
  const name = key as Connector.NativeNames
  const fn = Connector[name]
  if (typeof fn === 'function') {
    ConnectorRegistry.register(name, fn, true)
  }
})
