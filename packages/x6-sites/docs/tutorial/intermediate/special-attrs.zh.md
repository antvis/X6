---
title: 特殊属性
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

在之前的基础教程中我们介绍了[如何通过 `attrs` 定制样式](../basic/cell#attrs-1)，同时在[使用箭头教程](../basic/edge#使用箭头-marker)中看到了 `sourceMarker` 和 `targetMarker` 两个特殊属性的强大作用，并了解到 `attrs` 对象在[节点样式](../basic/node#定制样式-attrs)、[边样式](../basic/edge#定制样式-attrs)、[标签样式](./edge-labels#标签样式)等多处被广泛使用，所以有必要对属性相关概念作更详细的介绍。对于原生 SVG 属性，网上有很多教程可以参考，例如 MDN 提供的 [SVG 属性参考](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)，这里我们将更多聚焦到如何定义和使用特殊属性。

特殊属性提供了比[原生 SVG 属性](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)更加灵活和强大的功能，在应用属性时，原生属性被直接传递给对应的元素，特殊属性则被进一步加工处理，转换为浏览器认识的原生属性后，再传递给对应的元素。

特殊属性是一些特定于jointjs的属性，提供了比原生SVG属性更强大的功能。在讨论元素样式时，我们已经提到了它们，并在添加链接箭头时看到了它们的作用。当我们谈到创建自定义元素、链接和链接标签时，它们变得更加重要。

在JointJS中，定义图表元素、链接和标签样式的主要方法是通过attrs对象。如果传递的属性是标准的SVG属性，它们仅仅传递给形状的单个SVGElements;然后是浏览器的工作，将它们应用到元素上，并在被JointJS视图类要求时以所请求的方式呈现形状。然而，如果联合js遇到了它的一个特殊属性，它会接管自定义逻辑，以提供先进的功能;然后将结果编码为标准SVG属性。

所有的JointJS特殊属性都使用camelCase命名。因此，为了保持一致性，我们强烈建议您使用JointJS将camelCase转换为本地SVG的烤肉串大小写的能力，并且在设置本地SVG属性时也使用camelCase(即strokeWidth而不是本地的“stroke-width”)。

本地SVG属性列表可以在互联网上的其他地方找到;看看，例如，在MDN的SVG属性参考。在本节教程中，我们想向你展示一下JointJS还能让你做些什么。


## 自定义特殊属性

## 内置特殊属性

### 相对大小

在定制节点或边的样式时，一个常见需求就是设置相对大小，我们在 X6 中提供了一系列以 `ref` 为前缀特殊属性，来为元素设置相对大小，同时这些属性的计算都是基于节点/边的原始数据，所有计算都不依赖浏览器的 bbox 计算，所以不会有任何性能问题。

- `refWidth` 和 `refHeight` 
- `refX` 和 `refY`
- `refCx` 和 `refCy`
- `refRx` 和 `refRy`
- `refR`
- 

