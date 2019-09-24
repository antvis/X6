import * as util from '../util'
import { Graph } from '../core'
import { RoutingFunction } from '../core/registry'
import { Dialect, Style } from '../types'
import { Image, Multiplicity, Rectangle } from '../struct'
import { defaultOptions } from './preset'
import { GuideOptions } from './guide'
import { RubberbandOptions } from './rubberband'
import { TooltipOptions } from './tooltip'
import { MovingPreviewOptions, DropTargetHighlightOptions } from './moving'
import { SelectionPreviewOptions } from './selection'
import {
  ResizeOption,
  ResizeHandleOptions,
  ResizePreviewOptions,
} from './resize'
import {
  RotateOptions,
  RotateHandleOptions,
  RotatePreviewOptions,
} from './rotation'
import { LabelHandleOptions } from './label'
import {
  ConstraintOptions,
  ConstraintHighlightOptions,
} from './constraint'
import {
  ConnectionOptions,
  ConnectionIconOptions,
  ConnectionPreviewOptions,
  ConnectionHighlightOptions,
} from './connection'
import { EdgeHandleOptions } from './edge'

export interface CompositeOptions {
  /**
   * Specifies if the grid is enabled.
   */
  gridEnabled?: boolean

  /**
   * Specifies the grid size.
   *
   * Default is `10`.
   */
  gridSize?: number

  /**
   * Specifies if a dashed line should be drawn between multiple pages.
   *
   * Default is `false`.
   */
  pageBreakEnabled: boolean

  /**
   * Specifies the color for page breaks.
   *
   * Default is `'gray'`.
   */
  pageBreakColor: string

  /**
   * Specifies the page breaks should be dashed.
   *
   * Default is `true`.
   */
  pageBreakDashed: boolean

  /**
   * Specifies the minimum distance for page breaks to be visible.
   *
   * Default is `20` (in pixels).
   */
  minPageBreakDist: number

  /**
   * Specifies if folding (collapse and expand via an image icon
   * in the graph should be enabled).
   *
   * Default is `true`.
   */
  foldingEnabled: boolean
  collapsedImage: Image
  expandedImage: Image

  /**
   * Specifies if the graph should allow resizing of cells.
   *
   * Default is `true`.
   */
  cellsResizable: boolean

  cellsRotatable: boolean

  /**
   * Specifies if handle escape key press.
   *
   * Default is `true`.
   */
  escapeEnabled: boolean
}

export interface SimpleOptions {
  prefixCls: string
  dialect: Dialect
  antialiased: boolean

  /**
   * An array of `Multiplicity` describing the allowed connections in
   * the graph.
   */
  multiplicities: Multiplicity[] | null

  /**
   * Specifies the alternate edge style to be used if the main control
   * point on an edge is being doubleclicked.
   *
   * Default is `null`.
   */
  alternateEdgeStyle: Style | null

  /**
   * Specifies if native double click events should be detected.
   *
   * Default is `true`.
   */
  nativeDblClickEnabled: boolean

  /**
   * Specifies if double taps on touch-based devices should be handled
   * as a double click.
   *
   * Default is `true`.
   */
  doubleTapEnabled: boolean

  /**
   * Specifies the timeout for double taps and non-native double clicks.
   *
   * Default is `500` ms.
   */
  doubleTapTimeout: number

  /**
   * Specifies the tolerance for double taps.
   *
   * Default is `25` pixels.
   */
  doubleTapTolerance: number

  /**
   * Specifies if tap and hold should be used for starting connections
   * on touch-based devices.
   *
   * Default is `true`.
   */
  tapAndHoldEnabled: boolean

  /**
   * Specifies the time for a tap and hold.
   *
   * Default is `500` ms.
   */
  tapAndHoldDelay: number

  /**
   * Specifies if the background page should be visible.
   *
   * Default is `false`.
   */
  pageVisible: boolean

  /**
   * Specifies if the graph size should be rounded to the next page
   * number in `sizeDidChange`.
   *
   * This is only used if the graph container has scrollbars.
   *
   * Default is `false`.
   */
  preferPageSize: boolean

  /**
   * Specifies the page format for the background page.
   */
  pageFormat: Rectangle

