(this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-anchor.playground"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-anchor.playground"]||[]).push([[0],{100:function(u,p,n){},103:function(u,p,n){},104:function(u,p,n){"use strict";n.r(p),n.d(p,"host",function(){return C}),n.d(p,"getCodeSandboxParams",function(){return e}),n.d(p,"getStackblitzPrefillConfig",function(){return b});const C="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/edge-anchor/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
      interacting: false,
    })

    const rect = graph.addEdge({
      source: { x: 40, y: 80 },
      target: { x: 360, y: 80 },
      vertices: [
        { x: 120, y: 120 },
        { x: 200, y: 40 },
        { x: 280, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#31d0c6',
        },
      },
    })

    const edge = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 200, y: 100 }
          const radius = 140
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

    edge.on('transition:complete', animate)

    this.edge = edge
  }

  onAttrsChanged = ({ type, value }: State) => {
    const anchor =
      type === 'ratio' || type === 'length'
        ? {
            name: type,
            args: {
              [type]: value,
            },
          }
        : { name: type }
    this.edge.prop('target/anchor', anchor)
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
  type: string
  value: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'ratio',
    value: 50,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (value: number) => {
    this.setState({ value }, () => {
      this.notifyChange()
    })
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="ratio">ratio</Radio>
              <Radio value="length">length</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="closest">closest</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {(this.state.type === 'ratio' || this.state.type === 'length') && (
          <Row align="middle">
            <Col span={5}>
              {this.state.type === 'ratio' ? 'ratio' : 'length'}
            </Col>
            <Col span={14}>
              <Slider
                min={0}
                max={100}
                step={1}
                value={this.state.value}
                onChange={this.onAngleChanged}
              />
            </Col>
            <Col span={1} offset={1}>
              <div className="slider-value">
                {this.state.value}
                {this.state.type === 'ratio' ? '%' : ''}
              </div>
            </Col>
          </Row>
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
`,isBinary:!1}}}}function b(){return{title:"api/registry/edge-anchor/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
      interacting: false,
    })

    const rect = graph.addEdge({
      source: { x: 40, y: 80 },
      target: { x: 360, y: 80 },
      vertices: [
        { x: 120, y: 120 },
        { x: 200, y: 40 },
        { x: 280, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#31d0c6',
        },
      },
    })

    const edge = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 200, y: 100 }
          const radius = 140
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

    edge.on('transition:complete', animate)

    this.edge = edge
  }

  onAttrsChanged = ({ type, value }: State) => {
    const anchor =
      type === 'ratio' || type === 'length'
        ? {
            name: type,
            args: {
              [type]: value,
            },
          }
        : { name: type }
    this.edge.prop('target/anchor', anchor)
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
  type: string
  value: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'ratio',
    value: 50,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (value: number) => {
    this.setState({ value }, () => {
      this.notifyChange()
    })
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="ratio">ratio</Radio>
              <Radio value="length">length</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="closest">closest</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {(this.state.type === 'ratio' || this.state.type === 'length') && (
          <Row align="middle">
            <Col span={5}>
              {this.state.type === 'ratio' ? 'ratio' : 'length'}
            </Col>
            <Col span={14}>
              <Slider
                min={0}
                max={100}
                step={1}
                value={this.state.value}
                onChange={this.onAngleChanged}
              />
            </Col>
            <Col span={1} offset={1}>
              <div className="slider-value">
                {this.state.value}
                {this.state.type === 'ratio' ? '%' : ''}
              </div>
            </Col>
          </Row>
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
`}}}},107:function(u,p,n){},109:function(u,p,n){"use strict";n.r(p);var C=n(0),e=n.n(C),b=n(31),D=n.n(b),N=n(11),g=n(2),f=n(3),v=n(5),E=n(6),P=n(88),T=n(113),w=n(58),y=n(41),m=n(117),X=n(114),Z=n(74),j=function(c){Object(v.a)(a,c);var l=Object(E.a)(a);function a(){var t;Object(g.a)(this,a);for(var o=arguments.length,i=new Array(o),r=0;r<o;r++)i[r]=arguments[r];return t=l.call.apply(l,[this].concat(i)),t.state={type:"ratio",value:50},t.onAngleChanged=function(s){t.setState({value:s},function(){t.notifyChange()})},t.onChange=function(s){t.setState({type:s.target.value},function(){t.notifyChange()})},t}return Object(f.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(T.a,{title:"Anchor",size:"small",bordered:!1,style:{width:320}},e.a.createElement(w.a,{align:"middle"},e.a.createElement(y.a,{span:22,offset:2},e.a.createElement(m.a.Group,{onChange:this.onChange,value:this.state.type},e.a.createElement(m.a,{value:"ratio"},"ratio"),e.a.createElement(m.a,{value:"length"},"length"),e.a.createElement(m.a,{value:"orth"},"orth"),e.a.createElement(m.a,{value:"closest"},"closest")))),(this.state.type==="ratio"||this.state.type==="length")&&e.a.createElement(w.a,{align:"middle"},e.a.createElement(y.a,{span:5},this.state.type==="ratio"?"ratio":"length"),e.a.createElement(y.a,{span:14},e.a.createElement(X.a,{min:0,max:100,step:1,value:this.state.value,onChange:this.onAngleChanged})),e.a.createElement(y.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.value,this.state.type==="ratio"?"%":""))))}}]),a}(e.a.Component),K=n(100),I=function(c){Object(v.a)(a,c);var l=Object(E.a)(a);function a(){var t;Object(g.a)(this,a);for(var o=arguments.length,i=new Array(o),r=0;r<o;r++)i[r]=arguments[r];return t=l.call.apply(l,[this].concat(i)),t.container=void 0,t.edge=void 0,t.onAttrsChanged=function(s){var d=s.type,h=s.value,A=d==="ratio"||d==="length"?{name:d,args:Object(N.a)({},d,h)}:{name:d};t.edge.prop("target/anchor",A)},t.refContainer=function(s){t.container=s},t}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var o=new P.a({container:this.container,grid:!0,interacting:!1}),i=o.addEdge({source:{x:40,y:80},target:{x:360,y:80},vertices:[{x:120,y:120},{x:200,y:40},{x:280,y:120}],attrs:{line:{stroke:"#31d0c6"}}}),r=o.addEdge({source:{x:100,y:100},target:{cell:i.id},attrs:{line:{strokeWidth:1,targetMarker:"classic"}}});function s(){r.transition("source",9.36/60,{duration:5e3,interp:function(h,A){var O=A*(2*Math.PI)-Math.PI/2,M={x:200,y:100},S=140;return function(L){return{x:M.x+S*Math.cos(L*2*Math.PI+O),y:M.y+S*Math.sin(L*2*Math.PI+O)}}}})}s(),r.on("transition:complete",s),this.edge=r}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(j,{onChange:this.onAttrsChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),V=n(118),z=n(112),k=n(119),B=n(120),x=n(90),H=n(84),Q=n(103),U=n(104),G=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},F=function(c){Object(v.a)(a,c);var l=Object(E.a)(a);function a(){return Object(g.a)(this,a),l.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(V.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(z.a,{component:G}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(U.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(k.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(H.getParameters)(U.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(B.a,null)))))}}]),a}(e.a.Component),J=n(115),W=n(85),$=n(107),R=function(c){Object(v.a)(a,c);var l=Object(E.a)(a);function a(t){var o;return Object(g.a)(this,a),o=l.call(this,t),o.refContainer=function(i){o.container=i},a.restoreIframeSize(),o}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){o.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var i=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(i+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(F,null),this.props.children)}}]),a}(e.a.Component);(function(c){var l=window.location.pathname,a="x6-iframe-size";function t(){var r=localStorage.getItem(a),s;if(r)try{s=JSON.parse(r)}catch(d){}else s={};return s}function o(){var r=window.frameElement;if(r){var s=r.style,d={width:s.width,height:s.height},h=t();h[l]=d,localStorage.setItem(a,JSON.stringify(h))}}c.saveIframeSize=o;function i(){var r=window.frameElement;if(r){var s=t(),d=s[l];d&&(r.style.width=d.width||"100%",r.style.height=d.height||"auto")}}c.restoreIframeSize=i})(R||(R={}));var _=n(108),Y=function(l){var a=l.children;return e.a.createElement(J.a.ErrorBoundary,null,e.a.createElement(W.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(R,null,a))};D.a.render(e.a.createElement(Y,null,e.a.createElement(I,null)),document.getElementById("root"))},92:function(u,p,n){u.exports=n(109)}},[[92,1,2]]]);
