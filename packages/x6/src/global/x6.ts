import { Config } from './config'
import { version as v } from './version'
import { Node } from '../model/node'
import { Edge } from '../model/edge'
import { Model } from '../model/model'
import { CellView } from '../view'
import { Graph } from '../graph/graph'
import { Options } from '../graph/options'
import { HTML } from '../shape/standard/html'
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
  export function render(
    options: Partial<Options.Manual>,
    data?: Model.FromJSONData,
  ): Graph
  export function render(
    container: HTMLElement,
    data?: Model.FromJSONData,
  ): Graph
  export function render(
    options: Partial<Options.Manual> | HTMLElement,
    data?: Model.FromJSONData,
  ): Graph {
    const graph =
      options instanceof HTMLElement
        ? new Graph({ container: options })
        : new Graph(options)

    if (data != null) {
      graph.fromJSON(data)
    }

    return graph
  }
}

export namespace X6 {
  export const registerNode = Node.registry.register
  export const registerEdge = Edge.registry.register
  export const registerView = CellView.registry.register
  export const registerAttr = Attr.registry.register
  export const registerGrid = Grid.registry.register
  export const registerFilter = Filter.registry.register
  export const registerNodeTool = NodeTool.registry.register
  export const registerEdgeTool = EdgeTool.registry.register
  export const registerBackground = Background.registry.register
  export const registerHighlighter = Highlighter.registry.register
  export const registerPortLayout = PortLayout.registry.register
  export const registerPortLabelLayout = PortLabelLayout.registry.register
  export const registerRouter = Router.registry.register
  export const registerConnector = Connector.registry.register
  export const registerNodeConnectionAnchor =
    NodeConnectionAnchor.registry.register
  export const registerEdgeConnectionAnchor =
    EdgeConnectionAnchor.registry.register
  export const registerConnectionPoint = ConnectionPoint.registry.register
  export const registerConnectionStrategy = ConnectionStrategy.registry.register
  export const registerHTMLComponent = HTML.componentRegistry.register
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
