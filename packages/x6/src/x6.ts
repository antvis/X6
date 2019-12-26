import { globals } from './option'
import { Shape } from './shape/shape'
import { Route } from './route'
import { Marker } from './marker'
import { Perimeter } from './perimeter'
import { version as v } from './version'
import { Graph } from './graph/graph'
import { Data } from './graph/creation-manager'

export namespace x6 {
  export const version = v
  export const registerShape = Shape.register
  export const registerRoute = Route.register
  export const registerMarker = Marker.register
  export const registerPerimeter = Perimeter.register
}

export namespace x6 {
  interface Options extends Graph.Options {
    container: HTMLElement
  }

  export function render(options: Options, data?: Data): Graph
  export function render(container: HTMLElement, data?: Data): Graph
  export function render(options: Options | HTMLElement, data?: Data): Graph {
    let graph

    if (options instanceof HTMLElement) {
      graph = new Graph(options)
    } else {
      const { container, ...opts } = options
      graph = new Graph(container, opts)
    }

    if (data != null) {
      graph.render(data)
    }

    return graph
  }
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
    globals.trackable = enabled
  }
}
