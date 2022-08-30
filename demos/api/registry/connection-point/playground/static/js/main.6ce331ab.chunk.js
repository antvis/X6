(this["webpackJsonp@antv/x6-sites-demos-api.registry.connection-point.playground"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.connection-point.playground"]||[]).push([[0],{102:function(g,p,t){},103:function(g,p,t){"use strict";t.r(p),t.d(p,"host",function(){return A}),t.d(p,"getCodeSandboxParams",function(){return n}),t.d(p,"getStackblitzPrefillConfig",function(){return S});const A="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/connection-point/playground";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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

.ant-radio-wrapper {
  width: 120px;
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
import { Graph, Edge, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private ellipse: Node
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect = graph.addNode({
      x: 160,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
      },
    })

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 460,
      y: 160,
      width: 100,
      height: 40,
      angle: 45,
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'rect', selector: 'outline' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
        outline: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          stroke: '#8e89e5',
          fill: 'none',
        },
      },
    })

    let bbox: Node
    const updateBBox = () => {
      if (bbox) {
        bbox.remove()
      }
      const rect = ellipse.findView(graph)!.getBBox()
      bbox = graph.addNode({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        attrs: {
          body: {
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#ed8661',
            fill: 'none',
          },
        },
      })
    }

    ellipse.on('change:angle', updateBBox)

    updateBBox()

    const edge1 = graph.addEdge({
      source: { x: 100, y: 180 },
      target: { cell: rect.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 180 },
      target: { cell: ellipse.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge1.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 210, y: 180 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })

      edge2.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 485, y: 180 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })
    }

    animate()

    edge1.on('transition:complete', animate)

    this.edge1 = edge1
    this.edge2 = edge2
    this.ellipse = ellipse
  }

  updateBBox() {}

  onAttrsChanged = ({ anchor, connectionPoint, angle }: State) => {
    this.edge1.prop('target/anchor', { name: anchor })
    this.edge1.prop('target/connectionPoint', { name: connectionPoint })
    this.edge2.prop('target/anchonr', { name: anchor })
    this.edge2.prop('target/connectionPoint', { name: connectionPoint })
    this.ellipse.rotate(angle, { absolute: true })
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  anchor: string
  connectionPoint: string
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    anchor: 'center',
    connectionPoint: 'boundary',
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onAnchorChange = (e: any) => {
    this.setState({ anchor: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onConnectionPointChange = (e: any) => {
    this.setState({ connectionPoint: e.target.value }, () => {
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
          <Col span={5}>anchor</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onAnchorChange}
              value={this.state.anchor}
            >
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>connectionPoint</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onConnectionPointChange}
              value={this.state.connectionPoint}
            >
              <Radio value="boundary">boundary</Radio>
              <Radio value="anchor">anchor</Radio>
              <Radio value="bbox">bbox</Radio>
              <Radio value="rect">rect</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>angle</Col>
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
            <div className="slider-value">{this.state.angle}\xB0</div>
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
`,isBinary:!1}}}}function S(){return{title:"api/registry/connection-point/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.ant-radio-wrapper {
  width: 120px;
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
import { Graph, Edge, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private ellipse: Node
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect = graph.addNode({
      x: 160,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
      },
    })

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 460,
      y: 160,
      width: 100,
      height: 40,
      angle: 45,
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'rect', selector: 'outline' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
        outline: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          stroke: '#8e89e5',
          fill: 'none',
        },
      },
    })

    let bbox: Node
    const updateBBox = () => {
      if (bbox) {
        bbox.remove()
      }
      const rect = ellipse.findView(graph)!.getBBox()
      bbox = graph.addNode({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        attrs: {
          body: {
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#ed8661',
            fill: 'none',
          },
        },
      })
    }

    ellipse.on('change:angle', updateBBox)

    updateBBox()

    const edge1 = graph.addEdge({
      source: { x: 100, y: 180 },
      target: { cell: rect.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 180 },
      target: { cell: ellipse.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge1.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 210, y: 180 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })

      edge2.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 485, y: 180 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })
    }

    animate()

    edge1.on('transition:complete', animate)

    this.edge1 = edge1
    this.edge2 = edge2
    this.ellipse = ellipse
  }

  updateBBox() {}

  onAttrsChanged = ({ anchor, connectionPoint, angle }: State) => {
    this.edge1.prop('target/anchor', { name: anchor })
    this.edge1.prop('target/connectionPoint', { name: connectionPoint })
    this.edge2.prop('target/anchonr', { name: anchor })
    this.edge2.prop('target/connectionPoint', { name: connectionPoint })
    this.ellipse.rotate(angle, { absolute: true })
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  anchor: string
  connectionPoint: string
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    anchor: 'center',
    connectionPoint: 'boundary',
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onAnchorChange = (e: any) => {
    this.setState({ anchor: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onConnectionPointChange = (e: any) => {
    this.setState({ connectionPoint: e.target.value }, () => {
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
          <Col span={5}>anchor</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onAnchorChange}
              value={this.state.anchor}
            >
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>connectionPoint</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onConnectionPointChange}
              value={this.state.connectionPoint}
            >
              <Radio value="boundary">boundary</Radio>
              <Radio value="anchor">anchor</Radio>
              <Radio value="bbox">bbox</Radio>
              <Radio value="rect">rect</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>angle</Col>
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
            <div className="slider-value">{this.state.angle}\xB0</div>
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
`}}}},106:function(g,p,t){},108:function(g,p,t){"use strict";t.r(p);var A=t(0),n=t.n(A),S=t(30),k=t.n(S),C=t(2),b=t(3),P=t(5),w=t(6),T=t(87),I=t(112),v=t(57),m=t(40),s=t(116),X=t(113),Q=t(73),j=function(c){Object(P.a)(a,c);var d=Object(w.a)(a);function a(){var e;Object(C.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return e=d.call.apply(d,[this].concat(l)),e.state={anchor:"center",connectionPoint:"boundary",angle:45},e.onAngleChanged=function(i){e.setState({angle:i},function(){e.notifyChange()})},e.onAnchorChange=function(i){e.setState({anchor:i.target.value},function(){e.notifyChange()})},e.onConnectionPointChange=function(i){e.setState({connectionPoint:i.target.value},function(){e.notifyChange()})},e}return Object(b.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return n.a.createElement(I.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(v.a,{align:"middle"},n.a.createElement(m.a,{span:5},"anchor")),n.a.createElement(v.a,{align:"middle"},n.a.createElement(m.a,{span:22,offset:2},n.a.createElement(s.a.Group,{onChange:this.onAnchorChange,value:this.state.anchor},n.a.createElement(s.a,{value:"center"},"center"),n.a.createElement(s.a,{value:"nodeCenter"},"nodeCenter"),n.a.createElement(s.a,{value:"orth"},"orth"),n.a.createElement(s.a,{value:"midSide"},"midSide"),n.a.createElement(s.a,{value:"top"},"top"),n.a.createElement(s.a,{value:"bottom"},"bottom"),n.a.createElement(s.a,{value:"left"},"left"),n.a.createElement(s.a,{value:"right"},"right"),n.a.createElement(s.a,{value:"topLeft"},"topLeft"),n.a.createElement(s.a,{value:"topRight"},"topRight"),n.a.createElement(s.a,{value:"bottomLeft"},"bottomLeft"),n.a.createElement(s.a,{value:"bottomRight"},"bottomRight")))),n.a.createElement(v.a,{align:"middle"},n.a.createElement(m.a,{span:5},"connectionPoint")),n.a.createElement(v.a,{align:"middle"},n.a.createElement(m.a,{span:22,offset:2},n.a.createElement(s.a.Group,{onChange:this.onConnectionPointChange,value:this.state.connectionPoint},n.a.createElement(s.a,{value:"boundary"},"boundary"),n.a.createElement(s.a,{value:"anchor"},"anchor"),n.a.createElement(s.a,{value:"bbox"},"bbox"),n.a.createElement(s.a,{value:"rect"},"rect")))),n.a.createElement(v.a,{align:"middle"},n.a.createElement(m.a,{span:5},"angle"),n.a.createElement(m.a,{span:14},n.a.createElement(X.a,{min:0,max:360,step:1,value:this.state.angle,onChange:this.onAngleChanged})),n.a.createElement(m.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.angle,"\xB0"))))}}]),a}(n.a.Component),$=t(99),B=function(c){Object(P.a)(a,c);var d=Object(w.a)(a);function a(){var e;Object(C.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return e=d.call.apply(d,[this].concat(l)),e.container=void 0,e.ellipse=void 0,e.edge1=void 0,e.edge2=void 0,e.onAttrsChanged=function(i){var u=i.anchor,h=i.connectionPoint,M=i.angle;e.edge1.prop("target/anchor",{name:u}),e.edge1.prop("target/connectionPoint",{name:h}),e.edge2.prop("target/anchonr",{name:u}),e.edge2.prop("target/connectionPoint",{name:h}),e.ellipse.rotate(M,{absolute:!0})},e.refContainer=function(i){e.container=i},e}return Object(b.a)(a,[{key:"componentDidMount",value:function(){var o=new T.a({container:this.container,grid:!0,interacting:!1}),l=o.addNode({x:160,y:160,width:100,height:40,attrs:{body:{strokeWidth:1,stroke:"#31d0c6"}}}),r=o.addNode({shape:"ellipse",x:460,y:160,width:100,height:40,angle:45,markup:[{tagName:"ellipse",selector:"body"},{tagName:"rect",selector:"outline"}],attrs:{body:{refWidth:"100%",refHeight:"100%",strokeWidth:1,stroke:"#31d0c6"},outline:{refWidth:"100%",refHeight:"100%",strokeWidth:1,strokeDasharray:"5 5",stroke:"#8e89e5",fill:"none"}}}),i,u=function(){i&&i.remove();var f=r.findView(o).getBBox();i=o.addNode({x:f.x,y:f.y,width:f.width,height:f.height,attrs:{body:{strokeWidth:1,strokeDasharray:"5 5",stroke:"#ed8661",fill:"none"}}})};r.on("change:angle",u),u();var h=o.addEdge({source:{x:100,y:180},target:{cell:l.id},attrs:{line:{strokeWidth:1,targetMarker:"classic"}}}),M=o.addEdge({source:{x:320,y:180},target:{cell:r.id},attrs:{line:{strokeWidth:1,targetMarker:"classic"}}});function D(){h.transition("source",9.36/60,{duration:5e3,interp:function(f,L){var E=L*(2*Math.PI)-Math.PI/2,x={x:210,y:180},y=120;return function(R){return{x:x.x+y*Math.cos(R*2*Math.PI+E),y:x.y+y*Math.sin(R*2*Math.PI+E)}}}}),M.transition("source",9.36/60,{duration:5e3,interp:function(f,L){var E=L*(2*Math.PI)-Math.PI/2,x={x:485,y:180},y=120;return function(R){return{x:x.x+y*Math.cos(R*2*Math.PI+E),y:x.y+y*Math.sin(R*2*Math.PI+E)}}}})}D(),h.on("transition:complete",D),this.edge1=h,this.edge2=M,this.ellipse=r}},{key:"updateBBox",value:function(){}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(j,{onChange:this.onAttrsChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),V=t(117),z=t(111),W=t(118),H=t(119),U=t(89),G=t(83),q=t(102),O=t(103),F=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},J=function(c){Object(P.a)(a,c);var d=Object(w.a)(a);function a(){return Object(C.a)(this,a),d.apply(this,arguments)}return Object(b.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(V.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(z.a,{component:F}))),n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(W.a,null))),n.a.createElement(U.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(G.getParameters)(O.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(H.a,null)))))}}]),a}(n.a.Component),Y=t(114),Z=t(84),nn=t(106),N=function(c){Object(P.a)(a,c);var d=Object(w.a)(a);function a(e){var o;return Object(C.a)(this,a),o=d.call(this,e),o.refContainer=function(l){o.container=l},a.restoreIframeSize(),o}return Object(b.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){o.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var l=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(l+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(J,null),this.props.children)}}]),a}(n.a.Component);(function(c){var d=window.location.pathname,a="x6-iframe-size";function e(){var r=localStorage.getItem(a),i;if(r)try{i=JSON.parse(r)}catch(u){}else i={};return i}function o(){var r=window.frameElement;if(r){var i=r.style,u={width:i.width,height:i.height},h=e();h[d]=u,localStorage.setItem(a,JSON.stringify(h))}}c.saveIframeSize=o;function l(){var r=window.frameElement;if(r){var i=e(),u=i[d];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}c.restoreIframeSize=l})(N||(N={}));var en=t(107),K=function(d){var a=d.children;return n.a.createElement(Y.a.ErrorBoundary,null,n.a.createElement(Z.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(N,null,a))};k.a.render(n.a.createElement(K,null,n.a.createElement(B,null)),document.getElementById("root"))},91:function(g,p,t){g.exports=t(108)},99:function(g,p,t){}},[[91,1,2]]]);
