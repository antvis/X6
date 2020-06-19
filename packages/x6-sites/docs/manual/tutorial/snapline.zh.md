---
title: 对齐线 Snapline
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

对齐线是移动节点排版的辅助工具，默认禁用，通过如下配置启用。

```ts
const graph = new Graph({
  snapline: true,
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
  },
})
```

也可以调用 `graph.enableSnapline()` 和 `graph.disableSnapline()` 来启用和禁用对齐线。

```ts
if (graph.isSnaplineEnabled()) {
  graph.disableSnapline()
} else {
  graph.enableSnapline()
}
```


## 选项

```ts
interface SnaplineOptions {
  className?: string
  tolerance?: number
  sharp?: boolean
  resizing?: boolean
  clean?: boolean
  filter?: (string | { id: string })[] | ((this: Graph, node: Node) => boolean)
}
```

### className

附加样式名，用于定制对齐线样式。默认为空。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    className: 'my-snapline',
  },
})
```

### tolerance

对齐精度，即移动节点时与目标位置的距离小于 `tolerance` 时触发显示对齐线。默认为 `10`。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    tolerance: 10,
  },
})
```

### sharp

是否显示截断的对齐线，默认为 `false`。

### resizing

改变节点大小时是否触发对齐线，默认为 `false`。

### clean

当对齐线隐藏后，是否自动将其从 DOM 中移除。支持 `boolean` 或 `number` 类型，当为 `number` 类型时，表示延迟多少毫秒后从 DOM 移除，这样就可以避免移动节点时对齐线被频繁添加/移除到 DOM，又能保证停止移动节点一定时间后能清理掉对齐线。当 `clean` 为 `true` 时，相当于延迟 3000ms 后清理对齐线。 

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    clean: 5000,
  },
})
```

### filter

节点过滤器，被过滤的节点不参与对齐计算。支持以下三种类型：

- `string[]`  节点类型数组，指定的节点类型不参与对齐计算
- `({ id: string })[]` 节点（类节点）数组，指定的节点不参与对齐计算
- `(this: Graph, node: Node) => boolean` 返回 `true` 的节点不参与对齐计算

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    filter: ['rect'],
  },
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
    filter(node) {
      return node.type === 'rect'
    },
  },
})
```

## 样式定制

上面介绍了通过 `className` 选项来定制样式，另外也可以通过覆盖以下几个 CSS 样式定义来定制，默认的样式定义[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/snapline/index.less)。

- x6-widget-snapline
- x6-widget-snapline-vertical
- x6-widget-snapline-horizontal

## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-snapline-rgymq?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-snapline"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

- `graph.hideSnapline()` 隐藏对齐线。
- `graph.getSnaplineTolerance()` 获取对齐精度。
- `graph.setSnaplineTolerance(tolerance: number)` 设置对齐精度。 
- `graph.setSnaplineFilter(filter?: Filter)` 设置对齐线过滤器。

- `graph.isSnaplineEnabled()` 对齐线是否启用。
- `graph.enableSnapline()` 启用对齐线。
- `graph.disableSnapline()` 禁用对齐线。
- `graph.toggleSnapline(enabled?: boolean)` 切换对齐线的启用状态。

- `graph.isSnaplineOnResizingEnabled()` 修改节点大小交互时是否触发对齐线。
- `graph.enableSnaplineOnResizing()` 修改节点大小交互时触发对齐线。 
- `graph.disableSnaplineOnResizing()` 修改节点大小交互时不触发对齐线。 
- `graph.toggleSnaplineOnResizing(enableOnResizing?: boolean)` 切换修改节点大小时是否触发对齐线。 

- `graph.isSharpSnapline()` 是否显示截断的对齐线。
- `graph.enableSharpSnapline()` 显示截断的对齐线。
- `graph.disableSharpSnapline()` 显示贯穿画布的对齐线。
- `graph.toggleSharpSnapline(sharp?: boolean)` 切换是否显示贯穿画布的对齐线。
