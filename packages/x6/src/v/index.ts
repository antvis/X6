import {
  Angle,
  Point,
  Line,
  Rectangle,
  Polyline,
  Ellipse,
  Path,
} from '../geometry'

export class V {
  node: SVGElement

  get id() {
    return this.node.id
  }

  set id(id: string) {
    this.node.id = id
  }

  constructor(
    elem: V | SVGElement | string,
    attrs?: { [key: string]: string | number },
    children?: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    if (!elem) {
      throw new TypeError('Invalid element to create vectorizer')
    }

    let node: SVGElement
    if (V.isV(elem)) {
      node = elem.node
    } else if (typeof elem === 'string') {
      if (elem.toLowerCase() === 'svg') {
        node = V.createSvgDocument()
      } else if (elem[0] === '<') {
        const svgDoc = V.createSvgDocument(elem)
        // only import the first child
        node = document.importNode(svgDoc.firstChild!, true) as SVGElement
      } else {
        node = document.createElementNS(V.ns.svg, elem) as SVGElement
      }

      V.ensureId(node)
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
  getTransformToElement(target: SVGElement | V) {
    return V.getTransformToElement(this.node, target)
  }

  /**
   * Returns the current transformation matrix of the Vectorizer element.
   */
  transform(): DOMMatrix
  /**
   * Applies the provided transformation matrix to the Vectorizer element.
   */
  transform(matrix: DOMMatrix, options: V.TransformOptions): this
  transform(matrix?: DOMMatrix, options?: V.TransformOptions) {
    if (matrix == null) {
      return V.transform(this.node)
    }

    if (matrix != null) {
      V.transform(this.node, matrix, options)
    }

    return this
  }

  /**
   * Returns the current translate metadata of the Vectorizer element.
   */
  translate(): V.Translate
  /**
   * Translates the element by `tx` pixels in x axis and `ty` pixels
   * in y axis. `ty` is optional in which case the translation in y axis
   * is considered zero.
   */
  translate(tx: number, ty?: number, options?: V.TransformOptions): this
  translate(tx?: number, ty: number = 0, options: V.TransformOptions = {}) {
    if (tx == null) {
      return V.translate(this.node)
    }

    V.translate(this.node, tx, ty, options)
    return this
  }

  /**
   * Returns the current rotate metadata of the Vectorizer element.
   */
  rotate(): V.Rotate
  /**
   * Rotates the element by `angle` degrees. If the optional `cx` and `cy`
   * coordinates are passed, they will be used as an origin for the rotation.
   */
  rotate(
    angle: number,
    cx?: number,
    cy?: number,
    options?: V.TransformOptions,
  ): this
  rotate(
    angle?: number,
    cx?: number,
    cy?: number,
    options: V.TransformOptions = {},
  ) {
    if (angle == null) {
      return V.rotate(this.node)
    }

    V.rotate(this.node, angle, cx, cy, options)
    return this
  }

  /**
   * Returns the current scale metadata of the Vectorizer element.
   */
  scale(): V.Scale
  /**
   * Scale the element by `sx` and `sy` factors. If `sy` is not specified,
   * it will be considered the same as `sx`.
   */
  scale(sx: number, sy?: number): this
  scale(sx?: number, sy?: number) {
    if (sx == null) {
      return V.scale(this.node)
    }
    V.scale(this.node, sx, sy)
    return this
  }

  removeAttribute(name: string) {
    V.removeAttribute(this.node, name)
    return this
  }

  setAttribute(name: string, value?: string | number | null) {
    V.setAttribute(this.node, name, value)
    return this
  }

  setAttributes(attrs: { [attr: string]: string | number | null }) {
    V.setAttributes(this.node, attrs)
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
      return V.attr(this.node)
    }

    if (V.isString(name) && V.isUndefined(value)) {
      return V.attr(this.node, name)
    }

    if (typeof name === 'object') {
      V.setAttributes(this.node, name)
    } else {
      V.setAttribute(this.node, name, value)
    }

    return this
  }

  svg() {
    return this.node instanceof SVGSVGElement
      ? this
      : V.create(this.node.ownerSVGElement as SVGElement)
  }

  defs() {
    const context = this.svg() || this
    const defsNode = context.node.getElementsByTagName('defs')[0]
    if (defsNode) {
      return V.create(defsNode)
    }

    return V.create('defs').appendTo(context)
  }

  text(content: string, options: V.TextOptions = {}) {
    V.text(this.node, content, options)
    return this
  }

  tagName() {
    return V.tagName(this.node)
  }

  clone() {
    const clone = V.create(this.node.cloneNode(true /* deep */) as SVGElement)
    clone.node.id = V.uniqueId()
    return clone
  }

  remove() {
    V.remove(this.node)
    return this
  }

  empty() {
    V.empty(this.node)
    return this
  }

  append(
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    V.append(this.node, elems)
    return this
  }

  prepend(
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    V.prepend(this.node, elems)
    return this
  }

  before(
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    V.before(this.node, elems)
    return this
  }

  appendTo(target: SVGElement | HTMLElement | V) {
    V.appendTo(this.node, target)
    return this
  }

  findOne(selector: string) {
    const found = this.node.querySelector(selector)
    return found ? V.create(found as SVGElement) : undefined
  }

  find(selector: string) {
    const vels: V[] = []
    const nodes = this.node.querySelectorAll(selector)
    if (nodes) {
      for (let i = 0, ii = nodes.length; i < ii; i += 1) {
        vels.push(V.create(nodes[i] as SVGElement))
      }
    }

    return vels
  }

  findParentByClass(className: string, terminator?: SVGElement) {
    const node = V.findParentByClass(this.node, className, terminator)
    return node ? V.create(node as SVGElement) : null
  }

  contains(child: SVGElement | HTMLElement | V) {
    return V.contains(this.node, child)
  }

  children() {
    const children = this.node.childNodes
    const vels: V[] = []
    for (let i = 0; i < children.length; i += 1) {
      const currentChild = children[i]
      if (currentChild.nodeType === 1) {
        vels.push(V.create(children[i] as SVGElement))
      }
    }
    return vels
  }

  index() {
    return V.index(this.node)
  }

  hasClass(className: string) {
    return V.hasClass(this.node, className)
  }

  addClass(className: string) {
    V.addClass(this.node, className)
    return this
  }

  removeClass(className: string) {
    V.removeClass(this.node, className)
    return this
  }

  toggleClass(className: string, stateVal?: boolean) {
    V.toggleClass(this.node, className, stateVal)
    return this
  }

  toLocalPoint(x: number, y: number) {
    return V.toLocalPoint(this.node, x, y)
  }

  toGeometryShape() {
    return V.toGeometryShape(this.node)
  }

  translateCenterToPoint(p: Point | Point.PointLike) {
    const bbox = this.getBBox(this.svg())
    const center = bbox.getCenter()
    this.translate(p.x - center.x, p.y - center.y)
    return this
  }

  translateAndAutoOrient(
    position: Point | Point.PointLike | Point.PointData,
    reference: Point | Point.PointLike | Point.PointData,
    target?: SVGElement,
  ) {
    V.translateAndAutoOrient(this.node, position, reference, target)
    return this
  }

  animateAlongPath(
    attrs: { [name: string]: string },
    path: SVGPathElement | V,
  ) {
    V.animateAlongPath(this.node, attrs, path)
  }

  /**
   * Normalize this element's d attribute. SVGPathElements without
   * a path data attribute obtain a value of 'M 0 0'.
   */
  normalizePath() {
    const tagName = this.tagName()
    if (tagName === 'path') {
      this.attr('d', V.normalizePathData(this.attr('d')))
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
    return V.bbox(this.node, withoutTransformations, target)
  }

  getBBox(target?: SVGElement | HTMLElement | V, recursive?: boolean) {
    return V.getBBox(this.node, target, recursive)
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
      return V.sample(this.node, interval)
    }
    return []
  }

  convertToPath() {
    return V.create(V.convertToPath(this.node as any))
  }

  convertToPathData() {
    return V.convertToPathData(this.node as any)
  }
}

export namespace V {
  export const ns = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml',
  }

  export const svgVersion = '1.1'
}

// util
export namespace V {
  export const isArray = Array.isArray
  export const isUndefined = (o: any): o is undefined =>
    typeof o === 'undefined'
  export const isString = (o: any): o is string => typeof o === 'string'
  export const isObject = (o: any): o is Object => typeof o === 'object'
  export const isFunction = (o: any): o is Function => typeof o === 'function'
  export function toNumber(o: any, defaultValue: number) {
    if (o == null) {
      return defaultValue
    }

    const v = parseFloat(o)
    return isNaN(v) ? defaultValue : v
  }
}

// id
export namespace V {
  let idCounter = 0
  export function uniqueId() {
    idCounter += 1
    return `v${idCounter}`
  }

  export function ensureId(elem: SVGElement | V) {
    const node = toNode(elem)
    return node.id || (node.id = uniqueId())
  }
}

// instance
export namespace V {
  export function create(
    elem: V | SVGElement | string,
    attrs?: { [key: string]: string | number },
    children?: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    return new V(elem, attrs, children)
  }

  export function createBatch(markup: string) {
    if (markup[0] === '<') {
      const svgDoc = V.createSvgDocument(markup)
      const vels: V[] = []
      for (let i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
        const childNode = svgDoc.childNodes[i]
        vels.push(create(document.importNode(childNode!, true) as SVGElement))
      }

      return vels
    }

    return [create(markup)]
  }

  export function isV(o: any): o is V {
    return o instanceof V
  }

  export function toNode(elem: any) {
    if (isV(elem)) {
      return elem.node
    }
    return ((elem.nodeName && elem) || elem[0]) as SVGElement
  }

