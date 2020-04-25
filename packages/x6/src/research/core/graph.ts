import JQuery from 'jquery'
import { DomUtil } from '../../dom'
import { KeyValue } from '../../types'
import { v, MatrixLike } from '../../v'
import { Point, Rectangle } from '../../geometry'
import { StringExt, NumberExt, ObjectExt } from '../../util'
import {
  ViewRegistry,
  GridRegistry,
  BackgroundRegistry,
  HighlighterRegistry,
} from '../registry'
import { Attr } from '../attr'
import { Grid } from '../grid'
import { Background } from '../background'
import { Highlighter } from '../highlighter'
import { Globals } from './globals'
import { Cell } from './cell'
import { Node } from './node'
import { Edge } from './edge'
import { View } from './view'
import { Model } from './model'
import { Markup } from './markup'
import { CellView } from './cell-view'
import { NodeView } from './node-view'
import { EdgeView } from './edge-view'
import { CellViewFlag } from './cell-view-flag'

const sortingTypes = {
  NONE: 'sorting-none',
  APPROX: 'sorting-approximate',
  EXACT: 'sorting-exact',
}

const FLAG_INSERT = 1 << 30
const FLAG_REMOVE = 1 << 29

const MOUNT_BATCH_SIZE = 1000
const UPDATE_BATCH_SIZE = Infinity
const MIN_PRIORITY = 2

export class Graph extends View<Graph.EventArgs> {
  options = {
    width: 800,
    height: 600,
    origin: { x: 0, y: 0 },
    gridSize: 10,
    drawGrid: true,
    background: false,
    perpendicularLinks: false,
    snapLinks: false, // false, true, { radius: value }
    // When set to FALSE, an element may not have more than 1 link with the same source and target element.
    multiLinks: true,

    guard(e: JQuery.TriggeredEvent, view?: CellView | null) {
      return false
    },

    highlighting: {
      default: {
        name: 'stroke',
        args: {
          padding: 3,
        },
      },
      nodeAvailability: {
        name: 'className',
        args: {
          className: 'x6-available-node',
        },
      },
      magnetAvailability: {
        name: 'className',
        args: {
          className: 'x6-available-magnet',
        },
      },
    },

    // Prevent the default context menu from being displayed.
    preventContextMenu: true,

    // Prevent the default action for blank:pointer<action>.
    preventDefaultBlankAction: true,

    // Restrict the translation of elements by given bounding box.
    // Option accepts a boolean:
    //  true - the translation is restricted to the paper area
    //  false - no restrictions
    // A method:
    // restrictTranslate(elementView) {
    //     var parentId = elementView.model.get('parent');
    //     return parentId && this.model.getCell(parentId).getBBox();
    // },
    // Or a bounding box:
    // restrictTranslate: { x: 10, y: 10, width: 790, height: 590 }
    restrictTranslate: false,

    // Marks all available magnets with 'available-magnet' class name and
    // all available cells with 'available-cell' class name. Marks them
    // when dragging a link is started and unmark when the dragging is stopped.
    markAvailable: false,

    // Defines what link model is added to the graph after an user clicks on an active magnet.
    // Value could be the Backbone.model or a function returning the Backbone.model
    // defaultLink(elementView, magnet) { return condition ? new customLink1() : new customLink2() }
    // defaultLink: new Link(),

    // A connector that is used by links with no connector defined on the model.
    // e.g. { name: 'rounded', args: { radius: 5 }} or a function
    defaultConnector: { name: 'normal' },
    // A router that is used by links with no router defined on the model.
    // e.g. { name: 'oneSide', args: { padding: 10 }} or a function
    defaultRouter: { name: 'normal' },
    defaultAnchor: { name: 'center' },
    defaultLinkAnchor: { name: 'connectionRatio' },
    defaultConnectionPoint: { name: 'boundary' },

    /* CONNECTING */

    connectionStrategy: null,

    // Check whether to add a new edge to the graph when user clicks on an a magnet.
    validateMagnet(
      cellView: CellView,
      magnet: Element,
      e: JQuery.MouseDownEvent,
    ) {
      return magnet.getAttribute('magnet') !== 'passive'
    },

    // Check whether to allow or disallow the link connection while an arrowhead end (source/target)
    // being changed.
    validateConnection(
      this: Graph,
      sourceView: CellView,
      sourceMagnet: Element,
      targetView: CellView,
      targetMagnet: Element,
      terminalType: Edge.TerminalType,
      edgeView?: EdgeView,
    ) {
      const view = terminalType === 'target' ? targetView : sourceView
      return view instanceof NodeView
    },

    /* EMBEDDING */

    // Enables embedding. Re-parent the dragged element with elements under it and makes sure that
    // all links and elements are visible taken the level of embedding into account.
    embeddingMode: false,

    // Check whether to allow or disallow the element embedding while an element being translated.
    validateEmbedding(this: Graph, childView: CellView, parentView: CellView) {
      // by default all elements can be in relation child-parent
      return true
    },

    // Determines the way how a cell finds a suitable parent when it's dragged over the paper.
    // The cell with the highest z-index (visually on the top) will be chosen.
    findParentBy: 'bbox', // 'bbox'|'center'|'origin'|'corner'|'topRight'|'bottomLeft'

    // If enabled only the element on the very front is taken into account for the embedding.
    // If disabled the elements under the dragged view are tested one by one
    // (from front to back) until a valid parent found.
    frontParentOnly: true,

    // Interactive flags. See online docs for the complete list of interactive flags.
    interactive: {
      labelMove: false,
    },

    // When set to true the links can be pinned to the paper.
    // i.e. link source/target can be a point e.g. link.get('source') ==> { x: 100, y: 100 };
    linkPinning: true,

    // Custom validation after an interaction with a link ends.
    // Recognizes a function. If `false` is returned, the link is disallowed (removed or reverted)
    // (linkView, paper) => boolean
    allowLink: null,

    // Allowed number of mousemove events after which the pointerclick event will be still triggered.
    clickThreshold: 0,

    // Number of required mousemove events before the first pointermove event will be triggered.
    moveThreshold: 0,

    /**
     * Number of required mousemove events before the a edge is created
     * out of the magnet. Or string `onleave` so the edge is created when
     * the mouse leaves the magnet.
     */
    magnetThreshold: 0,

    // Rendering Options

    sorting: sortingTypes.EXACT,

    async: false,
    frozen: false,

    onViewUpdate(view: CellView, flag: number, opt: any, graph: Graph) {
      if (flag & FLAG_INSERT || opt.mounting) {
        return
      }
      graph.requestConnectedEdgesUpdate(view, opt)
    },

    onViewPostponed(view: CellView, flag: number) {
      return this.forcePostponedViewUpdate(view, flag)
    },

    /**
     * A callback function that is used to determine whether a given view
     * should be shown in an `async` paper. If the function returns `true`,
     * the view is attached to the DOM; if it returns `false`, the view is
     * detached from the DOM.
     */
    viewport: null,

    // Default namespaces

    // cellViewNamespace: null,
    // highlighterNamespace: highlighters,
    // anchorNamespace: anchors,
    // linkAnchorNamespace: linkAnchors,
    // connectionPointNamespace: connectionPoints,
  }

  tools: any
  $document: any
  model: Model

  public readonly container: HTMLDivElement
  public readonly backgroundElem: HTMLDivElement
  public readonly gridElem: HTMLDivElement
  public readonly svgElem: SVGSVGElement
  public readonly defsElem: SVGDefsElement
  public readonly viewportElem: SVGGElement
  public readonly drawPane: SVGGElement
  protected viewportMatrix: DOMMatrix | null
  protected viewportTransformString: string | null

  protected highlights: KeyValue<Graph.HighlightCacheItem> = {}
  protected zPivots: KeyValue<Comment> = {}
  protected views: KeyValue<CellView> = {}
  protected updates: Graph.Updates

  SORT_DELAYING_BATCHES = ['add', 'to-front', 'to-back']
  UPDATE_DELAYING_BATCHES = ['translate']
  MIN_SCALE = 1e-6

  constructor(options: any) {
    super()

    this.options = ObjectExt.merge(this.options, options)
    this.container = options.container
    this.$(this.container).addClass(this.prefixClassName('graph'))
    const { selectors, fragment } = Markup.parseJSONMarkup(Graph.markup)
    this.backgroundElem = selectors.background as HTMLDivElement
    this.gridElem = selectors.grid as HTMLDivElement
    this.svgElem = selectors.svg as SVGSVGElement
    this.defsElem = selectors.defs as SVGDefsElement
    this.viewportElem = selectors.viewport as SVGGElement
    this.drawPane = selectors.drawPane as SVGGElement
    this.container.appendChild(fragment)

    this.delegateEvents()
    this.setModel()
    this.resize()
    this.setGrid(this.options.drawGrid)
    this.drawGrid()

    if (this.options.background) {
      this.drawBackground(this.options.background as any)
    }

    this.resetUpdates()
    this.setup()

    // Renders the existing cells in the model.
    this.resetViews(this.model.getCells())

    // Starts the rendering loop.
    if (!this.isFrozen() && this.isAsync()) {
      this.updateViewsAsync()
    }
  }

  delegateEvents() {
    const ctor = this.constructor as typeof Graph
    super.delegateEvents(ctor.events)
    return this
  }

  createModel() {
    return new Model()
  }

  setModel(model: Model = this.createModel()) {
    this.model = model
  }

  init() {
    // const { options, el } = this
    // if (!options.cellViewNamespace) {
    //   /* global joint: true */
    //   options.cellViewNamespace =
    //     typeof joint !== 'undefined' && has(joint, 'shapes')
    //       ? joint.shapes
    //       : null
    //   /* global joint: false */
    // }
    // const model = (this.model = new Model())
    // this.setGrid(options.drawGrid)
    // this.cloneOptions()
    // this.render()
    // this.setDimensions()
    // this.startListening()
    // Hash of all cell views.
    // this._views = {}
    // z-index pivots
    // this._zPivots = {}
    // Reference to the paper owner document
    // this.$document = $(this.elem.ownerDocument!)
    // Highlighters references
    // this._highlights = {}
    // Render existing cells in the graph
    // this.resetViews(model.cells.models)
    // Start the Rendering Loop
    // if (!this.isFrozen() && this.isAsync()) this.updateViewsAsync()
  }

  protected resetUpdates() {
    this.updates = {
      priorities: [{}, {}, {}],

      mounted: {},
      mountedCids: [],

      unmounted: {},
      unmountedCids: [],

      count: 0,
      sort: false,
      frozen: false,
      freezeKey: null,

      animationId: null,
    }
  }

