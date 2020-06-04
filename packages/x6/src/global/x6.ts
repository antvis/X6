import { Config } from './config'
import { version as v } from './version'
import { CellView } from '../view'
import { Node, Edge } from '../model'
import {
  Attr,
  Background,
  Filter,
  Grid,
  NodeTool,
  EdgeTool,
  Highlighter,
  PortLayout,
  PortLabelLayout,
} from '../definition'
import {
  Router,
  Connector,
  NodeConnectionAnchor,
  EdgeConnectionAnchor,
  ConnectionPoint,
  ConnectionStrategy,
} from '../connection'

export namespace X6 {
  export const version = v
}

export namespace X6 {
  export const registerNode = Node.registry.register.bind(Node.registry)
  export const registerEdge = Edge.registry.register.bind(Edge.registry)
  export const registerView = CellView.registry.register.bind(CellView.registry)
  export const registerAttr = Attr.registry.register.bind(Attr.registry)
  export const registerGrid = Grid.registry.register.bind(Grid.registry)
  export const registerFilter = Filter.registry.register.bind(Filter.registry)
  export const registerNodeTool = NodeTool.registry.register.bind(
    NodeTool.registry,
  )
  export const registerEdgeTool = EdgeTool.registry.register.bind(
    EdgeTool.registry,
  )
  export const registerBackground = Background.registry.register.bind(
    Background.registry,
  )
  export const registerHighlighter = Highlighter.registry.register.bind(
    Highlighter.registry,
  )
  export const registerPortLayout = PortLayout.registry.register.bind(
    PortLayout.registry,
  )
  export const registerPortLabelLayout = PortLabelLayout.registry.register.bind(
    PortLabelLayout.registry,
  )

  export const registerRouter = Router.registry.register.bind(Router.registry)
  export const registerConnector = Connector.registry.register.bind(
    Connector.registry,
  )
  export const registerNodeConnectionAnchor = NodeConnectionAnchor.registry.register.bind(
    NodeConnectionAnchor.registry,
  )
  export const registerEdgeConnectionAnchor = EdgeConnectionAnchor.registry.register.bind(
    EdgeConnectionAnchor.registry,
  )
  export const registerConnectionPoint = ConnectionPoint.registry.register.bind(
    ConnectionPoint.registry,
  )
  export const registerConnectionStrategy = ConnectionStrategy.registry.register.bind(
    ConnectionStrategy.registry,
  )
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
    Config.trackable = enabled
  }
}
