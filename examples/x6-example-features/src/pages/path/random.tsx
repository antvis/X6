import { Vector, Point } from '@antv/x6'
import React from 'react'
import '../index.less'

var size = {
  x: 2000,
  y: 1000,
}

class Coords {
  private x: number
  private y: number
  public points: Point.PointLike[]

  constructor() {
    this.points = []
    this.x = Math.random() * size.x
    this.y = Math.random() * size.y
  }

  generate(direction: Point.PointLike, step: number) {
    const x = this.x + direction.x * step
    const y = this.y + direction.y * step
    this.x = Math.min(size.x, Math.max(0, x))
    this.y = Math.min(size.y, Math.max(0, y))
    this.points.push({
      x: this.x,
      y: this.y,
    })
    return this
  }
}

// eslint-disable-next-line
namespace RandomDir {
  let radian = 4

  export function get() {
    let r = Math.round(Math.random() * 4) * (Math.PI / 2)
    if (Math.abs(radian - r) === Math.PI) {
      r += Math.PI / 2
    }

    radian = r

    return {
      x: parseFloat(Math.sin(r).toFixed(10)),
      y: parseFloat(Math.cos(r).toFixed(10)),
    }
  }
}

const drawIt = (container: SVGSVGElement, coords: Coords) => {
  var points: number[] = []
  coords.points.forEach((el) => {
    points.push(el.x)
    points.push(el.y)
  })

  Vector.create('polyline')
    .attr({
      points: points.join(','),
      stroke:
        'rgba(' +
        [
          Math.round(Math.random() * 100) + 155,
          Math.round(Math.random() * 150),
          Math.round(Math.random() * 20),
        ].join(',') +
        ',0.1)',
      strokeWidth: 1,
      // 'stroke-dasharray': 5,
      // 'stroke-dashoffset': 100,
      fill: 'transparent',
    })
    .appendTo(container)
}

const step = (n: number) => n * Math.round(Math.random() + 1)

export default class Example extends React.Component {
  private container: SVGSVGElement

  componentDidMount() {
    const coords = []
    const paths = 20
    const iterations = 10000

    for (let i = 0; i < paths; i += 1) {
      coords.push(new Coords())
    }

    for (let i = 0; i < iterations; i += 1) {
      coords.forEach((coord, index) => {
        coord.generate(RandomDir.get(), step(40 / (index || 1)))
      })
    }

    coords.forEach((coord) => {
      drawIt(this.container, coord)
    })
  }

  refContainer = (container: SVGSVGElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <svg
          ref={this.refContainer}
          style={{
            background: '#fff',
            width: '100%',
            height: '100%',
          }}
        />
        {/* <div className="x6-graph" style={{ width: 500, height: 400 }}></div> */}
      </div>
    )
  }
}
