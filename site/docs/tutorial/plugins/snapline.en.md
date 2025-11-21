---
title: Snapline
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This section mainly introduces the Snapline plugin. By reading, you will learn:"}

- How to use snaplines on the canvas

:::

## Usage

Snaplines help align moving nodes. Enable the feature via the `Snapline` plugin:

```ts
import { Graph, Snapline } from '@antv/x6'

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

| Property Name | Type    | Default Value | Required | Description                                                                                               |
|---------------|---------|---------------|----------|-----------------------------------------------------------------------------------------------------------|
| className     | string  | -             |          | Additional class name to customize snapline styles                                                         |
| tolerance     | number  | 10            |          | Snapline precision; a snapline is shown when the distance to the target position is less than `tolerance` |
| sharp         | boolean | `false`       |          | Whether to use short snaplines (truncated)                                                                 |
| resizing      | boolean | `false`       |          | Whether to trigger snaplines when resizing nodes                                                            |
| clean         | boolean | `true`        |          | If `true`, snaplines are cleared after 3 seconds; if `false`, they are not cleared; if a number (ms), they are cleared after the specified duration |
| filter        | Filter  | -             |          | Node filter                                                                                                 |

The above Filter type is relatively flexible and supports the following forms:

- `string[]`: An array of node `shape`s; only nodes with those shapes participate in snapline calculations
- `({ id: string })[]`: An array of node IDs; only the specified nodes participate in snapline calculations
- `(this: Graph, node: Node) => boolean`: Only nodes for which the function returns `true` participate in snapline calculations

## API

### graph.isSnaplineEnabled()

```ts
isSnaplineEnabled(): boolean
```

Returns whether snaplines are enabled.

### graph.enableSnapline()

```ts
enableSnapline(): this
```

Enables snaplines.

### graph.disableSnapline()

```ts
disableSnapline(): this
```

Disables snaplines.

### graph.toggleSnapline(...)

```ts
toggleSnapline(enabled?: boolean): this
```

Toggles whether snaplines are enabled. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable snaplines; if omitted, toggles the current enabled state.                                     |

### graph.hideSnapline()

```ts
hideSnapline(): this
```

Hides snaplines.

### graph.isSnaplineOnResizingEnabled()

```ts
isSnaplineOnResizingEnabled(): boolean
```

Whether to trigger snaplines when resizing nodes.

### graph.enableSnaplineOnResizing()

```ts
enableSnaplineOnResizing(): this
```

Enables triggering snaplines during node resizing.

### graph.disableSnaplineOnResizing()

```ts
disableSnaplineOnResizing(): this
```

Disables triggering snaplines during node resizing.

### graph.toggleSnaplineOnResizing(...)

```ts
toggleSnaplineOnResizing(enabled?: boolean): this
```

Toggles whether to trigger snaplines during node resizing. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable snaplines; if omitted, toggles the current enabled state.                                     |

### graph.isSharpSnapline()

```ts
isSharpSnapline(): boolean
```

Whether to use short snaplines.

### graph.enableSharpSnapline()

```ts
enableSharpSnapline(): this
```

Enables short snaplines; when enabled, snaplines are truncated at relevant node positions; otherwise they span across the canvas.

### graph.disableSharpSnapline()

```ts
disableSharpSnapline(): this
```

Disables short snaplines; snaplines span the entire canvas.

### graph.toggleSharpSnapline()

```ts
toggleSharpSnapline(enabled?: boolean): this
```

Toggles whether short snaplines are enabled. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable short snaplines; if omitted, toggles the current enabled state.                                |

### graph.getSnaplineTolerance()

```ts
getSnaplineTolerance(): number
```

Gets snapline precision.

### graph.setSnaplineTolerance(...)

```ts
setSnaplineTolerance(tolerance: number): this
```

Sets snapline precision.

### graph.setSnaplineFilter(...)

```ts
setSnaplineFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, node: Node) => boolean)
): this
```

Sets the filter; only nodes that meet the condition participate in snapline calculations.
