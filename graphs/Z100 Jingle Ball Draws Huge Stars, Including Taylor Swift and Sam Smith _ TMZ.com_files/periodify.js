!(function (win) {

  /**
   * Periodify
   *
   * Version 1.0.0
   *
   *  @author Joel Capillo <jcapillo@tmz.com>
   *
   * Convert a provided pattern into periods/cycle
   * so you can assert or predict its resulting status.
   *
   * Example use case is when on a slideshow and you have a required
   * value to turn on every 2 slides and off on the next 3 slides and repeat again (cycle/period).
   *
   * A pattern you can provide will be of:  ['on', 'on', 'off', 'off', 'off']
   *
   * Thus, you can set your pattern for periodify by:
   *   periodify.set(['on', 'on', 'off', 'off', 'off'])
   *
   * Then on the slide change, you can write:
   *   slide.on('change', function(){
   *     if(periodify.getCurrentStatus().value === 'on'){
   *       // do whatever you want if on
   *     }
   *
   *     if(periodify.getCurrentStatus().value === 'off'){
   *       // do whatever you want if off
   *     }
   *   });
   */

  'use strict';

  /**
   * Mini logger
   *
   * @return {Function}
   */
  var debug = 0 ? console.log.bind(console, '[periodify]') : function () {};


  /**
   * Initialize a `Periodify`.
   *
   * @constructor
   */
  function Periodify() {
    var self = this;
    self.trackCounter = 0;
    self.patternIndex = 0;
    self.pattern = [];
    self.initialValue = null;
    debug('initialized', self);
  }

  Periodify.prototype = {
    constructor: Periodify,

    /**
     * Sets the provided pattern. Should be called only once.
     *
     * @param  {Array} pattern the periodic/cyclic pattern Ex. ['refresh', 'no-refresh'] or [true, true, false] or [1, 1, 0]
     * @param  {Mixed} initialValue optional and if provided will be returned on the first call.
     * @public
     */
    set: function (pattern, initialValue) {
      var isValid = Array.isArray(pattern);
      if (!isValid) {
        var error = {
          message: 'Invalid pattern found.',
        };
        throw error;
      }
      this.pattern = pattern;
      this.initialValue = initialValue;
    },

    updateIndex: function () {
      this.patternIndex++;
      this.trackCounter++;
    },

    /**
     * Returns an object with current value and isInitial properties.
     *
     * @public
     */
    getCurrentStatus: function () {
      debug('currentStatus');
      var status;
      if (typeof this.initialValue !== 'undefined' && this.trackCounter === 0) {
        status = {
          value: this.initialValue,
          isInitial: true,
        };
        this.updateIndex();
        return status;
      }
      this.patternIndex = (typeof this.pattern[this.patternIndex] === 'undefined' ? 0 : this.patternIndex);
      status = {
        value: this.pattern[this.patternIndex],
        isInitial: (this.trackCounter === 0),
      };
      this.updateIndex();
      return status;
    },
  };


  // There should never be more than
  // one instance of `periodify` in an app
  var exports = win.periodify = (win.periodify || new Periodify()); // jshint ignore:line

  // Expose to CJS & AMD
  if ((typeof define) == 'function') define(function () {
    return exports;
  });
  else if ((typeof module) == 'object') module.exports = exports;

})(typeof window !== 'undefined' ? window : this);
