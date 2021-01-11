(this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.menubar.basic"]||[]).push([[0],{115:function(b,f,o){"use strict";o.r(f),o.d(f,"host",function(){return U}),o.d(f,"getCodeSandboxParams",function(){return n}),o.d(f,"getStackblitzPrefillConfig",function(){return P});const U="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/menubar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`}}}},116:function(b,f,o){},120:function(b,f,o){},132:function(b,f,o){"use strict";o.r(f);var U=o(0),n=o.n(U),P=o(4),T=o.n(P),C=o(8),y=o(9),g=o(11),x=o(10),H=o(137),M=o(19),F=o(3),_=o.n(F),w=n.a.createContext({}),O=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(e){t.triggerHandler(e)},t}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.hotkey;e&&this.props.context.registerHotkey(e,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var e=this.props.hotkey;e&&this.props.context.unregisterHotkey(e,this.onHotkey)}},{key:"triggerHandler",value:function(e){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,e),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return n.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(n.a.PureComponent);(function(s){function c(t,e){var r,i=t.className,l=t.disabled,u=t.active,d=t.hidden,p=t.context.prefixCls,v="".concat(p,"-item");return{className:_()(v,e,(r={},Object(M.a)(r,"".concat(v,"-active"),u),Object(M.a)(r,"".concat(v,"-hidden"),d),Object(M.a)(r,"".concat(v,"-disabled"),l),r),i)}}s.getProps=c;function a(t,e,r,i){var l=t.icon,u=t.text,d=t.hotkey,p=t.children,v=t.context.prefixCls,h="".concat(v,"-item");return n.a.createElement(n.a.Fragment,null,n.a.createElement("button",{className:"".concat(h,"-button"),onClick:e},l&&n.a.isValidElement(l)&&n.a.createElement("span",{className:"".concat(h,"-icon")},l),n.a.createElement("span",{className:"".concat(h,"-text")},u||p),d&&n.a.createElement("span",{className:"".concat(h,"-hotkey")},d),r),i)}s.getContent=a})(O||(O={}));var z=function(c){return n.a.createElement(w.Consumer,null,function(a){return n.a.createElement(O,Object.assign({context:a},c))})},B=function(){return n.a.createElement(w.Consumer,null,function(c){var a=c.prefixCls;return n.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},Z=function(s,c){var a={};for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&c.indexOf(t)<0&&(a[t]=s[t]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var e=0,t=Object.getOwnPropertySymbols(s);e<t.length;e++)c.indexOf(t[e])<0&&Object.prototype.propertyIsEnumerable.call(s,t[e])&&(a[t[e]]=s[t[e]]);return a},W=function(c){var a=c.hotkey,t=c.children,e=Z(c,["hotkey","children"]);return n.a.createElement(w.Consumer,null,function(r){var i=r.prefixCls,l=O.getProps(Object.assign({context:r},c),"".concat(i,"-submenu"));return n.a.createElement("div",Object.assign({},l),O.getContent(Object.assign({context:r},e),null,n.a.createElement("span",{className:"".concat(i,"-submenu-arrow")}),n.a.createElement("div",{className:"".concat(i,"-submenu-menu")},t)))})},E=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.onClick=function(e,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(e)},t.registerHotkey=function(e,r){t.props.registerHotkey&&t.props.registerHotkey(e,r)},t.unregisterHotkey=function(e,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(e,r)},t}return Object(y.a)(a,[{key:"render",value:function(){var e=this.props,r=e.prefixCls,i=e.className,l=e.children,u=e.hasIcon,d="".concat(r,"-menu"),p=w.Provider,v={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return n.a.createElement("div",{className:_()(d,Object(M.a)({},"".concat(d,"-has-icon"),u),i)},n.a.createElement(p,{value:v},l))}}]),a}(n.a.PureComponent);(function(s){s.Item=z,s.Divider=B,s.SubMenu=W,s.defaultProps={prefixCls:"x6",stopPropagation:!1}})(E||(E={}));var V=o(36),j=o.n(V),L=n.a.createContext({}),D=new WeakMap,J=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(t){var e;return Object(C.a)(this,a),e=c.call(this,t),e.onDocumentClick=function(){e.deactive()},e.onClick=function(r){e.props.context.activeMenubar(),e.removeDeactive(r.currentTarget.parentElement),e.active()},e.onMouseEnter=function(r){if(e.props.context.menubarActived&&!e.state.active&&!e.isPrevMenuHiddening(r)){var i=r.currentTarget,l=i.parentElement.childNodes;l.forEach(function(u){u===i?e.removeDeactive(u):e.callDeactive(u)}),e.active()}},e.onMouseLeave=function(r){var i=r.relatedTarget,l=r.currentTarget;if(e.props.context.menubarActived&&e.state.active){var u=l.parentElement.childNodes,d=!1;if(i!==window)for(var p=0,v=u.length;p<v;p+=1){var h=u[p];if(h===i||h.contains(i)){d=!0;break}}d?e.deactive():e.cacheDeactive(l)}},e.active=function(){e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=j()(document.documentElement,"click",e.onDocumentClick).remove)},e.deactive=function(){e.setState({active:!1}),e.removeDocClickEvent&&(e.removeDocClickEvent(),e.removeDocClickEvent=null)},e.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),e.state={active:!1},e}return Object(y.a)(a,[{key:"isPrevMenuHiddening",value:function(e){var r=e.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var i=e.currentTarget,l=i.parentElement.childNodes,u=0,d=l.length;u<d;u+=1){var p=l[u],v=p.querySelector(".".concat(this.popupClassName));if(v.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(e){D.set(e,this.deactive)}},{key:"callDeactive",value:function(e){D.has(e)&&(D.get(e)(),D.delete(e))}},{key:"removeDeactive",value:function(e){D.delete(e)}},{key:"render",value:function(){var e,r=this.props,i=r.text,l=r.children,u=r.hidden,d=this.props.context,p=d.prefixCls,v=d.menubarActived,h=v&&this.state.active,I="".concat(p,"-item");return n.a.createElement("div",{className:_()(I,(e={},Object(M.a)(e,"".concat(I,"-hidden"),u),Object(M.a)(e,"".concat(I,"-hover"),v),Object(M.a)(e,"".concat(I,"-active"),h),e)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},n.a.createElement("div",{className:_()("".concat(I,"-text"),Object(M.a)({},"".concat(I,"-text-active"),h)),onClick:this.onClick},i),n.a.createElement("div",{className:this.popupClassName},l))}}]),a}(n.a.PureComponent),$=function(c){return n.a.createElement(L.Consumer,null,function(a){return n.a.createElement(J,Object.assign({context:a},c))})},R=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(){var t;return Object(C.a)(this,a),t=c.apply(this,arguments),t.state={active:!1},t.onDocumentClick=function(){t.setState({active:!1}),t.unbindDocEvent()},t.activeMenubar=function(){t.setState({active:!0}),t.removeDocClickEvent||(t.removeDocClickEvent=j()(document.documentElement,"click",t.onDocumentClick).remove)},t}return Object(y.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var e=this.props,r=e.prefixCls,i=e.className,l=e.children,u=e.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active};return n.a.createElement("div",{className:_()(d,i)},n.a.createElement("div",{className:"".concat(d,"-content")},n.a.createElement("div",{className:"".concat(d,"-content-inner")},n.a.createElement(L.Provider,{value:p},l)),u&&n.a.createElement("div",{className:"".concat(d,"-content-extras")},u)))}}]),a}(n.a.PureComponent);(function(s){s.Item=$,s.defaultProps={prefixCls:"x6"}})(R||(R={}));var ce=o(83),le=o(84),ue=o(54),m=E.Item,Y=E.SubMenu,k=E.Divider,N=R.Item,G=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(){var t;Object(C.a)(this,a);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=c.call.apply(c,[this].concat(r)),t.onMenuClick=function(l){H.b.success("".concat(l," clicked"),10)},t.onMenuItemClick=function(){t.onMenuClick("undo")},t}return Object(y.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{style:{height:240,padding:32}},n.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},n.a.createElement(R,{extra:n.a.createElement("div",null,"Extra Component")},n.a.createElement(N,{text:"File"},n.a.createElement(E,null,n.a.createElement(m,{hotkey:"Cmd+N"},"New File"),n.a.createElement(m,{hotkey:"Cmd+Shift+N"},"New Window"),n.a.createElement(k,null),n.a.createElement(m,{hotkey:"Cmd+O"},"Open..."),n.a.createElement(m,null,"Open Workspace..."),n.a.createElement(k,null),n.a.createElement(m,{hotkey:"Cmd+S"},"Save"),n.a.createElement(m,{hotkey:"Cmd+Shift+S"},"Save As..."),n.a.createElement(m,{hotkey:"Cmd+Alt+S"},"Save All"))),n.a.createElement(N,{text:"Edit"},n.a.createElement(E,null,n.a.createElement(m,{name:"undo",hotkey:"Cmd+Z"},"Undo"),n.a.createElement(m,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),n.a.createElement(k,null),n.a.createElement(m,{name:"cut",hotkey:"Cmd+X"},"Cut"),n.a.createElement(m,{name:"copy",hotkey:"Cmd+C"},"Copy"),n.a.createElement(m,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),n.a.createElement(k,null),n.a.createElement(m,{name:"find",hotkey:"Cmd+F"},"Find"),n.a.createElement(m,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),n.a.createElement(N,{text:"View"},n.a.createElement(E,null,n.a.createElement(m,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),n.a.createElement(m,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),n.a.createElement(k,null),n.a.createElement(Y,{text:"Appearance"},n.a.createElement(m,{name:"side-bar"},"Show Side Bar"),n.a.createElement(m,{name:"status-bar"},"Show Status Bar"),n.a.createElement(m,{name:"activity-bar"},"Show Activity Bar"),n.a.createElement(m,{name:"editor-area"},"Show Editor Area"),n.a.createElement(m,{name:"show-panel"},"Show Panel")),n.a.createElement(k,null),n.a.createElement(m,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),n.a.createElement(m,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),n.a.createElement(N,{text:"Help"},n.a.createElement(E,null,n.a.createElement(m,{name:"welcome"},"Welcome"),n.a.createElement(m,{name:"documention"},"Documention"),n.a.createElement(m,{name:"about"},"Aoubt"))))))}}]),a}(n.a.Component),K=o(140),Q=o(135),q=o(141),ee=o(142),ne=o(143),S=o(138),te=o(65),ae=o(66),me=o(116),X=o(115),re=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},oe=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(){return Object(C.a)(this,a),c.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(K.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(Q.a,{component:re}))),n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(X.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(q.a,null))),n.a.createElement(S.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(ae.getParameters)(X.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(ee.a,null)))),n.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 StackBlitz \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement(ne.a,{onClick:function(){te.a.openProject(X.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),a}(n.a.Component),ie=o(139),de=o(120),A=function(s){Object(g.a)(a,s);var c=Object(x.a)(a);function a(t){var e;return Object(C.a)(this,a),e=c.call(this,t),e.refContainer=function(r){e.container=r},a.restoreIframeSize(),e}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){e.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var r=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(r+16,"px"),e.style.border="0",e.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(oe,null),this.props.children)}}]),a}(n.a.Component);(function(s){var c=window.location.pathname,a="x6-iframe-size";function t(){var i=localStorage.getItem(a),l;if(i)try{l=JSON.parse(i)}catch(u){}else l={};return l}function e(){var i=window.frameElement;if(i){var l=i.style,u={width:l.width,height:l.height},d=t();d[c]=u,localStorage.setItem(a,JSON.stringify(d))}}s.saveIframeSize=e;function r(){var i=window.frameElement;if(i){var l=t(),u=l[c];u&&(i.style.width=u.width||"100%",i.style.height=u.height||"auto")}}s.restoreIframeSize=r})(A||(A={}));var pe=o(121),se=function(c){var a=c.children;return n.a.createElement(ie.a.ErrorBoundary,null,n.a.createElement(A,null,a))};T.a.render(n.a.createElement(se,null,n.a.createElement(G,null)),document.getElementById("root"))},78:function(b,f,o){b.exports=o(132)},83:function(b,f,o){},84:function(b,f,o){}},[[78,1,2]]]);
