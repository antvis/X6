---
title: Background 背景
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布的背景

## 基础用法

:::info{title="注意"}

 `<Background />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

引入  `<Background />` 组件后,  即可设置 `<XFlowGraph />` 的画布背景。

```tsx
<XFlow>
  ...
  <Background color="#F2F7FA" />
</XFlow>
```

## 背景颜色

通过 `color` 属性指定画布的背景颜色

<code id="xflow-components-background-color" src="@/src/xflow/components/background/color/index.tsx"></code>

## 背景图片

添加 `image` 属性, 指定一张背景图设置为画布的背景图片

<code id="xflow-components-background-image" src="@/src/xflow/components/background/image/index.tsx"></code>

## 背景水印

将 `repeat` 属性 设置为 `watermark`, 则将背景图片设置为水印效果，可以使用 `angle` 属性控制水印旋转角度

<code id="xflow-components-background-watermark" src="@/src/xflow/components/background/watermark/index.tsx"></code>

## API

### Background

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| image | 背景图片URL  | string | -  |
| color | 背景颜色 支持所有 [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) 属性 | string |  -   |
| size | 背景图片大小 支持所有 [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性| string | - |
| position| 背景图片位置 支持所有 [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性 | string  | `center` |
| repeat | 背景图片重复方式 支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性 以及内置属性 `watermark` `flip-x` `flip-y` `flip-xy` | string| `no-repeat` |
| angle | 水印旋转角度 仅当 `repeat` 属性为 `watermark` 时有效   | number | 20 |
| opacity | 背景图片透明度 | number | 1 |
| quality | 背景图片质量 | number | 1 |

