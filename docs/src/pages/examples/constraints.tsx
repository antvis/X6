import React from 'react'
import {
  Graph, Point, Constraint, ShapeNames, perimeters,
} from '../../../../src'
// import * as images from '../../../../src/assets/images'

export default class Constraints extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      connection: {},
      // connectionIcon: {
      //   image: images.share,
      // },
      getConstraints(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            new Constraint({ point: new Point(0, 0) }),
            new Constraint({ point: new Point(0.5, 0) }),
            new Constraint({ point: new Point(1, 0) }),

            new Constraint({ point: new Point(0, 0.5) }),
            new Constraint({ point: new Point(1, 0.5) }),

            new Constraint({ point: new Point(0, 1) }),
            new Constraint({ point: new Point(0.5, 1) }),
            new Constraint({ point: new Point(1, 1) }),
          ]
        }
        return null
      },
    })

    graph.enableConnection()

    graph.batchUpdate(() => {
      const n1 = graph.addNode({
        data: 'Triangle',
        x: 20, y: 20, width: 80, height: 60,
        style: {
          shape: ShapeNames.triangle,
          perimeter: perimeters.trianglePerimeter,
        },
      })

      const n2 = graph.addNode({
        data: 'Rectangle',
        x: 200, y: 20, width: 80, height: 30,
      })

      const n3 = graph.addNode({
        data: 'Ellipse',
        x: 200, y: 150, width: 80, height: 60,
        style: {
          shape: ShapeNames.ellipse,
          perimeter: perimeters.ellipsePerimeter,
        },
      })

      graph.addEdge({
        source: n1,
        target: n3,
        data: 'label',
        style: {
          edge: 'elbow',
          elbow: 'horizontal',
          exitX: 0.5,
          exitY: 1,
          entryX: 0,
          entryY: 0,
          exitPerimeter: true,
          entryPerimeter: true,
        },
      })

      graph.addEdge({
        source: n2,
        target: n3,
        style: {
          edge: 'elbow',
          elbow: 'horizontal',
          orthogonal: false,
          entryX: 0,
          entryY: 0,
          entryPerimeter: true,
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div>
        <p>Using fixed connection points for connecting edges to nodes.</p>
        <div
          ref={this.refContainer}
          className="graph-container"
        />
      </div>
    )
  }
}
