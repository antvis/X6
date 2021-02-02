import { StringExt, Dom, Vector } from '../util'
import { Attr, Filter, Marker } from '../registry'
import { Markup } from '../view'
import { Base } from './base'

export class DefsManager extends Base {
  protected get cid() {
    return this.graph.view.cid
  }

  protected get svg() {
    return this.view.svg
  }

  protected get defs() {
    return this.view.defs
  }

  protected isDefined(id: string) {
    return this.svg.getElementById(id) != null
  }

  filter(options: DefsManager.FilterOptions) {
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
      Vector.create(Markup.sanitize(markup), attrs).appendTo(this.defs)
    }

    return filterId
  }

  gradient(options: DefsManager.GradientOptions) {
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
      Vector.create(markup, attrs).appendTo(this.defs)
    }

    return id
  }

  marker(options: DefsManager.MarkerOptions) {
    const {
      id,
      refX,
      refY,
      markerUnits,
      markerOrient,
      tagName,
      children,
      ...attrs
    } = options
    let markerId = id
    if (!markerId) {
      markerId = `marker-${this.cid}-${StringExt.hashcode(
        JSON.stringify(options),
      )}`
    }

    if (!this.isDefined(markerId)) {
      if (tagName !== 'path') {
        // remove unnecessary d attribute inherit from standard edge.
        delete attrs.d
      }

      const pathMarker = Vector.create(
        'marker',
        {
          refX,
          refY,
          id: markerId,
          overflow: 'visible',
          orient: markerOrient != null ? markerOrient : 'auto',
          markerUnits: markerUnits || 'userSpaceOnUse',
        },
        children
          ? children.map(({ tagName, ...other }) =>
              Vector.create(
                `${tagName}` || 'path',
                Dom.kebablizeAttrs({
                  ...attrs,
                  ...other,
                }),
              ),
            )
          : [Vector.create(tagName || 'path', Dom.kebablizeAttrs(attrs))],
      )

      this.defs.appendChild(pathMarker.node)
    }

    return markerId
  }

  remove(id: string) {
    const elem = this.svg.getElementById(id)
    if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem)
    }
  }
}

export namespace DefsManager {
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
