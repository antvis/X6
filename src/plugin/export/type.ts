import type { NumberExt, Size } from '../../common'
import type { RectangleLike } from '../../geometry'
import type { Graph } from '../../graph'

export interface ExportEventArgs {
  'before:export': ExportToSVGOptions
  'after:export': ExportToSVGOptions
}

export type ExportToSVGCallback = (dataUri: string) => any

export interface ExportToSVGOptions {
  /**
   * By default, the resulting SVG has set width and height to `100%`.
   * If you'd like to have the dimensions to be set to the actual content
   * width and height, set `preserveDimensions` to `true`. An object with
   * `width` and `height` properties can be also used here if you need to
   * define the export size explicitely.
   */
  preserveDimensions?: boolean | Size

  viewBox?: RectangleLike

  /**
   * When set to `true` all the styles from external stylesheets are copied
   * to the resulting SVG export. Note this requires a lot of computations
   * and it might significantly affect the export time.
   */
  copyStyles?: boolean

  stylesheet?: string

  /**
   * Converts all contained images into Data URI format.
   */
  serializeImages?: boolean

  /**
   * A function called before the XML serialization. It may be used to
   * modify the exported SVG before it is converted to a string. The
   * function can also return a new SVGDocument.
   */
  beforeSerialize?: (this: Graph, svg: SVGSVGElement) => any
}

export interface ExportToImageOptions extends ExportToSVGOptions {
  /**
   * The width of the image in pixels.
   */
  width?: number
  /**
   * The height of the image in pixels.
   */
  height?: number
  ratio?: string
  backgroundColor?: string
  padding?: NumberExt.SideOptions
  quality?: number
}

export interface ExportToDataURLOptions extends ExportToImageOptions {
  type: 'image/png' | 'image/jpeg'
}
