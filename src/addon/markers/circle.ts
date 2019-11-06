import { registerMarker, DrawMarkerOptions } from '../../marker'

function circleMarker(
  { c, pe, unitX, unitY, size, sw, filled }: DrawMarkerOptions,
) {
  const pt = pe.clone()

  size = size + sw // tslint:disable-line

  pe.x -= unitX * (2 * size + sw)
  pe.y -= unitY * (2 * size + sw)

  unitX = unitX * (size + sw) // tslint:disable-line
  unitY = unitY * (size + sw) // tslint:disable-line

  return () => {
    c.ellipse(pt.x - unitX - size, pt.y - unitY - size, 2 * size, 2 * size)
    if (filled) {
      c.fillAndStroke()
    } else {
      c.stroke()
    }
  }
}

registerMarker('circle', circleMarker)
registerMarker('circlePlus', (options: DrawMarkerOptions) => {
  const { c, pe, unitX, unitY, size, sw } = options

  const pt = pe.clone()
  const fn = circleMarker({ ...options, filled: false })
  const nx = unitX * (size + 2 * sw) // (size + sw + 1);
  const ny = unitY * (size + 2 * sw) // (size + sw + 1);

  return () => {
    fn()
    c.begin()
    c.moveTo(pt.x - unitX * (sw), pt.y - unitY * (sw))
    c.lineTo(pt.x - 2 * nx + unitX * (sw), pt.y - 2 * ny + unitY * (sw))
    c.moveTo(pt.x - nx - ny + unitY * sw, pt.y - ny + nx - unitX * sw)
    c.lineTo(pt.x + ny - nx - unitY * sw, pt.y - ny - nx + unitX * sw)
    c.stroke()
  }
})

registerMarker('halfCircle', ({ c, pe, unitX, unitY, size, sw }) => {
  const offsetX = unitX * (size + sw + 1)
  const offsetY = unitY * (size + sw + 1)

  const pt = pe.clone()

  pe.x -= offsetX
  pe.y -= offsetY

  return () => {
    c.begin()
    c.moveTo(pt.x - offsetY, pt.y + offsetX)
    c.quadTo(pe.x - offsetY, pe.y + offsetX, pe.x, pe.y)
    c.quadTo(pe.x + offsetY, pe.y - offsetX, pt.x + offsetY, pt.y - offsetX)
    c.stroke()
  }
})
