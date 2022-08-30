(this["webpackJsonp@antv/x6-sites-demos-api.registry.connector.jumpover"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.connector.jumpover"]||[]).push([[0],{102:function(h,p,n){},103:function(h,p,n){"use strict";n.r(p),n.d(p,"host",function(){return y}),n.d(p,"getCodeSandboxParams",function(){return e}),n.d(p,"getStackblitzPrefillConfig",function(){return R});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/connector/jumpover";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 320px;
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
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 24,
      y: 70,
      width: 100,
      height: 40,
    })

    const target = graph.addNode({
      x: 24,
      y: 160,
      width: 100,
      height: 40,
    })

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#fe8550',
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
    })

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)

      if (i % 2 === 0) {
        graph.addEdge({
          source,
          target,
          attrs: {
            line: {
              stroke: '#fe8550',
            },
          },
          connector: {
            name: 'jumpover',
            args: {
              type: 'gap',
            },
          },
        })
      } else {
        graph.addEdge({ source, target })
      }
    }

    this.edge.setConnector('jumpover')
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
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
import { Slider, Radio, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  size: number
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'arc',
    size: 5,
    radius: 0,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.notifyChange()
    })
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  onTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>type</Col>
          <Col span={18}>
            <Radio.Group onChange={this.onTypeChange} value={this.state.type}>
              <Radio value={'arc'}>arc</Radio>
              <Radio value={'cubic'}>cubic</Radio>
              <Radio value={'gap'}>gap</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
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
`,isBinary:!1}}}}function R(){return{title:"api/registry/connector/jumpover",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 320px;
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
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 24,
      y: 70,
      width: 100,
      height: 40,
    })

    const target = graph.addNode({
      x: 24,
      y: 160,
      width: 100,
      height: 40,
    })

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#fe8550',
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
    })

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)

      if (i % 2 === 0) {
        graph.addEdge({
          source,
          target,
          attrs: {
            line: {
              stroke: '#fe8550',
            },
          },
          connector: {
            name: 'jumpover',
            args: {
              type: 'gap',
            },
          },
        })
      } else {
        graph.addEdge({ source, target })
      }
    }

    this.edge.setConnector('jumpover')
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
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
import { Slider, Radio, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  size: number
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'arc',
    size: 5,
    radius: 0,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.notifyChange()
    })
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  onTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>type</Col>
          <Col span={18}>
            <Radio.Group onChange={this.onTypeChange} value={this.state.type}>
              <Radio value={'arc'}>arc</Radio>
              <Radio value={'cubic'}>cubic</Radio>
              <Radio value={'gap'}>gap</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
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
`}}}},106:function(h,p,n){},108:function(h,p,n){"use strict";n.r(p);var y=n(0),e=n.n(y),R=n(30),O=n.n(R),g=n(2),f=n(3),v=n(5),E=n(6),N=n(87),D=n(112),b=n(57),u=n(40),x=n(116),A=n(113),_=n(73),L=function(l){Object(v.a)(o,l);var d=Object(E.a)(o);function o(){var t;Object(g.a)(this,o);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return t=d.call.apply(d,[this].concat(i)),t.state={type:"arc",size:5,radius:0},t.onSizeChanged=function(s){t.setState({size:s},function(){t.notifyChange()})},t.onRadiusChanged=function(s){t.setState({radius:s},function(){t.notifyChange()})},t.onTypeChange=function(s){t.setState({type:s.target.value},function(){t.notifyChange()})},t}return Object(f.a)(o,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(D.a,{title:"Args",size:"small",bordered:!1,style:{width:320}},e.a.createElement(b.a,{align:"middle"},e.a.createElement(u.a,{span:5},"type"),e.a.createElement(u.a,{span:18},e.a.createElement(x.a.Group,{onChange:this.onTypeChange,value:this.state.type},e.a.createElement(x.a,{value:"arc"},"arc"),e.a.createElement(x.a,{value:"cubic"},"cubic"),e.a.createElement(x.a,{value:"gap"},"gap")))),e.a.createElement(b.a,{align:"middle"},e.a.createElement(u.a,{span:5},"size"),e.a.createElement(u.a,{span:14},e.a.createElement(A.a,{min:1,max:30,step:1,value:this.state.size,onChange:this.onSizeChanged})),e.a.createElement(u.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.size))),e.a.createElement(b.a,{align:"middle"},e.a.createElement(u.a,{span:5},"radius"),e.a.createElement(u.a,{span:14},e.a.createElement(A.a,{min:0,max:30,step:1,value:this.state.radius,onChange:this.onRadiusChanged})),e.a.createElement(u.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.radius))))}}]),o}(e.a.Component),G=n(99),j=function(l){Object(v.a)(o,l);var d=Object(E.a)(o);function o(){var t;Object(g.a)(this,o);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return t=d.call.apply(d,[this].concat(i)),t.container=void 0,t.edge=void 0,t.onAttrsChanged=function(s){t.edge.setConnector("jumpover",s)},t.refContainer=function(s){t.container=s},t}return Object(f.a)(o,[{key:"componentDidMount",value:function(){var a=new N.a({container:this.container,grid:!0}),i=a.addNode({x:24,y:70,width:100,height:40}),r=a.addNode({x:24,y:160,width:100,height:40});this.edge=a.addEdge({source:i,target:r,attrs:{line:{stroke:"#fe8550"}},vertices:[{x:760,y:150},{x:760,y:240}]});for(var s=a.addNode({x:160,y:24,width:70,height:30}),c=0;c<6;c+=1){var m=s.clone().translate(c*100,c*10);a.addNode(m);var U=m.clone().translate(0,200);a.addNode(U),c%2===0?a.addEdge({source:m,target:U,attrs:{line:{stroke:"#fe8550"}},connector:{name:"jumpover",args:{type:"gap"}}}):a.addEdge({source:m,target:U})}this.edge.setConnector("jumpover")}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-left"},e.a.createElement(L,{onChange:this.onAttrsChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),M=n(117),z=n(111),T=n(118),X=n(119),C=n(89),P=n(83),F=n(102),S=n(103),V=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},I=function(l){Object(v.a)(o,l);var d=Object(E.a)(o);function o(){return Object(g.a)(this,o),d.apply(this,arguments)}return Object(f.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(M.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(z.a,{component:V}))),e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,null))),e.a.createElement(C.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(P.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(X.a,null)))))}}]),o}(e.a.Component),k=n(114),B=n(84),J=n(106),w=function(l){Object(v.a)(o,l);var d=Object(E.a)(o);function o(t){var a;return Object(g.a)(this,o),a=d.call(this,t),a.refContainer=function(i){a.container=i},o.restoreIframeSize(),a}return Object(f.a)(o,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(I,null),this.props.children)}}]),o}(e.a.Component);(function(l){var d=window.location.pathname,o="x6-iframe-size";function t(){var r=localStorage.getItem(o),s;if(r)try{s=JSON.parse(r)}catch(c){}else s={};return s}function a(){var r=window.frameElement;if(r){var s=r.style,c={width:s.width,height:s.height},m=t();m[d]=c,localStorage.setItem(o,JSON.stringify(m))}}l.saveIframeSize=a;function i(){var r=window.frameElement;if(r){var s=t(),c=s[d];c&&(r.style.width=c.width||"100%",r.style.height=c.height||"auto")}}l.restoreIframeSize=i})(w||(w={}));var Y=n(107),H=function(d){var o=d.children;return e.a.createElement(k.a.ErrorBoundary,null,e.a.createElement(B.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,o))};O.a.render(e.a.createElement(H,null,e.a.createElement(j,null)),document.getElementById("root"))},91:function(h,p,n){h.exports=n(108)},99:function(h,p,n){}},[[91,1,2]]]);
