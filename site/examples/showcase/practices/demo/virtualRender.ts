import { Graph, type Node, Scroller } from '@antv/x6'
import insertCss from 'insert-css'

const host = document.getElementById('container')!
host.classList.add('virtual-render')

const graph = new Graph({
  container: host,
  mousewheel: true,
  // 开启虚拟渲染
  virtual: true,
  grid: true,
})

graph.use(new Scroller({ enabled: true, pannable: true }))

const nodes: Node[] = []
const nodeWidth = 80
const nodeHeight = 30
const cols = 20
const spacingX = 120
const spacingY = 50
const count = 1000
const statuses = ['加载中…', '同步中…', '处理任务…', '拉取数据…', '发布中…']
const loaderVariants = [
  'loader-dots',
  'loader-bar',
  'loader-wave',
  'loader-glow',
  'loader-ants',
]

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
    position: { x, y },
    attrs: {
      label: {
        text: statuses[i % statuses.length],
        fill: '#0958D9',
        fontSize: 12,
      },
      body: {
        fill: i % 2 === 0 ? '#E6F4FF' : '#FFFFFF',
        stroke: '#5f95ff',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
        class: loaderVariants[i % loaderVariants.length],
      },
    },
  })
  nodes.push(node)
}

for (let i = 0; i < count; i++) {
  const col = i % cols
  if (col < cols - 1 && i + 1 < nodes.length) {
    graph.addEdge({
      source: nodes[i],
      target: nodes[i + 1],
      attrs: {
        line: {
          stroke: '#91CAFF',
          strokeWidth: 1,
          strokeDasharray: '6 4',
          class: 'marching-line',
        },
      },
    })
  }

  const bottomIndex = i + cols
  if (bottomIndex < nodes.length) {
    graph.addEdge({
      source: nodes[i],
      target: nodes[bottomIndex],
      attrs: {
        line: {
          stroke: '#91CAFF',
          strokeWidth: 1,
          strokeDasharray: '6 4',
          class: 'marching-line',
        },
      },
    })
  }
}

insertCss(`
@keyframes ants { to { stroke-dashoffset: -100; } }
@keyframes dotsFlow { to { stroke-dashoffset: -24; } }
@keyframes progressSweep { to { stroke-dashoffset: -220; } }
@keyframes waveWidth {
  0%, 100% { stroke-width: 1; }
  50% { stroke-width: 2.2; }
}
@keyframes glowFade {
  0%, 100% { stroke-opacity: 0.8; }
  50% { stroke-opacity: 0.45; }
}

.virtual-render .x6-edge path.marching-line {
  animation: ants 6s linear infinite;
}
.virtual-render .x6-edge:hover path.marching-line {
  stroke: #5f95ff;
  stroke-width: 1.3px;
}
.virtual-render .x6-edge-selected path.marching-line {
  stroke: #5f95ff;
  stroke-width: 1.8px !important;
}

.virtual-render .x6-node rect.loader-dots {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 2 6;
  animation: dotsFlow 2.4s linear infinite;
}
.virtual-render .x6-node rect.loader-bar {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 80 140;
  animation: progressSweep 4.8s linear infinite;
}
.virtual-render .x6-node rect.loader-wave {
  transform-box: fill-box;
  transform-origin: center;
  animation: waveWidth 3s ease-in-out infinite;
}
.virtual-render .x6-node rect.loader-glow {
  transform-box: fill-box;
  transform-origin: center;
  animation: glowFade 2.8s ease-in-out infinite;
}
.virtual-render .x6-node rect.loader-ants {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 6 4;
  animation: ants 6s linear infinite;
}

.virtual-render .x6-node-selected rect {
  stroke: #5f95ff;
  stroke-width: 2px;
}
`)
