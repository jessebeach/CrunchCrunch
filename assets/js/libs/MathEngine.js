/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */
 
/*global define: true */

/**
 * MathEngine
 *
 * The MathEngine stores a single statement and provides methods to
 * store that statement, print it and evaluate it.
 */

define(
  [],
  function () {
    // Return a function so that the 'new' operator can be used.
    return function () {
      // The current active statement.
      // @TODO this will eventually be an array.
      var statement = '';
      // Input parsing regular expression.
      var validator = /^$/;
      // Private functions.
      /**
       * Parse the user-provided string so that it can be
       * evaluated as a mathematic statement.
       */
      function interpret(input) {
        statement = validator.exec(input);
      }
      /**
       * Execute the mathematic operations on the numbers
       * represented in the current stored statement.
       */
      function evaluate(statement) {
        // For now just return the statement until processing
        // is in place.
        return statement;
      }
      // Public methods.
      return {
        // Save the input as an interpreted statement.
        record: function (input) {
          interpret(input);
        },
        // Return the current stored statement.
        // @TODO This requires an implode when the statement
        // is eventually stored as an array.
        check: function () {
          return statement;
        },
        // Evaluate the current stored statement.
        calculate: function () {
          return evaluate(statement);
        }
      };
    };
  }
);