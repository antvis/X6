(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.react.react-label-base"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.react.react-label-base"]||[]).push([[0],{74:function(u,d,n){u.exports=n(91)},80:function(u,d,n){},84:function(u,d,n){},85:function(u,d,n){"use strict";n.r(d),n.d(d,"host",function(){return v}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return y});const v="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/react/react-label-base";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  flex: 1;
  height: 200px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { Graph, Dom } from '@antv/x6'
import 'antd/dist/antd.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onEdgeLabelRendered: (args) => {
        const { label, container } = args
        const data = label.data
        if (data) {
          const content = this.appendForeignObject(container)
          if (data === 1) {
            const txt = document.createTextNode('text node')
            content.style.border = '1px solid #f0f0f0'
            content.style.borderRadius = '4px'
            content.appendChild(txt)
          } else if (data === 2) {
            const btn = document.createElement('button')
            btn.appendChild(document.createTextNode('HTML Button'))
            btn.style.height = '30px'
            btn.style.lineHeight = '1'
            btn.addEventListener('click', () => {
              alert('clicked')
            })
            content.appendChild(btn)
          } else if (data === 3) {
            ReactDOM.render(<Button size="small">Antd Button</Button>, content)
          }
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 480, y: 40 },
      label: { attrs: { text: { text: 'Hello' } } },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { x: 480, y: 100 },
      label: { position: 0.25, data: 1 },
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 480, y: 160 },
      labels: [
        { position: 0.25, data: 2 },
        { position: 0.75, data: 3 },
      ],
    })
  }

  appendForeignObject(container: Element): HTMLDivElement {
    const fo = Dom.createSvgElement('foreignObject')
    const body = Dom.createElementNS<HTMLBodyElement>('body', Dom.ns.xhtml)
    const content = Dom.createElementNS<HTMLDivElement>('div', Dom.ns.xhtml)

    fo.setAttribute('width', '120')
    fo.setAttribute('height', '30')
    fo.setAttribute('x', '-60')
    fo.setAttribute('y', '-15')

    body.setAttribute('xmlns', Dom.ns.xhtml)
    body.style.width = '100%'
    body.style.height = '100%'
    body.style.padding = '0'
    body.style.margin = '0'

    content.style.width = '100%'
    content.style.height = '100%'
    content.style.textAlign = 'center'
    content.style.lineHeight = '30px'

    body.appendChild(content)
    fo.appendChild(body)
    container.appendChild(fo)

    return content
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
`,isBinary:!1}}}}function y(){return{title:"tutorial/advanced/react/react-label-base",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  flex: 1;
  height: 200px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { Graph, Dom } from '@antv/x6'
import 'antd/dist/antd.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onEdgeLabelRendered: (args) => {
        const { label, container } = args
        const data = label.data
        if (data) {
          const content = this.appendForeignObject(container)
          if (data === 1) {
            const txt = document.createTextNode('text node')
            content.style.border = '1px solid #f0f0f0'
            content.style.borderRadius = '4px'
            content.appendChild(txt)
          } else if (data === 2) {
            const btn = document.createElement('button')
            btn.appendChild(document.createTextNode('HTML Button'))
            btn.style.height = '30px'
            btn.style.lineHeight = '1'
            btn.addEventListener('click', () => {
              alert('clicked')
            })
            content.appendChild(btn)
          } else if (data === 3) {
            ReactDOM.render(<Button size="small">Antd Button</Button>, content)
          }
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 480, y: 40 },
      label: { attrs: { text: { text: 'Hello' } } },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { x: 480, y: 100 },
      label: { position: 0.25, data: 1 },
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 480, y: 160 },
      labels: [
        { position: 0.25, data: 2 },
        { position: 0.75, data: 3 },
      ],
    })
  }

  appendForeignObject(container: Element): HTMLDivElement {
    const fo = Dom.createSvgElement('foreignObject')
    const body = Dom.createElementNS<HTMLBodyElement>('body', Dom.ns.xhtml)
    const content = Dom.createElementNS<HTMLDivElement>('div', Dom.ns.xhtml)

    fo.setAttribute('width', '120')
    fo.setAttribute('height', '30')
    fo.setAttribute('x', '-60')
    fo.setAttribute('y', '-15')

    body.setAttribute('xmlns', Dom.ns.xhtml)
    body.style.width = '100%'
    body.style.height = '100%'
    body.style.padding = '0'
    body.style.margin = '0'

    content.style.width = '100%'
    content.style.height = '100%'
    content.style.textAlign = 'center'
    content.style.lineHeight = '30px'

    body.appendChild(content)
    fo.appendChild(body)
    container.appendChild(fo)

    return content
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
`}}}},89:function(u,d,n){},91:function(u,d,n){"use strict";n.r(d);var v=n(0),e=n.n(v),y=n(20),L=n.n(y),b=n(1),C=n(2),D=n(3),A=n(4),M=n(97),m=n(32),P=n(53),k=n(80),N=function(c){Object(D.a)(o,c);var l=Object(A.a)(o);function o(){var i;Object(b.a)(this,o);for(var a=arguments.length,r=new Array(a),t=0;t<a;t++)r[t]=arguments[t];return i=l.call.apply(l,[this].concat(r)),i.container=void 0,i.refContainer=function(s){i.container=s},i}return Object(C.a)(o,[{key:"componentDidMount",value:function(){var a=this,r=new m.b({container:this.container,grid:!0,onEdgeLabelRendered:function(s){var p=s.label,E=s.container,x=p.data;if(x){var f=a.appendForeignObject(E);if(x===1){var V=document.createTextNode("text node");f.style.border="1px solid #f0f0f0",f.style.borderRadius="4px",f.appendChild(V)}else if(x===2){var h=document.createElement("button");h.appendChild(document.createTextNode("HTML Button")),h.style.height="30px",h.style.lineHeight="1",h.addEventListener("click",function(){alert("clicked")}),f.appendChild(h)}else x===3&&L.a.render(e.a.createElement(M.a,{size:"small"},"Antd Button"),f)}}});r.addEdge({source:{x:40,y:40},target:{x:480,y:40},label:{attrs:{text:{text:"Hello"}}}}),r.addEdge({source:{x:40,y:100},target:{x:480,y:100},label:{position:.25,data:1}}),r.addEdge({source:{x:40,y:160},target:{x:480,y:160},labels:[{position:.25,data:2},{position:.75,data:3}]})}},{key:"appendForeignObject",value:function(a){var r=m.a.createSvgElement("foreignObject"),t=m.a.createElementNS("body",m.a.ns.xhtml),s=m.a.createElementNS("div",m.a.ns.xhtml);return r.setAttribute("width","120"),r.setAttribute("height","30"),r.setAttribute("x","-60"),r.setAttribute("y","-15"),t.setAttribute("xmlns",m.a.ns.xhtml),t.style.width="100%",t.style.height="100%",t.style.padding="0",t.style.margin="0",s.style.width="100%",s.style.height="100%",s.style.textAlign="center",s.style.lineHeight="30px",t.appendChild(s),r.appendChild(t),a.appendChild(r),s}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),U=n(99),R=n(94),T=n(100),S=n(101),g=n(98),j=n(63),F=n(84),w=n(85),X=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},H=function(c){Object(D.a)(o,c);var l=Object(A.a)(o);function o(){return Object(b.a)(this,o),l.apply(this,arguments)}return Object(C.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(R.a,{component:X}))),e.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,null))),e.a.createElement(g.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(S.a,null)))))}}]),o}(e.a.Component),B=n(95),I=n(70),J=n(89),O=function(c){Object(D.a)(o,c);var l=Object(A.a)(o);function o(i){var a;return Object(b.a)(this,o),a=l.call(this,i),a.refContainer=function(r){a.container=r},o.restoreIframeSize(),a}return Object(C.a)(o,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){a.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var t=document.getElementById("loading");t&&t.parentNode&&t.parentNode.removeChild(t)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var r=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(r+16,"px"),a.style.border="0",a.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(H,null),this.props.children)}}]),o}(e.a.Component);(function(c){var l=window.location.pathname,o="x6-iframe-size";function i(){var t=localStorage.getItem(o),s;if(t)try{s=JSON.parse(t)}catch(p){}else s={};return s}function a(){var t=window.frameElement;if(t){var s=t.style,p={width:s.width,height:s.height},E=i();E[l]=p,localStorage.setItem(o,JSON.stringify(E))}}c.saveIframeSize=a;function r(){var t=window.frameElement;if(t){var s=i(),p=s[l];p&&(t.style.width=p.width||"100%",t.style.height=p.height||"auto")}}c.restoreIframeSize=r})(O||(O={}));var G=n(90),z=function(l){var o=l.children;return e.a.createElement(B.a.ErrorBoundary,null,e.a.createElement(I.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(O,null,o))};L.a.render(e.a.createElement(z,null,e.a.createElement(N,null)),document.getElementById("root"))}},[[74,1,2]]]);
