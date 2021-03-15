(this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]||[]).push([[0],{118:function(b,v,i){"use strict";i.r(v),i.d(v,"host",function(){return U}),i.d(v,"getCodeSandboxParams",function(){return e}),i.d(v,"getStackblitzPrefillConfig",function(){return P});const U="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/menubar/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`}}}},119:function(b,v,i){},125:function(b,v,i){},137:function(b,v,i){"use strict";i.r(v);var U=i(0),e=i.n(U),P=i(5),T=i.n(P),C=i(9),x=i(10),g=i(12),y=i(11),H=i(142),M=i(20),z=i(3),_=i.n(z),S=e.a.createContext({}),O=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(n){t.triggerHandler(n)},t}return Object(x.a)(a,[{key:"componentDidMount",value:function(){var n=this.props.hotkey;n&&this.props.context.registerHotkey(n,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var n=this.props.hotkey;n&&this.props.context.unregisterHotkey(n,this.onHotkey)}},{key:"triggerHandler",value:function(n){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,n),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(e.a.PureComponent);(function(s){function c(t,n){var r,o=t.className,l=t.disabled,m=t.active,d=t.hidden,p=t.context.prefixCls,h="".concat(p,"-item");return{className:_()(h,n,(r={},Object(M.a)(r,"".concat(h,"-active"),m),Object(M.a)(r,"".concat(h,"-hidden"),d),Object(M.a)(r,"".concat(h,"-disabled"),l),r),o)}}s.getProps=c;function a(t,n,r,o){var l=t.icon,m=t.text,d=t.hotkey,p=t.children,h=t.context.prefixCls,f="".concat(h,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{className:"".concat(f,"-button"),onClick:n},l&&e.a.isValidElement(l)&&e.a.createElement("span",{className:"".concat(f,"-icon")},l),e.a.createElement("span",{className:"".concat(f,"-text")},m||p),d&&e.a.createElement("span",{className:"".concat(f,"-hotkey")},d),r),o)}s.getContent=a})(O||(O={}));var F=function(c){return e.a.createElement(S.Consumer,null,function(a){return e.a.createElement(O,Object.assign({context:a},c))})},B=function(){return e.a.createElement(S.Consumer,null,function(c){var a=c.prefixCls;return e.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},Z=function(s,c){var a={};for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&c.indexOf(t)<0&&(a[t]=s[t]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,t=Object.getOwnPropertySymbols(s);n<t.length;n++)c.indexOf(t[n])<0&&Object.prototype.propertyIsEnumerable.call(s,t[n])&&(a[t[n]]=s[t[n]]);return a},W=function(c){var a=c.hotkey,t=c.children,n=Z(c,["hotkey","children"]);return e.a.createElement(S.Consumer,null,function(r){var o=r.prefixCls,l=O.getProps(Object.assign({context:r},c),"".concat(o,"-submenu"));return e.a.createElement("div",Object.assign({},l),O.getContent(Object.assign({context:r},n),null,e.a.createElement("span",{className:"".concat(o,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(o,"-submenu-menu")},t)))})},E=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onClick=function(n,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(n)},t.registerHotkey=function(n,r){t.props.registerHotkey&&t.props.registerHotkey(n,r)},t.unregisterHotkey=function(n,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(n,r)},t}return Object(x.a)(a,[{key:"render",value:function(){var n=this.props,r=n.prefixCls,o=n.className,l=n.children,m=n.hasIcon,d="".concat(r,"-menu"),p=S.Provider,h={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:_()(d,Object(M.a)({},"".concat(d,"-has-icon"),m),o)},e.a.createElement(p,{value:h},l))}}]),a}(e.a.PureComponent);(function(s){s.Item=F,s.Divider=B,s.SubMenu=W,s.defaultProps={prefixCls:"x6",stopPropagation:!1}})(E||(E={}));var V=i(38),A=i.n(V),j=e.a.createContext({}),D=new WeakMap,J=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(t){var n;return Object(C.a)(this,a),n=c.call(this,t),n.onDocumentClick=function(){n.deactive()},n.onClick=function(r){n.props.context.activeMenubar(),n.removeDeactive(r.currentTarget.parentElement),n.active()},n.onMouseEnter=function(r){if(n.props.context.menubarActived&&!n.state.active&&!n.isPrevMenuHiddening(r)){var o=r.currentTarget,l=o.parentElement.childNodes;l.forEach(function(m){m===o?n.removeDeactive(m):n.callDeactive(m)}),n.active()}},n.onMouseLeave=function(r){var o=r.relatedTarget,l=r.currentTarget;if(n.props.context.menubarActived&&n.state.active){var m=l.parentElement.childNodes,d=!1;if(o!==window)for(var p=0,h=m.length;p<h;p+=1){var f=m[p];if(f===o||f.contains(o)){d=!0;break}}d?n.deactive():n.cacheDeactive(l)}},n.active=function(){n.setState({active:!0}),n.removeDocClickEvent||(n.removeDocClickEvent=A()(document.documentElement,"click",n.onDocumentClick).remove)},n.deactive=function(){n.setState({active:!1}),n.removeDocClickEvent&&(n.removeDocClickEvent(),n.removeDocClickEvent=null)},n.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),n.state={active:!1},n}return Object(x.a)(a,[{key:"isPrevMenuHiddening",value:function(n){var r=n.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var o=n.currentTarget,l=o.parentElement.childNodes,m=0,d=l.length;m<d;m+=1){var p=l[m],h=p.querySelector(".".concat(this.popupClassName));if(h.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(n){D.set(n,this.deactive)}},{key:"callDeactive",value:function(n){D.has(n)&&(D.get(n)(),D.delete(n))}},{key:"removeDeactive",value:function(n){D.delete(n)}},{key:"render",value:function(){var n,r=this.props,o=r.text,l=r.children,m=r.hidden,d=this.props.context,p=d.prefixCls,h=d.menubarActived,f=h&&this.state.active,I="".concat(p,"-item");return e.a.createElement("div",{className:_()(I,(n={},Object(M.a)(n,"".concat(I,"-hidden"),m),Object(M.a)(n,"".concat(I,"-hover"),h),Object(M.a)(n,"".concat(I,"-active"),f),n)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},e.a.createElement("div",{className:_()("".concat(I,"-text"),Object(M.a)({},"".concat(I,"-text-active"),f)),onClick:this.onClick},o),e.a.createElement("div",{className:this.popupClassName},l))}}]),a}(e.a.PureComponent),$=function(c){return e.a.createElement(j.Consumer,null,function(a){return e.a.createElement(J,Object.assign({context:a},c))})},w=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.state={active:!1},t.onDocumentClick=function(){t.setState({active:!1}),t.unbindDocEvent()},t.activeMenubar=function(){t.setState({active:!0}),t.removeDocClickEvent||(t.removeDocClickEvent=A()(document.documentElement,"click",t.onDocumentClick).remove)},t}return Object(x.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var n=this.props,r=n.prefixCls,o=n.className,l=n.children,m=n.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active};return e.a.createElement("div",{className:_()(d,o)},e.a.createElement("div",{className:"".concat(d,"-content")},e.a.createElement("div",{className:"".concat(d,"-content-inner")},e.a.createElement(j.Provider,{value:p},l)),m&&e.a.createElement("div",{className:"".concat(d,"-content-extras")},m)))}}]),a}(e.a.PureComponent);(function(s){s.Item=$,s.defaultProps={prefixCls:"x6"}})(w||(w={}));var se=i(86),ce=i(87),le=i(56),u=E.Item,Y=E.SubMenu,k=E.Divider,R=w.Item,G=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(){var t;Object(C.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return t=c.call.apply(c,[this].concat(r)),t.onMenuClick=function(l){H.b.success("".concat(l," clicked"),10)},t.onMenuItemClick=function(){t.onMenuClick("undo")},t}return Object(x.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{style:{height:240,padding:32}},e.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},e.a.createElement(w,{extra:e.a.createElement("div",null,"Extra Component")},e.a.createElement(R,{text:"File"},e.a.createElement(E,null,e.a.createElement(u,{hotkey:"Cmd+N"},"New File"),e.a.createElement(u,{hotkey:"Cmd+Shift+N"},"New Window"),e.a.createElement(k,null),e.a.createElement(u,{hotkey:"Cmd+O"},"Open..."),e.a.createElement(u,null,"Open Workspace..."),e.a.createElement(k,null),e.a.createElement(u,{hotkey:"Cmd+S"},"Save"),e.a.createElement(u,{hotkey:"Cmd+Shift+S"},"Save As..."),e.a.createElement(u,{hotkey:"Cmd+Alt+S"},"Save All"))),e.a.createElement(R,{text:"Edit"},e.a.createElement(E,null,e.a.createElement(u,{name:"undo",hotkey:"Cmd+Z"},"Undo"),e.a.createElement(u,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),e.a.createElement(k,null),e.a.createElement(u,{name:"cut",hotkey:"Cmd+X"},"Cut"),e.a.createElement(u,{name:"copy",hotkey:"Cmd+C"},"Copy"),e.a.createElement(u,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),e.a.createElement(k,null),e.a.createElement(u,{name:"find",hotkey:"Cmd+F"},"Find"),e.a.createElement(u,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),e.a.createElement(R,{text:"View"},e.a.createElement(E,null,e.a.createElement(u,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),e.a.createElement(u,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),e.a.createElement(k,null),e.a.createElement(Y,{text:"Appearance"},e.a.createElement(u,{name:"side-bar"},"Show Side Bar"),e.a.createElement(u,{name:"status-bar"},"Show Status Bar"),e.a.createElement(u,{name:"activity-bar"},"Show Activity Bar"),e.a.createElement(u,{name:"editor-area"},"Show Editor Area"),e.a.createElement(u,{name:"show-panel"},"Show Panel")),e.a.createElement(k,null),e.a.createElement(u,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),e.a.createElement(u,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),e.a.createElement(R,{text:"Help"},e.a.createElement(E,null,e.a.createElement(u,{name:"welcome"},"Welcome"),e.a.createElement(u,{name:"documention"},"Documention"),e.a.createElement(u,{name:"about"},"Aoubt"))))))}}]),a}(e.a.Component),K=i(145),Q=i(140),q=i(146),ee=i(147),N=i(143),ne=i(66),me=i(119),L=i(118),te=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},ae=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(){return Object(C.a)(this,a),c.apply(this,arguments)}return Object(x.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(K.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(Q.a,{component:te}))),e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(L.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(q.a,null))),e.a.createElement(N.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(ne.getParameters)(L.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(ee.a,null)))))}}]),a}(e.a.Component),re=i(144),oe=i(71),ue=i(125),X=function(s){Object(g.a)(a,s);var c=Object(y.a)(a);function a(t){var n;return Object(C.a)(this,a),n=c.call(this,t),n.refContainer=function(r){n.container=r},a.restoreIframeSize(),n}return Object(x.a)(a,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){n.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var r=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(r+16,"px"),n.style.border="0",n.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(ae,null),this.props.children)}}]),a}(e.a.Component);(function(s){var c=window.location.pathname,a="x6-iframe-size";function t(){var o=localStorage.getItem(a),l;if(o)try{l=JSON.parse(o)}catch(m){}else l={};return l}function n(){var o=window.frameElement;if(o){var l=o.style,m={width:l.width,height:l.height},d=t();d[c]=m,localStorage.setItem(a,JSON.stringify(d))}}s.saveIframeSize=n;function r(){var o=window.frameElement;if(o){var l=t(),m=l[c];m&&(o.style.width=m.width||"100%",o.style.height=m.height||"auto")}}s.restoreIframeSize=r})(X||(X={}));var de=i(126),ie=function(c){var a=c.children;return e.a.createElement(re.a.ErrorBoundary,null,e.a.createElement(oe.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(X,null,a))};T.a.render(e.a.createElement(ie,null,e.a.createElement(G,null)),document.getElementById("root"))},81:function(b,v,i){b.exports=i(137)},86:function(b,v,i){},87:function(b,v,i){}},[[81,1,2]]]);
