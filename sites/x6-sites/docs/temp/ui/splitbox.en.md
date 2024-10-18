---
title: SplitBox
order: 12
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Split Panel.

<iframe src="/demos/api/ui/splitbox/basic"></iframe>

## SplitBox

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| split | Split direction | `'vertical'` \| `'horizontal'` | `'vertical'` |
| resizable | Whether the panel size can be adjusted | boolean | `true` |
| primary | Primary panel | `'first'` \| `'second'` | `'first'` |
| size | Primary panel size | number \| string | - |
| defaultSize | Default size of the primary panel | number \| string | `'25%'` |
| minSize | Minimum size of the primary panel | number | - |
| maxSize | Maximum size of the primary panel | number | - |
| step | Step size for resizing | number | - |
| style | Component style | CSSProperties | - |
| boxStyle | Panel style | CSSProperties | - |
| primaryBoxStyle | Primary panel style | CSSProperties | - |
| secondBoxStyle | Secondary panel style | CSSProperties | - |
| resizerStyle | Splitter style | CSSProperties | - |
| onResizeStart | Callback function when resizing starts | () => void | - |
| onResizeEnd | Callback function when resizing ends | (newSize: number) => void | - |
| onResizing | Callback function during resizing | (newSize: number) => void | - |
| onResizerClick | Callback function when the splitter is clicked | () => void | - |
| onResizerDoubleClick | Callback function when the splitter is double-clicked | () => void | - |
