(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.grid"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.grid"]||[]).push([[0],{296:function(u,l,n){u.exports=n(555)},304:function(u,l,n){},305:function(u,l,n){"use strict";n.r(l),n.d(l,"host",function(){return g}),n.d(l,"getCodeSandboxParams",function(){return e}),n.d(l,"getStackblitzPrefillConfig",function(){return E});const g="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/layout/grid";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1",
    "@antv/layout": "^0.1.9"
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
  height: 300px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import { GridLayout } from '@antv/layout'
import './app.css'

const data: any = {
  nodes: [],
  edges: [],
}
const keyPoints = [
  20,
  12,
  12,
  4,
  18,
  12,
  12,
  6,
  16,
  17,
  17,
  10,
  10,
  3,
  3,
  2,
  2,
  9,
  9,
  10,
]

for (let i = 1; i <= 21; i++) {
  data.nodes.push({
    id: i,
    shape: 'circle',
    width: 32,
    height: 32,
    attrs: {
      body: {
        fill: keyPoints.includes(i) ? '#fd6d6f' : '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
    label: i,
  })
}

for (let i = 0; i < keyPoints.length; i += 2) {
  data.edges.push({
    source: keyPoints[i],
    target: keyPoints[i + 1],
    attrs: {
      line: {
        stroke: '#fd6d6f',
        targetMarker: null,
      },
    },
  })
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const gridLayout = new GridLayout({
      type: 'grid',
      begin: [10, 10],
      width: 480,
      height: 260,
      sortBy: 'label',
      rows: 3,
      cols: 7,
    })

    const model = gridLayout.layout(data)
    graph.fromJSON(model)
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
    "strict": false,
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
`,isBinary:!1}}}}function E(){return{title:"tutorial/advanced/layout/grid",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1","@antv/layout":"^0.1.9"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1",
    "@antv/layout": "^0.1.9"
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
  height: 300px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import { GridLayout } from '@antv/layout'
import './app.css'

const data: any = {
  nodes: [],
  edges: [],
}
const keyPoints = [
  20,
  12,
  12,
  4,
  18,
  12,
  12,
  6,
  16,
  17,
  17,
  10,
  10,
  3,
  3,
  2,
  2,
  9,
  9,
  10,
]

for (let i = 1; i <= 21; i++) {
  data.nodes.push({
    id: i,
    shape: 'circle',
    width: 32,
    height: 32,
    attrs: {
      body: {
        fill: keyPoints.includes(i) ? '#fd6d6f' : '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
    label: i,
  })
}

for (let i = 0; i < keyPoints.length; i += 2) {
  data.edges.push({
    source: keyPoints[i],
    target: keyPoints[i + 1],
    attrs: {
      line: {
        stroke: '#fd6d6f',
        targetMarker: null,
      },
    },
  })
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const gridLayout = new GridLayout({
      type: 'grid',
      begin: [10, 10],
      width: 480,
      height: 260,
      sortBy: 'label',
      rows: 3,
      cols: 7,
    })

    const model = gridLayout.layout(data)
    graph.fromJSON(model)
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
    "strict": false,
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
`}}}},309:function(u,l,n){},554:function(u,l,n){},555:function(u,l,n){"use strict";n.r(l);var g=n(1),e=n.n(g),E=n(53),D=n.n(E),y=n(3),x=n(4),b=n(5),w=n(6),U=n(564),M=n(560),N=n(565),R=n(566),f=n(563),B=n(301),S=n(265),H=n(304),L=n(305),T=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},X=function(c){Object(b.a)(t,c);var i=Object(w.a)(t);function t(){return Object(y.a)(this,t),i.apply(this,arguments)}return Object(x.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:T}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(L.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(N.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(S.getParameters)(L.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),t}(e.a.Component),j=n(561),k=n(278),G=n(309),O=function(c){Object(b.a)(t,c);var i=Object(w.a)(t);function t(r){var o;return Object(y.a)(this,t),o=i.call(this,r),o.refContainer=function(s){o.container=s},t.restoreIframeSize(),o}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){o.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var s=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(s+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(X,null),this.props.children)}}]),t}(e.a.Component);(function(c){var i=window.location.pathname,t="x6-iframe-size";function r(){var a=localStorage.getItem(t),d;if(a)try{d=JSON.parse(a)}catch(p){}else d={};return d}function o(){var a=window.frameElement;if(a){var d=a.style,p={width:d.width,height:d.height},A=r();A[i]=p,localStorage.setItem(t,JSON.stringify(A))}}c.saveIframeSize=o;function s(){var a=window.frameElement;if(a){var d=r(),p=d[i];p&&(a.style.width=p.width||"100%",a.style.height=p.height||"auto")}}c.restoreIframeSize=s})(O||(O={}));for(var J=n(310),P=function(i){var t=i.children;return e.a.createElement(j.a.ErrorBoundary,null,e.a.createElement(k.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(O,null,t))},I=n(285),V=n(286),F=n(554),C={nodes:[],edges:[]},h=[20,12,12,4,18,12,12,6,16,17,17,10,10,3,3,2,2,9,9,10],m=1;m<=21;m++)C.nodes.push({id:m,shape:"circle",width:32,height:32,attrs:{body:{fill:h.includes(m)?"#fd6d6f":"#855af2",stroke:"transparent"},label:{fill:"#ffffff"}},label:m});for(var v=0;v<h.length;v+=2)C.edges.push({source:h[v],target:h[v+1],attrs:{line:{stroke:"#fd6d6f",targetMarker:null}}});var z=function(c){Object(b.a)(t,c);var i=Object(w.a)(t);function t(){var r;Object(y.a)(this,t);for(var o=arguments.length,s=new Array(o),a=0;a<o;a++)s[a]=arguments[a];return r=i.call.apply(i,[this].concat(s)),r.container=void 0,r.refContainer=function(d){r.container=d},r}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var o=new I.a({container:this.container,grid:!0}),s=new V.a({type:"grid",begin:[10,10],width:480,height:260,sortBy:"label",rows:3,cols:7}),a=s.layout(C);o.fromJSON(a)}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component);D.a.render(e.a.createElement(P,null,e.a.createElement(z,null)),document.getElementById("root"))}},[[296,1,2]]]);
