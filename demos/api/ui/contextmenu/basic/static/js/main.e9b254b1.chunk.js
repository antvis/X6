(this["webpackJsonp@antv/x6-sites-demos-api.ui.contextmenu.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.contextmenu.basic"]||[]).push([[0],{58:function(f,m,a){f.exports=a(77)},63:function(f,m,a){},64:function(f,m,a){},65:function(f,m,a){},71:function(f,m,a){},72:function(f,m,a){"use strict";a.r(m),a.d(m,"host",function(){return U}),a.d(m,"getCodeSandboxParams",function(){return e}),a.d(m,"getStackblitzPrefillConfig",function(){return w});const U="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/contextmenu/basic";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "1.x",
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
`,isBinary:!1}}}}function w(){return{title:"api/ui/contextmenu/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"1.x",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "1.x",
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
`}}}},75:function(f,m,a){},77:function(f,m,a){"use strict";a.r(m);var U=a(0),e=a.n(U),w=a(18),L=a.n(w),v=a(12),E=a(13),h=a(16),y=a(15),O=a(28),R=a(4),j=a.n(R),M=e.a.createContext({}),C=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){var n;return Object(v.a)(this,t),n=s.apply(this,arguments),n.onHotkey=function(){n.triggerHandler()},n.onClick=function(r){n.triggerHandler(r)},n}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var r=this.props.hotkey;r&&this.props.context.registerHotkey(r,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var r=this.props.hotkey;r&&this.props.context.unregisterHotkey(r,this.onHotkey)}},{key:"triggerHandler",value:function(r){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,r),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},t.getProps(this.props)),t.getContent(this.props,this.onClick))}}]),t}(e.a.PureComponent);(function(o){function s(n,r){var i,c=n.className,l=n.disabled,d=n.active,u=n.hidden,g=n.context.prefixCls,p="".concat(g,"-item");return{className:j()(p,r,(i={},Object(O.a)(i,"".concat(p,"-active"),d),Object(O.a)(i,"".concat(p,"-hidden"),u),Object(O.a)(i,"".concat(p,"-disabled"),l),i),c)}}o.getProps=s;function t(n,r,i,c){var l=n.icon,d=n.text,u=n.hotkey,g=n.children,p=n.context.prefixCls,x="".concat(p,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{type:"button",className:"".concat(x,"-button"),onClick:r},l&&e.a.isValidElement(l)&&e.a.createElement("span",{className:"".concat(x,"-icon")},l),e.a.createElement("span",{className:"".concat(x,"-text")},d||g),u&&e.a.createElement("span",{className:"".concat(x,"-hotkey")},u),i),c)}o.getContent=t})(C||(C={}));var T=function(s){return e.a.createElement(M.Consumer,null,function(t){return e.a.createElement(C,Object.assign({context:t},s))})},I=function(){return e.a.createElement(M.Consumer,null,function(s){var t=s.prefixCls;return e.a.createElement("div",{className:"".concat(t,"-item ").concat(t,"-item-divider")})})},P=function(o,s){var t={};for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&s.indexOf(n)<0&&(t[n]=o[n]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,n=Object.getOwnPropertySymbols(o);r<n.length;r++)s.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(o,n[r])&&(t[n[r]]=o[n[r]]);return t},X=function(s){var t=s.hotkey,n=s.children,r=P(s,["hotkey","children"]);return e.a.createElement(M.Consumer,null,function(i){var c=i.prefixCls,l=C.getProps(Object.assign({context:i},s),"".concat(c,"-submenu"));return e.a.createElement("div",Object.assign({},l),C.getContent(Object.assign({context:i},r),null,e.a.createElement("span",{className:"".concat(c,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(c,"-submenu-menu")},n)))})},b=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){var n;return Object(v.a)(this,t),n=s.apply(this,arguments),n.onClick=function(r,i){n.props.stopPropagation&&i!=null&&i.stopPropagation(),n.props.onClick&&n.props.onClick(r)},n.registerHotkey=function(r,i){n.props.registerHotkey&&n.props.registerHotkey(r,i)},n.unregisterHotkey=function(r,i){n.props.unregisterHotkey&&n.props.unregisterHotkey(r,i)},n}return Object(E.a)(t,[{key:"render",value:function(){var r=this.props,i=r.prefixCls,c=r.className,l=r.children,d=r.hasIcon,u="".concat(i,"-menu"),g=M.Provider,p={prefixCls:u,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:j()(u,Object(O.a)({},"".concat(u,"-has-icon"),d),c)},e.a.createElement(g,{value:p},l))}}]),t}(e.a.PureComponent);(function(o){o.Item=T,o.Divider=I,o.SubMenu=X,o.defaultProps={prefixCls:"x6",stopPropagation:!1}})(b||(b={}));var S=a(55),N=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){var r=this.props,i=r.children,c=r.trigger,l=r.disabled,d="".concat(this.props.prefixCls,"-dropdown"),u=e.a.Children.only(i),g=e.a.cloneElement(u,{className:j()(i.props.className,"".concat(d,"-trigger")),disabled:l}),p=l?[]:Array.isArray(c)?c:[c],x=!1;p&&p.indexOf("contextMenu")!==-1&&(x=!0);var q=e.a.Children.only(this.props.overlay),ee=e.a.createElement("div",{className:"".concat(d,"-overlay")},q);return e.a.createElement(S.a,Object.assign({},this.props,{prefixCls:d,overlay:ee,alignPoint:x,trigger:p}),g)}}]),t}(e.a.Component);(function(o){o.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(N||(N={}));var V=function(o,s){var t={};for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&s.indexOf(n)<0&&(t[n]=o[n]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,n=Object.getOwnPropertySymbols(o);r<n.length;r++)s.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(o,n[r])&&(t[n[r]]=o[n[r]]);return t},H=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){var r=this.props,i=r.children,c=r.menu,l=r.overlay,d=V(r,["children","menu","overlay"]);return e.a.createElement(N,Object.assign({},d,{overlay:c||l,trigger:"contextMenu"}),i)}}]),t}(e.a.PureComponent),ne=a(63),te=a(64),re=a(65),z=e.a.createElement(b,null,e.a.createElement(b.Item,{key:"1"},"1st menu item"),e.a.createElement(b.Item,{key:"2"},"2nd menu item"),e.a.createElement(b.Item,{key:"3"},"3rd menu item")),B=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{style:{padding:24}},e.a.createElement(H,{menu:z},e.a.createElement("div",{style:{height:240,display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},"Right Click On Me")))}}]),t}(e.a.Component),_=a(85),F=a(81),J=a(86),W=a(87),A=a(84),oe=a(68),Y=a(49),ae=a(71),k=a(72),G=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},Z=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(){return Object(v.a)(this,t),s.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(A.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(_.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(A.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(F.a,{component:G}))),e.a.createElement(A.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(k.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(J.a,null))),e.a.createElement(A.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(Y.getParameters)(k.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(W.a,null)))))}}]),t}(e.a.Component),$=a(82),K=a(52),se=a(75),D=function(o){Object(h.a)(t,o);var s=Object(y.a)(t);function t(n){var r;return Object(v.a)(this,t),r=s.call(this,n),r.refContainer=function(i){r.container=i},t.restoreIframeSize(),r}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){r.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var c=document.getElementById("loading");c&&c.parentNode&&c.parentNode.removeChild(c)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var i=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(i+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(Z,null),this.props.children)}}]),t}(e.a.Component);(function(o){var s=window.location.pathname,t="x6-iframe-size";function n(){var c=localStorage.getItem(t),l;if(c)try{l=JSON.parse(c)}catch(d){}else l={};return l}function r(){var c=window.frameElement;if(c){var l=c.style,d={width:l.width,height:l.height},u=n();u[s]=d,localStorage.setItem(t,JSON.stringify(u))}}o.saveIframeSize=r;function i(){var c=window.frameElement;if(c){var l=n(),d=l[s];d&&(c.style.width=d.width||"100%",c.style.height=d.height||"auto")}}o.restoreIframeSize=i})(D||(D={}));var ie=a(76),Q=function(s){var t=s.children;return e.a.createElement($.a.ErrorBoundary,null,e.a.createElement(K.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(D,null,t))};L.a.render(e.a.createElement(Q,null,e.a.createElement(B,null)),document.getElementById("root"))}},[[58,1,2]]]);
