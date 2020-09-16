import React from 'react'
import { Graph } from '@antv/x6'
import { getData } from './data'
import { TreeNode, TreeEdge } from './shape'
import '../../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      frozen: true,
      async: true,
      interacting: false,
      grid: 1,
      sorting: 'approx',
      background: {
        color: '#F3F7F6',
      },
      scroller: {
        enabled: true,
      },
      connecting: {
        anchor: 'orth',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            direction: 'H',
          },
        },
      },
      // checkView: ({view}) => {

      // },
    })

    graph.zoomTo(0.8)

    var start = new Date().getTime()

    const data = getData()
    const nodes = data.nodes.map(({ leaf, ...metadata }: any) => {
      const node = new TreeNode(metadata)
      if (leaf) {
        node.toggleButtonVisibility(leaf === false)
      }
      return node
    })

    const edges = data.edges.map(
      (edge: any) => new TreeEdge({ source: edge.source, target: edge.target }),
    )

    graph.resetCells([...nodes, ...edges])

    graph.unfreeze({
      progress({ done }) {
        if (done) {
          const time = new Date().getTime() - start
          console.log(time)
          graph.unfreeze({ batchSize: 50 })
        }
      },
    })

    graph.on('node:collapse', ({ node }) => {
      const treeNode = node as TreeNode
      treeNode.toggleCollapse()
      const collapsed = treeNode.isCollapsed()
      const nodes = graph.getSuccessors(node) as TreeNode[]
      nodes.forEach((node) => {
        node.toggleVisible(collapsed)
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
