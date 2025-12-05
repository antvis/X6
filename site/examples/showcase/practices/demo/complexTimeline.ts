import { Graph, type Node, type Cell } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import insertCss from 'insert-css'
import React from 'react'

preWork()

// 类型定义
interface EventCard {
  id: string
  title: string
  content: string
}

interface Milestone {
  id: string
  headline: string
  subtitle: string
  date: string
  color: string
  lightColor: string
  events: EventCard[]
}

interface PyramidPosition {
  x: number
  y: number
  row: number
}

interface MilestoneColumnData {
  headline: string
  date: string
  color: string
  lineHeight: number
}

// 常量配置
const CONFIG = {
  card: { width: 80, height: 104, gap: 16 },
  layout: { columnSpacing: 40, cardsBottomOffset: 68, milestoneSpacing: 500 },
  timeline: { y: 750, startX: 200, endX: 2200, height: 16 },
  gradient: 'timeline-gradient',
}

// React 组件（使用 memo 优化）
const MilestoneColumn = React.memo(({ node }: { node: Node }) => {
  const { headline, date, color, lineHeight } =
    node.getData() as MilestoneColumnData

  return React.createElement('div', { className: 'milestone-column' }, [
    React.createElement('div', { className: 'milestone-top', key: 'top' }, [
      React.createElement('div', {
        className: 'milestone-big-dot',
        key: 'dot',
        style: { backgroundColor: color },
      }),
      React.createElement(
        'div',
        {
          className: 'milestone-headline',
          key: 'headline',
          style: { color },
        },
        headline,
      ),
    ]),
    React.createElement('div', {
      className: 'milestone-spine',
      key: 'spine',
      style: { backgroundColor: color, height: `${lineHeight}px` },
    }),
    React.createElement(
      'div',
      { className: 'milestone-date', key: 'date' },
      date,
    ),
  ])
})

const SubtitleNode = React.memo(({ node }: { node: Node }) => {
  const { subtitle } = node.getData() as { subtitle: string }
  return React.createElement('div', { className: 'subtitle-text' }, subtitle)
})

const EventCardNode = React.memo(({ node }: { node: Node }) => {
  const { title, bgColor } = node.getData() as {
    title: string
    bgColor: string
  }
  return React.createElement(
    'div',
    { className: 'event-card-vertical', style: { backgroundColor: bgColor } },
    React.createElement('div', { className: 'event-card-title' }, title),
  )
})

// 注册节点
register({
  shape: 'milestone-column-node',
  width: 250,
  height: 800,
  effect: ['data'],
  component: MilestoneColumn,
})

register({
  shape: 'subtitle-node',
  width: 150,
  height: 20,
  effect: ['data'],
  component: SubtitleNode,
})

register({
  shape: 'event-card-node',
  width: CONFIG.card.width,
  height: CONFIG.card.height,
  effect: ['data'],
  component: EventCardNode,
})

// 创建画布
const graph = new Graph({
  container: document.getElementById('graph-container')!,
  background: { color: '#FFFFFF' },
  grid: { size: 24, visible: true, args: { color: '#E0E0E0', thickness: 2 } },
  panning: { enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'] },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    factor: 1.1,
    maxScale: 3,
    minScale: 0.1,
  },
  interacting: {
    nodeMovable: (view) => view.cell.shape === 'event-card-node',
    edgeMovable: false,
  },
})

// 定义渐变色
graph.defineGradient({
  type: 'linearGradient',
  id: CONFIG.gradient,
  attrs: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
  stops: [
    { offset: '0%', color: '#8A2BE2' },
    { offset: '33%', color: '#4169E1' },
    { offset: '66%', color: '#FFD700' },
    { offset: '100%', color: '#2E8B57' },
  ],
})

// 工具函数：计算金字塔布局
function calculatePyramidLayout(
  totalCards: number,
  startX: number,
  timelineY: number,
): { positions: PyramidPosition[]; topY: number } {
  let totalRows = 0
  let tempCount = 0
  while (tempCount < totalCards) {
    totalRows++
    tempCount += totalRows
  }

  const rows: Array<{ y: number; count: number }> = []
  let currentY = timelineY - CONFIG.layout.cardsBottomOffset
  let cardIndex = 0

  for (let row = totalRows; row >= 1; row--) {
    const count = Math.min(row, totalCards - cardIndex)
    if (count <= 0) break
    const y = currentY - CONFIG.card.height
    rows.push({ y, count })
    cardIndex += count
    currentY = y - CONFIG.card.gap
  }

  rows.reverse()

  const positions: PyramidPosition[] = []
  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < row.count; col++) {
      positions.push({
        x: startX + col * (CONFIG.card.width + CONFIG.card.gap),
        y: row.y,
        row: rowIndex + 1,
      })
    }
  })

  return {
    positions,
    topY:
      rows.length > 0 ? rows[0].y : timelineY - CONFIG.layout.cardsBottomOffset,
  }
}

