(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.connecting"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.connecting"]||[]).push([[0],{101:function(u,p,e){},102:function(u,p,e){"use strict";e.r(p),e.d(p,"host",function(){return b}),e.d(p,"getCodeSandboxParams",function(){return n}),e.d(p,"getStackblitzPrefillConfig",function(){return y});const b="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/interacting/connecting";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
  min-height: 250px;
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
      allowBlank: true,
      allowMulti: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: true,
      allowPort: true,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 300,
      grid: true,
      connecting: {
        ...options,
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 200,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [360, 80],
      target: [560, 200],
    })

    this.graph = graph
  }

  onSettingChanged = (options: State) => {
    console.log(options)
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
import { Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  allowBlank: boolean
  allowMulti: boolean
  allowLoop: boolean
  allowNode: boolean
  allowEdge: boolean
  allowPort: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    allowBlank: true,
    allowMulti: true,
    allowLoop: true,
    allowNode: true,
    allowEdge: true,
    allowPort: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onAllowTypeChanged = (type: string, flag: boolean) => {
    const s = { [type]: flag } as any
    this.setState(s, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Connecting Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowBlank}
              onChange={(e) =>
                this.onAllowTypeChanged('allowBlank', e.target.checked)
              }
            >
              AllowBlank
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowMulti}
              onChange={(e) =>
                this.onAllowTypeChanged('allowMulti', e.target.checked)
              }
            >
              AllowMulti
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowLoop}
              onChange={(e) =>
                this.onAllowTypeChanged('allowLoop', e.target.checked)
              }
            >
              AllowLoop
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowNode}
              onChange={(e) =>
                this.onAllowTypeChanged('allowNode', e.target.checked)
              }
            >
              AllowNode
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowEdge}
              onChange={(e) =>
                this.onAllowTypeChanged('allowEdge', e.target.checked)
              }
            >
              AllowEdge
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowPort}
              onChange={(e) =>
                this.onAllowTypeChanged('allowPort', e.target.checked)
              }
            >
              AllowPort
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
`,isBinary:!1}}}}function y(){return{title:"tutorial/intermediate/interacting/connecting",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  min-height: 250px;
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
      allowBlank: true,
      allowMulti: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: true,
      allowPort: true,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 300,
      grid: true,
      connecting: {
        ...options,
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 200,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [360, 80],
      target: [560, 200],
    })

    this.graph = graph
  }

  onSettingChanged = (options: State) => {
    console.log(options)
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
import { Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  allowBlank: boolean
  allowMulti: boolean
  allowLoop: boolean
  allowNode: boolean
  allowEdge: boolean
  allowPort: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    allowBlank: true,
    allowMulti: true,
    allowLoop: true,
    allowNode: true,
    allowEdge: true,
    allowPort: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onAllowTypeChanged = (type: string, flag: boolean) => {
    const s = { [type]: flag } as any
    this.setState(s, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Connecting Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowBlank}
              onChange={(e) =>
                this.onAllowTypeChanged('allowBlank', e.target.checked)
              }
            >
              AllowBlank
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowMulti}
              onChange={(e) =>
                this.onAllowTypeChanged('allowMulti', e.target.checked)
              }
            >
              AllowMulti
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowLoop}
              onChange={(e) =>
                this.onAllowTypeChanged('allowLoop', e.target.checked)
              }
            >
              AllowLoop
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowNode}
              onChange={(e) =>
                this.onAllowTypeChanged('allowNode', e.target.checked)
              }
            >
              AllowNode
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowEdge}
              onChange={(e) =>
                this.onAllowTypeChanged('allowEdge', e.target.checked)
              }
            >
              AllowEdge
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowPort}
              onChange={(e) =>
                this.onAllowTypeChanged('allowPort', e.target.checked)
              }
            >
              AllowPort
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
`}}}},105:function(u,p,e){},107:function(u,p,e){"use strict";e.r(p);var b=e(0),n=e.n(b),y=e(32),U=e.n(y),k=e(59),f=e(1),E=e(2),w=e(3),C=e(4),L=e(87),O=e(10),N=e(111),h=e(56),m=e(38),g=e(115),H=e(73),S=function(c){Object(w.a)(a,c);var s=Object(C.a)(a);function a(){var o;Object(f.a)(this,a);for(var r=arguments.length,i=new Array(r),t=0;t<r;t++)i[t]=arguments[t];return o=s.call.apply(s,[this].concat(i)),o.state={allowBlank:!0,allowMulti:!0,allowLoop:!0,allowNode:!0,allowEdge:!0,allowPort:!0},o.onAllowTypeChanged=function(l,d){var v=Object(O.a)({},l,d);o.setState(v,function(){o.notifyChange()})},o}return Object(E.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(Object(k.a)({},this.state))}},{key:"render",value:function(){var r=this;return n.a.createElement(N.a,{title:"Connecting Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowBlank,onChange:function(t){return r.onAllowTypeChanged("allowBlank",t.target.checked)}},"AllowBlank"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowMulti,onChange:function(t){return r.onAllowTypeChanged("allowMulti",t.target.checked)}},"AllowMulti"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowLoop,onChange:function(t){return r.onAllowTypeChanged("allowLoop",t.target.checked)}},"AllowLoop"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowNode,onChange:function(t){return r.onAllowTypeChanged("allowNode",t.target.checked)}},"AllowNode"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowEdge,onChange:function(t){return r.onAllowTypeChanged("allowEdge",t.target.checked)}},"AllowEdge"))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(m.a,{span:24},n.a.createElement(g.a,{checked:this.state.allowPort,onChange:function(t){return r.onAllowTypeChanged("allowPort",t.target.checked)}},"AllowPort"))))}}]),a}(n.a.Component),_=e(98),M=function(c){Object(w.a)(a,c);var s=Object(C.a)(a);function a(){var o;Object(f.a)(this,a);for(var r=arguments.length,i=new Array(r),t=0;t<r;t++)i[t]=arguments[t];return o=s.call.apply(s,[this].concat(i)),o.container=void 0,o.graph=void 0,o.initGraph=function(l){o.graph&&o.graph.dispose();var d=new L.a({container:o.container,width:800,height:300,grid:!0,connecting:Object(k.a)({},l)});d.addNode({x:60,y:50,width:120,height:64,ports:{groups:{in:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"}},position:"top"},out:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"}},position:"bottom"}},items:[{id:"port1",group:"in"},{id:"port2",group:"in"},{id:"port3",group:"in"},{id:"port4",group:"out"},{id:"port5",group:"out"}]}}),d.addNode({x:160,y:200,width:120,height:64,ports:{groups:{in:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"}},position:"top"},out:{attrs:{circle:{r:6,magnet:!0,stroke:"#31d0c6",strokeWidth:2,fill:"#fff"}},position:"bottom"}},items:[{id:"port1",group:"in"},{id:"port2",group:"in"},{id:"port3",group:"in"},{id:"port4",group:"out"},{id:"port5",group:"out"}]}}),d.addEdge({source:[360,80],target:[560,200]}),o.graph=d},o.onSettingChanged=function(l){console.log(l),o.initGraph(l)},o.refContainer=function(l){o.container=l},o}return Object(E.a)(a,[{key:"componentDidMount",value:function(){this.initGraph({allowBlank:!0,allowMulti:!0,allowLoop:!0,allowNode:!0,allowEdge:!0,allowPort:!0})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(S,{onChange:this.onSettingChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),D=e(116),T=e(110),P=e(117),j=e(118),x=e(114),X=e(83),W=e(101),R=e(102),B=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},V=function(c){Object(w.a)(a,c);var s=Object(C.a)(a);function a(){return Object(f.a)(this,a),s.apply(this,arguments)}return Object(E.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(T.a,{component:B}))),n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(R.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(P.a,null))),n.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(X.getParameters)(R.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(j.a,null)))))}}]),a}(n.a.Component),z=e(112),I=e(84),F=e(105),A=function(c){Object(w.a)(a,c);var s=Object(C.a)(a);function a(o){var r;return Object(f.a)(this,a),r=s.call(this,o),r.refContainer=function(i){r.container=i},a.restoreIframeSize(),r}return Object(E.a)(a,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){r.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var t=document.getElementById("loading");t&&t.parentNode&&t.parentNode.removeChild(t)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var i=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(i+16,"px"),r.style.border="0",r.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(V,null),this.props.children)}}]),a}(n.a.Component);(function(c){var s=window.location.pathname,a="x6-iframe-size";function o(){var t=localStorage.getItem(a),l;if(t)try{l=JSON.parse(t)}catch(d){}else l={};return l}function r(){var t=window.frameElement;if(t){var l=t.style,d={width:l.width,height:l.height},v=o();v[s]=d,localStorage.setItem(a,JSON.stringify(v))}}c.saveIframeSize=r;function i(){var t=window.frameElement;if(t){var l=o(),d=l[s];d&&(t.style.width=d.width||"100%",t.style.height=d.height||"auto")}}c.restoreIframeSize=i})(A||(A={}));var J=e(106),G=function(s){var a=s.children;return n.a.createElement(z.a.ErrorBoundary,null,n.a.createElement(I.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(A,null,a))};U.a.render(n.a.createElement(G,null,n.a.createElement(M,null)),document.getElementById("root"))},90:function(u,p,e){u.exports=e(107)},98:function(u,p,e){}},[[90,1,2]]]);
