# @antv/x6-vue-shape

> x6 shape for rendering vue components

## Installation

```shell
# npm
$ npm install @antv/x6-vue-shape --save

# yarn
$ yarn add @antv/x6-vue-shape
```

## Usage

```ts
import { Graph } from '@antv/x6'
import '@antv/x6-vue-shape'
import HelloWord from './HelloWord.vue'

// render
graph.addNode({
  shape: 'vue-shape',
  x: 32,
  y: 48,
  width: 180,
  height: 40,
  component: {
    template: `<hello-world :name="name"></hello-world>`,
    data() {
      return {
        name: 'x6',
      }
    },
    components: {
      HelloWorld,
    }
  },
})
```

