import { createSvgElement } from './elem'
import { Angle, Point, Line, Rectangle, Polyline } from '../geometry'

const svgDocument = createSvgElement('svg') as SVGSVGElement
const transformRegex = /(\w+)\(([^,)]+),?([^)]+)?\)/gi
const transformSeparatorRegex = /[ ,]+/
const transformationListRegex = /^(\w+)\((.*)\)/

export interface MatrixLike {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
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

export function createSVGPoint(x: number, y: number) {
  const p = svgDocument.createSVGPoint()
  p.x = x
  p.y = y
  return p
}

export function createSVGMatrix(matrix?: DOMMatrix | MatrixLike | null) {
  const ret = svgDocument.createSVGMatrix()
  if (matrix != null) {
    const source = matrix as any
    const target = ret as any
    for (const key in source) {
      target[key] = source[key]
    }
  }
  return ret
}

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
    value: transform || '',
    translate: {
      tx: translate && translate[0] ? parseInt(translate[0] as string, 10) : 0,
      ty: translate && translate[1] ? parseInt(translate[1] as string, 10) : 0,
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

export function matrixToScale(matrix: DOMMatrix | MatrixLike): Scale {
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

export function matrixToRotate(matrix: DOMMatrix | MatrixLike): Rotate {
  let p = { x: 0, y: 1 }
  if (matrix) {
    p = deltaTransformPoint(matrix, p)
  }

  return {
    angle: Angle.normalize(Angle.toDeg(Math.atan2(p.y, p.x)) - 90),
  }
}

export function matrixToTranslate(matrix: DOMMatrix | MatrixLike): Translate {
  return {
    tx: (matrix && matrix.e) || 0,
    ty: (matrix && matrix.f) || 0,
  }
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

export function transformPoint(p: Point | Point.PointLike, matrix: DOMMatrix) {
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
  let points = p instanceof Polyline ? p.points : p
  if (!Array.isArray(points)) {
    points = []
  }

  return new Polyline(points.map(p => transformPoint(p, matrix)))
}

export function transformRect(
  rect: Rectangle | Rectangle.RectangleLike,
  matrix: DOMMatrix,
) {
  const p = svgDocument.createSVGPoint()

  p.x = rect.x
  p.y = rect.y
  const corner1 = p.matrixTransform(matrix)

  p.x = rect.x + rect.width
  p.y = rect.y
  const corner2 = p.matrixTransform(matrix)

  p.x = rect.x + rect.width
  p.y = rect.y + rect.height
  const corner3 = p.matrixTransform(matrix)

  p.x = rect.x
  p.y = rect.y + rect.height
  const corner4 = p.matrixTransform(matrix)

  const minX = Math.min(corner1.x, corner2.x, corner3.x, corner4.x)
  const maxX = Math.max(corner1.x, corner2.x, corner3.x, corner4.x)
  const minY = Math.min(corner1.y, corner2.y, corner3.y, corner4.y)
  const maxY = Math.max(corner1.y, corner2.y, corner3.y, corner4.y)

  return new Rectangle(minX, minY, maxX - minX, maxY - minY)
}
