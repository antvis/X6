import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
})

graph.addNode({
  shape: 'rect',
  x: 80,
  y: 210,
  width: 120,
  height: 50,
  attrs: {
    body: {
      stroke: '#9254de',
      fill: '#efdbff',
    },
    text: {
      textWrap: {
        text: '使用 textWrap 实现文本换行',
        width: -10, // 宽度减少 10px
      }
    }
  }
})

graph.addNode({
  shape: 'html',
  x: 250,
  y: 200,
  width: 160,
  height: 60,
  html: () => {
    const wrap = document.createElement('div')
    wrap.style.width = '100%'
    wrap.style.height = '100%'
    wrap.style.border = '2px solid #9254de'
    wrap.style.background = '#efdbff'
    wrap.style.display = 'flex'
    wrap.style.justifyContent = 'center'
    wrap.style.alignItems = 'center'
    wrap.style.wordBreak = 'break-word'
    wrap.style.padding = '8px'
    wrap.innerText = '使用 HTML 节点实现文本换行'

    return wrap
  },
})

graph.addNode({
  shape: 'rect',
  x: 550,
  y: 230,
  attrs: {
    body: {
      ref: 'text',
      refWidth: 16,
      refHeight: 16,
      refX: -8,
      refY: -8,
      stroke: '#9254de',
      fill: '#efdbff',
    }
  },
  label: '根据文本的大小确定节点的宽高'
})