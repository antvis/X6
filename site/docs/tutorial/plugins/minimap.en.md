---
title: Mini Map
order: 7
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces knowledge related to the Mini Map plugin. By reading, you can learn about"}

- How to use the Mini Map plugin

:::

## Usage

You can enable the mini-map with the `MiniMap` plugin. Example:

```ts
import { Graph, MiniMap } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new MiniMap({
    container: document.getElementById('minimap'),
  }),
)
```

## Demo

- Move the mini-map viewport to move the canvas.
- Zoom the mini-map viewport to zoom the canvas.

<code id="plugin-minimap" src="@/src/tutorial/plugins/minimap/index.tsx"></code>

## Options

| Property Name | Type          | Default Value | Required | Description                      |
|---------------|---------------|---------------|----------|----------------------------------|
| container     | HTMLElement   | -             | ✓️        | The container to mount the mini-map |
| width         | number        | `300`         |          | The width of the mini-map        |
| height        | number        | `200`         |          | The height of the mini-map       |
| padding       | number        | `10`          |          | The padding margin of the mini-map container |
| scalable      | boolean       | `true`        |          | Whether scaling is enabled        |
| minScale      | number        | `0.01`        |          | The minimum scale ratio           |
| maxScale      | number        | `16`          |          | The maximum scale ratio           |
| graphOptions  | Graph.Options | `{}`          |          | Options for the internal mini-map Graph |
| createGraph   | (options: Graph.Options) => Graph | `options => new Graph(options)` |          | Custom method to create the internal mini-map Graph |
