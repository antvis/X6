---
title: 事件
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中，主要介绍事件相关的知识，通过阅读，你可以了解到：}

- 可以监听哪些类别事件
- 如何监听事件
  :::

## 视图交互事件

通过鼠标、键盘或者各种可交互的组件与应用产生交互时触发的事件。

### 鼠标事件

| 事件   | cell 节点/边          | node 节点            | port 连接桩                | edge 边             | blank 画布空白区域        |
|-------|---------------------|---------------------|--------------------------|---------------------|----------------------|
| 单击   | `cell:click`       | `node:click`       | `node:port:click`       | `edge:click`       | `blank:click`       |
| 双击   | `cell:dblclick`    | `node:dblclick`    | `node:port:dblclick`    | `edge:dblclick`    | `blank:dblclick`    |
| 右键   | `cell:contextmenu` | `node:contextmenu` | `node:port:contextmenu` | `edge:contextmenu` | `blank:contextmenu` |
| 鼠标按下 | `cell:mousedown`   | `node:mousedown`   | `node:port:mousedown`   | `edge:mousedown`   | `blank:mousedown`   |
| 移动鼠标 | `cell:mousemove`   | `node:mousemove`   | `node:port:mousemove`   | `edge:mousemove`   | `blank:mousemove`   |
| 鼠标抬起 | `cell:mouseup`     | `node:mouseup`     | `node:port:mouseup`     | `edge:mouseup`     | `blank:mouseup`     |
| 鼠标滚轮 | `cell:mousewheel`  | `node:mousewheel`  | -                       | `edge:mousewheel`  | `blank:mousewheel`  |
| 鼠标进入 | `cell:mouseenter`  | `node:mouseenter`  | `node:port:mouseenter`  | `edge:mouseenter`  | `graph:mouseenter`  |
| 鼠标离开 | `cell:mouseleave`  | `node:mouseleave`  | `node:port:mouseleave`  | `edge:mouseleave`  | `graph:mouseleave`  |

:::warning{title=注意：}
需要注意的是，这里的 `mousemove` 事件和通常的鼠标移动事件有所区别，它需要在鼠标按下后移动鼠标才能触发。
:::

除了 `mouseenter` 和 `mouseleave` 外，事件回调函数的参数都包含鼠标相对于画布的位置 `x`、`y` 和鼠标事件对象 `e` 等参数。

```ts
graph.on("cell:click", ({ e, x, y, cell, view }) => {});
graph.on("node:click", ({ e, x, y, node, view }) => {});
graph.on("edge:click", ({ e, x, y, edge, view }) => {});
graph.on("blank:click", ({ e, x, y }) => {});

graph.on("cell:mouseenter", ({ e, cell, view }) => {});
graph.on("node:mouseenter", ({ e, node, view }) => {});
graph.on("edge:mouseenter", ({ e, edge, view }) => {});
graph.on("graph:mouseenter", ({ e }) => {});
```

### 自定义点击事件

我们可以在节点/边的 DOM 元素上添加自定义属性 `event` 或 `data-event` 来监听该元素的点击事件，例如：

```ts
node.attr({
  // 表示一个删除按钮，点击时删除该节点
  image: {
    event: "node:delete",
    xlinkHref: "trash.png",
    width: 20,
    height: 20,
  },
});
```

可以通过绑定的事件名 `node:delete` 或通用的 `cell:customevent`、`node:customevent`、`edge:customevent` 事件名来监听。

```ts
graph.on("node:delete", ({ view, e }) => {
  e.stopPropagation();
  view.cell.remove();
});

graph.on("node:customevent", ({ name, view, e }) => {
  if (name === "node:delete") {
    e.stopPropagation();
    view.cell.remove();
  }
});
```

<code id="event-custom-click" src="@/src/tutorial/basic/event/custom-click/index.tsx"></code>

### 画布缩放/平移

| 事件名      | 回调参数                                             | 说明                                                               |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| `scale`     | `{ sx: number; sy: number; ox: number; oy: number }` | 缩放画布时触发，`sx` 和 `sy` 是缩放比例，`ox` 和 `oy` 是缩放中心。 |
| `resize`    | `{ width: number; height: number }`                  | 改变画布大小时触发，`width` 和 `height` 是画布大小。               |
| `translate` | `{ tx: number; ty: number }`                         | 平移画布时触发，`tx` 和 `ty` 分别是 X 和 Y 轴的偏移量。            |

```ts
graph.on("scale", ({ sx, sy, ox, oy }) => {});
graph.on("resize", ({ width, height }) => {});
graph.on("translate", ({ tx, ty }) => {});
```

### 节点或边平移

| 事件名        | 回调参数                                                                      | 说明                 |
| ------------- | ----------------------------------------------------------------------------- | -------------------- |
| `node:move`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始移动节点时触发。 |
| `node:moving` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 移动节点时触发。     |
| `node:moved`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 移动节点后触发。     |
| `edge:move`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始移动边时触发。   |
| `edge:moving` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 移动边时触发。       |
| `edge:moved`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 移动边后触发。       |

