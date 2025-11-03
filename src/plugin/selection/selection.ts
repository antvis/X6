import {
  Dom,
  disposable,
  FunctionExt,
  type KeyValue,
  type ModifierKey,
} from '../../common'
import { type Point, Rectangle, type PointLike } from '../../geometry'
import type { Graph } from '../../graph'
import { Cell, Collection, type Edge, type Model, type Node } from '../../model'
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
  }: Collection.EventArgs['node:change:position']) {
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

  protected onModelUpdated({ removed }: Collection.EventArgs['updated']) {
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
      if (options.batch) {
        const filterCells = this.filter(Array.isArray(cells) ? cells : [cells])
        this.collection.reset(filterCells, { ...options, ui: true })
        return this
      }

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

      if (removed.length === 0 && added.length === 0) {
        this.updateContainer()
      }

      return this
    }

    return this.clean(options)
  }

  clean(options: SelectionImplSetOptions = {}) {
    if (this.length) {
      if (options.batch === false) {
        this.unselect(this.cells, options)
      } else {
        this.collection.reset([], { ...options, ui: true })
      }
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
        let width = Dom.width(this.container)
        let height = Dom.height(this.container)
        const offset = Dom.offset(this.container)
        const origin = graph.pageToLocal(offset.left, offset.top)
        const scale = graph.transform.getScale()
        width /= scale.sx
        height /= scale.sy
        const rect = new Rectangle(origin.x, origin.y, width, height)
        const cells = this.getCellViewsInArea(rect).map((view) => view.cell)
        this.reset(cells, { batch: true })
        this.hideRubberband()
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
        this.graph.model.stopBatch('move-selection')
        // 清理本次拖拽缓存
        this.translatingCache = null
        this.notifyBoxEvent('box:mouseup', evt, client.x, client.y)
        this.repositionSelectionBoxesInPlace()
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
    // 避免触发鼠标命中节点自身的拖拽逻辑
    evt.stopPropagation()
    evt.preventDefault?.()

    const e = this.normalizeEvent(evt)

    if (this.options.movable) {
      this.startTranslating(e)
    }

    const activeView = this.getCellViewFromElem(e.target)
    if (activeView) {
      this.setEventData<SelectionBoxEventData>(e, { activeView })
      const client = this.graph.snapToGrid(e.clientX, e.clientY)
      this.notifyBoxEvent('box:mousedown', e, client.x, client.y)
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

  private getRestrictArea(): Rectangle.RectangleLike | null {
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
        this.notifyBoxEvent('box:mousemove', evt, client.x, client.y)
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

  protected notifyBoxEvent<
    K extends keyof SelectionImplBoxEventArgsRecord,
    T extends Dom.EventObject,
  >(name: K, e: T, x: number, y: number) {
    const data = this.getEventData<SelectionBoxEventData>(e)
    const view = data.activeView
    this.trigger(name, { e, view, x, y, cell: view.cell })
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
      pointerEvents: 'none',
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

  protected onCellRemoved({ cell }: Collection.EventArgs['removed']) {
    this.destroySelectionBox(cell)
    this.updateContainer()
  }

  protected onReseted({ previous, current }: Collection.EventArgs['reseted']) {
    this.destroyAllSelectionBoxes(previous)
    current.forEach((cell) => {
      this.listenCellRemoveEvent(cell)
      this.createSelectionBox(cell)
    })
    this.updateContainer()
  }

  protected onCellAdded({ cell }: Collection.EventArgs['added']) {
    // The collection do not known the cell was removed when cell was
    // removed by interaction(such as, by "delete" shortcut), so we should
    // manually listen to cell's remove event.
    this.listenCellRemoveEvent(cell)
    this.createSelectionBox(cell)
    this.updateContainer()
  }

  protected listenCellRemoveEvent(cell: Cell) {
    cell.off('removed', this.onCellRemoved, this)
    cell.on('removed', this.onCellRemoved, this)
  }

  protected onCollectionUpdated({
    added,
    removed,
    options,
  }: Collection.EventArgs['updated']) {
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

export interface SelectionImplSetOptions extends Collection.SetOptions {
  batch?: boolean
}

export interface SelectionImplAddOptions extends Collection.AddOptions {}

export interface SelectionImplRemoveOptions extends Collection.RemoveOptions {}

interface BaseSelectionBoxEventArgs<T> {
  e: T
  view: CellView
  cell: Cell
  x: number
  y: number
}

export interface SelectionImplBoxEventArgsRecord {
  'box:mousedown': BaseSelectionBoxEventArgs<Dom.MouseDownEvent>
  'box:mousemove': BaseSelectionBoxEventArgs<Dom.MouseMoveEvent>
  'box:mouseup': BaseSelectionBoxEventArgs<Dom.MouseUpEvent>
}

export interface SelectionImplEventArgsRecord {
  'cell:selected': { cell: Cell; options: Model.SetOptions }
  'node:selected': { cell: Cell; node: Node; options: Model.SetOptions }
  'edge:selected': { cell: Cell; edge: Edge; options: Model.SetOptions }
  'cell:unselected': { cell: Cell; options: Model.SetOptions }
  'node:unselected': { cell: Cell; node: Node; options: Model.SetOptions }
  'edge:unselected': { cell: Cell; edge: Edge; options: Model.SetOptions }
  'selection:changed': {
    added: Cell[]
    removed: Cell[]
    selected: Cell[]
    options: Model.SetOptions
  }
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
  action: 'selecting' | 'translating'
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
