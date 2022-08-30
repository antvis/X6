(this["webpackJsonp@antv/x6-sites-demos-api.registry.router.metro"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.router.metro"]||[]).push([[0],{70:function(u,c,n){u.exports=n(88)},76:function(u,c,n){},80:function(u,c,n){},81:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return h}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return g});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/router/metro";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 500px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      attrs: {
        body: {
          fill: '#fe8550',
          stroke: '#ed8661',
          strokeWidth: 2,
        },
        label: {
          text: 'Source',
          fill: '#f0f0f0',
          fontSize: 18,
          fontWeight: 'lighter',
          fontVariant: 'small-caps',
        },
      },
    })

    const target = graph.addNode(
      source.clone().translate(480, 350).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 340,
      y: 140,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        label: {
          text: 'Obstacle',
          fill: '#eee',
        },
        body: {
          fill: '#9687fe',
          stroke: '#8e89e5',
          strokeWidth: 2,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(200, 100)))
    obstacles.push(graph.addNode(obstacle.clone().translate(-200, 150)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      router: {
        name: 'metro',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
        },
      },
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
`,isBinary:!1}}}}function g(){return{title:"api/registry/router/metro",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 500px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      attrs: {
        body: {
          fill: '#fe8550',
          stroke: '#ed8661',
          strokeWidth: 2,
        },
        label: {
          text: 'Source',
          fill: '#f0f0f0',
          fontSize: 18,
          fontWeight: 'lighter',
          fontVariant: 'small-caps',
        },
      },
    })

    const target = graph.addNode(
      source.clone().translate(480, 350).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 340,
      y: 140,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        label: {
          text: 'Obstacle',
          fill: '#eee',
        },
        body: {
          fill: '#9687fe',
          stroke: '#8e89e5',
          strokeWidth: 2,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(200, 100)))
    obstacles.push(graph.addNode(obstacle.clone().translate(-200, 150)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      router: {
        name: 'metro',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
        },
      },
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
`}}}},86:function(u,c,n){},88:function(u,c,n){"use strict";n.r(c);var h=n(0),e=n.n(h),g=n(20),O=n.n(g),E=n(1),v=n(2),b=n(3),x=n(4),A=n(67),k=n(76),D=function(d){Object(b.a)(o,d);var l=Object(x.a)(o);function o(){var r;Object(E.a)(this,o);for(var t=arguments.length,i=new Array(t),a=0;a<t;a++)i[a]=arguments[a];return r=l.call.apply(l,[this].concat(i)),r.container=void 0,r.refContainer=function(s){r.container=s},r}return Object(v.a)(o,[{key:"componentDidMount",value:function(){var t=new A.a({container:this.container,grid:!0}),i=t.addNode({x:80,y:40,width:120,height:50,attrs:{body:{fill:"#fe8550",stroke:"#ed8661",strokeWidth:2},label:{text:"Source",fill:"#f0f0f0",fontSize:18,fontWeight:"lighter",fontVariant:"small-caps"}}}),a=t.addNode(i.clone().translate(480,350).setAttrByPath("label/text","Target")),s=[],p=t.addNode({x:340,y:140,width:120,height:50,label:"Obstacle",attrs:{label:{text:"Obstacle",fill:"#eee"},body:{fill:"#9687fe",stroke:"#8e89e5",strokeWidth:2}}}),m,I=function(){var z=t.findViewByCell(m);z.update()};s.push(p),s.push(t.addNode(p.clone().translate(200,100))),s.push(t.addNode(p.clone().translate(-200,150))),s.forEach(function(C){return C.on("change:position",I)}),m=t.addEdge({source:i,target:a,router:{name:"metro",args:{startDirections:["top"],endDirections:["bottom"]}}})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),N=n(95),U=n(91),L=n(96),M=n(97),f=n(94),P=n(77),S=n(50),B=n(80),w=n(81),R=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},T=function(d){Object(b.a)(o,d);var l=Object(x.a)(o);function o(){return Object(E.a)(this,o),l.apply(this,arguments)}return Object(v.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,{component:R}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(S.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(M.a,null)))))}}]),o}(e.a.Component),V=n(92),j=n(64),H=n(86),y=function(d){Object(b.a)(o,d);var l=Object(x.a)(o);function o(r){var t;return Object(E.a)(this,o),t=l.call(this,r),t.refContainer=function(i){t.container=i},o.restoreIframeSize(),t}return Object(v.a)(o,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){t.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var i=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(i+16,"px"),t.style.border="0",t.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(T,null),this.props.children)}}]),o}(e.a.Component);(function(d){var l=window.location.pathname,o="x6-iframe-size";function r(){var a=localStorage.getItem(o),s;if(a)try{s=JSON.parse(a)}catch(p){}else s={};return s}function t(){var a=window.frameElement;if(a){var s=a.style,p={width:s.width,height:s.height},m=r();m[l]=p,localStorage.setItem(o,JSON.stringify(m))}}d.saveIframeSize=t;function i(){var a=window.frameElement;if(a){var s=r(),p=s[l];p&&(a.style.width=p.width||"100%",a.style.height=p.height||"auto")}}d.restoreIframeSize=i})(y||(y={}));var W=n(87),X=function(l){var o=l.children;return e.a.createElement(V.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(y,null,o))};O.a.render(e.a.createElement(X,null,e.a.createElement(D,null)),document.getElementById("root"))}},[[70,1,2]]]);
