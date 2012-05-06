/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */
 
/*global require: true */

require([
  // Libs
  "jquery",
  "MathEngine"
],

function ($, MathEngine) {
  // Number pad keys.
  var numKeys = [
  	48, // 0
  	49, // 1
  	50, // 2
  	51, // 3
  	52, // 4
  	53, // 5
  	54, // 6
  	55, // 7
  	56, // 8
  	57 // 9
    ];
  // Operation pad keys.
  var operationKeys = [
  	13, // Enter
  	40, // (
  	41, // )
  	42, // *
  	43, // +
  	45, // -
  	47, // /
  	61 // =
    ];
  // Instantiate a new MathEngine.
  var engine = new MathEngine();
  /* DEVELOPING THE MATH ENGINE INPUT HANDLING */
  // Send a statement to the engine.
  engine.record('10 + 3 * 5');
  // Print the current active statement.
  console.log("MathEngine check: " + engine.check());
  // Calculate the current active statement.
  console.log("MathEngine calculate: " + engine.calculate());
  /**
   * Number pad handler.
   */
  function numPadHandler(event) {
    console.info('num pad handler');
  }
  /**
   * Operation pad handler.
   */
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
  // Attach UI event handlers.
  $('.calculator')
  // Capture number clicks.
  .on({
    'click': numPadHandler
  }, '.numpad a')
  // Capture operation key clicks.
  .on({
    'click': operationPadHandler
  }, '.operations a');
  // Capture key presses.
  $(document)
  // Capture number key presses.
  .on({
    'keypress': keyManager
  }, {fn: numPadHandler, keys: numKeys})
  // Capture operation key presses.
  .on({
    'keypress': keyManager
  }, {fn: operationPadHandler, keys: operationKeys});
});
