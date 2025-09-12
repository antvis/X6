import React from 'react'
import { Graph } from '@antv/x6'
import './shapes'
import '../../index.less'

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 1600,
      grid: true,
      panning: true,
    })

    graph.addNode({
      shape: 'flowchart_annotation_1',
      x: 70,
      y: 40,
    })

    graph.addNode({
      shape: 'flowchart_annotation_2',
      x: 205,
      y: 40,
    })

    graph.addNode({
      shape: 'flowchart_card',
      x: 320,
      y: 60,
    })

    graph.addNode({
      shape: 'flowchart_collate',
      x: 460,
      y: 40,
    })

    graph.addNode({
      shape: 'flowchart_data',
      x: 600,
      y: 60,
    })

    graph.addNode({
      shape: 'flowchart_database',
      x: 60,
      y: 200,
    })

    graph.addNode({
      shape: 'flowchart_decision',
      x: 180,
      y: 180,
    })

    graph.addNode({
      shape: 'flowchart_delay',
      x: 320,
      y: 200,
    })

    graph.addNode({
      shape: 'flowchart_direct_data',
      x: 460,
      y: 200,
    })

    graph.addNode({
      shape: 'flowchart_display',
      x: 600,
      y: 200,
    })

    graph.addNode({
      shape: 'flowchart_document',
      x: 40,
      y: 320 + 20,
    })

    graph.addNode({
      shape: 'flowchart_extract_or_measurement',
      x: 180,
      y: 320 + 20,
    })

    graph.addNode({
      shape: 'flowchart_internal_storage',
      x: 330,
      y: 320 + 10,
    })

    graph.addNode({
      shape: 'flowchart_loop_limit',
      x: 460,
      y: 320 + 20,
    })

    graph.addNode({
      shape: 'flowchart_manual_input',
      x: 600,
      y: 320 + 20,
    })

    graph.addNode({
      shape: 'flowchart_manual_operation',
      x: 40,
      y: 460 + 20,
    })

    graph.addNode({
      shape: 'flowchart_merge_or_storage',
      x: 180,
      y: 460 + 20,
    })

    graph.addNode({
      shape: 'flowchart_multi_document',
      x: 320 + 10,
      y: 460 + 20,
    })

    graph.addNode({
      shape: 'flowchart_off_page_reference',
      x: 460 + 20,
      y: 460 + 20,
    })

    graph.addNode({
      shape: 'flowchart_on_page_reference',
      x: 600 + 20,
      y: 460 + 20,
    })

    graph.addNode({
      shape: 'flowchart_or',
      x: 40 + 20,
      y: 600 + 20,
    })

    graph.addNode({
      shape: 'flowchart_paper_tape',
      x: 180,
      y: 600 + 20,
    })

    graph.addNode({
      shape: 'flowchart_parallel_mode',
      x: 320,
      y: 600 + 30,
    })

    graph.addNode({
      shape: 'flowchart_predefined_process',
      x: 460,
      y: 600 + 20,
    })

    graph.addNode({
      shape: 'flowchart_preparation',
      x: 600,
      y: 600 + 20,
    })

    graph.addNode({
      shape: 'flowchart_process',
      x: 40,
      y: 740,
    })

    graph.addNode({
      shape: 'flowchart_sequential_data',
      x: 180,
      y: 740,
    })

    graph.addNode({
      shape: 'flowchart_sort',
      x: 320,
      y: 740,
    })

    graph.addNode({
      shape: 'flowchart_start',
      x: 460,
      y: 740,
    })

    graph.addNode({
      shape: 'flowchart_start',
      x: 600,
      y: 740 + 20,
      width: 100,
      height: 60,
    })

    graph.addNode({
      shape: 'flowchart_stored_data',
      x: 40,
      y: 880 + 20,
    })

    graph.addNode({
      shape: 'flowchart_summing_function',
      x: 180 + 15,
      y: 880 + 15,
    })

    graph.addNode({
      shape: 'flowchart_terminator',
      x: 320,
      y: 880 + 20,
    })

    graph.addNode({
      shape: 'flowchart_transfer',
      x: 460,
      y: 880 + 20,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
