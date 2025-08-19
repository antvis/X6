---
title: Vue Nodes
order: 5
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="In this chapter, you will learn about"}

- How to use Vue components to render node content
- How to update node content

:::

## Rendering Nodes

We provide a standalone package `@antv/x6-vue-shape` to render nodes using Vue components.

:::warning{title=Note}
It is important to ensure that the versions of x6 and x6-vue-shape match, meaning both packages should use the same major version.
:::

```html
<template>
  <div class="app-content">
    <div id="container"></div>
    <TeleportContainer />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ProgressNode from './components/ProgressNode.vue'
  import { Graph } from '@antv/x6'
  import { register, getTeleport } from '@antv/x6-vue-shape'

  register({
    shape: 'custom-vue-node',
    width: 100,
    height: 100,
    component: ProgressNode,
  })
  const TeleportContainer = getTeleport()

  export default defineComponent({
    name: 'App',
    components: {
      TeleportContainer,
    },
    mounted() {
      const graph = new Graph({
        container: document.getElementById('container')!,
        background: {
          color: '#F2F7FA',
        },
        autoResize: true,
      })

      graph.addNode({
        shape: 'custom-vue-node',
        x: 100,
        y: 60,
      })
    },
  })
</script>
```

The content of the node component is as follows:

```html
<template>
  <el-progress type="dashboard" :percentage="percentage" :width="80">
    <template #default="{ percentage }">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ProgressNode',
    inject: ['getNode'],
    data() {
      return {
        percentage: 80,
      }
    },
    mounted() {
      const node = (this as any).getNode()
      console.log(node)
    },
  })
</script>
```

The final effect is as follows:

<iframe src="/demos/vue/basic/index.html" style="width: 100%; height: 260px; border: 0px; overflow: hidden;"></iframe>

## Updating Nodes

To update the content of a `Vue` node, there are two methods:

- Listen for node events within the component and trigger events externally.
- Use state management tools like `Vuex` (not elaborated here, but used in the same way as regular `Vue` components with `Vuex` data).

Below is an introduction to dynamically updating node content using events:

```ts
const node = graph.addNode({
  shape: 'custom-vue-node',
  x: 100,
  y: 60,
  data: {
    progress: 80,
  },
})

setInterval(() => {
  const { progress } = node.getData()
  node.setData({
    progress: (progress + 10) % 100,
  })
}, 2000)
```

Inside the node component, we can listen for changes to the node's `data`:

```ts
export default defineComponent({
  name: 'ProgressNode',
  inject: ['getNode'],
  data() {
    return {
      percentage: 80,
    }
  },
  mounted() {
    const node = (this as any).getNode() as Node
    node.on('change:data', ({ current }) => {
      const { progress } = current
      this.percentage = progress
    })
  },
})
```

<iframe src="/demos/vue/update/index.html" style="width: 100%; height: 260px; border: 0px; overflow: hidden;"></iframe>

## Using in Vue2

In the above example, we used `teleport`, which is a feature in `Vue3`. How can we use it in `Vue2`?

```html
<template>
  <div id="app"></div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import CustomNode from './components/CustomNode.vue'
  import { Graph } from '@antv/x6'
  import { register } from '@antv/x6-vue-shape'

  register({
    shape: 'custom-vue-node',
    width: 100,
    height: 100,
    component: CustomNode,
  })

  export default Vue.extend({
    name: 'App',
    mounted() {
      const graph = new Graph({
        container: document.getElementById('app'),
        width: 1000,
        height: 1000,
      })

      graph.addNode({
        shape: 'custom-vue-node',
        x: 100,
        y: 100,
      })
    },
  })
</script>
```

The node component is written in the same way as above.

:::warning{title=Note}
In Vue2, there are some limitations on the content of node components, such as the inability to use Vuex, i18n, element-ui, etc.
:::
