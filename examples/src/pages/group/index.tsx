import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Group } from './shape'
import '../index.less'

export class GroupExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
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
          },
          label: {
            text: id,
            fill: 'white',
            refX: 10,
            refY: 10,
            textAnchor: 'start',
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
        vertices: vertices,
        label: id,
      })
    }

    const a = createGroup('a', 100, 30, 480, 320, 'lightblue')
    const aa = createGroup('aa', 180, 80, 160, 140, 'green')
    const aaa = createGroup('aaa', 200, 120, 120, 40, 'gray')
    const c = createNode('c', 450, 200, 50, 50, 'orange')

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(c)

    createNode('d', 680, 80, 50, 50, 'black')

    const l1 = createEdge('l1', 'aa', 'c') // auto embed to common ancestor `a`
    console.log(l1)
    createEdge('l3', 'c', 'd')
    aa.addChild(
      createEdge('l2', 'aa', 'aaa', [
        { x: 50, y: 110 },
        { x: 50, y: 180 },
      ]),
    )

    graph.on('node:collapse', ({ node }: { node: Group }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach((node) => {
        if (collapsed) {
          node.hide()
        } else {
          node.show()
        }
      })
    })

    graph.on('react:collapse', ({ node }: { node: Node }) => {
      const data = node.getData<any>() || {}
      const collapsed = !(data.collapsed === true)
      node.updateData({ collapsed })
      node.resize(collapsed ? 80 : 160, collapsed ? 30 : 60)
      const cells = node.getDescendants()
      cells.forEach((node) => {
        if (collapsed) {
          node.hide()
        } else {
          node.show()
        }
      })
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
