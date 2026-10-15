---
title: "控制动画播放"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/animation/usage/control/"
version: "3.x"
---

# 控制动画播放

[运行示例](https://x6.antv.antgroup.com/zh/examples/animation/usage/control/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const cancelNode = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 60,
  label: '点击取消动画',
  attrs: {
    body: {
      fill: '#9254de',
      stroke: 'none',
      rx: 10,
    },
    text: {
      fill: '#fff',
    },
  },
  animation: [
    [
      { 'position/x': 50 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})

const rateNode = graph.addNode({
  x: 200,
  y: 40,
  width: 100,
  height: 60,
  label: '点击2倍速动画',
  attrs: {
    body: {
      fill: '#DB655C',
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      {
        'attrs/body/opacity': [1, 0.7],
      },
      {
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
  ],
})

const pauseNode = graph.addNode({
  x: 360,
  y: 40,
  width: 100,
  height: 60,
  label: '点击暂停动画',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      {
        'attrs/text/fontSize': [10, 16],
      },
      {
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
  ],
})

graph.on('node:click', ({ cell }) => {
  if (cell === cancelNode) {
    const [ani] = cell.getAnimations()
    ani.cancel()
  }

  if (cell === rateNode) {
    const [ani] = cell.getAnimations()
    ani.updatePlaybackRate(2)
  }

  if (cell === pauseNode) {
    const label = cell.getPropByPath('attrs/text/text')
    const [ani] = cell.getAnimations()
    if (label === '点击暂停动画') {
      ani.pause()
      cell.setPropByPath('attrs/text/text', '点击继续动画')
    } else {
      ani.play()
      cell.setPropByPath('attrs/text/text', '点击暂停动画')
    }
  }
})
```
