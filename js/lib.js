/* globals Two $ JXG */

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
   *   numTicks,      // number of ticks on each axis. Defaults to 10.
   *   tickSpacing,   // { x, y } spacing of ticks in the x, y direction. Defaults
   *                  // to { x: rect.width / numTicks, y: rect.height / numTicks }
   *   tickLength,    // length in pixels of the tickmark rendered on the grid. Defaults to 10.
   *   numSubTicks,   // number of subticks per tick, set to 0 to not render. Defaults to 10.
   *   subTickLength, // length in pixels of sub tickmark. Defaults to 6.
   *   gridlines      // true if you want gridlines on each tick, defaults to true
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
    this.numSubTicks = options.numSubTicks
    this.subTickLength = options.subTickLength
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
    if (this.numSubTicks === undefined) {
      this.numSubTicks = 10
    }
    if (this.subTickLength === undefined) {
      this.subTickLength = 6
    }
    if (this.gridlines === undefined) {
      this.gridlines = true
    }

    this.subTickSpacing = {
      x: this.tickSpacing.x / this.numSubTicks,
      y: this.tickSpacing.y / this.numSubTicks
    }
  }

  /* Draw the grid onto the two.js instance */
  ns.Grid.prototype.draw = function (two) {
    var gridX
    var gridY
    var gridlineColor = '#ddd'
    var numXLines = this.rect.width / this.tickSpacing.x
    var numYLines = this.rect.height / this.tickSpacing.y

    for (var x = 0; x <= numXLines; x++) {
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

      // Draw time markers
      var xOffset = 0

      if (x === numXLines / 2) {
        xOffset = 10
      }

      two.scene.add(new Two.Text(x - numXLines / 2,
        x * this.tickSpacing.x + this.rect.x + xOffset,
        this.center.y + this.tickLength / 2 + 10,
        { 'family': 'serif', 'size': '16' }))

      // Draw horizontal sub tickmarks, and don't draw the last set of subticks
      if (this.numSubTicks > 0 && x !== numXLines) {
        for (var i = 0; i < this.numSubTicks; i++) {
          two.makeLine(
            x * this.tickSpacing.x + i * this.subTickSpacing.x + this.rect.x,
            this.center.y - this.subTickLength / 2,
            x * this.tickSpacing.x + i * this.subTickSpacing.x + this.rect.x,
            this.center.y + this.subTickLength / 2
          ).linewidth = 0.5
        }
      }
    }

    for (var y = 0; y <= numYLines; y++) {
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

      // Draw vertical sub tickmarks, and don't draw the last set of subticks
      if (this.numSubTicks > 0 && y !== numYLines) {
        for (i = 0; i < this.numSubTicks; i++) {
          two.makeLine(
            this.center.x - this.subTickLength / 2,
            y * this.tickSpacing.y + i * this.subTickSpacing.y + this.rect.y,
            this.center.x + this.subTickLength / 2,
            y * this.tickSpacing.y + i * this.subTickSpacing.y + this.rect.y
          ).linewidth = 0.5
        }
      }
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

  ns.drawSine = function (two, grid, amplitude, frequency, phase, colour) {
    var numPoints = 1000
    var vertices = []
    var scaledVertices = []
    var t = -grid.numTicks / 2
    var tSpacing = grid.numTicks / numPoints

    // Calculate points of the sine wave
    for (var i = 0; i < numPoints; i++) {
      vertices[i] = {
        x: t,
        y: amplitude * Math.sin(2 * Math.PI * frequency * t + phase * Math.PI)
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
    path.stroke = colour

    two.add(path)
  }

  ns.runApp = function (canvasContainer, phasorContainer, phaseSlider, freqSlider, ampSlider,
                        phaseOutput, freqOutput, ampOutput, timeDelayOutput) {
    // Start two.js and add grid instance
    var two = new Two({ width: 500, height: 500 }).appendTo(canvasContainer)

    var edgeOffset = 10
    var grid = new ns.Grid({
      x: edgeOffset, y: edgeOffset,
      width: two.width - 2 * edgeOffset, height: two.height - 2 * edgeOffset
    }, {
      numSubTicks: 4
    })

    // Phasor plot
    var board = JXG.JSXGraph.initBoard(phasorContainer.id, {
      boundingbox: [-6, 6, 6, -6],
      keepaspectratio: false,
      showCopyright: false,
      needsRegularUpdate: true
    })

    // Draw axes on board
    board.create('axis', [[0, 0], [1, 0]], {
      name: 'Re',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [0, 10]
      }
    })
    board.create('axis', [[0, 0], [0, 1]], {
      name: 'Im',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [20, 0]
      }
    })

    // Draw initial phasors on board
    var lineUnshifted = board.create('line', [[0, 0], [1, 0]],
      {straightFirst: false, straightLast: false, lastArrow: true, strokeColor: 'red'})
    lineUnshifted.isDraggable = false

    var lineShifted = board.create('line', [[0, 0], [1, 0]],
      {straightFirst: false, straightLast: false, lastArrow: true})
    lineShifted.isDraggable = false

    var angleArc = board.create('arc', [[0, 0], [1, 0], [0, 1]])
    angleArc.center.setAttribute({visible: false})
    angleArc.point2.setAttribute({visible: false})
    angleArc.point3.setAttribute({visible: false})

    var amplitude = 5
    var frequency = 0.1
    var phase = 0 // In units of per radian

    function redraw () {
      two.clear()
      grid.draw(two)
      ns.drawSine(two, grid, amplitude, frequency, 0, 'red')
      ns.drawSine(two, grid, amplitude, frequency, phase, 'blue')
      two.update()

      // Update phasor angles
      lineUnshifted.point2.setPosition(JXG.COORDS_BY_USER, [amplitude, 0])
      lineShifted.point2.setPosition(JXG.COORDS_BY_USER,
        [amplitude * Math.cos(phase * Math.PI), amplitude * Math.sin(phase * Math.PI)])
      angleArc.point3.setPosition(JXG.COORDS_BY_USER,
        [Math.cos(phase * Math.PI), Math.sin(phase * Math.PI)])

      board.fullUpdate()
    }

    if (phaseSlider !== undefined) {
      $(phaseSlider).on('input', function () {
        phase = Number(this.value)
        redraw()

        if (phaseOutput !== undefined) {
          $(phaseOutput).text(phase.toFixed(2))

          // Update time delay output
          if (timeDelayOutput !== undefined) {
            $(timeDelayOutput).text((phase / (2 * frequency)).toFixed(3))
          }
        }
      })
    }

    if (freqSlider !== undefined) {
      $(freqSlider).on('input', function () {
        frequency = Number(this.value)
        redraw()

        if (freqOutput !== undefined) {
          $(freqOutput).text(frequency.toFixed(1))

          // Update time delay output
          if (timeDelayOutput !== undefined) {
            $(timeDelayOutput).text((phase / (2 * frequency)).toFixed(3))
          }
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
