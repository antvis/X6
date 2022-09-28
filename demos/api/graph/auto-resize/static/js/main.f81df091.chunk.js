(this["webpackJsonp@antv/x6-sites-demos-api.graph.auto-resize"]=this["webpackJsonp@antv/x6-sites-demos-api.graph.auto-resize"]||[]).push([[0],{119:function(m,d,n){m.exports=n(141)},126:function(m,d,n){},133:function(m,d,n){},134:function(m,d,n){"use strict";n.r(d),n.d(d,"host",function(){return l}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return g});const l="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/graph/auto-resize";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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

.app-content {
  flex: 1;
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #ffe58f;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  private graphContainer1: HTMLDivElement
  private graphContainer2: HTMLDivElement

  componentDidMount() {
    const graph1 = new Graph({
      container: this.graphContainer1,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      scroller: true,
      autoResize: true,
    })

    const rect = graph1.addNode({
      x: 300,
      y: 300,
      width: 90,
      height: 60,
    })

    const circle = graph1.addNode({
      x: 400,
      y: 400,
      width: 40,
      height: 40,
    })

    graph1.addEdge({
      source: rect,
      target: circle,
    })

    graph1.centerContent()

    const graph2 = new Graph({
      container: this.graphContainer2,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      autoResize: true,
    })

    const source = graph2.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
    })

    const target = graph2.addNode({
      x: 120,
      y: 100,
      width: 80,
      height: 40,
    })

    graph2.addEdge({
      source,
      target,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.graphContainer1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.graphContainer2 = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content">
          <SplitBox>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer1}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer2}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
          </SplitBox>
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
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"tsconfig.json":{content:`{
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
`,isBinary:!1}}}}function g(){return{title:"api/graph/auto-resize",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest","@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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

.app-content {
  flex: 1;
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #ffe58f;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  private graphContainer1: HTMLDivElement
  private graphContainer2: HTMLDivElement

  componentDidMount() {
    const graph1 = new Graph({
      container: this.graphContainer1,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      scroller: true,
      autoResize: true,
    })

    const rect = graph1.addNode({
      x: 300,
      y: 300,
      width: 90,
      height: 60,
    })

    const circle = graph1.addNode({
      x: 400,
      y: 400,
      width: 40,
      height: 40,
    })

    graph1.addEdge({
      source: rect,
      target: circle,
    })

    graph1.centerContent()

    const graph2 = new Graph({
      container: this.graphContainer2,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      autoResize: true,
    })

    const source = graph2.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
    })

    const target = graph2.addNode({
      x: 120,
      y: 100,
      width: 80,
      height: 40,
    })

    graph2.addEdge({
      source,
      target,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.graphContainer1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.graphContainer2 = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content">
          <SplitBox>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer1}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer2}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
          </SplitBox>
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
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"tsconfig.json":`{
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
`}}}},139:function(m,d,n){},141:function(m,d,n){"use strict";n.r(d);var l=n(0),e=n.n(l),g=n(34),O=n.n(g),v=n(1),x=n(2),E=n(3),y=n(4),C=n(97),A=n(150),I=n(125),V=n(126),U=function(p){Object(E.a)(t,p);var c=Object(y.a)(t);function t(){var o;Object(v.a)(this,t);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return o=c.call.apply(c,[this].concat(i)),o.graphContainer1=void 0,o.graphContainer2=void 0,o.refContainer1=function(s){o.graphContainer1=s},o.refContainer2=function(s){o.graphContainer2=s},o}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var r=new C.a({container:this.graphContainer1,background:{color:"#f5f5f5"},grid:!0,scroller:!0,autoResize:!0}),i=r.addNode({x:300,y:300,width:90,height:60}),a=r.addNode({x:400,y:400,width:40,height:40});r.addEdge({source:i,target:a}),r.centerContent();var s=new C.a({container:this.graphContainer2,background:{color:"#f5f5f5"},grid:!0,autoResize:!0}),u=s.addNode({x:40,y:40,width:80,height:40}),f=s.addNode({x:120,y:100,width:80,height:40});s.addEdge({source:u,target:f})}},{key:"render",value:function(){return l.createElement("div",{className:"app"},l.createElement("div",{className:"app-content"},l.createElement(A.a,null,l.createElement("div",{style:{width:"100%",height:"100%",display:"flex"}},l.createElement("div",{ref:this.refContainer1,style:{flex:1,margin:24},className:"x6-graph"})),l.createElement("div",{style:{width:"100%",height:"100%",display:"flex"}},l.createElement("div",{ref:this.refContainer2,style:{flex:1,margin:24},className:"x6-graph"})))))}}]),t}(l.Component),D=n(151),N=n(146),L=n(152),R=n(153),h=n(149),P=n(130),M=n(100),B=n(133),w=n(134),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},T=function(p){Object(E.a)(t,p);var c=Object(y.a)(t);function t(){return Object(v.a)(this,t),c.apply(this,arguments)}return Object(x.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(N.a,{component:S}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(M.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),t}(e.a.Component),X=n(147),j=n(114),k=n(139),b=function(p){Object(E.a)(t,p);var c=Object(y.a)(t);function t(o){var r;return Object(v.a)(this,t),r=c.call(this,o),r.refContainer=function(i){r.container=i},t.restoreIframeSize(),r}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){r.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var i=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(i+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(T,null),this.props.children)}}]),t}(e.a.Component);(function(p){var c=window.location.pathname,t="x6-iframe-size";function o(){var a=localStorage.getItem(t),s;if(a)try{s=JSON.parse(a)}catch(u){}else s={};return s}function r(){var a=window.frameElement;if(a){var s=a.style,u={width:s.width,height:s.height},f=o();f[c]=u,localStorage.setItem(t,JSON.stringify(f))}}p.saveIframeSize=r;function i(){var a=window.frameElement;if(a){var s=o(),u=s[c];u&&(a.style.width=u.width||"100%",a.style.height=u.height||"auto")}}p.restoreIframeSize=i})(b||(b={}));var H=n(140),z=function(c){var t=c.children;return e.a.createElement(X.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))};O.a.render(e.a.createElement(z,null,e.a.createElement("div",{className:"bar"}),e.a.createElement(U,null)),document.getElementById("root"))}},[[119,1,2]]]);
