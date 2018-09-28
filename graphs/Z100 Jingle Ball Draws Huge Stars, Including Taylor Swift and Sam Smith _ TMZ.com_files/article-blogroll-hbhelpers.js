define('blogroll/1.0.3/article-blogroll-hbhelpers',
  ['handlebars', 'jquery', 'underscore', 'article-blogroll-ad'],
  function (handlebars, $, _, ad) {
    'use strict';

    /**
     * Increments a number by 1
     * @return {*}
     */
    function increment() {
      return handlebars.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
      });
    }

    function date() {
      return handlebars.registerHelper('date', function (dateTime) {
        return new Date(dateTime).toLocaleString()
          .replace(/, ([\d]+:[\d]{2})(:[\d]{2})(.*)/, " $1$3 PDT");
      });
    }

    function getPartial(name, data) {
      if (!name) {
        return undefined;
      }
      var template = handlebars.partials[name];
      return template(data);
    }

    /**
     * Determines the type of media the article contains
     * @param media
     * @param featuredVideo
     * @return {string}
     */
    function getMediaType(media, featuredVideo) {
      var isVideo;
      var isYouTubeEmbed;
      var isGallery;

      isYouTubeEmbed = media
        && media.type === 'external-embed' && media['attr-src']
        && media['attr-src'].indexOf('youtube.com/embed') > -1;

      isVideo = isYouTubeEmbed || featuredVideo;
      if (isVideo) {
        return 'video';
      }

      isGallery = media
        && media.type === 'gallery';
      if (isGallery) {
        return 'gallery';
      }

      return 'unknown';
    }

    /**
     * Embeds the correct icon per media type of article's content
     * @param icons
     * @return {*}
     */
    function embedMediaIcon(icons) {
      return handlebars.registerHelper('mediaIcon', function (content, options) {
        var primaryMedia = _.findWhere(content.data, {'_Index': 'primaryMedia'});
        var mediaType = getMediaType(primaryMedia, options.featuredVideo);
        var partialTemplate = null;

        switch (mediaType) {
          case 'video':
            partialTemplate = icons.playBtn;
            break;
          case 'gallery':
            partialTemplate = icons.galleryBtn;
            break;
          default:
        }

        if (content.isUnitTest) {
          return partialTemplate;
        }
        return getPartial(partialTemplate);
      });
    }


    /**
     * Decides if the current slot is an ad slot or not by checking its position against the configured cadence array
     * @param cadence
     * @param slotsPerPage
     * @return {*}
     */
    function isAdSlot(cadence, slotsPerPage) {
      var slotPosition = 0;
      var isAd;

      cadence.sort(function (a, b) {
        return a - b
      });
      return handlebars.registerHelper('ifAdSlot', function (index, options) {
        slotPosition++;
        slotPosition = slotPosition > slotsPerPage ?
          Math.round(((slotPosition / slotsPerPage ) % 1) * slotsPerPage) : slotPosition;

        isAd = cadence.indexOf(slotPosition) > -1 ? true : false;
        if (isAd) {
          return options.fn(this);
        }

        return options.inverse(this);
      });
    }

    /**
     * Counts the total article div rendered
     * @return {*}
     */
    function articleCounter() {
      var count = 0;
      return handlebars.registerHelper("articleCounter", function (value, options) {
        count++;
        return count;
      });
    }

    /**
     * Counts the total ad slot rendered
     * @return {*}
     */
    function adCounter() {
      var counter = 0;
      return handlebars.registerHelper("adCounter", function (value, options) {
        counter++;
        return counter;
      });
    }

    /**
     * Display ad slot by calling the wbgpt.displaySlotById API
     * @return {*}
     */
    function displayAdSlot(adSlotsCountPerRequest) {
      var adCount = 0;
      var adSlotsCountPerRequest = ad.getAdSlotsCountPerRequest(); //expected slots per MW request
      var isSlotHidden = false;
      var gptSlotHolder = [];
      var divId;

      return handlebars.registerHelper("displayAdSlot", function (value, options) {
        adCount++;
        //wrap as callback to ensure DOM is loaded by Handlebar
        return setTimeout(function (index) {
          divId = ad.getAdSlotId(index);
          isSlotHidden = ad.slotsAreHidden() && $('#' + divId).hasClass('hide');
          if (isSlotHidden) {
            return undefined;
          }
          gptSlotHolder.push(wbgpt.getSlotById(divId).getGptSlot());
          if (adSlotsCountPerRequest === gptSlotHolder.length) {
            //leverage GPT's enableSingleRequest feature by calling multiple stored ad slots
            googletag.pubads().refresh(gptSlotHolder);
            //clear temporary storage for next request
            gptSlotHolder = [];
          }
        }.bind(null, adCount), 0);
      });
    }

    return {
      inc: increment,
      date: date,
      ifAdSlot: isAdSlot,
      articleCounter: articleCounter,
      adCounter: adCounter,
      displayAdSlot: displayAdSlot,
      embedMediaIcon: embedMediaIcon
    };

  });