  /**
   * Returns true if object is an instance of SVGGraphicsElement.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
   */
  export function isSVGGraphicsElement(elem: any): elem is SVGGraphicsElement {
    if (elem == null) {
      return false
    }

    const node = toNode(elem)
    return node instanceof SVGElement && isFunction((node as any).getScreenCTM)
  }
}

// curd
export namespace V {
  export function createSvgDocument(content?: string) {
    if (content) {
      const xml = `<svg xmlns="${ns.svg}" xmlns:xlink="${ns.xlink}" version="${svgVersion}">${content}</svg>`
      const { documentElement } = parseXML(xml, { async: false })
      return (documentElement as any) as SVGSVGElement
    }

    const svg = document.createElementNS(ns.svg, 'svg')
    svg.setAttributeNS(ns.xmlns, 'xmlns:xlink', ns.xlink)
    svg.setAttribute('version', svgVersion)
    return svg as SVGSVGElement
  }

  export function parseXML(data: string, options: { async?: boolean } = {}) {
    let xml

    try {
      const parser = new DOMParser()
      if (options.async != null) {
        const tmp = parser as any
        tmp.async = options.async
      }
      xml = parser.parseFromString(data, 'text/xml')
    } catch (error) {
      xml = undefined
    }

    if (!xml || xml.getElementsByTagName('parsererror').length) {
      throw new Error(`Invalid XML: ${data}`)
    }

    return xml
  }

  export function tagName(node: Element, lowercase: boolean = true) {
    const nodeName = node.nodeName
    return lowercase ? nodeName.toLowerCase() : nodeName.toUpperCase()
  }

  export function index(elem: Element) {
    let index = 0
    let node = elem.previousSibling
    while (node) {
      if (node.nodeType === 1) {
        index += 1
      }
      node = node.previousSibling
    }
    return index
  }

  export function find(elem: Element, selector: string) {
    return elem.querySelectorAll(selector)
  }

  export function findOne(elem: Element, selector: string) {
    return elem.querySelector(selector)
  }

  export function findParentByClass(
    elem: Element,
    className: string,
    terminator?: SVGElement | HTMLElement,
  ) {
    const ownerSVGElement = (elem as SVGElement).ownerSVGElement
    let node = elem.parentNode
    while (node && node !== terminator && node !== ownerSVGElement) {
      if (hasClass(node as Element, className)) {
        return node
      }
      node = node.parentNode
    }

    return null
  }

  export function contains(elem: Element, child: SVGElement | HTMLElement | V) {
    const a = elem
    const b = toNode(child)
    const bup = b && b.parentNode

    return (
      a === bup ||
      !!(bup && bup.nodeType === 1 && a.compareDocumentPosition(bup) & 16)
    )
  }

  export function remove(elem: SVGElement | HTMLElement) {
    if (elem.parentNode) {
      elem.parentNode.removeChild(elem)
    }
  }

  export function empty(elem: SVGElement | HTMLElement) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild)
    }
  }

  export function append(
    elem: SVGElement | HTMLElement,
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    const arr = Array.isArray(elems) ? elems : [elems]
    arr.forEach(node => elem.appendChild(toNode(node)))
  }

  export function prepend(
    elem: SVGElement | HTMLElement,
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    const child = elem.firstChild
    return child ? before(elem, elems) : append(elem, elems)
  }

  export function before(
    elem: SVGElement | HTMLElement,
    elems: SVGElement | HTMLElement | V | (SVGElement | V | HTMLElement)[],
  ) {
    const parent = elem.parentNode
    if (parent) {
      const arr = Array.isArray(elems) ? elems : [elems]
      arr.forEach(node => parent.insertBefore(toNode(node), elem))
    }
  }

  export function appendTo(
    elem: SVGElement | HTMLElement,
    target: SVGElement | HTMLElement | V,
  ) {
    toNode(target).appendChild(elem)
  }
}

// attr
export namespace V {
  export function qualifyAttr(name: string) {
    if (name.indexOf(':') !== -1) {
      const combinedKey = name.split(':')
      return {
        ns: (ns as any)[combinedKey[0]],
        local: combinedKey[1],
      }
    }

    return {
      ns: null,
      local: name,
    }
  }

  export function styleToObject(styleString: string) {
    const ret: { [name: string]: string } = {}
    const styles = styleString.split(';')
    styles.forEach(item => {
      const pair = item.split('=')
      ret[pair[0].trim()] = pair[1].trim()
    })
    return ret
  }

  export function mergeAttrs(
    target: { [attr: string]: any },
    source: { [attr: string]: any },
  ) {
    Object.keys(source).forEach(attr => {
      if (attr === 'class') {
        target[attr] = target[attr]
          ? `${target[attr]} ${source[attr]}`
          : source[attr]
      } else if (attr === 'style') {
        const to = isObject(target[attr])
        const so = isObject(source[attr])

        let tt
        let ss

        if (to && so) {
          tt = target[attr]
          ss = source[attr]
        } else if (to) {
          tt = target[attr]
          ss = styleToObject(source[attr])
        } else if (so) {
          tt = styleToObject(target[attr])
          ss = source[attr]
        } else {
          tt = styleToObject(target[attr])
          ss = styleToObject(source[attr])
        }

        target[attr] = mergeAttrs(tt, ss)
      } else {
        target[attr] = source[attr]
      }
    })

    return target
  }

  export function getAttribute(elem: SVGElement | HTMLElement, name: string) {
    return elem.getAttribute(name)
  }

  export function removeAttribute(
    elem: SVGElement | HTMLElement,
    name: string,
  ) {
    const qualified = qualifyAttr(name)
    if (qualified.ns) {
      if (elem.hasAttributeNS(qualified.ns, qualified.local)) {
        elem.removeAttributeNS(qualified.ns, qualified.local)
      }
    } else if (elem.hasAttribute(name)) {
      elem.removeAttribute(name)
    }
  }

  export function setAttribute(
    elem: SVGElement | HTMLElement,
    name: string,
    value?: string | number | null,
  ) {
    if (value == null) {
      return removeAttribute(elem, name)
    }

    const qualified = qualifyAttr(name)
    if (qualified.ns && isString(value)) {
      elem.setAttributeNS(qualified.ns, name, value)
    } else if (name === 'id') {
      elem.id = `${value}`
    } else {
      elem.setAttribute(name, `${value}`)
    }
  }

  export function setAttributes(
    elem: SVGElement | HTMLElement,
    attrs: { [attr: string]: string | number | null },
  ) {
    Object.keys(attrs).forEach(name => {
      setAttribute(elem, name, attrs[name])
    })
  }

  export function attr(
    elem: SVGElement | HTMLElement,
  ): { [attr: string]: string }
  export function attr(elem: SVGElement | HTMLElement, name: string): string
  export function attr(
    elem: SVGElement | HTMLElement,
    attrs: { [attr: string]: string | null },
  ): void
  export function attr(
    elem: SVGElement | HTMLElement,
    name: string,
    value: string | null,
  ): void
  export function attr(
    elem: SVGElement | HTMLElement,
    name?: string | { [attr: string]: string | null },
    value?: string | null,
  ) {
    if (name == null) {
      const attributes = elem.attributes
      const attrs: { [name: string]: string } = {}
      for (let i = 0; i < attributes.length; i += 1) {
        attrs[attributes[i].name] = attributes[i].value
      }
      return attrs
    }

    if (isString(name) && isUndefined(value)) {
      return elem.getAttribute(name)
    }

    if (typeof name === 'object') {
      setAttributes(elem, name)
    } else {
      setAttribute(elem, name, value)
    }
  }
}

// class
export namespace V {
  const rclass = /[\t\r\n\f]/g
  const rnotwhite = /\S+/g

  const fillSpaces = (str: string) => ` ${str} `

  export function getClass(elem: Element) {
    return (elem && elem.getAttribute && elem.getAttribute('class')) || ''
  }

  export function hasClass(elem: Element | null, selector: string | null) {
    if (elem == null || selector == null) {
      return false
    }

    const classNames = fillSpaces(getClass(elem))
    const className = fillSpaces(selector)

    return elem.nodeType === 1
      ? classNames.replace(rclass, ' ').includes(className)
      : false
  }

  export function addClass(
    elem: Element | null,
    selector: ((cls: string) => string) | string | null,
  ): void {
    if (elem == null || selector == null) {
      return
    }

    if (typeof selector === 'function') {
      return addClass(elem, selector(getClass(elem)))
    }

    if (typeof selector === 'string' && elem.nodeType === 1) {
      const classes = selector.match(rnotwhite) || []
      const oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ')
      let newValue = classes.reduce((memo, cls) => {
        if (memo.indexOf(fillSpaces(cls)) < 0) {
          return `${memo}${cls} `
        }
        return memo
      }, oldValue)

      newValue = newValue.trim()

      if (oldValue !== newValue) {
        elem.setAttribute('class', newValue)
      }
    }
  }

  export function removeClass(
    elem: Element | null,
    selector: ((cls: string) => string) | string | null,
  ): void {
    if (elem == null) {
      return
    }

    if (typeof selector === 'function') {
      return removeClass(elem, selector(getClass(elem)))
    }

    if ((!selector || typeof selector === 'string') && elem.nodeType === 1) {
      const classes = (selector || '').match(rnotwhite) || []
      const oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ')
      let newValue = classes.reduce((memo, cls) => {
        const className = fillSpaces(cls)
        if (memo.indexOf(className) > -1) {
          return memo.replace(className, ' ')
        }

        return memo
      }, oldValue)

      newValue = selector ? newValue.trim() : ''

      if (oldValue !== newValue) {
        elem.setAttribute('class', newValue)
      }
    }
  }

