---
title: XFlowGraph 画布
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

XFlow画布组件

## 基础用法

:::info{title="注意"}

 `<XFlowGraph />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

在 `<XFlow />` 下引入  `<XFlowGraph />` 后, 其组件内部会将画布的实例保存到 `<XFlow />` 的 context 中，以供 `<XFlow />` 的 children 使用, 可以在组件中使用 [useGraphInstance](#基础用法) Hook 快速获取画布实例

```tsx
<XFlow>
 ...
 <XFlowGraph />
<XFlow>

```

<code id="xflow-components-xflow-graph" src="@/src/xflow/components/graph/index.tsx"></code>

画布默认拥有快捷键和框选功能

## 画布只读

禁止节点和边的交互

当 `readonly` 为 `false` 时候, 如果节点/边的 `draggable` 属性为 `true` 的时候, 则节点/边可以进行移动

```tsx
 <XFlowGraph readonly />
```

## 画布缩放

- 画布的最小最大缩放级别

通过设置 `minScale` `maxScale` 来设置画布缩放

```tsx
 <XFlowGraph minScale={1} maxScale={10} />
```

- 通过滚轮缩放画布

具体的 `zoomOptions` 配置 可以参考 [mousewheel 配置](/api/graph/mousewheel#配置)

```tsx
 <XFlowGraph
    zoomable
    zoomOptions={{
      global: true,
      modifiers: ['ctrl', 'meta'],
    }}
 />
```

## 画布滚动

开启画布滚动功能

```tsx
<XFlowGraph scroller />
```

## 画布平移

开启 `pannable` 来支持画布拖拽平移, 通过 `panOptions` 来进行拖拽平移配置。

```tsx
<XFlowGraph 
    pannable 
    panOptions={{
        eventTypes: ['leftMouseDown'],
        modifiers: ['ctrl']
    }} 
/>
```

<span id="panOptions-配置参数">`panOptions` 的配置参数如下: </span>

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| modifiers | 配置修饰键, 需要按下修饰键并点击鼠标才能触发画布拖拽 | `string \| ('alt' \| 'ctrl' \| 'meta' \| 'shift')[] \| null` |-|
| eventTypes | 触发画布平移的交互方式 | `('leftMouseDown' \| 'rightMouseDown' \| 'mouseWheel', 'mouseWheelDown')[]`|-|

拖拽可能和其他操作冲突，此时可以设置 `modifiers` 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。

`ModifierKey` 支持以下几种形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]` 表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

`eventTypes` 支持三种形式或者他们之间的组合：

- `leftMouseDown`: 按下鼠标左键移动进行拖拽
- `rightMouseDown`: 按下鼠标右键移动进行拖拽
- `mouseWheel`: 使用鼠标滚轮滚动拖拽
- `mouseWheelDown`: 按下鼠标滚轮进行拖拽

## 视口变换

- centerView 设置为 true 后, 画布的内容中心将和视口中心对齐, 可通过 `centerViewOptions` 来进行配置。

```tsx
 <XFlowGraph
    centerView
    centerViewOptions={{
        padding: { left: 100 } 
    }}
    fitView
  />              
```

<span id="centerViewOptions-配置参数">`centerViewOptions` 的配置参数如下: </span>
| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
|padding|边距，只在 `scroller` 画布中生效| number \| Padding | | -|
|useCellGeometry|是否通过节点/边的几何信息(Model)计算内容区域|boolean| `true` |

- fitView 缩放画布内容，使画布内容充满视口, 可通过 `fitView` 来进行配置。
<span id="fitViewOptions-配置参数">`fitViewOptions` 的配置参数如下: </span>

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
|padding | 边距 | number \| `{ left: number, top: number, right: number, bottom: number }`   | - |
|contentArea | 内容区域，默认获取画布内容区域  |   `Rectangle.RectangleLike` | - |
|viewportArea | 视口区域，默认获取画布视口  |`Rectangle.RectangleLike`  | - |
|scaleGrid | 修正缩放比例为 `scaleGrid` 的整倍数  | number | - |
|minScale | 最小缩放比例 | number | - |
|maxScale | 最大缩放比例  | number | - |
|minScaleX | X 轴方向的最小缩放比例  | number | - |
|maxScaleX | X 轴方向的最大缩放比例  | number | - |
|minScaleY | Y 轴方向的最小缩放比例  |  number| - |
|maxScaleY | Y 轴方向的最大缩放比例 | number  | - |
|preserveAspectRatio | 是否保持长宽比  | boolean | `false` |
|useCellGeometry | 是否使用节点/边的几何信息(Model)计算包围盒  | boolean | `true` |

## 节点组合

将一个节点拖动到另一个节点中，使其成为另一节点的子节点

```tsx
<XFlowGraph
    embedable
    embedOptions={{
        frontOnly:true,
        findParent: 'bbox',
        validate: () => true,
    }}
/>
```