  protected setup() {
    const model = this.model
    model.on('sorted', () => {
      this.onSortModel()
      this.trigger('model:sorted')
    })

    model.on('reseted', args => {
      this.onModelReseted(args.options)
      this.trigger('model:reseted', args)
    })

    model.on('updated', args => this.trigger('model:updated', args))

    model.on('cell:added', ({ cell, options }) =>
      this.onCellAdded(cell, options),
    )

    model.on('cell:removed', ({ cell, options }) =>
      this.onCellRemoved(cell, options),
    )

    model.on('cell:change:zIndex', ({ cell, options }) =>
      this.onCellZIndexChanged(cell, options),
    )

    model.on('cell:change:visible', ({ cell, current, options }) => {
      this.onCellVisibleChanged(cell, current !== false, options)
    })

    model.on('batch:stop', ({ name, data }) => this.onBatchStop(name, data))

    this.on(
      'cell:highlight',
      ({
        view,
        magnet,
        options,
      }: {
        view: CellView
        magnet: Element
        options: CellView.HighlightOptions
      }) => this.onCellHighlight(view, magnet, options),
    )
    this.on(
      'cell:unhighlight',
      ({
        view,
        magnet,
        options,
      }: {
        view: CellView
        magnet: Element
        options: CellView.HighlightOptions
      }) => this.onCellUnhighlight(view, magnet, options),
    )

    const update = () => {
      this.drawGrid()
      if (this.backgroundOptions) {
        this.updateBackgroundImage(this.backgroundOptions)
      }
    }

    this.on('scale', update)
    this.on('translate', update)
  }

  protected onSortModel() {
    if (this.model.hasActiveBatch(this.SORT_DELAYING_BATCHES)) {
      return
    }

    this.sortViews()
  }

  protected onModelReseted(options: Model.SetOptions) {
    this.removeZPivots()
    this.resetViews(this.model.getCells(), options)
  }

  protected onCellAdded(cell: Cell, options: Model.AddOptions) {
    const position = options.position
    if (this.isAsync() || typeof position !== 'number') {
      this.renderView(cell, options)
    } else {
      if (options.maxPosition === position) {
        this.freeze({ key: 'addCells' })
      }
      this.renderView(cell, options)
      if (position === 0) {
        this.unfreeze({ key: 'addCells' })
      }
    }
  }

  protected onCellRemoved(cell: Cell, options: Model.RemoveOptions) {
    const view = this.findViewByCell(cell)
    if (view) {
      this.requestViewUpdate(view, FLAG_REMOVE, view.priority, options)
    }
  }

  protected onCellZIndexChanged(cell: Cell, options: Cell.MutateOptions) {
    if (this.options.sorting === sortingTypes.APPROX) {
      const view = this.findViewByCell(cell)
      if (view) {
        this.requestViewUpdate(view, FLAG_INSERT, view.priority, options)
      }
    }
  }

  protected onCellVisibleChanged(
    cell: Cell,
    visible: boolean,
    options: Cell.MutateOptions,
  ) {
    // Hide connected edges before cell
    if (!visible) {
      this.processEdgeOnTerminalVisibleChanged(cell, false)
    }

    const view = this.findViewByCell(cell)
    if (!visible && view) {
      this.removeView(cell)
    } else if (visible && view == null) {
      this.renderView(cell, options)
    }

    // Show connected edges after cell rendered
    if (visible) {
      this.processEdgeOnTerminalVisibleChanged(cell, true)
    }
  }

  protected processEdgeOnTerminalVisibleChanged(node: Cell, visible: boolean) {
    const getOppositeTerminal = (edge: Edge, currentTerminal: Cell) => {
      const sourceId = edge.getSourceCellId()
      if (sourceId !== currentTerminal.id) {
        return edge.getSourceCell()
      }

      const targetId = edge.getTargetCellId()
      if (targetId !== currentTerminal.id) {
        return edge.getTargetCell()
      }

      return null
    }

    this.model.getConnectedEdges(node).forEach(edge => {
      const oppositeCell = getOppositeTerminal(edge, node)
      if (oppositeCell == null || oppositeCell.isVisible()) {
        visible ? edge.show() : edge.hide()
      }
    })
  }

  protected onBatchStop(name: string, data: KeyValue) {
    if (this.isFrozen()) {
      return
    }

    const model = this.model
    if (!this.isAsync()) {
      // UPDATE_DELAYING_BATCHES: ['translate'],
      const updateDelayingBatches = this.UPDATE_DELAYING_BATCHES
      if (
        updateDelayingBatches.includes(name) &&
        !model.hasActiveBatch(updateDelayingBatches)
      ) {
        this.updateViews(data)
      }
    }

    // SORT_DELAYING_BATCHES: ['add', 'to-front', 'to-back'],
    const sortDelayingBatches = this.SORT_DELAYING_BATCHES
    if (
      sortDelayingBatches.includes(name) &&
      !model.hasActiveBatch(sortDelayingBatches)
    ) {
      this.sortViews()
    }
  }

  getCellById(id: string) {
    return this.model.getCell(id)
  }

  addNode(metadata: Node.Metadata, options?: Model.AddOptions): Node
  addNode(node: Node, options: Model.AddOptions): Node
  addNode(node: Node | Node.Metadata, options: Model.AddOptions = {}): Node {
    return this.model.addNode(node)
  }

  createNode(metadata: Node.Metadata) {
    return this.model.createNode(metadata)
  }

  addEdge(metadata: Edge.Metadata, options: Model.AddOptions): Edge
  addEdge(edge: Edge, options: Model.AddOptions): Edge
  addEdge(node: Edge | Edge.Metadata, options: Model.AddOptions = {}): Edge {
    return this.model.addEdge(node)
  }

  createEdge(metadata: Edge.Metadata) {
    return this.model.createEdge(metadata)
  }

  addCell(cell: Cell | Cell[], options: Model.AddOptions = {}) {
    this.model.addCell(cell, options)
    return this
  }

  // render() {
  //   this.renderChildren(this.children)
  //   const { childNodes, options } = this
  //   const { svg, cells, defs, tools, layers, background, grid } = childNodes

  //   this.svg = svg
  //   this.defs = defs
  //   this.tools = tools
  //   this.cells = cells
  //   this.layers = layers
  //   this.$background = $(background)
  //   this.$grid = $(grid)

  //   v.ensureId(svg)

  //   // backwards compatibility
  //   this.viewport = cells

  //   // if (options.background) {
  //   //     this.drawBackground(options.background)
  //   // }

  //   // if (options.drawGrid) {
  //   //     this.drawGrid()
  //   // }

  //   return this
  // }

  requestConnectedEdgesUpdate(view: CellView, options: any = {}) {
    if (view instanceof CellView) {
      const cell = view.cell
      const edges = this.model.getConnectedEdges(cell)
      for (let j = 0, n = edges.length; j < n; j += 1) {
        const edge = edges[j]
        const edgeView = this.findViewByCell(edge)
        if (!edgeView) {
          continue
        }

        const flagLabels: CellViewFlag.Action[] = ['update']
        if (edge.getTargetCell() === cell) {
          flagLabels.push('target')
        }
        if (edge.getSourceCell() === cell) {
          flagLabels.push('source')
        }

        this.scheduleViewUpdate(
          edgeView,
          edgeView.getFlag(flagLabels),
          edgeView.priority,
          options,
        )
      }
    }
  }

  forcePostponedViewUpdate(view: CellView, flag: number) {
    if (!view || !(view instanceof CellView)) {
      return false
    }

    const cell = view.cell
    if (cell.isNode()) {
      return false
    }

    const edgeView = view as EdgeView

    if (cell.isEdge() && (flag & view.getFlag(['source', 'target'])) === 0) {
      // EdgeView is waiting for the source/target cellView to be rendered.
      // This can happen when the cells are not in the viewport.
      let sourceFlag = 0
      const sourceView = this.findViewByCell(cell.getSourceCell())
      if (sourceView && !this.isViewMounted(sourceView)) {
        sourceFlag = this.dumpView(sourceView)
        edgeView.updateTerminalMagnet('source')
      }
      let targetFlag = 0
      const targetView = this.findViewByCell(cell.getTargetCell())
      if (targetView && !this.isViewMounted(targetView)) {
        targetFlag = this.dumpView(targetView)
        edgeView.updateTerminalMagnet('target')
      }

      if (sourceFlag === 0 && targetFlag === 0) {
        // If leftover flag is 0, all view updates were done.
        return !this.dumpView(edgeView)
      }
    }

    return false
  }

  // prepareViewUpdate
  scheduleViewUpdate(
    view: View,
    flag: number,
    priority: number,
    options: any = {},
  ) {
    const cid = view.cid
    const updates = this.updates
    let cache = updates.priorities[priority]
    if (!cache) {
      cache = updates.priorities[priority] = {}
    }

    const currentFlag = cache[cid] || 0
    if ((currentFlag & flag) === flag) {
      return
    }

    if (!currentFlag) {
      updates.count += 1
    }

    if (flag & FLAG_REMOVE && currentFlag & FLAG_INSERT) {
      // When a view is removed we need to remove the
      // insert flag as this is a reinsert.
      cache[cid] ^= FLAG_INSERT
    } else if (flag & FLAG_INSERT && currentFlag & FLAG_REMOVE) {
      // When a view is added we need to remove the remove
      // flag as this is view was previously removed.
      cache[cid] ^= FLAG_REMOVE
    }

    cache[cid] |= flag

    const onViewUpdate = this.options.onViewUpdate
    if (typeof onViewUpdate === 'function') {
      onViewUpdate.call(this, view, flag, options, this)
    }
  }

  requestViewUpdate(
    view: CellView,
    flag: number,
    priority: number,
    options: Graph.RequestViewUpdateOptions = {},
  ) {
    this.scheduleViewUpdate(view, flag, priority, options)

    const isAsync = this.isAsync()
    if (
      this.isFrozen() ||
      (isAsync && options.async !== false) ||
      // UPDATE_DELAYING_BATCHES = ['translate']
      this.model.hasActiveBatch(this.UPDATE_DELAYING_BATCHES)
    ) {
      return
    }

    const stats = this.updateViews(options)
    if (isAsync) {
      this.trigger('render:done', { stats, options })
    }
  }

