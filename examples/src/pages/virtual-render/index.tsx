import { type Cell, Graph, Scroller } from '@antv/x6'
import type React from 'react'
import { useEffect, useRef } from 'react'
import '../index.less'
import './index.less'

export const VirtualRenderExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1200,
      height: 800,
      grid: true,
      mousewheel: true,
      virtual: true,
    })

    graph.use(
      new Scroller({
        enabled: true,
        pannable: true,
      }),
    )

    graphRef.current = graph

    const cells: Cell[] = []
    const cols = 50 // 列数
    const rows = 40 // 行数，共 2000 个节点
    const nodeWidth = 60
    const nodeHeight = 28
    const gapX = 40
    const gapY = 30
    const startX = 20
    const startY = 20

    let id = 1
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = startX + c * (nodeWidth + gapX)
        const y = startY + r * (nodeHeight + gapY)
        const hue = Math.floor(Math.random() * 360)
        const delayVariant = Math.floor(Math.random() * 10)

        cells.push(
          graph.createNode({
            id: String(id++),
            shape: 'rect',
            width: nodeWidth,
            height: nodeHeight,
            position: { x, y },
            attrs: {
              body: {
                fill: `hsl(${hue}, 70%, 90%)`,
                stroke: `hsl(${hue}, 70%, 60%)`,
                strokeWidth: 1,
                rx: 4,
                ry: 4,
                class: `x6-node-anim`,
                style: {
                  '--x6-hue': `${hue}`,
                  '--pulse-delay': `${(delayVariant * 0.12).toFixed(2)}s`,
                  '--glow-delay': `${(delayVariant * 0.15).toFixed(2)}s`,
                },
              },
              label: {
                fontSize: 10,
                fill: '#333',
                text: `N-${id - 1}`,
              },
            },
          }),
        )
      }
    }

    // 创建相邻节点之间的边
    const edges: Cell[] = []

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const currentIndex = r * cols + c
        const currentId = String(currentIndex + 1)

        // 添加水平边（连接右侧相邻节点）
        if (c < cols - 1) {
          const rightIndex = r * cols + (c + 1)
          const rightId = String(rightIndex + 1)
          edges.push(
            graph.createEdge({
              source: currentId,
              target: rightId,
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 1,
                  class: `x6-ants x6-ants-d${Math.floor(Math.random() * 10)}`,
                },
              },
            }),
          )
        }

        // 添加垂直边（连接下方相邻节点）
        if (r < rows - 1) {
          const bottomIndex = (r + 1) * cols + c
          const bottomId = String(bottomIndex + 1)
          edges.push(
            graph.createEdge({
              source: currentId,
              target: bottomId,
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 1,
                  class: `x6-ants x6-ants-d${Math.floor(Math.random() * 10)}`,
                },
              },
            }),
          )
        }
      }
    }

    graph.resetCells([...cells, ...edges])

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
