---
title: 小地图 MiniMap
order: 11
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

小地图是画布的缩影，通过拖动平移和拖动缩放小地图中的矩形框来平移和缩放画布。小地图需要画布滚动能力同时开启才可用：

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
}
```

### enabled

小地图是否被启用，默认为 `false `。

### container 
 
挂载小地图的容器，必选。

### width

小地图的宽度，默认为 `300`。

### height

小地图的高度，默认为 `200`。

### padding

小地图容器的 padding 边距，默认为 `10`。

### scalable

是否可缩放，默认为 `true`。

### minScale

最小缩放比例，默认为 `0.01`。

### maxScale

最大缩放比例，默认为 `16`。

### graphOptions

创建小地图 Graph 的选项，默认为 `null`。

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

## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-minimap-i18pq?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-minimap"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
