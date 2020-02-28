import { version as v } from '../version'
import { NodeRegistry } from './registry'
import { Globals } from './core/globals'

export namespace x6 {
  export const version = v
  export const registerNode = NodeRegistry.register
}

export namespace x6 {
  /**
   * Turn on/off collect information of user client.
   *
   * In order to serve the users better, x6 will send the URL and version
   * information back to the AntV server:https://kcart.alipay.com/web/bi.do
   *
   * Except for URL and G2 version information, no other information will
   * be collected.
   *
   * @param enabled Specifies if seed client information to AntV server.
   */
  export function track(enabled: boolean) {
    Globals.trackable = enabled
  }
}
