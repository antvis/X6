---
title: useExport 
order: 5
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/hooks
---

A Hook for exporting canvas content as an image.

## Basic Usage

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

## Return Values

| Parameter  | Description | Type | Default Value |
|------------|-------------|------|---------------|
| exportPNG  | Export as PNG |  (fileName:string, options: [Export.ToImageOptions]((/tutorial/plugins/export#graphexportsvg)) = {}) => void  | `('chart', {}) => void` |
| exportJPEG | Export as JPEG | (fileName:string, options: [Export.ToImageOptions]((/tutorial/plugins/export#graphexportsvg)) = {}) => void  | `('chart', {}) => void` |
| exportSVG   | Export as SVG | (fileName:string, options: [Export.ToSVGOptions]((/tutorial/plugins/export#graphexportsvg)) = {}) => void  | `('chart', {}) => void` |

## Parameters

None
