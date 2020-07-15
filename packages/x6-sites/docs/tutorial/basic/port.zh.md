---
title: 连接桩 Port
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

链接桩是节点上的固定连接点，很多图应用都有链接桩，并且有些应用还将链接桩分为**输入链接桩**和**输出连接桩**。


## 快速开始

创建节点时我们可以通过 `ports` 选项来配置链接桩，像下面这样：

```ts
const node = new Node({
  ports: {
    groups: { ... }, // 链接桩组定义
    items: [ ... ],  // 链接桩
  }
})

// 或者
const node = new Node({
  ports: [ ... ],  // 链接桩
})
```

### 创建链接桩

完整的配置项稍微有点复杂，后面将详细介绍。我们先基于系统的默认选项，来快速添加几个链接桩：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: [
    { id: 'port1' }, 
    { id: 'port2' }, 
    { id: 'port3' },
  ],
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-np6g8?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

左侧的三个圆就是我们添加的链接桩，这里使用了节点的 [`portMarkup`](../../api/model/node#portmarkup) 选项指定的默认的链接桩（如下）。

链接桩 Markup 可以在单个链接桩、链接桩群组和节点的 [`portMarkup`](../../api/model/node#portmarkup) 选项三个位置指定，优先级从高到低。

```ts
{
  tagName: 'circle',
  selector: 'circle',
  attrs: {
    r: 10,
    fill: '#fff',
    stroke: '#000',
  },
}
```

知道了链接桩的 DOM 结构，我们就可以来定制链接桩的样式：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: [
    {
      id: 'port1',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
        },
      },
    },
    {
      id: 'port2',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
        },
      },
    },
    {
      id: 'port3',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
        },
      },
    },
  ],
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-style-i4knb?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults-style"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

[[warning]]
| 值得注意的是，我们给 `circle` 指定了 [`magnet: true`](../../api/registry/attr#magnet) 这个特殊属性，使链接桩在连线交互时可以被连接上。

上面代码中每个链接桩的样式都一样，显得有点冗长，我们可以通过 `group` 选项来设置链接桩分组，使该组中的链接桩具有相同的行为和样式。

看下面如何使用链接桩分组来定义链接桩样式：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: {
    groups: {
      group1: { 
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1', // 指定分组名称
      },
      {
        id: 'port2',
        group: 'group1', // 指定分组名称
      },
      {
        id: 'port3',
        group: 'group1', // 指定分组名称
      },
    ],
  },
})
```

### 链接桩标签

另外，还可以为链接桩指定标签文本：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: {
    groups: {
      group1: { 
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1',
        attrs: {
          text: {          // 标签选择器
            text: 'port1', // 标签文本
          },
        },
      },
      {
        id: 'port2',
        group: 'group1', 
        attrs: {
          text: {          // 标签选择器
            text: 'port2', // 标签文本
          },
        },
      },
      {
        id: 'port3',
        group: 'group1',
        attrs: {
          text: {          // 标签选择器
            text: 'port2', // 标签文本
          },
        },
      },
    ],
  },
})
```

