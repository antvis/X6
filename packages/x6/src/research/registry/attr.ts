import { Attr } from '../attr'
import { Registry } from './registry'

export const AttrRegistry = new Registry<Attr.Definition>({
  onError(name) {
    throw new Error(`Attr with name '${name}' already registered.`)
  },
})

Object.keys(Attr.definitions).forEach(key => {
  AttrRegistry.register(key, Attr.definitions[key], true)
})
