(this["webpackJsonp@antv/x6-sites-demos-api.registry.node-tool.button"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.node-tool.button"]||[]).push([[0],{70:function(m,d,n){m.exports=n(88)},76:function(m,d,n){},80:function(m,d,n){},81:function(m,d,n){"use strict";n.r(d),n.d(d,"host",function(){return g}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return x});const g="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/node-tool/button";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph, Color } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 120,
      height: 60,
      label: 'Source',
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn A',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: '100%',
            y: '100%',
            offset: { x: -18, y: -18 },
            onClick({ view }: any) {
              const node = view.cell
              const fill = Color.randomHex()
              node.attr({
                body: {
                  fill,
                },
                label: {
                  fill: Color.invert(fill, true),
                },
              })
            },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 120,
      height: 60,
      label: 'Target',
    })

    graph.addEdge({
      source,
      target,
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: 0,
            y: 0,
            offset: { x: 18, y: 18 },
            onClick({ view }: any) {
              const node = view.cell
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset:
                    (node.attr('line/strokeDashoffset') | 0) + 20,
                },
              })
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ cell }) => {
      if (cell === target) {
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
`,isBinary:!1}}}}function x(){return{title:"api/registry/node-tool/button",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph, Color } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 120,
      height: 60,
      label: 'Source',
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn A',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: '100%',
            y: '100%',
            offset: { x: -18, y: -18 },
            onClick({ view }: any) {
              const node = view.cell
              const fill = Color.randomHex()
              node.attr({
                body: {
                  fill,
                },
                label: {
                  fill: Color.invert(fill, true),
                },
              })
            },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 120,
      height: 60,
      label: 'Target',
    })

    graph.addEdge({
      source,
      target,
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: 0,
            y: 0,
            offset: { x: 18, y: 18 },
            onClick({ view }: any) {
              const node = view.cell
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset:
                    (node.attr('line/strokeDashoffset') | 0) + 20,
                },
              })
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ cell }) => {
      if (cell === target) {
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
`}}}},86:function(m,d,n){},88:function(m,d,n){"use strict";n.r(d);var g=n(0),e=n.n(g),x=n(20),N=n.n(x),E=n(1),y=n(2),b=n(3),C=n(4),f=n(36),V=n(76),U=function(u){Object(b.a)(o,u);var c=Object(C.a)(o);function o(){var a;Object(E.a)(this,o);for(var t=arguments.length,l=new Array(t),r=0;r<t;r++)l[r]=arguments[r];return a=c.call.apply(c,[this].concat(l)),a.container=void 0,a.refContainer=function(s){a.container=s},a}return Object(y.a)(o,[{key:"componentDidMount",value:function(){var t=new f.b({container:this.container,grid:!0}),l=t.addNode({x:40,y:40,width:120,height:60,label:"Source",tools:[{name:"button",args:{markup:[{tagName:"circle",selector:"button",attrs:{r:14,stroke:"#fe854f","stroke-width":3,fill:"white",cursor:"pointer"}},{tagName:"text",textContent:"Btn A",selector:"icon",attrs:{fill:"#fe854f","font-size":8,"text-anchor":"middle","pointer-events":"none",y:"0.3em"}}],x:"100%",y:"100%",offset:{x:-18,y:-18},onClick:function(i){var p=i.view,D=p.cell,v=f.a.randomHex();D.attr({body:{fill:v},label:{fill:f.a.invert(v,!0)}})}}}]}),r=t.addNode({x:120,y:160,width:120,height:60,label:"Target"});t.addEdge({source:l,target:r}),t.on("node:mouseenter",function(s){var i=s.node;i===r&&i.addTools({name:"button",args:{markup:[{tagName:"circle",selector:"button",attrs:{r:14,stroke:"#fe854f","stroke-width":3,fill:"white",cursor:"pointer"}},{tagName:"text",textContent:"Btn B",selector:"icon",attrs:{fill:"#fe854f","font-size":8,"text-anchor":"middle","pointer-events":"none",y:"0.3em"}}],x:0,y:0,offset:{x:18,y:18},onClick:function(D){var v=D.view,A=v.cell;A.attr({body:{stroke:f.a.randomHex(),strokeDasharray:"5, 1",strokeDashoffset:(A.attr("line/strokeDashoffset")|0)+20}})}}})}),t.on("node:mouseleave",function(s){var i=s.cell;i===r&&i.removeTools()})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),L=n(95),M=n(91),k=n(96),T=n(97),h=n(94),B=n(77),R=n(51),P=n(80),O=n(81),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(u){Object(b.a)(o,u);var c=Object(C.a)(o);function o(){return Object(E.a)(this,o),c.apply(this,arguments)}return Object(y.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(L.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:S}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(k.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(O.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(T.a,null)))))}}]),o}(e.a.Component),X=n(92),z=n(65),H=n(86),w=function(u){Object(b.a)(o,u);var c=Object(C.a)(o);function o(a){var t;return Object(E.a)(this,o),t=c.call(this,a),t.refContainer=function(l){t.container=l},o.restoreIframeSize(),t}return Object(y.a)(o,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){t.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var l=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(l+16,"px"),t.style.border="0",t.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),o}(e.a.Component);(function(u){var c=window.location.pathname,o="x6-iframe-size";function a(){var r=localStorage.getItem(o),s;if(r)try{s=JSON.parse(r)}catch(i){}else s={};return s}function t(){var r=window.frameElement;if(r){var s=r.style,i={width:s.width,height:s.height},p=a();p[c]=i,localStorage.setItem(o,JSON.stringify(p))}}u.saveIframeSize=t;function l(){var r=window.frameElement;if(r){var s=a(),i=s[c];i&&(r.style.width=i.width||"100%",r.style.height=i.height||"auto")}}u.restoreIframeSize=l})(w||(w={}));var F=n(87),I=function(c){var o=c.children;return e.a.createElement(X.a.ErrorBoundary,null,e.a.createElement(z.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,o))};N.a.render(e.a.createElement(I,null,e.a.createElement(U,null)),document.getElementById("root"))}},[[70,1,2]]]);
