import { PointOptions } from './point'
import { JSONObject, JSONArray } from './types'

export abstract class Geometry {
  abstract scale(sx: number, sy: number, origin?: PointOptions): this

  abstract rotate(angle: number, origin?: PointOptions): this

  abstract translate(tx: number, ty: number): this
  abstract translate(p: PointOptions): this
  abstract clone(): Geometry
  abstract equals(g: any): boolean
  abstract toJSON(): JSONObject | JSONArray
  abstract serialize(): string

  valueOf() {
    return this.toJSON()
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}
