---
title: ScrollBox
order: 14
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/ui
---

自定义滚动条的容器。

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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| containerClassName | 容器样式名 | string | - |
| contentClassName | 内容样式名 | string | - |
| containerStyle | 容器样式 | CSSProperties | - |
| contentStyle | 内容样式 | CSSProperties | - |
| containerWidth | 容器宽度 | number | - |
| containerHeight | 容器高度 | number | - |
| contentWidth | 内容宽度 | number | - |
| contentHeight | 内容高度 | number | - |
| scrollTop | 垂直滚动条的位置 | number | `0` |
| scrollLeft | 水平滚动条的位置 | number | `0` |
| dragable | 是否可以通过拖动内容来改变滚动条的位置 | boolean | `true` |
| touchable | 是否支持 touch 事件 | boolean | `true` |
| scrollbarAutoHide | 是否自动隐藏滚动条 | boolean | `true` |
| scrollbarSize | 滚动条大小（水平滚动条的高度、垂直滚动条的宽度） | number | `4` |
| miniThumbSize | 滚动条最小标识大小 | number | `16` |
| keyboardScrollAmount | 通过键盘方向键滚动时，每次滚动的大小 | number | `40` |
| zIndex |  | number | - |
| onVerticalScroll | 垂直滚动条滚动时的回调函数 | (scrollTop: number) => void | - |
| onHorizontalScroll | 水平滚动条滚动时的回调函数 | (scrollLeft: number) => void | - |
| onScrollStart | 滚动条开始滚动时的回调函数 | (scrollLeft: number, scrollTop: number) => void | - |
| onScroll | 滚动条滚动时的回调函数 | (scrollLeft: number, scrollTop: number) => void | - |
| onScrollEnd | 滚动条结束滚动时的回调函数 | (scrollLeft: number, scrollTop: number) => void | - |