  /**
   * Adds view into the DOM and update it.
   */
  dumpView(view: CellView, options: any = {}) {
    if (view == null) {
      return 0
    }

    const cid = view.cid
    const updates = this.updates
    const cache = updates.priorities[view.priority]
    const flag = this.registerMountedView(view) | cache[cid]
    delete cache[cid]

    if (!flag) {
      return 0
    }

    return this.updateView(view, flag, options)
  }

  /**
   * Adds all views into the DOM and update them.
   */
  dumpViews(options: Graph.UpdateViewOptions = {}) {
    this.checkViewport(options)
    this.updateViews(options)
  }

  /**
   * Ensure the view associated with the cell is attached
   * to the DOM and updated.
   */
  requireView(cell: Cell, options: any = {}) {
    const view = this.findViewByCell(cell)
    if (view == null) {
      return null
    }
    this.dumpView(view, options)
    return view
  }

  updateView(view: View, flag: number, options: any = {}) {
    if (view == null) {
      return 0
    }

    if (view instanceof CellView) {
      if (flag & FLAG_REMOVE) {
        this.removeView(view.cell as any)
        return 0
      }

      if (flag & FLAG_INSERT) {
        this.insertView(view)
        flag ^= FLAG_INSERT // tslint:disable-line
      }
    }

    if (!flag) {
      return 0
    }

    return view.confirmUpdate(flag, options)
  }

  updateViews(options: Graph.UpdateViewOptions = {}) {
    let result: ReturnType<typeof Graph.prototype.updateViewsBatch>
    let batchCount = 0
    let updatedCount = 0
    let priority = MIN_PRIORITY

    do {
      result = this.updateViewsBatch(options)
      batchCount += 1
      updatedCount += result.updatedCount
      priority = Math.min(result.priority, priority)
    } while (!result.empty)

    return {
      priority,
      batchCount,
      updatedCount,
    }
  }

  protected updateViewsBatch(options: Graph.UpdateViewOptions = {}) {
    const updates = this.updates
    const priorities = updates.priorities
    const batchSize = options.batchSize || UPDATE_BATCH_SIZE

    let empty = true
    let priority = MIN_PRIORITY
    let mountedCount = 0
    let unmountedCount = 0
    let updatedCount = 0
    let postponedCount = 0

    let viewportFn = options.viewport || this.options.viewport
    if (typeof viewportFn !== 'function') {
      viewportFn = null
    }

    let postponeViewFn: any = this.options.onViewPostponed
    if (typeof postponeViewFn !== 'function') {
      postponeViewFn = null
    }

    main: for (let p = 0, n = priorities.length; p < n; p += 1) {
      const cache = priorities[p]
      for (const cid in cache) {
        if (updatedCount >= batchSize) {
          empty = false // goto next batch
          break main
        }

        const view = View.views[cid]
        if (!view) {
          delete cache[cid]
          continue
        }

        let currentFlag = cache[cid]
        // Do not check a view for viewport if we are about to remove the view.
        if ((currentFlag & FLAG_REMOVE) === 0) {
          const isUnmounted = cid in updates.unmounted
          if (viewportFn && !viewportFn.call(this, view, isUnmounted, this)) {
            // Unmount view
            if (!isUnmounted) {
              this.registerUnmountedView(view)
              view.unmount()
            }

            updates.unmounted[cid] |= currentFlag
            delete cache[cid]
            unmountedCount += 1
            continue
          }

          // Mount view
          if (isUnmounted) {
            currentFlag |= FLAG_INSERT
            mountedCount += 1
          }
          currentFlag |= this.registerMountedView(view)
        }

        const leftoverFlag = this.updateView(view, currentFlag, options)
        if (leftoverFlag > 0) {
          // update has not finished
          cache[cid] = leftoverFlag
          if (
            !postponeViewFn ||
            !postponeViewFn.call(this, view, leftoverFlag, this) ||
            cache[cid]
          ) {
            postponedCount += 1
            empty = false
            continue
          }
        }

        if (priority > p) {
          priority = p
        }

        updatedCount += 1
        delete cache[cid]
      }
    }

    return {
      empty,
      priority,
      mountedCount,
      unmountedCount,
      updatedCount,
      postponedCount,
    }
  }

  protected updateViewsAsync(
    options: Graph.UpdateViewsAsyncOptions = {},
    data: {
      processed: number
      priority: number
    } = {
      processed: 0,
      priority: MIN_PRIORITY,
    },
  ) {
    const updates = this.updates
    const animationId = updates.animationId
    if (animationId) {
      DomUtil.cancelAnimationFrame(animationId)
      if (data.processed === 0) {
        const beforeFn = options.before
        if (typeof beforeFn === 'function') {
          beforeFn.call(this, this)
        }
      }

      const stats = this.updateViewsBatch(options)
      const checkout = this.checkViewportImpl({
        viewport: options.viewport,
        mountedBatchSize: MOUNT_BATCH_SIZE - stats.mountedCount,
        unmountedBatchSize: MOUNT_BATCH_SIZE - stats.unmountedCount,
      })

      let processed = data.processed
      const total = updates.count
      const mountedCount = checkout.mountedCount
      const unmountedCount = checkout.unmountedCount

      if (stats.updatedCount > 0) {
        // Some updates have been just processed
        processed += stats.updatedCount + stats.unmountedCount
        data.priority = Math.min(stats.priority, data.priority)
        if (stats.empty && mountedCount === 0) {
          stats.priority = data.priority
          stats.mountedCount += mountedCount
          stats.unmountedCount += unmountedCount
          this.trigger('render:done', { stats, options })
          data.processed = 0
          updates.count = 0
        } else {
          data.processed = processed
        }
      }

      // Progress callback
      const progressFn = options.progress
      if (total && typeof progressFn === 'function') {
        progressFn.call(this, stats.empty, processed, total, stats, this)
      }

      // The current frame could have been canceled in a callback
      if (updates.animationId !== animationId) {
        return
      }
    }

    updates.animationId = DomUtil.requestAnimationFrame(() => {
      this.updateViewsAsync(options, data)
    })
  }

  protected registerMountedView(view: View) {
    const cid = view.cid
    const updates = this.updates

    if (cid in updates.mounted) {
      return 0
    }

    updates.mounted[cid] = true
    updates.mountedCids.push(cid)
    const flag = updates.unmounted[cid] || 0
    delete updates.unmounted[cid]
    return flag
  }

  protected registerUnmountedView(view: View) {
    const cid = view.cid
    const updates = this.updates

    if (cid in updates.unmounted) {
      return 0
    }

    updates.unmounted[cid] |= FLAG_INSERT

    const flag = updates.unmounted[cid]
    updates.unmountedCids.push(cid)
    delete updates.mounted[cid]
    return flag
  }

  isViewMounted(view: CellView) {
    if (view == null) {
      return false
    }

    const cid = view.cid
    return cid in this.updates.mounted
  }

  getMountedViews() {
    return Object.keys(this.updates.mounted).map(cid => CellView.views[cid])
  }

  getUnmountedViews() {
    return Object.keys(this.updates.unmounted).map(cid => CellView.views[cid])
  }

  protected checkMountedViews(
    viewportFn?: Graph.CheckViewportFn | null,
    batchSize?: number,
  ) {
    let unmountCount = 0
    if (typeof viewportFn !== 'function') {
      return unmountCount
    }

    const updates = this.updates
    const mounted = updates.mounted
    const mountedCids = updates.mountedCids
    const size =
      batchSize == null
        ? mountedCids.length
        : Math.min(mountedCids.length, batchSize)

    for (let i = 0; i < size; i += 1) {
      const cid = mountedCids[i]
      if (!(cid in mounted)) {
        continue
      }

      const view = CellView.views[cid]
      if (view == null) {
        continue
      }

      if (viewportFn.call(this, view, true, this)) {
        // Push at the end of all mounted ids
        mountedCids.push(cid)
        continue
      }

      unmountCount += 1
      const flag = this.registerUnmountedView(view)
      if (flag) {
        view.unmount()
      }
    }

    // Get rid of views, that have been unmounted
    mountedCids.splice(0, size)
    return unmountCount
  }

  protected checkUnmountedViews(
    viewportFn?: Graph.CheckViewportFn | null,
    batchSize?: number,
  ) {
    let mountCount = 0
    if (typeof viewportFn !== 'function') {
      viewportFn = null // tslint:disable-line
    }

    const updates = this.updates
    const unmounted = updates.unmounted
    const unmountedCids = updates.unmountedCids
    const size =
      batchSize == null
        ? unmountedCids.length
        : Math.min(unmountedCids.length, batchSize)

    for (let i = 0; i < size; i += 1) {
      const cid = unmountedCids[i]
      if (!(cid in unmounted)) {
        continue
      }

      const view = CellView.views[cid]
      if (view == null) {
        continue
      }

      if (viewportFn && !viewportFn.call(this, view, false, this)) {
        unmountedCids.push(cid)
        continue
      }

      mountCount += 1
      const flag = this.registerMountedView(view)
      if (flag) {
        this.scheduleViewUpdate(view, flag, view.priority, {
          mounting: true,
        })
      }
    }

    // Get rid of views, that have been mounted
    unmountedCids.splice(0, size)

    return mountCount
  }

  protected checkViewportImpl(
    options: Graph.CheckViewportOptions & {
      mountedBatchSize?: number
      unmountedBatchSize?: number
    } = {
      mountedBatchSize: Number.MAX_SAFE_INTEGER,
      unmountedBatchSize: Number.MAX_SAFE_INTEGER,
    },
  ) {
    const viewportFn = options.viewport || this.options.viewport
    const unmountedCount = this.checkMountedViews(
      viewportFn,
      options.unmountedBatchSize,
    )

    const mountedCount = this.checkUnmountedViews(
      viewportFn,
      // Do not check views, that have been just unmounted
      // and pushed at the end of the cids array
      unmountedCount > 0
        ? Math.min(
            this.updates.unmountedCids.length - unmountedCount,
            options.mountedBatchSize as number,
          )
        : options.mountedBatchSize,
    )

    return { mountedCount, unmountedCount }
  }

  /**
   * Determine every view in the graph should be attached/detached.
   */
  checkViewport(options: Graph.CheckViewportOptions = {}) {
    return this.checkViewportImpl(options)
  }

  isFrozen() {
    return !!this.options.frozen
  }

  /**
   * Freeze the graph then the graph does not automatically re-render upon
   * changes in the graph. This is useful when adding large numbers of cells.
   */
  freeze(options: Graph.FreezeOptions = {}) {
    const key = options.key
    const updates = this.updates
    const frozen = this.options.frozen
    const freezeKey = updates.freezeKey

    if (key && key !== freezeKey) {
      if (frozen && freezeKey) {
        // key passed, but the graph is already freezed with another key
        return
      }
      updates.frozen = frozen
      updates.freezeKey = key
    }

    this.options.frozen = true

    const animationId = updates.animationId
    updates.animationId = null
    if (this.isAsync() && animationId != null) {
      DomUtil.cancelAnimationFrame(animationId)
    }
  }

