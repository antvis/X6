import { FEBase } from '../fe-base/fe-base'
import { SVGFEConvolveMatrixAttributes, In, EdgeMode } from './types'

@FEConvolveMatrix.register('FeConvolveMatrix')
export class FEConvolveMatrix extends FEBase<SVGFEConvolveMatrixElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  edgeMode(): EdgeMode
  edgeMode(mode: EdgeMode | null): this
  edgeMode(mode?: EdgeMode | null) {
    return this.attr('edgeMode', mode)
  }

  targetX(): number
  targetX(x: number | null): this
  targetX(x?: number | null) {
    return this.attr('targetX', x)
  }

  targetY(): number
  targetY(y: number | null): this
  targetY(y?: number | null) {
    return this.attr('targetY', y)
  }

  order(): number
  order(order: number | null): this
  order(order?: number | null) {
    return this.attr('order', order)
  }

  divisor(): number
  divisor(divisor: number | null): this
  divisor(divisor?: number | null) {
    return this.attr('divisor', divisor)
  }

  bias(): number
  bias(bias: number | null): this
  bias(bias?: number | null) {
    return this.attr('bias', bias)
  }

  kernelMatrix(): string
  kernelMatrix(matrix: string | null): this
  kernelMatrix(matrix?: string | null) {
    return this.attr('kernelMatrix', matrix)
  }

  kernelUnitLength(): number
  kernelUnitLength(len: number | null): this
  kernelUnitLength(len?: number | null) {
    return this.attr('kernelUnitLength', len)
  }

  preserveAlpha(): boolean
  preserveAlpha(preserveAlpha: boolean | null): this
  preserveAlpha(preserveAlpha?: boolean | null) {
    return this.attr('preserveAlpha', preserveAlpha)
  }
}

export namespace FEConvolveMatrix {
  export function create<Attributes extends SVGFEConvolveMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEConvolveMatrix()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
