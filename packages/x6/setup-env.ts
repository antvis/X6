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

// SVG.getBBox polyfill：X6 在布局/选框时可能读取
;(SVGElement as any).prototype.getBBox = function () {
  const width = Number(this.getAttribute('width')) || 100
  const height = Number(this.getAttribute('height')) || 100
  return { x: 0, y: 0, width, height }
}

function createSVGMatrixMock() {
  const matrix: any = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
    multiply() {
      return createSVGMatrixMock()
    },
    inverse() {
      return createSVGMatrixMock()
    },
    translate() {
      return createSVGMatrixMock()
    },
    scale() {
      return createSVGMatrixMock()
    },
    rotate() {
      return createSVGMatrixMock()
    },
    flipX() {
      return createSVGMatrixMock()
    },
    flipY() {
      return createSVGMatrixMock()
    },
    skewX() {
      return createSVGMatrixMock()
    },
    skewY() {
      return createSVGMatrixMock()
    },
  }
  return matrix
}
;(SVGElement as any).prototype.createSVGMatrix = function () {
  return createSVGMatrixMock()
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
