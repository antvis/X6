(this["webpackJsonpapi.ui.contextmenu.basic"]=this["webpackJsonpapi.ui.contextmenu.basic"]||[]).push([[0],{122:function(f,m,a){"use strict";a.r(m);var X=a(0),r=a.n(X),j=a(14),A=a.n(j),h=a(6),v=a(7),E=a(9),g=a(8),k=a(27),R=a(2),w=a.n(R),M=r.a.createContext({}),C=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){var e;return Object(h.a)(this,t),e=i.apply(this,arguments),e.onHotkey=function(){e.triggerHandler()},e.onClick=function(n){e.triggerHandler(n)},e}return Object(v.a)(t,[{key:"componentDidMount",value:function(){var n=this.props.hotkey;n&&this.props.context.registerHotkey(n,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var n=this.props.hotkey;n&&this.props.context.unregisterHotkey(n,this.onHotkey)}},{key:"triggerHandler",value:function(n){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,n),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return r.a.createElement("div",Object.assign({},t.getProps(this.props)),t.getContent(this.props,this.onClick))}}]),t}(r.a.PureComponent);(function(o){function i(e,n){var s,l=e.className,c=e.disabled,u=e.active,d=e.hidden,y=e.context.prefixCls,p="".concat(y,"-item");return{className:w()(p,n,(s={},Object(k.a)(s,"".concat(p,"-active"),u),Object(k.a)(s,"".concat(p,"-hidden"),d),Object(k.a)(s,"".concat(p,"-disabled"),c),s),l)}}o.getProps=i;function t(e,n,s,l){var c=e.icon,u=e.text,d=e.hotkey,y=e.children,p=e.context.prefixCls,x="".concat(p,"-item");return r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"".concat(x,"-button"),onClick:n},c&&r.a.isValidElement(c)&&r.a.createElement("span",{className:"".concat(x,"-icon")},c),r.a.createElement("span",{className:"".concat(x,"-text")},u||y),d&&r.a.createElement("span",{className:"".concat(x,"-hotkey")},d),s),l)}o.getContent=t})(C||(C={}));var T=function(i){return r.a.createElement(M.Consumer,null,function(t){return r.a.createElement(C,Object.assign({context:t},i))})},U=function(){return r.a.createElement(M.Consumer,null,function(i){var t=i.prefixCls;return r.a.createElement("div",{className:"".concat(t,"-item ").concat(t,"-item-divider")})})},P=function(o,i){var t={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&i.indexOf(e)<0&&(t[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,e=Object.getOwnPropertySymbols(o);n<e.length;n++)i.indexOf(e[n])<0&&Object.prototype.propertyIsEnumerable.call(o,e[n])&&(t[e[n]]=o[e[n]]);return t},I=function(i){var t=i.hotkey,e=i.children,n=P(i,["hotkey","children"]);return r.a.createElement(M.Consumer,null,function(s){var l=s.prefixCls,c=C.getProps(Object.assign({context:s},i),"".concat(l,"-submenu"));return r.a.createElement("div",Object.assign({},c),C.getContent(Object.assign({context:s},n),null,r.a.createElement("span",{className:"".concat(l,"-submenu-arrow")}),r.a.createElement("div",{className:"".concat(l,"-submenu-menu")},e)))})},b=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){var e;return Object(h.a)(this,t),e=i.apply(this,arguments),e.onClick=function(n,s){e.props.stopPropagation&&s!=null&&s.stopPropagation(),e.props.onClick&&e.props.onClick(n)},e.registerHotkey=function(n,s){e.props.registerHotkey&&e.props.registerHotkey(n,s)},e.unregisterHotkey=function(n,s){e.props.unregisterHotkey&&e.props.unregisterHotkey(n,s)},e}return Object(v.a)(t,[{key:"render",value:function(){var n=this.props,s=n.prefixCls,l=n.className,c=n.children,u=n.hasIcon,d="".concat(s,"-menu"),y=M.Provider,p={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return r.a.createElement("div",{className:w()(d,Object(k.a)({},"".concat(d,"-has-icon"),u),l)},r.a.createElement(y,{value:p},c))}}]),t}(r.a.PureComponent);(function(o){o.Item=T,o.Divider=U,o.SubMenu=I,o.defaultProps={prefixCls:"x6",stopPropagation:!1}})(b||(b={}));var S=a(69),N=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){return Object(h.a)(this,t),i.apply(this,arguments)}return Object(v.a)(t,[{key:"getTransitionName",value:function(){var n=this.props,s=n.placement,l=s===void 0?"":s,c=n.transitionName;return c!==void 0?c:l.indexOf("top")>=0?"slide-down":"slide-up"}},{key:"render",value:function(){var n=this.props,s=n.children,l=n.trigger,c=n.disabled,u="".concat(this.props.prefixCls,"-dropdown"),d=r.a.Children.only(s),y=r.a.cloneElement(d,{className:w()(s.props.className,"".concat(u,"-trigger")),disabled:c}),p=c?[]:Array.isArray(l)?l:[l],x=!1;p&&p.indexOf("contextMenu")!==-1&&(x=!0);var ee=r.a.Children.only(this.props.overlay),ne=r.a.createElement("div",{className:"".concat(u,"-overlay")},ee);return r.a.createElement(S.a,Object.assign({},this.props,{prefixCls:u,overlay:ne,alignPoint:x,trigger:p,transitionName:this.getTransitionName()}),y)}}]),t}(r.a.Component);(function(o){o.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(N||(N={}));var H=function(o,i){var t={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&i.indexOf(e)<0&&(t[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,e=Object.getOwnPropertySymbols(o);n<e.length;n++)i.indexOf(e[n])<0&&Object.prototype.propertyIsEnumerable.call(o,e[n])&&(t[e[n]]=o[e[n]]);return t},z=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){return Object(h.a)(this,t),i.apply(this,arguments)}return Object(v.a)(t,[{key:"render",value:function(){var n=this.props,s=n.children,l=n.menu,c=n.overlay,u=H(n,["children","menu","overlay"]);return r.a.createElement(N,Object.assign({},u,{overlay:l||c,trigger:"contextMenu"}),s)}}]),t}(r.a.PureComponent),te=a(76),re=a(77),oe=a(78),B=r.a.createElement(b,null,r.a.createElement(b.Item,{key:"1"},"1st menu item"),r.a.createElement(b.Item,{key:"2"},"2nd menu item"),r.a.createElement(b.Item,{key:"3"},"3rd menu item")),F=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){return Object(h.a)(this,t),i.apply(this,arguments)}return Object(v.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:{padding:24}},r.a.createElement(z,{menu:B},r.a.createElement("div",{style:{height:240,display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},"Right Click On Me")))}}]),t}(r.a.Component),_=a(129),J=a(125),V=a(130),W=a(131),Y=a(132),O=a(127),ae=a(82),$=a(57),G=a(58),se=a(86),D=a(85),Z=function(){return r.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},K=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(){return Object(h.a)(this,t),i.apply(this,arguments)}return Object(v.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"demo-toolbar"},r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},r.a.createElement(_.a,{onClick:function(){window.location.reload()}})),window.frameElement&&r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(J.a,{component:Z}))),r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(V.a,null))),r.a.createElement(O.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},r.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},r.a.createElement("input",{type:"hidden",name:"parameters",value:Object(G.getParameters)(D.getCodeSandboxParams())}),r.a.createElement("button",{type:"submit"},r.a.createElement(W.a,null)))),r.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},r.a.createElement(Y.a,{onClick:function(){$.a.openProject(D.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),t}(r.a.Component),Q=a(128),ie=a(99),L=function(o){Object(E.a)(t,o);var i=Object(g.a)(t);function t(e){var n;return Object(h.a)(this,t),n=i.call(this,e),n.refContainer=function(s){n.container=s},t.restoreIframeSize(),n}return Object(v.a)(t,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){n.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var l=document.getElementById("loading");l&&l.parentNode&&l.parentNode.removeChild(l)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var s=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(s+16,"px"),n.style.border="0",n.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return r.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},r.a.createElement(K,null),this.props.children)}}]),t}(r.a.Component);(function(o){var i=window.location.pathname,t="x6-iframe-size";function e(){var l=localStorage.getItem(t),c;if(l)try{c=JSON.parse(l)}catch(u){}else c={};return c}function n(){var l=window.frameElement;if(l){var c=l.style,u={width:c.width,height:c.height},d=e();d[i]=u,localStorage.setItem(t,JSON.stringify(d))}}o.saveIframeSize=n;function s(){var l=window.frameElement;if(l){var c=e(),u=c[i];u&&(l.style.width=u.width||"100%",l.style.height=u.height||"auto")}}o.restoreIframeSize=s})(L||(L={}));var le=a(100),q=function(i){var t=i.children;return r.a.createElement(Q.a.ErrorBoundary,null,r.a.createElement(L,null,t))};A.a.render(r.a.createElement(q,null,r.a.createElement(F,null)),document.getElementById("root"))},71:function(f,m,a){f.exports=a(122)},76:function(f,m,a){},77:function(f,m,a){},78:function(f,m,a){},85:function(f,m,a){"use strict";a.r(m),a.d(m,"host",function(){return X}),a.d(m,"getCodeSandboxParams",function(){return r}),a.d(m,"getStackblitzPrefillConfig",function(){return j});const X="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/contextmenu/basic";function r(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
