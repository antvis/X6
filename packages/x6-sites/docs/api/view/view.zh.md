---
title: View
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/view
---

视图的基类。


## constructor

```sign
constructor(): View
```

创建一个视图的实例，自动生成视图的 [cid](#cid)，同时将视图保存到 [`View.views`](#views) 对象中，可以通过 [`View.getView(cid)`](#getview) 静态方法来获取对应的视图。

## prototype

### cid

视图的唯一 ID。（只读）

### container

视图的容器元素。（读写）

### $(...)

```sign
$(elem: any): jQuery
```

使用内置的 [jQuery](https://api.jquery.com/) 生成一个 jQuery 对象。

| 参数名 | 类型 | 默认值 | 必选 | 描述                                        |
|--------|------|--------|:----:|-------------------------------------------|
| elem   | any  |        |  ✔️  | 创建 jQuery 对象的参数，可以是选择器、元素等。 |

### empty(...)

```sign
empty(elem: Element = this.container): this
```

清空指定的元素。

<span class="tag-param">参数<span>

| 参数名 | 类型    | 默认值           | 必选 | 描述                             |
|--------|---------|------------------|:----:|--------------------------------|
| elem   | Element | `this.container` |      | 被清空的元素，默认清空视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 清空视图的容器
view.empty()

// 清空指定的元素 elem
view.empty(elem)
```

### unmount(...)

```sign
unmount(elem: Element = this.container): this
```

从页面中移除元素。

<span class="tag-param">参数<span>

| 参数名 | 类型    | 默认值           | 必选 | 描述                             |
|--------|---------|------------------|:----:|--------------------------------|
| elem   | Element | `this.container` |      | 被移除的元素，默认移除视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 移除视图的容器
view.unmount()

// 移除指定的元素 elem
view.unmount(elem)
```

### remove(...)

```sign
remove(elem: Element = this.container): this
```

从页面中移除元素。

当被移除的元素是视图的容器时，则同时清空视图的事件绑定；否则与调用 [unmount](#unmount) 方法一样，仅仅从页面移除元素。

<span class="tag-param">参数<span>

| 参数名 | 类型    | 默认值           | 必选 | 描述                             |
|--------|---------|------------------|:----:|--------------------------------|
| elem   | Element | `this.container` |      | 被移除的元素，默认移除视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 移除视图的容器，同时清空视图的事件绑定
view.remove()

// 移除指定的元素 elem
view.remove(elem)
```

### addClass(...)

```sign
addClass(className: string | string[], elem: Element = this.container): this
```

为元素添加指定的样式类名。

<span class="tag-param">参数<span>

| 参数名    | 类型               | 默认值           | 必选 | 描述                               |
|-----------|--------------------|------------------|:----:|----------------------------------|
| className | string \| string[] |                  |  ✔️  | 样式类名。                          |
| elem      | Element            | `this.container` |      | 添加样式的元素，默认使用视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 给视图的容器元素添加样式类名
view.addClass('my-class')

// 通过数组同时添加多个样式类名
view.addClass(['my-class1', 'my-class2'])

// 给指定的元素添加样式类名
view.addClass('my-class', elem)
```

### removeClass(...)

```sign
removeClass(className: string | string[], elem: Element = this.container): this
```

移除元素上的样式类名。

<span class="tag-param">参数<span>

| 参数名    | 类型               | 默认值           | 必选 | 描述                               |
|-----------|--------------------|------------------|:----:|----------------------------------|
| className | string \| string[] |                  |  ✔️  | 样式类名。                          |
| elem      | Element            | `this.container` |      | 移除样式的元素，默认使用视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 移除视图容器的样式类名
view.removeClass('my-class')

// 通过数组同时移除多个样式类名
view.removeClass(['my-class1', 'my-class2'])

// 移除指定的元素的样式类名
view.removeClass('my-class', elem)
```

### setStyle(...)

```sign
setStyle(
  style: JQuery.PlainObject<string | number>,
  elem: Element = this.container,
): this
```

设置元素的行内样式。

<span class="tag-param">参数<span>

| 参数名 | 类型                                   | 默认值           | 必选 | 描述                               |
|--------|----------------------------------------|------------------|:----:|----------------------------------|
| style  | JQuery.PlainObject\<string \| number\> |                  |  ✔️  | 行内样式键值对。                    |
| elem   | Element                                | `this.container` |      | 添加样式的元素，默认使用视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 设置视图容器的行内样式
view.setStyle({
  width: '100px',
  height: '40px',
  border: '1px solid red',  
})

// 设置指定元素 elem 的样式
view.setStyle({
  width: '100px',
  height: '40px',
  border: '1px solid red',  
}, elem)
```

### setAttrs(...)

```sign
setAttrs(
  attrs: Attr.SimpleAttrs, 
  elem: Element = this.container,
): this
```

设置元素的属性。

<span class="tag-param">参数<span>

| 参数名 | 类型             | 默认值           | 必选 | 描述                                 |
|--------|------------------|------------------|:----:|------------------------------------|
| attrs  | Attr.SimpleAttrs |                  |  ✔️  | 属性键值对。                          |
| elem   | Element          | `this.container` |      | 被设置属性的元素，默认使用视图的容器。 |

<span class="tag-example">用法</span>

```ts
// 设置视图容器的属性
view.setAttrs({
  fill: 'node',
  stroke: 'red',
})

// 设置指定元素 rect 的属性
view.setStyle({
  stroke: 'red',
  strokeWidth: 1,
}, rect)
```

### find(...)

```sign
find(
  selector?: string,
  rootElem: Element = this.container,
  selectors: Markup.Selectors = this.selectors,
): Element[]
```

根据提供的选择器，获取指定根元素的后代元素集合。

<span class="tag-param">参数<span>

| 参数名    | 类型             | 默认值           | 必选 | 描述              |
|-----------|------------------|------------------|:----:|-----------------|
| selector  | string           |                  |      | 选择器。           |
| rootElem  | Element          | `this.container` |      | 根元素。           |
| selectors | Markup.Selectors | `this.selectors` |      | 视图缓存的选择器。 |

其中 `selectors` 是我们通过 Markup 渲染视图时，缓存下来的选择器，例如下面的 Markup

```ts
[
  { tagName: 'rect', selector: 'body' },
  { tagName: 'text', selector: 'label' },
]
```

渲染后的 `selectors` 是

```ts
{
  body: SVGRectElement,
  label: SVGTextElement,
}
```

所以我们可以通过 Markup 中定义的 `selector` 来找到元素：

```ts
const rects = view.find('body')
```

同时还支持使用 CSS 选择器来查找后代元素：

```ts
const rects = view.find('rect')
```

<span class="tag-return">返回值<span>

当提供的 `selector` 为空或者为 `'.'` 时，返回 `[rootElem]`，否则返回与选择器匹配的后代元素集合。

### findOne(...)

```sign
findOne(
  selector?: string,
  rootElem: Element = this.container,
  selectors: Markup.Selectors = this.selectors,
): Element
```

根据提供的选择器，获取指定根元素的第一个匹配的后代元素。使用方式请参考 [find](#find) 方法。



### findAttr(...)

```sign
findAttr(attrName: string, elem: Element): string | null
```

从指定的元素 `elem` 开始查找指定属性名 `attrName` 的属性值，如果当前元素上不存在该属性，则继续查找其父元素，直到找到对应的属性值或查找到视图的容器元素为止。

<span class="tag-param">参数<span>

| 参数名   | 类型    | 默认值           | 必选 | 描述                                   |
|----------|---------|------------------|:----:|--------------------------------------|
| attrName | string  |                  |  ✔️  | 属性名。                                |
| elem     | Element | `this.container` |      | 开始查找的元素，默认使用视图的容器元素。 |

<span class="tag-return">返回值<span>

返回找到的属性值或者 `null`。

<span class="tag-example">用法</span>

```ts
const type = view.findAttr('data-type')
if (type != null) {
  // do something
}
```

### findByAttr(...)

```sign
findByAttr(
  attrName: string, 
  elem: Element = this.container,
): Element | null
```

根据指定的属性名 `attrName`，从 `elem` 元素开始 ，查找属性值存在且不为 `'false'` 的元素，直到找到匹配的元素或者到达视图的容器元素为止。

<span class="tag-param">参数<span>

| 参数名   | 类型    | 默认值           | 必选 | 描述                                   |
|----------|---------|------------------|:----:|--------------------------------------|
| attrName | string  |                  |  ✔️  | 属性名。                                |
| elem     | Element | `this.container` |      | 开始查找的元素，默认使用视图的容器元素。 |

<span class="tag-return">返回值<span>

- 如果找到属性值存在且不为 `'false'` 的元素，则返回该元素
- 如果查到到达容器元素，则返回容器元素
- 其他情况返回 `null`

<span class="tag-example">用法</span>

```ts
// 从 rect 开始，查找 magnet 属性不为 'false' 的元素
const magnet = view.findAttr('magnet', rect)
if (magnet != null) {
  // do something
}
```

### getSelector(...)

```sign
getSelector(elem: Element, prevSelector?: string): string | undefined
```

在视图容器的上下文中，获取指定元素的 CSS 选择器。

<span class="tag-param">参数<span>

| 参数名       | 类型    | 默认值 | 必选 | 描述                  |
|--------------|---------|--------|:----:|---------------------|
| elem         | Element |        |  ✔️  | 需要获取选择器的元素。 |
| prevSelector | string  |        |      | 上一级选择器。         |

<span class="tag-example">用法</span>

```ts
view.getSelector(rect)
// '> rect:nth-child(1)'
```

### prefixClassName(...)

```sign
prefixClassName(className: string): string
```

为指定的样式类名加上 `'x6'` 前缀。

<span class="tag-param">参数<span>

| 参数名    | 类型   | 默认值 | 必选 | 描述      |
|-----------|--------|--------|:----:|---------|
| className | string |        |  ✔️  | 样式类名。 |

<span class="tag-example">用法</span>

```ts
view.prefixClassName('selected')
// 'x6-selected'
```

### delegateEvents(...)

```sign
delegateEvents(events: View.Events, append?: boolean): this
```

在视图容器上绑定事件。

<span class="tag-param">参数<span>

| 参数名 | 类型                                   | 默认值  | 必选 | 描述                                                        |
|--------|----------------------------------------|---------|:----:|-----------------------------------------------------------|
| events | { [event:string]: string \| Function } |         |  ✔️  | 事件名和事件回调键值对。                                     |
| append | boolean                                | `false` |      | 是否是追加绑定，默认为 `false` 表示先解绑容器上的事件再绑定。 |

其中 `events` 键值对的键分为两种情况：

- 事件名，表示直接在容器元素上绑定事件。
- 事件名 + 子元素选择器，表示在选择器标识的子元素上绑定事件。
  
```ts
view.delegateEvents({
  // 在容器上绑定点击事件
  click: () => { }
  // 在拥有 .content 类名的子元素上绑定点击事件
  'click .content': () => { }
})
  ```

并且 `events` 键值对的值也分为两种情况：

- 值为函数，表示该函数作为事件的回调函数。
- 值为字符串，表示视图中对应的成员方法为事件的回调函数。
  
```ts
view.delegateEvents({
  // 值为函数，表示该函数为事件的回调函数
  click: () => { }
  // 值为字符串，表示 view.onClick.bind(this) 为事件的回调函数
  click: 'onClick'
})
```

### undelegateEvents()

```sign
undelegateEvents(): this
```

解绑容器上的事件。


### delegateDocumentEvents(...)

```sign
delegateDocumentEvents(events: View.Events, data?: KeyValue): this
```

在 `Document` 上绑定事件

<span class="tag-param">参数<span>

| 参数名 | 类型                                   | 默认值  | 必选 | 描述                                       |
|--------|----------------------------------------|---------|:----:|------------------------------------------|
| events | { [event:string]: string \| Function } |         |  ✔️  | 事件名和事件回调键值对。                    |
| data   | KeyValue                               | `false` |      | 传递给事件的附加数据，可以在回调函数中使用。 |


参数 `events` 的使用方式请参考 [delegateEvents](#delegateevents) 方法

### undelegateDocumentEvents()

```sign
undelegateDocumentEvents(): this
```

解绑 `Document` 上的事件。

### getEventData(...)

```sign
getEventData<T extends KeyValue>(e: JQuery.TriggeredEvent): T
```

获取 JQuery 事件对象中的附加数据。

### setEventData(...)

```sign
setEventData<T extends KeyValue>(e: JQuery.TriggeredEvent, data: T): T
```

设置 JQuery 事件对象中的附加数据。

## views

视图 [cid](#cid) 和视图键值对，保存了所有视图。

## getView(...)

```sign
getView(cid: string): View | null
```

根据视图 [cid](#cid) 获取视图实例。

<span class="tag-param">参数<span>

| 参数名 | 类型     | 默认值 | 必选 | 描述                |
|--------|----------|--------|:----:|-------------------|
| cid    | { string |        |  ✔️  | 视图的 [cid](#cid)。 |

<span class="tag-return">返回值<span>

返回 [cid](#cid) 对应的视图或 `null`。

<span class="tag-example">用法</span>

```ts
const view = View.getView('v6')
if (view != null) {
  // do something
}
```
