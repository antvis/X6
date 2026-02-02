import React, { useContext, useEffect, useRef, useState } from 'react'
import { register, getProvider } from '@antv/x6-react-shape'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'
import './index.less'

const X6ReactPortalProvider = getProvider() // 注意，一个 graph 只能申明一个 portal provider
const ThemeContext = React.createContext('light')

const NodeComponent = () => {
  const theme = useContext(ThemeContext)

  return (
    <div className={`react-algo-node ${theme === 'light' ? 'light' : 'dark'}`}>
      <img
        src="https://gw.alipayobjects.com/zos/bmw-prod/d9f3b597-3a2e-49c3-8469-64a1168ed779.svg"
        alt=""
      />
      <span>逻辑回归</span>
    </div>
  )
}

register({
  shape: 'algo-node-2',
  width: 144,
  height: 28,
  effect: [],
  component: NodeComponent,
})

export const ReactPortalExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
    })

    graph.addNode({
      shape: 'algo-node-2',
      x: 80,
      y: 80,
      data: {
        name: '逻辑回归',
      },
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  const changeTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="x6-graph-wrap">
      <ThemeContext.Provider value={theme}>
        <X6ReactPortalProvider />
      </ThemeContext.Provider>
      <div className="x6-graph-tools">
        <Button onClick={changeTheme}>{theme === 'light' ? 'Dark' : 'Light'}</Button>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
