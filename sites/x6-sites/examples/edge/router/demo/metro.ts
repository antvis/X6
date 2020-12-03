import { Graph, Node, Edge, EdgeView } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const target = graph.addNode({
  x: 400,
  y: 260,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const obstacles: Node[] = []
const obstacle = graph.addNode({
  x: 240,
  y: 120,
  width: 80,
  height: 30,
  attrs: {
    body: {
      fill: '#ffd591',
      stroke: '#ffa940',
    },
  },
})

let edge: Edge

const update = () => {
  const edgeView = graph.findViewByCell(edge) as EdgeView
  edgeView.update()
}

obstacles.push(obstacle)
obstacles.push(graph.addNode(obstacle.clone().translate(100, 80)))
obstacles.push(graph.addNode(obstacle.clone().translate(-100, 140)))
obstacles.forEach((obstacle) => obstacle.on('change:position', update))

edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'metro',
    args: {
      startDirections: ['bottom'],
      endDirections: ['top'],
    },
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
