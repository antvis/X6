import { KeyValue } from '../types'
import { Dom, FunctionExt } from '../util'
import { Point, Rectangle } from '../geometry'
import { Cell, Edge, Model } from '../model'
import { View, CellView, EdgeView } from '../view'
import { FlagManager } from '../view/flag'
import { Graph } from './graph'
import { Base } from './base'

export class Renderer extends Base {
  protected views: KeyValue<CellView>
  protected zPivots: KeyValue<Comment>
  protected updates: Renderer.Updates

  protected init() {
    this.resetUpdates()
    this.startListening()

    // Renders existing cells in the model.
    this.resetViews(this.model.getCells())

    // Starts rendering loop.
    if (!this.isFrozen() && this.isAsync()) {
      this.updateViewsAsync()
    }
  }

  protected startListening() {
    this.model.on('sorted', this.onSortModel, this)
    this.model.on('reseted', this.onModelReseted, this)
    this.model.on('batch:stop', this.onBatchStop, this)
    this.model.on('cell:added', this.onCellAdded, this)
    this.model.on('cell:removed', this.onCellRemoved, this)
    this.model.on('cell:change:zIndex', this.onCellZIndexChanged, this)
    this.model.on('cell:change:visible', this.onCellVisibleChanged, this)
  }

  protected stopListening() {
    this.model.off('sorted', this.onSortModel, this)
    this.model.off('reseted', this.onModelReseted, this)
    this.model.off('batch:stop', this.onBatchStop, this)
    this.model.off('cell:added', this.onCellAdded, this)
    this.model.off('cell:removed', this.onCellRemoved, this)
    this.model.off('cell:change:zIndex', this.onCellZIndexChanged, this)
    this.model.off('cell:change:visible', this.onCellVisibleChanged, this)
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

  protected onSortModel() {
    if (this.model.hasActiveBatch(Renderer.SORT_DELAYING_BATCHES)) {
      return
    }

    this.sortViews()
  }

  protected onModelReseted({ options }: Model.EventArgs['reseted']) {
    this.removeZPivots()
    this.resetViews(this.model.getCells(), options)
  }

  protected onBatchStop({ name, data }: Model.EventArgs['batch:stop']) {
    if (this.isFrozen()) {
      return
    }

    const model = this.model
    if (!this.isAsync()) {
      const updateDelayingBatches = Renderer.UPDATE_DELAYING_BATCHES
      if (
        updateDelayingBatches.includes(name as Model.BatchName) &&
        !model.hasActiveBatch(updateDelayingBatches)
      ) {
        this.updateViews(data)
      }
    }

    const sortDelayingBatches = Renderer.SORT_DELAYING_BATCHES
    if (
      sortDelayingBatches.includes(name as Model.BatchName) &&
      !model.hasActiveBatch(sortDelayingBatches)
    ) {
      this.sortViews()
    }
  }

  protected onCellAdded({ cell, options }: Model.EventArgs['cell:added']) {
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

  protected onCellRemoved({ cell, options }: Model.EventArgs['cell:removed']) {
    const view = this.findViewByCell(cell)
    if (view) {
      this.requestViewUpdate(view, Renderer.FLAG_REMOVE, view.priority, options)
    }
  }

  protected onCellZIndexChanged({
    cell,
    options,
  }: Model.EventArgs['cell:change:zIndex']) {
    if (this.options.sorting === 'approx') {
      const view = this.findViewByCell(cell)
      if (view) {
        this.requestViewUpdate(
          view,
          Renderer.FLAG_INSERT,
          view.priority,
          options,
        )
      }
    }
  }

  protected onCellVisibleChanged({
    cell,
    current: visible,
    options,
  }: Model.EventArgs['cell:change:visible']) {
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
    const getOpposite = (edge: Edge, currentTerminal: Cell) => {
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

    this.model.getConnectedEdges(node).forEach((edge) => {
      const opposite = getOpposite(edge, node)
      if (opposite == null || opposite.isVisible()) {
        visible ? edge.show() : edge.hide()
      }
    })
  }

  protected isEdgeTerminalVisible(edge: Edge, terminal: Edge.TerminalType) {
    const cellId =
      terminal === 'source' ? edge.getSourceCellId() : edge.getTargetCellId()
    const cell = cellId ? this.model.getCell(cellId) : null
    if (cell && !cell.isVisible()) {
      return false
    }
    return true
  }

  requestConnectedEdgesUpdate(
    view: CellView,
    options: Renderer.RequestViewUpdateOptions = {},
  ) {
    if (CellView.isCellView(view)) {
      const cell = view.cell
      const edges = this.model.getConnectedEdges(cell)
      for (let j = 0, n = edges.length; j < n; j += 1) {
        const edge = edges[j]
        const edgeView = this.findViewByCell(edge)
        if (!edgeView) {
          continue
        }

        const flagLabels: FlagManager.Action[] = ['update']
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
    if (!view || !CellView.isCellView(view)) {
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

  scheduleViewUpdate(
    view: View,
    flag: number,
    priority: number,
    options: Renderer.RequestViewUpdateOptions = {},
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

    if (flag & Renderer.FLAG_REMOVE && currentFlag & Renderer.FLAG_INSERT) {
      // When a view is removed we need to remove the
      // insert flag as this is a reinsert.
      cache[cid] ^= Renderer.FLAG_INSERT
    } else if (
      flag & Renderer.FLAG_INSERT &&
      currentFlag & Renderer.FLAG_REMOVE
    ) {
      // When a view is added we need to remove the remove
      // flag as this is view was previously removed.
      cache[cid] ^= Renderer.FLAG_REMOVE
    }

    cache[cid] |= flag

    this.graph.hook.onViewUpdated(view as CellView, flag, options)
  }

  requestViewUpdate(
    view: CellView,
    flag: number,
    priority: number,
    options: Renderer.RequestViewUpdateOptions = {},
  ) {
    this.scheduleViewUpdate(view, flag, priority, options)

    const isAsync = this.isAsync()
    if (
      this.isFrozen() ||
      (isAsync && options.async !== false) ||
      this.model.hasActiveBatch(Renderer.UPDATE_DELAYING_BATCHES)
    ) {
      return
    }

    const stats = this.updateViews(options)
    if (isAsync) {
      this.graph.trigger('render:done', { stats, options })
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
  dumpViews(options: Renderer.UpdateViewOptions = {}) {
    this.checkView(options)
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

    if (CellView.isCellView(view)) {
      if (flag & Renderer.FLAG_REMOVE) {
        this.removeView(view.cell as any)
        return 0
      }

      if (flag & Renderer.FLAG_INSERT) {
        this.insertView(view)
        flag ^= Renderer.FLAG_INSERT // eslint-disable-line
      }
    }

    if (!flag) {
      return 0
    }

    return view.confirmUpdate(flag, options)
  }

  updateViews(options: Renderer.UpdateViewOptions = {}) {
    let result: ReturnType<typeof Renderer.prototype.updateViewsBatch>
    let batchCount = 0
    let updatedCount = 0
    let priority = Renderer.MIN_PRIORITY

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

  protected updateViewsBatch(options: Renderer.UpdateViewOptions = {}) {
    const updates = this.updates
    const priorities = updates.priorities
    const batchSize = options.batchSize || Renderer.UPDATE_BATCH_SIZE

    let empty = true
    let priority = Renderer.MIN_PRIORITY
    let mountedCount = 0
    let unmountedCount = 0
    let updatedCount = 0
    let postponedCount = 0

    let checkView = options.checkView || this.options.checkView
    if (typeof checkView !== 'function') {
      checkView = null
    }

    // eslint-disable-next-line
    main: for (let p = 0, n = priorities.length; p < n; p += 1) {
      const cache = priorities[p]

      // eslint-disable-next-line
      for (const cid in cache) {
        if (updatedCount >= batchSize) {
          empty = false // goto next batch
          break main // eslint-disable-line no-labels
        }

        const view = View.views[cid]
        if (!view) {
          delete cache[cid]
          continue
        }

        let currentFlag = cache[cid]
        // Do not check a view for viewport if we are about to remove the view.
        if ((currentFlag & Renderer.FLAG_REMOVE) === 0) {
          const isUnmounted = cid in updates.unmounted
          if (
            checkView &&
            !FunctionExt.call(checkView, this.graph, {
              view: view as CellView,
              unmounted: isUnmounted,
            })
          ) {
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
            currentFlag |= Renderer.FLAG_INSERT
            mountedCount += 1
          }
          currentFlag |= this.registerMountedView(view)
        }

        const cellView = view as CellView
        let leftoverFlag = this.updateView(view, currentFlag, options)
        if (leftoverFlag > 0) {
          const cell = cellView.cell
          if (cell && cell.isEdge()) {
            // remove edge view when source cell is invisible
            if (
              cellView.hasAction(leftoverFlag, 'source') &&
              !this.isEdgeTerminalVisible(cell, 'source')
            ) {
              leftoverFlag = cellView.removeAction(leftoverFlag, 'source')
              leftoverFlag |= Renderer.FLAG_REMOVE
            }

            // remove edge view when target cell is invisible
            if (
              cellView.hasAction(leftoverFlag, 'target') &&
              !this.isEdgeTerminalVisible(cell, 'target')
            ) {
              leftoverFlag = cellView.removeAction(leftoverFlag, 'target')
              leftoverFlag |= Renderer.FLAG_REMOVE
            }
          }
        }

        if (leftoverFlag > 0) {
          // update has not finished
          cache[cid] = leftoverFlag
          if (
            !this.graph.hook.onViewPostponed(cellView, leftoverFlag, options) ||
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
    options: Renderer.UpdateViewsAsyncOptions = {},
    data: {
      processed: number
      priority: number
    } = {
      processed: 0,
      priority: Renderer.MIN_PRIORITY,
    },
  ) {
    const updates = this.updates
    const animationId = updates.animationId
    if (animationId) {
      Dom.cancelAnimationFrame(animationId)
      if (data.processed === 0) {
        const beforeFn = options.before
        if (typeof beforeFn === 'function') {
          FunctionExt.call(beforeFn, this.graph, this.graph)
        }
      }

      const stats = this.updateViewsBatch(options)
      const checkout = this.checkViewImpl({
        checkView: options.checkView,
        mountedBatchSize: Renderer.MOUNT_BATCH_SIZE - stats.mountedCount,
        unmountedBatchSize: Renderer.MOUNT_BATCH_SIZE - stats.unmountedCount,
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
          this.graph.trigger('render:done', { stats, options })
          data.processed = 0
          updates.count = 0
        } else {
          data.processed = processed
        }
      }

      // Progress callback
      const progressFn = options.progress
      if (total && typeof progressFn === 'function') {
        FunctionExt.call(progressFn, this.graph, {
          total,
          done: stats.empty,
          current: processed,
        })
      }

      // The current frame could have been canceled in a callback
      if (updates.animationId !== animationId) {
        return
      }
    }

    updates.animationId = Dom.requestAnimationFrame(() => {
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

    updates.unmounted[cid] |= Renderer.FLAG_INSERT

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
    return Object.keys(this.updates.mounted).map((cid) => CellView.views[cid])
  }

  getUnmountedViews() {
    return Object.keys(this.updates.unmounted).map((cid) => CellView.views[cid])
  }

  protected checkMountedViews(
    viewportFn?: Renderer.CheckViewFn | null,
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

      const shouldMount = FunctionExt.call(viewportFn, this.graph, {
        view: view as CellView,
        unmounted: true,
      })

      if (shouldMount) {
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
    checkView?: Renderer.CheckViewFn | null,
    batchSize?: number,
  ) {
    let mountCount = 0
    if (typeof checkView !== 'function') {
      checkView = null // eslint-disable-line
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

      const view = CellView.views[cid] as CellView
      if (view == null) {
        continue
      }

      if (
        checkView &&
        !FunctionExt.call(checkView, this.graph, { view, unmounted: false })
      ) {
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

  protected checkViewImpl(
    options: Renderer.CheckViewOptions & {
      mountedBatchSize?: number
      unmountedBatchSize?: number
    } = {
      mountedBatchSize: Number.MAX_SAFE_INTEGER,
      unmountedBatchSize: Number.MAX_SAFE_INTEGER,
    },
  ) {
    const checkView = options.checkView || this.options.checkView
    const unmountedCount = this.checkMountedViews(
      checkView,
      options.unmountedBatchSize,
    )

    const mountedCount = this.checkUnmountedViews(
      checkView,
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
  protected checkView(options: Renderer.CheckViewOptions = {}) {
    return this.checkViewImpl(options)
  }

  isFrozen() {
    return !!this.options.frozen
  }

  /**
   * Freeze the graph then the graph does not automatically re-render upon
   * changes in the graph. This is useful when adding large numbers of cells.
   */
  freeze(options: Renderer.FreezeOptions = {}) {
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
      Dom.cancelAnimationFrame(animationId)
    }
    this.graph.trigger('freeze', { key })
  }

  unfreeze(options: Renderer.UnfreezeOptions = {}) {
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

    const callback = () => {
      this.options.frozen = updates.frozen = false

      if (updates.sort) {
        this.sortViews()
        updates.sort = false
      }

      const afterFn = options.after
      if (afterFn) {
        FunctionExt.call(afterFn, this.graph, this.graph)
      }

      this.graph.trigger('unfreeze', { key })
    }

    if (this.isAsync()) {
      this.freeze()
      const onProgress = options.progress
      this.updateViewsAsync({
        ...options,
        progress: ({ done, current, total }) => {
          if (onProgress) {
            FunctionExt.call(onProgress, this.graph, { done, current, total })
          }

          // sort views after async render
          if (done) {
            callback()
          }
        },
      })
    } else {
      this.updateViews(options)
      callback()
    }
  }

  isAsync() {
    return !!this.options.async
  }

  setAsync(async: boolean) {
    this.options.async = async
  }

  protected onRemove() {
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
    if (this.views) {
      Object.keys(this.views).forEach((id) => {
        const view = this.views[id]
        if (view) {
          this.removeView(view.cell)
        }
      })
    }
    this.views = {}
  }

  protected renderView(cell: Cell, options: any = {}) {
    const id = cell.id
    const views = this.views
    let flag = 0
    let view = views[id]

    if (!cell.isVisible()) {
      return
    }

    if (cell.isEdge()) {
      if (
        !this.isEdgeTerminalVisible(cell, 'source') ||
        !this.isEdgeTerminalVisible(cell, 'target')
      ) {
        return
      }
    }

    if (view) {
      flag = Renderer.FLAG_INSERT
    } else {
      const tmp = this.graph.hook.createCellView(cell)
      if (tmp) {
        view = views[cell.id] = tmp
        view.graph = this.graph
        flag = this.registerUnmountedView(view) | view.getBootstrapFlag()
      }
    }

    if (view) {
      this.requestViewUpdate(view, flag, view.priority, options)
    }
  }

  protected isExactSorting() {
    return this.options.sorting === 'exact'
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

  protected sortElements(
    elems: Element[],
    comparator: (a: Element, b: Element) => number,
  ) {
    // Highly inspired by the jquery.sortElements plugin by Padolsey.
    // See http://james.padolsey.com/javascript/sorting-elements-with-jquery/.

    const placements = elems.map((elem) => {
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
    // const elems = this.view.stage.querySelectorAll('[data-cell-id]')
    // const length = elems.length
    // const cells = []
    // for (let i = 0; i < length; i++) {
    //   const cell = this.model.getCell(elems[i].getAttribute('data-cell-id') || '')
    //   cells.push({
    //     id: cell.id,
    //     zIndex: cell.getZIndex() || 0,
    //     elem: elems[i],
    //   })
    // }
    // const sortedCells = [...cells].sort((cell1, cell2) => cell1.zIndex - cell2.zIndex)
    // const moves = ArrayExt.diff(cells, sortedCells, 'zIndex').moves

    // if (moves && moves.length) {
    //   moves.forEach((move) => {
    //     if (move.type) {
    //       const elem = move.item.elem as Element
    //       const parentNode = elem.parentNode
    //       const index = move.index
    //       if (parentNode) {
    //         if (index === length - 1) {
    //           parentNode.appendChild(elem)
    //         } else if (index < length - 1) {
    //           parentNode.insertBefore(elem, elems[index + 1])
    //         }
    //       }
    //     }
    //   })
    // }

    // Run insertion sort algorithm in order to efficiently sort DOM
    // elements according to their associated cell `zIndex` attribute.
    const elems = this.view
      .$(this.view.stage)
      .children('[data-cell-id]')
      .toArray() as Element[]
    const model = this.model
    this.sortElements(elems, (a, b) => {
      const cellA = model.getCell(a.getAttribute('data-cell-id') || '')
      const cellB = model.getCell(b.getAttribute('data-cell-id') || '')
      const z1 = cellA.getZIndex() || 0
      const z2 = cellB.getZIndex() || 0
      return z1 === z2 ? 0 : z1 < z2 ? -1 : 1
    })
  }

  protected addZPivot(zIndex = 0) {
    if (this.zPivots == null) {
      this.zPivots = {}
    }

    const pivots = this.zPivots
    let pivot = pivots[zIndex]
    if (pivot) {
      return pivot
    }

    pivot = pivots[zIndex] = document.createComment(`z-index:${zIndex + 1}`)
    let neighborZ = -Infinity
    // eslint-disable-next-line
    for (const key in pivots) {
      const currentZ = +key
      if (currentZ < zIndex && currentZ > neighborZ) {
        neighborZ = currentZ
        if (neighborZ === zIndex - 1) {
          continue
        }
      }
    }

    const layer = this.view.stage
    if (neighborZ !== -Infinity) {
      const neighborPivot = pivots[neighborZ]
      layer.insertBefore(pivot, neighborPivot.nextSibling)
    } else {
      layer.insertBefore(pivot, layer.firstChild)
    }
    return pivot
  }

  protected removeZPivots() {
    if (this.zPivots) {
      Object.keys(this.zPivots).forEach((z) => {
        const elem = this.zPivots[z]
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem)
        }
      })
    }
    this.zPivots = {}
  }

  insertView(view: CellView) {
    const stage = this.view.stage
    switch (this.options.sorting) {
      case 'approx': {
        const zIndex = view.cell.getZIndex()
        const pivot = this.addZPivot(zIndex)
        stage.insertBefore(view.container, pivot)
        break
      }
      case 'exact':
      default:
        stage.appendChild(view.container)
        break
    }
  }

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    if (cell == null) {
      return null
    }
    const id = Cell.isCell(cell) ? cell.id : cell
    return this.views[id]
  }

  findViewByElem(elem: string | JQuery | Element | undefined | null) {
    if (elem == null) {
      return null
    }

    const target =
      typeof elem === 'string'
        ? this.view.stage.querySelector(elem)
        : elem instanceof Element
        ? elem
        : elem[0]

    if (target) {
      const id = this.view.findAttr('data-cell-id', target)
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
      .map((cell) => this.findViewByCell(cell))
      .filter((view) => {
        if (view != null) {
          return Dom.getBBox(view.container as SVGElement, {
            target: this.view.stage,
          }).containsPoint(ref)
        }
        return false
      }) as CellView[]
  }

  findEdgeViewsInArea(
    rect: Rectangle.RectangleLike,
    options: Renderer.FindViewsInAreaOptions = {},
  ) {
    const area = Rectangle.create(rect)
    return this.model
      .getEdges()
      .map((edge) => this.findViewByCell(edge))
      .filter((view) => {
        if (view) {
          const bbox = Dom.getBBox(view.container as SVGElement, {
            target: this.view.stage,
          })
          if (bbox.width === 0) {
            bbox.inflate(1, 0)
          } else if (bbox.height === 0) {
            bbox.inflate(0, 1)
          }
          return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWithRect(bbox)
        }
        return false
      }) as CellView[]
  }

  findViewsInArea(
    rect: Rectangle.RectangleLike,
    options: Renderer.FindViewsInAreaOptions = {},
  ) {
    const area = Rectangle.create(rect)
    return this.model
      .getNodes()
      .map((node) => this.findViewByCell(node))
      .filter((view) => {
        if (view) {
          const bbox = Dom.getBBox(view.container as SVGElement, {
            target: this.view.stage,
          })
          return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWithRect(bbox)
        }
        return false
      }) as CellView[]
  }

  @Base.dispose()
  dispose() {
    this.resetUpdates()
    this.stopListening()
  }
}

export namespace Renderer {
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

  export type CheckViewFn = (
    this: Graph,
    args: {
      view: CellView
      unmounted: boolean
    },
  ) => boolean

  export interface CheckViewOptions {
    /**
     * Callback function to determine whether a given view
     * should be added to the DOM.
     */
    checkView?: CheckViewFn
  }

  export interface UpdateViewOptions extends CheckViewOptions {
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
    after?: (this: Graph, graph: Graph) => void
    /**
     * Callback function that is called whenever a batch is
     * finished processing.
     */
    progress?: (
      this: Graph,
      args: { done: boolean; current: number; total: number },
    ) => void
  }

  export interface FreezeOptions {
    key?: string
  }

  export interface UnfreezeOptions
    extends FreezeOptions,
      UpdateViewsAsyncOptions {}

  export interface FindViewsInAreaOptions {
    strict?: boolean
  }
}

export namespace Renderer {
  export const FLAG_INSERT = 1 << 30
  export const FLAG_REMOVE = 1 << 29
  export const MOUNT_BATCH_SIZE = 1000
  export const UPDATE_BATCH_SIZE = 1000
  export const MIN_PRIORITY = 2
  export const SORT_DELAYING_BATCHES: Model.BatchName[] = [
    'add',
    'to-front',
    'to-back',
  ]
  export const UPDATE_DELAYING_BATCHES: Model.BatchName[] = ['translate']
}
