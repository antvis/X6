import { Path } from '../../../element/shape/path'
import { PathArray } from '../../../struct/path-array'
import { MorphablePathArray } from '../../morpher/morphable-path-array'
import { Morpher } from '../../morpher/morpher'
import { SVGAnimator } from '../svg'

@SVGPathAnimator.register('Path')
export class SVGPathAnimator extends SVGAnimator<SVGPathElement, Path> {
  plot(d: string): this
  plot(segments: Path.Segment[]): this
  plot(pathArray: PathArray): this
  plot(d: string | Path.Segment[] | PathArray) {
    if (this.retarget('plot', d)) {
      return this
    }

    const morpher = new Morpher<
      Path.Segment[],
      string | Path.Segment[] | PathArray,
      Path.Segment[]
    >(this.stepper)
      .type(MorphablePathArray)
      .to(d)

    this.queue<Path.Segment[]>(
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
