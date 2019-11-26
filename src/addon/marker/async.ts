import { Marker } from '../../marker'

Marker.register('async', (
  {
    c,
    pe,
    unitX,
    unitY,
    size,
    isSource,
    sw,
    filled,
  },
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
      c.lineTo(
        pt.x - unitX - unitY / 2,
        pt.y - unitY + unitX / 2,
      )
    } else {
      c.lineTo(
        pt.x + unitY / 2 - unitX,
        pt.y - unitY - unitX / 2,
      )
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
  return (
    {
      c,
      pe,
      unitX,
      unitY,
      size,
      isSource,
      sw,
    }: Marker.DrawMarkerOptions,
  ) => {
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

Marker.register('openAsync', createOpenAsyncArrow(2))
