import { Config } from './config'
import { snapToGrid as snap } from '../geometry/util'

export namespace Util {
  export const snapToGrid = snap

  export function prefix(suffix: string) {
    return `${Config.prefixCls}-${suffix}`
  }
}
