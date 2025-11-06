/* eslint-disable */

/**
 * Auto generated file, do not modify it!
 */

export const content = `.x6-widget-dnd {
  position: absolute;
  top: -10000px;
  left: -10000px;
  z-index: 999999;
  display: none;
  cursor: move;
  opacity: 0.7;
  pointer-events: 'cursor';
}
.x6-widget-dnd.dragging {
  display: inline-block;
}
.x6-widget-dnd.dragging * {
  pointer-events: none !important;
}
.x6-widget-dnd .x6-graph {
  background: transparent;
  box-shadow: none;
}
.x6-widget-stencil {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.x6-widget-stencil::after {
  position: absolute;
  top: 0;
  display: block;
  width: 100%;
  height: 20px;
  padding: 8px 0;
  line-height: 20px;
  text-align: center;
  opacity: 0;
  transition: top 0.1s linear, opacity 0.1s linear;
  content: ' ';
  pointer-events: none;
}
.x6-widget-stencil-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.x6-widget-stencil .x6-node [magnet]:not([magnet='passive']) {
  pointer-events: none;
}
.x6-widget-stencil-group {
  padding: 0;
  padding-bottom: 8px;
  overflow: hidden;
  user-select: none;
}
.x6-widget-stencil-group.collapsed {
  height: auto;
  padding-bottom: 0;
}
.x6-widget-stencil-group-title {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  padding: 4px;
  cursor: pointer;
}
.x6-widget-stencil-title,
.x6-widget-stencil-group > .x6-widget-stencil-group-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}
.x6-widget-stencil .unmatched {
  opacity: 0.3;
}
.x6-widget-stencil .x6-node.unmatched {
  display: none;
}
.x6-widget-stencil-group.unmatched {
  display: none;
}
.x6-widget-stencil-search-text {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  max-height: 30px;
  line-height: 30px;
  outline: 0;
}
.x6-widget-stencil.not-found::after {
  opacity: 1;
  content: attr(data-not-found-text);
}
.x6-widget-stencil.not-found.searchable::after {
  top: 30px;
}
.x6-widget-stencil.not-found.searchable.collapsable::after {
  top: 50px;
}
.x6-widget-stencil {
  color: #333;
  background: #f5f5f5;
}
.x6-widget-stencil-content {
  position: absolute;
}
.x6-widget-stencil.collapsable > .x6-widget-stencil-content {
  top: 32px;
}
.x6-widget-stencil.searchable > .x6-widget-stencil-content {
  top: 80px;
}
.x6-widget-stencil.not-found::after {
  position: absolute;
}
.x6-widget-stencil.not-found.searchable.collapsable::after {
  top: 80px;
}
.x6-widget-stencil.not-found.searchable::after {
  top: 60px;
}
.x6-widget-stencil-group {
  height: auto;
  margin-bottom: 1px;
  padding: 0;
  transition: none;
}
  .x6-widget-stencil-group .x6-graph {
    background: transparent;
    box-shadow: none;
  }

  .x6-widget-stencil .x6-node.x6-node-immovable {
    cursor: move;
  }
.x6-widget-stencil-group.collapsed {
  height: auto;
  max-height: 31px;
}
.x6-widget-stencil-title,
.x6-widget-stencil-group > .x6-widget-stencil-group-title {
  position: relative;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 5px 0 8px;
  color: #666;
  font-weight: 700;
  font-size: 12px;
  line-height: 32px;
  cursor: default;
  transition: all 0.3;
}
.x6-widget-stencil-title:hover,
.x6-widget-stencil-group > .x6-widget-stencil-group-title:hover {
  color: #444;
}
.x6-widget-stencil-title {
  background: #e9e9e9;
}
.x6-widget-stencil-group > .x6-widget-stencil-group-title {
  background: #ededed;
}
.x6-widget-stencil.collapsable > .x6-widget-stencil-title,
.x6-widget-stencil-group.collapsable > .x6-widget-stencil-group-title {
  padding-left: 32px;
  cursor: pointer;
}
.x6-widget-stencil.collapsable > .x6-widget-stencil-title::before,
.x6-widget-stencil-group.collapsable > .x6-widget-stencil-group-title::before {
  position: absolute;
  top: 6px;
  left: 8px;
  display: block;
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: 0 0;
  border: none;
  content: ' ';
}
.x6-widget-stencil.collapsable > .x6-widget-stencil-title::before,
.x6-widget-stencil-group.collapsable > .x6-widget-stencil-group-title::before {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj48cGF0aCBkPSJNOS4zNzUuNUM0LjY4Ny41Ljg3NSA0LjMxMy44NzUgOWMwIDQuNjg4IDMuODEyIDguNSA4LjUgOC41IDQuNjg3IDAgOC41LTMuODEyIDguNS04LjUgMC00LjY4Ny0zLjgxMy04LjUtOC41LTguNXptMCAxNS44ODZDNS4zMDMgMTYuMzg2IDEuOTkgMTMuMDcyIDEuOTkgOXMzLjMxMi03LjM4NSA3LjM4NS03LjM4NVMxNi43NiA0LjkyOCAxNi43NiA5YzAgNC4wNzItMy4zMTMgNy4zODYtNy4zODUgNy4zODZ6Ii8+PHBhdGggZD0iTTEyLjc1MyA4LjQ0M0g1Ljk5N2EuNTU4LjU1OCAwIDAwMCAxLjExNmg2Ljc1NmEuNTU4LjU1OCAwIDAwMC0xLjExNnoiLz48L2c+PC9zdmc+');
  opacity: 0.4;
  transition: all 0.3s;
}
.x6-widget-stencil.collapsable > .x6-widget-stencil-title:hover::before,
.x6-widget-stencil-group.collapsable > .x6-widget-stencil-group-title:hover::before {
  opacity: 0.6;
}
.x6-widget-stencil.collapsable.collapsed > .x6-widget-stencil-title::before,
.x6-widget-stencil-group.collapsable.collapsed > .x6-widget-stencil-group-title::before {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj48cGF0aCBkPSJNOS4zNzUuNUM0LjY4Ny41Ljg3NSA0LjMxMy44NzUgOWMwIDQuNjg4IDMuODEyIDguNSA4LjUgOC41IDQuNjg3IDAgOC41LTMuODEyIDguNS04LjUgMC00LjY4Ny0zLjgxMy04LjUtOC41LTguNXptMCAxNS44ODZDNS4zMDMgMTYuMzg2IDEuOTkgMTMuMDcyIDEuOTkgOXMzLjMxMi03LjM4NSA3LjM4NS03LjM4NVMxNi43NiA0LjkyOCAxNi43NiA5YzAgNC4wNzItMy4zMTMgNy4zODYtNy4zODUgNy4zODZ6Ii8+PHBhdGggZD0iTTEyLjc1MyA4LjQ0M0g1Ljk5N2EuNTU4LjU1OCAwIDAwMCAxLjExNmg2Ljc1NmEuNTU4LjU1OCAwIDAwMC0xLjExNnoiLz48cGF0aCBkPSJNOC44MTcgNS42MjN2Ni43NTZhLjU1OC41NTggMCAwMDEuMTE2IDBWNS42MjNhLjU1OC41NTggMCAxMC0xLjExNiAweiIvPjwvZz48L3N2Zz4=');
  opacity: 0.4;
}
.x6-widget-stencil.collapsable.collapsed > .x6-widget-stencil-title:hover::before,
.x6-widget-stencil-group.collapsable.collapsed > .x6-widget-stencil-group-title:hover::before {
  opacity: 0.6;
}
.x6-widget-stencil input[type='search'] {
  appearance: textfield;
}
.x6-widget-stencil input[type='search']::-webkit-search-cancel-button,
.x6-widget-stencil input[type='search']::-webkit-search-decoration {
  appearance: none;
}
.x6-widget-stencil-search-text {
  display: block;
  width: 90%;
  margin: 8px 5%;
  padding-left: 8px;
  color: #333;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  outline: 0;
}
.x6-widget-stencil-search-text:focus {
  outline: 0;
}
.x6-widget-stencil::after {
  color: #808080;
  font-weight: 600;
  font-size: 12px;
  background: 0 0;
}
`
