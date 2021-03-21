import { FunctionExt } from '../../util'
import { Point, Line, Angle } from '../../geometry'
import { ManhattanRouterOptions, resolve } from './manhattan/options'
import { manhattan } from './manhattan/index'
import { Router } from './index'

export interface MetroRouterOptions extends ManhattanRouterOptions {}

const defaults: Partial<MetroRouterOptions> = {
  maxDirectionChange: 45,

  // an array of directions to find next points on the route
  // different from start/end directions
  directions() {
    const step = resolve(this.step, this)
    const cost = resolve(this.cost, this)
    const diagonalCost = Math.ceil(Math.sqrt((step * step) << 1)) // eslint-disable-line no-bitwise

    return [
      { cost, offsetX: step, offsetY: 0 },
      { cost: diagonalCost, offsetX: step, offsetY: step },
      { cost, offsetX: 0, offsetY: step },
      { cost: diagonalCost, offsetX: -step, offsetY: step },
      { cost, offsetX: -step, offsetY: 0 },
      { cost: diagonalCost, offsetX: -step, offsetY: -step },
      { cost, offsetX: 0, offsetY: -step },
      { cost: diagonalCost, offsetX: step, offsetY: -step },
    ]
  },

  // a simple route used in situations when main routing method fails
  // (exceed max number of loop iterations, inaccessible)
  fallbackRoute(from, to, options) {
    // Find a route which breaks by 45 degrees ignoring all obstacles.

    const theta = from.theta(to)

    const route = []

    let a = { x: to.x, y: from.y }
    let b = { x: from.x, y: to.y }

    if (theta % 180 > 90) {
      const t = a
      a = b
      b = t
    }

    const p1 = theta % 90 < 45 ? a : b
    const l1 = new Line(from, p1)

    const alpha = 90 * Math.ceil(theta / 90)

    const p2 = Point.fromPolar(l1.squaredLength(), Angle.toRad(alpha + 135), p1)
    const l2 = new Line(to, p2)

    const intersectionPoint = l1.intersectsWithLine(l2)
    const point = intersectionPoint || to

    const directionFrom = intersectionPoint ? point : from

    const quadrant = 360 / options.directions.length
    const angleTheta = directionFrom.theta(to)
    const normalizedAngle = Angle.normalize(angleTheta + quadrant / 2)
    const directionAngle = quadrant * Math.floor(normalizedAngle / quadrant)

    options.previousDirectionAngle = directionAngle

    if (point) route.push(point.round())
    route.push(to)

    return route
  },
}

export const metro: Router.Definition<Partial<MetroRouterOptions>> = function (
  vertices,
  options,
  linkView,
) {
  return FunctionExt.call(
    manhattan,
    this,
    vertices,
    { ...defaults, ...options },
    linkView,
  )
}
