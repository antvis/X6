import { Graph, Shape } from '@antv/x6'

class FlexImage extends Shape.Image {
  private url: string

  init() {
    super.init()
    this.updateSize()
  }

  setup() {
    super.setup()
    this.on('change:attrs', this.updateSize, this)
  }

  updateSize() {
    const url = this.attr<string>('image/xlink:href')
    if (url != this.url) {
      this.url = url
      const img = new Image()
      img.onload = () => {
        const width = img.naturalWidth || img.width
        const height = img.naturalHeight || img.height
        this.prop({ size: { width, height } })
        this.attr('image/opacity', 1)
      }
      img.src = url
    }
  }
}

Graph.registerNode('flex-image', FlexImage, true)

const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
})

const urls = [
  'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
  'https://gw.alipayobjects.com/zos/basement_prod/42d17359-8607-4227-af93-7509eabb3163.svg',
  'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*xougSaGIAXoAAAAAAAAAAAAAARQnAQ',
]

let index = 0
const iamge = graph.addNode({
  shape: 'flex-image',
  x: 40,
  y: 40,
})

function update() {
  index += 1
  if (index >= urls.length) {
    index = 0
  }

  iamge.attr({
    image: {
      opacity: 0, // 设置为透明避免闪动，图片加载完成后设置为 1
      'xlink:href': urls[index],
    },
  })

  setTimeout(() => {
    update()
  }, 1000)
}

update()
