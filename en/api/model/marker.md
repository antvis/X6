---
title: "Arrow"
description: "Arrow"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/model/marker/"
version: "3.x"
---

[Resource index](/llms.txt)

In the previous [tutorial](/en/tutorial/basic/edge#using-arrows), we briefly introduced how to use the two special attributes [`sourceMarker`](/en/api/registry/attr#sourcemarker) and [`targetMarker`](/en/api/registry/attr#targetmarker) to specify the starting and ending arrows for edges. We demonstrated how to use built-in arrows and custom arrows. Next, we will first list the parameters for each built-in arrow, then provide a detailed explanation of how to use various SVG elements to customize arrows, and finally explain how to register custom arrows as built-in arrows.

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private edge: Edge

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.edge = this.graph.addEdge({
      source: [80, 160],
      target: [480, 160],
      attrs: {
        line: {
          sourceMarker: 'block',
          targetMarker: 'block',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  onMarkerChange = ({ type, ...args }: State) => {
    this.edge.attr({
      line: {
        sourceMarker: { args, name: type },
        targetMarker: { args, name: type },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-native-app">
        <div className="app-side">
          <Settings onChange={this.onMarkerChange} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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
| ...attrs       | Object  | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### classic

Classic arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### diamond

Diamond arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### cross

Cross arrow.

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| size           | Number  | 10            | Size of the arrow.                                                                         |
| width          | Number  | size          | Width of the arrow; can use `size` directly when width and height are the same.           |
| height         | Number  | size          | Height of the arrow; can use `size` directly when width and height are the same.          |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| ...attrs       | Object  | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### async

| Parameter Name | Type    | Default Value | Description                                                                                 |
|----------------|---------|---------------|---------------------------------------------------------------------------------------------|
| width          | Number  | 10            | Width of the arrow.                                                                         |
| height         | Number  | 6             | Height of the arrow.                                                                         |
| offset         | Number  | 0             | Absolute offset along the edge direction.                                                  |
| open           | Boolean | false         | Non-closed arrow.                                                                          |
| flip           | Boolean | false         | Whether to flip the arrow.                                                                  |
| ...attrs       | Object  | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`. |

### path

Custom arrow with [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

| Parameter Name | Type   | Default Value | Description                                                                                                                                               |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| d              | string | undefined     | The [d attribute value](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) of the `<path>` element, applied to the `<path>` element after being standardized by `Util.normalizeMarker`. |
| offsetX        | Number | 0             | x-direction offset.                                                                                                                                      |
| offsetY        | Number | 0             | y-direction offset.                                                                                                                                      |
| ...attrs       | Object | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element, such as `‘fill’` and `'stroke'`.                                                               |

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-path-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### circle

Circular arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| r              | Number | 5             | Circle radius.                                                                               |
| ...attrs       | Object | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<circle>` element, such as `‘fill’` and `'stroke'`. |

### circlePlus

Circular plus arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| r              | Number | 5             | Circle radius.                                                                               |
| ...attrs       | Object | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<path>` element (plus), such as `‘fill’` and `'stroke'`. |

### ellipse

Elliptical arrow.

| Parameter Name | Type   | Default Value | Description                                                                                   |
|----------------|--------|---------------|----------------------------------------------------------------------------------------------|
| rx             | Number | 5             | x-axis radius of the ellipse.                                                                |
| ry             | Number | 5             | y-axis radius of the ellipse.                                                                |
| ...attrs       | Object | &#123; &#125;           | Other parameters will be treated as attributes of the arrow `<ellipse>` element, such as `‘fill’` and `'stroke'`. |


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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: '#873bf4',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-custom-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



Sometimes, the coordinates of the `d` attribute of the path element we obtain may not be standardized. If used directly as an arrow, it may result in positional deviation. Therefore, we provide the `normalizeMarker` utility method in the `Util` namespace to standardize the coordinates of `d`.

**Method Signature**

```ts
Registry.Marker.normalize(d: string, offset: { x?: number; y?: number }): string
Registry.Marker.normalize(d: string, offsetX?: number, offsetY?: number): string
```

| Parameter Name | Type                       | Description                        |
|----------------|----------------------------|------------------------------------|
| d              | string                     |                                    |
| offset         | &#123; x?: number; y?: number &#125; | Offset relative to the origin      |
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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Util } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const d =
      'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z'
    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-normalize-path-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const marker = {
      tagName: 'image',
      // https://www.iconfinder.com/icons/15539/arrow_left_previos_icon
      'xlink:href':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFMklEQVRYR+2WaWxUVRiGnzt3lntnptPOdGba6ZRS7ALUsFY2g7SyhKWA0ALKHrBgWBRqQioQKJZdVpHdH5jKokGBgopoBCpbIkvYJIoIspUudGEYmHY6c8eMLCHIojVATLjJ+XfP9z75znve7wg84094xvo8B/jfd8AsQZMq2AP4a+On/9KBZqmyvPpnj+enUhhTG/HgnloB6GFU/8YJM40Gg/mjA0dHK7DiaQHEN0CYkzmke8ao+SOYmTk/MGvrj12A7540gDEE+neJi80ZO/0tZ7v+rwOVZMSkuTddvNIKOPWkAV4a1jBu/3sLummi6xmpqizh/O8VZI3e8UeB60ZroPhJAOiA6juFW5vlrV99k9lDY5BAFDm2+wyjx205dNLnG2AymRJdLtevwJl7QGQguEyACqgCKgDPvbAPMqEzCkY6NdpOB2u8fYHLgKZnXJ19+Wc+bQFBLpk9679k8rsfX7e+3MZrMBrD9+Xnr/W4XMcjjVJilD08tq4zMiY03GTTaWVtQPELJUVlyuWzhZeOFhYVXERZDRy5/xY0jYIBHRvEDewz/NWoUJuRqZPW7T10pXRzS4u5w8ylmd3a9G8D1X7Qacib9AknTonkfr6OJYsXUT/iJimpzTHHRgABwAWuIryuMnzVHnw1ApWlHvZvP8GGlQWVWyuuDQG2CREwPNFoHNa1S6OWKV2StInJDkJC/Cg1XorOlXPxTCUxDevgiLdzo+IqNdfKELwlrFpwmMjkMYyYNY0ZM6bx5tAEHFFq3L8c4dql01Rdr0AjmZBCLaj1JrSGUDSSjE6vpiD/HJPHrT27z+NuFTyCVxJFMXvMoLZpaekRhJo8uCt9+Lw1CHjRaDQoiPj8IKol1JIOQ5jEqnlHCU3sxdD3c8jJzmJAiwtY9T4EKQSjIw5DZCxanRFkAyjgdRXjdZVjtEaD3kBWxyks3nui310PqGB8rzrWKeOyUy3J7euhlqz4FQMBRSEQ8COogj4S8N6oxO8+zcoPjqB/oTudR2WyYtFcsnpL2BwOVDrDrXjz3+piTc1NqsqKCfi9mOomIVscqIUq5o1dw8SNB7LuN2GjeEHMGdYzKSN9UALRCTEIchwIOqrdZfg9blQ6CcF3gSW5uxCdnWiakc6OTWvITtdhDNHj94sEVEGjiqAIBEQBtU6PWjbi93sRUOG7fp4lU75m5s6zfwO4Y8zBaZGm3IG9bHWTW8iExaWgtTVBo9WhUmtwnd7C0tk7uWpuT6u+vfn+szWBpOqTQp1oPXaHCZvDhMlqRh9mxRBuRyOF4PepUNChxsPpfRtZNPs31l9yjX3ULIirhzBncIq9z2v9HMQmp2KMCaauSNnxPJbN2Myuy9HlSZ1TLMcOHjp78PDhhWEQHymKjZ2y2CDSoolwOnRiRIQOq02L3WnBEWPD5ykl/4vz7D+s1Pzgrmz/uGGk0sDbfeuZc9/IkEzNU1rjbDsV9+UCFr+Ty/Sd5XMFWS4ON5uTCwsLB9++f1rACsSroGkYNI4U1UkOvTYxVBYssloreKq07C0vziuBkY8DuBNa7doapeVDu6pf7NivDbb6HViW/SFTtl+Z44WJt9PuJuB7SCTrATvQUA/NvODzQR5Q9E8BgnWj6wvi8mGdQnr0Tjfw7Q6FCZuvzPfChNrOgdq8B3QWmD0+1ZJlCtEwaVvxspsw9mkC/KUlw/jeDvvC3cVXNxQqysCnDhAUlGCkXaVqcUFRRj3i7B/L9m888KBiDqAM8D5W6SE//FeA2ure3fcc4HkH/gSNF7Qt0mUkowAAAABJRU5ErkJggg==',
      width: 32,
      height: 32,
      x: -16,
      y: -16,
    }

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: { ...marker },
          targetMarker: { ...marker },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-image-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
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
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-tagname-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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
| sourceMarker   | block             | &#123; &#125;                          |
| targetMarker   | ellipse           | &#123; rx: 10, ry: 6 &#125;           |

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
### docs/demos/api/marker/native/index.less

```less
.marker-native-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/marker/native/settings.tsx

```tsx
import React from 'react'
import { Input, Switch, Checkbox, Select, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  type: string
  r?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  offset?: number
  custom?: boolean
  fill?: string
  stroke?: string
  open?: boolean
  flip?: boolean
  strokeWidth?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'block',
    r: 5,
    rx: 5,
    ry: 5,
    width: 10,
    height: 10,
    offset: 0,
    custom: false,
    strokeWidth: 1,
  }

  notifyChange() {
    const {
      custom,
      type,
      r,
      rx,
      ry,
      width,
      height,
      offset,
      open,
      flip,
      ...others
    } = this.state

    if (others.stroke == null) {
      delete others.strokeWidth
    }

    let state: State

    if (type === 'block') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        ...others,
      }
    } else if (type === 'classic' || type === 'diamond' || type === 'cross') {
      state = {
        type,
        width,
        height,
        offset,
        ...others,
      }
    } else if (type === 'async') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        flip,
        ...others,
      }
    } else if (type === 'circle' || type === 'circlePlus') {
      state = {
        type,
        r,
        ...others,
      }
    } else if (type === 'ellipse') {
      state = {
        type,
        rx,
        ry,
        ...others,
      }
    }

    this.props.onChange(state!)
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onRChanged = (r: number) => {
    this.setState({ r }, () => {
      this.notifyChange()
    })
  }

  onRxChanged = (rx: number) => {
    this.setState({ rx }, () => {
      this.notifyChange()
    })
  }

  onRyChanged = (ry: number) => {
    this.setState({ ry }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onCustomChanged = (e: any) => {
    this.setState({ custom: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onFillChanged = (e: any) => {
    this.setState({ fill: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeChanged = (e: any) => {
    this.setState({ stroke: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeWidthChanged = (strokeWidth: number) => {
    this.setState({ strokeWidth }, () => {
      this.notifyChange()
    })
  }

  onOpenChanged = (open: boolean) => {
    this.setState({ open }, () => {
      this.notifyChange()
    })
  }

  onFlipChanged = (flip: boolean) => {
    this.setState({ flip }, () => {
      this.notifyChange()
    })
  }

  render() {
    const type = this.state.type

    return (
      <Card
        title="Marker Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="block">Block</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="diamond">Diamond</Select.Option>
              <Select.Option value="cross">Cross</Select.Option>
              <Select.Option value="async">Async</Select.Option>
              <Select.Option value="circle">Circle</Select.Option>
              <Select.Option value="circlePlus">Circle Plus</Select.Option>
              <Select.Option value="ellipse">Ellipse</Select.Option>
            </Select>
          </Col>
        </Row>
        {(type === 'circle' || type === 'circlePlus') && (
          <Row align="middle">
            <Col span={6}>Radius</Col>
            <Col span={14}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={this.state.r}
                onChange={this.onRChanged}
              />
            </Col>
            <Col span={2} offset={1}>
              <div className="slider-value">{this.state.r}</div>
            </Col>
          </Row>
        )}
        {type === 'ellipse' && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Radius X</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.rx}
                  onChange={this.onRxChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.rx}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Radius Y</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.ry}
                  onChange={this.onRyChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.ry}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {(type === 'block' ||
          type === 'classic' ||
          type === 'diamond' ||
          type === 'async' ||
          type === 'cross') && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Width</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.width}
                  onChange={this.onWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.width}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Height</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.height}
                  onChange={this.onHeightChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.height}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Offset</Col>
              <Col span={14}>
                <Slider
                  min={-50}
                  max={50}
                  step={1}
                  value={this.state.offset}
                  onChange={this.onOffsetChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.offset}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {(type === 'block' || type === 'async') && (
          <Row align="middle">
            <Col span={4}>Open</Col>
            <Col span={18}>
              <Switch checked={this.state.open} onChange={this.onOpenChanged} />
            </Col>
          </Row>
        )}

        {type === 'async' && (
          <Row align="middle">
            <Col span={4}>Flip</Col>
            <Col span={18}>
              <Switch checked={this.state.flip} onChange={this.onFlipChanged} />
            </Col>
          </Row>
        )}

        <Row
          align="middle"
          style={{ borderTop: '1px solid #e9e9e9', paddingTop: 12 }}
        >
          <Col>
            <div>
              <Checkbox
                checked={this.state.custom}
                onChange={this.onCustomChanged}
              >
                Custom fill and stroke color
              </Checkbox>
            </div>
          </Col>
        </Row>
        {this.state.custom && (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Fill Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.fill}
                  style={{ width: '100%' }}
                  onChange={this.onFillChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.stroke}
                  style={{ width: '100%' }}
                  onChange={this.onStrokeChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Width</Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={this.state.strokeWidth}
                  onChange={this.onStrokeWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.strokeWidth}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    )
  }
}
```
### docs/demos/api/marker/path/index.less

```less
.marker-path-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 80px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/custom/index.less

```less
.marker-custom-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/normalize-path/index.less

```less
.marker-normalize-path-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 100px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/image/index.less

```less
.marker-image-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/tagname/index.less

```less
.marker-tagname-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
