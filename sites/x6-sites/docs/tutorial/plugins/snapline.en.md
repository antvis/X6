---
title: Snapline
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This section mainly introduces knowledge related to the snapline plugin. By reading, you can learn about"}

- How to use snapline in the canvas

:::

## Usage

The alignment line is an auxiliary tool for the layout of movable nodes. We provide a standalone plugin package `@antv/x6-plugin-snapline` to use this feature.

```shell
# npm
$ npm install @antv/x6-plugin-snapline --save

# yarn
$ yarn add @antv/x6-plugin-snapline
```

Then we use it in the code like this:

```ts
import { Snapline } from '@antv/x6-plugin-snapline'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

## Demo

<code id="plugin-snapline" src="@/src/tutorial/plugins/snapline/index.tsx"></code>

## Configuration

| Property Name | Type    | Default Value | Required | Description                                                                                     |
|---------------|---------|---------------|----------|-------------------------------------------------------------------------------------------------|
| className     | string  | -             |          | Additional style name for customizing the alignment line style                                   |
| tolerance      | number  | 10            |          | Alignment precision; the alignment line is triggered when the distance to the target position is less than `tolerance` |
| sharp         | boolean | `false`       |          | Whether to display truncated snapline                                                      |
| resizing      | boolean | `false`       |          | Whether to trigger snapline when resizing nodes                                           |
| clean         | boolean | `true`        |          | If `true`, the alignment line will be cleared after 3 seconds; if `false`, it will not be cleared; if a number (ms), it will be cleared after the specified time |
| filter        | Filter  | -             |          | Node filter                                                                                     |

The above Filter type is relatively complex and supports the following three types:

- `string[]`: An array of node `shape`; only the specified node `shape` will participate in alignment calculations
- `({ id: string })[]`: An array of node IDs; only the specified nodes will participate in alignment calculations
- `(this: Graph, node: Node) => boolean`: Only nodes that return `true` will participate in alignment calculations

## API

### graph.isSnaplineEnabled()

```ts
isSnaplineEnabled(): boolean
```

Returns whether the alignment line is enabled.

### graph.enableSnapline()

```ts
enableSnapline(): this
```

Enables the alignment line.

### graph.disableSnapline()

```ts
disableSnapline(): this
```

Disables the alignment line.

### graph.toggleSnapline(...)

```ts
toggleSnapline(enabled?: boolean): this
```

Toggles the enabled state of the alignment line. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable the alignment line; defaults to toggling the enabled state of the alignment line. |

### graph.hideSnapline()

```ts
hideSnapline(): this
```

Hides the alignment line.

### graph.isSnaplineOnResizingEnabled()

```ts
isSnaplineOnResizingEnabled(): boolean
```

Whether to trigger the alignment line when resizing nodes.

### graph.enableSnaplineOnResizing()

```ts
enableSnaplineOnResizing(): this
```

Enables triggering the alignment line during node resizing.

### graph.disableSnaplineOnResizing()

```ts
disableSnaplineOnResizing(): this
```

Disables triggering the alignment line during node resizing.

### graph.toggleSnaplineOnResizing(...)

```ts
toggleSnaplineOnResizing(enabled?: boolean): this
```

Toggles whether to trigger the alignment line during node resizing. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable the alignment line; defaults to toggling the enabled state of the alignment line. |

### graph.isSharpSnapline()

```ts
isSharpSnapline(): boolean
```

Whether to use short snapline.

### graph.enableSharpSnapline()

```ts
enableSharpSnapline(): this
```

Enables short snapline; when enabled, the snapline only show up to the relevant node positions, otherwise they span across the canvas.

### graph.disableSharpSnapline()

```ts
disableSharpSnapline(): this
```

Disables short snapline; snapline will span the entire canvas.

### graph.toggleSharpSnapline()

```ts
toggleSharpSnapline(enabled?: boolean): this
```

Toggles the enabled state of short snapline. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable short snapline; defaults to toggling the enabled state of short snapline. |

### graph.getSnaplineTolerance()

```ts
getSnaplineTolerance(): number
```

Gets the alignment line precision.

### graph.setSnaplineTolerance(...)

```ts
setSnaplineTolerance(tolerance: number): this
```

Sets the alignment line precision.

### graph.setSnaplineFilter(...)

```ts
setSnaplineFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, node: Node) => boolean)
): this
```

Sets the filter condition; only nodes that meet the filter condition will participate in alignment line calculations.
