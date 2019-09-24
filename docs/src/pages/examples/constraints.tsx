import React from 'react'
import {
  Graph, Point, Constraint, ShapeNames, perimeters,
} from '../../../../src'

export default class Constraints extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
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
          perimeter: perimeters.triangle,
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
          perimeter: perimeters.ellipse,
        },
      })

      graph.addEdge({
        sourceNode: n1,
        targetNode: n3,
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
        sourceNode: n2,
        targetNode: n3,
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
        <p>Using fixed connection points for connecting edges to vertices.</p>
        <div
          ref={this.refContainer}
          className="graph-container"
        />
      </div>
    )
  }
}
