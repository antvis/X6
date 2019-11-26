import { Marker } from '../../marker'

Marker.register('dash', (
  {
    c,
    pe,
    unitX,
    unitY,
    size,
    sw,
  },
) => {
  const nx = unitX * (size + sw + 1)
  const ny = unitY * (size + sw + 1)

  return () => {
    c.begin()
    c.moveTo(
      pe.x - nx / 2 - ny / 2,
      pe.y - ny / 2 + nx / 2,
    )
    c.lineTo(
      pe.x + ny / 2 - 3 * nx / 2,
      pe.y - 3 * ny / 2 - nx / 2,
    )
    c.stroke()
  }
})
