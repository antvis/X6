# @antv/x6-vue3-shape

> x6 shape for rendering vue3 components

## Installation

```shell
# npm
$ npm install @antv/x6-vue3-shape --save

# yarn
$ yarn add @antv/x6-vue3-shape
```

## Usage

### useGraph
```ts
import { shallowRef, ref, onMounted } from 'vue'
import { Graph } from '@antv/x6'
import '@antv/x6-vue3-shape'
import Comp from './Comp'

export default function useGraph() {
  const container = ref<HTMLElement | null>(null)
  const graph = shallowRef<Graph | null>()
  onMounted(() => {
    if (container.value) {
      graph.value = new Graph({
        container: container.value,
        panning: true,
      })
      graph.value.addNode({
        id: 'node1',
        x: 40,
        y: 40,
        width: 100,
        height: 40,
        shape: 'vue3-shape',
        // here are 4 ways usages:
        // 1. component: Comp
        // 2. component: <Comp />
        // 3. component: () => <Comp />
        // 4. component: 'text node'
        component: Comp,
      })
    }
  })
  return {
    container,
    graph,
  }
}
```


### usage in tsx

```tsx
import { defineComponent } from 'vue'
import useGraph from './useGraph'

export default defineComponent({
  name: 'Home',
  setup() {
    const { container } = useGraph()
    return () => {
      return (
        <div class="home">
          <div class="home__container" ref={container}></div>
        </div>
      )
    }
  }
})
```

### usage in vue sfc

```vue
<template>
  <div ref="container">xxx</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGraph from './useGraph'

export default defineComponent({
  name: 'app',
  setup() {
    const { container } = useGraph()
    return {
      container,
    }
  }
})

</script>
```

