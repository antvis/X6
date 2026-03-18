import {
  Dom,
  disposable,
  FunctionExt,
  isModifierKeyMatch,
  type KeyValue,
  type ModifierKey,
} from '../../common'
import {
  Point,
  type PointLike,
  Rectangle,
  type RectangleLike,
  snapToGrid,
} from '../../geometry'
import * as Angle from '../../geometry/angle'
import type { Graph } from '../../graph'
import type {
  CollectionAddOptions,
  CollectionRemoveOptions,
  CollectionSetOptions,
  Edge,
  Model,
  Node,
  ResizeDirection,
  SetOptions,
} from '../../model'
import { Cell, Collection, type CollectionEventArgs } from '../../model'
import type { RouterData } from '../../model/edge'
import { routerRegistry } from '../../registry'
import { type CellView, View } from '../../view'
import type { Scroller } from '../scroller'

export class SelectionImpl extends View<SelectionImplEventArgs> {
  public readonly options: SelectionImplOptions
  protected readonly collection: Collection
  protected selectionContainer: HTMLElement
  protected selectionContent: HTMLElement
  protected boxCount: number
  protected boxesUpdated: boolean
  protected updateThrottleTimer: ReturnType<typeof setTimeout> | null = null
  protected isDragging: boolean = false
  protected batchUpdating: boolean = false
  // 逐帧批处理拖拽位移，降低 translate 重绘频率
  protected dragRafId: number | null = null
  // 合并缩放/平移下的选择框刷新到每帧一次
  protected transformRafId: number | null = null
  protected dragPendingOffset: { dx: number; dy: number } | null = null
  protected containerOffsetX: number = 0
  protected containerOffsetY: number = 0
  // 拖拽过程的缓存，减少每次 move 重复计算
  protected translatingCache: {
    selectedNodes: Node[]
    nodeIdSet: Set<string>
    edgesToTranslate: Edge[]
  } | null = null
  protected movingRouterRestoreCache: KeyValue<RouterData | undefined> | null =
    null
  protected movingRouterRestoreTimer: ReturnType<typeof setTimeout> | null =
    null
  protected lastMovingTs: number | null = null
  protected movingDegradeActivatedTs: number | null = null
  private static readonly RESTORE_IDLE_TIME = 100
  private static readonly RESTORE_HOLD_TIME = 150
  private static readonly MIN_RESTORE_WAIT_TIME = 50

  // Group transform state
  protected groupHandlesRendered: boolean = false
  protected groupRotating: boolean = false
  protected groupResizing: boolean = false
  protected groupRotateSnapshots: RotateNodeSnapshot[] = []
  protected groupRotateCenter: PointLike = { x: 0, y: 0 }
  protected groupRotatePrevTheta: number = 0
  protected groupRotateTotalAngle: number = 0
  protected groupResizeSnapshots: NodeSnapshot[] = []
  protected groupResizeOrigBBox: Rectangle | null = null
  protected groupResizeDirection: ResizeDirection | null = null

  public get graph() {
    return this.options.graph
  }

  protected get boxClassName() {
    return this.prefixClassName(classNames.box)
  }

  protected get $boxes() {
    return Dom.children(this.container, this.boxClassName)
  }

  protected get handleOptions() {
    return this.options
  }

  constructor(options: SelectionImplOptions) {
    super()
    this.options = options

    if (this.options.model) {
      this.options.collection = this.options.model.collection
    }

    if (this.options.collection) {
      this.collection = this.options.collection
    } else {
      this.collection = new Collection([], {
        comparator: depthComparator,
      })
      this.options.collection = this.collection
    }

    this.boxCount = 0
    this.boxesUpdated = false

    this.createContainer()
    this.startListening()
  }

