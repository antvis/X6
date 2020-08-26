import { Point, Path } from '../../geometry'
import * as Dom from './core'

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
    attrs?: Dom.Attributes,
    children?: Element | Vectorizer | (Element | Vectorizer)[],
  ) {
    if (!elem) {
      throw new TypeError('Invalid element to create vectorizer')
    }

    let node: SVGElement
    if (Vectorizer.isVector(elem)) {
      node = elem.node
    } else if (typeof elem === 'string') {
      if (elem.toLowerCase() === 'svg') {
        node = Dom.createSvgDocument()
      } else if (elem[0] === '<') {
        const svgDoc = Dom.createSvgDocument(elem)
        // only import the first child
        node = document.importNode(svgDoc.firstChild!, true) as SVGElement
      } else {
        node = document.createElementNS(Dom.ns.svg, elem) as SVGElement
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
    const ref = Vectorizer.toHTMLElement(target) as SVGGraphicsElement
    return Dom.getTransformToElement(this.node, ref)
  }

  /**
   * Returns the current transformation matrix of the Vectorizer element.
   */
  transform(): DOMMatrix
  /**
   * Applies the provided transformation matrix to the Vectorizer element.
   */
  transform(matrix: DOMMatrix, options?: Dom.TransformOptions): this
  transform(matrix?: DOMMatrix, options?: Dom.TransformOptions) {
    if (matrix == null) {
      return Dom.transform(this.node)
    }

    Dom.transform(this.node, matrix, options)

    return this
  }

  /**
   * Returns the current translate metadata of the Vectorizer element.
   */
  translate(): Dom.Translation
  /**
   * Translates the element by `tx` pixels in x axis and `ty` pixels
   * in y axis. `ty` is optional in which case the translation in y axis
   * is considered zero.
   */
  translate(tx: number, ty?: number, options?: Dom.TransformOptions): this
  translate(tx?: number, ty: number = 0, options: Dom.TransformOptions = {}) {
    if (tx == null) {
      return Dom.translate(this.node)
    }

    Dom.translate(this.node, tx, ty, options)
    return this
  }

  /**
   * Returns the current rotate metadata of the Vectorizer element.
   */
  rotate(): Dom.Rotation
  /**
   * Rotates the element by `angle` degrees. If the optional `cx` and `cy`
   * coordinates are passed, they will be used as an origin for the rotation.
   */
  rotate(
    angle: number,
    cx?: number,
    cy?: number,
    options?: Dom.TransformOptions,
  ): this
  rotate(
    angle?: number,
    cx?: number,
    cy?: number,
    options: Dom.TransformOptions = {},
  ) {
    if (angle == null) {
      return Dom.rotate(this.node)
    }

    Dom.rotate(this.node, angle, cx, cy, options)
    return this
  }

  /**
   * Returns the current scale metadata of the Vectorizer element.
   */
  scale(): Dom.Scale
  /**
   * Scale the element by `sx` and `sy` factors. If `sy` is not specified,
   * it will be considered the same as `sx`.
   */
  scale(sx: number, sy?: number): this
  scale(sx?: number, sy?: number) {
    if (sx == null) {
      return Dom.scale(this.node)
    }
    Dom.scale(this.node, sx, sy)
    return this
  }

  removeAttribute(name: string) {
    Dom.removeAttribute(this.node, name)
    return this
  }

  getAttribute(name: string) {
    return Dom.getAttribute(this.node, name)
  }

  setAttribute(name: string, value?: string | number | null) {
    Dom.setAttribute(this.node, name, value)
    return this
  }

  setAttributes(attrs: { [attr: string]: string | number | null }) {
    Dom.setAttributes(this.node, attrs)
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
      return Dom.attr(this.node)
    }

    if (typeof name === 'string' && value === undefined) {
      return Dom.attr(this.node, name)
    }

    if (typeof name === 'object') {
      Dom.attr(this.node, name)
    } else {
      Dom.attr(this.node, name, value!)
    }

    return this
  }

  svg() {
    return this.node instanceof SVGSVGElement
      ? this
      : Vectorizer.createVector(this.node.ownerSVGElement as SVGElement)
  }

  defs() {
    const context = this.svg() || this
    const defsNode = context.node.getElementsByTagName('defs')[0]
    if (defsNode) {
      return Vectorizer.createVector(defsNode)
    }

    return Vectorizer.createVector('defs').appendTo(context)
  }

  text(content: string, options: Dom.TextOptions = {}) {
    Dom.text(this.node, content, options)
    return this
  }

  tagName() {
    return Dom.tagName(this.node)
  }

  clone() {
    return Vectorizer.createVector(this.node.cloneNode(true) as SVGElement)
  }

  remove() {
    Dom.remove(this.node)
    return this
  }

  empty() {
    Dom.empty(this.node)
    return this
  }

  append(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Dom.append(this.node, Vectorizer.toHTMLElements(elems))
    return this
  }

  prepend(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Dom.prepend(this.node, Vectorizer.toHTMLElements(elems))
    return this
  }

  before(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    Dom.before(this.node, Vectorizer.toHTMLElements(elems))
    return this
  }

  appendTo(target: Element | Vectorizer) {
    Dom.appendTo(this.node, Vectorizer.toHTMLElement(target)!)
    return this
  }

  findOne(selector: string) {
    const found = Dom.findOne(this.node, selector)
    return found ? Vectorizer.createVector(found as SVGElement) : undefined
  }

  find(selector: string) {
    const vels: Vectorizer[] = []
    const nodes = Dom.find(this.node, selector)
    if (nodes) {
      for (let i = 0, ii = nodes.length; i < ii; i += 1) {
        vels.push(Vectorizer.createVector(nodes[i] as SVGElement))
      }
    }

    return vels
  }

  findParentByClass(className: string, terminator?: SVGElement) {
    const node = Dom.findParentByClass(this.node, className, terminator)
    return node ? Vectorizer.createVector(node as SVGElement) : null
  }

  contains(child: Element | Vectorizer) {
    return Dom.contains(
      this.node,
      child instanceof Vectorizer ? child.node : child,
    )
  }

  children() {
    const children = this.node.childNodes
    const vels: Vectorizer[] = []
    for (let i = 0; i < children.length; i += 1) {
      const currentChild = children[i]
      if (currentChild.nodeType === 1) {
        vels.push(Vectorizer.createVector(children[i] as SVGElement))
      }
    }
    return vels
  }

  index() {
    return Dom.index(this.node)
  }

  hasClass(className: string) {
    return Dom.hasClass(this.node, className)
  }

  addClass(className: string) {
    Dom.addClass(this.node, className)
    return this
  }

  removeClass(className?: string) {
    Dom.removeClass(this.node, className)
    return this
  }

  toggleClass(className: string, stateVal?: boolean) {
    Dom.toggleClass(this.node, className, stateVal)
    return this
  }

  toLocalPoint(x: number, y: number) {
    return Dom.toLocalPoint(this.node, x, y)
  }

  toGeometryShape() {
    return Dom.toGeometryShape(this.node)
  }

  translateCenterToPoint(p: Point | Point.PointLike) {
    const bbox = this.getBBox({ target: this.svg() })
    const center = bbox.getCenter()
    this.translate(p.x - center.x, p.y - center.y)
    return this
  }

  translateAndAutoOrient(
    position: Point.PointLike | Point.PointData,
    reference: Point.PointLike | Point.PointData,
    target?: SVGElement,
  ) {
    Dom.translateAndAutoOrient(this.node, position, reference, target)
    return this
  }

  animateAlongPath(attrs: { [name: string]: string }, path: SVGPathElement) {
    Dom.animateAlongPath(this.node, attrs, path)
    return this
  }

  /**
   * Normalize this element's d attribute. SVGPathElements without
   * a path data attribute obtain a value of 'M 0 0'.
   */
  normalizePath() {
    const tagName = this.tagName()
    if (tagName === 'path') {
      this.attr('d', Path.normalize(this.attr('d')))
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
    return Dom.bbox(this.node, withoutTransformations, target)
  }

  getBBox(
    options: {
      target?: SVGElement | Vectorizer | null
      recursive?: boolean
    } = {},
  ) {
    return Dom.getBBox(this.node, {
      recursive: options.recursive,
      target: Vectorizer.toHTMLElement(options.target),
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
      return Dom.sample(this.node, interval)
    }
    return []
  }

  convertToPath() {
    return Vectorizer.createVector(Dom.toPath(this.node as any))
  }

  convertToPathData() {
    return Dom.toPathData(this.node as any)
  }
}

export namespace Vectorizer {
  export function isVector(o: any): o is Vectorizer {
    return o instanceof Vectorizer
  }

  export function createVector(
    elem: Vectorizer | SVGElement | string,
    attrs?: Dom.Attributes,
    children?: Element | Vectorizer | (Element | Vectorizer)[],
  ) {
    return new Vectorizer(elem, attrs, children)
  }

  export function createVectors(markup: string) {
    if (markup[0] === '<') {
      const svgDoc = Dom.createSvgDocument(markup)
      const vels: Vectorizer[] = []
      for (let i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
        const childNode = svgDoc.childNodes[i]!
        vels.push(
          createVector(document.importNode(childNode, true) as SVGElement),
        )
      }

      return vels
    }

    return [createVector(markup)]
  }

  export function toHTMLElement(elem: any) {
    if (elem != null) {
      if (isVector(elem)) {
        return elem.node
      }
      return ((elem.nodeName && elem) || elem[0]) as SVGElement
    }
    return null
  }

  export function toHTMLElements(
    elems:
      | Element
      | DocumentFragment
      | Vectorizer
      | (Element | DocumentFragment | Vectorizer)[],
  ) {
    if (Array.isArray(elems)) {
      return elems.map((elem) => toHTMLElement(elem)!)
    }

    return [toHTMLElement(elems)!]
  }
}
