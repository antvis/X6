---
title: React 节点
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title="在本章节中主要介绍 React 节点相关的知识，通过阅读，你可以了解到"}

- 如何使用 React 组件来渲染节点内容
- 如何更新节点内容

:::

## 渲染节点

我们提供了一个独立的包 `@antv/x6-react-shape`，用于通过 React 渲染节点。

:::warning{title=注意}
版本兼容关系：X6 1.x 使用 x6-react-shape 1.x；X6 2.x 和 3.x 版本均使用 x6-react-shape 2.x。
:::

:::warning{title=注意}
x6-react-shape 自 2.0.8 起仅支持 React 18 及以上；若项目低于 React 18，请将 x6-react-shape 锁定到 2.0.8。
:::

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

<code id="react-basic" src="@/src/tutorial/intermediate/react/basic/index.tsx"></code>

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

<code id="react-update" src="@/src/tutorial/intermediate/react/update/index.tsx"></code>

## Portal 方式

上述渲染方式有一个缺点：组件会被直接渲染到节点的 DOM 中，方式如下。

```ts
import { createRoot, Root } from 'react-dom/client'

const root = createRoot(container) // container 为节点容器
root.render(component)
```

此时组件不在常规渲染树中，因而无法访问外部 `Context`。若有此需求，请使用 `Portal` 模式来渲染 React 组件。

<code id="react-portal" src="@/src/tutorial/intermediate/react/portal/index.tsx"></code>
