---
title: useExport 
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/hooks
---

画布内容通过图片形式导出的 Hook

## 基础用法

```tsx
 const { exportPNG, exportJPEG, exportSVG } = useExport();
```

## API

```tsx
  
const {
  exportPNG: (fileName, options) => void,
  exportJPEG: (fileName, options) => void,
  exportSVG: (fileName, options) => void
} = useExport();

```

## 返回值

| 参数 | 描述 | 类型 | 默认值
|--------|------|------| ------|
| exportPNG | 导出PNG |  (fileName:string, options: [Export.ToImageOptions](/tutorial/plugins/export#graphexportsvg) = {}) => void  |`('chart', {}) => void`|
| exportJPEG | 导出JPEG | (fileName:string, options: [Export.ToImageOptions](/tutorial/plugins/export#graphexportsvg) = {}) => void  |`('chart', {}) => void`|
| exportSVG | 导出SVG | (fileName:string, options: [Export.ToSVGOptions](/tutorial/plugins/export#graphexportsvg) = {}) => void  |`('chart', {}) => void`|

## 参数

无
