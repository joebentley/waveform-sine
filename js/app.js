/* globals $ lib MathJax */

/* Run app when all MathJax has loaded. */
MathJax.Hub.Queue(function () {
  // Unhide diagram
  $('#hiddenMathJax').css('visibility', '')

  // Get diagram container and run app
  var elem = $('#diagramContainer')[0]
  var freqSlider = $('#frequencyInput')
  var ampSlider = $('#amplitudeInput')
  var freqOutput = $('#frequencyOutput')
  var ampOutput = $('#amplitudeOutput')

  // Set default values for outputs
  $(freqOutput).text(Number($(freqSlider).val()).toFixed(1))
  $(ampOutput).text(Number($(ampSlider).val()).toFixed(1))

  lib.runApp(elem, freqSlider, ampSlider, freqOutput, ampOutput)
})
