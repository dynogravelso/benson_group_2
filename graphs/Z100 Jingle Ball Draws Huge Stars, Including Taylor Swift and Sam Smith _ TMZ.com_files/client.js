/**
 * TMZ Middleware Client
 *
 */
define(
    'tmz/middleware/1.0.1/client',
    [
        'jquery', 'app', 'logger', 'module', 'window', 'document'
    ],

function($, app, loggerFactory, module, window, document, undefined) {
    'use strict';

    var logger = loggerFactory.getInstance(module.id);

    /**
     * @type {Function}
     */
    function client() {
		var host, authKey;
        var _this = Object.create({});

        /**
         * Initializes the module
         *
         * @param {string} _host
         * @param {string} _authKey
         * @return {!Object} _this
         */
        function init(_host, _authKey) {
            if (host) {
                logger.info('init already ran.');
                return _this;
            }
            host = _host;
            authKey = _authKey;

            return _this;
        }

        /**
         * Get something from the API
         *
         * @param {string} path
		 * @param {Object} args
		 * @param {Object} config
         * @return {*}
         */
        function get(path, args, config) {
			var newConfig = typeof config === 'undefined' ? {} : config;
			var args = typeof args === 'undefined' ? {} : args;
			$.extend(newConfig, {type: 'GET', data: args});
            return send(path, newConfig);
        }

        /**
         * Post something to the API
         *
         * @param {string} path
		 * @param {Object} args
		 * @param {Object} config
         * @return {*}
         */
        function post(path, args, config) {
			var newConfig = typeof config === 'undefined' ? {} : config;
			$.extend(newConfig, {type: 'POST', data: args});
            return send(path, newConfig);
        }

		/**
		 * This is where the bulk of the work is done.
		 * @param {string} path
		 * @param {Object} config
		 */
		function send(path, config) {
			var payload = typeof config.data === 'undefined' ?  {} : config.data;

			var finalConfig = {
				url: host + path,
				data: payload,
				dataType: 'json',
				 headers: {
				  'Accept': 'mobile-web/json',
					'X-TMZ-AUTH': authKey
				 }
			};
			logger.debug('authkey', authKey);
			$.extend(finalConfig, config);
			logger.debug('send', finalConfig);
			return $.ajax( finalConfig );
		}
        /**
         * Add public methods
         */
        _this.init = init;
        _this.get = get;
        _this.post = post;

		return _this;
    }

    return client();
});
