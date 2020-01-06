import { Point, Rectangle, Line } from '../geometry'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { BaseManager } from './base-manager'

export class RetrievalManager extends BaseManager {
  /**
   * Specifies the default parent to be used to insert new cells.
   */
  defaultParent: Cell | null

  setDefaultParent(cell: Cell | null) {
    this.defaultParent = cell
  }

  getDefaultParent(): Cell {
    let parent = this.graph.getCurrentRoot()
    if (parent == null) {
      parent = this.defaultParent
      if (parent == null) {
        const root = this.model.getRoot()
        parent = this.model.getChildAt(root, 0)
      }
    }

    return parent!
  }

  home() {
    const current = this.graph.getCurrentRoot()
    if (current != null) {
      this.view.setCurrentRoot(null)
      const state = this.view.getState(current)
      if (state != null) {
        this.graph.setCellSelected(current)
      }
    }
  }

  getSwimlane(cell: Cell | null) {
    let result = cell
    while (result != null && !this.graph.isSwimlane(result)) {
      result = this.model.getParent(result)
    }
    return result
  }

  getSwimlaneAt(
    x: number,
    y: number,
    parent: Cell = this.getDefaultParent(),
  ): Cell | null {
    const count = this.model.getChildCount(parent)
    for (let i = 0; i < count; i += 1) {
      const child = this.model.getChildAt(parent, i)!
      const result = this.getSwimlaneAt(x, y, child)

      if (result != null) {
        return result
      }

      if (this.graph.isSwimlane(child)) {
        const state = this.view.getState(child)
        if (this.isIntersected(state, x, y)) {
          return child
        }
      }
    }

    return null
  }

  getCellAt(
    x: number,
    y: number,
    parent?: Cell | null,
    includeNodes: boolean = true,
    includeEdges: boolean = true,
    ignoreFn?: (state: State, x?: number, y?: number) => boolean,
  ): Cell | null {
    if (parent == null) {
      // tslint:disable-next-line
      parent = this.graph.getCurrentRoot() || this.model.getRoot()
    }

    if (parent != null) {
      const c = this.model.getChildCount(parent)
      for (let i = c - 1; i >= 0; i -= 1) {
        const cell = this.model.getChildAt(parent, i)!
        const result = this.getCellAt(
          x,
          y,
          cell,
          includeNodes,
          includeEdges,
          ignoreFn,
        )

        if (result != null) {
          return result
        }

        if (
          this.graph.isCellVisible(cell) &&
          ((includeEdges && this.model.isEdge(cell)) ||
            (includeNodes && this.model.isNode(cell)))
        ) {
          const state = this.view.getState(cell)
          if (
            state != null &&
            (ignoreFn == null || !ignoreFn(state, x, y)) &&
            this.isIntersected(state, x, y)
          ) {
            return cell
          }
        }
      }
    }

    return null
  }

