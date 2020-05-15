import { StringExt, Dom } from '../util'
import { Attr, Filter } from '../definition'
import { Markup } from '../view'
import { Marker } from '../connection'
import { Base } from './base'

export class Defs extends Base {
  protected get cid() {
    return this.graph.view.cid
  }

  protected get svg() {
    return this.view.svg
  }

  protected get elem() {
    return this.view.defs
  }

  protected isDefined(id: string) {
    return this.svg.getElementById(id) != null
  }

  filter(options: Defs.FilterOptions) {
    let filterId = options.id
    const name = options.name
    if (!filterId) {
      filterId = `filter-${name}-${this.cid}-${StringExt.hashcode(
        JSON.stringify(options),
      )}`
    }

    if (!this.isDefined(filterId)) {
      const fn = Filter.registry.get(name)
      if (fn == null) {
        return Filter.registry.onNotFound(name)
      }

      const markup = fn(options.args || {})

      // Set the filter area to be 3x the bounding box of the cell
      // and center the filter around the cell.
      const attrs = {
        x: -1,
        y: -1,
        width: 3,
        height: 3,
        filterUnits: 'objectBoundingBox',
        ...options.attrs,
        id: filterId,
      }
      Dom.createVector(Markup.sanitize(markup), attrs).appendTo(this.elem)
    }

    return filterId
  }

  gradient(options: Defs.GradientOptions) {
    let id = options.id
    const type = options.type
    if (!id) {
      id = `gradient-${type}-${this.cid}-${StringExt.hashcode(
        JSON.stringify(options),
      )}`
    }

    if (!this.isDefined(id)) {
      const stops = options.stops
      const arr = stops.map((stop) => {
        const opacity =
          stop.opacity != null && Number.isFinite(stop.opacity)
            ? stop.opacity
            : 1

        return `<stop offset="${stop.offset}" stop-color="${stop.color}" stop-opacity="${opacity}"/>`
      })

      const markup = `<${type}>${arr.join('')}</${type}>`
      const attrs = { id, ...options.attrs }
      Dom.createVector(markup, attrs).appendTo(this.elem)
    }

    return id
  }

  marker(options: Defs.MarkerOptions) {
    const { id, type, markerUnits, children, ...attrs } = options
    let markerId = id
    if (!markerId) {
      markerId = `marker-${this.cid}-${StringExt.hashcode(
        JSON.stringify(options),
      )}`
    }

    if (!this.isDefined(markerId)) {
      const pathMarker = Dom.createVector(
        'marker',
        {
          id: markerId,
          orient: 'auto',
          overflow: 'visible',
          markerUnits: markerUnits || 'userSpaceOnUse',
        },
        children
          ? children.map(({ type, ...other }) =>
              Dom.createVector(`${type}` || 'path', {
                ...attrs,
                ...other,
              } as Dom.Attributes),
            )
          : [Dom.createVector(type || 'path', attrs as Dom.Attributes)],
      )

      this.elem.appendChild(pathMarker.node)
    }

    return markerId
  }
}

export namespace Defs {
  export type MarkerOptions = Marker.Result

  export interface GradientOptions {
    id?: string
    type: string
    stops: {
      offset: number
      color: string
      opacity?: number
    }[]
    attrs?: Attr.SimpleAttrs
  }

  export type FilterOptions = (Filter.NativeItem | Filter.ManaualItem) & {
    id?: string
    attrs?: Attr.SimpleAttrs
  }
}
