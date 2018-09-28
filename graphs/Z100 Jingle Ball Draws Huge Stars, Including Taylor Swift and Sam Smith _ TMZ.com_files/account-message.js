define('widgets/account-message/1.0.0/account-message', ['jquery', 'templates/jst', 'jquery.cookie'], function ($, jst) {

  var config = {
    cookieName: 'account-message',
    disqusCookieName: 'show-account-message-modal'
  };

  var ui = {};

  /**
   * Initialize
   */
  function initialize() {
    // do not display if cookie exists
    if($.cookie(config.cookieName)) {
      return;
    }

    render();
    bindUiElements();
    eventListeners();
  }

  /**
   * Bind UI Elements
   */
  function bindUiElements() {
    ui = {
      container: $('.account-message-container'),
      modal: $('.account-message-container .modal'),
      btnClose: $('.account-message-container .btn-close'),
      signupLink: $('.account-message-container .signup-link')
    };
  }

  /**
   * Show If Logged In From Disqus
   */
  function showIfLoggedInFromDisqus() {
    var disqusCookie = $.cookie(config.disqusCookieName);
    if (!disqusCookie || disqusCookie === 'false') {
      return;
    }

    $.cookie(config.disqusCookieName, 'false', {path: '/'});

    render();
    bindUiElements();
    eventListeners();
  }

  /**
   * Render
   */
  function render() {
    var template = jst['widgets/account-message']();
    $('.account-message-modal').html(template);

    // fire omniture tracking
    setTracking('account-removal-modal');
  }

  /**
   * Event Listeners
   */
  function eventListeners() {
    ui.btnClose.on('click', function(e) {
      e.preventDefault();
      btnClosePressed();
    });

    // close modal if click outside
    ui.container.on('click', function(e) {
      if(ui.container.is(e.target)) {
        btnClosePressed();
      }
    });

    ui.signupLink.on('click', function(e) {
      doCloseModal();
      setCookie(100);
      setTracking('account-removal-signup');
    });
  }

  /**
   * Button Close Pressed
   */
  function btnClosePressed() {
    doCloseModal();
    setTracking('account-removal-dismiss');

    // set cookie to expire in 3 days
    setCookie(3);
  }

  /**
   * Do Close Modal
   */
  function doCloseModal() {
    ui.container.fadeOut(350);
  }

  /**
   * Set Cookie
   * @param days
   */
  function setCookie(days) {
    $.cookie(
      config.cookieName, 1,
      {
        expires: setCookieExpiration(days),
        path: '/'
      }
    );
  }

  /**
   * Set Cookie Expiration
   * @param days
   * @returns {Date}
   */
  function setCookieExpiration(days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    return date;
  }

  /**
   * Set Tracking
   * @param trackingVal
   */
  function setTracking(trackingVal) {
    // omniture tracking
    s.linkTrackVars='prop46,eVar46';
    s.prop46 = s.eVar46 = trackingVal;
    s.tl(true, 'o', trackingVal);
  }

  // Public contract
  return {
    init: initialize,
    showIfLoggedInFromDisqus: showIfLoggedInFromDisqus
  };

});
