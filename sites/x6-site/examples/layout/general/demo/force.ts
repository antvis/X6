import { Graph, Model } from '@antv/x6'
import { ForceLayout } from '@antv/layout'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const originData = {
  nodes: [
    { id: 'node0', size: 50, x: 0, y: 0 },
    { id: 'node1', size: 30, x: 0, y: 0 },
    { id: 'node2', size: 30, x: 0, y: 0 },
    { id: 'node3', size: 30, x: 0, y: 0 },
    { id: 'node4', size: 30, x: 0, y: 0 },
    { id: 'node5', size: 30, x: 0, y: 0 },
    { id: 'node6', size: 15, x: 0, y: 0 },
    { id: 'node7', size: 15, x: 0, y: 0 },
    { id: 'node8', size: 15, x: 0, y: 0 },
    { id: 'node9', size: 15, x: 0, y: 0 },
    { id: 'node10', size: 15, x: 0, y: 0 },
    { id: 'node11', size: 15, x: 0, y: 0 },
    { id: 'node12', size: 15, x: 0, y: 0 },
    { id: 'node13', size: 15, x: 0, y: 0 },
    { id: 'node14', size: 15, x: 0, y: 0 },
    { id: 'node15', size: 15, x: 0, y: 0 },
    { id: 'node16', size: 15, x: 0, y: 0 },
  ],
  edges: [
    { source: 'node0', target: 'node1' },
    { source: 'node0', target: 'node2' },
    { source: 'node0', target: 'node3' },
    { source: 'node0', target: 'node4' },
    { source: 'node0', target: 'node5' },
    { source: 'node1', target: 'node6' },
    { source: 'node1', target: 'node7' },
    { source: 'node2', target: 'node8' },
    { source: 'node2', target: 'node9' },
    { source: 'node2', target: 'node10' },
    { source: 'node2', target: 'node11' },
    { source: 'node2', target: 'node12' },
    { source: 'node2', target: 'node13' },
    { source: 'node3', target: 'node14' },
    { source: 'node3', target: 'node15' },
    { source: 'node3', target: 'node16' },
  ],
}

const getModelFromOriginData = (data: typeof originData) => {
  const model: Model.FromJSONData = {
    nodes: [],
    edges: [],
  }
  originData.nodes.forEach((item) => {
    model.nodes?.push({
      id: item.id,
      shape: 'circle',
      width: item.size,
      height: item.size,
      x: item.x,
      y: item.y,
      attrs: {
        body: {
          fill: '#5F95FF',
          stroke: 'transparent',
        },
      },
    })
  })
  originData.edges.forEach((item) => {
    model.edges?.push({
      source: item.source,
      target: item.target,
      attrs: {
        line: {
          stroke: '#A2B1C3',
          strokeWidth: 2,
          targetMarker: null,
        },
      },
    })
  })
  return model
}

const forceLayout = new ForceLayout({
  type: 'force',
  center: [369, 180],
  preventOverlap: true,
  linkDistance: (d) => {
    if (d.source.id === 'node0') {
      return 100
    }
    return 30
  },
  nodeStrength: (d) => {
    if (d.isLeaf) {
      return -50
    }
    return -10
  },
  edgeStrength: (d) => {
    if (
      d.source.id === 'node1' ||
      d.source.id === 'node2' ||
      d.source.id === 'node3'
    ) {
      return 0.7
    }
    return 0.1
  },
  tick: () => {
    const model = getModelFromOriginData(originData)
    graph.fromJSON(model)
  },
})
forceLayout.layout(originData)
