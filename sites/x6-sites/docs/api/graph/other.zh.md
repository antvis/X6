---
title: Other
order: 16
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 方法

### removeTools()

```sign
removeTools(): this
```

删除工具。

### hideTools()

```sign
hideTools(): this
```

隐藏工具。

### showTools()

```sign
showTools(): this
```

显示工具。


### defineFilter(...)

```sign
defineFilter(options: FilterOptions): string
```

定义[滤镜](../registry/filter)，返回滤镜 ID。

<span class="tag-param">参数<span>

| 名称          | 类型     | 必选 | 默认值 | 描述                            |
|---------------|----------|:----:|--------|-------------------------------|
| options.name  | string   |  ✓   |        | 滤镜名称。                       |
| options.args  | string   |      | -      | 滤镜参数。                       |
| options.id    | string   |      | -      | 滤镜 ID，默认自动生成。           |
| options.attrs | KeyValue |      | -      | 添加到 `<filter>` 元素上的属性。 |


<span class="tag-example">使用<span>

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

### defineGradient(...)

```sign
defineGradient(options: GradientOptions): string
```

定义渐变背景，返回背景 ID。

<span class="tag-param">参数<span>

| 名称          | 类型                                                | 必选 | 默认值 | 描述                        |
|---------------|-----------------------------------------------------|:----:|--------|---------------------------|
| options.type  | string                                              |  ✓   |        | 渐变背景元素名称。           |
| options.stops | {offset: number; color: string; opacity?: number}[] |      | -      | 渐变背景的控制点。           |
| options.id    | string                                              |      | -      | 背景 ID，默认自动生成。       |
| options.attrs | KeyValue                                            |      | -      | 添加到渐变背景元素上的属性。 |

<span class="tag-example">使用<span>

```ts
rect.attr('body/fill', `url#${graph.defineGradient(...)}`)
rect.attr('body/stroke', `url#${graph.defineGradient(...)}`)
```

### defineMarker(...)

```sign
defineMarker(options: MarkerOptions): string
```

定义箭头或路径点的 Maker，返回 ID。

<span class="tag-param">参数<span>

| 名称                | 类型            | 必选 | 默认值             | 描述          |
|---------------------|-----------------|:----:|--------------------|---------------|
| options.id          | string          |      | -                  | 默认自动生成。 |
| options.tagName     | string          |      | `'path'`           | 元素标签名。   |
| options.markerUnits | string          |      | `'userSpaceOnUse'` |               |
| options.children    | MarkerOptions[] |      | -                  | 子元素。       |
| options.attrs       | KeyValue        |      | -                  | 元素的属性。   |