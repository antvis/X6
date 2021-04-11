import { Poly } from '../poly/poly'
import { SVGPolygonAttributes } from './types'

@Polygon.register('Polygon')
export class Polygon extends Poly<SVGPolygonElement> {}

export namespace Polygon {
  export function create<Attributes extends SVGPolygonAttributes>(
    attrs?: Attributes | null,
  ): Polygon
  export function create<Attributes extends SVGPolygonAttributes>(
    points: string,
    attrs?: Attributes | null,
  ): Polygon
  export function create<Attributes extends SVGPolygonAttributes>(
    points: [number, number][],
    attrs?: Attributes | null,
  ): Polygon
  export function create<Attributes extends SVGPolygonAttributes>(
    points?: string | [number, number][] | Attributes | null,
    attrs?: Attributes | null,
  ): Polygon
  export function create<Attributes extends SVGPolygonAttributes>(
    points?: string | [number, number][] | null | Attributes,
    attrs?: Attributes,
  ) {
    const poly = new Polygon()
    if (points != null) {
      if (Array.isArray(points) || typeof points === 'string') {
        poly.plot(points)
        if (attrs) {
          poly.attr(attrs)
        }
      } else {
        poly.attr(points)
      }
    }

    return poly
  }
}
