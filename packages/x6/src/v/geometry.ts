import { scale } from './transform'
import { normalizePathData } from './path-normalize'
import { create, ensureId, isSVGGraphicsElement } from './ctor'
import { sample, convertToPath, getPointsFromSvgElement } from './path'
import { Point, Line, Rectangle, Polyline, Ellipse, Path } from '../geometry'
import {
  transformRect,
  createSVGPoint,
  createSVGMatrix,
  decomposeMatrix,
  createSVGTransform,
  matrixToTransformString,
} from './matrix'

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
  return transformRect(box, matrix)
}

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
    return transformRect(outputBBox, matrix)
  }

  {
    const children = create(elem).children()
    const n = children.length

    if (n === 0) {
      return getBBox(elem, { target })
    }

    if (!target) {
      target = elem // tslint:disable-line
    }

    for (let i = 0; i < n; i += 1) {
      const child = children[i]
      let childBBox

      if (child.children().length === 0) {
        childBBox = getBBox(child.node, { target })
      } else {
        // if child is a group element, enter it with a recursive call
        childBBox = getBBox(child.node, { target, recursive: true })
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
    resetRotation.setRotate(-rectMatrixComponents.rotation, center.x, center.y)
    const rect = transformRect(gRect, resetRotation.matrix.multiply(rectMatrix))

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
  elem.setAttribute('transform', '')
  const bbox = getBBox(elem, { target }).scale(s.sx, s.sy)

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

  // 3. Translate to the `position` + the offset (half my width)
  //    towards the `reference` point.
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
  path: SVGPathElement,
) {
  const id = ensureId(path)
  const animate = create('animateMotion', attrs).node as SVGAnimationElement
  const mpath = create('mpath', { 'xlink:href': `#${id}` }).node

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
