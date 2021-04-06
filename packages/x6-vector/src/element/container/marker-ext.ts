import { Attrs } from '../../types'
import { Decorator } from '../decorator'
import { Vector } from '../vector'
import { Marker } from './marker'

type MarkerMethod = {
  marker(attrs?: Attrs | null): Marker
  marker(size: number | string, attrs?: Attrs | null): Marker
  marker(
    size: number | string,
    update: Marker.Update,
    attrs?: Attrs | null,
  ): Marker
  marker(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): Marker
  marker(
    width: number | string,
    height: number | string,
    update: Marker.Update,
    attrs?: Attrs | null,
  ): Marker
  marker(
    width?: number | string | Attrs | null,
    height?: number | string | Marker.Update | Attrs | null,
    update?: Marker.Update | Attrs | null,
    attrs?: Attrs | null,
  ): Marker
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements MarkerMethod {
  @Decorator.checkDefs
  marker(
    width?: number | string | Attrs | null,
    height?: number | string | Marker.Update | Attrs | null,
    update?: Marker.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return this.defs()!.marker(width, height, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements MarkerMethod {
  marker(
    width?: number | string | Attrs | null,
    height?: number | string | Marker.Update | Attrs | null,
    update?: Marker.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Marker.create(width, height, update, attrs).appendTo(this)
  }
}

export class LineExtension<
  TSVGLineElement extends
    | SVGLineElement
    | SVGPathElement
    | SVGPolygonElement
    | SVGPolylineElement
> extends Vector<TSVGLineElement> {
  marker(type: Marker.Type, marker: Marker): this
  marker(type: Marker.Type, size: number | string, attrs?: Attrs | null): this
  marker(
    type: Marker.Type,
    size: number | string,
    update: Marker.Update,
    attrs?: Attrs | null,
  ): this
  marker(
    type: Marker.Type,
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): this
  marker(
    type: Marker.Type,
    width: number | string,
    height: number | string,
    update: Marker.Update,
    attrs?: Attrs | null,
  ): this
  @Decorator.checkDefs
  marker(
    type: Marker.Type,
    width: Marker | number | string,
    height?: number | string | Marker.Update | Attrs | null,
    update?: Marker.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    let attr = 'marker'
    if (type !== 'all') {
      attr += `-${type}`
    }

    const marker =
      width instanceof Marker
        ? width
        : this.defs()!.marker(width, height as number, update, attrs)

    this.attr(attr, marker.url())

    return this
  }
}
