import { KeyValue } from '../../types'
import { Filter } from '../filter'
import { Registry } from './registry'

export const FilterRegistry = new Registry<Filter.Definition<KeyValue>>({
  onError(name) {
    throw new Error(`Filter with name '${name}' already registered.`)
  },
})

Object.keys(Filter).forEach(key => {
  const name = key as Filter.NativeNames
  const entity = Filter[name] as Filter.Definition<any>
  if (entity) {
    FilterRegistry.register(name, entity, true)
  }
})
