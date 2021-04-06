import { Line } from '../../../element/shape/line'
import { PointArray } from '../../../struct/point-array'
import { MorphablePointArray } from '../../morpher/morphable-point-array'
import { Morpher } from '../../morpher/morpher'
import { SVGAnimator } from '../svg'

@SVGLineAnimator.register('Line')
export class SVGLineAnimator extends SVGAnimator<SVGLineElement, Line> {
  plot(d: string): this
  plot(points: Line.Array | PointArray): this
  plot(x1: number, y1: number, x2: number, y2: number): this
  plot(
    x1: Line.Array | PointArray | number | string,
    y1?: number,
    x2?: number,
    y2?: number,
  ): this
  plot(
    x1: Line.Array | PointArray | number | string,
    y1?: number,
    x2?: number,
    y2?: number,
  ) {
    if (typeof x1 === 'number') {
      return this.plot([
        [x1, y1!],
        [x2!, y2!],
      ])
    }

    if (this.retarget('plot', x1)) {
      return this
    }

    const morpher = new Morpher<
      Line.Array,
      Line.Array | PointArray | string,
      Line.Array
    >(this.stepper)
      .type(MorphablePointArray)
      .to(x1)

    this.queue<Line.Array>(
      (animator) => {
        morpher.from(animator.element().toArray())
      },
      (animator, pos) => {
        animator.plot(morpher.at(pos))
        return morpher.done()
      },
    )
    this.remember('plot', morpher)
    return this
  }
}
