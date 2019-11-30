import { Cell } from '../../core'
import {
  BaseArgs,
  BaseStyle,
  OptionItem,
  drill,
  applyBaseStyle,
  applyClassName,
  applyManualStyle,
} from '../../option'

export interface SelectionPreviewOptions
  extends BaseStyle<ApplySelectionPreviewStyleArgs> {
  cursor: OptionItem<GetSelectionPreviewCursorArgs, string>
}

export interface ApplySelectionPreviewStyleArgs extends BaseArgs {
  cell: Cell
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

export interface GetSelectionPreviewCursorArgs
  extends ApplySelectionPreviewStyleArgs {}

export function getSelectionPreviewCursor(args: GetSelectionPreviewCursorArgs) {
  const { graph } = args
  const options = graph.options.selectionPreview as SelectionPreviewOptions
  return drill(options.cursor, graph, args)
}
