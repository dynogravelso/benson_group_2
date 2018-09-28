/**
 * Logger - simple for now
 *
 * create a logger in your module like so:
 * var logger = loggerFactory.getInstance(module.id);
 * logger.info(msg)
 * logger.warn(msg, {some: 'thing'})
 *
 * todo: create config options for enabling/disabling per environment
 * todo: create config options for enabling/disabling channels
 *
 */
define('logger', ['module', 'jquery', 'window'], function(module, $, window, undefined) {
    'use strict';

    /** @type {boolean} */
    var enabled = window.console && typeof window.console.log != 'undefined';

    /** @type {Object} */
    var loggers = {};

    /**
     * simple logger object.
     *
     * @param {string} channel
     * @returns {*}
     */
    function logger(channel) {
        var _this = Object.create({});

        /**
         * @param {string} msg
         * @param {*} context
         */
        function log(msg, context) {
            if (!enabled) { return; }
            writeLog('log', msg, context);
        }

        /**
         * @param {string} msg
         * @param {*} context
         */
        function debug(msg, context) {
            if (!enabled) { return; }
            writeLog('debug', msg, context);
        }

        /**
         * @param {string} msg
         * @param {*} context
         */
        function info(msg, context) {
            if (!enabled) { return; }
            writeLog('info', msg, context);
        }

        /**
         * @param {string} msg
         * @param {*} context
         */
        function warn(msg, context) {
            if (!enabled) { return; }
            writeLog('warn', msg, context);
        }

        /**
         * @param {string} msg
         * @param {*} context
         */
        function error(msg, context) {
            if (!enabled) { return; }
            writeLog('error', msg, context);
        }

        /**
         * @param {string} level
         * @param {string} msg
         * @param {*} context
         */
        function writeLog(level, msg, context) {
            if (undefined === window.console[level]) {
                level = 'log';
            }

            var label = '[' + level.toUpperCase() + '][' + channel + ']';
            var type = $.type(msg);

            if (type === 'string' || type === 'number' || type === 'boolean') {
                label += ' ' + msg.toString();
            } else {
                context = context || {};
                context._msg = msg;
            }

            if (context) {
                window.console[level](label, context);
            } else {
                window.console[level](label);
            }
        }

        /**
         * add privileged methods
         */
        _this.log = log;
        _this.debug = debug;
        _this.info = info;
        _this.warn = warn;
        _this.error = error;

        return _this;
    }

    return {
        getInstance: function getInstance(channel) {
            channel = channel || 'app';
            if (!loggers[channel]) {
                loggers[channel] = logger(channel);
            }

            return loggers[channel];
        }
    };
});