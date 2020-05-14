import { Config } from './config'
import { snapToGrid as snap } from '../geometry/util'

export namespace Util {
  export function prefix(suffix: string) {
    return `${Config.prefixCls}-${suffix}`
  }

  export const snapToGrid = snap
}
