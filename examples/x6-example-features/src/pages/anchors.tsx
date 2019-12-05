import React from 'react'
import { Graph, Point, Anchor } from '@antv/x6'
import styles from './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      connection: {
        enabled: true,
      },
      // connectionIcon: {
      //   image: images.share,
      // },
      getAnchors(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            new Anchor({ point: new Point(0, 0) }),
            new Anchor({ point: new Point(0.5, 0) }),
            new Anchor({ point: new Point(1, 0) }),

            new Anchor({ point: new Point(0, 0.5) }),
            new Anchor({ point: new Point(1, 0.5) }),

            new Anchor({ point: new Point(0, 1) }),
            new Anchor({ point: new Point(0.5, 1) }),
            new Anchor({ point: new Point(1, 1) }),
          ]
        }
        return null
      },
    })

    graph.batchUpdate(() => {
      const n1 = graph.addNode({
        data: 'Triangle',
        x: 20,
        y: 20,
        width: 80,
        height: 60,
        shape: 'triangle',
        perimeter: 'triangle',
      })

      const n2 = graph.addNode({
        data: 'Rectangle',
        x: 200,
        y: 20,
        width: 80,
        height: 30,
      })

      const n3 = graph.addNode({
        data: 'Ellipse',
        x: 200,
        y: 150,
        width: 80,
        height: 60,
        shape: 'ellipse',
        perimeter: 'ellipse',
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
    return <div ref={this.refContainer} className={styles.graph} />
  }
}
