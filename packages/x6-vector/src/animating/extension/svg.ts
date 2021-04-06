import type { VectorElement } from '../../element'
import { Morpher } from '../morpher/morpher'
import { Morphable } from '../morpher/morphable'
import { MorphableUnitNumber } from '../morpher/morphable-unit-number'
import { HTMLAnimator } from './html'

@SVGAnimator.register('SVG')
export class SVGAnimator<
  TSVGElement extends SVGElement = SVGElement,
  TTarget extends VectorElement<TSVGElement> = VectorElement<TSVGElement>
> extends HTMLAnimator<TSVGElement, TTarget> {
  x(x: number | string) {
    return this.queueNumber('x', x)
  }

  y(y: number | string) {
    return this.queueNumber('y', y)
  }

  move(x: number | string = 0, y: number | string = 0) {
    return this.x(x).y(y)
  }

  dx(x: number | string) {
    return this.queueDelta('x', x)
  }

  dy(y: number | string) {
    return this.queueDelta('y', y)
  }

  dmove(x: number | string = 0, y: number | string = 0) {
    return this.dx(x).dy(y)
  }

  cx(x: number | string) {
    return this.queueNumber('cx', x)
  }

  cy(y: number | string) {
    return this.queueNumber('cy', y)
  }

  center(x: number | string = 0, y: number | string = 0) {
    return this.cx(x).cy(y)
  }

  width(width: number | string) {
    return this.queueNumber('width', width)
  }

  height(height: number | string) {
    return this.queueNumber('height', height)
  }

  size(width?: number | string, height?: number | string) {
    if (width == null && height == null) {
      return this
    }

    let w = MorphableUnitNumber.toNumber(width!)
    let h = MorphableUnitNumber.toNumber(height!)

    if (width == null || height == null) {
      const box = this.target.bbox()

      if (!width) {
        w = (box.width / box.height) * h
      }

      if (!height) {
        h = (box.height / box.width) * w
      }
    }

    return this.width(w).height(h)
  }

  protected queueDelta(method: 'x' | 'y', to: number | string) {
    if (this.retarget(method, to)) {
      return this
    }

    const morpher = new Morpher<number[], number | string, number>(
      this.stepper,
    ).to(to)
    let from: number
    this.queue<string | number>(
      (animator) => {
        from = animator.element()[method]()
        morpher.from(from)
        morpher.to(from + MorphableUnitNumber.toNumber(to))
      },
      (animator, pos) => {
        animator.element()[method](morpher.at(pos))
        return morpher.done()
      },
      (animator, newTo) => {
        morpher.to(from + MorphableUnitNumber.toNumber(newTo))
      },
    )

    this.remember(method, morpher)
    return this
  }

  protected queueNumber(
    method: 'x' | 'y' | 'cx' | 'cy' | 'width' | 'height' | 'leading',
    value: number | string,
  ) {
    return this.queueObject(method, new MorphableUnitNumber(value))
  }

  protected queueObject(method: string, to: Morphable<any[], any>) {
    if (this.retarget(method, to)) {
      return this
    }

    const morpher = new Morpher<any[], any, any>(this.stepper).to(to)
    this.queue<any>(
      (animator) => {
        morpher.from(animator.element()[method as 'x']())
      },
      (animator, pos) => {
        animator.element()[method as 'x'](morpher.at(pos))
        return morpher.done()
      },
    )

    this.remember(method, morpher)

    return this
  }
}
