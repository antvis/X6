---
title: Panning
order: 4
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

## Demo

<code id="api-graph-panning" src="@/src/api/panning/playground/index.tsx"></code>

## Configuration

A regular canvas (without the `scroller` plugin) can support panning by enabling the `panning` option.

:::warning{title=Note}
Do not use `scroller` and `panning` simultaneously, as they conflict with each other in terms of interaction.
:::

```ts
const graph = new Graph({
  panning: true,
})

// Equivalent to
const graph = new Graph({
  panning: {
    enabled: true,
  },
})
```

The supported options are as follows:

```ts
interface Options {
  enabled?: boolean
  modifiers?: ModifierKey
  eventTypes?: ('leftMouseDown' | 'rightMouseDown' | 'mouseWheel', 'mouseWheelDown')[]
}
```

### enabled

Whether to enable canvas panning interaction.

### modifiers

Dragging may conflict with other operations, so you can set the `modifiers` parameter to specify a modifier key that needs to be pressed along with the mouse click to trigger canvas panning.

The type definition of `ModifierKey` is as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

It supports the following forms:

-  `alt` represents pressing the `alt` key.
-  `[alt, ctrl]` represents pressing either the `alt` or `ctrl` key.
-  `alt|ctrl` represents pressing either the `alt` or `ctrl` key.
-  `alt&ctrl` represents pressing both the `alt` and `ctrl` keys simultaneously.
-  `alt|ctrl&shift` represents pressing both the `alt` and `shift` keys simultaneously or pressing both the `ctrl` and `shift` keys simultaneously.

### eventTypes

The interaction types that trigger canvas panning. It supports three forms or their combinations:

-  `leftMouseDown`: Dragging by pressing the left mouse button
-  `rightMouseDown`: Dragging by pressing the right mouse button
-  `mouseWheel`: Dragging by scrolling the mouse wheel
-  `mouseWheelDown`: Dragging by pressing the mouse wheel

## Methods

### isPannable()

```ts
isPannable(): boolean
```

Returns whether canvas panning interaction is enabled.

### enablePanning()

```ts
enablePanning(): this
```

Enables canvas panning.

### disablePanning()

```ts
disablePanning(): this
```

Disables canvas panning.

### togglePanning(...)

```ts
togglePanning(enabled?: boolean): this
```

Toggles the enabled state of canvas panning. The parameter is as follows:

| Name    | Type    | Required | Default Value | Description                                               |
|---------|---------|:--------:|--------------|--------------------------------------------------|
| enabled | boolean |          | -            | Whether to enable canvas panning, defaults to toggling the enabled state. |
