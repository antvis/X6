import { Decorator } from '../common/decorator'
import { Base } from '../common/base'
import { Marker } from './marker'
import { SVGMarkerAttributes } from './types'

type MarkerMethod = {
  marker<Attributes extends SVGMarkerAttributes>(
    attrs?: Attributes | null,
  ): Marker
  marker<Attributes extends SVGMarkerAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Marker
  marker<Attributes extends SVGMarkerAttributes>(
    size: number | string,
    update: Marker.Update,
    attrs?: Attributes | null,
  ): Marker
  marker<Attributes extends SVGMarkerAttributes>(
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): Marker
  marker<Attributes extends SVGMarkerAttributes>(
    width: number | string,
    height: number | string,
    update: Marker.Update,
    attrs?: Attributes | null,
  ): Marker
  marker<Attributes extends SVGMarkerAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Marker.Update | Attributes | null,
    update?: Marker.Update | Attributes | null,
    attrs?: Attributes | null,
  ): Marker
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements MarkerMethod {
  @Decorator.checkDefs
  marker<Attributes extends SVGMarkerAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Marker.Update | Attributes | null,
    update?: Marker.Update | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return this.defs()!.marker(width, height, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements MarkerMethod {
  marker<Attributes extends SVGMarkerAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Marker.Update | Attributes | null,
    update?: Marker.Update | Attributes | null,
    attrs?: Attributes | null,
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
> extends Base<TSVGLineElement> {
  marker(type: Marker.Type, marker: Marker): this
  marker<Attributes extends SVGMarkerAttributes>(
    type: Marker.Type,
    size: number | string,
    attrs?: Attributes | null,
  ): this
  marker<Attributes extends SVGMarkerAttributes>(
    type: Marker.Type,
    size: number | string,
    update: Marker.Update,
    attrs?: Attributes | null,
  ): this
  marker<Attributes extends SVGMarkerAttributes>(
    type: Marker.Type,
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): this
  marker<Attributes extends SVGMarkerAttributes>(
    type: Marker.Type,
    width: number | string,
    height: number | string,
    update: Marker.Update,
    attrs?: Attributes | null,
  ): this
  @Decorator.checkDefs
  marker<Attributes extends SVGMarkerAttributes>(
    type: Marker.Type,
    width: Marker | number | string,
    height?: number | string | Marker.Update | Attributes | null,
    update?: Marker.Update | Attributes | null,
    attrs?: Attributes | null,
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
