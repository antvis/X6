---
title: Node
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/model
---

Node 是所有节点的基类，继承自 [Cell](/zh/docs/api/model/cell)，并定义了节点的通用属性和方法。

## constructor

```sign
constructor(metadata?: Node.Metadata)
```

其中 `Node.Metadata` 是创建节点的选项，除了从 Cell [继承](/zh/docs/api/model/cell#constructor)的 [`markup`](/zh/docs/api/model/cell#markup)、[`attrs`](/zh/docs/api/model/cell#attrs-1)、[`zIndex`](/zh/docs/api/model/cell#zindex) 等选项外，还支持以下选项。

| 选项            | 类型                              | 默认值                    | 必选 | 描述                    |
| --------------- | --------------------------------- | ------------------------- | :--: | ----------------------- |
| size            | { width: number; height: number } | `{ width: 1, height: 1 }` |      | 节点大小。              |
| position        | { x: number; y: number }          | -                         |      | 节点位置。              |
| angle           | number                            | -                         |      | 节点的旋转角度。        |
| ports           | object                            | -                         |      | 连接桩。                |
| portMarkup      | Markup                            | object                    |      | 连接桩的 DOM 结构。     |
| portLabelMarkup | Markup                            | object                    |      | 连接桩标签的 DOM 结构。 |

### size

节点大小，是一个包含 `width` 和 `height` 属性的对象，可以通过 [`size(...)`](#size-1) 方法来获取和设置节点大小。

### position

节点位置，是一个包含 `x` 和 `y` 属性的对象，可以通过 [`position(...)`](#position-1) 方法来获取和设置节点位置。

### angle

节点的旋转角度，旋转中心为节点的中心，可以通过 [`rotate(...)`](#rotate) 方法来获取和设置节点的旋转角度。

### ports

连接桩是节点上的固定连接点，很多图应用都有连接桩，并且有些应用还将连接桩分为输入连接桩和输出连接桩。

连接桩选项 `ports` 是一个复杂对象，可以像下面这样使用。

```ts
const node = new Node({
  ports: {
    group: { ... }, // 连接桩组定义
    items: [ ... ], // 连接桩
  }
})
```

或者

```ts
const node = new Node({
  ports: [ ... ], // 连接桩
})
```

通常我们将具有相同行为和外观的连接桩归为同一组，并通过 `group` 选项来设置分组，该选项是一个对象 `{ [groupName: string]: PortGroupMetadata }`，组名为键，值为每组连接桩的默认选项，支持的选项如下：

```ts
interface PortGroupMetadata {
  /**
   * 连接桩 DOM 结构定义。
   */
  markup?: Markup;

  /**
   * 属性和样式。
   */
  attrs?: Attr.CellAttrs;

  /**
   * 连接桩的 DOM 层级，值越大层级越高。
   */
  zIndex?: number | "auto";

  /**
   * 群组中连接桩的布局。
   */
  position?:
    | [number, number] // 绝对定位
    | string // 连接桩布局方法的名称
    | {
        // 连接桩布局方法的名称和参数
        name: string;
        args?: object;
      };

  /**
   * 连接桩标签。
   */
  label?: {
    markup?: Markup;
    position?: {
      // 连接桩标签布局
      name: string; // 布局名称
      args?: object; // 布局参数
    };
  };
}
```

例如：

```ts
const node = new Node({
  ports: {
    group: {
      group1: {
        markup: { tagName: 'circle' },
        attrs: { },
        zIndex: 1,
        position: {
          name: 'top',
          args: {},
        },
      },
      group2: { ... },
      group3: { ... },
    },
    items: [ ... ],
  }
})
```

另一个选项 `items` 是一个数组 `PortMetadata[]`，数组的每一项表示一个连接桩，连接桩支持的选项如下：

```ts
interface PortMetadata {
  /**
   *  连接桩唯一 ID，默认自动生成。
   */
  id?: string;

  /**
   * 分组名称，指定分组后将继承分组中的连接桩选项。
   */
  group?: string;

  /**
   * 为群组中指定的连接桩布局算法提供参数。
   * 我们不能为单个连接桩指定布局算法，但可以为群组中指定的布局算法提供不同的参数。
   */
  args?: object;

  /**
   * 连接桩的 DOM 元素和结构定义。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  markup?: Markup;

  /**
   * 元素的属性样式。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  attrs?: Attr.CellAttrs;

  /**
   * 连接桩的 DOM 层级，值越大层级越高。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  zIndex?: number | "auto";

  /**
   * 连接桩标签。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  label?: {
    markup?: Markup;
    position?: {
      // 连接桩标签布局
      name: string; // 布局名称
      args?: object; // 布局参数
    };
  };
}
```

例如：

```ts
const node = new Node({
  ports: {
    group: { ... },
    items: [
      { id: 'port1', group: 'group1', ... },
      { id: 'port2', group: 'group1', ... },
      { id: 'port3', group: 'group2', ... },
    ],
  }
})
```

更多详情请参考[配置连接桩](#连接桩-ports)文档。

### portMarkup

连接桩的 DOM 结构。当 `ports.groups` 和 `ports.items` 都没有为对应的连接桩指定 `markup` 时，则使用这个默认选项来渲染连接桩，其默认值为：

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

表示用半径为 `10px` 的圆来渲染连接桩。

### portLabelMarkup

连接桩标签的 DOM 结构。当 `ports.groups` 和 `ports.items` 都没有为对应的连接桩标签指定 `markup` 时，则使用这个默认选项来渲染连接桩标签，其默认值为：

```ts
{
  tagName: 'text',
  selector: 'text',
  attrs: {
    fill: '#000000',
  },
}
```

## prototype

### 通用

#### isNode()

```sign
isNode(): true
```

判断是不是节点，该方法始终返回 `true`。

#### getBBox(...)

```sign
getBBox(options: { deep?: boolean }): Rectangle
```

获取节点的包围盒。

:::warning{title=注意：}
| 需要注意的是，该方法通过节点的大小和位置计算包围盒，并不是渲染到画布后的包围盒，涉及的计算只是一些算数运算。
:::

<span class="tag-param">参数<span>

| 名称         | 类型    | 必选 | 默认值  | 描述                                                          |
| ------------ | ------- | :--: | ------- | ------------------------------------------------------------- |
| options.deep | boolean |      | `false` | 为 `true` 时表示包含所有子节点和边的包围盒，默认为 `false `。 |

<span class="tag-example">用法</span>

```ts
const rect1 = node.getBBox();
const rect2 = node.getBBox({ deep: true });
```

### 大小 Size

#### size(...)

```sign
/**
 * 获取节点大小。
 */
size(): Size

/**
 * 设置节点大小。
 */
size(size: Size, options?: Node.ResizeOptions): this

/**
 * 设置节点大小。
 */
size(width: number, height: number, options?: Node.ResizeOptions): this
```

<span class="tag-example">用法</span>

获取节点大小。

```ts
const size = node.size();
console.log(size.width, size.height);
```

设置节点大小的参数和使用方法与 [`resize`](#resize) 方法一样。

#### resize(...)

改变节点大小。

根据旋转角度和 `options.direction` 的不同，节点位置和大小都可能发生改变。

<span class="tag-param">参数<span>

| 名称              | 类型      | 必选 | 默认值           | 描述                                                                           |
| ----------------- | --------- | :--: | ---------------- | ------------------------------------------------------------------------------ |
| width             | number    |      |                  | 节点宽度。                                                                     |
| height            | number    |      |                  | 节点高度。                                                                     |
| options.direction | Direction |      | `'bottom-right'` | 向哪个方向改变大小，默认左上角固定，往右下角改变节点大小。                     |
| options.silent    | boolean   |      | `false`          | 为 `true` 时不触不触发 `'change:size'` 和 `'change:position'` 事件和画布重绘。 |
| options...others  | object    |      |                  | 其他自定义键值对，可以在事件回调中使用。                                       |

支持向 8 个方向改变节点大小，默认为 `'bottom-right'` 表示左上角固定，往右下角改变节点大小。

- top
- right
- bottom
- left
- top-left
- top-right
- bottom-left
- bottom-right

<span class="tag-example">用法</span>

```ts
node.resize(100, 40);

// 右下角固定，向左上角改变大小
node.resize(100, 40, { direction: "top-left" });

// 不触发事件和重绘
node.resize(100, 40, { silent: true });
```

#### scale(...)

```sign
scale(
  sx: number,
  sy: number,
  origin?: Point.PointLike,
  options?: Node.SetOptions,
): this
```

缩放节点。

根据缩放中心和缩放比例不同，节点的大小和位置都可能发生改变。

<span class="tag-param">参数<span>

| 名称             | 类型                    | 必选 | 默认值  | 描述                                                                           |
| ---------------- | ----------------------- | :--: | ------- | ------------------------------------------------------------------------------ |
| sx               | number                  |  ✓   |         | X 轴方向的缩放比例。                                                           |
| sy               | number                  |  ✓   |         | Y 轴方向的缩放比例。                                                           |
| origin           | Point.PointLike \| null |      | -       | 缩放中心，默认为节点中心。                                                     |
| options.silent   | boolean                 |      | `false` | 为 `true` 时不触不触发 `'change:size'` 和 `'change:position'` 事件和画布重绘。 |
| options...others | object                  |      |         | 其他自定义键值对，可以在事件回调中使用。                                       |

<span class="tag-example">用法</span>

```ts
node.scale(1.5, 1.5);

// 自定义缩放中心
node.scale(1.5, 1.5, { x: 100, y: 30 });

// 不触发事件和重绘
node.scale(1.5, 1.5, null, { silent: true });
```

#### fit(...)

```sign
fit(options?: Node.FitEmbedsOptions): this
```

根据子节点和边的大小位置，自动调整节点的大小和位置，使所有子节点和边都位于节点的包围盒内。

<span class="tag-param">参数<span>

| 名称             | 类型                                                                   | 必选 | 默认值  | 描述                                                 |
| ---------------- | ---------------------------------------------------------------------- | :--: | ------- | ---------------------------------------------------- |
| options.padding  | number \| { top: number; right: number; bottom: number; left: number } |      | `0`     | 边距。                                               |
| options.deep     | boolean                                                                |      | `false` | 是否包含所有后代节点和边，默认只包含直接子节点和边。 |
| options.silent   | boolean                                                                |      | `false` | 为 `true` 时不触不触发事件和画布重绘。               |
| options...others | object                                                                 |      |         | 其他自定义键值对，可以在事件回调中使用。             |

<span class="tag-example">用法</span>

```ts
node.fit();
node.fit({ padding: 10 });
node.fit({ padding: { top: 20, bottom: 20, left: 10, right: 10 } });
```

### 位置 Position

#### position(...)

```sign
/**
 * 获取节点位置。
 */
position(options?: Node.GetPositionOptions): Point.PointLike

/**
 * 设置节点位置。
 */
position(x: number, y: number, options?: Node.SetPositionOptions): this
```

获取节点位置。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                              |
| ---------------- | ------- | :--: | ------- | --------------------------------------------------------------------------------- |
| options.relative | boolean |      | `false` | 是否返回相对于父节点的相对位置，默认为 `false` 表示返回节点相对于画布的绝对位置。 |

<span class="tag-example">用法</span>

```ts
const pos = rect.position();
console.log(pos.x, pos.y);

const relativePos = child.position({ relative: true });
console.log(relativePos.x, relativePos.y);
```

设置节点位置。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                                                                                |
| ---------------- | ------- | :--: | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| x                | number  |  ✓   |         | 节点绝对或相对 X 轴坐标。                                                                                                           |
| y                | number  |  ✓   |         | 节点绝对或相对 Y 轴坐标。                                                                                                           |
| options.relative | boolean |      | `false` | 提供的坐标是否为相对坐标。为 `true` 时表示提供的坐标为相对于父节点位置的坐标，默认为 `false` 表示提供的坐标为相对于画布的绝对坐标。 |
| options.deep     | boolean |      | `false` | 是否同时改变子节点/边的位置。                                                                                                       |
| options.silent   | boolean |      | `false` | 为 `true` 时不触不触发 `'change:position'` 事件和画布重绘。                                                                         |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。                                                                                            |

<span class="tag-example">用法</span>

默认使用绝对坐标，当 `options.relative` 为 `true` 时表示使用相对坐标。

```ts
// 将节点移动到画布 [30, 30] 位置处
node.position(30, 30);

// 将子节点移动到相对父节点左上角 [30, 30] 位置处
child.position(30, 30, { relative: true });
```

当 `options.deep` 为 `true` 时将同时移动子节点和边。

```ts
parent.position(30, 30);
```

当 `options.silent` 为 `true` 时不触不触发 `'change:position'` 事件和画布重绘。

```ts
node.position(30, 30, { silent: true });
```

在选项中支持其他自定义键值对，可以在事件回调用使用。

```ts
node.position(30, 30, { otherKey: 'otherValue', ... })
```

#### translate(...)

```sign
translate(tx?: number, ty?: number, options?: Node.TranslateOptions): this
```

平移节点以及节点包含的子节点和边。

<span class="tag-param">参数<span>

| 名称               | 类型                         | 必选 | 默认值      | 描述                                                                   |
| ------------------ | ---------------------------- | :--: | ----------- | ---------------------------------------------------------------------- |
| tx                 | number                       |      | `0`         | 节点在 X 轴的偏移量。                                                  |
| ty                 | number                       |      | `0`         | 节点在 Y 轴的偏移量。                                                  |
| options.restrict   | Rectangle.RectangleLike      |      | `undefined` | 将节点的可移动范围限制在指定的矩形区域内。                             |
| options.transition | boolean \| Animation.Options |      | `false`     | 是否使用动画或指定一个[动画选项](/zh/docs/api/model/cell#transition)。 |
| options.silent     | boolean                      |      | `false`     | 为 `true` 时不触不触发 `'change:position'` 事件和画布重绘。            |
| options...others   | object                       |      |             | 其他自定义键值对，可以在事件回调中使用。                               |

<span class="tag-example">用法</span>

当指定的 `tx` 和 `ty` 为 `undefined` 时，表示对应方向的平移量为 `0`。

```ts
node.translate(30, 30);
node.translate(30); // 只在 X 轴移动
node.translate(undefined, 30); // 只在 Y 轴移动
```

我们可以通过 `options.restrict` 选项来将节点的移动限制在指定的矩形 `{x: number; y: number; width: number; height: number}` 范围内。

例如，我们可以将子节点的移动限制在父节点的包围盒中：

```ts
child.translate(30, 30, {
  restrict: child.getParent().getBBox(),
});
```

当 `options.transition` 为 `true` 或指定了一个[动画选项](/zh/docs/api/model/cell#transition)时，表示使用动画来平移节点，详情请参考[使用动画文档](/zh/docs/api/model/cell#transition)。

```ts
// 使用默认动画在平移节点
node.translate(30, 30, {
  transition: true,
});

// 自定动画选项
node.translate(30, 30, {
  transition: {
    duration: 2000,
  },
});
```

当 `options.silent` 为 true 时不触不触发 `'change:position'` 事件和画布重绘。

```ts
node.translate(30, 30, { silent: true });
```

在选项中支持其他自定义键值对，可以在事件回调用使用。

```ts
node.translate(30, 30, { otherKey: 'otherValue', ... })
```

### 旋转角度 Angle

#### getAngle()

```sign
getAngle(): number
```

获取节点的旋转角度。

<span class="tag-example">用法</span>

```ts
if (node.getAngle() !== 0) {
  // do something
}
```

#### rotate(...)

```sign
rotate(
  deg: number,
  absolute?: boolean,
  origin?: Point.PointLike,
  options?: Node.RotateOptions,
): this
```

旋转节点。

<span class="tag-param">参数<span>

| 名称             | 类型            | 必选 | 默认值      | 描述                                                                                                               |
| ---------------- | --------------- | :--: | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| deg              | number          |  ✓   |             | 旋转度数。                                                                                                         |
| options.absolute | boolean         |      | `false`     | 为 `true` 时表示给定的度数为节点旋转后的绝对度数，默认为 `false`，表示节点在当前旋转角度的基础上再旋转给定的度数。 |
| options.center   | Point.PointLike |      | `undefined` | 默认沿节点中心旋转，当给定 `options.center` 后表示沿给定的中心旋转。                                               |
| options.silent   | boolean         |      | `false`     | 为 `true` 时不触不触发 `'change:angle'` 事件和画布重绘。                                                           |
| options...others | object          |      |             | 其他自定义键值对，可以在事件回调中使用。                                                                           |

<span class="tag-example">用法</span>

默认为相对旋转，即在当前旋转角度的基础上在旋转给定的度数，当 `options.absolute` 为 `true` 时表示绝对旋转，即给定的度数为节点旋转后的度数。

```ts
// 相对旋转，节点在当前旋转角度的基础上在旋转 30 度
node.rotate(30);

// 绝对旋转，节点旋转后的角度为 30 度
node.rotate(30, { absolute: true });
```

默认沿节点中心旋转，可以通过 `options.center` 选项来指定一个旋转中心。

```ts
node.rotate(30, { center: { x: 10, y: 10 } });
```

默认触发 `'change:angle'` 事件和画布重绘，当 `options.silent` 为 `true` 时，不触发 `'change:angle'` 事件和画布重绘。

```ts
node.rotate(30, { silent: true });
```

在选项中支持其他自定义键值对，可以在事件回调用使用。

```ts
node.rotate(30, { otherKey: 'otherValue', ... })
```

### 连接桩 Ports

连接桩是节点上的固定连接点，很多图应用都有连接桩，并且有些应用还将连接桩分为输入连接桩和输出连接桩。

在上面我们介绍了连接桩的数据结构，这里我们将继续介绍节点上操作连接桩的一些方法。

#### addPort(...)

```sign
addPort(port: PortMetadata, options?: Node.SetOptions): this
```

添加单个连接桩。连接桩被添加到连接桩数组末尾。

<span class="tag-param">参数<span>

| 名称             | 类型                   | 必选 | 默认值  | 描述                                                 |
| ---------------- | ---------------------- | :--: | ------- | ---------------------------------------------------- |
| port             | [PortMetadata](#ports) |  ✓   |         | 连接桩。                                             |
| options.silent   | boolean                |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object                 |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### addPorts(...)

```sign
addPorts(ports: PortMetadata[], options?: Node.SetOptions)
```

添加多个连接桩。连接桩被添加到连接桩数组末尾。

<span class="tag-param">参数<span>

| 名称             | 类型                     | 必选 | 默认值  | 描述                                                 |
| ---------------- | ------------------------ | :--: | ------- | ---------------------------------------------------- |
| port             | [PortMetadata](#ports)[] |  ✓   |         | 连接桩数组。                                         |
| options.silent   | boolean                  |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object                   |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### insertPort(...)

```sign
insertPort(index: number, port: PortMetadata, options?: Node.SetOptions): this
```

在指定位置添加连接桩。注意 `port` 参数需要带上 `id` 属性。

<span class="tag-param">参数<span>

| 名称             | 类型                   | 必选 | 默认值  | 描述                                                 |
| ---------------- | ---------------------- | :--: | ------- | ---------------------------------------------------- |
| index            | number                 |  ✓   |         | 连接桩位置。                                         |
| port             | [PortMetadata](#ports) |  ✓   |         | 连接桩。                                             |
| options.silent   | boolean                |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object                 |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### hasPort(...)

```sign
hasPort(portId: string): boolean
```

检查指定的连接桩是否存在。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述        |
| ------ | ------ | :--: | ------ | ----------- |
| portId | string |  ✓   |        | 连接桩 ID。 |

<span class="tag-example">用法</span>

```ts
if (node.hasPort("port1")) {
  // do something
}
```

#### hasPorts()

```sign
hasPorts(): boolean
```

检查节点是否包含连接桩。

<span class="tag-example">用法</span>

```ts
if (node.hasPorts()) {
  // do something
}
```

#### getPort(...)

```sign
getPort(portId: string): PortMetadata
```

根据连接桩 ID 获取连接桩。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述        |
| ------ | ------ | :--: | ------ | ----------- |
| portId | string |  ✓   |        | 连接桩 ID。 |

#### getPortAt(...)

```sign
getPortAt(index: number): PortMetadata | null
```

获取指定索引位置的连接桩。

<span class="tag-param">参数<span>

| 名称  | 类型   | 必选 | 默认值 | 描述         |
| ----- | ------ | :--: | ------ | ------------ |
| index | number |  ✓   |        | 连接桩索引。 |

#### getPorts()

```sign
getPorts(): PortMetadata[]
```

获取所有连接桩。

#### getPortsByGroup(...)

```sign
getPortsByGroup(groupName: string): PortMetadata[]
```

获取群组下的所有连接桩。

<span class="tag-param">参数<span>

| 名称      | 类型   | 必选 | 默认值 | 描述       |
| --------- | ------ | :--: | ------ | ---------- |
| groupName | string |  ✓   |        | 群组名称。 |

#### removePort(...)

```sign
/**
 * 删除指定的连接桩。
 */
removePort(port: PortMetadata, options?: Node.SetOptions): this

/**
 * 删除指定 ID 的连接桩。
 */
removePort(portId: string, options?: Node.SetOptions): this
```

删除指定的连接桩。

<span class="tag-param">参数<span>

| 名称             | 类型         | 必选 | 默认值  | 描述                                                 |
| ---------------- | ------------ | :--: | ------- | ---------------------------------------------------- |
| port             | PortMetadata |  ✓   |         | 连接桩。                                             |
| options.silent   | boolean      |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object       |      |         | 其他自定义键值对，可以在事件回调中使用。             |

删除指定 ID 的连接桩。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                 |
| ---------------- | ------- | :--: | ------- | ---------------------------------------------------- |
| portId           | string  |  ✓   |         | 连接桩 ID。                                          |
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### removePortAt(...)

```sign
removePortAt(index: number, options?: Node.SetOptions): this
```

删除指定索引位置的连接桩。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                 |
| ---------------- | ------- | :--: | ------- | ---------------------------------------------------- |
| index            | number  |  ✓   |         | 连接桩索引。                                         |
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### removePorts(...)

```sign
/**
 * 删除所有连接桩。
 */
removePorts(options?: Node.SetOptions): this

/**
 * 删除指定的连接桩。
 */
removePorts(ports: (PortMetadata | string)[], options?: Node.SetOptions): this
```

删除指定的多个连接桩，当指定的连接桩为 `null` 时，删除所有连接桩。

<span class="tag-param">参数<span>

| 名称             | 类型                       | 必选 | 默认值  | 描述                                                 |
| ---------------- | -------------------------- | :--: | ------- | ---------------------------------------------------- |
| ports            | (PortMetadata \| string)[] |      |         | 要删除的连接桩数组。                                 |
| options.silent   | boolean                    |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object                     |      |         | 其他自定义键值对，可以在事件回调中使用。             |

#### getPortIndex(...)

```sign
getPortIndex(port: PortMetadata | string): number
```

获取连接桩的索引位置。

#### getPortProp(...)

```sign
getPortProp<T>(portId: string, path?: string | string[]): any
```

获取连接桩指定路径上的属性值。当路径为空时，返回完整的连接桩。

<span class="tag-param">参数<span>

| 名称   | 类型               | 必选 | 默认值 | 描述                                                                                                                                                       |
| ------ | ------------------ | :--: | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| portId | string             |  ✓   |        | 连接桩 ID。                                                                                                                                                |
| path   | string \| string[] |      |        | 属性路径。 <br> 当 `path` 为 `string` 类型时，路径是以 `'\'` 分割的字符串。 <br> 当 `path` 为 `string[]` 类型时，路径是连接桩对象路径上的 Key 构成的数组。 |

<span class="tag-example">用法</span>

```ts
node.getPortProp("port1");
node.getPortProp("port1", "attrs/circle");
node.getPortProp("port1", ["attrs", "circle"]);
```

#### setPortProp(...)

```sign
setPortProp(
  portId: string,
  path: string | string[],
  value: any,
  options?: Node.SetOptions,
): this
```

根据路径设置连接桩的属性。

<span class="tag-param">参数<span>

| 名称             | 类型               | 必选 | 默认值  | 描述                                                                                                                                                       |
| ---------------- | ------------------ | :--: | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| portId           | string             |  ✓   |         | 连接桩 ID。                                                                                                                                                |
| path             | string \| string[] |  ✓   |         | 属性路径。 <br> 当 `path` 为 `string` 类型时，路径是以 `'\'` 分割的字符串。 <br> 当 `path` 为 `string[]` 类型时，路径是连接桩对象路径上的 Key 构成的数组。 |
| value            | any                |  ✓   |         | 属性值。                                                                                                                                                   |
| options.silent   | boolean            |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。                                                                                                       |
| options...others | object             |      |         | 其他自定义键值对，可以在事件回调中使用。                                                                                                                   |

<span class="tag-example">用法</span>

```ts
node.setPortProp("port1", "attrs/circle", {
  fill: "#ffffff",
  stroke: "#000000",
});
node.setPortProp("port1", ["attrs", "circle"], {
  fill: "#ffffff",
  stroke: "#000000",
});
```

```sign
setPortProp(
  portId: string,
  value: DeepPartial<PortMetadata>,
  options?: Node.SetOptions,
): this
```

设置连接桩的属性，提供的属性选项与当前值进行[深度 merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources)。

<span class="tag-param">参数<span>

| 名称             | 类型                        | 必选 | 默认值  | 描述                                                 |
| ---------------- | --------------------------- | :--: | ------- | ---------------------------------------------------- |
| portId           | string                      |  ✓   |         | 连接桩 ID。                                          |
| value            | DeepPartial\<PortMetadata\> |  ✓   |         | 连接桩选项。                                         |
| options.silent   | boolean                     |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object                      |      |         | 其他自定义键值对，可以在事件回调中使用。             |

<span class="tag-example">用法</span>

```ts
node.getPortProp("port1", {
  attrs: {
    circle: {
      fill: "#ffffff",
      stroke: "#000000",
    },
  },
});
```

#### removePortProp(...)

```sign
removePortProp(portId: string, options?: Node.SetOptions): this
```

删除指定连接桩的选项。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                 |
| ---------------- | ------- | :--: | ------- | ---------------------------------------------------- |
| portId           | string  |  ✓   |         | 连接桩 ID。                                          |
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。             |

```sign
removePortProp(portId: string, path: string | string[], options?: Node.SetOptions): this
```

删除指定连接桩和指定路径的选项。

<span class="tag-param">参数<span>

| 名称             | 类型               | 必选 | 默认值  | 描述                                                                                                                                                       |
| ---------------- | ------------------ | :--: | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| portId           | string             |  ✓   |         | 连接桩 ID。                                                                                                                                                |
| path             | string \| string[] |  ✓   |         | 属性路径。 <br> 当 `path` 为 `string` 类型时，路径是以 `'\'` 分割的字符串。 <br> 当 `path` 为 `string[]` 类型时，路径是连接桩对象路径上的 Key 构成的数组。 |
| options.silent   | boolean            |      | `false` | 为 `true` 时不触发 `'change:ports'` 事件和画布重绘。                                                                                                       |
| options...others | object             |      |         | 其他自定义键值对，可以在事件回调中使用。                                                                                                                   |

#### portProp(...)

```sign
portProp(portId: string): PortMetadata
portProp<T>(portId: string, path: string | string[]): T
portProp(
  portId: string,
  path: string | string[],
  value: any,
  options?: Node.SetOptions,
): this
portProp(
  portId: string,
  value: DeepPartial<PortMetadata>,
  options?: Node.SetOptions,
): this
```

该方法是 [`getPortProp`](#getportprop) 和 [`setPortProp`](#setportprop) 两个方法的集合，参数选项和使用方法与这两个方法一致。