参数中的 `x` 和 `y` 是鼠标相对于画布的坐标。

```ts
graph.on("node:moved", ({ e, x, y, node, view }) => {});
```

### 节点嵌入

| 事件名           | 回调参数                                                                                                                  | 说明                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `node:embed`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView, currentParent: Node }`                        | 开启嵌入，在开始拖动节点时触发。 |
| `node:embedding` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView, currentParent: Node, candidateParent: Node }` | 寻找目标节点过程中触发。         |
| `node:embedded`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView, previousParent: Node, currentParent: Node }`    | 完成节点嵌入后触发。             |

### 边连接/取消连接

当拖动边的起始/终止箭头将边连接到节点/边或者将边从节点/边上分离后触发 `edge:connected`，回调函数的参数如下。

```ts
interface Args {
  e: Dom.MouseUpEvent; // 鼠标事件对象
  edge: Edge; // 边
  view: EdgeView; // 边的视图
  isNew: boolean; // 是否是新创建的边
  type: Edge.TerminalType; // 操作的是起始箭头还是终止箭头（'source' | 'target'）

  previousCell?: Cell | null; // 交互前连接到的节点/边
  previousView?: CellView | null; // 交互前连接到的节点/边的视图
  previousPort?: string | null; // 交互前连接到的连接桩 ID
  previousPoint?: Point.PointLike | null; // 交互前连接到的点（将边的终端从空白处拖动到节点/边上时记录起始终端的位置）
  previousMagnet?: Element | null; // 交互前连接到的元素

  currentCell?: Cell | null; // 交互后连接到的节点/边
  currentView?: CellView | null; // 交互后连接到的节点/边的视图
  currentPort?: string | null; // 交互后连接到的连接桩 ID
  currentPoint?: Point.PointLike | null; // 交互后连接到的点（将边的终端从节点/边上拖动到空白处时记录拖动后终端的位置）
  currentMagnet?: Element | null; // 交互后连接到的元素
}
```

我们可以通过 `isNew` 来判断连线完成后，对应的边是否是新创建的边。比如从一个连接桩开始，创建了一条边并连接到另一个节点/连接桩，此时 `isNew` 就为 `true`。

```ts
graph.on("edge:connected", ({ isNew, edge }) => {
  if (isNew) {
    // 对新创建的边进行插入数据库等持久化操作
  }
});
```

特别注意的是，参数中的 `previous...` 是记录操作终端在连接/取消连接之前的状态，并不是指 `sourceCell`，在创建新边后获取 `sourceCell` 时不能使用 `previousCell`，正确的使用方式是：

```ts
graph.on("edge:connected", ({ isNew, edge }) => {
  if (isNew) {
    const source = edge.getSourceCell();
  }
});
```

## 节点/边

### 添加/删除/修改

当节点/边被添加到画布时，触发以下事件：

- `added`
- `cell:added`
- `node:added`（仅当 cell 是节点时才触发）
- `edge:added`（仅当 cell 是边时才触发）

当节点/边被移除时，触发以下事件：

- `removed`
- `cell:removed`
- `node:removed`（仅当 cell 是节点时才触发）
- `edge:removed`（仅当 cell 是边时才触发）

当节点/边发生任何改变时，触发以下事件：

- `changed`
- `cell:changed`
- `node:changed`（仅当 cell 是节点时才触发）
- `edge:changed`（仅当 cell 是边时才触发）

可以在节点/边上监听：

```ts
cell.on("added", ({ cell, index, options }) => {});
cell.on("removed", ({ cell, index, options }) => {});
cell.on("changed", ({ cell, options }) => {});
```

或者在 Graph 上监听：

```ts
graph.on("cell:added", ({ cell, index, options }) => {});
graph.on("cell:removed", ({ cell, index, options }) => {});
graph.on("cell:changed", ({ cell, options }) => {});

graph.on("node:added", ({ node, index, options }) => {});
graph.on("node:removed", ({ node, index, options }) => {});
graph.on("node:changed", ({ node, options }) => {});

