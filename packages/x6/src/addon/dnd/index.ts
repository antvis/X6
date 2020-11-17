import { Util } from '../../global'
import { FunctionExt } from '../../util'
import { Rectangle, Point } from '../../geometry'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { View } from '../../view/view'
import { NodeView } from '../../view/node'
import { Graph } from '../../graph/graph'
import { EventArgs } from '../../graph/events'
import { Scroller } from '../scroller'

export class Dnd extends View {
  public readonly options: Dnd.Options
  public readonly delegateGraph: Graph
  protected readonly $container: JQuery<HTMLDivElement>
  protected draggingNode: Node | null
  protected draggingView: NodeView | null
  protected delegateBBox: Rectangle
  protected geometryBBox: Rectangle
  protected candidateEmbedView: NodeView | null
  protected delta: Point | null
  protected padding: number | null
  protected snapOffset: Point.PointLike | null
  protected originOffset: null | { left: number; top: number }

  protected get targetScroller() {
    const target = this.options.target
    return target instanceof Graph ? target.scroller.widget : target
  }

  protected get targetGraph() {
    const target = this.options.target
    return target instanceof Graph ? target : target.graph
  }

  protected get targetModel() {
    return this.targetGraph.model
  }

  protected get snapline() {
    return this.targetGraph.snapline.widget
  }

  constructor(options: Partial<Dnd.Options> & { target: Graph | Scroller }) {
    super()

    this.options = {
      ...Dnd.defaults,
      ...options,
    } as Dnd.Options

    this.container = document.createElement('div')
    this.$container = this.$(this.container).addClass(
      this.prefixClassName('widget-dnd'),
    )

    this.delegateGraph = new Graph({
      ...this.options.delegateGraphOptions,
      container: document.createElement('div'),
      width: 1,
      height: 1,
    })

    this.$container.append(this.delegateGraph.container)
  }

  start(node: Node, evt: JQuery.MouseDownEvent | MouseEvent) {
    const e = evt as JQuery.MouseDownEvent

    e.preventDefault()

    this.targetModel.startBatch('dnd')
    this.$container.addClass('dragging').appendTo(document.body)

    this.prepareDragging(node, e.clientX, e.clientY)

    const local = this.updateNodePosition(e.clientX, e.clientY)

    if (this.isSnaplineEnabled()) {
      this.snapline.captureCursorOffset({
        e,
        node,
        cell: node,
        view: this.draggingView!,
        x: local.x,
        y: local.y,
      })
      this.draggingNode!.on('change:position', this.snap, this)
    }

    this.delegateDocumentEvents(Dnd.documentEvents, e.data)
  }

  protected isSnaplineEnabled() {
    return this.snapline && !this.snapline.disabled
  }

  protected prepareDragging(node: Node, clientX: number, clientY: number) {
    const delegateGraph = this.delegateGraph
    const delegateModel = delegateGraph.model
    const delegateNode = this.options.getDragNode(node).position(0, 0)

    let padding = 5
    if (this.isSnaplineEnabled()) {
      padding += this.snapline.options.tolerance || 0
    }

    if (this.isSnaplineEnabled() || this.options.scaled) {
      const scale = this.targetGraph.scale()
      delegateGraph.scale(scale.sx, scale.sy)
      padding *= Math.max(scale.sx, scale.sy)
    } else {
      delegateGraph.scale(1, 1)
    }

    this.clearDragging()

    if (this.options.animation) {
      this.$container.stop(true, true)
    }

    delegateModel.resetCells([delegateNode])

    const delegateView = delegateGraph.findViewByCell(delegateNode) as NodeView
    delegateView.undelegateEvents()
    delegateView.cell.off('changed')
    delegateGraph.fitToContent({
      padding,
      allowNewOrigin: 'any',
    })

    const bbox = delegateView.getBBox()
    this.geometryBBox = delegateView.getBBox({ useCellGeometry: true })
    this.delta = this.geometryBBox.getTopLeft().diff(bbox.getTopLeft())
    this.draggingNode = delegateNode
    this.draggingView = delegateView
    this.delegateBBox = delegateNode.getBBox()
    this.padding = padding
    this.originOffset = this.updateGraphPosition(clientX, clientY)
  }

  protected updateGraphPosition(clientX: number, clientY: number) {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop
    const delta = this.delta!
    const nodeBBox = this.geometryBBox
    const padding = this.padding || 5
    const offset = {
      left: clientX - delta.x - nodeBBox.width / 2 - padding,
      top: clientY - delta.y - nodeBBox.height / 2 - padding + scrollTop,
    }

    if (this.delegateGraph) {
      this.$container.offset(offset)
    }

    return offset
  }

  protected updateNodePosition(x: number, y: number) {
    const local = this.targetGraph.clientToLocal(x, y)
    const bbox = this.delegateBBox!
    local.x -= bbox.width / 2
    local.y -= bbox.height / 2
    this.draggingNode!.position(local.x, local.y)
    return local
  }

  protected snap({
    cell,
    current,
    options,
  }: Cell.EventArgs['change:position']) {
    const node = cell as Node
    if (options.snapped) {
      const bbox = this.delegateBBox
      node.position(bbox.x + options.tx, bbox.y + options.ty, { silent: true })
      this.draggingView!.translate()
      node.position(current!.x, current!.y, { silent: true })

      this.snapOffset = {
        x: options.tx,
        y: options.ty,
      }
    } else {
      this.snapOffset = null
    }
  }

