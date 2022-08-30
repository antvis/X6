(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.circular"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.layout.circular"]||[]).push([[0],{296:function(p,c,n){p.exports=n(555)},304:function(p,c,n){},305:function(p,c,n){"use strict";n.r(c),n.d(c,"host",function(){return v}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return E});const v="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/layout/circular";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { CircularLayout } from '@antv/layout'
import './app.css'

const data: any = {
  lnodes: [],
  rnodes: [],
}

for (let i = 1; i <= 24; i++) {
  data.lnodes.push({
    id: i,
    shape: 'rect',
    width: 24,
    height: 24,
    label: '\u{1F49C}',
    attrs: {
      body: {
        stroke: 'transparent',
      },
    },
  })
  data.rnodes.push({
    id: i + 30,
    shape: 'path',
    width: 26,
    height: 26,
    attrs: {
      body: {
        d:
          'M0,-9.898961565145173L2.222455340918111,-3.0589473502942863L9.41447190108659,-3.058947350294287L3.596008280084239,1.1684139180159865L5.818463621002351,8.008428132866873L4.440892098500626e-16,3.7810668645565997L-5.8184636210023495,8.008428132866873L-3.5960082800842383,1.1684139180159867L-9.41447190108659,-3.058947350294285L-2.2224553409181116,-3.058947350294286Z',
        fill: '#ffffff',
        stroke: '#8921e0',
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

    const lcircularLayout = new CircularLayout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [140, 140],
    })
    const lmodel = lcircularLayout.layout({
      nodes: data.lnodes,
    })

    const rcircularLayout = new CircularLayout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [440, 140],
    })
    const rmodel = rcircularLayout.layout({
      nodes: data.rnodes,
    })

    graph.fromJSON({
      nodes: lmodel.nodes!.concat(rmodel.nodes!),
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
`,isBinary:!1}}}}function E(){return{title:"tutorial/advanced/layout/circular",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1","@antv/layout":"^0.1.9"},files:{"package.json":`{
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
import { CircularLayout } from '@antv/layout'
import './app.css'

const data: any = {
  lnodes: [],
  rnodes: [],
}

for (let i = 1; i <= 24; i++) {
  data.lnodes.push({
    id: i,
    shape: 'rect',
    width: 24,
    height: 24,
    label: '\u{1F49C}',
    attrs: {
      body: {
        stroke: 'transparent',
      },
    },
  })
  data.rnodes.push({
    id: i + 30,
    shape: 'path',
    width: 26,
    height: 26,
    attrs: {
      body: {
        d:
          'M0,-9.898961565145173L2.222455340918111,-3.0589473502942863L9.41447190108659,-3.058947350294287L3.596008280084239,1.1684139180159865L5.818463621002351,8.008428132866873L4.440892098500626e-16,3.7810668645565997L-5.8184636210023495,8.008428132866873L-3.5960082800842383,1.1684139180159867L-9.41447190108659,-3.058947350294285L-2.2224553409181116,-3.058947350294286Z',
        fill: '#ffffff',
        stroke: '#8921e0',
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

    const lcircularLayout = new CircularLayout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [140, 140],
    })
    const lmodel = lcircularLayout.layout({
      nodes: data.lnodes,
    })

    const rcircularLayout = new CircularLayout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [440, 140],
    })
    const rmodel = rcircularLayout.layout({
      nodes: data.rnodes,
    })

    graph.fromJSON({
      nodes: lmodel.nodes!.concat(rmodel.nodes!),
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
`}}}},309:function(p,c,n){},554:function(p,c,n){},555:function(p,c,n){"use strict";n.r(c);var v=n(1),e=n.n(v),E=n(53),A=n.n(E),y=n(3),g=n(4),x=n(5),L=n(6),D=n(564),U=n(560),M=n(565),N=n(566),m=n(563),P=n(301),R=n(266),k=n(304),w=n(305),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},T=function(d){Object(x.a)(t,d);var l=Object(L.a)(t);function t(){return Object(y.a)(this,t),l.apply(this,arguments)}return Object(g.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,{component:S}))),e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,null))),e.a.createElement(m.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(N.a,null)))))}}]),t}(e.a.Component),X=n(561),j=n(279),B=n(309),b=function(d){Object(x.a)(t,d);var l=Object(L.a)(t);function t(r){var a;return Object(y.a)(this,t),a=l.call(this,r),a.refContainer=function(s){a.container=s},t.restoreIframeSize(),a}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){a.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var s=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(s+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(T,null),this.props.children)}}]),t}(e.a.Component);(function(d){var l=window.location.pathname,t="x6-iframe-size";function r(){var o=localStorage.getItem(t),i;if(o)try{i=JSON.parse(o)}catch(u){}else i={};return i}function a(){var o=window.frameElement;if(o){var i=o.style,u={width:i.width,height:i.height},O=r();O[l]=u,localStorage.setItem(t,JSON.stringify(O))}}d.saveIframeSize=a;function s(){var o=window.frameElement;if(o){var i=r(),u=i[l];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}d.restoreIframeSize=s})(b||(b={}));for(var H=n(310),I=function(l){var t=l.children;return e.a.createElement(X.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))},V=n(286),C=n(173),J=n(554),f={lnodes:[],rnodes:[]},h=1;h<=24;h++)f.lnodes.push({id:h,shape:"rect",width:24,height:24,label:"\u{1F49C}",attrs:{body:{stroke:"transparent"}}}),f.rnodes.push({id:h+30,shape:"path",width:26,height:26,attrs:{body:{d:"M0,-9.898961565145173L2.222455340918111,-3.0589473502942863L9.41447190108659,-3.058947350294287L3.596008280084239,1.1684139180159865L5.818463621002351,8.008428132866873L4.440892098500626e-16,3.7810668645565997L-5.8184636210023495,8.008428132866873L-3.5960082800842383,1.1684139180159867L-9.41447190108659,-3.058947350294285L-2.2224553409181116,-3.058947350294286Z",fill:"#ffffff",stroke:"#8921e0"}}});var z=function(d){Object(x.a)(t,d);var l=Object(L.a)(t);function t(){var r;Object(y.a)(this,t);for(var a=arguments.length,s=new Array(a),o=0;o<a;o++)s[o]=arguments[o];return r=l.call.apply(l,[this].concat(s)),r.container=void 0,r.refContainer=function(i){r.container=i},r}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var a=new V.a({container:this.container,grid:!0}),s=new C.a({type:"circular",width:480,height:240,center:[140,140]}),o=s.layout({nodes:f.lnodes}),i=new C.a({type:"circular",width:480,height:240,center:[440,140]}),u=i.layout({nodes:f.rnodes});a.fromJSON({nodes:o.nodes.concat(u.nodes)})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component);A.a.render(e.a.createElement(I,null,e.a.createElement(z,null)),document.getElementById("root"))}},[[296,1,2]]]);
