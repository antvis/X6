import {
  BaseArgs,
  BaseStyle,
  OptionItem,
  drill,
  applyBaseStyle,
  applyClassName,
} from './util'

export interface MovingPreviewOptions
  extends BaseStyle<ApplyMovingPreviewStyleArgs> {
  html: boolean

  /**
   * Specifies the minimum number of pixels for the width and height of a
   * selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number
  cursor: OptionItem<ApplyMovingPreviewStyleArgs, string>
}

export interface ApplyMovingPreviewStyleArgs extends BaseArgs {
  x: number,
  y: number,
  width: number,
  height: number,
}

export function applyMovingPreviewStyle(args: ApplyMovingPreviewStyleArgs) {
  const graph = args.graph
  const shape = args.shape
  const options = graph.options.movingPreview as MovingPreviewOptions

  applyBaseStyle(args, options)
  applyClassName(
    shape,
    graph.prefixCls,
    'moving-preview',
    drill(options.className, graph, args),
  )

  shape.cursor = drill(options.cursor, graph, args)
  if (shape.cursor) {
    shape.setCursor(shape.cursor)
  }

  if (options.style) {
    options.style(args)
  }
}
