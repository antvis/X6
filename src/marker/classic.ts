import { MarkerNames } from '../struct'
import { DrawMarkerOptions } from '.'

export function createClassicMarker(widthFactor: number = 2) {
  return function ({
    canvas,
    type,
    pe,
    unitX,
    unitY,
    size,
    strokeWidth,
    filled,
  }: DrawMarkerOptions) {

    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    const endOffsetX = unitX * strokeWidth * 1.118
    const endOffsetY = unitY * strokeWidth * 1.118

    unitX = unitX * (size + strokeWidth) // tslint:disable-line
    unitY = unitY * (size + strokeWidth) // tslint:disable-line

    const pt = pe.clone()
    pt.x -= endOffsetX
    pt.y -= endOffsetY

    const f = (
      type !== MarkerNames.classic &&
      type !== MarkerNames.classicThin
    ) ? 1 : 3 / 4

    // update the end point on edge
    pe.x += -unitX * f - endOffsetX
    pe.y += -unitY * f - endOffsetY

    return function () {
      canvas.begin()
      canvas.moveTo(pt.x, pt.y)
      canvas.lineTo(
        pt.x - unitX - unitY / widthFactor,
        pt.y - unitY + unitX / widthFactor,
      )

      if (
        type === MarkerNames.classic ||
        type === MarkerNames.classicThin
      ) {
        canvas.lineTo(pt.x - unitX * 3 / 4, pt.y - unitY * 3 / 4)
      }

      canvas.lineTo(
        pt.x + unitY / widthFactor - unitX,
        pt.y - unitY - unitX / widthFactor,
      )

      canvas.close()

      if (filled) {
        canvas.fillAndStroke()
      } else {
        canvas.stroke()
      }
    }
  }
}
