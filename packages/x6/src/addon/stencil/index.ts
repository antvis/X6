import { Util } from '../../global'
import { FunctionExt } from '../../util'
import { Rectangle, Point } from '../../geometry'
import { Cell, Node, Model } from '../../model'
import { View, CellView, NodeView } from '../../view'
import { Graph } from '../../graph'
import { EventArgs } from '../../graph/events'
import { Scroller } from '../scroller'
import { Snapline } from '../snapline'

// const inst = {
//   options() {
//     return {
//       columnWidth: this.options.width / 2 - 10,
//       columns: 2,
//       rowHeight: 80,
//       resizeToFit: true,
//       dy: 10,
//       dx: 10,
//     }
//   },
//   layoutGroup(x, view) {
//     var opts = this.options.layout
//     if (((view = view || {}), !GridLayout)) {
//       throw new Error(
//         'joint.ui.Stencil: joint.layout.GridLayout is not available.',
//       )
//     }
//     GridLayout.layout(x, extend({}, opts, view.layout))
//   },
// }

export class Stencil extends View {
  protected readonly options: Stencil.Options
  protected readonly graphs: { [groupName: string]: Graph }
  protected readonly $groups: { [groupName: string]: JQuery<HTMLElement> }
  protected readonly $container: JQuery<HTMLDivElement>
  protected readonly $content: JQuery<HTMLDivElement>
  protected readonly $graggingGraph: JQuery<HTMLDivElement>
  protected readonly draggingGraph: Graph
  protected draggingData: {
    node: Node
    view: NodeView
    bbox: Rectangle
    nodeBBox: Rectangle
    nodeOffset: Point.PointLike
    padding: number
    pageOffset: Point.PointLike
    snapOffset: Point.PointLike
  }

  protected cloneNode: Node | null
  protected cloneView: NodeView | null
  protected cloneBBox: Rectangle
  protected cloneGeometryBBox: Rectangle
  protected cloneViewDeltaOrigin: Point
  protected graphDragPadding: number | null
  protected paperDragInitialOffset: null | { left: number; top: number }
  protected cloneSnapOffset: Point.PointLike | null

  protected readonly DEFAULT_GROUP = '__default__'

  protected get targetScroller() {
    const graph = this.options.graph
    return graph instanceof Graph ? null : graph
  }

  protected get targetGraph() {
    const graph = this.options.graph
    return graph instanceof Graph ? graph : graph.graph
  }

  protected get targetModel() {
    return this.targetGraph.model
  }

  constructor(options: Partial<Stencil.Options> & { graph: Graph | Scroller }) {
    super()

    this.graphs = {}
    this.$groups = {}
    this.options = {
      ...Stencil.defaultOptions,
      ...options,
    } as Stencil.Options

    this.onSearch = FunctionExt.debounce(this.onSearch, 200)

    this.container = View.createElement('div')
    this.$container = this.$(this.container).addClass(
      this.prefixClassName('widget-stencil'),
    )

    this.$content = this.renderContent()
    this.$graggingGraph = this.renderPaperDrag()

    this.$container.empty().append(this.$graggingGraph, this.$content)
    if (options.search) {
      this.$container.addClass('searchable').prepend(this.renderSearch())
    }

    if (options.groupsToggleButtons) {
      this.$container.addClass('collapsible').prepend(this.renderToggleAll())
    }

    const globalGraphOptions = options.graphOptions || {}

    if (options.groups && options.groups.length) {
      options.groups.forEach((group) => {
        const $group = this.renderGroup(group).appendTo(this.$content)
        const graphOptionsInGroup = group.graphOptions
        const graph = new Graph({
          ...globalGraphOptions,
          ...graphOptionsInGroup,
          container: $group.find('.elements')[0],
          model: globalGraphOptions.model || new Model(),
          width: group.width || options.width,
          height: group.height || options.height,
          interactive: false,
          preventDefaultBlankAction: false,
        })

        this.$groups[group.name] = $group
        this.graphs[group.name] = graph
      })
    } else {
      const $container = this.renderElementsContainer().appendTo(this.$content)
      const graph = new Graph({
        ...globalGraphOptions,
        container: $container[0],
        model: globalGraphOptions.model || new Model(),
        width: options.width,
        height: options.height,
        interactive: false,
        preventDefaultBlankAction: false,
      })
      this.graphs[this.DEFAULT_GROUP] = graph
    }

    const draggingGraphOptions = options.draggingGraphOptions || {}
    const draggingModel =
      draggingGraphOptions.model || globalGraphOptions.model || new Model()
    this.draggingGraph = new Graph({
      ...draggingGraphOptions,
      container: this.$graggingGraph[0],
      width: 1,
      height: 1,
      model: draggingModel,
    })

    this.startListening()
    return this
  }

