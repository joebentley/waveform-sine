/* globals $ JXG requestAnimationFrame */

var lib = {}

;(function (ns) {
  ns.runApp = function (sineContainer, phasorContainer, phaseSlider, freqSlider, ampSlider,
                        phaseOutput, freqOutput, ampOutput, timeDelayOutput) {
    // Sine wave parameters
    var amplitude = 5
    var frequency = 0.1
    var phase = 0 // In units of per radian

    // Sine wave plot
    var sineBoard = JXG.JSXGraph.initBoard(sineContainer.id, {
      boundingbox: [-6, 6, 6, -6],
      keepaspectratio: false,
      showCopyright: false,
      needsRegularUpdate: true
    })

    // Draw axes on board
    sineBoard.create('axis', [[0, 0], [0, 1]], {
      name: 'V(t)',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [20, 0]
      }
    })

    sineBoard.create('axis', [[0, 0], [1, 0]], {
      name: 't',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [0, 10]
      }
    })

    // Draw initial sine waves
    var sineUnshifted = sineBoard.create('functiongraph', function (t) {
      return amplitude * Math.sin(2 * Math.PI * frequency * t)
    }, {strokeColor: 'red'})

    var sineShifted = sineBoard.create('functiongraph', function (t) {
      return amplitude * Math.sin(2 * Math.PI * frequency * t + phase * Math.Pi)
    }, {strokeColor: 'blue'})

    // Phasor plot
    var phasorBoard = JXG.JSXGraph.initBoard(phasorContainer.id, {
      boundingbox: [-6, 6, 6, -6],
      keepaspectratio: false,
      showCopyright: false,
      needsRegularUpdate: true
    })

    // Draw axes on board
    phasorBoard.create('axis', [[0, 0], [1, 0]], {
      name: 'Re',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [0, 10]
      }
    })
    phasorBoard.create('axis', [[0, 0], [0, 1]], {
      name: 'Im',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [20, 0]
      }
    })

    // Draw initial phasors on board
    var lineUnshifted = phasorBoard.create('line', [[0, 0], [1, 0]],
      {straightFirst: false, straightLast: false, lastArrow: true, strokeColor: 'red'})
    lineUnshifted.isDraggable = false

    var lineShifted = phasorBoard.create('line', [[0, 0], [1, 0]],
      {straightFirst: false, straightLast: false, lastArrow: true})
    lineShifted.isDraggable = false

    var angleArc = phasorBoard.create('arc', [[0, 0], [1, 0], [0, 1]])
    angleArc.center.setAttribute({visible: false})
    angleArc.point2.setAttribute({visible: false})
    angleArc.point3.setAttribute({visible: false})

    function redraw () {
      // Update phasor angles
      lineUnshifted.point2.setPosition(JXG.COORDS_BY_USER, [amplitude, 0])
      lineShifted.point2.setPosition(JXG.COORDS_BY_USER,
        [amplitude * Math.cos(phase * Math.PI), amplitude * Math.sin(phase * Math.PI)])
      angleArc.point3.setPosition(JXG.COORDS_BY_USER,
        [Math.cos(phase * Math.PI), Math.sin(phase * Math.PI)])

      // Draw sine wave
      sineUnshifted.Y = function (t) {
        return amplitude * Math.sin(2 * Math.PI * frequency * t)
      }
      sineShifted.Y = function (t) {
        return amplitude * Math.sin(2 * Math.PI * frequency * t + phase * Math.PI)
      }
      sineUnshifted.updateCurve()
      sineShifted.updateCurve()

      sineBoard.fullUpdate()
      phasorBoard.fullUpdate()
    }

    if (phaseSlider !== undefined) {
      $(phaseSlider).on('input', function () {
        phase = Number(this.value)

        if (phaseOutput !== undefined) {
          $(phaseOutput).text(phase.toFixed(2))

          // Update time delay output
          if (timeDelayOutput !== undefined) {
            $(timeDelayOutput).text((phase / (2 * frequency)).toFixed(3))
          }
        }

        requestAnimationFrame(redraw)
      })
    }

    if (freqSlider !== undefined) {
      $(freqSlider).on('input', function () {
        frequency = Number(this.value)

        if (freqOutput !== undefined) {
          $(freqOutput).text(frequency.toFixed(1))

          // Update time delay output
          if (timeDelayOutput !== undefined) {
            $(timeDelayOutput).text((phase / (2 * frequency)).toFixed(3))
          }
        }

        requestAnimationFrame(redraw)
      })
    }

    if (ampSlider !== undefined) {
      $(ampSlider).on('input', function () {
        amplitude = Number(this.value)

        if (ampOutput !== undefined) {
          $(ampOutput).text(amplitude.toFixed(1))
        }

        requestAnimationFrame(redraw)
      })
    }

    requestAnimationFrame(redraw)
  }
})(lib)
