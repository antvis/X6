import { Graph } from '@antv/x6'
import insertCss from 'insert-css'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
})

graph.addEdge({
  source: { x: 240, y: 40 },
  target: { x: 280, y: 180 },
  vertices: [{ x: 240, y: 140 }],
})

graph.addEdge({
  source: { x: 340, y: 40 },
  target: { x: 380, y: 180 },
  vertices: [{ x: 340, y: 140 }],
  connector: {
    name: 'rounded',
    args: { radius: 10 },
  },
  attrs: {
    line: {
      targetMarker: 'classic',
      stroke: '#f5222d',
    },
  },
})

graph.addEdge({
  source: { x: 440, y: 40 },
  target: { x: 480, y: 180 },
  vertices: [{ x: 440, y: 140 }],
  connector: { name: 'smooth' },
  attrs: {
    line: {
      stroke: '#faad14',
      targetMarker: 'classic',
    },
  },
})

graph.addEdge({
  source: { x: 540, y: 40 },
  target: { x: 580, y: 180 },
  vertices: [{ x: 540, y: 140 }],
  connector: { name: 'smooth' },
  attrs: {
    line: {
      stroke: '#1890ff',
      strokeDasharray: 5,
      targetMarker: 'classic',
      style: {
        animation: 'ant-line 30s infinite linear',
      },
    },
  },
})

graph.addEdge({
  source: { x: 240, y: 240 },
  target: { x: 280, y: 380 },
  vertices: [{ x: 240, y: 340 }],
  router: { name: 'er' },
})

graph.addEdge({
  source: { x: 340, y: 240 },
  target: { x: 380, y: 380 },
  vertices: [{ x: 340, y: 340 }],
  router: { name: 'orth' },
  connector: { name: 'rounded' },
  attrs: {
    line: {
      targetMarker: 'classic',
      stroke: '#f5222d',
    },
  },
})

graph.addEdge({
  source: { x: 440, y: 240 },
  target: { x: 480, y: 380 },
  vertices: [{ x: 440, y: 340 }],
  router: { name: 'manhattan' },
  connector: { name: 'rounded' },
  attrs: {
    line: {
      stroke: '#faad14',
      targetMarker: 'classic',
    },
  },
})

graph.addEdge({
  source: { x: 540, y: 240 },
  target: { x: 580, y: 380 },
  vertices: [{ x: 540, y: 360 }],
  router: { name: 'metro' },
  attrs: {
    line: {
      stroke: '#1890ff',
      strokeDasharray: 5,
      targetMarker: 'classic',
    },
  },
})

// 我们用 insert-css 协助demo演示
// 实际项目中只要将下面样式添加到样式文件中
insertCss(`
  @keyframes ant-line {
    to {
        stroke-dashoffset: -1000
    }
  }
`)
