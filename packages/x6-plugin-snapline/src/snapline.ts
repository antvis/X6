import {
  IDisablable,
  ArrayExt,
  FunctionExt,
  Vector,
  Angle,
  Point,
  Rectangle,
  Graph,
  EventArgs,
  Model,
  Node,
  CellView,
  NodeView,
  View,
  PointLike,
} from '@antv/x6'

interface AlignOptions {
  diff: number
  src: PointLike
  dist: PointLike
}

export class SnaplineImpl extends View implements IDisablable {
  public readonly options: SnaplineImpl.Options
  protected readonly graph: Graph
  protected offset: Point.PointLike
  protected timer: number | null

  public container: SVGElement
  protected containerWrapper: Vector
  protected horizontal: Vector
  protected vertical: Vector

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

  constructor(options: SnaplineImpl.Options & { graph: Graph }) {
    super()

    const { graph, ...others } = options
    this.graph = graph
    this.options = { ...others }
    this.offset = { x: 0, y: 0 }
    this.render()
    if (!this.disabled) {
      this.startListening()
    }
  }

  public get disabled() {
    return this.options.enabled !== true
  }

  public get byPort() {
    return this.options.byPort === true
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      this.startListening()
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      this.stopListening()
    }
  }

  setFilter(filter?: SnaplineImpl.Filter) {
    this.options.filter = filter
  }

  protected render() {
    const container = (this.containerWrapper = new Vector('svg'))
    const horizontal = (this.horizontal = new Vector('line'))
    const vertical = (this.vertical = new Vector('line'))

    container.addClass(this.containerClassName)
    horizontal.addClass(this.horizontalClassName)
    vertical.addClass(this.verticalClassName)

    container.setAttribute('width', '100%')
    container.setAttribute('height', '100%')

    horizontal.setAttribute('display', 'none')
    vertical.setAttribute('display', 'none')

    container.append([horizontal, vertical])

    if (this.options.className) {
      container.addClass(this.options.className)
    }

    this.container = this.containerWrapper.node
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

  protected getRestrictArea(view?: NodeView): Rectangle.RectangleLike | null {
    const restrict = this.graph.options.translating.restrict
    const area =
      typeof restrict === 'function'
        ? FunctionExt.call(restrict, this.graph, view!)
        : restrict

    if (typeof area === 'number') {
      return this.graph.transform.getGraphArea().inflate(area)
    }

    if (area === true) {
      return this.graph.transform.getGraphArea()
    }

    return area || null
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
            restrict: this.getRestrictArea(view),
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

  getPortPosition(node: Node, portId: string) {
    const port = node.getPort(portId)
    if (!port) return null
    const positions = node.getPortsPosition(port.group!)
    const portRelPos = positions[portId]
    const { x, y } = node.getPosition()
    const { width, height } = node.getSize()
    const angle = node.getAngle()
    const relPos = Point.rotate(portRelPos.position, -angle || 0, {
      x: width / 2,
      y: height / 2,
    })

    return { x: x + relPos.x, y: y + relPos.y }
  }

  findMinDistance(ports: PointLike[], tPorts: PointLike[]) {
    const distance = this.options.tolerance || 0
    const getMin = (type: 'x' | 'y'): AlignOptions | null => {
      let min: AlignOptions | null = null
      ports.forEach((point) => {
        tPorts.forEach((tPoint) => {
          const diff = Math.abs(point[type] - tPoint[type])
          if (diff > distance) return
          if (!min) {
            min = { diff, src: point, dist: tPoint }
          } else if (min.diff > diff) {
            min = { diff, src: point, dist: tPoint }
          }
        })
      })

      return min
    }
    const minX = getMin('x')
    const minY = getMin('y')

    return { minX, minY }
  }

  getNodePorts(node: Node): PointLike[] {
    return <PointLike[]>node
      .getPorts()
      .map((portMeta) => this.getPortPosition(node, portMeta.id!))
      .filter((item) => !!item)
  }

  getAlignArgsByPorts(targetView: NodeView) {
    const tNode = targetView.cell
    const nodes = this.model.getNodes().filter((item) => item !== tNode)
    const tPorts = this.getNodePorts(tNode)
    const aligns = nodes
      .map((node) => this.findMinDistance(this.getNodePorts(node), tPorts))
      .filter((item) => !!item)

    return this.getAlign(aligns)
  }

  getNodePoints(node: Node): PointLike[] {
    const size = node.getSize()
    const position = node.getPosition()
    const cellBBox = new Rectangle(
      position.x,
      position.y,
      size.width,
      size.height,
    )
    const angle = node.getAngle()
    const rotatedBox = cellBBox.bbox(angle)
    const topLeft = rotatedBox.getTopLeft()
    const topRight = rotatedBox.getTopRight()
    const bottomRight = rotatedBox.getBottomRight()
    const bottomLeft = rotatedBox.getBottomLeft()
    const center = rotatedBox.getCenter()

    return [topLeft, topRight, bottomRight, bottomLeft, center]
  }

  getAlign(
    aligns: Array<{ minX: AlignOptions | null; minY: AlignOptions | null }>,
  ) {
    const xAligns: AlignOptions[] = []
    const yAligns: AlignOptions[] = []
    aligns.forEach((item) => {
      const { minX, minY } = item
      minX && xAligns.push(minX)
      minY && yAligns.push(minY)
    })

    return {
      minX: minBy<AlignOptions>(xAligns, 'diff'),
      minY: minBy<AlignOptions>(yAligns, 'diff'),
    }
  }

  getAlignArgsByNode(targetView: NodeView) {
    const tNode = targetView.cell
    const nodes = this.model.getNodes().filter((item) => item !== tNode)
    const tPoints = this.getNodePoints(tNode)
    const aligns = nodes
      .map((node) => this.findMinDistance(this.getNodePoints(node), tPoints))
      .filter((item) => !!item)

    return this.getAlign(aligns)
  }

  snapOnMoving(event: EventArgs['node:mousemove']) {
    const { view, e } = event
    const targetView: NodeView = view.getEventData(e).delegatedView || view
    if (!this.isNodeMovable(targetView)) {
      return
    }
    const nodeArgs = this.getAlignArgsByNode(targetView)
    let xArgs = nodeArgs.minX
    let yArgs = nodeArgs.minY
    if (this.byPort) {
      const portArgs = this.getAlignArgsByPorts(targetView)
      xArgs = minBy([portArgs.minX, nodeArgs.minX], 'diff')
      yArgs = minBy([portArgs.minY, nodeArgs.minY], 'diff')
    }

    const node = targetView.cell

    let verticalLeft: number | undefined
    let verticalTop: number | undefined
    let verticalHeight: number | undefined
    let horizontalTop: number | undefined
    let horizontalLeft: number | undefined
    let horizontalWidth: number | undefined

    this.hide()

    if (xArgs || yArgs) {
      let dx = 0
      let dy = 0
      if (xArgs) {
        const { src, dist } = xArgs as AlignOptions
        verticalLeft = src.x
        verticalTop = Math.min(src.y, dist.y) - 100
        verticalHeight = Math.max(src.y, dist.y) - verticalTop + 100
        dx = verticalLeft! - dist.x
      }
      if (yArgs) {
        const { src, dist } = yArgs as AlignOptions
        horizontalTop = src.y
        horizontalLeft = Math.min(src.x, dist.x) - 100
        horizontalWidth = Math.max(src.x, dist.x) - horizontalLeft + 100
        dy = horizontalTop! - dist.y
      }

      if (dx !== 0 || dy !== 0) {
        node.translate(dx, dy, {
          snapped: true,
          restrict: this.getRestrictArea(targetView),
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
      !this.filter(targetNode)
    )
  }

  protected filter(node: Node) {
    const filter = this.options.filter
    if (Array.isArray(filter)) {
      return filter.some((item) => {
        if (typeof item === 'string') {
          return node.shape === item
        }
        return node.id === item.id
      })
    }
    if (typeof filter === 'function') {
      return FunctionExt.call(filter, this.graph, node)
    }

    return true
  }

  protected update(metadata: {
    verticalLeft?: number
    verticalTop?: number
    verticalHeight?: number
    horizontalTop?: number
    horizontalLeft?: number
    horizontalWidth?: number
  }) {
    // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
    if (metadata.horizontalTop) {
      const start = this.graph.localToGraph(
        new Point(metadata.horizontalLeft, metadata.horizontalTop),
      )
      const end = this.graph.localToGraph(
        new Point(
          metadata.horizontalLeft! + metadata.horizontalWidth!,
          metadata.horizontalTop,
        ),
      )
      this.horizontal.setAttributes({
        x1: this.options.sharp ? `${start.x}` : '0',
        y1: `${start.y}`,
        x2: this.options.sharp ? `${end.x}` : '100%',
        y2: `${end.y}`,
        display: 'inherit',
      })
    } else {
      this.horizontal.setAttribute('display', 'none')
    }

    if (metadata.verticalLeft) {
      const start = this.graph.localToGraph(
        new Point(metadata.verticalLeft, metadata.verticalTop),
      )
      const end = this.graph.localToGraph(
        new Point(
          metadata.verticalLeft,
          metadata.verticalTop! + metadata.verticalHeight!,
        ),
      )
      this.vertical.setAttributes({
        x1: `${start.x}`,
        y1: this.options.sharp ? `${start.y}` : '0',
        x2: `${end.x}`,
        y2: this.options.sharp ? `${end.y}` : '100%',
        display: 'inherit',
      })
    } else {
      this.vertical.setAttribute('display', 'none')
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
    this.resetTimer()
    if (this.container.parentNode == null) {
      this.graph.container.appendChild(this.container)
    }
    return this
  }

  hide() {
    this.resetTimer()
    this.vertical.setAttribute('display', 'none')
    this.horizontal.setAttribute('display', 'none')
    const clean = this.options.clean
    const delay = typeof clean === 'number' ? clean : clean !== false ? 3000 : 0
    if (delay > 0) {
      this.timer = window.setTimeout(() => {
        if (this.container.parentNode !== null) {
          this.unmount()
        }
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

function minBy<T>(
  arr: Array<{ [key: string]: any } | null>,
  att: string,
): T | null {
  let res: any = null
  arr.forEach((item) => {
    if (!item) return
    if (!res) {
      res = item
    } else {
      if (res[att] > item[att]) {
        res = item
      }
    }
  })

  return res
}

export namespace SnaplineImpl {
  export interface Options {
    enabled?: boolean
    className?: string
    tolerance?: number
    sharp?: boolean
    /**
     * Specify if snap on node resizing or not.
     */
    resizing?: boolean
    /**
     * Specify if snap by port position or not.
     */
    byPort?: boolean
    clean?: boolean | number
    filter?: Filter
  }

  export type Filter = null | (string | { id: string })[] | FilterFunction

  export type FilterFunction = (this: Graph, node: Node) => boolean
}
