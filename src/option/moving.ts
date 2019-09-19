import {
  BaseArgs,
  BaseStyle,
  OptionItem,
  applyBaseStyle,
  applyClassName,
  applyCursorStyle,
  applyManualStyle,
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
  const options = args.graph.options.movingPreview as MovingPreviewOptions

  applyBaseStyle(args, options)
  applyClassName(args, options, 'moving-preview')
  applyCursorStyle(args, options)
  applyManualStyle(args, options)
}
