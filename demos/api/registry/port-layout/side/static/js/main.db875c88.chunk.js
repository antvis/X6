(this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.side"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.side"]||[]).push([[0],{101:function(m,p,t){},104:function(m,p,t){},105:function(m,p,t){"use strict";t.r(p),t.d(p,"host",function(){return R}),t.d(p,"getCodeSandboxParams",function(){return n}),t.d(p,"getStackblitzPrefillConfig",function(){return b});const R="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/port-layout/side";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

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
      x: 160,
      y: 110,
      width: 280,
      height: 120,
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
        label: { text: 'left' },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'left',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ position, strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: position,
      args: { strict },
    })
    this.node.attr('label/text', position)
    this.node.portProp('port2', { args } as any)
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
import { Radio, Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  strict: boolean
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    strict: false,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
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

  onStrictChange = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            position
          </Col>
          <Col span={12}>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio value={'left'}>left</Radio>
              <Radio value={'right'}>right</Radio>
              <Radio value={'top'}>top</Radio>
              <Radio value={'bottom'}>bottom</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            strict
          </Col>
          <Col span={14}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
`,isBinary:!1}}}}function b(){return{title:"api/registry/port-layout/side",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

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
      x: 160,
      y: 110,
      width: 280,
      height: 120,
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
        label: { text: 'left' },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'left',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ position, strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: position,
      args: { strict },
    })
    this.node.attr('label/text', position)
    this.node.portProp('port2', { args } as any)
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
import { Radio, Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  strict: boolean
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    strict: false,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
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

  onStrictChange = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            position
          </Col>
          <Col span={12}>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio value={'left'}>left</Radio>
              <Radio value={'right'}>right</Radio>
              <Radio value={'top'}>top</Radio>
              <Radio value={'bottom'}>bottom</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            strict
          </Col>
          <Col span={14}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
`}}}},108:function(m,p,t){},110:function(m,p,t){"use strict";t.r(p);var R=t(0),n=t.n(R),b=t(30),S=t.n(b),O=t(91),f=t(2),E=t(3),v=t(5),x=t(6),D=t(88),N=t(114),g=t(58),l=t(41),h=t(118),L=t(119),A=t(115),F=t(74),P=function(c){Object(v.a)(a,c);var r=Object(x.a)(a);function a(){var e;Object(f.a)(this,a);for(var o=arguments.length,d=new Array(o),s=0;s<o;s++)d[s]=arguments[s];return e=r.call.apply(r,[this].concat(d)),e.state={position:"left",strict:!1,dx:0,dy:0,angle:45},e.onDxChanged=function(i){e.setState({dx:i},function(){e.notifyChange()})},e.onDyChanged=function(i){e.setState({dy:i},function(){e.notifyChange()})},e.onAngleChanged=function(i){e.setState({angle:i},function(){e.notifyChange()})},e.onStrictChange=function(i){e.setState({strict:i},function(){e.notifyChange()})},e.onPositionChange=function(i){e.setState({position:i.target.value},function(){e.notifyChange()})},e}return Object(E.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return n.a.createElement(N.a,{title:"Args",size:"small",bordered:!1,style:{width:320}},n.a.createElement(g.a,{align:"middle"},n.a.createElement(l.a,{span:6,style:{textAlign:"right",paddingRight:16}},"position"),n.a.createElement(l.a,{span:12},n.a.createElement(h.a.Group,{value:this.state.position,onChange:this.onPositionChange},n.a.createElement(h.a,{value:"left"},"left"),n.a.createElement(h.a,{value:"right"},"right"),n.a.createElement(h.a,{value:"top"},"top"),n.a.createElement(h.a,{value:"bottom"},"bottom")))),n.a.createElement(g.a,{align:"middle",style:{borderBottom:"1px solid #f0f0f0",paddingBottom:24}},n.a.createElement(l.a,{span:6,style:{textAlign:"right",paddingRight:16}},"strict"),n.a.createElement(l.a,{span:14},n.a.createElement(L.a,{checked:this.state.strict,onChange:this.onStrictChange}))),n.a.createElement(g.a,{align:"middle"},n.a.createElement(l.a,{span:6,style:{textAlign:"right",paddingRight:16}},"dx"),n.a.createElement(l.a,{span:14},n.a.createElement(A.a,{min:-10,max:10,step:1,value:this.state.dx,onChange:this.onDxChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.dx))),n.a.createElement(g.a,{align:"middle"},n.a.createElement(l.a,{span:6,style:{textAlign:"right",paddingRight:16}},"dy"),n.a.createElement(l.a,{span:14},n.a.createElement(A.a,{min:-10,max:10,step:1,value:this.state.dy,onChange:this.onDyChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.dy))),n.a.createElement(g.a,{align:"middle"},n.a.createElement(l.a,{span:6,style:{textAlign:"right",paddingRight:16}},"angle"),n.a.createElement(l.a,{span:14},n.a.createElement(A.a,{min:0,max:360,step:1,value:this.state.angle,onChange:this.onAngleChanged})),n.a.createElement(l.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.angle))))}}]),a}(n.a.Component),J=t(101),M=["position","strict"],j=function(c){Object(v.a)(a,c);var r=Object(x.a)(a);function a(){var e;Object(f.a)(this,a);for(var o=arguments.length,d=new Array(o),s=0;s<o;s++)d[s]=arguments[s];return e=r.call.apply(r,[this].concat(d)),e.container=void 0,e.node=void 0,e.onAttrsChanged=function(i){var u=i.position,y=i.strict,G=Object(O.a)(i,M);e.node.prop("ports/groups/group1/position",{name:u,args:{strict:y}}),e.node.attr("label/text",u),e.node.portProp("port2",{args:G})},e.refContainer=function(i){e.container=i},e}return Object(E.a)(a,[{key:"componentDidMount",value:function(){var o=new D.a({container:this.container,grid:{visible:!0}});this.node=o.addNode({x:160,y:110,width:280,height:120,attrs:{body:{refWidth:"100%",refHeight:"100%",fill:"#fff",stroke:"#000",strokeWidth:1},label:{text:"left"}},ports:{groups:{group1:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"},text:{fontSize:12,fill:"#888"}},position:{name:"left"}}},items:[{id:"port1",group:"group1"},{id:"port2",group:"group1",args:{angle:45},markup:[{tagName:"path",selector:"path"}],attrs:{path:{d:"M -6 -8 L 0 8 L 6 -8 Z",magnet:!0,fill:"red"}}},{id:"port3",group:"group1",args:{}}]}})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(P,{onChange:this.onAttrsChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),X=t(120),_=t(113),T=t(121),z=t(122),C=t(90),V=t(84),Y=t(104),w=t(105),I=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},k=function(c){Object(v.a)(a,c);var r=Object(x.a)(a);function a(){return Object(f.a)(this,a),r.apply(this,arguments)}return Object(E.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(X.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(_.a,{component:I}))),n.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(T.a,null))),n.a.createElement(C.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(w.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(z.a,null)))))}}]),a}(n.a.Component),B=t(116),H=t(85),Z=t(108),U=function(c){Object(v.a)(a,c);var r=Object(x.a)(a);function a(e){var o;return Object(f.a)(this,a),o=r.call(this,e),o.refContainer=function(d){o.container=d},a.restoreIframeSize(),o}return Object(E.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){o.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var d=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(d+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(k,null),this.props.children)}}]),a}(n.a.Component);(function(c){var r=window.location.pathname,a="x6-iframe-size";function e(){var s=localStorage.getItem(a),i;if(s)try{i=JSON.parse(s)}catch(u){}else i={};return i}function o(){var s=window.frameElement;if(s){var i=s.style,u={width:i.width,height:i.height},y=e();y[r]=u,localStorage.setItem(a,JSON.stringify(y))}}c.saveIframeSize=o;function d(){var s=window.frameElement;if(s){var i=e(),u=i[r];u&&(s.style.width=u.width||"100%",s.style.height=u.height||"auto")}}c.restoreIframeSize=d})(U||(U={}));var K=t(109),W=function(r){var a=r.children;return n.a.createElement(B.a.ErrorBoundary,null,n.a.createElement(H.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(U,null,a))};S.a.render(n.a.createElement(W,null,n.a.createElement(j,null)),document.getElementById("root"))},93:function(m,p,t){m.exports=t(110)}},[[93,1,2]]]);