  protected startListening() {
    const graph = this.graph
    const collection = this.collection

    this.delegateEvents(
      {
        [`mousedown .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
        [`touchstart .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
        [`mousedown .${this.prefixClassName(classNames.inner)}`]:
          'onSelectionContainerMouseDown',
        [`touchstart .${this.prefixClassName(classNames.inner)}`]:
          'onSelectionContainerMouseDown',
        [`mousedown .${this.prefixClassName(classNames.groupResize)}`]:
          'onGroupResizeMouseDown',
        [`touchstart .${this.prefixClassName(classNames.groupResize)}`]:
          'onGroupResizeMouseDown',
        [`mousedown .${this.prefixClassName(classNames.groupRotate)}`]:
          'onGroupRotateMouseDown',
        [`touchstart .${this.prefixClassName(classNames.groupRotate)}`]:
          'onGroupRotateMouseDown',
      },
      true,
    )

    graph.on('scale', this.onGraphTransformed, this)
    graph.on('translate', this.onGraphTransformed, this)
    graph.model.on('updated', this.onModelUpdated, this)

    collection.on('added', this.onCellAdded, this)
    collection.on('removed', this.onCellRemoved, this)
    collection.on('reseted', this.onReseted, this)
    collection.on('updated', this.onCollectionUpdated, this)
    collection.on('node:change:position', this.onNodePositionChanged, this)
    collection.on('cell:changed', this.onCellChanged, this)
  }

  protected stopListening() {
    const graph = this.graph
    const collection = this.collection

    this.undelegateEvents()

    graph.off('scale', this.onGraphTransformed, this)
    graph.off('translate', this.onGraphTransformed, this)
    // 清理缩放/平移的 rAF 刷新与 throttleTimer
    if (this.transformRafId != null) {
      cancelAnimationFrame(this.transformRafId)
      this.transformRafId = null
    }
    if (this.updateThrottleTimer) {
      clearTimeout(this.updateThrottleTimer)
      this.updateThrottleTimer = null
    }
    graph.model.off('updated', this.onModelUpdated, this)

    collection.off('added', this.onCellAdded, this)
    collection.off('removed', this.onCellRemoved, this)
    collection.off('reseted', this.onReseted, this)
    collection.off('updated', this.onCollectionUpdated, this)
    collection.off('node:change:position', this.onNodePositionChanged, this)
    collection.off('cell:changed', this.onCellChanged, this)
  }

  protected onRemove() {
    this.stopListening()
  }

  protected onGraphTransformed() {
    if (this.updateThrottleTimer) {
      clearTimeout(this.updateThrottleTimer)
      this.updateThrottleTimer = null
    }
    // 使用 rAF 将多次 transform 合并为每帧一次刷新
    if (this.transformRafId == null) {
      this.transformRafId = window.requestAnimationFrame(() => {
        this.transformRafId = null
        if (!this.isDragging && this.collection.length > 0) {
          this.refreshSelectionBoxes()
        }
      })
    }
  }

  protected onCellChanged() {
    this.updateSelectionBoxes()
  }

  protected translating: boolean

  protected onNodePositionChanged({
    node,
    options,
  }: CollectionEventArgs['node:change:position']) {
    const { showNodeSelectionBox, pointerEvents } = this.options
    const { ui, selection, translateBy, snapped } = options

    const allowTranslating =
      (showNodeSelectionBox !== true ||
        (pointerEvents &&
          this.getPointerEventsValue(pointerEvents) === 'none')) &&
      !this.translating &&
      !selection

    const translateByUi = ui && translateBy && node.id === translateBy

    if (allowTranslating && (translateByUi || snapped)) {
      this.translating = true
      const current = node.position()
      const previous = node.previous('position')
      if (previous) {
        const dx = current.x - previous.x
        const dy = current.y - previous.y

        if (dx !== 0 || dy !== 0) {
          this.translateSelectedNodes(dx, dy, node, options)
        }
      }
      this.translating = false
    }
  }

  protected onModelUpdated({ removed }: CollectionEventArgs['updated']) {
    if (removed?.length) {
      this.unselect(removed)
    }
  }

  isEmpty() {
    return this.length <= 0
  }

  isSelected(cell: Cell | string) {
    return this.collection.has(cell)
  }

  get length() {
    return this.collection.length
  }

  get cells() {
    return this.collection.toArray()
  }

  select(cells: Cell | Cell[], options: SelectionImplAddOptions = {}) {
    options.dryrun = true
    const items = this.filter(Array.isArray(cells) ? cells : [cells])
    this.collection.add(items, options)
    return this
  }

  unselect(cells: Cell | Cell[], options: SelectionImplRemoveOptions = {}) {
    // dryrun to prevent cell be removed from graph
    options.dryrun = true
    this.collection.remove(Array.isArray(cells) ? cells : [cells], options)
    return this
  }

  reset(cells?: Cell | Cell[], options: SelectionImplSetOptions = {}) {
    if (cells) {
      this.batchUpdating = !!options.batch
      const prev = this.cells
      const next = this.filter(Array.isArray(cells) ? cells : [cells])
      const prevMap: KeyValue<Cell> = {}
      const nextMap: KeyValue<Cell> = {}
      for (const cell of prev) {
        prevMap[cell.id] = cell
      }
      for (const cell of next) {
        nextMap[cell.id] = cell
      }

      const added: Cell[] = []
      const removed: Cell[] = []
      next.forEach((cell) => {
        if (!prevMap[cell.id]) {
          added.push(cell)
        }
      })
      prev.forEach((cell) => {
        if (!nextMap[cell.id]) {
          removed.push(cell)
        }
      })

      if (removed.length) {
        this.unselect(removed, { ...options, ui: true })
      }

      if (added.length) {
        this.select(added, { ...options, ui: true })
      }

      this.updateContainer()
      this.batchUpdating = false

      return this
    }

    return this.clean(options)
  }

  clean(options: SelectionImplSetOptions = {}) {
    if (this.length) {
      this.unselect(this.cells, options)
    }
    // 清理容器 transform 与位移累计
    this.containerOffsetX = 0
    this.containerOffsetY = 0
    Dom.css(this.container, 'transform', '')
    return this
  }

  setFilter(filter?: SelectionImplFilter) {
    this.options.filter = filter
  }

  setContent(content?: SelectionImplContent) {
    this.options.content = content
  }

  startSelecting(evt: Dom.MouseDownEvent) {
    // Flow: startSelecting => adjustSelection => stopSelecting

    evt = this.normalizeEvent(evt) // eslint-disable-line
    this.clean()
    let x: number
    let y: number
    const graphContainer = this.graph.container
    if (
      evt.offsetX != null &&
      evt.offsetY != null &&
      graphContainer.contains(evt.target)
    ) {
      x = evt.offsetX
      y = evt.offsetY
    } else {
      const offset = Dom.offset(graphContainer)
      const scrollLeft = graphContainer.scrollLeft
      const scrollTop = graphContainer.scrollTop
      x = evt.clientX - offset.left + window.pageXOffset + scrollLeft
      y = evt.clientY - offset.top + window.pageYOffset + scrollTop
    }

    Dom.css(this.container, {
      top: y,
      left: x,
      width: 1,
      height: 1,
    })

    this.setEventData<SelectingEventData>(evt, {
      action: 'selecting',
      clientX: evt.clientX,
      clientY: evt.clientY,
      offsetX: x,
      offsetY: y,
      scrollerX: 0,
      scrollerY: 0,
      moving: false,
    })

    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.notifyBoxEvent('box:mousedown', evt, client.x, client.y, [])

    this.delegateDocumentEvents(documentEvents, evt.data)
  }

  filter(cells: Cell[]) {
    const filter = this.options.filter

    return cells.filter((cell) => {
      if (Array.isArray(filter)) {
        return filter.some((item) => {
          if (typeof item === 'string') {
            return cell.shape === item
          }
          return cell.id === item.id
        })
      }
      if (typeof filter === 'function') {
        return FunctionExt.call(filter, this.graph, cell)
      }

      return true
    })
  }

  protected stopSelecting(evt: Dom.MouseUpEvent) {
    // 重置拖拽状态和清理定时器
    this.isDragging = false
    this.boxesUpdated = false
    if (this.updateThrottleTimer) {
      clearTimeout(this.updateThrottleTimer)
      this.updateThrottleTimer = null
    }

    const graph = this.graph
    const eventData = this.getEventData<CommonEventData>(evt)
    const action = eventData.action
    switch (action) {
      case 'selecting': {
        const client = graph.snapToGrid(evt.clientX, evt.clientY)
        const rect = this.getSelectingRect()
        const cells = this.getCellsInArea(rect)
        this.reset(cells, { batch: true })
        this.hideRubberband()
        this.notifyBoxEvent('box:mouseup', evt, client.x, client.y, cells)
        break
      }

      case 'translating': {
        const client = graph.snapToGrid(evt.clientX, evt.clientY)
        if (this.dragPendingOffset) {
          const toApply = this.dragPendingOffset
          this.dragPendingOffset = null
          this.translateSelectedNodes(toApply.dx, toApply.dy)
          this.updateContainerPosition(toApply)
        }
        if (this.dragRafId != null) {
          cancelAnimationFrame(this.dragRafId)
          this.dragRafId = null
        }
        // 重置容器 transform 与累计偏移
        this.containerOffsetX = 0
        this.containerOffsetY = 0
        Dom.css(this.container, 'transform', '')
        if (this.movingRouterRestoreTimer) {
          clearTimeout(this.movingRouterRestoreTimer)
          this.movingRouterRestoreTimer = null
        }
        this.restoreMovingRouters()
        this.graph.model.stopBatch('move-selection')
        // 清理本次拖拽缓存
        this.translatingCache = null
        this.notifyBoxEvent('box:mouseup', evt, client.x, client.y)
        this.repositionSelectionBoxesInPlace()
        break
      }

      case 'group-rotating': {
        this.groupRotating = false
        this.graph.model.stopBatch('group-rotate')
        this.trigger('selection:rotated', {
          cells: this.getSelectedNodes(),
          angle: this.groupRotateTotalAngle,
        })
        this.groupRotateSnapshots = []
        this.refreshSelectionBoxes()
        break
      }

      case 'group-resizing': {
        this.groupResizing = false
        this.groupResizeSnapshots = []
        this.groupResizeOrigBBox = null
        this.groupResizeDirection = null
        this.graph.model.stopBatch('group-resize')
        this.trigger('selection:resized', {
          cells: this.getSelectedNodes(),
        })
        this.refreshSelectionBoxes()
        break
      }

      default: {
        this.clean()
        break
      }
    }

    this.undelegateDocumentEvents()
  }

  protected onMouseUp(evt: Dom.MouseUpEvent) {
    const e = this.normalizeEvent(evt)
    const eventData = this.getEventData<CommonEventData>(e)
    if (eventData) {
      this.stopSelecting(evt)
    }
  }

  protected onSelectionBoxMouseDown(evt: Dom.MouseDownEvent) {
    this.handleSelectionMouseDown(evt, true)
  }

  protected onSelectionContainerMouseDown(evt: Dom.MouseDownEvent) {
    this.handleSelectionMouseDown(evt, false)
  }

  protected handleSelectionMouseDown(evt: Dom.MouseDownEvent, isBox: boolean) {
    evt.stopPropagation()
    evt.preventDefault?.()

    const e = this.normalizeEvent(evt)
    const client = this.graph.snapToGrid(e.clientX, e.clientY)

    // 容器内的多选切换：按下修饰键时，不拖拽，直接切换选中状态
    if (
      !isBox &&
      isModifierKeyMatch(e, this.options.multipleSelectionModifiers)
    ) {
      const viewsUnderPoint = this.graph.findViewsFromPoint(client.x, client.y)
      const nodeView = viewsUnderPoint.find((v) => v.isNodeView())
      if (nodeView) {
        const cell = nodeView.cell
        if (this.isSelected(cell)) {
          this.unselect(cell, { ui: true })
        } else {
          if (this.options.multiple === false) {
            this.reset(cell, { ui: true })
          } else {
            this.select(cell, { ui: true })
          }
        }
      }
      return
    }

    if (this.options.movable) {
      this.startTranslating(e)
    }

    let activeView = isBox ? this.getCellViewFromElem(e.target) : null
    if (!activeView) {
      const viewsUnderPoint = this.graph
        .findViewsFromPoint(client.x, client.y)
        .filter((view) => this.isSelected(view.cell))
      activeView = viewsUnderPoint[0] || null
      if (!activeView) {
        const firstSelected = this.collection.first()
        if (firstSelected) {
          activeView = this.graph.renderer.findViewByCell(firstSelected)
        }
      }
    }

    if (activeView) {
      this.setEventData<SelectionBoxEventData>(e, { activeView })
      if (isBox) {
        this.notifyBoxEvent('box:mousedown', e, client.x, client.y)
      }
      this.delegateDocumentEvents(documentEvents, e.data)
    }
  }

  protected startTranslating(evt: Dom.MouseDownEvent) {
    this.graph.model.startBatch('move-selection')
    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.setEventData<TranslatingEventData>(evt, {
      action: 'translating',
      clientX: client.x,
      clientY: client.y,
      originX: client.x,
      originY: client.y,
    })
    this.prepareTranslatingCache()
  }

  private getRestrictArea(): RectangleLike | null {
    const restrict = this.graph.options.translating.restrict
    const area =
      typeof restrict === 'function'
        ? FunctionExt.call(restrict, this.graph, null)
        : restrict

    if (typeof area === 'number') {
      return this.graph.transform.getGraphArea().inflate(area)
    }

    if (area === true) {
      return this.graph.transform.getGraphArea()
    }

    return area || null
  }

  // 根据当前选择的节点构建拖拽缓存
  protected prepareTranslatingCache() {
    const selectedNodes = this.collection
      .toArray()
      .filter((cell): cell is Node => cell.isNode())
    const nodeIdSet = new Set(selectedNodes.map((n) => n.id))
    const selectedEdges = this.collection
      .toArray()
      .filter((cell): cell is Edge => cell.isEdge())

    const edgesToTranslateSet = new Set<Edge>()
    const needsTranslate = (edge: Edge) =>
      edge.getVertices().length > 0 ||
      !edge.getSourceCellId() ||
      !edge.getTargetCellId()

    // 邻接边：仅当需要位移（有顶点或点端点）时加入缓存
    this.graph.model.getEdges().forEach((edge) => {
      const srcId = edge.getSourceCellId()
      const tgtId = edge.getTargetCellId()
      const isConnectedToSelectedNode =
        (srcId != null && nodeIdSet.has(srcId)) ||
        (tgtId != null && nodeIdSet.has(tgtId))
      if (isConnectedToSelectedNode && needsTranslate(edge)) {
        edgesToTranslateSet.add(edge)
      }
    })

    // 选中的边（不一定与选中节点相邻）也需要考虑
    selectedEdges.forEach((edge) => {
      if (needsTranslate(edge)) {
        edgesToTranslateSet.add(edge)
      }
    })

    this.translatingCache = {
      selectedNodes,
      nodeIdSet,
      edgesToTranslate: Array.from(edgesToTranslateSet),
    }
  }

  /**
   * 在移动过程中对与当前选中节点相连的边进行临时路由降级
   */
  protected applyMovingRouterFallback() {
    if (this.movingRouterRestoreCache) return
    const selectedNodes = this.translatingCache?.selectedNodes
    if (!selectedNodes || selectedNodes.length < 2) return
    const fallbackRaw = this.options.movingRouterFallback
    if (!fallbackRaw || !routerRegistry.exist(fallbackRaw)) return
    const fallback = { name: fallbackRaw }
    const restore: KeyValue<RouterData | undefined> = {}
    const processedEdges = new Set<string>()
    selectedNodes.forEach((node) => {
      this.graph.model.getConnectedEdges(node).forEach((edge) => {
        if (processedEdges.has(edge.id)) {
          return
        }
        processedEdges.add(edge.id)
        const current = edge.getRouter()
        restore[edge.id] = current
        edge.setRouter(fallback, { silent: true })
      })
    })
    this.movingRouterRestoreCache = restore
    this.movingDegradeActivatedTs = Date.now()
  }

  /**
   * 恢复移动过程中被降级的边的原始路由：
   * - 如果原始路由为空则移除路由设置
   * - 完成恢复后清空缓存，等待下一次移动重新降级
   */
  protected restoreMovingRouters() {
    const restore = this.movingRouterRestoreCache
    if (!restore) return
    Object.keys(restore).forEach((id) => {
      const edge = this.graph.getCellById(id) as Edge | null
      if (!edge || !edge.isEdge()) return
      const original = restore[id]
      if (original == null) {
        edge.removeRouter({ silent: true })
      } else {
        edge.setRouter(original, { silent: true })
      }
      const view = this.graph.findViewByCell(edge)
      if (view) {
        this.graph.renderer.requestViewUpdate(view, view.getFlag('update'), {
          async: true,
        })
      }
    })
    this.movingRouterRestoreCache = null
  }

  /**
   * 在移动停止后延迟恢复路由，避免连线抖动：
   * - `idle`：距离上次移动的空闲时间必须超过 100ms
   * - `hold`：降级保持时间必须超过 150ms
   * - 若条件未满足则按最小等待时间再次调度恢复
   */
  protected scheduleMovingRouterRestoreThrottle() {
    if (this.movingRouterRestoreTimer) {
      clearTimeout(this.movingRouterRestoreTimer)
      this.movingRouterRestoreTimer = null
    }
    this.movingRouterRestoreTimer = setTimeout(() => {
      const now = Date.now()
      const lastMove = this.lastMovingTs || 0
      const idle = now - lastMove
      const hold =
        this.movingDegradeActivatedTs != null
          ? now - this.movingDegradeActivatedTs
          : Infinity
      if (
        idle < SelectionImpl.RESTORE_IDLE_TIME ||
        hold < SelectionImpl.RESTORE_HOLD_TIME
      ) {
        const wait = Math.max(
          SelectionImpl.RESTORE_IDLE_TIME - idle,
          SelectionImpl.RESTORE_HOLD_TIME - hold,
          SelectionImpl.MIN_RESTORE_WAIT_TIME,
        )
        this.movingRouterRestoreTimer = setTimeout(() => {
          this.movingRouterRestoreTimer = null
          this.restoreMovingRouters()
        }, wait)
        return
      }
      this.movingRouterRestoreTimer = null
      this.restoreMovingRouters()
    }, SelectionImpl.RESTORE_IDLE_TIME)
  }

  protected getSelectionOffset(client: Point, data: TranslatingEventData) {
    let dx = client.x - data.clientX
    let dy = client.y - data.clientY
    const restrict = this.getRestrictArea()
    if (restrict) {
      const cells = this.collection.toArray()
      const totalBBox =
        Cell.getCellsBBox(cells, { deep: true }) || Rectangle.create()
      const minDx = restrict.x - totalBBox.x
      const minDy = restrict.y - totalBBox.y
      const maxDx =
        restrict.x + restrict.width - (totalBBox.x + totalBBox.width)
      const maxDy =
        restrict.y + restrict.height - (totalBBox.y + totalBBox.height)

      if (dx < minDx) {
        dx = minDx
      }
      if (dy < minDy) {
        dy = minDy
      }
      if (maxDx < dx) {
        dx = maxDx
      }
      if (maxDy < dy) {
        dy = maxDy
      }

      if (!this.options.following) {
        const offsetX = client.x - data.originX
        const offsetY = client.y - data.originY
        dx = offsetX <= minDx || offsetX >= maxDx ? 0 : dx
        dy = offsetY <= minDy || offsetY >= maxDy ? 0 : dy
      }
    }

    return {
      dx,
      dy,
    }
  }

  protected updateSelectedNodesPosition(offset: { dx: number; dy: number }) {
    if (offset.dx === 0 && offset.dy === 0) {
      return
    }

    // 合并偏移并在下一帧统一应用，减少高频重绘
    if (this.dragPendingOffset) {
      this.dragPendingOffset.dx += offset.dx
      this.dragPendingOffset.dy += offset.dy
    } else {
      this.dragPendingOffset = { dx: offset.dx, dy: offset.dy }
    }

    if (this.dragRafId == null) {
      this.dragRafId = requestAnimationFrame(() => {
        const toApply = this.dragPendingOffset || { dx: 0, dy: 0 }
        this.dragPendingOffset = null
        this.dragRafId = null

        this.translateSelectedNodes(toApply.dx, toApply.dy)
        this.updateContainerPosition(toApply)
        this.boxesUpdated = true
        this.isDragging = true
      })
    }
  }

  protected autoScrollGraph(
    x: number,
    y: number,
  ): { scrollerX: number; scrollerY: number } {
    const scroller = this.graph.getPlugin<Scroller>('scroller')
    if (scroller?.autoScroll) {
      return scroller.autoScroll(x, y)
    }
    return { scrollerX: 0, scrollerY: 0 }
  }

  protected adjustSelection(evt: Dom.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    const eventData = this.getEventData<CommonEventData>(e)
    const action = eventData.action
    switch (action) {
      case 'selecting': {
        const data = eventData as SelectingEventData
        if (data.moving !== true) {
          Dom.appendTo(this.container, this.graph.container)
          this.showRubberband()
          data.moving = true
        }

        const { scrollerX, scrollerY } = this.autoScrollGraph(
          e.clientX,
          e.clientY,
        )
        data.scrollerX += scrollerX
        data.scrollerY += scrollerY

        const dx = e.clientX - data.clientX + data.scrollerX
        const dy = e.clientY - data.clientY + data.scrollerY

        Dom.css(this.container, {
          left: dx < 0 ? data.offsetX + dx : data.offsetX,
          top: dy < 0 ? data.offsetY + dy : data.offsetY,
          width: Math.abs(dx),
          height: Math.abs(dy),
        })

        const client = this.graph.snapToGrid(e.clientX, e.clientY)
        const rect = this.getSelectingRect()
        const cells = this.getCellsInArea(rect)
        this.notifyBoxEvent('box:mousemove', evt, client.x, client.y, cells)
        break
      }

      case 'translating': {
        this.isDragging = true
        const client = this.graph.snapToGrid(e.clientX, e.clientY)
        const data = eventData as TranslatingEventData
        const offset = this.getSelectionOffset(client, data)
        if (this.options.following) {
          this.updateSelectedNodesPosition(offset)
        } else {
          this.updateContainerPosition(offset)
        }
        if (offset.dx) {
          data.clientX = client.x
        }
        if (offset.dy) {
          data.clientY = client.y
        }
        if (offset.dx !== 0 || offset.dy !== 0) {
          this.lastMovingTs = Date.now()
          this.applyMovingRouterFallback()
          this.scheduleMovingRouterRestoreThrottle()
        }
        this.notifyBoxEvent('box:mousemove', evt, client.x, client.y)
        break
      }

      case 'group-rotating': {
        this.doGroupRotating(e)
        break
      }

      case 'group-resizing': {
        this.doGroupResizing(e)
        break
      }

      default:
        break
    }

    this.boxesUpdated = false
  }

  protected translateSelectedNodes(
    dx: number,
    dy: number,
    exclude?: Cell,
    otherOptions?: KeyValue,
  ) {
    const map: { [id: string]: boolean } = {}
    const excluded: Cell[] = []

    if (exclude) {
      map[exclude.id] = true
    }

    this.collection.toArray().forEach((cell) => {
      cell.getDescendants({ deep: true }).forEach((child) => {
        map[child.id] = true
      })
    })
    if (otherOptions?.translateBy) {
      const currentCell = this.graph.getCellById(otherOptions.translateBy)
      if (currentCell) {
        map[currentCell.id] = true
        currentCell.getDescendants({ deep: true }).forEach((child) => {
          map[child.id] = true
        })
        excluded.push(currentCell)
      }
    }

    const options = {
      ...otherOptions,
      selection: this.cid,
      exclude: excluded,
    }

    // 移动选中的节点，避免重复和嵌套
    const cachedSelectedNodes = this.translatingCache?.selectedNodes
    const selectedNodes = (
      cachedSelectedNodes ??
      (this.collection.toArray().filter((cell) => cell.isNode()) as Node[])
    ).filter((node) => !map[node.id])
    selectedNodes.forEach((node) => {
      node.translate(dx, dy, options)
    })

    // 边移动缓存：仅移动需要位移的边（有顶点或点端点）
    const cachedEdges = this.translatingCache?.edgesToTranslate
    const edgesToTranslate = new Set<Edge>()
    if (cachedEdges) {
      cachedEdges.forEach((edge) => {
        edgesToTranslate.add(edge)
      })
    } else {
      const selectedNodeIdSet = new Set(selectedNodes.map((n) => n.id))
      this.graph.model.getEdges().forEach((edge) => {
        const srcId = edge.getSourceCellId()
        const tgtId = edge.getTargetCellId()
        const srcSelected = srcId ? selectedNodeIdSet.has(srcId) : false
        const tgtSelected = tgtId ? selectedNodeIdSet.has(tgtId) : false
        if (srcSelected || tgtSelected) {
          const hasVertices = edge.getVertices().length > 0
          const pointEndpoint = !srcId || !tgtId
          if (hasVertices || pointEndpoint) {
            edgesToTranslate.add(edge)
          }
        }
      })
    }

    // 若选择了边（仅边、无节点），确保其也被移动（过滤无顶点且两端为节点的情况）
    const selectedEdges = this.collection
      .toArray()
      .filter((cell): cell is Edge => cell.isEdge() && !map[cell.id])
    selectedEdges.forEach((edge) => {
      const hasVertices = edge.getVertices().length > 0
      const pointEndpoint = !edge.getSourceCellId() || !edge.getTargetCellId()
      if (hasVertices || pointEndpoint) {
        edgesToTranslate.add(edge)
      }
    })

    edgesToTranslate.forEach((edge) => {
      edge.translate(dx, dy, options)
    })
  }

  // #region Group Transform

  protected getSelectedNodes(): Node[] {
    return this.collection
      .toArray()
      .filter((cell): cell is Node => cell.isNode())
  }

  protected getSelectionBBox(): Rectangle {
    const nodes = this.getSelectedNodes()
    if (nodes.length === 0) return new Rectangle()
    const bbox = this.graph.model.getCellsBBox(nodes)
    return bbox || new Rectangle()
  }

  protected renderGroupTransformHandles() {
    if (this.boxCount < 2) {
      this.removeGroupTransformHandles()
      return
    }

    const resizable = this.options.resizable
    const rotatable = this.options.rotatable

    if (!resizable && !rotatable) return

    if (!this.groupHandlesRendered) {
      if (resizable) {
        const positions: ResizeDirection[] = [
          'top-left', 'top', 'top-right', 'right',
          'bottom-right', 'bottom', 'bottom-left', 'left',
        ]
        for (const pos of positions) {
          const handle = document.createElement('div')
          Dom.addClass(
            handle,
            this.prefixClassName(classNames.groupResize),
          )
          handle.setAttribute('data-position', pos)
          this.selectionContainer.appendChild(handle)
        }
      }

      if (rotatable) {
        const handle = document.createElement('div')
        Dom.addClass(
          handle,
          this.prefixClassName(classNames.groupRotate),
        )
        this.selectionContainer.appendChild(handle)
      }

      this.groupHandlesRendered = true
    }
  }

  protected removeGroupTransformHandles() {
    if (!this.groupHandlesRendered) return
    const resizeHandles = this.selectionContainer.querySelectorAll(
      `.${this.prefixClassName(classNames.groupResize)}`,
    )
    const rotateHandles = this.selectionContainer.querySelectorAll(
      `.${this.prefixClassName(classNames.groupRotate)}`,
    )
    resizeHandles.forEach((el) => el.remove())
    rotateHandles.forEach((el) => el.remove())
    this.groupHandlesRendered = false
  }

  protected onGroupRotateMouseDown(evt: Dom.MouseDownEvent) {
    evt.stopPropagation()
    evt.preventDefault?.()

    const e = this.normalizeEvent(evt)
    const pos = this.graph.clientToLocal(e.clientX, e.clientY)
    const bbox = this.getSelectionBBox()
    const center = bbox.getCenter()

    const nodes = this.getSelectedNodes()

    // Snapshot each node's original position and angle
    const snapshots: RotateNodeSnapshot[] = []
    for (const node of nodes) {
      const nodeBBox = node.getBBox()
      snapshots.push({
        node,
        centerX: nodeBBox.x + nodeBBox.width / 2,
        centerY: nodeBBox.y + nodeBBox.height / 2,
        width: nodeBBox.width,
        height: nodeBBox.height,
        angle: node.getAngle(),
      })
    }

    this.groupRotating = true
    this.groupRotateSnapshots = snapshots
    this.groupRotateCenter = center
    this.groupRotatePrevTheta = Point.create(pos).theta(center)
    this.groupRotateTotalAngle = 0

    this.graph.model.startBatch('group-rotate')
    this.trigger('selection:rotate', { cells: nodes, angle: 0 })

    this.setEventData<GroupTransformEventData>(e, {
      action: 'group-rotating',
      center,
    })
    this.delegateDocumentEvents(documentEvents, e.data)
  }

  protected doGroupRotating(e: Dom.MouseMoveEvent) {
    const pos = this.graph.clientToLocal(e.clientX, e.clientY)
    const center = this.groupRotateCenter

    // Accumulate angle using frame-to-frame deltas to avoid 0/360 wrap issues
    const currentTheta = Point.create(pos).theta(center)
    let frameDelta = this.groupRotatePrevTheta - currentTheta
    // Normalize to [-180, 180] to handle wrap-around
    if (frameDelta > 180) frameDelta -= 360
    if (frameDelta < -180) frameDelta += 360
    this.groupRotatePrevTheta = currentTheta

    this.groupRotateTotalAngle += frameDelta

    // Apply grid snapping to total angle
    let snappedAngle = this.groupRotateTotalAngle
    const rotateGrid = this.getRotateGrid()
    if (rotateGrid > 0) {
      snappedAngle = snapToGrid(snappedAngle, rotateGrid)
    }

    // Apply absolute rotation from original snapshots (no cumulative error)
    const rad = (snappedAngle * Math.PI) / 180
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    const cx = center.x
    const cy = center.y

    for (const snapshot of this.groupRotateSnapshots) {
      // Rotate original center around group center
      const dx = snapshot.centerX - cx
      const dy = snapshot.centerY - cy
      // Screen-coords clockwise rotation (Y-down)
      const newCenterX = cx + dx * cosA - dy * sinA
      const newCenterY = cy + dx * sinA + dy * cosA

      // Set position (top-left corner from center)
      snapshot.node.setPosition(
        newCenterX - snapshot.width / 2,
        newCenterY - snapshot.height / 2,
      )

      // Set absolute angle
      const newAngle = Angle.normalize(snapshot.angle + snappedAngle)
      snapshot.node.rotate(newAngle, { absolute: true })
    }

    this.trigger('selection:rotating', {
      cells: this.getSelectedNodes(),
      angle: snappedAngle,
    })

    this.refreshSelectionBoxes()
  }

  protected getRotateGrid(): number {
    const rotatable = this.options.rotatable
    if (typeof rotatable === 'object' && rotatable != null) {
      return rotatable.grid ?? 15
    }
    return 15
  }

  protected onGroupResizeMouseDown(evt: Dom.MouseDownEvent) {
    evt.stopPropagation()
    evt.preventDefault?.()

    const e = this.normalizeEvent(evt)
    const target = e.target as HTMLElement
    const position = target.getAttribute('data-position') as ResizeDirection
    if (!position) return

    const bbox = this.getSelectionBBox()
    const nodes = this.getSelectedNodes()
    const snapshots: NodeSnapshot[] = []

    for (const node of nodes) {
      const nodeBBox = node.getBBox()
      snapshots.push({
        node,
        relX: (nodeBBox.x - bbox.x) / (bbox.width || 1),
        relY: (nodeBBox.y - bbox.y) / (bbox.height || 1),
        relW: nodeBBox.width / (bbox.width || 1),
        relH: nodeBBox.height / (bbox.height || 1),
        angle: node.getAngle(),
      })
    }

    this.groupResizing = true
    this.groupResizeSnapshots = snapshots
    this.groupResizeOrigBBox = bbox
    this.groupResizeDirection = position

    this.graph.model.startBatch('group-resize')
    this.trigger('selection:resize', { cells: nodes })

    this.setEventData<GroupResizingEventData>(e, {
      action: 'group-resizing',
      direction: position,
      origBBox: bbox,
      startX: e.clientX,
      startY: e.clientY,
    })
    this.delegateDocumentEvents(documentEvents, e.data)
  }

  protected doGroupResizing(e: Dom.MouseMoveEvent) {
    const data = this.getEventData<GroupResizingEventData>(e)
    const origBBox = data.origBBox
    const direction = data.direction

    const startLocal = this.graph.clientToLocal(data.startX, data.startY)
    const currentLocal = this.graph.clientToLocal(e.clientX, e.clientY)
    const dx = currentLocal.x - startLocal.x
    const dy = currentLocal.y - startLocal.y

    const resizeOpts = this.getResizeOptions()
    const minWidth = resizeOpts.minWidth ?? 1
    const minHeight = resizeOpts.minHeight ?? 1

    let newX = origBBox.x
    let newY = origBBox.y
    let newW = origBBox.width
    let newH = origBBox.height

    switch (direction) {
      case 'top-left':
        newX += dx; newY += dy; newW -= dx; newH -= dy; break
      case 'top':
        newY += dy; newH -= dy; break
      case 'top-right':
        newY += dy; newW += dx; newH -= dy; break
      case 'right':
        newW += dx; break
      case 'bottom-right':
        newW += dx; newH += dy; break
      case 'bottom':
        newH += dy; break
      case 'bottom-left':
        newX += dx; newW -= dx; newH += dy; break
      case 'left':
        newX += dx; newW -= dx; break
    }

    // Enforce minimum dimensions for the group
    const MIN_GROUP_DIMENSION = 10
    const groupMinW = Math.max(minWidth, MIN_GROUP_DIMENSION)
    const groupMinH = Math.max(minHeight, MIN_GROUP_DIMENSION)

    if (newW < groupMinW) {
      if (direction.includes('left')) {
        newX = origBBox.x + origBBox.width - groupMinW
      }
      newW = groupMinW
    }
    if (newH < groupMinH) {
      if (direction.includes('top')) {
        newY = origBBox.y + origBBox.height - groupMinH
      }
      newH = groupMinH
    }

    // Preserve aspect ratio if configured
    if (resizeOpts.preserveAspectRatio && origBBox.width > 0 && origBBox.height > 0) {
      const ratio = origBBox.width / origBBox.height
      if (direction === 'top' || direction === 'bottom') {
        newW = newH * ratio
      } else if (direction === 'left' || direction === 'right') {
        newH = newW / ratio
      } else {
        // corner: use the larger scale
        const scaleX = newW / origBBox.width
        const scaleY = newH / origBBox.height
        const scale = Math.max(scaleX, scaleY)
        newW = origBBox.width * scale
        newH = origBBox.height * scale
        if (direction.includes('left')) {
          newX = origBBox.x + origBBox.width - newW
        }
        if (direction.includes('top')) {
          newY = origBBox.y + origBBox.height - newH
        }
      }
    }

    // Apply proportional transform to each node
    for (const snapshot of this.groupResizeSnapshots) {
      const nodeW = Math.max(newW * snapshot.relW, minWidth)
      const nodeH = Math.max(newH * snapshot.relH, minHeight)
      const nodeX = newX + newW * snapshot.relX
      const nodeY = newY + newH * snapshot.relY

      snapshot.node.setPosition(nodeX, nodeY)
      snapshot.node.resize(nodeW, nodeH)
    }

    this.trigger('selection:resizing', {
      cells: this.getSelectedNodes(),
    })

    this.refreshSelectionBoxes()
  }

  protected getResizeOptions(): {
    minWidth?: number
    minHeight?: number
    preserveAspectRatio?: boolean
  } {
    const resizable = this.options.resizable
    if (typeof resizable === 'object' && resizable != null) {
      return resizable
    }
    return {}
  }

  // #endregion

  protected getCellViewsInArea(rect: Rectangle) {
    const graph = this.graph
    const options = {
      strict: this.options.strict,
    }
    let views: CellView[] = []

    if (this.options.rubberNode) {
      views = views.concat(
        graph.model
          .getNodesInArea(rect, options)
          .map((node) => graph.renderer.findViewByCell(node))
          .filter((view) => view != null) as CellView[],
      )
    }

    if (this.options.rubberEdge) {
      views = views.concat(
        graph.model
          .getEdgesInArea(rect, options)
          .map((edge) => graph.renderer.findViewByCell(edge))
          .filter((view) => view != null) as CellView[],
      )
    }

    return views
  }

  protected getCellsInArea(rect: Rectangle) {
    return this.filter(this.getCellViewsInArea(rect).map((view) => view.cell))
  }

  protected getSelectingRect() {
    let width = Dom.width(this.container)
    let height = Dom.height(this.container)
    const offset = Dom.offset(this.container)
    const origin = this.graph.pageToLocal(offset.left, offset.top)
    const scale = this.graph.transform.getScale()
    width /= scale.sx
    height /= scale.sy
    return new Rectangle(origin.x, origin.y, width, height)
  }

  protected getBoxEventCells(
    cells?: Cell[],
    activeView: CellView | null = null,
  ) {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let view = activeView

    ;(cells ?? this.cells).forEach((cell) => {
      const current = this.graph.getCellById(cell.id)
      if (!current) {
        return
      }

      if (!view) {
        view = this.graph.renderer.findViewByCell(current)
      }

      if (current.isNode()) {
        nodes.push(current)
      } else if (current.isEdge()) {
        edges.push(current)
      }
    })

    return {
      view,
      cell: view?.cell ?? null,
      nodes,
      edges,
    }
  }

  protected notifyBoxEvent<
    K extends keyof SelectionImplBoxEventArgsRecord,
    T extends Dom.EventObject,
  >(name: K, e: T, x: number, y: number, cells?: Cell[]) {
    const activeView =
      this.getEventData<SelectionBoxEventData | null>(e)?.activeView ?? null
    const { view, cell, nodes, edges } = this.getBoxEventCells(
      cells,
      activeView,
    )
    this.trigger(name, { e, view, x, y, cell, nodes, edges })
  }

  protected getSelectedClassName(cell: Cell) {
    return this.prefixClassName(`${cell.isNode() ? 'node' : 'edge'}-selected`)
  }

  protected addCellSelectedClassName(cell: Cell) {
    const view = this.graph.renderer.findViewByCell(cell)
    if (view) {
      view.addClass(this.getSelectedClassName(cell))
    }
  }

  protected removeCellUnSelectedClassName(cell: Cell) {
    const view = this.graph.renderer.findViewByCell(cell)
    if (view) {
      view.removeClass(this.getSelectedClassName(cell))
    }
  }

  protected destroySelectionBox(cell: Cell) {
    this.removeCellUnSelectedClassName(cell)

    if (this.canShowSelectionBox(cell)) {
      Dom.remove(this.container.querySelector(`[data-cell-id="${cell.id}"]`))
      if (this.$boxes.length === 0) {
        this.hide()
      }
      this.boxCount = Math.max(0, this.boxCount - 1)
    }
  }

  protected destroyAllSelectionBoxes(cells: Cell[]) {
    cells.forEach((cell) => {
      this.removeCellUnSelectedClassName(cell)
    })

    this.hide()
    Dom.remove(this.$boxes)
    this.boxCount = 0
    this.removeGroupTransformHandles()
  }

  hide() {
    Dom.removeClass(this.container, this.prefixClassName(classNames.rubberband))
    Dom.removeClass(this.container, this.prefixClassName(classNames.selected))
  }

  protected showRubberband() {
    Dom.addClass(this.container, this.prefixClassName(classNames.rubberband))
  }

  protected hideRubberband() {
    Dom.removeClass(this.container, this.prefixClassName(classNames.rubberband))
  }

  protected showSelected() {
    Dom.removeAttribute(this.container, 'style')
    Dom.addClass(this.container, this.prefixClassName(classNames.selected))
  }

  protected createContainer() {
    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName(classNames.root))
    if (this.options.className) {
      Dom.addClass(this.container, this.options.className)
    }
    Dom.css(this.container, {
      willChange: 'transform',
    })

    this.selectionContainer = document.createElement('div')
    Dom.addClass(
      this.selectionContainer,
      this.prefixClassName(classNames.inner),
    )

    this.selectionContent = document.createElement('div')
    Dom.addClass(
      this.selectionContent,
      this.prefixClassName(classNames.content),
    )

    Dom.append(this.selectionContainer, this.selectionContent)
    Dom.attr(
      this.selectionContainer,
      'data-selection-length',
      this.collection.length,
    )

    Dom.prepend(this.container, this.selectionContainer)
  }

