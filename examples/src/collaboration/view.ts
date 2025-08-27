import { type Graph, Vector } from '../../../src'
import type { IGraphDataObject, IUser } from './dataObject'

export function connectGraph(graphDataObject: IGraphDataObject, graph: Graph) {
  const updateCell = (id: string, attributes: any) => {
    const cell = graph.getCellById(id)
    if (cell) {
      if (attributes) {
        cell.setProp(attributes)
      } else {
        cell.remove()
      }
    } else {
      if (!attributes) return
      if (attributes.shape === 'dag-edge') {
        graph.addEdge(attributes)
      } else if (attributes.shape === 'dag-node') {
        graph.addNode(attributes)
      }
    }
  }

  graphDataObject.cells.forEach((cell) => {
    updateCell(cell.id, cell)
  })

  graphDataObject.on('cellChanged', updateCell)

  graph.on('cell:added', ({ cell }) => {
    graphDataObject.setCell(cell.id, cell.prop())
  })

  graph.on('cell:change:*', ({ cell }) => {
    graphDataObject.setCell(cell.id, cell.prop())
  })

  graph.on('cell:removed', ({ cell }) => {
    graphDataObject.deleteCell(cell.id)
  })

  const remoteCursors: { [userId: string]: Vector } = {}

  graphDataObject.on(
    'userChanged',
    (id: string, user: IUser, previous: IUser) => {
      if (user.selection) {
        const cell = graph.getCellById(user.selection)
        if (cell) {
          graph.select(cell)
        }
      }

      if (previous?.selection && previous.selection !== user.selection) {
        const cell = graph.getCellById(previous.selection)
        if (cell) {
          graph.unselect(cell)
        }
      }

      if (id === graphDataObject.userId) return
      let circle: Vector
      if (!remoteCursors[id]) {
        circle = Vector.create('circle').attr({
          r: 5,
          'pointer-events': 'none',
        })
        circle.appendTo(graph.view.decorator)
        remoteCursors[id] = circle
      } else {
        circle = remoteCursors[id]
      }
      circle.attr({ cx: user.x || 0, cy: user.y || 0, fill: user.color })
    },
  )

  graph.container.addEventListener('mousemove', (evt: any) => {
    const point = graph.clientToLocal(evt.clientX, evt.clientY)
    graphDataObject.updateUser(point.toJSON())
  })

  graph.on('node:click', ({ cell }) => {
    graphDataObject.updateUser({ selection: cell.id })
  })

  graph.on('blank:click', () => {
    graphDataObject.updateUser({ selection: '' })
  })
}