  export function toggleClass(
    elem: Element | null,
    selector: ((cls: string, state?: boolean) => string) | string | null,
    stateVal?: boolean,
  ): void {
    if (elem == null || selector == null) {
      return
    }

    if (stateVal != null && typeof selector === 'string') {
      stateVal ? addClass(elem, selector) : removeClass(elem, selector)

      return
    }

    if (typeof selector === 'function') {
      return toggleClass(elem, selector(getClass(elem), stateVal), stateVal)
    }

    if (typeof selector === 'string') {
      const metches = selector.match(rnotwhite) || []
      metches.forEach(cls => {
        hasClass(elem, cls) ? removeClass(elem, cls) : addClass(elem, cls)
      })
    }
  }
}

// text
export namespace V {
  function createTextPathNode(
    attrs: { d?: string; 'xlink:href'?: string },
    vel: V,
  ) {
    const textPathElement = create('textPath')
    const d = attrs.d
    if (d && attrs['xlink:href'] === undefined) {
      const path = create('path')
        .attr('d', d)
        .appendTo(vel.defs())
      textPathElement.attr('xlink:href', `#${path.id}`)
    }

    if (isObject(attrs)) {
      textPathElement.attr(attrs as any)
    }

    return textPathElement.node
  }

  function annotateTextLine(
    lineNode: SVGTSpanElement,
    lineAnnotations: any[],
    options: {
      includeAnnotationIndices?: boolean
      eol?: boolean | string
      lineHeight: string | null
      baseSize: number
    },
  ) {
    const eol = options.eol
    const baseSize = options.baseSize
    const lineHeight = options.lineHeight

    let maxFontSize = 0
    let tspanNode
    const fontMetrics: any = {}
    const lastJ = lineAnnotations.length - 1

    for (let j = 0; j <= lastJ; j += 1) {
      let annotation = lineAnnotations[j]
      let fontSize = null
      if (V.isObject(annotation)) {
        const annotationAttrs = annotation.attrs
        const vTSpan = create('tspan', annotationAttrs)
        tspanNode = vTSpan.node

        let t = annotation.t
        if (eol && j === lastJ) {
          t += eol
        }

        tspanNode.textContent = t
        // Per annotation className
        const annotationClass = annotationAttrs['class']
        if (annotationClass) vTSpan.addClass(annotationClass)
        // If `opt.includeAnnotationIndices` is `true`,
        // set the list of indices of all the applied annotations
        // in the `annotations` attribute. This list is a comma
        // separated list of indices.
        if (options.includeAnnotationIndices) {
          vTSpan.attr('annotations', annotation.annotations)
        }
        // Check for max font size
        fontSize = parseFloat(annotationAttrs['font-size'])
        if (fontSize === undefined) fontSize = baseSize
        if (fontSize && fontSize > maxFontSize) maxFontSize = fontSize
      } else {
        if (eol && j === lastJ) {
          annotation += eol
        }
        tspanNode = document.createTextNode(annotation || ' ')
        if (baseSize && baseSize > maxFontSize) {
          maxFontSize = baseSize
        }
      }

      lineNode.appendChild(tspanNode)
    }

    if (maxFontSize) {
      fontMetrics.maxFontSize = maxFontSize
    }

    if (lineHeight) {
      fontMetrics.lineHeight = lineHeight
    } else if (maxFontSize) {
      fontMetrics.lineHeight = maxFontSize * 1.2
    }

    return fontMetrics
  }

  const emRegex = /em$/

  function emToPx(em: string, fontSize: number) {
    const numerical = parseFloat(em)
    if (emRegex.test(em)) {
      return numerical * fontSize
    }

    return numerical
  }

  function calculateDY(
    alignment: string,
    linesMetrics: any[],
    baseSizePx: number,
    lineHeight: string,
  ) {
    if (!Array.isArray(linesMetrics)) {
      return 0
    }

    const n = linesMetrics.length
    if (!n) return 0
    let lineMetrics = linesMetrics[0]
    const flMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx
    let rLineHeights = 0
    const lineHeightPx = emToPx(lineHeight, baseSizePx)
    for (let i = 1; i < n; i += 1) {
      lineMetrics = linesMetrics[i]
      const iLineHeight =
        emToPx(lineMetrics.lineHeight, baseSizePx) || lineHeightPx
      rLineHeights += iLineHeight
    }
    const llMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx
    let dy
    switch (alignment) {
      case 'middle':
        dy = flMaxFont / 2 - 0.15 * llMaxFont - rLineHeights / 2
        break
      case 'bottom':
        dy = -(0.25 * llMaxFont) - rLineHeights
        break
      default:
      case 'top':
        dy = 0.8 * flMaxFont
        break
    }
    return dy
  }

  export interface TextOptions {
    /** Should we allow the text to be selected? */
    displayEmpty?: boolean
    /** End of Line character */
    eol?: string
    textPath?: string | { d?: string; 'xlink:href'?: string }
    textVerticalAnchor?: 'middle' | 'bottom' | 'top' | number
    x?: number | string
    /** auto, 1.25em */
    lineHeight?: string
    includeAnnotationIndices?: boolean
    annotations?: Annotation | Annotation[]
  }

  export function text(
    elem: SVGElement,
    content: string,
    options: TextOptions = {},
  ) {
    content = sanitizeText(content) // tslint:disable-line
    const eol = options.eol
    let textPath = options.textPath
    const verticalAnchor = options.textVerticalAnchor
    const namedVerticalAnchor =
      verticalAnchor === 'middle' ||
      verticalAnchor === 'bottom' ||
      verticalAnchor === 'top'

    // Horizontal shift applied to all the lines but the first.
    let x = options.x
    if (x === undefined) {
      x = elem.getAttribute('x') || 0
    }

    // Annotations
    const iai = options.includeAnnotationIndices
    let annotations = options.annotations
    if (annotations && !Array.isArray(annotations)) {
      annotations = [annotations]
    }

    // Shift all the <tspan> but first by one line (`1em`)
    const defaultLineHeight = options.lineHeight
    const autoLineHeight = defaultLineHeight === 'auto'
    const lineHeight = autoLineHeight ? '1.5em' : defaultLineHeight || '1em'

    empty(elem)

    attr(elem, {
      // Preserve spaces, do not consecutive spaces to get collapsed to one.
      'xml:space': 'preserve',
      // An empty text gets rendered into the DOM in webkit-based browsers.
      // In order to unify this behaviour across all browsers
      // we rather hide the text element when it's empty.
      display: content || options.displayEmpty ? null : 'none',
    })

    // Set default font-size if none
    let fontSize = parseFloat(attr(elem, 'font-size'))
    if (!fontSize) {
      fontSize = 16
      if (namedVerticalAnchor || annotations) {
        attr(elem, 'font-size', `${fontSize}`)
      }
    }

    let containerNode
    if (textPath) {
      // Now all the `<tspan>`s will be inside the `<textPath>`.
      if (typeof textPath === 'string') {
        textPath = { d: textPath }
      }
      containerNode = createTextPathNode(textPath as any, this)
    } else {
      containerNode = document.createDocumentFragment()
    }

    let dy
    let offset = 0
    let annotatedY
    const lines = content.split('\n')
    const linesMetrics = []
    const lastI = lines.length - 1

    for (let i = 0; i <= lastI; i += 1) {
      dy = lineHeight
      let lineClassName = 'v-line'
      const lineNode = document.createElementNS(
        ns.svg,
        'tspan',
      ) as SVGTSpanElement

      let lineMetrics
      let line = lines[i]
      if (line) {
        if (annotations) {
          // Find the *compacted* annotations for this line.
          const lineAnnotations = annotateString(line, annotations, {
            offset: -offset,
            includeAnnotationIndices: iai,
          })

          lineMetrics = annotateTextLine(lineNode, lineAnnotations, {
            eol: i !== lastI && eol,
            baseSize: fontSize,
            lineHeight: autoLineHeight ? null : lineHeight,
            includeAnnotationIndices: iai,
          })

          // Get the line height based on the biggest font size in the annotations for this line.
          const iLineHeight = lineMetrics.lineHeight
          if (iLineHeight && autoLineHeight && i !== 0) {
            dy = iLineHeight
          }

          if (i === 0) {
            annotatedY = lineMetrics.maxFontSize * 0.8
          }
        } else {
          if (eol && i !== lastI) {
            line += eol
          }

          lineNode.textContent = line
        }
      } else {
        // Make sure the textContent is never empty. If it is, add a dummy
        // character and make it invisible, making the following lines correctly
        // relatively positioned. `dy=1em` won't work with empty lines otherwise.
        lineNode.textContent = '-'
        lineClassName += ' v-empty-line'

        const lineNodeStyle = lineNode.style as any
        lineNodeStyle.fillOpacity = 0
        lineNodeStyle.strokeOpacity = 0

        if (annotations) {
          lineMetrics = {}
        }
      }

      if (lineMetrics) {
        linesMetrics.push(lineMetrics)
      }

      if (i > 0) {
        lineNode.setAttribute('dy', dy)
      }

      // Firefox requires 'x' to be set on the first line
      if (i > 0 || textPath) {
        lineNode.setAttribute('x', x as string)
      }

      lineNode.className.baseVal = lineClassName
      containerNode.appendChild(lineNode)
      offset += line.length + 1 // + 1 = newline character.
    }

    // Y Alignment calculation
    if (namedVerticalAnchor) {
      if (annotations) {
        dy = calculateDY(
          verticalAnchor as string,
          linesMetrics,
          fontSize,
          lineHeight,
        )
      } else if (verticalAnchor === 'top') {
        // A shortcut for top alignment. It does not depend on font-size nor line-height
        dy = '0.8em'
      } else {
        let rh // remaining height
        if (lastI > 0) {
          rh = parseFloat(lineHeight) || 1
          rh *= lastI
          if (!emRegex.test(lineHeight)) rh /= fontSize
        } else {
          // Single-line text
          rh = 0
        }
        switch (verticalAnchor) {
          case 'middle':
            dy = `${0.3 - rh / 2}em`
            break
          case 'bottom':
            dy = `${-rh - 0.3}em`
            break
        }
      }
    } else {
      if (verticalAnchor === 0) {
        dy = '0em'
      } else if (verticalAnchor) {
        dy = verticalAnchor
      } else {
        // No vertical anchor is defined
        dy = 0
        // Backwards compatibility - we change the `y` attribute instead of `dy`.
        if (this.attr('y') === null) {
          this.attr('y', annotatedY || '0.8em')
        }
      }
    }

    const firstLine = containerNode.firstChild as SVGElement
    firstLine.setAttribute('dy', dy)
    elem.appendChild(containerNode)
  }
}

