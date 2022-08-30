(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.edge.custom-marker"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.edge.custom-marker"]||[]).push([[0],{70:function(m,l,e){m.exports=e(88)},76:function(m,l,e){},80:function(m,l,e){},81:function(m,l,e){"use strict";e.r(l),e.d(l,"host",function(){return y}),e.d(l,"getCodeSandboxParams",function(){return n}),e.d(l,"getStackblitzPrefillConfig",function(){return M});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/edge/custom-marker";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: 'green',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      edge.transition('source', (10 + 9.36 / 60) / 12, {
        delay: 1000,
        duration: 19000,
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140 / 1.618
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    function minuteHand() {
      edge.transition('target', 9.36 / 60, {
        delay: 1000,
        duration: 19000,
        timing: (time) => {
          return time * 12 - Math.floor(time * 12)
        },
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    let currentTransitions = 0

    hourHand()
    minuteHand()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        hourHand()
        minuteHand()
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
`,isBinary:!1}}}}function M(){return{title:"tutorial/basic/edge/custom-marker",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: 'green',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      edge.transition('source', (10 + 9.36 / 60) / 12, {
        delay: 1000,
        duration: 19000,
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140 / 1.618
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    function minuteHand() {
      edge.transition('target', 9.36 / 60, {
        delay: 1000,
        duration: 19000,
        timing: (time) => {
          return time * 12 - Math.floor(time * 12)
        },
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    let currentTransitions = 0

    hourHand()
    minuteHand()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        hourHand()
        minuteHand()
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
`}}}},86:function(m,l,e){},88:function(m,l,e){"use strict";e.r(l);var y=e(0),n=e.n(y),M=e(20),L=e.n(M),b=e(1),C=e(2),O=e(3),w=e(4),T=e(67),B=e(76),N=function(d){Object(O.a)(t,d);var c=Object(w.a)(t);function t(){var o;Object(b.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return o=c.call.apply(c,[this].concat(i)),o.container=void 0,o.refContainer=function(s){o.container=s},o}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=new T.a({container:this.container,grid:!0}),i=a.addEdge({source:[228.84550125020417,100.76702664502545],target:[416.2834258874138,72.03741369165368],vertices:[{x:300,y:150}],attrs:{line:{sourceMarker:{tagName:"path",d:"M 20 -10 0 0 20 10 Z"},targetMarker:{tagName:"path",stroke:"green",strokeWidth:2,fill:"yellow",d:"M 20 -10 0 0 20 10 Z"}}}});function r(){i.transition("source",(10+9.36/60)/12,{delay:1e3,duration:19e3,interp:function(x,D){var f=D*(2*Math.PI)-Math.PI/2,h={x:300,y:150},g=140/1.618;return function(v){return{x:h.x+g*Math.cos(v*2*Math.PI+f),y:h.y+g*Math.sin(v*2*Math.PI+f)}}}})}function s(){i.transition("target",9.36/60,{delay:1e3,duration:19e3,timing:function(x){return x*12-Math.floor(x*12)},interp:function(x,D){var f=D*(2*Math.PI)-Math.PI/2,h={x:300,y:150},g=140;return function(v){return{x:h.x+g*Math.cos(v*2*Math.PI+f),y:h.y+g*Math.sin(v*2*Math.PI+f)}}}})}var u=0;r(),s(),i.on("transition:start",function(){u+=1}),i.on("transition:complete",function(){u-=1,u===0&&(r(),s())})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(n.a.Component),I=e(95),R=e(91),P=e(96),S=e(97),E=e(94),F=e(77),j=e(50),J=e(80),U=e(81),X=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},k=function(d){Object(O.a)(t,d);var c=Object(w.a)(t);function t(){return Object(b.a)(this,t),c.apply(this,arguments)}return Object(C.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(I.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(R.a,{component:X}))),n.a.createElement(E.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(U.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(P.a,null))),n.a.createElement(E.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(U.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(S.a,null)))))}}]),t}(n.a.Component),H=e(92),V=e(64),G=e(86),A=function(d){Object(O.a)(t,d);var c=Object(w.a)(t);function t(o){var a;return Object(b.a)(this,t),a=c.call(this,o),a.refContainer=function(i){a.container=i},t.restoreIframeSize(),a}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(k,null),this.props.children)}}]),t}(n.a.Component);(function(d){var c=window.location.pathname,t="x6-iframe-size";function o(){var r=localStorage.getItem(t),s;if(r)try{s=JSON.parse(r)}catch(u){}else s={};return s}function a(){var r=window.frameElement;if(r){var s=r.style,u={width:s.width,height:s.height},p=o();p[c]=u,localStorage.setItem(t,JSON.stringify(p))}}d.saveIframeSize=a;function i(){var r=window.frameElement;if(r){var s=o(),u=s[c];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}d.restoreIframeSize=i})(A||(A={}));var Z=e(87),z=function(c){var t=c.children;return n.a.createElement(H.a.ErrorBoundary,null,n.a.createElement(V.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(A,null,t))};L.a.render(n.a.createElement(z,null,n.a.createElement(N,null)),document.getElementById("root"))}},[[70,1,2]]]);