  unfreeze(options: Graph.UnfreezeOptions = {}) {
    const key = options.key
    const updates = this.updates
    const freezeKey = updates.freezeKey
    // key passed, but the graph is already freezed with another key
    if (key && freezeKey && key !== freezeKey) {
      return
    }

    updates.freezeKey = null
    // key passed, but the graph is already freezed
    if (key && key === freezeKey && updates.frozen) {
      return
    }

    if (this.isAsync()) {
      this.freeze()
      this.updateViewsAsync(options)
    } else {
      this.updateViews(options)
    }

    this.options.frozen = updates.frozen = false

    if (updates.sort) {
      this.sortViews()
      updates.sort = false
    }
  }

  isAsync() {
    return !!this.options.async
  }

  onRemove() {
    this.freeze()
    this.removeViews()
  }

  protected resetViews(cells: Cell[] = [], options: any = {}) {
    this.resetUpdates()
    this.removeViews()
    this.freeze({ key: 'reset' })
    for (let i = 0, n = cells.length; i < n; i += 1) {
      this.renderView(cells[i], options)
    }
    this.unfreeze({ key: 'reset' })
    this.sortViews()
  }

  createView(cell: Cell): CellView | null {
    // A class taken from the paper options.
    // let optionalViewClass
    // // A default basic class (either dia.ElementView or dia.LinkView)
    // let defaultViewClass
    // // A special class defined for this model in the corresponding namespace.
    // // e.g. joint.shapes.basic.Rect searches for joint.shapes.basic.RectView
    // const namespace = this.options.cellViewNamespace
    // const type = cell.get('type') + 'View'
    // const namespaceViewClass = getByPath(namespace, type, '.')
    // if (cell.isLink()) {
    //   optionalViewClass = this.options.linkView
    //   defaultViewClass = LinkView
    // } else {
    //   optionalViewClass = this.options.elementView
    //   defaultViewClass = ElementView
    // }
    // // a) the paper options view is a class (deprecated)
    // //  1. search the namespace for a view
    // //  2. if no view was found, use view from the paper options
    // // b) the paper options view is a function
    // //  1. call the function from the paper options
    // //  2. if no view was return, search the namespace for a view
    // //  3. if no view was found, use the default
    // const ViewClass =
    //   optionalViewClass.prototype instanceof Backbone.View
    //     ? namespaceViewClass || optionalViewClass
    //     : optionalViewClass.call(this, cell) ||
    //       namespaceViewClass ||
    //       defaultViewClass
    // return new ViewClass({
    //   model: cell,
    //   interactive: this.options.interactive,
    // })

    const view = cell.view
    const options = { interactive: this.options.interactive }
    if (view != null && typeof view === 'string') {
      const def = ViewRegistry.get(view)
      if (def) {
        return new def(cell, options)
      }

      return ViewRegistry.onNotFound(view)
    }

    if (cell.isNode()) {
      return new NodeView(cell, options)
    }

    if (cell.isEdge()) {
      return new EdgeView(cell, options)
    }

    return null
  }

  protected removeView(cell: Cell) {
    const view = this.views[cell.id]
    if (view) {
      const cid = view.cid
      const updates = this.updates
      const mounted = updates.mounted
      const unmounted = updates.unmounted
      view.remove()
      delete this.views[cell.id]
      delete mounted[cid]
      delete unmounted[cid]
    }
    return view
  }

  protected removeViews() {
    Object.keys(this.views).forEach(id => {
      const view = this.views[id]
      if (view) {
        this.removeView(view.cell)
      }
    })
    this.views = {}
  }

  protected checkCellVisible(ceil: Cell) {}

  protected renderView(cell: Cell, options: any = {}) {
    const id = cell.id
    const views = this.views
    let flag = 0
    let view = views[id]

    if (view) {
      flag = FLAG_INSERT
    } else {
      const tmp = this.createView(cell)
      if (tmp) {
        view = views[cell.id] = tmp
        view.graph = this
        flag = this.registerUnmountedView(view) | view.getBootstrapFlag()
      }
    }

    if (view) {
      this.requestViewUpdate(view, flag, view.priority, options)
    }

    return view
  }

  isExactSorting() {
    return this.options.sorting === sortingTypes.EXACT
  }

  sortViews() {
    if (!this.isExactSorting()) {
      return
    }

    if (this.isFrozen()) {
      // sort views once unfrozen
      this.updates.sort = true
      return
    }

    this.sortViewsExact()
  }

  // Highly inspired by the jquery.sortElements plugin by Padolsey.
  // See http://james.padolsey.com/javascript/sorting-elements-with-jquery/.
  protected sortElements(
    elems: Element[],
    comparator: (a: Element, b: Element) => number,
  ) {
    const placements = elems.map(elem => {
      const parentNode = elem.parentNode!
      // Since the element itself will change position, we have
      // to have some way of storing it's original position in
      // the DOM. The easiest way is to have a 'flag' node:
      const nextSibling = parentNode.insertBefore(
        document.createTextNode(''),
        elem.nextSibling,
      )

      return (targetNode: Element) => {
        if (parentNode === targetNode) {
          throw new Error(
            "You can't sort elements if any one is a descendant of another.",
          )
        }

        // Insert before flag
        parentNode.insertBefore(targetNode, nextSibling)
        // Remove flag
        parentNode.removeChild(nextSibling)
      }
    })

    elems.sort(comparator).forEach((elem, index) => placements[index](elem))
  }

  sortViewsExact() {
    // Run insertion sort algorithm in order to efficiently sort DOM
    // elements according to their associated cell `zIndex` attribute.
    const elems = this.$(this.drawPane)
      .children('[data-id]')
      .toArray() as Element[]
    const model = this.model
    this.sortElements(elems, (a, b) => {
      const cellA = model.getCell(a.getAttribute('data-id') || '')
      const cellB = model.getCell(b.getAttribute('data-id') || '')
      const z1 = cellA.getZIndex() || 0
      const z2 = cellB.getZIndex() || 0
      return z1 === z2 ? 0 : z1 < z2 ? -1 : 1
    })
  }

  protected addZPivot(zIndex: number = 0) {
    const pivots = this.zPivots
    let pivot = pivots[zIndex]
    if (pivot) {
      return pivot
    }

    pivot = pivots[zIndex] = document.createComment(`z-index:${zIndex + 1}`)
    let neighborZ = -Infinity
    for (const key in pivots) {
      const currentZ = +key
      if (currentZ < zIndex && currentZ > neighborZ) {
        neighborZ = currentZ
        if (neighborZ === zIndex - 1) {
          continue
        }
      }
    }

    const layer = this.drawPane
    if (neighborZ !== -Infinity) {
      const neighborPivot = pivots[neighborZ]
      layer.insertBefore(pivot, neighborPivot.nextSibling)
    } else {
      layer.insertBefore(pivot, layer.firstChild)
    }
    return pivot
  }