// bbox
export namespace V {
  export function bbox(
    elem: SVGElement,
    withoutTransformations?: boolean,
    target?: SVGElement,
  ): Rectangle {
    let box
    const ownerSVGElement = elem.ownerSVGElement

    // If the element is not in the live DOM, it does not have a bounding box
    // defined and so fall back to 'zero' dimension element.
    if (!ownerSVGElement) {
      return new Rectangle(0, 0, 0, 0)
    }

    try {
      box = (elem as any).getBBox() as Rectangle
    } catch (e) {
      // Fallback for IE.
      box = {
        x: elem.clientLeft,
        y: elem.clientTop,
        width: elem.clientWidth,
        height: elem.clientHeight,
      }
    }

    if (withoutTransformations) {
      return Rectangle.create(box)
    }

    const matrix = getTransformToElement(elem, target || ownerSVGElement)
    return transformRect(box, matrix)
  }

  export function getBBox(
    elem: SVGElement,
    target?: SVGElement | HTMLElement | V,
    recursive?: boolean,
  ): Rectangle {
    let outputBBox
    const ownerSVGElement = elem.ownerSVGElement

    // If the element is not in the live DOM, it does not have a bounding box
    // defined and so fall back to 'zero' dimension element.
    // If the element is not an SVGGraphicsElement, we could not measure the
    // bounding box either
    if (!ownerSVGElement || !isSVGGraphicsElement(elem)) {
      return new Rectangle(0, 0, 0, 0)
    }

    target = toNode(target) // tslint:disable-line

    if (!recursive) {
      try {
        outputBBox = elem.getBBox()
      } catch (e) {
        outputBBox = {
          x: elem.clientLeft,
          y: elem.clientTop,
          width: elem.clientWidth,
          height: elem.clientHeight,
        }
      }

      if (!target) {
        // transform like this (that is, not at all)
        return Rectangle.create(outputBBox)
      }

      // transform like target
      const matrix = getTransformToElement(elem, target)
      return transformRect(outputBBox, matrix)
    }

    {
      const children = create(elem).children()
      const n = children.length

      if (n === 0) {
        return getBBox(elem, target)
      }

      if (!target) {
        target = elem // tslint:disable-line
      }

      for (let i = 0; i < n; i += 1) {
        const child = children[i]
        let childBBox

        if (child.children().length === 0) {
          childBBox = getBBox(child.node, target)
        } else {
          // if child is a group element, enter it with a recursive call
          childBBox = getBBox(child.node, target, true)
        }

        if (!outputBBox) {
          outputBBox = childBBox
        } else {
          outputBBox = outputBBox.union(childBBox)
        }
      }

      return outputBBox as Rectangle
    }
  }
}

// geometry
export namespace V {
  export function toLocalPoint(
    elem: SVGElement | SVGSVGElement,
    x: number,
    y: number,
  ) {
    const svg =
      elem instanceof SVGSVGElement ? elem : (elem.ownerSVGElement as any)

    const p = svg.createSVGPoint()
    p.x = x
    p.y = y

    try {
      const globalPoint = p.matrixTransform(svg.getScreenCTM().inverse())
      const globalToLocalMatrix = getTransformToElement(elem, svg).inverse()
      return globalPoint.matrixTransform(globalToLocalMatrix)
    } catch (e) {
      return p
    }
  }

  export function toGeometryShape(elem: SVGElement | SVGSVGElement) {
    const attr = (name: string) => {
      const s = elem.getAttribute(name)
      const v = s ? parseFloat(s) : 0
      return isNaN(v) ? 0 : v
    }

    switch (elem.nodeName.toLocaleLowerCase()) {
      case 'rect':
        return new Rectangle(
          attr('x'),
          attr('y'),
          attr('width'),
          attr('height'),
        )

      case 'circle':
        return new Ellipse(attr('cx'), attr('cy'), attr('r'), attr('r'))

      case 'ellipse':
        return new Ellipse(attr('cx'), attr('cy'), attr('rx'), attr('ry'))

      case 'polyline':
        let points = getPointsFromSvgElement(elem)
        return new Polyline(points)

      case 'polyline':
        points = getPointsFromSvgElement(elem)
        if (points.length > 1) {
          points.push(points[0])
        }
        return new Polyline(points)

      case 'path':
        let d = elem.getAttribute('d') as string
        if (!Path.isDataSupported(d)) {
          d = normalizePathData(d)
        }
        return Path.parse(d)

      case 'line':
        return new Line(attr('x1'), attr('y1'), attr('x2'), attr('y2'))
    }

    // Anything else is a rectangle
    return getBBox(elem)
  }

  export function sample(elem: SVGPathElement, interval: number = 1) {
    const length = elem.getTotalLength()
    const samples = []
    let distance = 0
    let sample
    while (distance < length) {
      sample = elem.getPointAtLength(distance)
      samples.push({ distance, x: sample.x, y: sample.y })
      distance += interval
    }
    return samples
  }

  export function findIntersection(
    elem: SVGElement | SVGSVGElement,
    ref: Point | Point.PointLike | Point.PointData,
    target?: SVGElement,
  ) {
    const svg = elem instanceof SVGSVGElement ? elem : elem.ownerSVGElement!
    target = target || svg // tslint:disable-line
    const bbox = getBBox(target)
    const center = bbox.getCenter()

    if (!bbox.intersectionWithLineFromCenterToPoint(ref)) {
      return undefined
    }

    let spot: Point | undefined
    const tagName = elem.tagName.toLowerCase()

    // Little speed up optimization for `<rect>` element. We do not do convert
    // to path element and sampling but directly calculate the intersection
    // through a transformed geometrical rectangle.
    if (tagName === 'rect') {
      const gRect = new Rectangle(
        parseFloat(elem.getAttribute('x') || '0'),
        parseFloat(elem.getAttribute('y') || '0'),
        parseFloat(elem.getAttribute('width') || '0'),
        parseFloat(elem.getAttribute('height') || '0'),
      )
      // Get the rect transformation matrix with regards to the SVG document.
      const rectMatrix = getTransformToElement(elem, target)
      const rectMatrixComponents = decomposeMatrix(rectMatrix)
      // Rotate the rectangle back so that we can use
      // `intersectionWithLineFromCenterToPoint()`.
      const resetRotation = svg.createSVGTransform()
      resetRotation.setRotate(
        -rectMatrixComponents.rotation,
        center.x,
        center.y,
      )
      const rect = transformRect(
        gRect,
        resetRotation.matrix.multiply(rectMatrix),
      )

      spot = Rectangle.create(rect).intersectionWithLineFromCenterToPoint(
        ref,
        rectMatrixComponents.rotation,
      )
    } else if (
      tagName === 'path' ||
      tagName === 'polygon' ||
      tagName === 'polyline' ||
      tagName === 'circle' ||
      tagName === 'ellipse'
    ) {
      const pathNode = tagName === 'path' ? elem : convertToPath(elem as any)
      const samples = sample(pathNode as SVGPathElement)
      let minDistance = Infinity
      let closestSamples: any[] = []

      for (let i = 0, ii = samples.length; i < ii; i += 1) {
        const sample = samples[i]

        // Convert the sample point in the local coordinate system
        // to the global coordinate system.
        let gp = createSVGPoint(sample.x, sample.y)
        gp = gp.matrixTransform(getTransformToElement(elem, target))
        const ggp = Point.create(gp)
        const centerDistance = ggp.distance(center)
        // Penalize a higher distance to the reference point by 10%.
        // This gives better results. This is due to
        // inaccuracies introduced by rounding errors and getPointAtLength() returns.
        const refDistance = ggp.distance(ref) * 1.1
        const distance = centerDistance + refDistance

        if (distance < minDistance) {
          minDistance = distance
          closestSamples = [{ sample, refDistance }]
        } else if (distance < minDistance + 1) {
          closestSamples.push({ sample, refDistance })
        }
      }

      closestSamples.sort((a, b) => a.refDistance - b.refDistance)

      if (closestSamples[0]) {
        spot = Point.create(closestSamples[0].sample)
      }
    }

    return spot
  }

  export function translateAndAutoOrient(
    elem: SVGElement,
    position: Point | Point.PointLike | Point.PointData,
    reference: Point | Point.PointLike | Point.PointData,
    target?: SVGElement,
  ) {
    const pos = Point.create(position)
    const ref = Point.create(reference)

    if (!target) {
      const svg = elem instanceof SVGSVGElement ? elem : elem.ownerSVGElement!
      target = svg // tslint:disable-line
    }

    // Clean-up previously set transformations except the scale.
    // If we didn't clean up the previous transformations then they'd
    // add up with the old ones. Scale is an exception as it doesn't
    // add up, consider: `this.scale(2).scale(2).scale(2)`. The result
    // is that the element is scaled by the factor 2, not 8.
    const s = scale(elem)
    this.attr('transform', '')
    const bbox = getBBox(elem, target).scale(s.sx, s.sy)

    // 1. Translate to origin.
    const translateToOrigin = createSVGTransform()
    translateToOrigin.setTranslate(
      -bbox.x - bbox.width / 2,
      -bbox.y - bbox.height / 2,
    )

    // 2. Rotate around origin.
    const rotateAroundOrigin = createSVGTransform()
    const angle = pos.angleBetween(ref, pos.clone().translate(1, 0))
    if (angle) rotateAroundOrigin.setRotate(angle, 0, 0)

    // 3. Translate to the `position` + the offset (half my width) towards the `reference` point.
    const translateFromOrigin = createSVGTransform()
    const finalPosition = pos.clone().move(ref, bbox.width / 2)
    translateFromOrigin.setTranslate(
      2 * pos.x - finalPosition.x,
      2 * pos.y - finalPosition.y,
    )

    // 4. Get the current transformation matrix of this node
    const ctm = getTransformToElement(elem, target)

    // 5. Apply transformations and the scale
    const transform = createSVGTransform()
    transform.setMatrix(
      translateFromOrigin.matrix.multiply(
        rotateAroundOrigin.matrix.multiply(
          translateToOrigin.matrix.multiply(ctm.scale(s.sx, s.sy)),
        ),
      ),
    )

    elem.setAttribute('transform', matrixToTransformString(transform.matrix))
  }

