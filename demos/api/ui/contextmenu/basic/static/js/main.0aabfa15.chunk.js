(this["webpackJsonp@antv/x6-sites-demos-api.ui.contextmenu.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.contextmenu.basic"]||[]).push([[0],{105:function(f,m,a){},128:function(f,m,a){"use strict";a.r(m);var X=a(0),e=a.n(X),j=a(15),A=a.n(j),h=a(7),E=a(8),v=a(10),g=a(9),k=a(28),R=a(2),w=a.n(R),M=e.a.createContext({}),C=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){var n;return Object(h.a)(this,r),n=i.apply(this,arguments),n.onHotkey=function(){n.triggerHandler()},n.onClick=function(t){n.triggerHandler(t)},n}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var t=this.props.hotkey;t&&this.props.context.registerHotkey(t,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var t=this.props.hotkey;t&&this.props.context.unregisterHotkey(t,this.onHotkey)}},{key:"triggerHandler",value:function(t){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,t),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},r.getProps(this.props)),r.getContent(this.props,this.onClick))}}]),r}(e.a.PureComponent);(function(o){function i(n,t){var s,l=n.className,c=n.disabled,u=n.active,d=n.hidden,x=n.context.prefixCls,p="".concat(x,"-item");return{className:w()(p,t,(s={},Object(k.a)(s,"".concat(p,"-active"),u),Object(k.a)(s,"".concat(p,"-hidden"),d),Object(k.a)(s,"".concat(p,"-disabled"),c),s),l)}}o.getProps=i;function r(n,t,s,l){var c=n.icon,u=n.text,d=n.hotkey,x=n.children,p=n.context.prefixCls,y="".concat(p,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{className:"".concat(y,"-button"),onClick:t},c&&e.a.isValidElement(c)&&e.a.createElement("span",{className:"".concat(y,"-icon")},c),e.a.createElement("span",{className:"".concat(y,"-text")},u||x),d&&e.a.createElement("span",{className:"".concat(y,"-hotkey")},d),s),l)}o.getContent=r})(C||(C={}));var T=function(i){return e.a.createElement(M.Consumer,null,function(r){return e.a.createElement(C,Object.assign({context:r},i))})},U=function(){return e.a.createElement(M.Consumer,null,function(i){var r=i.prefixCls;return e.a.createElement("div",{className:"".concat(r,"-item ").concat(r,"-item-divider")})})},P=function(o,i){var r={};for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&i.indexOf(n)<0&&(r[n]=o[n]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,n=Object.getOwnPropertySymbols(o);t<n.length;t++)i.indexOf(n[t])<0&&Object.prototype.propertyIsEnumerable.call(o,n[t])&&(r[n[t]]=o[n[t]]);return r},I=function(i){var r=i.hotkey,n=i.children,t=P(i,["hotkey","children"]);return e.a.createElement(M.Consumer,null,function(s){var l=s.prefixCls,c=C.getProps(Object.assign({context:s},i),"".concat(l,"-submenu"));return e.a.createElement("div",Object.assign({},c),C.getContent(Object.assign({context:s},t),null,e.a.createElement("span",{className:"".concat(l,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(l,"-submenu-menu")},n)))})},b=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){var n;return Object(h.a)(this,r),n=i.apply(this,arguments),n.onClick=function(t,s){n.props.stopPropagation&&s!=null&&s.stopPropagation(),n.props.onClick&&n.props.onClick(t)},n.registerHotkey=function(t,s){n.props.registerHotkey&&n.props.registerHotkey(t,s)},n.unregisterHotkey=function(t,s){n.props.unregisterHotkey&&n.props.unregisterHotkey(t,s)},n}return Object(E.a)(r,[{key:"render",value:function(){var t=this.props,s=t.prefixCls,l=t.className,c=t.children,u=t.hasIcon,d="".concat(s,"-menu"),x=M.Provider,p={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:w()(d,Object(k.a)({},"".concat(d,"-has-icon"),u),l)},e.a.createElement(x,{value:p},c))}}]),r}(e.a.PureComponent);(function(o){o.Item=T,o.Divider=U,o.SubMenu=I,o.defaultProps={prefixCls:"x6",stopPropagation:!1}})(b||(b={}));var S=a(73),N=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){return Object(h.a)(this,r),i.apply(this,arguments)}return Object(E.a)(r,[{key:"getTransitionName",value:function(){var t=this.props,s=t.placement,l=s===void 0?"":s,c=t.transitionName;return c!==void 0?c:l.indexOf("top")>=0?"slide-down":"slide-up"}},{key:"render",value:function(){var t=this.props,s=t.children,l=t.trigger,c=t.disabled,u="".concat(this.props.prefixCls,"-dropdown"),d=e.a.Children.only(s),x=e.a.cloneElement(d,{className:w()(s.props.className,"".concat(u,"-trigger")),disabled:c}),p=c?[]:Array.isArray(l)?l:[l],y=!1;p&&p.indexOf("contextMenu")!==-1&&(y=!0);var ne=e.a.Children.only(this.props.overlay),te=e.a.createElement("div",{className:"".concat(u,"-overlay")},ne);return e.a.createElement(S.a,Object.assign({},this.props,{prefixCls:u,overlay:te,alignPoint:y,trigger:p,transitionName:this.getTransitionName()}),x)}}]),r}(e.a.Component);(function(o){o.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(N||(N={}));var H=function(o,i){var r={};for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&i.indexOf(n)<0&&(r[n]=o[n]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,n=Object.getOwnPropertySymbols(o);t<n.length;t++)i.indexOf(n[t])<0&&Object.prototype.propertyIsEnumerable.call(o,n[t])&&(r[n[t]]=o[n[t]]);return r},z=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){return Object(h.a)(this,r),i.apply(this,arguments)}return Object(E.a)(r,[{key:"render",value:function(){var t=this.props,s=t.children,l=t.menu,c=t.overlay,u=H(t,["children","menu","overlay"]);return e.a.createElement(N,Object.assign({},u,{overlay:l||c,trigger:"contextMenu"}),s)}}]),r}(e.a.PureComponent),re=a(80),oe=a(81),ae=a(82),B=e.a.createElement(b,null,e.a.createElement(b.Item,{key:"1"},"1st menu item"),e.a.createElement(b.Item,{key:"2"},"2nd menu item"),e.a.createElement(b.Item,{key:"3"},"3rd menu item")),F=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){return Object(h.a)(this,r),i.apply(this,arguments)}return Object(E.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{style:{padding:24}},e.a.createElement(z,{menu:B},e.a.createElement("div",{style:{height:240,display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},"Right Click On Me")))}}]),r}(e.a.Component),J=a(135),V=a(131),_=a(136),W=a(137),Y=a(138),O=a(133),se=a(86),$=a(58),G=a(59),ie=a(90),D=a(89),Z=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},K=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(){return Object(h.a)(this,r),i.apply(this,arguments)}return Object(E.a)(r,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(J.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(V.a,{component:Z}))),e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(_.a,null))),e.a.createElement(O.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(G.getParameters)(D.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(W.a,null)))),e.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 StackBlitz \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement(Y.a,{onClick:function(){$.a.openProject(D.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),r}(e.a.Component),Q=a(134),q=a(61),le=a(105),L=function(o){Object(v.a)(r,o);var i=Object(g.a)(r);function r(n){var t;return Object(h.a)(this,r),t=i.call(this,n),t.refContainer=function(s){t.container=s},r.restoreIframeSize(),t}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){t.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var l=document.getElementById("loading");l&&l.parentNode&&l.parentNode.removeChild(l)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var s=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(s+16,"px"),t.style.border="0",t.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(K,null),this.props.children)}}]),r}(e.a.Component);(function(o){var i=window.location.pathname,r="x6-iframe-size";function n(){var l=localStorage.getItem(r),c;if(l)try{c=JSON.parse(l)}catch(u){}else c={};return c}function t(){var l=window.frameElement;if(l){var c=l.style,u={width:c.width,height:c.height},d=n();d[i]=u,localStorage.setItem(r,JSON.stringify(d))}}o.saveIframeSize=t;function s(){var l=window.frameElement;if(l){var c=n(),u=c[i];u&&(l.style.width=u.width||"100%",l.style.height=u.height||"auto")}}o.restoreIframeSize=s})(L||(L={}));var ce=a(106),ee=function(i){var r=i.children;return e.a.createElement(Q.a.ErrorBoundary,null,e.a.createElement(q.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(L,null,r))};A.a.render(e.a.createElement(ee,null,e.a.createElement(F,null)),document.getElementById("root"))},75:function(f,m,a){f.exports=a(128)},80:function(f,m,a){},81:function(f,m,a){},82:function(f,m,a){},89:function(f,m,a){"use strict";a.r(m),a.d(m,"host",function(){return X}),a.d(m,"getCodeSandboxParams",function(){return e}),a.d(m,"getStackblitzPrefillConfig",function(){return j});const X="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/contextmenu/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,isBinary:!1}}}}function j(){return{title:"api/ui/contextmenu/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`}}}},90:function(f,m,a){}},[[75,1,2]]]);