  protected removeZPivots() {
    Object.keys(this.zPivots).forEach(z => {
      const elem = this.zPivots[z]
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem)
      }
    })
    this.zPivots = {}
  }

  insertView(view: CellView) {
    const drawPane = this.drawPane
    switch (this.options.sorting) {
      case sortingTypes.APPROX:
        const zIndex = view.cell.getZIndex()
        const pivot = this.addZPivot(zIndex)
        drawPane.insertBefore(view.container, pivot)
        break
      case sortingTypes.EXACT:
      default:
        drawPane.appendChild(view.container)
        break
    }
  }

  // #region transformation

  resize(width?: number, height?: number) {
    const options = this.options
    let w = width === undefined ? options.width : width
    let h = height === undefined ? options.height : height

    options.width = w
    options.height = h

    if (typeof w === 'number') {
      w = Math.round(w)
    }
    if (typeof h === 'number') {
      h = Math.round(h)
    }

    this.$(this.container).css({
      width: w === null ? '' : w,
      height: h === null ? '' : h,
    })

    const size = this.getComputedSize()
    this.trigger('resize', { ...size })
  }

  getComputedSize() {
    const options = this.options
    let w = options.width
    let h = options.height
    if (!NumberExt.isNumber(w)) {
      w = this.container.clientWidth
    }
    if (!NumberExt.isNumber(h)) {
      h = this.container.clientHeight
    }
    return { width: w, height: h }
  }

  getScale() {
    return v.matrixToScale(this.getMatrix())
  }

  scale(sx: number, sy: number = sx, ox: number = 0, oy: number = 0) {
    const translate = this.getTranslation()

    if (ox || oy || translate.tx || translate.ty) {
      const tx = translate.tx - ox * (sx - 1)
      const ty = translate.ty - oy * (sy - 1)
      this.translate(tx, ty)
    }

    sx = Math.max(sx || 0, this.MIN_SCALE) // tslint:disable-line
    sy = Math.max(sy || 0, this.MIN_SCALE) // tslint:disable-line

    const matrix = this.getMatrix()
    matrix.a = sx
    matrix.d = sy

    this.setMatrix(matrix)

    this.trigger('scale', { sx, sy, ox, oy })

    return this
  }

  getRotation() {
    return v.matrixToRotate(this.getMatrix())
  }

  rotate(angle: number, cx?: number, cy?: number) {
    if (cx == null || cy == null) {
      const bbox = v.getBBox(this.drawPane)
      cx = bbox.width / 2 // tslint:disable-line
      cy = bbox.height / 2 // tslint:disable-line
    }

    const ctm = this.getMatrix()
      .translate(cx, cy)
      .rotate(angle)
      .translate(-cx, -cy)
    this.setMatrix(ctm)

    return this
  }

  getTranslation() {
    return v.matrixToTranslate(this.getMatrix())
  }

  translate(tx: number, ty: number) {
    const matrix = this.getMatrix()
    matrix.e = tx || 0
    matrix.f = ty || 0

    this.setMatrix(matrix)

    const ret = this.getTranslation()
    const origin = this.options.origin
    origin.x = ret.tx
    origin.y = ret.ty
    this.trigger('translate', { origin })
    return this
  }

  setOrigin(ox?: number, oy?: number) {
    return this.translate(ox || 0, oy || 0)
  }

  fitToContent(
    gridWidth?: number,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: Graph.FitToContentOptions,
  ): Rectangle
  fitToContent(options?: Graph.FitToContentFullOptions): Rectangle
  fitToContent(
    gridWidth?: number | Graph.FitToContentFullOptions,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: Graph.FitToContentOptions,
  ) {
    if (typeof gridWidth === 'object') {
      const opts = gridWidth
      gridWidth = opts.gridWidth || 1 // tslint:disable-line
      gridHeight = opts.gridHeight || 1 // tslint:disable-line
      padding = opts.padding || 0 // tslint:disable-line
      options = opts // tslint:disable-line
    } else {
      gridWidth = gridWidth || 1 // tslint:disable-line
      gridHeight = gridHeight || 1 // tslint:disable-line
      padding = padding || 0 // tslint:disable-line
      if (options == null) {
        options = {} // tslint:disable-line
      }
    }

    const paddingValues = NumberExt.normalizeSides(padding)

    const area = options.contentArea
      ? Rectangle.create(options.contentArea)
      : this.getContentArea(options)

    const scale = this.getScale()
    const translate = this.getTranslation()
    const sx = scale.sx
    const sy = scale.sy

    area.x *= sx
    area.y *= sy
    area.width *= sx
    area.height *= sy

    let width =
      Math.max(Math.ceil((area.width + area.x) / gridWidth), 1) * gridWidth
    let height =
      Math.max(Math.ceil((area.height + area.y) / gridHeight), 1) * gridHeight

    let tx = 0
    let ty = 0

    if (
      (options.allowNewOrigin === 'negative' && area.x < 0) ||
      (options.allowNewOrigin === 'positive' && area.x >= 0) ||
      options.allowNewOrigin === 'any'
    ) {
      tx = Math.ceil(-area.x / gridWidth) * gridWidth
      tx += paddingValues.left
      width += tx
    }

    if (
      (options.allowNewOrigin === 'negative' && area.y < 0) ||
      (options.allowNewOrigin === 'positive' && area.y >= 0) ||
      options.allowNewOrigin === 'any'
    ) {
      ty = Math.ceil(-area.y / gridHeight) * gridHeight
      ty += paddingValues.top
      height += ty
    }

    width += paddingValues.right
    height += paddingValues.bottom

    // Make sure the resulting width and height are greater than minimum.
    width = Math.max(width, options.minWidth || 0)
    height = Math.max(height, options.minHeight || 0)

    // Make sure the resulting width and height are lesser than maximum.
    width = Math.min(width, options.maxWidth || Number.MAX_SAFE_INTEGER)
    height = Math.min(height, options.maxHeight || Number.MAX_SAFE_INTEGER)

    const size = this.getComputedSize()
    const sizeChanged = width !== size.width || height !== size.height
    const originChanged = tx !== translate.tx || ty !== translate.ty

    // Change the dimensions only if there is a size discrepency or an origin change
    if (originChanged) {
      this.translate(tx, ty)
    }

    if (sizeChanged) {
      this.resize(width, height)
    }

    return new Rectangle(-tx / sx, -ty / sy, width / sx, height / sy)
  }

  scaleContentToFit(options: Graph.ScaleContentToFitOptions = {}) {
    let contentBBox
    let contentLocalOrigin
    if (options.contentArea) {
      const contentArea = options.contentArea
      contentBBox = this.localToPaperRect(contentArea)
      contentLocalOrigin = Point.create(contentArea)
    } else {
      contentBBox = this.getContentBBox(options)
      contentLocalOrigin = this.paperToLocalPoint(contentBBox)
    }

    if (!contentBBox.width || !contentBBox.height) {
      return
    }

    const padding = options.padding || 0
    const minScale = options.minScale || 0
    const maxScale = options.maxScale || Number.MAX_SAFE_INTEGER
    const minScaleX = options.minScaleX || minScale
    const maxScaleX = options.maxScaleX || maxScale
    const minScaleY = options.minScaleY || minScale
    const maxScaleY = options.maxScaleY || maxScale

    let fittingBBox
    if (options.fittingBBox) {
      fittingBBox = options.fittingBBox
    } else {
      const computedSize = this.getComputedSize()
      const currentTranslate = this.getTranslation()
      fittingBBox = {
        x: currentTranslate.tx,
        y: currentTranslate.ty,
        width: computedSize.width,
        height: computedSize.height,
      }
    }

    fittingBBox = Rectangle.create(fittingBBox).inflate(-padding)

    const currentScale = this.getScale()

    let newSx = (fittingBBox.width / contentBBox.width) * currentScale.sx
    let newSy = (fittingBBox.height / contentBBox.height) * currentScale.sy

    if (options.preserveAspectRatio !== false) {
      newSx = newSy = Math.min(newSx, newSy)
    }

    // snap scale to a grid
    if (options.gridSize) {
      const gridSize = options.gridSize

      newSx = gridSize * Math.floor(newSx / gridSize)
      newSy = gridSize * Math.floor(newSy / gridSize)
    }

    // scale min/max boundaries
    newSx = Math.min(maxScaleX, Math.max(minScaleX, newSx))
    newSy = Math.min(maxScaleY, Math.max(minScaleY, newSy))

    const origin = this.options.origin
    const newOX = fittingBBox.x - contentLocalOrigin.x * newSx - origin.x
    const newOY = fittingBBox.y - contentLocalOrigin.y * newSy - origin.y

    this.scale(newSx, newSy)
    this.translate(newOX, newOY)
  }

  getContentArea(options: Graph.GetContentAreaOptions = {}) {
    if (options.useModelGeometry) {
      return this.model.getBBox() || new Rectangle()
    }

    return v.getBBox(this.drawPane)
  }

  getContentBBox(options: Graph.GetContentAreaOptions = {}) {
    return this.localToPaperRect(this.getContentArea(options))
  }

  getArea() {
    const rect = Rectangle.fromSize(this.getComputedSize())
    return this.paperToLocalRect(rect)
  }

  getRestrictedArea(view?: NodeView) {
    const restrictTranslate = this.options.restrictTranslate as any
    let restrictedArea: Rectangle.RectangleLike | null

    if (typeof restrictTranslate === 'function') {
      // A method returning a bounding box
      restrictedArea = restrictTranslate.apply(this, arguments)
    } else if (restrictTranslate === true) {
      // The paper area
      restrictedArea = this.getArea()
    } else {
      // Either false or a bounding box
      restrictedArea = restrictTranslate || null
    }

    return restrictedArea
  }

  // #endregion

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    if (cell == null) {
      return null
    }

    const id = cell instanceof Cell ? cell.id : cell

    return this.views[id]
  }

  findView($el: string | JQuery | Element | undefined | null) {
    if ($el == null) {
      return null
    }

    const el =
      typeof $el === 'string'
        ? this.drawPane.querySelector($el)
        : $el instanceof Element
        ? $el
        : $el[0]

    if (el) {
      const id = this.findAttr('data-id', el)
      if (id) {
        return this.views[id]
      }
    }

    return null
  }

  findViewsFromPoint(p: Point.PointLike) {
    const ref = { x: p.x, y: p.y }
    return this.model
      .getCells()
      .map(cell => this.findViewByCell(cell))
      .filter(view => {
        if (view != null) {
          return v
            .getBBox(view.container as SVGElement, { target: this.drawPane })
            .containsPoint(ref)
        }
      })
  }

  findViewsInArea(
    rect: Rectangle | Rectangle.RectangleLike,
    options: { strict?: boolean } = {},
  ) {
    const area = Rectangle.create(rect)
    return this.model
      .getNodes()
      .map(node => this.findViewByCell(node))
      .filter(view => {
        if (view) {
          const bbox = v.getBBox(view.container as SVGElement, {
            target: this.drawPane,
          })
          return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWith(bbox)
        }
      }) as CellView[]
  }

  // #region coord

  snapToGrid(p: Point | Point.PointLike): Point
  snapToGrid(x: number, y: number): Point
  snapToGrid(x: number | Point | Point.PointLike, y?: number) {
    const p =
      typeof x === 'number'
        ? this.clientToLocalPoint(x, y as number)
        : this.clientToLocalPoint(x.x, x.y)
    return p.snapToGrid(this.options.gridSize)
  }

  /**
   * Returns the current transformation matrix of the graph.
   */
  getMatrix() {
    const transform = this.viewportElem.getAttribute('transform')
    if (transform !== this.viewportTransformString) {
      // `getCTM`: top-left relative to the SVG element
      // `getScreenCTM`: top-left relative to the document
      this.viewportMatrix = this.viewportElem.getCTM()
      this.viewportTransformString = transform
    }

    // Clone the cached current transformation matrix.
    // If no matrix previously stored the identity matrix is returned.
    return v.createSVGMatrix(this.viewportMatrix)
  }

  /**
   * Sets new transformation with the given `matrix`
   */
  setMatrix(matrix: DOMMatrix | MatrixLike | null) {
    const ctm = v.createSVGMatrix(matrix)
    const transform = v.matrixToTransformString(ctm)
    this.viewportElem.setAttribute('transform', transform)
    this.viewportMatrix = ctm
    this.viewportTransformString = transform
  }

  getClientMatrix() {
    return v.createSVGMatrix(this.drawPane.getScreenCTM())
  }

  /**
   * Returns coordinates of the graph viewport, relative to the window.
   */
  getClientOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const rect = this.svgElem.getBoundingClientRect()
    return new Point(rect.left, rect.top)
  }

  /**
   * Returns coordinates of the graph viewport, relative to the document.
   */
  getPageOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    return this.getClientOffset().translate(window.scrollX, window.scrollY)
  }

  /**
   * Transform the point `p` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToPaperPoint(p: Point | Point.PointLike): Point
  localToPaperPoint(x: number, y: number): Point
  localToPaperPoint(x: number | Point | Point.PointLike, y?: number) {
    const localPoint = Point.create(x, y)
    return v.transformPoint(localPoint, this.getMatrix())
  }

  localToClientPoint(p: Point | Point.PointLike): Point
  localToClientPoint(x: number, y: number): Point
  localToClientPoint(x: number | Point | Point.PointLike, y?: number) {
    const localPoint = Point.create(x, y)
    return v.transformPoint(localPoint, this.getClientMatrix())
  }

  localToPagePoint(p: Point | Point.PointLike): Point
  localToPagePoint(x: number, y: number): Point
  localToPagePoint(x: number | Point | Point.PointLike, y?: number) {
    const p =
      typeof x === 'number'
        ? this.localToPaperPoint(x, y!)
        : this.localToPaperPoint(x)
    return p.translate(this.getPageOffset())
  }

  localToPaperRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  localToPaperRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToPaperRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    return v.transformRect(localRect, this.getMatrix())
  }

  localToClientRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  localToClientRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToClientRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    const clientRect = v.transformRect(localRect, this.getClientMatrix())
    return clientRect
  }

  localToPageRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  localToPageRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToPageRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const rect =
      typeof x === 'number'
        ? this.localToPaperRect(x, y!, width!, height!)
        : this.localToPaperRect(x)
    return rect.translate(this.getPageOffset())
  }

  paperToLocalPoint(p: Point | Point.PointLike): Point
  paperToLocalPoint(x: number, y: number): Point
  paperToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const paperPoint = Point.create(x, y)
    return v.transformPoint(paperPoint, this.getMatrix().inverse())
  }

  clientToLocalPoint(p: Point | Point.PointLike): Point
  clientToLocalPoint(x: number, y: number): Point
  clientToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const clientPoint = Point.create(x, y)
    return v.transformPoint(clientPoint, this.getClientMatrix().inverse())
  }

  pageToLocalPoint(p: Point | Point.PointLike): Point
  pageToLocalPoint(x: number, y: number): Point
  pageToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const pagePoint = Point.create(x, y)
    const paperPoint = pagePoint.diff(this.getPageOffset())
    return this.paperToLocalPoint(paperPoint)
  }

  paperToLocalRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  paperToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  paperToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const paperRect = Rectangle.create(x, y, width, height)
    return v.transformRect(paperRect, this.getMatrix().inverse())
  }

  clientToLocalRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  clientToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  clientToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const clientRect = Rectangle.create(x, y, width, height)
    return v.transformRect(clientRect, this.getClientMatrix().inverse())
  }

  pageToLocalRect(rect: Rectangle | Rectangle.RectangleLike): Rectangle
  pageToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  pageToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const paperRect = Rectangle.create(x, y, width, height)
    const pageOffset = this.getPageOffset()
    paperRect.x -= pageOffset.x
    paperRect.y -= pageOffset.y
    return this.paperToLocalRect(paperRect)
  }

  // #endregion

  // #region grid

  protected grid: Grid | null
  protected gridSettings: Grid.Definition[] = []

  clearGrid() {
    this.gridElem.style.backgroundImage = ''
    return this
  }

  setGridSize(gridSize: number) {
    this.options.gridSize = gridSize
    this.drawGrid()
    return this
  }

  setGrid(
    patterns?:
      | boolean
      | string
      | Grid.Options
      | Grid.Options[]
      | Grid.NativeItem
      | Grid.ManaualItem,
  ) {
    this.clearGrid()
    this.grid = null
    this.gridSettings = this.resolveGrid(patterns)
    return this
  }

  drawGrid() {
    if (this.options.drawGrid) {
      this.updateGrid()
    }
  }

  protected getGridCache() {
    if (!this.grid) {
      this.grid = new Grid()
    }

    return this.grid
  }

  protected resolveGrid(
    patterns?:
      | boolean
      | string
      | Grid.Options
      | Grid.Options[]
      | Grid.NativeItem
      | Grid.ManaualItem,
  ): Grid.Definition[] | never {
    if (!patterns) {
      return []
    }

    if (typeof patterns === 'string') {
      const items = GridRegistry.get(patterns)
      if (items) {
        return Array.isArray(items)
          ? items.map(item => ({ ...item }))
          : [{ ...items }]
      }

      return GridRegistry.onNotFound(patterns)
    }

    if (patterns === true) {
      return [{ ...Grid.presets.dot }]
    }

    const name = (patterns as Grid.NativeItem).name
    if (name == null) {
      const options = (Array.isArray(patterns)
        ? patterns[0]
        : patterns) as Grid.Options
      return [
        {
          ...Grid.presets.dot,
          ...options,
        },
      ]
    }

    const items = GridRegistry.get(name)
    if (items) {
      const args = (patterns as Grid.NativeItem).args || []
      const params = Array.isArray(args) ? args : args ? [args] : []
      return Array.isArray(items)
        ? items.map((item, index) => ({ ...item, ...params[index] }))
        : [{ ...items, ...params[0] }]
    }

    return GridRegistry.onNotFound(name)
  }

  protected updateGrid(
    options: Partial<Grid.Options> | Partial<Grid.Options>[] = {},
  ) {
    const gridSize = this.options.gridSize
    if (gridSize <= 1) {
      return this.clearGrid()
    }

    const ctm = this.getMatrix()
    const grid = this.getGridCache()
    const optionItems = Array.isArray(options) ? options : [options]

    this.gridSettings.forEach((settings, index) => {
      const id = `pattern_${index}`
      const sx = ctm.a || 1
      const sy = ctm.d || 1

      const { update, markup, ...others } = settings
      const options = {
        ...others,
        ...optionItems[index],
        sx,
        sy,
        ox: ctm.e || 0,
        oy: ctm.f || 0,
        width: gridSize * sx,
        height: gridSize * sy,
      }

      if (!grid.has(id)) {
        grid.add(
          id,
          v.create(
            'pattern',
            { id, patternUnits: 'userSpaceOnUse' },
            v.create(markup),
          ).node,
        )
      }

      const patternElem = grid.get(id)

      if (typeof update === 'function') {
        update(patternElem.childNodes[0] as Element, options)
      }

      let x = options.ox % options.width
      if (x < 0) {
        x += options.width
      }

      let y = options.oy % options.height
      if (y < 0) {
        y += options.height
      }

      v.attr(patternElem, {
        x,
        y,
        width: options.width,
        height: options.height,
      })
    })

    const base64 = new XMLSerializer().serializeToString(grid.root)
    const url = `url(data:image/svg+xml;base64,${btoa(base64)})`
    this.gridElem.style.backgroundImage = url
    return this
  }

  // #endregion

  // #region background

  protected backgroundOptions: Graph.BackgroundOptions | null
  protected updateBackgroundImage(options: Graph.BackgroundOptions = {}) {
    let backgroundSize = options.size || 'auto auto'
    let backgroundPosition = options.position || 'center'

    const scale = this.getScale()
    const ts = this.getTranslation()

    // backgroundPosition
    if (typeof backgroundPosition === 'object') {
      const x = ts.tx + scale.sx * (backgroundPosition.x || 0)
      const y = ts.ty + scale.sy * (backgroundPosition.y || 0)
      backgroundPosition = `${x}px ${y}px`
    }

    // backgroundSize
    if (typeof backgroundSize === 'object') {
      backgroundSize = Rectangle.fromSize(backgroundSize).scale(
        scale.sx,
        scale.sy,
      )
      backgroundSize = `${backgroundSize.width}px ${backgroundSize.height}px`
    }

    this.$(this.backgroundElem).css({
      backgroundSize,
      backgroundPosition,
    })
  }

  protected drawBackgroundImage(
    img?: HTMLImageElement | null,
    options: Graph.BackgroundOptions = {},
  ) {
    if (!(img instanceof HTMLImageElement)) {
      this.$(this.backgroundElem).css('backgroundImage', '')
      return
    }

    let uri
    const opacity = options.opacity || 1
    const backgroundSize = options.size
    let backgroundRepeat = options.repeat || 'no-repeat'

    const pattern = BackgroundRegistry.get(backgroundRepeat)
    if (typeof pattern === 'function') {
      const quality = (options as Background.ManaualItem).quality || 1
      img.width *= quality
      img.height *= quality
      const canvas = pattern(img, options)
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(
          'Background pattern must return an HTML Canvas instance',
        )
      }

      uri = canvas.toDataURL('image/png')

      // `repeat` was changed in pattern function
      if (options.repeat && backgroundRepeat !== options.repeat) {
        backgroundRepeat = options.repeat
      } else {
        backgroundRepeat = 'repeat'
      }

      if (typeof backgroundSize === 'object') {
        // recalculate the tile size if an object passed in
        backgroundSize.width *= canvas.width / img.width
        backgroundSize.height *= canvas.height / img.height
      } else if (backgroundSize === undefined) {
        // calcule the tile size if no provided
        options.size = {
          width: canvas.width / quality,
          height: canvas.height / quality,
        }
      }
    } else {
      uri = img.src
      if (backgroundSize === undefined) {
        options.size = {
          width: img.width,
          height: img.height,
        }
      }
    }

    this.$(this.backgroundElem).css({
      opacity,
      backgroundRepeat,
      backgroundImage: `url(${uri})`,
    })

    this.updateBackgroundImage(options)
  }

  protected updateBackgroundColor(color?: string | null) {
    this.$(this.container).css('backgroundColor', color || '')
  }

  drawBackground(options: Graph.BackgroundOptions = {}) {
    this.updateBackgroundColor(options.color)

    if (options.image) {
      const img = document.createElement('img')
      img.onload = () => this.drawBackgroundImage(img, options)
      img.setAttribute('crossorigin', 'anonymous')
      img.src = options.image
      this.backgroundOptions = ObjectExt.clone(
        options,
      ) as Graph.BackgroundOptions
    } else {
      this.drawBackgroundImage(null)
      this.backgroundOptions = null
    }

    return this
  }

  // #endregion

  // #region defs

  protected isDefined(defId: string) {
    return this.svgElem.getElementById(defId) != null
  }

  defineFilter(filter: any) {
    let filterId = filter.id
    const name = filter.name
    if (!filterId) {
      filterId =
        name + this.svgElem.id + StringExt.hashcode(JSON.stringify(filter))
    }

    // if (!this.isDefined(filterId)) {
    //   const namespace = _filter
    //   const markup = namespace[name] && namespace[name](filter.args || {})
    //   if (!markup) {
    //     throw new Error('Non-existing filter ' + name)
    //   }

    //   // Set the filter area to be 3x the bounding box of the cell
    //   // and center the filter around the cell.
    //   const filterAttrs = {
    //     x: -1,
    //     y: -1,
    //     width: 3,
    //     height: 3,
    //     filterUnits: 'objectBoundingBox',
    //     ...filter.attrs,
    //     id: filterId,
    //   }

    //   v.create(markup, filterAttrs).appendTo(this.defsElem)
    // }

    return filterId
  }

  defineGradient(gradient: Graph.CreateGradientOptions) {
    let id = gradient.id
    const type = gradient.type
    if (!id) {
      id = type + this.svgElem.id + StringExt.hashcode(JSON.stringify(gradient))
    }

    if (!this.isDefined(id)) {
      const stops = gradient.stops
      const arr = stops.map(stop => {
        const opacity =
          stop.opacity != null && Number.isFinite(stop.opacity)
            ? stop.opacity
            : 1

        return `<stop offset="${stop.offset}" stop-color="${stop.color}" stop-opacity="${opacity}"/>`
      })

      const markup = `<${type}>${arr.join('')}</${type}>`
      const attrs = { id, ...gradient.attrs }
      v.create(markup, attrs).appendTo(this.defsElem)
    }

    return id
  }

  defineMarker(marker: Graph.CreateMarkerOptions & Attr.SimpleAttrs) {
    let markerId = marker.id
    if (!markerId) {
      markerId = `m-${StringExt.hashcode(JSON.stringify(marker))}`
    }

    if (!this.isDefined(markerId)) {
      const { id, type, markerUnits, ...attrs } = marker
      const pathMarker = v.create(
        'marker',
        {
          id: markerId,
          orient: 'auto',
          overflow: 'visible',
          markerUnits: markerUnits || 'userSpaceOnUse',
        },
        [v.create(type || 'path', attrs as any)],
      )

      this.defsElem.appendChild(pathMarker.node)
    }

    return markerId
  }

  // #endregion

  linkAllowed(linkView: EdgeView) {
    // const edge = linkView.cell
    // const model = this.model
    // const paperOptions = this.options
    // const ns = model.constructor.validations

    // if (!paperOptions.multiLinks) {
    //   if (!ns.multiLinks.call(this, model, edge)) return false
    // }

    // if (!paperOptions.linkPinning) {
    //   // Link pinning is not allowed and the link is not connected to the target.
    //   if (!ns.linkPinning.call(this, model, edge)) return false
    // }

    // if (typeof paperOptions.allowLink === 'function') {
    //   if (!paperOptions.allowLink.call(this, linkView, this)) return false
    // }

    return true
  }

  getDefaultEdge(cellView: CellView, magnet: Element) {
    return new Edge()
    // return isFunction(this.options.defaultLink)
    //   ? // default link is a function producing link model
    //     this.options.defaultLink.call(this, cellView, magnet)
    //   : // default link is the Backbone model
    //     this.options.defaultLink.clone()
  }

  // #region highlighting

  protected resolveHighlighter(options: CellView.HighlightOptions) {
    let highlighterDef = options.highlighter
    const graphOptions = this.options
    if (highlighterDef == null) {
      // check for built-in types
      const type = [
        'embedding',
        'connecting',
        'nodeAvailability',
        'magnetAvailability',
      ].find(type => !!(options as any)[type])

      highlighterDef =
        (type && (graphOptions.highlighting as any)[type]) ||
        graphOptions.highlighting.default
    }

    if (highlighterDef == null) {
      return null
    }

    const def: Highlighter.ManaualItem =
      typeof highlighterDef === 'string'
        ? {
            name: highlighterDef,
          }
        : highlighterDef

    const name = def.name
    const highlighter = HighlighterRegistry.get(name)
    if (highlighter == null) {
      return HighlighterRegistry.onNotFound(name)
    }

    Highlighter.check(name, highlighter)

    return {
      name,
      highlighter,
      args: def.args || {},
    }
  }

  protected onCellHighlight(
    cellView: CellView,
    magnet: Element,
    options: CellView.HighlightOptions = {},
  ) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    v.ensureId(magnet)
    const key = resolved.name + magnet.id + JSON.stringify(resolved.args)
    if (!this.highlights[key]) {
      const highlighter = resolved.highlighter
      highlighter.highlight(cellView, magnet, { ...resolved.args })

      this.highlights[key] = {
        cellView,
        magnet,
        highlighter,
        args: resolved.args,
      }
    }
  }

  protected onCellUnhighlight(
    cellView: CellView,
    magnet: Element,
    options: CellView.HighlightOptions = {},
  ) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    v.ensureId(magnet)
    const key = resolved.name + magnet.id + JSON.stringify(resolved.args)
    const highlight = this.highlights[key]
    if (highlight) {
      // Use the cellView and magnetEl that were used by the highlighter.highlight() method.
      highlight.highlighter.unhighlight(
        highlight.cellView,
        highlight.magnet,
        highlight.args,
      )

      delete this.highlights[key]
    }
  }

  // #endregion

  // #region tools

  removeTools() {
    this.trigger('tools:remove')
    return this
  }

  hideTools() {
    this.trigger('tools:hide')
    return this
  }

  showTools() {
    this.trigger('tools:show')
    return this
  }

  // #endregion

  // #region events

  /**
   * Guard the specified event. If the event is not interesting, it
   * returns `true`, otherwise returns `false`.
   */
  guard(e: JQuery.TriggeredEvent, view?: CellView | null) {
    // handled as `contextmenu` type
    if (e.type === 'mousedown' && e.button === 2) {
      return true
    }

    if (this.options.guard && this.options.guard(e, view)) {
      return true
    }

    if (e.data && e.data.guarded !== undefined) {
      return e.data.guarded
    }

    if (view && view.cell && view.cell instanceof Cell) {
      return false
    }

    if (
      this.svgElem === e.target ||
      this.container === e.target ||
      JQuery.contains(this.svgElem, e.target)
    ) {
      return false
    }

    return true
  }

  protected onDblClick(e: JQuery.DoubleClickEvent) {
    e.preventDefault()
    e = this.normalizeEvent(e) // tslint:disable-line

    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const localPoint = this.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onDblClick(e, localPoint.x, localPoint.y)
    } else {
      this.trigger('blank:dblclick', { e, x: localPoint.x, y: localPoint.y })
    }
  }

  protected onClick(e: JQuery.ClickEvent) {
    if (this.getMouseMovedCount(e) <= this.options.clickThreshold) {
      e = this.normalizeEvent(e) // tslint:disable-line
      const view = this.findView(e.target)
      if (this.guard(e, view)) {
        return
      }

      const localPoint = this.snapToGrid(e.clientX, e.clientY)
      if (view) {
        view.onClick(e, localPoint.x, localPoint.y)
      } else {
        this.trigger('blank:click', { e, x: localPoint.x, y: localPoint.y })
      }
    }
  }

  protected onContextMenu(e: JQuery.ContextMenuEvent) {
    if (this.options.preventContextMenu) {
      e.preventDefault()
    }

    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const localPoint = this.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onContextMenu(e, localPoint.x, localPoint.y)
    } else {
      this.trigger('blank:contextmenu', { e, x: localPoint.x, y: localPoint.y })
    }
  }

  delegateDragEvents(e: JQuery.MouseDownEvent, view: CellView | null) {
    if (e.data == null) {
      e.data = {}
    }
    this.setEventData<EventData.Moving>(e, {
      currentView: view || null,
      mouseMovedCount: 0,
    })
    const ctor = this.constructor as typeof Graph
    this.delegateDocumentEvents(ctor.documentEvents, e.data)
    this.undelegateEvents()
  }

  getMouseMovedCount(e: JQuery.TriggeredEvent) {
    const data = this.getEventData<EventData.Moving>(e)
    return data.mouseMovedCount || 0
  }

  protected onMouseDown(e: JQuery.MouseDownEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const localPoint = this.snapToGrid(e.clientX, e.clientY)

    if (view) {
      e.preventDefault()
      view.onMouseDown(e, localPoint.x, localPoint.y)
    } else {
      if (this.options.preventDefaultBlankAction) {
        e.preventDefault()
      }

      this.trigger('blank:mousedown', { e, x: localPoint.x, y: localPoint.y })
    }

    this.delegateDragEvents(e, view)
  }

  protected onMouseMove(e: JQuery.MouseMoveEvent) {
    const data = this.getEventData<EventData.Moving>(e)
    if (data.mouseMovedCount == null) {
      data.mouseMovedCount = 0
    }
    data.mouseMovedCount += 1
    const mouseMovedCount = data.mouseMovedCount
    if (mouseMovedCount <= this.options.moveThreshold) {
      return
    }

    e = this.normalizeEvent(e) // tslint:disable-line
    const localPoint = this.snapToGrid(e.clientX, e.clientY)

    const view = data.currentView
    if (view) {
      view.onMouseMove(e, localPoint.x, localPoint.y)
    } else {
      this.trigger('blank:mousemove', { e, x: localPoint.x, y: localPoint.y })
    }

    this.setEventData(e, data)
  }

  protected onMouseUp(e: JQuery.MouseUpEvent) {
    this.undelegateDocumentEvents()

    const normalized = this.normalizeEvent(e)
    const localPoint = this.snapToGrid(normalized.clientX, normalized.clientY)
    const data = this.getEventData<EventData.Moving>(e)
    const view = data.currentView
    if (view) {
      view.onMouseUp(normalized, localPoint.x, localPoint.y)
    } else {
      this.trigger('blank:mouseup', {
        e: normalized,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    if (!e.isPropagationStopped()) {
      this.onClick(
        JQuery.Event(e as any, {
          type: 'click',
          data: e.data,
        }) as JQuery.ClickEvent,
      )
    }

    e.stopImmediatePropagation()

    this.delegateEvents()
  }

  protected onMouseOver(e: JQuery.MouseOverEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    if (view) {
      view.onMouseOver(e)
    } else {
      // prevent border of paper from triggering this
      if (this.container === e.target) {
        return
      }
      this.trigger('blank:mouseover', { e })
    }
  }

  protected onMouseOut(e: JQuery.MouseOutEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    if (view) {
      view.onMouseOut(e)
    } else {
      if (this.container === e.target) {
        return
      }
      this.trigger('blank:mouseout', { e })
    }
  }

  protected onMouseEnter(e: JQuery.MouseEnterEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const relatedView = this.findView(e.relatedTarget as Element)
    if (view) {
      // mouse moved from tool over view?
      if (relatedView === view) {
        return
      }
      view.onMouseEnter(e)
    } else {
      if (relatedView) {
        return
      }
      this.trigger('graph:mouseenter', { e })
    }
  }

  protected onMouseLeave(e: JQuery.MouseLeaveEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }
    const relatedView = this.findView(e.relatedTarget as Element)
    if (view) {
      // mouse moved from view over tool?
      if (relatedView === view) {
        return
      }
      view.onMouseLeave(e)
    } else {
      if (relatedView) {
        return
      }
      this.trigger('graph:mouseleave', { e })
    }
  }

  protected onMouseWheel(e: JQuery.TriggeredEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const originalEvent = e.originalEvent as MouseWheelEvent
    const localPoint = this.snapToGrid(
      originalEvent.clientX,
      originalEvent.clientY,
    )
    const delta = Math.max(
      -1,
      Math.min(1, (originalEvent as any).wheelDelta || -originalEvent.detail),
    )

    if (view) {
      view.onMouseWheel(e, localPoint.x, localPoint.y, delta)
    } else {
      this.trigger('blank:mousewheel', {
        e,
        delta,
        x: localPoint.x,
        y: localPoint.y,
      })
    }
  }

  protected onCustomEvent(e: JQuery.MouseDownEvent) {
    const eventNode = e.currentTarget
    const eventName = eventNode.getAttribute('event')
    if (eventName) {
      const view = this.findView(eventNode)
      if (view) {
        e = this.normalizeEvent(e) // tslint:disable-line
        if (this.guard(e, view)) {
          return
        }

        const localPoint = this.snapToGrid(
          e.clientX as number,
          e.clientY as number,
        )
        view.onCustomEvent(e, eventName, localPoint.x, localPoint.y)
      }
    }
  }

  protected handleMagnetEvent<T extends JQuery.TriggeredEvent>(
    e: T,
    handler: (
      this: Graph,
      view: CellView,
      e: T,
      magnet: Element,
      x: number,
      y: number,
    ) => void,
  ) {
    const magnetElem = e.currentTarget
    const magnetValue = magnetElem.getAttribute('magnet')
    if (magnetValue) {
      const view = this.findView(magnetElem)
      if (view) {
        e = this.normalizeEvent(e) // tslint:disable-line
        if (this.guard(e, view)) {
          return
        }
        const localPoint = this.snapToGrid(
          e.clientX as number,
          e.clientY as number,
        )
        handler.call(this, view, e, magnetElem, localPoint.x, localPoint.y)
      }
    }
  }

  protected onMagnetMouseDown(e: JQuery.MouseDownEvent) {
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetMouseDown(e, magnet, x, y)
    })
  }

  protected onMagnetDblClick(e: JQuery.DoubleClickEvent) {
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetDblClick(e, magnet, x, y)
    })
  }

  protected onMagnetContextMenu(e: JQuery.ContextMenuEvent) {
    if (this.options.preventContextMenu) {
      e.preventDefault()
    }
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetContextMenu(e, magnet, x, y)
    })
  }

  protected onLabelMouseDown(e: JQuery.MouseDownEvent) {
    const labelNode = e.currentTarget
    const view = this.findView(labelNode)
    if (view) {
      e = this.normalizeEvent(e) // tslint:disable-line
      if (this.guard(e, view)) {
        return
      }

      const localPoint = this.snapToGrid(e.clientX, e.clientY)
      view.onLabelMouseDown(e, localPoint.x, localPoint.y)
    }
  }

  protected onImageDragStart() {
    // This is the only way to prevent image dragging in Firefox that works.
    // Setting -moz-user-select: none, draggable="false" attribute or
    // user-drag: none didn't help.
    return false
  }

  // #endregion
}