  export function animateAlongPath(
    elem: SVGElement,
    attrs: { [name: string]: string },
    path: SVGPathElement | V,
  ) {
    const id = ensureId(path)
    const animate = create('animateMotion', attrs).node as SVGAnimationElement
    const mpath = create('mpath', { 'xlink:href': `#${id}` }).node

    animate.appendChild(mpath)
    elem.appendChild(animate)

    try {
      (animate as any).beginElement()
    } catch (e) {
      // Fallback for IE 9.
      // Run the animation programmatically
      if (document.documentElement.getAttribute('smiling') === 'fake') {
        /* global getTargets:true, Animator:true, animators:true id2anim:true */
        // Register the animation. (See `https://answers.launchpad.net/smil/+question/203333`)
        const animation = animate as any
        animation.animators = []

        const win = window as any
        const animationID = animation.getAttribute('id')
        if (animationID) {
          win.id2anim[animationID] = animation
        }

        const targets = win.getTargets(animation)
        for (let i = 0, ii = targets.length; i < ii; i += 1) {
          const target = targets[i]
          const animator = new win.Animator(animation, target, i)
          win.animators.push(animator)
          animation.animators[i] = animator
          animator.register()
        }
      }
    }
  }
}

// sanitize & annotation
export namespace V {
  /**
   * Replace all spaces with the Unicode No-break space. IE would
   * otherwise collapse all spaces into one.
   *
   * @see http://www.fileformat.info/info/unicode/char/a0/index.htm
   *
   * This is useful e.g. in tests when you want to compare the actual
   * DOM text content without having to add the unicode character in
   * the place of all spaces.
   */
  export function sanitizeText(text: string) {
    return text.replace(/ /g, '\u00A0')
  }

  export function annotateString(
    t: any,
    annotations: any,
    opt: { offset?: number; includeAnnotationIndices?: boolean } = {},
  ) {
    const offset = opt.offset || 0
    const compacted = []
    let batch
    const ret = []
    let item
    let prev

    for (let i = 0; i < t.length; i += 1) {
      item = ret[i] = t[i]

      for (let j = 0; j < annotations.length; j += 1) {
        const annotation = annotations[j]
        const start = annotation.start + offset
        const end = annotation.end + offset

        if (i >= start && i < end) {
          // Annotation applies.
          if (isObject(item)) {
            // There is more than one annotation to be applied => Merge attributes.
            item.attrs = mergeAttrs(
              mergeAttrs({}, item.attrs),
              annotation.attrs,
            )
          } else {
            item = ret[i] = { t: t[i], attrs: annotation.attrs }
          }
          if (opt.includeAnnotationIndices) {
            (item.annotations || (item.annotations = [])).push(j)
          }
        }
      }

      prev = ret[i - 1]

      if (!prev) {
        batch = item
      } else if (isObject(item) && isObject(prev)) {
        // Both previous item and the current one are annotations. If the attributes
        // didn't change, merge the text.
        if (JSON.stringify(item.attrs) === JSON.stringify(prev.attrs)) {
          batch.t += item.t
        } else {
          compacted.push(batch)
          batch = item
        }
      } else if (isObject(item)) {
        // Previous item was a string, current item is an annotation.
        compacted.push(batch)
        batch = item
      } else if (isObject(prev)) {
        // Previous item was an annotation, current item is a string.
        compacted.push(batch)
        batch = item
      } else {
        // Both previous and current item are strings.
        batch = (batch || '') + item
      }
    }

    if (batch) {
      compacted.push(batch)
    }

    return compacted
  }

  export interface Annotation {
    start: number
    end: number
  }

  export function findAnnotationsAtIndex(
    annotations: Annotation[],
    index: number,
  ) {
    return annotations
      ? annotations.filter(a => a.start < index && index <= a.end)
      : []
  }

  export function findAnnotationsBetweenIndexes(
    annotations: Annotation[],
    start: number,
    end: number,
  ) {
    return annotations
      ? annotations.filter(
          a =>
            (start >= a.start && start < a.end) ||
            (end > a.start && end <= a.end) ||
            (a.start >= start && a.end < end),
        )
      : []
  }

  export function shiftAnnotations(
    annotations: Annotation[],
    index: number,
    offset: number,
  ) {
    if (annotations) {
      annotations.forEach(a => {
        if (a.start < index && a.end >= index) {
          a.end += offset
        } else if (a.start >= index) {
          a.start += offset
          a.end += offset
        }
      })
    }

    return annotations
  }
}

// transform
export namespace V {
  export interface TransformOptions {
    absolute?: boolean
  }

  const attr = (elem: SVGElement, name: string) => elem.getAttribute(name) || ''

  export function getTransformToElement(
    elem: SVGElement,
    target: SVGElement | V,
  ) {
    const ref = target instanceof V ? target.node : target
    if (isSVGGraphicsElement(ref) && isSVGGraphicsElement(elem)) {
      const targetCTM = (ref as any).getScreenCTM()
      const nodeCTM = elem.getScreenCTM()
      if (targetCTM && nodeCTM) {
        return targetCTM.inverse().multiply(nodeCTM)
      }
    }

    // Could not get actual transformation matrix
    return createSVGMatrix()
  }

  export function transform(elem: SVGElement): DOMMatrix
  export function transform(
    elem: SVGElement,
    matrix: DOMMatrix,
    options?: TransformOptions,
  ): void
  export function transform(
    elem: SVGElement,
    matrix?: DOMMatrix,
    opt: TransformOptions = {},
  ) {
    if (isUndefined(matrix)) {
      return transformStringToMatrix(attr(elem, 'transform'))
    }

    if (opt.absolute) {
      elem.setAttribute('transform', matrixToTransformString(matrix))
      return
    }

    const transform = (elem as any).transform
    const svgTransform = createSVGTransform(matrix)
    transform.baseVal.appendItem(svgTransform)
  }

  export function translate(elem: SVGElement): Translate
  export function translate(
    elem: SVGElement,
    tx: number,
    ty?: number,
    options?: TransformOptions,
  ): void
  export function translate(
    elem: SVGElement,
    tx?: number,
    ty: number = 0,
    options: TransformOptions = {},
  ) {
    let transformAttr = attr(elem, 'transform')
    const transform = parseTransformString(transformAttr)
    if (tx == null) {
      return transform.translate
    }

    transformAttr = transform.value
    transformAttr = transformAttr.replace(/translate\([^)]*\)/g, '').trim()

    const newTx = options.absolute ? tx : transform.translate.tx + tx
    const newTy = options.absolute ? ty : transform.translate.ty + ty
    const newTranslate = `translate(${newTx},${newTy})`

    // Note that `translate()` is always the first transformation. This is
    // usually the desired case.
    elem.setAttribute('transform', `${newTranslate} ${transformAttr}`.trim())
  }

  export function rotate(elem: SVGElement): Rotate
  export function rotate(
    elem: SVGElement,
    angle: number,
    cx?: number,
    cy?: number,
    options?: TransformOptions,
  ): void
  export function rotate(
    elem: SVGElement,
    angle?: number,
    cx?: number,
    cy?: number,
    options: TransformOptions = {},
  ) {
    let transformAttr = attr(elem, 'transform')
    const transform = parseTransformString(transformAttr)

    if (angle == null) {
      return transform.rotate
    }

    transformAttr = transform.value
    transformAttr = transformAttr.replace(/rotate\([^)]*\)/g, '').trim()

    angle %= 360 // tslint:disable-line
    const newAngle = options.absolute ? angle : transform.rotate.angle + angle
    const newOrigin = cx != null && cy != null ? `,${cx},${cy}` : ''
    const newRotate = `rotate(${newAngle}${newOrigin})`
    elem.setAttribute('transform', `${transformAttr} ${newRotate}`.trim())
  }

  export function scale(elem: SVGElement): Scale
  export function scale(elem: SVGElement, sx: number, sy?: number): void
  export function scale(elem: SVGElement, sx?: number, sy?: number) {
    let transformAttr = attr(elem, 'transform')
    const transform = parseTransformString(transformAttr)

    if (sx == null) {
      return transform.scale
    }

    sy = sy == null ? sx : sy //tslint:disable-line

    transformAttr = transform.value
    transformAttr = transformAttr.replace(/scale\([^)]*\)/g, '').trim()
    const newScale = `scale(${sx},${sy})`
    elem.setAttribute('transform', `${transformAttr} ${newScale}`.trim())
  }
}

// to path element
export namespace V {
  export const KAPPA = 0.551784

  function getNumbericAttribute(
    elem: SVGElement,
    attr: string,
    defaultValue: number = NaN,
  ) {
    const v = elem.getAttribute(attr)
    if (v == null) {
      return defaultValue
    }
    const n = parseFloat(v)
    return isNaN(n) ? defaultValue : n
  }

