(this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]||[]).push([[0],{101:function(b,f,s){},103:function(b,f,s){"use strict";s.r(f);var R=s(0),n=s.n(R),N=s(16),X=s.n(N),y=s(19),C=s(20),x=s(22),g=s(21),V=s(81),M=s(23),H=s(5),_=s.n(H),A=n.a.createContext({}),O=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(){var t;return Object(y.a)(this,a),t=c.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(e){t.triggerHandler(e)},t}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.hotkey;e&&this.props.context.registerHotkey(e,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var e=this.props.hotkey;e&&this.props.context.unregisterHotkey(e,this.onHotkey)}},{key:"triggerHandler",value:function(e){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,e),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return n.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(n.a.PureComponent);(function(i){function c(t,e){var r,o=t.className,l=t.disabled,m=t.active,d=t.hidden,p=t.context.prefixCls,v="".concat(p,"-item");return{className:_()(v,e,(r={},Object(M.a)(r,"".concat(v,"-active"),m),Object(M.a)(r,"".concat(v,"-hidden"),d),Object(M.a)(r,"".concat(v,"-disabled"),l),r),o)}}i.getProps=c;function a(t,e,r,o){var l=t.icon,m=t.text,d=t.hotkey,p=t.children,v=t.context.prefixCls,E="".concat(v,"-item");return n.a.createElement(n.a.Fragment,null,n.a.createElement("button",{type:"button",className:"".concat(E,"-button"),onClick:e},l&&n.a.isValidElement(l)&&n.a.createElement("span",{className:"".concat(E,"-icon")},l),n.a.createElement("span",{className:"".concat(E,"-text")},m||p),d&&n.a.createElement("span",{className:"".concat(E,"-hotkey")},d),r),o)}i.getContent=a})(O||(O={}));var z=function(c){return n.a.createElement(A.Consumer,null,function(a){return n.a.createElement(O,Object.assign({context:a},c))})},F=function(){return n.a.createElement(A.Consumer,null,function(c){var a=c.prefixCls;return n.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},B=function(i,c){var a={};for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&c.indexOf(t)<0&&(a[t]=i[t]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var e=0,t=Object.getOwnPropertySymbols(i);e<t.length;e++)c.indexOf(t[e])<0&&Object.prototype.propertyIsEnumerable.call(i,t[e])&&(a[t[e]]=i[t[e]]);return a},W=function(c){var a=c.hotkey,t=c.children,e=B(c,["hotkey","children"]);return n.a.createElement(A.Consumer,null,function(r){var o=r.prefixCls,l=O.getProps(Object.assign({context:r},c),"".concat(o,"-submenu"));return n.a.createElement("div",Object.assign({},l),O.getContent(Object.assign({context:r},e),null,n.a.createElement("span",{className:"".concat(o,"-submenu-arrow")}),n.a.createElement("div",{className:"".concat(o,"-submenu-menu")},t)))})},h=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(){var t;return Object(y.a)(this,a),t=c.apply(this,arguments),t.onClick=function(e,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(e)},t.registerHotkey=function(e,r){t.props.registerHotkey&&t.props.registerHotkey(e,r)},t.unregisterHotkey=function(e,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(e,r)},t}return Object(C.a)(a,[{key:"render",value:function(){var e=this.props,r=e.prefixCls,o=e.className,l=e.children,m=e.hasIcon,d="".concat(r,"-menu"),p=A.Provider,v={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return n.a.createElement("div",{className:_()(d,Object(M.a)({},"".concat(d,"-has-icon"),m),o)},n.a.createElement(p,{value:v},l))}}]),a}(n.a.PureComponent);(function(i){i.Item=z,i.Divider=F,i.SubMenu=W,i.defaultProps={prefixCls:"x6",stopPropagation:!1}})(h||(h={}));var Z=s(42),j=s.n(Z),L=n.a.createContext({}),U=new WeakMap,J=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(t){var e;return Object(y.a)(this,a),e=c.call(this,t),e.onDocumentClick=function(){e.deactive()},e.onClick=function(r){e.props.context.activeMenubar(),e.removeDeactive(r.currentTarget.parentElement),e.active()},e.onMouseEnter=function(r){if(e.props.context.menubarActived&&!e.state.active&&!e.isPrevMenuHiddening(r)){var o=r.currentTarget,l=o.parentElement.childNodes;l.forEach(function(m){m===o?e.removeDeactive(m):e.callDeactive(m)}),e.active()}},e.onMouseLeave=function(r){var o=r.relatedTarget,l=r.currentTarget;if(e.props.context.menubarActived&&e.state.active){var m=l.parentElement.childNodes,d=!1;if(o!==window)for(var p=0,v=m.length;p<v;p+=1){var E=m[p];if(E===o||E.contains(o)){d=!0;break}}d?e.deactive():e.cacheDeactive(l)}},e.active=function(){e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=j()(document.documentElement,"click",e.onDocumentClick).remove)},e.deactive=function(){e.setState({active:!1}),e.removeDocClickEvent&&(e.removeDocClickEvent(),e.removeDocClickEvent=null)},e.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),e.state={active:!1},e}return Object(C.a)(a,[{key:"isPrevMenuHiddening",value:function(e){var r=e.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var o=e.currentTarget,l=o.parentElement.childNodes,m=0,d=l.length;m<d;m+=1){var p=l[m],v=p.querySelector(".".concat(this.popupClassName));if(v.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(e){U.set(e,this.deactive)}},{key:"callDeactive",value:function(e){U.has(e)&&(U.get(e)(),U.delete(e))}},{key:"removeDeactive",value:function(e){U.delete(e)}},{key:"render",value:function(){var e,r=this.props,o=r.text,l=r.children,m=r.hidden,d=this.props.context,p=d.prefixCls,v=d.menubarActived,E=v&&this.state.active,k="".concat(p,"-item");return n.a.createElement("div",{className:_()(k,(e={},Object(M.a)(e,"".concat(k,"-hidden"),m),Object(M.a)(e,"".concat(k,"-hover"),v),Object(M.a)(e,"".concat(k,"-active"),E),e)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},n.a.createElement("div",{className:_()("".concat(k,"-text"),Object(M.a)({},"".concat(k,"-text-active"),E)),onClick:this.onClick},o),n.a.createElement("div",{className:this.popupClassName},l))}}]),a}(n.a.PureComponent),$=function(c){return n.a.createElement(L.Consumer,null,function(a){return n.a.createElement(J,Object.assign({context:a},c))})},D=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(t){var e;return Object(y.a)(this,a),e=c.call(this,t),e.onDocumentClick=function(){e.setState({active:!1}),e.unbindDocEvent()},e.activeMenubar=function(){e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=j()(document.documentElement,"click",e.onDocumentClick).remove)},e.state={active:!1},e}return Object(C.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var e=this.props,r=e.prefixCls,o=e.className,l=e.children,m=e.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active===!0};return n.a.createElement("div",{className:_()(d,o)},n.a.createElement("div",{className:"".concat(d,"-content")},n.a.createElement("div",{className:"".concat(d,"-content-inner")},n.a.createElement(L.Provider,{value:p},l)),m&&n.a.createElement("div",{className:"".concat(d,"-content-extras")},m)))}}]),a}(n.a.PureComponent);(function(i){i.Item=$,i.defaultProps={prefixCls:"x6"}})(D||(D={}));var ie=s(87),ce=s(88),le=s(63),u=h.Item,Y=h.SubMenu,I=h.Divider,w=D.Item,G=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(){var t;Object(y.a)(this,a);for(var e=arguments.length,r=new Array(e),o=0;o<e;o++)r[o]=arguments[o];return t=c.call.apply(c,[this].concat(r)),t.onMenuClick=function(l){V.b.success("".concat(l," clicked"),10)},t}return Object(C.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{style:{height:240,padding:32}},n.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},n.a.createElement(D,{extra:n.a.createElement("div",null,"Extra Component")},n.a.createElement(w,{text:"File"},n.a.createElement(h,{onClick:this.onMenuClick},n.a.createElement(u,{name:"newFile",hotkey:"Cmd+N"},"New File"),n.a.createElement(u,{name:"newWindow",hotkey:"Cmd+Shift+N"},"New Window"),n.a.createElement(I,null),n.a.createElement(u,{name:"open",hotkey:"Cmd+O"},"Open..."),n.a.createElement(u,{name:"openWorkspace"},"Open Workspace..."),n.a.createElement(I,null),n.a.createElement(u,{name:"save",hotkey:"Cmd+S"},"Save"),n.a.createElement(u,{name:"saveAs",hotkey:"Cmd+Shift+S"},"Save As..."),n.a.createElement(u,{name:"saveAll",hotkey:"Cmd+Alt+S"},"Save All"))),n.a.createElement(w,{text:"Edit"},n.a.createElement(h,null,n.a.createElement(u,{name:"undo",hotkey:"Cmd+Z"},"Undo"),n.a.createElement(u,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),n.a.createElement(I,null),n.a.createElement(u,{name:"cut",hotkey:"Cmd+X"},"Cut"),n.a.createElement(u,{name:"copy",hotkey:"Cmd+C"},"Copy"),n.a.createElement(u,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),n.a.createElement(I,null),n.a.createElement(u,{name:"find",hotkey:"Cmd+F"},"Find"),n.a.createElement(u,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),n.a.createElement(w,{text:"View"},n.a.createElement(h,null,n.a.createElement(u,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),n.a.createElement(u,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),n.a.createElement(I,null),n.a.createElement(Y,{text:"Appearance"},n.a.createElement(u,{name:"side-bar"},"Show Side Bar"),n.a.createElement(u,{name:"status-bar"},"Show Status Bar"),n.a.createElement(u,{name:"activity-bar"},"Show Activity Bar"),n.a.createElement(u,{name:"editor-area"},"Show Editor Area"),n.a.createElement(u,{name:"show-panel"},"Show Panel")),n.a.createElement(I,null),n.a.createElement(u,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),n.a.createElement(u,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),n.a.createElement(w,{text:"Help"},n.a.createElement(h,null,n.a.createElement(u,{name:"welcome"},"Welcome"),n.a.createElement(u,{name:"documention"},"Documention"),n.a.createElement(u,{name:"about"},"Aoubt"))))))}}]),a}(n.a.Component),K=s(110),Q=s(107),q=s(111),ee=s(112),S=s(108),ne=s(71),me=s(97),T=s(98),te=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},ae=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(){return Object(y.a)(this,a),c.apply(this,arguments)}return Object(C.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(K.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(Q.a,{component:te}))),n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(T.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(q.a,null))),n.a.createElement(S.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(ne.getParameters)(T.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(ee.a,null)))))}}]),a}(n.a.Component),re=s(109),oe=s(77),ue=s(101),P=function(i){Object(x.a)(a,i);var c=Object(g.a)(a);function a(t){var e;return Object(y.a)(this,a),e=c.call(this,t),e.refContainer=function(r){e.container=r},a.restoreIframeSize(),e}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){e.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var r=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(r+16,"px"),e.style.border="0",e.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(ae,null),this.props.children)}}]),a}(n.a.Component);(function(i){var c=window.location.pathname,a="x6-iframe-size";function t(){var o=localStorage.getItem(a),l;if(o)try{l=JSON.parse(o)}catch(m){}else l={};return l}function e(){var o=window.frameElement;if(o){var l=o.style,m={width:l.width,height:l.height},d=t();d[c]=m,localStorage.setItem(a,JSON.stringify(d))}}i.saveIframeSize=e;function r(){var o=window.frameElement;if(o){var l=t(),m=l[c];m&&(o.style.width=m.width||"100%",o.style.height=m.height||"auto")}}i.restoreIframeSize=r})(P||(P={}));var de=s(102),se=function(c){var a=c.children;return n.a.createElement(re.a.ErrorBoundary,null,n.a.createElement(oe.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(P,null,a))};X.a.render(n.a.createElement(se,null,n.a.createElement(G,null)),document.getElementById("root"))},82:function(b,f,s){b.exports=s(103)},87:function(b,f,s){},88:function(b,f,s){},97:function(b,f,s){},98:function(b,f,s){"use strict";s.r(f),s.d(f,"host",function(){return R}),s.d(f,"getCodeSandboxParams",function(){return n}),s.d(f,"getStackblitzPrefillConfig",function(){return N});const R="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/menubar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { message } from 'antd'
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // eslint-disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // eslint-disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu onClick={this.onMenuClick}>
                <MenuItem name="newFile" hotkey="Cmd+N">
                  New File
                </MenuItem>
                <MenuItem name="newWindow" hotkey="Cmd+Shift+N">
                  New Window
                </MenuItem>
                <Divider />
                <MenuItem name="open" hotkey="Cmd+O">
                  Open...
                </MenuItem>
                <MenuItem name="openWorkspace">Open Workspace...</MenuItem>
                <Divider />
                <MenuItem name="save" hotkey="Cmd+S">
                  Save
                </MenuItem>
                <MenuItem name="saveAs" hotkey="Cmd+Shift+S">
                  Save As...
                </MenuItem>
                <MenuItem name="saveAll" hotkey="Cmd+Alt+S">
                  Save All
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
                  Undo
                </MenuItem>
                <MenuItem name="redo" hotkey="Cmd+Shift+Z">
                  Redo
                </MenuItem>
                <Divider />
                <MenuItem name="cut" hotkey="Cmd+X">
                  Cut
                </MenuItem>
                <MenuItem name="copy" hotkey="Cmd+C">
                  Copy
                </MenuItem>
                <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
                  Paste
                </MenuItem>
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`,isBinary:!1}}}}function N(){return{title:"api/ui/menubar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"1.x",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { message } from 'antd'
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // eslint-disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // eslint-disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu onClick={this.onMenuClick}>
                <MenuItem name="newFile" hotkey="Cmd+N">
                  New File
                </MenuItem>
                <MenuItem name="newWindow" hotkey="Cmd+Shift+N">
                  New Window
                </MenuItem>
                <Divider />
                <MenuItem name="open" hotkey="Cmd+O">
                  Open...
                </MenuItem>
                <MenuItem name="openWorkspace">Open Workspace...</MenuItem>
                <Divider />
                <MenuItem name="save" hotkey="Cmd+S">
                  Save
                </MenuItem>
                <MenuItem name="saveAs" hotkey="Cmd+Shift+S">
                  Save As...
                </MenuItem>
                <MenuItem name="saveAll" hotkey="Cmd+Alt+S">
                  Save All
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
                  Undo
                </MenuItem>
                <MenuItem name="redo" hotkey="Cmd+Shift+Z">
                  Redo
                </MenuItem>
                <Divider />
                <MenuItem name="cut" hotkey="Cmd+X">
                  Cut
                </MenuItem>
                <MenuItem name="copy" hotkey="Cmd+C">
                  Copy
                </MenuItem>
                <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
                  Paste
                </MenuItem>
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`}}}}},[[82,1,2]]]);
