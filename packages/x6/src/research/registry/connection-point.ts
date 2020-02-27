import { KeyValue } from '../../types'
import { ConnectionPoint } from '../connection-point'
import { registerEntity, getEntity } from './util'

export namespace ConnectionPointRegistry {
  const connectors: {
    [name: string]: ConnectionPoint.Definition<ConnectionPoint.BaseOptions>
  } = {}

  export function register<T extends ConnectionPoint.NativeNames>(
    name: T,
    fn: ConnectionPoint.Definition<ConnectionPoint.OptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: ConnectionPoint.Definition<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: ConnectionPoint.Definition<T>,
    force: boolean = false,
  ) {
    registerEntity(connectors, name, fn, force, () => {
      throw new Error(
        `Connection point with name '${name}' already registered.`,
      )
    })
  }

  export function get<T extends ConnectionPoint.NativeNames>(
    name: T,
  ): ConnectionPoint.Definition<ConnectionPoint.OptionsMap[T]>
  export function get<T extends KeyValue = KeyValue>(
    name: string,
  ): ConnectionPoint.Definition<T> | null
  export function get(name: string) {
    return getEntity(connectors, name)
  }

  export function getNames() {
    return Object.keys(connectors)
  }
}

Object.keys(ConnectionPoint).forEach(key => {
  const name = key as ConnectionPoint.NativeNames
  const fn = ConnectionPoint[name]
  if (typeof fn === 'function') {
    ConnectionPointRegistry.register(name, fn, true)
  }
})
