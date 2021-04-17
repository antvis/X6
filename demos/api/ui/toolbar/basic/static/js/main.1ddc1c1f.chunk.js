(this["webpackJsonp@antv/x6-sites-demos-api.ui.toolbar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.toolbar.basic"]||[]).push([[0],{102:function(x,C,l){},104:function(x,C,l){"use strict";l.r(C);var z=l(0),e=l.n(z),B=l(16),q=l.n(B),v=l(20),U=l(21),I=l(24),O=l(23),ee=l(81),R=l(25),ne=l(4),k=l.n(ne),N=l(109),Ue=l(90),j=e.a.createContext({}),Z=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){var t;return Object(v.a)(this,a),t=m.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(n){t.triggerHandler(n)},t}return Object(U.a)(a,[{key:"componentDidMount",value:function(){var n=this.props.hotkey;n&&this.props.context.registerHotkey(n,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var n=this.props.hotkey;n&&this.props.context.unregisterHotkey(n,this.onHotkey)}},{key:"triggerHandler",value:function(n){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,n),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return e.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(e.a.PureComponent);(function(r){function m(t,n){var i,d=t.className,s=t.disabled,u=t.active,p=t.hidden,g=t.context.prefixCls,_="".concat(g,"-item");return{className:k()(_,n,(i={},Object(R.a)(i,"".concat(_,"-active"),u),Object(R.a)(i,"".concat(_,"-hidden"),p),Object(R.a)(i,"".concat(_,"-disabled"),s),i),d)}}r.getProps=m;function a(t,n,i,d){var s=t.icon,u=t.text,p=t.hotkey,g=t.children,_=t.context.prefixCls,f="".concat(_,"-item");return e.a.createElement(e.a.Fragment,null,e.a.createElement("button",{type:"button",className:"".concat(f,"-button"),onClick:n},s&&e.a.isValidElement(s)&&e.a.createElement("span",{className:"".concat(f,"-icon")},s),e.a.createElement("span",{className:"".concat(f,"-text")},u||g),p&&e.a.createElement("span",{className:"".concat(f,"-hotkey")},p),i),d)}r.getContent=a})(Z||(Z={}));var te=function(m){return e.a.createElement(j.Consumer,null,function(a){return e.a.createElement(Z,Object.assign({context:a},m))})},oe=function(){return e.a.createElement(j.Consumer,null,function(m){var a=m.prefixCls;return e.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},ae=function(r,m){var a={};for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&m.indexOf(t)<0&&(a[t]=r[t]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,t=Object.getOwnPropertySymbols(r);n<t.length;n++)m.indexOf(t[n])<0&&Object.prototype.propertyIsEnumerable.call(r,t[n])&&(a[t[n]]=r[t[n]]);return a},ie=function(m){var a=m.hotkey,t=m.children,n=ae(m,["hotkey","children"]);return e.a.createElement(j.Consumer,null,function(i){var d=i.prefixCls,s=Z.getProps(Object.assign({context:i},m),"".concat(d,"-submenu"));return e.a.createElement("div",Object.assign({},s),Z.getContent(Object.assign({context:i},n),null,e.a.createElement("span",{className:"".concat(d,"-submenu-arrow")}),e.a.createElement("div",{className:"".concat(d,"-submenu-menu")},t)))})},P=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){var t;return Object(v.a)(this,a),t=m.apply(this,arguments),t.onClick=function(n,i){t.props.stopPropagation&&i!=null&&i.stopPropagation(),t.props.onClick&&t.props.onClick(n)},t.registerHotkey=function(n,i){t.props.registerHotkey&&t.props.registerHotkey(n,i)},t.unregisterHotkey=function(n,i){t.props.unregisterHotkey&&t.props.unregisterHotkey(n,i)},t}return Object(U.a)(a,[{key:"render",value:function(){var n=this.props,i=n.prefixCls,d=n.className,s=n.children,u=n.hasIcon,p="".concat(i,"-menu"),g=j.Provider,_={prefixCls:p,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return e.a.createElement("div",{className:k()(p,Object(R.a)({},"".concat(p,"-has-icon"),u),d)},e.a.createElement(g,{value:_},s))}}]),a}(e.a.PureComponent);(function(r){r.Item=te,r.Divider=oe,r.SubMenu=ie,r.defaultProps={prefixCls:"x6",stopPropagation:!1}})(P||(P={}));var le=l(79),H=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){return Object(v.a)(this,a),m.apply(this,arguments)}return Object(U.a)(a,[{key:"render",value:function(){var n=this.props,i=n.children,d=n.trigger,s=n.disabled,u="".concat(this.props.prefixCls,"-dropdown"),p=e.a.Children.only(i),g=e.a.cloneElement(p,{className:k()(i.props.className,"".concat(u,"-trigger")),disabled:s}),_=s?[]:Array.isArray(d)?d:[d],f=!1;_&&_.indexOf("contextMenu")!==-1&&(f=!0);var h=e.a.Children.only(this.props.overlay),S=e.a.createElement("div",{className:"".concat(u,"-overlay")},h);return e.a.createElement(le.a,Object.assign({},this.props,{prefixCls:u,overlay:S,alignPoint:f,trigger:_}),g)}}]),a}(e.a.Component);(function(r){r.defaultProps={trigger:"hover",prefixCls:"x6",mouseEnterDelay:.15,mouseLeaveDelay:.1,placement:"bottomLeft"}})(H||(H={}));var V=e.a.createContext({}),re=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){var t;return Object(v.a)(this,a),t=m.apply(this,arguments),t.handleClick=function(){t.processClick()},t.handleDropdownItemClick=function(n){t.processClick(n,!1)},t}return Object(U.a)(a,[{key:"processClick",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:this.props.name,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:this.props.dropdown;!this.props.disabled&&!i&&(n&&this.props.context.onClick(n),this.props.onClick&&this.props.onClick(n))}},{key:"renderButton",value:function(){var n,i=this.props,d=i.className,s=i.hidden,u=i.disabled,p=i.active,g=i.icon,_=i.text,f=i.dropdown,h=i.dropdownArrow,S=i.tooltip,Re=i.tooltipProps,$=i.tooltipAsTitle,Y=i.children,ve=this.props.context.prefixCls,b="".concat(ve,"-item"),K={onClick:this.handleClick,className:k()(b,(n={},Object(R.a)(n,"".concat(b,"-hidden"),s),Object(R.a)(n,"".concat(b,"-active"),p),Object(R.a)(n,"".concat(b,"-disabled"),u),Object(R.a)(n,"".concat(b,"-dropdown"),f),n),d)};S&&$&&(K.title=S);var Q=e.a.createElement("button",Object.assign({type:"button"},K),g&&e.a.isValidElement(g)&&e.a.createElement("span",{className:"".concat(b,"-icon")},g),(_||Y)&&e.a.createElement("span",{className:"".concat(b,"-text")},_||Y),f&&h&&e.a.createElement("span",{className:"".concat(b,"-dropdown-arrow")}));return S&&!$&&!u?e.a.createElement(N.a,Object.assign({title:S,placement:"bottom",mouseEnterDelay:0,mouseLeaveDelay:0},Re),Q):Q}},{key:"render",value:function(){var n=this.props,i=n.dropdown,d=n.dropdownProps,s=n.disabled,u=this.renderButton();if(i!=null&&!s){var p=e.a.createElement("div",null,i.type===P?e.a.cloneElement(i,{onClick:this.handleDropdownItemClick}):i),g=Object.assign(Object.assign({trigger:["click"]},d),{disabled:s,overlay:p});return e.a.createElement(H,Object.assign({},g),u)}return u}}]),a}(e.a.PureComponent),W=function(m){return e.a.createElement(V.Consumer,null,function(a){return e.a.createElement(re,Object.assign({context:a},m))})};W.defaultProps={dropdownArrow:!0};var me=function(m){var a=m.children,t=m.className;return e.a.createElement(V.Consumer,null,function(n){var i=n.prefixCls;return e.a.createElement("div",{className:k()("".concat(i,"-group"),t)},a)})},E=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){var t;return Object(v.a)(this,a),t=m.apply(this,arguments),t.onClick=function(n,i){t.props.onClick&&t.props.onClick(n,i)},t}return Object(U.a)(a,[{key:"render",value:function(){var n,i=this.props,d=i.prefixCls,s=i.className,u=i.children,p=i.extra,g=i.size,_=i.align,f=i.hoverEffect,h="".concat(d,"-toolbar");return e.a.createElement("div",{className:k()(h,s,(n={},Object(R.a)(n,"".concat(h,"-").concat(g),g),Object(R.a)(n,"".concat(h,"-align-right"),_==="right"),Object(R.a)(n,"".concat(h,"-hover-effect"),f),n))},e.a.createElement("div",{className:"".concat(h,"-content")},e.a.createElement("div",{className:"".concat(h,"-content-inner")},e.a.createElement(V.Provider,{value:{prefixCls:h,onClick:this.onClick}},u)),p&&e.a.createElement("div",{className:"".concat(h,"-content-extras")},p)))}}]),a}(e.a.PureComponent);(function(r){r.Item=W,r.Group=me,r.defaultProps={prefixCls:"x6",hoverEffect:!1}})(E||(E={}));var Ie=l(88),Oe=l(89),be=l(66),y=l(111),T=l(112),D=l(113),A=l(114),M=l(115),G=l(116),w=l(117),L=l(118),X=l(119),o=E.Item,c=E.Group,de=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){var t;Object(v.a)(this,a);for(var n=arguments.length,i=new Array(n),d=0;d<n;d++)i[d]=arguments[d];return t=m.call.apply(m,[this].concat(i)),t.onClick=function(s){ee.b.success("".concat(s," clicked"),10)},t.onItemClick=function(){t.onClick("undo")},t}return Object(U.a)(a,[{key:"renderZoomDropdown",value:function(){var n=P.Item,i=P.Divider;return e.a.createElement(P,null,e.a.createElement(n,{name:"resetView",hotkey:"Cmd+H"},"Reset View"),e.a.createElement(n,{name:"fitWindow",hotkey:"Cmd+Shift+H"},"Fit Window"),e.a.createElement(i,null),e.a.createElement(n,{name:"25"},"25%"),e.a.createElement(n,{name:"50"},"50%"),e.a.createElement(n,{name:"75"},"75%"),e.a.createElement(n,{name:"100"},"100%"),e.a.createElement(n,{name:"125"},"125%"),e.a.createElement(n,{name:"150"},"150%"),e.a.createElement(n,{name:"200"},"200%"),e.a.createElement(n,{name:"300"},"300%"),e.a.createElement(n,{name:"400"},"400%"))}},{key:"render",value:function(){return e.a.createElement("div",{style:{padding:24}},e.a.createElement("div",{style:{background:"#f5f5f5",paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoom",tooltipAsTitle:!0,tooltip:"Zoom (Alt+Mousewheel)",dropdown:this.renderZoomDropdown()},e.a.createElement("span",{style:{display:"inline-block",width:40,textAlign:"right"}},"100%"))),e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{size:"big",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{size:"small",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:e.a.createElement(y.a,null)}),e.a.createElement(o,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:e.a.createElement(T.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:e.a.createElement(D.a,null)}),e.a.createElement(o,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:e.a.createElement(A.a,null)})),e.a.createElement(c,null,e.a.createElement(o,{name:"delete",icon:e.a.createElement(M.a,null),disabled:!0,tooltip:"Delete (Delete)"})),e.a.createElement(c,null,e.a.createElement(o,{name:"bold",icon:e.a.createElement(G.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),e.a.createElement(o,{name:"italic",icon:e.a.createElement(w.a,null),tooltip:"Italic (Cmd + I)"}),e.a.createElement(o,{name:"strikethrough",icon:e.a.createElement(L.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),e.a.createElement(o,{name:"underline",icon:e.a.createElement(X.a,null),tooltip:"Underline (Cmd + U)"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{size:"big",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})))),e.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},e.a.createElement(E,{size:"small",onClick:this.onClick,extra:e.a.createElement("span",null,"Extra Component")},e.a.createElement(c,null,e.a.createElement(o,{name:"alignLeft",icon:"align-left",text:"Align Left"}),e.a.createElement(o,{name:"alignCenter",icon:"align-center",text:"Align Center"}),e.a.createElement(o,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))))}}]),a}(e.a.Component),ce=l(120),se=l(108),ue=l(121),pe=l(122),_e=l(75),xe=l(98),J=l(99),Ee=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},ge=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(){return Object(v.a)(this,a),m.apply(this,arguments)}return Object(U.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(ce.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(se.a,{component:Ee}))),e.a.createElement(N.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(J.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(ue.a,null))),e.a.createElement(N.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(_e.getParameters)(J.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(pe.a,null)))))}}]),a}(e.a.Component),fe=l(110),he=l(76),ke=l(102),F=function(r){Object(I.a)(a,r);var m=Object(O.a)(a);function a(t){var n;return Object(v.a)(this,a),n=m.call(this,t),n.refContainer=function(i){n.container=i},a.restoreIframeSize(),n}return Object(U.a)(a,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){n.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var d=document.getElementById("loading");d&&d.parentNode&&d.parentNode.removeChild(d)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var i=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(i+16,"px"),n.style.border="0",n.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(ge,null),this.props.children)}}]),a}(e.a.Component);(function(r){var m=window.location.pathname,a="x6-iframe-size";function t(){var d=localStorage.getItem(a),s;if(d)try{s=JSON.parse(d)}catch(u){}else s={};return s}function n(){var d=window.frameElement;if(d){var s=d.style,u={width:s.width,height:s.height},p=t();p[m]=u,localStorage.setItem(a,JSON.stringify(p))}}r.saveIframeSize=n;function i(){var d=window.frameElement;if(d){var s=t(),u=s[m];u&&(d.style.width=u.width||"100%",d.style.height=u.height||"auto")}}r.restoreIframeSize=i})(F||(F={}));var Pe=l(103),Ce=function(m){var a=m.children;return e.a.createElement(fe.a.ErrorBoundary,null,e.a.createElement(he.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(F,null,a))};q.a.render(e.a.createElement(Ce,null,e.a.createElement(de,null)),document.getElementById("root"))},83:function(x,C,l){x.exports=l(104)},88:function(x,C,l){},89:function(x,C,l){},98:function(x,C,l){},99:function(x,C,l){"use strict";l.r(C),l.d(C,"host",function(){return z}),l.d(C,"getCodeSandboxParams",function(){return e}),l.d(C,"getStackblitzPrefillConfig",function(){return B});const z="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/toolbar/basic";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // eslint-disable-line
const Group = Toolbar.Group // eslint-disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // eslint-disable-line
    const Divider = Menu.Divider // eslint-disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
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
`,isBinary:!1}}}}function B(){return{title:"api/ui/toolbar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // eslint-disable-line
const Group = Toolbar.Group // eslint-disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // eslint-disable-line
    const Divider = Menu.Divider // eslint-disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
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
`}}}}},[[83,1,2]]]);
