import { Point, Rectangle } from '../geometry'
import { ArrayExt, FunctionExt, ObjectExt } from '../util'
import { Disposable } from '../entity'
import { Graph } from '../graph'
import { Geometry } from './geometry'
import { Style } from '../types'
import { Overlay } from '../struct'

export class Cell extends Disposable {
  public id?: string | number | null
  public data: any
  public style: Style
  public visible: boolean
  public render: Cell.Renderer | null
  public geometry: Geometry | null
  public overlays: Overlay[] | null

  public parent: Cell | null
  public children: Cell[] | null
  public edges: Cell[] | null
  public collapsed: boolean

  public source: Cell | null
  public target: Cell | null

  private node?: boolean
  private edge?: boolean

  constructor(data?: any, geometry?: Geometry | null, style?: Style) {
    super()
    this.data = data || null
    this.style = style || {}
    this.geometry = geometry || null
    this.visible = true
  }

  // #region edge

  isEdge() {
    return this.edge === true
  }

  asEdge(v: boolean = true) {
    this.edge = v
  }

  getTerminal(isSource?: boolean) {
    return isSource ? this.source : this.target
  }

  setTerminal(terminal: Cell | null, isSource?: boolean) {
    if (isSource) {
      this.source = terminal
    } else {
      this.target = terminal
    }

    return terminal
  }

  removeFromTerminal(isSource?: boolean) {
    const terminal = this.getTerminal(isSource)
    if (terminal != null) {
      terminal.removeEdge(this, isSource)
    }
  }

  // #endregion

  // #region node

  isNode() {
    return this.node != null
  }

  asNode(v: boolean = true) {
    this.node = v
  }

  getEdges() {
    return this.edges
  }

  eachEdge(
    iterator: (edge: Cell, index: number, edges: Cell[]) => void,
    context?: any,
  ) {
    return ArrayExt.forEach(this.edges, iterator, context)
  }

  getEdgeCount() {
    return this.edges == null ? 0 : this.edges.length
  }

  getEdgeIndex(edge: Cell) {
    return ArrayExt.indexOf(this.edges, edge)
  }

  getEdgeAt(index: number) {
    return this.edges == null ? null : this.edges[index]
  }

  insertEdge(edge: Cell, isOutgoing?: boolean) {
    if (edge != null) {
      edge.removeFromTerminal(isOutgoing)
      edge.setTerminal(this, isOutgoing)

      if (
        this.edges == null ||
        edge.getTerminal(!isOutgoing) !== this ||
        ArrayExt.indexOf(this.edges, edge) < 0
      ) {
        if (this.edges == null) {
          this.edges = []
        }

        this.edges.push(edge)
      }
    }

    return edge
  }

  removeEdge(edge: Cell, isOutgoing?: boolean) {
    if (edge != null) {
      if (edge.getTerminal(!isOutgoing) !== this && this.edges != null) {
        const index = this.getEdgeIndex(edge)
        if (index >= 0) {
          this.edges.splice(index, 1)
        }
      }

      edge.setTerminal(null, isOutgoing)
    }

    return edge
  }

  isCollapsed() {
    return !!this.collapsed
  }

  setCollapsed(collapsed: boolean) {
    this.collapsed = collapsed
  }

  collapse() {
    return this.setCollapsed(true)
  }

  expand() {
    return this.setCollapsed(false)
  }

  toggleCollapse() {
    return this.collapsed ? this.expand() : this.collapse()
  }

  // #endregion

  // #region parent

  getParent() {
    return this.parent
  }

  setParent(parent: Cell | null) {
    this.parent = parent
  }

  removeFromParent() {
    if (this.parent != null) {
      const index = this.parent.getChildIndex(this)
      this.parent.removeChildAt(index)
    }
  }

  isOrphan() {
    return this.parent == null
  }

  isAncestor(descendant?: Cell | null) {
    if (descendant == null) {
      return false
    }

    let des: Cell | null = descendant
    while (des && des !== this) {
      des = des.parent
    }

    return des === this
  }

  getAncestors() {
    const ancestors: Cell[] = []
    let parent = this.parent

    while (parent != null) {
      ancestors.push(parent)
      parent = parent.parent
    }

    return ancestors
  }

  getDescendants() {
    const descendants: Cell[] = []
    if (this.children) {
      this.eachChild(child => {
        descendants.push(child)
        descendants.push(...child.getDescendants())
      })
    }
    return descendants
  }

  // #endregion

  // #region children

  getChildren() {
    return this.children
  }

  getChildCount() {
    return this.children == null ? 0 : this.children.length
  }

  getChildIndex(child: Cell) {
    return ArrayExt.indexOf(this.children, child)
  }

  getChildAt(index: number) {
    return this.children == null ? null : this.children[index]
  }

  insertChild(child: Cell, index?: number) {
    if (child != null) {
      let pos = index
      if (pos == null) {
        pos = this.getChildCount()
        if (child.getParent() === this) {
          pos -= 1
        }
      }

      child.removeFromParent()
      child.setParent(this)

      if (this.children == null) {
        this.children = []
        this.children.push(child)
      } else {
        this.children.splice(pos, 0, child)
      }
    }

    return child
  }

