---
title: "Labels"
description: "Labels"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/model/labels/"
version: "3.x"
---

[Resource index](/llms.txt)

The label configuration for edges in X6 is very flexible, so we dedicate a separate section to detail how to use edge labels.

Before we begin, let's briefly understand a few methods for manipulating labels on an Edge instance.

| Method Signature                                                   | Description          |
|-------------------------------------------------------------------|---------------------|
| [edge.getLabels()](/en/api/model/edge#getlabels)            | Get all labels.     |
| [edge.setLabels(...)](/en/api/model/edge#setlabels)         | Set labels.         |
| [edge.insertLabel(...)](/en/api/model/edge#insertlabel)     | Insert a label at a specified position. |
| [edge.appendLabel(...)](/en/api/model/edge#appendlabel)     | Append a label at the end. |
| [edge.setLabelAt(...)](/en/api/model/edge#setlabelat)       | Set a label at a specified position. |
| [edge.getLabelAt(...)](/en/api/model/edge#getlabelat)       | Get a label at a specified position. |
| [edge.removeLabelAt(...)](/en/api/model/edge#removelabelat) | Remove a label at a specified position. |

## Label Definition

A label includes label markup, label position, label style, etc. The complete definition is as follows.

```ts
interface Label {
  markup?: Markup
  attrs?: Attr.CellAttrs
  position?:
    | number
    | {
        distance: number
        offset?:
          | number
          | {
              x?: number
              y?: number
            }
        angle?: number
        options?: {
          absoluteDistance?: boolean
          reverseDistance?: boolean
          absoluteOffset?: boolean
          keepGradient?: boolean
          ensureLegibility?: boolean
        }
      }
}
```

- `markup`: Label markup.
- `attrs`: Label style.
- `position`: Label position. When its value is a `number`, it is equivalent to setting the value of `position.distance`.
  - `distance`: [Label position](#position).
  - `offset`: [Label offset](#offset).
  - `angle`: [Label rotation](#rotation).

## Default Label

When creating an Edge, you can set the default label using the [defaultLabel option](/en/tutorial/basic/edge#defaultlabel), with the default value as follows:

```ts
{
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
    text: {
      fill: '#000',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
    },
    rect: {
      ref: 'label',
      fill: '#fff',
      rx: 3,
      ry: 3,
      refWidth: 1,
      refHeight: 1,
      refX: 0,
      refY: 0,
    },
  },
  position: {
    distance: 0.5,
  },
}
```

This default label includes a `<text>` element (representing the label text) and a `<rect>` element (representing the label background), which is centered by default and has a white rounded background. Since all custom labels will be [merged](https://lodash.com/docs/4.17.15#merge) with this default label, we can simply provide a text attribute for a label as shown below.

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: 'Hello Label',
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
      source: { x: 125, y: 125 },
      target: { x: 320, y: 125 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'Hello Label',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="append-label-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Label Position

### Position

We can specify the label's position using the `position.distance` option of the Label, with a default value of `0.5`, indicating that the label is positioned at the center of the edge's length. Depending on the value, the calculation of the label's position can be categorized into three cases.

- When it is between `[0, 1]`, it indicates that the label is positioned at a relative length (proportion) from the starting point along the length direction.
- A positive number indicates that the label is positioned at a distance from the starting point along the edge's length.
- A negative number indicates that the label is positioned at a distance from the endpoint along the length direction.

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: '0.25',
    },
  },
  position: {
    distance: 0.25,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '150',
    },
  },
  position: {
    distance: 150,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '-100',
    },
  },
  position: {
    distance: -100,
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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '0.25',
        },
      },
      position: {
        distance: 0.25,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '150',
        },
      },
      position: {
        distance: 150,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '-100',
        },
      },
      position: {
        distance: -100,
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-position">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### Offset

We can set the label's offset using the `position.offset` option of the Label, with a default value of `0`, indicating no offset. Depending on the value, the calculation of the label's offset can be categorized into three cases.

- A positive number indicates an **absolute offset downwards perpendicular to the edge**.
- A negative number indicates an **absolute offset upwards perpendicular to the edge**.
- A coordinate object `{x: number; y: number }` indicates an **absolute offset in both `x` and `y` directions**.

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: 40',
    },
  },
  position: {
    distance: 0.66,
    offset: 40,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: -40',
    },
  },
  position: {
    distance: 0.66,
    offset: -40,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: { x: -40, y: 80 }',
    },
  },
  position: {
    distance: 0.66,
    offset: {
      x: -40,
      y: 80,
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
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelPositiveConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelNegativeConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelAbsoluteConnector',
        },
        {
          tagName: 'text',
          selector: 'offsetLabelMarker',
        },
      ],
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: 40',
        },
      },
      position: {
        distance: 0.66,
        offset: 40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: -40',
        },
      },
      position: {
        distance: 0.66,
        offset: -40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: { x: -40, y: 80 }',
        },
      },
      position: {
        distance: 0.66,
        offset: {
          x: -40,
          y: 80,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-offset-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### Rotation

We can set the label's rotation angle in the **clockwise direction** using the `position.angle` option of the Label, with a default value of `0`, indicating no rotation.

**Options**

- When `position.options.keepGradient` is `true`, the initial rotation angle of the label is the angle of the edge at the label's position, and subsequent `position.angle` settings are relative to that initial angle.
- When `position.options.ensureLegibility` is `true`, an additional 180° rotation will be applied to the label if necessary to ensure the label text is more readable.

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: '70°\nkeepGradient',
    },
  },
  position: {
    distance: 0.05,
    angle: 70,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '0°\nkeepGradient',
    },
  },
  position: {
    distance: 0.3,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '45°',
    },
  },
  position: {
    distance: 0.8,
    angle: 45,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '135°',
    },
  },
  position: {
    distance: 0.9,
    angle: 135,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '270°\nkeepGradient',
    },
  },
  position: {
    distance: 0.66,
    offset: 80,
    angle: 270,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '270°\nkeepGradient\nensureLegibility',
    },
  },
  position: {
    distance: 0.66,
    offset: -80,
    angle: 270,
    options: {
      keepGradient: true,
      ensureLegibility: true,
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
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelPositiveConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelNegativeConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelAbsoluteConnector',
        },
        {
          tagName: 'text',
          selector: 'offsetLabelMarker',
        },
      ],
      source: { x: 30, y: 120 },
      target: { x: 430, y: 120 },
      vertices: [{ x: 230, y: 200 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '70°\nkeepGradient',
        },
      },
      position: {
        distance: 0.05,
        angle: 70,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '0°\nkeepGradient',
        },
      },
      position: {
        distance: 0.3,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '45°',
        },
      },
      position: {
        distance: 0.8,
        angle: 45,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '135°',
        },
      },
      position: {
        distance: 0.9,
        angle: 135,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient',
        },
      },
      position: {
        distance: 0.66,
        offset: 80,
        angle: 270,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient\nensureLegibility',
        },
      },
      position: {
        distance: 0.66,
        offset: -80,
        angle: 270,
        options: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 120,
          'target/x': 330,
          'target/y': 120,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 200,
          'vertices/0/x': 230,
          'vertices/0/y': 120,
          'target/x': 430,
          'target/y': 200,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-rotate-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Label Style

We can customize the label style using the `markup` and `attrs` options, supporting customization in two dimensions.

**Method 1**: Globally override the default label definition when creating an Edge, affecting all labels.

```ts
const edge = graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  defaultLabel: {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'bg',
      },
      {
        tagName: 'text',
        selector: 'txt',
      },
    ],
    attrs: {
      txt: {
        fill: '#7c68fc',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
      bg: {
        ref: 'txt',
        refRx: '70%',
        refRy: '80%',
        stroke: '#7c68fc',
        fill: 'white',
        strokeWidth: 2,
      },
    },
  },
})

edge.appendLabel({
  attrs: {
    txt: {
      text: 'First',
    },
  },
  position: {
    distance: 0.3,
  },
})

edge.appendLabel({
  attrs: {
    txt: {
      text: 'Second',
    },
  },
  position: {
    distance: 0.7,
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
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      defaultLabel: {
        markup: [
          {
            tagName: 'ellipse',
            selector: 'bg',
          },
          {
            tagName: 'text',
            selector: 'txt',
          },
        ],
        attrs: {
          txt: {
            fill: '#7c68fc',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
          bg: {
            ref: 'txt',
            refRx: '70%',
            refRy: '80%',
            stroke: '#7c68fc',
            fill: 'white',
            strokeWidth: 2,
          },
        },
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'First',
        },
      },
      position: {
        distance: 0.3,
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'Second',
        },
      },
      position: {
        distance: 0.7,
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-markup-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



**Method 2**: Override the default label definition when creating a single label, affecting only that label.

```ts
edge.appendLabel({
  markup: [
    {
      tagName: 'circle',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'circle',
      selector: 'asteriskBody',
    },
    {
      tagName: 'text',
      selector: 'asterisk',
    },
  ],
  attrs: {
    label: {
      text: '½',
      fill: '#000',
      fontSize: 12,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
    },
    body: {
      ref: 'label',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refR: 1,
      refCx: 0,
      refCy: 0,
    },
    asterisk: {
      ref: 'label',
      text: '＊',
      fill: '#ff0000',
      fontSize: 8,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
      refX: 16.5,
      refY: -2,
    },
    asteriskBody: {
      ref: 'asterisk',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refR: 1,
      refCx: '50%',
      refCy: '50%',
      refX: 0,
      refY: 0,
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
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      markup: [
        {
          tagName: 'circle',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'circle',
          selector: 'asteriskBody',
        },
        {
          tagName: 'text',
          selector: 'asterisk',
        },
      ],
      attrs: {
        label: {
          text: '½',
          fill: '#000',
          fontSize: 12,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
          refR: 1,
          refCx: 0,
          refCy: 0,
        },
        asterisk: {
          ref: 'label',
          text: '＊',
          fill: '#ff0000',
          fontSize: 8,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
          refX: 16.5,
          refY: -2,
        },
        asteriskBody: {
          ref: 'asterisk',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
          refR: 1,
          refCx: '50%',
          refCy: '50%',
          refX: 0,
          refY: 0,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-attrs-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## String Labels

When setting the [default label](#default-label) using the [`updateLabels`](#default-label) option, adding labels becomes very simple, as shown in the following code.

```ts
// Specify label when creating a node
const edge = graph.addEdge({
  source,
  target,
  labels: [
    {
      attrs: { label: { text: 'edge label' } },
    },
  ],
})

// Reset labels
edge.setLabels([
  {
    attrs: { label: { text: 'edge label' } },
  },
])

// Append label
edge.appendLabel({
  attrs: { label: { text: 'edge label' } },
})
```

The above code only sets the label text, but it looks complicated as we have to provide a deeply nested object `{ attrs: { label: { text: 'edge' } } }`. To simplify this, we provide a syntax sugar that allows direct input of string labels, making the above code even simpler.

```ts
const edge = graph.addEdge({
  source,
  target,
  labels: ['edge label'],
})

edge.setLabels(['edge label'])

edge.appendLabel('edge label')
```

This syntax sugar defines a static method `parseStringLabel` on `Edge`, which converts string labels into Label objects. The default implementation is as follows.

```ts
function parseStringLabel(label: string): Label {
  return {
    attrs: { label: { text: label } },
  }
}
```

It is important to note that this syntax sugar only applies to the system's default labels. This means that if you redefine the default label's `markup` using the `defaultLabel` option, you will also need to rewrite the `parseStringLabel` method to ensure the usability of string labels.

```ts
Edge.config({
  defaultLabel: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'my-label', // Here the default selector is modified.
      },
    ],
  },
})

// You also need to redefine parseStringLabel to ensure the usability of string labels.
Edge.parseStringLabel = (label: string) => {
  return {
    attrs: { 'my-label': { text: label } },
  }
}
```

## Single Label

Most edges only have at most one label, so we define a [custom option](/en/api/model/cell#custom-options) `label` for `Edge` to support passing a single label.

```ts
graph.addEdge({
  source,
  target,
  label: {
    attrs: { label: { text: 'edge label' } },
  },
})
```

When only setting the label text, you can also use the string form of a single label.

```ts
graph.addEdge({
  source,
  target,
  label: 'edge label',
})
```
### docs/demos/api/label/append-label/index.less

```less
.append-label-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 250px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-position/index.less

```less
.label-position {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-offset/index.less

```less
.label-offset-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-rotate/index.less

```less
.label-rotate-app {
  display: flex;
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
### docs/demos/api/label/label-markup/index.less

```less
.label-markup-app {
  display: flex;
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
### docs/demos/api/label/label-attrs/index.less

```less
.label-attrs-app {
  display: flex;
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
