import { Box } from '../../struct/box'
import { UnitNumber } from '../../struct/unit-number'
import { Vector } from '../vector/vector'
import { Referent } from '../container/referent'
import { Stop } from './stop'

export abstract class Gradient<
  TSVGGradientElement extends SVGGradientElement
> extends Referent<TSVGGradientElement> {
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

  bbox() {
    return new Box()
  }

  update(handler?: Gradient.Update<TSVGGradientElement> | null) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  remove() {
    this.targets().forEach((target) => target.attr('fill', null))
    return super.remove()
  }

  targets<TVector extends Vector>(): TVector[] {
    return this.findTargets<TVector>('fill')
  }
}

export namespace Gradient {
  export type Update<TSVGGradientElement extends SVGGradientElement> = (
    this: Gradient<TSVGGradientElement>,
    gradient: Gradient<TSVGGradientElement>,
  ) => void
}
