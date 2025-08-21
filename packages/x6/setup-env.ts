import '@testing-library/jest-dom'

declare global {
  interface Window {
    ResizeObserver: any
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

function createSVGMatrixMock(values?: Partial<DOMMatrix>) {
  const matrix: any = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
    ...values,
    multiply(other: any) {
      return createSVGMatrixMock({
        a: this.a * other.a + this.c * other.b,
        b: this.b * other.a + this.d * other.b,
        c: this.a * other.c + this.c * other.d,
        d: this.b * other.c + this.d * other.d,
        e: this.a * other.e + this.c * other.f + this.e,
        f: this.b * other.e + this.d * other.f + this.f,
      })
    },
    inverse() {
      return createSVGMatrixMock()
    },
    translate(x: number, y: number) {
      return createSVGMatrixMock({ ...this, e: this.e + x, f: this.f + y })
    },
    scale(s: number) {
      return createSVGMatrixMock({ ...this, a: this.a * s, d: this.d * s })
    },
    rotate() {
      return createSVGMatrixMock()
    },
  }
  return matrix
}

;(SVGElement as any).prototype.getCTM = function () {
  return createSVGMatrixMock()
}
;(SVGElement as any).prototype.getScreenCTM = function () {
  return createSVGMatrixMock()
}
;(SVGElement as any).prototype.createSVGMatrix = function () {
  return createSVGMatrixMock()
}

if (!SVGSVGElement.prototype.createSVGPoint) {
  ;(SVGSVGElement as any).prototype.createSVGPoint = function () {
    return {
      x: 0,
      y: 0,
      matrixTransform(m: DOMMatrix): { x: number; y: number } {
        return {
          x: this.x * m.a + this.y * m.c + m.e,
          y: this.x * m.b + this.y * m.d + m.f,
        }
      },
    }
  }
}

// getBBox 根据属性返回
;(SVGElement as any).prototype.getBBox = function () {
  const width = Number(this.getAttribute('width')) || 100
  const height = Number(this.getAttribute('height')) || 100
  const x = Number(this.getAttribute('x')) || 0
  const y = Number(this.getAttribute('y')) || 0
  return { x, y, width, height }
}

if (!SVGSVGElement.prototype.createSVGPoint) {
  ;(SVGSVGElement as any).prototype.createSVGPoint = function () {
    return {
      x: 0,
      y: 0,
      matrixTransform: () => {
        return { x: this.x, y: this.y }
      },
    }
  }
}

// requestAnimationFrame
if (!(globalThis as any).requestAnimationFrame) {
  ;(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16)
  ;(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id)
}
