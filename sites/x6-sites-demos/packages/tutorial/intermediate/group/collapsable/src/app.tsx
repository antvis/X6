import React from 'react'
import { Graph } from '@antv/x6'
import { Group } from './shape'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
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
      fill: string,
    ) => {
      return graph.addNode({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: {
            fill: fill || 'blue',
            stroke: 'none',
          },
          label: {
            text: id,
            fill: '#fff',
            fontSize: 12,
          },
        },
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
      })
    }

    const a = createGroup('a', 100, 40, 480, 280, '#91d5ff')
    const aa = createGroup('aa', 180, 100, 160, 140, '#47C769')
    const aaa = createGroup('aaa', 200, 160, 120, 40, '#3199FF')
    const c = createNode('c', 450, 200, 50, 50, 'orange')

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(c)

    createNode('d', 680, 80, 50, 50, 'black')

    createEdge('edge1', 'aa', 'c')
    createEdge('edge3', 'c', 'd')
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
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
