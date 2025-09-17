import React, { useContext } from 'react'
import { register, Portal } from '@antv/x6-react-shape'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'
import './index.less'

const X6ReactPortalProvider = Portal.getProvider() // 注意，一个 graph 只能申明一个 portal provider
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

export class ReactPortalExample extends React.Component {
  private container!: HTMLDivElement

  state = {
    theme: 'light',
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
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
  }

  changeTheme = () => {
    this.setState({
      theme: this.state.theme === 'light' ? 'dark' : 'light',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <ThemeContext.Provider value={this.state.theme}>
          <X6ReactPortalProvider />
        </ThemeContext.Provider>
        <div className="x6-graph-tools">
          <Button onClick={this.changeTheme}>
            {this.state.theme === 'light' ? 'Dark' : 'Light'}
          </Button>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
