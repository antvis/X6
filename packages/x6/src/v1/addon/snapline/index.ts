import { Point, Rectangle, Angle } from '../../../geometry'
import { View } from '../../core/view'
import { Cell } from '../../core/cell'
import { Node } from '../../core/node'
import { Graph } from '../../core/graph'
import { Model } from '../../core/model'
import { CellView } from '../../core/cell-view'
import { NodeView } from '../../core/node-view'
import { Transform } from '../transform'
import { ArrayExt } from '../../../util'

export class Snapline extends View {
  protected readonly options: Snapline.Options
  protected filterTypes: { [type: string]: boolean }
  protected filterCells: { [id: string]: boolean }
  protected filterFunction: Snapline.filterFunction | null
  protected cursorOffset: Point.PointLike

  protected $container: JQuery<HTMLElement>
  protected $horizontal: JQuery<HTMLElement>
  protected $vertical: JQuery<HTMLElement>

  constructor(options: Snapline.Options) {
    super()
    this.options = { distance: 10, ...options }
    this.render()
    this.startListening()
    this.prepareFilters()
  }

  get graph() {
    return this.options.graph
  }

  get model() {
    return this.graph.model
  }

  render() {
    this.container = document.createElement('div')
    this.$container = this.$(this.container)
    this.$horizontal = this.$(document.createElement('div')).addClass(
      'horizontal',
    )
    this.$vertical = this.$(document.createElement('div')).addClass('vertical')
    this.$container
      .hide()
      .addClass(this.prefixClassName('snaplines'))
      .append([this.$horizontal, this.$vertical])
      .appendTo(this.graph.container)
  }

  protected startListening() {
    this.stopListening()
    this.graph.on('node:mousedown', this.captureCursorOffset, this)
    this.graph.on('node:mousemove', this.snapWhileMoving, this)
    this.model.on('batch:stop', this.onBatchStop, this)
    this.delegateDocumentEvents({
      mouseup: 'hide',
      touchend: 'hide',
    })
  }

  protected stopListening() {
    this.graph.off('node:mousedown', this.captureCursorOffset, this)
    this.graph.off('node:mousemove', this.snapWhileMoving, this)
    this.model.off('batch:stop', this.onBatchStop, this)
    this.undelegateDocumentEvents()
  }

  protected prepareFilters() {
    this.filterTypes = {}
    this.filterCells = {}
    this.filterFunction = null
    const filter = this.options.filter
    if (Array.isArray(filter)) {
      filter.forEach(item => {
        if (typeof item === 'string') {
          this.filterTypes[item] = true
        } else {
          this.filterCells[item.id] = true
        }
      })
    } else {
      if (typeof filter === 'function') {
        this.filterFunction = filter
      }
    }
  }

  protected onBatchStop({ name, data }: Model.EventArgs['batch:stop']) {
    if ('resize' === name) {
      this.snapWhileResizing(data.cell, data as Transform.ResizeOptions)
    }
  }

  protected captureCursorOffset({
    view,
    x,
    y,
  }: Graph.EventArgs['node:mousedown']) {
    const targetView = view.getDelegatedView()
    if (targetView && this.canElementMove(targetView)) {
      const pos = view.cell.getPosition()
      this.cursorOffset = {
        x: x - pos.x,
        y: y - pos.y,
      }
    }
  }

  protected canElementMove(view: CellView) {
    return view && view.cell.isNode() && view.can('elementMove')
  }

