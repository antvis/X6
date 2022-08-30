(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.minimap.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.minimap.playground"]||[]).push([[0],{71:function(u,d,n){u.exports=n(89)},77:function(u,d,n){},81:function(u,d,n){},82:function(u,d,n){"use strict";n.r(d),n.d(d,"host",function(){return p}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return x});const p="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/minimap/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 320px;
}

.app-content {
  flex: 1;
  box-shadow: 0 0 10px 1px #e9e9e9;
  width: 400px;
}

.x6-graph-scroller {
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.app-minimap {
  width: 200px;
  height: 150px;
  margin-top: -10px;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SimpleNodeView } from './view'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 400,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
        graphOptions: {
          async: true,
          getCellView(cell) {
            if (cell.isNode()) {
              return SimpleNodeView
            }
          },
          createCellView(cell) {
            if (cell.isEdge()) {
              return null
            }
          },
        },
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

    this.graph.zoomTo(1.8)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/view.ts":{content:`import { NodeView } from '@antv/x6'

export class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    return this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    })
  }

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6',
      },
    })
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
`,isBinary:!1}}}}function x(){return{title:"tutorial/basic/minimap/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 320px;
}

.app-content {
  flex: 1;
  box-shadow: 0 0 10px 1px #e9e9e9;
  width: 400px;
}

.x6-graph-scroller {
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.app-minimap {
  width: 200px;
  height: 150px;
  margin-top: -10px;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SimpleNodeView } from './view'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 400,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
        graphOptions: {
          async: true,
          getCellView(cell) {
            if (cell.isNode()) {
              return SimpleNodeView
            }
          },
          createCellView(cell) {
            if (cell.isEdge()) {
              return null
            }
          },
        },
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

    this.graph.zoomTo(1.8)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
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

ReactDOM.render(<App />, document.getElementById('root'))`,"src/view.ts":`import { NodeView } from '@antv/x6'

export class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    return this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    })
  }

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6',
      },
    })
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
`}}}},87:function(u,d,n){},89:function(u,d,n){"use strict";n.r(d);var p=n(0),e=n.n(p),x=n(21),O=n.n(x),h=n(1),f=n(2),g=n(3),v=n(4),y=n(43),N=n(6),M=n(5),A=function(l){Object(g.a)(t,l);var s=Object(v.a)(t);function t(){return Object(h.a)(this,t),s.apply(this,arguments)}return Object(f.a)(t,[{key:"renderMarkup",value:function(){return this.renderJSONMarkup({tagName:"rect",selector:"body"})}},{key:"update",value:function(){Object(N.a)(Object(M.a)(t.prototype),"update",this).call(this,{body:{refWidth:"100%",refHeight:"100%",fill:"#31d0c6"}})}}]),t}(y.b),P=n(77),D=function(l){Object(g.a)(t,l);var s=Object(v.a)(t);function t(){var a;Object(h.a)(this,t);for(var r=arguments.length,c=new Array(r),i=0;i<r;i++)c[i]=arguments[i];return a=s.call.apply(s,[this].concat(c)),a.container=void 0,a.minimapContainer=void 0,a.graph=void 0,a.refContainer=function(o){a.container=o},a.refMiniMapContainer=function(o){a.minimapContainer=o},a}return Object(f.a)(t,[{key:"componentDidMount",value:function(){this.graph=new y.a({container:this.container,width:400,grid:{visible:!0},scroller:{enabled:!0,pageVisible:!0,pageBreak:!1,pannable:!0},minimap:{enabled:!0,container:this.minimapContainer,width:200,height:160,padding:10,graphOptions:{async:!0,getCellView:function(o){if(o.isNode())return A},createCellView:function(o){if(o.isEdge())return null}}}}),this.graph.addNode({x:200,y:100,width:100,height:40,label:"Rect"});var r=this.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),c=this.graph.addNode({shape:"circle",x:160,y:180,width:60,height:60,label:"World"});this.graph.addEdge({source:r,target:c}),this.graph.zoomTo(1.8)}},{key:"render",value:function(){return p.createElement("div",{className:"app"},p.createElement("div",{className:"app-content",ref:this.refContainer}),p.createElement("div",{className:"app-minimap",ref:this.refMiniMapContainer}))}}]),t}(p.Component),L=n(96),U=n(92),R=n(97),S=n(98),E=n(95),k=n(78),T=n(52),H=n(81),w=n(82),V=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(l){Object(g.a)(t,l);var s=Object(v.a)(t);function t(){return Object(h.a)(this,t),s.apply(this,arguments)}return Object(f.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(L.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,{component:V}))),e.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(R.a,null))),e.a.createElement(E.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(T.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(S.a,null)))))}}]),t}(e.a.Component),X=n(93),I=n(66),B=n(87),b=function(l){Object(g.a)(t,l);var s=Object(v.a)(t);function t(a){var r;return Object(h.a)(this,t),r=s.call(this,a),r.refContainer=function(c){r.container=c},t.restoreIframeSize(),r}return Object(f.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var c=new window.ResizeObserver(function(){r.updateIframeSize()});c.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var c=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(c+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),t}(e.a.Component);(function(l){var s=window.location.pathname,t="x6-iframe-size";function a(){var i=localStorage.getItem(t),o;if(i)try{o=JSON.parse(i)}catch(m){}else o={};return o}function r(){var i=window.frameElement;if(i){var o=i.style,m={width:o.width,height:o.height},C=a();C[s]=m,localStorage.setItem(t,JSON.stringify(C))}}l.saveIframeSize=r;function c(){var i=window.frameElement;if(i){var o=a(),m=o[s];m&&(i.style.width=m.width||"100%",i.style.height=m.height||"auto")}}l.restoreIframeSize=c})(b||(b={}));var J=n(88),z=function(s){var t=s.children;return e.a.createElement(X.a.ErrorBoundary,null,e.a.createElement(I.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))};O.a.render(e.a.createElement(z,null,e.a.createElement(D,null)),document.getElementById("root"))}},[[71,1,2]]]);
