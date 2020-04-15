import { KeyValue } from '../../types'
import { Router } from '../router'
import { Registry } from './registry'

export const RouterRegistry = new Registry<Router.Definition<KeyValue>>({
  onError(name) {
    throw new Error(`Router with name '${name}' already registered.`)
  },
})

Object.keys(Router).forEach(key => {
  const name = key as Router.NativeNames
  const entity = Router[name]
  if (typeof entity === 'function') {
    RouterRegistry.register(name, entity, true)
  }
})
