---
title: 拖拽 Dnd
order: 12
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

我们经常需要通过拖拽交互往画布中添加节点，如流程图编辑场景，从流程图组件库中拖拽组件到画布中。

## Dnd

Dnd 是 `Addon` 命名空间中的一个插件，提供了基础的拖拽能力，按照下面两步来使用。

### Step 1 初始化

首先，创建一个 Dnd 的实例，并提供了一些选项来定制拖拽行为。

```ts
import { Addon } from '@antv/x6'

const dnd = new Addon.Dnd(options)
```

| 选项                         | 类型                                                       | 必选 | 默认值  | 说明                                                                                                                                                                                                                                              |
|------------------------------|------------------------------------------------------------|:----:|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.target               | Graph                                                      |  ✓️  |         | 目标画布。                                                                                                                                                                                                                                         |
| options.scaled               | boolean                                                    |      | `false` | 是否根据目标画布的缩放比例缩放拖拽的节点。                                                                                                                                                                                                         |
| options.delegateGraphOptions | Graph.Options                                              |      |         | 拖拽开始时，创建代理画布的选项。                                                                                                                                                                                                                    |
| options.getDragNode          | (node: Node) => Node                                       |      |         | 拖拽开始时，获取代理节点（实际被拖拽的节点），默认克隆传入的节点。                                                                                                                                                                                     |
| options.getDropNode          | (node: Node) => Node                                       |      |         | 拖拽结束时，获取放置到目标画布的节点，默认克隆代理节点。                                                                                                                                                                                             |
| options.validateNode         | (this: Graph, node: Node) => boolean \| Promins\<boolean\> |      |         | 拖拽结束时，验证节点是否可以放置到目标画布中。                                                                                                                                                                                                      |
| options.animation            | boolean \| { duration?: number; easing?: string }          |      | `false` | 拖拽结束时，而且目标节点不能添加到目标画布时，是否使用动画将代理画布移动到开始拖动的位置。选项 `duration` 和 `easing` 对应 JQuery 的 [.animate( properties [, duration ] [, easing ] [, complete ] )](https://api.jquery.com/animate/) 方法中的参数。 |

### Step 2 开始拖拽

当按下鼠标时调用下面方法开始拖拽。

```ts
dnd.start(node, e)
```

| 选项 | 类型                                | 说明            |
|------|-------------------------------------|---------------|
| node | Node                                | 开始拖拽的节点。 |
| e    | MouseEvent \| JQuery.MouseDownEvent | 鼠标事件。       |

### 拖拽细节

- 开始拖拽时，根据 `options.delegateGraphOptions` 选项创建一个代理画布，然后使用 `start` 提供的 `node` 作为 `options.getDragNode` 方法的参数，返回一个代理节点（默认克隆），并将代理节点添加到代理画布中。
- 拖拽过程中，根据鼠标位置实时更新代理画布的在页面中的绝对位置。
- 拖拽结束时，使用代理节点做为 `options.getDropNode` 方法的参数，返回一个放置到目标画布的目标节点（默认克隆代理节点），然后调用 `options.validateNode` 方法来验证节点是否可以被添加到目标画布中，该验证方法支持异步验证，例如发送接口到远端验证或者将新节点插入到数据库。如果通过验证，则将目标节点添加到目标画布中，否则根据 `options.animation` 选项将代理画布移动到开始拖动的位置，最后销毁代理画布。

<iframe src="/demos/tutorial/basic/dnd/dnd"></iframe>

## Stencil

Stencil 是 `Addon` 命名空间中的一个插件，是在 Dnd 基础上的进一步封装，提供了一个类似侧边栏的 UI 组件，并支持分组、折叠、搜索等能力。

### Step 1 初始化

首先，创建一个 Stencil 的实例，并提供了一些选项来定制 UI 和拖拽行为

```ts
import { Addon } from '@antv/x6'

const stencil = new Addon.Stencil(options)
```

创建 Stencil 的选项继承自[创建 Dnd 的选项](#step-1-初始化)，另外还支持以下选项。


| 选项                        | 类型                                                        | 必选 | 默认值      | 说明                       |
|-----------------------------|-------------------------------------------------------------|:----:|-------------|--------------------------|
| options.title               | string                                                      |      | `'Stencil'` | 标题。                      |
| options.groups              | Group[]                                                     |  ✓️  |             | 分组信息。                  |
| options.search              | Filter                                                      |      | `false`     | 搜索选项。                  |
| options.collapsable         | boolean                                                     |      | `false`     | 是否显示全局折叠/展开按钮。 |
| options.layout              | (this: Stencil, model: Model, group?: Group \| null) => any |      | 网格布局    | 模板画布中节点的布局方法。  |
| options.layoutOptions       | any                                                         |      |             | 布局选项。                  |
| options.stencilGraphWidth   | number                                                      |      | `200`       | 模板画布宽度。              |
| options.stencilGraphHeight  | number                                                      |      | `800`       | 模板画布高度。              |
| options.stencilGraphPadding | number                                                      |      | `10`        | 模板画布边距。              |
| options.stencilGraphOptions | Graph.Options                                               |      |             | 模板画布选项。              |

其中分组的定义为，分组中提供的选项的优先级高于 `options` 中的相同选项。

```ts
export interface Group {
  name: string     // 分组名称
  title?: string   // 分组标题，缺省时使用 `name`
  collapsable?: boolean // 分组是否可折叠，默认为 true
  collapsed?: boolean   // 初始状态是否为折叠状态
  graphWidth?: number          // 模板画布宽度
  graphHeight?: number         // 模板画布高度
  graphPadding?: number        // 模板画布边距
  graphOptions?: Graph.Options // 模板画布线下
  layout?: (this: Stencil, model: Model, group?: Group | null) => any
  layoutOptions?: any // 布局选项
}
```

初始化时，按照 `options.groups` 提供的分组，在每个分组中根据 `options.stencilGraphXxx` 系列选项渲染一个模板画布。

### Step 2 挂载到页面

将该 UI 组件挂载到页面合适的位置处，例如下面案例中，我们将该组件挂载到侧边栏中。

```ts
this.stencilContainer.appendChild(stencil.container)
```

### Step 3 装载模板节点

我们在每个分组中都渲染了一个模板画布，接下来我们需要向这些模板画布中添加一些模板节点。

```ts
// 创建一些模板节点。
const r1 = new Rect(...)
const c1 = new Circle(...)
const r2 = new Rect(...)
const c2 = new Circle(...)
const r3 = new Rect(...)
const c3 = new Circle(...)

// 将模板节点添加到指定的群组中。
stencil.load([r1, c1, c2, r2.clone()], 'group1')
stencil.load([c2.clone(), r2, r3, c3], 'group2')
```

添加节点时，使用分组或全局的 `layout` 和 `layoutOptions` 来对节点进行自动布局，默认使用网格布局方法来布局模板节点，支持的布局选项有：

| 选项        | 类型                          | 默认值   | 说明                                                                               |
|-------------|-------------------------------|----------|----------------------------------------------------------------------------------|
| columns     | number                        | `2`      | 网格布局的列数，默认为 `2`。行数根据节点数自动计算。                                  |
| columnWidth | number \| 'auto' \| 'compact' | `'auto'` | 列宽。auto: 所有节点中最宽节点的宽度作为列宽，compact: 该列中最宽节点的宽度作为列宽。 |
| rowHeight   | number \| 'auto' \| 'compact' | `'auto'` | 行高。auto: 所有节点中最高节点的高度作为行高，compact: 该行中最高节点的高度作为行高。 |
| dx          | number                        | `10`     | 单元格在 X 轴的偏移量，默认为 `10`。                                                 |
| dy          | number                        | `10`     | 单元格在 Y 轴的偏移量，默认为 `10`。                                                 |
| marginX     | number                        | `0`      | 单元格在 X 轴的边距，默认为 `0`。                                                    |
| marginY     | number                        | `0`      | 单元格在 Y 轴的边距，默认为 `0`。                                                    |
| center      | boolean                       | `true`   | 节点是否与网格居中对齐，默认为 `true`。                                              |
| resizeToFit | boolean                       | `false`  | 是否自动调整节点的大小来适应网格大小，默认为 `false`。                               |

也可以按照 `(this: Stencil, model: Model, group?: Group | null) => any` 签名进行自定义布局。

### Step 4 拖拽

当我们在模板节点上按下鼠标开始拖动时，就等同于使用该节点调用了 [dnd.start(node, e)](#step-2-开始拖拽) 方法来触发拖拽，更多定制选项请参考上一节 [Dnd 使用教程](#dnd)。

<iframe src="/demos/tutorial/basic/dnd/stencil"></iframe>
