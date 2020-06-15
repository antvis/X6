---
title: 快速上手
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/manual
---

## 安装

通过 npm 或 yarn 命令安装 X6。

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

成功安装完成之后，即可使用 `import` 或 `require` 进行引用。

```ts
import { Graph } from '@antv/x6';
```

## 开始使用

接下来我们就一起来创建一个最简单的 `Hello --> World` 应用。

### Step 1 创建容器

在页面中创建一个用于容纳 X6 绘图的容器，通常为 `div` 标签。

```html
<div id="container"></div>
```

### Step 2 准备数据

引入 X6 的数据源为 JSON 格式的对象，该对象中需要有节点 `nodes` 和边 `edges` 字段，分别用数组表示：

``` json
const data = {
  // 节点
  nodes: [
    {
      id: 'node1', // String，可选，节点的唯一标识
      x: 100,      // Number，必选，节点位置的 x 值
      y: 200,      // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
    },
    {
      id: 'node2', // String，节点的唯一标识
      x: 300,      // Number，必选，节点位置的 x 值
      y: 200,      // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
    },
  ],
  // 边
  edges: [
    {
      source: 'node1', // String，必须，起始节点 id
      target: 'node2', // String，必须，目标节点 id
    },
  ],
};
```

### Step 3 渲染画布

首先，我们需要创建一个 `Graph` 对象，并为其指定绘图容器，通常也会指定画布的大小。

```ts
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
});
```

然后，我们就可以使用刚刚创建的 `graph` 来渲染我们的节点和边。

```ts
graph.fromJSON(data)
```

## 完整代码

[![Edit x6-hello-world](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/condescending-driscoll-xkb6q?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=light)

<iframe
     src="https://codesandbox.io/embed/condescending-driscoll-xkb6q?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=light"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-hello-world"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 在 React 中使用 X6

如果你想在 React 中使用 X6，可以参考[这个 Demo]()。更多关于如何在 React 中使用 X6，请参考 React 中使用 X6 的文档。

有其他任何问题都可以通过页面底部的顶顶群和我们沟通，也非常欢迎给我们提 [issues](https://github.com/antvis/X6/issues/new/choose) 或 [PR](https://github.com/antvis/X6/pulls)。

## 更多

本章仅仅介绍了如何安装以及最简单的场景，在 X6 Tutorial 中其他的章节中我们会教会你：

- 实例化 Graph 的常见配置
- 设置节点/边的属性、样式


想了解更高阶的功能，请参见 [X6 核心概念]() 和 [X6 高级指引]()。


