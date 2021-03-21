import { Attr } from '../attr'
import { ObjectExt, Dom, Vector } from '../../util'
import { Util } from '../../global'
import { EdgeView } from '../../view'
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

    // eslint-disable-next-line
    options = ObjectExt.defaultsDeep({}, options, defaultOptions)

    const magnetVel = Vector.create(magnet as SVGElement)
    let pathData
    let magnetBBox

    try {
      pathData = magnetVel.toPathData()
    } catch (error) {
      // Failed to get path data from magnet element.
      // Draw a rectangle around the entire cell view instead.
      magnetBBox = magnetVel.bbox(true /* without transforms */)
      pathData = Dom.rectToPathData({ ...options, ...magnetBBox })
    }

    const path = Dom.createSvgElement('path')
    Dom.attr(path, {
      d: pathData,
      'pointer-events': 'none',
      'vector-effect': 'non-scaling-stroke',
      fill: 'none',
      ...(options.attrs ? Dom.kebablizeAttrs(options.attrs) : null),
    })

    // const highlightVel = v.create('path').attr()

    if (cellView.isEdgeElement(magnet)) {
      Dom.attr(path, 'd', (cellView as EdgeView).getConnectionPathData())
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

        magnetBBox = Dom.transformRectangle(magnetBBox, highlightMatrix)

        const width = Math.max(magnetBBox.width, 1)
        const height = Math.max(magnetBBox.height, 1)
        const sx = (width + padding) / width
        const sy = (height + padding) / height

        const paddingMatrix = Dom.createSVGMatrix({
          a: sx,
          b: 0,
          c: 0,
          d: sy,
          e: cx - sx * cx,
          f: cy - sy * cy,
        })

        highlightMatrix = highlightMatrix.multiply(paddingMatrix)
      }

      Dom.transform(path, highlightMatrix)
    }

    Dom.addClass(path, Util.prefix('highlight-stroke'))

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
    Dom.ensureId(magnet)
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
      Dom.remove(elem)
      delete cache[id]
    }
  }
}
