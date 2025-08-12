---
title: ScrollBox
order: 14
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Custom scroll bar container.

<iframe src="/demos/api/ui/scrollbox/basic"></iframe>

```tsx
import { ScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
;<ScrollBox
  containerWidth={300}
  containerHeight={200}
  contentWidth={1200}
  contentHeight={3000}
  containerStyle={{ border: '1px solid #f0f0f0' }}
  contentStyle={{
    position: 'relative',
    cursor: 'grab',
    background:
      'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
  }}
>
  <div style={{ position: 'absolute', top: 8, left: 8 }}>Top-Left-Corner</div>
  <div style={{ position: 'absolute', top: 8, right: 8 }}>Top-Right-Corner</div>
  <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
    Bottom-Left-Corner
  </div>
  <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
    Bottom-Right-Corner
  </div>
</ScrollBox>
```

## ScrollBox

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| containerClassName | Container style class name | string | - |
| contentClassName | Content style class name | string | - |
| containerStyle | Container style | CSSProperties | - |
| contentStyle | Content style | CSSProperties | - |
| containerWidth | Container width | number | - |
| containerHeight | Container height | number | - |
| contentWidth | Content width | number | - |
| contentHeight | Content height | number | - |
| scrollTop | Position of the vertical scrollbar | number | `0` |
| scrollLeft | Position of the horizontal scrollbar | number | `0` |
| dragable | Whether the scrollbar position can be changed by dragging the content | boolean | `true` |
| touchable | Whether touch events are supported | boolean | `true` |
| scrollbarAutoHide | Whether to automatically hide the scrollbar | boolean | `true` |
| scrollbarSize | Size of the scrollbar (height of the horizontal scrollbar, width of the vertical scrollbar) | number | `4` |
| miniThumbSize | Minimum size of the scrollbar thumb | number | `16` |
| keyboardScrollAmount | Amount of scroll per key press when using keyboard arrow keys | number | `40` |
| zIndex |  | number | - |
| onVerticalScroll | Callback function when the vertical scrollbar is scrolled | (scrollTop: number) => void | - |
| onHorizontalScroll | Callback function when the horizontal scrollbar is scrolled | (scrollLeft: number) => void | - |
| onScrollStart | Callback function when scrolling starts | (scrollLeft: number, scrollTop: number) => void | - |
| onScroll | Callback function during scrolling | (scrollLeft: number, scrollTop: number) => void | - |
| onScrollEnd | Callback function when scrolling ends | (scrollLeft: number, scrollTop: number) => void | - |
