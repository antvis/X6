---
title: 小地图
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中主要介绍小地图插件相关的知识,通过阅读你可以了解到}

- 如何使用小地图功能

:::

## 使用

我们提供了一个独立的插件包 `@antv/x6-plugin-minimap` 来使用小地图功能。

```shell
# npm
$ npm install @antv/x6-plugin-minimap --save

# yarn
$ yarn add @antv/x6-plugin-minimap
```

然后我们在代码中这样使用：

```ts
import { MiniMap } from '@antv/x6-plugin-minimap'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new MiniMap({
    container: document.getElementById('minimap'),
  }),
)
```

## 演示

- 移动小地图视口来移动画布。
- 缩放小地图视口来缩放画布。

<code id="plugin-minimap" src="@/src/tutorial/plugins/minimap/index.tsx"></code>

## 选项

| 属性名       | 类型          | 默认值 | 必选 | 描述                      |
|--------------|---------------|--------|------|-------------------------|
| container    | HTMLElement   | -      | √    | 挂载小地图的容器          |
| width        | number        | `300`  |      | 小地图的宽度              |
| height       | number        | `200`  |      | 小地图的高度              |
| padding      | number        | `10`   |      | 小地图容器的 padding 边距 |
| scalable     | boolean       | `true` |      | 是否可缩放                |
| minScale     | number        | `0.01` |      | 最小缩放比例              |
| maxScale     | number        | `16`   |      | 最大缩放比例              |
| graphOptions | Graph.Options | `null` |      | 创建小地图 Graph 的选项   |