  /**
   * Specifies the scale of the background page.
   *
   * Default is `1.5`.
   *
   * Not yet implemented.
   */
  pageScale: number

  backgroundImage: Image | null

  /**
   * Specifies if the graph should automatically scroll if the mouse
   * goes near the container edge while dragging. This is only taken
   * into account if the container has scrollbars.
   *
   * Default is `true`.
   *
   * If you need this to work without scrollbars then set
   * `ignoreScrollbars` to true. Please consult the
   * `ignoreScrollbars` for details. In general, with no
   * scrollbars, the use of `allowAutoPanning` is recommended.
   */
  autoScroll: boolean

  /**
   * Specifies if the graph should automatically scroll regardless
   * of the scrollbars. This will scroll the container using positive
   * values for scroll positions. To avoid possible conflicts with
   * panning, set `translateToScrollPosition` to true.
   */
  ignoreScrollbars: boolean

  /**
   * Specifies if the graph should automatically convert the current
   * scroll position to a translate in the graph view when a mouseUp
   * event is received. This can be used to avoid conflicts when using
   * `autoScroll` and `ignoreScrollbars` with no scrollbars in the
   * container.
   */
  translateToScrollPosition: boolean

  /**
   * Specifies if autoscrolling should be carried out via mxPanningManager even
   * if the container has scrollbars. This disables <scrollPointToVisible> and
   * uses <mxPanningManager> instead. If this is true then <autoExtend> is
   * disabled. It should only be used with a scroll buffer or when scollbars
   * are visible and scrollable in all directions. Default is false.
   */
  timerAutoScroll: boolean

  /**
   * Specifies if panning via <panGraph> should be allowed to implement autoscroll
   * if no scrollbars are available in <scrollPointToVisible>. To enable panning
   * inside the container, near the edge, set <mxPanningManager.border> to a
   * positive value. Default is false.
   */
  allowAutoPanning: boolean

  /**
   * Specifies if the size of the graph should be automatically extended if the
   * mouse goes near the container edge while dragging. This is only taken into
   * account if the container has scrollbars.
   *
   * Default is `true`.
   */
  autoExtend: boolean

  /**
   * `Rectangle` that specifies the area in which all cells in the diagram
   * should be placed. Use a width or height of 0 if you only want to give
   * a upper, left corner.
   */
  maxGraphBounds: Rectangle | null

  /**
   * `Rectangle` that specifies the minimum size of the graph.
   *
   * This is ignored if the graph container has no scrollbars.
   *
   * Default is `null`.
   */
  minGraphSize: Rectangle | null

  /**
   * <Rect> that specifies the minimum size of the <container> if
   * <resizeContainer> is true.
   */
  minContainerSize: Rectangle | null

  /**
   * <Rect> that specifies the maximum size of the container if
   * <resizeContainer> is true.
   */
  maxContainerSize: Rectangle | null

  /**
   * Specifies if edges should appear in the foreground regardless
   * of their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order
   * is applied.
   *
   * Default is `false`.
   */
  keepEdgesInForeground: boolean

  /**
   * Specifies if edges should appear in the background regardless
   * of their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order
   * is applied.
   *
   * Default is `false`.
   */
  keepEdgesInBackground: boolean

  /**
   * Specifies if the scale and translate should be reset if the
   * root changes in the model.
   *
   * Default is `true`.
   */
  resetViewOnRootChange: boolean

  /**
   * Specifies if edge control points should be reset after the
   * resize of a connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnResize: boolean

  /**
   * Specifies if edge control points should be reset after the
   * move of a connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnMove: boolean

  /**
   * Specifies if edge control points should be reset after the
   * edge has been reconnected.
   *
   * Default is `true`.
   */
  resetEdgesOnConnect: boolean

  defaultLoopRouter: RoutingFunction

  /**
   * The attribute used to find the color for the indicator if
   * the indicator color is set to 'swimlane'.
   */
  swimlaneIndicatorColorAttribute: string

  /**
   * Specifies the minimum scale to be applied in `fit`.
   *
   * Default is `0.1`. Set to `null` to allow any value.
   */
  minFitScale: number

