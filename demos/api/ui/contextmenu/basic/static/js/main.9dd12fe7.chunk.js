(this["webpackJsonpapi.ui.contextmenu.basic"]=this["webpackJsonpapi.ui.contextmenu.basic"]||[]).push([[0],{122:function(f,m,a){"use strict";a.r(m);var U=a(0),r=a.n(U),j=a(14),k=a.n(j),v=a(6),E=a(7),y=a(9),h=a(8),A=a(27),R=a(2),w=a.n(R),M=r.a.createContext({}),C=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){var e;return Object(v.a)(this,n),e=i.apply(this,arguments),e.onHotkey=function(){e.triggerHandler()},e.onClick=function(t){e.triggerHandler(t)},e}return Object(E.a)(n,[{key:"componentDidMount",value:function(){var t=this.props.hotkey;t&&this.props.context.registerHotkey(t,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var t=this.props.hotkey;t&&this.props.context.unregisterHotkey(t,this.onHotkey)}},{key:"triggerHandler",value:function(t){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,t),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return r.a.createElement("div",Object.assign({},n.getProps(this.props)),n.getContent(this.props,this.onClick))}}]),n}(r.a.PureComponent);(function(o){function i(e,t){var s,c=e.className,l=e.disabled,d=e.active,u=e.hidden,g=e.context.prefixCls,p="".concat(g,"-item");return{className:w()(p,t,(s={},Object(A.a)(s,"".concat(p,"-active"),d),Object(A.a)(s,"".concat(p,"-hidden"),u),Object(A.a)(s,"".concat(p,"-disabled"),l),s),c)}}o.getProps=i;function n(e,t,s,c){var l=e.icon,d=e.text,u=e.hotkey,g=e.children,p=e.context.prefixCls,x="".concat(p,"-item");return r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"".concat(x,"-button"),onClick:t},l&&r.a.isValidElement(l)&&r.a.createElement("span",{className:"".concat(x,"-icon")},l),r.a.createElement("span",{className:"".concat(x,"-text")},d||g),u&&r.a.createElement("span",{className:"".concat(x,"-hotkey")},u),s),c)}o.getContent=n})(C||(C={}));var T=function(i){return r.a.createElement(M.Consumer,null,function(n){return r.a.createElement(C,Object.assign({context:n},i))})},P=function(){return r.a.createElement(M.Consumer,null,function(i){var n=i.prefixCls;return r.a.createElement("div",{className:"".concat(n,"-item ").concat(n,"-item-divider")})})},X=function(o,i){var n={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&i.indexOf(e)<0&&(n[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(o);t<e.length;t++)i.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(o,e[t])&&(n[e[t]]=o[e[t]]);return n},I=function(i){var n=i.hotkey,e=i.children,t=X(i,["hotkey","children"]);return r.a.createElement(M.Consumer,null,function(s){var c=s.prefixCls,l=C.getProps(Object.assign({context:s},i),"".concat(c,"-submenu"));return r.a.createElement("div",Object.assign({},l),C.getContent(Object.assign({context:s},t),null,r.a.createElement("span",{className:"".concat(c,"-submenu-arrow")}),r.a.createElement("div",{className:"".concat(c,"-submenu-menu")},e)))})},b=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){var e;return Object(v.a)(this,n),e=i.apply(this,arguments),e.onClick=function(t,s){e.props.stopPropagation&&s!=null&&s.stopPropagation(),e.props.onClick&&e.props.onClick(t)},e.registerHotkey=function(t,s){e.props.registerHotkey&&e.props.registerHotkey(t,s)},e.unregisterHotkey=function(t,s){e.props.unregisterHotkey&&e.props.unregisterHotkey(t,s)},e}return Object(E.a)(n,[{key:"render",value:function(){var t=this.props,s=t.prefixCls,c=t.className,l=t.children,d=t.hasIcon,u="".concat(s,"-menu"),g=M.Provider,p={prefixCls:u,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return r.a.createElement("div",{className:w()(u,Object(A.a)({},"".concat(u,"-has-icon"),d),c)},r.a.createElement(g,{value:p},l))}}]),n}(r.a.PureComponent);(function(o){o.Item=T,o.Divider=P,o.SubMenu=I,o.defaultProps={prefixCls:"x6",stopPropagation:!1}})(b||(b={}));var S=a(69),N=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){return Object(v.a)(this,n),i.apply(this,arguments)}return Object(E.a)(n,[{key:"getTransitionName",value:function(){var t=this.props,s=t.placement,c=s===void 0?"":s,l=t.transitionName;return l!==void 0?l:c.indexOf("top")>=0?"slide-down":"slide-up"}},{key:"render",value:function(){var t=this.props,s=t.children,c=t.trigger,l=t.disabled,d="".concat(this.props.prefixCls,"-dropdown"),u=r.a.Children.only(s),g=r.a.cloneElement(u,{className:w()(s.props.className,"".concat(d,"-trigger")),disabled:l}),p=l?[]:Array.isArray(c)?c:[c],x=!1;p&&p.indexOf("contextMenu")!==-1&&(x=!0);var ee=r.a.Children.only(this.props.overlay),te=r.a.createElement("div",{className:"".concat(d,"-overlay")},ee);return r.a.createElement(S.a,Object.assign({},this.props,{prefixCls:d,overlay:te,alignPoint:x,trigger:p,transitionName:this.getTransitionName()}),g)}}]),n}(r.a.Component);(function(o){o.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(N||(N={}));var V=function(o,i){var n={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&i.indexOf(e)<0&&(n[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(o);t<e.length;t++)i.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(o,e[t])&&(n[e[t]]=o[e[t]]);return n},H=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){return Object(v.a)(this,n),i.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){var t=this.props,s=t.children,c=t.menu,l=t.overlay,d=V(t,["children","menu","overlay"]);return r.a.createElement(N,Object.assign({},d,{overlay:c||l,trigger:"contextMenu"}),s)}}]),n}(r.a.PureComponent),ne=a(76),re=a(77),oe=a(78),z=r.a.createElement(b,null,r.a.createElement(b.Item,{key:"1"},"1st menu item"),r.a.createElement(b.Item,{key:"2"},"2nd menu item"),r.a.createElement(b.Item,{key:"3"},"3rd menu item")),B=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){return Object(v.a)(this,n),i.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{style:{padding:24}},r.a.createElement(H,{menu:z},r.a.createElement("div",{style:{height:240,display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},"Right Click On Me")))}}]),n}(r.a.Component),F=a(129),_=a(125),J=a(130),W=a(131),Y=a(132),O=a(127),ae=a(82),$=a(57),G=a(58),se=a(86),D=a(85),Z=function(){return r.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},K=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(){return Object(v.a)(this,n),i.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{className:"demo-toolbar"},r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},r.a.createElement(F.a,{onClick:function(){window.location.reload()}})),window.frameElement&&r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(_.a,{component:Z}))),r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(J.a,null))),r.a.createElement(O.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},r.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},r.a.createElement("input",{type:"hidden",name:"parameters",value:Object(G.getParameters)(D.getCodeSandboxParams())}),r.a.createElement("button",{type:"submit"},r.a.createElement(W.a,null)))),r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},r.a.createElement(Y.a,{onClick:function(){$.a.openProject(D.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),n}(r.a.Component),Q=a(128),ie=a(99),L=function(o){Object(y.a)(n,o);var i=Object(h.a)(n);function n(e){var t;return Object(v.a)(this,n),t=i.call(this,e),t.refContainer=function(s){t.container=s},n.restoreIframeSize(),t}return Object(E.a)(n,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){t.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var c=document.getElementById("loading");c&&c.parentNode&&c.parentNode.removeChild(c)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var s=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(s+16,"px"),t.style.border="0",t.style.overflow="hidden",n.saveIframeSize()}}},{key:"render",value:function(){return r.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},r.a.createElement(K,null),this.props.children)}}]),n}(r.a.Component);(function(o){var i=window.location.pathname,n="x6-iframe-size";function e(){var c=localStorage.getItem(n),l;if(c)try{l=JSON.parse(c)}catch(d){}else l={};return l}function t(){var c=window.frameElement;if(c){var l=c.style,d={width:l.width,height:l.height},u=e();u[i]=d,localStorage.setItem(n,JSON.stringify(u))}}o.saveIframeSize=t;function s(){var c=window.frameElement;if(c){var l=e(),d=l[i];d&&(c.style.width=d.width||"100%",c.style.height=d.height||"auto")}}o.restoreIframeSize=s})(L||(L={}));var ce=a(100),q=function(i){var n=i.children;return r.a.createElement(Q.a.ErrorBoundary,null,r.a.createElement(L,null,n))};k.a.render(r.a.createElement(q,null,r.a.createElement(B,null)),document.getElementById("root"))},71:function(f,m,a){f.exports=a(122)},76:function(f,m,a){},77:function(f,m,a){},78:function(f,m,a){},85:function(f,m,a){"use strict";a.r(m),a.d(m,"host",function(){return U}),a.d(m,"getCodeSandboxParams",function(){return r}),a.d(m,"getStackblitzPrefillConfig",function(){return j});const U="https://github.com/antvis/X6/tree/master//Users/wenyu/vector/code/AntV/X6/sites/x6-sites-demos/packages/api/ui/contextmenu/basic";function r(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, ContextMenu } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'
import '@antv/x6-react-components/es/context-menu/style/index.css'

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
      <div style={{ padding: 24 }}>
        <ContextMenu menu={menu}>
          <div
            style={{
              height: 240,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#f5f5f5',
              userSelect: 'none',
            }}
          >
            Right Click On Me
          </div>
        </ContextMenu>
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
`,isBinary:!1}}}}function j(){return{title:"api/ui/contextmenu/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, ContextMenu } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'
import '@antv/x6-react-components/es/context-menu/style/index.css'

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
      <div style={{ padding: 24 }}>
        <ContextMenu menu={menu}>
          <div
            style={{
              height: 240,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#f5f5f5',
              userSelect: 'none',
            }}
          >
            Right Click On Me
          </div>
        </ContextMenu>
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
`}}}},86:function(f,m,a){},99:function(f,m,a){}},[[71,1,2]]]);
