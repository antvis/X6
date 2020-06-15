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

```ts
import { Graph } from '@antv/x6'
import '@antv/x6-react-shape'

// render
graph.addNode({
  shape: 'react-shape',
  x: 32,
  y: 48,
  width: 180,
  height: 40,
  component: (
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

