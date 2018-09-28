define('widgets/quick-subscribe/1.0.0/quick-subscribe', ['jquery'], function ($) {
  'use strict';
  var $btnClose = $('.newsletter-modal .btn-close');
  var $btnSignup = $('.newsletter-modal .btn-signup');
  var $checkboxField = $('.newsletter-modal .checkbox-field');
  var $errorClass = 'error';
  var $errorsContainer = $('.quick-subscribe-form .optin-errortxt');
  var $form = $('.quick-subscribe-form form');
  var $groupNumber = $('.group-number');
  var $inputField = $('input.quicksub-email');
  var $newsletterModal = $('.newsletter-signup-modal');
  var $signupCheckmark = $('.btn-signup .checkmark');
  var $signupText = $('.btn-signup .text');
  var $submitField = $('.quick-subscribe-submit');

  function debug_log(txt) {
    if((typeof window.SYSTEM_ENV !== 'undefined') && (window.SYSTEM_ENV =='dev' || window.SYSTEM_ENV == 'local')){
      if (window.console && typeof console.log != "undefined"){
        return console.log("QUICKSUB DEBUG::" + txt);
      }
    }
  }

  function emailValidation() {
    debug_log('QUICKSUB: -validating email');


    var validEmail = false;
    var email = $('input.quicksub-email');

    var emailVal = $('input.quicksub-email').val();
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email != null && emailVal.length !== 0 && emailVal !== 'Email Address') {
      if (filter.test(emailVal)) {
        validEmail = true;
        debug_log('setting email as valid');
        email.value = emailVal;
      }
    }

    if (validEmail) {
      //Email address is valid
      debug_log("EMAIL VALID");
      $inputField.removeClass($errorClass);
      $submitField.removeClass($errorClass);

      if ($submitField.hasClass('gateway-shown')) {
        customAdId("follow-widget.tmz.newsletter.submit");
        $errorsContainer.html('Subscribing in progress... please check your email.');

        $('.quicksub-iframe').one('load', function () {
          $form.empty();
          $form.html('<p class="thankyou">Thank you!<br /> You have successfully signed up.</p>');
        });
        setTimeout(function() { $btnClose.trigger('click') }, 1000);

        return true;
      } else {
        $newsletterModal.fadeIn(350);
        return false;
      }
    } else {
      debug_log("EMAIL INVALID");
      $errorsContainer.html('E-mail address is not valid!');
      $inputField.addClass($errorClass);
      $submitField.addClass($errorClass);

      return false;
    }
  }

  function init() {
    debug_log('validator initialized');
    var ui = {};
    // set the modal to appear in the center of the screen
    $('.newsletter-modal').css('margin-top', ($(window).height() - 478)/2);

    $inputField.focus(function () {
      var email = $inputField.val();
      if (email === 'Email Address') {
        $inputField.val('');
        $inputField.prop('placeholder', '');
      }
      $inputField.removeClass($errorClass);
      $submitField.removeClass($errorClass);
      $errorsContainer.empty();
    });

    $inputField.blur(function () {
      var email = $inputField.val();
      if (email === '') {
        $inputField.val('Email Address');
        $inputField.prop('placeholder', 'Email Address');
      }
    });

    $btnClose.on('click', function (e) {
      e.preventDefault();
      $newsletterModal.fadeOut(350);
    });

    $btnSignup.on('click', function (e) {
      e.preventDefault();
      if (!$checkboxField.prop('checked')) {
        debug_log('Remove group number');
        $groupNumber.remove();
      }
      $submitField.addClass('gateway-shown');
      $signupText.hide();
      $signupCheckmark.css('display', 'block');
      $submitField.trigger('click');
    });
  }

  return {
    render: function(toSelector) {
      init();
      $(toSelector).on('submit', function(e){
        emailValidation();
      });
    }
  }
});