  protected isIntersected(state: State | null, x: number, y: number) {
    if (state != null) {
      const points = state.absolutePoints
      if (points != null) {
        const hotspot = this.graph.tolerance * this.graph.tolerance
        let pt = points[0]!
        for (let i = 1, ii = points.length; i < ii; i += 1) {
          const next = points[i]!
          const dist = new Line(pt, next).pointSquaredDistance(x, y)
          if (dist <= hotspot) {
            return true
          }

          pt = next
        }
      } else {
        const rot = State.getRotation(state)
        if (rot !== 0) {
          const cx = state.bounds.getCenter()
          const pt = new Point(x, y).rotate(-rot, cx)
          if (state.bounds.containsPoint(pt)) {
            return true
          }
        }

        if (state.bounds.containsPoint({ x, y })) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Returns true if the given point is inside the content of the
   * given swimlane.
   */
  hitsSwimlaneContent(swimlane: Cell | null, x: number, y: number) {
    const state = this.view.getState(swimlane)
    const size = this.graph.getStartSize(swimlane)

    if (state != null) {
      const scale = this.view.scale
      const dx = x - state.bounds.x
      const dy = y - state.bounds.y

      if (size.width > 0 && dx > 0 && dx > size.width * scale) {
        return true
      }

      if (size.height > 0 && dy > 0 && dy > size.height * scale) {
        return true
      }
    }

    return false
  }

  getEdges(
    node: Cell,
    parent?: Cell | null,
    incoming: boolean = true,
    outgoing: boolean = true,
    includeLoops: boolean = true,
    recurse: boolean = false,
  ) {
    const result: Cell[] = []
    const edges: Cell[] = []
    const isCollapsed = this.graph.isCellCollapsed(node)

    node.eachChild(child => {
      if (isCollapsed || !this.graph.isCellVisible(child)) {
        edges.push(...this.model.getEdges(child, incoming, outgoing))
      }
    })

    edges.push(...this.model.getEdges(node, incoming, outgoing))

    edges.forEach(edge => {
      const [source, target] = this.getVisibleTerminals(edge)

      if (source === target) {
        if (includeLoops) {
          result.push(edge)
        }
      } else {
        if (
          (incoming &&
            target === node &&
            (parent == null ||
              this.isValidAncestor(source!, parent, recurse))) ||
          (outgoing &&
            source === node &&
            (parent == null || this.isValidAncestor(target!, parent, recurse)))
        ) {
          result.push(edge)
        }
      }
    })

    return result
  }

  getVisibleTerminals(edge: Cell) {
    const state = this.view.getState(edge)

    const source =
      state != null
        ? state.getVisibleTerminal(true)
        : this.view.getVisibleTerminal(edge, true)

    const target =
      state != null
        ? state.getVisibleTerminal(false)
        : this.view.getVisibleTerminal(edge, false)

    return [source, target]
  }

  isValidAncestor(cell: Cell, parent: Cell, recurse?: boolean) {
    return recurse
      ? this.model.isAncestor(parent, cell)
      : this.model.getParent(cell) === parent
  }

  getOppositeNodes(
    edges: Cell[],
    terminal: Cell,
    includeSources: boolean = true,
    includeTargets: boolean = true,
  ) {
    const result: Cell[] = []
    const map = new WeakMap<Cell, boolean>()
    const add = (cell: Cell) => {
      if (!map.get(cell)) {
        map.set(cell, true)
        result.push(cell)
      }
    }

    edges &&
      edges.forEach(edge => {
        const [source, target] = this.getVisibleTerminals(edge)

        if (
          source === terminal &&
          target != null &&
          target !== terminal &&
          includeTargets
        ) {
          add(target)
        } else if (
          target === terminal &&
          source != null &&
          source !== terminal &&
          includeSources
        ) {
          add(source)
        }
      })

    return result
  }

  getEdgesBetween(source: Cell, target: Cell, directed: boolean = false) {
    const edges = this.getEdges(source)
    const result: Cell[] = []

    edges &&
      edges.forEach(edge => {
        const [s, t] = this.getVisibleTerminals(edge)
        if (
          (s === source && t === target) ||
          (!directed && s === target && t === source)
        ) {
          result.push(edge)
        }
      })

    return result
  }

  getCellsInRegion(
    x: number,
    y: number,
    width: number,
    height: number,
    parent: Cell,
    result: Cell[] = [],
  ) {
    if (width > 0 || height > 0) {
      const rect = new Rectangle(x, y, width, height)

      parent &&
        parent.eachChild(cell => {
          const state = this.view.getState(cell)
          if (state != null && this.graph.isCellVisible(cell)) {
            const rot = State.getRotation(state)
            const bounds = rot === 0 ? state.bounds : state.bounds.rotate(rot)

            if (
              (this.model.isEdge(cell) || this.model.isNode(cell)) &&
              rect.containsRect(bounds)
            ) {
              result.push(cell)
            } else {
              this.getCellsInRegion(x, y, width, height, cell, result)
            }
          }
        })
    }

    return result
  }

  getCellsBeyond(
    x: number,
    y: number,
    parent: Cell,
    isRight: boolean = false,
    isBottom: boolean = false,
  ) {
    const result: Cell[] = []

    if (isRight || isBottom) {
      parent &&
        parent.eachChild(child => {
          const state = this.view.getState(child)
          if (this.graph.isCellVisible(child) && state != null) {
            if (
              (!isRight || state.bounds.x >= x) &&
              (!isBottom || state.bounds.y >= y)
            ) {
              result.push(child)
            }
          }
        })
    }

    return result
  }

  findTreeRoots(
    parent: Cell | null,
    isolate: boolean = false,
    invert: boolean = false,
  ) {
    const roots: Cell[] = []

    let best = null
    let maxDiff = 0

    parent &&
      parent.eachChild(cell => {
        if (this.model.isNode(cell) && this.graph.isCellVisible(cell)) {
          const conns = this.graph.getConnections(cell, isolate ? parent : null)
          let fanOut = 0
          let fanIn = 0

          conns.forEach(conn => {
            const src = this.view.getVisibleTerminal(conn, true)
            if (src === cell) {
              fanOut += 1
            } else {
              fanIn += 1
            }
          })

          if (
            (invert && fanOut === 0 && fanIn > 0) ||
            (!invert && fanIn === 0 && fanOut > 0)
          ) {
            roots.push(cell)
          }

          const diff = invert ? fanIn - fanOut : fanOut - fanIn

          if (diff > maxDiff) {
            maxDiff = diff
            best = cell
          }
        }
      })

    if (roots.length === 0 && best != null) {
      roots.push(best)
    }

    return roots
  }

  traverse(
    node: Cell,
    directed: boolean = true,
    func: (node: Cell, edge: Cell | null) => any,
    edge?: Cell,
    visited: WeakMap<Cell, boolean> = new WeakMap<Cell, boolean>(),
    inverse: boolean = false,
  ) {
    if (func != null && node != null) {
      if (!visited.get(node)) {
        visited.set(node, true)

        const result = func(node, edge || null)
        if (result !== false) {
          node.eachEdge(edge => {
            const isSource = this.model.getTerminal(edge, true) === node
            if (!directed || !inverse === isSource) {
              const next = this.model.getTerminal(edge, !isSource)!
              this.traverse(next, directed, func, edge, visited, inverse)
            }
          })
        }
      }
    }
  }
}
