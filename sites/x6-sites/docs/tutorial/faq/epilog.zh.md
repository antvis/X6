---
title: 常见问题
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

1.	一般问题
    1. [X6 与 G6 的区别](#x6-与-g6-的区别)
    2. [X6 支持 Vue 吗](#x6-支持-vue-吗)
2.	节点相关
    1. [怎么禁止节点移动](#怎么禁止节点移动)
    2. [怎么支持特定节点的放大缩小](#怎么支持特定节点的放大缩小)
    3. [怎么判断节点处于可缩放状态](#怎么判断节点处于可缩放状态)
3.  边相关
    1. [怎么区分 edgeremoved 事件触发原因](#怎么区分-edgeremoved-事件触发原因)
    2. [在 edge:removed 事件中怎么获取目标节点](#在-edgeremoved-事件中怎么获取目标节点)


### X6 与 G6 的区别

X6 是图编辑引擎，特点是节点、边、等元素的定制能力非常强，经常用来构建流程图、ER图、DAG图、脑图等应用。G6 和 X6 是孪生兄弟，G6 更擅长于图可视化和图分析领域。

### X6 支持 Vue 吗

X6 的核心能力和框架无关，在 X6 的基础上我们有 [x6-react-shape](https://github.com/antvis/X6/tree/master/packages/x6-react-shape) 和 [x6-react-components](https://github.com/antvis/X6/tree/master/packages/x6-react-components) 两个项目，用来支持 `React` 渲染以及提供一系列图编辑场景的常用 UI 组件。我们后续也会支持 `vue` 框架，如果大家有兴趣可以联系我们，一起将 X6 做得更加完美。

### 怎么禁止节点移动

可以使用以下方式，

```ts
const graph = new Graph({
  container: this.container,
  grid: 10,
  interacting: {
    nodeMovable: false
  }
})
```
更多配置见: [interacting](https://x6.antv.vision/zh/docs/api/graph#interacting)

### 怎么支持特定节点的放大缩小

```ts
 new graph({ 
   resizing: { 
     enabled:  (this: Graph, arg: Node<Node.Properties>) => boolean 
    }
  })
```

### 怎么判断节点处于可缩放状态

处于可缩放状态的节点会带有 `has-widget-transform` 类名

### 怎么区分 edge:removed 事件触发原因

调用 `removeEdge` 或者手动删除 edge 时都会触发 `edge:removed` 事件，那怎么区分两种行为呢？在调用 `removeEdge` 的时候可以传入第二个参数 `options`，在 `options` 里面定义自己的属性，在 `edge:remove` 事件参数中能获取到自定义的属性。

```ts
graph.removeEdge(edge, {
  triggerByFunction: true
})
graph.on("edge:removed", ({ options }) => {
  if (options.triggerByFunction) {
    // 调用removeEdge删除边
  }
});
```

### 在 edge:removed 事件中怎么获取目标节点

```ts
graph.on("edge:removed", ({ edge, options }) => {
  const cellId = edge.getTargetCellId()
  const target = graph.getCellById(cellId)
});
```

