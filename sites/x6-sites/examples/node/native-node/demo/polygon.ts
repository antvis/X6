import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  shape: 'polygon',
  x: 40,
  y: 40,
  width: 80,
  height: 80,
  label: 'polygon',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
      // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
      refPoints: '0,10 10,0 20,10 10,20',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 180,
  y: 40,
  width: 80,
  height: 80,
  label: 'polygon',
  // 使用 points 属性指定多边形的顶点，相当于指定多边形的 refPoints 属性
  // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
  points: '0,10 10,0 20,10 10,20',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 320,
  y: 40,
  width: 80,
  height: 80,
  label: 'polygon',
  // 使用 points 属性指定多边形的顶点数组
  points: [
    [0, 10],
    [10, 0],
    [20, 10],
    [10, 20],
  ],
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 460,
  y: 40,
  width: 80,
  height: 80,
  label: 'polygon',
  // 使用 points 属性指定多边形的顶点数组
  points: [
    { x: 0, y: 10 },
    { x: 10, y: 0 },
    { x: 20, y: 10 },
    { x: 10, y: 20 },
  ],
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 600,
  y: 70,
  width: 80,
  height: 80,
  label: 'polygon',
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
  shape: 'polygon',
  x: 40,
  y: 180,
  width: 80,
  height: 80,
  attrs: {
    body: {
      fill: '#73d13d',
      stroke: '#237804',
      refPoints: '0,100 50,25 50,75 100,0',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 180,
  y: 180,
  width: 80,
  height: 80,
  points: '100,10 40,198 190,78 10,78 160,198',
  attrs: {
    body: {
      fill: '#ffd591',
      stroke: '#ffa940',
      strokeWidth: 2,
      fillRule: 'evenodd',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 320,
  y: 180,
  width: 80,
  height: 80,
  points: '100,10 40,198 190,78 10,78 160,198',
  attrs: {
    body: {
      fill: '#ffd591',
      stroke: '#ffa940',
      strokeWidth: 2,
      fillRule: 'nonzero',
    },
  },
})

graph.addNode({
  shape: 'polygon',
  x: 460,
  y: 180,
  width: 80,
  height: 80,
  points:
    '26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182',
  attrs: {
    body: {
      fill: '#ED8A19',
      stroke: 'none',
    },
  },
})
