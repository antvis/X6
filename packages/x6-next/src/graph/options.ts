import { ObjectExt } from '@antv/x6-common'
import { Options as RendererOptions, Config, Renderer } from '@antv/x6-core'
import { GridManager } from './grid'
import { BackgroundManager } from './background'
import { PanningManager } from './panning'
import { MouseWheel } from './mousewheel'
import { Edge } from '../shape'

export namespace Options {
  interface Common {
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

    virtualRender?: boolean
  }

  export interface ManualBooleans extends RendererOptions.ManualBooleans {
    panning: boolean | Partial<PanningManager.Options>
    mousewheel: boolean | Partial<MouseWheel.Options>
  }

  export interface Manual
    extends Partial<Common>,
      Partial<ManualBooleans>,
      RendererOptions.Manual {
    grid?:
      | boolean
      | number
      | (Partial<GridManager.CommonOptions> & GridManager.DrawGridOptions)
  }

  export interface Definition extends Common, RendererOptions.Definition {
    grid: GridManager.Options
    panning: PanningManager.Options
    mousewheel: MouseWheel.Options
  }
}

export namespace Options {
  export function get(options: Partial<Manual>) {
    const { grid, panning, mousewheel, embedding, ...others } = options

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

    // booleas
    // -------
    const booleas: (keyof Options.ManualBooleans)[] = [
      'panning',
      'mousewheel',
      'embedding',
    ]

    booleas.forEach((key) => {
      const val = options[key]
      if (typeof val === 'boolean') {
        result[key].enabled = val
      } else {
        result[key] = {
          ...result[key],
          ...(val as any),
        }
      }
    })

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

    panning: {
      enabled: false,
      eventTypes: ['leftMouseDown'],
    },
    mousewheel: {
      enabled: false,
      factor: 1.2,
      zoomAtMousePosition: true,
    },
    highlighting: {
      default: {
        name: 'stroke',
        args: {
          padding: 3,
        },
      },
      nodeAvailable: {
        name: 'className',
        args: {
          className: Config.prefix('available-node'),
        },
      },
      magnetAvailable: {
        name: 'className',
        args: {
          className: Config.prefix('available-magnet'),
        },
      },
    },
    connecting: {
      snap: false,
      allowLoop: true,
      allowNode: true,
      allowEdge: false,
      allowPort: true,
      highlight: false,

      anchor: 'center',
      edgeAnchor: 'ratio',
      connectionPoint: 'boundary',
      router: 'normal',
      connector: 'normal',

      validateConnection(this: Renderer, { type, sourceView, targetView }) {
        const view = type === 'target' ? targetView : sourceView
        return view != null
      },

      createEdge() {
        return new Edge()
      },
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

    moveThreshold: 0,
    clickThreshold: 0,
    magnetThreshold: 0,
    preventDefaultDblClick: true,
    preventDefaultMouseDown: false,
    preventDefaultContextMenu: true,
    preventDefaultBlankAction: true,
    interacting: {
      edgeLabelMovable: false,
    },
    guard: () => false,
  }
}