graph.on("edge:added", ({ edge, index, options }) => {});
graph.on("edge:removed", ({ edge, index, options }) => {});
graph.on("edge:changed", ({ edge, options }) => {});
```

### change:xxx

当调用 `setXxx(val, options)` 和 `removeXxx(options)` 方法去改变节点/边的数据时，并且 `options.silent` 不为 `true` 时，都将触发对应的 `change` 事件，并触发节点/边重绘。例如：

```ts
cell.setZIndex(2);
cell.setZIndex(2, { silent: false });
cell.setZIndex(2, { anyKey: "anyValue" });
```

将触发 Cell 上的以下事件：

- `change:*`
- `change:zIndex`

和 Graph 上的以下事件：

- `cell:change:*`
- `node:change:*`（仅当 cell 是节点时才触发）
- `edge:change:*`（仅当 cell 是边时才触发）
- `cell:change:zIndex`
- `node:change:zIndex`（仅当 cell 是节点时才触发）
- `edge:change:zIndex`（仅当 cell 是边时才触发）

可以在节点/边上监听：

```ts
// 当 cell 发生任何改变时都将被触发，可以通过 key 来确定改变项
cell.on(
  "change:*",
  (args: {
    cell: Cell;
    key: string; // 通过 key 来确定改变项
    current: any; // 当前值
    previous: any; // 改变之前的值
    options: any; // 透传的 options
  }) => {
    if (key === "zIndex") {
      //
    }
  }
);

cell.on(
  "change:zIndex",
  (args: {
    cell: Cell;
    current?: number; // 当前值
    previous?: number; // 改变之前的值
    options: any; // 透传的 options
  }) => {}
);
```

或者在 Graph 上监听：

```ts
graph.on(
  "cell:change:zIndex",
  (args: {
    cell: Cell;
    current?: number; // 当前值
    previous?: number; // 改变之前的值
    options: any; // 透传的 options
  }) => {}
);

// 当 cell 为节点时触发
graph.on(
  "node:change:zIndex",
  (args: {
    cell: Cell;
    node: Node;
    current?: number; // 当前值
    previous?: number; // 改变之前的值
    options: any; // 透传的 options
  }) => {}
);

// 当 cell 为边时触发
graph.on(
  "edge:change:zIndex",
  (args: {
    cell: Cell;
    edge: Edge;
    current?: number; // 当前值
    previous?: number; // 改变之前的值
    options: any; // 透传的 options
  }) => {}
);
```

其他 `change` 事件如下列表，回调函数的参数与上面提到的 `change:zIndex` 的参数结构一致。

- Cell
  - `change:*`
  - `change:attrs`
  - `change:zIndex`
  - `change:markup`
  - `change:visible`
  - `change:parent`
  - `change:children`
  - `change:tools`
  - `change:view`
  - `change:data`
- Node
  - `change:size`
  - `change:angle`
  - `change:position`
  - `change:ports`
  - `change:portMarkup`
  - `change:portLabelMarkup`
  - `change:portContainerMarkup`
  - `ports:added`
  - `ports:removed`
- Edge
  - `change:source`
  - `change:target`
  - `change:terminal`
  - `change:router`
  - `change:connector`
  - `change:vertices`
  - `change:labels`
  - `change:defaultLabel`
  - `vertexs:added`
  - `vertexs:removed`
  - `labels:added`
  - `labels:removed`

除了上述这些内置的 Key，我们也支持监听自定义的 Key，例如

```ts
cell.on("change:custom", ({ cell, current, previous, options }) => {
  console.log(current);
});
```

当通过 `cell.prop('custom', 'any data')` 方法修改 `custom` 属性的值时将触发 `change:custom` 事件。

### 动画

- `transition:start` 动画开始时触发
- `transition:progress` 动画过程中触发
- `transition:complete` 动画完成时触发
- `transition:stop` 动画被停止时触发
- `transition:finish` 动画完成或被停止时触发

```ts
cell.on("transition:start", (args: Animation.CallbackArgs) => {});
cell.on("transition:progress", (args: Animation.ProgressArgs) => {});
cell.on("transition:complete", (args: Animation.CallbackArgs) => {});
cell.on("transition:stop", (args: Animation.StopArgs) => {});
cell.on("transition:finish", (args: Animation.CallbackArgs) => {});

graph.on("cell:transition:start", (args: Animation.CallbackArgs) => {});
graph.on("cell:transition:progress", (args: Animation.ProgressArgs) => {});
graph.on("cell:transition:complete", (args: Animation.CallbackArgs) => {});
graph.on("cell:transition:stop", (args: Animation.StopArgs) => {});
graph.on("cell:transition:finish", (args: Animation.CallbackArgs) => {});

graph.on("node:transition:start", (args: Animation.CallbackArgs) => {});
graph.on("node:transition:progress", (args: Animation.ProgressArgs) => {});
graph.on("node:transition:complete", (args: Animation.CallbackArgs) => {});
graph.on("node:transition:stop", (args: Animation.StopArgs) => {});
graph.on("node:transition:finish", (args: Animation.CallbackArgs) => {});

graph.on("edge:transition:start", (args: Animation.CallbackArgs) => {});
graph.on("edge:transition:progress", (args: Animation.ProgressArgs) => {});
graph.on("edge:transition:complete", (args: Animation.CallbackArgs) => {});
graph.on("edge:transition:stop", (args: Animation.StopArgs) => {});
graph.on("edge:transition:finish", (args: Animation.CallbackArgs) => {});
```
