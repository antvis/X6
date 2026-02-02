import React, { useEffect, useRef } from 'react'
import ELK, { ElkNode, ElkExtendedEdge, ElkEdge } from 'elkjs/lib/elk-api.js'
import elkWorker from 'elkjs/lib/elk-worker.js'
import { Graph, Cell } from '@antv/x6'
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

export const CaseElkExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1000,
      height: 600,
      interacting: false,
    })

    const portIdToNodeIdMap: Record<string, string> = {}
    const cells: Cell[] = []

    const addChildren = (children: ElkNode[], pos?: Position) => {
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
        const node = graph.createNode({
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
              portIdToNodeIdMap[item.id] = child.id
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

        cells.push(node)

        if (child.children) {
          addChildren(child.children, position)
        }

        if (child.edges) {
          addEdges(child.edges, position)
        }
      })
    }

    const addEdges = (edges: ElkEdge[], pos?: Position) => {
      edges.forEach((edge: ElkExtendedEdge) => {
        const { bendPoints = [] } = edge.sections[0]

        const currentBendPoints = bendPoints.map((p) => ({ ...p }))
        if (pos) {
          currentBendPoints.forEach((bendPoint: Position) => {
            bendPoint.x += pos.x
            bendPoint.y += pos.y
          })
        }

        const sourcePortId = edge.sources[0]
        const targetPortId = edge.targets[0]
        const sourceNodeId = portIdToNodeIdMap[sourcePortId]
        const targetNodeId = portIdToNodeIdMap[targetPortId]

        cells.push(
          graph.createEdge({
            shape: 'elk-edge',
            source: {
              cell: sourceNodeId,
              port: sourcePortId,
            },
            target: {
              cell: targetNodeId,
              port: targetPortId,
            },
            vertices: currentBendPoints,
          }),
        )
      })
    }

    const elk = new ELK({
      workerFactory: (url: string) => new elkWorker.Worker(url),
    })

    elk.layout(elkdata as any).then((res) => {
      addChildren(res.children || [])
      addEdges(res.edges || [])
      graph.resetCells(cells)
      graph.zoomToFit({ padding: 10, maxScale: 1 })
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph"></div>
    </div>
  )
}
