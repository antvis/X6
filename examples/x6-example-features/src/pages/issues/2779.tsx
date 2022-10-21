import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

const Example = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const graph = new Graph({
      container: containerRef.current!,
      width: 800,
      height: 800,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        connectionPoint: {
          name: 'anchor',
        },
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          })
        },
      },
    })

    graph.addNode({
      id: '1',
      shape: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 40,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
          magnet: true,
        },
      },
    })

    graph.addNode({
      id: '2',
      shape: 'rect',
      x: 400,
      y: 300,
      width: 100,
      height: 40,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        'source-arrowhead',
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    graph.on('edge:connected', ({ e, currentCell, edge, type }) => {
      console.log('trigger edge:connected!')
      if (currentCell) {
        const isTarget = type === 'target'
        const { clientX, clientY } = e
        const bbox = currentCell.getBBox()
        const { topLeft, width, height } = bbox
        const pos = graph.localToClient(topLeft)
        const dx = clientX - pos.x
        const dy = clientY - pos.y
        const refDx = ((dx / width) * 100).toFixed(3) + '%'
        const refDy = ((dy / height) * 100).toFixed(3) + '%'

        if (isTarget) {
          edge.setTarget({
            cell: currentCell.id,
            anchor: {
              name: 'topLeft',
              args: {
                dx: refDx,
                dy: refDy,
                rotate: true,
              },
            },
          })
        } else {
          edge.setSource({
            cell: currentCell.id,
            anchor: {
              name: 'topLeft',
              args: {
                dx: refDx,
                dy: refDy,
                rotate: true,
              },
            },
          })
        }
      }
    })
  }, [])

  return (
    <div className="app">
      <div className="graph" ref={containerRef}></div>
    </div>
  )
}

export default Example
