---
title: 快速上手
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## 安装

可以通过任意你使用的包管理工具来安装 X6。
:::code-group

```shell [npm]
npm install @antv/x6 --save
```

```shell [yarn]
yarn add @antv/x6
```

```bash [pnpm]
pnpm add @antv/x6
```

:::

如果使用 `umd` 包，可以使用下面三个 CDN 中的任何一个，默认使用 X6 的最新版：

- <https://unpkg.com/@antv/x6/dist/index.js>
- <https://cdn.jsdelivr.net/npm/@antv/x6/dist/index.js>
- <https://cdnjs.cloudflare.com/ajax/libs/antv-x6/2.18.1/index.js>

## 开始使用

在项目中安装或者引入完成 X6 之后就可以开始使用了，我们将以一个简单的例子开始体验 X6，再开始之前也强烈推荐先学习一些 [SVG 基础知识](https://codepen.io/HunorMarton/full/PoGbgqj)，不过没有 SVG 相关知识也可以轻松上手～

### 1. 初始化画布

在创建画布之前，首先需要在页面中创建一个 **画布容器** 用于挂载画布：

```html
<div id="container"></div>
```

然后初始化画布对象，可以通过配置设置画布的样式，比如背景颜色：

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  // 设置画布大小
  width: 800,
  height: 600,
  // 设置画布背景颜色
  background: {
    color: '#F2F7FA',
  },
})
```

### 2. 渲染节点和边

创建画布后，可在其中添加**节点**和**边**。X6 支持 JSON 格式数据，该对象中 `nodes` 代表节点数据，`edges` 代表边数据，可以使用 `attrs` 属性来定制节点和边的样式（可以类比 CSS）。

这样我们就得到了一个基础的 X6 画布：

```js | ob { inject: true }
import { Graph } from '@antv/x6'

const data = {
  // 表示节点
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  // 表示边
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  // 设置画布背景颜色
  background: {
    color: '#F2F7FA',
  },
})

graph.fromJSON(data) // 渲染元素
graph.centerContent() // 居中显示
```

### 3. 前端框架集成

X6 是基于 js 开发的包，不依赖任何的前端框架，可以在`html`中使用，也可以任意 js 框架中使用，但是实际开发中大多数业务都是在使用`React`、`Vue` 等前端框架进行开发，X6 也可以很简单地在这些框架中进行使用，下面的例子实现了上面 [步骤2渲染节点和边章节](#2-渲染节点和边) 相同的效果：
:::code-group

```jsx [React]
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const data = {
      nodes: [
        {
          id: 'node1',
          shape: 'rect',
          x: 40,
          y: 40,
          width: 100,
          height: 40,
          label: 'hello',
          attrs: {
            // body 是选择器名称，选中的是 rect 元素
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
        {
          id: 'node2',
          shape: 'rect',
          x: 160,
          y: 180,
          width: 100,
          height: 40,
          label: 'world',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
      ],
      edges: [
        {
          shape: 'edge',
          source: 'node1',
          target: 'node2',
          label: 'x6',
          attrs: {
            // line 是选择器名称，选中的边的 path 元素
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    }

    const graph = new Graph({
      container: this.container,
      width: 500,
      height: 300,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data) // 渲染元素
    graph.centerContent() // 居中显示
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app-content" ref={this.refContainer} />
    )
  }
}

```

```vue [Vue]
<template>
  <div class="app-content">
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Graph } from '@antv/x6'

export default defineComponent({
  name: 'App',
  mounted() {
     const data = {
      nodes: [
        {
          id: 'node1',
          shape: 'rect',
          x: 40,
          y: 40,
          width: 100,
          height: 40,
          label: 'hello',
          attrs: {
            // body 是选择器名称，选中的是 rect 元素
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
        {
          id: 'node2',
          shape: 'rect',
          x: 160,
          y: 180,
          width: 100,
          height: 40,
          label: 'world',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
      ],
      edges: [
        {
          shape: 'edge',
          source: 'node1',
          target: 'node2',
          label: 'x6',
          attrs: {
            // line 是选择器名称，选中的边的 path 元素
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    }

    const graph = new Graph({
      container: document.getElementById('container'),
      width: 500,
      height: 300,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data) // 渲染元素
    graph.centerContent() // 居中显示
  }
});
</script>
```

```ts [Angular]
// app.component.html
<div>
  <h1>{{ title }}</h1>
  <div #container></div>
</div>

// app.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Graph } from '@antv/x6'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('container') container: ElementRef;

  ngAfterViewInit() {
    const data = {
      nodes: [
        {
          id: 'node1',
          shape: 'rect',
          x: 40,
          y: 40,
          width: 100,
          height: 40,
          label: 'hello',
          attrs: {
            // body 是选择器名称，选中的是 rect 元素
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
        {
          id: 'node2',
          shape: 'rect',
          x: 160,
          y: 180,
          width: 100,
          height: 40,
          label: 'world',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
      ],
      edges: [
        {
          shape: 'edge',
          source: 'node1',
          target: 'node2',
          label: 'x6',
          attrs: {
            // line 是选择器名称，选中的边的 path 元素
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    }

    const graph = new Graph({
      container: this.container.nativeElement,
      height: 300,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data) // 渲染元素
    graph.centerContent() // 居中显示
  }
}
```

:::

在上面的例子中，都使用了内置的`rect`节点，除此之外 X6 还支持使用框架组件来自定义节点，例如使用 `React` 组件、`Vue` 组件来渲染节点，这些进阶内容我们会在后续的章节中详细介绍，你也可以提前了解：

- [React 节点](/tutorial/intermediate/react)
- [Vue 节点](/tutorial/intermediate/vue)
- [Angular 节点](/tutorial/intermediate/angular)
- [HTML 节点](/tutorial/intermediate/html)

### 4. 使用插件

除了基本的元素渲染能力，X6 还内置了大量的图编辑配套插件，使用这些成熟的插件，能很大程度上降低开发成本。例如下面为画布增加对齐线功能，**当移动的节点与其他节点对齐时，会自动出现对齐线**，可以方便用户进行位置排版。

```ts
import { Snapline } from '@antv/x6'

graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

```js | ob { inject: true, pin:false }
import { Graph, Snapline } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

graph.use(
  new Snapline({
    enabled: true,
  }),
)
graph.fromJSON(data) // 渲染元素
graph.centerContent() // 居中显示
```

更多插件会在后续章节中详细介绍。

### 5. 数据导出

在上面 [步骤2渲染节点和边章节](#2-渲染节点和边) 中可以看到，可以使用 `fromJSON` 将 `JSON` 数据渲染到画布中，当然，也支持将画布中的数据导出成 `JSON`，这样我们就可以将画布数据序列化后存储到服务端。

```ts
graph.toJSON()
```

我们的演示 demo 就到这里了，想继续了解 X6 的一些能力，可以从[基础教程](/tutorial/basic/graph)开始阅读。
