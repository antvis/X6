# @antv/x6 3.1.0 (2025-12-01)

## 功能增强

- 虚拟渲染配置扩展：`virtual` 支持对象配置 `VirtualOptions`，可通过 `enabled` 与 `margin` 精细控制虚拟渲染开关与缓冲边距。

## 修复

- History 插件：修复批量删除与撤销场景下的异常，确保 `remove` 命令记录与回滚逻辑一致。
- Safari 箭头渲染：在 Safari 下通过强制重排 `EdgeView` 容器以确保 `marker-start`/`marker-end` 正确渲染。
- React/Vue/Angular 节点渲染：修复通过 x6-react/vue/angular-shape 注册节点在虚拟渲染场景下可能出现的渲染异常。

# @antv/x6 3.0.0 (2025-11-21)

## 重大变更

- 插件整合：所有 `@antv/x6-plugin-xxxx` 包并入主包并统一导出，原有 `graph.use(new Xxx())` 用法保持不变，仅需替换导入路径（参见 `src/plugin/index.ts:1-11`）。
- 动画 API：移除 2.x 的 `transition` 用法，引入全新的动画系统 `animate`，支持命令式/配置式/自定义 Shape 动效（参见 `src/model/animation/animation.ts:10-21`, `src/model/animation/index.ts:1-8`）。
- 交互默认值调整：画布平移 `panning` 默认开启；当使用 `Scroller` 时为避免交互冲突，默认禁用画布 `panning`（参见文档 `site/docs/tutorial/update.zh.md:69-71`）。

## 功能增强

- 虚拟渲染能力：在大图场景可开启 `virtual: true`，仅渲染可视区域并自动加入缓冲边距以提升性能（参见 `src/graph/virtual-render.ts:94-106`；示例见 `site/examples/showcase/practices/demo/virtualRender.ts:7-15`）。
- 动画系统：提供 `Animation`、`KeyframeEffect` 与 `AnimationManager`，支持播放、暂停、反向、速率调整与完成/取消事件（参见 `src/model/animation/animation.ts:75-144`, `src/model/animation/animationManager.ts:3-19`, `src/model/animation/index.ts:1-8`）。
- 插件统一导出：`Clipboard`、`Dnd`、`Export`、`History`、`Keyboard`、`Selection`、`MiniMap`、`Scroller`、`Stencil`、`Snapline`、`Transform` 统一从 `@antv/x6` 导出（参见 `src/plugin/index.ts:1-11`）。

## 优化

- 交互体验：`panning` 默认开启，`Selection` 在与 `panning` 触发冲突时具备更合理的优先级（参见 `site/docs/tutorial/update.zh.md:69-71`）。
- 虚拟渲染性能：滚动/平移/缩放事件节流控制与渲染区域动态扩展（固定边距 120px）（参见 `src/graph/virtual-render.ts:15-18,99-103`）。

## 迁移指南

1. 升级依赖：

   ```json
   {
     "dependencies": {
       "@antv/x6": "^3.0.0"
     }
   }
   ```

2. 移除旧插件依赖：`@antv/x6-plugin-selection`、`@antv/x6-plugin-transform`、`@antv/x6-plugin-scroller`、`@antv/x6-plugin-keyboard`、`@antv/x6-plugin-history`、`@antv/x6-plugin-clipboard`、`@antv/x6-plugin-snapline`、`@antv/x6-plugin-dnd`、`@antv/x6-plugin-minimap`、`@antv/x6-plugin-stencil`、`@antv/x6-plugin-export`（参见 `site/docs/tutorial/update.zh.md:30-43`）。
3. 替换导入路径：

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

4. 动画迁移：将 2.x 的 `transition` 用法迁移至 3.x 的 `animate` 能力，参考动画文档与 API（参见 `site/docs/tutorial/update.zh.md:61-66`）。
5. 配置检查：
   - 若需要关闭画布平移，显式设置 `panning: false`。
   - 使用 `Scroller` 时可开启 `virtual: true` 以优化大图渲染。
