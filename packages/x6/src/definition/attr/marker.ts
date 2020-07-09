import { KeyValue } from '../../types'
import { CellView } from '../../view'
import { Marker } from '../../connection'
import { ObjectExt, JSONObject } from '../../util'
import { Attr } from './index'

function qualify(value: any) {
  return typeof value === 'string' || ObjectExt.isPlainObject(value)
}

export const sourceMarker: Attr.Definition = {
  qualify,
  set(marker: string | JSONObject, { view, attrs }) {
    return createMarker('marker-start', marker, view, attrs)
  },
}

export const targetMarker: Attr.Definition = {
  qualify,
  set(marker: string | JSONObject, { view, attrs }) {
    return createMarker('marker-end', marker, view, attrs, {
      transform: 'rotate(180)',
    })
  },
}

export const vertexMarker: Attr.Definition = {
  qualify,
  set(marker: string | JSONObject, { view, attrs }) {
    return createMarker('marker-mid', marker, view, attrs)
  },
}

function createMarker(
  key: 'marker-start' | 'marker-end' | 'marker-mid',
  marker: string | JSONObject,
  view: CellView,
  attrs: Attr.ComplexAttrs,
  manual: Attr.SimpleAttrs = {},
) {
  const def = typeof marker === 'string' ? { name: marker } : marker
  const { name, args, ...others } = def
  let preset = others

  if (name && typeof name === 'string') {
    const fn = Marker.registry.get(name)
    if (fn) {
      preset = fn({ ...others, ...(args as KeyValue) })
    } else {
      return Marker.registry.onNotFound(name)
    }
  }

  const options: any = {
    ...normalizeAttr(attrs),
    ...manual,
    ...preset,
  }

  return {
    [key]: `url(#${view.graph.defineMarker(options)})`,
  }
}

function normalizeAttr(attr: Attr.ComplexAttrs) {
  const result: Attr.SimpleAttrs = {}

  // The context 'fill' is disregared here. The usual case is to use the
  // marker with a connection(for which 'fill' attribute is set to 'none').
  const stroke = attr.stroke
  if (typeof stroke === 'string') {
    result['stroke'] = stroke
    result['fill'] = stroke
  }

  // Again the context 'fill-opacity' is ignored.
  let strokeOpacity = attr.strokeOpacity
  if (strokeOpacity == null) {
    strokeOpacity = attr['stroke-opacity']
  }

  if (strokeOpacity == null) {
    strokeOpacity = attr.opacity
  }

  if (strokeOpacity != null) {
    result['stroke-opacity'] = strokeOpacity as number
    result['fill-opacity'] = strokeOpacity as number
  }

  return result
}
