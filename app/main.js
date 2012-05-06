/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */
 
/*global require: true */

require([
  // Libs
  "jquery",
  "MathEngine"

  // Modules
],

function ($, MathEngine) {
  
  // Instantiate a new MathEngine
  var engine = new MathEngine();
  /* DEVELOPING THE MATHENGINE INPUT HANDLING */
  var a = engine.calculate('10 + 3 * 5');
  // Number pad handler
  function numPadHandler(event) {
    console.info('num pad handler');
  }
  
  // Operation pad handler
  function operationPadHandler(event) {
    console.info('op handler');
  }
  
  /**
   * A general purpose function that checks allowed keys configured
   * as part of the event handler registry and calls 
   * the configured function if the triggering key is part of the allowed set.
   * 
   * event.data.keys (Array): The allowed keys
   * event.data.fn (Function): The callback function
   */
  function keyManager(event) {
    if ($.inArray(event.charCode, event.data.keys) > -1) {
      event.data.fn(event);
    }
  }
  
  $('.calculator')
  .on({
    'click': numPadHandler
  }, '.numpad a')
  .on({
    'click': operationPadHandler
  }, '.operations a');
  // Capture number key presses.
  $(document)
  .on({
    'keypress': keyManager
  }, {fn: numPadHandler, keys: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]})
  .on({
    'keypress': keyManager
  }, {fn: operationPadHandler, keys: [42, 43, 45, 47, 61]});
});
