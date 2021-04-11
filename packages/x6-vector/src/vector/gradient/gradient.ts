import { Box } from '../../struct/box'
import { UnitNumber } from '../../struct/unit-number'
import { Vector } from '../vector/vector'
import { Container } from '../container/container'
import { Stop } from './stop'

export abstract class Gradient<
  TSVGGradientElement extends SVGGradientElement
> extends Container<TSVGGradientElement> {
  abstract from(x: number | string, y: number | string): this
  abstract to(x: number | string, y: number | string): this

  stop(
    offset?: number | string | UnitNumber,
    color?: string,
    opacity?: number | string | UnitNumber,
  ): Stop
  stop(options: Stop.Options): Stop
  stop(
    offset?: Stop.Options | number | string | UnitNumber,
    color?: string,
    opacity?: number | string | UnitNumber,
  ) {
    return new Stop().update(offset, color, opacity).appendTo(this)
  }

  update(handler?: Gradient.Update<TSVGGradientElement> | null) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  bbox() {
    return new Box()
  }

  targets<TVector extends Vector>() {
    return Gradient.find<TVector>(`svg [fill*="${this.id()}"]`)
  }

  url() {
    return `url("#${this.id()}")`
  }

  toString() {
    return this.url()
  }
}

export namespace Gradient {
  export type Update<TSVGGradientElement extends SVGGradientElement> = (
    this: Gradient<TSVGGradientElement>,
    gradient: Gradient<TSVGGradientElement>,
  ) => void
}
