import { ObjectExt, JSONObject } from '../../util'
import { Attr } from '.'

export const sourceMarker: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(marker, { view, attrs }) {
    const options = {
      ...contextMarker(attrs),
      ...(marker as JSONObject),
    }
    return {
      'marker-start': `url(#${view.graph.defineMarker(options as any)})`,
    }
  },
}

export const targetMarker: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(marker, { view, attrs }) {
    const options = {
      ...contextMarker(attrs),
      transform: 'rotate(180)',
      ...(marker as JSONObject),
    }

    return { 'marker-end': `url(#${view.graph.defineMarker(options)})` }
  },
}

export const vertexMarker: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(marker, { view, attrs }) {
    const options = {
      ...contextMarker(attrs),
      ...(marker as JSONObject),
    }
    return {
      'marker-mid': `url(#${view.graph.defineMarker(options as any)})`,
    }
  },
}

function contextMarker(context: Attr.ComplexAttrs) {
  const marker: Attr.SimpleAttrs = {}

  // The context 'fill' is disregared here. The usual case is to use the
  // marker with a connection(for which 'fill' attribute is set to 'none').
  const stroke = context.stroke
  if (typeof stroke === 'string') {
    marker['stroke'] = stroke
    marker['fill'] = stroke
  }

  // Again the context 'fill-opacity' is ignored.
  let strokeOpacity = context.strokeOpacity
  if (strokeOpacity == null) {
    strokeOpacity = context['stroke-opacity']
  }

  if (strokeOpacity == null) {
    strokeOpacity = context.opacity
  }

  if (strokeOpacity != null) {
    marker['stroke-opacity'] = strokeOpacity as number
    marker['fill-opacity'] = strokeOpacity as number
  }

  return marker
}
