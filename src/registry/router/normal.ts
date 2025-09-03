import type { RouterDefinition } from './index'

export type NormalRouterOptions = {}

export const normal: RouterDefinition<NormalRouterOptions> = (vertices) => [
  ...vertices,
]