  protected updateContainerPosition(offset: { dx: number; dy: number }) {
    if (offset.dx || offset.dy) {
      const scale = this.graph.transform.getScale()
      // 使用 transform，避免频繁修改 left/top
      this.containerOffsetX += offset.dx * scale.sx
      this.containerOffsetY += offset.dy * scale.sy
      Dom.css(
        this.container,
        'transform',
        `translate3d(${this.containerOffsetX}px, ${this.containerOffsetY}px, 0)`,
      )
    }
  }

  protected updateContainer() {
    const origin = { x: Infinity, y: Infinity }
    const corner = { x: 0, y: 0 }
    const cells = this.collection
      .toArray()
      .filter((cell) => this.canShowSelectionBox(cell))

    cells.forEach((cell) => {
      const view = this.graph.renderer.findViewByCell(cell)
      if (view) {
        const bbox = view.getBBox({
          useCellGeometry: true,
        })
        origin.x = Math.min(origin.x, bbox.x)
        origin.y = Math.min(origin.y, bbox.y)
        corner.x = Math.max(corner.x, bbox.x + bbox.width)
        corner.y = Math.max(corner.y, bbox.y + bbox.height)
      }
    })

    Dom.css(this.selectionContainer, {
      position: 'absolute',
      pointerEvents: this.options.movable ? 'auto' : 'none',
      cursor: this.options.movable ? 'move' : 'default',
      left: origin.x,
      top: origin.y,
      width: corner.x - origin.x,
      height: corner.y - origin.y,
    })
    Dom.attr(
      this.selectionContainer,
      'data-selection-length',
      this.collection.length,
    )

    const boxContent = this.options.content
    if (boxContent) {
      if (typeof boxContent === 'function') {
        const content = FunctionExt.call(
          boxContent,
          this.graph,
          this,
          this.selectionContent,
        )
        if (content) {
          this.selectionContent.innerHTML = content
        }
      } else {
        this.selectionContent.innerHTML = boxContent
      }
    }

    if (this.collection.length > 0 && !this.container.parentNode) {
      Dom.appendTo(this.container, this.graph.container)
    } else if (this.collection.length <= 0 && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }

    this.renderGroupTransformHandles()
  }

