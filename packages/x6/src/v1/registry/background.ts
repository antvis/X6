import { Background } from '../style'
import { Registry } from './registry'

export const BackgroundRegistry = Registry.create<
  Background.Definition,
  Background.Presets
>({
  type: 'background pattern',
})

BackgroundRegistry.register(Background.presets, true)
