import { Marker } from '.'

export function diamond({
  c,
  name,
  pe,
  unitX: cos,
  unitY: sin,
  size,
  sw,
  filled,
}: Marker.DrawMarkerOptions) {
  // The angle of the forward facing arrow sides against the x axis is
  // 45 degrees, 1/sin(45) = 1.4142 / 2 = 0.7071 ( / 2 allows for
  // only half the strokewidth is processed ). Or 0.9862 for thin diamond.
  // Note these values and the tk variable below are dependent, update
  // both together (saves trig hard coding it).
  const swFactor = name === 'diamond' ? 0.7071 : 0.9862

  const endOffsetX = cos * sw * swFactor
  const endOffsetY = sin * sw * swFactor
  const unitX = cos * (size + sw)
  const unitY = sin * (size + sw)

  const pt = pe.clone()
  pt.x -= endOffsetX
  pt.y -= endOffsetY

  pe.x += -unitX - endOffsetX
  pe.y += -unitY - endOffsetY

  // thickness factor for diamond
  const tk = name === 'diamond' ? 2 : 3.4

  return function() {
    c.begin()
    c.moveTo(pt.x, pt.y)
    c.lineTo(pt.x - unitX / 2 - unitY / tk, pt.y + unitX / tk - unitY / 2)
    c.lineTo(pt.x - unitX, pt.y - unitY)
    c.lineTo(pt.x - unitX / 2 + unitY / tk, pt.y - unitY / 2 - unitX / tk)
    c.close()

    if (filled) {
      c.fillAndStroke()
    } else {
      c.stroke()
    }
  }
}
