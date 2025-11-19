import { Graph } from '@antv/x6'
import insertCss from 'insert-css'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: 'none',
      rx: 10,
      style: {
        // 也可以使用CSS动画，具体如何选择可参考文档中的详细说明
        animation: 'trans 1s infinite linear',
      },
    },
  },
})

graph.addNode({
  x: 200,
  y: 40,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#85C054',
      stroke: 'none',
      rx: 10,
      // 也可以通过添加class来添加动画
      class: 'css-animation-node',
    },
  },
})

// 我们用 insert-css 协助demo演示
// 实际项目中只要将下面样式添加到样式文件中
insertCss(`
  @keyframes trans {
    to {
        transform: translateX(50px);
    }
  }

  .css-animation-node {
    animation: trans 1s infinite linear;
  }
`)
