import { FunctionExt } from '../../../util'
import { Router } from '../index'
import { router } from './router'
import { defaults, ManhattanRouterOptions } from './options'

export const manhattan: Router.Definition<Partial<ManhattanRouterOptions>> =
  function (vertices, options, edgeView) {
    return FunctionExt.call(
      router,
      this,
      vertices,
      { ...defaults, ...options },
      edgeView,
    )
  }
