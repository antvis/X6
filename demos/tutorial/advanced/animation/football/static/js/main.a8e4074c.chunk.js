(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.animation.football"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.animation.football"]||[]).push([[0],{72:function(p,c,i){p.exports=i(90)},78:function(p,c,i){},82:function(p,c,i){},83:function(p,c,i){"use strict";i.r(c),i.d(c,"host",function(){return x}),i.d(c,"getCodeSandboxParams",function(){return e}),i.d(c,"getStackblitzPrefillConfig",function(){return S});const x="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/animation/football";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,isBinary:!1},"public/index.html":{content:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,isBinary:!1},"src/app.css":{content:`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-content {
  flex: 1;
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  background: linear-gradient(to bottom, #00bfff, #ffffff);
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import './reg'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addNode({
      shape: 'ball',
      x: 400,
      y: 270,
      width: 50,
      height: 50,
      bounciness: 1.5,
      attrs: {
        image: {
          'xlink:href':
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iLTEwNSAtMTA1IDIxMCAyMTAiPgogICA8ZGVmcz4KICAgICAgPGNsaXBQYXRoIGlkPSJiYWxsIj4KICAgICAgICAgPGNpcmNsZSByPSIxMDAiIHN0cm9rZS13aWR0aD0iMCIvPgogICAgICA8L2NsaXBQYXRoPgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzEiIGN4PSIuNCIgY3k9Ii4zIiByPSIuOCI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuNCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjgiIHN0b3AtY29sb3I9IiNFRUVFRUUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzIiIGN4PSIuNSIgY3k9Ii41IiByPSIuNSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjk5IiBzdG9wLWNvbG9yPSJibGFjayIgc3RvcC1vcGFjaXR5PSIuMyIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8ZyBpZD0iYmxhY2tfc3R1ZmYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsaXAtcGF0aD0idXJsKCNiYWxsKSI+CiAgICAgICAgIDxnIGZpbGw9ImJsYWNrIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIDI2LC0yOCA0NiwtMTkgUSA1NywtMzUgNjQsLTQ3IFEgNTAsLTY4IDM3LC03NiBRIDE3LC03NSAxLC02OCBRIDQsLTUxIDYsLTMyIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gLTI2LC0yIFEgLTQ1LC04IC02MiwtMTEgUSAtNzQsNSAtNzYsMjIgUSAtNjksNDAgLTUwLDU0IFEgLTMyLDQ3IC0xNywzOSBRIC0yMywxNSAtMjYsLTIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTUsMjIgUSAtMTAyLDEyIC0xMDIsLTggViA4MCBIIC04NSBRIC05NSw0NSAtOTUsMjIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSA1NSwyNCBRIDQxLDQxIDI0LDUyIFEgMjgsNjUgMzEsNzkgUSA1NSw3OCA2OCw2NyBRIDc4LDUwIDgwLDM1IFEgNjUsMjggNTUsMjQiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwLDEyMCBMIC0zLDk1IFEgLTI1LDkzIC00Miw4MiBRIC01MCw4NCAtNjAsODEiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTAsLTQ4IFEgLTgwLC01MiAtNjgsLTQ5IFEgLTUyLC03MSAtMzUsLTc3IFEgLTM1LC0xMDAgLTQwLC0xMDAgSCAtMTAwIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAwLC01NSBMIDg3LC0zNyBRIDk4LC0xMCA5Nyw1IEwgMTAwLDYiLz4KICAgICAgICAgPC9nPgogICAgICAgICA8ZyBmaWxsPSJub25lIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIC0xOCwtMTIgLTI2LC0yICAgICAgICAgICAgICAgICAgICAgIE0gNDYsLTE5IFEgNTQsNSA1NSwyNCAgICAgICAgICAgICAgICAgICAgICBNIDY0LC00NyBRIDc3LC00NCA4NywtMzcgICAgICAgICAgICAgICAgICAgICAgTSAzNywtNzYgUSAzOSwtOTAgMzYsLTEwMCAgICAgICAgICAgICAgICAgICAgICBNIDEsLTY4IFEgLTEzLC03NyAtMzUsLTc3ICAgICAgICAgICAgICAgICAgICAgIE0gLTYyLC0xMSBRIC02NywtMjUgLTY4LC00OSAgICAgICAgICAgICAgICAgICAgICBNIC03NiwyMiBRIC04NSwyNCAtOTUsMjIgICAgICAgICAgICAgICAgICAgICAgTSAtNTAsNTQgUSAtNDksNzAgLTQyLDgyICAgICAgICAgICAgICAgICAgICAgIE0gLTE3LDM5IFEgMCw0OCAyNCw1MiAgICAgICAgICAgICAgICAgICAgICBNIDMxLDc5IFEgMjAsOTIgLTMsOTUgICAgICAgICAgICAgICAgICAgICAgTSA2OCw2NyBMIDgwLDgwICAgICAgICAgICAgICAgICAgICAgIE0gODAsMzUgUSA5MCwyNSA5Nyw1ICAgICAgICAgICAgICIvPgogICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgPC9kZWZzPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0ibm9uZSIvPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0idXJsKCNzaGFkb3cxKSIgc3Ryb2tlPSJub25lIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9IiNFRUUiIHN0cm9rZS13aWR0aD0iNyIvPgogICA8dXNlIHhsaW5rOmhyZWY9IiNibGFja19zdHVmZiIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgPHVzZSB4bGluazpocmVmPSIjYmxhY2tfc3R1ZmYiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgPGNpcmNsZSByPSIxMDAiIGZpbGw9InVybCgjc2hhZG93MikiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4=',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,isBinary:!1},"src/index.css":{content:`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/reg.ts":{content:`import { Graph, Node, Edge, NodeView, Point, Angle, Interp } from '@antv/x6'

class BallView extends NodeView {
  protected speed: number = 0
  protected angle: number = 0
  protected stop: (() => void) | null
  protected edge: Edge | null

  protected init() {
    this.stop = this.cell.transition('attrs/label/opacity', 1, {
      delay: (1 + Math.random()) * 3000,
      duration: 3000,
      timing: 'inout',
      interp(a: number, b: number) {
        return function (t: number) {
          return a + b * (1 - Math.abs(1 - 2 * t))
        }
      },
    })

    this.cell.on('transition:complete', ({ cell, path }) => {
      if (path === 'position' && this.speed > 5) {
        this.speed /= cell.prop<number>('bounciness') || 2
        this.fly({ angle: 180 - this.angle, speed: this.speed })
      }
    })

    this.cell.on('change:position', ({ cell, current }) => {
      const node = (cell as any) as Node
      this.angle = Point.create(node.getPosition()).theta(
        node.previous('position'),
      )

      if (current) {
        if (
          current.x < 0 ||
          current.x > this.graph.options.width - node.getSize().width
        ) {
          this.angle -= 180
          node.position(node.previous('position')!.x, current.y, {
            silent: true,
          })

          cell.stopTransition('position')
        }
      }
    })
  }

  fly(opts: { speed?: number; angle?: number } = {}) {
    const options = {
      speed: 100,
      angle: 90,
      ...opts,
    }

    const pos = this.cell.getPosition()
    const size = this.cell.getSize()

    const h0 = this.graph.options.height - pos.y - size.height
    const v0 = options.speed
    const ga = 9.81
    const sin1 = Math.sin(Angle.toRad(options.angle))

    const flightTime =
      (v0 * sin1 +
        Math.sqrt(Math.pow(v0, 2) * Math.pow(sin1, 2) + 2 * h0 * ga)) /
      ga

    this.cell.transition('position', options, {
      duration: 100 * flightTime,
      interp(
        position: Point.PointLike,
        params: { speed: number; angle: number },
      ) {
        return function (t: number) {
          t = flightTime * t // eslint-disable-line
          return {
            x:
              position.x +
              params.speed * t * Math.cos((Math.PI / 180) * params.angle),
            y:
              position.y -
              params.speed * t * Math.sin((Math.PI / 180) * params.angle) +
              (ga / 2) * t * t,
          }
        }
      },
    })

    this.cell.transition('angle', -options.angle, {
      duration: 100 * flightTime,
    })

    this.speed = options.speed
    this.angle = options.angle
  }

  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    // Do not allow drag element while it's still in a transition.
    if (this.cell.getTransitions().indexOf('position') > -1) {
      return
    }

    // Cancel displaying 'drag me!' if dragging already starts.
    if (this.stop) {
      this.stop()
      this.stop = null
    }

    this.edge = this.graph.addEdge({
      shape: 'edge',
      source: this.cell.getBBox().getCenter(),
      target: { x, y },
      zIndex: -1,
      attrs: {
        line: {
          stroke: 'rgba(0,0,0,0.1)',
          strokeWidth: 6,
          targetMarker: {
            stroke: 'black',
            strokeWidth: 2,
            d: 'M 20 -10 L 0 0 L 20 10 z',
          },
        },
      },
    })

    // Change the marker arrow color.
    this.edge.on('change:target', ({ cell }) => {
      const edge = (cell as any) as Edge
      const sourcePoint = edge.getSourcePoint()!
      const targetPoint = edge.getTargetPoint()!
      const dist = sourcePoint.distance(targetPoint)
      const maxDist = Math.max(
        this.graph.options.width,
        this.graph.options.height,
      )
      const interp = Interp.color('#ffffff', '#ff0000')
      edge.attr('line/targetMarker/fill', interp(dist / maxDist / Math.sqrt(2)))
    })
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    if (this.edge) {
      this.edge.setTarget({ x, y })
    }
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    if (!this.edge) {
      return
    }

    const sourcePoint = this.edge.getSourcePoint()!
    const targetPoint = this.edge.getTargetPoint()!

    this.edge.remove()
    this.edge = null

    this.fly({
      angle: Math.abs(targetPoint.theta(sourcePoint) - 180),
      speed: sourcePoint.distance(targetPoint) / 2,
    })
  }
}

Graph.registerView('ball', BallView, true)

Graph.registerNode(
  'ball',
  {
    view: 'ball',
    markup: [
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'image',
        selector: 'ball',
      },
    ],
    attrs: {
      label: {
        text: 'Drag me!',
        fontSize: 40,
        fontWeight: 900,
        refX: 0.5,
        refY: -20,
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        fill: 'white',
        strokeWidth: 2,
        stroke: 'black',
        opacity: 0,
        pointerEvents: 'none',
      },
      ball: {
        refWidth: 1,
        refHeight: 1,
      },
    },
  },
  true,
)
`,isBinary:!1},"tsconfig.json":{content:`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`,isBinary:!1}}}}function S(){return{title:"tutorial/advanced/animation/football",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,"public/index.html":`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,"src/app.css":`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-content {
  flex: 1;
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  background: linear-gradient(to bottom, #00bfff, #ffffff);
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import './reg'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addNode({
      shape: 'ball',
      x: 400,
      y: 270,
      width: 50,
      height: 50,
      bounciness: 1.5,
      attrs: {
        image: {
          'xlink:href':
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iLTEwNSAtMTA1IDIxMCAyMTAiPgogICA8ZGVmcz4KICAgICAgPGNsaXBQYXRoIGlkPSJiYWxsIj4KICAgICAgICAgPGNpcmNsZSByPSIxMDAiIHN0cm9rZS13aWR0aD0iMCIvPgogICAgICA8L2NsaXBQYXRoPgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzEiIGN4PSIuNCIgY3k9Ii4zIiByPSIuOCI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuNCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjgiIHN0b3AtY29sb3I9IiNFRUVFRUUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzIiIGN4PSIuNSIgY3k9Ii41IiByPSIuNSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjk5IiBzdG9wLWNvbG9yPSJibGFjayIgc3RvcC1vcGFjaXR5PSIuMyIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8ZyBpZD0iYmxhY2tfc3R1ZmYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsaXAtcGF0aD0idXJsKCNiYWxsKSI+CiAgICAgICAgIDxnIGZpbGw9ImJsYWNrIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIDI2LC0yOCA0NiwtMTkgUSA1NywtMzUgNjQsLTQ3IFEgNTAsLTY4IDM3LC03NiBRIDE3LC03NSAxLC02OCBRIDQsLTUxIDYsLTMyIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gLTI2LC0yIFEgLTQ1LC04IC02MiwtMTEgUSAtNzQsNSAtNzYsMjIgUSAtNjksNDAgLTUwLDU0IFEgLTMyLDQ3IC0xNywzOSBRIC0yMywxNSAtMjYsLTIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTUsMjIgUSAtMTAyLDEyIC0xMDIsLTggViA4MCBIIC04NSBRIC05NSw0NSAtOTUsMjIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSA1NSwyNCBRIDQxLDQxIDI0LDUyIFEgMjgsNjUgMzEsNzkgUSA1NSw3OCA2OCw2NyBRIDc4LDUwIDgwLDM1IFEgNjUsMjggNTUsMjQiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwLDEyMCBMIC0zLDk1IFEgLTI1LDkzIC00Miw4MiBRIC01MCw4NCAtNjAsODEiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTAsLTQ4IFEgLTgwLC01MiAtNjgsLTQ5IFEgLTUyLC03MSAtMzUsLTc3IFEgLTM1LC0xMDAgLTQwLC0xMDAgSCAtMTAwIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAwLC01NSBMIDg3LC0zNyBRIDk4LC0xMCA5Nyw1IEwgMTAwLDYiLz4KICAgICAgICAgPC9nPgogICAgICAgICA8ZyBmaWxsPSJub25lIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIC0xOCwtMTIgLTI2LC0yICAgICAgICAgICAgICAgICAgICAgIE0gNDYsLTE5IFEgNTQsNSA1NSwyNCAgICAgICAgICAgICAgICAgICAgICBNIDY0LC00NyBRIDc3LC00NCA4NywtMzcgICAgICAgICAgICAgICAgICAgICAgTSAzNywtNzYgUSAzOSwtOTAgMzYsLTEwMCAgICAgICAgICAgICAgICAgICAgICBNIDEsLTY4IFEgLTEzLC03NyAtMzUsLTc3ICAgICAgICAgICAgICAgICAgICAgIE0gLTYyLC0xMSBRIC02NywtMjUgLTY4LC00OSAgICAgICAgICAgICAgICAgICAgICBNIC03NiwyMiBRIC04NSwyNCAtOTUsMjIgICAgICAgICAgICAgICAgICAgICAgTSAtNTAsNTQgUSAtNDksNzAgLTQyLDgyICAgICAgICAgICAgICAgICAgICAgIE0gLTE3LDM5IFEgMCw0OCAyNCw1MiAgICAgICAgICAgICAgICAgICAgICBNIDMxLDc5IFEgMjAsOTIgLTMsOTUgICAgICAgICAgICAgICAgICAgICAgTSA2OCw2NyBMIDgwLDgwICAgICAgICAgICAgICAgICAgICAgIE0gODAsMzUgUSA5MCwyNSA5Nyw1ICAgICAgICAgICAgICIvPgogICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgPC9kZWZzPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0ibm9uZSIvPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0idXJsKCNzaGFkb3cxKSIgc3Ryb2tlPSJub25lIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9IiNFRUUiIHN0cm9rZS13aWR0aD0iNyIvPgogICA8dXNlIHhsaW5rOmhyZWY9IiNibGFja19zdHVmZiIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgPHVzZSB4bGluazpocmVmPSIjYmxhY2tfc3R1ZmYiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgPGNpcmNsZSByPSIxMDAiIGZpbGw9InVybCgjc2hhZG93MikiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4=',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,"src/index.css":`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"src/reg.ts":`import { Graph, Node, Edge, NodeView, Point, Angle, Interp } from '@antv/x6'

class BallView extends NodeView {
  protected speed: number = 0
  protected angle: number = 0
  protected stop: (() => void) | null
  protected edge: Edge | null

  protected init() {
    this.stop = this.cell.transition('attrs/label/opacity', 1, {
      delay: (1 + Math.random()) * 3000,
      duration: 3000,
      timing: 'inout',
      interp(a: number, b: number) {
        return function (t: number) {
          return a + b * (1 - Math.abs(1 - 2 * t))
        }
      },
    })

    this.cell.on('transition:complete', ({ cell, path }) => {
      if (path === 'position' && this.speed > 5) {
        this.speed /= cell.prop<number>('bounciness') || 2
        this.fly({ angle: 180 - this.angle, speed: this.speed })
      }
    })

    this.cell.on('change:position', ({ cell, current }) => {
      const node = (cell as any) as Node
      this.angle = Point.create(node.getPosition()).theta(
        node.previous('position'),
      )

      if (current) {
        if (
          current.x < 0 ||
          current.x > this.graph.options.width - node.getSize().width
        ) {
          this.angle -= 180
          node.position(node.previous('position')!.x, current.y, {
            silent: true,
          })

          cell.stopTransition('position')
        }
      }
    })
  }

  fly(opts: { speed?: number; angle?: number } = {}) {
    const options = {
      speed: 100,
      angle: 90,
      ...opts,
    }

    const pos = this.cell.getPosition()
    const size = this.cell.getSize()

    const h0 = this.graph.options.height - pos.y - size.height
    const v0 = options.speed
    const ga = 9.81
    const sin1 = Math.sin(Angle.toRad(options.angle))

    const flightTime =
      (v0 * sin1 +
        Math.sqrt(Math.pow(v0, 2) * Math.pow(sin1, 2) + 2 * h0 * ga)) /
      ga

    this.cell.transition('position', options, {
      duration: 100 * flightTime,
      interp(
        position: Point.PointLike,
        params: { speed: number; angle: number },
      ) {
        return function (t: number) {
          t = flightTime * t // eslint-disable-line
          return {
            x:
              position.x +
              params.speed * t * Math.cos((Math.PI / 180) * params.angle),
            y:
              position.y -
              params.speed * t * Math.sin((Math.PI / 180) * params.angle) +
              (ga / 2) * t * t,
          }
        }
      },
    })

    this.cell.transition('angle', -options.angle, {
      duration: 100 * flightTime,
    })

    this.speed = options.speed
    this.angle = options.angle
  }

  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    // Do not allow drag element while it's still in a transition.
    if (this.cell.getTransitions().indexOf('position') > -1) {
      return
    }

    // Cancel displaying 'drag me!' if dragging already starts.
    if (this.stop) {
      this.stop()
      this.stop = null
    }

    this.edge = this.graph.addEdge({
      shape: 'edge',
      source: this.cell.getBBox().getCenter(),
      target: { x, y },
      zIndex: -1,
      attrs: {
        line: {
          stroke: 'rgba(0,0,0,0.1)',
          strokeWidth: 6,
          targetMarker: {
            stroke: 'black',
            strokeWidth: 2,
            d: 'M 20 -10 L 0 0 L 20 10 z',
          },
        },
      },
    })

    // Change the marker arrow color.
    this.edge.on('change:target', ({ cell }) => {
      const edge = (cell as any) as Edge
      const sourcePoint = edge.getSourcePoint()!
      const targetPoint = edge.getTargetPoint()!
      const dist = sourcePoint.distance(targetPoint)
      const maxDist = Math.max(
        this.graph.options.width,
        this.graph.options.height,
      )
      const interp = Interp.color('#ffffff', '#ff0000')
      edge.attr('line/targetMarker/fill', interp(dist / maxDist / Math.sqrt(2)))
    })
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    if (this.edge) {
      this.edge.setTarget({ x, y })
    }
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    if (!this.edge) {
      return
    }

    const sourcePoint = this.edge.getSourcePoint()!
    const targetPoint = this.edge.getTargetPoint()!

    this.edge.remove()
    this.edge = null

    this.fly({
      angle: Math.abs(targetPoint.theta(sourcePoint) - 180),
      speed: sourcePoint.distance(targetPoint) / 2,
    })
  }
}

Graph.registerView('ball', BallView, true)

Graph.registerNode(
  'ball',
  {
    view: 'ball',
    markup: [
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'image',
        selector: 'ball',
      },
    ],
    attrs: {
      label: {
        text: 'Drag me!',
        fontSize: 40,
        fontWeight: 900,
        refX: 0.5,
        refY: -20,
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        fill: 'white',
        strokeWidth: 2,
        stroke: 'black',
        opacity: 0,
        pointerEvents: 'none',
      },
      ball: {
        refWidth: 1,
        refHeight: 1,
      },
    },
  },
  true,
)
`,"tsconfig.json":`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`}}}},88:function(p,c,i){},90:function(p,c,i){"use strict";i.r(c);var x=i(0),e=i.n(x),S=i(21),T=i.n(S),N=i(1),f=i(2),M=i(3),b=i(4),C=i(29),P=i(52),z=function(l){Object(M.a)(s,l);var I=Object(b.a)(s);function s(){var a;Object(N.a)(this,s);for(var n=arguments.length,o=new Array(n),t=0;t<n;t++)o[t]=arguments[t];return a=I.call.apply(I,[this].concat(o)),a.speed=0,a.angle=0,a.stop=void 0,a.edge=void 0,a}return Object(f.a)(s,[{key:"init",value:function(){var n=this;this.stop=this.cell.transition("attrs/label/opacity",1,{delay:(1+Math.random())*3e3,duration:3e3,timing:"inout",interp:function(t,g){return function(r){return t+g*(1-Math.abs(1-2*r))}}}),this.cell.on("transition:complete",function(o){var t=o.cell,g=o.path;g==="position"&&n.speed>5&&(n.speed/=t.prop("bounciness")||2,n.fly({angle:180-n.angle,speed:n.speed}))}),this.cell.on("change:position",function(o){var t=o.cell,g=o.current,r=t;n.angle=C.e.create(r.getPosition()).theta(r.previous("position")),g&&((g.x<0||g.x>n.graph.options.width-r.getSize().width)&&(n.angle-=180,r.position(r.previous("position").x,g.y,{silent:!0}),t.stopTransition("position")))})}},{key:"fly",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},o=Object(P.a)({speed:100,angle:90},n),t=this.cell.getPosition(),g=this.cell.getSize(),r=this.graph.options.height-t.y-g.height,d=o.speed,A=9.81,v=Math.sin(C.a.toRad(o.angle)),h=(d*v+Math.sqrt(Math.pow(d,2)*Math.pow(v,2)+2*r*A))/A;this.cell.transition("position",o,{duration:100*h,interp:function(L,m){return function(u){return u=h*u,{x:L.x+m.speed*u*Math.cos(Math.PI/180*m.angle),y:L.y-m.speed*u*Math.sin(Math.PI/180*m.angle)+A/2*u*u}}}}),this.cell.transition("angle",-o.angle,{duration:100*h}),this.speed=o.speed,this.angle=o.angle}},{key:"onMouseDown",value:function(n,o,t){var g=this;if(this.cell.getTransitions().indexOf("position")>-1)return;this.stop&&(this.stop(),this.stop=null),this.edge=this.graph.addEdge({shape:"edge",source:this.cell.getBBox().getCenter(),target:{x:o,y:t},zIndex:-1,attrs:{line:{stroke:"rgba(0,0,0,0.1)",strokeWidth:6,targetMarker:{stroke:"black",strokeWidth:2,d:"M 20 -10 L 0 0 L 20 10 z"}}}}),this.edge.on("change:target",function(r){var d=r.cell,A=d,v=A.getSourcePoint(),h=A.getTargetPoint(),D=v.distance(h),L=Math.max(g.graph.options.width,g.graph.options.height),m=C.c.color("#ffffff","#ff0000");A.attr("line/targetMarker/fill",m(D/L/Math.sqrt(2)))})}},{key:"onMouseMove",value:function(n,o,t){this.edge&&this.edge.setTarget({x:o,y:t})}},{key:"onMouseUp",value:function(n,o,t){if(!this.edge)return;var g=this.edge.getSourcePoint(),r=this.edge.getTargetPoint();this.edge.remove(),this.edge=null,this.fly({angle:Math.abs(r.theta(g)-180),speed:g.distance(r)/2})}}]),s}(C.d);C.b.registerView("ball",z,!0),C.b.registerNode("ball",{view:"ball",markup:[{tagName:"text",selector:"label"},{tagName:"image",selector:"ball"}],attrs:{label:{text:"Drag me!",fontSize:40,fontWeight:900,refX:.5,refY:-20,textVerticalAnchor:"middle",textAnchor:"middle",fill:"white",strokeWidth:2,stroke:"black",opacity:0,pointerEvents:"none"},ball:{refWidth:1,refHeight:1}}},!0);var X=i(78),R=function(l){Object(M.a)(s,l);var I=Object(b.a)(s);function s(){var a;Object(N.a)(this,s);for(var n=arguments.length,o=new Array(n),t=0;t<n;t++)o[t]=arguments[t];return a=I.call.apply(I,[this].concat(o)),a.container=void 0,a.refContainer=function(g){a.container=g},a}return Object(f.a)(s,[{key:"componentDidMount",value:function(){var n=new C.b({container:this.container,grid:!0});n.addNode({shape:"ball",x:400,y:270,width:50,height:50,bounciness:1.5,attrs:{image:{"xlink:href":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iLTEwNSAtMTA1IDIxMCAyMTAiPgogICA8ZGVmcz4KICAgICAgPGNsaXBQYXRoIGlkPSJiYWxsIj4KICAgICAgICAgPGNpcmNsZSByPSIxMDAiIHN0cm9rZS13aWR0aD0iMCIvPgogICAgICA8L2NsaXBQYXRoPgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzEiIGN4PSIuNCIgY3k9Ii4zIiByPSIuOCI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuNCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjgiIHN0b3AtY29sb3I9IiNFRUVFRUUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzIiIGN4PSIuNSIgY3k9Ii41IiByPSIuNSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjk5IiBzdG9wLWNvbG9yPSJibGFjayIgc3RvcC1vcGFjaXR5PSIuMyIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8ZyBpZD0iYmxhY2tfc3R1ZmYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsaXAtcGF0aD0idXJsKCNiYWxsKSI+CiAgICAgICAgIDxnIGZpbGw9ImJsYWNrIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIDI2LC0yOCA0NiwtMTkgUSA1NywtMzUgNjQsLTQ3IFEgNTAsLTY4IDM3LC03NiBRIDE3LC03NSAxLC02OCBRIDQsLTUxIDYsLTMyIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gLTI2LC0yIFEgLTQ1LC04IC02MiwtMTEgUSAtNzQsNSAtNzYsMjIgUSAtNjksNDAgLTUwLDU0IFEgLTMyLDQ3IC0xNywzOSBRIC0yMywxNSAtMjYsLTIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTUsMjIgUSAtMTAyLDEyIC0xMDIsLTggViA4MCBIIC04NSBRIC05NSw0NSAtOTUsMjIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSA1NSwyNCBRIDQxLDQxIDI0LDUyIFEgMjgsNjUgMzEsNzkgUSA1NSw3OCA2OCw2NyBRIDc4LDUwIDgwLDM1IFEgNjUsMjggNTUsMjQiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwLDEyMCBMIC0zLDk1IFEgLTI1LDkzIC00Miw4MiBRIC01MCw4NCAtNjAsODEiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTAsLTQ4IFEgLTgwLC01MiAtNjgsLTQ5IFEgLTUyLC03MSAtMzUsLTc3IFEgLTM1LC0xMDAgLTQwLC0xMDAgSCAtMTAwIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAwLC01NSBMIDg3LC0zNyBRIDk4LC0xMCA5Nyw1IEwgMTAwLDYiLz4KICAgICAgICAgPC9nPgogICAgICAgICA8ZyBmaWxsPSJub25lIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIC0xOCwtMTIgLTI2LC0yICAgICAgICAgICAgICAgICAgICAgIE0gNDYsLTE5IFEgNTQsNSA1NSwyNCAgICAgICAgICAgICAgICAgICAgICBNIDY0LC00NyBRIDc3LC00NCA4NywtMzcgICAgICAgICAgICAgICAgICAgICAgTSAzNywtNzYgUSAzOSwtOTAgMzYsLTEwMCAgICAgICAgICAgICAgICAgICAgICBNIDEsLTY4IFEgLTEzLC03NyAtMzUsLTc3ICAgICAgICAgICAgICAgICAgICAgIE0gLTYyLC0xMSBRIC02NywtMjUgLTY4LC00OSAgICAgICAgICAgICAgICAgICAgICBNIC03NiwyMiBRIC04NSwyNCAtOTUsMjIgICAgICAgICAgICAgICAgICAgICAgTSAtNTAsNTQgUSAtNDksNzAgLTQyLDgyICAgICAgICAgICAgICAgICAgICAgIE0gLTE3LDM5IFEgMCw0OCAyNCw1MiAgICAgICAgICAgICAgICAgICAgICBNIDMxLDc5IFEgMjAsOTIgLTMsOTUgICAgICAgICAgICAgICAgICAgICAgTSA2OCw2NyBMIDgwLDgwICAgICAgICAgICAgICAgICAgICAgIE0gODAsMzUgUSA5MCwyNSA5Nyw1ICAgICAgICAgICAgICIvPgogICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgPC9kZWZzPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0ibm9uZSIvPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0idXJsKCNzaGFkb3cxKSIgc3Ryb2tlPSJub25lIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9IiNFRUUiIHN0cm9rZS13aWR0aD0iNyIvPgogICA8dXNlIHhsaW5rOmhyZWY9IiNibGFja19zdHVmZiIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgPHVzZSB4bGluazpocmVmPSIjYmxhY2tfc3R1ZmYiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgPGNpcmNsZSByPSIxMDAiIGZpbGw9InVybCgjc2hhZG93MikiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4="}}})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),s}(e.a.Component),U=i(97),j=i(93),B=i(98),G=i(99),y=i(96),F=i(79),Z=i(53),J=i(82),E=i(83),O=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},Y=function(l){Object(M.a)(s,l);var I=Object(b.a)(s);function s(){return Object(N.a)(this,s),I.apply(this,arguments)}return Object(f.a)(s,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,{component:O}))),e.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(E.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(B.a,null))),e.a.createElement(y.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(Z.getParameters)(E.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(G.a,null)))))}}]),s}(e.a.Component),H=i(94),k=i(67),Q=i(88),w=function(l){Object(M.a)(s,l);var I=Object(b.a)(s);function s(a){var n;return Object(N.a)(this,s),n=I.call(this,a),n.refContainer=function(o){n.container=o},s.restoreIframeSize(),n}return Object(f.a)(s,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var o=new window.ResizeObserver(function(){n.updateIframeSize()});o.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var t=document.getElementById("loading");t&&t.parentNode&&t.parentNode.removeChild(t)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var o=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(o+16,"px"),n.style.border="0",n.style.overflow="hidden",s.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(Y,null),this.props.children)}}]),s}(e.a.Component);(function(l){var I=window.location.pathname,s="x6-iframe-size";function a(){var t=localStorage.getItem(s),g;if(t)try{g=JSON.parse(t)}catch(r){}else g={};return g}function n(){var t=window.frameElement;if(t){var g=t.style,r={width:g.width,height:g.height},d=a();d[I]=r,localStorage.setItem(s,JSON.stringify(d))}}l.saveIframeSize=n;function o(){var t=window.frameElement;if(t){var g=a(),r=g[I];r&&(t.style.width=r.width||"100%",t.style.height=r.height||"auto")}}l.restoreIframeSize=o})(w||(w={}));var V=i(89),W=function(I){var s=I.children;return e.a.createElement(H.a.ErrorBoundary,null,e.a.createElement(k.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,s))};T.a.render(e.a.createElement(W,null,e.a.createElement(R,null)),document.getElementById("root"))}},[[72,1,2]]]);
