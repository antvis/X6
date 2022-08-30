(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.scroller.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.scroller.playground"]||[]).push([[0],{101:function(u,c,t){},104:function(u,c,t){},105:function(u,c,t){"use strict";t.r(c),t.d(c,"host",function(){return y}),t.d(c,"getCodeSandboxParams",function(){return n}),t.d(c,"getStackblitzPrefillConfig",function(){return R});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/scroller/playground";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-main {
  width: 600px;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  flex-direction: column;
}

.app-btns {
  padding-top: 4px;
  padding-bottom: 12px;
  display: flex;
}

.app-btns .ant-btn {
  flex: 1;
  margin-right: 16px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
}

.x6-graph-scroller {
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
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

const data: any = {
  hello: {
    id: 'hello',
    x: 32,
    y: 32,
    width: 100,
    height: 40,
    label: 'Hello',
  },
  world: {
    id: 'world',
    shape: 'circle',
    x: 160,
    y: 180,
    width: 60,
    height: 60,
    label: 'World',
  },
  rect: {
    id: 'rect',
    x: -60,
    y: 100,
    width: 100,
    height: 40,
    label: 'Rect',
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.renderGraph()
  }

  renderGraph(options: State | null = null) {
    let offset
    if (this.graph) {
      offset = this.graph.getScrollbarPosition()
      this.graph.dispose()
    }

    const graph = new Graph({
      container: this.container,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        ...options,
      },
    })

    graph.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) })

    graph.on('node:change:position', ({ node, current }) => {
      const item = data[node.id]
      item.x = current!.x
      item.y = current!.y
    })

    if (offset) {
      graph.setScrollbarPosition(offset.left, offset.top)
    } else {
      graph.center()
    }

    this.graph = graph
  }

  onSettingsChanged = (options: State) => {
    this.renderGraph(options)
  }

  onCenter = () => {
    this.graph.center()
  }

  onCenterContent = () => {
    this.graph.centerContent()
  }

  onCenterCircle = () => {
    const circle = this.graph.getCellById('world')
    if (circle) {
      this.graph.centerCell(circle)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className="app-main">
          <div className="app-btns">
            <Button onClick={this.onCenter}>Center Graph</Button>
            <Button onClick={this.onCenterContent}>Center Whole Content</Button>
            <Button onClick={this.onCenterCircle}>Center The Circle</Button>
          </div>
          <div className="app-content" ref={this.refContainer} />
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  pannable: boolean
  pageVisible: boolean
  pageBreak: boolean
  autoResize: boolean
  minVisibleWidth: number
  minVisibleHeight: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    pannable: true,
    pageVisible: true,
    pageBreak: true,
    autoResize: true,
    minVisibleWidth: 50,
    minVisibleHeight: 50,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPanningChanged = (e: any) => {
    this.setState({ pannable: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onAutoResizeChanged = (e: any) => {
    this.setState({ autoResize: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageVisibleChanged = (e: any) => {
    this.setState({ pageVisible: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageBreakChanged = (e: any) => {
    this.setState({ pageBreak: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleWidthChanged = (minVisibleWidth: number) => {
    this.setState({ minVisibleWidth }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleHeightChanged = (minVisibleHeight: number) => {
    this.setState({ minVisibleHeight }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scroller Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pannable}
              onChange={this.onPanningChanged}
            >
              Enable Panning
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.autoResize}
              onChange={this.onAutoResizeChanged}
            >
              Enable Auto Resize
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageVisible}
              onChange={this.onPageVisibleChanged}
            >
              Show Page
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageBreak}
              onChange={this.onPageBreakChanged}
            >
              Show Page Break
            </Checkbox>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Width
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleWidth}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleWidth}
              onChange={this.onMinVisibleWidthChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Height
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleHeight}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleHeight}
              onChange={this.onMinVisibleHeightChanged}
            />
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
`,isBinary:!1}}}}function R(){return{title:"tutorial/basic/scroller/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-main {
  width: 600px;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  flex-direction: column;
}

.app-btns {
  padding-top: 4px;
  padding-bottom: 12px;
  display: flex;
}

.app-btns .ant-btn {
  flex: 1;
  margin-right: 16px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
}

.x6-graph-scroller {
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
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

const data: any = {
  hello: {
    id: 'hello',
    x: 32,
    y: 32,
    width: 100,
    height: 40,
    label: 'Hello',
  },
  world: {
    id: 'world',
    shape: 'circle',
    x: 160,
    y: 180,
    width: 60,
    height: 60,
    label: 'World',
  },
  rect: {
    id: 'rect',
    x: -60,
    y: 100,
    width: 100,
    height: 40,
    label: 'Rect',
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.renderGraph()
  }

  renderGraph(options: State | null = null) {
    let offset
    if (this.graph) {
      offset = this.graph.getScrollbarPosition()
      this.graph.dispose()
    }

    const graph = new Graph({
      container: this.container,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        ...options,
      },
    })

    graph.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) })

    graph.on('node:change:position', ({ node, current }) => {
      const item = data[node.id]
      item.x = current!.x
      item.y = current!.y
    })

    if (offset) {
      graph.setScrollbarPosition(offset.left, offset.top)
    } else {
      graph.center()
    }

    this.graph = graph
  }

  onSettingsChanged = (options: State) => {
    this.renderGraph(options)
  }

  onCenter = () => {
    this.graph.center()
  }

  onCenterContent = () => {
    this.graph.centerContent()
  }

  onCenterCircle = () => {
    const circle = this.graph.getCellById('world')
    if (circle) {
      this.graph.centerCell(circle)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className="app-main">
          <div className="app-btns">
            <Button onClick={this.onCenter}>Center Graph</Button>
            <Button onClick={this.onCenterContent}>Center Whole Content</Button>
            <Button onClick={this.onCenterCircle}>Center The Circle</Button>
          </div>
          <div className="app-content" ref={this.refContainer} />
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  pannable: boolean
  pageVisible: boolean
  pageBreak: boolean
  autoResize: boolean
  minVisibleWidth: number
  minVisibleHeight: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    pannable: true,
    pageVisible: true,
    pageBreak: true,
    autoResize: true,
    minVisibleWidth: 50,
    minVisibleHeight: 50,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPanningChanged = (e: any) => {
    this.setState({ pannable: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onAutoResizeChanged = (e: any) => {
    this.setState({ autoResize: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageVisibleChanged = (e: any) => {
    this.setState({ pageVisible: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageBreakChanged = (e: any) => {
    this.setState({ pageBreak: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleWidthChanged = (minVisibleWidth: number) => {
    this.setState({ minVisibleWidth }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleHeightChanged = (minVisibleHeight: number) => {
    this.setState({ minVisibleHeight }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scroller Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pannable}
              onChange={this.onPanningChanged}
            >
              Enable Panning
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.autoResize}
              onChange={this.onAutoResizeChanged}
            >
              Enable Auto Resize
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageVisible}
              onChange={this.onPageVisibleChanged}
            >
              Show Page
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageBreak}
              onChange={this.onPageBreakChanged}
            >
              Show Page Break
            </Checkbox>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Width
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleWidth}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleWidth}
              onChange={this.onMinVisibleWidthChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Height
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleHeight}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleHeight}
              onChange={this.onMinVisibleHeightChanged}
            />
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
`}}}},108:function(u,c,t){},110:function(u,c,t){"use strict";t.r(c);var y=t(0),n=t.n(y),R=t(31),O=t.n(R),V=t(62),f=t(2),C=t(3),b=t(5),E=t(6),w=t(118),M=t(89),N=t(114),h=t(59),p=t(42),v=t(119),k=t(115),J=t(75),L=function(d){Object(b.a)(i,d);var l=Object(E.a)(i);function i(){var e;Object(f.a)(this,i);for(var s=arguments.length,r=new Array(s),o=0;o<s;o++)r[o]=arguments[o];return e=l.call.apply(l,[this].concat(r)),e.state={pannable:!0,pageVisible:!0,pageBreak:!0,autoResize:!0,minVisibleWidth:50,minVisibleHeight:50},e.onPanningChanged=function(a){e.setState({pannable:a.target.checked},function(){e.notifyChange()})},e.onAutoResizeChanged=function(a){e.setState({autoResize:a.target.checked},function(){e.notifyChange()})},e.onPageVisibleChanged=function(a){e.setState({pageVisible:a.target.checked},function(){e.notifyChange()})},e.onPageBreakChanged=function(a){e.setState({pageBreak:a.target.checked},function(){e.notifyChange()})},e.onMinVisibleWidthChanged=function(a){e.setState({minVisibleWidth:a},function(){e.notifyChange()})},e.onMinVisibleHeightChanged=function(a){e.setState({minVisibleHeight:a},function(){e.notifyChange()})},e}return Object(C.a)(i,[{key:"notifyChange",value:function(){this.props.onChange(Object(V.a)({},this.state))}},{key:"render",value:function(){return n.a.createElement(N.a,{title:"Scroller Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(h.a,{align:"middle"},n.a.createElement(p.a,{span:24},n.a.createElement(v.a,{checked:this.state.pannable,onChange:this.onPanningChanged},"Enable Panning"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(p.a,{span:24},n.a.createElement(v.a,{checked:this.state.autoResize,onChange:this.onAutoResizeChanged},"Enable Auto Resize"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(p.a,{span:24},n.a.createElement(v.a,{checked:this.state.pageVisible,onChange:this.onPageVisibleChanged},"Show Page"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(p.a,{span:24},n.a.createElement(v.a,{checked:this.state.pageBreak,onChange:this.onPageBreakChanged},"Show Page Break"))),n.a.createElement(h.a,{align:"middle",style:{borderTop:"1px solid #f0f0f0",paddingTop:16,marginBottom:0}},n.a.createElement(p.a,{span:10,offset:1},"Min Visible Width"),n.a.createElement(p.a,{span:2,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.minVisibleWidth))),n.a.createElement(h.a,{align:"middle",style:{marginTop:0}},n.a.createElement(p.a,{span:22,offset:1},n.a.createElement(k.a,{min:10,max:200,step:1,value:this.state.minVisibleWidth,onChange:this.onMinVisibleWidthChanged}))),n.a.createElement(h.a,{align:"middle",style:{borderTop:"1px solid #f0f0f0",paddingTop:16,marginBottom:0}},n.a.createElement(p.a,{span:10,offset:1},"Min Visible Height"),n.a.createElement(p.a,{span:2,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.minVisibleHeight))),n.a.createElement(h.a,{align:"middle",style:{marginTop:0}},n.a.createElement(p.a,{span:22,offset:1},n.a.createElement(k.a,{min:10,max:200,step:1,value:this.state.minVisibleHeight,onChange:this.onMinVisibleHeightChanged}))))}}]),i}(n.a.Component),F=t(101),S={hello:{id:"hello",x:32,y:32,width:100,height:40,label:"Hello"},world:{id:"world",shape:"circle",x:160,y:180,width:60,height:60,label:"World"},rect:{id:"rect",x:-60,y:100,width:100,height:40,label:"Rect"}},D=function(d){Object(b.a)(i,d);var l=Object(E.a)(i);function i(){var e;Object(f.a)(this,i);for(var s=arguments.length,r=new Array(s),o=0;o<s;o++)r[o]=arguments[o];return e=l.call.apply(l,[this].concat(r)),e.container=void 0,e.graph=void 0,e.onSettingsChanged=function(a){e.renderGraph(a)},e.onCenter=function(){e.graph.center()},e.onCenterContent=function(){e.graph.centerContent()},e.onCenterCircle=function(){var a=e.graph.getCellById("world");a&&e.graph.centerCell(a)},e.refContainer=function(a){e.container=a},e}return Object(C.a)(i,[{key:"componentDidMount",value:function(){this.renderGraph()}},{key:"renderGraph",value:function(){var s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:null,r;this.graph&&(r=this.graph.getScrollbarPosition(),this.graph.dispose());var o=new M.a({container:this.container,grid:{visible:!0},scroller:Object(V.a)({enabled:!0,pageVisible:!0,pageBreak:!0,pannable:!0},s)});o.fromJSON({nodes:Object.keys(S).map(function(a){return S[a]})}),o.on("node:change:position",function(a){var m=a.node,g=a.current,A=S[m.id];A.x=g.x,A.y=g.y}),r?o.setScrollbarPosition(r.left,r.top):o.center(),this.graph=o}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(L,{onChange:this.onSettingsChanged})),n.a.createElement("div",{className:"app-main"},n.a.createElement("div",{className:"app-btns"},n.a.createElement(w.a,{onClick:this.onCenter},"Center Graph"),n.a.createElement(w.a,{onClick:this.onCenterContent},"Center Whole Content"),n.a.createElement(w.a,{onClick:this.onCenterCircle},"Center The Circle")),n.a.createElement("div",{className:"app-content",ref:this.refContainer})))}}]),i}(n.a.Component),T=t(120),B=t(113),_=t(121),j=t(122),x=t(91),X=t(85),Y=t(104),P=t(105),z=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},H=function(d){Object(b.a)(i,d);var l=Object(E.a)(i);function i(){return Object(f.a)(this,i),l.apply(this,arguments)}return Object(C.a)(i,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(T.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(B.a,{component:z}))),n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(P.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(_.a,null))),n.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(X.getParameters)(P.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(j.a,null)))))}}]),i}(n.a.Component),I=t(116),W=t(86),Z=t(108),U=function(d){Object(b.a)(i,d);var l=Object(E.a)(i);function i(e){var s;return Object(f.a)(this,i),s=l.call(this,e),s.refContainer=function(r){s.container=r},i.restoreIframeSize(),s}return Object(C.a)(i,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){s.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var r=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(r+16,"px"),s.style.border="0",s.style.overflow="hidden",i.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(H,null),this.props.children)}}]),i}(n.a.Component);(function(d){var l=window.location.pathname,i="x6-iframe-size";function e(){var o=localStorage.getItem(i),a;if(o)try{a=JSON.parse(o)}catch(m){}else a={};return a}function s(){var o=window.frameElement;if(o){var a=o.style,m={width:a.width,height:a.height},g=e();g[l]=m,localStorage.setItem(i,JSON.stringify(g))}}d.saveIframeSize=s;function r(){var o=window.frameElement;if(o){var a=e(),m=a[l];m&&(o.style.width=m.width||"100%",o.style.height=m.height||"auto")}}d.restoreIframeSize=r})(U||(U={}));var K=t(109),G=function(l){var i=l.children;return n.a.createElement(I.a.ErrorBoundary,null,n.a.createElement(W.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(U,null,i))};O.a.render(n.a.createElement(G,null,n.a.createElement(D,null)),document.getElementById("root"))},93:function(u,c,t){u.exports=t(110)}},[[93,1,2]]]);
