(this["webpackJsonp@antv/x6-sites-demos-api.registry.attr.text-wrap"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.attr.text-wrap"]||[]).push([[0],{70:function(p,i,n){p.exports=n(88)},76:function(p,i,n){},80:function(p,i,n){},81:function(p,i,n){"use strict";n.r(i),n.d(i,"host",function(){return f}),n.d(i,"getCodeSandboxParams",function(){return e}),n.d(i,"getStackblitzPrefillConfig",function(){return m});const f="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/attr/text-wrap";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 216px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    graph.addNode({
      x: 40,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar \u4E2D\u6587\u5B57\u7B26 lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello-test-foo-bar-lint-css-jsvascript-typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 40,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text:
            'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text:
            'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
            breakWord: false,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 16,
            ellipsis: true,
          },
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
        <div ref={this.refContainer} className="app-content" />
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
`,isBinary:!1}}}}function m(){return{title:"api/registry/attr/text-wrap",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 216px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    graph.addNode({
      x: 40,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar \u4E2D\u6587\u5B57\u7B26 lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello-test-foo-bar-lint-css-jsvascript-typescript',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 40,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text:
            'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text:
            'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 32,
            ellipsis: true,
            breakWord: false,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 16,
            ellipsis: true,
          },
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
        <div ref={this.refContainer} className="app-content" />
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
`}}}},86:function(p,i,n){},88:function(p,i,n){"use strict";n.r(i);var f=n(0),e=n.n(f),m=n(20),A=n.n(m),x=n(1),g=n(2),v=n(3),y=n(4),C=n(67),W=n(76),O=function(l){Object(v.a)(r,l);var a=Object(y.a)(r);function r(){var s;Object(x.a)(this,r);for(var t=arguments.length,d=new Array(t),o=0;o<t;o++)d[o]=arguments[o];return s=a.call.apply(a,[this].concat(d)),s.container=void 0,s.refContainer=function(c){s.container=c},s}return Object(g.a)(r,[{key:"componentDidMount",value:function(){var t=new C.a({container:this.container,grid:{visible:!0}});t.addNode({x:40,y:40,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"hello test foo bar lint css jsvascript typescript",textWrap:{width:144,height:32,ellipsis:!0}}}}),t.addNode({x:240,y:40,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"hello test foo bar \u4E2D\u6587\u5B57\u7B26 lint css jsvascript typescript",textWrap:{width:144,height:32,ellipsis:!0}}}}),t.addNode({x:440,y:40,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"hello-test-foo-bar-lint-css-jsvascript-typescript",textWrap:{width:144,height:32,ellipsis:!0}}}}),t.addNode({x:40,y:128,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"Thisissomeveryveryverylong word. Words will break according to usual rules.",textWrap:{width:144,height:32,ellipsis:!0}}}}),t.addNode({x:240,y:128,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"Thisissomeveryveryverylong word. Words will break according to usual rules.",textWrap:{width:144,height:32,ellipsis:!0,breakWord:!1}}}}),t.addNode({x:440,y:128,width:160,height:48,attrs:{body:{fill:"#ffffff",stroke:"#333333",strokeWidth:1,rx:5,ry:5},label:{textAnchor:"left",refX:8,text:"hello test foo bar lint css jsvascript typescript",textWrap:{width:144,height:16,ellipsis:!0}}}})}},{key:"render",value:function(){return f.createElement("div",{className:"app"},f.createElement("div",{ref:this.refContainer,className:"app-content"}))}}]),r}(f.Component),N=n(95),D=n(91),U=n(96),k=n(97),h=n(94),S=n(77),L=n(50),I=n(80),b=n(81),X=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},M=function(l){Object(v.a)(r,l);var a=Object(y.a)(r);function r(){return Object(x.a)(this,r),a.apply(this,arguments)}return Object(g.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,{component:X}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(b.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(L.getParameters)(b.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(k.a,null)))))}}]),r}(e.a.Component),j=n(92),R=n(64),V=n(86),E=function(l){Object(v.a)(r,l);var a=Object(y.a)(r);function r(s){var t;return Object(x.a)(this,r),t=a.call(this,s),t.refContainer=function(d){t.container=d},r.restoreIframeSize(),t}return Object(g.a)(r,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){t.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var d=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(d+16,"px"),t.style.border="0",t.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(M,null),this.props.children)}}]),r}(e.a.Component);(function(l){var a=window.location.pathname,r="x6-iframe-size";function s(){var o=localStorage.getItem(r),c;if(o)try{c=JSON.parse(o)}catch(u){}else c={};return c}function t(){var o=window.frameElement;if(o){var c=o.style,u={width:c.width,height:c.height},w=s();w[a]=u,localStorage.setItem(r,JSON.stringify(w))}}l.saveIframeSize=t;function d(){var o=window.frameElement;if(o){var c=s(),u=c[a];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}l.restoreIframeSize=d})(E||(E={}));var z=n(87),T=function(a){var r=a.children;return e.a.createElement(j.a.ErrorBoundary,null,e.a.createElement(R.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(E,null,r))};A.a.render(e.a.createElement(T,null,e.a.createElement(O,null)),document.getElementById("root"))}},[[70,1,2]]]);