  protected canShowSelectionBox(cell: Cell) {
    return (
      (cell.isNode() && this.options.showNodeSelectionBox === true) ||
      (cell.isEdge() && this.options.showEdgeSelectionBox === true)
    )
  }

  protected getPointerEventsValue(
    pointerEvents: 'none' | 'auto' | ((cells: Cell[]) => 'none' | 'auto'),
  ) {
    return typeof pointerEvents === 'string'
      ? pointerEvents
      : pointerEvents(this.cells)
  }

  protected createSelectionBox(cell: Cell) {
    this.addCellSelectedClassName(cell)

    if (this.canShowSelectionBox(cell)) {
      const view = this.graph.renderer.findViewByCell(cell)
      if (view) {
        const bbox = view.getBBox({
          useCellGeometry: true,
        })

        const className = this.boxClassName
        const box = document.createElement('div')
        const pointerEvents = this.options.pointerEvents
        Dom.addClass(box, className)
        Dom.addClass(box, `${className}-${cell.isNode() ? 'node' : 'edge'}`)
        Dom.attr(box, 'data-cell-id', cell.id)
        Dom.css(box, {
          position: 'absolute',
          left: bbox.x,
          top: bbox.y,
          width: bbox.width,
          height: bbox.height,
          pointerEvents: pointerEvents
            ? this.getPointerEventsValue(pointerEvents)
            : 'auto',
        })
        Dom.appendTo(box, this.container)
        this.showSelected()
        this.boxCount += 1
      }
    }
  }

