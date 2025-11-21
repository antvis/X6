---
title: 升级到 3.x 版本
order: 5
redirect_from:
  - /zh/docs/tutorial/update
---

相比 2.x 版本，3.x 在对外使用上的变化主要集中在插件合并（统一导出），交互默认值优化，并新增动画能力，整体升级成本较低。

## 变更总览

- 插件合并：`@antv/x6-plugin-xxxx` 全部整合到 `@antv/x6` 主包并统一导出。
- 导入路径更改：插件从 `@antv/x6` 直接导入，原有插件的 `graph.use(new Xxx())` 方式保持不变。
- 交互默认值调整：画布 `panning` 默认开启。
- 新增动画能力：支持指令式动画、配置式动画和自定义动画 Shape 实现丰富酷炫的效果。
- 滚动画布（`Scroller`）下，支持虚拟渲染能力 `virtual: true`。

## 升级参考

### package.json

3.x 将所有常用插件（Plugins）统一并入 `@antv/x6` 主包，不再需要单独安装 `@antv/x6-plugin-xxxx`。

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

### 新增动画能力

3.x 新增 `animate` 动画，移除 2.x 中的 `transition` 使用方式，更加方便地为节点和边添加动效。

更多用法可参考：[动画说明文档](/tutorial/basic/animation)。

### 配置修改说明

- 画布平移 `panning` 默认开启：`enabled: true`；若需禁用，设置 `panning: false` 即可。
- 当画布 `panning` 与 `Selection` 框选触发存在冲突时，框选优先。
- 使用 `Scroller` 插件时，默认禁用画布 `panning`，且支持开启虚拟渲染 `virtual: true`。
