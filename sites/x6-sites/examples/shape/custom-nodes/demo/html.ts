import { Graph } from '@antv/x6'
import insertCss from 'insert-css'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
  background: {
    color: 'rgba(0,0,0,.5)',
  },
})

graph.addNode({
  x: 280,
  y: 140,
  width: 120,
  height: 45,
  shape: 'html',
  html() {
    const wrap = document.createElement('div')
    wrap.innerHTML = `
      <a href="#" class="my-btn">
        Submit
      </a>`
    return wrap
  },
})

// 我们用 insert-css 协助demo演示
// 实际项目中只要将下面样式添加到样式文件中
insertCss(`
.my-btn{
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.my-btn:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
              0 0 25px #03e9f4,
              0 0 50px #03e9f4,
              0 0 100px #03e9f4;
}
`)
