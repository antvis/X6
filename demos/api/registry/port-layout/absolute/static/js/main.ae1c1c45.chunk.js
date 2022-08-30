(this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.absolute"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.port-layout.absolute"]||[]).push([[0],{100:function(m,c,e){"use strict";e.r(c),e.d(c,"host",function(){return E}),e.d(c,"getCodeSandboxParams",function(){return n}),e.d(c,"getStackblitzPrefillConfig",function(){return y});const E="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/port-layout/absolute";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
      grid: true,
    })

    this.node = graph.addNode({
      x: 120,
      y: 48,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
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
              name: 'absolute',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
            args: { x: 0, y: 60 },
            attrs: {
              text: { text: '{ x: 0, y: 60 }' },
            },
          },
          {
            id: 'port2',
            group: 'group1',
            args: { x: 0.6, y: 32, angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            zIndex: 10,
            attrs: {
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
              text: { text: '{ x: 0.6, y: 32, angle: 45 }', fill: 'red' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: { x: '100%', y: '100%' },
            attrs: {
              text: { text: "{ x: '100%', y: '100%' }" },
            },
            label: {
              position: {
                name: 'right',
              },
            },
          },
        ],
      },
    })
  }

  onAttrsChanged = (args: State) => {
    this.node.portProp('port2', {
      args,
      attrs: {
        text: { text: \`{ x: \${args.x}, y: \${args.y}, angle: \${args.angle} }\` },
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
import { Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  x: number
  y: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    x: 0.6,
    y: 32,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onXChanged = (x: number) => {
    this.setState({ x }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (y: number) => {
    this.setState({ y }, () => {
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
            x
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.x}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            y
          </Col>
          <Col span={14}>
            <Slider
              min={-20}
              max={140}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.y}</div>
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
`,isBinary:!1}}}}function y(){return{title:"api/registry/port-layout/absolute",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
      grid: true,
    })

    this.node = graph.addNode({
      x: 120,
      y: 48,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
        },
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
              name: 'absolute',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
            args: { x: 0, y: 60 },
            attrs: {
              text: { text: '{ x: 0, y: 60 }' },
            },
          },
          {
            id: 'port2',
            group: 'group1',
            args: { x: 0.6, y: 32, angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            zIndex: 10,
            attrs: {
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
              text: { text: '{ x: 0.6, y: 32, angle: 45 }', fill: 'red' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: { x: '100%', y: '100%' },
            attrs: {
              text: { text: "{ x: '100%', y: '100%' }" },
            },
            label: {
              position: {
                name: 'right',
              },
            },
          },
        ],
      },
    })
  }

  onAttrsChanged = (args: State) => {
    this.node.portProp('port2', {
      args,
      attrs: {
        text: { text: \`{ x: \${args.x}, y: \${args.y}, angle: \${args.angle} }\` },
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
import { Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  x: number
  y: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    x: 0.6,
    y: 32,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onXChanged = (x: number) => {
    this.setState({ x }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (y: number) => {
    this.setState({ y }, () => {
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
            x
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.x}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            y
          </Col>
          <Col span={14}>
            <Slider
              min={-20}
              max={140}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.y}</div>
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
`}}}},103:function(m,c,e){},105:function(m,c,e){"use strict";e.r(c);var E=e(0),n=e.n(E),y=e(30),U=e.n(y),g=e(1),h=e(3),f=e(4),x=e(5),S=e(84),N=e(109),C=e(56),p=e(40),b=e(110),H=e(70),O=function(d){Object(f.a)(a,d);var i=Object(x.a)(a);function a(){var t;Object(g.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return t=i.call.apply(i,[this].concat(l)),t.state={x:.6,y:32,angle:45},t.onXChanged=function(s){t.setState({x:s},function(){t.notifyChange()})},t.onYChanged=function(s){t.setState({y:s},function(){t.notifyChange()})},t.onAngleChanged=function(s){t.setState({angle:s},function(){t.notifyChange()})},t}return Object(h.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return n.a.createElement(N.a,{title:"Args",size:"small",bordered:!1,style:{width:320}},n.a.createElement(C.a,{align:"middle"},n.a.createElement(p.a,{span:5,style:{textAlign:"right",paddingRight:8}},"x"),n.a.createElement(p.a,{span:14},n.a.createElement(b.a,{min:0,max:.99,step:.01,value:this.state.x,onChange:this.onXChanged})),n.a.createElement(p.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.x))),n.a.createElement(C.a,{align:"middle"},n.a.createElement(p.a,{span:5,style:{textAlign:"right",paddingRight:8}},"y"),n.a.createElement(p.a,{span:14},n.a.createElement(b.a,{min:-20,max:140,step:1,value:this.state.y,onChange:this.onYChanged})),n.a.createElement(p.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.y))),n.a.createElement(C.a,{align:"middle"},n.a.createElement(p.a,{span:5,style:{textAlign:"right",paddingRight:8}},"angle"),n.a.createElement(p.a,{span:14},n.a.createElement(b.a,{min:0,max:360,step:1,value:this.state.angle,onChange:this.onAngleChanged})),n.a.createElement(p.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.angle))))}}]),a}(n.a.Component),B=e(96),L=function(d){Object(f.a)(a,d);var i=Object(x.a)(a);function a(){var t;Object(g.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return t=i.call.apply(i,[this].concat(l)),t.container=void 0,t.node=void 0,t.onAttrsChanged=function(s){t.node.portProp("port2",{args:s,attrs:{text:{text:"{ x: ".concat(s.x,", y: ").concat(s.y,", angle: ").concat(s.angle," }")}}})},t.refContainer=function(s){t.container=s},t}return Object(h.a)(a,[{key:"componentDidMount",value:function(){var o=new S.a({container:this.container,grid:!0});this.node=o.addNode({x:120,y:48,width:280,height:120,markup:[{tagName:"rect",selector:"body"}],attrs:{body:{refWidth:"100%",refHeight:"100%",fill:"#fff",stroke:"#000",strokeWidth:1}},ports:{groups:{group1:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"},text:{fontSize:12,fill:"#888"}},position:{name:"absolute"}}},items:[{id:"port1",group:"group1",args:{x:0,y:60},attrs:{text:{text:"{ x: 0, y: 60 }"}}},{id:"port2",group:"group1",args:{x:.6,y:32,angle:45},markup:[{tagName:"path",selector:"path"}],zIndex:10,attrs:{path:{d:"M -6 -8 L 0 8 L 6 -8 Z",magnet:!0,fill:"red"},text:{text:"{ x: 0.6, y: 32, angle: 45 }",fill:"red"}}},{id:"port3",group:"group1",args:{x:"100%",y:"100%"},attrs:{text:{text:"{ x: '100%', y: '100%' }"}},label:{position:{name:"right"}}}]}})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(O,{onChange:this.onAttrsChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),D=e(113),M=e(108),X=e(114),P=e(115),v=e(86),j=e(80),_=e(99),R=e(100),T=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},z=function(d){Object(f.a)(a,d);var i=Object(x.a)(a);function a(){return Object(g.a)(this,a),i.apply(this,arguments)}return Object(h.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(M.a,{component:T}))),n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(R.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,null))),n.a.createElement(v.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(R.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(P.a,null)))))}}]),a}(n.a.Component),I=e(111),k=e(81),W=e(103),A=function(d){Object(f.a)(a,d);var i=Object(x.a)(a);function a(t){var o;return Object(g.a)(this,a),o=i.call(this,t),o.refContainer=function(l){o.container=l},a.restoreIframeSize(),o}return Object(h.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){o.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var l=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(l+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(z,null),this.props.children)}}]),a}(n.a.Component);(function(d){var i=window.location.pathname,a="x6-iframe-size";function t(){var r=localStorage.getItem(a),s;if(r)try{s=JSON.parse(r)}catch(u){}else s={};return s}function o(){var r=window.frameElement;if(r){var s=r.style,u={width:s.width,height:s.height},w=t();w[i]=u,localStorage.setItem(a,JSON.stringify(w))}}d.saveIframeSize=o;function l(){var r=window.frameElement;if(r){var s=t(),u=s[i];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}d.restoreIframeSize=l})(A||(A={}));var Y=e(104),V=function(i){var a=i.children;return n.a.createElement(I.a.ErrorBoundary,null,n.a.createElement(k.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(A,null,a))};U.a.render(n.a.createElement(V,null,n.a.createElement(L,null)),document.getElementById("root"))},88:function(m,c,e){m.exports=e(105)},96:function(m,c,e){},99:function(m,c,e){}},[[88,1,2]]]);
