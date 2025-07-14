---
title: Grid
order: 2
redirect_from:
  - /en/docs
  - /en/docs/api
---

The grid is the smallest unit of rendering/moving nodes. The default grid size is `10px`. When rendering nodes, it means aligning to the grid with `10` as the minimum unit, such as a node with a position of `{ x: 24, y: 38 }` will be rendered at `{ x: 20, y: 40 }` on the canvas. When moving nodes, it means the minimum distance of each move is `10px`.

## Demo

<code id="api-graph-grid" src="@/src/api/grid/playground/index.tsx"></code>

## Configuration

### size

You can set the grid size when creating the canvas through the following configuration.

```ts
const graph = new Graph({
  grid: 10,
})

// Equivalent to
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

### type

The grid is invisible by default. You can enable grid drawing when creating the canvas through the following configuration.

```ts
const graph = new Graph({
  grid: true, // Grid size is 10px and draw the grid
})

// Equivalent to
const graph = new Graph({
  grid: {
    size: 10, // Grid size is 10px
    visible: true, // Draw the grid, default is dot type
  },
})
```

We have four built-in grid types, which can be specified through the `type` option, with a default value of `dot`. You can also configure the grid style through the `args` option.

#### dot (default)

Dot grid.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'dot',
    args: {
      color: '#a0a0a0', // Grid point color
      thickness: 1, // Grid point size
    },
  },
})
```

#### fixedDot

Fixed dot grid with a fixed point size. When the canvas zoom ratio is less than `1`, the grid point size scales with the canvas zoom ratio. When the canvas zoom ratio is greater than `1`, the grid point size is the given `thickness` value.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    size: 10,
    type: 'fixedDot',
    args: {
      color: '#a0a0a0', // Grid point color
      thickness: 2, // Grid point size
    },
  },
})

graph.scale(10, 10)
```

#### mesh

Mesh grid.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'mesh',
    args: {
      color: '#ddd', // Grid line color
      thickness: 1, // Grid line width
    },
  },
})
```

#### doubleMesh

Double mesh grid.

```ts
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // Main grid line color
        thickness: 1, // Main grid line width
      },
      {
        color: '#ddd', // Secondary grid line color
        thickness: 1, // Secondary grid line width
        factor: 4, // Main and secondary grid line interval
      },
    ],
  },
})
```

## Methods

### getGridSize()

```ts
getGridSize(): number
```

Get the grid size.

### setGridSize()

```ts
setGridSize(gridSize: number): this
```

Set the grid size.

### showGrid()

```ts
showGrid(): this
```

Show the grid.

### hideGrid()

```ts
hideGrid(): this
```

Hide the grid.

### clearGrid()

```ts
clearGrid(): this
```

Clear the grid.

### drawGrid(...)

```ts
drawGrid(options?: DrawGridOptions): this
```

Redraw the grid.

| Name | Type | Required | Default | Description |
| --- | --- | :-: | --- | --- |
| type | string |  | `dot` | Grid type. For details, please refer to [here](/en/api/registry/grid). |
| args | object |  | - | Grid parameters corresponding to the grid type. |

## Custom Grid

Here's an example of registering a red dot grid:

```ts
Graph.registerGrid('red-dot', {
  color: 'red',
  thickness: 1,
  markup: 'rect',
  update(elem, options) {
    const width = options.thickness * options.sx
    const height = options.thickness * options.sy
    Dom.attr(elem, {
      width,
      height,
      rx: width,
      ry: height,
      fill: options.color,
    })
  },
})

const graph = new Graph({
  grid: {
    type: 'red-dot',
  },
})
```
