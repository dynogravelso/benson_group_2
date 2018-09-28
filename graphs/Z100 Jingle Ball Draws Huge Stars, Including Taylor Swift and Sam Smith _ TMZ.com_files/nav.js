define('nav/1.1.2/nav', ['jquery', 'underscore'], function ($, _) {

  /**
   * Is iPad?
   * @type {boolean}
   */
  var isIPad = navigator.userAgent.match(/iPad/i) != null;

  /**
   * Change this to true to output debug logs to console
   * @type {boolean}
   * @private
   */
  var _debug = false;

  /**
   * UI Elements
   * @type {{body: (*), masthead: (*), mastContainer: (*), mastheadAd: (*), mastheadPad: (*), mainNav: (*), navItem: (*), showtimes: (*), watchTmz: (*), arrowUp: (*), search: (*), searchInput: (*), searchSubmit: (*), signin: (*), userWrapper: (*), userBox: string, userThumb: string, registerWrap: string}}
   */
  var ui = {
    // global
    $body          : $('body'),
    $page          : $('#page'),

    // header
    $masthead      : $('#masthead-wrap'),
    $mastContainer : $('#masthead-container'),
    $mastheadAd    : $('.masthead-ad'),
    $mastheadPad   : $('.masthead-pad'),

    // nav
    $mainNav       : $('.main-nav'),
    $navItem       : $('.main-nav li a'),

    // showtimes
    $showtimes     : $('#showtimes-main'),
    $watchTmz      : $('a.link-watch-tmz'),
    $arrowUp       : $('.masthead .arrow-up'),

    // search / signin
    $search        : $('.search'),
    $searchInput   : $('.search-input'),
    $searchSubmit  : $('#masthead-wrap .submit-search'),
    $signin        : $('.user-nav'),
    $userWrapper   : $('.user-wrapper'),
    $searchForm    : $('#search'),

    // post render elements
    userBox       : '.my-tmz-box',
    userThumb     : '.userThumb',
    registerWrap  : '.register-wrap'
  };

  /**
   * Info
   * @type {{initialLoad: number, loggedIn: boolean, breakpoint: number, stickyNav: [*]}}
   */
  var info = {
    initialLoad : 0,
    loggedIn    : false,
    breakpoint  : 0,
    stickyNav   : [
      'body-one-column-min'
    ]
  };

  /**
   * Set this to true or false to know when the showtimes menu hiding animation is in process.
   *
   * @type {boolean}
   */
  var showtimesMenuHidingInProcess = false;

  /**
   * Debug message for console
   * @param msg
   */
  function debug(msg) {
    if (!_debug) {
      return;
    }
    console.log('TMZNAV: ' + msg);
  }

  /**
   * Set debug on or off
   * @param {Boolean} on
   */
  function setDebug(on) {
    _debug = on;
  }

  /**
   * Sets event listeners and stuff
   */
  function initialize() {
    eventListeners();
    checkLoggedInState();

    // check for default sticky nav
    checkDefaultSticky();
  }

  /**
   * Fires up event listeners for menu
   */
  function eventListeners() {
    var timer; // mouseover delay

    // Sticky header to follow you when scrolling
    $(window).on('scroll',  _.throttle(checkStickyHeader.bind(), 80, false));

    // Close user box when clicking outside
    $(document).on('click', function(e) {
      debug('Document click');
      if( !$(e.target).closest(ui.userThumb).length
        && !$(e.target).closest(ui.userBox).length ) {
        closeUserBox();
      }
    });

    // Mouse click search submit
    ui.$searchSubmit.on('click', function() {
      debug('Mouse click sub menu');
      ui.$searchForm.submit();
    });

    // Mouse enter nav item
    ui.$navItem.on('mouseenter', function(e) {
      debug('Mouse enter sub menu');
      timer = setTimeout(function() {
        e.currentTarget !== ui.$watchTmz[0] ? showtimesMenuHide() : showtimesMenuShow();
      }, 200);
    }).on('mouseleave', function(e) {
      clearTimeout(timer);
    });

    // Mouse leave show times
    ui.$showtimes.on('mouseleave', function() {
      debug('Mouse leave showtimes');
      if (isIPad) {
        debug('Mouse leave showtimes ending because of iPad');
        return;
      }
      clearTimeout(timer);
      showtimesMenuHide();
    });

    // Mouse leave man navigation
    ui.$mainNav.on('mouseleave', function(e) {
      debug('Mouse leave main nav');
      if (isIPad) {
        debug('Mouse leave main nav - Return always iPad');
        return;
      }
      if (e.relatedTarget === ui.$mastContainer[0]) {
        debug('Hiding because of mouse leave main nav');
        showtimesMenuHide();
      }
    });

    // iPad specific events
    if(isIPad) {
      ui.$watchTmz.on('click', function(e) {
        debug('Watch Tmz click');
        e.preventDefault();
        showtimesMenuToggle(true);
      });

      $(document).on('click', function(e) {
        debug('Document click iPad');
        // check if submenu open
        if(ui.$showtimes.is(':visible')) {

          // Return if clicking the zip code field
          var $target = $(e.target);
          if ($target.hasClass('zip-code-field') || $target.hasClass('zip-code-submit')) {
            return;
          }

          // Hide when clicking outside the showtimes and watch tmz area area
          if(!ui.$showtimes.is(e.target) && !ui.$watchTmz.is(e.target)) {
            showtimesMenuHide();
          }
        }
      });

      // Hide sub menu when clicking in page
      ui.$page.on('click', function(){
        if (ui.$showtimes.is(':visible')) {
          showtimesMenuHide();
        }
      })
    }
  }

  /**
   * Check Logged in State
   */
  function checkLoggedInState() {
    if (!ui.$signin.children(ui.registerWrap).length) {
      info.loggedIn = true;
    }
  }

  /**
   * Check Default Sticky
   */
  function checkDefaultSticky() {
    for (var i = 0; i < info.stickyNav.length; i++) {
      if (ui.$body.hasClass(info.stickyNav[i])) {
        ui.$masthead.addClass('sticky');
        suppressAdSkin();
      }
    }
  }

  /**
   * Check Sticky Header
   * @param pos
   */
  function checkStickyHeader(pos) {
    var pos = $(window).scrollTop();
    getBreakpoint();

    if (pos >= info.breakpoint) {
      pos += 5 // to compensate the breakpoint
      stickHeader();
      hideTermsBar(); // hide the legalbar
    } else {
      showTermsBar(); // show the legalbar
      unstickHeader();
    }
  }

  /**
   * Get Breakpoint
   */
  function getBreakpoint() {
    var current = getMastheadHeight();

    if(current > info.breakpoint) {
      info.breakpoint = current;
    }
  }

  /**
   * Get Masthead Height
   * @returns {number}
   */
  function getMastheadHeight() {
    var mastHeadAdHeight = ui.$mastheadAd[0].getBoundingClientRect().height;
    var mastHeadPadHeight = ui.$mastheadPad[0].getBoundingClientRect().height;
    var mainNavHeight = ui.$mainNav[0].getBoundingClientRect().height;
    var mastHeadHeight = (mastHeadAdHeight + mastHeadPadHeight) - mainNavHeight;
    return mastHeadHeight;
  }

  /**
   * Stick Header
   */
  function stickHeader() {
    var offset = 10;

    if(!ui.$masthead.hasClass('sticky')) {
      ui.$body.css('padding-top', (ui.$masthead.height() + offset));
      ui.$masthead.addClass('sticky');
      showtimesMenuHide();
      hideSigninMenu();
      hideUserWrapper();
    }
  }

  /**
   * Unstick Header
   */
  function unstickHeader() {
    if (ui.$masthead.hasClass('sticky')) {
      ui.$masthead.removeClass('sticky');
      ui.$body.css('padding-top', 0);
      showtimesMenuHide();
      hideSigninMenu();
      hideUserWrapper();
      ui.$signin.removeClass('move');
    }
  }

  /**
   * Showtimes Menu Show
   */
  function showtimesMenuShow() {
    debug('Showtimes Menu Show');

    if (isIPad && showtimesMenuHidingInProcess) {
      debug('Ending showtimesMenuShow early. Hide is in progress.');
      return;
    }

    ui.$showtimes.css('display', 'block').delay(100).queue(function() {
      ui.$showtimes.addClass('show').dequeue();
    });

    ui.$arrowUp.show(300);
    hideSigninMenu();
    hideUserWrapper();
  }

  /**
   * Showtimes Menu Hide
   *
   * @param {boolean} forceHide
   */
  function showtimesMenuHide(forceHide) {
    if (isIPad && forceHide !== true) {
      var $activeElement = $(document.activeElement);
      var isZipCodeFocused = $activeElement.hasClass('zip-code-field');

      // Do not hide the keyboard and menu if the zip code is focused while in the ipad.
      if (isZipCodeFocused) {
        debug('Showtimes menu hide because zip is focused');
        return;
      }

      debug('Hiding keyboard for iPad');
      document.activeElement.blur();
      $('input').blur();
    }

    showtimesMenuHidingInProcess = true;

    ui.$showtimes.removeClass('show').delay(100).queue(function() {
      showtimesMenuHidingInProcess = false;
      ui.$showtimes.css('display', 'none').dequeue();
      debug('Showtimes menu hidden');
    });

    ui.$arrowUp.hide();
    debug('Hiding watch tmz arrow');
  }

  /**
   * Showtimes Menu Toggle
   *
   * @param {boolean} forceToggle
   */
  function showtimesMenuToggle(forceToggle) {
    forceToggle  = (typeof forceToggle === 'undefined' || !forceToggle) ? false : true;
    ui.$showtimes.hasClass('show') ? showtimesMenuHide(forceToggle) : showtimesMenuShow();
  }

  /**
   * Hide Signin Menu
   */
  function hideSigninMenu() {
    if (ui.$signin.hasClass('active') && info.loggedIn ) {
      ui.$signin.removeClass('active');
    }
  }

  /**
   * Toggle User Box
   */
  function toggleUserBox() {
    $(ui.userBox).hasClass('active') ? closeUserBox() : openUserBox();
  }

  /**
   * Close User Box
   */
  function closeUserBox() {
    $(ui.userBox).removeClass('active');
  }

  /**
   * Open User Box
   */
  function openUserBox() {
    $(ui.userBox).addClass('active');
  }

  /**
   * Hide User Wrapper
   */
  function hideUserWrapper() {
    $(ui.userBox).removeClass('active');
  }

  /**
   * Suppress Ad Skin
   */
  function suppressAdSkin() {
    ui.$mastheadAd.html('');
  }

  /**
   * Publically exposed methods
   */
  return {
    init: initialize,
    setDebug: setDebug
  };


});