  export function convertLineToPathData(line: SVGLineElement) {
    return [
      'M',
      getNumbericAttribute(line, 'x1'),
      getNumbericAttribute(line, 'y1'),
      'L',
      getNumbericAttribute(line, 'x2'),
      getNumbericAttribute(line, 'y2'),
    ].join(' ')
  }

  export function convertPolygonToPathData(polygon: SVGPolygonElement) {
    const points = getPointsFromSvgElement(polygon)
    if (points.length === 0) {
      return null
    }
    return `${svgPointsToPath(points)} Z`
  }

  export function convertPolylineToPathData(polyline: SVGPolylineElement) {
    const points = getPointsFromSvgElement(polyline)
    if (points.length === 0) {
      return null
    }

    return svgPointsToPath(points)
  }

  function svgPointsToPath(points: DOMPoint[]) {
    const arr = points.map(p => `${p.x} ${p.y}`)
    return `M ${arr.join(' L')}`
  }

  export function getPointsFromSvgElement(elem: SVGElement | V) {
    const node = toNode(elem) as SVGPolygonElement
    const points = []
    const nodePoints = node.points
    if (nodePoints) {
      for (let i = 0, ii = nodePoints.numberOfItems; i < ii; i += 1) {
        points.push(nodePoints.getItem(i))
      }
    }

    return points
  }

  export function convertCircleToPathData(circle: SVGCircleElement) {
    const cx = getNumbericAttribute(circle, 'cx', 0)
    const cy = getNumbericAttribute(circle, 'cy', 0)
    const r = getNumbericAttribute(circle, 'r')
    const cd = r * KAPPA // Control distance.

    return [
      'M',
      cx,
      cy - r, // Move to the first point.
      'C',
      cx + cd,
      cy - r,
      cx + r,
      cy - cd,
      cx + r,
      cy, // I. Quadrant.
      'C',
      cx + r,
      cy + cd,
      cx + cd,
      cy + r,
      cx,
      cy + r, // II. Quadrant.
      'C',
      cx - cd,
      cy + r,
      cx - r,
      cy + cd,
      cx - r,
      cy, // III. Quadrant.
      'C',
      cx - r,
      cy - cd,
      cx - cd,
      cy - r,
      cx,
      cy - r, // IV. Quadrant.
      'Z',
    ].join(' ')
  }

  export function convertEllipseToPathData(ellipse: SVGEllipseElement) {
    const cx = getNumbericAttribute(ellipse, 'cx', 0)
    const cy = getNumbericAttribute(ellipse, 'cy', 0)
    const rx = getNumbericAttribute(ellipse, 'rx')
    const ry = getNumbericAttribute(ellipse, 'ry') || rx
    const cdx = rx * KAPPA // Control distance x.
    const cdy = ry * KAPPA // Control distance y.

    const d = [
      'M',
      cx,
      cy - ry, // Move to the first point.
      'C',
      cx + cdx,
      cy - ry,
      cx + rx,
      cy - cdy,
      cx + rx,
      cy, // I. Quadrant.
      'C',
      cx + rx,
      cy + cdy,
      cx + cdx,
      cy + ry,
      cx,
      cy + ry, // II. Quadrant.
      'C',
      cx - cdx,
      cy + ry,
      cx - rx,
      cy + cdy,
      cx - rx,
      cy, // III. Quadrant.
      'C',
      cx - rx,
      cy - cdy,
      cx - cdx,
      cy - ry,
      cx,
      cy - ry, // IV. Quadrant.
      'Z',
    ].join(' ')
    return d
  }

  export function convertRectToPathData(rect: SVGRectElement) {
    return rectToPath({
      x: getNumbericAttribute(rect, 'x', 0),
      y: getNumbericAttribute(rect, 'y', 0),
      width: getNumbericAttribute(rect, 'width', 0),
      height: getNumbericAttribute(rect, 'height', 0),
      rx: getNumbericAttribute(rect, 'rx', 0),
      ry: getNumbericAttribute(rect, 'ry', 0),
    })
  }

  export function rectToPath(r: {
    x: number
    y: number
    width: number
    height: number
    rx?: number
    ry?: number
    'top-rx'?: number
    'bottom-rx'?: number
    'top-ry'?: number
    'bottom-ry'?: number
  }) {
    let d
    const x = r.x
    const y = r.y
    const width = r.width
    const height = r.height
    const topRx = Math.min(r.rx || r['top-rx'] || 0, width / 2)
    const bottomRx = Math.min(r.rx || r['bottom-rx'] || 0, width / 2)
    const topRy = Math.min(r.ry || r['top-ry'] || 0, height / 2)
    const bottomRy = Math.min(r.ry || r['bottom-ry'] || 0, height / 2)

    if (topRx || bottomRx || topRy || bottomRy) {
      d = [
        'M',
        x,
        y + topRy,
        'v',
        height - topRy - bottomRy,
        'a',
        bottomRx,
        bottomRy,
        0,
        0,
        0,
        bottomRx,
        bottomRy,
        'h',
        width - 2 * bottomRx,
        'a',
        bottomRx,
        bottomRy,
        0,
        0,
        0,
        bottomRx,
        -bottomRy,
        'v',
        -(height - bottomRy - topRy),
        'a',
        topRx,
        topRy,
        0,
        0,
        0,
        -topRx,
        -topRy,
        'h',
        -(width - 2 * topRx),
        'a',
        topRx,
        topRy,
        0,
        0,
        0,
        -topRx,
        topRy,
        'Z',
      ]
    } else {
      d = ['M', x, y, 'H', x + width, 'V', y + height, 'H', x, 'V', y, 'Z']
    }

    return d.join(' ')
  }

  export function convertToPath(
    elem:
      | SVGLineElement
      | SVGPolygonElement
      | SVGPolylineElement
      | SVGEllipseElement
      | SVGCircleElement
      | SVGRectElement,
  ) {
    const path = create('path').node
    attr(path, attr(elem))
    const d = convertToPathData(elem)
    if (d) {
      path.setAttribute('d', d)
    }
    return path as SVGPathElement
  }

  export function convertToPathData(
    elem:
      | SVGLineElement
      | SVGPolygonElement
      | SVGPolylineElement
      | SVGEllipseElement
      | SVGCircleElement
      | SVGRectElement,
  ) {
    const tagName = elem.tagName.toLowerCase()
    switch (tagName) {
      case 'path':
        return attr(elem, 'd')
      case 'line':
        return convertLineToPathData(elem as SVGLineElement)
      case 'polygon':
        return convertPolygonToPathData(elem as SVGPolygonElement)
      case 'polyline':
        return convertPolylineToPathData(elem as SVGPolylineElement)
      case 'ellipse':
        return convertEllipseToPathData(elem as SVGEllipseElement)
      case 'circle':
        return convertCircleToPathData(elem as SVGCircleElement)
      case 'rect':
        return convertRectToPathData(elem as SVGRectElement)
    }

    throw new Error(`"${tagName}" cannot be converted to svg path element.`)
  }
}

// matrix
export namespace V {
  const svgDocument = create('svg').node as SVGSVGElement

