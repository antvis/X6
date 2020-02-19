import { StringExt } from '../../util'
import { Point, Rectangle } from '../../geometry'
import { DomUtil } from '../../dom'
import { v, Attributes, MatrixLike } from '../../v'
import { Model } from './model'
import { BaseView } from './base-view'
import { CellView } from './cell-view'
import { Cell } from './cell'
import { NodeView } from './node-view'

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

export class Graph extends BaseView {
  options = {
    width: 800,
    height: 600,
    origin: { x: 0, y: 0 },
    gridSize: 1,

    // Whether or not to draw the grid lines on the paper's DOM element.
    // e.g drawGrid: true, drawGrid: { color: 'red', thickness: 2 }
    drawGrid: false,

    // Whether or not to draw the background on the paper's DOM element.
    // e.g. background: { color: 'lightblue', image: '/paper-background.png', repeat: 'flip-xy' }
    background: false,

    perpendicularLinks: false,
    elementView: CellView,
    // linkView: LinkView,
    snapLinks: false, // false, true, { radius: value }

    // When set to FALSE, an element may not have more than 1 link with the same source and target element.
    multiLinks: true,

    // For adding custom guard logic.
    guard() {
      // FALSE means the event isn't guarded.
      return false
    },

    highlighting: {
      default: {
        name: 'stroke',
        options: {
          padding: 3,
        },
      },
      magnetAvailability: {
        name: 'addClass',
        options: {
          className: 'available-magnet',
        },
      },
      elementAvailability: {
        name: 'addClass',
        options: {
          className: 'available-cell',
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

    // Marks all available magnets with 'available-magnet' class name and all available cells with
    // 'available-cell' class name. Marks them when dragging a link is started and unmark
    // when the dragging is stopped.
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

    defaultConnectionPoint: { name: 'bbox' },

    /* CONNECTING */

    connectionStrategy: null,

    // Check whether to add a new link to the graph when user clicks on an a magnet.
    // validateMagnet(_cellView, magnet, _evt) {
    //   return magnet.getAttribute('magnet') !== 'passive'
    // },

    // Check whether to allow or disallow the link connection while an arrowhead end (source/target)
    // being changed.
    // validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    //   return (end === 'target' ? cellViewT : cellViewS) instanceof ElementView
    // },

    /* EMBEDDING */

    // Enables embedding. Re-parent the dragged element with elements under it and makes sure that
    // all links and elements are visible taken the level of embedding into account.
    embeddingMode: false,

    // Check whether to allow or disallow the element embedding while an element being translated.
    // validateEmbedding(childView, parentView) {
    //   // by default all elements can be in relation child-parent
    //   return true
    // },

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

    // Number of required mousemove events before the a link is created out of the magnet.
    // Or string `onleave` so the link is created when the pointer leaves the magnet
    magnetThreshold: 0,

    // Rendering Options

    sorting: sortingTypes.EXACT,

    async: false,
    frozen: false,

    onViewUpdate(view: CellView, flag: number, opt: any, graph: Graph) {
      if (flag & FLAG_INSERT || opt.mounting) {
        return
      }
      // graph.requestConnectedLinksUpdate(view, opt)
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

    cellViewNamespace: null,

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

  // _highlights: any
  zPivots: any
  updates: any
  views: { [cellId: string]: any } = {}

  SORT_DELAYING_BATCHES = ['add', 'to-front', 'to-back']
  UPDATE_DELAYING_BATCHES = ['translate']
  MIN_SCALE = 1e-6

  constructor(options: Graph.Options) {
    super()
    this.container = options.container
    const { selectors, fragment } = Graph.parseJSONMarkup(Graph.markup, {
      bare: true,
    })
    this.backgroundElem = selectors.background as HTMLDivElement
    this.gridElem = selectors.grid as HTMLDivElement
    this.svgElem = selectors.svg as SVGSVGElement
    this.defsElem = selectors.defs as SVGDefsElement
    this.viewportElem = selectors.viewport as SVGGElement
    this.drawPane = selectors.drawPane as SVGGElement
    this.container.appendChild(fragment)
    this.model = new Model()
    this.resetUpdates()
    this.startListening()
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
    return (this.updates = {
      id: null, // animation frame id
      priorities: [{}, {}, {}],

      mounted: {},
      mountedCids: [],

      unmounted: {},
      unmountedCids: [],

      count: 0,
      keyFrozen: false,
      freezeKey: null,
      sort: false,
    })
  }

  startListening() {
    const model = this.model
    const collection = model.cells

    collection.on('add', ({ cell, options }) => {
      console.log('cell added')
      this.onCellAdded(cell as any, options)
    })

    // collection.on('remove', this.onCellRemoved, this)
    // collection.on('reset', this.onGraphReset, this)
    collection.on('sort', () => this.onGraphSort)

    model.on('batch:stop', this.onGraphBatchStop, this)

    // this.listenTo(model, 'add', this.onCellAdded)
    //   .listenTo(model, 'remove', this.onCellRemoved)
    //   .listenTo(model, 'change', this.onCellChange)
    //   .listenTo(model, 'reset', this.onGraphReset)
    //   .listenTo(model, 'sort', this.onGraphSort)
    //   .listenTo(model, 'batch:stop', this.onGraphBatchStop)

    // this.on('cell:highlight', this.onCellHighlight)
    //   .on('cell:unhighlight', this.onCellUnhighlight)
    //   .on('scale translate', this.update)
  }

  onCellAdded(cell: Cell, opt: any) {
    const position = opt.position
    if (this.isAsync() || typeof position !== 'number') {
      this.renderView(cell, opt)
    } else {
      if (opt.maxPosition === position) this.freeze({ key: 'addCells' })
      this.renderView(cell, opt)
      if (position === 0) this.unfreeze({ key: 'addCells' })
    }
  }

  // onCellRemoved(cell, _, opt) {
  //   const view = this.findViewByModel(cell)
  //   if (view) {
  //     this.requestViewUpdate(view, FLAG_REMOVE, view.UPDATE_PRIORITY, opt)
  //   }
  // }

  // onCellChange(cell, opt) {
  //   if (cell === this.model.attributes.cells) return
  //   if (cell.hasChanged('z') && this.options.sorting === sortingTypes.APPROX) {
  //     const view = this.findViewByModel(cell)
  //     if (view) {
  //       this.requestViewUpdate(view, FLAG_INSERT, view.UPDATE_PRIORITY, opt)
  //     }
  //   }
  // }

  // onGraphReset(collection, opt) {
  //   this.removeZPivots()
  //   this.resetViews(collection.models, opt)
  // }

  onGraphSort() {
    if (this.model.hasActiveBatch(this.SORT_DELAYING_BATCHES)) {
      return
    }

    this.sortViews()
  }

  onGraphBatchStop(data: any) {
    if (this.isFrozen()) {
      return
    }

    const name = data && data.batchName
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

  requestConnectedLinksUpdate(view: CellView, opt: any = {}) {
    // if (view instanceof CellView) {
    //   const model = view.model
    //   const links = this.model.getConnectedLinks(model)
    //   for (let j = 0, n = links.length; j < n; j += 1) {
    //     const link = links[j]
    //     const linkView = this.findViewByModel(link)
    //     if (!linkView) continue
    //     const flagLabels = ['UPDATE']
    //     if (link.getTargetCell() === model) flagLabels.push('TARGET')
    //     if (link.getSourceCell() === model) flagLabels.push('SOURCE')
    //     this.scheduleViewUpdate(
    //       linkView,
    //       linkView.getFlag(flagLabels),
    //       linkView.UPDATE_PRIORITY,
    //       opt,
    //     )
    //   }
    // }
  }

  forcePostponedViewUpdate(view: CellView, flag: number) {
    if (!view || !(view instanceof CellView)) {
      return false
    }

    const cell = view.cell
    if (cell.isNode()) {
      return false
    }

    // if ((flag & view.getFlag(['SOURCE', 'TARGET'])) === 0) {
    //   // LinkView is waiting for the target or the source cellView to be rendered
    //   // This can happen when the cells are not in the viewport.
    //   let sourceFlag = 0
    //   const sourceView = this.findViewByModel(model.getSourceCell())
    //   if (sourceView && !this.isViewMounted(sourceView)) {
    //     sourceFlag = this.dumpView(sourceView)
    //     view.updateEndMagnet('source')
    //   }
    //   let targetFlag = 0
    //   const targetView = this.findViewByModel(model.getTargetCell())
    //   if (targetView && !this.isViewMounted(targetView)) {
    //     targetFlag = this.dumpView(targetView)
    //     view.updateEndMagnet('target')
    //   }
    //   if (sourceFlag === 0 && targetFlag === 0) {
    //     // If leftover flag is 0, all view updates were done.
    //     return !this.dumpView(view)
    //   }
    // }
    return false
  }

  requestViewUpdate(
    view: CellView,
    flag: number,
    priority: number,
    opt: any = {},
  ) {
    this.scheduleViewUpdate(view, flag, priority, opt)

    const isAsync = this.isAsync()
    if (this.isFrozen() || (isAsync && opt.async !== false)) {
      return
    }

    if (this.model.hasActiveBatch(this.UPDATE_DELAYING_BATCHES)) {
      return
    }

    const stats = this.updateViews(opt)
    if (isAsync) {
      this.trigger('render:done', stats, opt)
    }
  }

  scheduleViewUpdate(
    view: CellView,
    flag: number,
    priority: number,
    opt: any = {},
  ) {
    const updates = this.updates
    let cache = updates.priorities[priority]
    if (!cache) {
      cache = updates.priorities[priority] = {}
    }

    const currentFlag = cache[view.cid] || 0
    // prevent cycling
    if ((currentFlag & flag) === flag) {
      return
    }

    if (!currentFlag) {
      updates.count += 1
    }

    if (flag & FLAG_REMOVE && currentFlag & FLAG_INSERT) {
      // When a view is removed we need to remove the insert flag
      // as this is a reinsert.
      cache[view.cid] ^= FLAG_INSERT
    } else if (flag & FLAG_INSERT && currentFlag & FLAG_REMOVE) {
      // When a view is added we need to remove the remove flag as
      // this is view was previously removed.
      cache[view.cid] ^= FLAG_REMOVE
    }
    cache[view.cid] |= flag

    const viewUpdateFn = this.options.onViewUpdate
    if (typeof viewUpdateFn === 'function') {
      viewUpdateFn.call(this, view, flag, opt || {}, this)
    }
  }

  updateView(view: CellView, flag: number, opt: any = {}) {
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

    return view.confirmUpdate(flag, opt || {})
  }

  dumpViewUpdate(view: CellView) {
    if (view == null) {
      return 0
    }

    const cid = view.cid
    const updates = this.updates
    const priorityUpdates = updates.priorities[view.UPDATE_PRIORITY]
    const flag = this.registerMountedView(view) | priorityUpdates[cid]
    delete priorityUpdates[cid]
    return flag
  }

  /**
   * Adds view into the DOM and update it.
   */
  dumpView(view: CellView, opt: any = {}) {
    const flag = this.dumpViewUpdate(view)
    if (!flag) {
      return 0
    }
    return this.updateView(view, flag, opt)
  }

  /**
   * Adds all views into the DOM and update them.
   */
  dumpViews(opt: any = {}) {
    this.checkViewport(opt)
    this.updateViews(opt)
  }

  /**
   * Ensure the view associated with the cell is attached to the DOM and updated.
   */
  requireView(cell: Cell, opt: any = {}) {
    const view = this.findViewByModel(cell)
    if (view == null) {
      return null
    }
    this.dumpView(view, opt)
    return view
  }

  /**
   * Updates views in a frozen async graph to make sure that the views reflect
   * the cells and keep the graph frozen.
   */
  updateViews(opt: any = {}) {
    let stats
    let updateCount = 0
    let batchCount = 0
    let priority = MIN_PRIORITY
    do {
      batchCount += 1
      stats = this.updateViewsBatch(opt)
      updateCount += stats.updated
      priority = Math.min(stats.priority, priority)
    } while (!stats.empty)

    return {
      priority,
      updated: updateCount,
      batches: batchCount,
    }
  }

  updateViewsAsync(
    opt: any = {},
    data: {
      processed: number
      priority: number
    } = {
      processed: 0,
      priority: MIN_PRIORITY,
    },
  ) {
    const updates = this.updates
    const id = updates.id
    if (id) {
      DomUtil.cancelAnimationFrame(id)
      if (data.processed === 0) {
        const beforeFn = opt.before
        if (typeof beforeFn === 'function') {
          beforeFn.call(this, this)
        }
      }

      const stats = this.updateViewsBatch(opt)
      const checkStats = this.checkViewport({
        mountBatchSize: MOUNT_BATCH_SIZE - stats.mounted,
        unmountBatchSize: MOUNT_BATCH_SIZE - stats.unmounted,
        ...opt,
      })

      const unmountCount = checkStats.unmounted
      const mountCount = checkStats.mounted
      let processed = data.processed
      const total = updates.count
      if (stats.updated > 0) {
        // Some updates have been just processed
        processed += stats.updated + stats.unmounted
        ;(stats as any).processed = processed
        data.priority = Math.min(stats.priority, data.priority)
        if (stats.empty && mountCount === 0) {
          stats.unmounted += unmountCount
          stats.mounted += mountCount
          stats.priority = data.priority
          this.trigger('render:done', stats, opt)
          data.processed = 0
          updates.count = 0
        } else {
          data.processed = processed
        }
      }

      // Progress callback
      const progressFn = opt.progress
      if (total && typeof progressFn === 'function') {
        progressFn.call(this, stats.empty, processed, total, stats, this)
      }

      // The current frame could have been canceled in a callback
      if (updates.id !== id) {
        return
      }
    }

    updates.id = DomUtil.requestAnimationFrame(() => {
      this.updateViewsAsync(opt, data)
    })
  }

  updateViewsBatch(opt: any = {}) {
    const options = this.options
    const batchSize = opt.batchSize || UPDATE_BATCH_SIZE
    const updates = this.updates
    const priorities = updates.priorities

    let updateCount = 0
    let postponeCount = 0
    let unmountCount = 0
    let mountCount = 0
    let maxPriority = MIN_PRIORITY
    let empty = true
    let viewportFn = opt.viewport || options.viewport

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
        if (updateCount >= batchSize) {
          empty = false // 还未渲染完成
          break main
        }

        const view = CellView.views[cid]
        if (!view) {
          // This should not occur
          delete cache[cid]
          continue
        }

        let currentFlag = cache[cid]
        if ((currentFlag & FLAG_REMOVE) === 0) {
          // We should never check a view for viewport if we are about to remove the view
          const isDetached = cid in updates.unmounted
          if (viewportFn && !viewportFn.call(this, view, isDetached, this)) {
            // Unmount View
            if (!isDetached) {
              this.registerUnmountedView(view)
              view.unmount()
            }
            updates.unmounted[cid] |= currentFlag
            delete cache[cid]
            unmountCount += 1
            continue
          }
          // Mount View
          if (isDetached) {
            currentFlag |= FLAG_INSERT
            mountCount += 1
          }
          currentFlag |= this.registerMountedView(view)
        }

        const leftoverFlag = this.updateView(view, currentFlag, opt)
        if (leftoverFlag > 0) {
          // View update has not finished completely
          cache[cid] = leftoverFlag
          if (
            !postponeViewFn ||
            !postponeViewFn.call(this, view, leftoverFlag, this) ||
            cache[cid]
          ) {
            postponeCount += 1
            empty = false
            continue
          }
        }

        if (maxPriority > p) {
          maxPriority = p
        }

        updateCount += 1
        delete cache[cid]
      }
    }

    return {
      empty,
      priority: maxPriority,
      updated: updateCount,
      postponed: postponeCount,
      unmounted: unmountCount,
      mounted: mountCount,
    }
  }

  registerMountedView(view: CellView) {
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

  registerUnmountedView(view: CellView) {
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
    const updates = this.updates
    return cid in updates.mounted
  }

  getUnmountedViews() {
    const updates = this.updates
    return Object.keys(updates.unmounted).map(id => CellView.views[id])
  }

  getMountedViews() {
    const updates = this.updates
    return Object.keys(updates.mounted).map(id => CellView.views[id])
  }

  protected checkUnmountedViews(viewportFn: any, options: any = {}) {
    let mountCount = 0
    if (typeof viewportFn !== 'function') {
      viewportFn = null // tslint:disable-line
    }
    const batchSize = options.mountBatchSize || Infinity
    const updates = this.updates
    const unmounted = updates.unmounted
    const unmountedCids = updates.unmountedCids
    const size = Math.min(unmountedCids.length, batchSize)
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
        // Push at the end of all unmounted ids, so this can be check later again
        unmountedCids.push(cid)
        continue
      }

      mountCount += 1
      const flag = this.registerMountedView(view)
      if (flag) {
        this.scheduleViewUpdate(view, flag, view.UPDATE_PRIORITY, {
          mounting: true,
        })
      }
    }

    // Get rid of views, that have been mounted
    unmountedCids.splice(0, size)
    return mountCount
  }

  protected checkMountedViews(viewportFn: any, options: any = {}) {
    let unmountCount = 0
    if (typeof viewportFn !== 'function') {
      return unmountCount
    }

    const batchSize = options.unmountBatchSize || Infinity
    const updates = this.updates
    const mounted = updates.mounted
    const mountedCids = updates.mountedCids
    const size = Math.min(mountedCids.length, batchSize)

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
        // Push at the end of all mounted ids, so this can be check later again
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

  checkViewport(options: any = {}) {
    const opts = {
      mountBatchSize: Infinity,
      unmountBatchSize: Infinity,
      ...options,
    }

    const viewportFn = opts.viewport || this.options.viewport
    const unmountedCount = this.checkMountedViews(viewportFn, opts)
    if (unmountedCount > 0) {
      // Do not check views, that have been just unmounted
      // and pushed at the end of the cids array
      const unmountedCids = this.updates.unmountedCids
      opts.mountBatchSize = Math.min(
        unmountedCids.length - unmountedCount,
        opts.mountBatchSize,
      )
    }

    const mountedCount = this.checkUnmountedViews(viewportFn, opts)
    return {
      mounted: mountedCount,
      unmounted: unmountedCount,
    }
  }

  isFrozen() {
    return !!this.options.frozen
  }

  freeze(options: any = {}) {
    const key = options.key
    const updates = this.updates
    const isFrozen = this.options.frozen
    const freezeKey = updates.freezeKey
    if (key && key !== freezeKey) {
      // key passed, but the paper is already freezed with another key
      if (isFrozen && freezeKey) {
        return
      }
      updates.freezeKey = key
      updates.keyFrozen = isFrozen
    }

    this.options.frozen = true
    const id = updates.id
    updates.id = null
    if (this.isAsync() && id != null) {
      DomUtil.cancelAnimationFrame(id)
    }
  }

  unfreeze(options: any = {}) {
    const key = options.key
    const updates = this.updates
    const freezeKey = updates.freezeKey
    // key passed, but the paper is already freezed with another key
    if (key && freezeKey && key !== freezeKey) {
      return
    }

    updates.freezeKey = null
    // key passed, but the paper is already freezed
    if (key && key === freezeKey && updates.keyFrozen) {
      return
    }

    if (this.isAsync()) {
      this.freeze()
      this.updateViewsAsync(options)
    } else {
      this.updateViews(options)
    }

    this.options.frozen = updates.keyFrozen = false
    if (updates.sort) {
      this.sortViews()
      updates.sort = false
    }
  }

  isAsync() {
    return !!this.options.async
  }

  isExactSorting() {
    return this.options.sorting === sortingTypes.EXACT
  }

  onRemove() {
    this.freeze()
    // clean up all DOM elements/views to prevent memory leaks
    this.removeViews()
  }

  createViewForModel(cell: Cell) {
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

    return new NodeView(cell as any)
  }

  removeView(cell: Cell) {
    const view = this.views[cell.id]
    if (view) {
      const { cid } = view
      const { mounted, unmounted } = this.updates
      view.remove()
      delete this.views[cell.id]
      delete mounted[cid]
      delete unmounted[cid]
    }
    return view
  }

  removeViews() {
    Object.keys(this.views).forEach(id => {
      const view = this.views[id]
      if (view) {
        view.remove()
      }
    })
    this.views = {}
  }

  renderView(cell: Cell, options: any = {}) {
    const id = cell.id
    const views = this.views
    let view: any
    let flag
    if (id in views) {
      view = views[id]
      flag = FLAG_INSERT
    } else {
      view = views[cell.id] = this.createViewForModel(cell)
      view.paper = this
      flag = this.registerUnmountedView(view) | view.getFlag(view.initFlag)
    }
    this.requestViewUpdate(view, flag, view.UPDATE_PRIORITY, options)
    return view
  }

  resetViews(cells: Cell[] = [], opt: any = {}) {
    this.resetUpdates()
    // clearing views removes any event listeners
    this.removeViews()
    this.freeze({ key: 'reset' })
    for (let i = 0, n = cells.length; i < n; i += 1) {
      this.renderView(cells[i], opt)
    }
    this.unfreeze({ key: 'reset' })
    this.sortViews()
  }

  sortViews() {
    if (!this.isExactSorting()) {
      // noop
      return
    }
    if (this.isFrozen()) {
      // sort views once unfrozen
      this.updates.sort = true
      return
    }
    this.sortViewsExact()
  }

  sortViewsExact() {
    // Run insertion sort algorithm in order to efficiently sort DOM elements according to their
    // associated model `z` attribute.
    // const $cells = $(this.drawPane).children('[model-id]')
    // const cells = this.model.get('cells')
    // sortElements($cells, function(a, b) {
    //   const cellA = cells.get(a.getAttribute('model-id'))
    //   const cellB = cells.get(b.getAttribute('model-id'))
    //   const zA = cellA.attributes.z || 0
    //   const zB = cellB.attributes.z || 0
    //   return zA === zB ? 0 : zA < zB ? -1 : 1
    // })
  }

  insertView(view: CellView) {
    const drawPane = this.drawPane
    switch (this.options.sorting) {
      case sortingTypes.APPROX:
        // const z = view.model.get('z')
        // const pivot = this.addZPivot(z)
        // drawPane.insertBefore(view.container, pivot)
        break
      case sortingTypes.EXACT:
      default:
        drawPane.appendChild(view.container)
        break
    }
  }

  addZPivot(z: number = 0) {
    const pivots = this.zPivots
    let pivot = pivots[z]
    if (pivot) {
      return pivot
    }

    pivot = pivots[z] = document.createComment(`z-index:${z + 1}`)
    let neighborZ = -Infinity
    for (const currentZ in pivots) {
      const zz = +currentZ
      if (zz < z && zz > neighborZ) {
        neighborZ = zz
        if (neighborZ === z - 1) {
          continue
        }
      }
    }
    const layer = this.drawPane
    if (neighborZ !== -Infinity) {
      const neighborPivot = pivots[neighborZ]
      // Insert After
      layer.insertBefore(pivot, neighborPivot.nextSibling)
    } else {
      // First Child
      layer.insertBefore(pivot, layer.firstChild)
    }
    return pivot
  }

  removeZPivots() {
    for (const z in this.zPivots) {
      this.viewportElem.removeChild(this.zPivots[z])
    }
    this.zPivots = {}
  }

  getScale() {
    return v.matrixToScale(this.getMatrix())
  }

  scale(sx: number, sy: number = sx, ox: number = 0, oy: number = 0) {
    const translate = this.getTranslate()

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

    this.trigger('scale', sx, sy, ox, oy)

    return this
  }

  getRotation() {
    return v.matrixToRotate(this.getMatrix())
  }

  rotate(angle: number, cx?: number, cy?: number) {
    // if (cx == null || cy == null) {
    //   const bbox = this.drawPane.getBBox() as Rectangle
    //   cx = bbox.width / 2 // tslint:disable-line
    //   cy = bbox.height / 2 // tslint:disable-line
    // }

    // const ctm = this.getMatrix()
    //   .translate(cx, cy)
    //   .rotate(angle)
    //   .translate(-cx, -cy)
    // this.setMatrix(ctm)

    return this
  }

  getTranslate() {
    return v.matrixToTranslate(this.getMatrix())
  }

  translate(tx: number, ty: number) {
    const matrix = this.getMatrix()
    matrix.e = tx || 0
    matrix.f = ty || 0

    this.setMatrix(matrix)

    const ret = this.getTranslate()
    const origin = this.options.origin
    origin.x = ret.tx
    origin.y = ret.ty

    this.trigger('translate', ret.tx, ret.ty)

    // if (this.options.drawGrid) {
    //   this.drawGrid()
    // }

    return this
  }

  // findView($el) {
  //   const el = isString($el)
  //     ? this.cells.querySelector($el)
  //     : $el instanceof $
  //     ? $el[0]
  //     : $el

  //   const id = this.findAttribute('model-id', el)
  //   if (id) return this._views[id]

  //   return undefined
  // }

  findViewByModel(cellId: string | number): CellView | null
  findViewByModel(cell: Cell): CellView | null
  findViewByModel(cell: Cell | string | number) {
    if (cell == null) {
      return null
    }

    const id = cell instanceof Cell ? cell.id : cell

    return this.views[id]
  }

  // findViewsFromPoint(p: Point | Point.PointLike) {
  //   const ref = Point.create(p)

  //   const views = this.model.cells.toArray().map(this.findViewByModel, this)
  //   return views.filter(view => {
  //     if (view != null) {
  //       return view.vel.getBBox({ target: this.cells }).containsPoint(ref)
  //     }
  //   }, this)
  // }

  // findViewsInArea(rect, opt) {
  //   opt = defaults(opt || {}, { strict: false })
  //   rect = new Rect(rect)

  //   const views = this.model.getElements().map(this.findViewByModel, this)
  //   const method = opt.strict ? 'containsRect' : 'intersect'

  //   return views.filter(function(view) {
  //     return view && rect[method](view.vel.getBBox({ target: this.cells }))
  //   }, this)
  // }

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

  // Guard the specified event. If the event is not interesting, guard returns `true`.
  // Otherwise, it returns `false`.
  guard(evt: JQuery.TriggeredEvent, view: CellView) {
    if (evt.type === 'mousedown' && evt.button === 2) {
      // handled as `contextmenu` type
      return true
    }

    // if (this.options.guard && this.options.guard(evt, view)) {
    //   return true
    // }

    if (evt.data && evt.data.guarded !== undefined) {
      return evt.data.guarded
    }

    // if (view && view.model && view.model instanceof Cell) {
    //   return false
    // }

    // if (
    //   this.svg === evt.target ||
    //   this.el === evt.target ||
    //   $.contains(this.svg, evt.target)
    // ) {
    //   return false
    // }

    return true
  }

  setGridSize(gridSize: number) {
    this.options.gridSize = gridSize

    if (this.options.drawGrid) {
      this.drawGrid()
    }

    return this
  }

  clearGrid() {
    this.gridElem.style.backgroundImage = ''
    return this
  }

  drawGrid() {}

  // #region defs

  isDefined(defId: string) {
    return this.svgElem.getElementById(defId) != null
  }

  // defineFilter(filter) {
  //   let filterId = filter.id
  //   const name = filter.name
  //   if (!filterId) {
  //     filterId =
  //       name + this.svgElem.id + StringExt.hashcode(JSON.stringify(filter))
  //   }

  //   if (!this.isDefined(filterId)) {
  //     const namespace = _filter
  //     const markup = namespace[name] && namespace[name](filter.args || {})
  //     if (!markup) {
  //       throw new Error('Non-existing filter ' + name)
  //     }

  //     // Set the filter area to be 3x the bounding box of the cell
  //     // and center the filter around the cell.
  //     const filterAttrs = {
  //       x: -1,
  //       y: -1,
  //       width: 3,
  //       height: 3,
  //       filterUnits: 'objectBoundingBox',
  //       ...filter.attrs,
  //       id: filterId,
  //     }

  //     v.create(markup, filterAttrs).appendTo(this.defsElem)
  //   }

  //   return filterId
  // }

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

  defineMarker(marker: Graph.CreateMarkerOptions & Attributes) {
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
        [v.create(type || 'path', attrs)],
      )

      this.defsElem.appendChild(pathMarker.node)
    }

    return markerId
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
    attrs?: Attributes
  }

  export interface CreateFilterOptions {
    id?: string
    name: string
  }
}
export namespace Graph {
  export const markup: BaseView.JSONMarkup[] = [
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
  export const events = {
    dblclick: 'pointerdblclick',
    contextmenu: 'contextmenu',
    mousedown: 'pointerdown',
    touchstart: 'pointerdown',
    mouseover: 'mouseover',
    mouseout: 'mouseout',
    mouseenter: 'mouseenter',
    mouseleave: 'mouseleave',
    mousewheel: 'mousewheel',
    DOMMouseScroll: 'mousewheel',
    'mouseenter .joint-cell': 'mouseenter',
    'mouseleave .joint-cell': 'mouseleave',
    'mouseenter .joint-tools': 'mouseenter',
    'mouseleave .joint-tools': 'mouseleave',
    'mousedown .joint-cell [event]': 'onevent',
    'touchstart .joint-cell [event]': 'onevent',
    'mousedown .joint-cell [magnet]': 'onmagnet',
    'touchstart .joint-cell [magnet]': 'onmagnet',
    'dblclick .joint-cell [magnet]': 'magnetpointerdblclick',
    'contextmenu .joint-cell [magnet]': 'magnetcontextmenu',
    'mousedown .joint-link .label': 'onlabel',
    'touchstart .joint-link .label': 'onlabel',
    'dragstart .joint-cell image': 'onImageDragStart',
  }

  export const documentEvents = {
    mousemove: 'pointermove',
    touchmove: 'pointermove',
    mouseup: 'pointerup',
    touchend: 'pointerup',
    touchcancel: 'pointerup',
  }
}
