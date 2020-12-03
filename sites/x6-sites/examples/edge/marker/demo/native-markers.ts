import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// 内置箭头：https://x6.antv.vision/zh/docs/tutorial/intermediate/marker#%E5%86%85%E7%BD%AE%E7%AE%AD%E5%A4%B4

const markers = [
  ['block', { size: 6 }],
  ['classic', { size: 6 }],
  ['diamond', { size: 8 }],
  ['circle', { size: 6 }],
  ['circlePlus', { size: 6 }],
  ['ellipse', { rx: 6, ry: 4 }],
  ['cross', { size: 8, offset: 1 }],
  ['async', { size: 8, offset: 1 }],
]

markers.forEach(([marker, args], i) => {
  graph.addEdge({
    sourcePoint: [220, 30 + i * 40],
    targetPoint: [500, 30 + i * 40],
    label: marker,
    attrs: {
      line: {
        sourceMarker: {
          args,
          name: marker,
        },
        targetMarker: {
          args,
          name: marker,
        },
        strokeWidth: 1,
      },
    },
  })
})
