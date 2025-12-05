import { Graph, type Cell } from '@antv/x6'
import insertCss from 'insert-css'

preWork()

// 类型定义
interface TimelineEvent {
  id: string
  title: string
  content: string
  date: string
  color: string
  lightColor: string
  type: 'normal' | 'milestone'
}

// 常量配置
const CONFIG = {
  card: { width: 100, height: 80 },
  marker: { diameter: 12 },
  diamond: { size: 80 },
  layout: { timelineY: 400, cardsY: 250, tipsGap: 160 },
  timeline: { startX: 250, endX: 1850 },
  text: { fontFamily: 'Inter, Helvetica, Arial, sans-serif' },
}

const PORTS = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2,
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2,
        },
      },
    },
  },
}

// 滤镜配置
const FILTERS = {
  card: [
    'drop-shadow(0 6px 16px rgba(0,0,0,0.12))',
    'drop-shadow(0 3px 6px rgba(0,0,0,0.06))',
  ],
  tips: [
    'drop-shadow(0 6px 20px rgba(0,0,0,0.25))',
    'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
  ],
  diamond: [
    'drop-shadow(0 6px 20px rgba(65,105,225,0.5))',
    'drop-shadow(0 4px 12px rgba(65,105,225,0.3))',
  ],
}

// 注册节点
Graph.registerNode(
  'tips-node',
  {
    inherit: 'rect',
    width: 200,
    height: 140,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'rect', selector: 'header' },
      { tagName: 'text', selector: 'headerText' },
      { tagName: 'text', selector: 'line1' },
      { tagName: 'text', selector: 'line2' },
      { tagName: 'text', selector: 'line3' },
      { tagName: 'text', selector: 'line4' },
    ],
    attrs: {
      body: {
        width: 200,
        height: 140,
        fill: '#FFFFFF',
        stroke: 'none',
        rx: 6,
        ry: 6,
        filter: FILTERS.tips[1],
      },
      header: {
        width: 200,
        height: 40,
        fill: '#1a1a1a',
        stroke: 'none',
        rx: 6,
        ry: 6,
      },
      headerText: {
        refX: 100,
        refY: 20,
        text: 'Timeline',
        fill: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        ...CONFIG.text,
      },
      line1: {
        refX: 16,
        refY: 60,
        text: 'A simple linear',
        fill: '#666',
        fontSize: 12,
        textAnchor: 'start',
        ...CONFIG.text,
      },
      line2: {
        refX: 16,
        refY: 78,
        text: 'timeline showing',
        fill: '#666',
        fontSize: 12,
        textAnchor: 'start',
        ...CONFIG.text,
      },
      line3: {
        refX: 16,
        refY: 96,
        text: 'events connected',
        fill: '#666',
        fontSize: 12,
        textAnchor: 'start',
        ...CONFIG.text,
      },
      line4: {
        refX: 16,
        refY: 114,
        text: 'to horizontal axis.',
        fill: '#666',
        fontSize: 12,
        textAnchor: 'start',
        ...CONFIG.text,
      },
    },
  },
  true,
)

Graph.registerNode(
  'event-card',
  {
    inherit: 'rect',
    width: CONFIG.card.width,
    height: CONFIG.card.height,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'title' },
      { tagName: 'text', selector: 'content' },
    ],
    attrs: {
      body: {
        width: CONFIG.card.width,
        height: CONFIG.card.height,
        fill: '#EFF4FF',
        stroke: 'none',
        rx: 4,
        ry: 4,
        filter: FILTERS.card[1],
        cursor: 'move',
      },
      title: {
        refX: '50%',
        refY: 30,
        fill: '#333',
        fontSize: 14,
        fontWeight: '600',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        ...CONFIG.text,
      },
      content: {
        refX: '50%',
        refY: 50,
        fill: '#666',
        fontSize: 11,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        ...CONFIG.text,
      },
    },
    ports: PORTS,
  },
  true,
)

Graph.registerNode(
  'diamond-milestone',
  {
    inherit: 'rect',
    width: CONFIG.diamond.size,
    height: CONFIG.diamond.size,
    markup: [
      { tagName: 'path', selector: 'body' },
      { tagName: 'text', selector: 'label' },
    ],
    attrs: {
      body: {
        refD: 'M 40 0 L 80 40 L 40 80 L 0 40 Z',
        fill: '#4169E1',
        stroke: 'none',
        filter: FILTERS.diamond[1],
        cursor: 'move',
      },
      label: {
        refX: '50%',
        refY: '50%',
        fill: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        ...CONFIG.text,
      },
    },
    ports: {
      groups: {
        top: {
          position: { name: 'absolute', args: { x: '50%', y: '0%' } },
          attrs: PORTS.groups.top.attrs,
        },
        bottom: {
          position: { name: 'absolute', args: { x: '50%', y: '100%' } },
          attrs: PORTS.groups.bottom.attrs,
        },
      },
    },
  },
  true,
)

