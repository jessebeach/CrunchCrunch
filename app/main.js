require([
  // Libs
  "jquery",

  // Modules
],

function($) {

	// Number pad handler
	function numpadHandler (event) {
		console.info('num pad handler');
	}
	
	// Operation pad handler
	function operationPadHandler (event) {
		console.info('op handler')
	}
	
	/**
	 * A general purpose function that checks allowed keys configured
	 * as part of the event handler registry and calls 
	 * the configured function if the triggering key is part of the allowed set.
	 * 
	 * event.data.keys (Array): The allowed keys
	 * event.data.fn (Function): The function to call
	 */
	function keyManager (event) {
		if ($.inArray(event.charCode, event.data.keys) > -1) {
			event.data.fn(event);
		}
	}
	
	$('.calculator')
	.on({
		'click': numpadHandler,
	}, '.numpad a')
	// Capture number key presses.
	$(document)
	.on({
		'keypress': keyManager
	}, {fn: numpadHandler, keys: [48,49,50,51,52,53,54,55,56,57]})
	.on({
		'keypress': keyManager
	}, {fn: operationPadHandler, keys: [42,43,45,47,61]});
});