  /**
   * Specifies the maximum scale to be applied in `fit`.
   *
   * Default is `8`. Set to `null` to allow any value.
   */
  maxFitScale: number

  /**
   * Specifies if scrollbars should be used for translate if
   * any scrollbars are available. If scrollbars are enabled
   * in CSS, but no scrollbars appear because the graph is
   * smaller than the container size, then no panning occurs
   * if this is true.
   *
   * Default is `true`.
   */
  useScrollbarsForTranslate: boolean

  /**
   * Specifies if the viewport should automatically contain
   * the selection cells after a zoom operation.
   *
   * Default is `false`.
   */
  keepSelectionVisibleOnZoom: boolean

  /**
   * Specifies if the zoom operations should go into the center
   * of the actual diagram rather than going from top, left.
   *
   * Default is `true`.
   */
  centerZoom: boolean

  /**
   * Specifies the factor used for `zoomIn` and `zoomOut`.
   *
   * Default is `1.2`
   */
  zoomFactor: number

  /**
   * Specifies if the cells in the graph can be moved, sized, bended,
   * disconnected, edited, selected.
   *
   * Default is `false`.
   */
  cellsLocked: boolean

  /**
   * Specifies if the graph should allow cloning of cells by holding
   * down the control key while cells are being moved.
   *
   * Default is `true`.
   */
  cellsCloneable: boolean

  cellsSelectable: boolean

  cellsDeletable: boolean

  /**
   * Specifies if the label of node movable.
   *
   * Default is `false`.
   */
  nodeLabelsMovable: boolean

  /**
   * Specifies if the label of edge movable.
   *
   * Default is `true`.
   */
  edgeLabelsMovable: boolean

  /**
   * Specifies if the graph should allow moving of cells.
   *
   * Default is `true`.
   */
  cellsMovable: boolean

  /**
   * Specifies if the graph should allow bending of edges.
   *
   * Default is `true`.
   */
  cellsBendable: boolean

  /**
   * Specifies if the graph should allow in-place editing for
   * cell labels.
   *
   * Default is `true`.
   */
  cellsEditable: boolean

  /**
   * Specifies if cells is disconnectable.
   *
   * Default is `true`.
   */
  cellsDisconnectable: boolean

  /**
   * Specifies if the label must be rendered as HTML markup.
   *
   * Default is `false`.
   */
  htmlLabels: boolean

  /**
   * Specifies if labels should be visible.
   *
   * Default is `true`.
   */
  labelsVisible: boolean

  /**
   * Border to be added to the bottom and right side when the
   * container is being resized after the graph has been changed.
   *
   * Default is `0`.
   */
  border: number

  /**
   * Specifies if the container should be resized to the graph
   * size when the graph size has changed.
   *
   * Default is `false`.
   */
  autoResizeContainer: boolean

  /**
   * If true, when editing is to be stopped by way of selection
   * changing, data in diagram changing or other means stopCellEditing
   * is invoked, and changes are saved.
   *
   * Default is `true`.
   */
  invokesStopCellEditing: boolean

  /**
   * If true, pressing the enter key without pressing control or
   * shift will stop editing and accept the new value.
   *
   * Note: You can always use F2 and escape to stop editing.
   *
   * Default is `false`.
   */
  stopEditingOnPressEnter: boolean

  /**
   * Specifies if cells may be exported to the clipboard.
   *
   * Default is `true`.
   */
  exportEnabled: boolean

  /**
   * Specifies if cells may be imported from the clipboard.
   *
   * Default is `true`.
   */
  importEnabled: boolean

  /**
   * Specifies if ports are enabled.
   *
   * Default is `true`.
   */
  portsEnabled: boolean

  /**
   * Tolerance for a move to be handled as a single click.
   *
   * Default is `4` pixels.
   */
  tolerance: number

  /**
   * Specifies if swimlanes can be nested by drag and drop.
   *
   * Default is `true`.
   */
  swimlaneNesting: boolean

  /**
   * Specifies if swimlanes should be selected if the mouse is
   * released over their content area.
   *
   * Default is `true`.
   */
  swimlaneSelectionEnabled: boolean

