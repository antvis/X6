import React from 'react'
import { Graph } from '@antv/x6'
import { register, getProvider } from '@antv/x6-react-shape'
import { Progress, Button } from 'antd'
import './index.less'

const X6ReactPortalProvider = getProvider() // 注意，一个 graph 只能申明一个 portal provider
const ProgressContext = React.createContext(30)

const NodeComponent = () => {
  const progress = React.useContext(ProgressContext)
  return (
    <div className="react-node">
      <Progress type="circle" percent={progress} width={80} />
    </div>
  )
}

register({
  shape: 'custom-portal-react-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  state = {
    progress: 30,
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addNode({
      shape: 'custom-portal-react-node',
      x: 60,
      y: 100,
    })

    graph.centerContent()
  }

  changeProgress = () => {
    this.setState({
      progress: (this.state.progress + 10) % 100,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-portal-app">
        <ProgressContext.Provider value={this.state.progress}>
          <X6ReactPortalProvider />
        </ProgressContext.Provider>
        <div className="app-btns">
          <Button onClick={this.changeProgress}>Add</Button>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
