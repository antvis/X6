import React from 'react'
import ELK, { ElkNode, ElkExtendedEdge, ElkEdge } from 'elkjs/lib/elk-api.js'
import elkWorker from 'elkjs/lib/elk-worker.js'
import { Graph, Cell } from '../../../../src'
import elkdata from './elkdata.json'
import '../index.less'

Graph.registerNode(
  'elk-node',
  {
    inherit: 'rect',
    attrs: {
      body: {
        fill: '#EFF4FF',
        stroke: '#5F95FF',
        strokeWidth: 1,
      },
      label: {
        refX: 0,
        refY: -4,
        textAnchor: 'start',
        textVerticalAnchor: 'bottom',
        fontSize: 10,
      },
    },
    ports: {
      groups: {
        port: {
          position: {
            name: 'absolute',
          },
          attrs: {
            portBody: {
              magnet: 'passive',
              fill: '#5F95FF',
              refWidth: '100%',
              refHeight: '100%',
            },
          },
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody',
            },
          ],
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'elk-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          width: 4,
          height: 4,
        },
      },
    },
  },
  true,
)

interface Position {
  x: number
  y: number
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private portIdToNodeIdMap: Record<string, string> = {}
  private cells: Cell[] = []
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
      interacting: false,
    })

    const elk = new ELK({
      workerFactory: (url: string) => new elkWorker.Worker(url),
    })

    elk.layout(elkdata as any).then((res) => {
      this.addChildren(res.children || [])
      this.addEdges(res.edges || [])
      this.graph.resetCells(this.cells)
      this.graph.zoomToFit({ padding: 10, maxScale: 1 })
    })
  }

  addChildren = (children: ElkNode[], pos?: Position) => {
    console.log(children)
    children.forEach((child) => {
      const position = {
        x: (child.x || 0) + (pos ? pos.x : 0),
        y: (child.y || 0) + (pos ? pos.y : 0),
      }
      let label: string = ''
      if (typeof child.labels === 'string') {
        label = child.labels
      } else if (Array.isArray(child.labels) && child.labels[0]) {
        label = child.labels[0].text
      }
      const node = this.graph.createNode({
        shape: 'elk-node',
        id: child.id,
        position,
        label,
        size: {
          width: child.width || 0,
          height: child.height || 0,
        },
        ports: {
          items: (child.ports || []).map((item) => {
            this.portIdToNodeIdMap[item.id] = child.id
            return {
              id: item.id,
              group: 'port',
              args: {
                x: item.x,
                y: item.y,
              },
              size: { width: item.width || 0, height: item.height || 0 },
            }
          }),
        },
      })

      this.cells.push(node)

      if (child.children) {
        this.addChildren(child.children, position)
      }

      if (child.edges) {
        this.addEdges(child.edges, position)
      }
    })
  }

  addEdges = (edges: ElkEdge[], pos?: Position) => {
    edges.forEach((edge: ElkExtendedEdge) => {
      const { bendPoints = [] } = edge.sections[0]

      if (pos) {
        bendPoints.forEach((bendPoint: Position) => {
          bendPoint.x += pos.x
          bendPoint.y += pos.y
        })
      }

      const sourcePortId = edge.sources[0]
      const targetPortId = edge.targets[0]
      const sourceNodeId = this.portIdToNodeIdMap[sourcePortId]
      const targetNodeId = this.portIdToNodeIdMap[targetPortId]

      this.cells.push(
        this.graph.createEdge({
          shape: 'elk-edge',
          source: {
            cell: sourceNodeId,
            port: sourcePortId,
          },
          target: {
            cell: targetNodeId,
            port: targetPortId,
          },
          vertices: bendPoints,
        }),
      )
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph"></div>
      </div>
    )
  }
}
