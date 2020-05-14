import { StringExt, Dom } from '../util'
import { Attr } from '../definition'
import { Base } from './base'

export class Defs extends Base {
  protected get svg() {
    return this.view.svg
  }

  protected get elem() {
    return this.view.defs
  }

  protected isDefined(id: string) {
    return this.svg.getElementById(id) != null
  }

  filter(options: any) {
    let filterId = options.id
    const name = options.name
    if (!filterId) {
      filterId =
        name + this.svg.id + StringExt.hashcode(JSON.stringify(options))
    }

    // if (!this.isDefined(filterId)) {
    //   const namespace = _filter
    //   const markup = namespace[name] && namespace[name](filter.args || {})
    //   if (!markup) {
    //     throw new Error('Non-existing filter ' + name)
    //   }

    //   // Set the filter area to be 3x the bounding box of the cell
    //   // and center the filter around the cell.
    //   const filterAttrs = {
    //     x: -1,
    //     y: -1,
    //     width: 3,
    //     height: 3,
    //     filterUnits: 'objectBoundingBox',
    //     ...filter.attrs,
    //     id: filterId,
    //   }

    //   Dom.create(markup, filterAttrs).appendTo(this.defsElem)
    // }

    return filterId
  }

  gradient(options: Defs.GradientOptions) {
    let id = options.id
    const type = options.type
    if (!id) {
      id = type + this.svg.id + StringExt.hashcode(JSON.stringify(options))
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
    let markerId = options.id
    if (!markerId) {
      markerId = `m-${StringExt.hashcode(JSON.stringify(options))}`
    }

    if (!this.isDefined(markerId)) {
      const { id, type, markerUnits, ...attrs } = options
      const pathMarker = Dom.createVector(
        'marker',
        {
          id: markerId,
          orient: 'auto',
          overflow: 'visible',
          markerUnits: markerUnits || 'userSpaceOnUse',
        },
        [Dom.createVector(type || 'path', attrs as Dom.Attributes)],
      )

      this.elem.appendChild(pathMarker.node)
    }

    return markerId
  }

  @Base.dispose()
  dispose() {}
}

export namespace Defs {
  interface BaseMarkerOptions {
    id?: string
    type?: string
    markerUnits?: string
  }

  export type MarkerOptions = BaseMarkerOptions & Attr.SimpleAttrs

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

  export interface FilterOptions {
    id?: string
    name: string
  }
}
