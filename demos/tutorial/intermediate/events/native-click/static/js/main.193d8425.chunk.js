(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.events.native-click"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.events.native-click"]||[]).push([[0],{70:function(m,d,n){m.exports=n(88)},76:function(m,d,n){},80:function(m,d,n){},81:function(m,d,n){"use strict";n.r(d),n.d(d,"host",function(){return h}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return v});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/events/native-click";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 120px;
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
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
    })

    const rect2 = graph.addNode({
      x: 360,
      y: 40,
      width: 100,
      height: 40,
      label: 'Target',
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      labels: [
        {
          markup: [
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            label: {
              cursor: 'pointer',
              text: 'Eege',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fontSize: 12,
              fill: 'black',
            },
            body: {
              cursor: 'pointer',
              ref: 'label',
              refX: '-20%',
              refY: '-20%',
              refWidth: '140%',
              refHeight: '140%',
              fill: 'white',
              stroke: 'black',
              strokeWidth: 1,
            },
          },
        },
      ],
    })

    function reset() {
      graph.drawBackground({ color: '#fff' })
      const nodes = graph.getNodes()
      const edges = graph.getEdges()

      nodes.forEach((node) => {
        node.attr('body/stroke', '#000')
      })

      edges.forEach((edge) => {
        edge.attr('line/stroke', 'black')
        edge.prop('labels/0', {
          attrs: {
            body: {
              stroke: 'black',
            },
          },
        })
      })
    }

    graph.on('node:click', ({ node }) => {
      reset()
      node.attr('body/stroke', 'orange')
    })

    graph.on('edge:click', ({ edge }) => {
      reset()
      edge.attr('line/stroke', 'orange')
      edge.prop('labels/0', {
        attrs: {
          body: {
            stroke: 'orange',
          },
        },
      })
    })

    graph.on('blank:click', () => {
      reset()
      graph.drawBackground({ color: 'orange' })
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
`,isBinary:!1}}}}function v(){return{title:"tutorial/intermediate/events/native-click",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 120px;
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
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
    })

    const rect2 = graph.addNode({
      x: 360,
      y: 40,
      width: 100,
      height: 40,
      label: 'Target',
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      labels: [
        {
          markup: [
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            label: {
              cursor: 'pointer',
              text: 'Eege',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fontSize: 12,
              fill: 'black',
            },
            body: {
              cursor: 'pointer',
              ref: 'label',
              refX: '-20%',
              refY: '-20%',
              refWidth: '140%',
              refHeight: '140%',
              fill: 'white',
              stroke: 'black',
              strokeWidth: 1,
            },
          },
        },
      ],
    })

    function reset() {
      graph.drawBackground({ color: '#fff' })
      const nodes = graph.getNodes()
      const edges = graph.getEdges()

      nodes.forEach((node) => {
        node.attr('body/stroke', '#000')
      })

      edges.forEach((edge) => {
        edge.attr('line/stroke', 'black')
        edge.prop('labels/0', {
          attrs: {
            body: {
              stroke: 'black',
            },
          },
        })
      })
    }

    graph.on('node:click', ({ node }) => {
      reset()
      node.attr('body/stroke', 'orange')
    })

    graph.on('edge:click', ({ edge }) => {
      reset()
      edge.attr('line/stroke', 'orange')
      edge.prop('labels/0', {
        attrs: {
          body: {
            stroke: 'orange',
          },
        },
      })
    })

    graph.on('blank:click', () => {
      reset()
      graph.drawBackground({ color: 'orange' })
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
`}}}},86:function(m,d,n){},88:function(m,d,n){"use strict";n.r(d);var h=n(0),e=n.n(h),v=n(20),C=n.n(v),E=n(1),b=n(2),x=n(3),y=n(4),A=n(67),I=n(76),O=function(p){Object(x.a)(r,p);var c=Object(y.a)(r);function r(){var a;Object(E.a)(this,r);for(var t=arguments.length,i=new Array(t),o=0;o<t;o++)i[o]=arguments[o];return a=c.call.apply(c,[this].concat(i)),a.container=void 0,a.refContainer=function(s){a.container=s},a}return Object(b.a)(r,[{key:"componentDidMount",value:function(){var t=new A.a({container:this.container,grid:!0,interacting:!1}),i=t.addNode({x:40,y:40,width:100,height:40,label:"Source"}),o=t.addNode({x:360,y:40,width:100,height:40,label:"Target"});t.addEdge({source:i,target:o,labels:[{markup:[{tagName:"rect",selector:"body"},{tagName:"text",selector:"label"}],attrs:{label:{cursor:"pointer",text:"Eege",textAnchor:"middle",textVerticalAnchor:"middle",fontSize:12,fill:"black"},body:{cursor:"pointer",ref:"label",refX:"-20%",refY:"-20%",refWidth:"140%",refHeight:"140%",fill:"white",stroke:"black",strokeWidth:1}}}]});function s(){t.drawBackground({color:"#fff"});var l=t.getNodes(),u=t.getEdges();l.forEach(function(g){g.attr("body/stroke","#000")}),u.forEach(function(g){g.attr("line/stroke","black"),g.prop("labels/0",{attrs:{body:{stroke:"black"}}})})}t.on("node:click",function(l){var u=l.node;s(),u.attr("body/stroke","orange")}),t.on("edge:click",function(l){var u=l.edge;s(),u.attr("line/stroke","orange"),u.prop("labels/0",{attrs:{body:{stroke:"orange"}}})}),t.on("blank:click",function(){s(),t.drawBackground({color:"orange"})})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),r}(e.a.Component),N=n(95),D=n(91),U=n(96),L=n(97),f=n(94),V=n(77),M=n(50),z=n(80),k=n(81),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},R=function(p){Object(x.a)(r,p);var c=Object(y.a)(r);function r(){return Object(E.a)(this,r),c.apply(this,arguments)}return Object(b.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,{component:S}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(k.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(M.getParameters)(k.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(L.a,null)))))}}]),r}(e.a.Component),T=n(92),X=n(64),B=n(86),w=function(p){Object(x.a)(r,p);var c=Object(y.a)(r);function r(a){var t;return Object(E.a)(this,r),t=c.call(this,a),t.refContainer=function(i){t.container=i},r.restoreIframeSize(),t}return Object(b.a)(r,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){t.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var i=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(i+16,"px"),t.style.border="0",t.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(R,null),this.props.children)}}]),r}(e.a.Component);(function(p){var c=window.location.pathname,r="x6-iframe-size";function a(){var o=localStorage.getItem(r),s;if(o)try{s=JSON.parse(o)}catch(l){}else s={};return s}function t(){var o=window.frameElement;if(o){var s=o.style,l={width:s.width,height:s.height},u=a();u[c]=l,localStorage.setItem(r,JSON.stringify(u))}}p.saveIframeSize=t;function i(){var o=window.frameElement;if(o){var s=a(),l=s[c];l&&(o.style.width=l.width||"100%",o.style.height=l.height||"auto")}}p.restoreIframeSize=i})(w||(w={}));var P=n(87),j=function(c){var r=c.children;return e.a.createElement(T.a.ErrorBoundary,null,e.a.createElement(X.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,r))};C.a.render(e.a.createElement(j,null,e.a.createElement(O,null)),document.getElementById("root"))}},[[70,1,2]]]);
