// import { Rectangle, Ellipse, Polyline, Path } from '../../geometry'
import { Vector } from '@antv/x6-common'
import { Util } from '../../util'

describe('Util', () => {
  const fixture = document.createElement('div')
  const svgContainer = Vector.create('svg').node
  fixture.appendChild(svgContainer)
  document.body.appendChild(fixture)

  afterAll(() => {
    fixture.parentNode?.removeChild(fixture)
  })

  it('should return correct bbox of rect', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const rect = Vector.create('rect')

    container.append(group)
    group.append(rect)
    group.translate(50, 50).rotate(20)

    rect.translate(20, 20).rotate(20)
    rect.setAttribute('x', 10)
    rect.setAttribute('y', 10)
    rect.setAttribute('width', 100)
    rect.setAttribute('height', 100)
    rect.setAttribute('strokeWidth', 4)

    const bbox1 = Util.getBBox(rect.node)
    const bbox2 = Util.getBBoxV2(rect.node)
    expect(bbox1.equals(bbox2))

    rect.remove()
    group.remove()
  })

  it('should return correct bbox of rect with dx dy', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const rect = Vector.create('rect')

    container.append(group)
    group.append(rect)
    group.translate(50, 50).rotate(20)

    rect.translate(20, 20).rotate(20)
    rect.setAttribute('dx', 10)
    rect.setAttribute('dy', 10)
    rect.setAttribute('width', 100)
    rect.setAttribute('height', 100)

    const bbox1 = Util.getBBox(rect.node)
    const bbox2 = Util.getBBoxV2(rect.node)
    expect(bbox1.equals(bbox2))

    rect.remove()
    group.remove()
  })

  it('should return correct bbox of circle', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const circle = Vector.create('circle')

    container.append(group)
    group.append(circle)
    group.translate(50, 50).rotate(20)

    circle.setAttribute('cx', 10)
    circle.setAttribute('cy', 10)
    circle.setAttribute('r', 20)

    const bbox1 = Util.getBBox(circle.node)
    const bbox2 = Util.getBBoxV2(circle.node)
    expect(bbox1.equals(bbox2))

    circle.remove()
    group.remove()
  })

  it('should return correct bbox of ellipse', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const ellipse = Vector.create('ellipse')

    container.append(group)
    group.append(ellipse)
    group.translate(50, 50).rotate(20)

    ellipse.setAttribute('cx', 10)
    ellipse.setAttribute('cy', 10)
    ellipse.setAttribute('rx', 40)
    ellipse.setAttribute('ry', 20)

    const bbox1 = Util.getBBox(ellipse.node)
    const bbox2 = Util.getBBoxV2(ellipse.node)
    expect(bbox1.equals(bbox2))

    ellipse.remove()
    group.remove()
  })

  it('should return correct bbox of polyline', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const polyline = Vector.create('polyline')

    container.append(group)
    group.append(polyline)
    group.translate(50, 50).rotate(20)

    polyline.setAttribute('points', '0, 0 0, 80 80, 80 80, 0')

    const bbox1 = Util.getBBox(polyline.node)
    const bbox2 = Util.getBBoxV2(polyline.node)
    expect(bbox1.equals(bbox2))

    polyline.remove()
    group.remove()
  })

  it('should return correct bbox of polygon', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const polygon = Vector.create('polygon')

    container.append(group)
    group.append(polygon)
    group.translate(50, 50).rotate(20)

    polygon.setAttribute('points', '0, 40 40, 0 80, 40 40, 80')

    const bbox1 = Util.getBBox(polygon.node)
    const bbox2 = Util.getBBoxV2(polygon.node)
    expect(bbox1.equals(bbox2))

    polygon.remove()
    group.remove()
  })

  it('should return correct bbox of path', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const path = Vector.create('path')

    container.append(group)
    group.append(path)
    group.translate(50, 50).rotate(20)

    path.setAttribute(
      'd',
      'M 0 20 L 57.142857142857146 0 C 114.28571428571429 0 114.28571428571429 80 57.142857142857146 80 L 0 60 Z',
    )

    const bbox1 = Util.getBBox(path.node)
    const bbox2 = Util.getBBoxV2(path.node)
    expect(bbox1.equals(bbox2))

    path.remove()
    group.remove()
  })

  it('should return correct bbox of line', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const line = Vector.create('line')

    container.append(group)
    group.append(line)
    group.translate(50, 50).rotate(20)

    line.setAttribute('x1', 100)
    line.setAttribute('x2', 100)
    line.setAttribute('y1', 200)
    line.setAttribute('y2', 300)

    const bbox1 = Util.getBBox(line.node)
    const bbox2 = Util.getBBoxV2(line.node)
    expect(bbox1.equals(bbox2))

    line.remove()
    group.remove()
  })

  it('should return correct bbox of text', () => {
    const container = Vector.create(svgContainer)
    const group = Vector.create('g')
    const text = Vector.create('text')
    const tspan = Vector.create('tspan')

    container.append(group)
    group.append(text)
    text.translate(50, 50).rotate(20)
    text.append(tspan)

    tspan.setAttribute('dy', '-3em')

    const bbox1 = Util.getBBox(tspan.node)
    const bbox2 = Util.getBBoxV2(tspan.node)
    expect(bbox1.equals(bbox2))

    tspan.remove()
    text.remove()
    group.remove()
  })
})
