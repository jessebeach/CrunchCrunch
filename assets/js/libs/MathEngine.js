/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */
 
/*global define: true */

define(
  [],
  function () {
    // Return a function so that the 'new' operator can be used.
    return function () {
    	// Input parsing regular expressions.
    	var validator = /^$/;
    	// Private functions.
      function interpret(input) {
      	return a = validator.exec(input);
      }
      // Return an object of public methods for the engine.
      return {
        calculate: function (input) {
        	return interpret(input);
        }
      };
    };
  }
);