---
title: 升级到 2.x 版本
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

相比 1.x 版本，对外的 API 和配置改动非常小，可以以最小成本升级到 2.0 版本。

## 升级参考

### package.json

```json
{
  "@antv/x6": "^2.0.0",
  "@antv/x6-plugin-minimap": "^2.0.0", // 如果使用小地图功能，需要安装此包
  "@antv/x6-plugin-scroller": "^2.0.0", // 如果使用滚动画布功能，需要安装此包
  "@antv/x6-plugin-selection": "^2.0.0", // 如果使用框选功能，需要安装此包
  "@antv/x6-plugin-snapline": "^2.0.0", // 如果使用对齐线功能，需要安装此包
  "@antv/x6-plugin-dnd": "^2.0.0", // 如果使用 dnd 功能，需要安装此包
  "@antv/x6-plugin-stencil": "^2.0.0", // 如果使用 stencil 功能，需要安装此包
  "@antv/x6-plugin-transform": "^2.0.0", // 如果使用图形变换功能，需要安装此包
  "@antv/x6-react-components": "^2.0.0", // 如果使用配套 UI 组件，需要安装此包
  "@antv/x6-react-shape": "^2.0.0", // 如果使用 react 渲染功能，需要安装此包
  "@antv/x6-vue-shape": "^2.0.0" // 如果使用 vue 渲染功能，需要安装此包
}
```

### 配置修改

| 属性名       | 修改                | 说明                                                                        |
|--------------|-------------------|---------------------------------------------------------------------------|
| virtual      | 增加                | 是否开启可视区域渲染能力，默认值为 `false`。                                  |
| async        | 默认值修改为 `true` | 默认异步渲染，提升性能。                                                      |
| sorting      | 删除                | 按照性能最优的方式进行排序，如果有特殊的排序需求，需要外部控制传入数据的顺序。 |
| frozen       | 删除                | 新的异步渲染模式，不需要 `frozen`。                                           |
| checkView    | 删除                | 内置可视区域渲染能力，使 `virtual` 配置打开。                                 |
| transforming | 删除                | 默认用最优配置，无须外部配置。                                                |
| knob         | 删除                | 应用场景不多，在 2.0 版本删除。                                               |
| resizing     | 删除                | 使用 transform 插件。                                                        |
| rotating     | 删除                | 使用 transform 插件。                                                        |
| selecting    | 删除                | 使用 selection 插件。                                                        |
| clipboard    | 删除                | 使用 clipboard 插件。                                                        |
| snapline     | 删除                | 使用 snapline 插件。                                                         |
| history      | 删除                | 使用 history 插件。                                                          |
| scroller     | 删除                | 使用 scroller 插件。                                                         |
| keyboard     | 删除                | 使用 keyboard 插件。                                                         |

### API 修改

| 方法名                  | 修改 | 说明                                    |
|-------------------------|----|---------------------------------------|
| graph.getCell           | 删除 | 替换为 `getCellById`。                   |
| graph.resizeGraph       | 删除 | 替换为 `resize`。                        |
| graph.resizeScroller    | 删除 | 替换为 `resize`。                        |
| graph.getArea           | 删除 | 替换为 `getGraphArea`。                  |
| graph.resizePage        | 删除 | 由 `scroller` 插件提供。                 |
| graph.scrollToPoint     | 删除 | 由 `scroller` 插件提供。                 |
| graph.scrollToContent   | 删除 | 由 `scroller` 插件提供。                 |
| graph.scrollToCell      | 删除 | 由 `scroller` 插件提供。                 |
| graph.transitionToPoint | 删除 | 由 `scroller` 插件提供。                 |
| graph.transitionToRect  | 删除 | 由 `scroller` 插件提供。                 |
| graph.isFrozen          | 删除 | 新的渲染模式下，`frozen` 相关方法不需要。 |
| graph.freeze            | 删除 | 新的渲染模式下，`frozen` 相关方法不需要。 |
| graph.unfreeze          | 删除 | 新的渲染模式下，`frozen` 相关方法不需要。 |
| graph.isAsync           | 删除 | 删除 `async` 相关方法。                  |
| graph.setAsync          | 删除 | 删除 `async` 相关方法。                  |
| graph.isViewMounted     | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.getMountedViews   | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.getUnmountedViews | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.getClientMatrix   | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.getPageOffset     | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.removeTools       | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.hideTools         | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.showTools         | 删除 | 不常用方法，在 2.0 版本中删除。           |
| graph.printPreview      | 删除 | 不常用方法，在 2.0 版本中删除。           |
| cell.animate            | 删除 | 后续会由 `animation` 插件提供。          |
| cell.animateTransform   | 删除 | 后续会由 `animation` 插件提供。          |
| edge.sendToken          | 删除 | 后续会由 `animation` 插件提供。          |

### x6-react-shape 使用

`x6-react-shape` 的使用方式详见[文档](/tutorial/intermediate/react)。

### x6-vue-shape 使用

`x6-vue-shape` 的使用方式详见[文档](/tutorial/intermediate/vue)。

### x6-angular-shape 使用

`x6-angular-shape` 的使用方式详见[文档](/tutorial/intermediate/angular)。

### 插件使用

插件的使用方式详见[文档](/tutorial/plugins/transform)。
