import { Graph, Basecoat, Style, FontStyle, Image } from '@antv/x6'
import { Commands } from './graph/commands'
import avatarMale from './images/male.png'
import avatarFemale from './images/female.png'
import './editor.less'

export class Editor extends Basecoat {
  graph: Graph
  commands: Commands

  constructor(container: HTMLElement) {
    super()

    this.graph = new Graph(container, {
      guide: {
        enabled: true,
        dashed: true,
      },
      grid: {
        enabled: true,
      },
      infinite: true,
      pageVisible: true,
      pageBreak: {
        enabled: true,
        dsahed: true,
        stroke: '#c0c0c0',
      },
      pageFormat: {
        width: 800,
        height: 960,
      },
      connection: {
        enabled: true,
      },
      rotate: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
        global: true,
        escape: true,
      },
      mouseWheel: true,
      preferPageSize: false,
      rubberband: true,
      anchor: {
        image: Image.fromSvg(
          '<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5"><path fill="#1890FF" fill-rule="nonzero" d="M5 .577L4.423 0 2.5 1.923.577 0 0 .577 1.923 2.5 0 4.423.577 5 2.5 3.077 4.423 5 5 4.423 3.077 2.5z"/></svg>',
        ),
        inductiveSize: 0,
      },
      getAnchors(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            [0, 0],
            [0.5, 0],
            [1, 0],

            [0, 0.5],
            [1, 0.5],

            [0, 1],
            [0.5, 1],
            [1, 1],
          ]
        }
        return null
      },
    })

    this.commands = new Commands(this.graph)
    this.start()
  }

  renderHelloWorld() {
    const graph = this.graph
    graph.batchUpdate(() => {
      const size = { width: 80, height: 30 }
      const n1 = graph.addNode({ ...size, label: 'Hello', x: 240, y: 60 })
      const n2 = graph.addNode({ ...size, label: 'World', x: 400, y: 200 })
      graph.addEdge({ source: n1, target: n2 })
    })
  }

  renderORGHTML(type: string, avatar: string, title: string, name: string) {
    return `
      <div class="x6-editor-demo-org ${type}">
        <div class="avatar" style="background-image:url(${avatar})"></div>
        <div class="info">
          <div class="title">${title}<i/></div>
          <div class="name">${name}</div>
        </div>
      </div>
    `
  }

  renderORG() {
    const graph = this.graph
    graph.batchUpdate(() => {
      const size = { width: 180, height: 70 }
      const style: Style = {
        shape: 'html',
        label: false,
        stroke: 'rgba(0,0,0,0)',
        strokeWidth: 0,
        strokeOpacity: 0,
        editable: false,
        rotatable: false,
        resizable: false,
        connectable: false,
      }

      const edgeStyle: Style = {
        edge: 'elbow',
        elbow: 'vertical',
        stroke: '#000',
        endArrow: '',
        strokeWidth: 2,
      }

      const parent = graph.addNode({
        label: '组织关系图',
        x: 50,
        y: 300,
        width: 700,
        height: 600,
        alternateBounds: { x: 0, y: 0, width: 88, height: 20 },
        style: {
          editable: false,
          rotatable: false,
          resizable: false,
          connectable: false,
          align: 'left',
          verticalAlign: 'top',
          spacingLeft: 16,
          strokeWidth: 2,
          stroke: '#7a4ff9',
          fontStyle: FontStyle.bold,
          fontColor: '#7a4ff9',
        },
      })

      const ceo = graph.addNode({
        ...size,
        style,
        parent,
        x: 260,
        y: 40,
        html: this.renderORGHTML('ceo', avatarMale, 'CEO', 'Bart Simpson'),
      })

      const vp1 = graph.addNode({
        ...size,
        style,
        parent,
        x: 40,
        y: 220,
        html: this.renderORGHTML(
          'vp',
          avatarMale,
          'Marketing',
          'Homer Simpson',
        ),
      })

      const vp2 = graph.addNode({
        ...size,
        style,
        parent,
        x: 260,
        y: 220,
        html: this.renderORGHTML('vp', avatarFemale, 'Sales', 'Marge Simpson'),
      })

      const vp3 = graph.addNode({
        ...size,
        style,
        parent,
        x: 480,
        y: 220,
        html: this.renderORGHTML(
          'vp',
          avatarFemale,
          'Production',
          'Lisa Simpson',
        ),
      })

      graph.addEdge({
        parent,
        source: ceo,
        target: vp1,
        style: { ...edgeStyle },
      })
      graph.addEdge({
        parent,
        source: ceo,
        target: vp2,
        style: { ...edgeStyle },
      })
      graph.addEdge({
        parent,
        source: ceo,
        target: vp3,
        style: { ...edgeStyle },
      })

      const m1 = graph.addNode({
        ...size,
        style,
        parent,
        x: 145,
        y: 360,
        html: this.renderORGHTML(
          'manager',
          avatarMale,
          'Manager',
          'Lenny Leonard',
        ),
      })

      const m2 = graph.addNode({
        ...size,
        style,
        parent,
        x: 145,
        y: 480,
        html: this.renderORGHTML(
          'manager',
          avatarMale,
          'Manager',
          'Carl Carlson',
        ),
      })

      const m3 = graph.addNode({
        ...size,
        style,
        parent,
        x: 365,
        y: 360,
        html: this.renderORGHTML(
          'manager',
          avatarFemale,
          'Manager',
          'Maggie Simpson',
        ),
      })

      graph.addEdge({
        parent,
        source: vp1,
        target: m1,
        style: {
          ...edgeStyle,
          edge: 'orth',
          sourceAnchorX: 0.5,
          sourceAnchorY: 1,
          targetAnchorX: 0,
          targetAnchorY: 0.5,
        },
      })
      graph.addEdge({
        parent,
        source: vp1,
        target: m2,
        style: {
          ...edgeStyle,
          edge: 'orth',
          sourceAnchorX: 0.5,
          sourceAnchorY: 1,
          targetAnchorX: 0,
          targetAnchorY: 0.5,
        },
      })
      graph.addEdge({
        parent,
        source: vp2,
        target: m3,
        style: {
          ...edgeStyle,
          edge: 'orth',
          sourceAnchorX: 0.5,
          sourceAnchorY: 1,
          targetAnchorX: 0,
          targetAnchorY: 0.5,
        },
      })
    })
  }

  start() {
    this.renderHelloWorld()
    this.renderORG()
  }
}
