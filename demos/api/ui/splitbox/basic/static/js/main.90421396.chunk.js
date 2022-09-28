(this["webpackJsonp@antv/x6-sites-demos-api.ui.splitbox.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.splitbox.basic"]||[]).push([[0],{58:function(m,r,n){m.exports=n(79)},64:function(m,r,n){},71:function(m,r,n){},72:function(m,r,n){"use strict";n.r(r),n.d(r,"host",function(){return h}),n.d(r,"getCodeSandboxParams",function(){return e}),n.d(r,"getStackblitzPrefillConfig",function(){return v});const h="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/splitbox/basic";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
`,isBinary:!1},"src/app.css":{content:`.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ height: 400 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5',
            userSelect: 'none',
          }}
        >
          <SplitBox
            split="horizontal"
            minSize={80}
            maxSize={-80}
            defaultSize={'80%'}
            primary="second"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff7e6',
              }}
            />
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-160}
              defaultSize={240}
              primary="first"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff0f6',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <SplitBox
                  split="vertical"
                  minSize={40}
                  maxSize={-80}
                  defaultSize={'40%'}
                  primary="second"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <SplitBox
                      split="horizontal"
                      minSize={40}
                      maxSize={-40}
                      defaultSize={80}
                      primary="first"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6f7ff',
                        }}
                      />
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6fffb',
                        }}
                      />
                    </SplitBox>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#f6ffed',
                    }}
                  />
                </SplitBox>
              </div>
            </SplitBox>
          </SplitBox>
        </div>
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
`,isBinary:!1}}}}function v(){return{title:"api/ui/splitbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
`,"src/app.css":`.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ height: 400 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5',
            userSelect: 'none',
          }}
        >
          <SplitBox
            split="horizontal"
            minSize={80}
            maxSize={-80}
            defaultSize={'80%'}
            primary="second"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff7e6',
              }}
            />
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-160}
              defaultSize={240}
              primary="first"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff0f6',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <SplitBox
                  split="vertical"
                  minSize={40}
                  maxSize={-80}
                  defaultSize={'40%'}
                  primary="second"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <SplitBox
                      split="horizontal"
                      minSize={40}
                      maxSize={-40}
                      defaultSize={80}
                      primary="first"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6f7ff',
                        }}
                      />
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6fffb',
                        }}
                      />
                    </SplitBox>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#f6ffed',
                    }}
                  />
                </SplitBox>
              </div>
            </SplitBox>
          </SplitBox>
        </div>
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
`}}}},77:function(m,r,n){},79:function(m,r,n){"use strict";n.r(r);var h=n(0),e=n.n(h),v=n(13),z=n.n(v),E=n(10),x=n(11),g=n(15),y=n(14),p=n(87),T=n(63),B=n(64),U=function(a){Object(g.a)(t,a);var s=Object(y.a)(t);function t(){return Object(E.a)(this,t),s.apply(this,arguments)}return Object(x.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{style:{height:400}},e.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},e.a.createElement(p.a,{split:"horizontal",minSize:80,maxSize:-80,defaultSize:"80%",primary:"second"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff7e6"}}),e.a.createElement(p.a,{split:"vertical",minSize:40,maxSize:-160,defaultSize:240,primary:"first"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff0f6"}}),e.a.createElement("div",{style:{width:"100%",height:"100%"}},e.a.createElement(p.a,{split:"vertical",minSize:40,maxSize:-80,defaultSize:"40%",primary:"second"},e.a.createElement("div",{style:{width:"100%",height:"100%"}},e.a.createElement(p.a,{split:"horizontal",minSize:40,maxSize:-40,defaultSize:80,primary:"first"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6f7ff"}}),e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6fffb"}}))),e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#f6ffed"}})))))))}}]),t}(e.a.Component),O=n(88),C=n(83),A=n(89),R=n(90),f=n(86),k=n(68),L=n(39),I=n(71),S=n(72),D=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},M=function(a){Object(g.a)(t,a);var s=Object(y.a)(t);function t(){return Object(E.a)(this,t),s.apply(this,arguments)}return Object(x.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(O.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(C.a,{component:D}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(A.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(L.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))))}}]),t}(e.a.Component),N=n(84),j=n(53),P=n(77),b=function(a){Object(g.a)(t,a);var s=Object(y.a)(t);function t(l){var i;return Object(E.a)(this,t),i=s.call(this,l),i.refContainer=function(d){i.container=d},t.restoreIframeSize(),i}return Object(x.a)(t,[{key:"componentDidMount",value:function(){var i=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){i.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return i.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var i=window.frameElement;if(i){var d=this.container.scrollHeight||this.container.clientHeight;i.style.width="100%",i.style.height="".concat(d+16,"px"),i.style.border="0",i.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(M,null),this.props.children)}}]),t}(e.a.Component);(function(a){var s=window.location.pathname,t="x6-iframe-size";function l(){var o=localStorage.getItem(t),c;if(o)try{c=JSON.parse(o)}catch(u){}else c={};return c}function i(){var o=window.frameElement;if(o){var c=o.style,u={width:c.width,height:c.height},w=l();w[s]=u,localStorage.setItem(t,JSON.stringify(w))}}a.saveIframeSize=i;function d(){var o=window.frameElement;if(o){var c=l(),u=c[s];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}a.restoreIframeSize=d})(b||(b={}));var V=n(78),X=function(s){var t=s.children;return e.a.createElement(N.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,t))};z.a.render(e.a.createElement(X,null,e.a.createElement(U,null)),document.getElementById("root"))}},[[58,1,2]]]);
