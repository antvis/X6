import { Graph, Shape } from '@antv/x6'
import insertCss from 'insert-css'

Graph.registerConnector(
  'loop-curve',
  (start, end) => {
    const sx = start.x
    const sy = start.y
    const ex = end.x
    const ey = end.y

    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2
    const dir = sy < ey ? 1 : -1
    const offset = 30

    const path = [
      `M ${sx} ${sy}`,
      `C ${sx + 0} ${sy - 0 * dir}, ${mx - 50} ${my + 15 * dir}, ${mx - 20} ${my}`,
      `C ${mx + 0} ${my - 6 * dir}, ${mx} ${my - offset * dir}, ${mx - 20} ${my - offset * dir + 10 * dir}`,
      `C ${mx - 25} ${my - offset * dir + 15 * dir}, ${mx - 30} ${my - 10 * dir}, ${mx} ${my}`,
      `C ${mx + 60} ${my + 20 * dir}, ${ex - 0} ${ey + 0 * dir}, ${ex} ${ey}`,
    ].join(' ')

    return path
  },
  true,
)

Graph.registerEdge(
  'plane-edge',
  {
    markup: [
      {
        tagName: 'svg',
        selector: 'plane',
        attrs: {
          viewBox: '0 0 1024 1024',
          width: 32,
          height: 32,
          y: -16,
          opacity: 0,
        },
        children: [
          {
            tagName: 'path',
            attrs: {
              d: 'M488.5 391.1l-90.5-69.9a9.6 9.6 0 0 1 5.9-17.1h94.3a9.6 9.6 0 0 1 5.9 2l110.2 85.1H488.5z',
              fill: '#fff',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M488.7 294.4H374.6a19.2 19.2 0 0 0-15.2 7.5c-6.5 8.4-4.9 20.4 3.5 26.9l93 71.9h176.9l-114.4-85a19.2 19.2 0 0 0-11.7-4z m-26.2 87.1L374.6 313.6h114.1l87.8 67.9H462.4z',
              fill: '#30699A',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M143.5 344.4l-26.9 10a28.8 28.8 0 0 0-18.8 27v78.5a57.6 57.6 0 0 0 22.6 45.7l150.3 115.2a57.6 57.6 0 0 0 35 11.9h557c31.8 0 57.6-25.8 57.6-57.6a57.6 57.6 0 0 0-21.6-45l-163.4-130.6l-.5-.4a57.6 57.6 0 0 0-35.4-12.2l-480.6 0-47-38a28.8 28.8 0 0 0-28.1-4.6z m6.7 18a9.6 9.6 0 0 1 9.1 1.3l.3.2l52.3 42.2h487.4a38.4 38.4 0 0 1 23.5 8l.4.4l163.4 130.6a38.4 38.4 0 0 1 14.4 30c0 21-16.8 38.1-37.8 38.4l-.6 0H305.7a38.4 38.4 0 0 1-22.9-7.6l-.5-.3L132.1 460.5a38.4 38.4 0 0 1-14.6-29.7v-79a9.6 9.6 0 0 1 6-8.9l.3-.1l26.9-10z',
              fill: '#30699A',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M150.2 362.4a9.6 9.6 0 0 1 9.4 1.5l52.3 42.2h487.4a38.4 38.4 0 0 1 24 8.4l163.4 130.6a38.4 38.4 0 0 1 14.4 30c0 21.2-17.2 38.4-38.4 38.4H309L151.7 489.7a38.4 38.4 0 0 1-14.6-29.6v-.5v-87.2c0-2.1.7-4.1 1.9-5.8z',
              fill: '#3982D1',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M560.6 584.6L426.5 702.1c-4.5 4-4.7 10.6-.4 14.7 2.1 2.1 5.1 3.2 8.2 3.2h68.4c2.9 0 5.7-1 7.9-2.9h10l141.4-132.6',
              fill: '#fff',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M528 577.4L394.7 694.8c-8.7 7.7-9 20.8-.7 28.9 3.8 3.7 9 5.8 14.4 5.9h107.7c5.1 0 10-1.8 13.8-5l.4-.3l150.5-132.6l-12.7-14.4-150.5 132.6c-.3.3-.8.4-1.3.5h-107.7c-.6 0-1.2-.2-1.5-.5-.2-.2-.3-.3 0-.5l.1-.1l133.4-117.5l-12.7-14.4z',
              fill: '#30699A',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M805.4 492.7v19.2H700.2v-19.2z',
              fill: '#fff',
            },
          },
          {
            tagName: 'path',
            attrs: {
              d: 'M431.5 497.5a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm56.8 0a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm57.4 0a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm57.4 0a8 8 0 1 1 0 16 8 8 0 0 1 0-16z',
              fill: '#FFF',
            },
          },
        ],
      },
      // @ts-expect-error
      ...Shape.Edge.getMarkup(),
    ],
    attrs: {
      line: {
        strokeDasharray: 4,
        stroke: '#B8A58A',
      },
      plane: {
        atConnectionRatio: 0,
      },
    },
  },
  true,
)

