import React from 'react'
import { Graph } from '@antv/x6'
import { Group } from './shape'
import './index.less'

Graph.registerNode(
  'custom-group-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
)
export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const createGroup = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      const group = new Group({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: { fill },
          label: { text: id },
        },
      })
      graph.addNode(group)
      return group
    }

    const createNode = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      return graph.addNode({
        shape: 'custom-group-node',
        id,
        x,
        y,
        width,
        height,
        label: id,
      })
    }

    const createEdge = (
      id: string,
      source: string,
      target: string,
      vertices?: { x: number; y: number }[],
    ) => {
      return graph.addEdge({
        id,
        source,
        target,
        vertices,
        label: id,
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    }

    const a = createGroup('a', 100, 40, 480, 280, '#91d5ff')
    const aa = createGroup('aa', 180, 100, 160, 140, '#47C769')
    const aaa = createGroup('aaa', 200, 160, 120, 40, '#0491e4')
    const b = createNode('b', 450, 200, 50, 50)

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(b)

    createNode('c', 680, 80, 50, 50)

    createEdge('edge1', 'aa', 'b')
    createEdge('edge3', 'b', 'c')
    aa.addChild(
      createEdge('edge2', 'aa', 'aaa', [
        { x: 60, y: 140 },
        { x: 60, y: 220 },
      ]),
    )

    graph.on('node:collapse', ({ node }: { node: Group }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const collapse = (parent: Group) => {
        const cells = parent.getChildren()
        if (cells) {
          cells.forEach((cell) => {
            if (collapsed) {
              cell.hide()
            } else {
              cell.show()
            }

            if (cell instanceof Group) {
              if (!cell.isCollapsed()) {
                collapse(cell)
              }
            }
          })
        }
      }

      collapse(node)
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="collapsable-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
