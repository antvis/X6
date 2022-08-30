(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.marker.native"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.marker.native"]||[]).push([[0],{108:function(v,u,a){v.exports=a(125)},116:function(v,u,a){},119:function(v,u,a){},120:function(v,u,a){"use strict";a.r(u),a.d(u,"host",function(){return f}),a.d(u,"getCodeSandboxParams",function(){return e}),a.d(u,"getStackblitzPrefillConfig",function(){return U});const f="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/marker/native";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 16px;
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
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private edge: Edge

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.edge = this.graph.addEdge({
      source: [80, 160],
      target: [480, 160],
      attrs: {
        line: {
          sourceMarker: 'block',
          targetMarker: 'block',
        },
      },
    })
  }

  onBackgroundChanged = ({ type, ...args }: State) => {
    this.edge.attr({
      line: {
        sourceMarker: { args, name: type },
        targetMarker: { args, name: type },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onBackgroundChanged} />
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
import { Input, Switch, Checkbox, Select, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  type: string
  r?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  offset?: number
  custom?: boolean
  fill?: string
  stroke?: string
  open?: boolean
  flip?: boolean
  strokeWidth?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'block',
    r: 5,
    rx: 5,
    ry: 5,
    width: 10,
    height: 10,
    offset: 0,
    custom: false,
    strokeWidth: 1,
  }

  notifyChange() {
    const {
      custom,
      type,
      r,
      rx,
      ry,
      width,
      height,
      offset,
      open,
      flip,
      ...others
    } = this.state

    if (others.stroke == null) {
      delete others.strokeWidth
    }

    let state: State

    if (type === 'block') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        ...others,
      }
    } else if (type === 'classic' || type === 'diamond' || type === 'cross') {
      state = {
        type,
        width,
        height,
        offset,
        ...others,
      }
    } else if (type === 'async') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        flip,
        ...others,
      }
    } else if (type === 'circle' || type === 'circlePlus') {
      state = {
        type,
        r,
        ...others,
      }
    } else if (type === 'ellipse') {
      state = {
        type,
        rx,
        ry,
        ...others,
      }
    }

    this.props.onChange(state!)
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onRChanged = (r: number) => {
    this.setState({ r }, () => {
      this.notifyChange()
    })
  }

  onRxChanged = (rx: number) => {
    this.setState({ rx }, () => {
      this.notifyChange()
    })
  }

  onRyChanged = (ry: number) => {
    this.setState({ ry }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onCustomChanged = (e: any) => {
    this.setState({ custom: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onFillChanged = (e: any) => {
    this.setState({ fill: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeChanged = (e: any) => {
    this.setState({ stroke: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeWidthChanged = (strokeWidth: number) => {
    this.setState({ strokeWidth }, () => {
      this.notifyChange()
    })
  }

  onOpenChanged = (open: boolean) => {
    this.setState({ open }, () => {
      this.notifyChange()
    })
  }

  onFlipChanged = (flip: boolean) => {
    this.setState({ flip }, () => {
      this.notifyChange()
    })
  }

  render() {
    const type = this.state.type

    return (
      <Card
        title="Marker Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="block">Block</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="diamond">Diamond</Select.Option>
              <Select.Option value="cross">Cross</Select.Option>
              <Select.Option value="async">Async</Select.Option>
              <Select.Option value="circle">Circle</Select.Option>
              <Select.Option value="circlePlus">Circle Plus</Select.Option>
              <Select.Option value="ellipse">Ellipse</Select.Option>
            </Select>
          </Col>
        </Row>
        {(type === 'circle' || type === 'circlePlus') && (
          <Row align="middle">
            <Col span={6}>Radius</Col>
            <Col span={14}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={this.state.r}
                onChange={this.onRChanged}
              />
            </Col>
            <Col span={2} offset={1}>
              <div className="slider-value">{this.state.r}</div>
            </Col>
          </Row>
        )}
        {type === 'ellipse' && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Radius X</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.rx}
                  onChange={this.onRxChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.rx}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Radius Y</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.ry}
                  onChange={this.onRyChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.ry}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {(type === 'block' ||
          type === 'classic' ||
          type === 'diamond' ||
          type === 'async' ||
          type === 'cross') && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Width</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.width}
                  onChange={this.onWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.width}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Height</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.height}
                  onChange={this.onHeightChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.height}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Offset</Col>
              <Col span={14}>
                <Slider
                  min={-50}
                  max={50}
                  step={1}
                  value={this.state.offset}
                  onChange={this.onOffsetChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.offset}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {(type === 'block' || type === 'async') && (
          <Row align="middle">
            <Col span={4}>Open</Col>
            <Col span={18}>
              <Switch checked={this.state.open} onChange={this.onOpenChanged} />
            </Col>
          </Row>
        )}

        {type === 'async' && (
          <Row align="middle">
            <Col span={4}>Flip</Col>
            <Col span={18}>
              <Switch checked={this.state.flip} onChange={this.onFlipChanged} />
            </Col>
          </Row>
        )}

        <Row
          align="middle"
          style={{ borderTop: '1px solid #e9e9e9', paddingTop: 12 }}
        >
          <Col>
            <div>
              <Checkbox
                checked={this.state.custom}
                onChange={this.onCustomChanged}
              >
                Custom fill and stroke color
              </Checkbox>
            </div>
          </Col>
        </Row>
        {this.state.custom && (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Fill Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.fill}
                  style={{ width: '100%' }}
                  onChange={this.onFillChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.stroke}
                  style={{ width: '100%' }}
                  onChange={this.onStrokeChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Width</Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={this.state.strokeWidth}
                  onChange={this.onStrokeWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.strokeWidth}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
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
`,isBinary:!1}}}}function U(){return{title:"tutorial/intermediate/marker/native",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 16px;
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
`,"src/app.tsx":`import * as React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private edge: Edge

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.edge = this.graph.addEdge({
      source: [80, 160],
      target: [480, 160],
      attrs: {
        line: {
          sourceMarker: 'block',
          targetMarker: 'block',
        },
      },
    })
  }

  onBackgroundChanged = ({ type, ...args }: State) => {
    this.edge.attr({
      line: {
        sourceMarker: { args, name: type },
        targetMarker: { args, name: type },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onBackgroundChanged} />
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
import { Input, Switch, Checkbox, Select, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  type: string
  r?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  offset?: number
  custom?: boolean
  fill?: string
  stroke?: string
  open?: boolean
  flip?: boolean
  strokeWidth?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'block',
    r: 5,
    rx: 5,
    ry: 5,
    width: 10,
    height: 10,
    offset: 0,
    custom: false,
    strokeWidth: 1,
  }

  notifyChange() {
    const {
      custom,
      type,
      r,
      rx,
      ry,
      width,
      height,
      offset,
      open,
      flip,
      ...others
    } = this.state

    if (others.stroke == null) {
      delete others.strokeWidth
    }

    let state: State

    if (type === 'block') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        ...others,
      }
    } else if (type === 'classic' || type === 'diamond' || type === 'cross') {
      state = {
        type,
        width,
        height,
        offset,
        ...others,
      }
    } else if (type === 'async') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        flip,
        ...others,
      }
    } else if (type === 'circle' || type === 'circlePlus') {
      state = {
        type,
        r,
        ...others,
      }
    } else if (type === 'ellipse') {
      state = {
        type,
        rx,
        ry,
        ...others,
      }
    }

    this.props.onChange(state!)
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onRChanged = (r: number) => {
    this.setState({ r }, () => {
      this.notifyChange()
    })
  }

  onRxChanged = (rx: number) => {
    this.setState({ rx }, () => {
      this.notifyChange()
    })
  }

  onRyChanged = (ry: number) => {
    this.setState({ ry }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onCustomChanged = (e: any) => {
    this.setState({ custom: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onFillChanged = (e: any) => {
    this.setState({ fill: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeChanged = (e: any) => {
    this.setState({ stroke: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeWidthChanged = (strokeWidth: number) => {
    this.setState({ strokeWidth }, () => {
      this.notifyChange()
    })
  }

  onOpenChanged = (open: boolean) => {
    this.setState({ open }, () => {
      this.notifyChange()
    })
  }

  onFlipChanged = (flip: boolean) => {
    this.setState({ flip }, () => {
      this.notifyChange()
    })
  }

  render() {
    const type = this.state.type

    return (
      <Card
        title="Marker Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="block">Block</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="diamond">Diamond</Select.Option>
              <Select.Option value="cross">Cross</Select.Option>
              <Select.Option value="async">Async</Select.Option>
              <Select.Option value="circle">Circle</Select.Option>
              <Select.Option value="circlePlus">Circle Plus</Select.Option>
              <Select.Option value="ellipse">Ellipse</Select.Option>
            </Select>
          </Col>
        </Row>
        {(type === 'circle' || type === 'circlePlus') && (
          <Row align="middle">
            <Col span={6}>Radius</Col>
            <Col span={14}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={this.state.r}
                onChange={this.onRChanged}
              />
            </Col>
            <Col span={2} offset={1}>
              <div className="slider-value">{this.state.r}</div>
            </Col>
          </Row>
        )}
        {type === 'ellipse' && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Radius X</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.rx}
                  onChange={this.onRxChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.rx}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Radius Y</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.ry}
                  onChange={this.onRyChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.ry}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {(type === 'block' ||
          type === 'classic' ||
          type === 'diamond' ||
          type === 'async' ||
          type === 'cross') && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Width</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.width}
                  onChange={this.onWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.width}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Height</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.height}
                  onChange={this.onHeightChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.height}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Offset</Col>
              <Col span={14}>
                <Slider
                  min={-50}
                  max={50}
                  step={1}
                  value={this.state.offset}
                  onChange={this.onOffsetChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.offset}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {(type === 'block' || type === 'async') && (
          <Row align="middle">
            <Col span={4}>Open</Col>
            <Col span={18}>
              <Switch checked={this.state.open} onChange={this.onOpenChanged} />
            </Col>
          </Row>
        )}

        {type === 'async' && (
          <Row align="middle">
            <Col span={4}>Flip</Col>
            <Col span={18}>
              <Switch checked={this.state.flip} onChange={this.onFlipChanged} />
            </Col>
          </Row>
        )}

        <Row
          align="middle"
          style={{ borderTop: '1px solid #e9e9e9', paddingTop: 12 }}
        >
          <Col>
            <div>
              <Checkbox
                checked={this.state.custom}
                onChange={this.onCustomChanged}
              >
                Custom fill and stroke color
              </Checkbox>
            </div>
          </Col>
        </Row>
        {this.state.custom && (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Fill Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.fill}
                  style={{ width: '100%' }}
                  onChange={this.onFillChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.stroke}
                  style={{ width: '100%' }}
                  onChange={this.onStrokeChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Width</Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={this.state.strokeWidth}
                  onChange={this.onStrokeWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.strokeWidth}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
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
`}}}},123:function(v,u,a){},125:function(v,u,a){"use strict";a.r(u);var f=a(0),e=a.n(f),U=a(32),j=a.n(U),N=a(83),_=a(4),x=a(6),S=a(8),b=a(9),X=a(101),R=a(67),F=a(129),c=a(68),i=a(53),m=a(134),g=a(130),L=a(136),W=a(135),M=a(132),te=a(89),V=["custom","type","r","rx","ry","width","height","offset","open","flip"],I=function(p){Object(S.a)(l,p);var r=Object(b.a)(l);function l(){var n;Object(_.a)(this,l);for(var t=arguments.length,d=new Array(t),o=0;o<t;o++)d[o]=arguments[o];return n=r.call.apply(r,[this].concat(d)),n.state={type:"block",r:5,rx:5,ry:5,width:10,height:10,offset:0,custom:!1,strokeWidth:1},n.onTypeChanged=function(s){n.setState({type:s},function(){n.notifyChange()})},n.onRChanged=function(s){n.setState({r:s},function(){n.notifyChange()})},n.onRxChanged=function(s){n.setState({rx:s},function(){n.notifyChange()})},n.onRyChanged=function(s){n.setState({ry:s},function(){n.notifyChange()})},n.onWidthChanged=function(s){n.setState({width:s},function(){n.notifyChange()})},n.onHeightChanged=function(s){n.setState({height:s},function(){n.notifyChange()})},n.onOffsetChanged=function(s){n.setState({offset:s},function(){n.notifyChange()})},n.onCustomChanged=function(s){n.setState({custom:s.target.checked},function(){n.notifyChange()})},n.onFillChanged=function(s){n.setState({fill:s.target.value},function(){n.notifyChange()})},n.onStrokeChanged=function(s){n.setState({stroke:s.target.value},function(){n.notifyChange()})},n.onStrokeWidthChanged=function(s){n.setState({strokeWidth:s},function(){n.notifyChange()})},n.onOpenChanged=function(s){n.setState({open:s},function(){n.notifyChange()})},n.onFlipChanged=function(s){n.setState({flip:s},function(){n.notifyChange()})},n}return Object(x.a)(l,[{key:"notifyChange",value:function(){var t=this.state,d=t.custom,o=t.type,s=t.r,h=t.rx,C=t.ry,k=t.width,P=t.height,A=t.offset,T=t.open,ne=t.flip,E=Object(N.a)(t,V);E.stroke==null&&delete E.strokeWidth;var y;o==="block"?y=Object(R.a)({type:o,width:k,height:P,offset:A,open:T},E):o==="classic"||o==="diamond"||o==="cross"?y=Object(R.a)({type:o,width:k,height:P,offset:A},E):o==="async"?y=Object(R.a)({type:o,width:k,height:P,offset:A,open:T,flip:ne},E):o==="circle"||o==="circlePlus"?y=Object(R.a)({type:o,r:s},E):o==="ellipse"&&(y=Object(R.a)({type:o,rx:h,ry:C},E)),this.props.onChange(y)}},{key:"render",value:function(){var t=this.state.type;return e.a.createElement(F.a,{title:"Marker Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Type"),e.a.createElement(i.a,{span:14},e.a.createElement(m.a,{style:{width:"100%"},value:t,onChange:this.onTypeChanged},e.a.createElement(m.a.Option,{value:"block"},"Block"),e.a.createElement(m.a.Option,{value:"classic"},"Classic"),e.a.createElement(m.a.Option,{value:"diamond"},"Diamond"),e.a.createElement(m.a.Option,{value:"cross"},"Cross"),e.a.createElement(m.a.Option,{value:"async"},"Async"),e.a.createElement(m.a.Option,{value:"circle"},"Circle"),e.a.createElement(m.a.Option,{value:"circlePlus"},"Circle Plus"),e.a.createElement(m.a.Option,{value:"ellipse"},"Ellipse")))),(t==="circle"||t==="circlePlus")&&e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Radius"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:0,max:50,step:1,value:this.state.r,onChange:this.onRChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.r))),t==="ellipse"&&e.a.createElement(e.a.Fragment,null,e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Radius X"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:0,max:50,step:1,value:this.state.rx,onChange:this.onRxChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.rx))),e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Radius Y"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:0,max:50,step:1,value:this.state.ry,onChange:this.onRyChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.ry)))),(t==="block"||t==="classic"||t==="diamond"||t==="async"||t==="cross")&&e.a.createElement(e.a.Fragment,null,e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Width"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:0,max:50,step:1,value:this.state.width,onChange:this.onWidthChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.width))),e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Height"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:0,max:50,step:1,value:this.state.height,onChange:this.onHeightChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.height))),e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:6},"Offset"),e.a.createElement(i.a,{span:14},e.a.createElement(g.a,{min:-50,max:50,step:1,value:this.state.offset,onChange:this.onOffsetChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.offset)))),(t==="block"||t==="async")&&e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:4},"Open"),e.a.createElement(i.a,{span:18},e.a.createElement(L.a,{checked:this.state.open,onChange:this.onOpenChanged}))),t==="async"&&e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:4},"Flip"),e.a.createElement(i.a,{span:18},e.a.createElement(L.a,{checked:this.state.flip,onChange:this.onFlipChanged}))),e.a.createElement(c.a,{align:"middle",style:{borderTop:"1px solid #e9e9e9",paddingTop:12}},e.a.createElement(i.a,null,e.a.createElement("div",null,e.a.createElement(W.a,{checked:this.state.custom,onChange:this.onCustomChanged},"Custom fill and stroke color")))),this.state.custom&&e.a.createElement(e.a.Fragment,null,e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:8},"Fill Color"),e.a.createElement(i.a,{span:12},e.a.createElement(M.a,{type:"color",value:this.state.fill,style:{width:"100%"},onChange:this.onFillChanged}))),e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:8},"Stroke Color"),e.a.createElement(i.a,{span:12},e.a.createElement(M.a,{type:"color",value:this.state.stroke,style:{width:"100%"},onChange:this.onStrokeChanged}))),e.a.createElement(c.a,{align:"middle"},e.a.createElement(i.a,{span:8},"Stroke Width"),e.a.createElement(i.a,{span:12},e.a.createElement(g.a,{min:0,max:5,step:1,value:this.state.strokeWidth,onChange:this.onStrokeWidthChanged})),e.a.createElement(i.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.strokeWidth)))))}}]),l}(e.a.Component),ae=a(116),z=["type"],B=function(p){Object(S.a)(l,p);var r=Object(b.a)(l);function l(){var n;Object(_.a)(this,l);for(var t=arguments.length,d=new Array(t),o=0;o<t;o++)d[o]=arguments[o];return n=r.call.apply(r,[this].concat(d)),n.container=void 0,n.graph=void 0,n.edge=void 0,n.onBackgroundChanged=function(s){var h=s.type,C=Object(N.a)(s,z);n.edge.attr({line:{sourceMarker:{args:C,name:h},targetMarker:{args:C,name:h}}})},n.refContainer=function(s){n.container=s},n}return Object(x.a)(l,[{key:"componentDidMount",value:function(){this.graph=new X.a({container:this.container,grid:!0}),this.edge=this.graph.addEdge({source:[80,160],target:[480,160],attrs:{line:{sourceMarker:"block",targetMarker:"block"}}})}},{key:"render",value:function(){return f.createElement("div",{className:"app"},f.createElement("div",{className:"app-side"},f.createElement(I,{onChange:this.onBackgroundChanged})),f.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),l}(f.Component),H=a(137),G=a(128),J=a(138),Y=a(139),w=a(105),Z=a(97),se=a(119),D=a(120),K=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},$=function(p){Object(S.a)(l,p);var r=Object(b.a)(l);function l(){return Object(_.a)(this,l),r.apply(this,arguments)}return Object(x.a)(l,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(w.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(H.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(w.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(G.a,{component:K}))),e.a.createElement(w.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(J.a,null))),e.a.createElement(w.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(Z.getParameters)(D.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(Y.a,null)))))}}]),l}(e.a.Component),Q=a(131),q=a(98),oe=a(123),O=function(p){Object(S.a)(l,p);var r=Object(b.a)(l);function l(n){var t;return Object(_.a)(this,l),t=r.call(this,n),t.refContainer=function(d){t.container=d},l.restoreIframeSize(),t}return Object(x.a)(l,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){t.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var d=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(d+16,"px"),t.style.border="0",t.style.overflow="hidden",l.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement($,null),this.props.children)}}]),l}(e.a.Component);(function(p){var r=window.location.pathname,l="x6-iframe-size";function n(){var o=localStorage.getItem(l),s;if(o)try{s=JSON.parse(o)}catch(h){}else s={};return s}function t(){var o=window.frameElement;if(o){var s=o.style,h={width:s.width,height:s.height},C=n();C[r]=h,localStorage.setItem(l,JSON.stringify(C))}}p.saveIframeSize=t;function d(){var o=window.frameElement;if(o){var s=n(),h=s[r];h&&(o.style.width=h.width||"100%",o.style.height=h.height||"auto")}}p.restoreIframeSize=d})(O||(O={}));var ie=a(124),ee=function(r){var l=r.children;return e.a.createElement(Q.a.ErrorBoundary,null,e.a.createElement(q.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(O,null,l))};j.a.render(e.a.createElement(ee,null,e.a.createElement(B,null)),document.getElementById("root"))}},[[108,1,2]]]);
