/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */
 
/*global define: true */

/**
 * MathEngine
 *
 * The MathEngine stores a single expression and provides methods to
 * store that expression, print it and evaluate it.
 */

define(
  [],
  function () {
    // Return a function so that the 'new' operator can be used.
    return function () {
      // The current active expression.
      // @TODO this will eventually be an array.
      var expression = [];
      // Number check.
      var numberCheck = "\\-?[0-9]+\\.?[0-9]*";
      var numberCheckReg = new RegExp(numberCheck);
      // Operator check.
      var operatorCheck = "[\\/\\*\\+\\-\\(\\)]{1}";
      var operatorCheckReg = new RegExp(operatorCheck);
      // Input parsing regular expression.
      // [0-9]+\.{0,1}[0-9]* matches integers and decimals.
      // [\/\*\+\-\(\)] matches operators and parentheses.
      // the g flag is necessary to allow looping through the input with //.exec()
      var expressionChunkerReg = new RegExp(numberCheck + '|' + operatorCheck, 'g');
      // Integer vs. float parser. Returns a result for a float.
      var floatCheckReg = /\-?[0-9]+\.{1}[0-9]+/;
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
        return result.toString();
          
      }
      /**
       * Parse the user-provided string so that it can be
       * evaluated as a mathematic expression.
       */
      function interpret(input) {
      	var item, i = 0;
        // Loop through the regex exec function. input.length prevents the
        // while loop from executing for longer than the input is long.
        while ((item = expressionChunkerReg.exec(input)) && i < input.length) {
          expression.push(item[0]);
          i++;
        }
      }
      /**
       * Execute the mathematic operations on the numbers
       * represented in the current stored expression.
       *
       * This function evaluates "triplets" in the expression array that represents
       * the equation string provided by the user.
       *
       * When a new evaluation context is opened through a parentheses, the evaluate
       * function recurses.
       */
      function evaluate(expression) {
        var i = 1,
        temp= [];
        // Evaluate all the multiplication and division first.
        while (i < expression.length) {
          // The end of the context is reached.
          // Break out of the while loop.
          if (/\)/.exec(expression[i])) {
            i = expression.length;
            continue;
          }
          // The first item of the triplet is an open parenthesis.
          // Open a new context.
          if (/\(/.exec(expression[i - 1])) {
            expression.splice((i - 1), 1);
            // Create a new evaluation context.
            expression = evaluate(expression);
          }
          // Check for multiplication or division.
          if (/[\*\\]/.exec(expression[i])) {
            // The last item of the triplet is an open parenthesis.
            if (/\(/.exec(expression[i + 1])) {
            // Open a new context and evaluate it.
              temp = evaluate(expression.slice((i + 2)));
              // Slice the known expression up to the new context and concat it
              // with the evaluated new context array.
              expression = expression.slice(0, (i + 1)).concat(temp);
            }
            // We move through each triplet in the array and evaluate.
            expression.splice((i - 1), 3, operate(expression[i], expression[i - 1], expression[i + 1]));
          }
          // If the operator isn't multiplication or division, move to the next triplet.
          else {
            i += 2;
          }
        }
        // Evaluate the addition and subtraction.
        i = 1;
        while (i < expression.length) {
          // The end of the context is reached.
          // Break out of the while loop.
          if (/\)/.exec(expression[i])) {
            expression.splice(i, 1);
            return expression;
          }
          // The first item of the triplet is an open parenthesis.
          // Open a new context.
          if (/\(/.exec(expression[i - 1])) {
            expression.splice((i - 1), 1);
            // Create a new evaluation context.
            expression = evaluate(expression);
          }
          expression.splice((i - 1), 3, operate(expression[i], expression[i - 1], expression[i + 1]));
        }
        return expression;
      }
      /**
       * Verify that the expression has the correct structure for evaluation.
       *
       * @TODO, For now, just return true.
       */
      function verify(expression) {
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
        // Return the current stored expression as a string.
        check: function () {
          return expression.join(" ");
        },
        // Evaluate the current stored expression.
        calculate: function (input) {
          interpret(input);
          // The input is now stored in the MathEngine as the expression.
          if (!verify(expression)) {
            return error('The supplied expression is not formatted correctly.');
          }
          // Make a copy of the expression and evaluate it.
          return evaluate(expression.slice(0, expression.length));
        }
      };
    };
  }
);