  removeChild(child: Cell) {
    const index = this.getChildIndex(child)
    return this.removeChildAt(index)
  }

  removeChildAt(index: number) {
    let child = null

    if (this.children != null && index >= 0) {
      child = this.getChildAt(index)
      if (child != null) {
        child.setParent(null)
        this.children.splice(index, 1)
      }
    }

    return child
  }

  eachChild(
    iterator: (child: Cell, index: number, children: Cell[]) => void,
    context?: any,
  ) {
    return ArrayExt.forEach(this.children, iterator, context)
  }

  // #endregion

  // #region visible

  isVisible() {
    return this.visible
  }

  setVisible(visible: boolean) {
    this.visible = visible
  }

  show() {
    return this.setVisible(true)
  }

  hide() {
    return this.setVisible(false)
  }

  toggleVisible() {
    return this.isVisible() ? this.hide() : this.show()
  }

  // #endregion

  getRender() {
    return this.render
  }

  setRender(renderer: Cell.Renderer | null) {
    this.render = renderer
  }

  getId() {
    return this.id
  }

  setId(id?: string | number | null) {
    this.id = id
  }

  getData() {
    return this.data
  }

  setData(data: any) {
    this.data = data
  }

  getStyle() {
    return this.style
  }

  setStyle(style: Style) {
    this.style = style
  }

  getGeometry() {
    return this.geometry
  }

  setGeometry(geometry: Geometry) {
    this.geometry = geometry
  }

  getOverlays() {
    return this.overlays
  }

  setOverlays(overlays: Overlay[] | null) {
    this.overlays = overlays
  }

  clone() {
    const clone = ObjectExt.clone<Cell>(this, Cell.ignoredKeysWhenClone)!
    clone.setData(this.cloneData())
    return clone
  }

  protected cloneData() {
    let data = this.getData()
    if (data != null) {
      if (FunctionExt.isFunction(data.clone)) {
        data = data.clone()
      } else if (!isNaN(data.nodeType)) {
        data = data.cloneNode(true)
      }
    }

    return data
  }

  @Disposable.dispose()
  dispose() {
    // node
    this.eachChild(child => child.dispose())
    this.eachEdge(edge => edge.dispose())
    this.removeFromParent()

    // edge
    this.removeFromTerminal(true)
    this.removeFromTerminal(false)
  }
}

export namespace Cell {
  export const ignoredKeysWhenClone = [
    'id',
    'data',
    'parent',
    'source',
    'target',
    'children',
    'edges',
  ]

  export type Renderer = (
    this: Graph,
    elem: HTMLElement | SVGElement,
    cell: Cell,
  ) => void
}

// Cell Creation
export namespace Cell {
  export interface CreateCellOptions {
    id?: string | number | null
    data?: any
    visible?: boolean
    overlays?: Overlay[]
    render?: Renderer | null
  }

  export interface NestedStyle extends Style {
    style?: Style
  }

  export interface CreateNodeOptions extends CreateCellOptions, NestedStyle {
    /**
     * Specifies the x-coordinate of the node. For relative geometries, this
     * defines the percentage x-coordinate relative the parent width, which
     * value should be within `0-1`. For absolute geometries, this defines the
     * absolute x-coordinate in the graph.
     */
    x?: number

    /**
     * Specifies the y-coordinate of the node. For relative geometries, this
     * defines the percentage y-coordinate relative the parent height, which
     * value should be within `0-1`. For absolute geometries, this defines the
     * absolute y-coordinate in the graph.
     */
    y?: number

    width?: number
    height?: number

    /**
     * Specifies if the coordinates in the geometry are to be interpreted
     * as relative coordinates. If this is `true`, then the coordinates are
     * relative to the origin of the parent cell.
     */
    relative?: boolean

    /**
     * For relative geometries, this defines the absolute offset from the
     * point defined by the relative coordinates. For absolute geometries,
     * this defines the offset for the label.
     */
    offset?: Point | Point.PointLike

    collapsed?: boolean

    /**
     * Stores alternate values for x, y, width and height in a rectangle.
     */
    alternateBounds?: Rectangle | Rectangle.RectangleLike
  }

  export interface CreateEdgeOptions extends CreateCellOptions, NestedStyle {
    /**
     * The source `Point` of the edge. This is used if the corresponding
     * edge does not have a source node. Otherwise it is ignored.
     */
    sourcePoint?: Point | Point.PointLike

    /**
     * The target `Point` of the edge. This is used if the corresponding
     * edge does not have a target node. Otherwise it is ignored.
     */
    targetPoint?: Point | Point.PointLike

    /**
     * Specifies the control points along the edge. These points are the
     * intermediate points on the edge, for the endpoints use `targetPoint`
     * and `sourcePoint` or set the terminals of the edge to a non-null value.
     */
    points?: (Point | Point.PointLike | Point.PointData)[]

