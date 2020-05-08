import { PortLayout } from '../port'
import { Registry } from './registry'

export const PortLayoutRegistry = Registry.create<
  PortLayout.CommonDefinition,
  PortLayout.Presets
>({
  type: 'port layout',
})

PortLayoutRegistry.register(PortLayout.presets, true)