export namespace Graph {
  export interface Options {
    container: HTMLDivElement
  }

  export interface CreateMarkerOptions {
    id?: string
    type?: string
    markerUnits?: string
  }

  export interface CreateGradientOptions {
    id?: string
    type: string
    stops: {
      offset: number
      color: string
      opacity?: number
    }[]
    attrs?: Attr.SimpleAttrs
  }

  export interface CreateFilterOptions {
    id?: string
    name: string
  }
}

export namespace Graph {
  export interface Updates {
    priorities: KeyValue<number>[]
    mounted: KeyValue<boolean>
    unmounted: KeyValue<number>
    mountedCids: string[]
    unmountedCids: string[]
    animationId: number | null
    count: number
    sort: boolean

    /**
     * The last frozen state of graph.
     */
    frozen: boolean
    /**
     * The current freeze key of graph.
     */
    freezeKey: string | null
  }

  export type CheckViewportFn = (
    this: Graph,
    view: CellView,
    isDetached: boolean,
    graph: Graph,
  ) => boolean

  export interface CheckViewportOptions {
    /**
     * Callback function to determine whether a given view
     * should be added to the DOM.
     */
    viewport?: CheckViewportFn
  }

  export interface UpdateViewOptions extends CheckViewportOptions {
    /**
     * For async graph, how many views should there be per
     * one asynchronous process?
     */
    batchSize?: number
  }

