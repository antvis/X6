---
title: XFlowGraph Canvas
order: 0
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

XFlow Canvas Component

## Basic Usage

:::info{title="Note"}

The `<XFlowGraph />` component can only be used within the `<XFlow />` component.

:::

After importing `<XFlowGraph />` under `<XFlow />`, the internal component will save the canvas instance to the context of `<XFlow />` for use by its children. You can quickly obtain the canvas instance in your component using the [useGraphInstance](#basic-usage) hook.

```tsx
<XFlow>
 ...
 <XFlowGraph />
</XFlow>
```

<code id="xflow-components-xflow-graph" src="@/src/xflow/components/graph/index.tsx"></code>

The canvas has default shortcut keys and box selection functionality.

## Read-Only Canvas

Disables interaction with nodes and edges.

When `readonly` is set to `false`, if the `draggable` property of a node/edge is set to `true`, the node/edge can be moved.

```tsx
<XFlowGraph readonly />
```

## Canvas Zooming

- Minimum and maximum zoom levels for the canvas.

You can set the canvas zoom by configuring `minScale` and `maxScale`.

```tsx
<XFlowGraph minScale={1} maxScale={10} />
```

- Zooming the canvas with the mouse wheel.

For specific `zoomOptions` configuration, refer to [mousewheel configuration](/en/api/graph/mousewheel#configuration).

```tsx
<XFlowGraph
    zoomable
    zoomOptions={{
      global: true,
      modifiers: ['ctrl', 'meta'],
    }}
/>
```

## Canvas Scrolling

Enable the canvas scrolling feature.

```tsx
<XFlowGraph scroller />
```

## Canvas Panning

Enable `pannable` to support dragging and panning the canvas, and configure dragging options through `panOptions`.

```tsx
<XFlowGraph 
    pannable 
    panOptions={{
        eventTypes: ['leftMouseDown'],
        modifiers: ['ctrl']
    }} 
/>
```

<span id="panOptions-configuration-parameters">The configuration parameters for `panOptions` are as follows:</span>

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| modifiers | Configures modifier keys; dragging the canvas requires pressing the modifier key and clicking the mouse | `string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null` | - |
| eventTypes | Interaction methods that trigger canvas panning | `('leftMouseDown' | 'rightMouseDown' | 'mouseWheel' | 'mouseWheelDown')[]` | - |

Dragging may conflict with other operations; in this case, you can set the `modifiers` parameter. After setting the modifier keys, you need to press the modifier key and click the mouse to trigger canvas dragging.

`ModifierKey` supports the following forms:

- `alt` means pressing `alt`.
- `[alt, ctrl]` means pressing either `alt` or `ctrl`.
- `alt|ctrl` means pressing either `alt` or `ctrl`.
- `alt&ctrl` means pressing both `alt` and `ctrl` simultaneously.
- `alt|ctrl&shift` means pressing both `alt` and `shift` or both `ctrl` and `shift` simultaneously.

`eventTypes` supports three forms or combinations of them:

- `leftMouseDown`: Dragging by pressing the left mouse button.
- `rightMouseDown`: Dragging by pressing the right mouse button.
- `mouseWheel`: Dragging using the mouse wheel.
- `mouseWheelDown`: Dragging by pressing the mouse wheel.

## Viewport Transformation

- When `centerView` is set to true, the center of the canvas content will align with the center of the viewport. You can configure this with `centerViewOptions`.

```tsx
<XFlowGraph
    centerView
    centerViewOptions={{
        padding: { left: 100 } 
    }}
    fitView
/>              
```

<span id="centerViewOptions-configuration-parameters">The configuration parameters for `centerViewOptions` are as follows:</span>

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| padding | Margin, effective only in `scroller` canvas | number | - |
| useCellGeometry | Whether to calculate the content area using the geometric information (Model) of nodes/edges | boolean | `true` |

- `fitView` scales the canvas content to fill the viewport. You can configure this with `fitView`.

<span id="fitViewOptions-configuration-parameters">The configuration parameters for `fitViewOptions` are as follows:</span>

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| padding | Margin | number | `{ left: number, top: number, right: number, bottom: number }` | - |
| contentArea | Content area, defaults to the canvas content area | `Rectangle.RectangleLike` | - |
| viewportArea | Viewport area, defaults to the canvas viewport | `Rectangle.RectangleLike` | - |
| scaleGrid | Corrects the zoom ratio to be a multiple of `scaleGrid` | number | - |
| minScale | Minimum zoom ratio | number | - |
| maxScale | Maximum zoom ratio | number | - |
| minScaleX | Minimum zoom ratio in the X direction | number | - |
| maxScaleX | Maximum zoom ratio in the X direction | number | - |
| minScaleY | Minimum zoom ratio in the Y direction | number | - |
| maxScaleY | Maximum zoom ratio in the Y direction | number | - |
| preserveAspectRatio | Whether to maintain the aspect ratio | boolean | `false` |
| useCellGeometry | Whether to use the geometric information (Model) of nodes/edges to calculate the bounding box | boolean | `true` |

## Node Embedding

Drag one node into another to make it a child of the other node.

```tsx
<XFlowGraph
    embedable
    embedOptions={{
        frontOnly: true,
        findParent: 'bbox',
        validate: () => true,
    }}
/>
```

<span id="embedOptions-parameter-configuration">The configuration for `embedOptions` is as follows:</span>

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| findParent | Method to specify how to find the parent node when a node is moved. Default value is [findParent](/en/api/model/interaction#findparent) | `bbox` |
| frontOnly | If `frontOnly` is true, nodes can only be embedded if they are displayed in front | boolean | true |
| validate | `validate` is a function that determines whether a node can be embedded in a parent node | [validate](/en/api/model/interaction#validate) | `() => true` |

## Node Movement Range

You can restrict the movement range of nodes by configuring `restrict`, and specify the movement range through `restrictOptions`.

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

<span id="restrictOptions-node-movement-range">The `restrictOptions` can specify the movement range of a node. If not set, nodes cannot move outside the canvas area.</span>

```tsx
restrictOptions?: {
    bound:
      | Rectangle.RectangleLike
      | ((arg: CellView | null) => Rectangle.RectangleLike | null);
};
```

## Connection Configuration

Configure `connectionOptions` to enable connection interactions. For specific configurations, refer to [connection configuration](/en/api/model/interaction#connecting).

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

Note: Unlike connection configuration, if you want to customize the style of newly created edges, you need to set the `connectionEdgeOptions` parameter instead of configuring `createEdge` in `connectionOptions`.

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

The `connectionEdgeOptions` parameter inherits from [Edge](/en/api/model/edge#attributes) and additionally has the properties `selected`, `draggable`, and `animated`.

```tsx
export interface EdgeOptions extends Edge.Metadata {
  selected?: boolean;  // Whether selected
  draggable?: boolean; // Whether draggable
  animated?: boolean;  // Whether to show animation
}
```

## Interaction Highlighting

Specify the highlight style for nodes/edges when a certain interaction is triggered.

<span id="highlight-HighlightManager.Options">HighlightManager.Options</span> has two parameters, `name` and its corresponding `args`. The `name` has two built-in highlight types: one is [stroke](/en/api/registry/highlighter#stroke) and the other is [className](/en/api/registry/highlighter#classname).

Note: When the following highlight configurations `embedHighlightOptions`, `nodeAvailableHighlightOptions`, `magnetAvailableHighlightOptions`, and `magnetAdsorbedHighlightOptions` are not set, the `defaultHighlightOptions` configuration is used by default.

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

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| style | Semantic structure style | CSSProperties | - |
| classNames | Semantic structure class | string | - |
| readonly | Disables canvas interaction | boolean | false |
| virtual | Whether to render only the visible area content | boolean | false |
| minScale | Minimum zoom level for the canvas | number | 0.01 |
| maxScale | Maximum zoom level for the canvas | number | 16 |
| zoomable | Whether mouse wheel zooming is enabled for the canvas | boolean | false |
| zoomOptions | Configuration for enabling mouse wheel zooming | [Omit<MouseWheelOptions, 'enabled'>](/en/api/graph/mousewheel#configuration) | - |
| pannable | Whether to enable canvas panning interaction | boolean | false |
| panOptions | Configuration for enabling canvas panning interaction | [panOptions](#panOptions-configuration-parameters) | - |
| centerView | Aligns the center of the canvas content with the center of the viewport | boolean | false |
| centerViewOptions | Configuration for aligning the center of the canvas content with the viewport | [centerViewOptions](#centerViewOptions-configuration-parameters) | - |
| fitView | Scales the canvas content to fill the viewport | boolean | false |
| fitViewOptions | Configuration for scaling the canvas content | [fitViewOptions](#fitViewOptions-configuration-parameters) | - |
| scroller | Whether to enable scrolling on the canvas | boolean | false |
| scrollerOptions | Configuration for enabling scrolling on the canvas | [scrollerOptions](/en/tutorial/plugins/scroller#options) | - |
| connectionOptions | Connection configuration | [Omit<Options.Connecting, 'createEdge'>](/en/api/model/interaction#connection) | - |
| connectionEdgeOptions | Custom edge in connection options | [EdgeOptions](#connectionEdgeOptions) | - |
| embedable | Whether to allow node embedding | boolean | false |
| embedOptions | Node embedding configuration | [embedOptions](#embedOptions-parameter-configuration) | - |
| restrict | Whether to restrict node movement range | boolean | false |
| restrictOptions | Configuration for restricting node movement range | [restrict configuration](#restrictOptions-node-movement-range) | - |
| selectOptions | Box selection configuration | [Selection configuration](/en/tutorial/plugins/selection#configuration) | - |
| keyboardOptions | Shortcut key configuration | [Keyboard configuration](/en/tutorial/plugins/keyboard#configuration) | - |
| defaultHighlightOptions | Default highlight options used when the following highlight configurations are not set | [HighlightManager.Options](#highlight-HighlightManager.Options) | - |
| embedHighlightOptions | Used when dragging nodes for embedding operations | [HighlightManager.Options](#highlight-HighlightManager.Options) | - |
| nodeAvailableHighlightOptions | Used when nodes can be linked during connection | [HighlightManager.Options](#highlight-HighlightManager.Options) | - |
| magnetAvailableHighlightOptions | Used when connection magnets can be linked | [HighlightManager.Options](#highlight-HighlightManager.Options) | - |
| magnetAdsorbedHighlightOptions | Used when automatically snapping to connection magnets | [HighlightManager.Options](#highlight-HighlightManager.Options) | - |
