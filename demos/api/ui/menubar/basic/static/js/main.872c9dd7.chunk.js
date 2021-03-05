(this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]||[]).push([[0],{119:function(b,f,o){"use strict";o.r(f),o.d(f,"host",function(){return U}),o.d(f,"getCodeSandboxParams",function(){return e}),o.d(f,"getStackblitzPrefillConfig",function(){return P});const U="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/menubar/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
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
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
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
`,isBinary:!1}}}}function P(){return{title:"api/ui/menubar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
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
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
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
`}}}},120:function(b,f,o){},126:function(b,f,o){},138:function(b,f,o){"use strict";o.r(f);var U=o(0),e=o.n(U),P=o(5),T=o.n(P),C=o(9),g=o(10),x=o(12),y=o(11),z=o(143),M=o(20),H=o(3),O=o.n(H),w=e.a.createContext({}),_=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(n){t.triggerHandler(n)},t}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var n=this.props.hotkey;n&&this.props.context.registerHotkey(n,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var n=this.props.hotkey;n&&this.props.context.unregisterHotkey(n,this.onHotkey)}},{key:"triggerHandler",value:function(n){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,n),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(e.a.PureComponent);(function(s){function c(t,n){var r,i=t.className,l=t.disabled,m=t.active,d=t.hidden,p=t.context.prefixCls,h="".concat(p,"-item");return{className:O()(h,n,(r={},Object(M.a)(r,"".concat(h,"-active"),m),Object(M.a)(r,"".concat(h,"-hidden"),d),Object(M.a)(r,"".concat(h,"-disabled"),l),r),i)}}s.getProps=c;function a(t,n,r,i){var l=t.icon,m=t.text,d=t.hotkey,p=t.children,h=t.context.prefixCls,v="".concat(h,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{className:"".concat(v,"-button"),onClick:n},l&&e.a.isValidElement(l)&&e.a.createElement("span",{className:"".concat(v,"-icon")},l),e.a.createElement("span",{className:"".concat(v,"-text")},m||p),d&&e.a.createElement("span",{className:"".concat(v,"-hotkey")},d),r),i)}s.getContent=a})(_||(_={}));var F=function(c){return e.a.createElement(w.Consumer,null,function(a){return e.a.createElement(_,Object.assign({context:a},c))})},B=function(){return e.a.createElement(w.Consumer,null,function(c){var a=c.prefixCls;return e.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},Z=function(s,c){var a={};for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&c.indexOf(t)<0&&(a[t]=s[t]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,t=Object.getOwnPropertySymbols(s);n<t.length;n++)c.indexOf(t[n])<0&&Object.prototype.propertyIsEnumerable.call(s,t[n])&&(a[t[n]]=s[t[n]]);return a},W=function(c){var a=c.hotkey,t=c.children,n=Z(c,["hotkey","children"]);return e.a.createElement(w.Consumer,null,function(r){var i=r.prefixCls,l=_.getProps(Object.assign({context:r},c),"".concat(i,"-submenu"));return e.a.createElement("div",Object.assign({},l),_.getContent(Object.assign({context:r},n),null,e.a.createElement("span",{className:"".concat(i,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(i,"-submenu-menu")},t)))})},E=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onClick=function(n,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(n)},t.registerHotkey=function(n,r){t.props.registerHotkey&&t.props.registerHotkey(n,r)},t.unregisterHotkey=function(n,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(n,r)},t}return Object(g.a)(a,[{key:"render",value:function(){var n=this.props,r=n.prefixCls,i=n.className,l=n.children,m=n.hasIcon,d="".concat(r,"-menu"),p=w.Provider,h={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:O()(d,Object(M.a)({},"".concat(d,"-has-icon"),m),i)},e.a.createElement(p,{value:h},l))}}]),a}(e.a.PureComponent);(function(s){s.Item=F,s.Divider=B,s.SubMenu=W,s.defaultProps={prefixCls:"x6",stopPropagation:!1}})(E||(E={}));var V=o(38),j=o.n(V),L=e.a.createContext({}),D=new WeakMap,J=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(t){var n;return Object(C.a)(this,a),n=c.call(this,t),n.onDocumentClick=function(){n.deactive()},n.onClick=function(r){n.props.context.activeMenubar(),n.removeDeactive(r.currentTarget.parentElement),n.active()},n.onMouseEnter=function(r){if(n.props.context.menubarActived&&!n.state.active&&!n.isPrevMenuHiddening(r)){var i=r.currentTarget,l=i.parentElement.childNodes;l.forEach(function(m){m===i?n.removeDeactive(m):n.callDeactive(m)}),n.active()}},n.onMouseLeave=function(r){var i=r.relatedTarget,l=r.currentTarget;if(n.props.context.menubarActived&&n.state.active){var m=l.parentElement.childNodes,d=!1;if(i!==window)for(var p=0,h=m.length;p<h;p+=1){var v=m[p];if(v===i||v.contains(i)){d=!0;break}}d?n.deactive():n.cacheDeactive(l)}},n.active=function(){n.setState({active:!0}),n.removeDocClickEvent||(n.removeDocClickEvent=j()(document.documentElement,"click",n.onDocumentClick).remove)},n.deactive=function(){n.setState({active:!1}),n.removeDocClickEvent&&(n.removeDocClickEvent(),n.removeDocClickEvent=null)},n.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),n.state={active:!1},n}return Object(g.a)(a,[{key:"isPrevMenuHiddening",value:function(n){var r=n.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var i=n.currentTarget,l=i.parentElement.childNodes,m=0,d=l.length;m<d;m+=1){var p=l[m],h=p.querySelector(".".concat(this.popupClassName));if(h.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(n){D.set(n,this.deactive)}},{key:"callDeactive",value:function(n){D.has(n)&&(D.get(n)(),D.delete(n))}},{key:"removeDeactive",value:function(n){D.delete(n)}},{key:"render",value:function(){var n,r=this.props,i=r.text,l=r.children,m=r.hidden,d=this.props.context,p=d.prefixCls,h=d.menubarActived,v=h&&this.state.active,I="".concat(p,"-item");return e.a.createElement("div",{className:O()(I,(n={},Object(M.a)(n,"".concat(I,"-hidden"),m),Object(M.a)(n,"".concat(I,"-hover"),h),Object(M.a)(n,"".concat(I,"-active"),v),n)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},e.a.createElement("div",{className:O()("".concat(I,"-text"),Object(M.a)({},"".concat(I,"-text-active"),v)),onClick:this.onClick},i),e.a.createElement("div",{className:this.popupClassName},l))}}]),a}(e.a.PureComponent),$=function(c){return e.a.createElement(L.Consumer,null,function(a){return e.a.createElement(J,Object.assign({context:a},c))})},R=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.state={active:!1},t.onDocumentClick=function(){t.setState({active:!1}),t.unbindDocEvent()},t.activeMenubar=function(){t.setState({active:!0}),t.removeDocClickEvent||(t.removeDocClickEvent=j()(document.documentElement,"click",t.onDocumentClick).remove)},t}return Object(g.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var n=this.props,r=n.prefixCls,i=n.className,l=n.children,m=n.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active};return e.a.createElement("div",{className:O()(d,i)},e.a.createElement("div",{className:"".concat(d,"-content")},e.a.createElement("div",{className:"".concat(d,"-content-inner")},e.a.createElement(L.Provider,{value:p},l)),m&&e.a.createElement("div",{className:"".concat(d,"-content-extras")},m)))}}]),a}(e.a.PureComponent);(function(s){s.Item=$,s.defaultProps={prefixCls:"x6"}})(R||(R={}));var le=o(87),me=o(88),ue=o(56),u=E.Item,Y=E.SubMenu,k=E.Divider,N=R.Item,G=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(){var t;Object(C.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return t=c.call.apply(c,[this].concat(r)),t.onMenuClick=function(l){z.b.success("".concat(l," clicked"),10)},t.onMenuItemClick=function(){t.onMenuClick("undo")},t}return Object(g.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{style:{height:240,padding:32}},e.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},e.a.createElement(R,{extra:e.a.createElement("div",null,"Extra Component")},e.a.createElement(N,{text:"File"},e.a.createElement(E,null,e.a.createElement(u,{hotkey:"Cmd+N"},"New File"),e.a.createElement(u,{hotkey:"Cmd+Shift+N"},"New Window"),e.a.createElement(k,null),e.a.createElement(u,{hotkey:"Cmd+O"},"Open..."),e.a.createElement(u,null,"Open Workspace..."),e.a.createElement(k,null),e.a.createElement(u,{hotkey:"Cmd+S"},"Save"),e.a.createElement(u,{hotkey:"Cmd+Shift+S"},"Save As..."),e.a.createElement(u,{hotkey:"Cmd+Alt+S"},"Save All"))),e.a.createElement(N,{text:"Edit"},e.a.createElement(E,null,e.a.createElement(u,{name:"undo",hotkey:"Cmd+Z"},"Undo"),e.a.createElement(u,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),e.a.createElement(k,null),e.a.createElement(u,{name:"cut",hotkey:"Cmd+X"},"Cut"),e.a.createElement(u,{name:"copy",hotkey:"Cmd+C"},"Copy"),e.a.createElement(u,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),e.a.createElement(k,null),e.a.createElement(u,{name:"find",hotkey:"Cmd+F"},"Find"),e.a.createElement(u,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),e.a.createElement(N,{text:"View"},e.a.createElement(E,null,e.a.createElement(u,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),e.a.createElement(u,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),e.a.createElement(k,null),e.a.createElement(Y,{text:"Appearance"},e.a.createElement(u,{name:"side-bar"},"Show Side Bar"),e.a.createElement(u,{name:"status-bar"},"Show Status Bar"),e.a.createElement(u,{name:"activity-bar"},"Show Activity Bar"),e.a.createElement(u,{name:"editor-area"},"Show Editor Area"),e.a.createElement(u,{name:"show-panel"},"Show Panel")),e.a.createElement(k,null),e.a.createElement(u,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),e.a.createElement(u,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),e.a.createElement(N,{text:"Help"},e.a.createElement(E,null,e.a.createElement(u,{name:"welcome"},"Welcome"),e.a.createElement(u,{name:"documention"},"Documention"),e.a.createElement(u,{name:"about"},"Aoubt"))))))}}]),a}(e.a.Component),K=o(146),Q=o(141),q=o(147),ee=o(148),ne=o(149),S=o(144),te=o(66),ae=o(67),de=o(120),X=o(119),re=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},oe=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(){return Object(C.a)(this,a),c.apply(this,arguments)}return Object(g.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(K.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(Q.a,{component:re}))),e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(X.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(q.a,null))),e.a.createElement(S.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(ae.getParameters)(X.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(ee.a,null)))),e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 StackBlitz \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement(ne.a,{onClick:function(){te.a.openProject(X.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),a}(e.a.Component),ie=o(145),se=o(72),pe=o(126),A=function(s){Object(x.a)(a,s);var c=Object(y.a)(a);function a(t){var n;return Object(C.a)(this,a),n=c.call(this,t),n.refContainer=function(r){n.container=r},a.restoreIframeSize(),n}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){n.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var r=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(r+16,"px"),n.style.border="0",n.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(oe,null),this.props.children)}}]),a}(e.a.Component);(function(s){var c=window.location.pathname,a="x6-iframe-size";function t(){var i=localStorage.getItem(a),l;if(i)try{l=JSON.parse(i)}catch(m){}else l={};return l}function n(){var i=window.frameElement;if(i){var l=i.style,m={width:l.width,height:l.height},d=t();d[c]=m,localStorage.setItem(a,JSON.stringify(d))}}s.saveIframeSize=n;function r(){var i=window.frameElement;if(i){var l=t(),m=l[c];m&&(i.style.width=m.width||"100%",i.style.height=m.height||"auto")}}s.restoreIframeSize=r})(A||(A={}));var he=o(127),ce=function(c){var a=c.children;return e.a.createElement(ie.a.ErrorBoundary,null,e.a.createElement(se.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(A,null,a))};T.a.render(e.a.createElement(ce,null,e.a.createElement(G,null)),document.getElementById("root"))},82:function(b,f,o){b.exports=o(138)},87:function(b,f,o){},88:function(b,f,o){}},[[82,1,2]]]);
