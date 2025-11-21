---
title: Export
order: 9
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces the knowledge of the export plugin. By reading, you can learn about"}

- How to export the canvas content in image format

:::

## Usage

You can export the canvas content as images via the `Export` plugin. Example:

```ts
import { Graph, Export } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})

graph.use(new Export())
```

## API

### graph.exportSVG(...)

```ts
exportSVG(fileName?: string, options?: Export.ToSVGOptions): void
```

`fileName` is the name of the file, defaulting to `chart`. `Export.ToSVGOptions` is described as follows:

| Property Name      | Type                                       | Default Value | Required | Description                                                                                                                                                                            |
|--------------------|--------------------------------------------|---------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| preserveDimensions | `boolean \| Size`                          | -             |          | Controls the exported SVG size. When unset, width/height are `100%`; when `true`, they are auto-calculated to the actual content size; you can also pass `{ width, height }` to explicitly set the export size. |
| viewBox            | RectangleLike                               | -             |          | Sets the viewBox of the exported SVG.                                                                                                                                                 |
| copyStyles         | boolean                                    | `true`        |          | Whether to copy styles from external stylesheets. When enabled, computed style differences of nodes are inlined into the exported SVG to keep visuals consistent with the page; this adds export time. If you prefer speed or styles are set via `attrs`, set to `false` and pair with `stylesheet` to inject necessary CSS. |
| stylesheet         | string                                     | -             |          | Custom stylesheet.                                                                                                                                                                     |
| serializeImages    | boolean                                    | `true`        |          | Whether to convert the `xlink:href`/`href` of image elements to DataURI (forced for PNG/JPEG).                                                                                       |
| beforeSerialize    | `(this: Graph, svg: SVGSVGElement) => any` | -             |          | You can call `beforeSerialize` to modify the SVG string before exporting it.                                                                                                         |

### graph.exportPNG(...)

```ts
exportPNG(fileName?: string, options?: Export.ToImageOptions): void
```

`fileName` is the name of the file, defaulting to `chart`. `Export.ToImageOptions` inherits from the above `Export.ToSVGOptions` and has the following additional configurations:

| Property Name      | Type                  | Default Value | Required | Description                                                                               |
|--------------------|-----------------------|---------------|----------|-------------------------------------------------------------------------------------------|
| width              | number                | -             |          | Width of the exported image.                                                              |
| height             | number                | -             |          | Height of the exported image.                                                             |
| ratio              | number                | `1`           |          | Scale factor (e.g., device pixel ratio) used to compute export resolution.                |
| backgroundColor    | string                | -             |          | Background color of the exported image, defaults to white.                                |
| padding            | NumberExt.SideOptions | -             |          | Padding for the image.                                                                     |
| quality            | number                | -             |          | Image quality (0–1). If out of range, the default value `0.92` is used.                  |

### graph.exportJPEG(...)

```ts
exportJPEG(fileName?: string, options?: Export.ToImageOptions): void
```

### graph.toSVG(...)

```ts
toSVG(callback: (dataUri: string) => any, options?: Export.ToSVGOptions): void
```

### graph.toPNG(...)

```ts
toPNG(callback: (dataUri: string) => any, options?: Export.ToImageOptions): void
```

### graph.toJPEG(...)

```ts
toJPEG(callback: (dataUri: string) => any, options?: Export.ToImageOptions): void
```
