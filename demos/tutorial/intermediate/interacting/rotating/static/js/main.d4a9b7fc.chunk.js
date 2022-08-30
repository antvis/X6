(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.rotating"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.interacting.rotating"]||[]).push([[0],{102:function(u,c,n){},103:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return C}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return b});const C="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/interacting/rotating";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
      enabled: true,
      grid: 15,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      rotating: options,
    })

    const source = this.graph.addNode({
      x: 60,
      y: 130,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 260,
      y: 130,
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
  grid?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    grid: 15,
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

  onGridChanged = (grid: number) => {
    this.setState({ grid }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Rotating Settings"
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
          <Col span={6}>grid</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={180}
              step={1}
              value={this.state.grid}
              onChange={this.onGridChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.grid}</div>
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
`,isBinary:!1}}}}function b(){return{title:"tutorial/intermediate/interacting/rotating",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
      enabled: true,
      grid: 15,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      rotating: options,
    })

    const source = this.graph.addNode({
      x: 60,
      y: 130,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 260,
      y: 130,
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
  grid?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    grid: 15,
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

  onGridChanged = (grid: number) => {
    this.setState({ grid }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Rotating Settings"
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
          <Col span={6}>grid</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={180}
              step={1}
              value={this.state.grid}
              onChange={this.onGridChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.grid}</div>
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
`}}}},106:function(u,c,n){},108:function(u,c,n){"use strict";n.r(c);var C=n(0),e=n.n(C),b=n(31),U=n.n(b),m=n(2),h=n(3),g=n(5),f=n(6),O=n(87),R=n(75),A=n(112),w=n(57),E=n(41),L=n(116),D=n(113),B=n(72),N=function(d){Object(g.a)(a,d);var s=Object(f.a)(a);function a(){var t;Object(m.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=s.call.apply(s,[this].concat(l)),t.state={enabled:!0,grid:15},t.onEnableChanged=function(i){t.setState({enabled:i.target.checked},function(){t.notifyChange()})},t.onGridChanged=function(i){t.setState({grid:i},function(){t.notifyChange()})},t}return Object(h.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(Object(R.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(A.a,{title:"Rotating Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(w.a,{align:"middle"},e.a.createElement(E.a,{span:24},e.a.createElement(L.a,{checked:this.state.enabled,onChange:this.onEnableChanged},"Enabled"))),e.a.createElement(w.a,{align:"middle"},e.a.createElement(E.a,{span:6},"grid"),e.a.createElement(E.a,{span:14},e.a.createElement(D.a,{min:1,max:180,step:1,value:this.state.grid,onChange:this.onGridChanged})),e.a.createElement(E.a,{span:2},e.a.createElement("div",{className:"slider-value"},this.state.grid))))}}]),a}(e.a.Component),F=n(99),M=function(d){Object(g.a)(a,d);var s=Object(f.a)(a);function a(){var t;Object(m.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=s.call.apply(s,[this].concat(l)),t.container=void 0,t.graph=void 0,t.initGraph=function(i){t.graph&&t.graph.dispose(),t.graph=new O.a({container:t.container,grid:{visible:!0},rotating:i});var p=t.graph.addNode({x:60,y:130,width:100,height:40,label:"Hello"}),x=t.graph.addNode({shape:"circle",x:260,y:130,width:60,height:60,label:"World"});t.graph.addEdge({source:p,target:x})},t.onSettingChanged=function(i){t.initGraph(i)},t.refContainer=function(i){t.container=i},t}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.initGraph({enabled:!0,grid:15})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(N,{onChange:this.onSettingChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),j=n(117),X=n(111),T=n(118),P=n(119),v=n(89),V=n(83),J=n(102),S=n(103),z=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},I=function(d){Object(g.a)(a,d);var s=Object(f.a)(a);function a(){return Object(m.a)(this,a),s.apply(this,arguments)}return Object(h.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(j.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(X.a,{component:z}))),e.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,null))),e.a.createElement(v.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(P.a,null)))))}}]),a}(e.a.Component),k=n(114),G=n(84),W=n(106),y=function(d){Object(g.a)(a,d);var s=Object(f.a)(a);function a(t){var r;return Object(m.a)(this,a),r=s.call(this,t),r.refContainer=function(l){r.container=l},a.restoreIframeSize(),r}return Object(h.a)(a,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){r.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var l=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(l+16,"px"),r.style.border="0",r.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(I,null),this.props.children)}}]),a}(e.a.Component);(function(d){var s=window.location.pathname,a="x6-iframe-size";function t(){var o=localStorage.getItem(a),i;if(o)try{i=JSON.parse(o)}catch(p){}else i={};return i}function r(){var o=window.frameElement;if(o){var i=o.style,p={width:i.width,height:i.height},x=t();x[s]=p,localStorage.setItem(a,JSON.stringify(x))}}d.saveIframeSize=r;function l(){var o=window.frameElement;if(o){var i=t(),p=i[s];p&&(o.style.width=p.width||"100%",o.style.height=p.height||"auto")}}d.restoreIframeSize=l})(y||(y={}));var Y=n(107),H=function(s){var a=s.children;return e.a.createElement(k.a.ErrorBoundary,null,e.a.createElement(G.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(y,null,a))};U.a.render(e.a.createElement(H,null,e.a.createElement(M,null)),document.getElementById("root"))},91:function(u,c,n){u.exports=n(108)},99:function(u,c,n){}},[[91,1,2]]]);
