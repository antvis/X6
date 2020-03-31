import { Point } from '../geometry'
import { Attributes } from './attr'
import { isString, isUndefined } from './util'
import * as Static from './rollup'

export class Vectorizer {
  node: SVGElement

  get id() {
    return this.node.id
  }

  set id(id: string) {
    this.node.id = id
  }

  constructor(
    elem: Vectorizer | SVGElement | string,
    attrs?: Attributes,
    children?: Element | Vectorizer | (Element | Vectorizer)[],
  ) {
    if (!elem) {
      throw new TypeError('Invalid element to create vectorizer')
    }

    let node: SVGElement
    if (Static.isVectorizer(elem)) {
      node = elem.node
    } else if (typeof elem === 'string') {
      if (elem.toLowerCase() === 'svg') {
        node = Static.createSvgDocument()
      } else if (elem[0] === '<') {
        const svgDoc = Static.createSvgDocument(elem)
        // only import the first child
        node = document.importNode(svgDoc.firstChild!, true) as SVGElement
      } else {
        node = document.createElementNS(Static.ns.svg, elem) as SVGElement
      }
    } else {
      node = elem
    }

    this.node = node

    if (attrs) {
      this.setAttributes(attrs)
    }

    if (children) {
      this.append(children)
    }
  }

  /**
   * Returns an SVGMatrix that specifies the transformation necessary
   * to convert this coordinate system into `target` coordinate system.
   */
  getTransformToElement(target: SVGElement | Vectorizer) {
    const ref = Static.toNode(target) as SVGGraphicsElement
    return Static.getTransformToElement(this.node, ref)
  }

  /**
   * Returns the current transformation matrix of the Vectorizer element.
   */
  transform(): DOMMatrix
  /**
   * Applies the provided transformation matrix to the Vectorizer element.
   */
  transform(matrix: DOMMatrix, options?: Static.TransformOptions): this
  transform(matrix?: DOMMatrix, options?: Static.TransformOptions) {
    if (matrix == null) {
      return Static.transform(this.node)
    }

    Static.transform(this.node, matrix, options)

    return this
  }

  /**
   * Returns the current translate metadata of the Vectorizer element.
   */
  translate(): Static.Translate
  /**
   * Translates the element by `tx` pixels in x axis and `ty` pixels
   * in y axis. `ty` is optional in which case the translation in y axis
   * is considered zero.
   */
  translate(tx: number, ty?: number, options?: Static.TransformOptions): this
  translate(
    tx?: number,
    ty: number = 0,
    options: Static.TransformOptions = {},
  ) {
    if (tx == null) {
      return Static.translate(this.node)
    }

    Static.translate(this.node, tx, ty, options)
    return this
  }

  /**
   * Returns the current rotate metadata of the Vectorizer element.
   */
  rotate(): Static.Rotate
  /**
   * Rotates the element by `angle` degrees. If the optional `cx` and `cy`
   * coordinates are passed, they will be used as an origin for the rotation.
   */
  rotate(
    angle: number,
    cx?: number,
    cy?: number,
    options?: Static.TransformOptions,
  ): this
  rotate(
    angle?: number,
    cx?: number,
    cy?: number,
    options: Static.TransformOptions = {},
  ) {
    if (angle == null) {
      return Static.rotate(this.node)
    }

    Static.rotate(this.node, angle, cx, cy, options)
    return this
  }

  /**
   * Returns the current scale metadata of the Vectorizer element.
   */
  scale(): Static.Scale
  /**
   * Scale the element by `sx` and `sy` factors. If `sy` is not specified,
   * it will be considered the same as `sx`.
   */
  scale(sx: number, sy?: number): this
  scale(sx?: number, sy?: number) {
    if (sx == null) {
      return Static.scale(this.node)
    }
    Static.scale(this.node, sx, sy)
    return this
  }

  removeAttribute(name: string) {
    Static.removeAttribute(this.node, name)
    return this
  }

  getAttribute(name: string) {
    return Static.getAttribute(this.node, name)
  }

  setAttribute(name: string, value?: string | number | null) {
    Static.setAttribute(this.node, name, value)
    return this
  }

  setAttributes(attrs: { [attr: string]: string | number | null }) {
    Static.setAttributes(this.node, attrs)
    return this
  }

  attr(): { [attr: string]: string }
  attr(name: string): string
  attr(attrs: { [attr: string]: string | number | null }): this
  attr(name: string, value: string | number): this
  attr(
    name?: string | { [attr: string]: string | number | null },
    value?: string | number | null,
  ) {
    if (name == null) {
      return Static.attr(this.node)
    }

    if (isString(name) && isUndefined(value)) {
      return Static.attr(this.node, name)
    }

    if (typeof name === 'object') {
      Static.attr(this.node, name)
    } else {
      Static.attr(this.node, name, value!)
    }

    return this
  }

  svg() {
    return this.node instanceof SVGSVGElement
      ? this
      : Static.create(this.node.ownerSVGElement as SVGElement)
  }

  defs() {
    const context = this.svg() || this
    const defsNode = context.node.getElementsByTagName('defs')[0]
    if (defsNode) {
      return Static.create(defsNode)
    }

    return Static.create('defs').appendTo(context)
  }

