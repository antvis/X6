(this["webpackJsonp@antv/x6-sites-demos-api.ui.auto-scrollbox.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.auto-scrollbox.basic"]||[]).push([[0],{112:function(y,v,s){},135:function(y,v,s){"use strict";s.r(v);var P=s(0),l=s.n(P),U=s(9),ae=s.n(U),b=s(5),w=s(7),M=s(13),X=s(12),_=s(51),N=s(35),ie=s(24),k=s.n(ie),le=s(4),R=s.n(le),C=!!(typeof window!="undefined"&&window.document&&window.document.createElement),Ie=typeof Worker!="undefined",je=C&&!!(window.addEventListener||window.attachEvent),We=C&&!!window.screen,Ye=!C,I={},V=["Webkit","ms","Moz","O"],K=C?document.createElement("div").style:{},se=/-(.)/g;function ce(o){return o.replace(se,function(a,t){return t.toUpperCase()})}function ue(o){for(var a=0;a<V.length;a+=1){var t=V[a]+o;if(t in K)return t}return null}function O(o){var a=ce(o);if(I[a]===void 0){var t=a.charAt(0).toUpperCase()+a.slice(1);I[a]=a in K?a:ue(t)}return I[a]}var Fe=function(){return!!O("animationName")},Be=function(){return!!O("transition")},de=function(){return!!O("transform")},he=function(){return!!O("perspective")},G=O("transform"),pe=O("backfaceVisibility"),me=function(){if(de()){var o=window?window.navigator.userAgent:"",a=/Safari\//.test(o)&&!/Chrome\//.test(o);return!a&&he()?function(t,e,n){t[G]="translate3d(".concat(e,"px,").concat(n,"px,0)"),t[pe]="hidden"}:function(t,e,n){t[G]="translate(".concat(e,"px,").concat(n,"px)")}}return function(t,e,n){t.left="".concat(e,"px"),t.top="".concat(n,"px")}}(),fe=function(){return!0},ve=function(){return!1};function D(o){return typeof o!="function"?o?fe:ve:o}function _e(o,a,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;e?(o.left="".concat(a,"px"),o.top="".concat(t,"px")):me(o,a,t)}function ge(o,a,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:window.setTimeout,n=arguments.length>4&&arguments[4]!==void 0?arguments[4]:window.clearTimeout,r,i=function c(){for(var h=arguments.length,u=new Array(h),d=0;d<h;d++)u[d]=arguments[d];c.reset();var p=function(){o.apply(t,u)};r=e(p,a)};return i.reset=function(){n(r)},i}var Ee=s(56),J;C&&(J=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0);function be(o,a){if((!C||a)&&!("addEventListener"in document))return!1;var t="on".concat(o),e=t in document;if(!e){var n=document.createElement("div");n.setAttribute(t,"return;"),e=typeof n[t]=="function"}return!e&&J&&o==="wheel"&&(e=document.implementation.hasFeature("Events.wheel","3.0")),e}var Z=10,$=40,Q=800,Se=new Ee.UAParser,we=Se.getResult(),xe=we.browser.name==="Firefox";function ye(o){var a=0,t=0,e=0,n=0;return"detail"in o&&(t=o.detail),"wheelDelta"in o&&(t=-o.wheelDelta/120),"wheelDeltaY"in o&&(t=-o.wheelDeltaY/120),"wheelDeltaX"in o&&(a=-o.wheelDeltaX/120),"axis"in o&&o.axis===o.HORIZONTAL_AXIS&&(a=t,t=0),e=a*Z,n=t*Z,"deltaY"in o&&(n=o.deltaY),"deltaX"in o&&(e=o.deltaX),(e||n)&&o.deltaMode&&(o.deltaMode===1?(e*=$,n*=$):(e*=Q,n*=Q)),e&&!a&&(a=e<1?-1:1),n&&!t&&(t=n<1?-1:1),{spinX:a,spinY:t,pixelX:e,pixelY:n}}function Ve(){return xe?"DOMMouseScroll":be("wheel")?"wheel":"mousewheel"}var q=0,ee=window.requestAnimationFrame||window.webkitRequestAnimationFrame,Te=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout).bind(window),A=ee?ee.bind(window):function(o){var a=Date.now(),t=Math.max(0,16-(a-q));return q=a+t,window.setTimeout(function(){o(Date.now())},t)},te=function o(a){var t=this;Object(b.a)(this,o),this.onWheel=function(e){var n=ye(e),r=n.pixelX,i=n.pixelY,c=t.deltaX+r,h=t.deltaY+i,u=t.shouldHandleScrollX(c,h),d=t.shouldHandleScrollY(h,c);if(!u&&!d)return;t.deltaX+=u?r:0,t.deltaY+=d?i:0;var p;(t.deltaX!==0||t.deltaY!==0)&&(t.stopPropagation()&&e.stopPropagation(),p=!0),p===!0&&t.animationFrameID==null&&(t.animationFrameID=A(t.didWheel))},this.didWheel=function(){t.animationFrameID=null,t.callback&&t.callback(t.deltaX,t.deltaY),t.deltaX=0,t.deltaY=0},this.callback=a.onWheel,this.stopPropagation=D(a.stopPropagation),this.shouldHandleScrollX=D(a.shouldHandleScrollX),this.shouldHandleScrollY=D(a.shouldHandleScrollY),this.deltaX=0,this.deltaY=0},j=function(){function o(a){var t=this;Object(b.a)(this,o),this.didTouchMove=function(){t.dragAnimationId=null,t.callback(t.deltaX,t.deltaY),t.accumulatedDeltaX+=t.deltaX,t.accumulatedDeltaY+=t.deltaY,t.deltaX=0,t.deltaY=0},this.track=function(){var e=Date.now(),n=e-t.lastFrameTimestamp,r=t.velocityX,i=t.velocityY,c=.8;n<o.TRACKER_TIMEOUT&&(c*=n/o.TRACKER_TIMEOUT),r===0&&i===0&&(c=1),t.velocityX=c*(o.TRACKER_TIMEOUT*t.accumulatedDeltaX/(1+n)),c<1&&(t.velocityX+=(1-c)*r),t.velocityY=c*(o.TRACKER_TIMEOUT*t.accumulatedDeltaY/(1+n)),c<1&&(t.velocityY+=(1-c)*i),t.accumulatedDeltaX=0,t.accumulatedDeltaY=0,t.lastFrameTimestamp=e},this.startAutoScroll=function(){t.autoScrollTimestamp=Date.now(),(t.deltaX>0||t.deltaY>0)&&t.didTouchMove(),t.track(),t.autoScroll()},this.autoScroll=function(){var e=Date.now()-t.autoScrollTimestamp,n=o.DECELERATION_AMPLITUDE*Math.exp(-e/o.DECELERATION_FACTOR),r=n*t.velocityX,i=n*t.velocityY;(Math.abs(r)<=5||!t.handleScrollX(r,i))&&(r=0),(Math.abs(i)<=5||!t.handleScrollY(i,r))&&(i=0),(r!==0||i!==0)&&(t.callback(r,i),A(t.autoScroll))},this.trackerId=null,this.dragAnimationId=null,this.deltaX=0,this.deltaY=0,this.lastTouchX=0,this.lastTouchY=0,this.velocityX=0,this.velocityY=0,this.accumulatedDeltaX=0,this.accumulatedDeltaY=0,this.lastFrameTimestamp=Date.now(),this.autoScrollTimestamp=Date.now(),this.callback=a.onTouchScroll,this.handleScrollX=D(a.shouldHandleScrollX),this.handleScrollY=D(a.shouldHandleScrollY),this.stopPropagation=D(a.stopPropagation)}return Object(w.a)(o,[{key:"onTouchStart",value:function(t){this.lastTouchX=t.touches[0].pageX,this.lastTouchY=t.touches[0].pageY,this.velocityX=0,this.velocityY=0,this.accumulatedDeltaX=0,this.accumulatedDeltaY=0,this.lastFrameTimestamp=Date.now(),this.trackerId!=null&&clearInterval(this.trackerId),this.trackerId=window.setInterval(this.track,o.TRACKER_TIMEOUT),this.stopPropagation()&&t.stopPropagation()}},{key:"onTouchEnd",value:function(t){this.onTouchCancel(t),A(this.startAutoScroll)}},{key:"onTouchCancel",value:function(t){this.trackerId!=null&&(clearInterval(this.trackerId),this.trackerId=null),this.stopPropagation()&&t.stopPropagation()}},{key:"onTouchMove",value:function(t){var e=t.touches[0].pageX,n=t.touches[0].pageY;this.deltaX=o.MOVE_AMPLITUDE*(this.lastTouchX-e),this.deltaY=o.MOVE_AMPLITUDE*(this.lastTouchY-n);var r=this.handleScrollX(this.deltaX,this.deltaY),i=this.handleScrollY(this.deltaY,this.deltaX);if(!r&&!i)return;r?this.lastTouchX=e:this.deltaX=0,i?this.lastTouchY=n:this.deltaY=0,t.preventDefault();var c=!1;(Math.abs(this.deltaX)>2||Math.abs(this.deltaY)>2)&&(this.stopPropagation()&&t.stopPropagation(),c=!0),c&&this.dragAnimationId==null&&(this.dragAnimationId=A(this.didTouchMove))}}]),o}();(function(o){o.MOVE_AMPLITUDE=1.6,o.DECELERATION_AMPLITUDE=1.6,o.DECELERATION_FACTOR=325,o.TRACKER_TIMEOUT=100})(j||(j={}));var Me=s(48),ne=s.n(Me),oe=function(){function o(a){var t=this;Object(b.a)(this,o),this.onMouseMove=function(e){var n=e.clientX,r=e.clientY;t.deltaX+=n-t.clientX,t.deltaY+=r-t.clientY,t.animationFrameID==null&&(t.animationFrameID=A(t.triggerOnMouseMoveCallback)),t.clientX=n,t.clientY=r,e.preventDefault()},this.onMouseUp=function(){t.animationFrameID&&(Te(t.animationFrameID),t.triggerOnMouseMoveCallback()),t.triggerOnMouseMoveEndCallback(!1)},this.triggerOnMouseMoveCallback=function(){t.animationFrameID=null,t.onMouseMoveCallback(t.deltaX,t.deltaY,{clientX:t.clientX,clientY:t.clientY}),t.deltaX=0,t.deltaY=0},this.triggerOnMouseMoveEndCallback=function(e){t.onMouseMoveEndCallback(e)},this.elem=a.elem||document.documentElement,this.onMouseMoveCallback=a.onMouseMove,this.onMouseMoveEndCallback=a.onMouseMoveEnd,this.animationFrameID=null}return Object(w.a)(o,[{key:"capture",value:function(t){this.captured||(this.removeMouseMoveEvent=ne()(this.elem,"mousemove",this.onMouseMove).remove,this.removeMouseUpEvent=ne()(this.elem,"mouseup",this.onMouseUp).remove),this.captured=!0,this.dragging||(this.clientX=t.clientX,this.clientY=t.clientY,this.deltaX=0,this.deltaY=0,this.dragging=!0),t.preventDefault()}},{key:"release",value:function(){this.captured&&(this.removeMouseMoveEvent!=null&&(this.removeMouseMoveEvent(),this.removeMouseMoveEvent=null),this.removeMouseUpEvent!=null&&(this.removeMouseUpEvent(),this.removeMouseUpEvent=null)),this.captured=!1,this.dragging&&(this.dragging=!1,this.clientX=0,this.clientY=0,this.deltaX=0,this.deltaY=0)}},{key:"isDragging",value:function(){return this.dragging}}]),o}(),Xe=s(16),g=s.n(Xe),T=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(){var e;return Object(b.a)(this,t),e=a.apply(this,arguments),e.triggerCallback=function(n){var r=e.props.contentSize-e.props.containerSize,i=k()(n,0,r);i!==e.props.scrollPosition&&e.props.onScroll(i)},e.onWheel=function(n){e.triggerCallback(e.props.scrollPosition+n)},e.onWheelX=function(n,r){Math.abs(n)>=Math.abs(r)&&e.onWheel(n)},e.onWheelY=function(n,r){Math.abs(n)<=Math.abs(r)&&e.onWheel(r)},e.onKeyDown=function(n){var r=n.keyCode;if(r===g.a.TAB)return;var i=e.props,c=i.contentSize,h=i.containerSize,u=e.props.keyboardScrollAmount,d=0;if(e.isHorizontal())switch(r){case g.a.HOME:d=-1,u=c;break;case g.a.LEFT:d=-1;break;case g.a.RIGHT:d=1;break;default:return}else switch(r){case g.a.SPACE:n.shiftKey?d=-1:d=1;break;case g.a.HOME:d=-1,u=c;break;case g.a.UP:d=-1;break;case g.a.DOWN:d=1;break;case g.a.PAGE_UP:d=-1,u=h;break;case g.a.PAGE_DOWN:d=1,u=h;break;default:return}n.preventDefault(),e.triggerCallback(e.props.scrollPosition+u*d)},e.onMouseDown=function(n){if(n.target!==e.thumbElem){var r=n.nativeEvent,i=e.isHorizontal()?r.offsetX||r.layerX:r.offsetY||r.layerY;e.triggerCallback((i-e.thumbSize*.5)/e.scale)}else e.mouseMoveTracker.capture(n);e.props.stopPropagation&&n.stopPropagation(),e.containerElem.focus()},e.onMouseMove=function(n,r){var i=e.isHorizontal()?n:r;i!==0&&(i/=e.scale,e.triggerCallback(e.props.scrollPosition+i))},e.onMouseMoveEnd=function(){e.mouseMoveTracker.release()},e.refContainer=function(n){e.containerElem=n},e.refThumb=function(n){e.thumbElem=n},e}return Object(w.a)(t,[{key:"UNSAFE_componentWillMount",value:function(){this.wheelHandler=new te({onWheel:this.isHorizontal()?this.onWheelX:this.onWheelY,shouldHandleScrollX:!0,shouldHandleScrollY:!0,stopPropagation:this.props.stopPropagation}),this.mouseMoveTracker=new oe({elem:document.documentElement,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})}},{key:"componentWillUnmount",value:function(){this.mouseMoveTracker.release()}},{key:"isHorizontal",value:function(){return this.props.orientation==="horizontal"}},{key:"fixPosition",value:function(n){var r=this.props.contentSize-this.props.containerSize;return k()(n,0,r)}},{key:"render",value:function(){var n,r=this.props,i=r.prefixCls,c=r.className,h=r.scrollPosition,u=r.containerSize,d=r.contentSize,p=r.miniThumbSize,E=r.zIndex,S=r.scrollbarSize;if(u<1||d<=u)return null;var f=u/d,m=u*f;m<p&&(f=(u-p)/(d-u),m=p),this.scale=f,this.thumbSize=m;var x,L,B=this.isHorizontal();B?(x={width:u,height:S},L={width:m,transform:"translate(".concat(h*f,"px, 0)")}):(x={width:S,height:u},L={height:m,transform:"translate(0, ".concat(h*f,"px)")}),E&&(x.zIndex=E);var z="".concat(i,"-scrollbar");return l.a.createElement("div",{className:R()(z,(n={},Object(N.a)(n,"".concat(z,"-vertical"),!B),Object(N.a)(n,"".concat(z,"-horizontal"),B),n),c),style:x,tabIndex:0,ref:this.refContainer,onKeyDown:this.onKeyDown,onMouseDown:this.onMouseDown,onWheel:this.wheelHandler.onWheel},l.a.createElement("div",{ref:this.refThumb,style:L,className:"".concat(z,"-thumb")}))}}]),t}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",orientation:"vertical",contentSize:0,containerSize:0,defaultPosition:0,scrollbarSize:4,miniThumbSize:16,keyboardScrollAmount:40}})(T||(T={}));var W=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(){var e;return Object(b.a)(this,t),e=a.apply(this,arguments),e.onScroll=function(n,r){e.scrolling||e.triggerScrollStart(),Math.abs(r)>Math.abs(n)&&e.state.hasVerticalBar?e.scrollVertical(r,!0):n&&e.state.hasHorizontalBar&&e.scrollHorizontal(n,!0),e.triggerScrollStop()},e.onVerticalScroll=function(n){if(n===e.state.scrollTop)return;e.scrolling||e.triggerScrollStart(),e.scrollVertical(n,!1),e.triggerScrollStop()},e.onHorizontalScroll=function(n){if(n===e.state.scrollLeft)return;e.scrolling||e.triggerScrollStart(),e.scrollHorizontal(n,!1),e.triggerScrollStop()},e.shouldHandleWheelX=function(n){return!e.state.hasHorizontalBar||n===0?!1:(n=Math.round(n),n===0?!1:n<0&&e.state.scrollLeft>0||n>=0&&e.state.scrollLeft<e.state.maxScrollLeft)},e.shouldHandleWheelY=function(n){return!e.state.hasVerticalBar||n===0?!1:(n=Math.round(n),n===0?!1:n<0&&e.state.scrollTop>0||n>=0&&e.state.scrollTop<e.state.maxScrollTop)},e.shouldHandleTouchX=function(n){return e.props.touchable?e.shouldHandleWheelX(n):!1},e.shouldHandleTouchY=function(n){return e.props.touchable?e.shouldHandleWheelY(n):!1},e.onMouseDown=function(n){e.mouseMoveTracker!=null&&e.mouseMoveTracker.capture(n)},e.onMouseMove=function(n,r){e.scrolling||e.triggerScrollStart(),e.scrollVertical(r,!0),e.scrollHorizontal(n,!0)},e.onMouseMoveEnd=function(){e.mouseMoveTracker!=null&&e.mouseMoveTracker.release(),e.triggerScrollStop()},e.refContainer=function(n){e.containerElem=n},e.refContent=function(n){e.contentElem=n},e.onWheel=function(n){e.wheelHandler!=null&&e.wheelHandler.onWheel(n)},e}return Object(w.a)(t,[{key:"UNSAFE_componentWillMount",value:function(){this.triggerScrollStop=ge(this.triggerScrollStopSync,200,this),this.wheelHandler=new te({onWheel:this.onScroll,shouldHandleScrollX:this.shouldHandleWheelX,shouldHandleScrollY:this.shouldHandleWheelY,stopPropagation:this.props.stopPropagation}),this.props.touchable&&(this.touchHandler=new j({onTouchScroll:this.onScroll,shouldHandleScrollX:this.shouldHandleTouchX,shouldHandleScrollY:this.shouldHandleTouchY,stopPropagation:this.props.stopPropagation})),this.props.dragable&&(this.mouseMoveTracker=new oe({elem:document.documentElement,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})),this.setState(this.calculateState())}},{key:"componentDidMount",value:function(){this.mounted=!0,this.setState(this.calculateState())}},{key:"UNSAFE_componentWillReceiveProps",value:function(n){this.setState(this.calculateState(n))}},{key:"componentWillUnmount",value:function(){this.wheelHandler=null,this.props.touchable&&(this.touchHandler=null),this.props.dragable&&this.mouseMoveTracker!=null&&(this.mouseMoveTracker.release(),this.mouseMoveTracker=null);var n=this.triggerScrollStop;n.reset(),this.triggerScrollStopSync()}},{key:"calculateState",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:this.props,r=n.containerWidth!==void 0&&n.containerWidth!==this.props.containerWidth?n.containerWidth:this.props.containerWidth!==void 0?this.props.containerWidth:this.containerElem&&this.containerElem.clientWidth||0,i=n.containerHeight!==void 0&&n.containerHeight!==this.props.containerHeight?n.containerHeight:this.props.containerHeight!==void 0?this.props.containerHeight:this.containerElem&&this.containerElem.clientHeight||0,c=n.contentWidth!==void 0&&n.contentWidth!==this.props.contentWidth?n.contentWidth:this.props.contentWidth!==void 0?this.props.contentWidth:this.contentElem&&this.contentElem.scrollWidth||0,h=n.contentHeight!==void 0&&n.contentHeight!==this.props.contentHeight?n.contentHeight:this.props.contentHeight!==void 0?this.props.contentHeight:this.contentElem&&this.contentElem.scrollHeight||0,u=h>i,d=c>r,p=0,E=0,S=0,f=0,m=i,x=r;u&&(d&&(m-=n.scrollbarSize),S=h-m,n.scrollTop!==this.props.scrollTop?p=n.scrollTop:p=(this.state?this.state.scrollTop:n.scrollTop)||0),d&&(u&&(x-=n.scrollbarSize),f=c-x,n.scrollLeft!==this.props.scrollLeft?E=n.scrollLeft:E=(this.state?this.state.scrollLeft:n.scrollLeft)||0);var L={containerWidth:r,containerHeight:i,contentWidth:c,contentHeight:h,verticalBarHeight:m,horizontalBarWidth:x,hasVerticalBar:u,hasHorizontalBar:d,maxScrollTop:S,maxScrollLeft:f,scrollTop:k()(p,0,S),scrollLeft:k()(E,0,f)};return L}},{key:"scrollVertical",value:function(n,r){var i=k()(r?this.state.scrollTop+n:n,0,this.state.maxScrollTop);this.props.onVerticalScroll&&this.props.onVerticalScroll(i),this.setState({scrollTop:i})}},{key:"scrollHorizontal",value:function(n,r){var i=k()(r?this.state.scrollLeft+n:n,0,this.state.maxScrollLeft);this.props.onHorizontalScroll&&this.props.onHorizontalScroll(i),this.setState({scrollLeft:i})}},{key:"triggerScrollStart",value:function(){if(this.scrolling)return;this.scrolling=!0,this.props.onScrollStart&&this.props.onScrollStart(this.state.scrollLeft,this.state.scrollTop)}},{key:"triggerScrollStopSync",value:function(){if(!this.scrolling)return;this.scrolling=!1,this.props.onScrollEnd&&this.props.onScrollEnd(this.state.scrollLeft,this.state.scrollTop)}},{key:"getScrollbarProps",value:function(){return{zIndex:this.props.zIndex,miniThumbSize:this.props.miniThumbSize,scrollbarSize:this.props.scrollbarSize,keyboardScrollAmount:this.props.keyboardScrollAmount,stopPropagation:!0}}},{key:"renderVerticalBar",value:function(){if(this.state.hasVerticalBar)return l.a.createElement(T,Object.assign({orientation:"vertical",scrollPosition:this.state.scrollTop,contentSize:this.state.contentHeight,containerSize:this.state.verticalBarHeight,onScroll:this.onVerticalScroll},this.getScrollbarProps()))}},{key:"renderHorizontalBar",value:function(){if(this.state.hasHorizontalBar)return l.a.createElement(T,Object.assign({orientation:"horizontal",scrollPosition:this.state.scrollLeft,contentSize:this.state.contentWidth,containerSize:this.state.horizontalBarWidth,onScroll:this.onHorizontalScroll},this.getScrollbarProps()))}},{key:"render",value:function(){var n={};this.props.touchable&&(n.onTouchStart=this.touchHandler.onTouchStart,n.onTouchEnd=this.touchHandler.onTouchEnd,n.onTouchMove=this.touchHandler.onTouchMove,n.onTouchCancel=this.touchHandler.onTouchCancel),this.props.dragable&&(n.onMouseDown=this.onMouseDown);var r={},i={};(this.props.containerWidth!=null||this.mounted)&&(i.width=this.state.containerWidth),(this.props.containerHeight!=null||this.mounted)&&(i.height=this.state.containerHeight),(this.props.contentWidth!=null||this.mounted)&&(r.width=this.state.contentWidth),(this.props.contentHeight!=null||this.mounted)&&(r.height=this.state.contentHeight),this.mounted&&(r.transform="translate(-".concat(this.state.scrollLeft,"px, -").concat(this.state.scrollTop,"px)"));var c=this.props,h=c.prefixCls,u=c.scrollbarAutoHide,d="".concat(h,"-scroll-box");return l.a.createElement("div",Object.assign({},n,{style:Object.assign(Object.assign({},this.props.containerStyle),i),ref:this.refContainer,onWheel:this.onWheel,className:R()(d,Object(N.a)({},"".concat(d,"-auto-hide"),u),this.props.containerClassName)}),l.a.createElement("div",{style:Object.assign(Object.assign({},this.props.contentStyle),r),ref:this.refContent,className:R()("".concat(d,"-content"),this.props.contentClassName)},this.props.children),this.renderVerticalBar(),this.renderHorizontalBar())}}]),t}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",scrollTop:0,scrollLeft:0,dragable:!0,touchable:!0,scrollbarAutoHide:!0,scrollbarSize:T.defaultProps.scrollbarSize,miniThumbSize:T.defaultProps.miniThumbSize,keyboardScrollAmount:T.defaultProps.keyboardScrollAmount}})(W||(W={}));var ke=function(o,a){var t={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&a.indexOf(e)<0&&(t[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,e=Object.getOwnPropertySymbols(o);n<e.length;n++)a.indexOf(e[n])<0&&Object.prototype.propertyIsEnumerable.call(o,e[n])&&(t[e[n]]=o[e[n]]);return t},Y=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(){var e;return Object(b.a)(this,t),e=a.apply(this,arguments),e.state={contentWidth:null,contentHeight:null},e.onContentResize=function(n,r){e.props.scrollX&&e.setState({contentWidth:n}),e.props.scrollY&&e.setState({contentHeight:r})},e}return Object(w.a)(t,[{key:"render",value:function(){var n=this,r=this.props,i=r.prefixCls,c=r.children,h=r.scrollX,u=r.scrollY,d=r.scrollBoxProps,p=ke(r,["prefixCls","children","scrollX","scrollY","scrollBoxProps"]);return l.a.createElement(_.a,Object.assign({handleWidth:h,handleHeight:u},p),function(E){var S=E.width,f=E.height,m={};return h||(m.contentWidth=S),u||(m.contentHeight=f),n.state.contentWidth!=null&&(m.contentWidth=n.state.contentWidth),n.state.contentHeight!=null&&(m.contentHeight=n.state.contentHeight),l.a.createElement(W,Object.assign({dragable:!1,scrollbarSize:3},d,{containerWidth:S,containerHeight:f}),l.a.createElement("div",{className:"".concat(i,"-auto-scroll-box-content")},l.a.createElement(_.a,{handleWidth:h,handleHeight:u,skipOnMount:!0,onResize:n.onContentResize},c)))})}}]),t}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",scrollX:!0,scrollY:!0}})(Y||(Y={}));var Ke=s(85),Ge=s(86),Ce=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(){return Object(b.a)(this,t),a.apply(this,arguments)}return Object(w.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{style:{padding:24}},l.a.createElement("div",{style:{width:300,height:200,border:"1px solid #f0f0f0"}},l.a.createElement(Y,null,l.a.createElement("div",{style:{position:"relative",width:1200,height:3e3,cursor:"grab",background:"linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)"}},l.a.createElement("div",{style:{position:"absolute",top:8,left:8}},"Top-Left-Corner"),l.a.createElement("div",{style:{position:"absolute",top:8,right:8}},"Top-Right-Corner"),l.a.createElement("div",{style:{position:"absolute",bottom:8,left:8}},"Bottom-Left-Corner"),l.a.createElement("div",{style:{position:"absolute",bottom:8,right:8}},"Bottom-Right-Corner")))))}}]),t}(l.a.PureComponent),Oe=s(143),De=s(139),Ae=s(144),Le=s(145),H=s(141),Je=s(92),He=s(57),Ze=s(96),re=s(95),ze=function(){return l.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},Pe=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(){return Object(b.a)(this,t),a.apply(this,arguments)}return Object(w.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"demo-toolbar"},l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},l.a.createElement(Oe.a,{onClick:function(){window.location.reload()}})),window.frameElement&&l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},l.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},l.a.createElement(De.a,{component:ze}))),l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},l.a.createElement("a",{href:"".concat(re.host),rel:"noopener noreferrer",target:"_blank"},l.a.createElement(Ae.a,null))),l.a.createElement(H.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},l.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},l.a.createElement("input",{type:"hidden",name:"parameters",value:Object(He.getParameters)(re.getCodeSandboxParams())}),l.a.createElement("button",{type:"submit"},l.a.createElement(Le.a,null)))))}}]),t}(l.a.Component),Ue=s(142),Ne=s(65),$e=s(112),F=function(o){Object(M.a)(t,o);var a=Object(X.a)(t);function t(e){var n;return Object(b.a)(this,t),n=a.call(this,e),n.refContainer=function(r){n.container=r},t.restoreIframeSize(),n}return Object(w.a)(t,[{key:"componentDidMount",value:function(){var n=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){n.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return n.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var n=window.frameElement;if(n){var r=this.container.scrollHeight||this.container.clientHeight;n.style.width="100%",n.style.height="".concat(r+16,"px"),n.style.border="0",n.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return l.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},l.a.createElement(Pe,null),this.props.children)}}]),t}(l.a.Component);(function(o){var a=window.location.pathname,t="x6-iframe-size";function e(){var i=localStorage.getItem(t),c;if(i)try{c=JSON.parse(i)}catch(h){}else c={};return c}function n(){var i=window.frameElement;if(i){var c=i.style,h={width:c.width,height:c.height},u=e();u[a]=h,localStorage.setItem(t,JSON.stringify(u))}}o.saveIframeSize=n;function r(){var i=window.frameElement;if(i){var c=e(),h=c[a];h&&(i.style.width=h.width||"100%",i.style.height=h.height||"auto")}}o.restoreIframeSize=r})(F||(F={}));var Qe=s(113),Re=function(a){var t=a.children;return l.a.createElement(Ue.a.ErrorBoundary,null,l.a.createElement(Ne.a,null,l.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),l.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),l.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),l.a.createElement(F,null,t))};ae.a.render(l.a.createElement(Re,null,l.a.createElement(Ce,null)),document.getElementById("root"))},80:function(y,v,s){y.exports=s(135)},85:function(y,v,s){},86:function(y,v,s){},95:function(y,v,s){"use strict";s.r(v),s.d(v,"host",function(){return P}),s.d(v,"getCodeSandboxParams",function(){return l}),s.d(v,"getStackblitzPrefillConfig",function(){return U});const P="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/auto-scrollbox/basic";function l(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
          <AutoScrollBox>
            <div
              style={{
                position: 'relative',
                width: 1200,
                height: 3000,
                cursor: 'grab',
                background:
                  'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
              }}
            >
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                Top-Left-Corner
              </div>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                Top-Right-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                Bottom-Left-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                Bottom-Right-Corner
              </div>
            </div>
          </AutoScrollBox>
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
`,isBinary:!1}}}}function U(){return{title:"api/ui/auto-scrollbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
          <AutoScrollBox>
            <div
              style={{
                position: 'relative',
                width: 1200,
                height: 3000,
                cursor: 'grab',
                background:
                  'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
              }}
            >
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                Top-Left-Corner
              </div>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                Top-Right-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                Bottom-Left-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                Bottom-Right-Corner
              </div>
            </div>
          </AutoScrollBox>
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
`}}}},96:function(y,v,s){}},[[80,1,2]]]);
