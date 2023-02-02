import { NumberExt } from '../../../util'
import { Point, Rectangle, Angle } from '../../../geometry'
import { Edge, Node } from '../../../model'
import { EdgeView } from '../../../view'
import { orth } from '../orth'
import { Router } from '../index'

export type Direction = 'top' | 'right' | 'bottom' | 'left'
type Callable<T> = T | ((this: ManhattanRouterOptions) => T)

export interface ResolvedOptions {
  /**
   * The size of step to find a route (the grid of the manhattan pathfinder).
   */
  step: number

  /**
   * The number of route finding loops that cause the router to abort returns
   * fallback route instead.
   */
  maxLoopCount: number

  /**
   * The number of decimal places to round floating point coordinates.
   */
  precision: number

  /**
   * The maximum change of direction.
   */
  maxDirectionChange: number

  /**
   * Should the router use perpendicular edgeView option? Does not connect
   * to the anchor of node but rather a point close-by that is orthogonal.
   */
  perpendicular: boolean

  /**
   * Should the source and/or target not be considered as obstacles?
   */
  excludeTerminals: Edge.TerminalType[]

  /**
   * Should certain types of nodes not be considered as obstacles?
   */
  excludeShapes: string[]

  /**
   * Should certain nodes not be considered as obstacles?
   */
  excludeNodes: (Node | string)[]

  /**
   * Should certain hidden nodes not be considered as obstacles?
   */
  excludeHiddenNodes: boolean

  /**
   * Possible starting directions from a node.
   */
  startDirections: Direction[]

  /**
   * Possible ending directions to a node.
   */
  endDirections: Direction[]

  /**
   * Specify the directions used above and what they mean
   */
  directionMap: {
    top: Point.PointLike
    right: Point.PointLike
    bottom: Point.PointLike
    left: Point.PointLike
  }

  /**
   * Returns the cost of an orthogonal step.
   */
  cost: number

  /**
   * Returns an array of directions to find next points on the route different
   * from start/end directions.
   */
  directions: {
    cost: number
    offsetX: number
    offsetY: number
    angle?: number
    gridOffsetX?: number
    gridOffsetY?: number
  }[]

  /**
   * A penalty received for direction change.
   */
  penalties: {
    [key: number]: number
  }

  padding?: {
    top: number
    right: number
    bottom: number
    left: number
  }

  /**
   * The padding applied on the element bounding boxes.
   */
  paddingBox: Rectangle.RectangleLike

  fallbackRouter: Router.Definition<any>

  draggingRouter?:
    | ((
        this: EdgeView,
        dragFrom: Point.PointLike,
        dragTo: Point.PointLike,
        options: ResolvedOptions,
      ) => Point[])
    | null

  fallbackRoute?: (
    this: EdgeView,
    from: Point,
    to: Point,
    options: ResolvedOptions,
  ) => Point[] | null

  previousDirectionAngle?: number | null
}

export type ManhattanRouterOptions = {
  [Key in keyof ResolvedOptions]: Callable<ResolvedOptions[Key]>
}

export const defaults: ManhattanRouterOptions = {
  step: 10,
  maxLoopCount: 2000,
  precision: 1,
  maxDirectionChange: 90,
  perpendicular: true,
  excludeTerminals: [],
  excludeShapes: [], // ['text']
  excludeNodes: [],
  excludeHiddenNodes: false,
  startDirections: ['top', 'right', 'bottom', 'left'],
  endDirections: ['top', 'right', 'bottom', 'left'],
  directionMap: {
    top: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
  },

  cost() {
    const step = resolve(this.step, this)
    return step
  },

  directions() {
    const step = resolve(this.step, this)
    const cost = resolve(this.cost, this)

    return [
      { cost, offsetX: step, offsetY: 0 },
      { cost, offsetX: -step, offsetY: 0 },
      { cost, offsetX: 0, offsetY: step },
      { cost, offsetX: 0, offsetY: -step },
    ]
  },

  penalties() {
    const step = resolve(this.step, this)
    return {
      0: 0,
      45: step / 2,
      90: step / 2,
    }
  },

  paddingBox() {
    const step = resolve(this.step, this)
    return {
      x: -step,
      y: -step,
      width: 2 * step,
      height: 2 * step,
    }
  },

  fallbackRouter: orth,
  draggingRouter: null,
}

export function resolve<T>(
  input: Callable<T>,
  options: ManhattanRouterOptions,
) {
  if (typeof input === 'function') {
    return input.call(options)
  }
  return input
}

export function resolveOptions(options: ManhattanRouterOptions) {
  const result = Object.keys(options).reduce(
    (memo, key: keyof ResolvedOptions) => {
      const ret = memo as any
      if (
        key === 'fallbackRouter' ||
        key === 'draggingRouter' ||
        key === 'fallbackRoute'
      ) {
        ret[key] = options[key]
      } else {
        ret[key] = resolve(options[key], options)
      }
      return memo
    },
    {} as ResolvedOptions,
  )

  if (result.padding) {
    const sides = NumberExt.normalizeSides(result.padding)
    result.paddingBox = {
      x: -sides.left,
      y: -sides.top,
      width: sides.left + sides.right,
      height: sides.top + sides.bottom,
    }
  }

  result.directions.forEach((direction) => {
    const point1 = new Point(0, 0)
    const point2 = new Point(direction.offsetX, direction.offsetY)
    direction.angle = Angle.normalize(point1.theta(point2))
  })

  return result
}
