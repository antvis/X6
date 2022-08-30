(this["webpackJsonp@antv/x6-sites-demos-api.registry.router.er"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.router.er"]||[]).push([[0],{100:function(f,u,n){},103:function(f,u,n){},104:function(f,u,n){"use strict";n.r(u),n.d(u,"host",function(){return R}),n.d(u,"getCodeSandboxParams",function(){return e}),n.d(u,"getStackblitzPrefillConfig",function(){return y});const R="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/router/er";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 240,
      y: 150,
      width: 100,
      height: 40,
      label: 'world',
    })

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })
  }

  getERArgs(state: State) {
    const { center, offset, min, direction } = state
    return {
      min,
      direction: direction ? direction : undefined,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    console.log(this.getERArgs(state))
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
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
import { Switch, Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  direction: '' | 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
  direction: '',
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCenterChanged = (center: boolean) => {
    this.setState({ center }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onMinChanged = (min: number) => {
    this.setState({ min }, () => {
      this.notifyChange()
    })
  }

  onDirectionChanged = (e: any) => {
    const direction = e.target.value
    this.setState({ direction }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Options"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="number"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}></Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              disabled={this.state.center}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>min</Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              value={this.state.min}
              onChange={this.onMinChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.min}</div>
          </Col>
        </Row>
        <Row align="top">
          <Col span={6}>direction</Col>
          <Col span={14}>
            <Radio.Group
              name="direction"
              value={this.state.direction}
              onChange={this.onDirectionChanged}
            >
              <Radio value="" style={{ display: 'block', marginBottom: 8 }}>
                NONE
              </Radio>
              <Radio value="L" style={{ marginBottom: 8 }}>
                L
              </Radio>
              <Radio value="R">R</Radio>
              <Radio value="H">H</Radio>
              <Radio value="T">T</Radio>
              <Radio value="B">B</Radio>
              <Radio value="V">V</Radio>
            </Radio.Group>
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
`,isBinary:!1}}}}function y(){return{title:"api/registry/router/er",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 240,
      y: 150,
      width: 100,
      height: 40,
      label: 'world',
    })

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })
  }

  getERArgs(state: State) {
    const { center, offset, min, direction } = state
    return {
      min,
      direction: direction ? direction : undefined,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    console.log(this.getERArgs(state))
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
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
import { Switch, Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  direction: '' | 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
  direction: '',
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCenterChanged = (center: boolean) => {
    this.setState({ center }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onMinChanged = (min: number) => {
    this.setState({ min }, () => {
      this.notifyChange()
    })
  }

  onDirectionChanged = (e: any) => {
    const direction = e.target.value
    this.setState({ direction }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Options"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="number"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}></Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              disabled={this.state.center}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>min</Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              value={this.state.min}
              onChange={this.onMinChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.min}</div>
          </Col>
        </Row>
        <Row align="top">
          <Col span={6}>direction</Col>
          <Col span={14}>
            <Radio.Group
              name="direction"
              value={this.state.direction}
              onChange={this.onDirectionChanged}
            >
              <Radio value="" style={{ display: 'block', marginBottom: 8 }}>
                NONE
              </Radio>
              <Radio value="L" style={{ marginBottom: 8 }}>
                L
              </Radio>
              <Radio value="R">R</Radio>
              <Radio value="H">H</Radio>
              <Radio value="T">T</Radio>
              <Radio value="B">B</Radio>
              <Radio value="V">V</Radio>
            </Radio.Group>
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
`}}}},107:function(f,u,n){},109:function(f,u,n){"use strict";n.r(u);var R=n(0),e=n.n(R),y=n(30),S=n.n(y),h=n(2),g=n(3),E=n(5),v=n(6),L=n(88),N=n(113),C=n(58),m=n(41),D=n(117),w=n(114),p=n(118),G=n(74),U={offset:32,min:16,center:!1,direction:""},M=function(d){Object(E.a)(o,d);var l=Object(v.a)(o);function o(){var t;Object(h.a)(this,o);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return t=l.call.apply(l,[this].concat(i)),t.state=U,t.onCenterChanged=function(s){t.setState({center:s},function(){t.notifyChange()})},t.onOffsetChanged=function(s){t.setState({offset:s},function(){t.notifyChange()})},t.onMinChanged=function(s){t.setState({min:s},function(){t.notifyChange()})},t.onDirectionChanged=function(s){var c=s.target.value;t.setState({direction:c},function(){t.notifyChange()})},t}return Object(g.a)(o,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(N.a,{title:"Options",size:"small",bordered:!1,style:{width:320}},e.a.createElement(C.a,{align:"middle"},e.a.createElement(m.a,{span:6},"offset"),e.a.createElement(m.a,{span:14},e.a.createElement(D.a,{checkedChildren:"center",unCheckedChildren:"number",checked:this.state.center,onChange:this.onCenterChanged}))),e.a.createElement(C.a,{align:"middle"},e.a.createElement(m.a,{span:6}),e.a.createElement(m.a,{span:14},e.a.createElement(w.a,{min:8,max:64,step:1,disabled:this.state.center,value:this.state.offset,onChange:this.onOffsetChanged})),e.a.createElement(m.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.offset))),e.a.createElement(C.a,{align:"middle"},e.a.createElement(m.a,{span:6},"min"),e.a.createElement(m.a,{span:14},e.a.createElement(w.a,{min:8,max:64,step:1,value:this.state.min,onChange:this.onMinChanged})),e.a.createElement(m.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.min))),e.a.createElement(C.a,{align:"top"},e.a.createElement(m.a,{span:6},"direction"),e.a.createElement(m.a,{span:14},e.a.createElement(p.a.Group,{name:"direction",value:this.state.direction,onChange:this.onDirectionChanged},e.a.createElement(p.a,{value:"",style:{display:"block",marginBottom:8}},"NONE"),e.a.createElement(p.a,{value:"L",style:{marginBottom:8}},"L"),e.a.createElement(p.a,{value:"R"},"R"),e.a.createElement(p.a,{value:"H"},"H"),e.a.createElement(p.a,{value:"T"},"T"),e.a.createElement(p.a,{value:"B"},"B"),e.a.createElement(p.a,{value:"V"},"V")))))}}]),o}(e.a.Component),F=n(100),T=function(d){Object(E.a)(o,d);var l=Object(v.a)(o);function o(){var t;Object(h.a)(this,o);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return t=l.call.apply(l,[this].concat(i)),t.container=void 0,t.edge=void 0,t.updateConnection=function(s){console.log(t.getERArgs(s)),t.edge.prop("router/args",t.getERArgs(s))},t.refContainer=function(s){t.container=s},t}return Object(g.a)(o,[{key:"componentDidMount",value:function(){var a=new L.a({container:this.container,grid:!0}),i=a.addNode({x:40,y:30,width:100,height:40,label:"hello"}),r=a.addNode({x:240,y:150,width:100,height:40,label:"world"});this.edge=a.addEdge({source:i,target:r,router:{name:"er",args:this.getERArgs(U)}})}},{key:"getERArgs",value:function(a){var i=a.center,r=a.offset,s=a.min,c=a.direction;return{min:s,direction:c||void 0,offset:i?"center":r}}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-left"},e.a.createElement(M,{onChange:this.updateConnection})),e.a.createElement("div",{ref:this.refContainer,className:"app-content"}))}}]),o}(e.a.Component),P=n(119),X=n(112),j=n(120),_=n(121),x=n(90),V=n(84),J=n(103),O=n(104),z=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},B=function(d){Object(E.a)(o,d);var l=Object(v.a)(o);function o(){return Object(h.a)(this,o),l.apply(this,arguments)}return Object(g.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(P.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(X.a,{component:z}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(O.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(_.a,null)))))}}]),o}(e.a.Component),I=n(115),k=n(85),Y=n(107),b=function(d){Object(E.a)(o,d);var l=Object(v.a)(o);function o(t){var a;return Object(h.a)(this,o),a=l.call(this,t),a.refContainer=function(i){a.container=i},o.restoreIframeSize(),a}return Object(g.a)(o,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(B,null),this.props.children)}}]),o}(e.a.Component);(function(d){var l=window.location.pathname,o="x6-iframe-size";function t(){var r=localStorage.getItem(o),s;if(r)try{s=JSON.parse(r)}catch(c){}else s={};return s}function a(){var r=window.frameElement;if(r){var s=r.style,c={width:s.width,height:s.height},A=t();A[l]=c,localStorage.setItem(o,JSON.stringify(A))}}d.saveIframeSize=a;function i(){var r=window.frameElement;if(r){var s=t(),c=s[l];c&&(r.style.width=c.width||"100%",r.style.height=c.height||"auto")}}d.restoreIframeSize=i})(b||(b={}));var W=n(108),H=function(l){var o=l.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(k.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,o))};S.a.render(e.a.createElement(H,null,e.a.createElement(T,null)),document.getElementById("root"))},92:function(f,u,n){f.exports=n(109)}},[[92,1,2]]]);