  export interface RequestViewUpdateOptions
    extends UpdateViewOptions,
      Cell.SetOptions {
    async?: boolean
  }

  export interface UpdateViewsAsyncOptions extends UpdateViewOptions {
    before?: (this: Graph, graph: Graph) => void
    /**
     * Callback function that is called whenever a batch is
     * finished processing.
     */
    progress?: (
      this: Graph,
      done: boolean,
      processed: number,
      total: number,
    ) => void
  }

  export interface FreezeOptions {
    key?: string
  }

  export interface UnfreezeOptions
    extends FreezeOptions,
      UpdateViewsAsyncOptions {}

  export type BackgroundOptions =
    | Background.Options
    | Background.NativeItem
    | Background.ManaualItem
}

export namespace Graph {
  export const markup: Markup.JSONMarkup[] = [
    {
      ns: v.ns.xhtml,
      tagName: 'div',
      className: 'x6-graph-background',
      selector: 'background',
    },
    {
      ns: v.ns.xhtml,
      tagName: 'div',
      className: 'x6-graph-grid',
      selector: 'grid',
    },
    {
      ns: v.ns.svg,
      tagName: 'svg',
      selector: 'svg',
      className: 'x6-graph-svg',
      attrs: {
        width: '100%',
        height: '100%',
        'xmlns:xlink': v.ns.xlink,
      },
      children: [
        {
          tagName: 'defs',
          selector: 'defs',
        },
        {
          tagName: 'g',
          className: 'x6-graph-stage',
          selector: 'viewport',
          children: [
            {
              tagName: 'g',
              className: 'x6-graph-background-pane',
            },
            {
              tagName: 'g',
              className: 'x6-graph-draw-pane viewport',
              selector: 'drawPane',
            },
            {
              tagName: 'g',
              className: 'x6-graph-decorator-pane',
              selector: 'tools',
            },
            {
              tagName: 'g',
              className: 'x6-graph-overlay-pane',
            },
          ],
        },
      ],
    },
  ]
}

