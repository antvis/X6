(this["webpackJsonp@antv/x6-sites-demos-api.graph.checkview"]=this["webpackJsonp@antv/x6-sites-demos-api.graph.checkview"]||[]).push([[0],{102:function(v,h,t){},105:function(v,h,t){},106:function(v,h,t){"use strict";t.r(h),t.d(h,"host",function(){return g}),t.d(h,"getCodeSandboxParams",function(){return e}),t.d(h,"getStackblitzPrefillConfig",function(){return S});const g="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/graph/checkview";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-left {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  height: 444px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  overflow: auto;
}

.ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
}

.slider-value {
  background: #eee;
  color: #333333;
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
  line-height: 1.25;
}

#elapsed {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
  font-variant: tabular-nums;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  border-radius: 2px;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph, Cell, Node, Edge, Color, Rectangle } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private count: number
  private columns: number
  private graph: Graph
  private viewport: Node
  private padding: number
  private keepDragged: boolean
  private keepRendered: boolean
  private customViewport: boolean
  private windowBBox: Rectangle
  private draggedId: string[] = []

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      sorting: 'approx',
      async: true,
      frozen: true,
      grid: {
        size: 1,
        visible: true,
      },
      checkView: ({ view, unmounted }) => {
        const cell = view.cell
        if (cell.isNode()) {
          return this.shouldRenderNode(cell, unmounted)
        }

        if (cell.isEdge()) {
          return this.shouldRenderEdge(cell)
        }
        return false
      },
    })

    this.graph.on('render:done', ({ stats }) => {
      console.table(stats)
    })

    this.graph.on('node:change:position', ({ node }) => {
      this.draggedId.push(node.id)
    })

    window.onscroll = () => this.setWindowBBox()
    window.onresize = () => this.setWindowBBox()

    this.setWindowBBox()
    this.onChanged(defaults)
  }

  shouldRenderNode(node: Node, unmounted: boolean) {
    if (this.keepDragged && this.draggedId.includes(node.id)) {
      return true
    }

    if (this.keepRendered && unmounted) {
      return true
    }

    if (this.customViewport) {
      const viewportBBox = this.viewport.getBBox()
      return viewportBBox.isIntersectWithRect(
        node.getBBox().inflate(this.padding),
      )
    }

    if (node === this.viewport) {
      return false
    }

    return this.windowBBox.isIntersectWithRect(
      node.getBBox().inflate(this.padding),
    )
  }

  shouldRenderEdge(edge: Edge) {
    const sourceNode = edge.getSourceNode()
    const targetNode = edge.getTargetNode()

    return (
      this.shouldRenderNode(sourceNode as Node, false) ||
      this.shouldRenderNode(targetNode as Node, false)
    )
  }

  setWindowBBox() {
    this.windowBBox = this.graph.pageToLocal(
      window.scrollX,
      window.scrollY,
      window.innerWidth,
      window.innerHeight,
    )
  }

  onChanged = (settgins: State) => {
    console.time('perf-all')

    this.padding = settgins.padding
    this.customViewport = settgins.customViewport
    this.keepRendered = settgins.keepRendered
    this.keepDragged = settgins.keepDragged
    this.draggedId = []

    if (this.count === settgins.count && this.columns === settgins.columns) {
      return
    }

    this.count = settgins.count
    this.columns = settgins.columns

    const count = settgins.count
    const columns = settgins.columns
    const rows = Math.ceil(count / columns)

    const baseColor = Color.randomHex()
    const nodes = Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const fill = Color.lighten(baseColor, ((row + column) % 8) * 10)
      return this.graph.createNode({
        zIndex: 2,
        width: 30,
        height: 20,
        x: column * 50 + 30,
        y: row * 50 + 30,
        attrs: {
          body: { fill },
          label: { text: index, fill: Color.invert(fill, true) },
        },
      })
    })

    const edges = nodes.map((target, index) => {
      if (index === 0) {
        return null
      }
      const source = nodes[index - 1]
      return this.graph.createEdge({
        zIndex: 1,
        source: { cell: source.id },
        target: { cell: target.id },
      })
    })

    edges.shift()

    this.viewport = this.graph.createNode({
      zIndex: 3,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      label: 'Drag me',
      attrs: {
        body: {
          fill: 'rgba(255,0,0,0.6)',
          stroke: 'rgba(255,0,0,0.8)',
          strokeWidth: 8,
        },
        label: {
          text: 'Drag me!!',
          fill: '#fff',
        },
      },
    })

    console.time('perf-reset')
    this.graph.freeze()
    this.graph.resize(columns * 50 + 30, rows * 50 + 30)
    this.graph.model.resetCells([...nodes, ...edges, this.viewport] as Cell[])
    console.timeEnd('perf-reset')

    console.time('perf-dump')
    this.graph.unfreeze({
      batchSize: settgins.batch,
      progress: ({ done, current, total }) => {
        const progress = current / total
        console.log(\`\${Math.round(progress * 100)}%\`)
        if (done) {
          console.timeEnd('perf-dump')
          console.timeEnd('perf-all')
          this.graph.unfreeze()
        }
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content">
          <div ref={this.refContainer} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/settings.tsx":{content:`import React from 'react'
import { Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  columns: number
  batch: number
  padding: number
  customViewport: boolean
  keepRendered: boolean
  keepDragged: boolean
}

export const defaults: State = {
  count: 1000,
  columns: 40,
  batch: 400,
  padding: 60,
  customViewport: true,
  keepRendered: false,
  keepDragged: false,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCountChanged = (count: number) => {
    this.setState({ count }, () => {
      this.notifyChange()
    })
  }

  onColumnsChanged = (columns: number) => {
    this.setState({ columns }, () => {
      this.notifyChange()
    })
  }

  onBatchChanged = (batch: number) => {
    this.setState({ batch }, () => {
      this.notifyChange()
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
      this.notifyChange()
    })
  }

  onCustomViewportChanged = (customViewport: boolean) => {
    this.setState({ customViewport }, () => {
      this.notifyChange()
    })
  }

  onKeepRenderedChanged = (keepRendered: boolean) => {
    this.setState({ keepRendered }, () => {
      this.notifyChange()
    })
  }

  onKeepDraggedChanged = (keepDragged: boolean) => {
    this.setState({ keepDragged }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={7}>node count</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={5000}
              step={1}
              value={this.state.count}
              onChange={this.onCountChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.count}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>batch size</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={1000}
              step={1}
              value={this.state.batch}
              onChange={this.onBatchChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.batch}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>columns</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={100}
              step={1}
              value={this.state.columns}
              onChange={this.onColumnsChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.columns}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>rows</Col>
          <Col span={12}></Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {Math.ceil(this.state.count / this.state.columns)}
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>padding</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={120}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>custom viewport</Col>
          <Col span={14}>
            <Switch
              checked={this.state.customViewport}
              onChange={this.onCustomViewportChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep rendered</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepRendered}
              onChange={this.onKeepRenderedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep dragged</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepDragged}
              onChange={this.onKeepDraggedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
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
`,isBinary:!1}}}}function S(){return{title:"api/graph/checkview",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-left {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  height: 444px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  overflow: auto;
}

.ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
}

.slider-value {
  background: #eee;
  color: #333333;
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
  line-height: 1.25;
}

#elapsed {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
  font-variant: tabular-nums;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  border-radius: 2px;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph, Cell, Node, Edge, Color, Rectangle } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private count: number
  private columns: number
  private graph: Graph
  private viewport: Node
  private padding: number
  private keepDragged: boolean
  private keepRendered: boolean
  private customViewport: boolean
  private windowBBox: Rectangle
  private draggedId: string[] = []

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      sorting: 'approx',
      async: true,
      frozen: true,
      grid: {
        size: 1,
        visible: true,
      },
      checkView: ({ view, unmounted }) => {
        const cell = view.cell
        if (cell.isNode()) {
          return this.shouldRenderNode(cell, unmounted)
        }

        if (cell.isEdge()) {
          return this.shouldRenderEdge(cell)
        }
        return false
      },
    })

    this.graph.on('render:done', ({ stats }) => {
      console.table(stats)
    })

    this.graph.on('node:change:position', ({ node }) => {
      this.draggedId.push(node.id)
    })

    window.onscroll = () => this.setWindowBBox()
    window.onresize = () => this.setWindowBBox()

    this.setWindowBBox()
    this.onChanged(defaults)
  }

  shouldRenderNode(node: Node, unmounted: boolean) {
    if (this.keepDragged && this.draggedId.includes(node.id)) {
      return true
    }

    if (this.keepRendered && unmounted) {
      return true
    }

    if (this.customViewport) {
      const viewportBBox = this.viewport.getBBox()
      return viewportBBox.isIntersectWithRect(
        node.getBBox().inflate(this.padding),
      )
    }

    if (node === this.viewport) {
      return false
    }

    return this.windowBBox.isIntersectWithRect(
      node.getBBox().inflate(this.padding),
    )
  }

  shouldRenderEdge(edge: Edge) {
    const sourceNode = edge.getSourceNode()
    const targetNode = edge.getTargetNode()

    return (
      this.shouldRenderNode(sourceNode as Node, false) ||
      this.shouldRenderNode(targetNode as Node, false)
    )
  }

  setWindowBBox() {
    this.windowBBox = this.graph.pageToLocal(
      window.scrollX,
      window.scrollY,
      window.innerWidth,
      window.innerHeight,
    )
  }

  onChanged = (settgins: State) => {
    console.time('perf-all')

    this.padding = settgins.padding
    this.customViewport = settgins.customViewport
    this.keepRendered = settgins.keepRendered
    this.keepDragged = settgins.keepDragged
    this.draggedId = []

    if (this.count === settgins.count && this.columns === settgins.columns) {
      return
    }

    this.count = settgins.count
    this.columns = settgins.columns

    const count = settgins.count
    const columns = settgins.columns
    const rows = Math.ceil(count / columns)

    const baseColor = Color.randomHex()
    const nodes = Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const fill = Color.lighten(baseColor, ((row + column) % 8) * 10)
      return this.graph.createNode({
        zIndex: 2,
        width: 30,
        height: 20,
        x: column * 50 + 30,
        y: row * 50 + 30,
        attrs: {
          body: { fill },
          label: { text: index, fill: Color.invert(fill, true) },
        },
      })
    })

    const edges = nodes.map((target, index) => {
      if (index === 0) {
        return null
      }
      const source = nodes[index - 1]
      return this.graph.createEdge({
        zIndex: 1,
        source: { cell: source.id },
        target: { cell: target.id },
      })
    })

    edges.shift()

    this.viewport = this.graph.createNode({
      zIndex: 3,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      label: 'Drag me',
      attrs: {
        body: {
          fill: 'rgba(255,0,0,0.6)',
          stroke: 'rgba(255,0,0,0.8)',
          strokeWidth: 8,
        },
        label: {
          text: 'Drag me!!',
          fill: '#fff',
        },
      },
    })

    console.time('perf-reset')
    this.graph.freeze()
    this.graph.resize(columns * 50 + 30, rows * 50 + 30)
    this.graph.model.resetCells([...nodes, ...edges, this.viewport] as Cell[])
    console.timeEnd('perf-reset')

    console.time('perf-dump')
    this.graph.unfreeze({
      batchSize: settgins.batch,
      progress: ({ done, current, total }) => {
        const progress = current / total
        console.log(\`\${Math.round(progress * 100)}%\`)
        if (done) {
          console.timeEnd('perf-dump')
          console.timeEnd('perf-all')
          this.graph.unfreeze()
        }
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content">
          <div ref={this.refContainer} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,"src/settings.tsx":`import React from 'react'
import { Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  columns: number
  batch: number
  padding: number
  customViewport: boolean
  keepRendered: boolean
  keepDragged: boolean
}

export const defaults: State = {
  count: 1000,
  columns: 40,
  batch: 400,
  padding: 60,
  customViewport: true,
  keepRendered: false,
  keepDragged: false,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCountChanged = (count: number) => {
    this.setState({ count }, () => {
      this.notifyChange()
    })
  }

  onColumnsChanged = (columns: number) => {
    this.setState({ columns }, () => {
      this.notifyChange()
    })
  }

  onBatchChanged = (batch: number) => {
    this.setState({ batch }, () => {
      this.notifyChange()
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
      this.notifyChange()
    })
  }

  onCustomViewportChanged = (customViewport: boolean) => {
    this.setState({ customViewport }, () => {
      this.notifyChange()
    })
  }

  onKeepRenderedChanged = (keepRendered: boolean) => {
    this.setState({ keepRendered }, () => {
      this.notifyChange()
    })
  }

  onKeepDraggedChanged = (keepDragged: boolean) => {
    this.setState({ keepDragged }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={7}>node count</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={5000}
              step={1}
              value={this.state.count}
              onChange={this.onCountChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.count}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>batch size</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={1000}
              step={1}
              value={this.state.batch}
              onChange={this.onBatchChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.batch}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>columns</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={100}
              step={1}
              value={this.state.columns}
              onChange={this.onColumnsChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.columns}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>rows</Col>
          <Col span={12}></Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {Math.ceil(this.state.count / this.state.columns)}
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>padding</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={120}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>custom viewport</Col>
          <Col span={14}>
            <Switch
              checked={this.state.customViewport}
              onChange={this.onCustomViewportChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep rendered</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepRendered}
              onChange={this.onKeepRenderedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep dragged</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepDragged}
              onChange={this.onKeepDraggedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
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
`}}}},109:function(v,h,t){},111:function(v,h,t){"use strict";t.r(h);var g=t(0),e=t.n(g),S=t(31),z=t.n(S),O=t(10),E=t(1),w=t(3),x=t(5),b=t(6),R=t(62),V=t(115),f=t(59),i=t(42),y=t(116),D=t(119),ee=t(77),P={count:1e3,columns:40,batch:400,padding:60,customViewport:!0,keepRendered:!1,keepDragged:!1},I=function(c){Object(x.a)(r,c);var l=Object(b.a)(r);function r(){var n;Object(E.a)(this,r);for(var a=arguments.length,d=new Array(a),s=0;s<a;s++)d[s]=arguments[s];return n=l.call.apply(l,[this].concat(d)),n.state=P,n.onCountChanged=function(o){n.setState({count:o},function(){n.notifyChange()})},n.onColumnsChanged=function(o){n.setState({columns:o},function(){n.notifyChange()})},n.onBatchChanged=function(o){n.setState({batch:o},function(){n.notifyChange()})},n.onPaddingChanged=function(o){n.setState({padding:o},function(){n.notifyChange()})},n.onCustomViewportChanged=function(o){n.setState({customViewport:o},function(){n.notifyChange()})},n.onKeepRenderedChanged=function(o){n.setState({keepRendered:o},function(){n.notifyChange()})},n.onKeepDraggedChanged=function(o){n.setState({keepDragged:o},function(){n.notifyChange()})},n}return Object(w.a)(r,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(V.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:7},"node count"),e.a.createElement(i.a,{span:12},e.a.createElement(y.a,{min:10,max:5e3,step:1,value:this.state.count,onChange:this.onCountChanged})),e.a.createElement(i.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.count))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:7},"batch size"),e.a.createElement(i.a,{span:12},e.a.createElement(y.a,{min:10,max:1e3,step:1,value:this.state.batch,onChange:this.onBatchChanged})),e.a.createElement(i.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.batch))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:7},"columns"),e.a.createElement(i.a,{span:12},e.a.createElement(y.a,{min:20,max:100,step:1,value:this.state.columns,onChange:this.onColumnsChanged})),e.a.createElement(i.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.columns))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:7},"rows"),e.a.createElement(i.a,{span:12}),e.a.createElement(i.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},Math.ceil(this.state.count/this.state.columns)))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:7},"padding"),e.a.createElement(i.a,{span:12},e.a.createElement(y.a,{min:20,max:120,step:1,value:this.state.padding,onChange:this.onPaddingChanged})),e.a.createElement(i.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.padding))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:10},"custom viewport"),e.a.createElement(i.a,{span:14},e.a.createElement(D.a,{checked:this.state.customViewport,onChange:this.onCustomViewportChanged}))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:10},"keep rendered"),e.a.createElement(i.a,{span:14},e.a.createElement(D.a,{checked:this.state.keepRendered,onChange:this.onKeepRenderedChanged}))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:10},"keep dragged"),e.a.createElement(i.a,{span:14},e.a.createElement(D.a,{checked:this.state.keepDragged,onChange:this.onKeepDraggedChanged}))),e.a.createElement(f.a,{align:"middle"},e.a.createElement(i.a,{span:24,id:"elapsed"})))}}]),r}(e.a.Component),ne=t(102),T=function(c){Object(x.a)(r,c);var l=Object(b.a)(r);function r(){var n;Object(E.a)(this,r);for(var a=arguments.length,d=new Array(a),s=0;s<a;s++)d[s]=arguments[s];return n=l.call.apply(l,[this].concat(d)),n.container=void 0,n.count=void 0,n.columns=void 0,n.graph=void 0,n.viewport=void 0,n.padding=void 0,n.keepDragged=void 0,n.keepRendered=void 0,n.customViewport=void 0,n.windowBBox=void 0,n.draggedId=[],n.onChanged=function(o){if(console.time("perf-all"),n.padding=o.padding,n.customViewport=o.customViewport,n.keepRendered=o.keepRendered,n.keepDragged=o.keepDragged,n.draggedId=[],n.count===o.count&&n.columns===o.columns)return;n.count=o.count,n.columns=o.columns;var p=o.count,u=o.columns,$=Math.ceil(p/u),Q=R.a.randomHex(),B=Array.from({length:p},function(A,m){var C=Math.floor(m/u),U=m%u,_=R.a.lighten(Q,(C+U)%8*10);return n.graph.createNode({zIndex:2,width:30,height:20,x:U*50+30,y:C*50+30,attrs:{body:{fill:_},label:{text:m,fill:R.a.invert(_,!0)}}})}),M=B.map(function(A,m){if(m===0)return null;var C=B[m-1];return n.graph.createEdge({zIndex:1,source:{cell:C.id},target:{cell:A.id}})});M.shift(),n.viewport=n.graph.createNode({zIndex:3,width:200,height:200,x:100,y:100,label:"Drag me",attrs:{body:{fill:"rgba(255,0,0,0.6)",stroke:"rgba(255,0,0,0.8)",strokeWidth:8},label:{text:"Drag me!!",fill:"#fff"}}}),console.time("perf-reset"),n.graph.freeze(),n.graph.resize(u*50+30,$*50+30),n.graph.model.resetCells([].concat(Object(O.a)(B),Object(O.a)(M),[n.viewport])),console.timeEnd("perf-reset"),console.time("perf-dump"),n.graph.unfreeze({batchSize:o.batch,progress:function(m){var C=m.done,U=m.current,_=m.total,q=U/_;console.log("".concat(Math.round(q*100),"%")),C&&(console.timeEnd("perf-dump"),console.timeEnd("perf-all"),n.graph.unfreeze())}})},n.refContainer=function(o){n.container=o},n}return Object(w.a)(r,[{key:"componentDidMount",value:function(){var a=this;this.graph=new R.b({container:this.container,sorting:"approx",async:!0,frozen:!0,grid:{size:1,visible:!0},checkView:function(s){var o=s.view,p=s.unmounted,u=o.cell;return u.isNode()?a.shouldRenderNode(u,p):u.isEdge()?a.shouldRenderEdge(u):!1}}),this.graph.on("render:done",function(d){var s=d.stats;console.table(s)}),this.graph.on("node:change:position",function(d){var s=d.node;a.draggedId.push(s.id)}),window.onscroll=function(){return a.setWindowBBox()},window.onresize=function(){return a.setWindowBBox()},this.setWindowBBox(),this.onChanged(P)}},{key:"shouldRenderNode",value:function(a,d){if(this.keepDragged&&this.draggedId.includes(a.id))return!0;if(this.keepRendered&&d)return!0;if(this.customViewport){var s=this.viewport.getBBox();return s.isIntersectWithRect(a.getBBox().inflate(this.padding))}return a===this.viewport?!1:this.windowBBox.isIntersectWithRect(a.getBBox().inflate(this.padding))}},{key:"shouldRenderEdge",value:function(a){var d=a.getSourceNode(),s=a.getTargetNode();return this.shouldRenderNode(d,!1)||this.shouldRenderNode(s,!1)}},{key:"setWindowBBox",value:function(){this.windowBBox=this.graph.pageToLocal(window.scrollX,window.scrollY,window.innerWidth,window.innerHeight)}},{key:"render",value:function(){return g.createElement("div",{className:"app"},g.createElement("div",{className:"app-left"},g.createElement(I,{onChange:this.onChanged})),g.createElement("div",{className:"app-content"},g.createElement("div",{ref:this.refContainer})))}}]),r}(g.Component),X=t(120),j=t(114),W=t(121),H=t(122),N=t(92),K=t(87),te=t(105),L=t(106),G=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},F=function(c){Object(x.a)(r,c);var l=Object(b.a)(r);function r(){return Object(E.a)(this,r),l.apply(this,arguments)}return Object(w.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(X.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,{component:G}))),e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(L.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(W.a,null))),e.a.createElement(N.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(K.getParameters)(L.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(H.a,null)))))}}]),r}(e.a.Component),J=t(117),Y=t(88),oe=t(109),k=function(c){Object(x.a)(r,c);var l=Object(b.a)(r);function r(n){var a;return Object(E.a)(this,r),a=l.call(this,n),a.refContainer=function(d){a.container=d},r.restoreIframeSize(),a}return Object(w.a)(r,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){a.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var d=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(d+16,"px"),a.style.border="0",a.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(F,null),this.props.children)}}]),r}(e.a.Component);(function(c){var l=window.location.pathname,r="x6-iframe-size";function n(){var s=localStorage.getItem(r),o;if(s)try{o=JSON.parse(s)}catch(p){}else o={};return o}function a(){var s=window.frameElement;if(s){var o=s.style,p={width:o.width,height:o.height},u=n();u[l]=p,localStorage.setItem(r,JSON.stringify(u))}}c.saveIframeSize=a;function d(){var s=window.frameElement;if(s){var o=n(),p=o[l];p&&(s.style.width=p.width||"100%",s.style.height=p.height||"auto")}}c.restoreIframeSize=d})(k||(k={}));var ae=t(110),Z=function(l){var r=l.children;return e.a.createElement(J.a.ErrorBoundary,null,e.a.createElement(Y.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(k,null,r))};z.a.render(e.a.createElement(Z,null,e.a.createElement(T,null)),document.getElementById("root"))},94:function(v,h,t){v.exports=t(111)}},[[94,1,2]]]);
