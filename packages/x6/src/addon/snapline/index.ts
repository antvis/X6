import { ArrayExt, FunctionExt } from '../../util'
import { IDisablable } from '../../common'
import { Point, Rectangle, Angle } from '../../geometry'
import { Node } from '../../model/node'
import { Model } from '../../model/model'
import { View } from '../../view/view'
import { CellView } from '../../view/cell'
import { NodeView } from '../../view/node'
import { Graph } from '../../graph'
import { EventArgs } from '../../graph/events'

export class Snapline extends View implements IDisablable {
  public readonly options: Snapline.Options
  protected readonly graph: Graph
  protected filterShapes: { [type: string]: boolean }
  protected filterCells: { [id: string]: boolean }
  protected filterFunction: Snapline.FilterFunction | null
  protected offset: Point.PointLike
  protected timer: number | null
  protected $container: JQuery<HTMLElement>
  protected $horizontal: JQuery<HTMLElement>
  protected $vertical: JQuery<HTMLElement>

  protected get model() {
    return this.graph.model
  }

  protected get containerClassName() {
    return this.prefixClassName('widget-snapline')
  }

  protected get verticalClassName() {
    return `${this.containerClassName}-vertical`
  }

  protected get horizontalClassName() {
    return `${this.containerClassName}-horizontal`
  }

  constructor(options: Snapline.Options & { graph: Graph }) {
    super()

    const { graph, ...others } = options
    this.graph = graph
    this.options = { tolerance: 10, ...others }
    this.render()
    this.parseFilter()
    if (!this.disabled) {
      this.startListening()
    }
  }