export namespace Graph {
  const prefixCls = Globals.prefixCls
  export const events = {
    dblclick: 'onDblClick',
    contextmenu: 'onContextMenu',
    touchstart: 'onMouseDown',
    mousedown: 'onMouseDown',
    mouseover: 'onMouseOver',
    mouseout: 'onMouseOut',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
    mousewheel: 'onMouseWheel',
    DOMMouseScroll: 'onMouseWheel',
    [`mouseenter  .${prefixCls}-tools`]: 'onMouseEnter',
    [`mouseleave  .${prefixCls}-tools`]: 'onMouseLeave',
    [`mouseenter  .${prefixCls}-cell`]: 'onMouseEnter',
    [`mouseleave  .${prefixCls}-cell`]: 'onMouseLeave',
    [`mousedown   .${prefixCls}-cell [event]`]: 'onCustomEvent',
    [`touchstart  .${prefixCls}-cell [event]`]: 'onCustomEvent',
    [`dblclick    .${prefixCls}-cell [magnet]`]: 'onMagnetDblClick',
    [`contextmenu .${prefixCls}-cell [magnet]`]: 'onMagnetContextMenu',
    [`mousedown   .${prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`touchstart  .${prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`dragstart   .${prefixCls}-cell image`]: 'onImageDragStart',
    [`mousedown   .${prefixCls}-edge .label`]: 'onLabelMouseDown',
    [`touchstart  .${prefixCls}-edge .label`]: 'onLabelMouseDown',
  }

  export const documentEvents = {
    mousemove: 'onMouseMove',
    touchmove: 'onMouseMove',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
    touchcancel: 'onMouseUp',
  }
}

export namespace Graph {
  interface CommonEventArgs<E> {
    e: E
  }

  interface PositionEventArgs<E> extends CommonEventArgs<E> {
    x: number
    y: number
  }

  export interface EventArgs
    extends Omit<Model.EventArgs, 'sorted' | 'updated' | 'reseted'>,
      CellView.EventArgs {
    'model:sorted'?: Model.EventArgs['sorted']
    'model:updated': Model.EventArgs['updated']
    'model:reseted': Model.EventArgs['reseted']

    'blank:click': PositionEventArgs<JQuery.ClickEvent>
    'blank:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>
    'blank:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>
    'blank:mousedown': PositionEventArgs<JQuery.MouseDownEvent>
    'blank:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>
    'blank:mouseup': PositionEventArgs<JQuery.MouseUpEvent>
    'blank:mouseout': CommonEventArgs<JQuery.MouseOutEvent>
    'blank:mouseover': CommonEventArgs<JQuery.MouseOverEvent>
    'graph:mouseenter': CommonEventArgs<JQuery.MouseEnterEvent>
    'graph:mouseleave': CommonEventArgs<JQuery.MouseLeaveEvent>
    'blank:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> & {
      delta: number
    }
    'tools:event': { name: string }
    'tools:remove'?: null
    'tools:hide'?: null
    'tools:show'?: null
    'render:done': {
      stats: {
        priority: number
        updatedCount: number
      }
      options: UpdateViewsAsyncOptions
    }
    translate: { origin: Point.PointLike }
    scale: { sx: number; sy: number; ox: number; oy: number }
    resize: { width: number; height: number }
  }
}

export namespace Graph {
  export interface FitToContentOptions extends GetContentAreaOptions {
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    contentArea?: Rectangle | Rectangle.RectangleLike
    allowNewOrigin?: 'negative' | 'positive' | 'any'
  }

  export interface FitToContentFullOptions extends FitToContentOptions {
    gridWidth?: number
    gridHeight?: number
    padding?: NumberExt.SideOptions
  }

  export interface ScaleContentToFitOptions extends GetContentAreaOptions {
    contentArea?: Rectangle | Rectangle.RectangleLike
    padding?: number
    minScale?: number
    maxScale?: number
    minScaleX?: number
    minScaleY?: number
    maxScaleX?: number
    maxScaleY?: number
    fittingBBox?: Rectangle | Rectangle.RectangleLike
    preserveAspectRatio?: boolean
    gridSize?: number
  }

  export interface GetContentAreaOptions {
    useModelGeometry?: boolean
  }

  export interface HighlightCacheItem {
    highlighter: Highlighter.Definition<KeyValue>
    cellView: CellView
    magnet: Element
    args: KeyValue
  }
}

namespace EventData {
  export interface Moving {
    mouseMovedCount?: number
    currentView?: CellView | null
  }
}
