import { DrawMarkerOptions } from '.'

export function createOpenMarker(widthFactor: number = 2) {
  return ({
    canvas,
    pe,
    unitX,
    unitY,
    size,
    strokeWidth,
  }: DrawMarkerOptions) => {

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

    pe.x += -endOffsetX * 2
    pe.y += -endOffsetY * 2

    return function () {
      canvas.begin()
      canvas.moveTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor)
      canvas.lineTo(pt.x, pt.y)
      canvas.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor)
      canvas.stroke()
    }
  }
}