  init() {
    this.initializeLayout()
  }

  initializeLayout() {
    // const layout = this.options.layout
    // if (layout) {
    //   if (typeof layout === 'function') {
    //     this.layoutGroup = layout
    //   } else {
    //     this.layoutGroup = inst.layoutGroup.bind(this)
    //     this.options.layout = isObject(layout) ? layout : {}
    //     merge(this.options.layout, inst.options.call(this))
    //   }
    // }
  }

  protected renderContent() {
    return this.$('<div/>').addClass(
      this.prefixClassName('widget-stencil-content'),
    )
  }

  protected renderPaperDrag() {
    return this.$('<div/>').addClass('stencil-paper-drag')
  }

  protected renderSearch() {
    return this.$('<div/>')
      .addClass('search-wrap')
      .append(
        $('<input/>', {
          type: 'search',
          placeholder: 'search',
        }).addClass('search'),
      )
  }

  protected renderToggleAll() {
    return [
      this.$('<div/>')
        .addClass('groups-toggle')
        .append(
          this.$('<label/>').addClass('group-label').html(this.options.label),
        )
        .append(this.$('<button/>').text('+').addClass('btn btn-expand'))
        .append(this.$('<button/>').text('-').addClass('btn btn-collapse')),
    ]
  }

  protected renderElementsContainer() {
    return this.$('<div/>').addClass('elements')
  }

  protected renderGroup(group: Stencil.Group) {
    const $group = this.$('<div/>')
      .addClass('group')
      .attr('data-name', group.name)
      .toggleClass('closed', group.closed === true)
    const $title = this.$('<h3/>')
      .addClass('group-label')
      .html(group.label || group.name)
    const $cells = this.renderElementsContainer()
    return $group.append($title, $cells)
  }

