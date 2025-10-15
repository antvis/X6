import React from 'react'
import { Graph, Keyboard, Selection } from '@antv/x6'
import '../../index.less'

export class SelectionExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1200,
      height: 800,
      grid: true,
      scaling: { min: 0.1, max: 2 },
      mousewheel: true,
    })

    const keyboard = new Keyboard()
    const selectionOptions: Selection.Options = {
      rubberband: true,
      multiple: true,
      strict: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true,
    }
    const selection = new Selection(selectionOptions)
    graph.use(keyboard)
    graph.use(selection)

    // 生成500个节点
    const nodes = []
    const nodeWidth = 80
    const nodeHeight = 30
    const cols = 25 // 每行25个节点
    const spacingX = 120
    const spacingY = 50

    for (let i = 0; i < 1000; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = 50 + col * spacingX
      const y = 50 + row * spacingY

      const node = graph.addNode({
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        attrs: {
          label: {
            text: `Node ${i + 1}`,
            fontSize: 12,
          },
          body: {
            fill: i % 2 === 0 ? '#f0f0f0' : '#e6f7ff',
            stroke: '#d9d9d9',
            strokeWidth: 1,
          },
        },
      })
      nodes.push(node)
    }

    // 为所有相邻节点添加连接边（水平和垂直相邻）
    for (let i = 0; i < 1000; i++) {
      const col = i % cols

      // 连接右侧相邻节点
      if (col < cols - 1) {
        const rightIndex = i + 1
        if (rightIndex < nodes.length) {
          graph.addEdge({
            source: nodes[i],
            target: nodes[rightIndex],
            attrs: {
              line: {
                stroke: '#ccc',
                strokeWidth: 1,
              },
            },
          })
        }
      }

      // 连接下方相邻节点
      const bottomIndex = i + cols
      if (bottomIndex < nodes.length) {
        graph.addEdge({
          source: nodes[i],
          target: nodes[bottomIndex],
          attrs: {
            line: {
              stroke: '#ccc',
              strokeWidth: 1,
            },
          },
        })
      }
    }

    // 添加100条仅有连线（两端没有节点）
    const stripXMin = 12
    const stripXMax = 28
    const marginY = 40
    const graphHeight = 800
    const lanes = 5
    const edgesCount = 100
    const edgesPerLane = Math.ceil(edgesCount / lanes)
    const availableY = graphHeight - marginY * 2
    const stepY = availableY / (edgesPerLane + 1)

    for (let i = 0; i < edgesCount; i++) {
      const lane = i % lanes
      const posIndex = Math.floor(i / lanes)
      const laneX = stripXMin + ((stripXMax - stripXMin) * lane) / (lanes - 1)

      const jitterX1 = (Math.random() - 0.5) * 2
      const jitterX2 = (Math.random() - 0.5) * 2
      const jitterY = (Math.random() - 0.5) * 6
      const x1 = laneX + jitterX1
      const x2 = laneX + jitterX2
      const y1 = marginY + (posIndex + 1) * stepY + jitterY
      const dy = (Math.random() - 0.5) * 48
      const y2 = Math.max(marginY, Math.min(graphHeight - marginY, y1 + dy))

      graph.addEdge({
        source: { x: x1, y: y1 },
        target: { x: x2, y: y2 },
        attrs: {
          line: {
            stroke: '#bbb',
            strokeWidth: 1,
          },
        },
      })
    }

    keyboard.bindKey('backspace', () => {
      const selectedCells = selection.getSelectedCells()
      graph.removeCells(selectedCells)
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
