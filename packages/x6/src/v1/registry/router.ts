import { Router } from '../router'
import { Registry } from './registry'

export const RouterRegistry = Registry.create<
  Router.CommonDefinition,
  Router.Presets
>({
  type: 'router',
})

RouterRegistry.register(Router.presets, true)