  const transformRegex = /(\w+)\(([^,)]+),?([^)]+)?\)/gi
  const transformSeparatorRegex = /[ ,]+/
  const transformationListRegex = /^(\w+)\((.*)\)/

  export function transformStringToMatrix(transform: string) {
    let transformationMatrix = createSVGMatrix()
    const matches = transform && transform.match(transformRegex)
    if (!matches) {
      return transformationMatrix
    }

    for (let i = 0, n = matches.length; i < n; i += 1) {
      const transformationString = matches[i]

      const transformationMatch = transformationString.match(
        transformationListRegex,
      )
      if (transformationMatch) {
        let sx
        let sy
        let tx
        let ty
        let angle
        let ctm = createSVGMatrix()
        const args = transformationMatch[2].split(transformSeparatorRegex)
        switch (transformationMatch[1].toLowerCase()) {
          case 'scale':
            sx = parseFloat(args[0])
            sy = args[1] === undefined ? sx : parseFloat(args[1])
            ctm = ctm.scaleNonUniform(sx, sy)
            break
          case 'translate':
            tx = parseFloat(args[0])
            ty = parseFloat(args[1])
            ctm = ctm.translate(tx, ty)
            break
          case 'rotate':
            angle = parseFloat(args[0])
            tx = parseFloat(args[1]) || 0
            ty = parseFloat(args[2]) || 0
            if (tx !== 0 || ty !== 0) {
              ctm = ctm
                .translate(tx, ty)
                .rotate(angle)
                .translate(-tx, -ty)
            } else {
              ctm = ctm.rotate(angle)
            }
            break
          case 'skewx':
            angle = parseFloat(args[0])
            ctm = ctm.skewX(angle)
            break
          case 'skewy':
            angle = parseFloat(args[0])
            ctm = ctm.skewY(angle)
            break
          case 'matrix':
            ctm.a = parseFloat(args[0])
            ctm.b = parseFloat(args[1])
            ctm.c = parseFloat(args[2])
            ctm.d = parseFloat(args[3])
            ctm.e = parseFloat(args[4])
            ctm.f = parseFloat(args[5])
            break
          default:
            continue
        }

        transformationMatrix = transformationMatrix.multiply(ctm)
      }
    }
    return transformationMatrix
  }

  export interface MatrixLike {
    a: number
    b: number
    c: number
    d: number
    e: number
    f: number
  }

  export function matrixToTransformString(
    matrix?: DOMMatrix | Partial<MatrixLike>,
  ) {
    const m = matrix || ({} as DOMMatrix)
    return (
      'matrix(' +
      (m.a !== undefined ? m.a : 1) +
      ',' +
      (m.b !== undefined ? m.b : 0) +
      ',' +
      (m.c !== undefined ? m.c : 0) +
      ',' +
      (m.d !== undefined ? m.d : 1) +
      ',' +
      (m.e !== undefined ? m.e : 0) +
      ',' +
      (m.f !== undefined ? m.f : 0) +
      ')' // tslint:disable-line
    )
  }

  export interface Translate {
    tx: number
    ty: number
  }

  export interface Rotate {
    angle: number
    cx?: number
    cy?: number
  }

  export interface Scale {
    sx: number
    sy: number
  }

  export function parseTransformString(transform: string) {
    let translate
    let rotate
    let scale

    if (transform) {
      const separator = transformSeparatorRegex

      // Allow reading transform string with a single matrix
      if (transform.trim().indexOf('matrix') >= 0) {
        const matrix = transformStringToMatrix(transform)
        const decomposedMatrix = decomposeMatrix(matrix)

        translate = [decomposedMatrix.translateX, decomposedMatrix.translateY]
        scale = [decomposedMatrix.scaleX, decomposedMatrix.scaleY]
        rotate = [decomposedMatrix.rotation]

        const transformations = []
        if (translate[0] !== 0 || translate[1] !== 0) {
          transformations.push(`translate(${translate.join(',')})`)
        }

        if (scale[0] !== 1 || scale[1] !== 1) {
          transformations.push(`scale(${scale.join(',')})`)
        }

        if (rotate[0] !== 0) {
          transformations.push(`rotate(${rotate[0]})`)
        }

        transform = transformations.join(' ') // tslint:disable-line
      } else {
        const translateMatch = transform.match(/translate\((.*?)\)/)
        if (translateMatch) {
          translate = translateMatch[1].split(separator)
        }
        const rotateMatch = transform.match(/rotate\((.*?)\)/)
        if (rotateMatch) {
          rotate = rotateMatch[1].split(separator)
        }
        const scaleMatch = transform.match(/scale\((.*?)\)/)
        if (scaleMatch) {
          scale = scaleMatch[1].split(separator)
        }
      }
    }

    const sx = scale && scale[0] ? parseFloat(scale[0] as string) : 1

    return {
      value: transform,
      translate: {
        tx:
          translate && translate[0] ? parseInt(translate[0] as string, 10) : 0,
        ty:
          translate && translate[1] ? parseInt(translate[1] as string, 10) : 0,
      } as Translate,
      rotate: {
        angle: rotate && rotate[0] ? parseInt(rotate[0] as string, 10) : 0,
        cx: rotate && rotate[1] ? parseInt(rotate[1] as string, 10) : undefined,
        cy: rotate && rotate[2] ? parseInt(rotate[2] as string, 10) : undefined,
      } as Rotate,
      scale: {
        sx,
        sy: scale && scale[1] ? parseFloat(scale[1] as string) : sx,
      } as Scale,
    }
  }

  export function deltaTransformPoint(
    matrix: DOMMatrix | MatrixLike,
    point: Point | Point.PointLike,
  ) {
    const dx = point.x * matrix.a + point.y * matrix.c + 0
    const dy = point.x * matrix.b + point.y * matrix.d + 0
    return { x: dx, y: dy }
  }

  export function decomposeMatrix(matrix: DOMMatrix | MatrixLike) {
    // @see https://gist.github.com/2052247

    const px = deltaTransformPoint(matrix, { x: 0, y: 1 })
    const py = deltaTransformPoint(matrix, { x: 1, y: 0 })

    const skewX = (180 / Math.PI) * Math.atan2(px.y, px.x) - 90
    const skewY = (180 / Math.PI) * Math.atan2(py.y, py.x)

    return {
      skewX,
      skewY,
      translateX: matrix.e,
      translateY: matrix.f,
      scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
      scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
      rotation: skewX,
    }
  }

  export function matrixToScale(matrix: DOMMatrix | MatrixLike) {
    let a
    let b
    let c
    let d

    if (matrix) {
      a = matrix.a == null ? 1 : matrix.a
      d = matrix.d == null ? 1 : matrix.d
      b = matrix.b
      c = matrix.c
    } else {
      a = d = 1
    }
    return {
      sx: b ? Math.sqrt(a * a + b * b) : a,
      sy: c ? Math.sqrt(c * c + d * d) : d,
    }
  }

  export function matrixToRotate(matrix: DOMMatrix | MatrixLike) {
    let p = { x: 0, y: 1 }
    if (matrix) {
      p = deltaTransformPoint(matrix, p)
    }

    return {
      angle: Angle.normalize(Angle.toDeg(Math.atan2(p.y, p.x)) - 90),
    }
  }

  export function matrixToTranslate(matrix: DOMMatrix | MatrixLike) {
    return {
      tx: (matrix && matrix.e) || 0,
      ty: (matrix && matrix.f) || 0,
    }
  }

  export function createSVGMatrix(matrix?: DOMMatrix | MatrixLike) {
    const svgMatrix = svgDocument.createSVGMatrix()
    if (matrix != null) {
      for (const component in matrix) {
        (svgMatrix as any)[component] = (matrix as any)[component]
      }
    }
    return svgMatrix
  }

  export function createSVGTransform(matrix?: DOMMatrix | MatrixLike) {
    if (matrix != null) {
      if (!(matrix instanceof DOMMatrix)) {
        matrix = createSVGMatrix(matrix) // tslint:disable-line
      }

      return svgDocument.createSVGTransformFromMatrix(matrix as DOMMatrix)
    }

    return svgDocument.createSVGTransform()
  }

  export function createSVGPoint(x: number, y: number) {
    const p = svgDocument.createSVGPoint()
    p.x = x
    p.y = y
    return p
  }

  export function transformRect(
    r: Rectangle | Rectangle.RectangleLike,
    matrix: DOMMatrix,
  ) {
    const p = svgDocument.createSVGPoint()

    p.x = r.x
    p.y = r.y
    const corner1 = p.matrixTransform(matrix)

    p.x = r.x + r.width
    p.y = r.y
    const corner2 = p.matrixTransform(matrix)

    p.x = r.x + r.width
    p.y = r.y + r.height
    const corner3 = p.matrixTransform(matrix)

    p.x = r.x
    p.y = r.y + r.height
    const corner4 = p.matrixTransform(matrix)

    const minX = Math.min(corner1.x, corner2.x, corner3.x, corner4.x)
    const maxX = Math.max(corner1.x, corner2.x, corner3.x, corner4.x)
    const minY = Math.min(corner1.y, corner2.y, corner3.y, corner4.y)
    const maxY = Math.max(corner1.y, corner2.y, corner3.y, corner4.y)

    return new Rectangle(minX, minY, maxX - minX, maxY - minY)
  }

  export function transformPoint(p: Point, matrix: DOMMatrix) {
    const ret = createSVGPoint(p.x, p.y).matrixTransform(matrix)
    return new Point(ret.x, ret.y)
  }

  export function transformLine(l: Line, matrix: DOMMatrix) {
    return new Line(
      transformPoint(l.start, matrix),
      transformPoint(l.end, matrix),
    )
  }

  export function transformPolyline(p: Polyline, matrix: DOMMatrix) {
    let inPoints = p instanceof Polyline ? p.points : p
    if (!Array.isArray(inPoints)) inPoints = []
    const outPoints = []
    for (let i = 0, n = inPoints.length; i < n; i += 1) {
      outPoints[i] = transformPoint(inPoints[i], matrix)
    }
    return new Polyline(outPoints)
  }
}

// normalize path data
export namespace V {
  const spaces =
    '\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029'

  const pathCommand = new RegExp(
    '([a-z])[' +
      spaces +
      ',]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[' +
      spaces +
      ']*,?[' +
      spaces +
      ']*)+)', // tslint:disable-line
    'ig',
  )

  const pathValues = new RegExp(
    '(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[' + spaces + ']*,?[' + spaces + ']*', // tslint:disable-line
    'ig',
  )

  const math = Math
  const PI = math.PI
  const sin = math.sin
  const cos = math.cos
  const tan = math.tan
  const asin = math.asin
  const sqrt = math.sqrt
  const abs = math.abs

  function rotate(x: number, y: number, rad: number) {
    const X = x * cos(rad) - y * sin(rad)
    const Y = x * sin(rad) + y * cos(rad)
    return { x: X, y: Y }
  }

  function q2c(
    x1: number,
    y1: number,
    ax: number,
    ay: number,
    x2: number,
    y2: number,
  ) {
    const _13 = 1 / 3
    const _23 = 2 / 3
    return [
      _13 * x1 + _23 * ax,
      _13 * y1 + _23 * ay,
      _13 * x2 + _23 * ax,
      _13 * y2 + _23 * ay,
      x2,
      y2,
    ]
  }

