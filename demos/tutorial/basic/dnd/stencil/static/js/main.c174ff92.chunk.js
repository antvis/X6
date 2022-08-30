(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.dnd.stencil"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.dnd.stencil"]||[]).push([[0],{70:function(u,c,n){u.exports=n(88)},76:function(u,c,n){},80:function(u,c,n){},81:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return g}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return x});const g="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/dnd/stencil";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-stencil {
  width: 200px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.app-content {
  flex: 1;
  height: 520px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Addon, Shape } from '@antv/x6'
import './app.css'

const { Stencil } = Addon
const { Rect, Circle } = Shape

export default class Example extends React.Component {
  private container: HTMLDivElement
  private stencilContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
    })

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
        },
      },
    })

    const target = graph.addNode({
      x: 320,
      y: 240,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
        },
      },
    })

    graph.addEdge({ source, target })

    graph.centerContent()

    const stencil = new Stencil({
      title: 'Components',
      target: graph,
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1
      },
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      groups: [
        {
          name: 'group1',
          title: 'Group(Collapsable)',
        },
        {
          name: 'group2',
          title: 'Group',
          collapsable: false,
        },
      ],
    })

    this.stencilContainer.appendChild(stencil.container)

    const r = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const c2 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const r2 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const r3 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c3 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    stencil.load([r, c, c2, r2.clone()], 'group1')
    stencil.load([c2.clone(), r2, r3, c3], 'group2')
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-stencil" ref={this.refStencil} />
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
`,isBinary:!1}}}}function x(){return{title:"tutorial/basic/dnd/stencil",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-stencil {
  width: 200px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.app-content {
  flex: 1;
  height: 520px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Addon, Shape } from '@antv/x6'
import './app.css'

const { Stencil } = Addon
const { Rect, Circle } = Shape

export default class Example extends React.Component {
  private container: HTMLDivElement
  private stencilContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
    })

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
        },
      },
    })

    const target = graph.addNode({
      x: 320,
      y: 240,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
        },
      },
    })

    graph.addEdge({ source, target })

    graph.centerContent()

    const stencil = new Stencil({
      title: 'Components',
      target: graph,
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1
      },
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      groups: [
        {
          name: 'group1',
          title: 'Group(Collapsable)',
        },
        {
          name: 'group2',
          title: 'Group',
          collapsable: false,
        },
      ],
    })

    this.stencilContainer.appendChild(stencil.container)

    const r = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const c2 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const r2 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const r3 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c3 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    stencil.load([r, c, c2, r2.clone()], 'group1')
    stencil.load([c2.clone(), r2, r3, c3], 'group2')
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-stencil" ref={this.refStencil} />
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
`}}}},86:function(u,c,n){},88:function(u,c,n){"use strict";n.r(c);var g=n(0),e=n.n(g),x=n(20),k=n.n(x),v=n(1),E=n(2),w=n(3),b=n(4),h=n(36),G=n(76),L=h.a.Stencil,y=h.c.Rect,C=h.c.Circle,N=function(d){Object(w.a)(r,d);var l=Object(b.a)(r);function r(){var o;Object(v.a)(this,r);for(var t=arguments.length,s=new Array(t),a=0;a<t;a++)s[a]=arguments[a];return o=l.call.apply(l,[this].concat(s)),o.container=void 0,o.stencilContainer=void 0,o.refContainer=function(i){o.container=i},o.refStencil=function(i){o.stencilContainer=i},o}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var t=new h.b({container:this.container,grid:!0,snapline:{enabled:!0,sharp:!0},scroller:{enabled:!0,pageVisible:!1,pageBreak:!1,pannable:!0}}),s=t.addNode({x:130,y:30,width:100,height:40,attrs:{label:{text:"Hello",fill:"#6a6c8a"},body:{stroke:"#31d0c6"}}}),a=t.addNode({x:320,y:240,width:100,height:40,attrs:{label:{text:"World",fill:"#6a6c8a"},body:{stroke:"#31d0c6"}}});t.addEdge({source:s,target:a}),t.centerContent();var i=new L({title:"Components",target:t,search:function(P,W){return P.shape.indexOf(W)!==-1},placeholder:"Search by shape name",notFoundText:"Not Found",collapsable:!0,stencilGraphWidth:200,stencilGraphHeight:180,groups:[{name:"group1",title:"Group(Collapsable)"},{name:"group2",title:"Group",collapsable:!1}]});this.stencilContainer.appendChild(i.container);var p=new y({width:70,height:40,attrs:{rect:{fill:"#31D0C6",stroke:"#4B4A67",strokeWidth:6},text:{text:"rect",fill:"white"}}}),f=new C({width:60,height:60,attrs:{circle:{fill:"#FE854F",strokeWidth:6,stroke:"#4B4A67"},text:{text:"ellipse",fill:"white"}}}),O=new C({width:60,height:60,attrs:{circle:{fill:"#4B4A67","stroke-width":6,stroke:"#FE854F"},text:{text:"ellipse",fill:"white"}}}),S=new y({width:70,height:40,attrs:{rect:{fill:"#4B4A67",stroke:"#31D0C6",strokeWidth:6},text:{text:"rect",fill:"white"}}}),z=new y({width:70,height:40,attrs:{rect:{fill:"#31D0C6",stroke:"#4B4A67",strokeWidth:6},text:{text:"rect",fill:"white"}}}),H=new C({width:60,height:60,attrs:{circle:{fill:"#FE854F",strokeWidth:6,stroke:"#4B4A67"},text:{text:"ellipse",fill:"white"}}});i.load([p,f,O,S.clone()],"group1"),i.load([O.clone(),S,z,H],"group2")}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-stencil",ref:this.refStencil}),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),r}(e.a.Component),U=n(95),R=n(91),M=n(96),T=n(97),m=n(94),J=n(77),j=n(51),Y=n(80),D=n(81),X=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},B=function(d){Object(w.a)(r,d);var l=Object(b.a)(r);function r(){return Object(v.a)(this,r),l.apply(this,arguments)}return Object(E.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(R.a,{component:X}))),e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,null))),e.a.createElement(m.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(D.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(T.a,null)))))}}]),r}(e.a.Component),F=n(92),I=n(65),Z=n(86),A=function(d){Object(w.a)(r,d);var l=Object(b.a)(r);function r(o){var t;return Object(v.a)(this,r),t=l.call(this,o),t.refContainer=function(s){t.container=s},r.restoreIframeSize(),t}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){t.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var s=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(s+16,"px"),t.style.border="0",t.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(B,null),this.props.children)}}]),r}(e.a.Component);(function(d){var l=window.location.pathname,r="x6-iframe-size";function o(){var a=localStorage.getItem(r),i;if(a)try{i=JSON.parse(a)}catch(p){}else i={};return i}function t(){var a=window.frameElement;if(a){var i=a.style,p={width:i.width,height:i.height},f=o();f[l]=p,localStorage.setItem(r,JSON.stringify(f))}}d.saveIframeSize=t;function s(){var a=window.frameElement;if(a){var i=o(),p=i[l];p&&(a.style.width=p.width||"100%",a.style.height=p.height||"auto")}}d.restoreIframeSize=s})(A||(A={}));var K=n(87),V=function(l){var r=l.children;return e.a.createElement(F.a.ErrorBoundary,null,e.a.createElement(I.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(A,null,r))};k.a.render(e.a.createElement(V,null,e.a.createElement(N,null)),document.getElementById("root"))}},[[70,1,2]]]);
