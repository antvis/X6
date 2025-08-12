---
title: ColorPicker
order: 18
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Color Picker.

<iframe src="/demos/api/ui/color-picker/basic"></iframe>

```tsx
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'
;<div style={{ width: 120 }}>
  <ColorPicker color="#333333" />
</div>
```

## ColorPicker

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| style | Style | CSSProperties | - |
| color | Current color | string \| RGBColor | - |
| disabled | Is disabled | boolean | - |
| overlayProps | [Popover](https://ant.design/components/popover/) options |  | - |
