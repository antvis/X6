import { Marker } from '.'

export function createOpenMarker(widthFactor: number = 2) {
  return ({
    c,
    pe,
    unitX: cos,
    unitY: sin,
    size,
    sw,
  }: Marker.DrawMarkerOptions) => {
    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    const endOffsetX = cos * sw * 1.118
    const endOffsetY = sin * sw * 1.118

    const unitX = cos * (size + sw)
    const unitY = sin * (size + sw)

    const pt = pe.clone()
    pt.x -= endOffsetX
    pt.y -= endOffsetY

    pe.x += -endOffsetX * 2
    pe.y += -endOffsetY * 2

    return function() {
      c.begin()
      c.moveTo(
        pt.x - unitX - unitY / widthFactor,
        pt.y - unitY + unitX / widthFactor
      )
      c.lineTo(pt.x, pt.y)
      c.lineTo(
        pt.x + unitY / widthFactor - unitX,
        pt.y - unitY - unitX / widthFactor
      )
      c.stroke()
    }
  }
}