  public get disabled() {
    return (
      this.options.enabled !== true ||
      this.graph.options.snapline.enabled !== true
    )
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      this.graph.options.snapline.enabled = true
      this.startListening()
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      this.graph.options.snapline.enabled = false
      this.stopListening()
    }
  }

  setFilter(filter?: Snapline.Filter) {
    this.options.filter = filter
    this.parseFilter()
  }

  protected render() {
    this.container = document.createElement('div')
    this.$container = this.$(this.container)
    this.$horizontal = this.$(document.createElement('div')).addClass(
      this.horizontalClassName,
    )
    this.$vertical = this.$(document.createElement('div')).addClass(
      this.verticalClassName,
    )

    this.$container
      .hide()
      .addClass(this.containerClassName)
      .append([this.$horizontal, this.$vertical])

    if (this.options.className) {
      this.$container.addClass(this.options.className)
    }
  }

  protected startListening() {
    this.stopListening()
    this.graph.on('node:mousedown', this.captureCursorOffset, this)
    this.graph.on('node:mousemove', this.snapOnMoving, this)
    this.model.on('batch:stop', this.onBatchStop, this)
    this.delegateDocumentEvents({
      mouseup: 'hide',
      touchend: 'hide',
    })
  }

  protected stopListening() {
    this.graph.off('node:mousedown', this.captureCursorOffset, this)
    this.graph.off('node:mousemove', this.snapOnMoving, this)
    this.model.off('batch:stop', this.onBatchStop, this)
    this.undelegateDocumentEvents()
  }

  protected parseFilter() {
    this.filterShapes = {}
    this.filterCells = {}
    this.filterFunction = null
    const filter = this.options.filter
    if (Array.isArray(filter)) {
      filter.forEach((item) => {
        if (typeof item === 'string') {
          this.filterShapes[item] = true
        } else {
          this.filterCells[item.id] = true
        }
      })
    } else if (typeof filter === 'function') {
      this.filterFunction = filter
    }
  }

  protected onBatchStop({ name, data }: Model.EventArgs['batch:stop']) {
    if (name === 'resize') {
      this.snapOnResizing(data.cell, data as Node.ResizeOptions)
    }
  }

  captureCursorOffset({ view, x, y }: EventArgs['node:mousedown']) {
    const targetView = view.getDelegatedView()
    if (targetView && this.isNodeMovable(targetView)) {
      const pos = view.cell.getPosition()
      this.offset = {
        x: x - pos.x,
        y: y - pos.y,
      }
    }
  }

  protected isNodeMovable(view: CellView) {
    return view && view.cell.isNode() && view.can('nodeMovable')
  }

  protected snapOnResizing(node: Node, options: Node.ResizeOptions) {
    if (
      this.options.resizing &&
      !options.snapped &&
      options.ui &&
      options.direction &&
      options.trueDirection
    ) {
      const view = this.graph.renderer.findViewByCell(node) as NodeView
      if (view && view.cell.isNode()) {
        const nodeBbox = node.getBBox()
        const nodeBBoxRotated = nodeBbox.bbox(node.getAngle())
        const nodeTopLeft = nodeBBoxRotated.getTopLeft()
        const nodeBottomRight = nodeBBoxRotated.getBottomRight()
        const angle = Angle.normalize(node.getAngle())
        const tolerance = this.options.tolerance || 0
        let verticalLeft: number | undefined
        let verticalTop: number | undefined
        let verticalHeight: number | undefined
        let horizontalTop: number | undefined
        let horizontalLeft: number | undefined
        let horizontalWidth: number | undefined

        const snapOrigin = {
          vertical: 0,
          horizontal: 0,
        }

        const direction = options.direction
        const trueDirection = options.trueDirection
        const relativeDirection = options.relativeDirection

        if (trueDirection.indexOf('right') !== -1) {
          snapOrigin.vertical = nodeBottomRight.x
        } else {
          snapOrigin.vertical = nodeTopLeft.x
        }

        if (trueDirection.indexOf('bottom') !== -1) {
          snapOrigin.horizontal = nodeBottomRight.y
        } else {
          snapOrigin.horizontal = nodeTopLeft.y
        }

        this.model.getNodes().some((cell) => {
          if (this.isIgnored(node, cell)) {
            return false
          }

          const snapBBox = cell.getBBox().bbox(cell.getAngle())
          const snapTopLeft = snapBBox.getTopLeft()
          const snapBottomRight = snapBBox.getBottomRight()
          const groups = {
            vertical: [snapTopLeft.x, snapBottomRight.x],
            horizontal: [snapTopLeft.y, snapBottomRight.y],
          }

          const distances = {} as {
            vertical: { position: number; distance: number }[]
            horizontal: { position: number; distance: number }[]
          }

          Object.keys(groups).forEach((k) => {
            const key = k as 'vertical' | 'horizontal'
            const list = groups[key]
              .map((value) => ({
                position: value,
                distance: Math.abs(value - snapOrigin[key]),
              }))
              .filter((item) => item.distance <= tolerance)

            distances[key] = ArrayExt.sortBy(list, (item) => item.distance)
          })

          if (verticalLeft == null && distances.vertical.length > 0) {
            verticalLeft = distances.vertical[0].position
            verticalTop = Math.min(nodeBBoxRotated.y, snapBBox.y)
            verticalHeight =
              Math.max(nodeBottomRight.y, snapBottomRight.y) - verticalTop
          }

          if (horizontalTop == null && distances.horizontal.length > 0) {
            horizontalTop = distances.horizontal[0].position
            horizontalLeft = Math.min(nodeBBoxRotated.x, snapBBox.x)
            horizontalWidth =
              Math.max(nodeBottomRight.x, snapBottomRight.x) - horizontalLeft
          }

          return verticalLeft != null && horizontalTop != null
        })

        this.hide()

        let dx = 0
        let dy = 0
        if (horizontalTop != null || verticalLeft != null) {
          if (verticalLeft != null) {
            dx =
              trueDirection.indexOf('right') !== -1
                ? verticalLeft - nodeBottomRight.x
                : nodeTopLeft.x - verticalLeft
          }

          if (horizontalTop != null) {
            dy =
              trueDirection.indexOf('bottom') !== -1
                ? horizontalTop - nodeBottomRight.y
                : nodeTopLeft.y - horizontalTop
          }
        }

        let dWidth = 0
        let dHeight = 0
        if (angle % 90 === 0) {
          if (angle === 90 || angle === 270) {
            dWidth = dy
            dHeight = dx
          } else {
            dWidth = dx
            dHeight = dy
          }
        } else {
          const quadrant =
            angle >= 0 && angle < 90
              ? 1
              : angle >= 90 && angle < 180
              ? 4
              : angle >= 180 && angle < 270
              ? 3
              : 2

          if (horizontalTop != null && verticalLeft != null) {
            if (dx < dy) {
              dy = 0
              horizontalTop = undefined
            } else {
              dx = 0
              verticalLeft = undefined
            }
          }

          const rad = Angle.toRad(angle % 90)
          if (dx) {
            dWidth = quadrant === 3 ? dx / Math.cos(rad) : dx / Math.sin(rad)
          }
          if (dy) {
            dHeight = quadrant === 3 ? dy / Math.cos(rad) : dy / Math.sin(rad)
          }

          const quadrant13 = quadrant === 1 || quadrant === 3
          switch (relativeDirection) {
            case 'top':
            case 'bottom':
              dHeight = dy
                ? dy / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                : dx / (quadrant13 ? Math.sin(rad) : Math.cos(rad))
              break
            case 'left':
            case 'right':
              dWidth = dx
                ? dx / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                : dy / (quadrant13 ? Math.sin(rad) : Math.cos(rad))
              break
            default:
              break
          }
        }

        switch (relativeDirection) {
          case 'top':
          case 'bottom':
            dWidth = 0
            break
          case 'left':
          case 'right':
            dHeight = 0
            break
          default:
            break
        }

        const gridSize = this.graph.getGridSize()
        let newWidth = Math.max(nodeBbox.width + dWidth, gridSize)
        let newHeight = Math.max(nodeBbox.height + dHeight, gridSize)

        if (options.minWidth && options.minWidth > gridSize) {
          newWidth = Math.max(newWidth, options.minWidth)
        }

        if (options.minHeight && options.minHeight > gridSize) {
          newHeight = Math.max(newHeight, options.minHeight)
        }

        if (options.maxWidth) {
          newWidth = Math.min(newWidth, options.maxWidth)
        }

        if (options.maxHeight) {
          newHeight = Math.min(newHeight, options.maxHeight)
        }

        if (options.preserveAspectRatio) {
          if (dHeight < dWidth) {
            newHeight = newWidth * (nodeBbox.height / nodeBbox.width)
          } else {
            newWidth = newHeight * (nodeBbox.width / nodeBbox.height)
          }
        }

        if (newWidth !== nodeBbox.width || newHeight !== nodeBbox.height) {
          node.resize(newWidth, newHeight, {
            direction,
            relativeDirection,
            trueDirection,
            snapped: true,
            snaplines: this.cid,
            restrict: this.graph.hook.getRestrictArea(view),
          })

          if (verticalHeight) {
            verticalHeight += newHeight - nodeBbox.height
          }

          if (horizontalWidth) {
            horizontalWidth += newWidth - nodeBbox.width
          }
        }

        const newRotatedBBox = node.getBBox().bbox(angle)
        if (
          verticalLeft &&
          Math.abs(newRotatedBBox.x - verticalLeft) > 1 &&
          Math.abs(newRotatedBBox.width + newRotatedBBox.x - verticalLeft) > 1
        ) {
          verticalLeft = undefined
        }

        if (
          horizontalTop &&
          Math.abs(newRotatedBBox.y - horizontalTop) > 1 &&
          Math.abs(newRotatedBBox.height + newRotatedBBox.y - horizontalTop) > 1
        ) {
          horizontalTop = undefined
        }

        this.update({
          verticalLeft,
          verticalTop,
          verticalHeight,
          horizontalTop,
          horizontalLeft,
          horizontalWidth,
        })
      }
    }
  }

  snapOnMoving({ view, e, x, y }: EventArgs['node:mousemove']) {
    const targetView: NodeView = view.getEventData(e).delegatedView || view
    if (!this.isNodeMovable(targetView)) {
      return
    }

    const node = targetView.cell
    const size = node.getSize()
    const position = node.getPosition()
    const cellBBox = new Rectangle(
      x - this.offset.x,
      y - this.offset.y,
      size.width,
      size.height,
    )
    const angle = node.getAngle()
    const nodeCenter = cellBBox.getCenter()
    const nodeBBoxRotated = cellBBox.bbox(angle)
    const nodeTopLeft = nodeBBoxRotated.getTopLeft()
    const nodeBottomRight = nodeBBoxRotated.getBottomRight()

    const distance = this.options.tolerance || 0
    let verticalLeft: number | undefined
    let verticalTop: number | undefined
    let verticalHeight: number | undefined
    let horizontalTop: number | undefined
    let horizontalLeft: number | undefined
    let horizontalWidth: number | undefined
    let verticalFix = 0
    let horizontalFix = 0

    this.model.getNodes().some((targetNode) => {
      if (this.isIgnored(node, targetNode)) {
        return false
      }

      const snapBBox = targetNode.getBBox().bbox(targetNode.getAngle())
      const snapCenter = snapBBox.getCenter()
      const snapTopLeft = snapBBox.getTopLeft()
      const snapBottomRight = snapBBox.getBottomRight()

      if (verticalLeft == null) {
        if (Math.abs(snapCenter.x - nodeCenter.x) < distance) {
          verticalLeft = snapCenter.x
          verticalFix = 0.5
        } else if (Math.abs(snapTopLeft.x - nodeTopLeft.x) < distance) {
          verticalLeft = snapTopLeft.x
          verticalFix = 0
        } else if (Math.abs(snapTopLeft.x - nodeBottomRight.x) < distance) {
          verticalLeft = snapTopLeft.x
          verticalFix = 1
        } else if (Math.abs(snapBottomRight.x - nodeBottomRight.x) < distance) {
          verticalLeft = snapBottomRight.x
          verticalFix = 1
        } else if (Math.abs(snapBottomRight.x - nodeTopLeft.x) < distance) {
          verticalLeft = snapBottomRight.x
        }

        if (verticalLeft != null) {
          verticalTop = Math.min(nodeBBoxRotated.y, snapBBox.y)
          verticalHeight =
            Math.max(nodeBottomRight.y, snapBottomRight.y) - verticalTop
        }
      }

      if (horizontalTop == null) {
        if (Math.abs(snapCenter.y - nodeCenter.y) < distance) {
          horizontalTop = snapCenter.y
          horizontalFix = 0.5
        } else if (Math.abs(snapTopLeft.y - nodeTopLeft.y) < distance) {
          horizontalTop = snapTopLeft.y
        } else if (Math.abs(snapTopLeft.y - nodeBottomRight.y) < distance) {
          horizontalTop = snapTopLeft.y
          horizontalFix = 1
        } else if (Math.abs(snapBottomRight.y - nodeBottomRight.y) < distance) {
          horizontalTop = snapBottomRight.y
          horizontalFix = 1
        } else if (Math.abs(snapBottomRight.y - nodeTopLeft.y) < distance) {
          horizontalTop = snapBottomRight.y
        }

        if (horizontalTop != null) {
          horizontalLeft = Math.min(nodeBBoxRotated.x, snapBBox.x)
          horizontalWidth =
            Math.max(nodeBottomRight.x, snapBottomRight.x) - horizontalLeft
        }
      }

      return verticalLeft != null && horizontalTop != null
    })

    this.hide()

    if (horizontalTop != null || verticalLeft != null) {
      if (horizontalTop != null) {
        nodeBBoxRotated.y =
          horizontalTop - horizontalFix * nodeBBoxRotated.height
      }

      if (verticalLeft != null) {
        nodeBBoxRotated.x = verticalLeft - verticalFix * nodeBBoxRotated.width
      }

      const newCenter = nodeBBoxRotated.getCenter()
      const newX = newCenter.x - cellBBox.width / 2
      const newY = newCenter.y - cellBBox.height / 2
      const dx = newX - position.x
      const dy = newY - position.y

      if (dx !== 0 || dy !== 0) {
        node.translate(dx, dy, {
          snapped: true,
          restrict: this.graph.hook.getRestrictArea(targetView),
        })

        if (horizontalWidth) {
          horizontalWidth += dx
        }

        if (verticalHeight) {
          verticalHeight += dy
        }
      }

      this.update({
        verticalLeft,
        verticalTop,
        verticalHeight,
        horizontalTop,
        horizontalLeft,
        horizontalWidth,
      })
    }
  }

  protected isIgnored(snapNode: Node, targetNode: Node) {
    return (
      targetNode.id === snapNode.id ||
      targetNode.isDescendantOf(snapNode) ||
      this.filterShapes[targetNode.shape] ||
      this.filterCells[targetNode.id] ||
      (this.filterFunction &&
        FunctionExt.call(this.filterFunction, this.graph, targetNode))
    )
  }

  protected update(metadata: {
    verticalLeft?: number
    verticalTop?: number
    verticalHeight?: number
    horizontalTop?: number
    horizontalLeft?: number
    horizontalWidth?: number
  }) {
    const ctm = this.graph.matrix()
    const sx = ctm.a
    const sy = ctm.d
    const tx = ctm.e
    const ty = ctm.f

    const sharp = this.options.sharp
    const hasScroller = this.graph.scroller.widget != null

    if (metadata.horizontalTop) {
      this.$horizontal
        .css({
          top: metadata.horizontalTop * sy + ty,
          left: sharp
            ? metadata.horizontalLeft! * sx + tx
            : hasScroller
            ? '-300%'
            : 0,
          width: sharp
            ? metadata.horizontalWidth! * sx
            : hasScroller
            ? '700%'
            : '100%',
        })
        .show()
    } else {
      this.$horizontal.hide()
    }

    if (metadata.verticalLeft) {
      this.$vertical
        .css({
          left: metadata.verticalLeft * sx + tx,
          top: sharp
            ? metadata.verticalTop! * sy + ty
            : hasScroller
            ? '-300%'
            : 0,
          height: sharp
            ? metadata.verticalHeight! * sy
            : hasScroller
            ? '700%'
            : '100%',
        })
        .show()
    } else {
      this.$vertical.hide()
    }

    this.show()
  }

  protected resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  show() {
    this.$container.show()
    this.resetTimer()
    if (this.container.parentNode == null) {
      this.graph.container.appendChild(this.container)
    }
    return this
  }

  hide() {
    this.$container.hide()
    this.resetTimer()
    const clean = this.options.clean
    const delay = typeof clean === 'number' ? clean : clean !== false ? 3000 : 0
    if (delay > 0) {
      this.timer = window.setTimeout(() => {
        this.unmount()
      }, delay)
    }

    return this
  }

  protected onRemove() {
    this.stopListening()
    this.hide()
  }

  @View.dispose()
  dispose() {
    this.remove()
  }
}

export namespace Snapline {
  export interface Options {
    enabled?: boolean
    className?: string
    tolerance?: number
    sharp?: boolean
    /**
     * Specify if snap on node resizing or not.
     */
    resizing?: boolean
    clean?: boolean | number
    filter?: Filter
  }

  export type Filter = null | (string | { id: string })[] | FilterFunction

  export type FilterFunction = (this: Graph, node: Node) => boolean
}
