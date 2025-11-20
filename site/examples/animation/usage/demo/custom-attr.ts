import { Dom, Graph, Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    // 自定义的html节点接收一个面积数据来控制div大小，可以对该自定义属性添加动画效果
    const { ratio } = cell.getData() ?? {}
    const div = document.createElement('div')
    const area = 12000
    const width = Math.sqrt(area / ratio)
    const height = width * ratio
    Dom.css(div, {
      width,
      height,
      background: '#72C240',
      borderRadius: 10,
    })

    return div
  },
})

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  shape: 'custom-html',
  x: 80,
  y: 80,
  data: { ratio: 1 },
  animation: [
    // 对自定义节点的面积数据添加动画效果
    [{ 'data/ratio': 3 / 5 }, { duration: 1000, iterations: Infinity }],
  ],
})
