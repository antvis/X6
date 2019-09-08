import { DrawMarkerOptions } from '.'

export function oval({
  canvas,
  pe,
  unitX,
  unitY,
  size,
  filled,
}: DrawMarkerOptions) {

  const a = size / 2

  const pt = pe.clone()
  pe.x -= unitX * a
  pe.y -= unitY * a

  return function () {
    canvas.ellipse(pt.x - a, pt.y - a, size, size)

    if (filled) {
      canvas.fillAndStroke()
    } else {
      canvas.stroke()
    }
  }
}
