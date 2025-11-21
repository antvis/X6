---
title: Scroller
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="In this chapter, we mainly introduce knowledge related to the scroller plugin. By reading, you can learn about"}

- How to enable scrolling capabilities for the canvas

:::

:::warning{title=Note}
The `Scroller` plugin disables the graph's built-in `panning` by default to avoid interaction conflicts.
:::

## Usage

You can enable canvas scrolling with the `Scroller` plugin. For example:

```ts
import { Graph, Scroller } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  }
})
graph.use(
  new Scroller({
    enabled: true,
  }),
)
```

## Demo

<code id="plugin-scroller" src="@/src/tutorial/plugins/scroller/index.tsx"></code>

## Options

| Property Name     | Type                | Default  | Required | Description                                                                                                                                                                           |
|-------------------|---------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pannable           | boolean             | `false`  |          | Whether to enable canvas panning capability (dragging the canvas after pressing the mouse on a blank area)                                                                           |
| className          | string              | -        |          | Additional class name for custom styling                                                                                                                                              |
| width              | number              | -        |          | Width of the `Scroller`, defaults to the width of the canvas container                                                                                                               |
| height             | number              | -        |          | Height of the `Scroller`, defaults to the height of the canvas container                                                                                                             |
| modifiers          | ModifierKey         | -        |          | Set modifier keys that need to be pressed along with the mouse click to trigger canvas dragging                                                                                      |
| pageWidth          | number              | -        |          | Width of each page, defaults to the width of the canvas container                                                                                                                    |
| pageHeight         | number              | -        |          | Height of each page, defaults to the height of the canvas container                                                                                                                  |
| pageVisible        | boolean             | `false`  |          | Whether to enable pagination                                                                                                                                                          |
| pageBreak          | boolean             | `false`  |          | Whether to show page breaks                                                                                                                                                          |
| autoResize         | boolean             | `true`   |          | Whether to automatically expand/shrink the canvas. When enabled, moving nodes/edges will automatically calculate the required canvas size, expanding it according to `pageWidth` and `pageHeight` when exceeding the current size, and shrinking it otherwise. |
| minVisibleWidth    | number              | -        |          | Effective when `padding` is empty, sets the minimum visible width of the canvas during scrolling                                                                                     |
| minVisibleHeight   | number              | -        |          | Effective when `padding` is empty, sets the minimum visible height of the canvas during scrolling                                                                                    |
| padding            | `number \| Padding` | -        |          | Sets the padding around the canvas. Defaults to being automatically calculated based on `minVisibleWidth` and `minVisibleHeight`, ensuring that at least `minVisibleWidth` and `minVisibleHeight` of the canvas is visible during scrolling. |

The `Padding` type is defined as follows:

```ts
type Padding = { top: number; right: number; bottom: number; left: number }
```

The `ModifierKey` type is defined as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

Supports the following forms:

- `alt` means pressing `alt`.
- `[alt, ctrl]` means pressing either `alt` or `ctrl`.
- `alt|ctrl` means pressing either `alt` or `ctrl`.
- `alt&ctrl` means pressing both `alt` and `ctrl` simultaneously.
- `alt|ctrl&shift` means pressing both `alt` and `shift` simultaneously or both `ctrl` and `shift` simultaneously.

## API

### graph.lockScroller()

Disables scrolling.

### graph.unlockScroller()

Enables scrolling.

### graph.getScrollbarPosition()

Gets the scrollbar position.

### graph.setScrollbarPosition(left?: number, top?: number)

Sets the scrollbar position.

- `left?: number` The position of the horizontal scrollbar; defaults to no horizontal scrolling.
- `top?: number` The position of the vertical scrollbar; defaults to no vertical scrolling.

For example:

```ts
graph.setScrollbarPosition(100)
graph.setScrollbarPosition(100, null)
graph.setScrollbarPosition(null, 200)
graph.setScrollbarPosition(100, 200)
```
