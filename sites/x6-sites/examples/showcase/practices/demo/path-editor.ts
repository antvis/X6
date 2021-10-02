import { Graph, Node, Edge, EdgeView } from '@antv/x6'

let edge: Edge | null = null
let node: Node | null = null
const container = document.getElementById('container')!

const graph = new Graph({
  container,
  grid: true,
})

const init = (pos: { x: number; y: number }) => {
  node = graph.addNode({
    shape: 'circle',
    width: 10,
    height: 10,
    ...pos,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
    },
  })
  edge = graph.addEdge({
    source: node.getBBox().center,
    target: pos,
    attrs: {
      line: {
        targetMarker: null,
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
  })
}

const addVertices = (pos: { x: number; y: number }) => {
  if (edge) {
    edge.appendVertex(pos)
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (edge) {
    const pos = graph.clientToLocal(e.clientX, e.clientY)
    edge.setTarget(pos)
  }
}

const print = () => {
  if (edge) {
    const view = graph.findViewByCell(edge) as EdgeView
    console.log(view.path.serialize())
  }
}

const finish = (closed: boolean) => {
  if (node && edge) {
    const vertices = edge.getVertices()
    if (closed) {
      if (vertices.length >= 2) {
        edge.setTarget(node.getBBox().center)
        graph.removeNode(node)
        node = null
        print()
      } else {
        graph.removeCells([node, edge])
        node = null
        edge = null
      }
    } else {
      if (vertices.length >= 1) {
        edge.setTarget(vertices[vertices.length - 1])
        graph.removeNode(node)
        node = null
        print()
      } else {
        graph.removeCells([node, edge])
        node = null
        edge = null
      }
    }
    container.removeEventListener('mousemove', onMouseMove)
  }
}

graph.on('blank:click', ({ e }) => {
  const pos = graph.clientToLocal(e.clientX, e.clientY)
  init(pos)
  container.addEventListener('mousemove', onMouseMove)
})

graph.on('edge:click', ({ e }) => {
  const pos = graph.clientToLocal(e.clientX, e.clientY)
  if (edge) {
    const nodes = graph.getNodesFromPoint(pos.x, pos.y)
    if (nodes.length && nodes[0] === node) {
      finish(true)
    } else {
      addVertices(pos)
    }
  }
})

graph.on('edge:contextmenu', () => {
  finish(false)
})