  text(content: string, options: Static.TextOptions = {}) {
    Static.text(this.node, content, options)
    return this
  }

  tagName() {
    return Static.tagName(this.node)
  }

  clone() {
    const clone = Static.create(
      this.node.cloneNode(true /* deep */) as SVGElement,
    )
    clone.node.id = Static.uniqueId()
    return clone
  }

  remove() {
    Static.remove(this.node)
    return this
  }

  empty() {
    Static.empty(this.node)
    return this
  }

  append(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Static.append(this.node, elems)
    return this
  }

  prepend(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Static.prepend(this.node, elems)
    return this
  }

  before(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Static.before(this.node, elems)
    return this
  }

  appendTo(target: Element | Vectorizer) {
    Static.appendTo(this.node, target)
    return this
  }

  findOne(selector: string) {
    const found = Static.findOne(this.node, selector)
    return found ? Static.create(found as SVGElement) : undefined
  }

  find(selector: string) {
    const vels: Vectorizer[] = []
    const nodes = Static.find(this.node, selector)
    if (nodes) {
      for (let i = 0, ii = nodes.length; i < ii; i += 1) {
        vels.push(Static.create(nodes[i] as SVGElement))
      }
    }

    return vels
  }

  findParentByClass(className: string, terminator?: SVGElement) {
    const node = Static.findParentByClass(this.node, className, terminator)
    return node ? Static.create(node as SVGElement) : null
  }

  contains(child: Element | Vectorizer) {
    return Static.contains(this.node, child)
  }

  children() {
    const children = this.node.childNodes
    const vels: Vectorizer[] = []
    for (let i = 0; i < children.length; i += 1) {
      const currentChild = children[i]
      if (currentChild.nodeType === 1) {
        vels.push(Static.create(children[i] as SVGElement))
      }
    }
    return vels
  }

  index() {
    return Static.index(this.node)
  }

  hasClass(className: string) {
    return Static.hasClass(this.node, className)
  }

  addClass(className: string) {
    Static.addClass(this.node, className)
    return this
  }

  removeClass(className?: string) {
    Static.removeClass(this.node, className)
    return this
  }

  toggleClass(className: string, stateVal?: boolean) {
    Static.toggleClass(this.node, className, stateVal)
    return this
  }

  toLocalPoint(x: number, y: number) {
    return Static.toLocalPoint(this.node, x, y)
  }

  toGeometryShape() {
    return Static.toGeometryShape(this.node)
  }

  translateCenterToPoint(p: Point | Point.PointLike) {
    const bbox = this.getBBox({ target: this.svg() })
    const center = bbox.getCenter()
    this.translate(p.x - center.x, p.y - center.y)
    return this
  }

  translateAndAutoOrient(
    position: Point | Point.PointLike | Point.PointData,
    reference: Point | Point.PointLike | Point.PointData,
    target?: SVGElement,
  ) {
    Static.translateAndAutoOrient(this.node, position, reference, target)
    return this
  }

  animateAlongPath(attrs: { [name: string]: string }, path: SVGPathElement) {
    Static.animateAlongPath(this.node, attrs, path)
  }

  /**
   * Normalize this element's d attribute. SVGPathElements without
   * a path data attribute obtain a value of 'M 0 0'.
   */
  normalizePath() {
    const tagName = this.tagName()
    if (tagName === 'path') {
      this.attr('d', Static.normalizePathData(this.attr('d')))
    }

    return this
  }

  /**
   * Returns the bounding box of the element after transformations are applied.
   * If `withoutTransformations` is `true`, transformations of the element
   * will not be considered when computing the bounding box. If `target` is
   * specified, bounding box will be computed relatively to the target element.
   */
  bbox(withoutTransformations?: boolean, target?: SVGElement) {
    return Static.bbox(this.node, withoutTransformations, target)
  }

  getBBox(
    options: {
      target?: SVGElement | Vectorizer | null
      recursive?: boolean
    } = {},
  ) {
    return Static.getBBox(this.node, {
      recursive: options.recursive,
      target: Static.toNode(options.target),
    })
  }

  /**
   * Samples the underlying SVG element (it currently works only on
   * paths - where it is most useful anyway). Returns an array of objects
   * of the form `{ x: Number, y: Number, distance: Number }`. Each of these
   * objects represent a point on the path. This basically creates a discrete
   * representation of the path (which is possible a curve). The sampling
   * interval defines the accuracy of the sampling. In other words, we travel
   * from the beginning of the path to the end by interval distance (on the
   * path, not between the resulting points) and collect the discrete points
   * on the path. This is very useful in many situations. For example, SVG
   * does not provide a built-in mechanism to find intersections between two
   * paths. Using sampling, we can just generate bunch of points for each of
   * the path and find the closest ones from each set.
   */
  sample(interval: number = 1) {
    if (this.node instanceof SVGPathElement) {
      return Static.sample(this.node, interval)
    }
    return []
  }

  convertToPath() {
    return Static.create(Static.convertToPath(this.node as any))
  }

  convertToPathData() {
    return Static.convertToPathData(this.node as any)
  }
}
