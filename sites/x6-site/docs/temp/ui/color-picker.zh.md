---
title: ColorPicker
order: 18
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/ui
---

颜色选择器。

<iframe src="/demos/api/ui/color-picker/basic"></iframe>


```tsx
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'

<div style={{ width: 120 }}>
  <ColorPicker color="#333333" />
</div>
```

## ColorPicker

| 参数         | 说明                                                    | 类型               | 默认值 |
|--------------|-------------------------------------------------------|--------------------|--------|
| style        | 样式                                                    | CSSProperties      | -      |
| color        | 当前颜色                                                | string \| RGBColor | -      |
| disabled     | 是否禁用                                                | boolean            | -      |
| overlayProps | [弹出层](https://ant.design/components/popover-cn/)选项 |                    | -      |

