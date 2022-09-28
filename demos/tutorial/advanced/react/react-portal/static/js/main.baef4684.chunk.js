(this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.react.react-portal"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.advanced.react.react-portal"]||[]).push([[0],{76:function(u,c,n){u.exports=n(94)},84:function(u,c,n){},85:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return p}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return v});const p="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/advanced/react/react-portal";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "@antv/x6-react-shape": "latest",
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
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React, { memo, useEffect, useRef } from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Portal, ReactShape } from '@antv/x6-react-shape'
import './app.css'

// You should do this outside your components
// (or make sure its not recreated on every render).
//
// \u8FD9\u4E2A\u8C03\u7528\u9700\u8981\u5728\u7EC4\u4EF6\u5916\u8FDB\u884C\u3002
const X6ReactPortalProvider = Portal.getProvider()

const MyComponent = memo(
  ({ node, text }: { node?: ReactShape; text: string }) => {
    const color = Color.randomHex()
    return (
      <div
        style={{
          color: Color.invert(color, true),
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '60px',
          background: color,
        }}
      >
        {text}
      </div>
    )
  },
  (prev, next) => {
    return Boolean(next.node?.hasChanged('data'))
  },
)

export default () => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) {
      return
    }

    const graph = new Graph({
      container: container.current,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      data: {},
      xxx: {},
      component: <MyComponent text="Source" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      component: (node: Node) => {
        return <div>{node.attr('body/fill')}</div>
      },
      // component: () => <Test text="target" />,
    })

    graph.addEdge({
      source,
      target,
    })

    const update = () => {
      target.prop('attrs/body/fill', Color.randomHex())
      setTimeout(update, 1000)
    }

    update()

    console.log(graph.toJSON())
    return () => graph.dispose()
  }, [])

  return (
    <div className="app">
      <X6ReactPortalProvider />
      <div ref={container} className="app-content" />
    </div>
  )
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
    "lib": ["dom", "es2015"]
  },
  "include": ["src"]
}
`,isBinary:!1}}}}function v(){return{title:"tutorial/advanced/react/react-portal",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest","@antv/x6-react-shape":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "@antv/x6-react-shape": "latest",
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
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React, { memo, useEffect, useRef } from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Portal, ReactShape } from '@antv/x6-react-shape'
import './app.css'

// You should do this outside your components
// (or make sure its not recreated on every render).
//
// \u8FD9\u4E2A\u8C03\u7528\u9700\u8981\u5728\u7EC4\u4EF6\u5916\u8FDB\u884C\u3002
const X6ReactPortalProvider = Portal.getProvider()

const MyComponent = memo(
  ({ node, text }: { node?: ReactShape; text: string }) => {
    const color = Color.randomHex()
    return (
      <div
        style={{
          color: Color.invert(color, true),
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '60px',
          background: color,
        }}
      >
        {text}
      </div>
    )
  },
  (prev, next) => {
    return Boolean(next.node?.hasChanged('data'))
  },
)

export default () => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) {
      return
    }

    const graph = new Graph({
      container: container.current,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      data: {},
      xxx: {},
      component: <MyComponent text="Source" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      component: (node: Node) => {
        return <div>{node.attr('body/fill')}</div>
      },
      // component: () => <Test text="target" />,
    })

    graph.addEdge({
      source,
      target,
    })

    const update = () => {
      target.prop('attrs/body/fill', Color.randomHex())
      setTimeout(update, 1000)
    }

    update()

    console.log(graph.toJSON())
    return () => graph.dispose()
  }, [])

  return (
    <div className="app">
      <X6ReactPortalProvider />
      <div ref={container} className="app-content" />
    </div>
  )
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
    "lib": ["dom", "es2015"]
  },
  "include": ["src"]
}
`}}}},90:function(u,c,n){},93:function(u,c,n){},94:function(u,c,n){"use strict";n.r(c);var p=n(0),e=n.n(p),v=n(19),O=n.n(v),x=n(1),E=n(2),y=n(3),b=n(4),A=n(101),U=n(97),N=n(102),R=n(103),h=n(100),z=n(81),L=n(54),H=n(84),C=n(85),D=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},M=function(a){Object(y.a)(t,a);var r=Object(b.a)(t);function t(){return Object(x.a)(this,t),r.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(A.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(U.a,{component:D}))),e.a.createElement(h.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(C.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(N.a,null))),e.a.createElement(h.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(L.getParameters)(C.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),t}(e.a.Component),S=n(98),T=n(68),k=n(90),g=function(a){Object(y.a)(t,a);var r=Object(b.a)(t);function t(i){var o;return Object(x.a)(this,t),o=r.call(this,i),o.refContainer=function(l){o.container=l},t.restoreIframeSize(),o}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){o.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var l=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(l+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(M,null),this.props.children)}}]),t}(e.a.Component);(function(a){var r=window.location.pathname,t="x6-iframe-size";function i(){var s=localStorage.getItem(t),d;if(s)try{d=JSON.parse(s)}catch(m){}else d={};return d}function o(){var s=window.frameElement;if(s){var d=s.style,m={width:d.width,height:d.height},w=i();w[r]=m,localStorage.setItem(t,JSON.stringify(w))}}a.saveIframeSize=o;function l(){var s=window.frameElement;if(s){var d=i(),m=d[r];m&&(s.style.width=m.width||"100%",s.style.height=m.height||"auto")}}a.restoreIframeSize=l})(g||(g={}));var B=n(91),X=function(r){var t=r.children;return e.a.createElement(S.a.ErrorBoundary,null,e.a.createElement(T.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(g,null,t))},f=n(13),P=n(74),J=n(93),j=P.a.getProvider(),I=Object(p.memo)(function(a){var r=a.node,t=a.text,i=f.a.randomHex();return e.a.createElement("div",{style:{color:f.a.invert(i,!0),width:"100%",height:"100%",textAlign:"center",lineHeight:"60px",background:i}},t)},function(a,r){var t;return Boolean((t=r.node)===null||t===void 0?void 0:t.hasChanged("data"))}),V=function(){var a=Object(p.useRef)(null);return Object(p.useEffect)(function(){if(!a.current)return;var r=new f.c({container:a.current,width:800,height:600}),t=r.addNode({shape:"react-shape",x:80,y:80,width:160,height:60,data:{},xxx:{},component:e.a.createElement(I,{text:"Source"})}),i=r.addNode({shape:"react-shape",x:320,y:320,width:160,height:60,component:function(s){return e.a.createElement("div",null,s.attr("body/fill"))}});r.addEdge({source:t,target:i});var o=function l(){i.prop("attrs/body/fill",f.a.randomHex()),setTimeout(l,1e3)};return o(),console.log(r.toJSON()),function(){return r.dispose()}},[]),e.a.createElement("div",{className:"app"},e.a.createElement(j,null),e.a.createElement("div",{ref:a,className:"app-content"}))};O.a.render(e.a.createElement(X,null,e.a.createElement(V,null)),document.getElementById("root"))}},[[76,1,2]]]);
