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
      var statement = [];
      // Number check.
      var numberCheck = "[0-9]+\\.{0,1}[0-9]*";
      var numberCheckReg = new RegExp(numberCheck);
      // Operator check.
      var operatorCheck = "[\\/\\*\\+\\-\\(\\)]{1}";
      var operatorCheckReg = new RegExp(operatorCheck);
      // Input parsing regular expression.
      // [0-9]+\.{0,1}[0-9]* matches integers and decimals.
      // [\/\*\+\-\(\)] matches operators and parentheses.
      // the g flag is necessary to allow looping through the input with //.exec()
      var statementChunkerReg = new RegExp(numberCheck + '|' + operatorCheck, 'g');
      // Integer vs. float parser. Returns a result for a float.
      var floatCheckReg = /[0-9]+\.{1}[0-9]+/;
      var parenCheckReg = /[\(\)]{1}/;
      // Private functions.
      function operate(operation, a, b) {
        var i,
        nums = [a, b],
        result;
        // Create Numbers from the String arguments.
        for (i = 0; i < nums.length; i++ ) {
          // Create a float or int depending on the floatCheck result.
          nums[i] = (floatCheckReg.exec(nums[i])) ? parseFloat(nums[i]) : parseInt(nums[i]);
        }
        switch (operation) {
        case '+':
          result = nums[0] + nums[1];
          break;
        case '-':
          result = nums[0] - nums[1];
          break;
        case '*':
          result = nums[0] * nums[1];
          break;
        case '/':
          // Check for division by zero and error out.
          // @TODO Requires error handling.
          if (b.indexOf('0') === 0) {
            result = NaN;
          }
          result = nums[0] / nums[1];
          break;
        default:
          result = NaN;
          break;
        }
        return result;
          
      }
      /**
       * Parse the user-provided string so that it can be
       * evaluated as a mathematic statement.
       */
      function interpret(input) {
      	var item, i = 0;
        // Loop through the regex exec function. input.length prevents the
        // while loop from executing for longer than the input is long.
        while ((item = statementChunkerReg.exec(input)) && i < input.length) {
          statement.push(item[0]);
          i++;
        }
      }
      /**
       * Execute the mathematic operations on the numbers
       * represented in the current stored statement.
       */
      function evaluate(statement) {
        // Walk through the array. 
        return operate(statement[1], statement[0], statement[2]);
      }
      /**
       * Verify that the statement has the correct structure for evaluation.
       *
       * @TODO, For now, just return true.
       */
      function verify(statement) {
        return true;
      }
      /**
       * Error handling.
       *
       * This has the potential to be more robust.
       */
      function error(message) {
        return "Error: " + message;
      }
      // Public methods.
      return {
        // Return the current stored statement as a string.
        check: function () {
          return statement.join(" ");
        },
        // Evaluate the current stored statement.
        calculate: function (input) {
          interpret(input);
          // The input is now stored in the MathEngine as the statement.
          if (!verify(statement)) {
            return error('The supplied expression is not formatted correctly.');
          }
          return evaluate(statement);
        }
      };
    };
  }
);