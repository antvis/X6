import { KeyValue } from '../../types'
import { ConnectionPoint } from '../connection-point'
import { Registry } from './registry'

export const ConnectionPointRegistry = new Registry<
  ConnectionPoint.Definition<KeyValue>,
  never,
  typeof ConnectionPoint
>({
  onError(name) {
    throw new Error(`Connection point with name '${name}' already registered.`)
  },
})

Object.keys(ConnectionPoint).forEach(key => {
  const name = key as ConnectionPoint.NativeNames
  const fn = ConnectionPoint[name]
  if (typeof fn === 'function') {
    ConnectionPointRegistry.register(name, fn, true)
  }
})