  /**
   * Specifies if multiple edges in the same direction between
   * the same pair of nodes are allowed.
   *
   * Default is `true`.
   */
  multigraph: boolean

  /**
   * Specifies if loops (aka self-references) are allowed.
   *
   * Default is `false`.
   */
  allowLoops: boolean

  /**
   * Specifies if edges with disconnected terminals are allowed
   * in the graph. Dangling edge is an edge that do not have a
   * source and/or target terminal defined.
   *
   * Default is `true`.
   */
  allowDanglingEdges: boolean

  /**
   * Specifies if edges are connectable.
   *
   * Default is `false`.
   */
  edgesConnectable: boolean

  /**
   * Specifies if edges that are cloned should be validated and
   * only inserted if they are valid.
   *
   * Default is `false`.
   */
  invalidEdgesClonable: boolean

  /**
   * Specifies if edges should be disconnected from their terminals
   * when they are moved.
   *
   * Default is `true`.
   */
  disconnectOnMove: boolean

  /**
   * Specifies if drop events are interpreted as new connections if
   * no other drop action is defined.
   *
   * Default is `false`.
   */
  connectOnDrop: boolean

  /**
   * Specifies if the graph should allow dropping of cells onto or
   * into other cells.
   *
   * Default is `false`.
   */
  dropEnabled: boolean

  /**
   * Specifies if dropping onto edges should be splited.
   *
   * Default is `true`.
   */
  splitEnabled: boolean

  /**
   * Specifies if a move cursor should be shown if the mouse
   * is over a movable cell.
   *
   * Default is `true`.
   */
  autoUpdateCursor: boolean

  /**
   * Specifies if cells may be moved out of their parents.
   *
   * Default is `true`.
   */
  allowRemoveCellsFromParent: boolean

  /**
   * If empty parents should be removed from the model after all child cells
   * have been moved out.
   *
   * Default is `true`.
   */
  autoRemoveEmptyParent: boolean

  /**
   * Specifies if the view should be scrolled so that a moved cell is
   * visible.
   *
   * Default is `true`.
   */
  scrollOnMove: boolean

  /**
  * Specifies if autoSize style should be applied when cells are added.
  *
  * Default is `false`.
  */
  autoSizeOnAdded: boolean

  /**
   * Specifies if cell sizes should be automatically updated
   * after a label change.
   *
   * Default is `false`.
   */
  autoSizeOnEdited: boolean

  /**
   * Specifies if a parent should contain the child bounds after
   * a resize of the child.
   *
   * Default is `true`.
   */
  extendParents: boolean

  extendParentsOnAdd: boolean

  extendParentsOnMove: boolean

  recursiveResize: boolean

  /**
   * Specifies if a child should be constrained inside the parent
   * bounds after a move or resize of the child.
   *
   * Default is `true`.
   */
  constrainChildren: boolean

  /**
   * Specifies if child cells with relative geometries should be
   * constrained inside the parent bounds.
   *
   * Default is `false`.
   */
  constrainRelativeChildren: boolean

  /**
   * Specifies if negative coordinates for nodes are allowed.
   *
   * Default is `true`.
   */
  allowNegativeCoordinates: boolean

  /**
   * Specifies the portion of the child which is allowed to overlap
   * the parent.
   *
   * Default is `0.5`.
   */
  defaultOverlap: number

  /**
   * Defines the maximum number of cells to paint subhandles for.
   *
   * Default is `20` for IE and `50` for others. Set this to `0` if you
   * want an unlimited number of handles to be displayed. This is only
   * recommended if the number of cells in the graph is limited to a
   * small number, eg. `500`.
   */
  maxCellCountForHandle: number
}

export interface GridOptions {
  enabled: boolean
  size: number
  /**
   * Specifies if the grid should be scaled.
   */
  scaled: boolean
}

export interface PageBreakOptions {
  enabled: boolean
  /**
   * Specifies the stroke color for page breaks.
   */
  stroke: string
  /**
   * Specifies the page breaks should be dashed.
   */
  dsahed: boolean
  /**
   * Specifies the minimum distance for page breaks to be visible.
   */
  minDist: number
}

export interface FoldingOptions {
  /**
   * Specifies if folding (collapse and expand via an image icon
   * in the graph should be enabled).
   */
  enabled: boolean
  collapsedImage: Image
  expandedImage: Image
}

