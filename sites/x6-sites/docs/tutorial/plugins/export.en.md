---
title: Export
order: 9
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="By reading this section, you can learn about"}

- How to export the canvas content in image format

:::

## Usage

We often need to export the content of a canvas as an image. We provide a standalone plugin package `@antv/x6-plugin-export` to use this feature.

```shell
# npm
$ npm install @antv/x6-plugin-export --save

# yarn
$ yarn add @antv/x6-plugin-export
```

Then we use it in the code like this:

```ts
import { Export } from '@antv/x6-plugin-export'

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
| preserveDimensions | `boolean \| Size`                          | -             |          | `preserveDimensions` controls the size of the exported SVG. If not set, width and height default to 100%; if set to true, width and height will be automatically calculated to the actual size of the graphic area. |
| viewBox            | Rectangle.RectangleLike                    | -             |          | Sets the viewBox of the exported SVG.                                                                                                                                                 |
| copyStyles         | boolean                                    | `true`        |          | Whether to copy styles from external stylesheets, default is true. When `copyStyles` is enabled, all stylesheets will be disabled during the export process, which may cause a brief loss of styles on the page. If the effect is particularly poor, you can set `copyStyles` to false. |
| stylesheet         | string                                     | -             |          | Custom stylesheet.                                                                                                                                                                     |
| serializeImages    | boolean                                    | `true`        |          | Whether to convert the `xlink:href` links of image elements to dataUri format.                                                                                                       |
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
| backgroundColor    | string                | -             |          | Background color of the exported image.                                                   |
| padding            | NumberExt.SideOptions | -             |          | Padding for the image.                                                                     |
| quality            | number                | -             |          | Image quality, which can be selected from a range of 0 to 1. If out of range, the default value of 0.92 will be used. |

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
