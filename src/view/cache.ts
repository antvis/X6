import { Dictionary, Dom, type JSONObject, Util } from '../common'
import type {
  Ellipse,
  Line,
  Path,
  Polyline,
  Rectangle,
  Segment,
} from '../geometry'
import type { CellView } from './cell'

export interface CacheItem {
  data?: JSONObject
  matrix?: DOMMatrix
  boundingRect?: Rectangle
  shape?: Rectangle | Ellipse | Polyline | Path | Line
}

/**
 * 一个 element 的缓存类
 */
export class Cache {
  protected elemCache: Dictionary<Element, CacheItem>

  public pathCache: {
    data?: string
    length?: number
    segmentSubdivisions?: Segment[][]
  }

  constructor(protected view: CellView) {
    this.clean()
  }

  clean() {
    if (this.elemCache) {
      this.elemCache.dispose()
    }
    this.elemCache = new Dictionary()
    this.pathCache = {}
  }

  get(elem: Element) {
    const cache = this.elemCache
    if (!cache.has(elem)) {
      this.elemCache.set(elem, {})
    }
    return this.elemCache.get(elem)
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
      const target = this.view.container
      meta.matrix = Dom.getTransformToParentElement(
        elem as SVGElement,
        target as SVGElement,
      )
    }

    return Dom.createSVGMatrix(meta.matrix)
  }

  getShape(elem: Element) {
    const meta = this.get(elem)
    if (meta.shape == null) {
      meta.shape = Util.toGeometryShape(elem as SVGElement)
    }
    return meta.shape.clone()
  }

  getBoundingRect(elem: Element) {
    const meta = this.get(elem)
    if (meta.boundingRect == null) {
      meta.boundingRect = Util.getBBoxV2(elem as SVGElement)
    }
    return meta.boundingRect.clone()
  }
}
