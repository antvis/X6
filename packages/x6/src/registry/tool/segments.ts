import { Dom, ObjectExt } from '../../util'
import { Point, Line } from '../../geometry'
import { Graph } from '../../graph'
import { Edge } from '../../model/edge'
import { View } from '../../view/view'
import { Markup } from '../../view/markup'
import { CellView } from '../../view/cell'
import { EdgeView } from '../../view/edge'
import { ToolsView } from '../../view/tool'
import * as Util from './util'

export class Segments extends ToolsView.ToolItem<EdgeView, Segments.Options> {
  protected handles: Segments.Handle[] = []

  protected get vertices() {
    return this.cellView.cell.getVertices()
  }

  update() {
    this.render()
    return this
  }

  protected onRender() {
    Dom.addClass(this.container, this.prefixClassName('edge-tool-segments'))
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

  protected renderHandle(vertex: Point.PointLike, nextVertex: Point.PointLike) {
    const handle = new this.options.handleConstructor!({
      graph: this.graph,
      guard: (evt) => this.guard(evt),
    })

    this.updateHandle(handle, vertex, nextVertex)
    this.container.appendChild(handle.container)
    this.startHandleListening(handle)
    return handle
  }

  protected startHandleListening(handle: Segments.Handle) {
    handle.on('change', this.onHandleChange, this)
    handle.on('changing', this.onHandleChanging, this)
    handle.on('changed', this.onHandleChanged, this)
  }

  protected stopHandleListening(handle: Segments.Handle) {
    handle.off('change', this.onHandleChange, this)
    handle.off('changing', this.onHandleChanging, this)
    handle.off('changed', this.onHandleChanged, this)
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

  protected shiftHandleIndexes(delta: number) {
    const handles = this.handles
    for (let i = 0, n = handles.length; i < n; i += 1) {
      handles[i].options.index! += delta
    }
  }

  protected resetAnchor(
    type: Edge.TerminalType,
    anchor: Edge.TerminalCellData['endpoint'],
  ) {
    const edge = this.cellView.cell
    if (anchor) {
      edge.prop([type, 'anchor'], anchor, {
        rewrite: true,
        ui: true,
        toolId: this.cid,
      })
    } else {
      edge.removeProp([type, 'anchor'], {
        ui: true,
        toolId: this.cid,
      })
    }
  }

  protected snapHandle(
    handle: Segments.Handle,
    position: Point.PointLike,
    data: Segments.EventData,
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
  }: Segments.Handle.EventArgs['changing']) {
    const graph = this.graph
    const options = this.options
    const edgeView = this.cellView
    const anchorFn = options.anchor

    const axis = handle.options.axis!
    const index = handle.options.index! - 1

    const data = this.getEventData<Segments.EventData>(e)
    const normalizedEvent = this.normalizeEvent(e)
    const coords = graph.snapToGrid(
      normalizedEvent.clientX,
      normalizedEvent.clientY,
    )
    const position = this.snapHandle(handle, coords.clone(), data)
    const offset = this.options.snapHandle ? 0 : coords[axis] - position[axis]
    const vertices = ObjectExt.cloneDeep(this.vertices)
    let vertex = vertices[index]
    let nextVertex = vertices[index + 1]

    // First Segment
    const sourceView = edgeView.sourceView
    const sourceBBox = edgeView.sourceBBox
    let changeSourceAnchor = false
    let deleteSourceAnchor = false

    if (!vertex) {
      vertex = edgeView.sourceEndpoint.toJSON()
      vertex[axis] = position[axis]
      if (sourceBBox.containsPoint(vertex)) {
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
      nextVertex = edgeView.targetEndpoint.toJSON()
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

    if (typeof anchorFn === 'function' && targetView) {
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

    if (!Point.equalPoints(vertices, this.vertices)) {
      this.cellView.cell.setVertices(vertices, { ui: true, toolId: this.cid })
    }

    this.updateHandle(handle, vertex, nextVertex, offset)
    if (!options.stopPropagation) {
      edgeView.notifyMouseMove(normalizedEvent, coords.x, coords.y)
    }
  }

  protected onHandleChange({ handle, e }: Segments.Handle.EventArgs['change']) {
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
    this.setEventData<Segments.EventData>(e, {
      sourceAnchor: edgeView.sourceEndpoint.clone(),
      targetAnchor: edgeView.targetEndpoint.clone(),
      sourceAnchorDef: ObjectExt.cloneDeep(
        this.cell.prop(['source', 'anchor']),
      ),
      targetAnchorDef: ObjectExt.cloneDeep(
        this.cell.prop(['target', 'anchor']),
      ),
    })

    this.cell.startBatch('move-segment', { ui: true, toolId: this.cid })

    if (!options.stopPropagation) {
      const normalizedEvent = this.normalizeEvent(e)
      const coords = this.graph.snapToGrid(
        normalizedEvent.clientX,
        normalizedEvent.clientY,
      )
      edgeView.notifyMouseDown(normalizedEvent, coords.x, coords.y)
    }
  }

  protected onHandleChanged({ e }: Segments.Handle.EventArgs['changed']) {
    const options = this.options
    const edgeView = this.cellView
    if (options.redundancyRemoval) {
      edgeView.removeRedundantLinearVertices({ ui: true, toolId: this.cid })
    }

    const normalizedEvent = this.normalizeEvent(e)
    const coords = this.graph.snapToGrid(
      normalizedEvent.clientX,
      normalizedEvent.clientY,
    )

    this.render()
    this.blur()

    this.cell.stopBatch('move-segment', { ui: true, toolId: this.cid })
    if (!options.stopPropagation) {
      edgeView.notifyMouseUp(normalizedEvent, coords.x, coords.y)
    }
    edgeView.checkMouseleave(normalizedEvent)
  }

  protected updateHandle(
    handle: Segments.Handle,
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
        handle.updatePosition(position.x, position.y, angle, this.cellView)
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

export namespace Segments {
  export interface Options extends ToolsView.ToolItem.Options {
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
      toolView: Segments,
    ) => Edge.TerminalCellData['endpoint']
    snapRadius: number
    snapHandle: boolean
    stopPropagation: boolean
  }

  export interface EventData {
    sourceAnchor: Point
    targetAnchor: Point
    sourceAnchorDef: Edge.TerminalCellData['endpoint']
    targetAnchorDef: Edge.TerminalCellData['endpoint']
  }
}

export namespace Segments {
  export class Handle extends View<Handle.EventArgs> {
    public container: SVGElement
    protected lineElem: SVGLineElement
    protected handleElem: SVGElement

    constructor(public options: Handle.Options) {
      super()

      this.container = View.createElement('g', true) as SVGElement

      Dom.addClass(this.container, this.prefixClassName('edge-tool-segment'))

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

    updatePosition(x: number, y: number, angle: number, view: EdgeView) {
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

    onMouseDown(evt: JQuery.MouseDownEvent) {
      if (this.options.guard(evt)) {
        return
      }

      this.trigger('change', { e: evt, handle: this })

      evt.stopPropagation()
      evt.preventDefault()
      this.options.graph.view.undelegateEvents()
      this.delegateDocumentEvents(
        {
          mousemove: 'onMouseMove',
          touchmove: 'onMouseMove',
          mouseup: 'onMouseUp',
          touchend: 'onMouseUp',
          touchcancel: 'onMouseUp',
        },
        evt.data,
      )
    }

    onMouseMove(evt: JQuery.MouseMoveEvent) {
      this.emit('changing', { e: evt, handle: this })
    }

    onMouseUp(evt: JQuery.MouseUpEvent) {
      this.emit('changed', { e: evt, handle: this })
      this.undelegateDocumentEvents()
      this.options.graph.view.delegateEvents()
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

export namespace Segments {
  Segments.config<Options>({
    name: 'segments',
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
