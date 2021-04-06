import { Poly } from '../../../element/shape/poly'
import { MorphablePointArray } from '../../morpher/morphable-point-array'
import { Morpher } from '../../morpher/morpher'
import { SVGAnimator } from '../svg'

export class SVGPolyAnimator<
  TSVGElement extends SVGPolygonElement | SVGPolylineElement,
  TTarget extends Poly<TSVGElement> = Poly<TSVGElement>
> extends SVGAnimator<TSVGElement, TTarget> {
  plot(d: string): this
  plot(points: [number, number][]): this
  plot(points: string | [number, number][]): this
  plot(d: string | [number, number][]) {
    if (this.retarget('plot', d)) {
      return this
    }

    const morpher = new Morpher<
      [number, number][],
      string | [number, number][],
      [number, number][]
    >(this.stepper)
      .type(MorphablePointArray)
      .to(d)

    this.queue<[number, number][]>(
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
