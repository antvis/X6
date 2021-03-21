import { Attrs } from '../../types'
import { Poly } from './poly'

@Polyline.register('Polyline')
export class Polyline extends Poly<SVGPolylineElement> {}

export namespace Polyline {
  export function create(attrs?: Attrs | null): Polyline
  export function create(points: string, attrs?: Attrs | null): Polyline
  export function create(
    points: [number, number][],
    attrs?: Attrs | null,
  ): Polyline
  export function create(
    points?: string | [number, number][] | Attrs | null,
    attrs?: Attrs | null,
  ): Polyline
  export function create(
    points?: string | [number, number][] | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const poly = new Polyline()
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
