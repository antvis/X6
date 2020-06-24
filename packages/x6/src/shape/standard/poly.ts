import { Base } from '../base'
import { Point } from '../../geometry'
import { Node } from '../../model/node'
import { ObjectExt } from '../../util'

export class Poly extends Base {
  get points() {
    return this.getPoints()
  }

  set points(pts: string | undefined | null) {
    this.setPoints(pts)
  }

  getPoints() {
    return this.getAttrByPath<string>('body/refPoints')
  }

  setPoints(
    points?: string | Point.PointLike[] | Point.PointData[] | null,
    options?: Node.SetOptions,
  ) {
    if (points == null) {
      this.removePoints()
    } else {
      this.setAttrByPath('body/refPoints', Poly.pointsToString(points), options)
    }

    return this
  }

  removePoints() {
    this.removeAttrByPath('body/refPoints')
    return this
  }
}

export namespace Poly {
  export function pointsToString(
    points: Point.PointLike[] | Point.PointData[] | string,
  ) {
    return typeof points === 'string'
      ? points
      : (points as Point.PointLike[])
          .map((p) => {
            if (Array.isArray(p)) {
              return p.join(',')
            }
            if (Point.isPointLike(p)) {
              return `${p.x}, ${p.y}`
            }
            return ''
          })
          .join(' ')
  }

  Poly.config({
    propHooks(metadata) {
      const { points, ...others } = metadata
      if (points) {
        const data = pointsToString(points)
        if (data) {
          ObjectExt.setByPath(others, 'attrs/body/refPoints', data)
        }
      }
      return others
    },
  })
}
