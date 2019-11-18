import { Shape } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { registerShape } from '../../core'

export class UmlActorShape extends Shape {
  drawBackground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    c.translate(x, y)

    // Head
    c.ellipse(w / 4, 0, w / 2, h / 4)
    c.fillAndStroke()

    c.begin()
    c.moveTo(w / 2, h / 4)
    c.lineTo(w / 2, 2 * h / 3)

    // Arms
    c.moveTo(w / 2, h / 3)
    c.lineTo(0, h / 3)
    c.moveTo(w / 2, h / 3)
    c.lineTo(w, h / 3)

    // Legs
    c.moveTo(w / 2, 2 * h / 3)
    c.lineTo(0, h)
    c.moveTo(w / 2, 2 * h / 3)
    c.lineTo(w, h)
    c.end()

    c.stroke()
  }
}

registerShape('umlActor', UmlActorShape)
