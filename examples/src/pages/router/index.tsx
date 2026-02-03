import React, { useEffect, useRef, useState } from 'react'
import { Radio } from 'antd'
import { Graph, Edge, EdgeView } from '@antv/x6'
import '../index.less'

export const RouterExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const edgeRef = useRef<Edge | null>(null)

  const [router, setRouter] = useState('manhattan')
  const [connector, setConnector] = useState('rounded')

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1000,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'rect',
      position: { x: 50, y: 50 },
      size: { width: 140, height: 70 },
      attrs: {
        body: {
          fill: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: '#f7a07b' },
              { offset: '100%', color: '#fe8550' },
            ],
            attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
          },
          stroke: '#ed8661',
          strokeWidth: 2,
        },
        label: {
          text: 'Source',
          fill: '#f0f0f0',
          fontSize: 18,
          fontWeight: 'lighter',
          fontVariant: 'small-caps',
        },
      },
    })

    const target = source
      .clone()
      .translate(750, 400)
      .setAttrByPath('label/text', 'Target')

    graph.addNode(target)

    const edge = graph.addEdge({
      source,
      target,
      router: { name: router },
      connector: { name: connector },
      attrs: {
        connection: {
          stroke: '#333333',
          strokeWidth: 3,
        },
      },
    })

    edgeRef.current = edge

    const obstacle = source
      .clone()
      .translate(300, 100)
      .setAttrs({
        label: {
          text: 'Obstacle',
          fill: '#eee',
        },
        body: {
          fill: {
            stops: [{ color: '#b5acf9' }, { color: '#9687fe' }],
          },
          stroke: '#8e89e5',
          strokeWidth: 2,
        },
      })

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacle.on('change:position', update)

    graph.addNode(obstacle)
    graph.addNode(obstacle.clone().translate(200, 100))
    graph.addNode(obstacle.clone().translate(-200, 150))

    return () => {
      graph.dispose()
      edgeRef.current = null
    }
  }, [])

  const onRouterChange = (e: any) => {
    const val = e.target.value
    setRouter(val)
    if (edgeRef.current) {
      if (val === 'none') {
        edgeRef.current.removeRouter()
      } else {
        edgeRef.current.setRouter(val)
      }
    }
  }

  const onConnectorChange = (e: any) => {
    const val = e.target.value
    setConnector(val)
    if (edgeRef.current) {
      if (val === 'narmal') {
        edgeRef.current.removeConnector()
      } else {
        edgeRef.current.setConnector(val)
      }
    }
  }

  return (
    <div className="x6-graph-wrap">
      <div className="x6-graph-tools">
        <div>
          <span style={{ display: 'inline-block', width: 88 }}>Connector:</span>
          <Radio.Group onChange={onConnectorChange} value={connector}>
            <Radio.Button value="narmal">Normal</Radio.Button>
            <Radio.Button value="smooth" disabled={router !== 'none'}>
              Smooth
            </Radio.Button>
            <Radio.Button value="rounded">Rounded</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ padding: '16px 0' }}>
          <span style={{ display: 'inline-block', width: 88 }}>Router:</span>
          <Radio.Group onChange={onRouterChange} value={router}>
            <Radio.Button value="none">None</Radio.Button>
            <Radio.Button value="orth">Orthogonal</Radio.Button>
            <Radio.Button value="manhattan">Manhattan</Radio.Button>
            <Radio.Button value="metro">Metro</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