Shape.HTML.register({
  shape: 'destination-node',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const {
      img,
      tag,
      tagPosition = 'top-left',
      des,
      star,
    } = cell.getData() ?? {}
    const div = document.createElement('div')
    div.className = 'routePlanning'

    div.innerHTML = `
      <div class="destination-node">
        <div class="node-image-wrapper">
          <div class="node-image-shadow"></div>
          <img class="node-image" src='${img}' />
        </div>
        <div class="node-label-wrapper">
          <div class="node-label">${des}</div>
          <div class="node-label-shadow"></div>
          <div class="node-label-tag node-label-tag-${tagPosition}">${tag}</div>
          <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" class="node-label-star" style="display: ${star ? 'block' : 'none'}" transform="rotate(0 0 0)">
            <polygon
              points="15,5 18.54,13.62 27,14.46 21,21.8 22.38,30 15,25.2 7.62,30 9,21.8 3,14.46 11.46,13.62"
              fill="gold"
              stroke="orange"
              stroke-width="1"
            />
          </svg>
        </div>
      </div>
    `
    return div
  },
})

let currentPlaneIdx = 0

const graph = new Graph({
  container: document.getElementById('container'),
  grid: {
    visible: true,
    type: 'doubleMesh',
    size: 25,
    args: {
      color: '#EEAD8A',
    },
  },
  background: {
    color: '#FAEFB3',
  },
})

const stops = [
  {
    img: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*8HpYRKt7uzwAAAAAVmAAAAgAemJ7AQ/fmt.webp',
    y: 225,
    des: '法国 - 巴黎铁塔',
  },
  {
    img: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZFxTS428nZkAAAAAaLAAAAgAemJ7AQ/fmt.webp',
    y: 150,
    des: '美国 - 自由女神像',
    tagPosition: 'bottom-left',
  },
  {
    img: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*tfejTKFkjUUAAAAAW0AAAAgAemJ7AQ/fmt.webp',
    y: 225,
    des: '罗马 - 古罗马斗兽场',
    tagPosition: 'top-right',
  },
  {
    img: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*OM9JTbpmU-cAAAAAZbAAAAgAemJ7AQ/fmt.webp',
    y: 175,
    des: '英国 - 伦敦塔桥',
    star: true,
  },
]

stops.forEach((stop, index) => {
  graph.addNode({
    id: `stop${index + 1}`,
    shape: 'destination-node',
    x: 160 + index * 310,
    y: stop.y,
    data: { ...stop, tag: `${index + 1} stop` },
  })

  if (index + 1 === stops.length) return

  graph.addEdge({
    source: { cell: `stop${index + 1}` },
    target: { cell: `stop${index + 2}` },
    connector: { name: 'loop-curve' },
    shape: 'plane-edge',
    animation: [
      [
        { 'attrs/line/strokeDashoffset': [0, -16] },
        {
          duration: 1000,
          iterations: Infinity,
        },
      ],
    ],
  })
})

const fly = () => {
  const edges = graph.getEdges()
  const edge = edges[currentPlaneIdx]
  edge.setAttrByPath('plane/opacity', 1)
  const flyAni = edge.getAnimations().find((item) => item.id === 'fly')
  if (flyAni) {
    flyAni.play()
    return
  }

  const ani = edge.animate(
    { 'attrs/plane/atConnectionRatio': 1 },
    { duration: 2000, id: 'fly' },
  )

  ani.onfinish = () => {
    edge.setAttrByPath('plane/opacity', 0)
    currentPlaneIdx =
      currentPlaneIdx + 1 === edges.length ? 0 : currentPlaneIdx + 1
    fly()
  }
}

fly()

graph.centerContent()
graph.zoomToFit()

insertCss(`
  .destination-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family:
      "Hiragino Maru Gothic Pro",
      /* 圆体最可爱，优先日文/繁体环境 */
      "PingFang SC",
      /* 苹方，简体中文首选，清新现代 */
      "Hiragino Sans GB",
      /* 冬青黑体简体，柔和清晰 */
      "Helvetica Neue",
      "Arial",
      sans-serif;
  }

  .node-image-wrapper {
    position: relative;
    width: 110px;
    height: 110px;
    background: #fff;
    border-radius: 50%;
  }

  .node-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;

  }

  .node-image-shadow {
    position: absolute;
    top: 0;
    left: 4px;
    width: 100%;
    height: 100%;
    background: #EBB27D;
    z-index: -1;
    border-radius: 50%;
  }


  .node-label-wrapper {
    margin-top: 20px;
    background-color: #FEFCF2;
    min-height: 120px;
    border-radius: 4px;
    width: 150px;
    position: relative;
    color: #838181;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
  }

  .node-label-wrapper:hover {
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.3);
  }

  .node-label-shadow {
    position: absolute;
    top: 0;
    left: 3px;
    width: 100%;
    height: 100%;
    background: #F7D0AE;
    z-index: -1;
    border-radius: 4px;
    transform: rotate(-2deg);
  }

  .node-label {
    padding: 8px;
    z-index: 2;
  }

  .node-label-tag {
    background: #EEAD8A;
    color: #fff;
    border-radius: 4px;
    position: absolute;
    line-height: 22px;
    width: 60px;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
  }

  @keyframes shake {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(20deg);
    }
  }

  .node-label-star {
    position: absolute;
    right: 8px;
    bottom: 8px;
    animation: shake 0.5s ease infinite;
    animation-direction: alternate;
  }


  .node-label-tag-top-left {
    left: 0;
    top: 0;
    transform: translateX(-50%) translateY(-50%) rotate(-20deg);
  }

  .node-label-tag-bottom-left {
    left: 0;
    bottom: 0;
    transform: translateX(-50%) translateY(50%) rotate(20deg);
  }


  .node-label-tag-top-right {
    right: 0;
    top: 0;
    transform: translateX(50%) translateY(-50%) rotate(20deg);
  }



  .node-label-tag-bottom-right {
    right: 0;
    bottom: 0;
    transform: translateX(50%) translateY(50%) rotate(-20deg);
  }
`)
