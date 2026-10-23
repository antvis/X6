import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{E as t,c as n,f as r,g as i,i as a,l as o,n as s,r as c,t as l}from"./src.DTJrlHdG.js";import{t as u}from"./insert-css.Bh27PzyC.js";var d=e(u());function f(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}w();var p=new i({container:document.getElementById(`graph-container`),grid:!0,mousewheel:{enabled:!0,zoomAtMousePosition:!0,modifiers:`ctrl`,minScale:.5,maxScale:3},connecting:{router:`manhattan`,connector:{name:`rounded`,args:{radius:8}},anchor:`center`,connectionPoint:`anchor`,allowBlank:!1,snap:{radius:20},createEdge(){return new t({attrs:{line:{stroke:`#A2B1C3`,strokeWidth:2,targetMarker:{name:`block`,width:12,height:8}}},zIndex:0})},validateConnection({targetMagnet:e}){return!!e}},highlighting:{magnetAdsorbed:{name:`stroke`,args:{attrs:{fill:`#5F95FF`,stroke:`#5F95FF`}}}}});p.use(new l({resizing:!0,rotating:!0})).use(new a({rubberband:!0,showNodeSelectionBox:!0})).use(new c).use(new n).use(new r).use(new o);var m=new s({title:`流程图`,target:p,stencilGraphWidth:200,stencilGraphHeight:180,stencilGraphOptions:{panning:!0},collapsable:!0,groups:[{title:`基础流程图`,name:`group1`},{title:`系统设计图`,name:`group2`,graphHeight:250,layoutOptions:{rowHeight:70}}],layoutOptions:{columns:2,columnWidth:80,rowHeight:55}});f([document,`access`,e=>e.getElementById,`call`,e=>e(`stencil`),`optionalAccess`,e=>e.appendChild,`call`,e=>e(m.container)]),p.bindKey([`meta+c`,`ctrl+c`],()=>{let e=p.getSelectedCells();return e.length&&p.copy(e),!1}),p.bindKey([`meta+x`,`ctrl+x`],()=>{let e=p.getSelectedCells();return e.length&&p.cut(e),!1}),p.bindKey([`meta+v`,`ctrl+v`],()=>{if(!p.isClipboardEmpty()){let e=p.paste({offset:32});p.cleanSelection(),p.select(e)}return!1}),p.bindKey([`meta+z`,`ctrl+z`],()=>(p.canUndo()&&p.undo(),!1)),p.bindKey([`meta+shift+z`,`ctrl+shift+z`],()=>(p.canRedo()&&p.redo(),!1)),p.bindKey([`meta+a`,`ctrl+a`],()=>{let e=p.getNodes();e&&p.select(e)}),p.bindKey(`backspace`,()=>{let e=p.getSelectedCells();e.length&&p.removeCells(e)}),p.bindKey([`ctrl+1`,`meta+1`],()=>{p.zoom()<1.5&&p.zoom(.1)}),p.bindKey([`ctrl+2`,`meta+2`],()=>{p.zoom()>.5&&p.zoom(-.1)});var h=(e,t)=>{for(let n=0,r=e.length;n<r;n+=1)e[n].style.visibility=t?`visible`:`hidden`};p.on(`node:mouseenter`,()=>{h(document.getElementById(`graph-container`).querySelectorAll(`.x6-port-body`),!0)}),p.on(`node:mouseleave`,()=>{h(document.getElementById(`graph-container`).querySelectorAll(`.x6-port-body`),!1)});var g={groups:{top:{position:`top`,attrs:{circle:{r:4,magnet:!0,stroke:`#5F95FF`,strokeWidth:1,fill:`#fff`,style:{visibility:`hidden`}}}},right:{position:`right`,attrs:{circle:{r:4,magnet:!0,stroke:`#5F95FF`,strokeWidth:1,fill:`#fff`,style:{visibility:`hidden`}}}},bottom:{position:`bottom`,attrs:{circle:{r:4,magnet:!0,stroke:`#5F95FF`,strokeWidth:1,fill:`#fff`,style:{visibility:`hidden`}}}},left:{position:`left`,attrs:{circle:{r:4,magnet:!0,stroke:`#5F95FF`,strokeWidth:1,fill:`#fff`,style:{visibility:`hidden`}}}}},items:[{group:`top`},{group:`right`},{group:`bottom`},{group:`left`}]};i.registerNode(`custom-rect`,{inherit:`rect`,width:66,height:36,attrs:{body:{strokeWidth:1,stroke:`#5F95FF`,fill:`#EFF4FF`},text:{fontSize:12,fill:`#262626`}},ports:{...g}},!0),i.registerNode(`custom-polygon`,{inherit:`polygon`,width:66,height:36,attrs:{body:{strokeWidth:1,stroke:`#5F95FF`,fill:`#EFF4FF`},text:{fontSize:12,fill:`#262626`}},ports:{...g,items:[{group:`top`},{group:`bottom`}]}},!0),i.registerNode(`custom-circle`,{inherit:`circle`,width:45,height:45,attrs:{body:{strokeWidth:1,stroke:`#5F95FF`,fill:`#EFF4FF`},text:{fontSize:12,fill:`#262626`}},ports:{...g}},!0),i.registerNode(`custom-image`,{inherit:`rect`,width:52,height:52,markup:[{tagName:`rect`,selector:`body`},{tagName:`image`},{tagName:`text`,selector:`label`}],attrs:{body:{stroke:`#5F95FF`,fill:`#5F95FF`},image:{width:26,height:26,refX:13,refY:16},label:{refX:3,refY:2,textAnchor:`left`,textVerticalAnchor:`top`,fontSize:12,fill:`#fff`}},ports:{...g}},!0);var _=p.createNode({shape:`custom-rect`,label:`开始`,attrs:{body:{rx:20,ry:26}}}),v=p.createNode({shape:`custom-rect`,label:`过程`}),y=p.createNode({shape:`custom-rect`,attrs:{body:{rx:6,ry:6}},label:`可选过程`}),b=p.createNode({shape:`custom-polygon`,attrs:{body:{refPoints:`0,10 10,0 20,10 10,20`}},label:`决策`}),x=p.createNode({shape:`custom-polygon`,attrs:{body:{refPoints:`10,0 40,0 30,20 0,20`}},label:`数据`}),S=p.createNode({shape:`custom-circle`,label:`连接`});m.load([_,v,y,b,x,S],`group1`);var C=[{label:`Client`,image:`https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg`},{label:`Http`,image:`https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg`},{label:`Api`,image:`https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg`},{label:`Sql`,image:`https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg`},{label:`Clound`,image:`https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg`},{label:`Mq`,image:`https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg`}].map(e=>p.createNode({shape:`custom-image`,label:e.label,attrs:{image:{"xlink:href":e.image}}}));m.load(C,`group2`);function w(){let e=document.getElementById(`container`),t=document.createElement(`div`);t.id=`stencil`;let n=document.createElement(`div`);n.id=`graph-container`,e.appendChild(t),e.appendChild(n),(0,d.default)(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
    }
    #stencil {
      width: 180px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
    }
    #graph-container {
      width: calc(100% - 180px);
      height: 100%;
    }
    .x6-widget-stencil  {
      background-color: #fff;
    }
    .x6-widget-stencil-title {
      background-color: #fff;
    }
    .x6-widget-stencil-group-title {
      background-color: #fff !important;
    }
    .x6-widget-transform {
      margin: -1px 0 0 -1px;
      padding: 0px;
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div {
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div:hover {
      background-color: #3dafe4;
    }
    .x6-widget-transform-active-handle {
      background-color: #3dafe4;
    }
    .x6-widget-transform-resize {
      border-radius: 0;
    }
    .x6-widget-selection-inner {
      border: 1px solid #239edd;
    }
    .x6-widget-selection-box {
      opacity: 0;
    }
  `)}