---
title: 网格 Grid
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

网格是渲染/移动节点时最小像素单位，默认网格大小 `10px`，并且默认不可见。

## 网格大小

可以通过下面配置来修改网格大小。

```ts
const graph = new Graph({
  grid: 10,
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

也可以通过调用 `graph.setGridSize(20)` 方法来修改网格大小，如果网格可见，调用此方法时将触发网格重绘。

## 绘制网格

默认情况网格不可见，通过下面配置来绘制网格。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,      // 网格大小 10px，10px 是默认值，可省略
    visible: true, // 绘制网格
  },
})
```

## 网格样式

X6 提供了四种网格样式。

- dot (默认值)
- fixedDot
- mesh
- doubleMesh


```ts
// 配置 'dot' | 'fixedDot' | 'mesh' 样式
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
    args: { 
      color: '#a0a0a0', // 网格线/点颜色
      thickness: 1,     // 网格线宽度或网格点大小
    },
  },
})

// 配置 'doubleMesh' 样式
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'doubleMesh',
    args: [
      { 
        color: '#a0a0a0', // 主网格线颜色
        thickness: 1,     // 主网格线宽度
      },
      { 
        color: '#a0a0a0', // 次网格线颜色
        thickness: 1,     // 次网格线宽度
        factor: 4,        // 主次网格线间隔
      },
    ],
  },
})

```

## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-grid-bzoy0?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border: 1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-grid"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

- `graph.drawGrid(options?: Graph.GridManager.DrawGridOptions)` 绘制网格
- `graph.showGrid()` 显示网格
- `graph.hideGrid()` 隐藏网格
- `graph.clearGrid()` 隐藏并销毁网格
- `graph.getGridSize()` 获取网格大小
- `graph.setGridSize(gridSize: number)` 设置网格大小
