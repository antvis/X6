import '@testing-library/jest-dom'
import { createCanvas, DOMMatrix } from '@napi-rs/canvas'

declare global {
  interface Window {
    ResizeObserver: any
    SVGRectElement: typeof SVGRectElement
  }
}

global.DOMMatrix = DOMMatrix as any

if (!(SVGSVGElement.prototype as any).createSVGMatrix) {
  ;(SVGSVGElement.prototype as any).createSVGMatrix = function () {
    return new (global as any).DOMMatrix()
  }
}

// 给 DOMMatrix 添加 rotate/translate/scale 方法（返回新矩阵）
if (!(DOMMatrix.prototype as any).rotate) {
  DOMMatrix.prototype.rotate = function (angle: number) {
    const m = this.clone()
    m.rotateSelf(angle)
    return m
  }
}

if (!(DOMMatrix.prototype as any).translate) {
  DOMMatrix.prototype.translate = function (x: number, y: number) {
    const m = this.clone()
    m.translateSelf(x, y)
    return m
  }
}

if (!(DOMMatrix.prototype as any).scale) {
  DOMMatrix.prototype.scale = function (s: number) {
    const m = this.clone()
    m.scaleSelf(s)
    return m
  }
}

if (!(DOMMatrix.prototype as any).scaleNonUniform) {
  // @ts-ignore
  DOMMatrix.prototype.scaleNonUniform = function (sx: number, sy: number) {
    return this.scale(sx, sy)
  }
}

// ResizeObserver polyfill
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(globalThis as any).ResizeObserver = RO

// PointerEvent polyfill（jsdom 没有原生）
class PE extends MouseEvent {
  pointerId: number

  constructor(type: string, params: any = {}) {
    super(type, params)
    this.pointerId = params.pointerId ?? 1

    // 需要显式 defineProperty，因为 MouseEvent 的 clientX/clientY 是只读的
    if (params.clientX !== undefined) {
      Object.defineProperty(this, 'clientX', { value: params.clientX })
      Object.defineProperty(this, 'pageX', { value: params.clientX })
    }
    if (params.clientY !== undefined) {
      Object.defineProperty(this, 'clientY', { value: params.clientY })
      Object.defineProperty(this, 'pageY', { value: params.clientY })
    }
  }
}
;(globalThis as any).PointerEvent = PE

export function createSVGMatrixMock(source?: Partial<DOMMatrix>) {
  class SVGMatrixMock {
    a = 1
    b = 0
    c = 0
    d = 1
    e = 0
    f = 0

    constructor(init?: Partial<DOMMatrix>) {
      if (init) {
        if (init.a != null) this.a = init.a
        if (init.b != null) this.b = init.b
        if (init.c != null) this.c = init.c
        if (init.d != null) this.d = init.d
        if (init.e != null) this.e = init.e
        if (init.f != null) this.f = init.f
      }
    }

    clone() {
      return new SVGMatrixMock({
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f,
      })
    }

    multiply(other: SVGMatrixMock) {
      const m = new SVGMatrixMock()
      m.a = this.a * other.a + this.c * other.b
      m.b = this.b * other.a + this.d * other.b
      m.c = this.a * other.c + this.c * other.d
      m.d = this.b * other.c + this.d * other.d
      m.e = this.a * other.e + this.c * other.f + this.e
      m.f = this.b * other.e + this.d * other.f + this.f
      return m
    }

    inverse() {
      const det = this.a * this.d - this.b * this.c
      if (det === 0) throw new Error('Matrix not invertible')
      const m = new SVGMatrixMock()
      m.a = this.d / det
      m.b = -this.b / det
      m.c = -this.c / det
      m.d = this.a / det
      m.e = (this.c * this.f - this.d * this.e) / det
      m.f = (this.b * this.e - this.a * this.f) / det
      return m
    }

    translate(tx: number, ty: number = 0) {
      return this.multiply(
        new SVGMatrixMock({ a: 1, b: 0, c: 0, d: 1, e: tx, f: ty }),
      )
    }

    scale(sx: number, sy?: number) {
      return this.multiply(
        new SVGMatrixMock({ a: sx, b: 0, c: 0, d: sy ?? sx, e: 0, f: 0 }),
      )
    }

    scaleNonUniform(sx: number, sy: number) {
      return this.scale(sx, sy)
    }

    rotate(angle: number) {
      const rad = (angle * Math.PI) / 180
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)
      return this.multiply(
        new SVGMatrixMock({ a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 }),
      )
    }

    rotateFromVector(x: number, y: number) {
      const angle = (Math.atan2(y, x) * 180) / Math.PI
      return this.rotate(angle)
    }

    skewX(angle: number) {
      const rad = (angle * Math.PI) / 180
      return this.multiply(
        new SVGMatrixMock({ a: 1, b: 0, c: Math.tan(rad), d: 1, e: 0, f: 0 }),
      )
    }

    skewY(angle: number) {
      const rad = (angle * Math.PI) / 180
      return this.multiply(
        new SVGMatrixMock({ a: 1, b: Math.tan(rad), c: 0, d: 1, e: 0, f: 0 }),
      )
    }
  }

  return new SVGMatrixMock(source)
}