  protected onDragging(evt: JQuery.MouseMoveEvent) {
    const draggingView = this.draggingView
    if (draggingView) {
      evt.preventDefault()
      const e = this.normalizeEvent(evt)
      const clientX = e.clientX
      const clientY = e.clientY

      this.updateGraphPosition(clientX, clientY)
      const local = this.updateNodePosition(clientX, clientY)
      const embeddingMode = this.targetGraph.options.embedding.enabled
      const isValidArea =
        (embeddingMode || this.isSnaplineEnabled()) &&
        this.isInsideValidArea({
          x: clientX,
          y: clientY,
        })

      if (embeddingMode) {
        draggingView.setEventData(e, {
          graph: this.targetGraph,
          candidateEmbedView: this.candidateEmbedView,
        })
        const data = draggingView.getEventData<any>(e)
        if (isValidArea) {
          draggingView.processEmbedding(e, data)
        } else {
          draggingView.clearEmbedding(data)
        }
        this.candidateEmbedView = data.candidateEmbedView
      }

      // update snapline
      if (this.isSnaplineEnabled()) {
        if (isValidArea) {
          this.snapline.snapOnMoving({
            e,
            view: draggingView!,
            x: local.x,
            y: local.y,
          } as EventArgs['node:mousemove'])
        } else {
          this.snapline.hide()
        }
      }
    }
  }

  protected onDragEnd(evt: JQuery.MouseUpEvent) {
    const draggingNode = this.draggingNode
    if (draggingNode) {
      const e = this.normalizeEvent(evt)
      const draggingView = this.draggingView
      const draggingBBox = this.delegateBBox
      const snapOffset = this.snapOffset
      let x = draggingBBox.x
      let y = draggingBBox.y

      if (snapOffset) {
        x = x + snapOffset.x
        y = y + snapOffset.y
      }

      draggingNode.position(x, y, { silent: true })

      const node = this.options.getDropNode(draggingNode)
      const ret = this.drop(node, { x: e.clientX, y: e.clientY })
      const callback = (valid: boolean) => {
        if (valid) {
          this.onDropped(draggingNode)
        } else {
          this.onDropInvalid()
        }

        if (this.targetGraph.options.embedding.enabled && draggingView) {
          draggingView.setEventData(e, {
            cell: node,
            graph: this.targetGraph,
            candidateEmbedView: this.candidateEmbedView,
          })
          draggingView.finalizeEmbedding(e, draggingView.getEventData<any>(e))
        }

        this.candidateEmbedView = null
        this.targetModel.stopBatch('dnd')
      }

      if (typeof ret === 'boolean') {
        callback(ret)
      } else {
        ret.then(callback)
      }
    }
  }

  protected clearDragging() {
    if (this.draggingNode) {
      this.draggingNode.remove()
      this.draggingNode = null
      this.draggingView = null
      this.delta = null
      this.padding = null
      this.snapOffset = null
      this.originOffset = null
    }
  }

  protected onDropped(draggingNode: Node) {
    if (this.draggingNode === draggingNode) {
      this.clearDragging()
      this.$container.removeClass('dragging').remove()
    }
  }

  protected onDropInvalid() {
    const draggingNode = this.draggingNode
    if (draggingNode) {
      const anim = this.options.animation
      if (anim) {
        const duration = (typeof anim === 'object' && anim.duration) || 150
        const easing = (typeof anim === 'object' && anim.easing) || 'swing'

        this.draggingView = null

        this.$container.animate(this.originOffset!, duration, easing, () =>
          this.onDropped(draggingNode),
        )
      } else {
        this.onDropped(draggingNode)
      }
    }
  }

  protected isInsideValidArea(p: Point.PointLike) {
    let targetRect: Rectangle
    const targetGraph = this.targetGraph
    const targetScroller = this.targetScroller

    if (targetScroller) {
      if (targetScroller.options.autoResize) {
        targetRect = this.getDropArea(targetScroller.container)
      } else {
        const outter = this.getDropArea(targetScroller.container)
        targetRect = this.getDropArea(targetGraph.container).intersectsWithRect(
          outter,
        )!
      }
    } else {
      targetRect = this.getDropArea(targetGraph.container)
    }

    return targetRect && targetRect.containsPoint(p)
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
      const local = targetGraph.clientToLocal(pos)
      const bbox = node.getBBox()
      local.x += bbox.x - bbox.width / 2
      local.y += bbox.y - bbox.height / 2
      const gridSize = this.snapOffset ? 1 : targetGraph.getGridSize()

      node.position(
        Util.snapToGrid(local.x, gridSize),
        Util.snapToGrid(local.y, gridSize),
      )

      node.removeZIndex()

      const validateNode = this.options.validateNode
      const ret = validateNode
        ? FunctionExt.call(validateNode, targetGraph, node)
        : true

      if (typeof ret === 'boolean') {
        if (ret) {
          targetModel.addCell(node, { stencil: this.cid })
        }
        return ret
      }

      return FunctionExt.toDeferredBoolean(ret).then((valid) => {
        if (valid) {
          targetModel.addCell(node, { stencil: this.cid })
        }
        return valid
      })
    }

    return false
  }

  protected onRemove() {
    if (this.delegateGraph) {
      this.delegateGraph.view.remove()
    }
  }
}

export namespace Dnd {
  export interface Options {
    target: Graph | Scroller
    /**
     * Should scale the dragging node or not.
     */
    scaled?: boolean
    delegateGraphOptions?: Graph.Options
    animation?:
      | boolean
      | {
          duration?: number
          easing?: string
        }
    getDragNode: (node: Node) => Node
    getDropNode: (node: Node) => Node
    validateNode?: (this: Graph, node: Node) => any
  }

  export const defaults: Partial<Options> = {
    animation: false,
    getDragNode: (node) => node.clone(),
    getDropNode: (node) => node.clone(),
  }

  export const documentEvents = {
    mousemove: 'onDragging',
    touchmove: 'onDragging',
    mouseup: 'onDragEnd',
    touchend: 'onDragEnd',
    touchcancel: 'onDragEnd',
  }
}
