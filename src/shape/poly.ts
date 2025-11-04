import { ObjectExt } from '../common'
import type { PointOptions } from '../geometry'
import type { Node, NodeSetOptions } from '../model/node'
import { Base } from './base'
import { pointsToString } from './util'

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

  setPoints(points?: string | PointOptions[] | null, options?: NodeSetOptions) {
    if (points == null) {
      this.removePoints()
    } else {
      this.setAttrByPath('body/refPoints', pointsToString(points), options)
    }

    return this
  }

  removePoints() {
    this.removeAttrByPath('body/refPoints')
    return this
  }
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
