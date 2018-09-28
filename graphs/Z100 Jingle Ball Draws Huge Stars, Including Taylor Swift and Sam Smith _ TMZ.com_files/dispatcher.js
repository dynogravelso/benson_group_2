/**
 * Dispatcher
 *
 * using simply jquery style events for now since i don't
 * want to require backbone.
 *
 * .on('event_name', func(evt, arg1, arg2)
 * .trigger('event_name', [arg1, arg2])
 *
 * note that jquery passes event object to handler and backbone does not.
 *
 *
 */
define('dispatcher', ['jquery'], function($) {
    'use strict';
    return $('<div/>');
    //return _.clone(Backbone.Events);
});