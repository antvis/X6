---
title: 常见问题
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

1.	一般问题
    1. [X6 与 G6 的区别](#x6-与-g6-的区别)
    2. [X6 支持 Vue 吗](#x6-支持-vue-吗)
    3. [X6 浏览器兼容性](#浏览器兼容性)
    4. [怎么解决 angular 项目类型报错](#怎么解决-angular-项目类型报错)
2.	节点相关
    1. [怎么禁止节点移动](#怎么禁止节点移动)
    2. [怎么支持特定节点的放大缩小](#怎么支持特定节点的放大缩小)
    3. [怎么判断节点处于可缩放状态](#怎么判断节点处于可缩放状态)
    4. [HTML/React/Vue 节点渲染出错](#htmlreactvue节点渲染出错)
    5. [node:moved 事件中 x、y 参数](mode:moved-事件中x、y-参数)
3.  边相关
    1. [怎么区分 edgeremoved 事件触发原因](#怎么区分-edgeremoved-事件触发原因)
    2. [在 edge:removed 事件中怎么获取目标节点](#在-edgeremoved-事件中怎么获取目标节点)
    3. [在历史记录中忽略某个属性的修改]()
4.  连接桩相关
    1. [怎么监听连接桩的点击事件](#怎么监听连接桩的点击事件)


### X6 与 G6 的区别

X6 是图编辑引擎，特点是节点、边、等元素的定制能力非常强，经常用来构建流程图、ER图、DAG图、脑图等应用。G6 和 X6 是孪生兄弟，G6 更擅长于图可视化和图分析领域。详细对比可以参考这篇[文章](https://www.zhihu.com/question/435855401)

### X6 支持 Vue 吗

X6 的核心能力和框架无关，在 X6 的基础上我们有 [x6-react-shape](https://github.com/antvis/X6/tree/master/packages/x6-react-shape) 和 [x6-react-components](https://github.com/antvis/X6/tree/master/packages/x6-react-components) 两个项目，用来支持 `React` 渲染以及提供一系列图编辑场景的常用 UI 组件。我们同样提供 [x6-vue-shape](https://github.com/antvis/X6/tree/master/packages/x6-vue-shape) 来支持 `Vue` 节点的渲染。

### 浏览器兼容性

现代浏览器（Chrome、Firefox 、Safari 较新版本，IE11 部分功能不支持）

#### 怎么解决 angular 项目类型报错

可以在 `tsconfig.app.json` 中增加以下配置：

```json
"compilerOptions": {
  "skipLibCheck": true,
},
```

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

### HTML/React/Vue节点渲染出错

HTML/React/Vue 节点内容都是渲染在 SVG 的 [foreignObject](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/foreignObject) 节点内部，因为浏览器的兼容性问题，经常会出现一些异常的渲染行为。主要表现形式为：

- 节点内容展示不全
- 节点内容闪烁

可以通过以下方式来规避：

- 节点内部元素的 css 样式中不要使用 `position:absolute` 和 `position:relative`
- 节点内部元素的 css 样式中不要使用 `transform`
- 节点内部元素的 css 样式中不要使用 `opacity`

以上是实践过程中的临时解决方案，后续我们也会采用新的技术方案来彻底解决这个问题。
### node:moved 事件中 x、y 参数

在 `node:moved` 事件中参数中，`x`、`y` 参数经常引起歧义，这里说明一下：`x` 和 `y` 指定的是鼠标相对于画布的位置，而不是节点的位置，要获取节点的位置，可以：

```ts
graph.on('node:moved', ({ node })) {
  const { x, y } = node.position()
}
```

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

### 在历史记录中忽略某个属性的修改

已连线为例，拖动过程中是虚线，连接结束变为实线，此时如果执行 `undo` 操作，怎样直接恢复到未连线的状态呢？

```ts
new Graph({
  history: {
    enabled: true,
    beforeAddCommand(event, args: any) {
      // 忽略历史变更
      if (args.options.ignoreHistory) {
        return false
      }
    },
  },
  connecting: {
    createEdge() {
      // 指定新创建的边为虚线样式
      return Edge.create({
        attrs: {
          line: {
            strokeDasharray: '5 5',
          },
        },
      })
    },
  },
})

graph.on('edge:connected', ({ edge }) => {
   // 传入自定义的 ignoreHistory 选项来忽略历史变更
   edge.attr('line/strokeDasharray', null, { ignoreHistory: true })
})
```

### 怎么监听连接桩的点击事件

```ts
graph.addNode({
  x: 60,
  y: 50,
  width: 180,
  height: 100,
  ports: [
    {
      id: "port1",
      attrs: {
        circle: {
          event: "port:click", // 添加自定义属性 event 来监听该元素的点击事件
        }
      }
    }
  ]
});

graph.on("port:click", () => {
  // handle
});
```
