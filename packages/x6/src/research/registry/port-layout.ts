import { KeyValue } from '../../types'
import { PortLayout } from '../port-layout'
import { Registry } from './registry'

export const PortLayoutRegistry = new Registry<
  PortLayout.Definition<KeyValue>,
  never,
  typeof PortLayout
>({
  onError(name) {
    throw new Error(`Port layout with name '${name}' already registered.`)
  },
})

Object.keys(PortLayout).forEach(key => {
  const name = key as PortLayout.NativeNames
  const fn = PortLayout[name]
  if (typeof fn === 'function') {
    PortLayoutRegistry.register(name, fn, true)
  }
})
