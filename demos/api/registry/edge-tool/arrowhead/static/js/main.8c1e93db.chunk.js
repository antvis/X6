(this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-tool.arrowhead"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-tool.arrowhead"]||[]).push([[0],{70:function(m,u,n){m.exports=n(88)},76:function(m,u,n){},80:function(m,u,n){},81:function(m,u,n){"use strict";n.r(u),n.d(u,"host",function(){return h}),n.d(u,"getCodeSandboxParams",function(){return e}),n.d(u,"getStackblitzPrefillConfig",function(){return v});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/edge-tool/arrowhead";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-content {
  height: 320px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Shape } from '@antv/x6'
import './app.css'

Shape.Rect.config({
  attrs: {
    body: {
      magnet: false,
    },
  },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
      },
      out: {
        position: { name: 'bottom' },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        magnet: 'true',
        r: 6,
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 2,
      },
    },
  ],
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      grid: true,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({ sourceMagnet, targetMagnet }) {
          // \u53EA\u80FD\u4ECE\u8F93\u51FA\u94FE\u63A5\u6869\u521B\u5EFA\u8FDE\u63A5
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // \u53EA\u80FD\u8FDE\u63A5\u5230\u8F93\u5165\u94FE\u63A5\u6869
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'Target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'Hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-arrowhead',
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
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
`,isBinary:!1}}}}function v(){return{title:"api/registry/edge-tool/arrowhead",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-content {
  height: 320px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Shape } from '@antv/x6'
import './app.css'

Shape.Rect.config({
  attrs: {
    body: {
      magnet: false,
    },
  },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
      },
      out: {
        position: { name: 'bottom' },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        magnet: 'true',
        r: 6,
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 2,
      },
    },
  ],
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      grid: true,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({ sourceMagnet, targetMagnet }) {
          // \u53EA\u80FD\u4ECE\u8F93\u51FA\u94FE\u63A5\u6869\u521B\u5EFA\u8FDE\u63A5
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // \u53EA\u80FD\u8FDE\u63A5\u5230\u8F93\u5165\u94FE\u63A5\u6869
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'Target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'Hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-arrowhead',
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
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
`}}}},86:function(m,u,n){},88:function(m,u,n){"use strict";n.r(u);var h=n(0),e=n.n(h),v=n(20),O=n.n(v),E=n(1),x=n(2),y=n(3),b=n(4),A=n(48),V=n(76);A.b.Rect.config({attrs:{body:{magnet:!1}},ports:{groups:{in:{position:{name:"top"}},out:{position:{name:"bottom"}}}},portMarkup:[{tagName:"circle",selector:"portBody",attrs:{magnet:"true",r:6,fill:"#fff",stroke:"#000","stroke-width":2}}]});var N=function(p){Object(y.a)(t,p);var c=Object(b.a)(t);function t(){var i;Object(E.a)(this,t);for(var o=arguments.length,a=new Array(o),r=0;r<o;r++)a[r]=arguments[r];return i=c.call.apply(c,[this].concat(a)),i.container=void 0,i.refContainer=function(s){i.container=s},i}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var o={name:"stroke",args:{padding:3,attrs:{strokeWidth:3,stroke:"#52c41a"}}},a=new A.a({container:this.container,grid:!0,highlighting:{magnetAvailable:o},connecting:{snap:!0,allowBlank:!1,allowLoop:!1,allowNode:!1,highlight:!0,validateMagnet:function(d){var f=d.magnet;return f.getAttribute("port-group")!=="in"},validateConnection:function(d){var f=d.sourceMagnet,M=d.targetMagnet;return!f||f.getAttribute("port-group")==="in"?!1:!(!M||M.getAttribute("port-group")!=="in")}}}),r=a.addNode({x:40,y:40,width:100,height:40,label:"Source",ports:[{id:"in-1",group:"in"},{id:"in-2",group:"in"},{id:"out-1",group:"out"},{id:"out-2",group:"out"}]}),s=a.addNode({x:140,y:240,width:100,height:40,label:"Target",ports:[{id:"in-1",group:"in"},{id:"in-2",group:"in"},{id:"out-1",group:"out"},{id:"out-2",group:"out"}]});a.addNode({x:320,y:120,width:100,height:40,label:"Hello",ports:[{id:"in-1",group:"in"},{id:"in-2",group:"in"},{id:"out-1",group:"out"},{id:"out-2",group:"out"}]}),a.addEdge({source:{cell:r.id,port:"out-2"},target:{cell:s.id,port:"in-1"}}),a.on("edge:mouseenter",function(l){var d=l.cell;d.addTools([{name:"source-arrowhead"},{name:"target-arrowhead",args:{attrs:{fill:"red"}}}])}),a.on("edge:mouseleave",function(l){var d=l.cell;d.removeTools()})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),D=n(95),L=n(91),U=n(96),S=n(97),g=n(94),z=n(77),R=n(51),H=n(80),C=n(81),T=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(p){Object(y.a)(t,p);var c=Object(b.a)(t);function t(){return Object(E.a)(this,t),c.apply(this,arguments)}return Object(x.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,{component:T}))),e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(C.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,null))),e.a.createElement(g.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(C.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(S.a,null)))))}}]),t}(e.a.Component),X=n(92),k=n(65),B=n(86),w=function(p){Object(y.a)(t,p);var c=Object(b.a)(t);function t(i){var o;return Object(E.a)(this,t),o=c.call(this,i),o.refContainer=function(a){o.container=a},t.restoreIframeSize(),o}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var a=new window.ResizeObserver(function(){o.updateIframeSize()});a.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var a=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(a+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),t}(e.a.Component);(function(p){var c=window.location.pathname,t="x6-iframe-size";function i(){var r=localStorage.getItem(t),s;if(r)try{s=JSON.parse(r)}catch(l){}else s={};return s}function o(){var r=window.frameElement;if(r){var s=r.style,l={width:s.width,height:s.height},d=i();d[c]=l,localStorage.setItem(t,JSON.stringify(d))}}p.saveIframeSize=o;function a(){var r=window.frameElement;if(r){var s=i(),l=s[c];l&&(r.style.width=l.width||"100%",r.style.height=l.height||"auto")}}p.restoreIframeSize=a})(w||(w={}));var P=n(87),I=function(c){var t=c.children;return e.a.createElement(X.a.ErrorBoundary,null,e.a.createElement(k.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,t))};O.a.render(e.a.createElement(I,null,e.a.createElement(N,null)),document.getElementById("root"))}},[[70,1,2]]]);
