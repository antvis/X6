import { Util } from '../../global/util'
import { Point } from '../../geometry'
import { Graph } from '../../graph'
import { View } from '../../view/view'
import { EdgeView } from '../../view/edge'
import { Edge } from '../../model/edge'
import { ToolsView } from '../../view/tool'
import { Attr } from '../attr'

export class Vertices extends ToolsView.ToolItem<EdgeView, Vertices.Options> {
  protected handles: Vertices.Handle[] = []

  protected get vertices() {
    return this.cellView.cell.getVertices()
  }

  protected onRender() {
    this.addClass(this.prefixClassName('edge-tool-vertices'))
    if (this.options.addable) {
      this.updatePath()
    }
    this.resetHandles()
    this.renderHandles()
    return this
  }

  update() {
    const vertices = this.vertices
    if (vertices.length === this.handles.length) {
      this.updateHandles()
    } else {
      this.resetHandles()
      this.renderHandles()
    }

    if (this.options.addable) {
      this.updatePath()
    }

    return this
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

  protected renderHandles() {
    const vertices = this.vertices
    for (let i = 0, l = vertices.length; i < l; i += 1) {
      const vertex = vertices[i]
      const createHandle = this.options.createHandle!
      const processHandle = this.options.processHandle
      const handle = createHandle({
        index: i,
        graph: this.graph,
        guard: (evt: JQuery.TriggeredEvent) => this.guard(evt), // eslint-disable-line no-loop-func
        attrs: this.options.attrs || {},
      })

      if (processHandle) {
        processHandle(handle)
      }

      this.graph.hook.onToolItemCreated({
        name: 'vertices',
        cell: this.cell,
        view: this.cellView,
        tool: handle,
      })

      handle.updatePosition(vertex.x, vertex.y)
      this.stamp(handle.container)
      this.container.appendChild(handle.container)
      this.handles.push(handle)
      this.startHandleListening(handle)
    }
  }

  protected updateHandles() {
    const vertices = this.vertices
    for (let i = 0, l = vertices.length; i < l; i += 1) {
      const vertex = vertices[i]
      const handle = this.handles[i]
      if (handle) {
        handle.updatePosition(vertex.x, vertex.y)
      }
    }
  }

  protected updatePath() {
    const connection = this.childNodes.connection
    if (connection) {
      connection.setAttribute('d', this.cellView.getConnectionPathData())
    }
  }

  protected startHandleListening(handle: Vertices.Handle) {
    const edgeView = this.cellView
    if (edgeView.can('vertexMovable')) {
      handle.on('change', this.onHandleChange, this)
      handle.on('changing', this.onHandleChanging, this)
      handle.on('changed', this.onHandleChanged, this)
    }

    if (edgeView.can('vertexDeletable')) {
      handle.on('remove', this.onHandleRemove, this)
    }
  }

  protected stopHandleListening(handle: Vertices.Handle) {
    const edgeView = this.cellView
    if (edgeView.can('vertexMovable')) {
      handle.off('change', this.onHandleChange, this)
      handle.off('changing', this.onHandleChanging, this)
      handle.off('changed', this.onHandleChanged, this)
    }

    if (edgeView.can('vertexDeletable')) {
      handle.off('remove', this.onHandleRemove, this)
    }
  }

  protected getNeighborPoints(index: number) {
    const edgeView = this.cellView
    const vertices = this.vertices
    const prev = index > 0 ? vertices[index - 1] : edgeView.sourceAnchor
    const next =
      index < vertices.length - 1 ? vertices[index + 1] : edgeView.targetAnchor
    return {
      prev: Point.create(prev),
      next: Point.create(next),
    }
  }

  protected getMouseEventArgs<T extends JQuery.TriggeredEvent>(evt: T) {
    const e = this.normalizeEvent(evt)
    const { x, y } = this.graph.snapToGrid(e.clientX!, e.clientY!)
    return { e, x, y }
  }

  protected onHandleChange({ e }: Vertices.Handle.EventArgs['change']) {
    this.focus()
    const edgeView = this.cellView
    edgeView.cell.startBatch('move-vertex', { ui: true, toolId: this.cid })
    if (!this.options.stopPropagation) {
      const { e: evt, x, y } = this.getMouseEventArgs(e)
      edgeView.notifyMouseDown(evt, x, y)
    }
  }

  protected onHandleChanging({
    handle,
    e,
  }: Vertices.Handle.EventArgs['changing']) {
    const edgeView = this.cellView
    const index = handle.options.index
    const { e: evt, x, y } = this.getMouseEventArgs(e)
    const vertex = { x, y }
    this.snapVertex(vertex, index)
    edgeView.cell.setVertexAt(index, vertex, { ui: true, toolId: this.cid })
    handle.updatePosition(vertex.x, vertex.y)
    if (!this.options.stopPropagation) {
      edgeView.notifyMouseMove(evt, x, y)
    }
  }

  protected onHandleChanged({ e }: Vertices.Handle.EventArgs['changed']) {
    const options = this.options
    const edgeView = this.cellView

    if (options.addable) {
      this.updatePath()
    }

    if (!options.removeRedundancies) {
      return
    }

    const verticesRemoved = edgeView.removeRedundantLinearVertices({
      ui: true,
      toolId: this.cid,
    })

    if (verticesRemoved) {
      this.render()
    }

    this.blur()

    edgeView.cell.stopBatch('move-vertex', { ui: true, toolId: this.cid })

    if (this.eventData(e).vertexAdded) {
      edgeView.cell.stopBatch('add-vertex', { ui: true, toolId: this.cid })
    }

    const { e: evt, x, y } = this.getMouseEventArgs(e)

    if (!this.options.stopPropagation) {
      edgeView.notifyMouseUp(evt, x, y)
    }

    edgeView.checkMouseleave(evt)

    options.onChanged && options.onChanged({ edge: edgeView.cell, edgeView })
  }

  protected snapVertex(vertex: Point.PointLike, index: number) {
    const snapRadius = this.options.snapRadius || 0
    if (snapRadius > 0) {
      const neighbors = this.getNeighborPoints(index)
      const prev = neighbors.prev
      const next = neighbors.next
      if (Math.abs(vertex.x - prev.x) < snapRadius) {
        vertex.x = prev.x
      } else if (Math.abs(vertex.x - next.x) < snapRadius) {
        vertex.x = next.x
      }

      if (Math.abs(vertex.y - prev.y) < snapRadius) {
        vertex.y = neighbors.prev.y
      } else if (Math.abs(vertex.y - next.y) < snapRadius) {
        vertex.y = next.y
      }
    }
  }

  protected onHandleRemove({ handle, e }: Vertices.Handle.EventArgs['remove']) {
    if (this.options.removable) {
      const index = handle.options.index
      const edgeView = this.cellView
      edgeView.cell.removeVertexAt(index, { ui: true })
      if (this.options.addable) {
        this.updatePath()
      }
      edgeView.checkMouseleave(this.normalizeEvent(e))
    }
  }

  protected onPathMouseDown(evt: JQuery.MouseDownEvent) {
    const edgeView = this.cellView

    if (
      this.guard(evt) ||
      !this.options.addable ||
      !edgeView.can('vertexAddable')
    ) {
      return
    }

    evt.stopPropagation()
    evt.preventDefault()

    const e = this.normalizeEvent(evt)
    const vertex = this.graph.snapToGrid(e.clientX, e.clientY).toJSON()
    edgeView.cell.startBatch('add-vertex', { ui: true, toolId: this.cid })
    const index = edgeView.getVertexIndex(vertex.x, vertex.y)
    this.snapVertex(vertex, index)
    edgeView.cell.insertVertex(vertex, index, {
      ui: true,
      toolId: this.cid,
    })
    this.render()
    const handle = this.handles[index]
    this.eventData(e, { vertexAdded: true })
    handle.onMouseDown(e)
  }

  protected onRemove() {
    this.resetHandles()
  }
}

export namespace Vertices {
  export interface Options extends ToolsView.ToolItem.Options {
    snapRadius?: number
    addable?: boolean
    removable?: boolean
    removeRedundancies?: boolean
    stopPropagation?: boolean
    attrs?: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs)
    createHandle?: (options: Handle.Options) => Handle
    processHandle?: (handle: Handle) => void
    onChanged?: (options: { edge: Edge; edgeView: EdgeView }) => void
  }
}

