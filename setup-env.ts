import "@testing-library/jest-dom";
import { createCanvas } from "@napi-rs/canvas";

declare global {
  interface Window {
    ResizeObserver: any;
    SVGRectElement: typeof SVGRectElement;
  }
}

// ResizeObserver polyfill
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = RO;

// PointerEvent polyfill（jsdom 没有原生）
class PE extends MouseEvent {
  pointerId: number;

  constructor(type: string, params: any = {}) {
    super(type, params);
    this.pointerId = params.pointerId ?? 1;

    // 需要显式 defineProperty，因为 MouseEvent 的 clientX/clientY 是只读的
    if (params.clientX !== undefined) {
      Object.defineProperty(this, "clientX", { value: params.clientX });
      Object.defineProperty(this, "pageX", { value: params.clientX });
    }
    if (params.clientY !== undefined) {
      Object.defineProperty(this, "clientY", { value: params.clientY });
      Object.defineProperty(this, "pageY", { value: params.clientY });
    }
  }
}
(globalThis as any).PointerEvent = PE;

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
      });
    },
    inverse() {
      const det = this.a * this.d - this.b * this.c;
      if (det === 0) throw new Error("Matrix is not invertible");
      return createSVGMatrixMock({
        a: this.d / det,
        b: -this.b / det,
        c: -this.c / det,
        d: this.a / det,
        e: (this.c * this.f - this.d * this.e) / det,
        f: (this.b * this.e - this.a * this.f) / det,
      });
    },
    translate(x: number, y: number) {
      return createSVGMatrixMock({ ...this, e: this.e + x, f: this.f + y });
    },
    scale(s: number) {
      return createSVGMatrixMock({ ...this, a: this.a * s, d: this.d * s });
    },
    rotate() {
      return createSVGMatrixMock();
    },
  };
  return matrix;
}

(SVGElement as any).prototype.__tx = [0, 0];
(SVGElement as any).prototype.translate = function (x: number, y: number) {
  this.__tx = this.__tx || [0, 0];
  this.__tx[0] += x; // 仅更新自定义的__tx属性
  this.__tx[1] += y;
  // 同步更新transform属性
  this.setAttribute("transform", `translate(${this.__tx[0]},${this.__tx[1]})`);
};
(SVGElement as any).prototype.getCTM = function () {
  let e = 0;
  let f = 0;
  let el = this as any;
  while (el && el.nodeName !== "svg") {
    if (el.__tx) {
      e += el.__tx[0];
      f += el.__tx[1];
    }
    el = el.parentNode;
  }
  return createSVGMatrixMock({ a: 1, b: 0, c: 0, d: 1, e, f });
};
(SVGElement as any).prototype.getScreenCTM = function () {
  return this.getCTM();
};
(SVGElement as any).prototype.createSVGMatrix = () => createSVGMatrixMock();

if (!SVGSVGElement.prototype.createSVGPoint) {
  (SVGSVGElement as any).prototype.createSVGPoint = () => ({
    x: 0,
    y: 0,
    matrixTransform(m: DOMMatrix): { x: number; y: number } {
      return {
        x: this.x * m.a + this.y * m.c + m.e,
        y: this.x * m.b + this.y * m.d + m.f,
      };
    },
  });
}
// getBBox 根据属性返回
(SVGElement as any).prototype.getBBox = function () {
  const width = Number(this.getAttribute("width")) || 100;
  const height = Number(this.getAttribute("height")) || 100;
  const x = Number(this.getAttribute("x")) || 0;
  const y = Number(this.getAttribute("y")) || 0;
  return { x, y, width, height };
};

// requestAnimationFrame
if (!(globalThis as any).requestAnimationFrame) {
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16);
  (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}

const originalCreateElement = document.createElement;
Object.defineProperty(document, "createElement", {
  value: (tagName: string) => {
    if (tagName === "canvas") {
      return createCanvas(200, 200);
    }
    return originalCreateElement.call(document, tagName);
  },
});
