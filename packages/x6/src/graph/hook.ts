import { Point, Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { View } from '../core/view'
import { Model } from '../core/model'
import { State } from '../core/state'
import { Graph } from '.'
import { Renderer } from '../core/renderer'
import { Selection } from './selection'
import { Route } from '../route'
import { Anchor, Overlay } from '../struct'
import {
  KeyboardHandler,
  MouseWheelHandler,
  TooltipHandler,
  ContextMenuHandler,
  PanningHandler,
  SelectionHandler,
  MovingHandler,
  ConnectionHandler,
  NodeHandler,
  EdgeHandler,
  RubberbandHandler,
  CursorHandler,
  GuideHandler,
  SelectCellHandler,
} from '../handler'
import { DataChange } from '../change'
import { Style } from '../types'

type Nilable<T> = T | null | undefined
type BareHook<T> = (this: Graph) => Nilable<T>
type StateHook<T> = (this: Graph, state: State) => Nilable<T>
type EventHook<T> = (this: Graph, e: MouseEvent) => Nilable<T>
type CellHook<T> = (this: Graph, cell: Cell) => Nilable<T>
type CellIsSourceHook<T> = (
  this: Graph,
  cell: Cell,
  isSource: boolean,
) => Nilable<T>

export interface IHook {
  createModel: BareHook<Model>
  createView: BareHook<View>
  createRenderer: BareHook<Renderer>
  createSelection: BareHook<Selection>

  createCursorHandler: BareHook<CursorHandler>
  createGuideHandler: BareHook<GuideHandler>
  createKeyboardHandler: BareHook<KeyboardHandler>
  creatMouseWheelHandler: BareHook<MouseWheelHandler>
  createTooltipHandler: BareHook<TooltipHandler>
  createConnectionHandler: BareHook<ConnectionHandler>
  createSelectionHandler: BareHook<SelectionHandler>
  createSelectHandler: BareHook<SelectCellHandler>
  createMovingHandler: BareHook<MovingHandler>
  createPanningHandler: BareHook<PanningHandler>
  createContextMenuHandler: BareHook<ContextMenuHandler>
  createRubberbandHandler: BareHook<RubberbandHandler>
  createCellHandler: StateHook<NodeHandler | EdgeHandler>
  createNodeHandler: StateHook<NodeHandler>
  createEdgeHandler: (
    this: Graph,
    state: State,
    edgeFn: Route.Router | null,
  ) => Nilable<EdgeHandler>
  createElbowEdgeHandler: StateHook<EdgeHandler>
  createEdgeSegmentHandler: StateHook<EdgeHandler>

  // #region event

  /**
   * Returns `true` if the given event is a clone event.
   */
  isCloneEvent: EventHook<boolean>

  /**
   * Returns `true` if the given event is a toggle event.
   */
  isToggleEvent: EventHook<boolean>

  /**
   * Returns `true` if the given mouse event should be constrained.
   */
  isConstrainedEvent: EventHook<boolean>

  /**
   * Returns`true`if the given mouse event should be aligned to the grid.
   */
  isGridEnabled: EventHook<boolean>

  /**
   * Returns`true`if the given mouse event should not allow any connections
   * to be made.
   */
  isConnectionIgnored: EventHook<boolean>

  /**
   * Click-through behaviour on selected cells. If this returns`true`the
   * cell behind the selected cell will be selected.
   */
  isTransparentClickEvent: EventHook<boolean>

  // #endregion

  // #region hook

  /**
   * Returns`true`if the given cell is visible in this graph.
   */
  isCellVisible: CellHook<boolean>

  /**
   * Returns`true`if the given cell may not be moved, sized, bended,
   * disconnected, edited or selected.
   */
  isCellLocked: CellHook<boolean>

  /**
   * Returns`true`if the given cell is cloneable.
   */
  isCellCloneable: CellHook<boolean>
  isCellSelectable: CellHook<boolean>
  isCellDeletable: CellHook<boolean>
  isCellRotatable: CellHook<boolean>
  isLabelMovable: CellHook<boolean>
  isCellMovable: CellHook<boolean>

  /**
   * Returns`true`if the given cell is resizable.
   */
  isCellResizable: CellHook<boolean>

  /**
   * Returns`true`if the given cell is bendable.
   */
  isCellBendable: CellHook<boolean>

  /**
   * Returns`true`if the given cell is editable.
   */
  isCellEditable: CellHook<boolean>

  /**
   * Returns`true`if the given cell is connectable in this graph.
   */
  isCellConnectable: CellHook<boolean>
  isAnchorConnectable(cell: Cell, anchor: Anchor): boolean

  /**
   * Returns`true`if the given cell is disconnectable from the
   * source or target terminal.
   */
  isCellDisconnectable: (
    this: Graph,
    cell: Cell,
    terminal: Cell,
    isSource: boolean,
  ) => Nilable<boolean>

  /**
   * Returns `true` if the given cell is collapsed in this graph.
   */
  isCellCollapsed: CellHook<boolean>

  /**
   * Returns`true`if the given cell is foldable.
   */
  isCellCollapsable: (
    this: Graph,
    cell: Cell,
    nextCollapseState: boolean,
  ) => Nilable<boolean>

  /**
   * Returns`true`if the given terminal point is movable.
   */
  isTerminalPointMovable: CellIsSourceHook<boolean>

  /**
   * Returns`true`if the label must be rendered as HTML markup.
   */
  isHtmlLabel: CellHook<boolean>

  /**
   * This enables wrapping for HTML labels.
   *
   * Returns`true`if no white-space CSS style directive should be
   * used for displaying the given cells label.
   *
   * This is used as a workaround for IE ignoring the white-space
   * directive of child elements if the directive appears in a parent
   * element. It should be overridden to return`true`if a white-space
   * directive is used in the HTML markup that represents the given
   * cells label.
   */
  isWrapping: CellHook<boolean>

  /**
   * Returns`true`if the overflow portion of labels should be hidden.
   * If this returns`true`then node labels will be clipped to the size
   * of the nodes.
   */
  isLabelClipped: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a swimlane in the graph. A
   * swimlane is a container cell with some specific behaviour.
   */
  isSwimlane: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a "port", that is, when connecting
   * to it, the cell returned by `getTerminalForPort` should be used as the
   * terminal and the port should be referenced by the ID in either the
   * `'sourcePort'` or the or the `'targetPort'`.
   */
  isPort: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a valid root.
   */
  isValidRoot: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a valid source for new connections.
   */
  isValidSource: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a valid target for new connections.
   */
  isValidTarget: CellHook<boolean>

  /**
   * Returns`true`if the given target cell is a valid target for source.
   */
  isValidConnection: (
    this: Graph,
    source: Cell | null,
    target: Cell | null,
  ) => Nilable<boolean>

  /**
   * Returns`true`if the size of the given cell should automatically be
   * updated after a change of the label.
   */
  isAutoSizeCell: CellHook<boolean>

  /**
   * Returns`true`if the parent of the given cell should be extended
   * if the child has been resized so that it overlaps the parent.
   */
  isExtendParent: CellHook<boolean>

  /**
   * Returns`true`if the given cell should be kept inside the bounds
   * of its parent.
   */
  isConstrainChild: CellHook<boolean>

  /**
   * Returns`true`if the given cell is a valid drop target for the
   * specified cells.
   */
  isValidDropTarget: (
    this: Graph,
    target: Cell,
    cells: Cell[],
    e: MouseEvent,
  ) => Nilable<boolean>

  /**
   * Returns`true`if the given edge may be splitted into two edges
   * with the given cell as a new terminal between the two.
   */
  isSplitTarget: (
    this: Graph,
    target: Cell,
    cells: Cell[],
    e: MouseEvent,
  ) => Nilable<boolean>

  validateCell: (this: Graph, cell: Cell, context: any) => Nilable<string>

  validateEdge: (
    this: Graph,
    edge: Cell | null,
    source: Cell | null,
    target: Cell | null,
  ) => Nilable<string>

  getCellStyle: CellHook<Style>

  /**
   * Returns the string to be used as the link for the given cell.
   */
  getCellLink: CellHook<string>

  /**
   * Returns the cursor value to be used for the CSS of the shape
   * for the given cell.
   */
  getCellCursor: CellHook<string>

  /**
   * Returns the start size of the given swimlane, that is, the width
   * or height of the part that contains the title, depending on the
   * horizontal style. The return value is an `Rectangle` with either
   * width or height set as appropriate.
   */
  getStartSize: CellHook<Rectangle>
  getAnchors: CellIsSourceHook<(Anchor | Anchor.Data)[]>

  getHtml: CellHook<string | HTMLElement>

  /**
   * Returns a string or DOM node that represents the label for
   * the given cell.
   */
  getLabel: CellHook<string | HTMLElement>

  /**
   * Returns the initial value for in-place editing.
   */
  getEditingContent: (this: Graph, cell: Cell, e: Event) => Nilable<string>

  /**
   * Returns the string or DOM node to be used as the tooltip for
   * the given cell.
   */
  getTooltip: CellHook<string | HTMLElement | null>

  getCollapseTooltip: CellHook<string | HTMLElement | null>

  getOverlayTooltip: (
    this: Graph,
    cell: Cell,
    overlay: Overlay,
  ) => Nilable<string | HTMLElement>

  /**
   * Returns the terminal to be used for a given port.
   */
  getTerminalForPort: CellIsSourceHook<Cell>

  /**
   * Returns the offset to be used for the cells inside the given cell.
   */
  getChildOffset: CellHook<Point>

  /**
   * Returns the translation to be used in view.
   * @param currentRoot - The `currentRoot` fo the view.
   */
  getTranslateForCurrentRoot: (
    this: Graph,
    currentRoot: Cell | null,
  ) => Nilable<Point>

  shouldRedrawOnDataChange: (this: Graph, change: DataChange) => boolean

  // #endregion

  // #region className

  getCellClassName: CellHook<string>
  getLabelClassName: CellHook<string>

  // #endregion

  // #region after creation

  onCreateNode?: (
    this: Graph,
    newNode: Cell,
    options: Cell.CreateNodeOptions,
  ) => Cell | null | undefined | void

  onCreateEdge?: (
    this: Graph,
    newEdge: Cell,
    options: Cell.CreateEdgeOptions,
  ) => Cell | null | undefined | void

  onCreateGroup?: (
    this: Graph,
    newGroup: Cell,
    cells: Cell[],
  ) => Cell | null | undefined | void

  // #endregion
}
