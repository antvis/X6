import React from 'react'
import { joint, Path, Point } from '@antv/x6'
import '../../index.less'
import '../index.less'

joint.ConnectorRegistry.register(
  'wobble',
  (sourcePoint, targetPoint, vertices, args) => {
    const spread = args.spread || 20
    const points = [...vertices, targetPoint].map(p => Point.create(p))
    let prev = Point.create(sourcePoint)
    const path = new Path(Path.createSegment('M', prev))

    for (var i = 0, n = points.length; i < n; i += 1) {
      const next = points[i]
      const distance = prev.distance(next)
      let d = spread

      while (d < distance) {
        var current = prev.clone().move(next, -d)
        current.translate(
          Math.floor(7 * Math.random()) - 3,
          Math.floor(7 * Math.random()) - 3,
        )
        path.appendSegment(Path.createSegment('L', current))
        d += spread
      }

      path.appendSegment(Path.createSegment('L', next))
      prev = next
    }

    return path
  },
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 1000,
      height: 600,
      gridSize: 10,
    })

    const source = graph.addNode({
      type: 'rect',
      x: 50,
      y: 50,
      width: 140,
      height: 70,
      attrs: {
        label: { text: 'Source' },
      },
    })

    const target = source
      .clone()
      .translate(700, 400)
      .attr('label/text', 'Target')
    graph.addNode(target)

    graph.addEdge({
      source,
      target,
      type: 'edge',
      connector: {
        name: 'wobble',
        args: {
          spread: 10,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