;(SVGElement as any).prototype.__tx = [0, 0]
;(SVGElement as any).prototype.translate = function (x: number, y: number) {
  this.__tx = this.__tx || [0, 0]
  this.__tx[0] += x // 仅更新自定义的__tx属性
  this.__tx[1] += y
  // 同步更新transform属性
  this.setAttribute('transform', `translate(${this.__tx[0]},${this.__tx[1]})`)
}
;(SVGElement as any).prototype.getCTM = function () {
  const transform = this.getAttribute('transform') || ''
  let matrix = createSVGMatrixMock({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })

  const regex = /(\w+)\(([^)]+)\)/g
  let match
  while ((match = regex.exec(transform))) {
    const fn = match[1]
    const args = match[2].split(/[\s,]+/).map(Number)

    switch (fn) {
      case 'translate': {
        const [tx, ty = 0] = args
        matrix = matrix.multiply(
          createSVGMatrixMock({ a: 1, b: 0, c: 0, d: 1, e: tx, f: ty }),
        )
        break
      }
      case 'scale': {
        const [sx, sy = sx] = args
        matrix = matrix.multiply(
          createSVGMatrixMock({ a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 }),
        )
        break
      }
      case 'rotate': {
        const [angle, cx, cy] = args
        const rad = (angle * Math.PI) / 180
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)

        if (cx != null && cy != null) {
          // 平移到原点 -> 旋转 -> 平移回去
          const translate1 = createSVGMatrixMock({
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: -cx,
            f: -cy,
          })
          const rotateM = createSVGMatrixMock({
            a: cos,
            b: sin,
            c: -sin,
            d: cos,
            e: 0,
            f: 0,
          })
          const translate2 = createSVGMatrixMock({
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: cx,
            f: cy,
          })
          matrix = matrix.multiply(
            translate2.multiply(rotateM).multiply(translate1),
          )
        } else {
          // 普通旋转
          matrix = matrix.multiply(
            createSVGMatrixMock({
              a: cos,
              b: sin,
              c: -sin,
              d: cos,
              e: 0,
              f: 0,
            }),
          )
        }
        break
      }
      case 'skewX': {
        const [angle] = args
        const rad = (angle * Math.PI) / 180
        matrix = matrix.multiply(
          createSVGMatrixMock({
            a: 1,
            b: 0,
            c: Math.tan(rad),
            d: 1,
            e: 0,
            f: 0,
          }),
        )
        break
      }
      case 'skewY': {
        const [angle] = args
        const rad = (angle * Math.PI) / 180
        matrix = matrix.multiply(
          createSVGMatrixMock({
            a: 1,
            b: Math.tan(rad),
            c: 0,
            d: 1,
            e: 0,
            f: 0,
          }),
        )
        break
      }
      case 'matrix': {
        const [a, b, c, d, e, f] = args
        matrix = matrix.multiply(createSVGMatrixMock({ a, b, c, d, e, f }))
        break
      }
    }
  }

  return matrix
}
;(SVGElement as any).prototype.getScreenCTM = function () {
  return this.getCTM()
}
;(SVGElement as any).prototype.createSVGMatrix = () => createSVGMatrixMock()

if (!SVGSVGElement.prototype.createSVGPoint) {
  ;(SVGSVGElement as any).prototype.createSVGPoint = () => ({
    x: 0,
    y: 0,
    matrixTransform(m: DOMMatrix): { x: number; y: number } {
      return {
        x: this.x * m.a + this.y * m.c + m.e,
        y: this.x * m.b + this.y * m.d + m.f,
      }
    },
  })
}
// getBBox 根据属性返回
;(SVGElement as any).prototype.getBBox = function () {
  const width = Number(this.getAttribute('width')) || 100
  const height = Number(this.getAttribute('height')) || 100
  const x = Number(this.getAttribute('x')) || 0
  const y = Number(this.getAttribute('y')) || 0
  return { x, y, width, height }
}

// requestAnimationFrame
if (!(globalThis as any).requestAnimationFrame) {
  ;(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16)
  ;(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id)
}

const originalCreateElement = document.createElement
Object.defineProperty(document, 'createElement', {
  value: (tagName: string) => {
    if (tagName === 'canvas') {
      return createCanvas(200, 200)
    }
    return originalCreateElement.call(document, tagName)
  },
})

class SVGTransformMock {
  static SVG_TRANSFORM_MATRIX = 1
  type = SVGTransformMock.SVG_TRANSFORM_MATRIX
  matrix: DOMMatrix
  angle = 0
  constructor(matrix: DOMMatrix) {
    this.matrix = matrix
  }
  setMatrix(m: DOMMatrix) {
    this.matrix = m
  }
}
;(global as any).SVGTransform = SVGTransformMock

if (!(SVGSVGElement.prototype as any).createSVGTransformFromMatrix) {
  ;(SVGSVGElement.prototype as any).createSVGTransformFromMatrix = function (
    matrix: DOMMatrix,
  ) {
    return new (global as any).SVGTransform(matrix)
  }
}
