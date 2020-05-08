import { Point, Line, Rectangle, Polyline, Ellipse, Path } from '../../geometry'
import { attr } from './attr'
import { sample, toPath, getPointsFromSvgElement } from './path'
import { ensureId, isSVGGraphicsElement, createSvgElement } from './elem'
import {
  createSVGPoint,
  createSVGMatrix,
  decomposeMatrix,
  transformRectangle,
} from './matrix'

/**
 * Returns the bounding box of the element after transformations are
 * applied. If `withoutTransformations` is `true`, transformations of
 * the element will not be considered when computing the bounding box.
 * If `target` is specified, bounding box will be computed relatively
 * to the `target` element.
 */
export function bbox(
  elem: SVGElement,
  withoutTransformations?: boolean,
  target?: SVGElement,
): Rectangle {
  let box
  const ownerSVGElement = elem.ownerSVGElement

  // If the element is not in the live DOM, it does not have a bounding
  // box defined and so fall back to 'zero' dimension element.
  if (!ownerSVGElement) {
    return new Rectangle(0, 0, 0, 0)
  }

  try {
    box = (elem as SVGGraphicsElement).getBBox()
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
  return transformRectangle(box, matrix)
}

/**
 * Returns the bounding box of the element after transformations are
 * applied. Unlike `bbox()`, this function fixes a browser implementation
 * bug to return the correct bounding box if this elemenent is a group of
 * svg elements (if `options.recursive` is specified).
 */
export function getBBox(
  elem: SVGElement,
  options: {
    target?: SVGElement | null
    recursive?: boolean
  } = {},
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

  let target = options.target
  const recursive = options.recursive

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
      return Rectangle.create(outputBBox)
    }

    // transform like target
    const matrix = getTransformToElement(elem, target)
    return transformRectangle(outputBBox, matrix)
  }

  // recursive
  {
    const children = elem.childNodes
    const n = children.length

    if (n === 0) {
      return getBBox(elem, { target })
    }

    if (!target) {
      target = elem // tslint:disable-line
    }

    for (let i = 0; i < n; i += 1) {
      const child = children[i] as SVGElement
      let childBBox

      if (child.childNodes.length === 0) {
        childBBox = getBBox(child, { target })
      } else {
        // if child is a group element, enter it with a recursive call
        childBBox = getBBox(child, { target, recursive: true })
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

/**
 * Returns an DOMMatrix that specifies the transformation necessary
 * to convert `elem` coordinate system into `target` coordinate system.
 */
export function getTransformToElement(elem: SVGElement, target: SVGElement) {
  if (isSVGGraphicsElement(target) && isSVGGraphicsElement(elem)) {
    const targetCTM = target.getScreenCTM()
    const nodeCTM = elem.getScreenCTM()
    if (targetCTM && nodeCTM) {
      return targetCTM.inverse().multiply(nodeCTM)
    }
  }

  // Could not get actual transformation matrix
  return createSVGMatrix()
}

/**
 * Converts a global point with coordinates `x` and `y` into the
 * coordinate space of the element.
 */
export function toLocalPoint(
  elem: SVGElement | SVGSVGElement,
  x: number,
  y: number,
) {
  const svg =
    elem instanceof SVGSVGElement
      ? elem
      : (elem.ownerSVGElement as SVGSVGElement)

  const p = svg.createSVGPoint()
  p.x = x
  p.y = y

  try {
    const ctm = svg.getScreenCTM()!
    const globalPoint = p.matrixTransform(ctm.inverse())
    const globalToLocalMatrix = getTransformToElement(elem, svg).inverse()
    return globalPoint.matrixTransform(globalToLocalMatrix)
  } catch (e) {
    return p
  }
}

/**
 * Convert the SVGElement to an equivalent geometric shape. The element's
 * transformations are not taken into account.
 *
 * SVGRectElement      => Rectangle
 *
 * SVGLineElement      => Line
 *
 * SVGCircleElement    => Ellipse
 *
 * SVGEllipseElement   => Ellipse
 *
 * SVGPolygonElement   => Polyline
 *
 * SVGPolylineElement  => Polyline
 *
 * SVGPathElement      => Path
 *
 * others              => Rectangle
 */
export function toGeometryShape(elem: SVGElement) {
  const attr = (name: string) => {
    const s = elem.getAttribute(name)
    const v = s ? parseFloat(s) : 0
    return isNaN(v) ? 0 : v
  }

  switch (elem instanceof SVGElement && elem.nodeName.toLowerCase()) {
    case 'rect':
      return new Rectangle(attr('x'), attr('y'), attr('width'), attr('height'))
    case 'circle':
      return new Ellipse(attr('cx'), attr('cy'), attr('r'), attr('r'))
    case 'ellipse':
      return new Ellipse(attr('cx'), attr('cy'), attr('rx'), attr('ry'))
    case 'polyline': {
      const points = getPointsFromSvgElement(elem as SVGPolylineElement)
      return new Polyline(points)
    }

    case 'polygon': {
      const points = getPointsFromSvgElement(elem as SVGPolygonElement)
      if (points.length > 1) {
        points.push(points[0])
      }
      return new Polyline(points)
    }

    case 'path': {
      let d = elem.getAttribute('d') as string
      if (!Path.isSupported(d)) {
        d = Path.normalize(d)
      }
      return Path.parse(d)
    }

    case 'line':
      return new Line(attr('x1'), attr('y1'), attr('x2'), attr('y2'))
  }

  // Anything else is a rectangle
  return getBBox(elem)
}

export function getIntersection(
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
    resetRotation.setRotate(-rectMatrixComponents.rotation, center.x, center.y)
    const rect = transformRectangle(
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
    const pathNode = tagName === 'path' ? elem : toPath(elem as any)
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

/**
 * Animate the element along the path SVG element (or Vectorizer object).
 * `attrs` contain Animation Timing attributes describing the animation.
 */
export function animateAlongPath(
  elem: SVGElement,
  attrs: { [name: string]: string },
  path: SVGPathElement,
) {
  const id = ensureId(path)
  const animate = createSvgElement<SVGAnimationElement>('animateMotion')
  const mpath = createSvgElement('mpath')

  attr(animate, attrs)
  attr(mpath, { 'xlink:href': `#${id}` })

  animate.appendChild(mpath)
  elem.appendChild(animate)

  try {
    const ani = animate as any
    ani.beginElement()
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
