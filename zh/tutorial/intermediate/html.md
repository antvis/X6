---
title: "HTML 节点"
description: "HTML 节点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/intermediate/html/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍 HTML 节点相关的知识，通过阅读，你可以了解到**

- 如何使用 HTML 来渲染节点内容
- 如何更新节点内容


## 渲染节点

X6 默认内置 `HTML` 渲染能力，使用方法也非常简单：

```ts
import { Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  html() {
    const div = document.createElement('div')
    div.className = 'custom-html'
    return div
  },
})

graph.addNode({
  shape: 'custom-html',
  x: 60,
  y: 100,
})
```

下面例子中，在 `HTML` 标签上加上悬浮动画效果，使用 `SVG` 实现起来会非常复杂。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html() {
    const div = document.createElement('div')
    div.className = 'custom-html'
    return div
  },
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
      shape: 'custom-html',
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
      <div className="html-basic-app">
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

在注册节点时，提供 `effect` 字段（当前节点的 `prop` 数组）。当 `effect` 中任一 `prop` 发生变化时，会重新执行 `html` 方法，返回新的 DOM，从而更新节点内容。

```ts
Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const { color } = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.style.background = color
    return div
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Shape, Color } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-update-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const { color } = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.style.background = color
    return div
  },
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
      shape: 'custom-update-html',
      x: 60,
      y: 100,
      data: {
        color: '#333232',
      },
    })

    setInterval(() => {
      node.setData({
        color: Color.randomHex(),
      })
    }, 2000)

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="html-update-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/tutorial/intermediate/html/basic/index.less

```less
.html-basic-app {
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

  .custom-html {
    width: 100%;
    height: 100%;
    background: #333232;
    border-radius: 1em;
    box-shadow: 0 0.125em 0.3125em rgb(0 0 0 / 25%),
      0 0.02125em 0.06125em rgb(0 0 0 / 25%);
    perspective: 600px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
      background: #333232
        linear-gradient(180deg, rgb(0 0 0 / 10%) 50%, rgb(0 0 0 / 40%));
      border-radius: 0 0 1em 1em;
      transform: rotateX(180deg);
      transform-origin: center top;
      transition: 0.7s ease-in-out transform;
      content: ' ';
    }

    &:hover::before {
      transform: rotateX(0);
    }
  }
}
```
### docs/demos/tutorial/intermediate/html/update/index.less

```less
.html-update-app {
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

  .custom-html {
    width: 100%;
    height: 100%;
    background: #333232;
    border-radius: 1em;
    box-shadow: 0 0.125em 0.3125em rgb(0 0 0 / 25%),
      0 0.02125em 0.06125em rgb(0 0 0 / 25%);
    perspective: 600px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
      background: #333232
        linear-gradient(180deg, rgb(0 0 0 / 10%) 50%, rgb(0 0 0 / 40%));
      border-radius: 0 0 1em 1em;
      transform: rotateX(180deg);
      transform-origin: center top;
      transition: 0.7s ease-in-out transform;
      content: ' ';
    }

    &:hover::before {
      transform: rotateX(0);
    }
  }
}
```
