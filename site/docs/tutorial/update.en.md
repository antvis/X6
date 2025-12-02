---
title: Upgrade to 3.x
order: 5
redirect_from:
  - /en/docs/tutorial/update
---

Compared to 2.x, 3.x mainly focuses on plugin consolidation (unified export), optimized default interactions, introduces animation capabilities, and adds virtual rendering support. The upgrade cost is low.

## Overview

- Plugin consolidation: all `@antv/x6-plugin-xxxx` packages are merged into the main `@antv/x6` package and exported from there.
- Import path change: import plugins directly from `@antv/x6`; the existing `graph.use(new Xxx())` usage remains unchanged.
- Default interaction tweak: canvas `panning` is enabled by default.
- New animation capability: supports imperative, declarative, and custom Shape-based animations.
- With `Scroller`, virtual rendering is available via `virtual: true` for large graphs.

## Upgrade Guide

### package.json

3.x merges commonly used plugins into `@antv/x6`, so you no longer need to install separate `@antv/x6-plugin-xxxx` packages.

```json
{
  "@antv/x6": "^3.0.0"
}
```

Remove the following dependencies if present:

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

### Import Path Changes

Starting from 3.x, the plugins above are exported from `@antv/x6`. Usage remains the same; simply replace the import path:

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

### New Animation Capability

3.x introduces `animate` and removes the 2.x `transition` API, making it easier to add effects to nodes and edges.

See more: [Animation Docs](/en/tutorial/basic/animation).

### Configuration Changes

- Graph panning `panning` is enabled by default (`enabled: true`). To disable, set `panning: false`.
- When graph `panning` conflicts with Selection rubberband triggers, Selection takes precedence.
- With `Scroller`, graph `panning` is disabled by default to avoid interaction conflicts, and virtual rendering can be enabled via `virtual: true`.

### Shape Packages Upgrade (React/Vue/Angular)

- X6 3.x must use the 3.x versions of the shape packages: `@antv/x6-react-shape@^3.x`, `@antv/x6-vue-shape@^3.x`, and `@antv/x6-angular-shape@^3.x`.

```json
{
  "@antv/x6-react-shape": "^3.0.0",
  "@antv/x6-vue-shape": "^3.0.0",
  "@antv/x6-angular-shape": "^3.0.0"
}
```

#### React Provider API Change

Change 2.x `Portal.getProvider()` to 3.x `getProvider()`:

```ts
// 2.x
import { Portal } from '@antv/x6-react-shape'
const Provider = Portal.getProvider()

// 3.x
import { getProvider } from '@antv/x6-react-shape'
const Provider = getProvider()
```