  protected snapWhileResizing(node: Node, options: Transform.ResizeOptions) {
    if (
      this.options.snapOnResizing &&
      !options.snapped &&
      options.ui &&
      options.direction &&
      options.trueDirection
    ) {
      const view = this.graph.findViewByCell(node) as NodeView
      if (view && view.cell.isNode()) {
        const nodeBbox = node.getBBox()
        const nodeBBoxRotated = nodeBbox.bbox(node.getRotation())
        const nodeTopLeft = nodeBBoxRotated.getTopLeft()
        const nodeBottomRight = nodeBBoxRotated.getBottomRight()
        const rotation = Angle.normalize(node.getRotation())
        const distance = this.options.distance || 0
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

        this.model.getNodes().some(cell => {
          if (this.isIgnored(node, cell)) {
            return false
          }

          const snapBBox = cell.getBBox().bbox(cell.getRotation())
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

          Object.keys(groups).forEach(k => {
            const key = k as 'vertical' | 'horizontal'
            const list = groups[key]
              .map(value => ({
                position: value,
                distance: Math.abs(value - snapOrigin[key]),
              }))
              .filter(item => item.distance <= distance)

            distances[key] = ArrayExt.sortBy(list, item => item.distance)
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
        if (rotation % 90 === 0) {
          if (90 === rotation || 270 === rotation) {
            dWidth = dy
            dHeight = dx
          } else {
            dWidth = dx
            dHeight = dy
          }
        } else {
          const quadrant =
            0 <= rotation && rotation < 90
              ? 1
              : 90 <= rotation && rotation < 180
              ? 4
              : 180 <= rotation && rotation < 270
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

          const rad = Angle.toRad(rotation % 90)
          if (dx) {
            dWidth = quadrant === 3 ? dx / Math.cos(rad) : dx / Math.sin(rad)
          }
          if (dy) {
            dHeight = quadrant === 3 ? dy / Math.cos(rad) : dy / Math.sin(rad)
          }

          const quadrant13 = 1 === quadrant || 3 === quadrant
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
        }

        const gridSize = this.graph.options.gridSize
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
            restrictedArea: this.graph.getRestrictedArea(view),
          })

          if (verticalHeight) {
            verticalHeight += newHeight - nodeBbox.height
          }

          if (horizontalWidth) {
            horizontalWidth += newWidth - nodeBbox.width
          }
        }

        const newRotatedBBox = node.getBBox().bbox(rotation)
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

        this.show({
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

  protected snapWhileMoving({
    view,
    e,
    x,
    y,
  }: Graph.EventArgs['node:mousemove']) {
    const targetView: NodeView = view.getEventData(e).delegatedView || view
    if (!this.canElementMove(targetView)) {
      return
    }

    const node = targetView.cell
    const size = node.getSize()
    const position = node.getPosition()
    const cellBBox = new Rectangle(
      x - this.cursorOffset.x,
      y - this.cursorOffset.y,
      size.width,
      size.height,
    )
    const rotation = node.getRotation()
    const nodeCenter = cellBBox.getCenter()
    const nodeBBoxRotated = cellBBox.bbox(rotation)
    const nodeTopLeft = nodeBBoxRotated.getTopLeft()
    const nodeBottomRight = nodeBBoxRotated.getBottomRight()

    const distance = this.options.distance || 0
    let verticalLeft: number | undefined
    let verticalTop: number | undefined
    let verticalHeight: number | undefined
    let horizontalTop: number | undefined
    let horizontalLeft: number | undefined
    let horizontalWidth: number | undefined
    let verticalFix = 0
    let horizontalFix = 0

    this.model.getNodes().some(targetNode => {
      if (this.isIgnored(node, targetNode)) {
        return false
      }

      const snapBBox = targetNode.getBBox().bbox(targetNode.getRotation())
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
          restrictedArea: this.graph.getRestrictedArea(targetView),
          snapped: true,
        })

        if (horizontalWidth) {
          horizontalWidth += dx
        }

        if (verticalHeight) {
          verticalHeight += dy
        }
      }

      this.show({
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
      this.filterTypes[targetNode.type] ||
      this.filterCells[targetNode.id] ||
      (this.filterFunction && this.filterFunction(targetNode))
    )
  }

  protected show(metadata: {
    verticalLeft?: number
    verticalTop?: number
    verticalHeight?: number
    horizontalTop?: number
    horizontalLeft?: number
    horizontalWidth?: number
  }) {
    const ctm = this.graph.getMatrix()
    const sx = ctm.a
    const sy = ctm.d
    const tx = ctm.e
    const ty = ctm.f

    const truncated = this.options.truncated
    if (metadata.horizontalTop) {
      this.$horizontal
        .css({
          top: metadata.horizontalTop * sy + ty,
          left: truncated ? metadata.horizontalLeft! * sx + tx : 0,
          width: truncated ? metadata.horizontalWidth! * sx : '100%',
        })
        .show()
    } else {
      this.$horizontal.hide()
    }

    if (metadata.verticalLeft) {
      this.$vertical
        .css({
          left: metadata.verticalLeft * sx + tx,
          top: truncated ? metadata.verticalTop! * sy + ty : 0,
          height: truncated ? metadata.verticalHeight! * sy : '100%',
        })
        .show()
    } else {
      this.$vertical.hide()
    }

    this.$container.show()
  }

  protected hide() {
    this.$container.hide()
  }
}

export namespace Snapline {
  export interface Options {
    graph: Graph
    truncated?: boolean
    snapOnResizing?: boolean
    distance?: number
    filter?: (string | Cell)[] | filterFunction
  }

  export type filterFunction = (node: Node) => boolean
}
