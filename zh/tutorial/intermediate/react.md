---
title: "React 节点"
description: "React 节点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/intermediate/react/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍 React 节点相关的知识，通过阅读，你可以了解到**

- 如何使用 React 组件来渲染节点内容
- 如何更新节点内容


## 渲染节点

我们提供了一个独立的包 `@antv/x6-react-shape`，用于通过 React 渲染节点。

> **注意**

版本兼容关系：X6 3.x 须使用 x6-react-shape 3.x 版本。同时 x6-react-shape 自 2.0.8 起仅支持 React 18 及以上；若项目低于 React 18，请将 x6-react-shape 锁定到 2.0.8 并使用 X6 2.x。

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



## 更新节点

与 `HTML` 类似，注册节点时可提供 `effect` 字段（当前节点的 `props` 数组）。当 `effect` 中任一 `prop` 发生变化时，会重新渲染对应的 React 组件。

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



## Portal 方式

上述渲染方式有一个缺点：组件会被直接渲染到节点的 DOM 中，方式如下。

```ts
import { createRoot, Root } from 'react-dom/client'

const root = createRoot(container) // container 为节点容器
root.render(component)
```

此时组件不在常规渲染树中，因而无法访问外部 `Context`。若有此需求，请使用 `Portal` 模式来渲染 React 组件。



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
