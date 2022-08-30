(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.animation.signal"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.animation.signal"]||[]).push([[0],{70:function(g,d,t){g.exports=t(88)},76:function(g,d,t){},80:function(g,d,t){},81:function(g,d,t){"use strict";t.r(d),t.d(d,"host",function(){return v}),t.d(d,"getCodeSandboxParams",function(){return e}),t.d(d,"getStackblitzPrefillConfig",function(){return E});const v="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/animation/signal";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Cell, EdgeView, Vector } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const a = graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      label: 'A',
    })

    const b = graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      label: 'B',
    })

    const c = graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      label: 'C',
    })

    const d = graph.addNode({
      x: 80,
      y: 240,
      width: 100,
      height: 40,
      label: 'D',
    })

    graph.addEdge({
      source: a,
      target: b,
    })

    graph.addEdge({
      source: b,
      target: c,
    })

    graph.addEdge({
      source: b,
      target: d,
      connector: 'smooth',
      attrs: {
        line: {
          strokeDasharray: '5 5',
        },
      },
    })

    function flash(cell: Cell) {
      const cellView = graph.findViewByCell(cell)
      if (cellView) {
        cellView.highlight()
        setTimeout(() => cellView.unhighlight(), 300)
      }
    }

    graph.on('signal', (cell: Cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell) as EdgeView
        if (view) {
          const token = Vector.create('circle', { r: 6, fill: '#feb662' })
          const target = cell.getTargetCell()
          setTimeout(() => {
            view.sendToken(token.node, 1000, () => {
              if (target) {
                graph.trigger('signal', target)
              }
            })
          }, 300)
        }
      } else {
        flash(cell)
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        })
        edges.forEach((edge) => graph.trigger('signal', edge))
      }
    })

    let manual = false

    graph.on('node:mousedown', ({ cell }) => {
      manual = true
      graph.trigger('signal', cell)
    })

    const trigger = () => {
      graph.trigger('signal', a)
      if (!manual) {
        setTimeout(trigger, 5000)
      }
    }

    trigger()
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
`,isBinary:!1}}}}function E(){return{title:"tutorial/advanced/animation/signal",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Cell, EdgeView, Vector } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const a = graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      label: 'A',
    })

    const b = graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      label: 'B',
    })

    const c = graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      label: 'C',
    })

    const d = graph.addNode({
      x: 80,
      y: 240,
      width: 100,
      height: 40,
      label: 'D',
    })

    graph.addEdge({
      source: a,
      target: b,
    })

    graph.addEdge({
      source: b,
      target: c,
    })

    graph.addEdge({
      source: b,
      target: d,
      connector: 'smooth',
      attrs: {
        line: {
          strokeDasharray: '5 5',
        },
      },
    })

    function flash(cell: Cell) {
      const cellView = graph.findViewByCell(cell)
      if (cellView) {
        cellView.highlight()
        setTimeout(() => cellView.unhighlight(), 300)
      }
    }

    graph.on('signal', (cell: Cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell) as EdgeView
        if (view) {
          const token = Vector.create('circle', { r: 6, fill: '#feb662' })
          const target = cell.getTargetCell()
          setTimeout(() => {
            view.sendToken(token.node, 1000, () => {
              if (target) {
                graph.trigger('signal', target)
              }
            })
          }, 300)
        }
      } else {
        flash(cell)
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        })
        edges.forEach((edge) => graph.trigger('signal', edge))
      }
    })

    let manual = false

    graph.on('node:mousedown', ({ cell }) => {
      manual = true
      graph.trigger('signal', cell)
    })

    const trigger = () => {
      graph.trigger('signal', a)
      if (!manual) {
        setTimeout(trigger, 5000)
      }
    }

    trigger()
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
`}}}},86:function(g,d,t){},88:function(g,d,t){"use strict";t.r(d);var v=t(0),e=t.n(v),E=t(20),U=t.n(E),x=t(1),y=t(2),b=t(3),w=t(4),O=t(48),J=t(76),L=function(u){Object(b.a)(a,u);var l=Object(w.a)(a);function a(){var o;Object(x.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return o=l.call.apply(l,[this].concat(i)),o.container=void 0,o.refContainer=function(s){o.container=s},o}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var n=new O.a({container:this.container,grid:!0}),i=n.addNode({x:50,y:50,width:100,height:40,label:"A"}),r=n.addNode({x:250,y:50,width:100,height:40,label:"B"}),s=n.addNode({x:350,y:150,width:100,height:40,label:"C"}),p=n.addNode({x:80,y:240,width:100,height:40,label:"D"});n.addEdge({source:i,target:r}),n.addEdge({source:r,target:s}),n.addEdge({source:r,target:p,connector:"smooth",attrs:{line:{strokeDasharray:"5 5"}}});function f(c){var m=n.findViewByCell(c);m&&(m.highlight(),setTimeout(function(){return m.unhighlight()},300))}n.on("signal",function(c){if(c.isEdge()){var m=n.findViewByCell(c);if(m){var P=O.b.create("circle",{r:6,fill:"#feb662"}),N=c.getTargetCell();setTimeout(function(){m.sendToken(P.node,1e3,function(){N&&n.trigger("signal",N)})},300)}}else{f(c);var H=n.model.getConnectedEdges(c,{outgoing:!0});H.forEach(function(F){return n.trigger("signal",F)})}});var D=!1;n.on("node:mousedown",function(c){var m=c.cell;D=!0,n.trigger("signal",m)});var B=function c(){n.trigger("signal",i),D||setTimeout(c,5e3)};B()}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),T=t(95),M=t(91),V=t(96),R=t(97),h=t(94),G=t(77),S=t(51),Y=t(80),A=t(81),j=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},X=function(u){Object(b.a)(a,u);var l=Object(w.a)(a);function a(){return Object(x.a)(this,a),l.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(T.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:j}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(A.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(V.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(S.getParameters)(A.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),a}(e.a.Component),I=t(92),z=t(65),W=t(86),C=function(u){Object(b.a)(a,u);var l=Object(w.a)(a);function a(o){var n;return Object(x.a)(this,a),n=l.call(this,o),n.refContainer=function(i){n.container=i},a.restoreIframeSize(),n}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){n.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var i=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(i+16,"px"),n.style.border="0",n.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(X,null),this.props.children)}}]),a}(e.a.Component);(function(u){var l=window.location.pathname,a="x6-iframe-size";function o(){var r=localStorage.getItem(a),s;if(r)try{s=JSON.parse(r)}catch(p){}else s={};return s}function n(){var r=window.frameElement;if(r){var s=r.style,p={width:s.width,height:s.height},f=o();f[l]=p,localStorage.setItem(a,JSON.stringify(f))}}u.saveIframeSize=n;function i(){var r=window.frameElement;if(r){var s=o(),p=s[l];p&&(r.style.width=p.width||"100%",r.style.height=p.height||"auto")}}u.restoreIframeSize=i})(C||(C={}));var Z=t(87),k=function(l){var a=l.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(z.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(C,null,a))};U.a.render(e.a.createElement(k,null,e.a.createElement(L,null)),document.getElementById("root"))}},[[70,1,2]]]);
