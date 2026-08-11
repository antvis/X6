---
title: Mousewheel
order: 5
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

## Demonstration

> Hold down the `Command` key and use the mouse wheel to zoom in/out of the canvas.

<code id="api-graph-mousewheel" src="@/src/api/mousewheel/playground/index.tsx"></code>

## Configuration

You can use the `mousewheel` configuration to zoom in/out of the canvas, often used in combination with modifier keys. The usage is as follows:

```ts
const graph = new Graph({
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
})
```

Supported options are as follows:

```ts
interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  factorByDelta?: boolean
  zoomAtMousePosition?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  guard?: (this: Graph, e: WheelEvent) => boolean
}
```

### enabled

Whether to enable mouse wheel zooming interaction.

### factor

The zoom factor. Defaults to `1.2`.

### factorByDelta

Whether to scale the zoom step by the wheel-delta magnitude instead of applying a fixed quantized step per event. Defaults to `false`.

When `false` (default), every wheel event applies a fixed step (at least 5%), which makes a trackpad pinch — emitting many small high-frequency wheel events — zoom far too fast. When `true`, the zoom step is proportional to the wheel delta: a standard ~100px notch keeps the classic `factor` feel, while small trackpad deltas produce smooth, proportionally small steps.

### zoomAtMousePosition

Whether to zoom in/out at the mouse position. Defaults to `true`.

### global

Whether to bind the wheel event globally. If set to `true`, the wheel event is bound to the `Document`, otherwise it is bound to the canvas container. Defaults to `false`.

### modifiers

Modifier keys (`alt`, `ctrl`, `meta`, `shift`), which can be set to resolve conflicts between default wheel behavior and canvas zooming. Modifier keys support the following formats:

-  `alt` represents pressing the `alt` key.
-  `[alt, ctrl]` represents pressing either `alt` or `ctrl`.
-  `alt|ctrl` represents pressing either `alt` or `ctrl`.
-  `alt&ctrl` represents pressing both `alt` and `ctrl` simultaneously.
-  `alt|ctrl&shift` represents pressing both `alt` and `shift` simultaneously or both `ctrl` and `shift` simultaneously.

### guard

Determines whether a wheel event should be handled, returning `false` to ignore the event.

```ts
new Graph({
  mousewheel: {
    enabled: true,
    guard(e: WheelEvent) {
      if (e.altKey) {
        // Ignore all wheel events when the alt key is pressed
        return false
      }
      return true
    },
  },
})
```

## Methods

### isMouseWheelEnabled()

```ts
isMouseWheelEnabled(): boolean
```

Returns whether mouse wheel zooming is enabled.

### enableMouseWheel()

```ts
enableMouseWheel(): this
```

Enables mouse wheel zooming.

### disableMouseWheel()

```ts
disableMouseWheel(): this
```

Disables mouse wheel zooming.

### toggleMouseWheel(...)

```ts
toggleMouseWheel(enabled?: boolean): this
```

Toggles the enabled state of mouse wheel zooming.

| Name | Type | Required | Default | Description |
| --- | --- | :-: | --- | --- |
| enabled | boolean |  | - | Whether to enable mouse wheel zooming, toggles the state if not provided. |