export interface ContextMenuOptions {
  enabled: boolean

  /**
   * Specifies is use left mouse button as context menu trigger.
   */
  isLeftButton: boolean

  /**
   * Specifies if cells should be selected if a popupmenu is
   * displayed for them.
   *
   * Default is `true`.
   */
  selectCellsOnContextMenu: boolean

  /**
   * Specifies if cells should be deselected if a popupmenu is
   * displayed for the diagram background.
   *
   * Default is `true`.
   */
  clearSelectionOnBackground: boolean
}

export interface KeyboardOptions {
  enabled: boolean

  /**
   * Specifies if keyboard event should bind on docuemnt or on container.
   *
   * Default is `false` that will bind keyboard event on the container.
   */
  global: boolean

  /**
   * Specifies if handle escape key press.
   *
   * Default is `true`.
   */
  escape: boolean
}

export interface FullOptions extends SimpleOptions {
  nodeStyle: Style
  edgeStyle: Style
  grid: GridOptions
  guide: GuideOptions
  tooltip: TooltipOptions
  folding: FoldingOptions
  keyboard: KeyboardOptions
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
  constraint: ConstraintOptions
  constraintHighlight: ConstraintHighlightOptions
  connection: ConnectionOptions
  connectionIcon: ConnectionIconOptions
  connectionPreview: ConnectionPreviewOptions
  connectionHighlight: ConnectionHighlightOptions
  edgeHandle: EdgeHandleOptions
}

export interface GraphOptions extends Partial<SimpleOptions> {
  nodeStyle?: Style
  edgeStyle?: Style
  grid?: Partial<GridOptions> | boolean
  guide?: Partial<GuideOptions> | boolean
  tooltip?: Partial<TooltipOptions> | boolean
  folding?: Partial<FoldingOptions> | boolean
  keyboard?: Partial<KeyboardOptions> | boolean
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
  constraint?: Partial<ConstraintOptions>
  constraintHighlight?: Partial<ConstraintHighlightOptions>
  connection?: Partial<ConnectionOptions> | boolean
  connectionIcon?: Partial<ConnectionIconOptions>
  connectionPreview?: Partial<ConnectionPreviewOptions>
  connectionHighlight?: Partial<ConnectionHighlightOptions>
  edgeHandle?: Partial<EdgeHandleOptions>
}

export function getOptions(options: GraphOptions) {
  const result = util.mergec(
    defaultOptions,
    options,
    {
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
      ignoreNull: true,
      ignoreUndefined: true,
    },
  ) as GraphOptions

  return result
}

export function applyOptions(graph: Graph) {
  const options = graph.options

  Object.keys(options).forEach((key: keyof GraphOptions) => {
    const val = options[key]
    if (val != null && typeof val !== 'function' && typeof val !== 'object') {
      (graph as any)[key] = val
    }
  })

  graph.dialect = options.dialect === 'html' ? 'html' : 'svg'

  expand(graph)
}

function expand(graph: Graph) {
  const options = graph.options

  // grid
  // ----
  const grid = options.grid as GridOptions
  graph.gridSize = grid.size
  graph.gridEnabled = grid.enabled

  // pageBreak
  // ----
  const pageBreak = options.pageBreak as PageBreakOptions
  graph.pageBreakEnabled = pageBreak.enabled
  graph.pageBreakColor = pageBreak.stroke
  graph.pageBreakDashed = pageBreak.dsahed
  graph.minPageBreakDist = pageBreak.minDist

  // folding
  // ----
  const folding = options.folding as FoldingOptions
  graph.foldingEnabled = folding.enabled
  graph.expandedImage = folding.expandedImage
  graph.collapsedImage = folding.collapsedImage

  // resize
  // ----
  const resize = options.resize as ResizeOption
  graph.cellsResizable = resize.enabled

  // rotate
  // ----
  const rotate = options.rotate as RotateOptions
  graph.cellsRotatable = rotate.enabled

  // keyboard
  // ----
  const keyboard = options.keyboard as KeyboardOptions
  graph.escapeEnabled = keyboard.escape
}