  protected updateSelectionBoxes() {
    if (this.collection.length > 0) {
      if (this.isDragging) {
        return
      }

      if (this.updateThrottleTimer) {
        clearTimeout(this.updateThrottleTimer)
      }

      // 节流：限制更新频率到60fps
      this.updateThrottleTimer = setTimeout(() => {
        this.refreshSelectionBoxes()
        this.updateThrottleTimer = null
      }, 16)
    }
  }

  protected refreshSelectionBoxes() {
    Dom.remove(this.$boxes)
    this.boxCount = 0

    this.collection.toArray().forEach((cell) => {
      this.createSelectionBox(cell)
    })

    this.updateContainer()
    this.boxesUpdated = true
  }

  // 按当前视图几何同步每个选择框的位置与尺寸
  protected repositionSelectionBoxesInPlace() {
    const boxes = this.$boxes
    if (boxes.length === 0) {
      this.refreshSelectionBoxes()
      return
    }

    for (const elem of boxes) {
      const id = elem.getAttribute('data-cell-id')
      if (!id) continue
      const cell = this.collection.get(id)
      if (!cell) continue
      const view = this.graph.renderer.findViewByCell(cell)
      if (!view) continue
      const bbox = view.getBBox({ useCellGeometry: true })
      Dom.css(elem, {
        left: bbox.x,
        top: bbox.y,
        width: bbox.width,
        height: bbox.height,
      })
    }

    this.updateContainer()
    this.boxesUpdated = true
  }

