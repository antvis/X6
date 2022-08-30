(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.keyboard.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.keyboard.playground"]||[]).push([[0],{70:function(u,c,n){u.exports=n(88)},76:function(u,c,n){},80:function(u,c,n){},81:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return d}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return f});const d="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/keyboard/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  flex-direction: column;
}

.app-info {
  bottom: 0;
  padding: 0 8px;
}

.app-info span {
  font-size: 12px;
  background: #e9e9e9;
  padding: 2px 8px;
  margin-right: 8px;
  border-radius: 4px;
  line-height: 18px;
  display: inline-block;
}

.app-content {
  height: 280px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      clipboard: {
        enabled: true,
      },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      keyboard: {
        enabled: true,
        global: true,
      },
    })

    this.graph.addNode({
      x: 280,
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

    this.graph.bindKey('ctrl+c', () => {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.copy(cells)
      }
      return false
    })

    this.graph.bindKey('ctrl+v', () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 })
        this.graph.cleanSelection()
        this.graph.select(cells)
      }
      return false
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-info">
          <p>
            <span>Ctrl + C</span>Copy Cell
            <span style={{ marginLeft: 24 }}>Ctrl + V</span>Paste Cell
          </p>
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
`,isBinary:!1}}}}function f(){return{title:"tutorial/basic/keyboard/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  flex-direction: column;
}

.app-info {
  bottom: 0;
  padding: 0 8px;
}

.app-info span {
  font-size: 12px;
  background: #e9e9e9;
  padding: 2px 8px;
  margin-right: 8px;
  border-radius: 4px;
  line-height: 18px;
  display: inline-block;
}

.app-content {
  height: 280px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      clipboard: {
        enabled: true,
      },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      keyboard: {
        enabled: true,
        global: true,
      },
    })

    this.graph.addNode({
      x: 280,
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

    this.graph.bindKey('ctrl+c', () => {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.copy(cells)
      }
      return false
    })

    this.graph.bindKey('ctrl+v', () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 })
        this.graph.cleanSelection()
        this.graph.select(cells)
      }
      return false
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-info">
          <p>
            <span>Ctrl + C</span>Copy Cell
            <span style={{ marginLeft: 24 }}>Ctrl + V</span>Paste Cell
          </p>
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
`}}}},86:function(u,c,n){},88:function(u,c,n){"use strict";n.r(c);var d=n(0),e=n.n(d),f=n(20),w=n.n(f),g=n(1),v=n(2),E=n(3),x=n(4),O=n(67),I=n(76),A=function(p){Object(E.a)(a,p);var l=Object(x.a)(a);function a(){var o;Object(g.a)(this,a);for(var t=arguments.length,i=new Array(t),r=0;r<t;r++)i[r]=arguments[r];return o=l.call.apply(l,[this].concat(i)),o.container=void 0,o.graph=void 0,o.refContainer=function(s){o.container=s},o}return Object(v.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.graph=new O.a({container:this.container,grid:{visible:!0},clipboard:{enabled:!0},selecting:{enabled:!0,showNodeSelectionBox:!0},keyboard:{enabled:!0,global:!0}}),this.graph.addNode({x:280,y:100,width:100,height:40,label:"Rect"});var i=this.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),r=this.graph.addNode({shape:"circle",x:160,y:180,width:60,height:60,label:"World"});this.graph.addEdge({source:i,target:r}),this.graph.bindKey("ctrl+c",function(){var s=t.graph.getSelectedCells();return s.length&&t.graph.copy(s),!1}),this.graph.bindKey("ctrl+v",function(){if(!t.graph.isClipboardEmpty()){var s=t.graph.paste({offset:32});t.graph.cleanSelection(),t.graph.select(s)}return!1})}},{key:"render",value:function(){return d.createElement("div",{className:"app"},d.createElement("div",{className:"app-info"},d.createElement("p",null,d.createElement("span",null,"Ctrl + C"),"Copy Cell",d.createElement("span",{style:{marginLeft:24}},"Ctrl + V"),"Paste Cell")),d.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(d.Component),N=n(95),U=n(91),D=n(96),L=n(97),h=n(94),V=n(77),R=n(50),P=n(80),y=n(81),M=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},S=function(p){Object(E.a)(a,p);var l=Object(x.a)(a);function a(){return Object(g.a)(this,a),l.apply(this,arguments)}return Object(v.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,{component:M}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(y.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(y.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(L.a,null)))))}}]),a}(e.a.Component),T=n(92),j=n(64),z=n(86),b=function(p){Object(E.a)(a,p);var l=Object(x.a)(a);function a(o){var t;return Object(g.a)(this,a),t=l.call(this,o),t.refContainer=function(i){t.container=i},a.restoreIframeSize(),t}return Object(v.a)(a,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){t.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var i=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(i+16,"px"),t.style.border="0",t.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(S,null),this.props.children)}}]),a}(e.a.Component);(function(p){var l=window.location.pathname,a="x6-iframe-size";function o(){var r=localStorage.getItem(a),s;if(r)try{s=JSON.parse(r)}catch(m){}else s={};return s}function t(){var r=window.frameElement;if(r){var s=r.style,m={width:s.width,height:s.height},C=o();C[l]=m,localStorage.setItem(a,JSON.stringify(C))}}p.saveIframeSize=t;function i(){var r=window.frameElement;if(r){var s=o(),m=s[l];m&&(r.style.width=m.width||"100%",r.style.height=m.height||"auto")}}p.restoreIframeSize=i})(b||(b={}));var k=n(87),X=function(l){var a=l.children;return e.a.createElement(T.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,a))};w.a.render(e.a.createElement(X,null,e.a.createElement(A,null)),document.getElementById("root"))}},[[70,1,2]]]);
