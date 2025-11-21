---
title: React Nodes
order: 4
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="This chapter mainly introduces knowledge related to React nodes. By reading, you can learn"}

- How to use React components to render node content
- How to update node content

:::

## Rendering Nodes

We provide a standalone package `@antv/x6-react-shape` for rendering nodes with React.

:::warning{title=Note}
Version compatibility: X6 1.x uses x6-react-shape 1.x; X6 2.x and 3.x use x6-react-shape 2.x.
:::

:::warning{title=Note}
Since 2.0.8, x6-react-shape supports React 18+. If your project uses React < 18, lock x6-react-shape to 2.0.8.
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

<code id="react-update" src="@/src/tutorial/intermediate/react/update/index.tsx"></code>

## Portal Mode

The approach above renders the component directly into the node’s DOM:

```ts
import { createRoot, Root } from 'react-dom/client'

const root = createRoot(container) // container is the node container
root.render(component)
```

This detaches the component from the normal React tree, so it cannot access external `Context`. Use `Portal` mode when you need access to app-level context.

<code id="react-portal" src="@/src/tutorial/intermediate/react/portal/index.tsx"></code>
