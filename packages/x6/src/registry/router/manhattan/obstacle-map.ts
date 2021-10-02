import { ArrayExt } from '../../../util'
import { KeyValue } from '../../../types'
import { Rectangle, Point } from '../../../geometry'
import { Cell, Edge, Model } from '../../../model'
import { ResolvedOptions } from './options'

/**
 * Helper structure to identify whether a point lies inside an obstacle.
 */
export class ObstacleMap {
  options: ResolvedOptions

  /**
   * How to divide the paper when creating the elements map
   */
  mapGridSize: number

  map: KeyValue<Rectangle[]>

  constructor(options: ResolvedOptions) {
    this.options = options
    this.mapGridSize = 100
    this.map = {}
  }

  /**
   * Builds a map of all nodes for quicker obstacle queries i.e. is a point
   * contained in any obstacle?
   *
   * A simplified grid search.
   */
  build(model: Model, edge: Edge) {
    const options = this.options
    // source or target node could be excluded from set of obstacles
    const excludedTerminals = options.excludeTerminals.reduce<Cell[]>(
      (memo, type) => {
        const terminal = edge[type]
        if (terminal) {
          const cell = model.getCell((terminal as Edge.TerminalCellData).cell)
          if (cell) {
            memo.push(cell)
          }
        }

        return memo
      },
      [],
    )

    let excludedAncestors: string[] = []

    const source = model.getCell(edge.getSourceCellId())
    if (source) {
      excludedAncestors = ArrayExt.union(
        excludedAncestors,
        source.getAncestors().map((cell) => cell.id),
      )
    }

    const target = model.getCell(edge.getTargetCellId())
    if (target) {
      excludedAncestors = ArrayExt.union(
        excludedAncestors,
        target.getAncestors().map((cell) => cell.id),
      )
    }

    // The graph is divided into smaller cells, where each holds information
    // about which node belong to it. When we query whether a point lies
    // inside an obstacle we don't need to go through all obstacles, we check
    // only those in a particular cell.
    const mapGridSize = this.mapGridSize

    model.getNodes().reduce((map, node) => {
      const shape = node.shape
      const excludeShapes = options.excludeShapes
      const excType = shape ? excludeShapes.includes(shape) : false
      const excTerminal = excludedTerminals.some((cell) => cell.id === node.id)
      const excAncestor = excludedAncestors.includes(node.id)
      const excHidden = options.excludeHiddenNodes && !node.isVisible()
      const excluded = excType || excTerminal || excAncestor || excHidden

      if (!excluded) {
        const bbox = node.getBBox().moveAndExpand(options.paddingBox)
        const origin = bbox.getOrigin().snapToGrid(mapGridSize)
        const corner = bbox.getCorner().snapToGrid(mapGridSize)

        for (let x = origin.x; x <= corner.x; x += mapGridSize) {
          for (let y = origin.y; y <= corner.y; y += mapGridSize) {
            const key = new Point(x, y).toString()
            if (map[key] == null) {
              map[key] = []
            }
            map[key].push(bbox)
          }
        }
      }
      return map
    }, this.map)

    return this
  }

  isAccessible(point: Point) {
    const key = point.clone().snapToGrid(this.mapGridSize).toString()

    const rects = this.map[key]
    return rects ? rects.every((rect) => !rect.containsPoint(point)) : true
  }
}
