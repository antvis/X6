(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.attrs.ref-elem"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.attrs.ref-elem"]||[]).push([[0],{70:function(m,c,n){m.exports=n(88)},76:function(m,c,n){},80:function(m,c,n){},81:function(m,c,n){"use strict";n.r(c),n.d(c,"host",function(){return v}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return x});const v="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/attrs/ref-elem";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-text',
  {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'e',
      },
      {
        tagName: 'rect',
        selector: 'r',
      },
      {
        tagName: 'circle',
        selector: 'c',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      label: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 48,
      },
      e: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        ref: 'label',
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        strokeWidth: 1,
        stroke: '#000000',
        strokeDasharray: '5 5',
        strokeDashoffset: 2.5,
        fill: 'none',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const node = graph.addNode({
      shape: 'custom-text',
      x: 320,
      y: 160,
      width: 280,
      height: 120,
      attrs: {
        label: {
          text: 'H',
        },
        e: {
          ref: 'label',
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          ref: 'label',
          refX: '100%',
          refY: '100%',
          x: -10,
          y: -10,
          refWidth: '50%',
          refHeight: '50%',
        },
        c: {
          ref: 'label',
          refRCircumscribed: '50%',
        },
      },
    })

    let currentTransitions = 0
    let typeToggle = true

    function type() {
      node.transition('attrs/label/text', 'Hello, World!', {
        delay: 1000,
        duration: 4000,
        interp(start, end) {
          return function (time) {
            return start + end.substr(1, Math.ceil(end.length * time))
          }
        },
      })

      typeToggle = false
    }

    function untype() {
      node.transition('attrs/label/text', 'H', {
        delay: 1000,
        duration: 4000,
        timing(time) {
          return 1 - time
        },
        interp(start, end) {
          return function (time) {
            return end + start.substr(1, Math.ceil(start.length * time))
          }
        },
      })

      typeToggle = true
    }

    type()

    node.on('transition:start', () => {
      currentTransitions += 1
    })

    node.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (typeToggle) {
          type()
        } else {
          untype()
        }
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
`,isBinary:!1}}}}function x(){return{title:"tutorial/intermediate/attrs/ref-elem",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-text',
  {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'e',
      },
      {
        tagName: 'rect',
        selector: 'r',
      },
      {
        tagName: 'circle',
        selector: 'c',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      label: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 48,
      },
      e: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        ref: 'label',
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        strokeWidth: 1,
        stroke: '#000000',
        strokeDasharray: '5 5',
        strokeDashoffset: 2.5,
        fill: 'none',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const node = graph.addNode({
      shape: 'custom-text',
      x: 320,
      y: 160,
      width: 280,
      height: 120,
      attrs: {
        label: {
          text: 'H',
        },
        e: {
          ref: 'label',
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          ref: 'label',
          refX: '100%',
          refY: '100%',
          x: -10,
          y: -10,
          refWidth: '50%',
          refHeight: '50%',
        },
        c: {
          ref: 'label',
          refRCircumscribed: '50%',
        },
      },
    })

    let currentTransitions = 0
    let typeToggle = true

    function type() {
      node.transition('attrs/label/text', 'Hello, World!', {
        delay: 1000,
        duration: 4000,
        interp(start, end) {
          return function (time) {
            return start + end.substr(1, Math.ceil(end.length * time))
          }
        },
      })

      typeToggle = false
    }

    function untype() {
      node.transition('attrs/label/text', 'H', {
        delay: 1000,
        duration: 4000,
        timing(time) {
          return 1 - time
        },
        interp(start, end) {
          return function (time) {
            return end + start.substr(1, Math.ceil(start.length * time))
          }
        },
      })

      typeToggle = true
    }

    type()

    node.on('transition:start', () => {
      currentTransitions += 1
    })

    node.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (typeToggle) {
          type()
        } else {
          untype()
        }
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
`}}}},86:function(m,c,n){},88:function(m,c,n){"use strict";n.r(c);var v=n(0),e=n.n(v),x=n(20),M=n.n(x),E=n(1),y=n(2),b=n(3),C=n(4),O=n(48),z=n(76);O.a.registerNode("custom-text",{markup:[{tagName:"ellipse",selector:"e"},{tagName:"rect",selector:"r"},{tagName:"circle",selector:"c"},{tagName:"text",selector:"label"},{tagName:"rect",selector:"outline"}],attrs:{label:{textAnchor:"middle",textVerticalAnchor:"middle",fontSize:48},e:{strokeWidth:1,stroke:"#000000",fill:"rgba(255,0,0,0.3)"},r:{strokeWidth:1,stroke:"#000000",fill:"rgba(0,255,0,0.3)"},c:{strokeWidth:1,stroke:"#000000",fill:"rgba(0,0,255,0.3)"},outline:{ref:"label",refX:0,refY:0,refWidth:"100%",refHeight:"100%",strokeWidth:1,stroke:"#000000",strokeDasharray:"5 5",strokeDashoffset:2.5,fill:"none"}}},!0);var T=function(d){Object(b.a)(t,d);var l=Object(C.a)(t);function t(){var o;Object(E.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return o=l.call.apply(l,[this].concat(i)),o.container=void 0,o.refContainer=function(s){o.container=s},o}return Object(y.a)(t,[{key:"componentDidMount",value:function(){var a=new O.a({container:this.container,grid:!0,interacting:!1}),i=a.addNode({shape:"custom-text",x:320,y:160,width:280,height:120,attrs:{label:{text:"H"},e:{ref:"label",refRx:"50%",refRy:"25%",refCx:"50%",refCy:0,refX:"-50%",refY:"25%"},r:{ref:"label",refX:"100%",refY:"100%",x:-10,y:-10,refWidth:"50%",refHeight:"50%"},c:{ref:"label",refRCircumscribed:"50%"}}}),r=0,s=!0;function u(){i.transition("attrs/label/text","Hello, World!",{delay:1e3,duration:4e3,interp:function(p,g){return function(N){return p+g.substr(1,Math.ceil(g.length*N))}}}),s=!1}function h(){i.transition("attrs/label/text","H",{delay:1e3,duration:4e3,timing:function(p){return 1-p},interp:function(p,g){return function(N){return g+p.substr(1,Math.ceil(p.length*N))}}}),s=!0}u(),i.on("transition:start",function(){r+=1}),i.on("transition:complete",function(){r-=1,r===0&&(s?u():h())})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),U=n(95),L=n(91),R=n(96),X=n(97),f=n(94),P=n(77),k=n(51),W=n(80),D=n(81),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(d){Object(b.a)(t,d);var l=Object(C.a)(t);function t(){return Object(E.a)(this,t),l.apply(this,arguments)}return Object(y.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,{component:S}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(R.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(k.getParameters)(D.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(X.a,null)))))}}]),t}(e.a.Component),H=n(92),I=n(65),B=n(86),A=function(d){Object(b.a)(t,d);var l=Object(C.a)(t);function t(o){var a;return Object(E.a)(this,t),a=l.call(this,o),a.refContainer=function(i){a.container=i},t.restoreIframeSize(),a}return Object(y.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),t}(e.a.Component);(function(d){var l=window.location.pathname,t="x6-iframe-size";function o(){var r=localStorage.getItem(t),s;if(r)try{s=JSON.parse(r)}catch(u){}else s={};return s}function a(){var r=window.frameElement;if(r){var s=r.style,u={width:s.width,height:s.height},h=o();h[l]=u,localStorage.setItem(t,JSON.stringify(h))}}d.saveIframeSize=a;function i(){var r=window.frameElement;if(r){var s=o(),u=s[l];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}d.restoreIframeSize=i})(A||(A={}));var Y=n(87),V=function(l){var t=l.children;return e.a.createElement(H.a.ErrorBoundary,null,e.a.createElement(I.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(A,null,t))};M.a.render(e.a.createElement(V,null,e.a.createElement(T,null)),document.getElementById("root"))}},[[70,1,2]]]);
