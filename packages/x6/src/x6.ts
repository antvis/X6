import { Globals } from './core/globals'
import { version as v } from './version'
import {
  AttrRegistry,
  NodeRegistry,
  EdgeRegistry,
  ViewRegistry,
  RouterRegistry,
  NodeAnchorRegistry,
  EdgeAnchorRegistry,
  ConnectorRegistry,
  ConnectionPointRegistry,
  GridRegistry,
  FilterRegistry,
  BackgroundRegistry,
  HighlighterRegistry,
  PortLayoutRegistry,
  PortLabelLayoutRegistry,
} from './registry'

export namespace X6 {
  export const version = v
}

export namespace X6 {
  export const registerAttr = AttrRegistry.register
  export const registerNode = NodeRegistry.register
  export const registerEdge = EdgeRegistry.register
  export const registerView = ViewRegistry.register
  export const registerRouter = RouterRegistry.register
  export const registerConnector = ConnectorRegistry.register
  export const registerNodeAnchor = NodeAnchorRegistry.register
  export const registerEdgeAnchor = EdgeAnchorRegistry.register
  export const registerConnectionPoint = ConnectionPointRegistry.register
  export const registerPortLayout = PortLayoutRegistry.register
  export const registerPortLabelLayout = PortLabelLayoutRegistry.register
  export const registerGrid = GridRegistry.register
  export const registerFilter = FilterRegistry.register
  export const registerBackground = BackgroundRegistry.register
  export const registerHighlighter = HighlighterRegistry.register
}

export namespace X6 {
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
