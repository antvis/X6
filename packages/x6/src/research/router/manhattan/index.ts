import { Router } from '../index'
import { router } from './router'
import { defaults, ManhattanRouterOptions } from './options'

export const manhattan: Router.Definition<Partial<
  ManhattanRouterOptions
>> = function(vertices, options, edgeView) {
  const ret = router.call(this, vertices, { ...defaults, ...options }, edgeView)
  console.log(vertices, ret)
  return ret
}
