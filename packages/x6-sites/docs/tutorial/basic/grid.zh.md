---
title: 网格 Grid
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

网格是渲染/移动节点的最小单位。网格默认大小为 `10px`，渲染节点时表示以 `10` 为最小单位对齐到网格，如位置为 `{ x: 24, y: 38 }`的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`， 移动节点时表示每次移动最小距离为 `10px`。

## 演示

- 设置网格类型，观察不同网格类型的视觉表现。
- 设置网格大小，通过拖动节点来了解网格大小对节点位置的影响。
- 设置网格颜色和网点/线框大小。

<iframe src="/demos/tutorial/basic/grid/playground"></iframe>

## 网格大小

创建画布时，通过下面配置来设置网格大小。

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

创建画布后，可以调用 [graph.setGridSize(gridSize: number)](#graphsetgridsizegridsize-number) 方法来修改网格大小，并触发网格重绘（如果网格可见）。

```ts
graph.setGridSize(10)
```

## 网格类型

网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,      // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
})
```

同时，我们内置了以下四种网格类型，通过 `type` 选项来指定网格类型，默认值为 `'dot'`，并支持通过 `args` 选项来配置网格样式。

- dot (默认值)
- fixedDot
- mesh

  ```ts
  const graph = new Graph({
      grid: {
        size: 10,
        visible: true,
        type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
        args: { 
          color: '#a0a0a0', // 网格线/点颜色
          thickness: 1,     // 网格线宽度/网格点大小
        },
      },
  })
  ```

- doubleMesh

  ```ts
  const graph = new Graph({
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          { 
            color: '#eee', // 主网格线颜色
            thickness: 1,     // 主网格线宽度
          },
          { 
            color: '#ddd', // 次网格线颜色
            thickness: 1,     // 次网格线宽度
            factor: 4,        // 主次网格线间隔
          },
        ],
      },
  })
  ```

创建画布后，可以调用 [graph.drawGrid(options?: DrawGridOptions)](#graphdrawgridoptions-drawgridoptions) 来重绘网格。

例如，使用网格颜色 `#f0f0f0` 和默认线宽绘制 `mesh` 类型网格。

```ts
graph.drawGrid({
  type: 'mesh',
  args: {
    color: '#f0f0f0'
  },
})
```

## API

### graph.drawGrid(options?: DrawGridOptions)

绘制网格。

```ts
type DrawGridOptions = 
  | {
      type: 'dot' | 'fixedDot' | 'mesh'
      args?: {
        color: string     // 网格线/点颜色
        thickness: number // 网格线宽度/网格点大小
      }
    }
  | {
      type: 'doubleMesh'
      args?: [
        {
          color: string     // 主网格线颜色
          thickness: number // 主网格线宽度
        },
        {
          color: string     // 次网格线颜色
          thickness: number // 次网格线宽度
          factor: number    // 主次网格线间隔
        },
      ]
    }  
  | {
      type: string // 自定义网格类型
      args?: any   // 自定义网格参数 
    }
```

例如，使用网格颜色 `#f0f0f0` 和默认线宽绘制 `mesh` 类型网格。

```ts
graph.drawGrid({
  type: 'mesh',
  args: {
    color: '#f0f0f0'
  },
})
```

### graph.getGridSize()

获取网格大小。

```ts
const gridSize = graph.getGridSize()
```

### graph.setGridSize(gridSize: number)

设置网格大小。

```ts
graph.setGridSize(10)
```

### graph.showGrid()

显示网格。

### graph.hideGrid()

隐藏网格。

### graph.clearGrid()

隐藏并销毁网格。
