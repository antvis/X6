import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  shape: 'path',
  x: 40,
  y: 40,
  width: 100,
  height: 80,
  label: 'path',
  // 使用 path 属性指定路径的 pathData，相当于指定路径的 refD 属性
  // https://x6.antv.antgroup.com/api/registry/attr#refdresetoffset
  path: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'path',
  x: 200,
  y: 40,
  width: 100,
  height: 80,
  label: 'path',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      // 指定 refD 属性，pathData 随图形大小自动缩放
      // https://x6.antv.antgroup.com/api/registry/attr#refdresetoffset
      refD: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
    },
  },
})

graph.addNode({
  shape: 'path',
  x: 360,
  y: 70,
  width: 100,
  height: 80,
  label: 'path',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      // 指定 d 属性，pathData 不随图形的大小缩放
      d: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
    },
  },
})

graph.addNode({
  shape: 'path',
  x: 50,
  y: 180,
  width: 80,
  height: 80,
  // https://www.svgrepo.com/svg/13653/like
  path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
  attrs: {
    body: {
      fill: '#D75A4A',
      stroke: 'none',
    },
  },
})

graph.addNode({
  shape: 'path',
  x: 210,
  y: 180,
  width: 80,
  height: 80,
  // https://www.svgrepo.com/svg/13695/star
  path: 'M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z',
  attrs: {
    body: {
      fill: '#ED8A19',
      stroke: 'none',
    },
  },
})

graph.addNode({
  shape: 'path',
  x: 370,
  y: 180,
  width: 80,
  height: 80,
  // https://www.svgrepo.com/svg/13692/music-player
  path: 'M52.104,0.249c-0.216-0.189-0.501-0.275-0.789-0.241l-31,4.011c-0.499,0.065-0.872,0.489-0.872,0.992v6.017v4.212v26.035C17.706,39.285,14.997,38,11.944,38c-5.247,0-9.5,3.781-9.5,8.444s4.253,8.444,9.5,8.444s9.5-3.781,9.5-8.444c0-0.332-0.027-0.658-0.069-0.981c0.04-0.108,0.069-0.221,0.069-0.343V16.118l29-3.753v18.909C48.706,29.285,45.997,28,42.944,28c-5.247,0-9.5,3.781-9.5,8.444s4.253,8.444,9.5,8.444s9.5-3.781,9.5-8.444c0-0.092-0.012-0.181-0.015-0.272c0.002-0.027,0.015-0.05,0.015-0.077V11.227V7.016V1C52.444,0.712,52.32,0.438,52.104,0.249z',
  attrs: {
    body: {
      fill: '#eb2f96',
      stroke: 'none',
    },
  },
})
