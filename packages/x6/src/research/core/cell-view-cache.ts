import { v } from '../../v'
import { JSONObject } from '../../util'
import { Dictionary } from '../../struct'
import { CellView } from './cell-view'
import { Line, Rectangle, Ellipse, Polyline, Path } from '../../geometry'

export class CellViewCache {
  protected cache: Dictionary<Element, CellView.CacheItem>

  constructor(protected view: CellView) {
    this.clean()
  }

  clean() {
    if (this.cache) {
      this.cache.dispose()
    }
    this.cache = new Dictionary()
  }

  get(elem: Element) {
    const cache = this.cache
    if (!cache.has(elem)) {
      this.cache.set(elem, {})
    }
    return this.cache.get(elem)!
  }

  getData(elem: Element) {
    const meta = this.get(elem)
    if (!meta.data) {
      meta.data = {}
    }
    return meta.data
  }

  getMatrix(elem: Element) {
    const meta = this.get(elem)
    if (meta.matrix == null) {
      const target = this.view.rotatableNode || this.view.container
      meta.matrix = v.getTransformToElement(elem as any, target as SVGElement)
    }

    return v.createSVGMatrix(meta.matrix)
  }

  getShape(elem: Element) {
    const meta = this.get(elem)
    if (meta.shape == null) {
      meta.shape = v.toGeometryShape(elem as SVGElement)
    }
    return meta.shape.clone()
  }

  getBoundingRect(elem: Element) {
    const meta = this.get(elem)
    if (meta.boundingRect == null) {
      meta.boundingRect = v.getBBox(elem as SVGElement)
    }
    return meta.boundingRect.clone()
  }
}

export namespace CellViewCache {
  export interface CacheItem {
    data?: JSONObject
    matrix?: DOMMatrix
    boundingRect?: Rectangle
    shape?: Rectangle | Ellipse | Polyline | Path | Line
  }
}
