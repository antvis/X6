import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { register, getProvider } from '@antv/x6-react-shape'
import { Progress, Button } from 'antd'

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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.react-portal-app {
  padding: 0;
  font-family: sans-serif;
}
.react-portal-app .app-btns {
  bottom: 0;
  margin: 0;
  padding: 0 8px;
}
.react-portal-app .app-content {
  width: 100%;
  height: 240px;
  margin: 0;
  margin-top: 16px;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1);
}
.react-portal-app .react-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #8f8f8f;
  border-radius: 6px;
}
`)