这里使用了节点的 [`portLabelMarkup`](../../api/model/node#portlabelmarkup) 选项指定的默认标签（如下）。

链接桩标签的 Markup 可以在单个链接桩、链接桩群组和节点的 [`portLabelMarkup`](../../api/model/node#portlabelmarkup) 选项三个位置指定，优先级从高到低。

```ts
{
  tagName: 'text',
  selector: 'text',
  attrs: {
    fill: '#000000',
  },
}
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-label-fyweh?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults-label"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 连接到链接桩

有了链接桩之后，我们就可以为边指定连接的链接桩：

```ts
graph.addEdge({
  source: { x: 40, y: 100 },
  target: { 
    cell: rect, 
    port: 'port1', // 链接桩 ID
  },
})

graph.addEdge({
  source: { x: 40, y: 100 },
  target: { 
    cell: rect, 
    port: 'port2', // 链接桩 ID
  },
})

graph.addEdge({
  source: { x: 40, y: 100 },
  target: { 
    cell: rect, 
    port: 'port3', // 链接桩 ID
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-edge-d5gcl?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults-edge"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


上面我们快速了解了如何创建和使用链接桩，接下来我们将详细介绍一下 `ports` 选项中的 `items` 和 `groups` 两个配置项。 

## 选项介绍

首先，`items` 是一个数组 `PortmMetadata[]`，数组的每一项表示一个链接桩，链接桩支持的选项如下：

```ts
interface PortmMetadata {
  /**
   *  链接桩唯一 ID，默认自动生成。
   */ 
  id?: string   
  
  /**
   * 分组名称，指定分组后将继承分组中的链接桩选项。
   */
  group?: string
  
  /**
   * 为群组中指定的链接桩布局算法提供参数。
   * 我们不能为单个链接桩指定布局算法，但可以为群组中指定的布局算法提供不同的参数。
   */
  args?: object

  /**
   * 链接桩的 DOM 结构定义。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  markup?: Markup
  
  /**
   * 元素的属性样式。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  attrs?: Attr.CellAttrs
  
  /**
   * 链接桩的 DOM 层级，值越大层级越高。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  zIndex?: number | 'auto'

  /**
   * 链接桩的标签。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  label?: {
    markup?: Markup // 标签 DOM 结构
    position?: {    // 标签位置
      name: string  // 标签位置计算方法的名称
      args?: object // 标签位置计算方法的参数
    }
  }
}
```

然后，通常我们将具有相同行为和外观的链接桩归为同一组，并通过 `groups` 选项来设置分组，该选项是一个对象 `{ [groupName: string]: PortGroupMetadata }`，组名为键，值为每组链接桩的默认选项，支持的选项如下：

```ts
interface PortGroupMetadata {
  /**
   * 链接桩 DOM 结构定义。
   */
  markup?: Markup
  
  /**
   * 属性和样式。
   */
  attrs?: Attr.CellAttrs
  
  /**
   * 链接桩的 DOM 层级，值越大层级越高。
   */
  zIndex?: number | 'auto'

  /**
   * 群组中链接桩的布局。
   */
  position?: 
    | [number, number] // 绝对定位
    | string           // 链接桩布局方法的名称
    | {                // 链接桩布局方法的名称和参数
        name: string
        args?: object
      }
  
  /**
   * 链接桩标签。
   */
  label?: {
    markup?: Markup
    position?: {    // 链接桩标签布局
      name: string  // 布局名称
      args?: object // 布局参数
    }
  }
}
```

例如：

```ts
const node = new Node({
  ports: {
    group: { 
      group1: { 
        markup: {
          tagName: 'circle',
          selector: 'circle',
          attrs: {
            r: 10,
            fill: '#fff',
            stroke: '#000',
          },
        },
        attrs: { 
          circle: {
            r: 6,
          },
        },
        zIndex: 1,
        position: {
          name: 'top',
          args: {},
        },
        label: { 
          markup: {
            tagName: 'text',
            selector: 'text',
            attrs: {
              fill: '#000',
            },
          },
        },
      },
      group2: { ... },
      group3: { ... },
    },
    items: [
      { id: 'port1', group: 'group1', ... },
      { id: 'port2', group: 'group1', ... },
      { id: 'port3', group: 'group2', ... },
    ],
  }
})
```

## 连接桩和标签位置

上面我们使用默认位置创建了几个连接桩，并为链接桩设置了标签，下面我们来看看如何为链接桩和标签指定位置。

### 链接桩位置

链接桩布局算法只能通过 `groups` 中的 `position` 选项来指定，因为布局算法在计算链接桩位置是需要考虑到群组中的所有连接桩，我们在单个链接桩中可以通过 `args` 选项来影响该链接桩的布局结果。

我们默认提供了下面几种链接桩布局算法，同时支持[自定义链接桩布局算法并注册使用](../../api/registry/port-layout#registry)，点击下面的链接可以了解每种布局算法的使用方法。

- [`'absolute'`](../../api/registry/port-layout#absolute) 绝对定位。
- [`'left'`](../../api/registry/port-layout#left-right-top-bottom) 矩形节点左侧均匀分布。
- [`'right'`](../../api/registry/port-layout#left-right-top-bottom) 矩形节点右侧均匀分布。
- [`'top'`](../../api/registry/port-layout#left-right-top-bottom) 矩形节点顶部均匀分布。
- [`'bottom'`](../../api/registry/port-layout#left-right-top-bottom) 矩形节点底部均匀分布。
- [`'line'`](../../api/registry/port-layout#line) 沿指定的线均匀分布。
- [`'ellipse'`](../../api/registry/port-layout#ellipse) 沿椭圆圆弧分布。
- [`'ellipseSpread'`](../../api/registry/port-layout#ellipsespread) 沿椭圆均匀分布。

下面我们就来定制一个具有输入和输出链接桩的节点。

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 180,
  height: 60,
  label: 'In Ports & Out Ports',
  ports: {
    groups: {
      // 输入链接桩群组定义
      in: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      // 输出链接桩群组定义
      out: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'in',
      },
      {
        id: 'port2',
        group: 'in',
      },
      {
        id: 'port3',
        group: 'in',
      },
      {
        id: 'port4',
        group: 'out',
      },
      {
        id: 'port5',
        group: 'out',
      },
    ],
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-position-7fc0k?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-position"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 标签位置

在 `groups` 的 `label.position` 选项和节点的 `label.position` 选项中都可以指定标签的位置。

我们默认提供了下面几种标签位置，也支持[自定义标签位置并注册使用](/api/registry/port-label-layout#registry)，点击下面的链接了解每种标签位置的使用方法。

- [`left`](../../api/registry/port-label-layout#side) 标签位于链接桩左侧。
- [`right`](../../api/registry/port-label-layout#side) 标签位于链接桩右侧。
- [`top`](../../api/registry/port-label-layout#side) 标签位于链接桩上方。
- [`bottom`](../../api/registry/port-label-layout#side) 标签位于链接桩下方。
- [`inside`](../../api/registry/port-label-layout#insideoutside) 标签位于节点内围（靠近边线的内侧）。
- [`outside`](../../api/registry/port-label-layout#insideoutside) 标签位于节点外围（靠近边线的外侧）。
- [`insideOriented`](../../api/registry/port-label-layout#insideoutside) 标签位于节点内围，而且根据所在方位自动调整文本的方向。
- [`outsideOriented`](../../api/registry/port-label-layout#insideoutside) 标签位于节点外围，而且根据所在方位自动调整文本的方向。
- [`radial`](../../api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围。
- [`radialOriented`](../../api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围，并使标签文本自动沿圆弧方向旋转。

下面我们为刚刚创建的输入、输出连接桩指定一下标签和标签位置。

```ts
graph.addNode({
  x: 60,
  y: 50,
  width: 180,
  height: 80,
  label: 'In Ports & Out Ports',
  ports: {
    groups: {
      in: {
        position: 'top',    // 标签位置
        label: {
          position: 'top',  // 链接桩位置
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',   // 标签位置
        label: {
          position: 'bottom', // 链接桩位置
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'in',
        attrs: {
          text: { text: 'in1' },
        },
      },
      {
        id: 'port2',
        group: 'in',
        attrs: {
          text: { text: 'in2' },
        },
      },
      {
        id: 'port3',
        group: 'in',
        attrs: {
          text: { text: 'in3' },
        },
      },
      {
        id: 'port4',
        group: 'out',
        attrs: {
          text: { text: 'out1' },
        },
      },
      {
        id: 'port5',
        group: 'out',
        attrs: {
          text: { text: 'out2' },
        },
      },
    ],
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-label-position-33s6r?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-label-position"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 最佳实践

链接桩选项多、配置代码长，推荐的做法是，基于群组将链接桩的通用选项定义为节点的默认选项。例如我们可以定义一个矩形节点，然后为该矩形节点设置预定义的输入和输出链接桩。

```ts
Shape.Rect.define({
  shape: 'my-rect',
  width: 180,
  height: 80,
  ports: {
    groups: {
      in: {
        position: 'top',
        label: {
          position: 'top',
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',
        label: {
          position: 'bottom',
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
  },
})
```

上面我们定义并注册了名为 `my-rect` 的矩形，并为该矩形指定了输入和输出桩，我们可以这样来使用：

```ts
graph.addNode({
  x: 60,
  y: 50,
  shape: 'my-rect',
  label: 'In Ports & Out Ports',
  ports: [
    {
      id: 'port1',
      group: 'in',
    },
    {
      id: 'port2',
      group: 'in',
    },
    {
      id: 'port3',
      group: 'in',
    },
    {
      id: 'port4',
      group: 'out',
    },
    {
      id: 'port5',
      group: 'out',
    },
  ],
})
```

<iframe src="/demos/tutorial/basic/port/best-practice"></iframe>
