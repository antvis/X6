import { joint } from '@antv/x6'

const path1 = 'M 20 0 L 100 0 100 40 20 40 0 20 Z'
const path2 = 'M 20 0 L 100 0 80 20 100 40 20 40 0 20 Z'

export function render(graph: joint.Graph) {
  const nodes = createNodes(graph)
  graph.model.resetCells(nodes)

  const terminals = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 1, target: 7 },
    { source: 1, target: 8 },
    { source: 2, target: 9 },
    { source: 2, target: 10 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 4, target: 6 },
  ]

  terminals.forEach(item => {
    graph.addEdge({
      type: 'edge',
      zIndex: -1,
      source: nodes[item.source],
      target: nodes[item.target],
      attrs: {
        line: {
          class: 'line',
        },
      },
    })
  })
}

function createNodes(graph: joint.Graph) {
  return [
    graph.createNode({
      type: 'path',
      x: 75,
      y: 175,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'x6' },
        body: { refD: 'M 0 0 L 100 0 80 20 100 40 0 40 Z' },
      },
    }),
    graph.createNode({
      type: 'path',
      x: 200,
      y: 275,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'core' },
        body: { refD: path2 },
      },
    }),
    graph.createNode({
      type: 'path',
      x: 200,
      y: 75,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'geometry' },
        body: { refD: path2 },
      },
    }),
    graph.createNode({
      type: 'path',
      x: 200,
      y: 175,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'util' },
        body: { refD: path2 },
      },
    }),
    graph.createNode({
      type: 'path',
      x: 325,
      y: 175,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'array' },
        body: { refD: path2 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 450, y: 150 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'sortBy' },
        body: { refD: path1 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 450, y: 200 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'groupBy' },
        body: { refD: path1 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 325, y: 250 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'Cell' },
        body: { refD: path1 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 325, y: 300 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'View' },
        body: { refD: path1 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 325, y: 100 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'Rectangle' },
        body: { refD: path1 },
      },
    }),
    graph.createNode({
      type: 'path',
      position: { x: 325, y: 50 },
      size: { width: 100, height: 40 },
      attrs: {
        label: { text: 'Line' },
        body: { refD: path1 },
      },
    }),
  ]
}
