import { ObjectExt, Dom } from '@antv/x6-common'
import { Model, CellView } from '@antv/x6-core'
import { GridManager } from './grid'
import { BackgroundManager } from './background'
import { Edge } from '../shape'

export namespace Options {
  interface Common {
    model?: Model

    container: HTMLElement

    x: number
    y: number
    width: number
    height: number
    autoResize?: boolean | Element | Document

    background?: false | BackgroundManager.Options

    scaling: {
      min?: number
      max?: number
    }

    /**
     * When defined as a number, it denotes the required mousemove events
     * before a new edge is created from a magnet. When defined as keyword
     * 'onleave', the edge is created when the pointer leaves the magnet
     * DOM element.
     */
    magnetThreshold: number | 'onleave'

    /**
     * Number of required mousemove events before the first mousemove
     * event will be triggered.
     */
    moveThreshold: number

    /**
     * Allowed number of mousemove events after which the click event
     * will be still triggered.
     */
    clickThreshold: number

    /**
     * Prevent the default context menu from being displayed.
     */
    preventDefaultContextMenu: boolean

    preventDefaultDblClick: boolean

    preventDefaultMouseDown: boolean

    /**
     * Prevents default action when an empty graph area is clicked.
     * Setting the option to `false` will make the graph pannable
     * inside a container on touch devices.
     *
     * It defaults to `true`.
     */
    preventDefaultBlankAction: boolean

    /**
     * Guard the graph from handling a UI event. Returns `true` if you want
     * to prevent the graph from handling the event evt, `false` otherwise.
     * This is an advanced option that can be useful if you have your own
     * logic for handling events.
     */
    guard: (e: Dom.EventObject, view?: CellView | null) => boolean

    // todo
    connecting: any
    interacting: any
    translating: any
    embedding: any
  }

  export interface Manual extends Partial<Common> {
    grid?:
      | boolean
      | number
      | (Partial<GridManager.CommonOptions> & GridManager.DrawGridOptions)
  }

  export interface Definition extends Common {
    grid: GridManager.Options
  }
}

export namespace Options {
  export function get(options: Partial<Manual>) {
    const { grid, ...others } = options

    // size
    // ----
    const container = options.container
    if (container != null) {
      if (others.width == null) {
        others.width = container.clientWidth
      }

      if (others.height == null) {
        others.height = container.clientHeight
      }
    } else {
      throw new Error(
        `Ensure the container of the graph is specified and valid`,
      )
    }

    const result = ObjectExt.merge({}, defaults, others) as Options.Definition

    // grid
    // ----
    const defaultGrid: GridManager.CommonOptions = { size: 10, visible: false }
    if (typeof grid === 'number') {
      result.grid = { size: grid, visible: false }
    } else if (typeof grid === 'boolean') {
      result.grid = { ...defaultGrid, visible: grid }
    } else {
      result.grid = { ...defaultGrid, ...grid }
    }

    return result
  }
}

export namespace Options {
  export const defaults: Partial<Definition> = {
    x: 0,
    y: 0,
    scaling: {
      min: 0.01,
      max: 16,
    },

    grid: {
      size: 10,
      visible: false,
    },
    background: false,

    moveThreshold: 0,
    clickThreshold: 0,
    magnetThreshold: 0,
    preventDefaultDblClick: true,
    preventDefaultMouseDown: false,
    preventDefaultContextMenu: true,
    preventDefaultBlankAction: true,

    guard: () => false,

    connecting: {
      snap: false,
      multi: true,
      // TODO: Unannotation the next line when the `multi` option was removed in the next major version.
      // allowMulti: true,
      dangling: true,
      // TODO: Unannotation the next line when the `dangling` option was removed in the next major version.
      // allowBlank: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: false,
      allowPort: true,
      highlight: false,

      anchor: 'center',
      edgeAnchor: 'ratio',
      connectionPoint: 'boundary',
      strategy: null,
      router: 'normal',
      connector: 'normal',

      validateConnection(this: any, { type, sourceView, targetView }: any) {
        const view = type === 'target' ? targetView : sourceView
        return view != null
      },

      createEdge() {
        return new Edge()
      },
    },
    interacting: {
      edgeLabelMovable: false,
    },
    translating: {
      restrict: false,
    },
    embedding: {
      enabled: false,
      findParent: 'bbox',
      frontOnly: true,
      validate: () => true,
    },
  }
}
