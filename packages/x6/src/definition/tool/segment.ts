import { Dom, ObjectExt } from '../../util'
import { Point, Line } from '../../geometry'
import { Graph } from '../../graph'
import { Edge } from '../../model/edge'
import { View } from '../../view/view'
import { Markup } from '../../view/markup'
import { CellView } from '../../view/cell'
import { EdgeView } from '../../view/edge'
import { ToolView } from '../../view/tool'
import * as Util from './util'

export class Segment extends ToolView.Item<EdgeView, Segment.Options> {
  protected handles: Segment.Handle[] = []

  protected get vertices() {
    return this.cellView.cell.getVertices()
  }

  protected onRender() {
    this.resetHandles()
    const edgeView = this.cellView
    const vertices = [...this.vertices]
    vertices.unshift(edgeView.sourcePoint)
    vertices.push(edgeView.targetPoint)

    for (let i = 0, l = vertices.length; i < l - 1; i += 1) {
      const vertex = vertices[i]
      const nextVertex = vertices[i + 1]
      const handle = this.renderHandle(vertex, nextVertex)
      this.stamp(handle.container)
      this.handles.push(handle)
      handle.options.index = i
    }
    return this
  }

  renderHandle(vertex: Point.PointLike, nextVertex: Point.PointLike) {
    const handle = new this.options.handleConstructor!({
      graph: this.graph,
      guard: (evt) => this.guard(evt),
    })

    this.updateHandle(handle, vertex, nextVertex)
    this.container.appendChild(handle.container)
    this.startHandleListening(handle)
    return handle
  }

  update() {
    this.render()
    return this
  }

  protected startHandleListening(handle: Segment.Handle) {
    handle.on('change', this.onHandleChangeStart, this)
    handle.on('changing', this.onHandleChanging, this)
    handle.on('changed', this.onHandleChangeEnd, this)
  }

  protected stopHandleListening(handle: Segment.Handle) {
    handle.off('change', this.onHandleChangeStart, this)
    handle.off('changing', this.onHandleChanging, this)
    handle.off('changed', this.onHandleChangeEnd, this)
  }

  protected resetHandles() {
    const handles = this.handles
    this.handles = []
    if (handles) {
      handles.forEach((handle) => {
        this.stopHandleListening(handle)
        handle.remove()
      })
    }
  }

  protected shiftHandleIndexes(value: number) {
    const handles = this.handles
    for (let i = 0, n = handles.length; i < n; i += 1) {
      handles[i].options.index! += value
    }
  }

  protected resetAnchor(
    type: Edge.TerminalType,
    anchor: Edge.TerminalCellData['anchor'],
  ) {
    const edge = this.cellView.cell
    if (anchor) {
      edge.prop([type, 'anchor'], anchor, {
        rewrite: true,
        ui: true,
        tool: this.cid,
      })
    } else {
      edge.removeProp([type, 'anchor'], {
        ui: true,
        tool: this.cid,
      })
    }
  }

  protected snapHandle(
    handle: Segment.Handle,
    position: Point.PointLike,
    data: Segment.EventData,
  ) {
    const axis = handle.options.axis!
    const index = handle.options.index!
    const edgeView = this.cellView
    const edge = edgeView.cell
    const vertices = edge.getVertices()
    const prev = vertices[index - 2] || data.sourceAnchor
    const next = vertices[index + 1] || data.targetAnchor
    const snapRadius = this.options.snapRadius
    if (Math.abs(position[axis] - prev[axis]) < snapRadius) {
      position[axis] = prev[axis]
    } else if (Math.abs(position[axis] - next[axis]) < snapRadius) {
      position[axis] = next[axis]
    }
    return position
  }

