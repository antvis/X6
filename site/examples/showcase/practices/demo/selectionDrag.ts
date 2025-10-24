import { Graph, Selection } from '@antv/x6'
import insertCss from 'insert-css'

const host = document.getElementById('container')!
host.classList.add('selection-drag')

const graph = new Graph({
  container: host,
  grid: true,
  mousewheel: {
    enabled: true,
    factor: 1.1,
    minScale: 0.1,
    maxScale: 2,
  },
  panning: false,
})

graph.use(
  new Selection({
    rubberband: true,
    multiple: true,
    strict: true,
    // 展示框选节点边框
    showNodeSelectionBox: true,
  }),
)

const nodes: any[] = []
const nodeWidth = 60
const nodeHeight = 30
const cols = 10
const spacingX = 90
const spacingY = 50
const count = 120

for (let i = 0; i < count; i++) {
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
        fill: '#0958D9',
      },
      body: {
        fill: i % 2 === 0 ? '#E6F4FF' : '#FFFFFF',
        stroke: '#1677ff',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      },
    },
  })
  nodes.push(node)
}

for (let i = 0; i < count; i++) {
  const col = i % cols

  if (col < cols - 1) {
    const rightIndex = i + 1
    if (rightIndex < nodes.length) {
      graph.addEdge({
        source: nodes[i],
        target: nodes[rightIndex],
        attrs: {
          line: {
            stroke: '#91d5ff',
            strokeWidth: 1,
          },
        },
      })
    }
  }

  const bottomIndex = i + cols
  if (bottomIndex < nodes.length) {
    graph.addEdge({
      source: nodes[i],
      target: nodes[bottomIndex],
      attrs: {
        line: {
          stroke: '#91d5ff',
          strokeWidth: 1,
        },
      },
    })
  }
}

insertCss(`
.selection-drag .x6-widget-selection-rubberband {
  background-color: rgba(22, 119, 255, 0.12);
  border: 1.5px solid #1677ff;
  opacity: 1;
}
.selection-drag .x6-widget-selection-inner {
  border: 2px solid #1677ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}
.selection-drag .x6-widget-selection-box {
  border: 2px dashed #1677ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}
.selection-drag .x6-node-selected rect {
  stroke: #1677ff;
  stroke-width: 1.8px;
}
.selection-drag .x6-edge:hover path:nth-child(2){
  stroke: #1677ff;
}
.selection-drag .x6-edge-selected path:nth-child(2){
  stroke: #1677ff !important;
  stroke-width: 1.8px !important;
}
`)
