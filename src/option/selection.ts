import { Cell } from '../core'
import {
  BaseArgs,
  BaseStyle,
  applyBaseStyle,
  applyClassName,
  applyManualStyle,
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
  applyClassName(args, options, 'selection-preview')
  applyManualStyle(args, options)

  return shape
}
