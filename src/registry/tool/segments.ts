import { Dom, FunctionExt, ObjectExt } from '../../common'
import { Line, Point, type PointLike } from '../../geometry'
import type { Graph } from '../../graph'
import type { Edge, TerminalCellData, TerminalType } from '../../model/edge'
import type { CellView } from '../../view/cell'
import type { EdgeView } from '../../view/edge'
import { ToolItem, type ToolItemOptions } from '../../view/tool'
import { View } from '../../view/view'
import { createViewElement } from '../../view/view/util'
import type { SimpleAttrs } from '../attr'
import * as Util from './util'

export class Segments extends ToolItem<EdgeView, Options> {
  public static defaults: Options = {
    ...ToolItem.defaults,
    name: 'segments',
    precision: 0.5,
    threshold: 40,
    snapRadius: 10,
    stopPropagation: true,
    removeRedundancies: true,
    attrs: {
      width: 20,
      height: 8,
      x: -10,
      y: -4,
      rx: 4,
      ry: 4,
      fill: '#333',
      stroke: '#fff',
      'stroke-width': 2,
    },
    createHandle: (options) => new Handle(options),
    anchor: Util.getAnchor,
  }

  protected handles: Handle[] = []

  protected get vertices() {
    return this.cellView.cell.getVertices()
  }

  update() {
    this.render()
    return this
  }

  public getPoints() {
    const edgeView = this.cellView
    const points = edgeView.routePoints
    if (points.length <= 2) return points

    const result: Point[] = [points[0]]

    for (let i = 1; i < points.length - 1; i++) {
      const prev = result[result.length - 1]
      const curr = points[i]
      const next = points[i + 1]

      const cross =
        (curr.x - prev.x) * (next.y - prev.y) -
        (curr.y - prev.y) * (next.x - prev.x)

      if (cross !== 0) {
        result.push(curr)
      }
    }

    result.push(points[points.length - 1])

    return result
  }

  protected onRender() {
    Dom.addClass(this.container, this.prefixClassName('edge-tool-segments'))
    this.resetHandles()
    const edgeView = this.cellView
    const vertices = [...this.getPoints()]
    vertices.unshift(edgeView.sourcePoint)
    vertices.push(edgeView.targetPoint)

    for (let i = 0, l = vertices.length; i < l - 1; i += 1) {
      const vertex = vertices[i]
      const nextVertex = vertices[i + 1]
      const handle = this.renderHandle(vertex, nextVertex, i)
      this.stamp(handle.container)
      this.handles.push(handle)
    }
    return this
  }

  protected renderHandle(
    vertex: PointLike,
    nextVertex: PointLike,
    index: number,
  ) {
    const handle = this.options.createHandle!({
      index,
      graph: this.graph,
      guard: (evt) => this.guard(evt),
      attrs: this.options.attrs || {},
    })

    if (this.options.processHandle) {
      this.options.processHandle(handle)
    }

    this.updateHandle(handle, vertex, nextVertex)
    this.container.appendChild(handle.container)
    this.startHandleListening(handle)
    return handle
  }

  protected startHandleListening(handle: Handle) {
    handle.on('change', this.onHandleChange, this)
    handle.on('changing', this.onHandleChanging, this)
    handle.on('changed', this.onHandleChanged, this)
  }

  protected stopHandleListening(handle: Handle) {
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
    type: TerminalType,
    anchor: TerminalCellData['anchor'],
  ) {
    const edge = this.cellView.cell
    const options = {
      ui: true,
      toolId: this.cid,
    }

    if (anchor) {
      edge.prop([type, 'anchor'], anchor, options)
    } else {
      edge.removeProp([type, 'anchor'], options)
    }
  }

