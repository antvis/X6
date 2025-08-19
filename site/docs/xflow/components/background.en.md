---
title: Background
order: 1
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Canvas Background

## Basic Usage

:::info{title="Note"}

The `<Background />` component can only be used within the `<XFlow />` component to function properly.

:::

After importing the `<Background />` component, you can set the canvas background of `<XFlowGraph />`.

```tsx
<XFlow>
  ...
  <Background color="#F2F7FA" />
</XFlow>
```

## Background Color

Specify the background color of the canvas using the `color` property.

<code id="xflow-components-background-color" src="@/src/xflow/components/background/color/index.tsx"></code>

## Background Image

Add the `image` property to specify a background image for the canvas.

<code id="xflow-components-background-image" src="@/src/xflow/components/background/image/index.tsx"></code>

## Background Watermark

Set the `repeat` property to `watermark` to apply the background image as a watermark effect. You can use the `angle` property to control the rotation angle of the watermark.

<code id="xflow-components-background-watermark" src="@/src/xflow/components/background/watermark/index.tsx"></code>

## API

### Background

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| image          | Background image URL | string | - |
| color          | Background color, supports all [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) properties | string | - |
| size           | Background image size, supports all [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) properties | string | - |
| position       | Background image position, supports all [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) properties | string | `center` |
| repeat         | Background image repeat method, supports all [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) properties as well as built-in properties `watermark`, `flip-x`, `flip-y`, `flip-xy` | string | `no-repeat` |
| angle          | Watermark rotation angle, effective only when the `repeat` property is set to `watermark` | number | 20 |
| opacity        | Background image opacity | number | 1 |
| quality        | Background image quality | number | 1 |
