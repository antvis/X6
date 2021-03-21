import { Attrs } from '../../types'
import { Poly } from './poly'

@Polygon.register('Polygon')
export class Polygon extends Poly<SVGPolygonElement> {}

export namespace Polygon {
  export function create(attrs?: Attrs | null): Polygon
  export function create(points: string, attrs?: Attrs | null): Polygon
  export function create(
    points: [number, number][],
    attrs?: Attrs | null,
  ): Polygon
  export function create(
    points?: string | [number, number][] | Attrs | null,
    attrs?: Attrs | null,
  ): Polygon
  export function create(
    points?: string | [number, number][] | null | Attrs,
    attrs?: Attrs,
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
