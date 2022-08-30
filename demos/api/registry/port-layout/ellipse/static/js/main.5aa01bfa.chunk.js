(this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.ellipse"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.ellipse"]||[]).push([[0],{101:function(h,p,t){},102:function(h,p,t){"use strict";t.r(p),t.d(p,"host",function(){return R}),t.d(p,"getCodeSandboxParams",function(){return n}),t.d(p,"getStackblitzPrefillConfig",function(){return b});const R="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/port-layout/ellipse";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-side {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Node, Point } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return \`M \${center.x} \${center.y} \${p.x} \${p.y}\`
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'text', selector: 'label' },
        { tagName: 'path', selector: 'line' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
        line: {
          d: getPathData(45),
          stroke: 'green',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: '#31d0c6',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 2,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#fe854f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#6a6c8a',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipse',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: \`\${index}\`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: 'red' },
        dot: { fill: '#31d0c6' },
      },
    })
  }

  onAttrsChanged = ({ start, step, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      step,
      compensateRotate,
    })

    this.node.attr({
      line: { d: getPathData(start) },
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/settings.tsx":{content:`import React from 'react'
import { Slider, Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  start: number
  step: number
  compensateRotate: boolean
  dr: number
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    start: 45,
    step: 20,
    compensateRotate: false,
    dr: 0,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStartChanged = (start: number) => {
    this.setState({ start }, () => {
      this.notifyChange()
    })
  }

  onStepChanged = (step: number) => {
    this.setState({ step }, () => {
      this.notifyChange()
    })
  }

  onCompensateRotateChange = (e: any) => {
    this.setState({ compensateRotate: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDrChanged = (dr: number) => {
    this.setState({ dr }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            start
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.start}
              onChange={this.onStartChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.start}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            step
          </Col>
          <Col span={14}>
            <Slider
              min={10}
              max={36}
              step={1}
              value={this.state.step}
              onChange={this.onStepChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.step}</div>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={19} offset={5}>
            <Checkbox
              onChange={this.onCompensateRotateChange}
              checked={this.state.compensateRotate}
            >
              compensateRotate
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dr
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dr}
              onChange={this.onDrChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dr}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
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
`,isBinary:!1}}}}function b(){return{title:"api/registry/port-layout/ellipse",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-side {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
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
`,"src/app.tsx":`import React from 'react'
import { Graph, Node, Point } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return \`M \${center.x} \${center.y} \${p.x} \${p.y}\`
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'text', selector: 'label' },
        { tagName: 'path', selector: 'line' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
        line: {
          d: getPathData(45),
          stroke: 'green',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: '#31d0c6',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 2,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#fe854f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#6a6c8a',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipse',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: \`\${index}\`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: 'red' },
        dot: { fill: '#31d0c6' },
      },
    })
  }

  onAttrsChanged = ({ start, step, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      step,
      compensateRotate,
    })

    this.node.attr({
      line: { d: getPathData(start) },
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,"src/settings.tsx":`import React from 'react'
import { Slider, Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  start: number
  step: number
  compensateRotate: boolean
  dr: number
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    start: 45,
    step: 20,
    compensateRotate: false,
    dr: 0,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStartChanged = (start: number) => {
    this.setState({ start }, () => {
      this.notifyChange()
    })
  }

  onStepChanged = (step: number) => {
    this.setState({ step }, () => {
      this.notifyChange()
    })
  }

  onCompensateRotateChange = (e: any) => {
    this.setState({ compensateRotate: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDrChanged = (dr: number) => {
    this.setState({ dr }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            start
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.start}
              onChange={this.onStartChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.start}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            step
          </Col>
          <Col span={14}>
            <Slider
              min={10}
              max={36}
              step={1}
              value={this.state.step}
              onChange={this.onStepChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.step}</div>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={19} offset={5}>
            <Checkbox
              onChange={this.onCompensateRotateChange}
              checked={this.state.compensateRotate}
            >
              compensateRotate
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dr
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dr}
              onChange={this.onDrChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dr}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
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
`}}}},105:function(h,p,t){},107:function(h,p,t){"use strict";t.r(p);var R=t(0),n=t.n(R),b=t(30),N=t.n(b),D=t(88),f=t(2),C=t(3),x=t(5),E=t(6),w=t(68),_=t(111),u=t(56),l=t(40),g=t(112),P=t(115),$=t(72),O=function(c){Object(x.a)(a,c);var i=Object(E.a)(a);function a(){var e;Object(f.a)(this,a);for(var s=arguments.length,d=new Array(s),r=0;r<s;r++)d[r]=arguments[r];return e=i.call.apply(i,[this].concat(d)),e.state={start:45,step:20,compensateRotate:!1,dr:0,dx:0,dy:0,angle:45},e.onStartChanged=function(o){e.setState({start:o},function(){e.notifyChange()})},e.onStepChanged=function(o){e.setState({step:o},function(){e.notifyChange()})},e.onCompensateRotateChange=function(o){e.setState({compensateRotate:o.target.checked},function(){e.notifyChange()})},e.onDxChanged=function(o){e.setState({dx:o},function(){e.notifyChange()})},e.onDrChanged=function(o){e.setState({dr:o},function(){e.notifyChange()})},e.onDyChanged=function(o){e.setState({dy:o},function(){e.notifyChange()})},e.onAngleChanged=function(o){e.setState({angle:o},function(){e.notifyChange()})},e}return Object(C.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return n.a.createElement(_.a,{title:"Args",size:"small",bordered:!1,style:{width:320}},n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"start"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:0,max:360,step:1,value:this.state.start,onChange:this.onStartChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.start))),n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"step"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:10,max:36,step:1,value:this.state.step,onChange:this.onStepChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.step))),n.a.createElement(u.a,{align:"middle",style:{borderBottom:"1px solid #f0f0f0",paddingBottom:24}},n.a.createElement(l.a,{span:19,offset:5},n.a.createElement(P.a,{onChange:this.onCompensateRotateChange,checked:this.state.compensateRotate},"compensateRotate"))),n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"dr"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:-10,max:10,step:1,value:this.state.dr,onChange:this.onDrChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.dr))),n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"dx"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:-10,max:10,step:1,value:this.state.dx,onChange:this.onDxChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.dx))),n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"dy"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:-10,max:10,step:1,value:this.state.dy,onChange:this.onDyChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.dy))),n.a.createElement(u.a,{align:"middle"},n.a.createElement(l.a,{span:5,style:{textAlign:"right",paddingRight:8}},"angle"),n.a.createElement(l.a,{span:14},n.a.createElement(g.a,{min:0,max:360,step:1,value:this.state.angle,onChange:this.onAngleChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.angle))))}}]),a}(n.a.Component),G=t(98),L=["start","step","compensateRotate"];function U(c){var i=new w.b(180,100),a=new w.b(180,0),e=i.x/i.y,s=a.clone().rotate(90-c,i).scale(e,1,i);return"M ".concat(i.x," ").concat(i.y," ").concat(s.x," ").concat(s.y)}var M=function(c){Object(x.a)(a,c);var i=Object(E.a)(a);function a(){var e;Object(f.a)(this,a);for(var s=arguments.length,d=new Array(s),r=0;r<s;r++)d[r]=arguments[r];return e=i.call.apply(i,[this].concat(d)),e.container=void 0,e.node=void 0,e.onAttrsChanged=function(o){var m=o.start,y=o.step,F=o.compensateRotate,J=Object(D.a)(o,L);e.node.prop("ports/groups/group1/position/args",{start:m,step:y,compensateRotate:F}),e.node.attr({line:{d:U(m)}}),e.node.portProp("0",{args:J})},e.refContainer=function(o){e.container=o},e}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var s=this,d=new w.a({container:this.container,grid:{visible:!0}});this.node=d.addNode({x:120,y:90,width:360,height:200,shape:"ellipse",markup:[{tagName:"ellipse",selector:"body"},{tagName:"text",selector:"label"},{tagName:"path",selector:"line"}],attrs:{body:{refWidth:"100%",refHeight:"100%",fill:"#fff",stroke:"#000",strokeWidth:1},line:{d:U(45),stroke:"green",strokeDasharray:"5 5"}},ports:{groups:{group1:{markup:[{tagName:"rect",selector:"rect"},{tagName:"circle",selector:"dot"}],attrs:{rect:{magnet:!0,stroke:"#31d0c6",fill:"rgba(255,255,255,0.8)",strokeWidth:2,width:16,height:16,x:-8,y:-8},dot:{fill:"#fe854f",r:2},text:{fontSize:12,fill:"#6a6c8a"}},label:{position:"radial"},position:{name:"ellipse",args:{start:45}}}}}}),Array.from({length:10}).forEach(function(r,o){s.node.addPort({id:"".concat(o),group:"group1",attrs:{text:{text:o}}})}),this.node.portProp("0",{attrs:{rect:{stroke:"red"},dot:{fill:"#31d0c6"}}})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(O,{onChange:this.onAttrsChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),j=t(116),k=t(110),X=t(117),T=t(118),v=t(87),z=t(82),Y=t(101),S=t(102),V=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},I=function(c){Object(x.a)(a,c);var i=Object(E.a)(a);function a(){return Object(f.a)(this,a),i.apply(this,arguments)}return Object(C.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(j.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(k.a,{component:V}))),n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,null))),n.a.createElement(v.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(z.getParameters)(S.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(T.a,null)))))}}]),a}(n.a.Component),B=t(113),H=t(83),Z=t(105),A=function(c){Object(x.a)(a,c);var i=Object(E.a)(a);function a(e){var s;return Object(f.a)(this,a),s=i.call(this,e),s.refContainer=function(d){s.container=d},a.restoreIframeSize(),s}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){s.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var d=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(d+16,"px"),s.style.border="0",s.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(I,null),this.props.children)}}]),a}(n.a.Component);(function(c){var i=window.location.pathname,a="x6-iframe-size";function e(){var r=localStorage.getItem(a),o;if(r)try{o=JSON.parse(r)}catch(m){}else o={};return o}function s(){var r=window.frameElement;if(r){var o=r.style,m={width:o.width,height:o.height},y=e();y[i]=m,localStorage.setItem(a,JSON.stringify(y))}}c.saveIframeSize=s;function d(){var r=window.frameElement;if(r){var o=e(),m=o[i];m&&(r.style.width=m.width||"100%",r.style.height=m.height||"auto")}}c.restoreIframeSize=d})(A||(A={}));var K=t(106),W=function(i){var a=i.children;return n.a.createElement(B.a.ErrorBoundary,null,n.a.createElement(H.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(A,null,a))};N.a.render(n.a.createElement(W,null,n.a.createElement(M,null)),document.getElementById("root"))},90:function(h,p,t){h.exports=t(107)},98:function(h,p,t){}},[[90,1,2]]]);
