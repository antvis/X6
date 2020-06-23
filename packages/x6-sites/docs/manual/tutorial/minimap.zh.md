---
title: 小地图 MiniMap
order: 11
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

启用 [`Scroller`](./scroller) 后可开启小地图，小地图是完整画布的预览，支持通过平移缩放小地图的视口来平移缩放画布。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
  },
  minimap: {
    enabled: true,
    container: minimapContainer,
  }
})
```

## 选项

```ts
interface MiniMapOptions {
  enabled: boolean 
  container: HTMLElement 
  width: number   
  height: number  
  padding: number  
  scalable?: boolean 
  minScale?: number
  maxScale?: number
  graphOptions?: Graph.Options
  createGraph?: (options: Graph.Options) => Graph
}
```

### enabled

小地图是否被启用，默认为 `false `。

### container 
 
挂载小地图的容器，必选。

### width

小地图的宽度，默认为 `300`。将通过 CSS 应用到小地图容器 [`container`](#container) 上。

### height

小地图的高度，默认为 `200`。将通过 CSS 应用到小地图容器 [`container`](#container) 上。

### padding

小地图容器的 padding 边距，默认为 `10`。将通过 CSS 应用到小地图容器 [`container`](#container) 上。

### scalable

是否可缩放，默认为 `true`。

### minScale

最小缩放比例，默认为 `0.01`。

### maxScale

最大缩放比例，默认为 `16`。

### graphOptions

创建小地图 Graph 的选项，默认为 `null`。

通过该选项可以定制小地图画布的表现和行为，如下面配置（在小地图中只渲染节点，并且节点的 View 被替换为指定的 View）。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
  },
  minimap: {
    enabled: true,
    container: minimapContainer,
    graphOptions: {
      async: true,
      getCellView(cell) {
        // 用指定的 View 替换节点默认的 View
        if (cell.isNode()) {
          return SimpleNodeView
        }
      },
      createCellView(cell) {
        // 在小地图中不渲染边
        if (cell.isEdge()) {
          return null
        }
      },
    }
  }
})
```

### createGraph

创建小地图 `Graph`，默认返回默认 `Graph` 的实例。


## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-minimap-i18pq?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-minimap"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
