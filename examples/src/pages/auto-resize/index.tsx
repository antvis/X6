import { SplitBox } from '@antv/x6-react-components'
import React, { useEffect, useRef } from 'react'
import '@antv/x6-react-components/es/split-box/style/index.css'
import { Graph, Scroller } from '@antv/x6'
import '../index.less'
import './index.less'

export const AutoResizeExample: React.FC = () => {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)
  const containerRef3 = useRef<HTMLDivElement>(null)
  const graphRef1 = useRef<Graph | null>(null)
  const graphRef2 = useRef<Graph | null>(null)
  const graphRef3 = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef1.current || !containerRef2.current || !containerRef3.current)
      return

    const graph1 = new Graph({
      container: containerRef1.current,
      background: {
        color: '#D94111',
      },
      autoResize: true,
    })

    const graph2 = new Graph({
      container: containerRef2.current,
      background: {
        color: '#90C54C',
      },
      autoResize: true,
    })

    const graph3 = new Graph({
      container: containerRef3.current,
      background: {
        color: '#0491E4',
      },
      autoResize: true,
    })
    graph3.use(new Scroller())

    graphRef1.current = graph1
    graphRef2.current = graph2
    graphRef3.current = graph3

    return () => {
      graph1.dispose()
      graph2.dispose()
      graph3.dispose()
      graphRef1.current = null
      graphRef2.current = null
      graphRef3.current = null
    }
  }, [])

  return (
    <div
      className="x6-graph-wrap"
      style={{ width: 800, height: 800, margin: '0 auto' }}
    >
      <SplitBox split="horizontal">
        <div className="full">
          <div ref={containerRef1} className="x6-graph" />
        </div>
        <SplitBox split="vertical">
          <div className="full">
            <div ref={containerRef2} className="x6-graph" />
          </div>
          <div className="full">
            <div ref={containerRef3} className="x6-graph" />
          </div>
        </SplitBox>
      </SplitBox>
    </div>
  )
}
