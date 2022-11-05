---
title: 自定义节点
order: 8
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

We have some basic graphics built into X6, such as `Rect`, `Circle` and `Ellipse`, but these are far from enough to meet our practical needs, and we need to be able to define nodes that have business implications, such as the table node in the ER diagram. Customizing nodes is not that hard, it's just a combination of `<rect>`, `<circle>`, `<ellipse>`, `<image>`, `<text>`, `<path>` and other basic elements in SVG, if you are not familiar with these basic elements, you can refer to the [tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) provided by MDN , and use these base elements to define any graphics we want.

## Principle

Custom nodes actually derive (inherit) our own nodes from the base node and override certain options and methods of the base class.

### Three-step approach

Taking the built-in node `Rect` as an example, customizing the node can be done in the following three steps.

#### Step 1: Inheritance

```ts
import { Node } from '@antv/x6'

class Rect extends Node { 
  // Omit implementation details
}
```

#### Step 2: Configuration

Call the inherited static method `config(options)` to configure the default value of [node options](/en/docs/tutorial/basic/node/#options), [custom options](/en/docs/tutorial/basic/cell#custom options) and [custom attributes](), the most common option is to specify the default SVG/HTML structure of the node by [markup](/en/docs/tutorial/basic/cell#markup). The most common options are [markup](/en/docs/tutorial/basic/cell#markup) to specify the default SVG/HTML structure of the node, and [attrs](/en/docs/tutorial/basic/cell#attrs-1) to specify the default attributes of the node. style.

| Name | Type | Mandatory | Default | Description                                        |
|-----------|----------------------------------|----------|-----------|-------------------------------------------|
| propHooks | Function \| Function[] \| Object | No       | undefined | [Customization Options](/en/docs/tutorial/basic/cell#自定义选项) Hooks. |
| attrHooks | Object                           | No       | undefined | [Custom Properties]() Hooks.                         |
| ...others | Object                           |          |           | [Node Options](/en/docs/tutorial/basic/node/#选项)。            |

See below for the default configuration of the `Rect` node.

```ts
Rect.config({
  width: 100,
  height: 40,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 2,
    },
    label: {
      fontSize: 14,
      fill: '#333333',
      refX: '50%',
      refY: '50%',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
  // Apply the custom option label to the 'attrs/text/text' attribute via a hook
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})
```

In the above code, we specify the default size of the node by `width` and `height`, then we define the node to consist of `<rect>` and `<text>` SVG elements by `markup`, and specify the `body` and `label` selectors respectively, and then we can specify the default style of the node by these two selectors in `attrs`. to specify the default style of the node. Finally, a [custom option](/en/docs/tutorial/basic/cell#custom option) `label` is defined by `propHooks`, so that we can set the label text by label.

#### Step 3: Register

Call Graph's static method registerNode to register the node and then use it as a built-in node.

```ts
Graph.registerNode(name: string, cls: typeof Node, overwrite?: boolean)
```

| Parameter Name | Type | Mandatory | Default | Description                                              |
|-----------|-------------|---------|--------|-------------------------------------------------|
| name      | String      | Yes       |        | The name of the registered node.                                     |
| cls       | typeof Node | Yes       |        | Node class, a class that inherits directly or indirectly from Node.                  |
| overwrite | Boolean     | No       | false  | Override or not when renaming, default is `false` Do not override (error when renaming). |


For example, register the node named `'rect'`.

```ts
Graph.registerNode('rect', Rect)
```

Once registered, we can use it like the following.

```ts
graph.addNode({
  shape: 'rect',
  x: 30,
  y: 40,
})
```

### Handy method one

Sometimes we may not need to extend any method after inheriting a node, but just override some default style. For example, define a rectangle with a red border.

```ts
class RedRect extends Rect { }

// Override the default border color
RedRect.config({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

The first line of code above is a bit awkward: it implements inheritance but doesn't extend any methods, which is a bit of an overkill. So we also provide a more convenient static method `define` to define this kind of node.

```ts
const RedRect = Rect.define({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

Graph.registerNode('red-rect', RedRect)
```

This method takes its caller (e.g. `Rect` above) as the base class, inherits a new node, and then calls the new node's static method `config` to configure the default options.

Note that the class name of the `RedRect` class generated by the above code is not `'RedRect'`, but the system-generated class name, whose big camelCase form will be used as the class name of the new node when the `constructorName` option is specified.

```ts
const RedRect = Rect.define({
  constructorName: 'red-rect',
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

Graph.registerNode('red-rect', RedRect)
```

If we provide the `shape` option, then the system will automatically register the node for you. When the `constructorName` option is not specified, the large camelCase form of `shape` will also be the class name of the new node, i.e. the following code defines the class name of the node as `'RedRect'`.

```ts
Rect.define({
  shape: 'red-rect', // Auto-register node named 'red-rect' and node class named 'RedRect'.
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

All options are consistent with those of the [config method](#second configuration step) except for two special options, `constructorName` and `shape`. The following table shows the options supported by the `define` method.

| Name | Mandatory | Type | Description                                                                             |
|-----------------|----------|--------|--------------------------------------------------------------------------------|
| constructorName | 否       | String | Class name.                                                                            |
| shape           | 否       | String | The auto-registered node name, which will also be used as the class name when `constructorName` defaults to its big camelCase form. |
| ...others       |          | Object | Options for [config method](# second configuration step).                                                |

### Convenient method two

The `Graph.registerNode` method mentioned above has another signature, using which it is possible to define and register nodes at the same time.

```ts
Graph.registerNode(name: string, options: Object, overwrite?: boolean)
```

| Parameter Name | Type | Mandatory | Default | Description                                              |
|-----------|---------|---------|--------|-------------------------------------------------|
| name      | String  | Yes       |        | The name of the registered node.                                     |
| options   | Object  | Yes       |        | Options.                                             |
| overwrite | Boolean | No       | false  | Override or not when renaming, default is `false` Do not override (error when renaming). |

Specify the inherited base class by `options.inherit`, the default value is `Node` class, support string or node class, when `options.inherit` is string will automatically find the corresponding node from the registered nodes as the base class, other options of `options` are the same as [define method](#convenient method one) The other options of `options` are the same as in [define method](#convenience method I). When `options.constructorName` is the class name default, the big camelCase form of the first parameter `name` will also be used as the class name of the custom node.

```ts
Graph.registerNode('red-rect', {
  inherit: Rect, // or 'straight' characters
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

## Case

Next we define a rectangle `CustomRect` based on `Shape.Rect`, here we do not modify the `markup` definition of the rectangle, but just do the style override.

Use the convenient method one.

```ts
import { Shape } from '@antv/x6'

Shape.Rect.define({
  shape: 'custom-rect',
  width: 300, // Default width
  height: 40, // Default height
  attrs: {
    body: {
      rx: 10, // Rounded rectangle
      ry: 10,
      strokeWidth: 1,
      fill: '#5755a1',
      stroke: '#5755a1',
    },
    label: {
      fill: '#fff',
      fontSize: 18,
      refX: 10, // x-axis offset, similar to margin-left in css
      textAnchor: 'left', // Left Alignment
    }
  },
})
```

使用便捷方法二。

```ts
Graph.registerNode('custom-rect', {
  inherit: 'rect', // Inherited from Shape.
  width: 300, // Default width
  height: 40, // Default height
  attrs: {
    body: {
      rx: 10, // Rounded rectangle
      ry: 10,
      strokeWidth: 1,
      fill: '#5755a1',
      stroke: '#5755a1',
    },
    label: {
      fill: '#fff',
      fontSize: 18,
      refX: 10, // x-axis offset, similar to margin-left in css
      textAnchor: 'left', // Left Alignment
    }
  },
})
```

Then we can use it like this.

```ts
graph.addNode({
  x: 100,
  y: 60,
  shape: 'custom-rect',
  label: 'My Custom Rect', // label Custom options inherited from base class
});
```

<iframe src="/demos/tutorial/intermediate/custom-node/custom-node"></iframe>
