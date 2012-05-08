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
  // Calucation display bar.
  var i,
  // Temp objects for wrappers and clones.
  temp,
  $temp,
  $calculator = $('.calculator'),
  $display = $('.display'),
  $numPad = $('.numpad'),
  $operationsPad = $('.operations'),
  $parenButtons = $('.paren'),
  // The expression to be calculated and the result of the calculation.
  expression = '',
  result = '';
  // Instantiate a new MathEngine.
  var engine = new MathEngine();
  // The calculator has methods for updating the application.
  var calculator = {
    scope: false,
    append: function (symbol) {
      var sym = $.trim(symbol);
      var isDigit = /[\d\.]{1}/.exec(sym);
      // Get the last character of the expression.
      // It will determine if a preceding space is needed.
      var lastChar = expression.charAt((expression.length - 1));
      var isLastCharDigit = /[\d\.]{1}/.exec(lastChar);
      var spacer = (isDigit && isLastCharDigit) ? "" : " ";
      expression += spacer + sym;
      $calculator.trigger('refresh');
    },
    toggleScope: function (symbol) {
      this.scope = !this.scope;
      expression += symbol;
      $calculator
      .trigger('scopeToggle')
      .trigger('refresh');
    },
    calculate: function () {
      result = engine.calculate(expression);
      $calculator.trigger('refresh');
    },
    clear: function () {
      $calculator.trigger('clear');
    }
  };
  // Number pad keys.
  var numKeys = [
    {
      key: 49,
      text: '1',
      callback: $.proxy(calculator.append, calculator, '1')
    },
    {
      key: 50,
      text: '2',
      callback: $.proxy(calculator.append, calculator, '2')
    },
    {
      key: 51,
      text: '3',
      callback: $.proxy(calculator.append, calculator, '3')
    },
    {
      key: 52,
      text: '4',
      callback: $.proxy(calculator.append, calculator, '4')
    },
    {
      key: 53,
      text: '5',
      callback: $.proxy(calculator.append, calculator, '5')
    },
    {
      key: 54,
      text: '6',
      callback: $.proxy(calculator.append, calculator, '6')
    },
    {
      key: 55,
      text: '7',
      callback: $.proxy(calculator.append, calculator, '7')
    },
    {
      key: 56,
      text: '8',
      callback: $.proxy(calculator.append, calculator, '8')
    },
    {
      key: 57,
      text: '9',
      callback: $.proxy(calculator.append, calculator, '9')
    },
    {
      key: 46,
      text: '.',
      callback: $.proxy(calculator.append, calculator, '.')
    },
    {
      key: 48,
      text: '0',
      callback: $.proxy(calculator.append, calculator, '0')
    }
  ];
  // Operation pad keys.
  var operationKeys = [
    {
      key: 40,
      text: '(',
      callback: $.proxy(calculator.toggleScope, calculator, '(')
    },
    {
      key: 41,
      text: ')',
      callback: $.proxy(calculator.toggleScope, calculator, ')')
    },
    {
      key: 43,
      text: '+',
      callback: $.proxy(calculator.append, calculator, '+')
    },
    {
      key: 45,
      text: '-',
      callback: $.proxy(calculator.append, calculator, '-')
    },
    {
      key: 42,
      text: '*',
      callback: $.proxy(calculator.append, calculator, '*')
    },
    {
      key: 47,
      text: '/',
      callback: $.proxy(calculator.append, calculator, '/')
    },
    {
      text: 'C',
      callback: $.proxy(calculator.clear, calculator)
    },
    {
      key: 61,
      text: '=',
      callback: $.proxy(calculator.calculate, calculator)
    },
    {
      key: 13,
      callback: $.proxy(calculator.calculate, calculator)
    },
    {
      key: 8,
      callback: $.proxy(calculator.clear, calculator)
    }
  ];
  /**
   * Handle button clicks.
   */
  function clickHandler(event) {
    event.preventDefault();
    var data = $(this).data('calculator') || {};
    if ('callback' in data && $.isFunction(data.callback)) {
      data.callback();
    }
  }
  /**
   * Handle key clicks.
   */
  function keyHandler(event) {
    // Prevent the delete/backspace button from navigation off the page.
    if (event.keyCode === 8 && event.type === 'keydown') {
      event.preventDefault();
    }
    if(event.type === 'keypress' || (event.keyCode === 8 && event.type === 'keydown')) {
      var keys = [].concat(numKeys, operationKeys);
      for (var key in keys) {
        if (keys.hasOwnProperty(key)) {
          if ('key' in keys[key] && 'callback' in keys[key]) {
            if (event.keyCode === keys[key].key) {
              keys[key].callback();
              return;
            }
          }
        }
      }
    }
  }
  /**
   * Clears the calculator.
   */
  function clear(all) {
    result = expression = '';
  }
  /**
   * Update the user input textfield and button states.
   */
  function updateDisplay(event) {
    if (result.length > 0) {
      $display.val(result);
    }
    else if (expression.length > 0) {
      $display.val(expression);
    }
    else {
      $display.val('');
    }
  }
  // Build the number pad.
  // This could probably be pulled into its own sub-module.
  for (var key in numKeys) {
    if (numKeys.hasOwnProperty(key)) {
      // Create the individual number pad buttons.
      $('<a>', {
        href: '#',
        html: $('<span>', {
          text: numKeys[key].text
        })
      })
      .data('calculator', {
        key: numKeys[key].key,
        callback: numKeys[key].callback
      })
      .addClass('button')
      .appendTo($numPad);
    }
  };
  // Build the operations pad.
  // This could probably be pulled into its own sub-module.
  for (var key in operationKeys) {
    if (operationKeys.hasOwnProperty(key)) {
      if ('text' in operationKeys[key]) {
        // Create the individual number pad buttons.
        $('<a>', {
          href: '#',
          html: $('<span>', {
            text: operationKeys[key].text
          })
        })
        .data('calculator', {
          key: operationKeys[key].key,
          callback: operationKeys[key].callback
        })
        .addClass('button')
        .appendTo($operationsPad);
      }
    }
  };
  
  // Define compound callbacks.
	var displayClearCallbacks = $.Callbacks();
	displayClearCallbacks.add(clear);
	displayClearCallbacks.add(updateDisplay);

  // Attach UI event handlers.
  $calculator
  // Capture number clicks.
  .on({
    'click': clickHandler
  }, '.button')
  // Update the state of the UI.
  .on({
    'refresh': updateDisplay
  })
  // Show the result of a calculation.
  .on({
    'clear': displayClearCallbacks.fire
  });
  // Capture key presses.
  $(document)
  .on({
    'keypress': keyHandler,
    'keydown': keyHandler
  });
});