<span id="embedOptions-参数配置">embedOptions</span> 参数配置如下:

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
|findParent| 在节点被移动时通过 `findParent` 指定的方法返回父节点。默认值为  |[findParent](/api/model/interaction#findparent)|  `bbox` |
|frontOnly| 如果 `frontOnly` 为 `true` ，则只能嵌入显示在最前面的节点| boolean | true |
|validate|`validate` 为判断节点能否被嵌入父节点的函数| [validate](/api/model/interaction#validate) |`() => true`|

## 节点移动范围

通过配置 `restrict` 来限制节点移动范围, 通过 restrictOptions 可以指定节点移动范围

```tsx
 <XFlowGraph
    restrict
    restrictOptions={{
        bound: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        },
    }}
/>
```

<span id="restrictOptions-节点的移动范围">restrictOptions</span> 可以指定一个节点的移动范围, 如果没有设置，默认节点不能移动超出画布区域

```tsx
restrictOptions?: {
    bound:
      | Rectangle.RectangleLike
      | ((arg: CellView | null) => Rectangle.RectangleLike | null);
  };
```

## 连线配置

配置 `connectionOptions` 可以实现连线交互, 具体的配置可以参考 [连线配置](/api/model/interaction#连线)

```tsx
<XFlowGraph 
    connectionOptions={{
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        anchor: 'center',
        router: 'orth',
        connector: 'rounded',
    }}
/>
```

注意: 与连线配置不同的是，如果你想要自定义新建的边的样式, 那么需要设置  `connectionEdgeOptions` 参数,而不是在 `connectionOptions` 中设置 `createEdge`

```tsx
connectionEdgeOptions={{
    animated: true,
    draggable: false,
    selected: false,
    attrs: {
        line: {
            stroke: 'rgb(72, 203, 164)',
            strokeWidth: 2,
            targetMarker: {
            name: 'block',
            width: 14,
            height: 10,
            },
        },  
    },
    zIndex: 0,
}}
```

<span id="connectionEdgeOptions">connectionEdgeOptions</span> 参数除了继承 [Edge](/api/model/edge#属性),还额外有  `selected` | `draggable` | `animated` 三个属性

```tsx
export interface EdgeOptions extends Edge.Metadata {
  selected?: boolean;  // 是否被选中
  draggable?: boolean; // 是否可拖拽
  animated?: boolean;  // 是都展示动画
}
```

## 交互高亮

指定触发某种交互时节点/边的高亮样式

<span id="高亮-HighlightManager.Options">HighlightManager.Options</span> 有两个参数, `name` 以及其对应的 `args` , `name` 默认内置了两种高亮器，一种是 [stroke](/api/registry/highlighter#stroke)， 一种是 [className](/api/registry/highlighter#classname)

注意：当 `embedHighlightOptions` `nodeAvailableHighlightOptions`  `magnetAvailableHighlightOptions`  `magnetAdsorbedHighlightOptions` 这几种高亮配置缺省时, 默认使用 `defaultHighlightOptions` 配置

```tsx
// stroke
 <XFlowGraph
    defaultHighlightOptions={{
        name: 'stroke',
        args: {
            rx: 0,
            ry: 0,
            padding: 4,
            attrs: {
                'stroke-width': 2,
                stroke: 'red',
            },
        },
    }}
 />


// className
 <XFlowGraph 
    defaultHighlightOptions={{
        name: 'className',
        args: {
            className: 'x6-highlighted'
        },
    }}
 />
```

## API

### XFlowGraph

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| style | 语义化结构 style | CSSProperties | - |
| classNames | 语义化结构 class | string | - |
| readonly | 禁止画布交互 | boolean | false |
| virtual | 是否只渲染可视区域内容 | boolean | false |
| minScale | 画布的最小缩放级别 | number | 0.01|
| maxScale | 画布的最大缩放级别 ｜ number | 16 |
| zoomable |是否启用了鼠标滚轮来缩放画布 | boolean | false |
| zoomOptions  | 启用鼠标滚轮缩放画布的配置   | [Omit<MouseWheelOptions, 'enabled'>](/api/graph/mousewheel#配置) | - |
| pannable | 是否开启画布平移交互 | boolean | false |
| panOptions | 开启画布平移交互的配置 | [panOptions](#panOptions-配置参数) | - |
| centerView | 将画布内容中心与视口中心对齐 | boolean  | false |
| centerViewOptions | 将画布内容中心与视口中心对齐配置 | [centerViewOptions](#centerViewOptions-配置参数)  | - |
| fitView  | 缩放画布内容，使画布内容充满视口 | boolean | false |
| fitViewOptions  | 缩放画布内容配置 | [fitViewOptions](#fitViewOptions-配置参数) | - |
| scroller |是否开启滚动画布功能|boolean| false |
| scrollerOptions|开启滚动画布功能的配置| [scrollerOptions](/tutorial/plugins/scroller#选项) |-|
| connectionOptions |  连线配置 | [Omit<Options.Connecting, 'createEdge'>](/api/model/interaction#连线) | -|
| connectionEdgeOptions | 连线选项中的自定义边 | [EdgeOptions](#connectionEdgeOptions) | - |
| embedable | 是否允许节点之间组合 | boolean | false |
| embedOptions | 节点组合配置 | [embedOptions](#embedOptions-参数配置) | - |
| restrict | 是否限制节点的移动范围 | boolean | false |
| restrictOptions | 限制节点移动范围配置 | [restrict配置](#restrictOptions-节点的移动范围) | - |
| selectOptions | 框选配置 | [Selection配置](/tutorial/plugins/selection#配置)  | - |
| keyboardOptions | 快捷键配置 | [Keyboard配置](/tutorial/plugins/keyboard#配置)  | - |
| defaultHighlightOptions | 默认高亮选项，当以下高亮配置缺省时被使用 | [HighlightManager.Options](#高亮-HighlightManager.Options) | - |
| embedHighlightOptions | 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用 |[HighlightManager.Options](#高亮-HighlightManager.Options) | - |
| nodeAvailableHighlightOptions | 连线过程中，节点可以被链接时被使用 |[HighlightManager.Options](#高亮-HighlightManager.Options) | - |
| magnetAvailableHighlightOptions | 连线过程中，连接桩可以被链接时被使用 |[HighlightManager.Options](#高亮-HighlightManager.Options) | - |
| magnetAdsorbedHighlightOptions | 连线过程中，自动吸附到连接桩时被使用 |[HighlightManager.Options](#高亮-HighlightManager.Options) | - |
