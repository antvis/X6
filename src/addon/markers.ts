import { registerMarker, DrawMarkerOptions } from '../marker'

registerMarker('dash', ({
  c,
  pe,
  unitX,
  unitY,
  size,
  sw,
}) => {

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

registerMarker('cross', ({
  c,
  pe,
  unitX,
  unitY,
  size,
  sw,
}) => {

  const nx = unitX * (size + sw + 1)
  const ny = unitY * (size + sw + 1)

  return () => {
    c.begin()
    c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2)
    c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2)
    c.moveTo(pe.x - nx / 2 + ny / 2, pe.y - ny / 2 - nx / 2)
    c.lineTo(pe.x - ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 + nx / 2)
    c.stroke()
  }
})

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

registerMarker('async', (
  { c, pe, unitX, unitY, size, isSource, sw, filled },
) => {

  // The angle of the forward facing arrow sides against the x axis is
  // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
  // only half the strokewidth is processed ).
  const endOffsetX = unitX * sw * 1.118
  const endOffsetY = unitY * sw * 1.118

  unitX = unitX * (size + sw) // tslint:disable-line
  unitY = unitY * (size + sw) // tslint:disable-line

  const pt = pe.clone()
  pt.x -= endOffsetX
  pt.y -= endOffsetY

  const f = 1
  pe.x += -unitX * f - endOffsetX
  pe.y += -unitY * f - endOffsetY

  return () => {
    c.begin()
    c.moveTo(pt.x, pt.y)

    if (isSource) {
      c.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY + unitX / 2)
    } else {
      c.lineTo(pt.x + unitY / 2 - unitX, pt.y - unitY - unitX / 2)
    }

    c.lineTo(pt.x - unitX, pt.y - unitY)
    c.close()

    if (filled) {
      c.fillAndStroke()
    } else {
      c.stroke()
    }
  }
})

function createOpenAsyncArrow(widthFactor: number = 2) {
  return ({ c, pe, unitX, unitY, size, isSource, sw }: DrawMarkerOptions) => {
    unitX = unitX * (size + sw) // tslint:disable-line
    unitY = unitY * (size + sw) // tslint:disable-line

    const pt = pe.clone()

    return () => {
      c.begin()
      c.moveTo(pt.x, pt.y)

      if (isSource) {
        c.lineTo(
          pt.x - unitX - unitY / widthFactor,
          pt.y - unitY + unitX / widthFactor,
        )
      } else {
        c.lineTo(
          pt.x + unitY / widthFactor - unitX,
          pt.y - unitY - unitX / widthFactor,
        )
      }

      c.stroke()
    }
  }
}

registerMarker('openAsync', createOpenAsyncArrow(2))