  protected startListening() {
    this.delegateEvents({
      'click .btn-expand': 'expandGroups',
      'click .btn-collapse': 'collapseGroups',
      'click .groups-toggle > .group-label': 'expandGroups',
      'click .group > .group-label': 'onGroupLabelClick',
      'touchstart .group > .group-label': 'onGroupLabelClick',
      'input .search': 'onSearch',
      'focusin .search': 'onSearchFocusIn',
      'focusout .search': 'onSearchFocusOut',
    })

    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.on('cell:mousedown', this.onDragStart, this)
    })
  }

  protected stopListening() {
    this.undelegateEvents()
    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.off('cell:mousedown', this.onDragStart, this)
    })
  }

  load(groups: { [groupName: string]: (Node | Node.Metadata)[] }): this
  load(nodes: (Node | Node.Metadata)[], groupName?: string): this
  load(
    data:
      | { [groupName: string]: (Node | Node.Metadata)[] }
      | (Node | Node.Metadata)[],
    groupName?: string,
  ) {
    if (Array.isArray(data)) {
      this.loadGroup(data, groupName)
    } else {
      if (this.options.groups) {
        Object.keys(this.options.groups).forEach((groupName) => {
          if (data[groupName]) {
            this.loadGroup(data[groupName], groupName)
          }
        })
      }
    }
    return this
  }

  loadGroup(cells: (Node | Node.Metadata)[], groupName?: string) {
    const model = this.getModel(groupName)
    if (model) {
      const nodes = cells.map((c) => (c instanceof Node ? c : Node.create(c)))
      model.resetCells(nodes)
    }

    const group = this.getGroup(groupName)
    let height = this.options.height
    if (group && group.height != null) {
      height = group.height
    }

    // this.isLayoutEnabled() && this.layoutGroup(model, group)

    if (!height) {
      const graph = this.getGraph(groupName)
      graph.fitToContent({
        minWidth: graph.options.width,
        gridHeight: 1,
        padding: this.options.paperPadding || 10,
      })
    }

    return this
  }

  protected isLayoutEnabled() {
    return !!this.options.layout
  }

  protected prepareDragging(view: CellView, clientX: number, clientY: number) {
    const graphDrag = this.draggingGraph
    const modelDrag = graphDrag.model

    this.$(graphDrag.container).addClass('dragging').appendTo(document.body)

    const nodeDrag = this.options.dragStartClone(view.cell as Node).pos(0, 0)
    let padding = 5
    const snaplines = this.options.snaplines
    if (snaplines != null) {
      padding += snaplines.options.distance || 0
    }

    if (snaplines || this.options.scaleClones) {
      const scale = this.targetGraph.scale()
      graphDrag.scale(scale.sx, scale.sy)
      padding *= Math.max(scale.sx, scale.sy)
    } else {
      graphDrag.scale(1, 1)
    }

    this.clearClone()

    if (this.options.dropAnimation) {
      this.$(this.draggingGraph.container).stop(true, true)
    }

    modelDrag.resetCells([nodeDrag.pos(0, 0)])

    const viewDrag = graphDrag.renderer.findViewByCell(nodeDrag) as NodeView
    viewDrag.undelegateEvents()
    graphDrag.fitToContent({
      padding,
      allowNewOrigin: 'any',
    })

    const bbox = viewDrag.getBBox()
    this.cloneGeometryBBox = viewDrag.getBBox({
      fromCell: true,
    })
    this.cloneViewDeltaOrigin = this.cloneGeometryBBox
      .getTopLeft()
      .diff(bbox.getTopLeft())
    this.cloneBBox = nodeDrag.getBBox()
    this.cloneNode = nodeDrag
    this.cloneView = viewDrag
    this.graphDragPadding = padding
    this.paperDragInitialOffset = this.setGraphDragOffset(clientX, clientY)
  }

  protected setGraphDragOffset(x: number, y: number) {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop
    const delta = this.cloneViewDeltaOrigin
    const nodeBBox = this.cloneGeometryBBox
    const padding = this.graphDragPadding || 5
    const offset = {
      left: x - delta.x - nodeBBox.width / 2 - padding,
      top: y - delta.y - nodeBBox.height / 2 - padding + scrollTop,
    }

    if (this.draggingGraph) {
      this.$(this.draggingGraph.container).offset(offset)
    }

    return offset
  }

  protected setCloneLocalPosition(x: number, y: number) {
    const local = this.targetGraph.clientToLocalPoint({ x, y })
    const cloneBBox = this.cloneBBox!
    local.x -= cloneBBox.width / 2
    local.y -= cloneBBox.height / 2
    this.cloneNode!.pos(local.x, local.y)
    return local
  }

  protected onDragStart(args: EventArgs['node:mousedown']) {
    const { e, view } = args

    e.preventDefault()

    this.targetModel.startBatch('stencil-drag')

    this.$container.addClass('dragging')
    this.prepareDragging(view, e.clientX, e.clientY)
    const local = this.setCloneLocalPosition(e.clientX, e.clientY)
    const snaplines = this.options.snaplines
    if (snaplines) {
      snaplines.captureCursorOffset({
        ...args,
        view: this.cloneView!,
        x: local.x,
        y: local.y,
      })
      this.cloneNode!.on('change:position', this.onCloneSnapped, this)
    }
    this.delegateDocumentEvents(Stencil.documentEvents, e.data)
  }

  protected onCloneSnapped({
    node,
    current,
    options,
  }: Cell.EventArgs['change:position']) {
    if (options.snapped) {
      const bbox = this.cloneBBox
      node.pos(bbox.x + options.tx, bbox.y + options.ty, {
        silent: true,
      })
      this.cloneView!.translate()
      node.pos(current!.x, current!.y, {
        silent: true,
      })

      this.cloneSnapOffset = {
        x: options.tx,
        y: options.ty,
      }
    } else {
      this.cloneSnapOffset = null
    }
  }

  onDrag(evt: JQuery.MouseMoveEvent) {
    const cloneView = this.cloneView
    if (cloneView) {
      evt.preventDefault()
      const e = this.normalizeEvent(evt)
      const clientX = e.clientX
      const clientY = e.clientY
      this.setGraphDragOffset(clientX, clientY)
      const local = this.setCloneLocalPosition(clientX, clientY)
      const embeddingMode = this.targetGraph.options.embedding.enabled
      const snaplines = this.options.snaplines
      const embedding =
        (embeddingMode || snaplines) &&
        this.isInsideValidArea({
          x: clientX,
          y: clientY,
        })

      if (embeddingMode) {
        cloneView.setEventData(e, { graph: this.targetGraph })
        const data = cloneView.getEventData<any>(e)
        if (embedding) {
          cloneView.processEmbedding(data)
        } else {
          cloneView.clearEmbedding(data)
        }
      }

      if (snaplines) {
        if (embedding) {
          snaplines.snapWhileMoving({
            e,
            view: cloneView!,
            x: local.x,
            y: local.y,
          } as EventArgs['node:mousemove'])
        } else {
          snaplines.hide()
        }
      }
    }
  }

  onDragEnd(evt: JQuery.MouseUpEvent) {
    const cloneNode = this.cloneNode
    if (cloneNode) {
      const e = this.normalizeEvent(evt)
      const cloneView = this.cloneView
      const cloneBBox = this.cloneBBox
      const cloneSnapOffset = this.cloneSnapOffset
      let x = cloneBBox.x
      let y = cloneBBox.y

      if (cloneSnapOffset) {
        x = x + cloneSnapOffset.x
        y = y + cloneSnapOffset.y
      }

      cloneNode.pos(x, y, { silent: true })

      const node = this.options.dragEndClone(cloneNode)
      if (
        this.drop(node, {
          x: e.clientX,
          y: e.clientY,
        })
      ) {
        this.onDropEnd(cloneNode)
      } else {
        this.onDropInvalid(e, node)
      }

      if (this.targetGraph.options.embedding.enabled && cloneView) {
        cloneView.setEventData(e, {
          model: node,
          graph: this.targetGraph,
        })
        cloneView.finalizeEmbedding(cloneView.getEventData<any>(e))
      }

      this.targetModel.stopBatch('stencil-drag')
    }
  }

  protected clearClone() {
    if (this.cloneNode) {
      this.cloneNode.remove()
      this.cloneNode = null
      this.cloneView = null
      this.cloneSnapOffset = null
      this.paperDragInitialOffset = null
      this.graphDragPadding = null
    }
  }

  protected onDropEnd(node: Node) {
    if (this.cloneNode === node) {
      this.clearClone()
      this.$container.append(this.draggingGraph.container)
      this.$container.removeClass('dragging')
      this.$(this.draggingGraph.container).removeClass('dragging')
    }
  }

  protected onDropInvalid(evt: JQuery.MouseUpEvent, node?: Node) {
    const cloneNode = this.cloneNode
    if (cloneNode) {
      this.trigger('drop:invalid', {
        e: this.normalizeEvent(evt),
        node: node || this.options.dragEndClone(cloneNode),
      })

      const anim = this.options.dropAnimation
      if (anim) {
        const duration = (typeof anim === 'object' && anim.duration) || 150
        const easing = (typeof anim === 'object' && anim.easing) || 'swing'

        this.cloneView = null

        this.$(this.draggingGraph.container).animate(
          this.paperDragInitialOffset!,
          duration,
          easing,
          () => this.onDropEnd(cloneNode),
        )
      } else {
        this.onDropEnd(cloneNode)
      }
    }
  }

  protected isInsideValidArea(p: Point.PointLike) {
    let area: Rectangle
    const targetGraph = this.targetGraph
    const targetScroller = this.targetScroller
    const blank = this.getDropArea(this.container)

    if (targetScroller) {
      if (targetScroller.options.autoResizePaper) {
        area = this.getDropArea(targetScroller.container)
      } else {
        const outter = this.getDropArea(targetScroller.container)
        area = this.getDropArea(targetGraph.container).intersect(outter)!
      }
    } else {
      area = this.getDropArea(targetGraph.container)
    }

    return area && area.containsPoint(p) && !blank.containsPoint(p)
  }

  protected getDropArea(elem: Element) {
    const $elem = this.$(elem)
    const offset = $elem.offset()!
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop
    const scrollLeft =
      document.body.scrollLeft || document.documentElement.scrollLeft
    return Rectangle.create({
      x:
        offset.left + parseInt($elem.css('border-left-width'), 10) - scrollLeft,
      y: offset.top + parseInt($elem.css('border-top-width'), 10) - scrollTop,
      width: $elem.innerWidth()!,
      height: $elem.innerHeight()!,
    })
  }

  protected drop(node: Node, pos: Point.PointLike) {
    const targetGraph = this.targetGraph
    const targetModel = targetGraph.model
    if (this.isInsideValidArea(pos)) {
      const local = targetGraph.clientToLocalPoint(pos)
      const bbox = node.getBBox()
      local.x += bbox.x - bbox.width / 2
      local.y += bbox.y - bbox.height / 2
      const gridSize = this.cloneSnapOffset ? 1 : targetGraph.getGridSize()

      node.pos(
        Util.snapToGrid(local.x, gridSize),
        Util.snapToGrid(local.y, gridSize),
      )

      node.removeZIndex()
      targetModel.addCell(node, { stencil: this.cid })

      return true
    }
    return false
  }

  protected filter(
    keyworld: string,
    filter?: Stencil.Filters | Stencil.FilterFn,
  ) {
    const found = Object.keys(this.graphs).reduce((memo, groupName) => {
      const graph = this.graphs[groupName]
      const name = groupName === this.DEFAULT_GROUP ? null : groupName
      const items = graph.model.getCells().filter((cell) => {
        let matched = false
        matched =
          typeof filter === 'function'
            ? filter.call(this, cell, keyworld, name, this)
            : this.isCellMatched(
                cell,
                keyworld,
                filter,
                keyworld.toLowerCase() !== keyworld,
              )

        const view = graph.renderer.findViewByCell(cell)
        if (view) {
          view.$(view.container).toggleClass('unmatched', !matched)
        }

        return matched
      })

      const found = items.length > 0
      const opts = this.options
      // const a = (
      //   (assign(opts, 'paperOptions') || {}).model || new Error()
      // ).resetCells(items)

      // this.trigger('filter', a, groupName, keyworld)

      // if (this.isLayoutEnabled()) {
      //   // this.layoutGroup(a, this.getGroup(groupName))
      // }

      if (this.$groups[groupName]) {
        this.$groups[groupName].toggleClass('unmatched', !found)
      }

      graph.fitToContent({
        gridWidth: 1,
        gridHeight: 1,
        padding: opts.paperPadding || 10,
      })

      return memo || found
    }, false)

    this.$container.toggleClass('not-found', !found)
  }

  protected isCellMatched(
    cell: Cell,
    keyworld: string,
    filters: Stencil.Filters | undefined,
    ignoreCase: boolean,
  ) {
    if (keyworld && filters) {
      return Object.keys(filters).some((type) => {
        const paths = filters[type]
        return (
          ('*' === type || cell.type === type) &&
          paths.some((path) => {
            let val = cell.getPropByPath<string>(path)
            if (val != null) {
              val = `${val}`
              if (ignoreCase) {
                val = val.toLowerCase()
              }
              return val.indexOf(keyworld) >= 0
            }
          })
        )
      })
    }
    return true
  }

  protected onSearch(evt: JQuery.TriggeredEvent) {
    this.filter(evt.target.value as string, this.options.search)
  }

  protected onSearchFocusIn() {
    this.$container.addClass('is-focused')
  }

  protected onSearchFocusOut() {
    this.$container.removeClass('is-focused')
  }

  protected onGroupLabelClick(evt: JQuery.TriggeredEvent) {
    const $group = this.$(evt.target).closest('.group')
    this.toggleGroup($group.attr('data-name') || '')
  }

  getModel(groupName?: string) {
    const graph = this.getGraph(groupName)
    return graph ? graph.model : null
  }

  getGraph(groupName?: string) {
    return this.graphs[groupName || this.DEFAULT_GROUP]
  }

  getGroup(groupName?: string) {
    const groups = this.options.groups
    if (groupName != null && groups && groups.length) {
      return groups.find((group) => group.name === groupName)
    }
    return null
  }

  toggleGroup(groupName: string) {
    if (this.isGroupCollapsed(groupName)) {
      this.collapseGroup(groupName)
    } else {
      this.expandGroup(groupName)
    }
    return this
  }

  collapseGroup(groupName: string) {
    const $group = this.$groups[groupName]
    if ($group && !this.isGroupCollapsed(groupName)) {
      this.trigger('group:collapse', { name: groupName })
      $group.addClass('collapsed')
    }
    return this
  }

  expandGroup(groupName: string) {
    const $group = this.$groups[groupName]
    if ($group && this.isGroupCollapsed(groupName)) {
      this.trigger('group:expand', { name: groupName })
      $group.removeClass('collapsed')
    }
    return this
  }

  isGroupCollapsed(groupName: string) {
    const $group = this.$groups[groupName]
    return $group && $group.hasClass('collapsed')
  }

  collapseGroups() {
    Object.keys(this.$groups).forEach((groupName) =>
      this.collapseGroup(groupName),
    )
    return this
  }

  expandGroups() {
    Object.keys(this.$groups).forEach((groupName) =>
      this.expandGroup(groupName),
    )
    return this
  }

  onRemove() {
    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.view.remove()
      delete this.graphs[groupName]
    })

    if (this.draggingGraph) {
      this.draggingGraph.view.remove()
    }
    this.stopListening()
    this.undelegateDocumentEvents()
  }
}

