import { Edge, Graph, Shape } from '@antv/x6'
import React from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { Tooltip } from 'antd'

// 2.x的使用可以参考2.x文档： https://x6-v2.antv.vision/examples/edge/tool/#tooltip

Shape.Rect.config({
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
      },
      out: {
        position: { name: 'bottom' },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        r: 5,
        magnet: true,
        stroke: '#31d0c6',
        fill: '#fff',
        strokeWidth: 2,
      },
    },
  ],
})

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a',
    },
  },
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    allowNode: false,
    highlight: true,
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group') !== 'in'
    },

    validateConnection({ sourceMagnet, targetMagnet }) {
      // 只能从输出连接桩创建连接
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
        return false
      }

      // 只能连接到输入连接桩
      if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      return true
    },
  },
})

const source = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  ports: [{ id: 'out-2', group: 'out' }],
})

const target = graph.addNode({
  x: 140,
  y: 240,
  width: 100,
  height: 40,
  ports: [{ id: 'in-1', group: 'in' }],
})

graph.addEdge({
  source: { cell: source.id, port: 'out-2' },
  target: { cell: target.id, port: 'in-1' },
})

let tooltipRoot: Root | null = null
let tooltipContainer: HTMLDivElement | null = null
let currentEdgeId: string | null = null

// 显示 Tooltip
function showTooltip(cell: Edge, x: number, y: number) {
  // 如果是同一条边，只更新位置
  if (currentEdgeId === cell.id && tooltipContainer) {
    tooltipContainer.style.left = `${x + 6}px`
    tooltipContainer.style.top = `${y - 6}px`
    return
  }

  // 隐藏之前的 tooltip
  hideTooltip()

  currentEdgeId = cell.id

  // 创建 tooltip 容器
  tooltipContainer = document.createElement('div')
  tooltipContainer.style.cssText = `
    position: fixed;
    left: ${x + 6}px;
    top: ${y - 6}px;
    z-index: 9999;
    pointer-events: none;
  `
  document.body.appendChild(tooltipContainer)

  // 获取边的信息
  const sourceNode = graph.getCellById(cell.getSourceCellId())
  const targetNode = graph.getCellById(cell.getTargetCellId())

  // Tooltip 内容
  const tooltipContent = (
    <div>
      <div>
        <strong>边信息</strong>
      </div>
      <div>ID: {cell.id}</div>
      <div>源节点: {sourceNode?.id || 'Unknown'}</div>
      <div>目标节点: {targetNode?.id || 'Unknown'}</div>
    </div>
  )

  // 渲染 Tooltip
  tooltipRoot = createRoot(tooltipContainer)
  tooltipRoot.render(
    React.createElement(
      Tooltip,
      {
        open: true,
        title: tooltipContent,
        placement: 'right',
      },
      React.createElement('span', {
        style: { display: 'inline-block', width: 0, height: 0 },
      }),
    ),
  )
}

// 隐藏 Tooltip
function hideTooltip() {
  if (tooltipRoot) {
    tooltipRoot.unmount()
    tooltipRoot = null
  }
  if (tooltipContainer && tooltipContainer.parentNode) {
    tooltipContainer.parentNode.removeChild(tooltipContainer)
    tooltipContainer = null
  }
  currentEdgeId = null
}

// 监听边的 hover 事件
graph.on('edge:mouseenter', ({ cell, e }: { cell: Edge; e: MouseEvent }) => {
  showTooltip(cell, e.clientX, e.clientY)
})

graph.on('edge:mouseleave', () => {
  hideTooltip()
})
