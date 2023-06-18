---
title: Vue 节点
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中,你可以了解到}

- 如何使用 Vue 组件来渲染节点内容
- 如何更新节点内容

:::

## 渲染节点

我们提供了一个独立的包 `@antv/x6-vue-shape` 来使用 Vue 组件渲染节点。

:::warning{title=注意}
需要注意的是，x6 的版本要和 x6-vue-shape 的版本匹配，也就是两个包需要用同一个大版本。
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

节点组件内容如下：

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

最终效果如下：

<iframe src="/demos/vue/basic/index.html" style="width: 100%; height: 260px; border: 0px; overflow: hidden;"></iframe>

## 更新节点

`Vue` 节点中更新节点内容，可以使用两种方式：

- 在组件内部监听节点事件，在外部触发事件。
- 使用 `Vuex` 等状态管理器（这里不展开讲，和普通的 `Vue` 组件一样使用 `Vuex` 数据）。

下面介绍使用事件的方式来动态更新节点内容：

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

在节点组件内部，我们可以监听节点 `data` 改变事件：

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

## Vue2 中使用

上面我们使用到了 `teleport`，它是 `Vue3` 中的特性，如果在 `Vue2` 中，如何使用呢？

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

节点组件写法和上面的一致。

:::warning{title=注意}
在 Vue2 中，节点组件内容有一些限制，比如无法使用 Vuex、i18n、element-ui 等。
:::