Graph.registerNode(
  'endpoint-label',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'label' },
    ],
    attrs: {
      body: {
        width: 100,
        height: 40,
        fill: '#FFF',
        stroke: '#555',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      },
      label: {
        refX: '50%',
        refY: '50%',
        fill: '#333',
        fontSize: 14,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        ...CONFIG.text,
      },
    },
    ports: { groups: { top: PORTS.groups.top } },
  },
  true,
)

// 创建画布
const graph = new Graph({
  container: document.getElementById('graph-container')!,
  background: { color: '#FFF' },
  grid: { size: 24, visible: true, args: { color: '#E0E0E0', thickness: 2 } },
  panning: { enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'] },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    factor: 1.1,
    maxScale: 3,
    minScale: 0.1,
  },
  connecting: {
    anchor: 'center',
    connectionPoint: 'anchor',
    router: {
      name: 'metro',
      args: { startDirections: ['bottom'], endDirections: ['top'] },
    },
    connector: { name: 'rounded', args: { radius: 10 } },
  },
  interacting: { nodeMovable: true, edgeMovable: false },
})

// 工具函数
const createPorts = (id: string) => [
  { id: `${id}-top`, group: 'top' },
  { id: `${id}-bottom`, group: 'bottom' },
]

const createEndpoint = (
  id: string,
  x: number,
  label: string,
  y = CONFIG.layout.timelineY,
) => [
  graph.createNode({
    id: `${id}-anchor`,
    shape: 'circle',
    x: x - 8,
    y: y - 8,
    width: 16,
    height: 16,
    attrs: { body: { fill: '#000', stroke: 'none' } },
    zIndex: 10,
  }),
  graph.createNode({
    id: `${id}-label`,
    shape: 'endpoint-label',
    x: x - 50,
    y: y + 20,
    attrs: { label: { text: label } },
    ports: [{ id: `${id}-label-top`, group: 'top' }],
    zIndex: 2,
  }),
  graph.createEdge({
    id: `${id}-connector`,
    source: `${id}-anchor`,
    target: { cell: `${id}-label`, port: `${id}-label-top` },
    attrs: { line: { stroke: '#555', strokeWidth: 1.5, targetMarker: null } },
    router: { name: 'orth', args: { padding: 1 } },
    zIndex: 3,
  }),
]

// 数据转换
function transformTimelineData(data: TimelineEvent[]): Cell[] {
  const cells: Cell[] = []
  const { timeline, layout, card, marker, diamond } = CONFIG
  const spacing = (timeline.endX - timeline.startX) / (data.length + 1)

  // 时间轴主线
  cells.push(
    graph.createEdge({
      id: 'timeline-main-axis',
      source: { x: timeline.startX, y: layout.timelineY },
      target: { x: timeline.endX, y: layout.timelineY },
      attrs: { line: { stroke: '#AAA', strokeWidth: 2, targetMarker: null } },
      zIndex: 5,
    }),
  )

  // 端点
  cells.push(...createEndpoint('start', timeline.startX, 'Start Point'))
  cells.push(...createEndpoint('end', timeline.endX, 'End Point'))

  // Tips
  cells.push(
    graph.createNode({
      id: 'tips-node',
      shape: 'tips-node',
      x: timeline.startX - 100,
      y: layout.timelineY - layout.tipsGap - 80,
      zIndex: 20,
    }),
  )

  // 事件
  data.forEach((event, i) => {
    const x = timeline.startX + (i + 1) * spacing

    if (event.type === 'milestone') {
      const dY = layout.cardsY - diamond.size - 20
      const diamondId = `${event.id}-diamond`

      cells.push(
        graph.createNode({
          id: diamondId,
          shape: 'diamond-milestone',
          x: x - diamond.size / 2,
          y: dY,
          attrs: {
            body: { fill: event.color },
            label: { text: event.title },
          },
          ports: createPorts(diamondId),
          zIndex: 25,
        }),
        graph.createEdge({
          id: `${event.id}-diamond-to-card`,
          source: { cell: diamondId, port: `${diamondId}-bottom` },
          target: { cell: `${event.id}-card`, port: `${event.id}-card-top` },
          attrs: {
            line: {
              stroke: event.color,
              strokeWidth: 2,
              strokeDasharray: '4 4',
              targetMarker: null,
            },
          },
          router: { name: 'orth', args: { padding: 1 } },
          connector: { name: 'rounded', args: { radius: 8 } },
          zIndex: 20,
        }),
      )
    }

    cells.push(
      graph.createNode({
        id: `${event.id}-card`,
        shape: 'event-card',
        x: x - card.width / 2,
        y: layout.cardsY,
        attrs: {
          body: { fill: event.lightColor },
          title: { text: event.title },
          content: { text: event.content },
        },
        ports: createPorts(`${event.id}-card`),
        zIndex: 15,
      }),
      graph.createNode({
        id: `${event.id}-marker`,
        shape: 'circle',
        x: x - marker.diameter / 2,
        y: layout.timelineY - marker.diameter / 2,
        width: marker.diameter,
        height: marker.diameter,
        attrs: { body: { fill: event.color, stroke: 'none' } },
        zIndex: 8,
      }),
      graph.createEdge({
        id: `${event.id}-card-to-marker`,
        source: { cell: `${event.id}-card`, port: `${event.id}-card-bottom` },
        target: { cell: `${event.id}-marker`, anchor: 'top' },
        attrs: {
          line: { stroke: '#888', strokeWidth: 1.5, targetMarker: null },
        },
        router: { name: 'orth', args: { padding: 1 } },
        connector: { name: 'rounded', args: { radius: 8 } },
        zIndex: 3,
      }),
    )
  })

  return cells
}