export namespace Stencil {
  export interface Options {
    graph: Graph | Scroller
    label: string
    width: string | number
    height: string | number
    paperPadding?: number
    dropAnimation?:
      | boolean
      | {
          duration?: number
          easing?: string
        }
    layout?: any
    search?: Filters | FilterFn
    groupsToggleButtons?: any
    graphOptions?: any
    draggingGraphOptions?: any
    scaleClones?: boolean
    snaplines?: Snapline
    groups?: Group[]
    dragStartClone: (cell: Node) => Node
    dragEndClone: (cell: Node) => Node
  }

  export type Filters = { [type: string]: string[] }
  export type FilterFn = (
    this: Stencil,
    cell: Node,
    keyworld: string,
    groupName: string,
    stencil: Stencil,
  ) => boolean

  export interface Group {
    name: string
    label?: string
    closed?: boolean
    width?: number | string
    height?: number | string
    graphOptions?: any
  }

  export const defaultOptions: Partial<Options> = {
    width: 200,
    height: 800,
    label: 'Stencil',
    groupsToggleButtons: false,
    dropAnimation: false,
    dragStartClone: (cell) => cell.clone(),
    dragEndClone: (cell) => cell.clone(),
  }

  export const documentEvents = {
    mousemove: 'onDrag',
    touchmove: 'onDrag',
    mouseup: 'onDragEnd',
    touchend: 'onDragEnd',
    touchcancel: 'onDragEnd',
  }
}
