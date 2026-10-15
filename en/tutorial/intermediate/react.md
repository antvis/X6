---
title: "React Nodes"
description: "React Nodes"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/intermediate/react/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to React nodes. By reading, you can learn**

- How to use React components to render node content
- How to update node content


## Rendering Nodes

We provide a standalone package `@antv/x6-react-shape` for rendering nodes with React.

> **Note**

Version compatibility: X6 3.x must use x6-react-shape 3.x. Since 2.0.8, x6-react-shape supports React 18+ only; if your project uses React < 18, lock x6-react-shape to 2.0.8 and use X6 2.x.

```ts
import { register } from '@antv/x6-react-shape'

const NodeComponent = () => {
  return (
    <div className="react-node">
      <Progress type="circle" percent={30} width={80} />
    </div>
  )
}

register({
  shape: 'custom-basic-react-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

graph.addNode({
  shape: 'custom-basic-react-node',
  x: 60,
  y: 100,
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Progress } from 'antd'

const NodeComponent = () => {
  return (
    <div className="react-node">
      <Progress type="circle" percent={30} width={80} />
    </div>
  )
}

register({
  shape: 'custom-basic-react-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addNode({
      shape: 'custom-basic-react-node',
      x: 60,
      y: 100,
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Updating Nodes

Similar to `HTML`, register a node with an `effect` field—an array of the node’s `props`. When any listed prop changes, the React component re-renders.

```ts
register({
  shape: 'custom-update-react-node',
  width: 100,
  height: 100,
  effect: ['data'],
  component: NodeComponent,
})

const node = graph.addNode({
  shape: 'custom-update-react-node',
  x: 60,
  y: 100,
  data: {
    progress: 30,
  },
})

setInterval(() => {
  const { progress } = node.getData<{ progress: number }>()
  node.setData({
    progress: (progress + 10) % 100,
  })
}, 1000)
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Progress } from 'antd'

const NodeComponent = ({ node }: { node: Node }) => {
  const { progress } = node.getData()
  return (
    <div className="react-node">
      <Progress type="circle" percent={progress} width={80} />
    </div>
  )
}

register({
  shape: 'custom-update-react-node',
  width: 100,
  height: 100,
  effect: ['data'],
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const node = graph.addNode({
      shape: 'custom-update-react-node',
      x: 60,
      y: 100,
      data: {
        progress: 30,
      },
    })

    setInterval(() => {
      const { progress } = node.getData<{ progress: number }>()
      node.setData({
        progress: (progress + 10) % 100,
      })
    }, 1000)

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-update-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Portal Mode

The approach above renders the component directly into the node’s DOM:

```ts
import { createRoot, Root } from 'react-dom/client'

const root = createRoot(container) // container is the node container
root.render(component)
```

This detaches the component from the normal React tree, so it cannot access external `Context`. Use `Portal` mode when you need access to app-level context.



```ts
import './index.less'
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
```
### docs/demos/tutorial/intermediate/react/basic/index.less

```less
.react-basic-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .react-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
  }
}
```
### docs/demos/tutorial/intermediate/react/update/index.less

```less
.react-update-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .react-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
  }
}
```
### docs/demos/tutorial/intermediate/react/portal/index.less

```less
.react-portal-app {
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    bottom: 0;
    margin: 0;
    padding: 0 8px;
  }

  .app-content {
    width: 100%;
    height: 240px;
    margin: 0;
    margin-top: 16px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }

  .react-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
  }
}
```
