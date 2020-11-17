(this["webpackJsonpapi.ui.splitbox.basic"]=this["webpackJsonpapi.ui.splitbox.basic"]||[]).push([[0],{101:function(m,i,n){},124:function(m,i,n){"use strict";n.r(i);var h=n(0),e=n.n(h),E=n(10),C=n.n(E),v=n(6),g=n(7),x=n(12),b=n(11),f=n(130),T=n(76),B=n(77),O=function(a){Object(x.a)(t,a);var s=Object(b.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(g.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{style:{height:400}},e.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},e.a.createElement(f.a,{split:"horizontal",minSize:80,maxSize:-80,defaultSize:"80%",primary:"second"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff7e6"}}),e.a.createElement(f.a,{split:"vertical",minSize:40,maxSize:-160,defaultSize:240,primary:"first"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff0f6"}}),e.a.createElement("div",{style:{width:"100%",height:"100%"}},e.a.createElement(f.a,{split:"vertical",minSize:40,maxSize:-80,defaultSize:"40%",primary:"second"},e.a.createElement("div",{style:{width:"100%",height:"100%"}},e.a.createElement(f.a,{split:"horizontal",minSize:40,maxSize:-40,defaultSize:80,primary:"first"},e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6f7ff"}}),e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6fffb"}}))),e.a.createElement("div",{style:{width:"100%",height:"100%",background:"#f6ffed"}})))))))}}]),t}(e.a.Component),X=n(132),z=n(127),L=n(133),D=n(134),R=n(135),p=n(129),P=n(81),k=n(50),U=n(51),I=n(85),y=n(84),M=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},N=function(a){Object(x.a)(t,a);var s=Object(b.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(g.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},e.a.createElement(X.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(z.a,{component:M}))),e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(y.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(L.a,null))),e.a.createElement(p.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(U.getParameters)(y.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(D.a,null)))),e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},e.a.createElement(R.a,{onClick:function(){k.a.openProject(y.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),t}(e.a.Component),j=n(131),F=n(101),S=function(a){Object(x.a)(t,a);var s=Object(b.a)(t);function t(l){var o;return Object(v.a)(this,t),o=s.call(this,l),o.refContainer=function(c){o.container=c},t.restoreIframeSize(),o}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var c=new window.ResizeObserver(function(){o.updateIframeSize()});c.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var c=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(c+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(N,null),this.props.children)}}]),t}(e.a.Component);(function(a){var s=window.location.pathname,t="x6-iframe-size";function l(){var r=localStorage.getItem(t),d;if(r)try{d=JSON.parse(r)}catch(u){}else d={};return d}function o(){var r=window.frameElement;if(r){var d=r.style,u={width:d.width,height:d.height},w=l();w[s]=u,localStorage.setItem(t,JSON.stringify(w))}}a.saveIframeSize=o;function c(){var r=window.frameElement;if(r){var d=l(),u=d[s];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}a.restoreIframeSize=c})(S||(S={}));var H=n(102),A=function(s){var t=s.children;return e.a.createElement(j.a.ErrorBoundary,null,e.a.createElement(S,null,t))};C.a.render(e.a.createElement(A,null,e.a.createElement(O,null)),document.getElementById("root"))},71:function(m,i,n){m.exports=n(124)},77:function(m,i,n){},84:function(m,i,n){"use strict";n.r(i),n.d(i,"host",function(){return h}),n.d(i,"getCodeSandboxParams",function(){return e}),n.d(i,"getStackblitzPrefillConfig",function(){return E});const h="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/splitbox/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,isBinary:!1}}}}function E(){return{title:"api/ui/splitbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`}}}},85:function(m,i,n){}},[[71,1,2]]]);
