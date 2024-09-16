---
title: Filter
order: 15
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

We can use the special attribute [filter](/en/docs/api/registry/attr#filter) to specify [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects) for elements. For example, we can define a predefined object for the `filter` attribute of the element, where `name` and `args` specify the filter name and filter parameters, respectively.

```ts
// Create a node by specifying the filter through the attrs option
const rect = graph.addNode({
  x: 40,
  y: 40,
  width: 80,
  height: 30,
  attrs: {
    body: {
      filter: {
        name: 'dropShadow',
        args: {
          dx: 2,
          dy: 2,
          blur: 3,
        },
      },
    },
  },
})

// After creating the node, we can modify or specify the element's filter using the `attr()` method
rect.attr('body/filter', {
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})
```

Additionally, we can call the `graph.defineFilter(...)` method to obtain a filter ID, and then set the `filter` attribute to this filter ID.

```ts
const filterId = graph.defineFilter({
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})

rect.attr('body/filter', `#${filterId}`)
```

Through this brief introduction, we have learned how to use filters. Next, let's take a look at the predefined filters available in X6.
## Built-in Filters

### dropShadow

Shadow filter. Refer to [CSS drop-shadow()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) filter.

| Parameter Name | Type   | Default Value | Description                     |
|----------------|--------|---------------|---------------------------------|
| dx             | number | `0`           | Shadow offset on the X-axis.   |
| dy             | number | `0`           | Shadow offset on the Y-axis.   |
| blur           | number | `0`           | Shadow blur radius.            |
| opacity        | number | `1`           | Shadow opacity.                |

<code id="filter-drop-shadow" src="@/src/api/filter/drop-shadow/index.tsx"></code>

### blur

Gaussian blur filter. Refer to [CSS blur()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur) filter.

| Parameter Name | Type   | Default Value | Description                                   |
|----------------|--------|---------------|-----------------------------------------------|
| x              | number | `2`           | Blur amount in the X direction.              |
| y              | number | -             | Blur amount in the Y direction; defaults to X. |

<code id="filter-blur" src="@/src/api/filter/blur/index.tsx"></code>

### grayScale

Grayscale filter. Refer to [CSS grayscale()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Grayscale amount. Ranges from `[0-1]`, where `0` means no grayscale and `1` means full grayscale. |

<code id="filter-gray-scale" src="@/src/api/filter/gray-scale/index.tsx"></code>

### sepia

Sepia filter. Refer to [CSS sepia()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia) filter.

| Parameter Name | Type   | Default Value | Description                                         |
|----------------|--------|---------------|-----------------------------------------------------|
| amount         | number | `1`           | Sepia amount. Ranges from `[0-1]`, where `0` means no sepia and `1` means full sepia. |

<code id="filter-sepia" src="@/src/api/filter/sepia/index.tsx"></code>

### saturate

Saturation filter. Refer to [CSS saturate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate) filter.

| Parameter Name | Type   | Default Value | Description                   |
|----------------|--------|---------------|-------------------------------|
| amount         | number | `1`           | Saturation. Ranges from `[0-1]`. |

<code id="filter-saturate" src="@/src/api/filter/saturate/index.tsx"></code>

### hueRotate

Hue rotation filter. Refer to [CSS hue-rotate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate) filter.

| Parameter Name | Type   | Default Value | Description            |
|----------------|--------|---------------|------------------------|
| angle          | number | `0`           | Hue rotation angle.    |

<code id="filter-hue-rotate" src="@/src/api/filter/hue-rotate/index.tsx"></code>

### invert

Invert filter. Refer to [CSS invert()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert) filter.

| Parameter Name | Type   | Default Value | Description                                         |
|----------------|--------|---------------|-----------------------------------------------------|
| amount         | number | `1`           | Inversion amount. Ranges from `[0-1]`, where `0` means no inversion and `1` means full inversion. |

<code id="filter-invert" src="@/src/api/filter/invert/index.tsx"></code>

### brightness

Brightness filter. Refer to [CSS brightness()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Brightness. Ranges from `[0-1]`, where `0` means completely dark and `1` means completely bright. |

<code id="filter-brightness" src="@/src/api/filter/brightness/index.tsx"></code>

### contrast

Contrast filter. Refer to [CSS contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Contrast. Ranges from `[0-1]`, where `0` means completely dark and `1` means completely bright. |

<code id="filter-contrast" src="@/src/api/filter/contrast/index.tsx"></code>

### highlight

Highlight filter.

| Parameter Name | Type   | Default Value | Description            |
|----------------|--------|---------------|------------------------|
| color          | string | `red`         | Highlight color.       |
| width          | number | `1`           | Width of the highlight border. |
| blur           | number | `0`           | Blur radius.          |
| opacity        | number | `1`           | Opacity.              |

<code id="filter-highlight" src="@/src/api/filter/highlight/index.tsx"></code>

### outline

Outline filter.

| Parameter Name | Type   | Default Value | Description      |
|----------------|--------|---------------|------------------|
| color          | string | `blue`        | Outline color.   |
| width          | number | `1`           | Outline width.   |
| margin         | number | `2`           | Margin.          |
| opacity        | number | `1`           | Opacity.         |

<code id="filter-outline" src="@/src/api/filter/outline/index.tsx"></code>

## Custom Filters

A filter definition is a function with the following signature that returns a `<filter>` tag string.

```ts
export type Definition<T> = (args: T) => string
```

For example, the definition of the Gaussian blur filter is:

```ts
export interface BlurArgs {
  x?: number
  y?: number
}

export function blur(args: BlurArgs = {}) {
  const x = getNumber(args.x, 2)
  const stdDeviation = args.y != null && isFinite(args.y) ? [x, args.y] : x

  return `
    <filter>
      <feGaussianBlur stdDeviation="${stdDeviation}"/>
    </filter>
  `.trim()
}
```

We can register a filter by calling the `Graph.registerFilter(...)` method.

```ts
Graph.registerFilter('blur', blur)
```
