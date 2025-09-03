import { FunctionExt } from '../../../common'
import type { RouterDefinition } from '../index'
import { defaults, type ManhattanRouterOptions } from './options'
import { router } from './router'

export const manhattan: RouterDefinition<Partial<ManhattanRouterOptions>> =
  function (vertices, options, edgeView) {
    return FunctionExt.call(
      router,
      this,
      vertices,
      { ...defaults, ...options },
      edgeView,
    )
  }
