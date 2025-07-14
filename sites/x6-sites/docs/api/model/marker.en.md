---
title: Arrow
order: 4
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/model
---

In the previous [tutorial](/tutorial/basic/edge#using-arrows), we briefly introduced how to use the two special attributes [`sourceMarker`](/api/registry/attr#sourcemarker) and [`targetMarker`](/api/registry/attr#targetmarker) to specify the starting and ending arrows for edges. We demonstrated how to use built-in arrows and custom arrows. Next, we will first list the parameters for each built-in arrow, then provide a detailed explanation of how to use various SVG elements to customize arrows, and finally explain how to register custom arrows as built-in arrows.

## Built-in Arrows

Built-in arrows allow for the parameterization of commonly used arrow types. When using built-in arrows, you only need to specify the arrow name `name` and the corresponding parameters. The fill color `fill` and stroke color `stroke` default to inheriting from the edge, but can be overridden by specifying the `fill` and `stroke` properties.

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10, // x radius of the ellipse arrow
      ry: 6,  // y radius of the ellipse arrow
    },
  },
})
```

<code id="marker-native" src="@/src/api/marker/native/index.tsx"></code>

Each built-in arrow has corresponding parameters, which will be introduced below.

### block

Solid arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| open           | Boolean | false         | Non-closed arrow.                                                                          |
| ...attrs       | Object  | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### classic

Classic arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### diamond

Diamond arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### cross

Cross arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### async

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| width          | Number  | 10            | Width of the arrow.                                                                         |
| height         | Number  | 6             | Height of the arrow.                                                                         |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| open           | Boolean | false         | Non-closed arrow.                                                                          |
| flip           | Boolean | false         | Whether to flip the arrow.                                                                  |
| ...attrs       | Object  | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### path

Custom arrow with [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

| Parameter Name | Type   | Default Value | Description                                                                                                                                               |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| d              | string | undefined     | The [d attribute value](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) of the `<path>` element, applied to the `<path>` element after being standardized by `Util.normalizeMarker`. |
| offsetX        | Number | 0             | x-direction offset.                                                                                                                                      |
| offsetY        | Number | 0             | y-direction offset.                                                                                                                                      |
| ...attrs       | Object | { }           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`.                                                               |

```ts
graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  attrs: {
    line: {
      stroke: '#31d0c6',
      sourceMarker: {
        name: 'path',
        d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
      },
      targetMarker: {
        name: 'path',
        offsetX: 10,
        d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
      },
    },
  },
})
```

<code id="marker-path" src="@/src/api/marker/path/index.tsx"></code>

### circle

Circular arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| r              | Number | 5             | Circle radius.                                                                               |
| ...attrs       | Object | { }           | Other parameters will be treated as attributes of the arrow `<circle>` element, such as `‘fill’` and `'stroke'`. |

### circlePlus

Circular plus arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| r              | Number | 5             | Circle radius.                                                                               |
| ...attrs       | Object | { }           | Other parameters will be treated as attributes of the arrow `<path>` element (plus), such as `‘fill’` and `'stroke'`. |

### ellipse

Elliptical arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| rx             | Number | 5             | x-axis radius of the ellipse.                                                                |
| ry             | Number | 5             | y-axis radius of the ellipse.                                                                |
| ...attrs       | Object | { }           | Other parameters will be treated as attributes of the arrow `<ellipse>` element, such as `‘fill’` and `'stroke'`. |


## Custom Arrows

We can specify which SVG element to use for rendering the arrow through `tagName`. For example, below we specify the use of the `<path>` element to render the arrow. All options except `tagName` will be added as attributes to the created `<path>` element. The fill color `fill` and stroke color `stroke` default to inheriting from the edge, but can be overridden by specifying the `fill` and `stroke` properties.

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'path',
      d: 'M 20 -10 0 0 20 10 Z',
    },
    targetMarker: {
      tagName: 'path',
      fill: 'yellow', // Use custom fill color
      stroke: 'green', // Use custom stroke color
      strokeWidth: 2,
      d: 'M 20 -10 0 0 20 10 Z',
    },
  },
})
```

In the code above, it is worth noting that our starting and ending arrows use the same `'d'` attribute value because we automatically calculate the arrow direction. In simple terms, we only need to define an arrow that points **left towards the origin**.

<code id="marker-custom" src="@/src/api/marker/custom/index.tsx"></code>

Sometimes, the coordinates of the `d` attribute of the path element we obtain may not be standardized. If used directly as an arrow, it may result in positional deviation. Therefore, we provide the `normalizeMarker` utility method in the `Util` namespace to standardize the coordinates of `d`.

**Method Signature**

```ts
Registry.Marker.normalize(d: string, offset: { x?: number; y?: number }): string
Registry.Marker.normalize(d: string, offsetX?: number, offsetY?: number): string
```

| Parameter Name | Type                       | Description                        |
|----------------|----------------------------|------------------------------------|
| d              | string                     |                                    |
| offset         | { x?: number; y?: number } | Offset relative to the origin      |
| offsetX        | number                     | x-axis offset relative to the origin |
| offsetY        | number                     | y-axis offset relative to the origin |

Comparing the starting and ending arrows below, it is clear that the starting arrow has a certain offset. After processing with `normalizeMarker`, the position of the ending arrow is corrected.

```ts
const d =
  'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z'

