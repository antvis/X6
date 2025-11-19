import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  shape: 'polyline',
  x: 40,
  y: 40,
  width: 80,
  height: 80,
  label: 'polyline',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      // 指定 refPoints 属性，顶点随图形大小自动缩放
      // https://x6.antv.antgroup.com/api/registry/attr#refpointsresetoffset
      refPoints: '0,0 0,10 10,10 10,0',
    },
  },
})

graph.addNode({
  shape: 'polyline',
  x: 180,
  y: 40,
  width: 80,
  height: 80,
  label: 'polyline',
  // 使用 points 属性指定顶点，相当于指定 refPoints 属性
  // https://x6.antv.antgroup.com/api/registry/attr#refpointsresetoffset
  points: '0,0 0,10 10,10 10,0',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polyline',
  x: 320,
  y: 40,
  width: 80,
  height: 80,
  label: 'polyline',
  // 使用 points 属性指定顶点数组
  points: [
    [0, 0],
    [0, 10],
    [10, 10],
    [10, 0],
  ],
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polyline',
  x: 40,
  y: 180,
  width: 80,
  height: 80,
  label: 'polyline',
  // 使用 points 属性指定顶点数组
  points: [
    { x: 0, y: 0 },
    { x: 0, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 0 },
  ],
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polyline',
  x: 180,
  y: 210,
  width: 80,
  height: 80,
  label: 'polyline',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      // 直接指定 points 属性，多边形顶点不随随图形大小自动缩放
      points: '0,10 10,0 20,10 10,20',
    },
  },
})

graph.addNode({
  shape: 'polyline',
  x: 320,
  y: 180,
  width: 80,
  height: 80,
  attrs: {
    body: {
      fill: 'none',
      stroke: '#ffa940',
      refPoints: '0,40 40,40 40,80 80,80 80,120 120,120 120,160',
    },
  },
})
