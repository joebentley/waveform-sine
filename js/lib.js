/* globals Two */

var lib = {}

;(function (ns) {
  ns.runApp = function (canvasContainer) {
    var two = new Two({ width: 500, height: 500 }).appendTo(canvasContainer)

    var circle = two.makeCircle(100, 100, 20, 20)
    circle.fill = 'orangered'

    two.update()
  }
})(lib)
