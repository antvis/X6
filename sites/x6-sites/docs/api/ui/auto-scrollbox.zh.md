---
title: AutoScrollBox
order: 16
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/ui
---

自动根据内容大小设置和更新容器的滚动条。

<iframe src="/demos/api/ui/auto-scrollbox/basic"></iframe>

```tsx
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

<div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
  <AutoScrollBox>
    <div
      style={{
        position: 'relative',
        width: 1200,
        height: 3000,
        cursor: 'grab',
        background:
          'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
      }}
    >
      <div style={{ position: 'absolute', top: 8, left: 8 }}>Top-Left-Corner</div>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>Top-Right-Corner</div>
      <div style={{ position: 'absolute', bottom: 8, left: 8 }}>Bottom-Left-Corner</div>
      <div style={{ position: 'absolute', bottom: 8, right: 8 }}>Bottom-Right-Corner</div>
    </div>
  </AutoScrollBox>
</div>
```

## AutoScrollBox

| 参数           | 说明                                     | 类型                                    | 默认值 |
|----------------|----------------------------------------|-----------------------------------------|--------|
| scrollBoxProps | 内部的 [ScrollBox](/zh/docs/api/ui/scrollbox) 组件选项 | ScrollBox.Props                         | -      |
| refreshRate    | 监听内容容器大小改变的频率               | number                                  | `1000` |
| skipOnMount    | 首次渲染时是否触发 `onResize` 回调       | boolean                                 | -      |
| scrollX        | 是否显示水平滚动条                       | boolean                                 | `true` |
| scrollY        | 是否显示垂直滚动条                       | boolean                                 | `true` |
| onResize       | 内容容器大小改变时的回调函数             | (width: number, height: number) => void | -      |

