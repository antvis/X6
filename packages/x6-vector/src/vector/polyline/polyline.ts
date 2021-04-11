import { Poly } from '../poly/poly'
import { SVGPolylineAttributes } from './types'

@Polyline.register('Polyline')
export class Polyline extends Poly<SVGPolylineElement> {}

export namespace Polyline {
  export function create<Attributes extends SVGPolylineAttributes>(
    attrs?: Attributes | null,
  ): Polyline
  export function create<Attributes extends SVGPolylineAttributes>(
    points: string,
    attrs?: Attributes | null,
  ): Polyline
  export function create<Attributes extends SVGPolylineAttributes>(
    points: [number, number][],
    attrs?: Attributes | null,
  ): Polyline
  export function create<Attributes extends SVGPolylineAttributes>(
    points?: string | [number, number][] | Attributes | null,
    attrs?: Attributes | null,
  ): Polyline
  export function create<Attributes extends SVGPolylineAttributes>(
    points?: string | [number, number][] | Attributes | null,
    attrs?: Attributes | null,
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
