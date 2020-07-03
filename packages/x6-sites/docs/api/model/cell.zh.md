---
title: 基类 Cell
order: 0
redirect_from:
  - /zh/docs/api
  - /zh/docs/api/model
---

Cell 是 [Node](./node) 和 [Edge](./edge) 的基类，包含节点和边的通用属性和方法定义。

## 构造函数

```ts
```

## 原型属性和原型方法

### 通用

#### get model

#### set model

#### get shape

获取节点/边的图形，与 MVC 模式中 Model 的概念一致，决定了节点/边的数据逻辑。返回注册到 X6 的图形的名称。

#### get view

获取节点/边的视图，与 MVC 模式中 View 的概念一致，决定了节点/边的渲染和更新逻辑。返回注册到 X6 的视图的名称。

#### isNode()

检测实例是不是 [Node](./node) 实例，如果是 [Node](./node) 实例则返回 `true`，否则返回 `false`。

#### isEdge()

检测实例是不是 [Edge](./edge) 实例，如果是 [Edge](./edge) 实例则返回 `true`，否则返回 `false`。

#### toJSON()

#### clone()

#### dispose()

销毁并从父节点中移除节点/边。

### 标签 Markup

`markup` 指定了渲染节点/边时使用的 SVG/HTML 片段，使用 [JSON 格式描述]((../../tutorial/basic/cell#markup))。

#### get markup

获取 `markup`。

```ts
const markup = cell.markup
```

#### set markup

设置 `markup`，触发 change 事件和节点重新渲染。

```ts
cell.markup = markup
```

#### getMarkup()

获取 `markup`。

```ts
const markup = cell.getMarkup()
```

#### setMarkup(markup: Markup, options?: SetOptions)

设置 `markup`。

**参数**

| 名称    | 类型                                       | 必选 | 默认值 | 描述                                                              |
|---------|--------------------------------------------|-----|--------|-------------------------------------------------------------------|
| markup  | [Markup](../../tutorial/basic/cell#markup) | 是   |        |                                                                   |
| options | [SetOptions](#setoptions)                  | 否   | { }    | 当 `options.silent` 为 `true` 时不触发 [change 事件](#changexxx)。 |

**用法**

```ts
cell.setMarkup(markup)

// 不触发回调和重新渲染
cell.setMarkup(markup, { silent: true })

// 传入自定义键值对 options，可以在事件回调中使用
cell.setMarkup(markup, { anyKey: 'anyValue' })
```

#### removeMarkup(options?: SetOptions)

移除 `markup`。

**参数**

| 名称    | 类型                      | 必选 | 默认值 | 描述                                                              |
|---------|---------------------------|-----|--------|-----------------------------------------------------------------|
| options | [SetOptions](#setoptions) | 否   | { }    | 当 `options.silent` 为 `true` 时不触发 [change 事件](#changexxx)。 |


**用法**

```ts
cell.removeMarkup()

// 不触发回调和重新渲染
cell.removeMarkup({ silent: true })

// 传入自定义键值对 options，可以在事件回调中使用
cell.removeMarkup({ anyKey: 'anyValue' })
```


### 属性样式 Attrs

#### get attrs
#### set attrs
#### attr()
#### getAttrs()
#### setAttrs()
#### removeAttrs()
#### getAttrByPath()
#### setAttrByPath()
#### removeAttrByPath()

### 层级 ZIndex

`zIndex` 是节点/边在画布中的层级，默认根据节点/边添加顺序自动确定。当 `zIndex` 发生变化是

#### get zIndex

获取 `zIndex`。

```ts
const z = cell.zIndex
```

#### set zIndex

设置 `zIndex`，触发 change 事件和画布重绘。

```ts
cell.zIndex = 2
// 等同于
cell.setZIndex(2)
```

#### getZIndex()

返回 `zIndex`。

```ts
const z = cell.getZIndex()
```

#### setZIndex(zIndex: number, options?: SetOptions)

设置 `zIndex`，默认触发重绘，当 `options.silent` 为 `true` 时不触发重绘。

```ts
cell.setZIndex(2)
cell.setZIndex(2, { silent: false })
cell.setZIndex(2, { silent: true })
```

#### removeZIndex(options)

#### toFront(options)

#### toBack(options)



### 可见性 Visible

#### get visible

#### set visible

#### show()

#### hide()

#### isVisible()

#### setVisible()

#### toggleVisible()

### 业务数据 Data 

#### get data 

#### set data 

#### getData()

#### setData()

#### removeData()

### 分组嵌套 Parent/Children

#### get parent
#### get children
#### getParent()
#### setParent()
#### getParentId()
#### getChildren()
#### setChildren()
#### hasParent()
#### isParentOf()
#### isChildOf()
#### eachChild()
#### filterChild()
#### getChildCount()
#### getChildIndex()
#### getChildAt()
#### getAncestors()
#### getDescendants()
#### isDescendantOf()
#### isAncestorOf()
#### contains()
#### getCommonAncestor()
#### embed()
#### unembed()
#### addTo()
#### insertTo()
#### addChild()
#### insertChild()
#### removeFromParent()
#### removeChild()
#### removeChildAt()
#### remove()

### 动画 Transition 

#### transition()
#### stopTransition()
#### getTransitions()

### 批量更新 Batch

#### startBatch()

#### stopBatch()

#### batchUpdate()

## 事件

### change:xxx

当调用 `setXxx(val, options)` 和 `removeXxx(options)` 方法，并且 `options.silent` 不为 `true` 时，都将触发对应的 chang 事件，最终触发节点/边重绘。例如：

```ts
cell.setZIndex(2)
cell.setZIndex(2, { silent: false })
cell.setZIndex(2, { anyKey: 'anyValue' })
```

将触发 Cell 上的以下事件：

- change:*
- change:zIndex

和 Graph 上的以下事件：

- cell:change:*
- node:change:*（仅当 cell 是节点时才触发）
- edge:change:*（仅当 cell 是边时才触发）
- cell:change:zIndex
- node:change:zIndex（仅当 cell 是节点时才触发）
- edge:change:zIndex（仅当 cell 是边时才触发）

可以通过如下方式监听事件：

```ts
// 当 cell 发生任何改变时都将被触发，可以通过 key 来确定改变项
cell.on('change:*', (args: {
  cell: Cell    
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值
  previous: any // 改变之前的值
  options: any  // 透传的 options
}) => { })

grapg.on('cell:change:*', (args: {
  cell: Cell    
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

// 当 cell 为节点时触发
grapg.on('node:change:*', (args: {
  cell: Cell    
  node: Node
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

// 当 cell 为边时触发
grapg.on('edge:change:*', (args: {
  cell: Cell    
  edge: Edge
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

cell.on('change:zIndex', (args: {
  cell: Cell
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

graph.on('cell:change:zIndex', (args: {
  cell: Cell
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

// 当 cell 为节点时触发
graph.on('node:change:zIndex', (args: {
  cell: Cell
  node: Node
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

// 当 cell 为边时触发
graph.on('edge:change:zIndex', (args: {
  cell: Cell
  edge: Edge        
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })
```

## 静态属性和静态方法

## 类型定义

### KeyValue

```ts
/**
 * 键值对。
 */
export interface KeyValue<T extends any = any> {
  [key: string]: T
}
```

### SetOptions

```ts
export interface SetOptions extends KeyValue {
  /**
   * 当 silent 为 true 时不触发 change 事件。
   */
  silent?: boolean
}
```

### MutateOptions

```ts
export interface MutateOptions extends SetOptions {
  unset?: boolean
}
```

### SetByPathOptions

```ts
export interface SetByPathOptions extends SetOptions {
  rewrite?: boolean
}
```
