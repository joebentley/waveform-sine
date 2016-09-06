/* globals $ lib MathJax */

/* Run app when all MathJax has loaded. */
MathJax.Hub.Queue(function () {
  // Unhide diagram
  $('#hidden').css('visibility', '')

  // Get diagram container and run app
  var elem = $('#diagramContainer')[0]
  var phaseSlider = $('#phaseInput')
  var freqSlider = $('#frequencyInput')
  var ampSlider = $('#amplitudeInput')
  var phaseOutput = $('#phaseOutput .mjx-mn > .mjx-char')
  var freqOutput = $('#frequencyOutput .mjx-mn > .mjx-char')
  var ampOutput = $('#amplitudeOutput .mjx-mn > .mjx-char')
  var timeDelayOutput = $('#timeDelayOutput .mjx-mn > .mjx-char')

  // Set default values for outputs
  $(freqOutput).text(Number($(freqSlider).val()).toFixed(1))
  $(ampOutput).text(Number($(ampSlider).val()).toFixed(1))

  lib.runApp(elem, phaseSlider, freqSlider, ampSlider, phaseOutput, freqOutput, ampOutput, timeDelayOutput)
})