export namespace Vertices {
  export class Handle extends View<Handle.EventArgs> {
    protected get graph() {
      return this.options.graph
    }

    constructor(public readonly options: Handle.Options) {
      super()
      this.render()
      this.delegateEvents({
        mousedown: 'onMouseDown',
        touchstart: 'onMouseDown',
        dblclick: 'onDoubleClick',
      })
    }

    render() {
      this.container = View.createElement('circle', true)
      const attrs = this.options.attrs
      if (typeof attrs === 'function') {
        const defaults = Vertices.getDefaults<Vertices.Options>()
        this.setAttrs({
          ...defaults.attrs,
          ...attrs(this),
        })
      } else {
        this.setAttrs(attrs)
      }

      this.addClass(this.prefixClassName('edge-tool-vertex'))
    }

    updatePosition(x: number, y: number) {
      this.setAttrs({ cx: x, cy: y })
    }

    onMouseDown(evt: JQuery.MouseDownEvent) {
      if (this.options.guard(evt)) {
        return
      }

      evt.stopPropagation()
      evt.preventDefault()
      this.graph.view.undelegateEvents()

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

      this.emit('change', { e: evt, handle: this })
    }

    protected onMouseMove(evt: JQuery.MouseMoveEvent) {
      this.emit('changing', { e: evt, handle: this })
    }

    protected onMouseUp(evt: JQuery.MouseUpEvent) {
      this.emit('changed', { e: evt, handle: this })
      this.undelegateDocumentEvents()
      this.graph.view.delegateEvents()
    }

    protected onDoubleClick(evt: JQuery.DoubleClickEvent) {
      this.emit('remove', { e: evt, handle: this })
    }
  }

  export namespace Handle {
    export interface Options {
      graph: Graph
      index: number
      guard: (evt: JQuery.TriggeredEvent) => boolean
      attrs: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs)
    }

    export interface EventArgs {
      change: { e: JQuery.MouseDownEvent; handle: Handle }
      changing: { e: JQuery.MouseMoveEvent; handle: Handle }
      changed: { e: JQuery.MouseUpEvent; handle: Handle }
      remove: { e: JQuery.DoubleClickEvent; handle: Handle }
    }
  }
}

export namespace Vertices {
  const pathClassName = Util.prefix('edge-tool-vertex-path')

  Vertices.config<Vertices.Options>({
    name: 'vertices',
    snapRadius: 20,
    addable: true,
    removable: true,
    removeRedundancies: true,
    stopPropagation: true,
    attrs: {
      r: 6,
      fill: '#333',
      stroke: '#fff',
      cursor: 'move',
      'stroke-width': 2,
    },
    createHandle: (options) => new Handle(options),
    markup: [
      {
        tagName: 'path',
        selector: 'connection',
        className: pathClassName,
        attrs: {
          fill: 'none',
          stroke: 'transparent',
          'stroke-width': 10,
          cursor: 'pointer',
        },
      },
    ],
    events: {
      [`mousedown .${pathClassName}`]: 'onPathMouseDown',
      [`touchstart .${pathClassName}`]: 'onPathMouseDown',
    },
  })
}
