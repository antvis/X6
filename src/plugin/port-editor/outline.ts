import type { Point } from './type'

const GEOMETRY_SELECTOR = 'rect,circle,ellipse,path,polygon,polyline'
const EXCLUDE_SELECTOR =
  '.x6-port, .x6-port-label, .x6-tools, .x6-cell-tools, foreignObject'

interface Sampler {
  length: number
  samples: Point[]
}

const samplerCache = new WeakMap<SVGGeometryElement, Sampler>()

export interface OutlineHit {
  /** Node-local coordinates — exactly the space `ports.items[].args` is resolved in. */
  local: Point
  /** Client (viewport) pixels — used to place overlay markers. */
  client: Point
  /** Distance from the pointer to the outline, in client pixels. */
  distance: number
  element: SVGGeometryElement
}

/**
 * Collect the geometric elements that make up a node's visible outline.
 *
 * When `selector` is given the first match wins; otherwise every geometric shape in the
 * markup is considered, which is what makes custom (non-rectangular) symbols work: the
 * nearest shape to the pointer provides the pin location.
 */
export function collectOutlineElements(
  container: Element,
  selector?: string,
): SVGGeometryElement[] {
  const found: SVGGeometryElement[] = []

  const usable = (el: Element) => {
    if (el.closest(EXCLUDE_SELECTOR)) return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }

  if (selector) {
    container.querySelectorAll(selector).forEach((el) => {
      if (usable(el)) found.push(el as SVGGeometryElement)
    })
    if (found.length > 0) return found
  }

  container.querySelectorAll(GEOMETRY_SELECTOR).forEach((el) => {
    if (usable(el)) found.push(el as SVGGeometryElement)
  })

  return found
}

function getSampler(el: SVGGeometryElement, sampleCount: number): Sampler {
  let length = 0
  try {
    length = el.getTotalLength()
  } catch {
    length = 0
  }

  const cached = samplerCache.get(el)
  if (
    cached &&
    cached.length === length &&
    (length === 0 || cached.samples.length > 0)
  ) {
    return cached
  }

  let samples: Point[] = []

  if (length > 0) {
    const count = Math.max(24, Math.min(sampleCount, Math.ceil(length / 2)))
    for (let i = 0; i <= count; i += 1) {
      const p = el.getPointAtLength((length * i) / count)
      samples.push({ x: p.x, y: p.y })
    }
  } else {
    // Fallback for engines/shapes without getTotalLength: walk the bounding box perimeter.
    try {
      const bbox = el.getBBox()
      const corners: Point[] = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
        { x: bbox.x, y: bbox.y + bbox.height },
      ]
      samples = corners.concat([corners[0]])
    } catch {
      // No geometry support at all (jsdom and friends): let the caller treat this as a miss.
      samples = []
    }
  }

  const sampler: Sampler = { length, samples }
  samplerCache.set(el, sampler)
  return sampler
}

function transform(m: DOMMatrix, x: number, y: number): Point {
  if (typeof DOMPoint === 'function') {
    const p = new DOMPoint(x, y).matrixTransform(m)
    return { x: p.x, y: p.y }
  }
  // Environments without DOMPoint (jsdom, older webviews): apply the 2D matrix by hand.
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }
}

function closestOnSegment(a: Point, b: Point, p: Point): Point {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return { x: a.x, y: a.y }
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  return { x: a.x + t * dx, y: a.y + t * dy }
}

function nearestOnPolyline(
  samples: Point[],
  p: Point,
): { point: Point; distance: number } {
  let bestIdx = 0
  let bestDistSq = Infinity

  for (let i = 0; i < samples.length; i += 1) {
    const dx = samples[i].x - p.x
    const dy = samples[i].y - p.y
    const d = dx * dx + dy * dy
    if (d < bestDistSq) {
      bestDistSq = d
      bestIdx = i
    }
  }

  let best = samples[bestIdx]
  let bestDistance = Math.sqrt(bestDistSq)
  const neighbours = [
    samples[(bestIdx - 1 + samples.length) % samples.length],
    samples[(bestIdx + 1) % samples.length],
  ]

  neighbours.forEach((other) => {
    const candidate = closestOnSegment(samples[bestIdx], other, p)
    const distance = Math.hypot(candidate.x - p.x, candidate.y - p.y)
    if (distance < bestDistance) {
      best = candidate
      bestDistance = distance
    }
  })

  return { point: best, distance: bestDistance }
}

/**
 * Project a client-space pointer position onto the node outline.
 *
 * Pan, zoom and node rotation are all handled by the SVG CTM chain, so the result is valid
 * whatever transform the graph or the node currently has.
 */
export function findNearestOutlinePoint(
  nodeContainer: SVGGraphicsElement,
  elements: SVGGeometryElement[],
  clientX: number,
  clientY: number,
  sampleCount = 240,
): OutlineHit | null {
  if (elements.length === 0) return null

  const svgRoot = nodeContainer.ownerSVGElement
  if (!svgRoot) return null
  const rootScreenCTM = svgRoot.getScreenCTM()
  if (!rootScreenCTM) return null

  // pointer in SVG root user space
  const pointerSvg = transform(rootScreenCTM.inverse(), clientX, clientY)

  let best: {
    distance: number
    svg: Point
    element: SVGGeometryElement
  } | null = null

  elements.forEach((el) => {
    const elCTM = (el as SVGGraphicsElement).getCTM()
    if (!elCTM) return
    const sampler = getSampler(el, sampleCount)
    if (sampler.samples.length === 0) return

    // compare in the element's own user space, then map the winner back
    const pointerEl = transform(elCTM.inverse(), pointerSvg.x, pointerSvg.y)
    const local = nearestOnPolyline(sampler.samples, pointerEl)
    const svgPoint = transform(elCTM, local.point.x, local.point.y)
    const distance = Math.hypot(
      svgPoint.x - pointerSvg.x,
      svgPoint.y - pointerSvg.y,
    )

    if (!best || distance < best.distance) {
      best = { distance, svg: svgPoint, element: el }
    }
  })

  if (!best) return null

  const winner = best as {
    distance: number
    svg: Point
    element: SVGGeometryElement
  }
  const nodeCTM = nodeContainer.getCTM()

  return {
    local: nodeCTM
      ? transform(nodeCTM.inverse(), winner.svg.x, winner.svg.y)
      : winner.svg,
    client: transform(rootScreenCTM, winner.svg.x, winner.svg.y),
    distance: winner.distance,
    element: winner.element,
  }
}