  protected getCellViewFromElem(elem: Element) {
    const id = elem.getAttribute('data-cell-id')
    if (id) {
      const cell = this.collection.get(id)
      if (cell) {
        return this.graph.renderer.findViewByCell(cell)
      }
    }
    return null
  }

  protected onCellRemoved({ cell }: CollectionEventArgs['removed']) {
    this.destroySelectionBox(cell)
    if (!this.batchUpdating) this.updateContainer()
  }

  protected onReseted({ previous, current }: CollectionEventArgs['reseted']) {
    this.destroyAllSelectionBoxes(previous)
    current.forEach((cell) => {
      this.listenCellRemoveEvent(cell)
      this.createSelectionBox(cell)
    })
    this.updateContainer()
  }

  protected onCellAdded({ cell }: CollectionEventArgs['added']) {
    // The collection do not known the cell was removed when cell was
    // removed by interaction(such as, by "delete" shortcut), so we should
    // manually listen to cell's remove event.
    this.listenCellRemoveEvent(cell)
    this.createSelectionBox(cell)
    if (!this.batchUpdating) this.updateContainer()
  }

  protected listenCellRemoveEvent(cell: Cell) {
    cell.off('removed', this.onCellRemoved, this)
    cell.on('removed', this.onCellRemoved, this)
  }

