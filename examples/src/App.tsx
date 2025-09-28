import { Routes, Route } from 'react-router-dom'
import { ExampleList } from './pages'
import { GraphExample } from './pages/graph/index'
import { PositionExample } from './pages/position/position'
import { CoordExample } from './pages/position/coord'
import { AutoResizeExample } from './pages/auto-resize'
import { HtmlExample } from './pages/html'
import { CustomNodeExample } from './pages/shape/custom-node'
import { GroupExample } from './pages/group'
import { EmbedDndExample } from './pages/embed/dnd'
import { ReactExample } from './pages/react/index'
import { ReactPortalExample } from './pages/react/portal'
import { PortsDefaultsExample } from './pages/ports/defaults'
import { PortsConnectedExample } from './pages/ports/connected'
import { EdgeExample } from './pages/edge'
import { RouterExample } from './pages/router'
import { ToolArrowheadExample } from './pages/edge/tool/arrowhead'
import { ToolButtonExample } from './pages/edge/tool/button'
import { CustomConnectorExample } from './pages/edge/custom-connector'
import { CustomRouterExample } from './pages/edge/custom-router'
import { NativeMarkerExample } from './pages/edge/native-marker'
import { CustomMarkerExample } from './pages/edge/custom-marker'
import { EdgeEditorExample } from './pages/edge/edge-editor'
import { OffsetRoundedExample } from './pages/connector/offset-rounded'
import { XmindCurveExample } from './pages/connector/xmind-curve'
import { ToolsCleanExample } from './pages/tools/clean'
import { CaseBpmnExample } from './pages/case/bpmn'
import { CaseClassExample } from './pages/case/class'
import { CaseDagExample } from './pages/case/dag'
import { CaseElkExample } from './pages/case/elk'
import { CaseErExample } from './pages/case/er'
import { CaseMindExample } from './pages/case/mind'
import { CaseSwimlaneExample } from './pages/case/swimlane'
import { OrgExample } from './pages/org'
import { SnaplineExample } from './pages/plugins/snapline'
import { ClipboardExample } from './pages/plugins/clipboard'
import { KeyboardExample } from './pages/plugins/keyboard'
import { DndExample } from './pages/plugins/dnd'
import { ScrollerExample } from './pages/plugins/scroller'
import { SelectionExample } from './pages/plugins/selection'
import { StencilExample } from './pages/plugins/stencil'
import { TransformExample } from './pages/transform'
import { UndoExample } from './pages/undo'
import { TransitionExample } from './pages/animation/transition'
import { HistoryExample } from './pages/history'
import { SegmentsExample } from './pages/edge/tool/segments'

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
      <Route path="/edge/tool/arrowhead" element={<ToolArrowheadExample />} />
      <Route path="/edge/tool/button" element={<ToolButtonExample />} />
      <Route path="/edge/tool/segments" element={<SegmentsExample />} />
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
      <Route path="/plugins/dnd" element={<DndExample />} />
      <Route path="/plugins/snapline" element={<SnaplineExample />} />
      <Route path="/plugins/clipboard" element={<ClipboardExample />} />
      <Route path="/plugins/keyboard" element={<KeyboardExample />} />
      <Route path="/plugins/scroller" element={<ScrollerExample />} />
      <Route path="/plugins/selection" element={<SelectionExample />} />
      <Route path="/plugins/stencil" element={<StencilExample />} />

      <Route path="/transform" element={<TransformExample />} />
      <Route path="/undo" element={<UndoExample />} />
      <Route path="/animation/transition" element={<TransitionExample />} />
      <Route path="/history" element={<HistoryExample />} />
    </Routes>
  )
}

export default App
