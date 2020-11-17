(this["webpackJsonpapi.ui.color-picker.basic"]=this["webpackJsonpapi.ui.color-picker.basic"]||[]).push([[0],{153:function(m,i,e){m.exports=e(371)},345:function(m,i,e){"use strict";e.r(i),e.d(i,"host",function(){return f}),e.d(i,"getCodeSandboxParams",function(){return n}),e.d(i,"getStackblitzPrefillConfig",function(){return h});const f="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/color-picker/basic";function n(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24, height: 400 }}>
        <div style={{ width: 120 }}>
          <ColorPicker color="#333333" />
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
`,isBinary:!1}}}}function h(){return{title:"api/ui/color-picker/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24, height: 400 }}>
        <div style={{ width: 120 }}>
          <ColorPicker color="#333333" />
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
`}}}},346:function(m,i,e){},348:function(m,i,e){},371:function(m,i,e){"use strict";e.r(i);var f=e(0),n=e.n(f),h=e(14),O=e.n(h),E=e(23),v=e(24),g=e(29),b=e(27),X=e(376),P=e(158),w=function(a){Object(g.a)(t,a);var s=Object(b.a)(t);function t(){return Object(E.a)(this,t),s.apply(this,arguments)}return Object(v.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{style:{padding:24,height:400}},n.a.createElement("div",{style:{width:120}},n.a.createElement(X.a,{color:"#333333"})))}}]),t}(n.a.PureComponent),D=e(378),L=e(374),R=e(379),k=e(380),M=e(381),p=e(152),I=e(342),N=e(139),S=e(140),z=e(346),x=e(345),A=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(a){Object(g.a)(t,a);var s=Object(b.a)(t);function t(){return Object(E.a)(this,t),s.apply(this,arguments)}return Object(v.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},n.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(L.a,{component:A}))),n.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(x.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(R.a,null))),n.a.createElement(p.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(S.getParameters)(x.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(k.a,null)))),n.a.createElement(p.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},n.a.createElement(M.a,{onClick:function(){N.a.openProject(x.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),t}(n.a.Component),T=e(377),B=e(348),y=function(a){Object(g.a)(t,a);var s=Object(b.a)(t);function t(l){var o;return Object(E.a)(this,t),o=s.call(this,l),o.refContainer=function(d){o.container=d},t.restoreIframeSize(),o}return Object(v.a)(t,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){o.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var d=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(d+16,"px"),o.style.border="0",o.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(j,null),this.props.children)}}]),t}(n.a.Component);(function(a){var s=window.location.pathname,t="x6-iframe-size";function l(){var r=localStorage.getItem(t),c;if(r)try{c=JSON.parse(r)}catch(u){}else c={};return c}function o(){var r=window.frameElement;if(r){var c=r.style,u={width:c.width,height:c.height},C=l();C[s]=u,localStorage.setItem(t,JSON.stringify(C))}}a.saveIframeSize=o;function d(){var r=window.frameElement;if(r){var c=l(),u=c[s];u&&(r.style.width=u.width||"100%",r.style.height=u.height||"auto")}}a.restoreIframeSize=d})(y||(y={}));var F=e(349),U=function(s){var t=s.children;return n.a.createElement(T.a.ErrorBoundary,null,n.a.createElement(y,null,t))};O.a.render(n.a.createElement(U,null,n.a.createElement(w,null)),document.getElementById("root"))}},[[153,1,2]]]);
