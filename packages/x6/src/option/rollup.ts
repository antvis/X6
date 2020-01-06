import { ObjectExt } from '../util'
import { Style } from '../types'
import { GridOptions } from '../graph/grid-accessor'
import { PageBreakOptions } from '../graph/pagebreak-accessor'
import { CollapseOptions } from '../graph/collapse-accessor'
import { TooltipOptions } from '../handler/tooltip/option'
import { ContextMenuOptions } from '../handler/contextmenu/option'
import { KeyboardOptions } from '../handler/keyboard/option'
import { RubberbandOptions } from '../handler/rubberband/option'
import { GuideOptions } from '../handler/guide/option'
import {
  ResizeOption,
  ResizeHandleOptions,
  ResizePreviewOptions,
} from '../handler/node/option-resize'
import {
  RotateOptions,
  RotateHandleOptions,
  RotatePreviewOptions,
} from '../handler/node/option-rotation'
import { SelectionPreviewOptions } from '../handler/node/option-selection'
import { EdgeHandleOptions } from '../handler/edge/option'
import { LabelHandleOptions } from '../handler/node/option-label'
import {
  AnchorOptions,
  AnchorTipOptions,
  AnchorHighlightOptions,
} from '../handler/anchor/option'
import {
  ConnectionOptions,
  ConnectionIconOptions,
  ConnectionPreviewOptions,
  ConnectionHighlightOptions,
} from '../handler/connection/option'
import {
  MovingPreviewOptions,
  DropTargetHighlightOptions,
} from '../handler/moving/option'
import { MouseWheelOptions } from '../handler/mousewheel/option'
import { preset } from './preset'
import { IHook } from '../graph/hook'
import { GlobalConfig } from './global'
import { GraphProperties } from '../graph/base-graph'

export interface FullOptions
  extends GlobalConfig,
    GraphProperties,
    Partial<IHook> {
  nodeStyle: Style
  edgeStyle: Style
  grid: GridOptions
  guide: GuideOptions
  tooltip: TooltipOptions
  folding: CollapseOptions
  keyboard: KeyboardOptions
  mouseWheel: MouseWheelOptions
  rubberband: RubberbandOptions
  pageBreak: PageBreakOptions
  contextMenu: ContextMenuOptions
  dropTargetHighlight: DropTargetHighlightOptions
  movingPreview: MovingPreviewOptions
  selectionPreview: SelectionPreviewOptions
  resize: ResizeOption
  resizeHandle: ResizeHandleOptions
  resizePreview: ResizePreviewOptions
  rotate: RotateOptions
  rotateHandle: RotateHandleOptions
  rotatePreview: RotatePreviewOptions
  labelHandle: LabelHandleOptions
  anchor: AnchorOptions
  anchorTip: AnchorTipOptions
  anchorHighlight: AnchorHighlightOptions
  connection: ConnectionOptions
  connectionIcon: ConnectionIconOptions
  connectionPreview: ConnectionPreviewOptions
  connectionHighlight: ConnectionHighlightOptions
  edgeHandle: EdgeHandleOptions
}

export interface GraphOptions
  extends Partial<GlobalConfig>,
    Partial<GraphProperties>,
    Partial<IHook> {
  nodeStyle?: Style
  edgeStyle?: Style
  grid?: Partial<GridOptions> | boolean
  guide?: Partial<GuideOptions> | boolean
  tooltip?: Partial<TooltipOptions> | boolean
  folding?: Partial<CollapseOptions> | boolean
  keyboard?: Partial<KeyboardOptions> | boolean
  mouseWheel?: Partial<MouseWheelOptions> | boolean
  rubberband?: Partial<RubberbandOptions> | boolean
  pageBreak?: Partial<PageBreakOptions> | boolean
  contextMenu?: Partial<ContextMenuOptions> | boolean
  dropTargetHighlight?: Partial<DropTargetHighlightOptions>
  movingPreview?: Partial<MovingPreviewOptions>
  selectionPreview?: Partial<SelectionPreviewOptions>
  resize?: Partial<ResizeOption> | boolean
  resizeHandle?: Partial<ResizeHandleOptions>
  resizePreview?: Partial<ResizePreviewOptions>
  rotate?: Partial<RotateOptions> | boolean
  rotateHandle?: Partial<RotateHandleOptions>
  rotatePreview?: Partial<RotatePreviewOptions>
  labelHandle?: Partial<LabelHandleOptions>
  anchor?: Partial<AnchorOptions>
  anchorTip?: Partial<AnchorTipOptions> | boolean
  anchorHighlight?: Partial<AnchorHighlightOptions>
  connection?: Partial<ConnectionOptions> | boolean
  connectionIcon?: Partial<ConnectionIconOptions>
  connectionPreview?: Partial<ConnectionPreviewOptions>
  connectionHighlight?: Partial<ConnectionHighlightOptions>
  edgeHandle?: Partial<EdgeHandleOptions>
}

export function getOptions(options: GraphOptions) {
  const defaults = ObjectExt.merge({}, preset)
  const result = ObjectExt.mergec(defaults, options, {
    decorator: (target, source, key) => {
      const t = target[key]
      const s = source[key]
      if (typeof s === 'boolean' && typeof t === 'object') {
        return {
          ...t,
          enabled: s,
        }
      }

      return s
    },
    ignoreNull: false,
    ignoreUndefined: true,
  }) as FullOptions

  result.dialect = result.dialect === 'html' ? 'html' : 'svg'

  return result
}
