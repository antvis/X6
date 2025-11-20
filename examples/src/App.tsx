import { Route, Routes } from 'react-router-dom'
import { ExampleList } from './pages'
import { AnimateElementExample } from './pages/animation/animateElement'
import { AnimationConfExample } from './pages/animation/animationConf'
import { AnimationControlExample } from './pages/animation/animationControl'
import { ComplexAnimationExample } from './pages/animation/complexAnimation'
import { EdgeAnimationExample } from './pages/animation/edgeAnimation'
import { OSCPExample } from './pages/animation/oscp'
import { RoutePlanningExample } from './pages/animation/routePlanning'
import { ScatteringExample } from './pages/animation/scattering'
import { AutoResizeExample } from './pages/auto-resize'
import { CaseBpmnExample } from './pages/case/bpmn'
import { CaseClassExample } from './pages/case/class'
import { CaseDagExample } from './pages/case/dag'
import { CaseElkExample } from './pages/case/elk'
import { CaseErExample } from './pages/case/er'
import { CaseMindExample } from './pages/case/mind'
import { CaseSwimlaneExample } from './pages/case/swimlane'
import { OffsetRoundedExample } from './pages/connector/offset-rounded'
import { XmindCurveExample } from './pages/connector/xmind-curve'
import { EdgeExample } from './pages/edge'
import { CustomConnectorExample } from './pages/edge/custom-connector'
import { CustomMarkerExample } from './pages/edge/custom-marker'
import { CustomRouterExample } from './pages/edge/custom-router'
import { EdgeEditorExample } from './pages/edge/edge-editor'
import { NativeMarkerExample } from './pages/edge/native-marker'
import { ToolArrowheadExample } from './pages/edge/tool/arrowhead'
import { ToolButtonExample } from './pages/edge/tool/button'
import { SegmentsExample } from './pages/edge/tool/segments'
import { VerticesExample } from './pages/edge/tool/vertices'
import { EmbedDndExample } from './pages/embed/dnd'
import { GraphFromJSONExample } from './pages/graph/from-json'
import { GraphExample } from './pages/graph/index'
import { GroupExample } from './pages/group'
import { HistoryExample } from './pages/history'
import { HtmlExample } from './pages/html'
import { OrgExample } from './pages/org'
import { ClipboardExample } from './pages/plugins/clipboard'
import { DndExample } from './pages/plugins/dnd'
import { ExportExample } from './pages/plugins/export'
import { KeyboardExample } from './pages/plugins/keyboard'
import { ScrollerExample } from './pages/plugins/scroller'
import { SelectionExample } from './pages/plugins/selection'
import { SnaplineExample } from './pages/plugins/snapline'
import { StencilExample } from './pages/plugins/stencil'
import { TransformExample } from './pages/plugins/transform'
import { UndoExample } from './pages/plugins/undo'
import { PortsConnectedExample } from './pages/ports/connected'
import { PortsDefaultsExample } from './pages/ports/defaults'
import { CoordExample } from './pages/position/coord'
import { PositionExample } from './pages/position/position'
import { ReactExample } from './pages/react/index'
import { ReactPortalExample } from './pages/react/portal'
import { RouterExample } from './pages/router'
import { CustomNodeExample } from './pages/shape/custom-node'
import { ToolsCleanExample } from './pages/tools/clean'
import { VirtualRenderExample } from './pages/virtual-render'
import './App.less'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ExampleList />} />
      <Route path="/graph" element={<GraphExample />} />
      <Route path="/position/position" element={<PositionExample />} />
      <Route path="/position/coord" element={<CoordExample />} />
      <Route path="/auto-resize" element={<AutoResizeExample />} />
      <Route path="/html" element={<HtmlExample />} />
      <Route path="/shape/custom-node" element={<CustomNodeExample />} />
      <Route path="/group" element={<GroupExample />} />
      <Route path="/embed/dnd" element={<EmbedDndExample />} />
      <Route path="/react" element={<ReactExample />} />
      <Route path="/react/portal" element={<ReactPortalExample />} />
      <Route path="/ports/defaults" element={<PortsDefaultsExample />} />
      <Route path="/ports/connected" element={<PortsConnectedExample />} />
      <Route path="/edge" element={<EdgeExample />} />
      <Route path="/router" element={<RouterExample />} />
      <Route path="/graph/from-json" element={<GraphFromJSONExample />} />
      <Route path="/edge/tool/arrowhead" element={<ToolArrowheadExample />} />
      <Route path="/edge/tool/button" element={<ToolButtonExample />} />
      <Route path="/edge/tool/segments" element={<SegmentsExample />} />
      <Route path="/edge/tool/vertices" element={<VerticesExample />} />
      <Route
        path="/edge/custom-connector"
        element={<CustomConnectorExample />}
      />
      <Route path="/edge/custom-router" element={<CustomRouterExample />} />
      <Route path="/edge/native-marker" element={<NativeMarkerExample />} />
      <Route path="/edge/custom-marker" element={<CustomMarkerExample />} />
      <Route path="/edge/edge-editor" element={<EdgeEditorExample />} />
      <Route
        path="/connector/offset-rounded"
        element={<OffsetRoundedExample />}
      />
      <Route path="/connector/xmind-curve" element={<XmindCurveExample />} />
      <Route path="/tools/clean" element={<ToolsCleanExample />} />
      <Route path="/case/bpmn" element={<CaseBpmnExample />} />
      <Route path="/case/class" element={<CaseClassExample />} />
      <Route path="/case/dag" element={<CaseDagExample />} />
      <Route path="/case/elk" element={<CaseElkExample />} />
      <Route path="/case/er" element={<CaseErExample />} />
      <Route path="/case/mind" element={<CaseMindExample />} />
      <Route path="/case/swimlane" element={<CaseSwimlaneExample />} />
      <Route path="/org" element={<OrgExample />} />

      {/* Plugins Example */}
      <Route path="/plugins/snapline" element={<SnaplineExample />} />
      <Route path="/plugins/clipboard" element={<ClipboardExample />} />
      <Route path="/plugins/keyboard" element={<KeyboardExample />} />
      <Route path="/plugins/dnd" element={<DndExample />} />
      <Route path="/plugins/scroller" element={<ScrollerExample />} />
      <Route path="/plugins/selection" element={<SelectionExample />} />
      <Route path="/plugins/stencil" element={<StencilExample />} />
      <Route path="/plugins/transform" element={<TransformExample />} />
      <Route path="/plugins/undo" element={<UndoExample />} />
      <Route path="/plugins/export" element={<ExportExample />} />

      <Route
        path="/animation/complexAnimation"
        element={<ComplexAnimationExample />}
      />
      <Route
        path="/animation/animationConf"
        element={<AnimationConfExample />}
      />
      <Route
        path="/animation/animateElement"
        element={<AnimateElementExample />}
      />
      <Route
        path="/animation/edgeAnimation"
        element={<EdgeAnimationExample />}
      />
      <Route
        path="/animation/animationControl"
        element={<AnimationControlExample />}
      />
      <Route path="/animation/oscp" element={<OSCPExample />} />
      <Route path="/animation/scattering" element={<ScatteringExample />} />
      <Route
        path="/animation/routePlanning"
        element={<RoutePlanningExample />}
      />
      <Route path="/history" element={<HistoryExample />} />
      <Route path="/virtual-render" element={<VirtualRenderExample />} />
    </Routes>
  )
}

export default App
