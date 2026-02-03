import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Select } from 'antd'
import dagre from 'dagre'
import { Graph, Cell, Node, Color, Dom } from '@antv/x6'
import './shape'
import '../index.less'
import './index.less'

const male =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
const female =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'

export const OrgExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [dir, setDir] = useState<'LR' | 'RL' | 'TB' | 'BT'>('LR')

  const createNode = useCallback(
    (
      graph: Graph,
      rank: string,
      name: string,
      image: string,
      background: string,
      textColor = '#000',
    ) => {
      return graph.createNode({
        shape: 'org-node',
        attrs: {
          '.card': { fill: background },
          '.image': { xlinkHref: image },
          '.rank': {
            fill: textColor,
            text: Dom.breakText(rank, { width: 160, height: 45 }),
          },
          '.name': {
            fill: textColor,
            text: Dom.breakText(name, { width: 160, height: 45 }),
          },
          '.btn > circle': { stroke: textColor },
          '.btn > text': { fill: textColor, stroke: textColor },
        },
      })
    },
    [],
  )

  const createEdge = useCallback((graph: Graph, source: Cell, target: Cell) => {
    return graph.createEdge({
      shape: 'org-edge',
      source: { cell: source.id },
      target: { cell: target.id },
    })
  }, [])

  const layout = useCallback(
    (graph: Graph, currentDir: 'LR' | 'RL' | 'TB' | 'BT') => {
      const nodes = graph.getNodes()
      const edges = graph.getEdges()
      const g = new dagre.graphlib.Graph()
      g.setGraph({ rankdir: currentDir, nodesep: 16, ranksep: 16 })
      g.setDefaultEdgeLabel(() => ({}))

      const width = 260
      const height = 90
      nodes.forEach((node) => {
        g.setNode(node.id, { width, height })
      })

      edges.forEach((edge) => {
        const sourceId = edge.getSourceCellId()
        const targetId = edge.getTargetCellId()
        g.setEdge(sourceId, targetId)
      })

      dagre.layout(g)

      g.nodes().forEach((id: string) => {
        const node = graph.getCellById(id) as Node
        if (node) {
          const pos = g.node(id)
          node.position(pos.x, pos.y)
        }
      })

      edges.forEach((edge) => {
        const sourceNode = edge.getSourceNode()!
        const targetNode = edge.getTargetNode()!
        const sourceBBox = sourceNode.getBBox()
        const targetBBox = targetNode.getBBox()

        if (
          (currentDir === 'LR' || currentDir === 'RL') &&
          sourceBBox.y !== targetBBox.y
        ) {
          const gap =
            currentDir === 'LR'
              ? targetBBox.x - sourceBBox.x - sourceBBox.width
              : -sourceBBox.x + targetBBox.x + targetBBox.width
          const fix = currentDir === 'LR' ? sourceBBox.width : 0
          const x = sourceBBox.x + fix + gap / 2
          edge.setVertices([
            { x, y: sourceBBox.center.y },
            { x, y: targetBBox.center.y },
          ])
        } else if (
          (currentDir === 'TB' || currentDir === 'BT') &&
          sourceBBox.x !== targetBBox.x
        ) {
          const gap =
            currentDir === 'TB'
              ? targetBBox.y - sourceBBox.y - sourceBBox.height
              : -sourceBBox.y + targetBBox.y + targetBBox.height
          const fix = currentDir === 'TB' ? sourceBBox.height : 0
          const y = sourceBBox.y + fix + gap / 2
          edge.setVertices([
            { x: sourceBBox.center.x, y },
            { x: targetBBox.center.x, y },
          ])
        } else {
          edge.setVertices([])
        }
      })
    },
    [],
  )

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1000,
      height: 600,
      interacting: false,
    })

    const nodes = [
      createNode(graph, 'Founder & Chairman', 'Pierre Omidyar', male, '#31d0c6'),
      createNode(
        graph,
        'President & CEO',
        'Margaret C. Whitman',
        female,
        '#31d0c6',
      ),
      createNode(graph, 'President, PayPal', 'Scott Thompson', male, '#7c68fc'),
      createNode(
        graph,
        'President, Ebay Global Marketplaces',
        'Devin Wenig',
        male,
        '#7c68fc',
      ),
      createNode(
        graph,
        'Senior Vice President Human Resources',
        'Jeffrey S. Skoll',
        male,
        '#fe854f',
      ),
      createNode(
        graph,
        'Senior Vice President Controller',
        'Steven P. Westly',
        male,
        '#feb663',
      ),
      createNode(
        graph,
        'Senior Vice President Controller',
        'Carl Carlson',
        female,
        '#feb663',
      ),
    ]

    const edges = [
      createEdge(graph, nodes[0], nodes[1]),
      createEdge(graph, nodes[1], nodes[2]),
      createEdge(graph, nodes[1], nodes[3]),
      createEdge(graph, nodes[1], nodes[4]),
      createEdge(graph, nodes[1], nodes[5]),
      createEdge(graph, nodes[1], nodes[6]),
    ]

    graph.resetCells([...nodes, ...edges])
    layout(graph, dir)
    graph.zoomTo(0.8)
    graph.centerContent()

    graph.on('node:add', ({ e, node }: { e: Dom.ClickEvent; node: Node }) => {
      e.stopPropagation()
      const bg = Color.randomHex()
      const member = createNode(
        graph,
        'Employee',
        'New Employee',
        Math.random() < 0.5 ? male : female,
        bg,
        Color.invert(bg, true),
      )
      graph.addCell([member, createEdge(graph, node, member)])
      layout(graph, dir)
    })

    graph.on('node:delete', ({ e, node }: { e: Dom.ClickEvent; node: Node }) => {
      e.stopPropagation()
      graph.removeCell(node)
      layout(graph, dir)
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [createNode, createEdge, layout]) // Initial load

  const onDirChange = (val: 'LR' | 'RL' | 'TB' | 'BT') => {
    setDir(val)
    if (graphRef.current) {
      layout(graphRef.current, val)
      graphRef.current.centerContent()
    }
  }

  return (
    <div className="x6-graph-wrap">
      <div className="x6-graph-tools">
        <Select value={dir} onChange={onDirChange}>
          <Select.Option value="LR">Left-Right</Select.Option>
          <Select.Option value="RL">Right-Left</Select.Option>
          <Select.Option value="TB">Top-Bottom</Select.Option>
          <Select.Option value="BT">Bottom-Top</Select.Option>
        </Select>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
