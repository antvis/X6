import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{t}from"./jsx-runtime.BIPumRIh.js";import{V as n,g as r}from"./src.CHCtIstW.js";import{st as i}from"./es.CT-tX7SG.js";import{t as a}from"./insert-css.Bh27PzyC.js";import{t as o}from"./client.CwFZmRZk.js";var s=e(t()),c=e(a()),l=e(o());new r({container:document.getElementById(`container`),grid:!0,onPortRendered(e){let t=e.contentSelectors,n=t&&t.foContent;n&&(0,l.createRoot)(n).render((0,s.jsx)(i,{title:`port`,children:(0,s.jsx)(`div`,{className:`my-port`})}))}}).addNode({x:100,y:60,width:280,height:120,attrs:{body:{fill:`#f5f5f5`,stroke:`#d9d9d9`,strokeWidth:1}},portMarkup:[n.getForeignObjectMarkup()],ports:{items:[{group:`in`,id:`in1`},{group:`in`,id:`in2`},{group:`out`,id:`out1`},{group:`out`,id:`out2`}],groups:{in:{position:{name:`top`},attrs:{fo:{width:12,height:12,x:-6,y:-6,magnet:`true`}},zIndex:1},out:{position:{name:`bottom`},attrs:{fo:{width:12,height:12,x:-6,y:-6,magnet:`true`}},zIndex:1}}}}),(0,c.default)(`
  .my-port {
    width: 100%;
    height: 100%;
    border: 2px solid #31d0c6;
    border-radius: 100%;
    background: #fff;
  }
`);