// 工具函数：数据转换
function transformTimelineData(data: Milestone[]): Cell[] {
  const cells: Cell[] = []
  const { timeline, layout } = CONFIG

  // 时间轴主体
  cells.push(
    graph.createNode({
      shape: 'rect',
      x: timeline.startX,
      y: timeline.y - timeline.height / 2,
      width: timeline.endX - timeline.startX,
      height: timeline.height,
      attrs: {
        body: {
          fill: `url(#${CONFIG.gradient})`,
          stroke: 'none',
          rx: 8,
          ry: 8,
        },
      },
      zIndex: 5,
    }),
  )

  // 时间轴端点
  ;[timeline.startX, timeline.endX].forEach((x) => {
    cells.push(
      graph.createNode({
        shape: 'circle',
        x: x - 10,
        y: timeline.y - 10,
        width: 20,
        height: 20,
        attrs: { body: { fill: '#333333', stroke: 'none' } },
        zIndex: 10,
      }),
    )
  })

  // 遍历里程碑
  data.forEach((milestone, index) => {
    const baseX = timeline.startX + 100 + index * layout.milestoneSpacing
    const leftX = baseX
    const rightX = baseX + layout.columnSpacing

    const { positions, topY } = calculatePyramidLayout(
      milestone.events.length,
      rightX,
      timeline.y,
    )

    const subtitleY = topY - 35
    const headlineY = subtitleY - 45
    const spineHeight = timeline.y - (headlineY + 34)
    const columnHeight = timeline.y - headlineY + 40

    // 里程碑列
    cells.push(
      graph.createNode({
        id: `${milestone.id}-column`,
        shape: 'milestone-column-node',
        x: leftX - 125,
        y: headlineY,
        width: 250,
        height: columnHeight,
        data: {
          headline: milestone.headline,
          date: milestone.date,
          color: milestone.color,
          lineHeight: spineHeight,
        },
        zIndex: 3,
      }),
    )

    // 时间轴圆点
    cells.push(
      graph.createNode({
        id: `${milestone.id}-timeline-dot`,
        shape: 'circle',
        x: leftX - 9,
        y: timeline.y - 9,
        width: 18,
        height: 18,
        attrs: {
          body: { fill: milestone.color, stroke: '#FFFFFF', strokeWidth: 2 },
        },
        zIndex: 15,
      }),
    )

    // 副标题
    cells.push(
      graph.createNode({
        shape: 'subtitle-node',
        x: rightX,
        y: subtitleY,
        data: { subtitle: milestone.subtitle },
        zIndex: 7,
      }),
    )

    // 事件卡片
    milestone.events.forEach((event, eventIndex) => {
      const pos = positions[eventIndex]
      cells.push(
        graph.createNode({
          id: event.id,
          shape: 'event-card-node',
          x: pos.x,
          y: pos.y,
          data: { title: event.title, bgColor: milestone.lightColor },
          zIndex: 8,
        }),
      )
    })
  })

  return cells
}

// 交互效果
graph.on('node:mouseenter', ({ node }) => {
  if (node.shape === 'event-card-node') node.setZIndex(100)
})

graph.on('node:mouseleave', ({ node }) => {
  if (node.shape === 'event-card-node') node.setZIndex(8)
})

// 使用 render:done 钩子
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

// 数据加载与渲染
fetch('/data/complex-timeline.json')
  .then((res) => res.json())
  .then((data) => {
    const cells = transformTimelineData(data)
    graph.resetCells(cells)
  })
  .catch(() => {
    console.error('数据加载失败')
  })

// 预处理
function preWork() {
  const container = document.getElementById('container') as HTMLElement
  if (!container) return

  const graphContainer = document.createElement('div')
  graphContainer.id = 'graph-container'
  container.appendChild(graphContainer)

  insertCss(`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #container { width: 100vw; height: 100vh; overflow: hidden; background: #FFFFFF; }
    #graph-container {
      width: 100%; height: 100%; background: #FFFFFF;
      opacity: 0; transition: opacity 0.3s ease-in-out;
      position: absolute; top: 0; left: 0;
    }
    #graph-container.graph-visible { opacity: 1; }

    .milestone-column {
      display: flex; flex-direction: column; align-items: center;
      font-family: Inter, Helvetica, Arial, sans-serif;
      width: 100%; height: 100%;
    }
    .milestone-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .milestone-big-dot { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; }
    .milestone-headline { font-size: 18px; font-weight: 700; line-height: 1.2; white-space: nowrap; }
    .milestone-spine { width: 2px; flex-shrink: 0; }
    .milestone-date { font-size: 12px; color: #888888; text-align: center; margin-top: 30px; }

    .subtitle-text { font-size: 13px; font-weight: 400; color: #888888; font-family: Inter, Helvetica, Arial, sans-serif; }

    .event-card-vertical {
      width: 100%; height: 100%; border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
      display: flex; align-items: center; justify-content: center;
      padding: 14px 8px; font-family: Inter, Helvetica, Arial, sans-serif;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: move;
    }
    .event-card-vertical:hover { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12); }
    .event-card-title {
      font-size: 11px; color: #333333; text-align: center;
      line-height: 1.4; word-break: break-word; pointer-events: none;
    }
  `)
}
