import { Point } from '../../../struct/point'
import { Viewbox } from '../../../element/container/container-viewbox'
import { Morpher } from '../../morpher/morpher'
import { MorphableBox } from '../../morpher/morphable-box'
import { SVGAnimator } from '../svg'

export class SVGViewboxAnimator<
  TSVGElement extends
    | SVGSVGElement
    | SVGSymbolElement
    | SVGPatternElement
    | SVGMarkerElement,
  TTarget extends Viewbox<TSVGElement> = Viewbox<TSVGElement>
> extends SVGAnimator<TSVGElement, TTarget> {
  zoom(level: number, point: Point.PointLike) {
    if (this.retarget('zoom', level, point)) {
      return this
    }
    const origin = { x: point.x, y: point.y }
    const morpher = new Morpher<[number], number, number>(this.stepper).to(
      level,
    )
    this.queue<number, Point.PointLike>(
      (animator) => {
        morpher.from(animator.element().zoom())
      },
      (animator, pos) => {
        animator.element().zoom(morpher.at(pos), origin)
        return morpher.done()
      },
      (animator, newLevel, newPoint) => {
        origin.x = newPoint.x
        origin.y = newPoint.y
        morpher.to(newLevel)
      },
    )
    this.remember('zoom', morpher)
    return this
  }

  viewbox(x: number, y: number, width: number, height: number) {
    return this.queueObject('viewbox', new MorphableBox(x, y, width, height))
  }
}
