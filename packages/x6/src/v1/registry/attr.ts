import { Attr } from '../attr'
import { Registry } from './registry'

export const AttrRegistry = Registry.create<Attr.Definition, Attr.Presets>({
  type: 'attribute definition',
})

AttrRegistry.register(Attr.presets, true)
