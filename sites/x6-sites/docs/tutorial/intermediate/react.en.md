---
title: React Nodes
order: 4
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="In this chapter, you will learn"}
- How to use React components to render node content
- How to update node content
:::

## Rendering Nodes

We provide a standalone package `@antv/x6-react-shape` for rendering nodes using React.

:::warning{title=Note}
It is important to ensure that the version of x6 matches the version of x6-react-shape, meaning both packages need to use the same major version. For example, if X6 is using version 2.x, then x6-react-shape must also use version 2.x.
:::

:::warning{title=Note}
x6-react-shape only supports React 18 and above starting from version 2.0.8. If your project is using a version lower than React 18, please lock the version of x6-react-shape to 2.0.8.
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
  shape: 'custom-react-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

graph.addNode({
  shape: 'custom-react-node',
  x: 60,
  y: 100,
})
```

<code id="react-basic" src="@/src/tutorial/intermediate/react/basic/index.tsx"></code>

## Updating Nodes

Similar to `HTML`, when registering a node, you provide an `effect` field, which is an array of the current node's `props`. When any of the `props` included in the `effect` change, the current React component will be re-rendered.

```ts
register({
  shape: 'custom-react-node',
  width: 100,
  height: 100,
  effect: ['data'],
  component: NodeComponent,
})

const node = graph.addNode({
  shape: 'custom-react-node',
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

## Portal Mode

The rendering method of the above React component has a drawback, as it renders the component into the node's DOM using the following approach.

```ts
import { createRoot, Root } from 'react-dom/client'

const root = createRoot(container) // container is the node container
root.render(component)
```

As you can see, the React component is no longer part of the normal rendering document tree. Therefore, it cannot access external `Context` content. If you have such application scenarios, you can use the `Portal` mode to render React components.

<code id="react-portal" src="@/src/tutorial/intermediate/react/portal/index.tsx"></code>