  protected snapHandle(handle: Handle, position: PointLike, data: EventData) {
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

  protected onHandleChanging({ handle, e }: HandleEventArgs['changing']) {
    const graph = this.graph
    const options = this.options
    const edgeView = this.cellView
    const anchorFn = options.anchor

    const axis = handle.options.axis!
    const index = handle.options.index! - 1

    const data = this.getEventData<EventData>(e)
    const evt = this.normalizeEvent(e)
    const coords = graph.snapToGrid(evt.clientX, evt.clientY)
    const position = this.snapHandle(handle, coords.clone(), data)
    const vertices = ObjectExt.cloneDeep(this.vertices)
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
        const sourceAnchor = FunctionExt.call(
          anchorFn,
          edgeView,
          sourceAnchorPosition,
          sourceView,
          edgeView.sourceMagnet || sourceView.container,
          'source',
          edgeView,
          this,
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

    if (typeof anchorFn === 'function' && targetView) {
      if (changeTargetAnchor) {
        const targetAnchorPosition = data.targetAnchor.clone()
        targetAnchorPosition[axis] = position[axis]
        const targetAnchor = FunctionExt.call(
          anchorFn,
          edgeView,
          targetAnchorPosition,
          targetView,
          edgeView.targetMagnet || targetView.container,
          'target',
          edgeView,
          this,
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

    this.updateHandle(handle, vertex, nextVertex, 0)
    if (!options.stopPropagation) {
      edgeView.notifyMouseMove(evt, coords.x, coords.y)
    }
  }

  protected onHandleChange({ handle, e }: HandleEventArgs['change']) {
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
    this.setEventData<EventData>(e, {
      sourceAnchor: edgeView.sourceAnchor.clone(),
      targetAnchor: edgeView.targetAnchor.clone(),
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

  protected onHandleChanged({ e }: HandleEventArgs['changed']) {
    const options = this.options
    const edgeView = this.cellView
    if (options.removeRedundancies) {
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

    options.onChanged && options.onChanged({ edge: edgeView.cell, edgeView })
  }

  protected updateHandle(
    handle: Handle,
    vertex: PointLike,
    nextVertex: PointLike,
    offset = 0,
  ) {
    const precision = this.options.precision || 0
    const vertical = Math.abs(vertex.x - nextVertex.x) < precision
    const horizontal = Math.abs(vertex.y - nextVertex.y) < precision
    if (vertical || horizontal) {
      const segmentLine = new Line(vertex, nextVertex)
      const length = segmentLine.length()
      if (length < this.options.threshold) {
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

interface Options extends ToolItemOptions {
  threshold: number
  precision?: number
  snapRadius: number
  stopPropagation: boolean
  removeRedundancies: boolean
  attrs: SimpleAttrs | ((handle: Handle) => SimpleAttrs)
  anchor?: (
    this: EdgeView,
    pos: Point,
    terminalView: CellView,
    terminalMagnet: Element | null,
    terminalType: TerminalType,
    edgeView: EdgeView,
    toolView: Segments,
  ) => TerminalCellData['anchor']
  createHandle?: (options: HandleOptions) => Handle
  processHandle?: (handle: Handle) => void
  onChanged?: (options: { edge: Edge; edgeView: EdgeView }) => void
}

interface EventData {
  sourceAnchor: Point
  targetAnchor: Point
  sourceAnchorDef: TerminalCellData['anchor']
  targetAnchorDef: TerminalCellData['anchor']
}

class Handle extends View<HandleEventArgs> {
  public container: SVGRectElement

  constructor(public options: HandleOptions) {
    super()
    this.render()
    this.delegateEvents({
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    })
  }

  render() {
    this.container = createViewElement('rect', true) as SVGRectElement
    const attrs = this.options.attrs
    if (typeof attrs === 'function') {
      const defaults = Segments.getDefaults<Options>()
      this.setAttrs({
        ...defaults.attrs,
        ...attrs(this),
      })
    } else {
      this.setAttrs(attrs)
    }
    this.addClass(this.prefixClassName('edge-tool-segment'))
  }

  updatePosition(x: number, y: number, angle: number, view: EdgeView) {
    const p = view.getClosestPoint(new Point(x, y)) || new Point(x, y)
    let matrix = Dom.createSVGMatrix().translate(p.x, p.y)
    if (!p.equals({ x, y })) {
      const line = new Line(x, y, p.x, p.y)
      let deg = line.vector().vectorAngle(new Point(1, 0))
      if (deg !== 0) {
        deg += 90
      }
      matrix = matrix.rotate(deg)
    } else {
      matrix = matrix.rotate(angle)
    }

    this.setAttrs({
      transform: Dom.matrixToTransformString(matrix),
      cursor: angle % 180 === 0 ? 'row-resize' : 'col-resize',
    })
  }

  protected onMouseDown(evt: Dom.MouseDownEvent) {
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

  protected onMouseMove(evt: Dom.MouseMoveEvent) {
    this.emit('changing', { e: evt, handle: this })
  }

  protected onMouseUp(evt: Dom.MouseUpEvent) {
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

interface HandleOptions {
  graph: Graph
  guard: (evt: Dom.EventObject) => boolean
  attrs: SimpleAttrs | ((handle: Handle) => SimpleAttrs)
  index?: number
  axis?: 'x' | 'y'
}

interface HandleEventArgs {
  change: { e: Dom.MouseDownEvent; handle: Handle }
  changing: { e: Dom.MouseMoveEvent; handle: Handle }
  changed: { e: Dom.MouseUpEvent; handle: Handle }
}
