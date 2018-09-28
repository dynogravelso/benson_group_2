define('blogroll/1.0.3/article-blogroll-ad',
  ['article-blogroll-config', 'jquery'],
  function (config, $) {
    'use strict';

    var areSlotsHidden = false;

    /**
     * Will set/get status of global flag areSlotsHidden
     * @param status
     * @return {boolean}
     */
    function slotsAreHidden(status) {
      if (typeof status !== 'undefined') {
        areSlotsHidden = status;
      }
      return areSlotsHidden;
    }

    /**
     * Display all hidden ad slots
     */
    function displayHiddenSlots() {
      var hiddenGptSlots = [];
      config.ui.blogRoll.find('.ad-container.hide').each(function () {
        hiddenGptSlots.push(wbgpt.getSlotById($(this).attr('id')).getGptSlot());
      });
      //leverage enableSingleRequest by initiating a single request for multiple stored ads
      googletag.pubads().refresh(hiddenGptSlots);
    }

    /**
     * Returns the expected number of ad slots per Middleware request
     * @return {Number}
     */
    function getAdSlotsCountPerRequest() {
      if (!$.isArray(config.ad.cadence)) {
        return 0;
      }
      return config.ad.cadence.length;
    }


    /**
     * This will return the ad slot id based from the ad count
     * @param adSlotCount
     * @return {string}
     */
    function getAdSlotId(adSlotCount) {
      return 'wbgpt-blogroll-' + adSlotCount;
    }

    /**
     * Create a slot property object
     * @param divId
     * @param tileCount
     * @return {{}}
     */
    function createAdSlotProperty(divId, tileCount) {
      var prop = {};
      prop.divId = divId;
      prop.tileCount = tileCount;
      return prop;
    }


    /**
     * Get all the Ad properties (ids and tilecount) for a specific page
     * @return {Array}
     */
    function getAdSlotsProperties() {
      var props = [];
      var prop;
      var divId;
      var tileCount;

      //loop through the configured ad cadence per page
      config.ad.cadence.forEach(function () {
        divId = getAdSlotId(WB_PAGE.wbgpt_ad_blogroll_id);
        tileCount = WB_PAGE.wbgpt_tile;
        prop = createAdSlotProperty(divId, tileCount);
        props.push(prop);
        WB_PAGE.wbgpt_ad_blogroll_id++;
        WB_PAGE.wbgpt_tile++;
      });

      return props;
    }

    /**
     * Create bidding slots and fill the global arrays for both Amazon and Openx
     * @param {array} divIds divIds array of slot id
     */
    function createSlotsForBidding(divIds) {
      window.apstagSlots = [];
      divIds.forEach(function (divId) {
        window.OX_dfp_ads.push([WB_PAGE.wbgpt_ad_unit_path, [config.ad.size], divId]);
        var apstagSlot = {
          slotID: divId,
          slotName: WB_PAGE.wbgpt_ad_unit_path,
          sizes: [config.ad.size]
        };
        window.apstagSlots.push(apstagSlot);
      });
    }


    /**
     * Start bidding to Openx and Amazon
     * @param {array} divIds array of slot id
     */
    function submitSlotsForBidding(divIds) {
      createSlotsForBidding(divIds);
      submitAmazonSlots();
      submitOpenXSlots();
    }

    /**
     * Inform GPT that we want to manually display ads instead of
     * auto-magically doing it for us
     */
    function disableAutoDisplayOfAds() {
      return googletag.cmd.push(function () {
        googletag.pubads().disableInitialLoad();
      });
    }

    /**
     * Initialize expected ad slots on request
     * @return {array} divIds collection/array of ad ids that have been initialized
     */
    function initAds() {
      var divIds = [];
      //loop through the ad slots on this page
      getAdSlotsProperties().forEach(function (prop, index) {
        wbgpt.createSlot(WB_PAGE.wbgpt_ad_unit_path, [config.ad.size], prop.divId)
          .setTargeting('pos', 'bottom')
          .setTargeting('tile', prop.tileCount)
          //added per AdOps request
          .setTargeting('blogroll', index + 1);
        //combine to a single array
        divIds.push(prop.divId);
      });
      return divIds;
    }

    return {
      slotsAreHidden: slotsAreHidden,
      disableAutoDisplayOfAds: disableAutoDisplayOfAds,
      initAdsByPage: initAds,
      submitSlotsForBidding: submitSlotsForBidding,
      getAdSlotId: getAdSlotId,
      displayHiddenSlots: displayHiddenSlots,
      getAdSlotsCountPerRequest: getAdSlotsCountPerRequest
    }
  });
