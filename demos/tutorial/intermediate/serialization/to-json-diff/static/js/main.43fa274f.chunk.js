(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.serialization.to-json-diff"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.serialization.to-json-diff"]||[]).push([[0],{103:function(u,c,n){},104:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return h}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return f});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/serialization/to-json-diff";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "@types/highlight.js": "^9.12.4",
    "antd": "^4.4.2",
    "highlight.js": "^10.1.2",
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
  width: 320px;
  height: 280px;
  overflow: auto;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Shape } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'
import './app.css'

hljs.registerLanguage('json', json)

Shape.Rect.config({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
})

Shape.Ellipse.config({
  x: 240,
  y: 180,
  width: 100,
  height: 40,
})

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    const target = graph.addNode({
      x: 240,
      y: 180,
      width: 100,
      height: 40,
      shape: 'ellipse',
      label: 'World',
    })

    graph.addEdge({
      source,
      target,
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(
        graph.toJSON({ diff: true }),
        null,
        2,
      )
      hljs.highlightBlock(this.code)
    }

    parse()

    graph.on('cell:change:*', parse)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refCode = (code: HTMLElement) => {
    this.code = code
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <pre>
            <code className="language-json" ref={this.refCode} />
          </pre>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,isBinary:!1},"src/global.d.ts":{content:`declare module 'highlight.js/lib/core'
declare module 'highlight.js/lib/languages/json'
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
`,isBinary:!1}}}}function f(){return{title:"tutorial/intermediate/serialization/to-json-diff",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest","@types/highlight.js":"^9.12.4",antd:"^4.4.2","highlight.js":"^10.1.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "@types/highlight.js": "^9.12.4",
    "antd": "^4.4.2",
    "highlight.js": "^10.1.2",
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
  width: 320px;
  height: 280px;
  overflow: auto;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Shape } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'
import './app.css'

hljs.registerLanguage('json', json)

Shape.Rect.config({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
})

Shape.Ellipse.config({
  x: 240,
  y: 180,
  width: 100,
  height: 40,
})

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    const target = graph.addNode({
      x: 240,
      y: 180,
      width: 100,
      height: 40,
      shape: 'ellipse',
      label: 'World',
    })

    graph.addEdge({
      source,
      target,
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(
        graph.toJSON({ diff: true }),
        null,
        2,
      )
      hljs.highlightBlock(this.code)
    }

    parse()

    graph.on('cell:change:*', parse)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refCode = (code: HTMLElement) => {
    this.code = code
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <pre>
            <code className="language-json" ref={this.refCode} />
          </pre>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,"src/global.d.ts":`declare module 'highlight.js/lib/core'
declare module 'highlight.js/lib/languages/json'
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
`}}}},109:function(u,c,n){},111:function(u,c,n){"use strict";n.r(c);var h=n(0),e=n.n(h),f=n(20),w=n.n(f),g=n(1),E=n(2),v=n(3),x=n(4),y=n(42),A=n(45),C=n.n(A),L=n(54),N=n.n(L),H=n(98),B=n(99);C.a.registerLanguage("json",N.a),y.b.Rect.config({x:40,y:40,width:100,height:40}),y.b.Ellipse.config({x:240,y:180,width:100,height:40});var U=function(d){Object(v.a)(t,d);var l=Object(x.a)(t);function t(){var r;Object(g.a)(this,t);for(var o=arguments.length,s=new Array(o),a=0;a<o;a++)s[a]=arguments[a];return r=l.call.apply(l,[this].concat(s)),r.container=void 0,r.code=void 0,r.refContainer=function(i){r.container=i},r.refCode=function(i){r.code=i},r}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var o=this,s=new y.a({container:this.container,grid:!0}),a=s.addNode({x:40,y:40,width:100,height:40,label:"Hello",attrs:{body:{rx:10,ry:10}}}),i=s.addNode({x:240,y:180,width:100,height:40,shape:"ellipse",label:"World"});s.addEdge({source:a,target:i});var p=function(){o.code.innerText=JSON.stringify(s.toJSON({diff:!0}),null,2),C.a.highlightBlock(o.code)};p(),s.on("cell:change:*",p)}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement("pre",null,e.a.createElement("code",{className:"language-json",ref:this.refCode}))),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),D=n(118),M=n(114),R=n(119),S=n(120),m=n(117),k=n(100),T=n(55),J=n(103),O=n(104),X=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},z=function(d){Object(v.a)(t,d);var l=Object(x.a)(t);function t(){return Object(g.a)(this,t),l.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:X}))),e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(R.a,null))),e.a.createElement(m.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(T.getParameters)(O.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(S.a,null)))))}}]),t}(e.a.Component),I=n(115),V=n(69),F=n(109),b=function(d){Object(v.a)(t,d);var l=Object(x.a)(t);function t(r){var o;return Object(g.a)(this,t),o=l.call(this,r),o.refContainer=function(s){o.container=s},t.restoreIframeSize(),o}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){o.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var s=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(s+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(z,null),this.props.children)}}]),t}(e.a.Component);(function(d){var l=window.location.pathname,t="x6-iframe-size";function r(){var a=localStorage.getItem(t),i;if(a)try{i=JSON.parse(a)}catch(p){}else i={};return i}function o(){var a=window.frameElement;if(a){var i=a.style,p={width:i.width,height:i.height},j=r();j[l]=p,localStorage.setItem(t,JSON.stringify(j))}}d.saveIframeSize=o;function s(){var a=window.frameElement;if(a){var i=r(),p=i[l];p&&(a.style.width=p.width||"100%",a.style.height=p.height||"auto")}}d.restoreIframeSize=s})(b||(b={}));var G=n(110),P=function(l){var t=l.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(V.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))};w.a.render(e.a.createElement(P,null,e.a.createElement(U,null)),document.getElementById("root"))},74:function(u,c,n){u.exports=n(111)},99:function(u,c,n){}},[[74,1,2]]]);
