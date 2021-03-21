import { Point, Path } from '../../geometry'
import * as Dom from '../dom/core'

export class Vector {
  public node: SVGElement

  protected get [Symbol.toStringTag]() {
    return Vector.toStringTag
  }

  public get type() {
    return this.node.nodeName
  }

  public get id() {
    return this.node.id
  }

  public set id(id: string) {
    this.node.id = id
  }

  constructor(
    elem: Vector | SVGElement | string,
    attrs?: Dom.Attributes,
    children?: SVGElement | Vector | (SVGElement | Vector)[],
  ) {
    if (!elem) {
      throw new TypeError('Invalid element to create vector')
    }

    let node: SVGElement
    if (Vector.isVector(elem)) {
      node = elem.node
    } else if (typeof elem === 'string') {
      if (elem.toLowerCase() === 'svg') {
        node = Dom.createSvgDocument()
      } else if (elem[0] === '<') {
        const doc = Dom.createSvgDocument(elem)
        // only import the first child
        node = document.importNode(doc.firstChild!, true) as SVGElement
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
   * Returns the current transformation matrix of the Vector element.
   */
  transform(): DOMMatrix
  /**
   * Applies the provided transformation matrix to the Vector element.
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
   * Returns the current translate metadata of the Vector element.
   */
  translate(): Dom.Translation
  /**
   * Translates the element by `tx` pixels in x axis and `ty` pixels
   * in y axis. `ty` is optional in which case the translation in y axis
   * is considered zero.
   */
  translate(tx: number, ty?: number, options?: Dom.TransformOptions): this
  translate(tx?: number, ty = 0, options: Dom.TransformOptions = {}) {
    if (tx == null) {
      return Dom.translate(this.node)
    }

    Dom.translate(this.node, tx, ty, options)
    return this
  }

  /**
   * Returns the current rotate metadata of the Vector element.
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
   * Returns the current scale metadata of the Vector element.
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

  /**
   * Returns an SVGMatrix that specifies the transformation necessary
   * to convert this coordinate system into `target` coordinate system.
   */
  getTransformToElement(target: SVGElement | Vector) {
    const ref = Vector.toNode(target) as SVGGraphicsElement
    return Dom.getTransformToElement(this.node, ref)
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

  setAttributes(attrs: { [attr: string]: string | number | null | undefined }) {
    Dom.setAttributes(this.node, attrs)
    return this
  }

  attr(): { [attr: string]: string }
  attr(name: string): string
  attr(attrs: { [attr: string]: string | number | null | undefined }): this
  attr(name: string, value: string | number): this
  attr(
    name?: string | { [attr: string]: string | number | null | undefined },
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
      : Vector.create(this.node.ownerSVGElement as SVGSVGElement)
  }

  defs() {
    const context = this.svg() || this
    const defsNode = context.node.getElementsByTagName('defs')[0]
    if (defsNode) {
      return Vector.create(defsNode)
    }

    return Vector.create('defs').appendTo(context)
  }

  text(content: string, options: Dom.TextOptions = {}) {
    Dom.text(this.node, content, options)
    return this
  }

  tagName() {
    return Dom.tagName(this.node)
  }

  clone() {
    return Vector.create(this.node.cloneNode(true) as SVGElement)
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
      | SVGElement
      | DocumentFragment
      | Vector
      | (SVGElement | DocumentFragment | Vector)[],
  ) {
    Dom.append(this.node, Vector.toNodes(elems))
    return this
  }

  appendTo(target: Element | Vector) {
    Dom.appendTo(this.node, Vector.isVector(target) ? target.node : target)
    return this
  }

  prepend(
    elems:
      | SVGElement
      | DocumentFragment
      | Vector
      | (SVGElement | DocumentFragment | Vector)[],
  ) {
    Dom.prepend(this.node, Vector.toNodes(elems))
    return this
  }

  before(
    elems:
      | SVGElement
      | DocumentFragment
      | Vector
      | (SVGElement | DocumentFragment | Vector)[],
  ) {
    Dom.before(this.node, Vector.toNodes(elems))
    return this
  }

  replace(elem: SVGElement | Vector) {
    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(Vector.toNode(elem), this.node)
    }
    return Vector.create(elem)
  }

  first() {
    return this.node.firstChild
      ? Vector.create(this.node.firstChild as SVGElement)
      : null
  }

  last() {
    return this.node.lastChild
      ? Vector.create(this.node.lastChild as SVGElement)
      : null
  }

  get(index: number) {
    const child = this.node.childNodes[index] as SVGElement
    return child ? Vector.create(child) : null
  }

  indexOf(elem: SVGElement | Vector) {
    const children: SVGElement[] = Array.prototype.slice.call(
      this.node.childNodes,
    )
    return children.indexOf(Vector.toNode(elem))
  }

  find(selector: string) {
    const vels: Vector[] = []
    const nodes = Dom.find(this.node, selector)
    if (nodes) {
      for (let i = 0, ii = nodes.length; i < ii; i += 1) {
        vels.push(Vector.create(nodes[i] as SVGElement))
      }
    }

    return vels
  }

  findOne(selector: string) {
    const found = Dom.findOne(this.node, selector)
    return found ? Vector.create(found as SVGElement) : null
  }

  findParentByClass(className: string, terminator?: SVGElement) {
    const node = Dom.findParentByClass(this.node, className, terminator)
    return node ? Vector.create(node as SVGElement) : null
  }

  matches(selector: string): boolean {
    const node = this.node as any
    const matches = this.node.matches
    const matcher: typeof matches =
      node.matches ||
      node.matchesSelector ||
      node.msMatchesSelector ||
      node.mozMatchesSelector ||
      node.webkitMatchesSelector ||
      node.oMatchesSelector ||
      null
    return matcher && matcher.call(node, selector)
  }

  contains(child: SVGElement | Vector) {
    return Dom.contains(this.node, Vector.isVector(child) ? child.node : child)
  }

  wrap(node: SVGElement | Vector) {
    const vel = Vector.create(node)
    const parentNode = this.node.parentNode as SVGElement
    if (parentNode != null) {
      parentNode.insertBefore(vel.node, this.node)
    }
    return vel.append(this)
  }

  parent(type?: string) {
    let parent: Vector = this // eslint-disable-line @typescript-eslint/no-this-alias

    // check for parent
    if (parent.node.parentNode == null) {
      return null
    }

    // get parent element
    parent = Vector.create(parent.node.parentNode as SVGElement)

    if (type == null) {
      return parent
    }

    // loop trough ancestors if type is given
    do {
      if (
        typeof type === 'string' ? parent.matches(type) : parent instanceof type
      ) {
        return parent
      }
    } while ((parent = Vector.create(parent.node.parentNode as SVGElement)))

    return parent
  }

  children() {
    const children = this.node.childNodes
    const vels: Vector[] = []
    for (let i = 0; i < children.length; i += 1) {
      const currentChild = children[i]
      if (currentChild.nodeType === 1) {
        vels.push(Vector.create(children[i] as SVGElement))
      }
    }
    return vels
  }

  eachChild(
    fn: (
      this: Vector,
      currentValue: Vector,
      index: number,
      children: Vector[],
    ) => void,
    deep?: boolean,
  ) {
    const children = this.children()
    for (let i = 0, l = children.length; i < l; i += 1) {
      fn.call(children[i], children[i], i, children)
      if (deep) {
        children[i].eachChild(fn, deep)
      }
    }

    return this
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

  translateCenterToPoint(p: Point.PointLike) {
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

  animate(options: Dom.AnimationOptions) {
    return Dom.animate(this.node, options)
  }

  animateTransform(options: Dom.AnimationOptions) {
    return Dom.animateTransform(this.node, options)
  }

  animateAlongPath(options: Dom.AnimationOptions, path: SVGPathElement) {
    return Dom.animateAlongPath(this.node, options, path)
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
      target?: SVGElement | Vector | null
      recursive?: boolean
    } = {},
  ) {
    return Dom.getBBox(this.node, {
      recursive: options.recursive,
      target: options.target ? Vector.toNode(options.target) : null,
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
  sample(interval = 1) {
    if (this.node instanceof SVGPathElement) {
      return Dom.sample(this.node, interval)
    }
    return []
  }

  toPath() {
    return Vector.create(Dom.toPath(this.node as any))
  }

  toPathData() {
    return Dom.toPathData(this.node as any)
  }
}

export namespace Vector {
  export const toStringTag = `X6.${Vector.name}`

  export function isVector(instance: any): instance is Vector {
    if (instance == null) {
      return false
    }

    if (instance instanceof Vector) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const vector = instance as Vector

    if (
      (tag == null || tag === toStringTag) &&
      vector.node instanceof SVGElement &&
      typeof vector.animate === 'function' &&
      typeof vector.sample === 'function' &&
      typeof vector.normalizePath === 'function' &&
      typeof vector.toPath === 'function'
    ) {
      return true
    }

    return false
  }

  export function create(
    elem: Vector | SVGElement | string,
    attrs?: Dom.Attributes,
    children?: SVGElement | Vector | (SVGElement | Vector)[],
  ) {
    return new Vector(elem, attrs, children)
  }

  export function createVectors(markup: string) {
    if (markup[0] === '<') {
      const svgDoc = Dom.createSvgDocument(markup)
      const vels: Vector[] = []
      for (let i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
        const childNode = svgDoc.childNodes[i]!
        vels.push(create(document.importNode(childNode, true) as SVGElement))
      }

      return vels
    }

    return [create(markup)]
  }

  export function toNode<T extends SVGElement = SVGElement>(
    elem: SVGElement | DocumentFragment | Vector,
  ): T {
    if (isVector(elem)) {
      return elem.node as T
    }
    return elem as T
  }

  export function toNodes(
    elems:
      | SVGElement
      | DocumentFragment
      | Vector
      | (SVGElement | DocumentFragment | Vector)[],
  ) {
    if (Array.isArray(elems)) {
      return elems.map((elem) => toNode(elem))
    }

    return [toNode(elems)]
  }
}
