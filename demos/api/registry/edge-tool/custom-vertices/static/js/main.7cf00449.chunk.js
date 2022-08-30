(this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-tool.custom-vertices"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.edge-tool.custom-vertices"]||[]).push([[0],{177:function(m,c,n){m.exports=n(196)},184:function(m,c,n){},188:function(m,c,n){},189:function(m,c,n){"use strict";n.r(c),n.d(c,"host",function(){return f}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return v});const f="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/edge-tool/custom-vertices";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 240px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Vertices } from '@antv/x6/es/registry/tool/vertices'
import './app.css'

// eslint-disable-next-line
const RedVertices = Vertices.define<Vertices.Options>({
  name: 'red-vertices',
  attrs: {
    fill: 'red',
  },
})

Graph.registerEdgeTool('red-vertices', RedVertices, true)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    let edge2: Edge
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#3c4260',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
      tools: {
        name: 'red-vertices',
      },
    })

    edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#7c68fc',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools('red-vertices', 'onhover')
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTools('onhover')) {
        cell.removeTools()
      }
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
`,isBinary:!1}}}}function v(){return{title:"api/registry/edge-tool/custom-vertices",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 240px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Vertices } from '@antv/x6/es/registry/tool/vertices'
import './app.css'

// eslint-disable-next-line
const RedVertices = Vertices.define<Vertices.Options>({
  name: 'red-vertices',
  attrs: {
    fill: 'red',
  },
})

Graph.registerEdgeTool('red-vertices', RedVertices, true)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    let edge2: Edge
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#3c4260',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
      tools: {
        name: 'red-vertices',
      },
    })

    edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#7c68fc',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools('red-vertices', 'onhover')
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTools('onhover')) {
        cell.removeTools()
      }
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
`}}}},194:function(m,c,n){},196:function(m,c,n){"use strict";n.r(c);var f=n(2),e=n.n(f),v=n(60),A=n.n(v),h=n(3),g=n(4),E=n(5),x=n(6),b=n(155),w=n(140),I=n(184),D=w.a.define({name:"red-vertices",attrs:{fill:"red"}});b.a.registerEdgeTool("red-vertices",D,!0);var U=function(d){Object(E.a)(t,d);var l=Object(x.a)(t);function t(){var a;Object(h.a)(this,t);for(var o=arguments.length,i=new Array(o),r=0;r<o;r++)i[r]=arguments[r];return a=l.call.apply(l,[this].concat(i)),a.container=void 0,a.refContainer=function(s){a.container=s},a}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var o,i=new b.a({container:this.container,grid:!0});i.addEdge({source:{x:40,y:40},target:{x:380,y:40},vertices:[{x:40,y:80},{x:200,y:80},{x:200,y:40}],attrs:{line:{stroke:"#3c4260",strokeWidth:2,targetMarker:"classic"}},tools:{name:"red-vertices"}}),o=i.addEdge({source:{x:60,y:140},target:{x:380,y:140},vertices:[{x:40,y:180},{x:200,y:140},{x:240,y:180}],connector:"smooth",attrs:{line:{stroke:"#7c68fc",strokeWidth:2,targetMarker:"classic"}}}),i.on("edge:mouseenter",function(r){var s=r.cell;s===o&&s.addTools("red-vertices","onhover")}),i.on("edge:mouseleave",function(r){var s=r.cell;s.hasTools("onhover")&&s.removeTools()})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),L=n(207),M=n(203),T=n(208),R=n(209),u=n(206),z=n(185),N=n(158),P=n(188),C=n(189),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},X=function(d){Object(E.a)(t,d);var l=Object(x.a)(t);function t(){return Object(h.a)(this,t),l.apply(this,arguments)}return Object(g.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(u.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(L.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(u.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:S}))),e.a.createElement(u.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(C.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,null))),e.a.createElement(u.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(N.getParameters)(C.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),t}(e.a.Component),j=n(204),V=n(172),B=n(194),y=function(d){Object(E.a)(t,d);var l=Object(x.a)(t);function t(a){var o;return Object(h.a)(this,t),o=l.call(this,a),o.refContainer=function(i){o.container=i},t.restoreIframeSize(),o}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){o.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var i=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(i+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(X,null),this.props.children)}}]),t}(e.a.Component);(function(d){var l=window.location.pathname,t="x6-iframe-size";function a(){var r=localStorage.getItem(t),s;if(r)try{s=JSON.parse(r)}catch(p){}else s={};return s}function o(){var r=window.frameElement;if(r){var s=r.style,p={width:s.width,height:s.height},O=a();O[l]=p,localStorage.setItem(t,JSON.stringify(O))}}d.saveIframeSize=o;function i(){var r=window.frameElement;if(r){var s=a(),p=s[l];p&&(r.style.width=p.width||"100%",r.style.height=p.height||"auto")}}d.restoreIframeSize=i})(y||(y={}));var H=n(195),k=function(l){var t=l.children;return e.a.createElement(j.a.ErrorBoundary,null,e.a.createElement(V.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(y,null,t))};A.a.render(e.a.createElement(k,null,e.a.createElement(U,null)),document.getElementById("root"))}},[[177,1,2]]]);