  protected onCollectionUpdated({
    added,
    removed,
    options,
  }: CollectionEventArgs['updated']) {
    added.forEach((cell) => {
      this.trigger('cell:selected', { cell, options })
      if (cell.isNode()) {
        this.trigger('node:selected', { cell, options, node: cell })
      } else if (cell.isEdge()) {
        this.trigger('edge:selected', { cell, options, edge: cell })
      }
    })

    removed.forEach((cell) => {
      this.trigger('cell:unselected', { cell, options })
      if (cell.isNode()) {
        this.trigger('node:unselected', { cell, options, node: cell })
      } else if (cell.isEdge()) {
        this.trigger('edge:unselected', { cell, options, edge: cell })
      }
    })

    const args = {
      added,
      removed,
      options,
      selected: this.cells.filter((cell) => !!this.graph.getCellById(cell.id)),
    }
    this.trigger('selection:changed', args)
  }

  // #endregion

  @disposable()
  dispose() {
    this.clean()
    this.remove()
    this.off()
  }
}

type SelectionEventType = 'leftMouseDown' | 'mouseWheelDown'

export interface SelectionImplCommonOptions {
  model?: Model
  collection?: Collection
  className?: string
  strict?: boolean
  filter?: SelectionImplFilter
  modifiers?: string | ModifierKey[] | null
  multiple?: boolean
  multipleSelectionModifiers?: string | ModifierKey[] | null

