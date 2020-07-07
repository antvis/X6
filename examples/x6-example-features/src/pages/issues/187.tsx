import React from 'react'
import { Graph, Cell, Shape } from '@antv/x6'
import '../index.less'
import { Button } from 'antd'

const NODE_NAME = 'issue-187'
Shape.Rect.define({
  shape: NODE_NAME,
  width: 40,
  height: 40,
  ports: {
    items: [
      { group: 'left', id: '4' },
      { group: 'right', id: '2' },
      { group: 'top', id: '1' },
      { group: 'bottom', id: '3' },
    ],
    groups: {
      left: {
        position: { name: 'left' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 4,
            fill: 'lightblue',
            stroke: 'black',
          },
        },
        z: 0,
      },
      right: {
        position: { name: 'right' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 4,
            fill: 'lightblue',
            stroke: 'black',
          },
        },
        z: 0,
      },
      top: {
        position: { name: 'top' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 4,
            fill: 'lightblue',
            stroke: 'black',
          },
        },
        z: 0,
      },
      bottom: {
        position: { name: 'bottom' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 4,
            fill: 'lightblue',
            stroke: 'black',
          },
        },
        z: 0,
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
})

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private data: any = {}

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
      connecting: {
        snap: true,
        dangling: false,
        highlight: true,
        router: { name: 'manhattan' },
        connector: { name: 'normal' },
        connectionPoint: 'boundary',
        multi: true,
      },
    }))

    graph.on('node:mouseup', () => {
      const data = graph.toJSON()
      const { cells = [] } = data
      this.changeData(cells as any)
    })

    graph.fromJSON({
      edges: [
        {
          source: {
            cell: 'a',
          },
          target: {
            cell: 'b',
          },
        },
        {
          source: 'b',
          target: 'c',
        },
        {
          source: 'a',
          target: {
            cell: 'b',
            port: '3',
          },
        },
      ],
      nodes: [
        {
          id: 'a',
          label: 'a',
          shape: NODE_NAME,
          x: 100,
          y: 100,
        },
        {
          id: 'b',
          label: 'b',
          shape: NODE_NAME,
          x: 300,
          y: 100,
        },
        {
          id: 'c',
          label: 'c',
          shape: NODE_NAME,
          x: 500,
          y: 100,
        },
      ],
    })
  }

  changeData = (cells: Cell[]) => {
    let edges = []
    let nodes = []

    cells.forEach((cell) => {
      if (cell.shape === 'edge') {
        const { shape, source, target } = cell
        const newCell = {
          shape,
          source,
          target,
        }
        edges.push(newCell)
      } else if (cell.shape === NODE_NAME) {
        const {
          id,
          size,
          label,
          shape,
          position,
          data,
          ports,
          portMarkup,
        } = cell
        const newCell = {
          id,
          size,
          label: id,
          shape,
          position,
          data,
          ports,
          portMarkup,
        }
        nodes.push(newCell)
      }
    })

    this.data.edges = edges
    this.data.nodes = nodes
  }

  onFallBack = () => {
    console.log(this.data)
    this.graph.fromJSON(this.data)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Button onClick={this.onFallBack}>回退</Button>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
