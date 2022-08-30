(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.resizing"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.resizing"]||[]).push([[0],{102:function(u,h,t){},103:function(u,h,t){"use strict";t.r(h),t.d(h,"host",function(){return y}),t.d(h,"getCodeSandboxParams",function(){return e}),t.d(h,"getStackblitzPrefillConfig",function(){return w});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/interacting/resizing";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restricted: false,
      preserveAspectRatio: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      resizing: options,
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restricted?: boolean
  preserveAspectRatio?: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    minWidth: 1,
    maxWidth: 200,
    minHeight: 1,
    maxHeight: 150,
    orthogonal: false,
    restricted: false,
    preserveAspectRatio: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinWidthChanged = (minWidth: number) => {
    this.setState({ minWidth }, () => {
      this.notifyChange()
    })
  }

  onMaxWidthChanged = (maxWidth: number) => {
    this.setState({ maxWidth }, () => {
      this.notifyChange()
    })
  }

  onMinHeightChanged = (minHeight: number) => {
    this.setState({ minHeight }, () => {
      this.notifyChange()
    })
  }

  onMaxHeightChanged = (maxHeight: number) => {
    this.setState({ maxHeight }, () => {
      this.notifyChange()
    })
  }

  onOrthogonalChanged = (e: any) => {
    this.setState({ orthogonal: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onRestrictedChanged = (e: any) => {
    this.setState({ restricted: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Resizing Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={this.state.minWidth}
              onChange={this.onMinWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxWidth</Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={this.state.maxWidth}
              onChange={this.onMaxWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={75}
              step={1}
              value={this.state.minHeight}
              onChange={this.onMinHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxHeight</Col>
          <Col span={14}>
            <Slider
              min={75}
              max={150}
              step={1}
              value={this.state.maxHeight}
              onChange={this.onMaxHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.orthogonal}
              onChange={this.onOrthogonalChanged}
            >
              Orthogonal
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.restricted}
              onChange={this.onRestrictedChanged}
            >
              Restricted
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              PreserveAspectRatio
            </Checkbox>
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
`,isBinary:!1}}}}function w(){return{title:"tutorial/intermediate/interacting/resizing",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restricted: false,
      preserveAspectRatio: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      resizing: options,
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restricted?: boolean
  preserveAspectRatio?: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    minWidth: 1,
    maxWidth: 200,
    minHeight: 1,
    maxHeight: 150,
    orthogonal: false,
    restricted: false,
    preserveAspectRatio: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinWidthChanged = (minWidth: number) => {
    this.setState({ minWidth }, () => {
      this.notifyChange()
    })
  }

  onMaxWidthChanged = (maxWidth: number) => {
    this.setState({ maxWidth }, () => {
      this.notifyChange()
    })
  }

  onMinHeightChanged = (minHeight: number) => {
    this.setState({ minHeight }, () => {
      this.notifyChange()
    })
  }

  onMaxHeightChanged = (maxHeight: number) => {
    this.setState({ maxHeight }, () => {
      this.notifyChange()
    })
  }

  onOrthogonalChanged = (e: any) => {
    this.setState({ orthogonal: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onRestrictedChanged = (e: any) => {
    this.setState({ restricted: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Resizing Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={this.state.minWidth}
              onChange={this.onMinWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxWidth</Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={this.state.maxWidth}
              onChange={this.onMaxWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={75}
              step={1}
              value={this.state.minHeight}
              onChange={this.onMinHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxHeight</Col>
          <Col span={14}>
            <Slider
              min={75}
              max={150}
              step={1}
              value={this.state.maxHeight}
              onChange={this.onMaxHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.orthogonal}
              onChange={this.onOrthogonalChanged}
            >
              Orthogonal
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.restricted}
              onChange={this.onRestrictedChanged}
            >
              Restricted
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              PreserveAspectRatio
            </Checkbox>
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
`}}}},106:function(u,h,t){},108:function(u,h,t){"use strict";t.r(h);var y=t(0),e=t.n(y),w=t(31),A=t.n(w),g=t(2),f=t(3),C=t(5),E=t(6),O=t(87),M=t(75),_=t(112),m=t(57),r=t(41),v=t(116),x=t(113),I=t(72),N=function(c){Object(C.a)(a,c);var l=Object(E.a)(a);function a(){var n;Object(g.a)(this,a);for(var s=arguments.length,d=new Array(s),o=0;o<s;o++)d[o]=arguments[o];return n=l.call.apply(l,[this].concat(d)),n.state={enabled:!0,minWidth:1,maxWidth:200,minHeight:1,maxHeight:150,orthogonal:!1,restricted:!1,preserveAspectRatio:!1},n.onEnableChanged=function(i){n.setState({enabled:i.target.checked},function(){n.notifyChange()})},n.onMinWidthChanged=function(i){n.setState({minWidth:i},function(){n.notifyChange()})},n.onMaxWidthChanged=function(i){n.setState({maxWidth:i},function(){n.notifyChange()})},n.onMinHeightChanged=function(i){n.setState({minHeight:i},function(){n.notifyChange()})},n.onMaxHeightChanged=function(i){n.setState({maxHeight:i},function(){n.notifyChange()})},n.onOrthogonalChanged=function(i){n.setState({orthogonal:i.target.checked},function(){n.notifyChange()})},n.onRestrictedChanged=function(i){n.setState({restricted:i.target.checked},function(){n.notifyChange()})},n.onPreserveAspectRatioChanged=function(i){n.setState({preserveAspectRatio:i.target.checked},function(){n.notifyChange()})},n}return Object(f.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(Object(M.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(_.a,{title:"Resizing Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.enabled,onChange:this.onEnableChanged},"Enabled"))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:6},"minWidth"),e.a.createElement(r.a,{span:14},e.a.createElement(x.a,{min:1,max:100,step:1,value:this.state.minWidth,onChange:this.onMinWidthChanged})),e.a.createElement(r.a,{span:2},e.a.createElement("div",{className:"slider-value"},this.state.minWidth))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:6},"maxWidth"),e.a.createElement(r.a,{span:14},e.a.createElement(x.a,{min:100,max:200,step:1,value:this.state.maxWidth,onChange:this.onMaxWidthChanged})),e.a.createElement(r.a,{span:2},e.a.createElement("div",{className:"slider-value"},this.state.maxWidth))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:6},"minHeight"),e.a.createElement(r.a,{span:14},e.a.createElement(x.a,{min:1,max:75,step:1,value:this.state.minHeight,onChange:this.onMinHeightChanged})),e.a.createElement(r.a,{span:2},e.a.createElement("div",{className:"slider-value"},this.state.minHeight))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:6},"maxHeight"),e.a.createElement(r.a,{span:14},e.a.createElement(x.a,{min:75,max:150,step:1,value:this.state.maxHeight,onChange:this.onMaxHeightChanged})),e.a.createElement(r.a,{span:2},e.a.createElement("div",{className:"slider-value"},this.state.maxHeight))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.orthogonal,onChange:this.onOrthogonalChanged},"Orthogonal"))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.restricted,onChange:this.onRestrictedChanged},"Restricted"))),e.a.createElement(m.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.preserveAspectRatio,onChange:this.onPreserveAspectRatioChanged},"PreserveAspectRatio"))))}}]),a}(e.a.Component),B=t(99),P=function(c){Object(C.a)(a,c);var l=Object(E.a)(a);function a(){var n;Object(g.a)(this,a);for(var s=arguments.length,d=new Array(s),o=0;o<s;o++)d[o]=arguments[o];return n=l.call.apply(l,[this].concat(d)),n.container=void 0,n.graph=void 0,n.initGraph=function(i){n.graph&&n.graph.dispose(),n.graph=new O.a({container:n.container,grid:{visible:!0},resizing:i});var p=n.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),R=n.graph.addNode({shape:"circle",x:160,y:180,width:60,height:60,label:"World"});n.graph.addEdge({source:p,target:R})},n.onSettingChanged=function(i){n.initGraph(i)},n.refContainer=function(i){n.container=i},n}return Object(f.a)(a,[{key:"componentDidMount",value:function(){this.initGraph({enabled:!0,minWidth:1,maxWidth:200,minHeight:1,maxHeight:150,orthogonal:!1,restricted:!1,preserveAspectRatio:!1})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(N,{onChange:this.onSettingChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),H=t(117),L=t(111),D=t(118),W=t(119),b=t(89),k=t(83),G=t(102),S=t(103),j=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},X=function(c){Object(C.a)(a,c);var l=Object(E.a)(a);function a(){return Object(g.a)(this,a),l.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(H.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,{component:j}))),e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,null))),e.a.createElement(b.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(k.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(W.a,null)))))}}]),a}(e.a.Component),T=t(114),z=t(84),F=t(106),U=function(c){Object(C.a)(a,c);var l=Object(E.a)(a);function a(n){var s;return Object(g.a)(this,a),s=l.call(this,n),s.refContainer=function(d){s.container=d},a.restoreIframeSize(),s}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){s.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var d=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(d+16,"px"),s.style.border="0",s.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(X,null),this.props.children)}}]),a}(e.a.Component);(function(c){var l=window.location.pathname,a="x6-iframe-size";function n(){var o=localStorage.getItem(a),i;if(o)try{i=JSON.parse(o)}catch(p){}else i={};return i}function s(){var o=window.frameElement;if(o){var i=o.style,p={width:i.width,height:i.height},R=n();R[l]=p,localStorage.setItem(a,JSON.stringify(R))}}c.saveIframeSize=s;function d(){var o=window.frameElement;if(o){var i=n(),p=i[l];p&&(o.style.width=p.width||"100%",o.style.height=p.height||"auto")}}c.restoreIframeSize=d})(U||(U={}));var J=t(107),V=function(l){var a=l.children;return e.a.createElement(T.a.ErrorBoundary,null,e.a.createElement(z.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(U,null,a))};A.a.render(e.a.createElement(V,null,e.a.createElement(P,null)),document.getElementById("root"))},91:function(u,h,t){u.exports=t(108)},99:function(u,h,t){}},[[91,1,2]]]);
