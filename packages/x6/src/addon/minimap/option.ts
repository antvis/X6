import { Image } from '../../struct'
import { Style } from '../../types'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph/graph'

export interface ViewportOptions {
  /**
   * Specifies a viewport rectangle should be shown.
   *
   * Default is `true`.
   */
  visible: boolean
  dashed: boolean
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWidth: number
  strokeOpacity: number
  className?: string
}

export interface SizerOptions {
  visible: boolean
  image?: Image
  shape?: string
  size: number
  fillColor: string
  fillOpacity: number
  dashed: boolean
  strokeColor: string
  strokeWidth: number
  strokeOpacity: number
  className?: string
}

interface BaseOptions {
  container?: HTMLElement

  backgroundColor?: string

  constrained: boolean

  /**
   * Minimum scale to be used.
   *
   * Default is `0.0001`.
   */
  minScale: number

  updateOnPan: boolean

  /**
   * Specifies if labels should be visible in the outline.
   *
   * Default is `false`.
   */
  showLabel: boolean

  showEdge: boolean

  getCellStyle?: (this: Graph, cell: Cell) => Style | null | undefined
}

export interface FullOptions extends BaseOptions {
  sizer: SizerOptions
  viewport: ViewportOptions
  nodeStyle: Partial<Style>
  edgeStyle: Partial<Style>
}

export interface PartialOptions extends Partial<BaseOptions> {
  sizer?: Partial<SizerOptions>
  viewport?: Partial<ViewportOptions>
  nodeStyle?: Partial<Style>
  edgeStyle?: Partial<Style>
}

const preset: FullOptions = {
  minScale: 0.0001,
  showEdge: false,
  showLabel: false,
  updateOnPan: false,
  constrained: true,
  sizer: {
    visible: true,
    size: 10,
    strokeOpacity: 1,
    strokeWidth: 2,
    strokeColor: '#1890ff',
    dashed: false,
    fillColor: '#fff',
    fillOpacity: 1,
  },
  viewport: {
    visible: true,
    dashed: false,
    strokeWidth: 2,
    strokeColor: '#1890ff',
    strokeOpacity: 0.9,
    fillColor: 'none',
    fillOpacity: 1,
  },
  nodeStyle: {
    fill: '#1890ff',
    stroke: '#1890ff',
  },
  edgeStyle: {
    fill: '#1890ff',
    stroke: '#1890ff',
  },
}

export function getOptions(options: PartialOptions): FullOptions {
  return {
    ...preset,
    ...options,
    sizer: {
      ...preset.sizer,
      ...options.sizer,
    },
    viewport: {
      ...preset.viewport,
      ...options.viewport,
    },
    nodeStyle: {
      ...preset.nodeStyle,
      ...options.nodeStyle,
    },
    edgeStyle: {
      ...preset.edgeStyle,
      ...options.edgeStyle,
    },
  }
}
