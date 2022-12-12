---
title: React 节点
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中，你可以了解到：}

- 如何使用 React 组件来渲染节点内容
- 如何更新节点内容
  :::

## 渲染节点

我们提供了一个独立的包 `@antv/x6-react-shape` 来使用 React 渲染节点。

```ts
import { register } from "@antv/x6-react-shape";

const NodeComponent = () => {
  return (
    <div className="react-node">
      <Progress type="circle" percent={30} width={80} />
    </div>
  );
};

register({
  shape: "custom-react-node",
  width: 100,
  height: 100,
  component: NodeComponent,
});

graph.addNode({
  shape: "custom-react-node",
  x: 60,
  y: 100,
});
```

<code id="react-basic" src="@/src/tutorial/intermediate/react/basic/index.tsx"></code>

## 更新节点

与 `HTML` 一样，在注册节点的时候，提供一个 `effect`，字段，是当前节点的 `prop` 数组，当 `effect` 包含的 `prop` 有变动时，会重新渲染当前 React 组件。

```ts
register({
  shape: "custom-react-node",
  width: 100,
  height: 100,
  effect: ["data"],
  component: NodeComponent,
});

const node = graph.addNode({
  shape: "custom-react-node",
  x: 60,
  y: 100,
  data: {
    progress: 30,
  },
});

setInterval(() => {
  const { progress } = node.getData<{ progress: number }>();
  node.setData({
    progress: (progress + 10) % 100,
  });
}, 1000);
```

<code id="react-update" src="@/src/tutorial/intermediate/react/update/index.tsx"></code>

## Portal 方式

上面的 React 组件渲染方式有一个缺点，因为内部是通过以下方式将组件渲染到节点的 DOM 中。

```ts
import { createRoot, Root } from "react-dom/client";

const root = createRoot(container); // container 为节点容器
root.render(component);
```

可以看出，React 组件已经不处于正常的渲染文档树中。所以它内部无法获取外部 `Context` 内容。如果有这种应用场景，可以使用 `Portal` 模式来渲染 React 组件。

<code id="react-portal" src="@/src/tutorial/intermediate/react/portal/index.tsx"></code>
