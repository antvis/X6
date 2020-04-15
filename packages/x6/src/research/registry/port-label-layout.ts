import { KeyValue } from '../../types'
import { PortLabelLayout } from '../port-label-layout'
import { Registry } from './registry'

export const PortLabelLayoutRegistry = new Registry<
  PortLabelLayout.Definition<KeyValue>,
  never,
  typeof PortLabelLayout
>({
  onError(name) {
    throw new Error(`Port label layout with name '${name}' already registered.`)
  },
})

Object.keys(PortLabelLayout).forEach(key => {
  const name = key as PortLabelLayout.NativeNames
  const fn = PortLabelLayout[name]
  if (typeof fn === 'function') {
    PortLabelLayoutRegistry.register(name, fn, true)
  }
})
