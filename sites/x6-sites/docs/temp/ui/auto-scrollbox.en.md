---
title: AutoScrollBox
order: 16
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Automatically adjusts and updates the scrollbar of the container based on the content size.

<iframe src="/demos/api/ui/auto-scrollbox/basic"></iframe>

```tsx
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'
;<div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
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
      <div style={{ position: 'absolute', top: 8, left: 8 }}>
        Top-Left-Corner
      </div>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        Top-Right-Corner
      </div>
      <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
        Bottom-Left-Corner
      </div>
      <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
        Bottom-Right-Corner
      </div>
    </div>
  </AutoScrollBox>
</div>
```
## AutoScrollBox

| Parameter         | Description                                         | Type                  | Default Value |
|-------------------|-----------------------------------------------------|-----------------------|---------------|
| scrollBoxProps    | Options for the internal [ScrollBox](/en/docs/api/ui/scrollbox) component | ScrollBox.Props      | -             |
| refreshRate       | Frequency of listening for changes in the content container size | number                | `1000`        |
| skipOnMount       | Whether to trigger the `onResize` callback on the first render | boolean               | -             |
| scrollX           | Whether to show the horizontal scrollbar            | boolean               | `true`        |
| scrollY           | Whether to show the vertical scrollbar              | boolean               | `true`        |
| onResize          | Callback function when the content container size changes | (width: number, height: number) => void | -             |
