---
title: 图形变换
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中，主要介绍图形变换插件，通过阅读，你可以了解到：}

- 如何通过交互插件调整节点大小
- 如果通过交互插件调整节点旋转角度
  :::

## 使用

使用 `UI` 组件来调整节点尺寸和角度是常用需求，我们提供了一个独立的插件包 `@antv/x6-plugin-transform` 来使用这个功能。

```shell
# npm
$ npm install @antv/x6-plugin-transform --save

# yarn
$ yarn add @antv/x6-plugin-transform
```

然后我们在代码中这样使用：

```ts
import { Transform } from "@antv/x6-plugin-transform";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});
graph.use(
  new Transform({
    resizing: resizingOptions,
    rotating: rotatingOptions,
  })
);
```

## 演示

首先我们体验使用交互修改节点尺寸（点击节点出现操作组件）：

<code id="plugin-transform-resizing" src="@/src/tutorial/plugins/transform/resizing/index.tsx"></code>

接下来体验使用交互修改节点旋转角度（点击节点出现操作组件）：

<code id="plugin-transform-rotating" src="@/src/tutorial/plugins/transform/rotating/index.tsx"></code>

## 配置


## API

### graph.createWidget(node: Node)

给节点创建widget

### graph.clearWidgets()

清除所有widget

### 调整尺寸

| 属性名              | 类型    | 默认值     | 必选 | 描述                                         |
| ------------------- | ------- | ---------- | ---- | -------------------------------------------- |
| enabled             | boolean | `false`    |      | 是否支持调整节点大小                         |
| minWidth            | number  | 0          |      | 最小的调整宽度                               |
| minHeight           | number  | 0          |      | 最小的调整高度                               |
| maxWidth            | number  | `Infinity` |      | 最大的调整宽度                               |
| maxHeight           | number  | `Infinity` |      | 最大的调整高度                               |
| orthogonal          | boolean | `true`     |      | 是否显示中间调整点                           |
| restricted          | boolean | `false`    |      | 调整大小边界是否可以超出画布边缘             |
| autoScroll          | boolean | `true`     |      | 拖动位置超过画布时是否自动滚动画布           |
| preserveAspectRatio | boolean | `false`    |      | 调整大小过程中是否保持节点的宽高比例         |
| allowReverse        | boolean | `true`     |      | 到达最小宽度或者高度时是否允许控制点反向拖动 |

上面的配置除了支持默认类型外，还支持使用函数的方式来动态修改：

```ts
new Transform({
  resizing: {
    enabled: true,
    orthogonal(ndoe: Node) {
      const { enableOrthogonal } = node.getData();
      return enableOrthogonal;
    },
  },
});
```

### 调整角度

| 属性名  | 类型    | 默认值  | 必选 | 描述                 |
| ------- | ------- | ------- | ---- | -------------------- |
| enabled | boolean | `false` |      | 是否支持调整节点角度 |
| grid    | number  | 15      |      | 每次旋转的角度       |

上面的配置除了支持默认类型外，还支持使用函数的方式来动态修改：

```ts
new Transform({
  rotating: {
    enabled: true,
    grid() {
      return 30;
    },
  },
});
```

## 事件

| 事件名称        | 参数类型                                                                      | 描述                   |
| --------------- | ----------------------------------------------------------------------------- | ---------------------- |
| `node:resize`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始调整节点大小时触发 |
| `node:resizing` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 调整节点大小时触发     |
| `node:resized`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 调整节点大小后触发     |
| `node:rotate`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始旋转节点时触发     |
| `node:rotating` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 旋转节点时触发         |
| `node:rotated`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 旋转节点后触发         |

```ts
graph.on("node:rotated", ({ node }) => {
  console.log(node.angle());
});

// 我们也可以在插件实例上监听事件
transform.on("node:rotated", ({ node }) => {
  console.log(node.angle());
});
```