  protected onHandleChanging({
    handle,
    e,
  }: Segment.Handle.EventArgs['changing']) {
    const graph = this.graph
    const options = this.options
    const edgeView = this.cellView
    const edge = edgeView.cell
    const anchorFn = options.anchor

    const axis = handle.options.axis!
    const index = handle.options.index! - 1

    const data = this.getEventData<Segment.EventData>(e)
    const normalizedEvent = this.normalizeEvent(e)
    const coords = graph.snapToGrid(
      normalizedEvent.clientX,
      normalizedEvent.clientY,
    )
    const position = this.snapHandle(handle, coords.clone(), data)
    const offset = this.options.snapHandle ? 0 : coords[axis] - position[axis]
    const vertices = ObjectExt.cloneDeep(edge.getVertices())
    let vertex = vertices[index]
    let nextVertex = vertices[index + 1]

    // First Segment
    const sourceView = edgeView.sourceView
    const sourceBBox = edgeView.sourceBBox
    let changeSourceAnchor = false
    let deleteSourceAnchor = false
    if (!vertex) {
      vertex = edgeView.sourceAnchor.toJSON()
      vertex[axis] = position[axis]
      if (sourceBBox.containsPoint(vertex)) {
        vertex[axis] = position[axis]
        changeSourceAnchor = true
      } else {
        vertices.unshift(vertex)
        this.shiftHandleIndexes(1)
        deleteSourceAnchor = true
      }
    } else if (index === 0) {
      if (sourceBBox.containsPoint(vertex)) {
        vertices.shift()
        this.shiftHandleIndexes(-1)
        changeSourceAnchor = true
      } else {
        vertex[axis] = position[axis]
        deleteSourceAnchor = true
      }
    } else {
      vertex[axis] = position[axis]
    }

    if (typeof anchorFn === 'function' && sourceView) {
      if (changeSourceAnchor) {
        const sourceAnchorPosition = data.sourceAnchor.clone()
        sourceAnchorPosition[axis] = position[axis]
        const sourceAnchor = anchorFn.call(
          edgeView,
          sourceAnchorPosition,
          sourceView,
          edgeView.sourceMagnet || sourceView.container,
          'source',
          edgeView,
        )
        this.resetAnchor('source', sourceAnchor)
      }
      if (deleteSourceAnchor) {
        this.resetAnchor('source', data.sourceAnchorDef)
      }
    }

    // Last segment
    const targetView = edgeView.targetView
    const targetBBox = edgeView.targetBBox
    let changeTargetAnchor = false
    let deleteTargetAnchor = false
    if (!nextVertex) {
      nextVertex = edgeView.targetAnchor.toJSON()
      nextVertex[axis] = position[axis]
      if (targetBBox.containsPoint(nextVertex)) {
        changeTargetAnchor = true
      } else {
        vertices.push(nextVertex)
        deleteTargetAnchor = true
      }
    } else if (index === vertices.length - 2) {
      if (targetBBox.containsPoint(nextVertex)) {
        vertices.pop()
        changeTargetAnchor = true
      } else {
        nextVertex[axis] = position[axis]
        deleteTargetAnchor = true
      }
    } else {
      nextVertex[axis] = position[axis]
    }

    if (anchorFn && targetView) {
      if (changeTargetAnchor) {
        const targetAnchorPosition = data.targetAnchor.clone()
        targetAnchorPosition[axis] = position[axis]
        const targetAnchor = anchorFn.call(
          edgeView,
          targetAnchorPosition,
          targetView,
          edgeView.targetMagnet || targetView.container,
          'target',
          edgeView,
        )
        this.resetAnchor('target', targetAnchor)
      }
      if (deleteTargetAnchor) {
        this.resetAnchor('target', data.targetAnchorDef)
      }
    }

    edge.setVertices(vertices, { ui: true, tool: this.cid })
    this.updateHandle(handle, vertex, nextVertex, offset)
    if (!options.stopPropagation) {
      edgeView.notifyMouseMove(normalizedEvent, coords.x, coords.y)
    }
  }

  protected onHandleChangeStart({
    handle,
    e,
  }: Segment.Handle.EventArgs['change']) {
    const options = this.options
    const handles = this.handles
    const edgeView = this.cellView

    const index = handle.options.index
    if (!Array.isArray(handles)) {
      return
    }

    for (let i = 0, n = handles.length; i < n; i += 1) {
      if (i !== index) {
        handles[i].hide()
      }
    }

    this.focus()
    this.setEventData<Segment.EventData>(e, {
      sourceAnchor: edgeView.sourceAnchor.clone(),
      targetAnchor: edgeView.targetAnchor.clone(),
      sourceAnchorDef: ObjectExt.cloneDeep(
        this.cell.prop(['source', 'anchor']),
      ),
      targetAnchorDef: ObjectExt.cloneDeep(
        this.cell.prop(['target', 'anchor']),
      ),
    })

    this.cell.startBatch('move-segment', { ui: true, tool: this.cid })

    if (!options.stopPropagation) {
      const normalizedEvent = this.normalizeEvent(e)
      const coords = this.graph.snapToGrid(
        normalizedEvent.clientX,
        normalizedEvent.clientY,
      )
      edgeView.notifyMouseDown(normalizedEvent, coords.x, coords.y)
    }
  }

  protected onHandleChangeEnd({ e }: Segment.Handle.EventArgs['changed']) {
    const options = this.options
    const edgeView = this.cellView
    if (options.redundancyRemoval) {
      edgeView.removeRedundantLinearVertices({ ui: true, tool: this.cid })
    }

    const normalizedEvent = this.normalizeEvent(e)
    const coords = this.graph.snapToGrid(
      normalizedEvent.clientX,
      normalizedEvent.clientY,
    )

    this.render()
    this.blur()

    this.cell.stopBatch('move-segment', { ui: true, tool: this.cid })
    if (!options.stopPropagation) {
      edgeView.notifyMouseUp(normalizedEvent, coords.x, coords.y)
    }
    edgeView.checkMouseleave(normalizedEvent)
  }

