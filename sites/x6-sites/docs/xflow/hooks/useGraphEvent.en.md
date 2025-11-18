---
title: useGraphEvent 
order: 2
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/hooks
---

Canvas Event Listener Hook

## Basic Usage

```tsx
 useGraphEvent('blank:click', () => { ... });
```

Here is a simple example of using `useGraphEvent` to listen for node click events and randomly change the node color.
<code id="xflow-hooks-use-graph-event" src="@/src/xflow/hooks/use-graph-event/index.tsx"></code>

## API

```tsx
 useGraphEvent<T extends keyof EventArgs>(
  name: T, 
  callback: (args: EventArgs[T]) => void
);
```

## Return Value

None

## Parameters

For specific event types to listen to, please refer to [X6 Events](/en/tutorial/basic/events).

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| name      | The event to listen for | `T` | - |
| callback   | The callback for the event listener | `(args: EventArgs[T]) => void` | - |
