import { v } from '../../v'
import { ObjectExt } from '../../util'
import { Attr } from '../attr'
import { EdgeView } from '../core/edge-view'
import { addClassNamePrefix } from '../core/globals'
import { Highlighter } from './index'

export interface StrokeHighlighterOptions {
  padding?: number
  rx?: number
  ry?: number
  attrs?: Attr.SimpleAttrs
}

const defaultOptions: StrokeHighlighterOptions = {
  padding: 3,
  rx: 0,
  ry: 0,
  attrs: {
    'stroke-width': 3,
    stroke: '#FEB663',
  },
}

export const stroke: Highlighter.Definition<StrokeHighlighterOptions> = {
  highlight(cellView, magnet, options) {
    const id = Private.getHighlighterId(magnet, options)
    if (Private.hasCache(id)) {
      return
    }

    // tslint:disable-next-line
    options = ObjectExt.defaultsDeep({}, options, defaultOptions)

    const magnetVel = v.create(magnet as SVGElement)
    let pathData
    let magnetBBox

    try {
      pathData = magnetVel.convertToPathData()
    } catch (error) {
      // Failed to get path data from magnet element.
      // Draw a rectangle around the entire cell view instead.
      magnetBBox = magnetVel.bbox(true /* without transforms */)
      pathData = v.rectToPathData({ ...options, ...magnetBBox })
    }

    const path = v.createSvgElement('path')
    v.attr(path, {
      d: pathData,
      'pointer-events': 'none',
      'vector-effect': 'non-scaling-stroke',
      fill: 'none',
      ...options.attrs,
    })

    // const highlightVel = v.create('path').attr()

    if (cellView.isEdgeElement(magnet)) {
      v.attr(path, 'd', (cellView as EdgeView).getConnectionPathData())
    } else {
      let highlightMatrix = magnetVel.getTransformToElement(
        cellView.container as SVGElement,
      )

      // Add padding to the highlight element.
      const padding = options.padding
      if (padding) {
        if (magnetBBox == null) {
          magnetBBox = magnetVel.bbox(true)
        }

        const cx = magnetBBox.x + magnetBBox.width / 2
        const cy = magnetBBox.y + magnetBBox.height / 2

        magnetBBox = v.transformRect(magnetBBox, highlightMatrix)

        const width = Math.max(magnetBBox.width, 1)
        const height = Math.max(magnetBBox.height, 1)
        const sx = (width + padding) / width
        const sy = (height + padding) / height

        const paddingMatrix = v.createSVGMatrix({
          a: sx,
          b: 0,
          c: 0,
          d: sy,
          e: cx - sx * cx,
          f: cy - sy * cy,
        })

        highlightMatrix = highlightMatrix.multiply(paddingMatrix)
      }

      v.transform(path, highlightMatrix)
    }

    v.addClass(path, addClassNamePrefix('highlight-stroke'))

    const cell = cellView.cell
    const removeHandler = () => Private.removeHighlighter(id)

    cell.on('removed', removeHandler)
    if (cell.model) {
      cell.model.on('reseted', removeHandler)
    }

    cellView.container.appendChild(path)
    Private.setCache(id, path)
  },

  unhighlight(cellView, magnet, opt) {
    Private.removeHighlighter(Private.getHighlighterId(magnet, opt))
  },
}

namespace Private {
  export function getHighlighterId(
    magnet: Element,
    options: StrokeHighlighterOptions,
  ) {
    v.ensureId(magnet)
    return magnet.id + JSON.stringify(options)
  }

  const cache: { [id: string]: Element } = {}

  export function setCache(id: string, elem: Element) {
    cache[id] = elem
  }

  export function hasCache(id: string) {
    return cache[id] != null
  }

  export function removeHighlighter(id: string) {
    const elem = cache[id]
    if (elem) {
      v.remove(elem)
      delete cache[id]
    }
  }
}
