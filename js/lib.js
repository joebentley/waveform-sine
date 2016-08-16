/* globals Two $ */

var lib = {}

;(function (ns) {
  ns.Point = function (x, y) {
    this.x = x
    this.y = y
  }

  // Grid

  /* @param{rect} rectangle { x, y, width, height } bounding the grid.
   * @params{options} object of the form:
   * var options = {
   *   numTicks,    // number of ticks on each axis. Defaults to 10.
   *   tickSpacing, // { x, y } spacing of ticks in the x, y direction. Defaults
   *                // to { x: rect.width / numTicks, y: rect.height / numTicks }
   *   tickLength,  // length in pixels of the tickmark rendered on the grid. Defaults to 10.
   *   gridlines    // true if you want dashed gridlines on each tick, defaults to true
   * }
   */
  ns.Grid = function (rect, options) {
    if (options === undefined) {
      options = {}
    }

    this.rect = rect
    this.numTicks = options.numTicks
    this.tickSpacing = options.tickSpacing
    this.tickLength = options.tickLength
    this.gridlines = options.gridlines
    this.center = { x: (this.rect.width / 2) + this.rect.x,
                    y: (this.rect.height / 2) + this.rect.y }

    if (this.numTicks === undefined) {
      this.numTicks = 10
    }
    if (this.tickSpacing === undefined) {
      this.tickSpacing = { x: rect.width / this.numTicks, y: rect.height / this.numTicks }
    }
    if (this.tickLength === undefined) {
      this.tickLength = 10
    }
    if (this.gridlines === undefined) {
      this.gridlines = true
    }
  }

  /* Draw the grid onto the two.js instance */
  ns.Grid.prototype.draw = function (two) {
    var gridX
    var gridY
    var gridlineColor = '#ddd'

    for (var x = 0; x <= this.rect.width / this.tickSpacing.x; x++) {
      // Draw horizontal gridlines
      if (this.gridlines) {
        gridX = two.makeLine(x * this.tickSpacing.x + this.rect.x, this.rect.y,
          x * this.tickSpacing.x + this.rect.x, this.rect.height + this.rect.y)

        gridX.linewidth = 1
        gridX.stroke = gridlineColor
      }

      // Draw horizontal tickmarks
      two.makeLine(x * this.tickSpacing.x + this.rect.x, this.center.y - this.tickLength / 2,
        x * this.tickSpacing.x + this.rect.x, this.center.y + this.tickLength / 2)
    }

    for (var y = 0; y <= this.rect.height / this.tickSpacing.y; y++) {
      // Draw vertical gridlines
      if (this.gridlines) {
        gridY = two.makeLine(this.rect.x, y * this.tickSpacing.y + this.rect.y,
                this.rect.height + this.rect.x, y * this.tickSpacing.y + this.rect.y)

        gridY.linewidth = 1
        gridY.stroke = gridlineColor
      }

      // Draw vertical tickmarks
      two.makeLine(this.center.x - this.tickLength / 2, y * this.tickSpacing.y + this.rect.y,
        this.center.x + this.tickLength / 2, y * this.tickSpacing.y + this.rect.y)
    }

    // Finally, draw the vertical and horizontal axes
    two.makeLine(this.center.x, this.rect.y, this.center.x, this.rect.height + this.rect.y)
    two.makeLine(this.rect.x, this.center.y, this.rect.width + this.rect.x, this.center.y)
  }

  /* Transform right-handed grid coordinates into left-handed, scaled screen coordinates */
  ns.Grid.prototype.gridToScreenCoords = function (point) {
    return new ns.Point(point.x * this.tickSpacing.x + this.center.x,
                       -point.y * this.tickSpacing.y + this.center.y)
  }

  /* Transform array of points from grid to screen coordinates */
  ns.Grid.prototype.scalePoints = function (arrayOfPoints) {
    var scaled = []

    for (var i = 0; i < arrayOfPoints.length; i++) {
      scaled.push(this.gridToScreenCoords(arrayOfPoints[i]))
    }

    return scaled
  }

  ns.drawSine = function (two, grid, amplitude, frequency) {
    var numPoints = 1000
    var vertices = []
    var scaledVertices = []
    var t = -grid.numTicks / 2
    var tSpacing = grid.numTicks / numPoints

    // Calculate points of the sine wave
    for (var i = 0; i < numPoints; i++) {
      vertices[i] = {
        x: t,
        y: amplitude * Math.sin(2 * Math.PI * frequency * t)
      }

      t += tSpacing
    }

    // Scale vertices to screen coordinates
    scaledVertices = grid.scalePoints(vertices).map(function (point) {
      // Two.Path only takes Two.Anchors
      return new Two.Anchor(point.x, point.y)
    })

    var path = new Two.Path(scaledVertices, false, true)
    path.fill = 'transparent'

    two.add(path)
  }

  ns.runApp = function (canvasContainer, freqSlider, ampSlider, freqOutput, ampOutput) {
    var two = new Two({ width: 500, height: 500 }).appendTo(canvasContainer)

    var edgeOffset = 10
    var grid = new ns.Grid({ x: edgeOffset, y: edgeOffset,
      width: two.width - 2 * edgeOffset, height: two.height - 2 * edgeOffset })

    var amplitude = 5
    var frequency = 0.1

    function redraw () {
      two.clear()
      grid.draw(two)
      ns.drawSine(two, grid, amplitude, frequency)
      two.update()
    }

    if (freqSlider !== undefined) {
      $(freqSlider).on('input', function () {
        frequency = Number(this.value)
        redraw()

        if (freqOutput !== undefined) {
          $(freqOutput).text(frequency.toFixed(1))
        }
      })
    }

    if (ampSlider !== undefined) {
      $(ampSlider).on('input', function () {
        amplitude = Number(this.value)
        redraw()

        if (ampOutput !== undefined) {
          $(ampOutput).text(amplitude.toFixed(1))
        }
      })
    }

    redraw()
  }
})(lib)
