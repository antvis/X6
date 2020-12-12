import { Model } from '@antv/x6'
import { Star, Name, Connection } from './shapes'

export class Universe extends Model {
  getConstellation(name: string) {
    var constellationStars = []
    var stars = this.getNodes()
    for (var i = 0, n = stars.length; i < n; i++) {
      var star = stars[i]
      if (star.prop('constellation') === name) {
        constellationStars.push(star)
      }
    }
    return constellationStars
  }

  getConstellationBBox(name: string) {
    return this.getCellsBBox(this.getConstellation(name))
  }

  loadConstellations(constellations: any) {
    for (var name in constellations) {
      var constellation = constellations[name]
      var stars = constellation.stars || []
      // Add stars
      for (var i = 0, n = stars.length; i < n; i++) {
        var star = stars[i]
        new Star({ id: name + '-' + i })
          .position(star.x, star.y)
          .prop('constellation', name)
          .addTo(this)
      }
      // Add connections
      var connections = constellation.connections || []
      for (var j = 0, m = connections.length; j < m; j++) {
        var connection = connections[j]
        new Connection({
          source: { cell: name + '-' + connection[0] },
          target: { cell: name + '-' + connection[1] },
          constellation: name,
        }).addTo(this)
      }
      // Add constellation name
      var center = this.getConstellationBBox(name)!.getCenter()
      new Name()
        .attr('text/text', name.toUpperCase())
        .position(center.x, center.y)
        .prop('constellation', name)
        .addTo(this)
    }
  }

  highlightConstellation(name: string) {
    var constellation = this.getConstellation(name)
    var subgraph = this.getSubGraph(constellation)
    for (var i = 0, n = subgraph.length; i < n; i++) {
      var cell = subgraph[i]
      if (cell.isEdge()) {
        (cell as Connection).highlight()
      }
    }
  }

  unhighlightConstellation(name: string) {
    var constellation = this.getConstellation(name)
    var subgraph = this.getSubGraph(constellation)
    for (var i = 0, n = subgraph.length; i < n; i++) {
      var cell = subgraph[i]
      if (cell.isEdge()) {
        (cell as Connection).unhighlight()
      }
    }
  }
}