  function a2c(
    x1: number,
    y1: number,
    rx: number,
    ry: number,
    angle: number,
    largeArcFlag: number,
    sweepFlag: number,
    x2: number,
    y2: number,
    recursive?: [number, number, number, number],
  ): any[] {
    // for more information of where this math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    const _120 = (PI * 120) / 180
    const rad = (PI / 180) * (+angle || 0)
    let res = []
    let xy
    let f1
    let f2
    let cx
    let cy

    if (!recursive) {
      xy = rotate(x1, y1, -rad)
      x1 = xy.x // tslint:disable-line
      y1 = xy.y // tslint:disable-line

      xy = rotate(x2, y2, -rad)
      x2 = xy.x // tslint:disable-line
      y2 = xy.y // tslint:disable-line

      const x = (x1 - x2) / 2
      const y = (y1 - y2) / 2
      let h = (x * x) / (rx * rx) + (y * y) / (ry * ry)

      if (h > 1) {
        h = sqrt(h)
        rx = h * rx // tslint:disable-line
        ry = h * ry // tslint:disable-line
      }

      const rx2 = rx * rx
      const ry2 = ry * ry

      const k =
        (largeArcFlag === sweepFlag ? -1 : 1) *
        sqrt(
          abs(
            (rx2 * ry2 - rx2 * y * y - ry2 * x * x) /
              (rx2 * y * y + ry2 * x * x),
          ),
        )

      cx = (k * rx * y) / ry + (x1 + x2) / 2
      cy = (k * -ry * x) / rx + (y1 + y2) / 2

      f1 = asin(+((y1 - cy) / ry).toFixed(9))
      f2 = asin(+((y2 - cy) / ry).toFixed(9))

      f1 = x1 < cx ? PI - f1 : f1
      f2 = x2 < cx ? PI - f2 : f2

      if (f1 < 0) f1 = PI * 2 + f1
      if (f2 < 0) f2 = PI * 2 + f2

      if (sweepFlag && f1 > f2) f1 = f1 - PI * 2
      if (!sweepFlag && f2 > f1) f2 = f2 - PI * 2
    } else {
      f1 = recursive[0]
      f2 = recursive[1]
      cx = recursive[2]
      cy = recursive[3]
    }

    let df = f2 - f1
    if (abs(df) > _120) {
      const f2old = f2
      const x2old = x2
      const y2old = y2
      f2 = f1 + _120 * (sweepFlag && f2 > f1 ? 1 : -1)
      x2 = cx + rx * cos(f2) // tslint:disable-line
      y2 = cy + ry * sin(f2) // tslint:disable-line
      res = a2c(x2, y2, rx, ry, angle, 0, sweepFlag, x2old, y2old, [
        f2,
        f2old,
        cx,
        cy,
      ])
    }

    df = f2 - f1

    const c1 = cos(f1)
    const s1 = sin(f1)
    const c2 = cos(f2)
    const s2 = sin(f2)
    const t = tan(df / 4)
    const hx = (4 / 3) * (rx * t)
    const hy = (4 / 3) * (ry * t)
    const m1 = [x1, y1]
    const m2 = [x1 + hx * s1, y1 - hy * c1]
    const m3 = [x2 + hx * s2, y2 - hy * c2]
    const m4 = [x2, y2]

    m2[0] = 2 * m1[0] - m2[0]
    m2[1] = 2 * m1[1] - m2[1]

    if (recursive) {
      return [m2, m3, m4].concat(res)
    }

    {
      res = [m2, m3, m4]
        .concat(res)
        .join()
        .split(',')

      const newres = []
      const ii = res.length
      for (let i = 0; i < ii; i += 1) {
        newres[i] =
          i % 2
            ? rotate(+res[i - 1], +res[i], rad).y
            : rotate(+res[i], +res[i + 1], rad).x
      }
      return newres
    }
  }

  function parsePathString(pathString: string) {
    if (!pathString) {
      return null
    }

    const paramCounts = {
      a: 7,
      c: 6,
      h: 1,
      l: 2,
      m: 2,
      q: 4,
      s: 4,
      t: 2,
      v: 1,
      z: 0,
    }

    const data: any = []

    pathString.replace(pathCommand, (a: string, b: string, c: string) => {
      const params: number[] = []
      let name = b.toLowerCase()

      c.replace(pathValues, (a: string, b: string) => {
        if (b) {
          params.push(+b)
        }
        return a
      })

      if (name === 'm' && params.length > 2) {
        data.push([b, ...params.splice(0, 2)])
        name = 'l'
        b = b === 'm' ? 'l' : 'L' // tslint:disable-line
      }

      const count = (paramCounts as any)[name]
      while (params.length >= count) {
        data.push([b, ...params.splice(0, count)])
        if (!count) {
          break
        }
      }

      return a
    })

    return data
  }

  function pathToAbsolute(pathString: string) {
    const pathArray = parsePathString(pathString)

    // if invalid string, return 'M 0 0'
    if (!pathArray || !pathArray.length) {
      return [['M', 0, 0]]
    }

    const res = []
    let x = 0
    let y = 0
    let mx = 0
    let my = 0

    for (let i = 0, ii = pathArray.length; i < ii; i += 1) {
      const r: any = []

      res.push(r)

      const pa = pathArray[i]
      const action = pa[0]
      if (action !== action.toUpperCase()) {
        r[0] = action.toUpperCase()

        let jj
        let j

        switch (r[0]) {
          case 'A':
            r[1] = pa[1]
            r[2] = pa[2]
            r[3] = pa[3]
            r[4] = pa[4]
            r[5] = pa[5]
            r[6] = +pa[6] + x
            r[7] = +pa[7] + y
            break

          case 'V':
            r[1] = +pa[1] + y
            break

          case 'H':
            r[1] = +pa[1] + x
            break

          case 'M':
            mx = +pa[1] + x
            my = +pa[2] + y

            for (j = 1, jj = pa.length; j < jj; j += 1) {
              r[j] = +pa[j] + (j % 2 ? x : y)
            }
            break

          default:
            for (j = 1, jj = pa.length; j < jj; j += 1) {
              r[j] = +pa[j] + (j % 2 ? x : y)
            }
            break
        }
      } else {
        for (let j = 0, jj = pa.length; j < jj; j += 1) {
          r[j] = pa[j]
        }
      }

      switch (r[0]) {
        case 'Z':
          x = +mx
          y = +my
          break

        case 'H':
          x = r[1]
          break

        case 'V':
          y = r[1]
          break

        case 'M':
          mx = r[r.length - 2]
          my = r[r.length - 1]
          x = r[r.length - 2]
          y = r[r.length - 1]
          break

        default:
          x = r[r.length - 2]
          y = r[r.length - 1]
          break
      }
    }

    return res
  }

  function normalize(path: string) {
    const pathArray = pathToAbsolute(path)
    const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }

    function processPath(path: any[], d: any, pcom: string) {
      let nx
      let ny

      if (!path) {
        return ['C', d.x, d.y, d.x, d.y, d.x, d.y]
      }

      if (!(path[0] in { T: 1, Q: 1 })) {
        d.qx = null
        d.qy = null
      }

      switch (path[0]) {
        case 'M':
          d.X = path[1]
          d.Y = path[2]
          break

        case 'A':
          if (parseFloat(path[1]) === 0 || parseFloat(path[2]) === 0) {
            // https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
            // "If either rx or ry is 0, then this arc is treated as a
            // straight line segment (a "lineto") joining the endpoints."
            return ['L', path[6], path[7]]
          }

          return ['C'].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))))

        case 'S':
          if (pcom === 'C' || pcom === 'S') {
            // In 'S' case we have to take into account, if the previous command is C/S.
            nx = d.x * 2 - d.bx // And reflect the previous
            ny = d.y * 2 - d.by // command's control point relative to the current point.
          } else {
            // or some else or nothing
            nx = d.x
            ny = d.y
          }
          return ['C', nx, ny].concat(path.slice(1))

        case 'T':
          if (pcom === 'Q' || pcom === 'T') {
            // In 'T' case we have to take into account, if the previous command is Q/T.
            d.qx = d.x * 2 - d.qx // And make a reflection similar
            d.qy = d.y * 2 - d.qy // to case 'S'.
          } else {
            // or something else or nothing
            d.qx = d.x
            d.qy = d.y
          }
          return ['C'].concat(
            q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]) as any[],
          )

        case 'Q':
          d.qx = path[1]
          d.qy = path[2]
          return ['C'].concat(
            q2c(d.x, d.y, path[1], path[2], path[3], path[4]) as any[],
          )

        case 'H':
          return ['L'].concat(path[1], d.y)

        case 'V':
          return ['L'].concat(d.x, path[1])

        case 'L':
          break

        case 'Z':
          break
      }

      return path
    }

    function fixArc(pp: any[], i: number) {
      if (pp[i].length > 7) {
        pp[i].shift()
        const pi = pp[i]

        while (pi.length) {
          // if created multiple 'C's, their original seg is saved
          commands[i] = 'A'
          i += 1 // tslint:disable-line
          pp.splice(i, 0, ['C'].concat(pi.splice(0, 6)))
        }

        pp.splice(i, 1)
        ii = pathArray.length
      }
    }

    const commands = [] // path commands of original path p
    let prevCommand = '' // holder for previous path command of original path

    let ii = pathArray.length
    for (let i = 0; i < ii; i += 1) {
      let command = '' // temporary holder for original path command

      if (pathArray[i]) {
        command = pathArray[i][0] // save current path command
      }

      if (command !== 'C') {
        // C is not saved yet, because it may be result of conversion
        commands[i] = command // Save current path command
        if (i > 0) {
          prevCommand = commands[i - 1] // Get previous path command pcom
        }
      }

      // Previous path command is inputted to processPath
      pathArray[i] = processPath(pathArray[i], attrs, prevCommand)

      if (commands[i] !== 'A' && command === 'C') {
        commands[i] = 'C' // 'A' is the only command
      }

      // which may produce multiple 'C's
      // so we have to make sure that 'C' is also 'C' in original path

      fixArc(pathArray, i) // fixArc adds also the right amount of 'A's to pcoms

      const seg = pathArray[i]
      const seglen = seg.length

      attrs.x = seg[seglen - 2]
      attrs.y = seg[seglen - 1]

      attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x
      attrs.by = parseFloat(seg[seglen - 3]) || attrs.y
    }

    // make sure normalized path data string starts with an M segment
    if (!pathArray[0][0] || pathArray[0][0] !== 'M') {
      pathArray.unshift(['M', 0, 0])
    }

    return pathArray
  }

  /**
   * Converts provided SVG path data string into a normalized path data string.
   *
   * The normalization uses a restricted subset of path commands; all segments
   * are translated into lineto, curveto, moveto, and closepath segments.
   *
   * Relative path commands are changed into their absolute counterparts,
   * and chaining of coordinates is disallowed.
   *
   * The function will always return a valid path data string; if an input
   * string cannot be normalized, 'M 0 0' is returned.
   */
  export function normalizePathData(pathData: string) {
    return normalize(pathData)
      .join(',')
      .split(',')
      .join(' ')
  }
}
