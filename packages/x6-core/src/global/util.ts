import { Config } from './config'

export namespace Util {
  export function prefix(suffix: string) {
    return `${Config.prefixCls}-${suffix}`
  }
}