// 交互
graph.on('node:mouseenter', ({ node }) => {
  const shape = node.shape
  const id = node.id
  if (shape === 'event-card') node.attr('body/filter', FILTERS.card[0])
  else if (id === 'tips-node')
    node.attr({ 'body/cursor': 'move', 'body/filter': FILTERS.tips[0] })
  else if (shape === 'diamond-milestone')
    node.attr('body/filter', FILTERS.diamond[0])
  else if (id?.includes('-marker'))
    node.attr('body/filter', `drop-shadow(0 0 8px ${node.attr('body/fill')})`)
})

graph.on('node:mouseleave', ({ node }) => {
  const shape = node.shape
  const id = node.id
  if (shape === 'event-card') node.attr('body/filter', FILTERS.card[1])
  else if (id === 'tips-node') node.attr('body/filter', FILTERS.tips[1])
  else if (shape === 'diamond-milestone')
    node.attr('body/filter', FILTERS.diamond[1])
  else if (id?.includes('-marker')) node.attr('body/filter', '')
})

graph.on('edge:mouseenter', ({ edge }) => {
  const id = edge.id
  if (id?.includes('diamond-to-card')) edge.attr('line/strokeWidth', 3)
  else if (
    id?.includes('-connector') &&
    !id.includes('start') &&
    !id.includes('end')
  )
    edge.attr({ 'line/stroke': '#555', 'line/strokeWidth': 2 })
})

graph.on('edge:mouseleave', ({ edge }) => {
  const id = edge.id
  if (id?.includes('diamond-to-card')) edge.attr('line/strokeWidth', 2)
  else if (
    id?.includes('-connector') &&
    !id.includes('start') &&
    !id.includes('end')
  )
    edge.attr({ 'line/stroke': '#888', 'line/strokeWidth': 1.5 })
})

// 自动缩放居中
let isFirstRender = true
graph.on('render:done', () => {
  if (!isFirstRender) return
  isFirstRender = false

  graph.zoomToFit({ padding: 20, maxScale: 1 })
  showGraph()
})

function showGraph() {
  document.getElementById('graph-container')?.classList.add('graph-visible')
}

// 加载数据
fetch('/data/timeline.json')
  .then((r) => r.json())
  .then((d) => graph.resetCells(transformTimelineData(d)))
  .catch(() => console.error('数据加载失败'))

// 预处理
function preWork() {
  const container = document.getElementById('container')
  if (!container) return
  const graphContainer = document.createElement('div')
  graphContainer.id = 'graph-container'
  container.appendChild(graphContainer)
  insertCss(`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #container { width: 100vw; height: 100vh; background: #FFF; }
    #graph-container { width: 100%; height: 100%; opacity: 0; transition: opacity 0.3s; }
    #graph-container.graph-visible { opacity: 1; }
  `)
}