  protected updateHandle(
    handle: Segment.Handle,
    vertex: Point.PointLike,
    nextVertex: Point.PointLike,
    offset: number = 0,
  ) {
    const precision = this.options.precision || 0
    const vertical = Math.abs(vertex.x - nextVertex.x) < precision
    const horizontal = Math.abs(vertex.y - nextVertex.y) < precision
    if (vertical || horizontal) {
      const segmentLine = new Line(vertex, nextVertex)
      const length = segmentLine.length()
      if (length < this.options.segmentLengthThreshold) {
        handle.hide()
      } else {
        const position = segmentLine.getCenter()
        const axis = vertical ? 'x' : 'y'
        position[axis] += offset || 0
        const angle = segmentLine.vector().vectorAngle(new Point(1, 0))
        handle.position(position.x, position.y, angle, this.cellView)
        handle.show()
        handle.options.axis = axis
      }
    } else {
      handle.hide()
    }
  }

  protected onRemove() {
    this.resetHandles()
  }
}

export namespace Segment {
  export interface Options extends ToolView.Item.Options {
    precision?: number
    handleConstructor?: typeof Handle
    segmentLengthThreshold: number
    redundancyRemoval: boolean
    anchor?: (
      this: EdgeView,
      pos: Point,
      terminalView: CellView,
      terminalMagnet: Element | null,
      terminalType: Edge.TerminalType,
      edgeView: EdgeView,
      toolView: Segment,
    ) => Edge.TerminalCellData['anchor']
    snapRadius: number
    snapHandle: boolean
    stopPropagation: boolean
  }

  export interface EventData {
    sourceAnchor: Point
    targetAnchor: Point
    sourceAnchorDef: Edge.TerminalCellData['anchor']
    targetAnchorDef: Edge.TerminalCellData['anchor']
  }
}

export namespace Segment {
  export class Handle extends View<Handle.EventArgs> {
    public container: SVGElement
    protected lineElem: SVGLineElement
    protected handleElem: SVGElement

    constructor(public options: Handle.Options) {
      super()

      this.container = View.createElement('g', true) as SVGElement

      Dom.addClass(this.container, this.prefixClassName('segment-marker'))

      this.delegateEvents({
        mousedown: 'onMouseDown',
        touchstart: 'onMouseDown',
      })

      const meta = Markup.parseJSONMarkup([
        {
          tagName: 'line',
          selector: 'line',
          attrs: {
            stroke: '#33334F',
            'stroke-width': 2,
            fill: 'none',
            'pointer-events': 'none',
          },
        },
        {
          tagName: 'rect',
          selector: 'handle',
          attrs: {
            width: 20,
            height: 8,
            x: -10,
            y: -4,
            rx: 4,
            ry: 4,
            fill: '#33334F',
            stroke: '#FFFFFF',
            'stroke-width': 2,
          },
        },
      ])

      this.lineElem = meta.selectors.line as SVGLineElement
      this.handleElem = meta.selectors.handle as SVGElement
      this.container.appendChild(meta.fragment)
    }

    position(x: number, y: number, angle: number, view: EdgeView) {
      const matrix = Dom.createSVGMatrix().translate(x, y).rotate(angle)
      const handle = this.handleElem
      handle.setAttribute('transform', Dom.matrixToTransformString(matrix))
      handle.setAttribute(
        'cursor',
        angle % 180 === 0 ? 'row-resize' : 'col-resize',
      )

      const pt = view.getClosestPoint(new Point(x, y))!
      const line = this.lineElem
      line.setAttribute('x1', `${x}`)
      line.setAttribute('y1', `${y}`)
      line.setAttribute('x2', `${pt.x}`)
      line.setAttribute('y2', `${pt.y}`)
    }

    onMouseDown(e: JQuery.MouseDownEvent) {
      if (this.options.guard(e)) {
        return
      }

      this.trigger('change', { e, handle: this })
      e.stopPropagation()
      e.preventDefault()
      this.options.graph.view.undelegateEvents()
      this.delegateDocumentEvents(
        {
          mousemove: 'onMouseMove',
          touchmove: 'onMouseMove',
          mouseup: 'onMouseUp',
          touchend: 'onMouseUp',
          touchcancel: 'onMouseUp',
        },
        e.data,
      )
    }

    onMouseMove(e: JQuery.MouseMoveEvent) {
      this.emit('changing', { e, handle: this })
    }

    onMouseUp(e: JQuery.MouseUpEvent) {
      this.undelegateDocumentEvents()
      this.options.graph.view.delegateEvents()
      this.emit('changed', { e, handle: this })
    }

    show() {
      this.container.style.display = ''
    }

    hide() {
      this.container.style.display = 'none'
    }
  }

  export namespace Handle {
    export interface Options {
      graph: Graph
      guard: (evt: JQuery.TriggeredEvent) => boolean
      index?: number
      axis?: 'x' | 'y'
    }

    export interface EventArgs {
      change: { e: JQuery.MouseDownEvent; handle: Handle }
      changing: { e: JQuery.MouseMoveEvent; handle: Handle }
      changed: { e: JQuery.MouseUpEvent; handle: Handle }
    }
  }
}

export namespace Segment {
  Segment.config<Options>({
    name: 'segment',
    precision: 0.5,
    handleConstructor: Handle,
    segmentLengthThreshold: 40,
    redundancyRemoval: true,
    anchor: Util.getAnchor,
    snapRadius: 10,
    snapHandle: true,
    stopPropagation: true,
  })
}
