import { Attrs } from '../../types'
import { UNumber } from '../../struct/unumber'
import { Container } from './container'
import { Viewbox } from './container-viewbox'

@Marker.register('Marker')
@Marker.mixin(Viewbox)
export class Marker extends Container<SVGMarkerElement> {
  height(): number
  height(h: number | string | null): this
  height(h?: number | string | null) {
    return this.attr<number>('markerHeight', h)
  }

  width(): number
  width(w?: number | string | null): this
  width(w?: number | string | null) {
    return this.attr<number>('markerWidth', w)
  }

  units(): Marker.Units
  units(units: Marker.Units | null): this
  units(units?: Marker.Units | null) {
    return this.attr<Marker.Units>('markerUnits', units)
  }

  orient(): Marker.Orient
  orient(orient: Marker.Orient | null): this
  orient(orient?: Marker.Orient | null) {
    return this.attr<Marker.Orient>('orient', orient)
  }

  ref(x: string | number, y: string | number) {
    return this.attr('refX', x).attr('refY', y)
  }

  update(handler: Marker.Update) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  url() {
    return `url(#${this.id()})`
  }

  toString() {
    return this.url()
  }
}

export interface Marker extends Viewbox<SVGMarkerElement> {}

export namespace Marker {
  export type Type = 'start' | 'end' | 'mid' | 'all'
  export type Units = 'userSpaceOnUse' | 'strokeWidth'
  export type Orient = 'auto' | 'auto-start-reverse' | number
  export type RefX = 'left' | 'center' | 'right' | number
  export type RefY = 'top' | 'center' | 'bottom' | number
  export type Update = (this: Marker, marker: Marker) => void
}

export namespace Marker {
  export function create(attrs?: Attrs | null): Marker
  export function create(size: number | string, attrs?: Attrs | null): Marker
  export function create(
    size: number | string,
    update: Update,
    attrs?: Attrs | null,
  ): Marker
  export function create(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): Marker
  export function create(
    width: number | string,
    height: number | string,
    update: Update,
    attrs?: Attrs | null,
  ): Marker
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Update | Attrs | null,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ): Marker
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Update | Attrs | null,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ): Marker {
    const marker = new Marker()

    marker.attr('orient', 'auto')

    if (width != null) {
      if (typeof width === 'object') {
        marker.size(0, 0).ref(0, 0).viewbox(0, 0, 0, 0).attr(width)
      } else {
        const w = UNumber.toNumber(width)
        if (height != null) {
          if (typeof height === 'function') {
            marker
              .update(height)
              .size(w, w)
              .ref(w / 2, w / 2)
              .viewbox(0, 0, w, w)

            if (update) {
              marker.attr(update as Attrs)
            }
          } else if (typeof height === 'object') {
            marker
              .size(w, w)
              .ref(w / 2, w / 2)
              .viewbox(0, 0, w, w)
              .attr(height)
          } else {
            const h = UNumber.toNumber(height)
            marker
              .size(w, h)
              .ref(w / 2, h / 2)
              .viewbox(0, 0, w, h)
            if (update != null) {
              if (typeof update === 'function') {
                marker.update(update)
                if (attrs) {
                  marker.attr(attrs)
                }
              } else {
                marker.attr(update)
              }
            }
          }
        } else {
          marker
            .size(w, w)
            .ref(w / 2, w / 2)
            .viewbox(0, 0, w, w)
        }
      }
    }

    return marker
  }
}
