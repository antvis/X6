---
title: 升级到 3.x 版本
order: 5
redirect_from:
  - /zh/docs/tutorial/update
---

相比 2.x 版本，3.x 在对外使用上的变化主要集中在插件及子包合并（统一导出），交互默认值优化，并新增动画能力，整体升级成本较低。

## 变更总览

- 插件及子包合并：`@antv/x6-plugin-xxxx`、`@antv/x6-common`、`@antv/x6-geometry` 全部整合到 `@antv/x6` 主包并统一导出。
- 交互默认值调整：画布 `panning` 默认开启。
- 新增动画能力：支持指令式动画、配置式动画和自定义动画 Shape 实现丰富酷炫的效果。
- 滚动画布（`Scroller`）下，支持虚拟渲染能力 `virtual: true`。

## 升级参考

### package.json

3.x 将所有常用插件（Plugins）统一并入 `@antv/x6` 主包，不再需要单独安装 `@antv/x6-plugin-xxxx`。同时，2.x 中的公共包 `@antv/x6-common` 与几何运算包 `@antv/x6-geometry` 也已并入主包，其 API 现在统一从 `@antv/x6` 导入。

```json
{
  "@antv/x6": "^3.0.0"
}
```

请移除如下依赖（如存在）：

- `@antv/x6-plugin-selection`
- `@antv/x6-plugin-transform`
- `@antv/x6-plugin-scroller`
- `@antv/x6-plugin-keyboard`
- `@antv/x6-plugin-history`
- `@antv/x6-plugin-clipboard`
- `@antv/x6-plugin-snapline`
- `@antv/x6-plugin-dnd`
- `@antv/x6-plugin-minimap`
- `@antv/x6-plugin-stencil`
- `@antv/x6-plugin-export`
- `@antv/x6-common`
- `@antv/x6-geometry`

### 导入路径变更

3.x 版本，以上插件全部从 `@antv/x6` 导出，使用方式保持不变，仅需替换导入路径：

```ts
// 2.x
import { Scroller } from '@antv/x6-plugin-scroller'
import { Selection } from '@antv/x6-plugin-selection'
graph.use(new Scroller())
graph.use(new Selection())

// 3.x
import { Scroller, Selection } from '@antv/x6'
graph.use(new Scroller())
graph.use(new Selection())
```

在 3.x 版本中，之前从 `@antv/x6-common` 和 `@antv/x6-geometry` 导入的工具与几何类型，现在统一从 `@antv/x6` 导出，仅需替换导入路径即可：

```ts
// 2.x
import { Dom, FunctionExt } from '@antv/x6-common'
import { Point, Rectangle } from '@antv/x6-geometry'

// 3.x
import { Dom, FunctionExt, Point, Rectangle } from '@antv/x6'
```

### 新增动画能力

3.x 新增 `animate` 动画，移除 2.x 中的 `transition` 使用方式，更加方便地为节点和边添加动效。

更多用法可参考：[动画说明文档](/tutorial/basic/animation)。

### 配置修改说明

- 画布平移 `panning` 默认开启：`enabled: true`；若需禁用，设置 `panning: false` 即可。
- 当画布 `panning` 与 `Selection` 框选触发存在冲突时，框选优先。
- 使用 `Scroller` 插件时，默认禁用画布 `panning`，且支持开启虚拟渲染 `virtual: true`。

### Shape 组件升级（React/Vue/Angular）

  X6 3.x 须使用以下 3.x 版本的 shape 包：`@antv/x6-react-shape@^3.x`、`@antv/x6-vue-shape@^3.x`、`@antv/x6-angular-shape@^3.x`。

```json
{
  "@antv/x6-react-shape": "^3.0.0",
  "@antv/x6-vue-shape": "^3.0.0",
  "@antv/x6-angular-shape": "^3.0.0"
}
```

#### React Provider 使用变更

将 2.x 的 `Portal.getProvider()` 改为 3.x 的 `getProvider()`：

```ts
// 2.x
import { Portal } from '@antv/x6-react-shape'
const Provider = Portal.getProvider()

// 3.x
import { getProvider } from '@antv/x6-react-shape'
const Provider = getProvider()
```
