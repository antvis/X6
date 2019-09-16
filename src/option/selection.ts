import { Cell } from '../core'
import {
  BaseArgs,
  BaseStyle,
  drill,
  applyBaseStyle,
  applyClassName,
} from './util'

export interface SelectionPreviewOptions
  extends BaseStyle<ApplySelectionPreviewStyleArgs> { }

export interface ApplySelectionPreviewStyleArgs extends BaseArgs {
  cell: Cell,
}

export function applySelectionPreviewStyle(
  args: ApplySelectionPreviewStyleArgs,
) {
  const { shape, graph } = args
  const options = graph.options.selectionPreview as SelectionPreviewOptions

  applyBaseStyle(args, options)
  applyClassName(
    shape,
    graph.prefixCls,
    'selection-preview',
    drill(options.className, graph, args),
  )

  if (options.style) {
    options.style(args)
  }

  return shape
}
