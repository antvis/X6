import { PortLabelLayout } from '../port'
import { Registry } from './registry'

export const PortLabelLayoutRegistry = Registry.create<
  PortLabelLayout.CommonDefinition,
  PortLabelLayout.Presets
>({
  type: 'port label layout',
})

PortLabelLayoutRegistry.register(PortLabelLayout.presets, true)
