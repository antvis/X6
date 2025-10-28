import {
  ForceLayout,
  type Edge as LayoutEdge,
  type OutNode as LayoutNode,
} from '@antv/layout'
import { Graph, type Model, type Node } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const originData: {
  nodes: LayoutNode[]
  edges: LayoutEdge[]
} = {
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
      width: item.size as number,
      height: item.size as number,
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

// helper function to update node positions
function update() {
  for (const n of originData.nodes) {
    const node: Node = graph.getCellById(n.id) as Node
    node.position(n.x, n.y)
  }
}

// Store the current layout promise to prevent concurrent executions
let currentLayoutPromise: Promise<void> | null = null

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
  tick: update,
})

// Helper function to run layout and return a promise
function runLayout(): Promise<void> {
  return new Promise((resolve) => {
    // Set onLayoutEnd callback to resolve the promise
    forceLayout.updateCfg({
      onLayoutEnd: () => {
        currentLayoutPromise = null
        resolve()
      },
    } as any)

    // Start the layout
    forceLayout.layout(originData)
  })
}

// Helper to ensure layout runs, chaining if one is already running
async function scheduleLayout(): Promise<void> {
  if (currentLayoutPromise) {
    // Wait for current layout to finish, then run a new one
    await currentLayoutPromise
  }

  // Start new layout
  currentLayoutPromise = runLayout()
  return currentLayoutPromise
}

// initial render
const model = getModelFromOriginData(originData)
graph.fromJSON(model)

// run initial layout
scheduleLayout()

// rerun layout on node drag, keep the dragged node fixed
graph.on('node:moving', (e) => {
  // Update the fixed position immediately for responsive dragging
  for (const n of originData.nodes) {
    if (n.id === e.cell.id) {
      n.fx = e.x
      n.fy = e.y
    } else {
      delete n.fx
      delete n.fy
    }
  }

  // Schedule layout - will wait for current one to finish if running
  scheduleLayout()
})

// When node drag ends, ensure layout runs one final time
graph.on('node:moved', () => {
  // Schedule final layout - will chain after any running layout
  scheduleLayout()
})
