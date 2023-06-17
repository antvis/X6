---
title: SplitBox
order: 12
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

拆分面板。

<iframe src="/demos/api/ui/splitbox/basic"></iframe>

## SplitBox

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| split | 拆分方向 | `'vertical'` \| `'horizontal'` | `'vertical'` |
| resizable | 是否可以调整面板大小 | boolean | `true` |
| primary | 主面板 | `'first'` \| `'second'` | `'first'` |
| size | 主面板大小 | number \| string | - |
| defaultSize | 主面板默认大小 | number \| string | `'25%'` |
| minSize | 主面板最小大小 | number | - |
| maxSize | 主面板最大大小 | number | - |
| step | 调整大小的步长 | number | - |
| style | 组件样式 | CSSProperties | - |
| boxStyle | 面板样式 | CSSProperties | - |
| primaryBoxStyle | 主面板样式 | CSSProperties | - |
| secondBoxStyle | 次面板样式 | CSSProperties | - |
| resizerStyle | 分割条样式 | CSSProperties | - |
| onResizeStart | 开始调整大小时的回调函数 | () => void | - |
| onResizeEnd | 调整大小结束时的回调函数 | (newSize: number) => void | - |
| onResizing | 调整大小过程中的回调函数 | (newSize: number) => void | - |
| onResizerClick | 单击分隔条的回调函数 | () => void | - |
| onResizerDoubleClick | 双击分隔条的回调函数 | () => void | - |
