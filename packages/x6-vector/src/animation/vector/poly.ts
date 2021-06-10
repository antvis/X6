import { Poly } from '../../vector/poly/poly'
import { MorphablePointArray } from '../../animating/morpher/point-array'
import { Morpher } from '../../animating/morpher/morpher'
import { SVGAnimator } from '../svg'

export class SVGPolyAnimator<
  TSVGElement extends SVGPolygonElement | SVGPolylineElement,
  TOwner extends Poly<TSVGElement> = Poly<TSVGElement>,
> extends SVGAnimator<TSVGElement, TOwner> {
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
