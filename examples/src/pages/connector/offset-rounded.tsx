import React from 'react'
import { Graph, Point, Path } from '@antv/x6'
import '../index.less'

export interface OffsetRoundedArgs {
  raw?: boolean
  radius?: number
  offset?: number
}

function offsetRounded(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  routePoints: Point.PointLike[],
  args: OffsetRoundedArgs,
) {
  const path = new Path()

  path.appendSegment(Path.createSegment('M', sourcePoint))

  const f13 = 1 / 3
  const f23 = 2 / 3
  const radius = args.radius || 10

  let prevDistance
  let nextDistance
  for (let i = 0, ii = routePoints.length; i < ii; i += 1) {
    const curr = Point.create(routePoints[i])
    const prev = routePoints[i - 1] || sourcePoint
    const next = routePoints[i + 1] || targetPoint

    prevDistance = nextDistance || curr.distance(prev) / 2
    nextDistance = curr.distance(next) / 2

    const startMove = -Math.min(radius, prevDistance)
    const endMove = -Math.min(radius, nextDistance)

    const roundedStart = curr.clone().move(prev, startMove).round()
    const roundedEnd = curr.clone().move(next, endMove).round()

    const control1 = new Point(
      f13 * roundedStart.x + f23 * curr.x,
      f23 * curr.y + f13 * roundedStart.y,
    )
    const control2 = new Point(
      f13 * roundedEnd.x + f23 * curr.x,
      f23 * curr.y + f13 * roundedEnd.y,
    )

    path.appendSegment(Path.createSegment('L', roundedStart))
    path.appendSegment(Path.createSegment('C', control1, control2, roundedEnd))
  }

  path.appendSegment(Path.createSegment('L', targetPoint))

  const offset = args.offset || 0
  if (offset) {
    let horizontal = false
    let vertical = false
    if (routePoints.length < 2) {
      horizontal = sourcePoint.y === targetPoint.y
      vertical = sourcePoint.x === targetPoint.x
    } else {
      horizontal =
        sourcePoint.y === routePoints[0].y && targetPoint.y === routePoints[1].y
      vertical =
        sourcePoint.x === routePoints[0].x && targetPoint.x === routePoints[1].x
    }
    if (horizontal) {
      path.translate(0, offset)
    } else if (vertical) {
      path.translate(offset, 0)
    }
  }

  return args.raw ? path : path.serialize()
}
Graph.registerConnector('offsetRounded', offsetRounded, true)

export class OffsetRoundedExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      connecting: {
        router: {
          name: 'er',
        },
      },
    })

    const source = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
    })

    const target = graph.addNode({
      shape: 'rect',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
    })

    graph.addEdge({
      source,
      target,
      connector: {
        name: 'offsetRounded',
        args: {
          radius: 20,
          offset: -20,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      connector: {
        name: 'offsetRounded',
        args: {
          radius: 20,
          offset: 0,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      connector: {
        name: 'offsetRounded',
        args: {
          radius: 20,
          offset: 20,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
