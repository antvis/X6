import { Primer, Style, Anchor, Point, FontStyle } from '@antv/x6'
import { EditorGraph, GraphView } from './graph'
import { Commands } from './graph/commands'
import avatarMale from './images/male.png'
import avatarFemale from './images/female.png'
import './editor.less'

export class Editor extends Primer {
  graph: EditorGraph
  commands: Commands

  constructor(container: HTMLElement) {
    super()

    this.graph = new EditorGraph(container, {
      guide: {
        enabled: true,
        dashed: true,
      },
      grid: {
        enabled: true,
      },
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
      preferPageSize: true,
      rubberband: true,
      createView() {
        return new GraphView(this)
      },
      getAnchors(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            new Anchor({ point: new Point(0, 0) }),
            new Anchor({ point: new Point(0.5, 0) }),
            new Anchor({ point: new Point(1, 0) }),

            new Anchor({ point: new Point(0, 0.5) }),
            new Anchor({ point: new Point(1, 0.5) }),

            new Anchor({ point: new Point(0, 1) }),
            new Anchor({ point: new Point(0.5, 1) }),
            new Anchor({ point: new Point(1, 1) }),
          ]
        }
        return null
      },
    })

    this.commands = new Commands(this.graph)
    this.graph.initMouseWheel()
    this.start()
  }

  renderHelloWorld() {
    const graph = this.graph
    graph.batchUpdate(() => {
      const size = { width: 80, height: 30 }
      const n1 = graph.addNode({ ...size, data: 'Hello', x: 240, y: 60 })
      const n2 = graph.addNode({ ...size, data: 'World', x: 400, y: 200 })
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
        noLabel: true,
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
        data: '组织关系图',
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
        data: this.renderORGHTML('ceo', avatarMale, 'CEO', 'Bart Simpson'),
      })

      const vp1 = graph.addNode({
        ...size,
        style,
        parent,
        x: 40,
        y: 220,
        data: this.renderORGHTML('vp', avatarMale, 'Marketing', 'Homer Simpson'),
      })

      const vp2 = graph.addNode({
        ...size,
        style,
        parent,
        x: 260,
        y: 220,
        data: this.renderORGHTML('vp', avatarFemale, 'Sales', 'Marge Simpson'),
      })

      const vp3 = graph.addNode({
        ...size,
        style,
        parent,
        x: 480,
        y: 220,
        data: this.renderORGHTML(
          'vp',
          avatarFemale,
          'Production',
          'Lisa Simpson'
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
        data: this.renderORGHTML(
          'manager',
          avatarMale,
          'Manager',
          'Lenny Leonard'
        ),
      })

      const m2 = graph.addNode({
        ...size,
        style,
        parent,
        x: 145,
        y: 480,
        data: this.renderORGHTML(
          'manager',
          avatarMale,
          'Manager',
          'Carl Carlson'
        ),
      })

      const m3 = graph.addNode({
        ...size,
        style,
        parent,
        x: 365,
        y: 360,
        data: this.renderORGHTML(
          'manager',
          avatarFemale,
          'Manager',
          'Maggie Simpson'
        ),
      })

      graph.addEdge({
        parent,
        source: vp1,
        target: m1,
        style: {
          ...edgeStyle,
          edge: 'orth',
          exitX: 0.5,
          exitY: 1,
          entryX: 0,
          entryY: 0.5,
        },
      })
      graph.addEdge({
        parent,
        source: vp1,
        target: m2,
        style: {
          ...edgeStyle,
          edge: 'orth',
          exitX: 0.5,
          exitY: 1,
          entryX: 0,
          entryY: 0.5,
        },
      })
      graph.addEdge({
        parent,
        source: vp2,
        target: m3,
        style: {
          ...edgeStyle,
          edge: 'orth',
          exitX: 0.5,
          exitY: 1,
          entryX: 0,
          entryY: 0.5,
        },
      })
    })
  }

  start() {
    this.renderHelloWorld()
    this.renderORG()
    this.graph.resetScrollbars()
    this.trigger('resetGraphView')
  }
}
