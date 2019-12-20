import { Image } from '../../struct'
import { Style } from '../../types'

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
  /**
   * Border to be added at the bottom and right.
   *
   * Default is `10`.
   */
  border: number

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
}

export interface FullOptions extends BaseOptions {
  sizer: SizerOptions
  viewport: ViewportOptions
  nodeStyle: Partial<Style>
  edgeStyle: Partial<Style>
}

export interface Options extends Partial<BaseOptions> {
  sizer?: Partial<SizerOptions>
  viewport?: Partial<ViewportOptions>
  nodeStyle?: Partial<Style>
  edgeStyle?: Partial<Style>
}

const preset: FullOptions = {
  border: 10,
  minScale: 0.0001,
  updateOnPan: false,
  showEdge: true,
  showLabel: false,
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
  edgeStyle: {},
}

export function getOptions(options: Options): FullOptions {
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
