(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.dagre"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.dagre"]||[]).push([[0],{296:function(u,l,n){u.exports=n(555)},304:function(u,l,n){},305:function(u,l,n){"use strict";n.r(l),n.d(l,"host",function(){return h}),n.d(l,"getCodeSandboxParams",function(){return e}),n.d(l,"getStackblitzPrefillConfig",function(){return g});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/layout/dagre";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 400px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import './app.css'

const data: any = {
  nodes: [],
  edges: [],
}

for (let i = 1; i <= 12; i++) {
  data.nodes.push({
    id: i + '',
    shape: 'rect',
    width: 60,
    height: 30,
    label: i,
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
  })
}

data.edges.push(
  ...[
    {
      source: '1',
      target: '2',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '3',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '4',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '5',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '6',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '7',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '8',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '5',
      target: '9',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '6',
      target: '10',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '7',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '8',
      target: '12',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
  ],
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const dagreLayout = new DagreLayout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UR',
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    })
    const model = dagreLayout.layout(data)

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
`,isBinary:!1}}}}function g(){return{title:"tutorial/advanced/layout/dagre",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1","@antv/layout":"^0.1.9"},files:{"package.json":`{
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
  height: 400px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import './app.css'

const data: any = {
  nodes: [],
  edges: [],
}

for (let i = 1; i <= 12; i++) {
  data.nodes.push({
    id: i + '',
    shape: 'rect',
    width: 60,
    height: 30,
    label: i,
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
  })
}

data.edges.push(
  ...[
    {
      source: '1',
      target: '2',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '3',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '4',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '5',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '6',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '7',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '8',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '5',
      target: '9',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '6',
      target: '10',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '7',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '8',
      target: '12',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
  ],
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const dagreLayout = new DagreLayout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UR',
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    })
    const model = dagreLayout.layout(data)

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
`}}}},309:function(u,l,n){},554:function(u,l,n){},555:function(u,l,n){"use strict";n.r(l);var h=n(1),e=n.n(h),g=n(53),w=n.n(g),v=n(3),E=n(4),y=n(5),x=n(6),D=n(564),A=n(560),U=n(565),M=n(566),m=n(563),z=n(301),R=n(265),P=n(304),O=n(305),N=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},S=function(d){Object(y.a)(t,d);var i=Object(x.a)(t);function t(){return Object(v.a)(this,t),i.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(A.a,{component:N}))),e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,null))),e.a.createElement(m.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(O.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(M.a,null)))))}}]),t}(e.a.Component),T=n(561),X=n(278),B=n(309),b=function(d){Object(y.a)(t,d);var i=Object(x.a)(t);function t(a){var r;return Object(v.a)(this,t),r=i.call(this,a),r.refContainer=function(s){r.container=s},t.restoreIframeSize(),r}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){r.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var s=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(s+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(S,null),this.props.children)}}]),t}(e.a.Component);(function(d){var i=window.location.pathname,t="x6-iframe-size";function a(){var o=localStorage.getItem(t),c;if(o)try{c=JSON.parse(o)}catch(p){}else c={};return c}function r(){var o=window.frameElement;if(o){var c=o.style,p={width:c.width,height:c.height},L=a();L[i]=p,localStorage.setItem(t,JSON.stringify(L))}}d.saveIframeSize=r;function s(){var o=window.frameElement;if(o){var c=a(),p=c[i];p&&(o.style.width=p.width||"100%",o.style.height=p.height||"auto")}}d.restoreIframeSize=s})(b||(b={}));for(var H=n(310),j=function(i){var t=i.children;return e.a.createElement(T.a.ErrorBoundary,null,e.a.createElement(X.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))},W=n(285),I=n(286),J=n(554),C,k={nodes:[],edges:[]},f=1;f<=12;f++)k.nodes.push({id:f+"",shape:"rect",width:60,height:30,label:f,attrs:{body:{fill:"#855af2",stroke:"transparent"},label:{fill:"#ffffff"}}});(C=k.edges).push.apply(C,[{source:"1",target:"2",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"2",target:"3",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"2",target:"4",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"4",target:"5",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"4",target:"6",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"4",target:"7",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"4",target:"8",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"5",target:"9",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"6",target:"10",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"7",target:"11",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}},{source:"8",target:"12",attrs:{line:{stroke:"#fd6d6f",strokeWidth:1}}}]);var V=function(d){Object(y.a)(t,d);var i=Object(x.a)(t);function t(){var a;Object(v.a)(this,t);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return a=i.call.apply(i,[this].concat(s)),a.container=void 0,a.refContainer=function(c){a.container=c},a}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var r=new W.a({container:this.container,grid:!0}),s=new I.a({type:"dagre",rankdir:"LR",align:"UR",ranksep:30,nodesep:15,controlPoints:!0}),o=s.layout(k);r.fromJSON(o)}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component);w.a.render(e.a.createElement(j,null,e.a.createElement(V,null)),document.getElementById("root"))}},[[296,1,2]]]);
