/* Copyrights 2017 Wibbitz, 3.6.35, 2018-02-28T17-35-00 */
window.wibbitz = window.wibbitz || {};

(function() {
	var PUBLISHER_ID = '48';
	/******************************************************************/
	/**
	 * common file
	 */

	var API_PREFIX = '//api.wibbitz.com/';
	var LATEST_REQUEST = API_PREFIX + 'clips/latest/?';
	var CLIP_REQUEST = API_PREFIX + 'clips/?';

	var IMG_DIR = '//cdn4.wibbitz.com/images/';
	var PLAYER_URL = '//cdn3.wibbitz.com/player';
	var PLAYER_API_URL = '//cdn3.wibbitz.com/player-api.js';

	var OUTBRAIN_SERVICE = 'http://odb.outbrain.com/utils/get';

	var ENV = 'PROD';

	var EMBEDDED_TIME;

	var wibbitzAPILoaded = false;
	var isIE = /msie|trident/i.test(navigator.userAgent);
	var isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null;
	var isMobile = isIOS || navigator.userAgent.match(/Android|BlackBerry|Opera Mini|IEMobile|Msie/i) !== null;
	var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) !== null;
	var chromeVersion = getChromeVersion();

	var latestRequestTime;
	var clipRequestTime;
	var cdnRequestTime;

	var LANGUAGES = {
		english: {
			quickWatch: 'Quick Watch',
			nowPlaying: 'Now Playing'
		},
		spanish: {
			quickWatch: 'Vista Rápida',
			nowPlaying: 'Estás Viendo'
		},
		french: {
			quickWatch: 'Lecture Rapide',
			nowPlaying: 'Lecture en Cours'
		},
		german: {
			quickWatch: 'Kurze Übersicht',
			nowPlaying: 'Derzeit Spielt'
		}
	};

	// Init vars for scroll event
	var wbtzCookieData = [];
	var maxScroll = 0;
	var shouldLogScrollPositions = false;

	// Keep current main player instance
	var mainPlayerInstance;

	var embeddedElements = [];

	/***********************************************************************
	 * Part of tq 0.2.7 (Credit to Omer Calev)
	 **********************************************************************/

	/**
	 * Select element by ID
	 *
	 * @param	id	the id to select
	 * @return		element
	 */
	function elementById(id) {
		return document.getElementById(id);
	}

	/**
	 * Select element(s) by tag name
	 *
	 * @param	tag		the tag to select
	 * @param	context	element to search within
	 * @return 			matched elements
	 */
	function elementsByTag(tag, context) {
		context = context || document;
		return context.getElementsByTagName(tag);
	}

	/**
	 * Select element(s) by class name
	 *
	 * @param	name	the name to look for
	 * @param	context	element to search within
	 * return			matched elements
	 */
	function elementsByClass(name, context) {
		context = context || document;
		if (document.getElementsByClassName) {
			return context.getElementsByClassName(name);
		}

		// Internet Explorer
		var results = [];
		var elements = context.getElementsByTagName('*');
		for (var e in elements) {
			if (elements[e] && elements[e].nodeType == 1) {
				var classNames = elements[e].className;
				if (classNames.length > 0) {
					var classes = classNames.split(' ');
					for (var c in classes) {
						if (classes[c] == name) {
							results.push(elements[e]);
						}
					}
				}
			}
		}
		return results;
	}

	/**
	 * Makes an element and append/prepends it to a parent
	 *
	 * @param	tag			type element to make
	 * @param	parent		the parent to append to
	 * @param	prepend		if true element will be inserted at the beginning of parent
	 * @param	styles		JSON object of styles to set for the newly created element [optional]
	 * @param	className	class name to add to the element [optional]
	 * @return				the newly created node
	 */
	function makeElement(tag, parent, prepend, styles, className) {
		// Create the element
		var element = document.createElement(tag);

		// Set element styles
		if (styles) {
			setStyles(element, styles);
		}

		// Set element class name(s)
		if (className) {
			element.className = className;
		}

		return parent ? appendElement(element, parent, prepend) : element;
	}

	/**
	 * Convert HTML string to DOM element

	 * @param	string		HTML string
	 * @param	parent		target node
	 * @param	prepend		if true element will be inserted at the beging of parent
	 * @param	styles		JSON object of styles to set for the newly created element [optional]
	 * @param	className	class name to add to the element [optional]
	 * @return 			created element
	 */
	function html2element(string, parent, prepend, styles, className) {
		var wrapper = document.createElement('div');
		wrapper.innerHTML = string;

		// Set element styles
		if (styles) {
			setStyles(wrapper.firstChild, styles);
		}

		// Set element class name(s)
		if (className) {
			wrapper.firstChild.className = className;
		}

		return parent ? appendElement(wrapper.firstChild, parent, prepend) : wrapper.firstChild;
	}

	/**
	 * Append elemnt to target parent
	 *
	 * @param	element	element to append
	 * @param	parent		target node
	 * @param	prepend	if true elemenet will be inserted at the beginning of parent
	 * @return			the new child node
	 */
	function appendElement(element, parent, prepend) {
		return prepend ? parent.insertBefore(element, parent.firstChild) : parent.appendChild(element);
	}

	/**
	 * Replace element
	 *
	 * @param	element		element to be replaced
	 * @param	replacement	the replacement elemnt
	 * @return				replacement or false (replacement failed)
	 */
	function replaceElement(element, replacement) {
		return element.parentNode.replaceChild(replacement, element) ? replacement : false;
	}

	/**
	 * Remove element from the DOM
	 *
	 * @param	element	target elemnt
	 * @return 			the removed node or null (remove failed)
	 */
	function removeElement(element) {
		if (isIE && element.nodeName == 'object') {
			for (var i = 0; i < element.length; i++) {
				if (typeof element[i] == 'function') {
					element[i] = null;
				}
			}
		}
		return element.parentNode.removeChild(element);
	}

	/**
	 * Empty element
	 *
	 * @param	element	target element
	 * @return			element
	 */
	function emptyElement(element) {
		while (element.hasChildNodes()) {
			removeElement(element.lastChild);
		}

		element.innerHTML = '';
		return element;
	}

	/**
	 * Empty elements
	 *
	 * @param	elements	target elements array
	 */
	function emptyElements(elements) {
		elements.forEach(function(element) {
			while (element.hasChildNodes()) {
				removeElement(element.lastChild);
			}

			element.innerHTML = '';
		});
	}

	/**
	 * Clone element
	 *
	 * @param	element	the target element to be clone
	 * @param	deep	(default true) if true duplicate the node's sub-tree as well as the node itself
	 * @return			the cloned element
	 */
	function cloneElement(element, deep) {
		if (typeof deep === 'undefined') deep = true;
		return element.cloneNode(deep);
	}

	/**
	 * Add event handler
	 *
	 * @param	element	target element
	 * @param	event	string containing a JavaScript event type.
	 * @param	handler	function to being added/removed.
	 * @param	data	data that will be passed to the event handler.(events with data canot be removed)
	 * @return			element
	 */
	function addEvent(element, event, handler, data) {
		var d = typeof data != 'undefined';
		if (document.addEventListener) {
			element.addEventListener(event, d ? function(e) {
				handler(e, data);
			} : handler, false);
		} else if (document.attachEvent) {
			element.attachEvent('on' + event, d ? function(e) {
				handler(e, data);
			} : handler);
		}
		return element;
	}

	/**
	 * Register multiplte event listeners
	 *
	 * @param	target		element to register event to
	 * @param	events		string of events to register
	 * @param	callback	function to run on event
	 */
	function addEventListeners(target, events, callback) {
		events.split(' ').forEach(function(item) {
			target.addEventListener(item, callback);
		});
	};

	/**
	 * Unregister multiplte event listeners
	 *
	 * @param	target		element to unregister event to
	 * @param	events		string of events to register
	 * @param	callback	function to run on event
	 */
	function removeEventListeners(target, events, callback) {
		events.split(' ').forEach(function(item) {
			target.removeEventListener(item, callback);
		});
	};

	/**
	 * Appaly style to element
	 *
	 * @param	element		the target elemn
	 * @param	property	property name
	 * @paran	value		style value
	 * @return				element
	 */
	function setStyle(element, property, value) {
		try { // keep it safe
			element.style[property] = value;
			if (property == 'opacity') { // && isIE
				element.style.filter = 'alpha( opacity=' + (value * 100) + ' )';
			}
		} catch (e) {}
		return element;
	}


	/**
	 * Appaly styles to element
	 *
	 * @param	element		the target elemn
	 * @param	properties	map of key-value paires
	 * @paran	value		style value
	 * @return				element
	 */
	function setStyles(element, properties) {
		for (var property in properties) {
			setStyle(element, property, properties[property]);
		}
		return element;
	}

	/**
	 * Split value into array: '100px' will return [100, 'px']
	 *
	 * @param	value	the value to split
	 * @return 			[value, units]
	 */
	function splitStyleValue(value) {
		var unit = /px|em|ex|%|in|cm|mm|pt|pc/i.exec(value);
		var pos = unit ? value.indexOf(unit) : value.length;
		return [parseFloat(value.substring(0, pos)), unit];
	}

	/**
	 * Get style from element
	 *
	 * @param	element		The target element
	 * @param	property	property name
	 * @param	number		if true, parsed number of px
	 * @return				property value
	 */
	function getStyle(element, property, number) {
		var val = '';
		if (window.getComputedStyle) {
			try {
				val = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
			} catch (e) {}
		} else if (element.currentStyle) { // old ie
			var p = toCamelCase(property);
			val = element.currentStyle[toCamelCase(property)];
			if (val == 'auto') {
				val = p == 'width' ? element.offsetWidth : p = 'height' ? element.offsetHeight : val;
			}

			// convert em to px. TODO: other units
			if (typeof val != 'string') {
				return null;
			}
			var sv = splitStyleValue(val);
			if (sv[1] == 'em') {

				var em = sv[0],
					fs = splitStyleValue(element.currentStyle.fontSize);
				if (toCamelCase(property) !== 'fontSize' && fs[1] !== 'px') {
					//alert('!')
					em = em * fs[0];
				}
				if (fs[1] != 'px') {
					var ep = element.parentNode,
						un = '',
						pv;
					while (ep) {
						pv = splitStyleValue(ep.currentStyle.fontSize);
						if (pv[1] == 'px') {
							break;
						} else if (pv[1] == 'em') {
							em = em * pv[0];
						}
						ep = ep.parentNode;
					}
					val = (pv[0] * em);
					return number ? val : val + 'px';

				} else {
					val = em * fs[0];
					return number ? splitStyleValue(val)[0] : val;

				}
			}
		}
		return number ? splitStyleValue(val)[0] : val;
	}

	/**
	 * Loads a script and runs a callback function once it's loaded
	 *
	 * @param	options		JSON with the following options
	 * 						source		url for the script
	 * 						load		function to run after the script loads
	 * 						error		function to run if the script fails to load [optional]
	 * 						id			id for the script element (to prevent repeating script loads) [optional]
	 */
	function loadScript(options) {
		// Prevent repeating loads
		var script = document.querySelector('script#' + options.id);
		if (script) {
			if (script.loaded) options.load();
			else addEvent(script, 'load', options.load);
			return;
		}

		// Create script
		script = document.createElement('script');

		// Add callbacks
		addEvent(script, 'error', options.error);
		addEvent(script, 'load', function() {
			script.loaded = true;
			if (options.load) options.load(null, options.loadCallback);
		});

		// Add options id
		if (options.id) script.id = options.id;

		// Add source and type
		script.type = 'text/javascript';
		script.src = options.source;
		document.body.appendChild(script);
	}

	/**
	 * Remove the HTTPS or HTTP prefix from a url
	 *
	 * @param	url		url to remove the prefix from
	 */
	function removeHttpPrefix(url) {
		url = url.replace('http:','');
		url = url.replace('https:','');

		return url;
	}

	/**
	 * Remove the HTTPS or HTTP prefix from a url
	 *
	 * @param	url		url to remove the prefix from
	 */
	function removeHttpPrefix(url) {
		url = url.replace('http:','');
		url = url.replace('https:','');

		return url;
	}

	/**
	 * Generates a random string with given length
	 * @param	length	length of the random string
	 * @return			random string
	 */
	function randomString(length) {
		return (new Date().getTime() / Math.random()).toString(36).replace('.', '').substring(0, length);
	}

	/**
	 * Turns a hex color code into an rgba string with given opacity
	 *
	 * @param	hex			hex color code
	 * @param	opacity		given opacity
	 * @return 				rgba string
	 */
	function hexToRgba(hex, opacity) {
		var array = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (array && array.length) {
			var result = {
				r: parseInt(array[1], 16),
				g: parseInt(array[2], 16),
				b: parseInt(array[3], 16),
				a: opacity
			};

			return 'rgba(' + result.r + ',' + result.g + ',' + result.b + ',' + result.a + ')';
		}
		return '';
	}

	/**
	 * Perform an Asynchronous JavaScript and XML request
	 *
	 * @param	method	the http method to use
	 * @param	url		string containing the URL to which the request is sent.
	 * @param	success callback function that is executed if the request succeeds. (data, response)
	 * @param	error	callback function that is executed if the request failed. (status, textStatus)
	 */
	function ajax(method, url, success, error) {
		var request = null;
		if (typeof XMLHttpRequest != 'undefined') {
			request = new XMLHttpRequest();
		} else {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					if (window.createRequest) {
						try {
							request = window.createRequest();
						} catch (e) {
							if (error) {
								error(0, 'Can\'t ganarate http request');
							}
							request = false;
						}
					}
				}
			}
		}
		if (request) {
			// state change
			request.onreadystatechange = function(e) {
				if (this.readyState == 4) {
					clearTimeout(xmlHttpTimeout);
					if (this.status == 200) {
						if (success) {
							var dataType = this.getResponseHeader('Content-type');
							dataType = dataType.substring(dataType.indexOf('/') + 1);
							var sc = dataType.indexOf(';');

							if (sc != -1) {
								dataType = dataType.substring(0, sc);
							}

							if (dataType == 'json') {
								success(JSON.parse(this.responseText));
							} else if (dataType == 'xml' && this.responseXML) {
								success(this.responseXML);
							} else {
								success(this.responseText);
							}
						}
					} else if (error) {
						if (request.isTimedOut) {
							error(this.status, 'Request timed out', {
								code: 0,
								message: 'Request timed out'
							});
						} else {
							error(this.status, this.status === 0 ? 'Cross-domain requests is not allowed' : this.statusText, this.responseText ? JSON.parse(this.responseText) : null);
						}
					}
				}
			};

			request.open(method, url);
			request.send();
			request.isTimedOut = false;

			// Timeout to abort in 3000
			var xmlHttpTimeout = setTimeout(ajaxTimeout, 3000);

			var ajaxTimeout = function() {
				request.isTimedOut = true;
				request.abort();
			};
		}
	}

	/**
	 * Perform an Asynchronous JavaScript and XML request with GET method
	 *
	 * @param	url		string containing the URL to which the request is sent.
	 * @param	success callback function that is executed if the request succeeds. (data, response)
	 * @param	error	callback function that is executed if the request failed. (status, textStatus)
	 */
	function get(url, success, error) {
		ajax('GET', url, success, error);
	}

	/**
	 * Turns seconds into a timestring of the form mm:ss
	 *
	 * @param	seconds	the number of seconds to parse into a timestamp
	 */
	function timeFormat(seconds) {
		var min = Math.floor(seconds / 60);
		var sec = Math.round(seconds - min * 60);
		return min + ':' + (sec < 10 ? '0' + sec : sec);
	}

	/**
	 * get URL params
	 *
	 * @param	name		the name of the query param to return the value of
	 * @param 	usePrefix	should use only name prefix instead of full name
	 * @return				the value of the given param
	 */
	function getQueryParams(name, usePrefix) {
		var match;
		var search = /([^&=]+)=?([^&]*)/g;
		var query  = window.location.search.substring(1);

		var urlParams = {};
		var urlParamsByPrefix = {};

		// Run regex until spliting all params
		while (match = search.exec(query)) urlParams[match[1]] = match[2];

		// Create an object according to prefix or return single value
		if (usePrefix) {
			Object.keys(urlParams).map(function(key) {
				if (key.indexOf(name) > -1) urlParamsByPrefix[key.substring(name.length)] = urlParams[key]; 
			});
			
			return urlParamsByPrefix;
		} else {
			return urlParams[name];	
		}
	}

	/**
	 * Creates a request query string from given key-value pairs object
	 *
	 * @param	object	the object to convert
	 * @return			query string
	 */
	function objectToQueryString(object) {
		var pairs = [];
		for (var pair in object) {
			if (object.hasOwnProperty(pair)) {
				pairs.push(encodeURIComponent(pair) + '=' + encodeURIComponent(object[pair]));
			}
		}
		return pairs.join('&');
	}

	/**
	 * Extends a source Object with an extension Object
	 *
	 * @param source		source Object
	 * @param extension		extension Object
	 * @return				source object extended by the extension object
	 */
	function extend(source, extension) {
		// Return if there's no extension
		if (!extension) return source;
	    if (extension instanceof HTMLElement) return extension;

		// Init an object if the source is undefined
		source = source || {};

		// Recursively extend the source
		for (var key in extension) {
			if (typeof extension[key] === 'object') {
				if (Array.isArray(extension[key])) {
					source[key] = [];
					for (var index in extension[key]) {
						source[key][index] = extension[key][index];
					}
				} else {
					source[key] = extend(source[key], extension[key]);
				}
			} else {
				source[key] = extension[key];
			}
		}

		return source;
	}

	/**
	 * Gets the page URL
	 * Uses a canonical tag if such one exists or if told not to
	 * Removes the #hash part of the URL if such one exists
	 *
	 * @param	useLocation	if true will use document.location instead of canonical
	 * @return				the page's URL
	 */
	function getPageURL(useLocation) {
		var pageURL = document.location.href;
		if (!useLocation) {
			try {
				pageURL = document.querySelector("link[rel='canonical']").href;
			} catch (e) {
				pageURL = window.location.origin + window.location.pathname + window.location.search;
			}
		}

		return pageURL;
	}

	/**
	 * Test if url is homepage (host name only)
	 * refer: https://gist.github.com/jlong/2428561
	 *
	 * @param		url	a url to test [optional]
	 * @return		true or false determines if the given url is a homepage
	 */
	function isHomepage(url) {
		var parser = makeElement('a');
		if (!!url) {
			parser.href = url;
		} else {
			parser.href = location.href;
		}
		return parser.pathname === '/' && parser.href.indexOf('?') === -1;
	}

	/**
	 * Get string and language and translates it
	 *
	 * @param	stringName	name of wanted string to translate
	 * @param	language 	language to translate to
	 * @return				translated string
	 */
	function getLocalizedString(stringName, language) {
		return LANGUAGES[language] ? LANGUAGES[language][stringName] : LANGUAGES.english[stringName];
	}

	/**
	 * Handles an error, printing it to the console with a stack trace
	 *
	 * @param	status			error code
	 * @param	statusText		error message
	 * @param	jsonResponse	response json
	 * @param	customMessage	custom error message
	 */
	function handleError(status, statusText, jsonResponse, customMessage) {
		var message;
		if (!!customMessage) {
			message = customMessage;
		} else if (jsonResponse) {
			message = 'Wibbitz Error ' + status + ': ' + jsonResponse.message;
		} else {
			message = 'Wibbitz Error ' + status + ': ' + statusText;
		}

		console.warn(message);
		console.log(message.split('').map(function() {
			return '-';
		}).join(''));
		console.trace();
	}

	/**
	 * Get video type in accordance to given type code
	 *
	 * @param	videoTypeCode	code in number
	 * @return					video type name in accordance to the code
	 */
	function getVideoType(clipTypeCode) {
		return {
			2: 'Article',
			11: 'List',
			12: 'Social'
		}[clipTypeCode];
	}

	/**
	 * Get player's playing mode
	 *
	 * @return	string that correlates to the autoplay value
	 */
	function getPlayMode(autoplay) {
		switch (autoplay) {
			case true:
				return 'Auto play';
			case false:
				return 'Click to play';
			case 'scroll':
				return 'Scroll to play';
		}
	}

	/**
	 * Check if the player is 50% in the user's view
	 *
	 * @return		true if the player is in the view port, false otherwise
	 */
	function isInViewPort(container) {
		if (!container) return false;
		
		var containerProperties = container.getBoundingClientRect();

		var isAboveViewPort = window.innerHeight <= containerProperties.top + containerProperties.height / 2;
		var isBelowViewPort = containerProperties.bottom - containerProperties.height / 2 <= 0;

		return !isAboveViewPort && !isBelowViewPort;
	}

	/**
	 * Calculate bottom spacing according to page
	 *
	 * @param 		bottomSpacing 	bottom scpaing in %
	 * @returns 	bottom spacing in % according to window size
	 */
	function calculateBottomSpacing(bottomSpacing, itemHeight) {
		return ((window.innerHeight - itemHeight) / window.innerHeight) * bottomSpacing;
	}

	/**
	 * Calculate side spacing according to page
	 *
	 * @param 		sideSpacing 	side scpaing in %
	 * @returns 	side spacing in % according to window size
	 */
	function calculateSideSpacing(sideSpacing, itemWidth) {
		return ((window.innerWidth - itemWidth) / window.innerWidth) * sideSpacing;
	}

	/**
	 * Return element location from top of page
	 *
	 * @return		number of px from top to element
	 */
	function elementLocationFromTop(element) {
		var location = 0;

		while (element && element.offsetParent) {
			location += element.offsetTop;
			element = element.offsetParent;
		}

		return location;
	}

	function saveMaxScroll(event) {
		if (document.body.scrollTop > maxScroll) maxScroll = document.body.scrollTop;
	}

	/**
	 * Check if the player has been viewed
	 *
	 * @return		true if the player is in the view port, false otherwise
	 */
	function hasBeenViewed(container) {
		var containerProperties = container.getBoundingClientRect();

		var isAboveViewPort = window.innerHeight <= containerProperties.top + containerProperties.height / 2;
		var isBelowViewPort = containerProperties.bottom - containerProperties.height / 2 <= 0;

		return (!isAboveViewPort && !isBelowViewPort) || isBelowViewPort;
	}

	/**
	 * Sets cookie with value and days to expire
	 *
	 * @param	name 		cookie name
	 * @param	value 		cookie value
	 * @param	expireDays 	days to make the cookie expire
	 */
	function setCookie (key, value, days) {
		var date = new Date();
		days = days || 365;
		date.setTime(+ date + (days * 86400000));
		window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";
	};

	/**
	 * Gets cookie value by name
	 *
	 * @param	name 		cookie name
	 */
	function getCookie(name) {
		name += '=';
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var cookie = ca[i];
			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(name) === 0) {
				return cookie.substring(name.length, cookie.length);
			}
		}
		return '';
	}

	/**
	 * Delete cookie by name
	 *
	 * @param	name 		cookie name
	 */
	function deleteCookie(name) {
		document.cookie = name +'=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	/***********************************************************************
	 * Logging
	 **********************************************************************/

	// Load Alooma
	if (!window.alooma) {
		(function(e,b){if(!b.__SV){var a,f,i,g;window.alooma=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="alooma";c.people=c.people||[];c.toString=function(b){var a="alooma";"alooma"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_custom_event track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" "); for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof ALOOMA_CUSTOM_LIB_URL?ALOOMA_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.alooma.com/libs/alooma-latest.min.js".match(/^\/\//)?"https://cdn.alooma.com/libs/alooma-latest.min.js":"//cdn.alooma.com/libs/alooma-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.alooma||[]);alooma.init("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnROYW1lIjoid2liYml0eiIsImlucHV0TGFiZWwiOiJqc1RyYWNrZXIiLCJpbnB1dFR5cGUiOiJKU1NESyJ9.55Y_puhX1ed2hNYaK3G18PI5iuXXJJ_rEZSRVjfK7WE", {"api_host":"https://inputs.alooma.com"});
	}

	/**
	 * Sends analytics event
	 *
	 * @param	action		event action
	 * @param	label		event label
	 * @param	dimensions	event dimensions
	 * @param	metrics		event metrics
	 */
	function sendEvent(action, label, dimensions, metrics) {
		// Prepare data for event
		var event = {
			category: 'embed',
			action: action
		};

		// Add label if it exists
		if (label) event.label = label;

		// Add the set dimensions
		extend(event, analyticsDimensions || {});

		// Add custom dimensions/metrics
		extend(event, dimensions || {});
		extend(event, metrics || {});

		// Replace dimensions and metrics with full names
		for (var key in event) {
			if (key in metricDictionary) {
				event[metricDictionary[key]] = event[key];
				delete event[key];
			}

			if (key in dimensionDictionary) {
				event[dimensionDictionary[key]] = event[key];
				delete event[key];
			}
		}

		// Send Alooma event
		if (window.alooma) {
			alooma.track_custom_event(extend(event, {
				product: 'embed'
			}));
		}
	}

	var analyticsDimensions = {};
	/**
	 * Set general custom dimension
	 *
	 * @param	name	dimension key
	 * @param	value	dimension value
	 */
	function setDimension(name, value) {
		analyticsDimensions[name] = value;
	}

	/*
	* Load the same image to get data about CDN loading times
	*/
	function testCDN() {
		// Measure cdn response time using wibbitz logo
		var image = new Image();
		var requestTime = performance.now();

		image.onload = function(event) {
			var responseTime = performance.now();
			cdnRequestTime = parseInt(responseTime - requestTime);
		};

		image.setAttribute('src', '//cdn4.wibbitz.com/images/wibbitz-logo-sprite.png?' + new Date().getTime());
	}

	/***********************************************************************
	 * Generic functions
	 **********************************************************************/

	/**
	 * Embed a created by wibbitz tag into a container
	 *
	 * @param	container	the container to embed the element in
	 * @param	style		styles to give the text
	 */
	function embedPoweredBy(container, elementStyle, textStyle) {
		var createdBy = makeElement('div', container, false, extend({
			marginTop: '2px',
			marginBottom: '2px'
		}, elementStyle), 'wbtz-created-by-container');

		// Create modal
		createdBy.modal = makeElement('div', createdBy, false, {}, 'wbtz-created-by-modal');
		createdBy.modal.content = makeElement('div', createdBy.modal, false, {}, 'wbtz-created-by-modal-content');
		createdBy.modal.content.exit = makeElement('span', createdBy.modal.content, false, {}, 'wbtz-created-by-close');
		createdBy.modal.content.frame = html2element('<iframe src="//cdn4.wibbitz.com/pages/created-by.html" frameBorder="none"></iframe>', createdBy.modal.content);

		var anchor = makeElement('div', createdBy, false, {}, 'wbtz-created-by-text');
		addEvent(anchor, 'click', function() {
			if (!isMobile) {
				createdBy.modal.content.frame.width = 580;
				createdBy.modal.content.frame.height = 420;
			} else {
				createdBy.modal.classList.add('wbtz-mobile-modal');
				// Set modal to be 80% size of the page
				createdBy.modal.content.frame.width = window.innerWidth * 0.8;
				createdBy.modal.content.frame.height = window.innerHeight * 0.8;
			}

			createdBy.modal.classList.add('wbtz-show-modal');

			sendEvent('poweredBy.click', 'poweredBy');
		});

		addEvent(createdBy.modal.content.exit, 'click', function() {
			createdBy.modal.classList.remove('wbtz-show-modal');
		});

		addEvent(createdBy.modal, 'click', function() {
			createdBy.modal.classList.remove('wbtz-show-modal');
		});

		var text = makeElement('span', anchor, false, textStyle);
		text.innerHTML = 'Powered by';
		html2element('<style type="text/css">.wbtz-created-by-container .wbtz-created-by-modal{display:none;position:fixed;z-index:10000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,.5);font-size:16px}.wbtz-created-by-container .wbtz-created-by-modal.wbtz-show-modal{display:block}.wbtz-created-by-container .wbtz-created-by-modal.wbtz-mobile-modal .wbtz-created-by-modal-content{width:80%;padding:5px}.wbtz-created-by-container .wbtz-created-by-modal .wbtz-created-by-modal-content{position:relative;display:flex;background-color:#fff;text-align:center;margin:10% auto;padding:25px 10px 10px;max-width:580px;border:1px solid #ccc;width:65%;border-radius:4px;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.2);font-weight:700;font-family:Roboto,sans-serif;line-height:1.2}.wbtz-created-by-container .wbtz-created-by-modal .wbtz-created-by-modal-content .wbtz-created-by-close{position:absolute;top:-12px;left:-12px;background-image:url(//cdn4.wibbitz.com/images/close-sprite.png);background-position:center top;background-size:cover;width:30px;height:30px;display:inline-block;background-repeat:no-repeat;border-radius:50%;cursor:pointer}.wbtz-created-by-container .wbtz-created-by-modal .wbtz-created-by-modal-content .wbtz-created-by-close:hover{background-position:center bottom}.wbtz-created-by-container .wbtz-created-by-text{cursor:pointer;color:#999;font-size:12px;font-family:arial;text-decoration:none}.wbtz-created-by-container .wbtz-created-by-text .wbtz-created-by-image{background:url(//cdn4.wibbitz.com/images/wibbitz-logo-sprite.png) center top no-repeat;width:49px;height:16px;margin-bottom:-2px;display:inline-block;ertical-align:text-bottom;padding:0 5px;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box}.wbtz-created-by-container .wbtz-created-by-text:hover .wbtz-created-by-image{background-position:center bottom}.wbtz-created-by-container .ob-api-what,.wbtz-created-by-container .ob-one-line{margin-top:-15px;font-family:Roboto,sans-serif;line-height:1.2}</style>', createdBy, true);
		makeElement('span', anchor, false, {}, 'wbtz-created-by-image');
		return createdBy;
	}

	/*
	* Returns chrome version number
	*/
	function getChromeVersion() {
		var versionData = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		return versionData ? parseInt(versionData[2], 10) : false;
	}

	/**
	 * Checks if there is time on page to log GA and logs it
	 *
	 * @param	experimentId
	 * @param	chosenVariation		variation chosen for experiment
	 */
	function gaveMeCookieGotYouCookieScrollPositions(scrollData) {
		// Check if user visited previous page with experiemnt
		var cookie = getCookie('wbtz_scrollPositions');
		var parsedCookie;

		if (cookie) {
			parsedCookie = JSON.parse(cookie);

			parsedCookie.forEach(function(item) {
				// Log to analytics data kept in cookie
				sendEvent('scroll_location', 'video', {
					Embed_Type: item.type,
					Player_Location: item.containerLocation,
					User_Location: item.maxScroll,
					Page_Size: item.pageHeight
				});
			});

			// Remove cookie after logging
			deleteCookie('wbtz_scrollPositions');
		}

		window.addEventListener('beforeunload', setCookieBeforeUnload);
	}

	function setCookieBeforeUnload() {
		wbtzCookieData.forEach(function(item) {
			item.maxScroll = maxScroll;
			item.pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
		});

		setCookie('wbtz_scrollPositions', JSON.stringify(wbtzCookieData), 7);
	}

	/**
	 * Initialize the embed code by creating the API calls and running the custom embed callbacks
	 *
	 * @param	options		object with different options for the embed code. Available options:
	 * 						blocked					should the embed code be blocked? (will not fire embeded event)
	 *						isInHead					is our script tag located in the head of the document
	 *						useIframes					should the embed be located inside an iframe
	 *						elements					array of elements to be embedded on the page.
	 *						useLocation					indicates if to use the page's location or if not, then try and use the canonical
	 *						processLocation				function to process the page location
	 */
	function init(options) {
		var locationFunction = options.processLocation || getPageURL;
		var errorCallback = options.errorCallback || handleError;
		var urlParams = getQueryParams('wbtzparams-', true);

		if (!options.reload) {
			// Keep original configuration to reuse with reloading
			wibbitz.options = extend({}, options);

			// Prevent duplicate inits unless reloading is called
			if (window.wibbitzLoaded) return;
			window.wibbitzLoaded = true;
		}

		// Create a connect function that will run once the page is ready
		var connected = false;

		function connect() {
			// Prevent duplicate connections
			if (connected) return;
			connected = true;

			// Run cdn load time test
			testCDN();

			// Get the page's location
			var href = wibbitz.options.url || locationFunction(options.useLocation);
			var mainClipId;

			// Log Embedded
			setDimension('User_Agent', navigator.userAgent);
			setDimension('dimension2', PUBLISHER_ID);
			setDimension('dimension4', href);
			setDimension('dimension19', isHomepage() ? 'Homepage' : 'Article');
			setDimension('environment', ENV);

			EMBEDDED_TIME = new Date();

			// Log embedded
			sendEvent('embedded', 'load', null, {
				metric1: 1
			});

			/**
			 * Get widget container by type
			 *
			 */
			function getContainer(params, tag) {
				var containers = [];
				var selectedContainer;

				if (params.elementId) containers = document.querySelectorAll('[wibbitz=' + tag + '][wibbitz-element-id=' + params.elementId + ']');
				else containers = document.querySelectorAll('[wibbitz=' + tag + ']');

				// Find the next container that was not embedded yet
				if (containers) {
					containers.forEach(function(container) {
						if (!container.getAttribute('embedded') && !selectedContainer) selectedContainer = container
					});
				}

				params.container = selectedContainer;

				return !!params.container && !!document.querySelector('[wibbitz=' + tag + ']');
			}

			/**
			 * Add data to scroll postions array
			 *
			 * @param	params			element params
			 */
			function logScrollPositions(params) {
				if (new Date() < new Date(params.logScrollPositionsExpirationDate)) {
					wbtzCookieData.push({
						type: params.type,
						containerLocation: elementLocationFromTop(params.container)
					});

					gaveMeCookieGotYouCookieScrollPositions();
				}
			}

			/**
			 * Get and embed a main embed
			 *
			 * @param	main			is a main embed element information
			 * @param	embedCallback	main embed implementation function
			 */
			function getMainEmbed(main, embedCallback) {
				var apiRequestTime = performance.now();
				var apiResponseTime;

				get(CLIP_REQUEST + objectToQueryString({
					url: href
				}), function(clip) {
					apiResponseTime = performance.now();
					clipRequestTime = parseInt(apiResponseTime - apiRequestTime);

					main.clip = clip;
					mainClipId = clip.id;
					main.playerParams = main.playerParams || {};
					
					// Add url params if exists
					if (urlParams) extend(main.playerParams, urlParams);

					if (main.success) {
						main.success(main);
					} else {
						main.clip = clip;
						mainPlayerInstance = embedCallback(main);
						if (mainPlayerInstance) embeddedElements.push(mainPlayerInstance);
					}

					embedElements();
				}, function(status, statusText, jsonResponse) {
					// Log get.error
					if (status >= 500) {
						sendEvent('get.error', 'load', {
							dimension7: 'Embed',
							Player_Type: 'main'
						}, {
							metric9: 1
						});
					}

					if (main.error) main.error();
					else errorCallback(status, statusText, jsonResponse, 'Wibbitz - No video found for this article');

					embedElements();
				});
			}

			/**
			 * Get and embed a widget and let it know if a clip exists for this page
			 *
			 * @param	widget		is a widget element information
			 * @param	embedCallback	widget implementation function
			 */
			function getWidget(widget, embedCallback) {
				logScrollPositions(widget);

				var params = {
					items: widget.items || 10,
					orderedchannel: widget.orderedchannel || false,
					publisherid: widget.publisherId || PUBLISHER_ID
				};

				var apiRequestTime;
				var apiResponseTime;

				if (widget.channelId) {
					params.channelid = widget.channelId;
				}

				if (widget.outbrain) {
					// Create a random callbackname
					var callbackName = 'wbtz' + new Date().getTime();

					// Add the callback function into the window object
					window[callbackName] = function(data) {
						if (data.response.documents.count > 0) {
							// Create a query string for the clips API call
							var ads = [];
							var clipsCallbacks = {};
							var clipIds = [];

							//console.log(data.response.documents.doc);
							data.response.documents.doc.forEach(function(doc, index) {
								if (doc.ads_type === 1) {
									// Check if the doc is a paid recommendation
									ads.push(doc);
								} else if (doc.orig_url.indexOf('#') > -1) {
									// Otherwise, check if it's a wibbitz clip recommendation
									var id = doc.orig_url.substr(doc.orig_url.indexOf('#') + 1).replace('wibbitzid=','');
									clipsCallbacks[id] = function() {
										// get(doc.url);
										OBR.extern.callClick({
											link: doc.url
										}, function() {});
									};

									clipIds.push('ids[]=' + id);
								}
							});

							// Fall back to a regular widget if there's no recommendations
							if (!clipIds.length) {
								delete widget.outbrain;
								getWidget(widget, embedCallback);
								return;
							}

							// Get the clips for the widget
							get(API_PREFIX + 'clips/?' + clipIds.join('&'), function(clips) {
								// Add clip callbacks to the clips
								clips.forEach(function(clip) {
									clip.isClip = true;
									if (clip.id in clipsCallbacks) {
										clip.clickCallback = clipsCallbacks[clip.id];
									}
								});

								// Print clips before embedding
								console.log(clips);
								console.log(ads);

								// Log and embed
								widget.playerParams = widget.playerParams || {};

								// Add clip to widget object
								widget.clips = clips;

								// Add url params if exists
								if (urlParams) extend(widget.playerParams, urlParams);				

								if (widget.success) {
									widget.success(widget, mainElement, ads);
								} else {
									var container = embedCallback(extend(widget, {
										clips: clips,
										ads: ads
									}));

									if (container) {
										embeddedElements.push(container);

										var createdByContainer = embedPoweredBy(container);

										// Add outbrain's branding/disclosure
										html2element('<div class="ob-api-what ob-one-line" data-language="en" data-partner="wibbitz"></div>', createdByContainer, false, {
											float: 'right'
										});
										loadScript({
											source: 'http://widgets.outbrain.com/external/whatIsForAPI/brandingForApi.js',
											id: 'wibbitz-outbrain-api'
										});
									}
								}
							}, function(status, statusText, jsonResponse) {
								// Log get.error
								if (jsonResponse.code && status >= 500) {
									sendEvent('get.error', 'load', {
										dimension7: 'Player Widget',
										Player_Type: 'widget'
									}, {
										metric9: 1
									});
								}
								if (widget.error) widget.error();
								else errorCallback(status, statusText);
							});
						}
					};

					params = extend({
						callback: callbackName
					}, widget.outbrain.params);

					params = widget.outbrain.locationFunction(!!mainElement.clip, params, {
						href: href,
						clipId: mainClipId
					});

					loadScript({
						source: OUTBRAIN_SERVICE + '?' + objectToQueryString(params),
						error: function() {
							// Fall back to a regular widget if there's no recommendations or error from Outbrain
							delete widget.outbrain;
							getWidget(widget, embedCallback);
						},
						id: 'wibbitz-outbrain-service'
					});
				} else {
					apiRequestTime = performance.now();

					get(LATEST_REQUEST + objectToQueryString(params), function(clips) {
						apiResponseTime = performance.now();
						latestRequestTime = parseInt(apiResponseTime - apiRequestTime);

						// Shuffle clips and slice array to 5 items
						widget.clips = clips.sort(function() {
							return 0.5 - Math.random();
						}).slice(0, 10);

						widget.playerParams = widget.playerParams || {};

						// Add url params if exists
						if (urlParams) extend(widget.playerParams, urlParams);

						// Call widget with main data to avoid sticky + floating
						if (widget.success) {
							widget.success(widget, mainElement);
						} else {
							var embeddedElement = embedCallback(widget, embedCallback);
							if (embeddedElement) embeddedElements.push(embeddedElement);
						}
					}, function(status, statusText, jsonResponse) {
						// Log get.error
						if (jsonResponse.code && status >= 500) {
							sendEvent('get.error', 'load', {
								dimension7: 'Player Widget',
								Player_Type: 'widget'
							}, {
								metric9: 1
							});
						}

						if (widget.error) widget.error();
						else errorCallback(status, statusText);
					});
				}
			}

			/**
			 * Loop through the elements and embed all of them
			 */
			function embedElements() {
				options.elements.forEach(function(element) {
					if (isMobile) {
						// If mobile widget container exists - implement
						if (getContainer(element, 'embed-mobile-widget') || getContainer(element, 'embed-player-widget')) getWidget(element, embedMobileWidget);
					} else {
						switch (element.type) {
							case 'floating':
								// Floating widget creates its own container
								getWidget(element, embedFloatingWidget);
								break;
							case 'widget':
								if (getContainer(element, 'embed-player-widget')) getWidget(element, embedRecommendPlayerWidget);
								break;
							case 'hybridRecommendFloating':
								if (getContainer(element, 'embed-player-widget')) getWidget(element, embedHybridWidget);
								break;
						}
					}
				});
			}

			// Attempt to see if there's a main embed, to make sure it embeds first
			var mainElement;

			options.elements.forEach(function(element) {
				if (element.type === 'main') mainElement = element;
			});

			if (mainElement) {
				if (!getContainer(mainElement, 'embed-main-player') && !getContainer(mainElement, 'embed-main-image') && mainElement.success) getMainEmbed(mainElement);
				else if (getContainer(mainElement, 'embed-main-player')) getMainEmbed(mainElement, embedStickyPlayer);
				else if (getContainer(mainElement, 'embed-main-image')) getMainEmbed(mainElement, embedImagePlayButton);
				else embedElements();
			} else {
				embedElements();
			}

			// Listen for scroll event
			removeEventListeners(window, 'scroll', saveMaxScroll);
			addEvent(window, 'scroll', saveMaxScroll);
		}

		if (!options.blocked) {
			if (!options.isInHead || document.readyState === 'complete') {
				connect();
			} else if (document.addEventListener) {
				addEvent(document, 'DOMContentLoaded', connect);
			} else if (/msie|trident/i.test(navigator.userAgent)) { // old ie
				if (document.getElementById) {
					var r = 'r' + Math.random();
					document.write('<script id="' + r + '" defer src="//:"><\/script>');
					document.getElementById(r).onreadystatechange = function() {
						if (this.readyState === 'complete') {
							connect();
						}
					};
				}
			} else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) { // webkit
				var loadTimer = setInterval(function() {
					if (/loaded|complete/i.test(document.readyState)) {
						connect();
						clearInterval(loadTimer);
					}
				}, 10);
			} else {
				window.onload = connect;
			}
		}
	}

	/**
	* External function to realod all elements
	*
	* @param 	params 		options for reload elements
	* 			url 		override current page url
	*/
	wibbitz.loadNow = function(params) {
		params = params || {};

		wibbitz.options.reload = true;
		wibbitz.options.url = params.url;

		if (mainPlayerInstance && mainPlayerInstance.reset) mainPlayerInstance.reset();

		// Reload init function
		init(wibbitz.options);
	};

	wibbitz.destroy = function() {
		embeddedElements.forEach(function(element) {
			element.destroy();
		});

		removeEventListeners(window, 'scroll', saveMaxScroll);
		removeEventListeners(window, 'beforeunload', setCookieBeforeUnload);

		
	};

	/***********************************************************************
	 * Embedding/Playing functions
	 **********************************************************************/

	/**
	 * Embed a player in a given container
	 *
	 * @param	params 		the embed parameters. Available options:
	 *
	 *  		clip			the clip to play
	 * 			playerParams	additional parameters to add to the player's query [optional]
	 * 			container		the container to embed the player in
	 * 			elementId		element id for the embed [optional]
	 * 			dontLog			flag indicating if to log the impression or not [optional]
	 * 			width			custom player width [optional]
	 * 			height			custom player height [optional]
	 * 			useIframes		use an iframe instead of a div player [optional]
	*			disableSticky 	if true, the player won't be sticky [optioial]
	 */
	function embedPlayer(params) {
		var context = params.analyticsContext || 'embd';
		var category = params.analyticsCategory || 'Embed';
		var container = params.container;

		// Create default params and extend with the optional params
		if (params.clip) {
			params.playerParams = extend({
				id: params.clip.id,
				autoplay: params.playerParams.autoplay,
				context: context,
				maxSequences: params.playerParams.maxSequencess
			}, params.playerParams);
		}

		// Add info param to params
		extend(params.playerParams, {
			info: JSON.stringify({
				type: params.type,
				static: params.isStatic,
				sticky: params.isSticky,
				floating: params.isFloating,
				recbar: params.recbar,
				image: params.isImage
			})
		});

		if (params.container) {
			// Set width/height automatically, or use given measurements
			var ratio = 16 / 9;
			var width = params.width || params.container.offsetWidth;
			var height = params.height || width / ratio;
			var player;

			if (params.useIframes) {
				// Old - Uses iframe
				params.container = html2element('<iframe src="' + PLAYER_URL + '?' + objectToQueryString(params.playerParams) + '" marginheight="0" marginwidth="0" frameborder="0" height="' + height + '" width="' + width + '"></iframe>', params.container, true);
			} else {
				setStyles(params.container, {
					width: width + 'px',
					height: height + 'px'
				});

				var loadScriptParams = {
					id: 'wibbitz-player-api',
					source: PLAYER_API_URL,
					load: function(event, callback) {
						wibbitz.loadApi(function() {
							if (!params.placeholder) params.container.player = new wibbitz.Player(params.playerParams, params.container);
							if (callback) callback();

							// Log the player's impression if log === true
							if (!params.dontLog) {
								// Log video.impression
								sendEvent('video.impression', 'video', {
									dimension1: params.clip.id,
									dimension3: params.clip.publisherName !== 'wibbitz' ? params.clip.publisherName : null,
									dimension6: getVideoType(params.clip.cliptype),
									dimension7: category,
									dimension8: 'player',
									dimension11: getPlayMode(params.playerParams.autoplay),
									dimension16: String(isInViewPort(params.container)),
									dimension67: params.playerParams['vdz-campaign'],
									API_Clip_Request_Time: clipRequestTime,
									Type: 'main',
									Sticky: (!isMobile && !params.disableSticky) || (isMobile && !params.disableStickyMobile),
									Static: params.isStatic
								}, {
									metric2: 1,
									metric144: new Date() - EMBEDDED_TIME
								});
							}
						});
					}
				};

				loadScript(loadScriptParams);
			}

			container.setAttribute('embedded', true);

			container.reset = function() {
				container.player.mute();
			};

			container.destroy = function() {
				container.player.destroy();
			};

			return container;
		}
	}

	function embedStickyPlayer(params) {
		if ((!isMobile && params.disableSticky) || (isMobile && params.disableStickyMobile) || (isMobile && isChrome && chromeVersion < 53)) return embedPlayer(params);
		else params.container.setAttribute('embedded', true);

		var ratio = 16 / 9;
		var width = params.width || params.container.offsetWidth;
		var height = params.height || width / ratio;
		var stickyWidth = params.stickyWidth || (isMobile ? 200 : 400);
		var stickyHeight = params.stickyHeight || stickyWidth / ratio;
		var animation = isMobile ? 'slide' : 'fade';
		var animationEvent = 'webkitAnimationEnd animationend msAnimationEnd oAnimationEnd';
		var minimized = false;
		var fullscreen = false;
		var mainPlayerViewed;
		var stickyPlayerViewd;
		var playerInView;
		var stickyPlayerContainer;
		var stickyPlayerContainerParent;
		var playerContainer;
		var playerContainerParent;
		var side = params.side || 'right';
		var context = 'sembd';
		var category = 'Sticky Player';
		var adPlaying = false;
		var container = params.container;

		// Set player sticky player position
		var bottomSpacing = isMobile ? 0 : 1.75;
		var sideSpacing = isMobile ? 0 : 1.25;

		if (isMobile) {
			if (typeof params.bottomSpacingMobile !== 'undefined') bottomSpacing = calculateBottomSpacing(params.bottomSpacingMobile, stickyHeight);
			if (typeof params.sideSpacingMobile !== 'undefined') sideSpacing = calculateSideSpacing(params.sideSpacingMobile, stickyWidth + 30); // 30 is minimize button width
		} else {
			if (typeof params.bottomSpacingDesktop !== 'undefined') bottomSpacing = calculateBottomSpacing(params.bottomSpacingDesktop, stickyHeight);
			if (typeof params.sideSpacingDesktop !== 'undefined') sideSpacing = calculateSideSpacing(params.sideSpacingDesktop, stickyWidth + 20); // 20 is minimize button width
		}
		
		playerContainerParent = html2element('<div></div>', params.container, false, {
			width: width + 'px',
			height: height + 'px',
			backgroundColor: 'black',
			backgroundSize: 'contain',
			backgroundImage: params.img ? ('url(' + params.img.src + ')') : ''
		}, 'embed-main-player-divider');

		playerContainer = embedPlayer({
			width: width,
			height: height,
			context: context,
			container: html2element('<div></div>', playerContainerParent, false, null, 'wbtz-embed-main'),
			clip: params.clip,
			isSticky: true,
			isStatic: params.isStatic,
			analyticsContext: context,
			analyticsCategory: category,
			playerParams: extend(params.playerParams, {
				onReady: function() {				
					playerContainer.player.on('fullscreen', function(status) {
						fullscreen = status;
					});
					
					playerContainer.player.on('adStart', function() {
						adPlaying = true;
					});
					
					playerContainer.player.on('adFinish', function() {
						adPlaying = false;
						toggleStickyPlayer();
					});
				}
			})
		});

		// Create sticky player container
		stickyPlayerContainer = html2element('<div wibbitz="embed-main-player-sticky"></div>', document.body);
		html2element('<style type="text/css">.wbtz-embed-main-sticky{-webkit-transition:right .2s 0s ease-in-out,left .2s 0s ease-in-out;-moz-transition:right .2s 0s ease-in-out,left .2s 0s ease-in-out;-o-transition:right .2s 0s ease-in-out,left .2s 0s ease-in-out;-ms-transition:right .2s 0s ease-in-out,left .2s 0s ease-in-out;transition:right .2s 0s ease-in-out,left .2s 0s ease-in-out;z-index:99999;background-color:#000;position:fixed;right:10px;bottom:10px;margin:0;overflow:visible;display:none}.wbtz-embed-main-sticky.wbtz-fadein,.wbtz-embed-main-sticky.wbtz-fadeout,.wbtz-embed-main-sticky.wbtz-show,.wbtz-embed-main-sticky.wbtz-slidein,.wbtz-embed-main-sticky.wbtz-slideout{display:block}.wbtz-embed-main-sticky.wbtz-slidein{-webkit-animation:slidein .2s ease-in-out 0s 1 normal both;-moz-animation:slidein .2s ease-in-out 0s 1 normal both;-ms-animation:slidein .2s ease-in-out 0s 1 normal both;-o-animation:slidein .2s ease-in-out 0s 1 normal both}@-moz-keyframes slidein{0%,40%{right:-500px;opacity:0;left:-500px}100%{right:10px;opacity:1;left:10px}}@-webkit-keyframes slidein{0%,40%{right:-500px;opacity:0;left:-500px}100%{right:10px;opacity:1;left:10px}}@keyframes slidein{0%,40%{right:-500px;opacity:0;left:-500px}100%{right:10px;opacity:1;left:10px}}.wbtz-embed-main-sticky.wbtz-slidein.wbtz-minimized{animation-iteration-count:0}.wbtz-embed-main-sticky.wbtz-slideout{-webkit-animation:slideout .2s ease-in-out 0s 1 normal both;-moz-animation:slideout .2s ease-in-out 0s 1 normal both;-ms-animation:slideout .2s ease-in-out 0s 1 normal both;-o-animation:slideout .2s ease-in-out 0s 1 normal both}@-moz-keyframes slideout{100%{right:-20px;transform:translate(100%,0);left:-20px}0%{transform:translate(0,0)}}@-webkit-keyframes slideout{100%{right:-20px;transform:translate(100%,0);left:-20px}0%{transform:translate(0,0)}}@keyframes slideout{100%{right:-20px;transform:translate(100%,0);left:-20px}0%{transform:translate(0,0)}}.wbtz-embed-main-sticky.wbtz-fadein{-webkit-animation:fadein .2s ease-in-out 0s 1 normal both;-moz-animation:fadein .2s ease-in-out 0s 1 normal both;-ms-animation:fadein .2s ease-in-out 0s 1 normal both;-o-animation:fadein .2s ease-in-out 0s 1 normal both}@-moz-keyframes fadein{0%,40%{opacity:0}100%{opacity:1}}@-webkit-keyframes fadein{0%,40%{opacity:0}100%{opacity:1}}@keyframes fadein{0%,40%{opacity:0}100%{opacity:1}}.wbtz-embed-main-sticky.wbtz-fadeout{-webkit-animation:fadeout .2s ease-in-out 0s 1 normal both;-moz-animation:fadeout .2s ease-in-out 0s 1 normal both;-ms-animation:fadeout .2s ease-in-out 0s 1 normal both;-o-animation:fadeout .2s ease-in-out 0s 1 normal both}@-moz-keyframes fadeout{0%,40%{opacity:1}100%{opacity:0}}@-webkit-keyframes fadeout{0%,40%{opacity:1}100%{opacity:0}}@keyframes fadeout{0%,40%{opacity:1}100%{opacity:0}}.wbtz-embed-main-sticky.wbtz-notransition{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important}.wbtz-embed-main-sticky .wbtz-minimize-button{display:flex;cursor:pointer;justify-content:center;align-items:center;height:100%;width:20px;position:absolute;background-color:#343434;border-radius:4px 0 0 4px;top:0;z-index:20;left:-20px;-webkit-transition:all .2s 0s ease-in-out;-moz-transition:all .2s 0s ease-in-out;-o-transition:all .2s 0s ease-in-out;-ms-transition:all .2s 0s ease-in-out;transition:all .2s 0s ease-in-out}.wbtz-embed-main-sticky .wbtz-minimize-button .wbtz-arrow{border:1px solid #fff;border-width:0 2px 2px 0;width:10px;height:10px;line-height:0;font-size:0;margin-right:5px;-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg)}.wbtz-embed-main-sticky.wbtz-mobile{right:0;bottom:0}.wbtz-embed-main-sticky.wbtz-mobile .wbtz-minimize-button{width:30px;left:-30px}.wbtz-embed-main-sticky.wbtz-mobile.left .wbtz-minimize-button{width:30px;right:-30px;left:auto}.wbtz-embed-main-sticky.left .wbtz-minimize-button{left:auto;border-radius:0 4px 4px 0;right:-20px}.wbtz-embed-main-sticky.left .wbtz-minimize-button .wbtz-arrow{margin-right:-5px;-webkit-transform:rotate(135deg);-moz-transform:rotate(135deg);-ms-transform:rotate(135deg);-o-transform:rotate(135deg)}.wbtz-embed-main-sticky.wbtz-minimized{margin-right:0}.wbtz-embed-main-sticky.wbtz-minimized .wbtz-arrow{border-width:2px 0 0 2px;margin-left:5px}.wbtz-embed-main-sticky.wbtz-minimized.left .wbtz-minimize-button .wbtz-arrow{margin:0 0 0 -5px}</style>', stickyPlayerContainer, false);

		stickyPlayerContainerParent = html2element('<div></div>', stickyPlayerContainer, false, {
			width: stickyWidth + 'px',
			height: stickyHeight + 'px',
			bottom: bottomSpacing + '%'
		}, 'wbtz-embed-main-sticky' + (isMobile ? ' wbtz-mobile ' : ' ') + side);

		setStyle(stickyPlayerContainerParent, side, sideSpacing + '%');
		stickyPlayerContainerParent.minimizeButton = html2element('<div class="wbtz-minimize-button"></div>', stickyPlayerContainerParent, false);
		stickyPlayerContainerParent.minimizeButton.arrow = html2element('<div class="wbtz-arrow"></div>', stickyPlayerContainerParent.minimizeButton, false);

		// Handle player being minimized
		addEvent(stickyPlayerContainerParent.minimizeButton, 'click', function() {
			if (minimized) {
				stickyPlayerContainerParent.classList.remove('wbtz-minimized');
				setStyle(stickyPlayerContainerParent, side, sideSpacing + '%');
				playerContainer.player.play();

				sendEvent('video.sticky.show', 'video', {
					dimension1: params.clip.id,
					dimension7: category,
					Instance_ID: playerContainer.player.randomInstanceId
				});

				minimized = false;
			} else {
				stickyPlayerContainerParent.classList.add('wbtz-minimized');
				setStyle(stickyPlayerContainerParent, side, -stickyWidth + 'px');
				playerContainer.player.pause();

				sendEvent('video.sticky.hide', 'video', {
					dimension1: params.clip.id,
					dimension7: category,
					Instance_ID: playerContainer.player.randomInstanceId
				});

				minimized = true;
			}
		});

		function showPlayer() {
			setStyle(playerContainer, 'visibility', 'visible');
		}

		/*
		* Resize player
		*
		* @param 	width 	width to set in px
		* @param 	height 	height to set in px
		*/
		function resizePlayer(width, height) {
			setStyles(playerContainer, {
				width: width + 'px',
				height: height + 'px',
				visibility: playerContainer.player ? 'hidden' : 'visible'
			});

			if (playerContainer.player) {
				if (!playerContainer.player.paused) playerContainer.player.play();

				// Handle visibility for player while loading
				if (!playerContainer.player.totalViewableTime && playerContainer.player.sequence === 1) showPlayer();

				playerContainer.player.off('resize', showPlayer).on('resize', showPlayer);
				playerContainer.player.resize();
			}
		}

		/*
		* Handle end of animations
		*
		* @param 	event 	animation event
		*/
		function onAnimationEnd(event) {
			if (event.animationName.indexOf('out') > -1) {
				stickyPlayerContainerParent.classList.remove('wbtz-' + animation + 'out');
				stickyPlayerContainerParent.classList.remove('wbtz-show');
			} else if (event.animationName.indexOf('in') > -1) {
				stickyPlayerContainerParent.classList.add('wbtz-show');
				stickyPlayerContainerParent.classList.remove('wbtz-' + animation + 'in');
			}
		}

		/**
		 * If the main player has already been viewed, the player isn't in fullscreen and there's no ad playing, select which player to show and show it.
		 *
		 */
		function toggleStickyPlayer() {
			if (mainPlayerViewed && !fullscreen && !adPlaying) {
				if (playerInView === 'main' && !isInViewPort(playerContainerParent)) showStickyPlayer();
				if (playerInView === 'sticky' && isInViewPort(playerContainerParent) && stickyPlayerViewd) hideStickyPlayer();
				playerInView = isInViewPort(playerContainerParent) ? 'main' : 'sticky';
			} else {
				mainPlayerViewed = hasBeenViewed(playerContainerParent);
			}
		}
		
		function showStickyPlayer() {
			stickyPlayerViewd = true;
			playerContainer = appendElement(playerContainer, stickyPlayerContainerParent);
			removeEventListeners(stickyPlayerContainerParent, animationEvent, onAnimationEnd);
			stickyPlayerContainerParent.classList.add('wbtz-' + animation + 'in');
			addEventListeners(stickyPlayerContainerParent, animationEvent, onAnimationEnd);
			resizePlayer(stickyWidth, stickyHeight);
		}

		function hideStickyPlayer() {
			playerContainer = appendElement(playerContainer, playerContainerParent);		
			
			// Animate out if player is not minimized
			if (!minimized) stickyPlayerContainerParent.classList.add('wbtz-' + animation + 'out');
			else stickyPlayerContainerParent.classList.remove('wbtz-show');

			removeEventListeners(stickyPlayerContainerParent, animationEvent, onAnimationEnd);
			addEventListeners(stickyPlayerContainerParent, animationEvent, onAnimationEnd);
			resizePlayer(width, height);
		}

		/**
		 * Remove scroll event so player won't stick anymore and mute it
		 *
		 */
		playerContainer.reset = function() {
			removeEventListeners(window, 'scroll', toggleStickyPlayer);
			hideStickyPlayer();
			playerContainer.player.mute();
		}

		// Initial values
		mainPlayerViewed = hasBeenViewed(playerContainerParent);
		playerInView = isInViewPort(playerContainer) ? 'main' : 'sticky';

		addEvent(window, 'scroll', toggleStickyPlayer);

		container.destroy = function() {
			playerContainer.destroy();
			removeEventListeners(window, 'scroll', toggleStickyPlayer);
			removeElement(this);
		}

		return container;
	}

	/**
	 * Embed a play button on an image
	 *
	 * @param	params 		the embed parameters. Available options:
	 *
	 * 			clip			the clip to play when the button is clicked
	 * 			playerParams	player params
	 * 			img				the image element to embed a button on
	 * 			replace			replace the image with a player immediately [optional]
	 * 			elementId		element id for the embed [optional]
	 * 			onclick			callback function to run when the button is clicked [optional]
	 */
	function embedImagePlayButton(params) {
		// Init default img
		var img = params.container;

		var buttonSrc = IMG_DIR + 'play-icon-';
		var watchIcon = IMG_DIR + 'quick-watch-icon.svg';
		var preloader = new Image();

		preloader.src = buttonSrc + 'active.svg';

		if (img && img.parentNode) {
			var parent = img.parentNode;
			var width = img.offsetWidth;
			var height = img.offsetHeight;
			var embedParams;

			html2element('<style type="text/css">.wbtz-embed{background:center no-repeat #000;font-size:20px;color:#fff;font-family:Sans-Serif;font-weight:100;position:relative;background-size:cover;z-index:1}.wbtz-embed .wbtz-embed-overlay{background:rgba(0,0,0,.5);position:absolute;z-index:101;top:0;background-size:10%;background-position:center!important;background-repeat:no-repeat!important;cursor:pointer}.wbtz-embed .wbtz-embed-quick-watch{position:absolute;z-index:30000;width:auto;background-position:left center;background-size:contain;background-repeat:no-repeat}</style>', parent, false);

			var container = makeElement('div', parent, true, {
				width:		width + 'px',
				height:		height + 'px'
			}, 'wbtz-embed');
			appendElement(img, container);

			var overlay = makeElement('div', container, true, {
				width:		width + 'px',
				height:		height + 'px',
				backgroundImage: 'url(' + buttonSrc + 'normal.svg)'
			}, 'wbtz-embed-overlay');

			var quickWatchHeight = width * 0.07;
			var quickWatchLeft = width * 0.04;
			var quickWatchTop = quickWatchLeft;
			var quickWatchPadding = quickWatchHeight / 3;
			var quickWatchFontSize = quickWatchHeight * 0.45;

			var quickWatchContainer = makeElement('div', container, true, {
				backgroundImage: 'url(' + watchIcon + ')',
				height: quickWatchHeight + 'px',
				paddingLeft: (quickWatchHeight + quickWatchPadding) + 'px',
				top: quickWatchTop + 'px',
				left: quickWatchLeft + 'px'
			}, 'wbtz-embed-quick-watch');

			var duration = timeFormat(params.clip.duration);
			var quickWatchText = getLocalizedString('quickWatch', params.clip.language);
			var quickWatchTitle = makeElement('div', quickWatchContainer, true, {
				height: quickWatchHeight + 'px',
				lineHeight: (quickWatchHeight * 1.1) + 'px',
				fontSize: quickWatchFontSize + 'px'
			}, 'wbtz-embed-title');
			quickWatchTitle.textContent = (quickWatchText + (!!duration ? ' | ' + duration : '')).toUpperCase();

			// Handle mouse hover for the overlay (Change the button's image)
			var active = false;
			addEvent(overlay, 'mouseover', function() {
				if (!active) {
					setStyle(overlay, 'backgroundImage', 'url(' + buttonSrc + 'active.svg)');
					active = true;
				}
			});
			addEvent(overlay, 'mouseout', function(e) {
				active = false;
				setStyle(overlay, 'backgroundImage', 'url(' + buttonSrc + 'normal.svg)');
			});

			if (isMobile || params.replace || params.playerParams.autoplay) {
				embedParams = extend(params, {
					clip: params.clip,
					type: params.type,
					playerParams: params.playerParams,
					container: emptyElement(container),
					dontLog: true,
					width: width,
					height: height,
					img: img
				});

				params.disableSticky ? embedPlayer(embedParams) : embedStickyPlayer(embedParams);

				if (params.onclick) params.onclick();
			} else {
				addEvent(overlay, 'click', function(e) {
					e = e || window.event;
					if (e.stopPropagation) {
						e.stopPropagation();
					} else {
						e.cancelBubble = true;
					}

					// Log video.click
					sendEvent('video.click', 'video', {
						dimension1: params.clip.id,
						dimension3: params.clip.publisherName,
						dimension6: getVideoType(params.clip.cliptype),
						dimension7: params.stickyPlayer ? 'Sticky Player' : 'Embed',
						dimension8: 'image'
					}, {
						metric21: 1
					});

					if (params.onclick) params.onclick();

					embedParams = {
						clip: params.clip,
						type: params.type,
						playerParams: extend({
							autoplay: true
						}, params.playerParams),
						container: emptyElement(container),
						dontLog: true,
						isImage: true,
						width: width,
						height: height,
						img: img,
						onReady: function() {
							// Log video.impression
							sendEvent('video.impression', 'video', {
								dimension1: params.clip.id,
								dimension3: params.clip.publisherName !== 'wibbitz' ? params.clip.publisherName : null,
								dimension6: getVideoType(params.clip.cliptype),
								dimension7: params.stickyPlayer ? 'Sticky Player' : 'Embed',
								dimension8: 'image',
								dimension11: getPlayMode(params.playerParams.autoplay),
								dimension16: String(isInViewPort(container)),
								dimension67: params.playerParams['vdz-campaign'],
								Type: 'main',
								Sticky: (!isMobile && params.disableSticky) || (isMobile && params.disableStickyMobile),
								Static: params.isStatic,
								Image: true,
								Instance_ID: playerContainer.player.randomInstanceId
							}, {
								metric2: 1,
								metric144: new Date() - EMBEDDED_TIME
							});
						}
					};

					params.disableSticky ? embedPlayer(embedParams) : embedStickyPlayer(embedParams);
				});
			}

			return container;
		}
	}

	/**
	 * Embed a small play button in container
	 *
	 * @param	clip		the clip to play when the button is clicked
	 * @param	container	target elemnt to hold the play button in
	 * @param	onclick		callback function to run when the button is clicked [optional]
	 */
	function embedSmallPlayButton(clip, container, onclick) {
		var element = html2element('<div><span style="display:inline-block;margin:12px 6px 0 10px;font-weight:400">QUICK WATCH</span><span style="font-weight:100">' + timeFormat(clip.duration) + '</span></div>', container, null, {
			cursor:			'pointer',
			fontFamily:		'Sans-Serif',
			borderTop:		'1px solid #bfbfbf',
			borderBottom:	'1px solid #bfbfbf',
			width:	'100%',
			height:	'40px',
			margin:	'12px 0 6px',
		});

		makeElement('div', element, true, {
			background:		'url(' + IMG_DIR + 'play-icon-active.svg)',
			backgroundSize:	'cover',
			width:		'22px',
			height:		'26px',
			marginTop:	'8px',
			float:		'left'
		});

		addEvent(element, 'click', function() {
			// Log video.click
			sendEvent('video.click', 'video', {
				dimension1: clip.id,
				dimension3: clip.publisherName,
				dimension6: getVideoType(clip.cliptype),
				dimension7: 'Embed',
				dimension8: 'button'
			}, {
				metric21: 1
			});

			// Open a lightbox
			lightbox(clip);

			// If a callback exists, run it
			if (onclick) {
				onclick();
			}
		});

		// Log video.impression
		sendEvent('video.impression', 'video', {
			dimension1: clip.id,
			dimension3: clip.publisherName !== 'wibbitz' ? clip.publisherName : null,
			dimension6: getVideoType(clip.cliptype),
			dimension7: 'Embed',
			dimension8: 'button',
			dimension11: getPlayMode(params.playerParams.autoplay),
			dimension16: String(isInViewPort(element)),
			dimension67: params.playerParams['vdz-campaign'],
			Sticky: (!isMobile && params.disableSticky) || (isMobile && params.disableStickyMobile),
			Static: params.isStatic,
			Image: true
		}, {
			metric2: 1,
			metric144: new Date() - EMBEDDED_TIME
		});

		return element;
	}

	/**
	 * Opens a lightbox with a player in it
	 */
	function lightbox(clip, params, width, height, useIframes) {
		// Create default params and extend with the optional params
		params = extend({
			id: clip.id,
			autoplay: true,
			context: 'embd'
		}, params);

		var body = document.body;
		if (body) {
			width = width || 800;
			height = height || 450;

			var boxHeight = height + 130;

			// Create overlay
			var overlay = makeElement('div', body, true, {
				position: 'fixed',
				width: '100%',
				height: '100%',
				zIndex: 10000100,
				backgroundColor: 'rgba(0,0,0,.6)'
			}, 'wbtz-embed-lightbox-overlay');

			// Create box
			var box = makeElement('div', overlay, false, {
				position: 'fixed',
				width: width + 'px',
				//height: boxHeight + 'px',
				zIndex: 10000101,
				left: (window.innerWidth / 2 - width / 2) + 'px',
				top: (window.innerHeight / 2 - height / 2) + 'px'
			}, 'wbtz-embed-lightbox-box');

			// Create title and add it to the box
			makeElement('div', box, false, {
				float: 'left',
				fontFamily: 'Sans-Serif',
				fontSize: '24px',
				color: 'white',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				width: '94%',
				lineHeight: '25px'
			}, 'wbtz-embed-lightbox-box-title').textContent = clip.title.replace(/\\/g, "");

			// Create a close button
			var close = makeElement('div', box, false, {
				backgroundImage: 'url(' + IMG_DIR + 'close.png)',
				width: '25px',
				height: '25px',
				float: 'right',
				cursor: 'pointer'
			}, 'wbtz-embed-lightbox-box-close');

			if (useIframes) {
				// Old - Uses iframe
				html2element('<iframe src="' + PLAYER_URL + '?' + objectToQueryString(params) + '" marginheight="0" marginwidth="0" frameborder="0" height="' + height + '" width="' + width + '"></iframe>', box);
			} else {
				// Create a player container and initialize a player in it
				var element = makeElement('div', box, false, {
					width: width + 'px',
					height: height + 'px'
				}, 'wbtz-embed-lightbox-box-player');

				loadScript({
					id: 'wibbitz-player-api',
					source: PLAYER_API_URL,
					load: function() {
						wibbitz.loadApi(function() {
							element.player = new wibbitz.Player(params, element);
						});
					}
				});
			}

			// Create a hjide function to bind to the close button and the overlay
			var hide = function(e) {
				if (overlay && e.target === e.currentTarget) {
					removeElement(overlay);
					overlay = null;
				}
			};

			addEvent(overlay, 'click', hide);
			addEvent(close, 'click', hide);
		}
	}

	/***********************************************************************
	 * Widget embedding functions
	 **********************************************************************/
	/**
	 * Get and embed the new recomended widget
	 *
	 * @param	params 		the embed parameters. Available options:
	 *
	 * 			clips				list of recommended clips
	 * 			playerParams		additional parameters to add to the player's query [optional]
	 * 			container			container for widget
	 * 			ads					paid recommendations [outbrain]
	 * 			elementId			element id for the embed [optional]
	 *			hideRecommendBar 	hide the recommendations bar [optional]
	 *			width 				the player's width [optional]
	 *			height 				the player's height [optional]
	 * @return						the container element of this widget
	 */
	function embedRecommendPlayerWidget(params) {
		if (!params.container || (params.container && params.container.getAttribute('embedded'))) return;
		else params.container.setAttribute('embedded', true);
		
		// Initialize helper functions for this widget
		var scrollTimer;

		/**
		 * Horizontal recommend bar scroll
		 *
		 * @param	speed			number of pixels to scroll by
		 * @param	scrollToObj		object to scroll to
		 * @param	lastPosition	scrolling position after last scroll
		 * @param	scrollDirection	scroll right / left
		 */
		function scrollHorizontally (speed, scrollToObj, lastPosition, scrollDirection) {
			// Prevent collision between multiple scrolls
			clearTimeout(scrollTimer);

			// Check if there is room left to scroll (visible content position vs scroll position)
			if (clipsContainer.scrollLeft <= (clipsContainer.scrollWidth - clipsContainer.offsetWidth)) {
				// Scroll by speed or scroll to object
				if (scrollToObj) {
					// Margin to perfect the scroll position
					var offsetFix = clipsContainer.scrollLeft - scrollToObj.offsetLeft;

					if (!scrollDirection) {
						// Object requires left or right scrolling
						if (clipsContainer.scrollLeft > scrollToObj.offsetLeft) scrollHorizontally(-speed, scrollToObj, clipsContainer.scrollLeft, 'left');
						else scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'right');
					} else {
						if (scrollDirection === 'left') {
							// Check if next scroll will cause overscroll and scroll by offset
							if ((clipsContainer.scrollLeft - speed) < scrollToObj.offsetLeft) {
								clipsContainer.scrollLeft -= offsetFix;
								clearTimeout(scrollTimer);
							} else {
								clipsContainer.scrollLeft -= speed;

								if (clipsContainer.scrollLeft > scrollToObj.offsetLeft && lastPosition !== clipsContainer.scrollLeft) {
									scrollTimer = setTimeout(function() {
										scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'left');
									}, 30);
								} else {
									clearTimeout(scrollTimer);
								}
							}
						} else {
							// Check if next scroll will cause overscroll and scroll by offset
							if ((clipsContainer.scrollLeft - speed) > scrollToObj.offsetLeft) {
								clipsContainer.scrollLeft -= offsetFix;
								clearTimeout(scrollTimer);
							} else {
								clipsContainer.scrollLeft -= speed;

								if (clipsContainer.scrollLeft < scrollToObj.offsetLeft && lastPosition !== clipsContainer.scrollLeft) {
									scrollTimer = setTimeout(function() {
										scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'right');
									}, 30);
								} else {
									clearTimeout(scrollTimer);
								}
							}
						}
					}
				} else {
					clipsContainer.scrollLeft -= speed;

					// Handle infinite scrolling
					if (lastPosition !== clipsContainer.scrollLeft) {
						scrollTimer = setTimeout(function() {
							scrollHorizontally(speed, undefined, clipsContainer.scrollLeft);
						}, 30);
					} else {
						clearTimeout(scrollTimer);
					}
				}
			}
		}

		/**
		 * Plays next clip
		 *
		 * @param 	clip 	clip to play, override next clip
		 */
		function playNextClip(clip, disableCallback) {
			// If a video is selected from the recommend bar, reset numClipsPlayed
			numClipsPlayed = clip ? 0 : numClipsPlayed + 1;

			if (numClipsPlayed >= maxSequences) {
				playerContainer.player.endingScreenRoutine(true);
				return;
			}
			
			if (playerContainer.player.infoBar) playerContainer.player.infoBar.hide();
			if (playerContainer.player.controls) playerContainer.player.controls.hide();
			if (playerContainer.player.adIndicator) playerContainer.player.adIndicator.remove();

			// Select next clip
			currentPlayingClip = clip || params.clips[(currentPlayingClip.index + 1) % params.clips.length];

			var options = {
				clipId: currentPlayingClip.id,
				autoplay: true,
				showOpeningScreen: false
			};
			
			if (currentPlayingClip.clickCallback) options.onPlay = currentPlayingClip.clickCallback;
			
			// Restart the player with new options options
			playerContainer.player.restart(options);
			
			if (!params.hideRecommendBar) {
				currentScrolledElement = elementContainers[currentPlayingClip.index + (params.ads ? params.ads.length : 0)];
				
				// Display the duration
				setStyles(currentPlayingClip.durationContainer, {
					display: 'block'
				});

				removeElement(nowPlayingOverlay);

				// Add now playing overlay
				createNowPlayingOverlay(currentPlayingClip, smallClipWidth, smallClipHeight);

				scrollHorizontally(-10, currentPlayingClip.container);
			}

			if (!disableCallback && params.onPlayNextClip) params.onPlayNextClip(currentPlayingClip);
		}

		function updateNextPreviouesClips(scrollDirection) {
			if (scrollDirection === 'right') {
				currentScrolledElement = elementContainers[(currentScrolledElement.index + 1) % elementContainers.length];
				return currentScrolledElement;
			} else {
				// Do nothing if trying to scroll back from first clip
				if (currentScrolledElement.index === 0) {
					return currentScrolledElement;
				} else {
					currentScrolledElement = elementContainers[(currentScrolledElement.index - 1) % elementContainers.length];
					return currentScrolledElement;
				}
			}
		}

		function createNowPlayingOverlay(clip, smallClipWidth, smallClipHeight) {
			// Hide the duration
			setStyles(clip.durationContainer, {
				display: 'none'
			});

			nowPlayingOverlay = makeElement('div', clip.container, true, {
				width:		smallClipWidth + 'px',
				height:		smallClipHeight + 'px',
				backgroundColor: hexToRgba(params.themeColor, 0.7)
			}, 'wbtz-widget-now-playing-overlay');

			// Now playing title
			html2element('<div>' + getLocalizedString('nowPlaying', clip.language) + '</div>', nowPlayingOverlay, false, {}, 'wbtz-widget-now-playing-title');
		}

		function onResize() {
			// Update size parameters
			width = currentWidth || params.container.offsetWidth;
			height = width / ratio;
			smallClipWidth = width / (width > 305 ? 2.5 : 1.5);
			smallClipHeight = smallClipWidth / ratio;

			// Handle resizing recommend bar
			if (length >= 3) {
				// Update containers with current width
				setStyles(recommendBarContainer, {
					width: width + 'px'
				});

				setStyles(clipsContainer, {
					width: width + 'px'
				});

				// Update arrows size
				setStyles(leftArrow, {
					width: width / 9 + 'px'
				});

				setStyles(rightArrow, {
					width: width / 9 + 'px'
				});

				// Update clip overlays width and height
				setStyles(nowPlayingOverlay, {
					width: smallClipWidth + 'px',
					height: smallClipHeight + 'px'
				});

				// Change ads size
				if (params.ads) {
					params.ads.forEach(function(ad) {
						setStyles(ad.container.poster, {
							width: smallClipWidth + 'px',
							height:	smallClipHeight + 'px'
						});

						setStyles(ad.container.adOverlay, {
							width: smallClipWidth + 'px',
							height:	smallClipHeight + 'px'
						});
					});
				}

				// Change clips size
				params.clips.forEach(function(clip) {
					setStyles(clip.container.poster, {
						width: smallClipWidth + 'px',
						height:	smallClipHeight + 'px'
					});

					setStyles(clip.container.clipOverlay, {
						width: smallClipWidth + 'px',
						height:	smallClipHeight + 'px'
					});
				});

				// Fix position of current scrolled element to left
				scrollHorizontally(-scrollSpeed * 100, currentScrolledElement.container);
			}

			// Set player width, height
			setStyles(playerDivider, {
				width: width + 'px',
				height:	height + 'px'
			});

			setStyles(playerContainer, {
				width: width + 'px',
				height:	height + 'px'
			});
		}
		
		var player;
		var container = params.container;
		var ratio = 16/9;
		var width = params.width || params.container.offsetWidth;
		var height = params.height || (width / ratio);
		var smallClipWidth = width / (width > 305 ? 2.5 : 1.5);
		var smallClipHeight = smallClipWidth / ratio;
		var scrollSpeed = 15;
		var nowPlayingOverlay;
		var elementContainers = [];
		var currentPlayingClip;
		var currentScrolledElement;
		var embedContainer;
		var playerContainer;
		var playerDivider;
		var clipsContainer;
		var length = params.clips.length;
		var numClipsPlayed = 0;
		var currentWidth;
		var maxSequences = params.playerParams.maxSequences || 50;
		if (params.ads) length += params.ads.length;
		if (params.extraMargins) height += (height * params.extraMargins / 100);

		if (params.clips.length) {
			embedContainer = params.container;
			inlineCssContainer = html2element('<style type="text/css">.wbtz-widget-divider{background-color:#000}.wbtz-widget-recommend-bar{position:relative}.wbtz-widget-recommend-bar .wbtz-widget-left-arrow,.wbtz-widget-recommend-bar .wbtz-widget-right-arrow{background:rgba(0,0,0,.5);position:absolute;z-index:150;height:calc(100% - 4px);top:3px;opacity:0;pointer-events:none;-webkit-transition:all 250ms 0s ease-in-out;-moz-transition:all 250ms 0s ease-in-out;-o-transition:all 250ms 0s ease-in-out;-ms-transition:all 250ms 0s ease-in-out;transition:all 250ms 0s ease-in-out}.wbtz-widget-recommend-bar .wbtz-widget-left-arrow .wbtz-widget-left-arrow-icon,.wbtz-widget-recommend-bar .wbtz-widget-left-arrow .wbtz-widget-right-arrow-icon,.wbtz-widget-recommend-bar .wbtz-widget-right-arrow .wbtz-widget-left-arrow-icon,.wbtz-widget-recommend-bar .wbtz-widget-right-arrow .wbtz-widget-right-arrow-icon{background:url(//cdn4.wibbitz.com/images/arrow-big.svg) center no-repeat;background-size:65%;position:absolute;z-index:151;height:100%}.wbtz-widget-recommend-bar .wbtz-widget-left-arrow{transform:scaleX(-1);left:0}.wbtz-widget-recommend-bar .wbtz-widget-left-arrow .wbtz-widget-left-arrow-icon{left:0}.wbtz-widget-recommend-bar .wbtz-widget-right-arrow,.wbtz-widget-recommend-bar .wbtz-widget-right-arrow .wbtz-widget-right-arrow-icon{right:0}.wbtz-widget-recommend-bar:hover .wbtz-widget-left-arrow,.wbtz-widget-recommend-bar:hover .wbtz-widget-right-arrow{opacity:1;pointer-events:all}.wbtz-widget-recommend-bar .wbtz-widget-clips-container{overflow:hidden}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-play-icon{background:url(//cdn4.wibbitz.com/images/play-rounded.svg) no-repeat;margin:.28em;width:25px;height:25px;display:inline-block;position:absolute;bottom:12px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table{display:table}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip{display:table-cell;position:relative;padding:3px 3px 0 0}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip:last-child{padding:3px 0 0}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-clip-poster{background-size:cover}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-clip-overlay{background:linear-gradient(to bottom,rgba(255,255,255,.08) 0,rgba(122,122,122,.08) 25%,rgba(0,0,0,.3) 100%);cursor:pointer;position:absolute;z-index:110}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-clip-overlay .wbtz-widget-clip-texts{font-family:Roboto,sans-serif;width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%);position:absolute;bottom:0;text-align:left}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-clip-overlay .wbtz-widget-clip-texts .wbtz-widget-clip-title{width:75%;height:34px;color:#fff;font-size:14px;position:absolute;bottom:10px;overflow:hidden;line-height:17px;margin-left:35px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-clip-overlay .wbtz-widget-clip-texts .wbtz-widget-clip-duration{width:75%;height:17px;color:#fff;font-size:14px;position:absolute;top:10px;overflow:hidden;line-height:17px;margin-left:10px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-now-playing-overlay{font-family:Roboto,sans-serif;background:rgba(0,185,255,.7);cursor:pointer;position:absolute;z-index:102;top:3px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-clip .wbtz-widget-now-playing-overlay .wbtz-widget-now-playing-title{color:#fff;font-size:14px;position:absolute;font-weight:700;top:10px;height:17px;line-height:17px;margin-left:10px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad{display:table-cell;position:relative;padding:3px 3px 0 0}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-poster{background-size:cover}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay{background:linear-gradient(to bottom,rgba(255,255,255,.08) 0,rgba(122,122,122,.08) 25%,rgba(0,0,0,.3) 100%);cursor:pointer;position:absolute;z-index:110}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts{font-family:Roboto,sans-serif;width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%);position:absolute;bottom:0}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-source{width:75%;height:17px;color:#f0f0f0;font-size:12px;position:absolute;bottom:43px;overflow:hidden;line-height:17px;margin-left:35px;font-style:italic}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-title{width:75%;height:34px;color:#fff;font-size:14px;position:absolute;bottom:10px;overflow:hidden;line-height:17px;margin-left:35px}.wbtz-widget-recommend-bar .wbtz-widget-clips-container .wbtz-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-promoted{color:#fff;font-size:12px;position:absolute;top:0;left:0;padding:2px 3px;background:rgba(0,0,0,.4);overflow:hidden;line-height:17px}</style>', embedContainer, false); // Inject inline css
			playerDivider = html2element('<div class="wbtz-widget-divider"></div>', embedContainer, false, {
				width: width + 'px',
				height: height + 'px'
			});
			playerContainer = html2element('<div class="wbtz-widget-player-container"></div>', playerDivider, false);

			var playerParams = extend({
				clipId: params.clips[0].id,
				autoplay: false,
				poster: 'title',
				context: 'pwdgt'
			}, params.playerParams);

			if (params.clips[0].clickCallback) {
				playerParams.onPlay = params.clips[0].clickCallback;
			}

			// Add an onComplete event to get the next clip if there's more than 3 clips
			if (length >= 3) {
				playerParams.onComplete = playNextClip;
			} else {
				playerParams.next = 'none';
			}

			// Embed player
			setTimeout(function() {
				playerContainer = embedPlayer({
					playerParams: extend(playerParams, {
						onReady: function() {
							if (params.onReady) params.onReady(playerContainer);

							// Log video.impression
							sendEvent('video.impression', 'video', {
								dimension1: params.clips[0].id,
								dimension3: params.clips[0].publisherName !== 'wibbitz' ? params.clips[0].publisherName : undefined,
								dimension6: getVideoType(params.clips[0].cliptype),
								dimension7: params.analyticsCategory || 'Player Widget',
								dimension9: String(length >= 3),
								dimension11: getPlayMode(params.playerParams.autoplay),
								dimension16: String(isInViewPort(params.container)),
								dimension67: params.playerParams['vdz-campaign'],
								API_Latest_Request_Time: latestRequestTime,
								CDN_Load_Time: cdnRequestTime,
								Type: 'widget',
								Sticky: (!isMobile && params.disableSticky) || (isMobile && params.disableStickyMobile),
								Static: params.isStatic,
								Recbar: !params.hideRecommendBar,
								Instance_ID: playerContainer.player.randomInstanceId
							}, {
								metric2: 1,
								metric107: length,
								metric144: new Date() - EMBEDDED_TIME
							});
						}
					}),
					container: playerContainer,
					recbar: !params.hideRecommendBar,
					context: params.analyticsContext,
					maxSequences: params.playerParams.maxSequences,
					dontLog: true,
					width: width,
					height: height
				});
			}, 300);
		}

		if (length >= 3) {
			if (params.hideRecommendBar) {
				// Embed recomended bar
				params.clips.forEach(function(clip, index, clips) {
					// Set clip index
					clip.index = index;

					if (clip.index === 0) {
						currentPlayingClip = clip;
					}
				});
			} else {
				var recommendBarContainer = makeElement('div', embedContainer, false, {
					width: width + 'px'
				}, 'wbtz-widget-recommend-bar');

				// Container and gradient background for arrow
				var leftArrow = makeElement('div', recommendBarContainer, true, {
					width: width / 9 + 'px'
				}, 'wbtz-widget-left-arrow');

				// Arrow icon
				makeElement('div', leftArrow, true, {
					width: width / 9 + 'px'
				}, 'wbtz-widget-left-arrow-icon');

				// Container and gradient background for arrow
				var rightArrow = makeElement('div', recommendBarContainer, true, {
					width: width / 9 + 'px'
				}, 'wbtz-widget-right-arrow');

				// Arrow icon
				makeElement('div', rightArrow, true, {
					width: width / 9 + 'px'
				}, 'wbtz-widget-right-arrow-icon');

				// Handle scroll action for each arrow
				addEvent(leftArrow, 'click', function() {
					scrollHorizontally(scrollSpeed, updateNextPreviouesClips('left').container, undefined, 'left');
				});
				addEvent(rightArrow, 'click', function() {
					scrollHorizontally(-scrollSpeed, updateNextPreviouesClips('right').container);
				});

				clipsContainer = makeElement('div', recommendBarContainer, false, {
					width: width + 'px'
				}, 'wbtz-widget-clips-container');
				var clipsTable = makeElement('div', clipsContainer, false, {}, 'wbtz-widget-clips-container-table');

				// Embed ads into the recommend bar
				if (params.ads) {
					params.ads.forEach(function(ad, index, ads) {
						// Set clip index
						ad.index = index;

						// Set ad container
						ad.container = makeElement('div', clipsTable, false, {}, 'wbtz-widget-ad');

						// Add container to elementContainers array, used for scrolling
						elementContainers.push({
							container: ad.container,
							index: index
						});

						// Poster image
						ad.container.poster = makeElement('div', ad.container, false, {
							width: smallClipWidth + 'px',
							height: smallClipHeight + 'px',
							backgroundImage: 'url(' + ad.thumbnail.url + ')'
						}, 'wbtz-widget-ad-poster');

						ad.container.adOverlay = adInfoOverlay = makeElement('div', ad.container, true, {
							width: smallClipWidth + 'px',
							height:	smallClipHeight + 'px'
						}, 'wbtz-widget-ad-overlay');

						// Ad texts: source, content, play icon, promoted
						var adTexts = makeElement('div', adInfoOverlay, false, {}, 'wbtz-widget-ad-texts');

						html2element('<div>' + ad.source_display_name + '</div>', adTexts, false, {}, 'wbtz-widget-ad-source');

						html2element('<div>' + ad.content + '</div>', adTexts, false, {}, 'wbtz-widget-ad-title');

						makeElement('span', adTexts, true, {}, 'wbtz-widget-play-icon');

						html2element('<div>Promoted</div>', adTexts, false, {}, 'wbtz-widget-ad-promoted');

						addEvent(ad.container, 'click', function() {
							window.open(ad.url,'_blank');
						});

						if (ad.index === 0) currentScrolledElement = ad;
					});
				}
				
				// Embed recomended bar
				params.clips.forEach(function(clip, index, clips) {
					// Set clip index
					clip.index = index;

					// Set clip container
					clip.container = makeElement('div', clipsTable, false, {}, 'wbtz-widget-clip');

					// Add container to elementContainers array, used for scrolling
					elementContainers.push({
						container: clip.container,
						index: index + (params.ads ? params.ads.length : 0)
					});

					// Poster image
					clip.container.poster = makeElement('div', clip.container, false, {
						width: smallClipWidth + 'px',
						height: smallClipHeight + 'px',
						backgroundImage: 'url(' + removeHttpPrefix(clip.posterurl) + ')'
					}, 'wbtz-widget-clip-poster');

					clip.container.clipOverlay = makeElement('div', clip.container, true, {
						width: smallClipWidth + 'px',
						height:	smallClipHeight + 'px'
					}, 'wbtz-widget-clip-overlay');

					// Clip texts: title, duration, play icon
					var clipTexts = makeElement('div', clip.container.clipOverlay, false, {}, 'wbtz-widget-clip-texts');

					html2element('<div>' + clip.title + '</div>', clipTexts, false, {}, 'wbtz-widget-clip-title');

					clip.durationContainer = html2element('<div>' + timeFormat(clip.duration) + '</div>', clipTexts, false, {}, 'wbtz-widget-clip-duration');

					makeElement('span', clipTexts, true, {}, 'wbtz-widget-play-icon');

					addEvent(clip.container, 'click', function() {
						if (currentPlayingClip !== clip) {
							// Log recbar.click
							sendEvent('recbar.click', 'recbar', {
								dimension1: clip.id,
								dimension3: clips[0].publisherName,
								dimension6: getVideoType(clip.cliptype),
								dimension7: params.analyticsCategory || 'Player Widget',
								dimension9: String(true),
								Instance_ID: playerContainer.player.randomInstanceId
							}, {
								metric10: 1
							});

							playNextClip(clip);
						}
					});

					if (clip.index === 0) {
						createNowPlayingOverlay(clip, smallClipWidth, smallClipHeight);
						currentPlayingClip = clip;
						if (!currentScrolledElement) currentScrolledElement = currentPlayingClip;
					}
				});	
			}
		}

		// Handle window resizing
		addEvent(window, 'resize', onResize);

		// External Functions
		params.container.setWidth = function(width) {
			currentWidth = width;
		};

		params.container.nextClip = function(clipId) {
			var selectedClip;

			params.clips.forEach(function(clip) {
				if (clip.id === clipId) selectedClip = clip;
			});

			if (selectedClip) playNextClip(selectedClip, true);
		};

		if (!params.hidePoweredBy) embedPoweredBy(params.container);

		container.destroy = function() {
			playerContainer.destroy();
			removeEventListeners(window, 'resize', onResize);
			removeElement(this);
		};

		return container;
	}

	/**
	 * Emebd widget for mobile devices
	 *
	 * @param	params 		the embed parameters. Available options:
	 *
	 * 			clips			list of recommended clips
	 * 			playerParams	additional parameters to add to the player's query [optional]
	 * 			container		container for widget
	 * 			elementId		element id for the embed [optional]
	 *			format 			square / landscape
	 * 			ads				paid recommendations [outbrain]
	 * @return					the container element of this widget
	 */
	function embedMobileWidget(params) {
		if (!params.container || (params.container && params.container.getAttribute('embedded'))) return;
		else params.container.setAttribute('embedded', true);

		// Initialize helper functions for this widget
		var scrollTimer;

		// Init touch locations
		var xDown;
		var yDown;

		// Should click event be triggered with touchend
		var preventClick = false;

		/**
		 * Scroll to selected object
		 *
		 * @param 	speed 			number of pixels to scroll each time, results in speed of scrolling
		 * @param 	scrollToObj 	object to scroll to
		 * @param 	lastPosition 	offset of last scroll
		 */
		function scrollHorizontally(speed, scrollToObj, lastPosition) {
			// Prevent collision between multiple scrolls
			clearTimeout(scrollTimer);

			// Position to scroll to
			var scrollTo = scrollToObj.offsetLeft - gutterWidth;

			// Difference between next scrolling position to prevent over scroll
			var offsetFix = (widgetClipsContainer.scrollLeft - speed) - scrollTo;

			if (speed > 0) {
				if ((widgetClipsContainer.scrollLeft - speed) < scrollTo) {
					widgetClipsContainer.scrollLeft -= (speed + offsetFix);
					clearTimeout(scrollTimer);
				} else {
					widgetClipsContainer.scrollLeft -= speed;

					// Stop scroll if reached target or end of left side
					if (widgetClipsContainer.scrollLeft > scrollTo && widgetClipsContainer.scrollLeft !== 0) {
						scrollTimer = setTimeout(function() {
							scrollHorizontally(speed, scrollToObj);
						}, 30);
					} else {
						clearTimeout(scrollTimer);
					}
				}
			} else {
				if ((widgetClipsContainer.scrollLeft - speed) > scrollTo) {
					widgetClipsContainer.scrollLeft -= (speed + offsetFix);
					clearTimeout(scrollTimer);
				} else {
					widgetClipsContainer.scrollLeft -= speed;

					// Stop scroll if reached target or scrolled twice to the same position (prevent infinite scroll)
					if (widgetClipsContainer.scrollLeft < scrollTo && lastPosition !== widgetClipsContainer.scrollLeft) {
						scrollTimer = setTimeout(function() {
							// Send current scroll position to compare if scrolled again to same place
							scrollHorizontally(speed, scrollToObj, widgetClipsContainer.scrollLeft);
						}, 30);
					} else {
						clearTimeout(scrollTimer);
					}
				}
			}
		}

		/**
		 * Prevent clickand get x,y points of the click
		 */
		function handleTouchStart(event) {
			xDown = event.touches[0].clientX;
			yDown = event.touches[0].clientY;
			preventClick = false;
		}

		/**
		 * Show player after scroll and start playing
		 */
		function playerToggle() {
			var clip = params.clips[currentClipViewedIndex];

			playerContainer.player.restart(extend(extend({
				id: clip.id,
				context: 'pwdgt'
			}, params.playerParams), {
				autoplay: true,
				getNext: clip.getNext,
				mute: playerContainer.player.options.mute,
				hovertounmute: playerContainer.player.options.hovertounmute
			}));

			// Adjust player location and make it visible
			setStyles(playerContainer, {
				left: params.clips[currentClipViewedIndex].clipContainer.offsetLeft + 'px',
				visibility: 'visible'
			});
		}

		/**
		 * Determine if touch indicates a scroll action is needed
		 *
		 * @param 	event 	touch event
		 */
		function handleTouchMove(event) {
			// Number of pixels between start to end of touch to trigger the scroll
			var touchDifference = 100;

			// Set touch location on update
			xUp = event.touches[0].clientX;

			var xDiff = xDown - xUp;

			if (!preventClick && !isFullscreen && Math.abs(xDiff) > touchDifference) {
				// Reset number of clips count on user action
				numClipsPlayed = 0;

				if (xDiff > 0) { // Scroll right
					if (currentClipViewedIndex !== params.clips.length - 1) {
						// Hide player before scrolling
						setStyle(playerContainer, 'visibility', 'hidden');

						// Pause current player
						if (playerContainer.player && playerContainer.player.controls) playerContainer.player.pause();

						scrollHorizontally(-scrollSpeed, params.clips[++currentClipViewedIndex].clipContainer);
						preventClick = true;

						playerToggle();
					}
				} else { // Scroll left
					if (currentClipViewedIndex !== 0) {
						// Hide player before scrolling
						setStyle(playerContainer, 'visibility', 'hidden');

						// Pause current player
						if (playerContainer.player && playerContainer.player.controls) playerContainer.player.pause();

						scrollHorizontally(scrollSpeed, params.clips[--currentClipViewedIndex].clipContainer);
						preventClick = true;

						playerToggle();
					}
				}
			}
		}

		/**
		 * Reset x,y points of touch event
		 *
		 * @param 	event 	touch event
		 */
		function handleTouchEnd(event) {
			if (preventClick) {
				event.preventDefault();
				event.stopPropagation();
			}

			// Reset Values
			xDown = undefined;
			yDown = undefined;
		}

		function onResize() {
			// Update size parameters
			width = params.container.offsetWidth;
			height = width / ratio;
			clipWidth = singleClip ? width : (width / 1.25);
			clipHeight = params.format === 'square' ? clipWidth : clipWidth / ratio;
			gutterWidth = Math.floor((width - clipWidth) / 2);

			// Update containers with current width
			setStyles(widgetClipsContainer, {
				width: width + 'px'
			});

			// Update clip overlays width and height
			params.clips.forEach(function(clip) {
				setStyles(clip.clipOverlay, {
					width: clipWidth + 'px',
					height:	clipHeight + 'px'
				});
			});

			// Set player width, height and scroll to it
			setStyles(playerContainer, {
				width: clipWidth + 'px',
				height:	clipHeight + 'px',
				left: params.clips[currentClipViewedIndex].clipContainer.offsetLeft + 'px'
			});

			scrollHorizontally(scrollSpeed * 100, params.clips[currentClipViewedIndex].clipContainer);		
		}

		var singleClip = params.clips.length === 1;
		var ratio = 16/9;
		var width = params.container.offsetWidth;
		var height = width / ratio;
		var clipWidth = (singleClip || params.fullWidth) ? width : (width / 1.25);
		var clipHeight = params.format === 'square' ? clipWidth : clipWidth / ratio;
		var gutterWidth = Math.floor((width - clipWidth) / 2);
		var playerContainer;
		var currentClip;
		var currentClipViewedIndex = 0;
		var scrollSpeed = 35;
		var isFullscreen = false;
		var maxSequences = params.playerParams.maxSequences || 50;
		var numClipsPlayed = 0;
		var container = params.container;

		// Containers for the widget
		var embedContainer;
		var widgetClipsContainer;
		var widgetClipsTable;

		if (params.extraMargins) clipHeight += (clipHeight * params.extraMargins / 100);

		if (params.clips.length) {
			// Initialize a container
			embedContainer = makeElement('div', params.container, false, {}, 'embed-player-widget wbtz-widget-mobile-container');

			// Create a style tag for this widget
			html2element('<style type="text/css">.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container{overflow:hidden;position:relative}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-player-container{position:absolute;z-index:200;top:0}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table{display:table;border-collapse:separate}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip{display:table-cell;border-right:5px solid #fff;background-size:cover;background-repeat:no-repeat}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip:last-child{border-right:none}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-mobile-clip-overlay{cursor:pointer;position:relative;z-index:110}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-mobile-clip-overlay .wbtz-widget-mobile-clip-texts{font-family:Roboto,sans-serif;width:100%;height:100%;position:absolute;bottom:0}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-mobile-clip-overlay .wbtz-widget-mobile-clip-texts .wbtz-widget-mobile-clip-title{width:75%;height:34px;color:#fff;font-size:14px;position:absolute;bottom:10px;overflow:hidden;line-height:17px;margin-left:35px}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-mobile-clip-overlay .wbtz-widget-mobile-clip-texts .wbtz-widget-mobile-clip-duration{width:75%;height:17px;color:#fff;font-size:14px;position:absolute;top:10px;overflow:hidden;line-height:17px;margin-left:10px}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-mobile-clip-overlay .wbtz-widget-mobile-clip-texts .wbtz-widget-mobile-play-icon{background:url(//cdn4.wibbitz.com/images/play-rounded.svg) no-repeat;margin:.28em .28em .28em .4em;width:25px;height:25px;display:inline-block;position:absolute;bottom:12px}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-now-playing-overlay{font-family:Roboto,sans-serif;background:rgba(0,185,255,.7);cursor:pointer;position:absolute;z-index:102;top:3px}.wbtz-widget-mobile-container .wbtz-widget-mobile-clips-container .wbtz-widget-mobile-clips-container-table .wbtz-widget-mobile-clip .wbtz-widget-now-playing-overlay .wbtz-widget-now-playing-title{color:#fff;font-size:14px;position:absolute;font-weight:700;top:10px;width:77%;margin-left:10px}</style>', embedContainer, false);

			widgetClipsContainer = makeElement('div', embedContainer, false, {
				width: width + 'px'
			}, 'wbtz-widget-mobile-clips-container');

			// Set clips table
			widgetClipsTable = makeElement('div', widgetClipsContainer, false, {}, 'wbtz-widget-mobile-clips-container-table');

			playerContainer = makeElement('div', widgetClipsContainer, false, {
				width: clipWidth + 'px',
				height:	clipHeight + 'px'
			}, 'wbtz-widget-mobile-player-container');

			params.clips.forEach(function(clip, index, clips) {
				// Set clip index
				clip.index = index;

				// Set clip container
				clip.clipContainer = makeElement('div', widgetClipsTable, false, {
					backgroundImage: 'url(' + clip.posterurl + ')'
				}, 'wbtz-widget-mobile-clip');

				clip.clipOverlay = makeElement('div', clip.clipContainer, true, {
					width: clipWidth + 'px',
					height:	clipHeight + 'px'
				}, 'wbtz-widget-mobile-clip-overlay');

				// Show clip title, duration and play button
				var clipTexts = makeElement('div', clip.clipOverlay, false, {}, 'wbtz-widget-mobile-clip-texts');
				html2element('<div>' + clip.title + '</div>', clipTexts, false, {}, 'wbtz-widget-mobile-clip-title');
				html2element('<div>' + timeFormat(clip.duration) + '</div>', clipTexts, false, {}, 'wbtz-widget-mobile-clip-duration');
				makeElement('span', clipTexts, true, {}, 'wbtz-widget-mobile-play-icon');

				if (!singleClip) {
					clip.getNext = function() {
						numClipsPlayed++;
						if (numClipsPlayed === maxSequences) return;

						var isLastClip = currentClipViewedIndex === clips.length - 1;

						// Set clip to be the next clip or first clip
						currentClip = isLastClip ? clips[0] : clips[++currentClipViewedIndex];
						currentClipViewedIndex = currentClip.index;

						// Extend next clip's params with given params
						var playerParams = extend({
							id: currentClip.id,
							context: 'pwdgt'
						}, params.playerParams, {
							autoplay: true,
							// Add the onComplete callback
							onComplete: currentClip.getNext
						});

						// Hide player before scrolling
						setStyle(playerContainer, 'visibility', 'hidden');

						if (isLastClip) {
							scrollHorizontally(scrollSpeed, clips[0].clipContainer);
							currentClipViewedIndex = 0;
						} else {
							scrollHorizontally(-scrollSpeed, currentClip.clipContainer);
						}

						// Show player after scrolling
						playerToggle();
					};
				}

				// Autoplay first clip
				if (clip.index === 0) {
					var playerParams = extend({
						id: clip.id,
						context: 'pwdgt'
					}, params.playerParams);

					if (!singleClip) playerParams.onComplete = clip.getNext;

					playerContainer = embedPlayer({
						clip: clip,
						playerParams: extend(playerParams, {
							onReady: function() {
								// Bind fullscreen event
								playerContainer.player.on('fullscreen', function(fullscreenStatus) {
									isFullscreen = fullscreenStatus;
									isFullscreen ? setStyle(playerContainer, 'left', '0') : setStyle(playerContainer, 'left', params.clips[currentClipViewedIndex].clipContainer.offsetLeft + 'px');
								});

								// Log video.impression
								sendEvent('video.impression', 'video', {
									dimension1: params.clips[0].id,
									dimension3: params.clips[0].publisherName !== 'wibbitz' ? params.clips[0].publisherName : undefined,
									dimension6: getVideoType(params.clips[0].cliptype),
									dimension7: 'Player Widget',
									dimension9: String(params.clips.length > 1),
									dimension11: getPlayMode(params.playerParams.autoplay),
									dimension16: String(isInViewPort(params.container)),
									dimension67: params.playerParams['vdz-campaign'],
									API_Latest_Request_Time: latestRequestTime,
									CDN_Load_Time: cdnRequestTime,
									Type: 'widget',
									Static: params.isStatic,
									Instance_ID: playerContainer.player.randomInstanceId
								}, {
									metric2: 1,
									metric144: new Date() - EMBEDDED_TIME
								});
							}
						}),
						container: playerContainer,
						dontLog: true,
						width: clipWidth,
						height: clipHeight
					});
				}
			});
		}

		// Handle swipe events
		if (!singleClip) {
			addEvent(widgetClipsContainer, 'touchstart', handleTouchStart);
			addEvent(widgetClipsContainer, 'touchmove', handleTouchMove);
			addEvent(widgetClipsContainer, 'touchend', handleTouchEnd);
		}

		// Handle window resizing
		addEvent(window, 'resize', onResize);

		if (!params.hidePoweredBy) embedPoweredBy(params.container);

		container.destroy = function() {
			playerContainer.destroy();
			removeEventListeners(window, 'resize', onResize);
			removeElement(this);
		};

		return container;
	}

	/**
	 * Emebd widget for mobile devices
	 *
	 * @param	params 		the embed parameters. Available options:
	 *
	 * 			clips			list of recommended clips
	 * 			playerParams	additional parameters to add to the player's query [optional]
	 * 			container		container for widget
	 * 			elementId		element id for the embed [optional]
	 * 			side			set the side of the widget [optional, default is right]
	 * @return					the container element of this widget
	 */
	function embedFloatingWidget(params, mainEmbed) {
		// Don't embed if sticky exists, floating was closed or floating already exists
		if ((!isMobile && mainEmbed && mainEmbed.clip && !mainEmbed.disableSticky) || getCookie('wbtzFloatingWidgetClosed') || !!document.querySelector('[wibbitz=embed-floating-widget]')) return;

		// Set container
		params.container = html2element('<div wibbitz="embed-floating-widget" embedded="true"></div>', document.body);

		// Create a style tag for this widget
		html2element('<style type="text/css">.wbtz-floating-widget-container{position:fixed;bottom:30px;z-index:999999999999999999999999;margin:0;font-size:12px;-webkit-box-shadow:0 0 18px 0 rgba(0,0,0,.2);-moz-box-shadow:0 0 18px 0 rgba(0,0,0,.2);box-shadow:0 0 18px 0 rgba(0,0,0,.2);-webkit-transition:all .5s 0s ease-in-out;-moz-transition:all .5s 0s ease-in-out;-o-transition:all .5s 0s ease-in-out;-ms-transition:all .5s 0s ease-in-out;transition:all .5s 0s ease-in-out;font-family:Roboto,sans-serif;line-height:1}.wbtz-floating-widget-container .wbtz-floating-widget-player-container{-webkit-mask-image:-webkit-radial-gradient(circle,#fff 100%,#000 100%);-webkit-transform:rotate(.000001deg);overflow:hidden}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar{position:absolute;bottom:30px;z-index:20;visibility:hidden;opacity:0;-webkit-transition:opacity .5s 0s ease-in-out,visibility .5s 0s ease-in-out;-moz-transition:opacity .5s 0s ease-in-out,visibility .5s 0s ease-in-out;-o-transition:opacity .5s 0s ease-in-out,visibility .5s 0s ease-in-out;-ms-transition:opacity .5s 0s ease-in-out,visibility .5s 0s ease-in-out;transition:opacity .5s 0s ease-in-out,visibility .5s 0s ease-in-out}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar.show-recommend-bar{visibility:visible;opacity:1}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container{overflow:hidden}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table{display:table}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip{display:table-cell;position:relative;border:.2px solid rgba(255,255,255,.3)}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip:hover{border:.2px solid #fff}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-poster{background-size:cover}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay{background:linear-gradient(to bottom,rgba(255,255,255,.08) 0,rgba(122,122,122,.08) 25%,rgba(0,0,0,.3) 100%);cursor:pointer;position:absolute;z-index:110}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts{width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%);position:absolute;top:calc(100% - 20px);text-align:left;color:#fff;-webkit-transition:top .3s 0s cubic-bezier(0,.3,.9,1);-moz-transition:top .3s 0s cubic-bezier(0,.3,.9,1);-o-transition:top .3s 0s cubic-bezier(0,.3,.9,1);-ms-transition:top .3s 0s cubic-bezier(0,.3,.9,1);transition:top .3s 0s cubic-bezier(0,.3,.9,1)}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts .wbtz-floating-widget-clip-title{position:absolute;font-size:11px;padding:5px 5px 0;overflow:hidden;-webkit-line-clamp:3;display:-webkit-box;-webkit-box-orient:vertical;top:20px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts .wbtz-floating-widget-clip-duration{position:relative;font-weight:lighter;display:inline-block;left:8px;top:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts .wbtz-floating-widget-play-icon{width:15px;height:15px;position:relative;background:url(//cdn4.wibbitz.com/images/play-rounded.svg) no-repeat;display:inline-block;left:5px;top:3px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts .wbtz-floating-widget-clip-now-playing{display:none}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay:hover{background:rgba(0,0,0,.4)}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-now-playing-overlay{background:rgba(0,185,255,.7);z-index:102;position:absolute;top:0;cursor:pointer}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip .wbtz-floating-widget-clip-overlay:hover .wbtz-floating-widget-clip-texts{top:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-now-playing{display:block;position:absolute;left:5px;bottom:5px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-duration,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-title,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-play-icon{display:none}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-clip.wbtz-floating-now-playing .wbtz-floating-widget-clip-overlay .wbtz-floating-widget-clip-texts{top:0;transition:none}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-floating-widget-now-playing-overlay .wbtz-floating-widget-now-playing-title{color:#fff;position:absolute;bottom:7px;left:7px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad{display:table-cell;position:relative;padding:3px 3px 0 0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-poster{background-size:cover}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay{background:linear-gradient(to bottom,rgba(255,255,255,.08) 0,rgba(122,122,122,.08) 25%,rgba(0,0,0,.3) 100%);cursor:pointer;position:absolute;z-index:110}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts{font-family:Roboto,sans-serif;line-height:1;width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%);position:absolute;bottom:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-source{width:75%;height:17px;color:#f0f0f0;font-size:12px;position:absolute;bottom:43px;overflow:hidden;line-height:17px;margin-left:35px;font-style:italic}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-title{width:75%;height:34px;color:#fff;font-size:14px;position:absolute;bottom:10px;overflow:hidden;line-height:17px;margin-left:35px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-clips-container .wbtz-floating-widget-clips-container-table .wbtz-widget-ad .wbtz-widget-ad-overlay .wbtz-widget-ad-texts .wbtz-widget-ad-promoted{color:#fff;font-size:12px;position:absolute;top:0;left:0;padding:2px 3px;background:rgba(0,0,0,.4);overflow:hidden;line-height:17px}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-left-arrow,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-right-arrow{background:rgba(0,0,0,.5);position:absolute;z-index:150;height:100%;top:0;opacity:0;pointer-events:none;-webkit-transition:all 250ms 0s ease-in-out;-moz-transition:all 250ms 0s ease-in-out;-o-transition:all 250ms 0s ease-in-out;-ms-transition:all 250ms 0s ease-in-out;transition:all 250ms 0s ease-in-out}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-left-arrow .wbtz-floating-widget-left-arrow-icon,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-left-arrow .wbtz-floating-widget-right-arrow-icon,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-right-arrow .wbtz-floating-widget-left-arrow-icon,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-right-arrow .wbtz-floating-widget-right-arrow-icon{background:url(//cdn4.wibbitz.com/images/arrow-big.svg) center no-repeat;background-size:65%;position:absolute;z-index:151;height:100%;cursor:pointer}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-left-arrow{transform:scaleX(-1);left:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-left-arrow .wbtz-floating-widget-left-arrow-icon{left:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-right-arrow,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar .wbtz-floating-widget-right-arrow .wbtz-floating-widget-right-arrow-icon{right:0}.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar:hover .wbtz-floating-widget-left-arrow,.wbtz-floating-widget-container .wbtz-floating-widget-recommend-bar:hover .wbtz-floating-widget-right-arrow{opacity:1;pointer-events:all}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar{background-color:#fff;height:35px;border-radius:4px 4px 0 0;display:flex;align-items:center}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar img{margin:0!important;height:100%!important}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar .wbtz-floating-widget-top-bar-logo{padding:3px 6px;filter:invert(100%);height:100%;width:100%;width:initial;min-width:auto!important;box-sizing:border-box;display:inline-block;float:left}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar .wbtz-floating-widget-top-bar-title{float:left;text-transform:uppercase;font-weight:600;font-size:14px;white-space:nowrap}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar .wbtz-floating-widget-top-bar-clip-title{float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:5px;padding-right:32px;font-size:11px;font-weight:600;border-left:1px solid #000;margin-left:5px;height:15px;line-height:15px}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar .wbtz-floating-widget-top-bar-clip-title.wbtz-no-widget-title{border-left:none;padding-left:0}.wbtz-floating-widget-container .wbtz-floating-widget-top-bar .wbtz-floating-widget-close{position:absolute;right:12px;top:13px;opacity:0;display:flex;align-items:center;background-image:url(//cdn4.wibbitz.com/images/close.svg);background-size:contain;background-repeat:no-repeat;width:8px;height:8px;cursor:pointer;-webkit-transition:opacity 250ms 0s ease-in-out;-moz-transition:opacity 250ms 0s ease-in-out;-o-transition:opacity 250ms 0s ease-in-out;-ms-transition:opacity 250ms 0s ease-in-out;transition:opacity 250ms 0s ease-in-out}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar{position:relative;background-color:rgba(0,0,0,.8);padding:7px;height:30px;box-sizing:border-box;border-radius:0 0 4px 4px}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-created-by-container{margin-left:5px}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-created-by-container .wbtz-created-by-text{font-size:8px!important;line-height:1;display:flex;align-items:center}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-created-by-container .wbtz-created-by-text:hover{color:#fff}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-created-by-container .wbtz-created-by-text .wbtz-created-by-image{background-size:75%;height:14px;position:relative;bottom:2px}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-floating-widget-playlist{display:flex;cursor:pointer;align-items:center;float:right;max-width:35%;height:20px;color:#999;flex-direction:row;justify-content:flex-end;font-size:11px;margin-right:15px;-webkit-transition:all 250ms 0s ease-in-out;-moz-transition:all 250ms 0s ease-in-out;-o-transition:all 250ms 0s ease-in-out;-ms-transition:all 250ms 0s ease-in-out;transition:all 250ms 0s ease-in-out}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-floating-widget-playlist .wbtz-floating-widget-playlist-next{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:8px;margin-bottom:4px}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-floating-widget-playlist:hover{max-width:65%;color:#fff;text-overflow:ellipsis}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-floating-widget-playlist-icon{width:25px;height:20px;cursor:pointer;background:url(//cdn4.wibbitz.com/images/playlist-sprite.png) 2px 7px no-repeat;position:absolute;right:4px;top:2px}.wbtz-floating-widget-container .wbtz-floating-widget-bottom-bar .wbtz-floating-widget-playlist-icon:hover{top:8px;background-position:2px -12px}.wbtz-floating-widget-container:hover .wbtz-floating-widget-close{opacity:1}</style>', params.container, false);

		// Definitions for floating size/speed
		var ratio = 16/9;
		var container = params.container;
		var width = params.width || 400;
		var clips = params.clips;
		var height = params.height || (width / ratio);
		var smallClipWidth = width / (width > 305 ? 3.5 : 2.5);
		var maxSequences = params.playerParams.maxSequences || 50;
		var numClipsPlayed = 0;
		var smallClipHeight = smallClipWidth / ratio;
		var side = params.side || 'right';
		var publisherName = clips[0].publisherName;
		var currentClip = clips[0];
		var currentScrolledElement
		var nextClip;
		var previousClip;
		var clipsContainer;
		var elementContainers = [];
		var scrollTimer;
		var playerDivider;
		var playerContainer;
		var bottomSpacing = 3;
		var sideSpacing = 1.75;

		if (typeof params.bottomSpacing !== 'undefined') bottomSpacing = calculateBottomSpacing(params.bottomSpacing, height + 65); // 65 is bottom and top bar of the floating widget.
		if (typeof params.sideSpacing !== 'undefined') sideSpacing = calculateSideSpacing(params.sideSpacing, width);

		/**
		 * Horizontal reccomend bar scroll
		 *
		 * @param	speed			number of pixels to scroll by
		 * @param	scrollToObj		object to scroll to
		 * @param	lastPosition	scrolling position after last scroll
		 * @param	scrollDirection	scroll right / left
		 * @param	callback		callback function after completing scroll
		 */
		function scrollHorizontally (speed, scrollToObj, lastPosition, scrollDirection, callback) {
			// Prevent collision between multiple scrolls
			clearTimeout(scrollTimer);

			// Check if there is room left to scroll (visible content position vs scroll position)
			if (clipsContainer.scrollLeft <= (clipsContainer.scrollWidth - clipsContainer.offsetWidth)) {
				// Scroll by speed or scroll to object
				if (scrollToObj) {
					// Margin to perfect the scroll position
					var offsetFix = clipsContainer.scrollLeft - scrollToObj.offsetLeft;

					if (!scrollDirection) {
						// Object requires left or right scrolling
						if (clipsContainer.scrollLeft > scrollToObj.offsetLeft) scrollHorizontally(-speed, scrollToObj, clipsContainer.scrollLeft, 'left', callback);
						else scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'right', callback);
					} else {
						if (scrollDirection === 'left') {
							// Check if next scroll will cause overscroll and scroll by offset
							if ((clipsContainer.scrollLeft - speed) < scrollToObj.offsetLeft) {
								clipsContainer.scrollLeft -= offsetFix;
								clearTimeout(scrollTimer);
								if (callback) callback();
							} else {
								clipsContainer.scrollLeft -= speed;

								if (clipsContainer.scrollLeft > scrollToObj.offsetLeft && lastPosition !== clipsContainer.scrollLeft) {
									scrollTimer = setTimeout(function() {
										scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'left', callback);
									}, 30);
								} else {
									clearTimeout(scrollTimer);
									if (callback) callback();
								}
							}
						} else {
							// Check if next scroll will cause overscroll and scroll by offset
							if ((clipsContainer.scrollLeft - speed) > scrollToObj.offsetLeft) {
								clipsContainer.scrollLeft -= offsetFix;
								clearTimeout(scrollTimer);
								if (callback) callback();
							} else {
								clipsContainer.scrollLeft -= speed;

								if (clipsContainer.scrollLeft < scrollToObj.offsetLeft && lastPosition !== clipsContainer.scrollLeft) {
									scrollTimer = setTimeout(function() {
										scrollHorizontally(speed, scrollToObj, clipsContainer.scrollLeft, 'right', callback);
									}, 30);
								} else {
									clearTimeout(scrollTimer);
									if (callback) callback();
								}
							}
						}
					}
				} else {
					clipsContainer.scrollLeft -= speed;

					// Handle infinite scrolling
					if (lastPosition !== clipsContainer.scrollLeft) {
						scrollTimer = setTimeout(function() {
							scrollHorizontally(speed, undefined, clipsContainer.scrollLeft);
						}, 30);
					} else {
						clearTimeout(scrollTimer);
					}
				}
			}
		}

		/**
		 * Create a hide button for the player
		 */
		function showHideButton() {
			// Create a hide button container
			var hideButton = makeElement('div', params.container.topBar, true, {}, 'wbtz-floating-widget-close');

			// Bind hide button to event
			addEvent(hideButton, 'click', function() {
				if (playerContainer.player && !playerContainer.player.paused) playerContainer.player.pause();

				// Animate the container out
				setStyle(params.container, side, '-' + (width * 2) + 'px');

				// Log floating widget close button clicked
				sendEvent('video.close.floating', 'video', {
					dimension7: params.analyticsCategory || 'Floating Widget',
					dimension9: String(false),
					dimension16: String(isInViewPort(params.container)),
					Instance_ID: playerContainer.player.randomInstanceId
				}, {
					metric153: 1
				});

				// Prevent floating widget from showing for the next 2 hours or expiration days
				setCookie('wbtzFloatingWidgetClosed', true, params.cookieDaysExpiration || 2/24);

				// Close widget after saving cookie, no need to destory the player
				if (params.onHide) return params.onHide();

				// Once the widget slides out, destroy the player and remove all elements
				['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'].forEach(function(eventName) {
					addEvent(params.container, eventName, function() {
						playerContainer.player.destroy();
						removeElement(params.container);
					});
				});
			});
		}

		/**
		 * Plays next clip
		 *
		 * @param 	clip 					clip to play, override next clip
		 * @parm 	collapseRecommendBar 	should collapse recommend bar after chaing clip
		 * @param 	disableCallback 		don't trigger onPlayNextClip callback
		 */
		function playNextClip(clip, collapseRecommendBar, disableCallback) {
			// If a video is selected from the recommend bar, reset numClipsPlayed
			numClipsPlayed = clip ? 0 : numClipsPlayed + 1;
			if (numClipsPlayed === maxSequences) return;

			// Select next clip
			currentClip = clip || clips[(currentClip.index + 1) % clips.length];

			// Update title of current clip
			params.container.topBar.clipTitle.textContent = currentClip.title;

			if (playerContainer.player) {
				// Restart the player with new options options
				playerContainer.player.restart({
					clipId: currentClip.id,
					autoplay: true,
					showOpeningScreen: false
				});
			}

			// Add now playing overlay
			createNowPlayingOverlay(currentClip);

			currentScrolledElement = elementContainers[currentClip.index + (params.ads ? params.ads.length : 0)];

			scrollHorizontally(-15, currentClip.container, undefined, undefined, function() {
				if (collapseRecommendBar) recommendBarContainer.classList.remove('show-recommend-bar');
			});

			// Set next clip title on playlist
			if (params.container.bottomBar.playlist) params.container.bottomBar.playlist.next.innerHTML = 'Next: ' + clips[(currentClip.index + 1) % clips.length].title;

			if (!disableCallback && params.onPlayNextClip) params.onPlayNextClip(currentClip);
		}

		/**
		 * Add now playing class only to current playig  clip
		 *
		 * @param 	clip 	clip to add overlay to
		 */
		function createNowPlayingOverlay(clip) {
			// Remove now playing from playing clip and add it to next clip
			if (document.querySelector('.wbtz-floating-now-playing') && params.themeColor) document.querySelector('.wbtz-now-playing .wbtz-floating-widget-clip-overlay').style.background = '';
			if (document.querySelector('.wbtz-floating-now-playing')) document.querySelector('.wbtz-floating-now-playing').classList.remove('wbtz-floating-now-playing');
			if (params.themeColor) setStyle(clip.container.overlay, 'background', hexToRgba(params.themeColor, 0.7));
			clip.container.classList.add('wbtz-floating-now-playing');
		}

		function updateNextPreviouesClips(scrollDirection) {
			if (scrollDirection === 'right') {
				currentScrolledElement = elementContainers[(currentScrolledElement.index + 1) % elementContainers.length];
				return currentScrolledElement;
			} else {
				// Do nothing if trying to scroll back from first clip
				if (currentScrolledElement.index === 0) {
					return currentScrolledElement;
				} else {
					currentScrolledElement = elementContainers[(currentScrolledElement.index - 1) % elementContainers.length];
					return currentScrolledElement;
				}
			}
		}

		// Give the player 'floating' CSS
		params.container.classList.add('wbtz-floating-widget-container');

		// Create top bar
		params.container.topBar = makeElement('div', params.container, false, {
			width: width + 'px'
		}, 'wbtz-floating-widget-top-bar');

		params.container.topBar.logo = makeElement('img', params.container.topBar, false, {}, 'wbtz-floating-widget-top-bar-logo');
		params.container.topBar.logo.src = '//cdn9.wibbitz.com/content/images/publishers/smallLogos/' + publisherName + '.png';
		if (!params.disableWidgetTitle) params.container.topBar.title = html2element('<span>' + (params.widgetTitle || 'Top Videos') + '</span>', params.container.topBar, false, {}, 'wbtz-floating-widget-top-bar-title');
		params.container.topBar.clipTitle = html2element('<span>' + (currentClip.title) + '</span>', params.container.topBar, false, {}, 'wbtz-floating-widget-top-bar-clip-title');
		if (params.disableWidgetTitle) {
			params.container.topBar.clipTitle.classList.add('wbtz-no-widget-title');
		}

		// Create recommend bar
		var recommendBarContainer = makeElement('div', params.container, false, {
			width: width + 'px'
		}, 'wbtz-floating-widget-recommend-bar');

		// Container and gradient background for arrow
		var leftArrow = makeElement('div', recommendBarContainer, true, {
			width: width / 14 + 'px'
		}, 'wbtz-floating-widget-left-arrow');

		// Arrow icon
		makeElement('div', leftArrow, true, {
			width: width / 14 + 'px'
		}, 'wbtz-floating-widget-left-arrow-icon');

		// Container and gradient background for arrow
		var rightArrow = makeElement('div', recommendBarContainer, true, {
			width: width / 14 + 'px'
		}, 'wbtz-floating-widget-right-arrow');

		// Arrow icon
		makeElement('div', rightArrow, true, {
			width: width / 14 + 'px'
		}, 'wbtz-floating-widget-right-arrow-icon');

		// Handle scroll action for each arrow
		addEvent(leftArrow, 'click', function() {
			scrollHorizontally(15, updateNextPreviouesClips('left').container, undefined, 'left');
		});
		addEvent(rightArrow, 'click', function() {
			scrollHorizontally(-15, updateNextPreviouesClips('right').container);
		});

		clipsContainer = makeElement('div', recommendBarContainer, false, {
			width: width + 'px'
		}, 'wbtz-floating-widget-clips-container');
		var clipsTable = makeElement('div', clipsContainer, false, {}, 'wbtz-floating-widget-clips-container-table');

		// Define side of hiding
		setStyle(params.container, side, '-' + (width * 2) + 'px');

		if (params.ads) {
			params.ads.forEach(function(ad, index, ads) {
				// Set clip index
				ad.index = index;

				// Set ad container
				ad.container = makeElement('div', clipsTable, false, {}, 'wbtz-widget-ad');

				// Add container to elementContainers array, used for scrolling
				elementContainers.push({
					container: ad.container,
					index: index
				});

				// Poster image
				ad.container.poster = makeElement('div', ad.container, false, {
					width: smallClipWidth + 'px',
					height: smallClipHeight + 'px',
					backgroundImage: 'url(' + ad.thumbnail.url + ')'
				}, 'wbtz-widget-ad-poster');

				ad.container.adOverlay = adInfoOverlay = makeElement('div', ad.container, true, {
					width: smallClipWidth + 'px',
					height:	smallClipHeight + 'px'
				}, 'wbtz-widget-ad-overlay');

				// Ad texts: source, content, play icon, promoted
				var adTexts = makeElement('div', adInfoOverlay, false, {}, 'wbtz-widget-ad-texts');

				html2element('<div>' + ad.source_display_name + '</div>', adTexts, false, {}, 'wbtz-widget-ad-source');

				html2element('<div>' + ad.content + '</div>', adTexts, false, {}, 'wbtz-widget-ad-title');

				makeElement('span', adTexts, true, {}, 'wbtz-widget-play-icon');

				html2element('<div>Promoted</div>', adTexts, false, {}, 'wbtz-widget-ad-promoted');

				addEvent(ad.container, 'click', function() {
					window.open(ad.url,'_blank');
				});

				if (ad.index === 0) currentScrolledElement = ad;
			});
		}

		// Embed recomended bar
		clips.forEach(function(clip, index, clips) {
			clip.index = index;

			// Add clips to recommend bar
			clip.container = makeElement('div', clipsTable, false, {}, 'wbtz-floating-widget-clip');

			elementContainers.push({
				container: clip.container,
				index: index + (params.ads ? params.ads.length : 0)
			});

			makeElement('div', clip.container, false, {
				width: smallClipWidth + 'px',
				height: smallClipHeight + 'px',
				backgroundImage: 'url(' + removeHttpPrefix(clip.posterurl) + ')'
			}, 'wbtz-floating-widget-clip-poster');

			clip.container.overlay = makeElement('div', clip.container, true, {
				width: smallClipWidth + 'px',
				height:	smallClipHeight + 'px'
			}, 'wbtz-floating-widget-clip-overlay');

			// Clip texts: title, duration, play icon, now playing
			var clipTexts = makeElement('div', clip.container.overlay, false, {}, 'wbtz-floating-widget-clip-texts');

			makeElement('span', clipTexts, true, {}, 'wbtz-floating-widget-play-icon');

			clip.durationContainer = html2element('<div>' + timeFormat(clip.duration) + '</div>', clipTexts, false, {}, 'wbtz-floating-widget-clip-duration');

			html2element('<div>' + clip.title + '</div>', clipTexts, false, {}, 'wbtz-floating-widget-clip-title');

			html2element('<div>' + getLocalizedString('nowPlaying') + '</div>', clipTexts, false, {}, 'wbtz-floating-widget-clip-now-playing');

			// Set now playing overlay for first clip
			if (clip.index === 0) {
				createNowPlayingOverlay(clip);
				currentPlayingClip = clip;
				if (!currentScrolledElement) currentScrolledElement = currentPlayingClip;
			}
			
			// Handle click event
			addEvent(clip.container, 'click', function() {
				playNextClip(clip, true);
			});
		});

		playerDivider = makeElement('div', params.container, false, {
			width: width + 'px',
			height: height + 'px'
		}, 'wbtz-widget-divider');

		// Embed player
		playerContainer = embedPlayer({
			playerParams: extend(params.playerParams, {
				clipId: clips[0].id,
				onReady: onFloatingWidgetReady,
				onComplete: playNextClip,
				context: params.analyticsContext || 'fwdgt'
			}),
			container: makeElement('div', playerDivider, false, {}, 'wbtz-floating-widget-player-container'),
			placeholder: params.placeholder,
			isFloating: true,
			width: width,
			height: height,
			dontLog: true
		});

		function onFloatingWidgetReady() {
			if (!params.initHidden) params.container.show();
			if (!params.hideX) showHideButton();
			if (params.onReady) params.onReady(playerContainer);

			sendEvent('video.impression', 'video', {
				dimension1: clips[0].id,
				dimension3: clips[0].publisherName !== 'wibbitz' ? clips[0].publisherName : undefined,
				dimension6: getVideoType(clips[0].cliptype),
				dimension7: 'Floating Widget',
				dimension9: String(false),
				dimension11: getPlayMode(params.playerParams.autoplay),
				dimension16: String(isInViewPort(params.container)),
				dimension67: params.playerParams['vdz-campaign'],
				API_Latest_Request_Time: latestRequestTime,
				CDN_Load_Time: cdnRequestTime,
				Type: 'widget',
				Static: params.isStatic,
				Floating: true,
				Instance_ID: playerContainer.player.randomInstanceId
			}, {
				metric2: 1,
				metric144: new Date() - EMBEDDED_TIME
			});
		}

		if (params.placeholder) onFloatingWidgetReady();

		// Create bottom bar
		params.container.bottomBar = makeElement('div', params.container, false, {
			width: width + 'px'
		}, 'wbtz-floating-widget-bottom-bar');

		if (clips.length > 3) {
			params.container.bottomBar.playlistIcon = makeElement('div', params.container.bottomBar, false, {}, 'wbtz-floating-widget-playlist-icon');
			params.container.bottomBar.playlist = makeElement('div', params.container.bottomBar, false, {}, 'wbtz-floating-widget-playlist');
			params.container.bottomBar.playlist.next = html2element('<div>Next: ' + clips[1].title + '</div>', params.container.bottomBar.playlist, false, {}, 'wbtz-floating-widget-playlist-next');

			addEvent(params.container.bottomBar.playlist, 'click', function() {
				playNextClip(undefined, true);
			});

			// Toggle recommend bar
			addEvent(params.container.bottomBar.playlistIcon, 'click', function() {
				if (recommendBarContainer.classList.contains('show-recommend-bar')) {
					recommendBarContainer.classList.remove('show-recommend-bar');
				} else {
					recommendBarContainer.classList.add('show-recommend-bar');
				}
			});
		}
		
		if (!params.hidePoweredBy) embedPoweredBy(params.container.bottomBar);

		// External functions
		container.show = function() {
			setStyle(params.container, 'bottom', bottomSpacing + '%');
			setStyle(params.container, side, sideSpacing + '%');
		};

		container.hide = function() {
			setStyle(params.container, side, '-' + (width * 2) + 'px');
		};

		container.nextClip = function(clipId) {
			var selectedClip;

			clips.forEach(function(clip) {
				if (clip.id === clipId) selectedClip = clip;
			});

			if (selectedClip) playNextClip(selectedClip, true, true, true);
		};

		container.destroy = function() {
			playerContainer.destroy();
			removeElement(this);
		};

		return container;
	}

	function embedHybridWidget(params, mainEmbed) {
		if ((!isMobile && mainEmbed && mainEmbed.clip && !mainEmbed.disableSticky) || (isMobile && mainEmbed && mainEmbed.clip && !mainEmbed.disableStickyMobile) || getCookie('wbtzFloatingWidgetClosed')) return embedRecommendPlayerWidget(params);

		var recommendWidgetContainer;
		var floatingWidgetContainer;
		var playerContainer;
		var widgetInView;
		var floatingWidgetPlayerParent;
		var recommendWidgetPlayerParent;
		var isFloatingWidgetClosed = false;
		var fullscreen = false;
		params.recommendParams = params.recommendParams || {};
		params.floatingParams = params.floatingParams || {};

		function showPlayer() {
			setStyle(playerContainer, 'visibility', 'visible');
		}

		function showFloatingWidget() {
			emptyElements([recommendWidgetPlayerParent, floatingWidgetPlayerParent]);
			playerContainer = appendElement(playerContainer, floatingWidgetPlayerParent);
			recommendWidgetContainer.setWidth(floatingWidgetPlayerParent.style.width);

			setStyles(playerContainer, {
				width: floatingWidgetPlayerParent.style.width,
				height: floatingWidgetPlayerParent.style.height,
				visibility: 'hidden'
			});

			playerContainer.player.off('resize', showPlayer).on('resize', showPlayer);
			playerContainer.player.resize();
			floatingWidgetContainer.show();

			if (!playerContainer.player.paused) playerContainer.player.play();
		}

		function hideFloatingWidget() {
			floatingWidgetContainer.hide();
			emptyElements([recommendWidgetPlayerParent, floatingWidgetPlayerParent]);
			playerContainer = appendElement(playerContainer, recommendWidgetPlayerParent);

			setStyles(playerContainer, {
				width: recommendWidgetPlayerParent.style.width,
				height: recommendWidgetPlayerParent.style.height,
				visibility: 'hidden'
			});

			playerContainer.player.off('resize', showPlayer).on('resize', showPlayer);
			playerContainer.player.resize();
			recommendWidgetContainer.setWidth();

			if (!playerContainer.player.paused) playerContainer.player.play();
		}

		recommendWidgetContainer = embedRecommendPlayerWidget(extend({
			clips: JSON.parse(JSON.stringify(params.clips)),
			container: params.container,
			playerParams: params.playerParams,
			analyticsCategory: 'RecommendFloatingHybrid',
			analyticsContext: 'recflhyb',
			onPlayNextClip: function(clip) {
				if (!isFloatingWidgetClosed) floatingWidgetContainer.nextClip(clip.id);
			},
			onReady: function(container) {
				playerContainer = container;
				recommendWidgetPlayerParent = playerContainer.parentElement;
				if (!isInViewPort(recommendWidgetContainer)) showFloatingWidget();

				playerContainer.player.on('fullscreen', function(status) {
					fullscreen = status;
				});
			}
		}, params.recommendParams));

		floatingWidgetContainer = embedFloatingWidget(extend({
			clips: JSON.parse(JSON.stringify(params.clips)),
			playerParams: params.playerParams,
			analyticsCategory: 'RecommendFloatingHybrid',
			analyticsContext: 'recflhyb',
			initHidden: true,
			placeholder: true,
			onPlayNextClip: function(clip) {
				recommendWidgetContainer.nextClip(clip.id);
			},
			onHide: function() {
				hideFloatingWidget();
				playerContainer.player.mute();
				isFloatingWidgetClosed = true;
			},
			onReady: function(container) {
				floatingWidgetPlayerParent = container.parentElement;
			}
		}, params.floatingParams));

		widgetInView = isInViewPort(recommendWidgetContainer) ? 'recommend' : 'floating';

		addEvent(window, 'scroll', function() {
			if (!isFloatingWidgetClosed && !fullscreen) {
				if (widgetInView === 'recommend' && !isInViewPort(recommendWidgetContainer)) showFloatingWidget();
				if (widgetInView === 'floating' && isInViewPort(recommendWidgetContainer)) hideFloatingWidget();
				widgetInView = isInViewPort(recommendWidgetContainer) ? 'recommend' : 'floating';
			}
		});

		return playerContainer;
	}

	var metricDictionary = {
		metric1: 'embedded',
		metric2: 'impression',
		metric3: 'video_view',
		metric4: 'video_end',
		metric5: 'articlePage_publish',
		metric6: 'myVideoPage_publish',
		metric7: 'edit_publish',
		metric8: 'edit_publish',
		metric9: 'get_error',
		metric10: 'recbar_click',
		metric11: 'recbar_swipe',
		metric12: 'ad_request',
		metric13: 'ad_start',
		metric14: 'ad_end',
		metric16: 'video_stop',
		metric17: 'video_share',
		metric18: 'video_replay',
		metric19: 'video_report',
		metric20: 'video_mute',
		metric21: 'video_click',
		metric22: 'video_embedcode_click',
		metric23: 'twitter_click',
		metric24: 'video_download_click',
		metric25: 'voiceover_click',
		metric26: 'video_unpublish',
		metric27: 'story_edit',
		metric28: 'originalArticle_click',
		metric29: 'relatedVideo_click',
		metric30: 'article_click',
		metric31: 'create_text_failed',
		metric32: 'create_url_click',
		metric33: 'create_text_click',
		metric34: 'create_url_failed',
		metric35: 'create_url_exist',
		metric36: 'help_video_click',
		metric37: 'menu_toturial_click',
		metric38: 'menu_whatsNew_click',
		metric39: 'menu_insights_click',
		metric40: 'menu_insights_filtered',
		metric41: 'login',
		metric42: 'video_embedcode_click',
		metric43: 'twitter_click',
		metric44: 'video_download_click',
		metric45: 'voiceover_click',
		metric46: 'video_unpublish',
		metric47: 'story_edit',
		metric48: 'video_delete',
		metric49: 'video_click',
		metric50: 'article_search',
		metric51: 'menu_topstory_click',
		metric52: 'topStory_click',
		metric53: 'topStory_embed_click',
		metric54: 'topStory_download_click',
		metric55: 'gallery_click',
		metric56: 'gallery_search',
		metric57: 'search_filter',
		metric58: 'myMedia_click',
		metric59: 'myMedia_upload',
		metric60: 'selectedMedia_click',
		metric61: 'learnmore_click',
		metric62: 'mediaTab_click',
		metric63: 'split_click',
		metric64: 'soundbite_click',
		metric65: 'text_type_click',
		metric66: 'text_edit',
		metric67: 'edit_narration_click',
		metric68: 'scene_delete',
		metric69: 'media_delete',
		metric70: 'preview_click',
		metric71: 'publishTab_click',
		metric72: 'embedcode_click',
		metric73: 'theme_select',
		metric74: 'category_click',
		metric75: 'date_click',
		metric76: 'credits_click',
		metric77: 'cover_click',
		metric78: 'soundTab_click',
		metric79: 'voiceover_upload',
		metric80: 'voiceover_request',
		metric81: 'voiceover_record',
		metric82: 'voiceover_mute_click',
		metric83: 'sountrack_mute_click',
		metric84: 'voiceover_auto_click',
		metric85: 'soundtrack_upload',
		metric86: 'sountrack_track_click',
		metric87: 'storyTab_click',
		metric88: 'edit_text_click',
		metric89: 'video_type_click',
		metric90: 'save_done',
		metric91: 'save_failed',
		metric92: 'edit_exitNoSave',
		metric93: 'edit_count',
		metric94: 'video_generated',
		metric95: 'video_generated',
		metric96: 'topStory_brand',
		metric97: 'topStory_edit',
		metric98: 'Video_Published',
		metric99: 'Video_Created',
		metric100: 'Widget_View',
		metric101: 'Player_View',
		metric102: 'Edit_Count',
		metric103: 'menu_myVideos_click',
		metric104: 'video_publish',
		metric105: 'video_click',
		metric106: 'video_render_fail',
		metric107: 'num_of_items',
		metric108: 'edit_stop',
		metric109: 'edit_duration',
		metric110: 'text_align_vertical',
		metric111: 'media_delete_all',
		metric112: 'media_delete_batch',
		metric113: 'video_add_error',
		metric114: 'topStory_search',
		metric115: 'myVideos_search',
		metric116: 'gallery_filter_getty',
		metric117: 'bumper_click',
		metric118: 'color_click',
		metric119: 'soundtrack_select',
		metric120: 'soundtrack_play',
		metric121: 'topStory_brand_publish',
		metric122: 'media_add',
		metric123: 'text_highlightword',
		metric124: 'video_render_success',
		metric125: 'total_render_time',
		metric126: 'getty_videos',
		metric127: 'getty_images',
		metric128: 'reuters_videos',
		metric129: 'reuters_images',
		metric130: 'uploaded_videos',
		metric131: 'uploaded_images',
		metric132: 'wibbitz_videos',
		metric133: 'wibbitz_images',
		metric134: 'wenn_images',
		metric135: 'brightcove_videos',
		metric136: 'usatoday_images',
		metric137: 'ap_images',
		metric138: 'webpage_images',
		metric139: 'create_url_create',
		metric140: 'create_text_create',
		metric141: 'text_bg_click',
		metric142: 'video_experiment',
		metric143: 'experiment_time',
		metric144: 'load_time',
		metric145: 'edit_render',
		metric146: 'duration_scene_click',
		metric147: 'credits_media_enable',
		metric148: 'edit_textStyle_click',
		metric149: 'infoItem_click',
		metric150: 'media_crop_click',
		metric151: 'mymedia_delete',
		metric152: 'facebook_published',
		metric153: 'video_close_sticky',
		metric154: 'ad_video_load_time',
		metric155: 'Recbar_Items',
		metric156: 'video_preview_click',
		metric157: 'video_edit_click',
		metric158: 'edit_socialPost_create',
		metric159: 'preview_load_time'
	};

	var dimensionDictionary = {
		dimension1: 'Video_ID',
		dimension2: 'Publisher_ID',
		dimension3: 'Publisher_Name',
		dimension4: 'Page_URL',
		dimension5: 'User_ID',
		dimension6: 'Video_Type',
		dimension7: 'Embed_Type',
		dimension8: 'Embed_Implementation_Type',
		dimension9: 'RecBar_Mode',
		dimension10: 'Player_Height',
		dimension11: 'Play_Start_Mode',
		dimension12: 'Pause_Mode',
		dimension13: 'Player_Next_Mode',
		dimension14: 'Audio_Mode',
		dimension15: 'Player_Mode',
		dimension16: 'Viewable',
		dimension17: 'Player_Location',
		dimension18: 'Embed_Container',
		dimension19: 'Page_Type',
		dimension20: 'Feed',
		dimension21: 'Video_Category',
		dimension22: 'Player_Version',
		dimension23: 'Ad_Type',
		dimension24: 'Play_Sequence_Index',
		dimension25: 'Next_Mode',
		dimension26: 'Share_To',
		dimension27: 'Report_Reason',
		dimension28: 'User_Name',
		dimension29: 'CR_User_ID',
		dimension30: 'Video_Title',
		dimension31: 'Article_URL',
		dimension32: 'User_Role',
		dimension33: 'Related_Video',
		dimension34: 'Has_VO',
		dimension35: 'VO_Type',
		dimension36: 'Sort_Value',
		dimension37: 'Filter_Value',
		dimension38: 'Login_Status',
		dimension39: 'Creation_Method',
		dimension40: 'Search_Term',
		dimension41: 'Selecet_Theme',
		dimension42: 'Player_Width',
		dimension43: 'Autopublish_Mode',
		dimension44: 'Static',
		dimension45: 'Play_Context',
		dimension46: 'Fail_Type',
		dimension47: 'Experiment_ID',
		dimension48: 'Experiment_Variation',
		dimension49: 'Provider_Media_ID',
		dimension50: 'Provider_Name',
		dimension51: 'Accuracy_Value',
		dimension52: 'Source',
		dimension53: 'Publisher_Status',
		dimension54: 'Upload_Method',
		dimension55: 'Crop_Action',
		dimension56: 'HighPriority_Publish',
		dimension57: 'Son_Video_ID',
		dimension58: 'Crop_Start',
		dimension59: 'Image_Text_Style',
		dimension60: 'RenderTime_Type',
		dimension61: 'Preview_Load_Type',
		dimension62: 'Filtered_Category_Chosen' ,
		dimension63: 'Related_Video_Rebrand',
		dimension64: 'Viewable_Seconds',
		dimension65: 'Total_Video_Seconds',
		dimension66: 'Render_Cancelled',
		dimension67: 'Vidazoo_Campaign',
		dimension68: 'Player_Location',
		dimension69: 'User_Location',
		dimension70: 'Page_Size'
	};
	/******************************************************************/

	init({"elements":[{"type":"widget","playerParams":{"autoplay":true,"mute":true,"vdz-campaign":"tmz_widget","next":"auto","ads":"pre"},"hideRecommendBar":true}]});
})(wibbitz)