graph.addEdge({
  source: { x: 160, y: 40 },
  target: { x: 420, y: 40 },
  attrs: {
    line: {
      stroke: '#31d0c6',
      sourceMarker: {
        d,
        tagName: 'path',
      },
      targetMarker: {
        tagName: 'path',
        d: Util.normalizeMarker(d),
      },
    },
  },
})
```

<code id="marker-normalize-path" src="@/src/api/marker/normalize-path/index.tsx"></code>

In addition to `<path>`, we can also use `<circle>`, `<image>`, `<ellipse>`, `<rect>`, `<polyline>`, `<polygon>`, and other elements to define arrows. You just need to specify the tag name through `tagName` and set other necessary attributes for the element. For example, using an image to customize an arrow is also simple. First, we set `tagName` to `image` and specify the image URL through the `xlink:href` attribute, and then adjust the `y` attribute to center the image.

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'image',
      'xlink:href':
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      width: 24,
      height: 24,
      y: -12,
    },
    targetMarker: {
      tagName: 'image',
      'xlink:href':
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      width: 24,
      height: 24,
      y: -12,
    },
  },
})
```

<code id="marker-image" src="@/src/api/marker/image/index.tsx"></code>

It is important to note that when using `<circle>` and `<ellipse>` to customize arrows, you can set their `cx` attribute to the corresponding axis radius to avoid the arrow overflowing the edge boundary. Other elements can be adjusted using the `y` attribute to center the arrow vertically.

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'ellipse',
      rx: 20,
      ry: 10,
      cx: 20,
      fill: 'rgba(255,0,0,0.3)',
    },
    targetMarker: {
      tagName: 'circle',
      r: 12,
      cx: 12,
      fill: 'rgba(0,255,0,0.3)',
    },
  },
})
```

<code id="marker-tagname" src="@/src/api/marker/tagname/index.tsx"></code>

## Registering Arrows

Registration refers to the process of registering a method for generating arrows within the X6 system, which we call an arrow factory method. Once registered, the arrow can be used just like built-in arrows.

When do we need to register arrows?

- To unify the abstraction of classic arrows and extract key parameters, allowing parameters to influence the rendering of arrows for multi-scenario reuse, as described in the [Built-in Arrows](#built-in-arrows) section.
- To provide a unified definition for complex arrows, allowing for a single definition to be reused in multiple places, such as arrows with complex properties and style configurations.
- To enhance code readability through semantic arrow names and parameter names. For example, we can replace the `xlink:href` attribute of the `<image>` arrow with the parameter name `'imageUrl'` to make it more semantic.
- And more...

Before continuing, let's take a look at the definition of the arrow factory method.

```ts
type Factory<T extends KeyValue = KeyValue> = (args: T) => Result

type Result = Attr.SimpleAttrs & {
  tagName?: string
  children?: Result[]
}
```

The arrow factory method has only one parameter `args`, which is passed in when configuring the arrow. For example:

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10,
      ry: 6,
    },
  },
})
```

The above configuration is parsed to obtain the arrow name and parameters for both the starting and ending arrows.

| Arrow Type    | Arrow Name `name` | Arrow Parameters `args`     |
|----------------|-------------------|------------------------------|
| sourceMarker   | block             | { }                          |
| targetMarker   | ellipse           | { rx: 10, ry: 6 }           |

Internally, X6 finds the corresponding factory method by the arrow name and calls that method with the provided parameters `args`, returning the result. The structure of the result `Result` is the same as that of the custom arrow structure introduced above, specifying which SVG element to use for rendering the arrow through `tagName`, while the remaining key-value pairs are attached as attributes to that element, supporting nesting through `children`.

Once we understand the principle of the factory method, we can register the factory method using the static method `registerMarker` provided by Graph.

```
Graph.registerMarker(name: string, factory: Factory, overwrite?: boolean)
```

| Parameter Name | Parameter Type | Default Value | Description                                                        |
|----------------|----------------|---------------|-------------------------------------------------------------------|
| name           | String         |               | Arrow name.                                                       |
| factory        | Factory        |               | Arrow factory method.                                             |
| overwrite       | Boolean        | false         | Whether to overwrite the old factory method when encountering a name conflict; set to `true` to overwrite, otherwise an error will be thrown. |

Finally, let's register an image arrow.

```ts
/**
 * Parameter Definition
 */
interface ImageMarkerArgs extends Attr.SimpleAttrs {
  imageUrl: string
  imageWidth?: number
  imageHeight?: number
}

Graph.registerMarker('image', (args: ImageMarkerArgs) => {
  const { imageUrl, imageWidth, imageHeight, ...attrs } = args
  return {
    ...attrs, // Return non-special parameters as is
    tagName: 'image', // Use <image> tag to render the arrow; other key-value pairs will be treated as attributes of that element.
    width: imageWidth,
    height: imageHeight,
    'xlink:href': imageUrl,
  }
})
```

After registration, we can use the image arrow like this:

```ts
edge.attr({
  line: {
    sourceMarker: {
      name: 'image',
      imageUrl:
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
    targetMarker: {
      name: 'image',
      imageUrl:
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
  },
})
```
