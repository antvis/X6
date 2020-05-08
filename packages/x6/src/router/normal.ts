import { Router } from './index'

export interface NormalRouterOptions {}

export const normal: Router.Definition<NormalRouterOptions> = function (
  vertices,
) {
  return [...vertices]
}
