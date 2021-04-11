import { Global } from './global'

export namespace Env {
  export const isDev = process.env.NODE_ENV === 'development'

  export function isIE() {
    return (Global.document as any).documentMode != null
  }
}
