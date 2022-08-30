(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.mousewheel.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.mousewheel.playground"]||[]).push([[0],{101:function(p,c,n){},102:function(p,c,n){"use strict";n.r(c),n.d(c,"host",function(){return E}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return v});const E="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/mousewheel/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
}

.x6-graph-scroller {
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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      height: 280,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
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

  onSettingsChanged = (options: State) => {
    this.graph.mousewheel.options.zoomAtMousePosition = options.fixed
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
  fixed: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    fixed: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ fixed: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="MouseWheel Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.fixed} onChange={this.onFixedChanged}>
              Zoom at Mouse Postion
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
`,isBinary:!1}}}}function v(){return{title:"tutorial/basic/mousewheel/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
}

.x6-graph-scroller {
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
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      height: 280,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
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

  onSettingsChanged = (options: State) => {
    this.graph.mousewheel.options.zoomAtMousePosition = options.fixed
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
  fixed: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    fixed: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ fixed: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="MouseWheel Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.fixed} onChange={this.onFixedChanged}>
              Zoom at Mouse Postion
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
`}}}},105:function(p,c,n){},107:function(p,c,n){"use strict";n.r(c);var E=n(0),e=n.n(E),v=n(32),w=n.n(v),m=n(1),h=n(2),f=n(3),g=n(4),O=n(87),A=n(75),S=n(111),U=n(56),R=n(38),D=n(115),H=n(72),L=function(d){Object(f.a)(t,d);var i=Object(g.a)(t);function t(){var a;Object(m.a)(this,t);for(var o=arguments.length,s=new Array(o),r=0;r<o;r++)s[r]=arguments[r];return a=i.call.apply(i,[this].concat(s)),a.state={fixed:!0},a.onFixedChanged=function(l){a.setState({fixed:l.target.checked},function(){a.notifyChange()})},a}return Object(h.a)(t,[{key:"notifyChange",value:function(){this.props.onChange(Object(A.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(S.a,{title:"MouseWheel Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(U.a,{align:"middle"},e.a.createElement(R.a,{span:24},e.a.createElement(D.a,{checked:this.state.fixed,onChange:this.onFixedChanged},"Zoom at Mouse Postion"))))}}]),t}(e.a.Component),F=n(98),M=function(d){Object(f.a)(t,d);var i=Object(g.a)(t);function t(){var a;Object(m.a)(this,t);for(var o=arguments.length,s=new Array(o),r=0;r<o;r++)s[r]=arguments[r];return a=i.call.apply(i,[this].concat(s)),a.container=void 0,a.graph=void 0,a.onSettingsChanged=function(l){a.graph.mousewheel.options.zoomAtMousePosition=l.fixed},a.refContainer=function(l){a.container=l},a}return Object(h.a)(t,[{key:"componentDidMount",value:function(){this.graph=new O.a({container:this.container,height:280,grid:{visible:!0},scroller:{enabled:!0,pageVisible:!1,pageBreak:!1,pannable:!0},mousewheel:{enabled:!0,global:!0,modifiers:["ctrl","meta"]}}),this.graph.addNode({x:200,y:100,width:100,height:40,label:"Rect"});var o=this.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),s=this.graph.addNode({shape:"circle",x:160,y:180,width:60,height:60,label:"World"});this.graph.addEdge({source:o,target:s})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(L,{onChange:this.onSettingsChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),N=n(116),j=n(110),X=n(117),T=n(118),x=n(114),P=n(83),G=n(101),y=n(102),V=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},z=function(d){Object(f.a)(t,d);var i=Object(g.a)(t);function t(){return Object(m.a)(this,t),i.apply(this,arguments)}return Object(h.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,{component:V}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(y.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(X.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(P.getParameters)(y.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(T.a,null)))))}}]),t}(e.a.Component),I=n(112),k=n(84),J=n(105),b=function(d){Object(f.a)(t,d);var i=Object(g.a)(t);function t(a){var o;return Object(m.a)(this,t),o=i.call(this,a),o.refContainer=function(s){o.container=s},t.restoreIframeSize(),o}return Object(h.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){o.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var s=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(s+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(z,null),this.props.children)}}]),t}(e.a.Component);(function(d){var i=window.location.pathname,t="x6-iframe-size";function a(){var r=localStorage.getItem(t),l;if(r)try{l=JSON.parse(r)}catch(u){}else l={};return l}function o(){var r=window.frameElement;if(r){var l=r.style,u={width:l.width,height:l.height},C=a();C[i]=u,localStorage.setItem(t,JSON.stringify(C))}}d.saveIframeSize=o;function s(){var r=window.frameElement;if(r){var l=a(),u=l[i];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}d.restoreIframeSize=s})(b||(b={}));var W=n(106),B=function(i){var t=i.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(k.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))};w.a.render(e.a.createElement(B,null,e.a.createElement(M,null)),document.getElementById("root"))},90:function(p,c,n){p.exports=n(107)},98:function(p,c,n){}},[[90,1,2]]]);