    offset?: Point | Point.PointLike
  }

  export function createNode(options: CreateNodeOptions = {}): Cell {
    const {
      id,
      data,
      visible,
      overlays,
      render,
      x,
      y,
      width,
      height,
      relative,
      offset,
      collapsed,
      alternateBounds,
      style,
      ...otherStyle
    } = options

    const geo = new Geometry(x, y, width, height)

    geo.relative = relative != null ? relative : false

    if (offset != null) {
      geo.offset = Point.create(offset)
    }

    if (alternateBounds != null) {
      geo.alternateBounds = Rectangle.create(alternateBounds)
    }

    const finalStyle = { ...otherStyle, ...style }
    const node = new Cell(data, geo, finalStyle)
    if (collapsed != null) {
      node.setCollapsed(collapsed)
    }

    return applyCommonOptions(node, options, true)
  }

  export function createEdge(options: CreateEdgeOptions): Cell {
    const {
      id,
      data,
      visible,
      overlays,
      render,
      sourcePoint,
      targetPoint,
      points,
      offset,
      style,
      ...otherStyle
    } = options

    const geom = new Geometry()
    geom.relative = true

    if (sourcePoint != null) {
      geom.sourcePoint = Point.create(sourcePoint)
    }

    if (targetPoint != null) {
      geom.targetPoint = Point.create(targetPoint)
    }

    if (offset != null) {
      geom.offset = Point.create(offset)
    }

    if (points != null) {
      points.forEach(p => geom.addPoint(p))
    }

    const finalStyle = { ...otherStyle, ...style }
    const edge = new Cell(data, geom, finalStyle)
    return applyCommonOptions(edge, options, false)
  }

  function applyCommonOptions(
    node: Cell,
    options: CreateCellOptions,
    isNode: boolean,
  ) {
    node.setId(options.id)

    if (isNode) {
      node.asNode(true)
    } else {
      node.asEdge(true)
    }

    if (options.visible != null) {
      node.setVisible(options.visible)
    } else {
      node.setVisible(true)
    }

    if (options.overlays != null) {
      node.setOverlays(options.overlays)
    }

    if (options.render) {
      node.setRender(options.render)
    }

    return node
  }
}

// Cell Path
export namespace Cell {
  const separator = '.'

  export function getCellPath(cell: Cell) {
    const idxs = []
    if (cell != null) {
      let child = cell
      let parent = child.getParent()

      while (parent != null) {
        const index = parent.getChildIndex(child)
        idxs.unshift(index)
        child = parent
        parent = child.getParent()
      }
    }

    return idxs.join(separator)
  }

  export function getParentPath(path: string) {
    if (path != null) {
      const index = path.lastIndexOf(separator)
      if (index >= 0) {
        return path.substring(0, index)
      }
    }

    return ''
  }

  function compare(p1: string[], p2: string[]) {
    let comp = 0
    const min = Math.min(p1.length, p2.length)

    for (let i = 0; i < min; i += 1) {
      const v1 = p1[i]
      const v2 = p2[i]

      if (v1 !== v2) {
        if (v1.length === 0 || v2.length === 0) {
          comp = v1 === v2 ? 0 : v1 > v2 ? 1 : -1
        } else {
          const t1 = parseInt(v1, 10)
          const t2 = parseInt(v2, 10)
          comp = t1 === t2 ? 0 : t1 > t2 ? 1 : -1
        }

        break
      }
    }

    // Compares path length if both paths are equal to this point
    if (comp === 0) {
      const t1 = p1.length
      const t2 = p2.length
      if (t1 !== t2) {
        comp = t1 > t2 ? 1 : -1
      }
    }

    return comp
  }

  /**
   * Sorts the given cells according to the order in the cell hierarchy.
   */
  export function sortCells(cells: Cell[], ascending: boolean = true) {
    const dict = new WeakMap<Cell, string[]>()
    const ensure = (c: Cell) => {
      let p = dict.get(c)
      if (p == null) {
        p = getCellPath(c).split(separator)
        dict.set(c, p)
      }
      return p
    }

    return cells.sort((c1, c2) => {
      const p1 = ensure(c1)
      const p2 = ensure(c2)
      const comp = compare(p1, p2)
      return comp === 0 ? 0 : comp > 0 === ascending ? 1 : -1
    })
  }

  export function getNearestCommonAncestor(
    cell1: Cell | null,
    cell2: Cell | null,
  ): Cell | null {
    if (cell1 != null && cell2 != null) {
      let path2 = getCellPath(cell2)
      if (path2 != null && path2.length > 0) {
        let cell: Cell | null = cell1
        let path1 = getCellPath(cell)

        // exchange
        if (path2.length < path1.length) {
          cell = cell2
          const tmp = path1
          path1 = path2
          path2 = tmp
        }

        while (cell != null) {
          const parent: Cell | null = cell.getParent()
          if (path2.indexOf(path1 + separator) === 0 && parent != null) {
            return cell
          }

          path1 = getParentPath(path1)
          cell = parent
        }
      }
    }

    return null
  }
}