  selectCellOnMoved?: boolean
  selectNodeOnMoved?: boolean
  selectEdgeOnMoved?: boolean

  showEdgeSelectionBox?: boolean
  showNodeSelectionBox?: boolean
  movable?: boolean
  following?: boolean
  content?: SelectionImplContent

  // Can select node or edge when rubberband
  rubberband?: boolean
  rubberNode?: boolean
  rubberEdge?: boolean

  // Whether to respond event on the selectionBox
  pointerEvents?: 'none' | 'auto' | ((cells: Cell[]) => 'none' | 'auto')

  // with which mouse button the selection can be started
  eventTypes?: SelectionEventType[]
  movingRouterFallback?: string

  // Group transform: resize/rotate all selected nodes as a whole
  resizable?:
    | boolean
    | {
        minWidth?: number
        minHeight?: number
        preserveAspectRatio?: boolean
      }
  rotatable?:
    | boolean
    | {
        grid?: number
      }
}

export interface SelectionImplOptions extends SelectionImplCommonOptions {
  graph: Graph
}

export type SelectionImplContent =
  | null
  | false
  | string
  | ((
      this: Graph,
      selection: SelectionImpl,
      contentElement: HTMLElement,
    ) => string)

export type SelectionImplFilter =
  | null
  | (string | { id: string })[]
  | ((this: Graph, cell: Cell) => boolean)

export interface SelectionImplSetOptions extends CollectionSetOptions {
  batch?: boolean
}

export interface SelectionImplAddOptions extends CollectionAddOptions {}

export interface SelectionImplRemoveOptions extends CollectionRemoveOptions {}

interface BaseSelectionBoxEventArgs<T> {
  e: T
  view: CellView | null
  cell: Cell | null
  x: number
  y: number
  nodes: Node[]
  edges: Edge[]
}

export interface SelectionImplBoxEventArgsRecord {
  'box:mousedown': BaseSelectionBoxEventArgs<Dom.MouseDownEvent>
  'box:mousemove': BaseSelectionBoxEventArgs<Dom.MouseMoveEvent>
  'box:mouseup': BaseSelectionBoxEventArgs<Dom.MouseUpEvent>
}

export interface SelectionImplEventArgsRecord {
  'cell:selected': { cell: Cell; options: SetOptions }
  'node:selected': { cell: Cell; node: Node; options: SetOptions }
  'edge:selected': { cell: Cell; edge: Edge; options: SetOptions }
  'cell:unselected': { cell: Cell; options: SetOptions }
  'node:unselected': { cell: Cell; node: Node; options: SetOptions }
  'edge:unselected': { cell: Cell; edge: Edge; options: SetOptions }
  'selection:changed': {
    added: Cell[]
    removed: Cell[]
    selected: Cell[]
    options: SetOptions
  }
  'selection:rotate': { cells: Node[]; angle: number }
  'selection:rotating': { cells: Node[]; angle: number }
  'selection:rotated': { cells: Node[]; angle: number }
  'selection:resize': { cells: Node[] }
  'selection:resizing': { cells: Node[] }
  'selection:resized': { cells: Node[] }
}

export interface SelectionImplEventArgs
  extends SelectionImplBoxEventArgsRecord,
    SelectionImplEventArgsRecord {}

// private
// -------
const baseClassName = 'widget-selection'

export const classNames = {
  root: baseClassName,
  inner: `${baseClassName}-inner`,
  box: `${baseClassName}-box`,
  content: `${baseClassName}-content`,
  rubberband: `${baseClassName}-rubberband`,
  selected: `${baseClassName}-selected`,
  groupResize: `${baseClassName}-group-resize`,
  groupRotate: `${baseClassName}-group-rotate`,
}

export const documentEvents = {
  mousemove: 'adjustSelection',
  touchmove: 'adjustSelection',
  mouseup: 'onMouseUp',
  touchend: 'onMouseUp',
  touchcancel: 'onMouseUp',
}

export function depthComparator(cell: Cell) {
  return cell.getAncestors().length
}

export interface CommonEventData {
  action: 'selecting' | 'translating' | 'group-rotating' | 'group-resizing'
}

export interface SelectingEventData extends CommonEventData {
  action: 'selecting'
  moving?: boolean
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  scrollerX: number
  scrollerY: number
}

export interface TranslatingEventData extends CommonEventData {
  action: 'translating'
  clientX: number
  clientY: number
  originX: number
  originY: number
}

export interface SelectionBoxEventData {
  activeView: CellView
}

export interface RotationEventData {
  rotated?: boolean
  center: PointLike
  start: number
  angles: { [id: string]: number }
}

export interface ResizingEventData {
  resized?: boolean
  bbox: Rectangle
  cells: Cell[]
  minWidth: number
  minHeight: number
}

export interface GroupTransformEventData extends CommonEventData {
  center: PointLike
}

export interface GroupRotatingEventData extends CommonEventData {
  action: 'group-rotating'
  center: PointLike
}

export interface GroupResizingEventData extends CommonEventData {
  action: 'group-resizing'
  direction: ResizeDirection
  origBBox: Rectangle
  startX: number
  startY: number
}

export interface NodeSnapshot {
  node: Node
  relX: number
  relY: number
  relW: number
  relH: number
  angle: number
}

export interface RotateNodeSnapshot {
  node: Node
  centerX: number
  centerY: number
  width: number
  height: number
  angle: number
}
