/**
 * A module used for creating an infinite blogroll on a TMZ article page.
 * @author Joel Capillo <joel.capillo@tmz.com>
 */
var InfiniteBlogRoll = (function ($, s) {
  'use strict';


  var pendingQueue = false;
  var ad = null;
  var trackBlogRollPosition = true;
  var throttleTimer = null;
  var autoLoad = true;
  var currentPage = 1;
  var config = null;
  var jst = null;
  var mw = null;
  var logger = null;
  var currentArticleId;
  var cachedItems = [];
  var hbHelpers = null;
  var enableAds = false;

  /**
   * Shows the progess spinner
   */
  function showProgress() {
    config.ui.spinner.show();
  }

  /**
   * Hides the progess spinner
   */
  function hideProgress() {
    if (config.ui.spinner.is(':visible')) {
      config.ui.spinner.hide();
    }
  }

  /**
   * Determine the elements position on the page
   * @param el
   * @return {*}
   */
  function getElementPosition(el) {
    if (el instanceof $) {
      el = el[0];
    }
    if (!el) {
      return false;
    }
    return el.getBoundingClientRect();
  }


  function formatApiUrl(page, postCount) {
    return config.api.baseUrl + '?page=' + page + '&numRecords='
      + (postCount) + '&fields=' + config.api.extraParams;
  }


  function getData(page, postCount) {
    page = page || 1;
    postCount = postCount || config.api.postCount;
    return mw.get(formatApiUrl(page, postCount));
  }

  /**
   * Clean and sets-up data structure to align with our configuration
   * @param data
   * @return {*}
   */
  function formatResponse(data) {
    var clone;

    //remove article for current page
    data.items = $.grep(data.items, function (value) {
      return value.id !== currentArticleId;
    });

    if (data.items.length > config.display.limit) {
      data.items = cachedItems.concat(data.items);
      clone = $.extend({}, data);
      data.items = clone.items.splice(0, config.display.limit);
      //cached extra items for next page
      cachedItems = clone.items;
    }

    return data;
  }


  /**
   * Callback function after a successful Ajax call
   * @param cb
   * @return {Function}
   */
  function onXhrRequestComplete(cb) {
    return function (data) {
      var template = jst[config.template](formatResponse(data));
      var adDivIds;

      appendTemplate(template);

      if (config.ui.btn) {
        config.ui.btn.show();
      }

      if (cb && $.isFunction(cb)) {
        cb.call();
      }

      if(enableAds) {
        adDivIds = ad.initAdsByPage();
        ad.submitSlotsForBidding(adDivIds);
      }
      pendingQueue = false;
      hideProgress();
    }
  }

  function getRequestDataLimit(page) {
    //compensate if we need to remove one of the page's article from the data
    var limit = config.display.limit + 1;
    if (page > 1) {
      //increase by 1 after the first page to compensate data overlaps
      //must be a bug on MW
      limit = limit + 1;
    }
    return limit;
  }

  /**
   * Used to create a data request on the middleware
   * @param page
   * @param limit
   * @param cb
   * @return {*}
   */
  function singlePageRequest(page, limit, cb) {
    var firstPage = page;
    var adDivIds;
    var nextPage = firstPage + 1;

    showProgress();

    //initialize creation and bidding of ads
    if (page === 1 && enableAds) {
      adDivIds = ad.initAdsByPage();
      ad.submitSlotsForBidding(adDivIds);
    }

    getData(firstPage, limit)
      .done(onXhrRequestComplete(cb));

    return nextPage;
  }


  function changePage() {
    if (!autoLoad) {
      return false;
    }
    var cb = trackBlogRollPosition ? trackBlogRollBottom() : null;
    var limit = getRequestDataLimit(currentPage);

    //update the current page
    currentPage = singlePageRequest(currentPage, limit, cb);

    return true;
  }


  function checkLazyLoadTrigger(trigger, factor) {
    factor = factor || 0;

    var rect = getElementPosition(trigger);
    var triggerBottom = rect.bottom - factor;
    var isTriggered = triggerBottom <= (window.innerHeight
      || document.documentElement.clientHeight);

    return isTriggered;
  }


  function appendTemplate(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    return config.ui.native.blogRollBody.appendChild(div);
  }


  /**
   * Keeps track of the right rail's end and determines if to stick the right rail end on the top or not
   */
  function checkRightRailEnd() {
    var rightRailEndRect;
    var triggerRect;
    var previousDivRect;
    var isTriggerBelowRightRail;
    var isRightRailEndOnTop;

    rightRailEndRect = getElementPosition(config.ui.rightRailEnd);
    previousDivRect = getElementPosition(config.ui.rightRailEndPrev);
    triggerRect = getElementPosition(config.ui.lazyLoadTrigger);

    isRightRailEndOnTop = previousDivRect.bottom < config.rightRailEnd.top;
    isTriggerBelowRightRail = triggerRect.bottom > rightRailEndRect.bottom;

    if (isRightRailEndOnTop && isTriggerBelowRightRail && triggerRect.top > config.trigger.top) {
      return config.ui.rightRailEnd.addClass('stickToTop');
    }

    return config.ui.rightRailEnd.removeClass('stickToTop');
  }


  /**
   * Moves the scroll bar going to the top on a specific distance
   * @param distance
   * @param cb
   */
  function scrollUp(distance, cb) {
    var top = config.ui.blogRoll.find('.blogroll-item').last().offset().top - distance;
    config.ui.htmlBody.animate({
      scrollTop: top
    }, 10).promise().done(cb);
  }


  function primaryTriggerFactor(height, marginTop, count, factor) {
    factor = factor || 500;
    var dist = ((count * height) + (count * marginTop) + factor);
    return dist;
  }

  function onLoadTriggerFactor(factor) {
    factor = factor || 500;
    var dist = config.ui.header.height() + factor;
    return dist;
  }

  function adSlotsTriggerFactor(marginTop) {
    marginTop = marginTop || 40;
    var adSlots = config.ui.blogRoll.find('.ad-container');
    return (adSlots.first().height() + marginTop) * 2;
  }


  function getTriggerFactor(includeAdSlots) {
    includeAdSlots = includeAdSlots || null;
    var marginTop = 40;
    var item = config.ui.blogRoll.find('.blogroll-item');
    var triggerFactor;
    var blogCount = item.length;

    //check if we just loaded the page and no blog-item yet
    if (blogCount === 0) {
      return onLoadTriggerFactor();
    }

    blogCount = (blogCount >= config.display.limit) ? config.display.limit : blogCount;
    triggerFactor = primaryTriggerFactor(item.first().height(), marginTop, blogCount);

    //add the ad slots
    if (includeAdSlots) {
      return triggerFactor + adSlotsTriggerFactor(marginTop);
    }

    return triggerFactor;
  }


  /**
   * Hide rows to make the bottom of the blogroll as almost the same level with the end of the sidebar
   * @param diff
   */
  function hideExtraRows(diff) {
    var rows = config.ui.blogRoll.find('.row');
    var allowance = 0;
    var oThis;
    var margin = 40;

    $(rows.get().reverse()).each(function () {
      oThis = $(this);
      diff = diff - margin - oThis.height();
      if (diff <= allowance) {
        return false;
      }
      oThis.addClass('hide');

      if (oThis.hasClass('ad-container')) {
        oThis.prev().first().addClass('hide');
        //broadcast that there are hidden ad slots
        ad.slotsAreHidden(true);
      }
    });
  }

  /**
   * Show all hidden rows thru hideExtraRows function
   */
  function showExtraRows() {
    config.ui.blogRoll.find('.hide').removeClass('hide');
  }


  function registerHbHelpers() {
    hbHelpers.inc();
    hbHelpers.date();
    hbHelpers.ifAdSlot(config.ad.cadence, config.display.limit);
    hbHelpers.adCounter();
    if(enableAds){
      hbHelpers.displayAdSlot();
    }
    hbHelpers.articleCounter();
    hbHelpers.embedMediaIcon(config.partials.icons);
  }

  /**
   * Tracks the blogroll bottom and level it with that of the right rail on initial page load
   * @return {Function}
   */
  function trackBlogRollBottom() {
    return function () {
      var blogRollRect = getElementPosition(config.ui.blogRoll);
      var rightRailEndRect = getElementPosition(config.ui.rightRailEnd);
      var diff = blogRollRect.bottom - rightRailEndRect.top;
      var isSideBarLoaded = config.ui.blogRollBody.height() > config.sideBar.minHeight;

      if (diff > 0 && isSideBarLoaded) {
        autoLoad = false;
        hideExtraRows(diff);
      }
    };
  }

  /**
   * Starts the infinite scroll feature
   */
  function setUpInfiniteScroll() {
    autoLoad = true;
    trackBlogRollPosition = false;
    showExtraRows();
    config.ui.btn.remove();
    config.ui.btn = null;
    checkRightRailEnd();
  }


  function executeTracking(trackingVal) {
    s.linkTrackVars = 'prop46,eVar46';
    s.prop46 = s.eVar46 = trackingVal;
    s.tl(true, 'o', trackingVal);
  }

  /**
   * Callback function that fires after each end of the scroll event
   * @param trigger
   * @param callback
   * @return {Function}
   */
  function onScroll(trigger, callback) {
    var isTriggered;
    var isAnimating = false;
    var isScrollerOnTheBottom = false;
    var triggerFactor;

    return function (e) {
      clearTimeout(throttleTimer);
      throttleTimer = setTimeout(function () {
        checkRightRailEnd();
      }, config.throttleDelay);

      isScrollerOnTheBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      if (isScrollerOnTheBottom && !config.ui.btn && !isAnimating) {
        isAnimating = true;
        scrollUp(500, function () {
          isAnimating = false;
        });
        return false;
      }

      if (pendingQueue || isAnimating) {
        return undefined;
      }

      triggerFactor = getTriggerFactor(true);
      isTriggered = checkLazyLoadTrigger(trigger, triggerFactor);
      if (isTriggered) {
        pendingQueue = true;
        callback();
      }
    }
  }


  function onArticleClick() {
    var trackValue = 'More From TMZ - ' + $(this).closest('.blogroll-item').attr('data-index-number');
    return executeTracking(trackValue);
  }

  /**
   * Disable autoscroll when users click the back button on Chrome
   * @return {void}
   */
  function disableAutoScroll() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }


  function bindEvents() {

    config.ui.document.on('scroll touchmove',
      onScroll(config.ui.lazyLoadTrigger, function () {
        changePage();
      })
    );

    config.ui.btn.on('click', function (e) {
      e.preventDefault();
      ad.disableAutoDisplayOfAds();
      //turn the flag off that there are hidden slots
      ad.slotsAreHidden(false);
      //submit the hidden ad slots manually
      if(enableAds) {
        ad.displayHiddenSlots();
      }
      setUpInfiniteScroll();
      changePage();
    });

    config.ui.blogRollBody.on('click', '.blogroll-item a', onArticleClick);

    disableAutoScroll();
  }


  function activate(articleId) {
    if (!articleId) {
      throw new Error('Please set an article id.');
    }
    currentArticleId = articleId;
    registerHbHelpers();
    bindEvents();
  }


  function init(params) {
    if (!params || !params.config || !params.template
      || !params.hbHelpers || !params.mw || !params.logger || !params.ad) {
      throw new Error('Please provide all dependencies.');
    }

    //assign dependencies
    config = params.config;
    jst = params.template;
    mw = params.mw;
    logger = params.logger;
    hbHelpers = params.hbHelpers;
    ad = params.ad;
    enableAds = params.enableAds;

    return activate;
  }


  function getTestInstance() {
    return {
      activate: activate,
      getData: getData
    };
  }


  return {
    init: init,
    //for unit testing purposes
    getTestInstance: getTestInstance
  }

}(jQuery, s));

//allow the module to be used in AMD way or directly thru the browser
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['lib/infinite-blogroll/1.0.2/infinite-blogroll'], factory);
  } else {
    // Browser globals
    root.InfiniteBlogRoll = factory(root['lib/infinite-blogroll/1.0.2/infinite-blogroll']);
  }
}(this, function (b) {
  return InfiniteBlogRoll;
}));




