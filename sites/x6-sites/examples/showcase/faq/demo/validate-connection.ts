import { Graph, Edge, EdgeView, Shape } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
  connecting: {
    validateMagnet({ cell, magnet }) {
      let count = 0
      const connectionCount = magnet.getAttribute('connection-count')
      const max = connectionCount ? parseInt(connectionCount, 10) : Number.MAX_SAFE_INTEGER
      const outgoingEdges = graph.getOutgoingEdges(cell)
      if (outgoingEdges) {
        outgoingEdges.forEach((edge: Edge) => {
          const edgeView = graph.findViewByCell(edge) as EdgeView
          if (edgeView.sourceMagnet === magnet) {
            count += 1
          }
        })
      }
      return count < max
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
        line: {
          stroke: 'orange',
        },
      },
      })
    }
  }
})

graph.addNode({
  shape: 'rect',
  x: 280,
  y: 280,
  width: 160,
  height: 60,
  ports: [
    {
      id: 'a',
      attrs: {
        circle: {
          magnet: true,
          connectionCount: 3, // 自定义属性，控制连接桩可连接多少条边
        }
      },
      position: 'top'
    },
    {
      id: 'b',
      attrs: {
        circle: {
          magnet: true,
          connectionCount: 0, // 自定义属性，控制连接桩可连接多少条边
        }
      }
    },
  ],
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
      magnet: true,
      connectionCount: 2, // 自定义属性，控制节点可连接多少条边
    },
  },
})