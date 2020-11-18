import { Graph, Point, Interp, Timing } from '@antv/x6'

const container = document.getElementById('container')!
const graph = new Graph({
  container: container,
  grid: 1,
})

const ball = graph.addNode({
  shape: 'circle',
  x: -25,
  y: 50,
  width: 50,
  height: 50,
  attrs: {
    label: {
      text: 'ball',
      fontSize: 20,
    },
    body: {
      fill: '#FFFFFF',
    },
  },
})

ball.transition('angle', 360, {
  delay: 1000,
  duration: 1000,
})

ball.transition('position/x', 550, {
  delay: 1000,
  duration: 1000,
  timing: Timing.decorators.reverse(Timing.quad),
})

ball.transition('position/y', 350, {
  delay: 1000,
  duration: 1000,
  timing: Timing.decorators.reverse(Timing.bounce),
})

ball.transition('attrs/body/fill', '#FFFF00', {
  delay: 3000,
  duration: 500,
  interp: Interp.color,
})

ball.transition(
  'attrs/label',
  { text: 'yellow ball', fontSize: 8 },
  {
    delay: 5000,
    duration: 2000,
    easing: 'easeInBounce',
    interp: (
      start: { text: String; fontSize: number },
      end: { text: String; fontSize: number },
    ) => {
      return function (time: number) {
        return {
          text: end.text.substr(0, Math.ceil(end.text.length * time)),
          fontSize: start.fontSize + (end.fontSize - start.fontSize) * time,
        }
      }
    },
  },
)

const ufo = graph.addNode({
  shape: 'ellipse',
  x: 400,
  y: 50,
  width: 35,
  height: 20,
  attrs: {
    label: {
      text: 'u.f.o.',
      fontSize: 10,
    },
    body: {
      fill: '#FFFFFF',
    },
  },
})

function fly(cell: Cell) {
  cell.transition('position', 20, {
    delay: 0,
    duration: 5000,
    interp: function (a: Point.PointLike, b: number) {
      return function (t: number) {
        return {
          x: a.x + 10 * b * (Math.cos(t * 2 * Math.PI) - 1),
          y: a.y - b * Math.sin(t * 2 * Math.PI),
        }
      }
    },
  })
}

fly(ufo)

ufo.on('transition:end', ({ cell }) => fly(cell))
