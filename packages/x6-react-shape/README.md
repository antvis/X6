# @antv/x6-react-shape

> x6 shape for rendering react components

## Installation

```shell
# npm
$ npm install @antv/x6-react-shape --save

# yarn
$ yarn add @antv/x6-react-shape
```

## Usage

```
import { Graph, Shape } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'
 
// register shape with name "react"
Shape.register('react', ReactShape, true) 

// render
graph.addNode({
  x: 32,
  y: 48,
  width: 180,
  height: 40,
  stroke: '#597ef7',
  label: false,   // no label
  shape: 'react', // registered shape name
  component: (    // react component
    <div
      style={{
        color: '#fff',
        width: '100%',
        height: '100%',
        background: '#597ef7',
        textAlign: 'center',
        lineHeight: '40px',
      }}
    >
      This is a react element
    </div>
  ),
})
```

