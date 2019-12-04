import { Marker } from '.'

export function createClassicMarker(widthFactor: number = 2) {
  return function({
    c,
    name,
    pe,
    unitX: cos,
    unitY: sin,
    size,
    sw,
    filled,
  }: Marker.CreateMarkerOptions) {
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

    const f = name !== 'classic' && name !== 'classicThin' ? 1 : 3 / 4

    // update the end point on edge
    pe.x += -unitX * f - endOffsetX
    pe.y += -unitY * f - endOffsetY

    return function() {
      c.begin()
      c.moveTo(pt.x, pt.y)
      c.lineTo(
        pt.x - unitX - unitY / widthFactor,
        pt.y - unitY + unitX / widthFactor,
      )

      if (name === 'classic' || name === 'classicThin') {
        c.lineTo(pt.x - (unitX * 3) / 4, pt.y - (unitY * 3) / 4)
      }

      c.lineTo(
        pt.x + unitY / widthFactor - unitX,
        pt.y - unitY - unitX / widthFactor,
      )

      c.close()

      if (filled) {
        c.fillAndStroke()
      } else {
        c.stroke()
      }
    }
  }
}
