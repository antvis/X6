import React, { memo, useEffect, useRef, useState } from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Portal, ReactShape } from '@antv/x6-react-shape'
import '../index.less'

// You should do this outside your components
// (or make sure its not recreated on every render).
//
// 这个调用需要在组件外进行。
const X6ReactPortalProvider = Portal.getProvider()

const MyComponent = memo(
  ({ node, text }: { node?: ReactShape; text: string }) => {
    const color = Color.randomHex()
    return (
      <div
        style={{
          color: Color.invert(color, true),
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '60px',
          background: color,
        }}
      >
        {text}
      </div>
    )
  },
  (prev, next) => {
    return Boolean(next.node?.hasChanged('data'))
  },
)

export default () => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) {
      return
    }

    const graph = new Graph({
      container: container.current,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      data: {},
      xxx: {},
      component: <MyComponent text="Source" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      component: (node: Node) => {
        return <div>{node.attr('body/fill')}</div>
      },
      // component: () => <Test text="target" />,
    })

    graph.addEdge({
      source,
      target,
    })

    const update = () => {
      target.prop('attrs/body/fill', Color.randomHex())
      setTimeout(update, 1000)
    }

    update()

    console.log(graph.toJSON())
    return () => graph.dispose()
  }, [])

  const [counter, setCounter] = useState(0)

  return (
    <div className="x6-graph-wrap">
      <button onClick={() => setCounter((i) => i + 1)}>
        Counter: {counter}
      </button>
      <X6ReactPortalProvider />
      <div ref={container} className="x6-graph" />
    </div>
  )
}
