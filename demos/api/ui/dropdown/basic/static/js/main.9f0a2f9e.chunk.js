(this["webpackJsonpapi.ui.dropdown.basic"]=this["webpackJsonpapi.ui.dropdown.basic"]||[]).push([[0],{121:function(f,p,o){"use strict";o.r(p);var M=o(0),e=o.n(M),D=o(14),R=o.n(D),y=o(9),h=o(10),g=o(12),x=o(11),w=o(27),T=o(2),N=o.n(T),U=e.a.createContext({}),C=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(){var n;return Object(y.a)(this,r),n=i.apply(this,arguments),n.onHotkey=function(){n.triggerHandler()},n.onClick=function(t){n.triggerHandler(t)},n}return Object(h.a)(r,[{key:"componentDidMount",value:function(){var t=this.props.hotkey;t&&this.props.context.registerHotkey(t,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var t=this.props.hotkey;t&&this.props.context.unregisterHotkey(t,this.onHotkey)}},{key:"triggerHandler",value:function(t){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,t),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},r.getProps(this.props)),r.getContent(this.props,this.onClick))}}]),r}(e.a.PureComponent);(function(a){function i(n,t){var s,c=n.className,l=n.disabled,d=n.active,u=n.hidden,v=n.context.prefixCls,m="".concat(v,"-item");return{className:N()(m,t,(s={},Object(w.a)(s,"".concat(m,"-active"),d),Object(w.a)(s,"".concat(m,"-hidden"),u),Object(w.a)(s,"".concat(m,"-disabled"),l),s),c)}}a.getProps=i;function r(n,t,s,c){var l=n.icon,d=n.text,u=n.hotkey,v=n.children,m=n.context.prefixCls,E="".concat(m,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{className:"".concat(E,"-button"),onClick:t},l&&e.a.isValidElement(l)&&e.a.createElement("span",{className:"".concat(E,"-icon")},l),e.a.createElement("span",{className:"".concat(E,"-text")},d||v),u&&e.a.createElement("span",{className:"".concat(E,"-hotkey")},u),s),c)}a.getContent=r})(C||(C={}));var P=function(i){return e.a.createElement(U.Consumer,null,function(r){return e.a.createElement(C,Object.assign({context:r},i))})},X=function(){return e.a.createElement(U.Consumer,null,function(i){var r=i.prefixCls;return e.a.createElement("div",{className:"".concat(r,"-item ").concat(r,"-item-divider")})})},S=function(a,i){var r={};for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&i.indexOf(n)<0&&(r[n]=a[n]);if(a!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,n=Object.getOwnPropertySymbols(a);t<n.length;t++)i.indexOf(n[t])<0&&Object.prototype.propertyIsEnumerable.call(a,n[t])&&(r[n[t]]=a[n[t]]);return r},I=function(i){var r=i.hotkey,n=i.children,t=S(i,["hotkey","children"]);return e.a.createElement(U.Consumer,null,function(s){var c=s.prefixCls,l=C.getProps(Object.assign({context:s},i),"".concat(c,"-submenu"));return e.a.createElement("div",Object.assign({},l),C.getContent(Object.assign({context:s},t),null,e.a.createElement("span",{className:"".concat(c,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(c,"-submenu-menu")},n)))})},b=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(){var n;return Object(y.a)(this,r),n=i.apply(this,arguments),n.onClick=function(t,s){n.props.stopPropagation&&s!=null&&s.stopPropagation(),n.props.onClick&&n.props.onClick(t)},n.registerHotkey=function(t,s){n.props.registerHotkey&&n.props.registerHotkey(t,s)},n.unregisterHotkey=function(t,s){n.props.unregisterHotkey&&n.props.unregisterHotkey(t,s)},n}return Object(h.a)(r,[{key:"render",value:function(){var t=this.props,s=t.prefixCls,c=t.className,l=t.children,d=t.hasIcon,u="".concat(s,"-menu"),v=U.Provider,m={prefixCls:u,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:N()(u,Object(w.a)({},"".concat(u,"-has-icon"),d),c)},e.a.createElement(v,{value:m},l))}}]),r}(e.a.PureComponent);(function(a){a.Item=P,a.Divider=X,a.SubMenu=I,a.defaultProps={prefixCls:"x6",stopPropagation:!1}})(b||(b={}));var V=o(69),A=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(){return Object(y.a)(this,r),i.apply(this,arguments)}return Object(h.a)(r,[{key:"getTransitionName",value:function(){var t=this.props,s=t.placement,c=s===void 0?"":s,l=t.transitionName;return l!==void 0?l:c.indexOf("top")>=0?"slide-down":"slide-up"}},{key:"render",value:function(){var t=this.props,s=t.children,c=t.trigger,l=t.disabled,d="".concat(this.props.prefixCls,"-dropdown"),u=e.a.Children.only(s),v=e.a.cloneElement(u,{className:N()(s.props.className,"".concat(d,"-trigger")),disabled:l}),m=l?[]:Array.isArray(c)?c:[c],E=!1;m&&m.indexOf("contextMenu")!==-1&&(E=!0);var Q=e.a.Children.only(this.props.overlay),q=e.a.createElement("div",{className:"".concat(d,"-overlay")},Q);return e.a.createElement(V.a,Object.assign({},this.props,{prefixCls:d,overlay:q,alignPoint:E,trigger:m,transitionName:this.getTransitionName()}),v)}}]),r}(e.a.Component);(function(a){a.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(A||(A={}));var ee=o(76),ne=o(77),k=e.a.createElement(b,null,e.a.createElement(b.Item,{key:"1"},"1st menu item"),e.a.createElement(b.Item,{key:"2"},"2nd menu item"),e.a.createElement(b.Item,{key:"3"},"3rd menu item")),H=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(){return Object(y.a)(this,r),i.apply(this,arguments)}return Object(h.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{style:{padding:"24px 0 120px 24px"}},e.a.createElement("div",null,e.a.createElement(A,{overlay:k},e.a.createElement("a",{href:"#"},"Hover me"))),e.a.createElement("div",{style:{marginTop:24}},e.a.createElement(A,{overlay:k,trigger:["contextMenu"]},e.a.createElement("span",{style:{userSelect:"none"}},"Right Click on Me"))))}}]),r}(e.a.Component),z=o(128),B=o(124),F=o(129),_=o(130),J=o(131),O=o(126),te=o(81),W=o(57),Y=o(58),re=o(85),j=o(84),$=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},G=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(){return Object(y.a)(this,r),i.apply(this,arguments)}return Object(h.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},e.a.createElement(z.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(B.a,{component:$}))),e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(j.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(F.a,null))),e.a.createElement(O.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(Y.getParameters)(j.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(_.a,null)))),e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},e.a.createElement(J.a,{onClick:function(){W.a.openProject(j.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),r}(e.a.Component),Z=o(127),oe=o(98),L=function(a){Object(g.a)(r,a);var i=Object(x.a)(r);function r(n){var t;return Object(y.a)(this,r),t=i.call(this,n),t.refContainer=function(s){t.container=s},r.restoreIframeSize(),t}return Object(h.a)(r,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){t.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var c=document.getElementById("loading");c&&c.parentNode&&c.parentNode.removeChild(c)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var s=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(s+16,"px"),t.style.border="0",t.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(G,null),this.props.children)}}]),r}(e.a.Component);(function(a){var i=window.location.pathname,r="x6-iframe-size";function n(){var c=localStorage.getItem(r),l;if(c)try{l=JSON.parse(c)}catch(d){}else l={};return l}function t(){var c=window.frameElement;if(c){var l=c.style,d={width:l.width,height:l.height},u=n();u[i]=d,localStorage.setItem(r,JSON.stringify(u))}}a.saveIframeSize=t;function s(){var c=window.frameElement;if(c){var l=n(),d=l[i];d&&(c.style.width=d.width||"100%",c.style.height=d.height||"auto")}}a.restoreIframeSize=s})(L||(L={}));var ae=o(99),K=function(i){var r=i.children;return e.a.createElement(Z.a.ErrorBoundary,null,e.a.createElement(L,null,r))};R.a.render(e.a.createElement(K,null,e.a.createElement(H,null)),document.getElementById("root"))},71:function(f,p,o){f.exports=o(121)},76:function(f,p,o){},77:function(f,p,o){},84:function(f,p,o){"use strict";o.r(p),o.d(p,"host",function(){return M}),o.d(p,"getCodeSandboxParams",function(){return e}),o.d(p,"getStackblitzPrefillConfig",function(){return D});const M="https://github.com/antvis/X6/tree/master//Users/wenyu/vector/code/AntV/X6/sites/x6-sites-demos/packages/api/ui/dropdown/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Dropdown } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ padding: '24px 0 120px 24px' }}>
        <div>
          <Dropdown overlay={menu}>
            <a href="#">Hover me</a>
          </Dropdown>
        </div>
        <div style={{ marginTop: 24 }}>
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <span style={{ userSelect: 'none' }}>Right Click on Me</span>
          </Dropdown>
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
`,isBinary:!1}}}}function D(){return{title:"api/ui/dropdown/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Dropdown } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ padding: '24px 0 120px 24px' }}>
        <div>
          <Dropdown overlay={menu}>
            <a href="#">Hover me</a>
          </Dropdown>
        </div>
        <div style={{ marginTop: 24 }}>
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <span style={{ userSelect: 'none' }}>Right Click on Me</span>
          </Dropdown>
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
`}}}},85:function(f,p,o){},98:function(f,p,o){}},[[71,1,2]]]);
