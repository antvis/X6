(this["webpackJsonpapi.ui.scrollbox.basic"]=this["webpackJsonpapi.ui.scrollbox.basic"]||[]).push([[0],{102:function(m,s,n){},125:function(m,s,n){"use strict";n.r(s);var f=n(0),e=n.n(f),h=n(10),O=n.n(h),g=n(5),E=n(7),v=n(15),b=n(14),X=n(130),P=n(78),L=function(a){Object(v.a)(t,a);var i=Object(b.a)(t);function t(){return Object(g.a)(this,t),i.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{style:{padding:24}},e.a.createElement(X.a,{containerWidth:300,containerHeight:200,contentWidth:1200,contentHeight:3e3,contentStyle:{position:"relative",cursor:"grab",background:"linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)"},containerStyle:{border:"1px solid #f0f0f0"}},e.a.createElement("div",{style:{position:"absolute",top:8,left:8}},"Top-Left-Corner"),e.a.createElement("div",{style:{position:"absolute",top:8,right:8}},"Top-Right-Corner"),e.a.createElement("div",{style:{position:"absolute",bottom:8,left:8}},"Bottom-Left-Corner"),e.a.createElement("div",{style:{position:"absolute",bottom:8,right:8}},"Bottom-Right-Corner")))}}]),t}(e.a.PureComponent),w=n(134),D=n(129),S=n(135),R=n(136),M=n(137),p=n(132),I=n(82),T=n(52),N=n(53),B=n(86),x=n(85),A=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(a){Object(v.a)(t,a);var i=Object(b.a)(t);function t(){return Object(g.a)(this,t),i.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},e.a.createElement(w.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,{component:A}))),e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(x.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(S.a,null))),e.a.createElement(p.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(N.getParameters)(x.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(R.a,null)))),e.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},e.a.createElement(M.a,{onClick:function(){T.a.openProject(x.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),t}(e.a.Component),U=n(133),z=n(102),y=function(a){Object(v.a)(t,a);var i=Object(b.a)(t);function t(l){var o;return Object(g.a)(this,t),o=i.call(this,l),o.refContainer=function(c){o.container=c},t.restoreIframeSize(),o}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var c=new window.ResizeObserver(function(){o.updateIframeSize()});c.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var c=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(c+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),t}(e.a.Component);(function(a){var i=window.location.pathname,t="x6-iframe-size";function l(){var r=localStorage.getItem(t),d;if(r)try{d=JSON.parse(r)}catch(u){}else d={};return d}function o(){var r=window.frameElement;if(r){var d=r.style,u={width:d.width,height:d.height},C=l();C[i]=u,localStorage.setItem(t,JSON.stringify(C))}}a.saveIframeSize=o;function c(){var r=window.frameElement;if(r){var d=l(),u=d[i];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}a.restoreIframeSize=c})(y||(y={}));var H=n(103),k=function(i){var t=i.children;return e.a.createElement(U.a.ErrorBoundary,null,e.a.createElement(y,null,t))};O.a.render(e.a.createElement(k,null,e.a.createElement(L,null)),document.getElementById("root"))},73:function(m,s,n){m.exports=n(125)},85:function(m,s,n){"use strict";n.r(s),n.d(s,"host",function(){return f}),n.d(s,"getCodeSandboxParams",function(){return e}),n.d(s,"getStackblitzPrefillConfig",function(){return h});const f="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/scrollbox/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { ScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <ScrollBox
          containerWidth={300}
          containerHeight={200}
          contentWidth={1200}
          contentHeight={3000}
          contentStyle={{
            position: 'relative',
            cursor: 'grab',
            background:
              'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
          }}
          containerStyle={{ border: '1px solid #f0f0f0' }}
        >
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            Top-Left-Corner
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            Top-Right-Corner
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
            Bottom-Left-Corner
          </div>
          <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
            Bottom-Right-Corner
          </div>
        </ScrollBox>
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
`,isBinary:!1}}}}function h(){return{title:"api/ui/scrollbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,"src/app.tsx":`import React from 'react'
import { ScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <ScrollBox
          containerWidth={300}
          containerHeight={200}
          contentWidth={1200}
          contentHeight={3000}
          contentStyle={{
            position: 'relative',
            cursor: 'grab',
            background:
              'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
          }}
          containerStyle={{ border: '1px solid #f0f0f0' }}
        >
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            Top-Left-Corner
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            Top-Right-Corner
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
            Bottom-Left-Corner
          </div>
          <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
            Bottom-Right-Corner
          </div>
        </ScrollBox>
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
`}}}},86:function(m,s,n){}},[[73,1,2]]]);
