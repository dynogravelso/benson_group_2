define('tmz/shortcodes/1.0.7/shortcodes',
  ['jquery', 'templates/jst', 'logger', 'module'],
  function ($, templates, logger, module) {
    'use strict';

    logger = logger.getInstance(module.id);

    /**
     * shortcodes
     */
    var shortcodes = function shortcodes() {

      function omnivirtVideoEmbed(options) {
        var playerName = 'omnivirt-player-' + randomNum();
        var customHeight = typeof options.height === 'undefined' ? 410 : parseInt(options.height);
        var customWidth = typeof options.width === 'undefined' ? 728 : parseInt(options.width);

        var source = {
          player_name: playerName,
          custom_height: customHeight,
          custom_width: customWidth,
          video_id: options.id
        };

        var embedTemplate = templates['shortcodes/omnivirt-video-embed'](source);
        $('#' + options.placeholder_id).html(embedTemplate);
      }

      function tmzVideoEmbed(options) {
        var playerName = 'player' + randomNum();
        var customHeight = typeof options.height === 'undefined' ? 410 : parseInt(options.height);
        var customWidth = typeof options.width === 'undefined' ? 728 : parseInt(options.width);
        var endcard = typeof options.endcard === 'undefined' ? true : (options.endcard.toLowerCase() === 'true');
        logger.info(options.primary_image);
        var primaryImage = typeof options.primary_image === 'undefined' || options.primary_image === null ? '' : options.primary_image.filter(function( obj ) {
          return obj.value == "1080x608";
        });
        var videoSwipe = typeof options.video_swipe === 'undefined' || options.video_swipe === null ? '' : options.video_swipe;
        var launchQuote = typeof options.launch_quote === 'undefined' || options.launch_quote === null ? '' : options.launch_quote;
        var videoCredit = typeof options.video_credit === 'undefined' || options.video_credit === null ? '' : options.video_credit;


        //autoPlay and autoMute parameters are set to false by default if null or undefined.

        var autoPlay = false;
        var autoMute =  false;
        var liveStream =  false;
        if(options.hasOwnProperty('auto_play') && options.auto_play !==null && options.auto_play !=='undefined' && typeof options.auto_play  !== 'undefined' ){
          autoPlay = options.auto_play;
        }
        if(options.hasOwnProperty('auto_mute') && options.auto_mute !==null && options.auto_mute !=='undefined' && typeof options.auto_mute  !== 'undefined'){
          autoMute = options.auto_mute;
        }
        if(options.hasOwnProperty('live_stream') && options.live_stream !==null && options.live_stream !=='undefined' && typeof options.live_stream  !== 'undefined'){
          liveStream = options.live_stream;
        }

        var overlays = {
          video_swipe: videoSwipe,
          launch_quote: launchQuote,
          video_credit: videoCredit
        };
        var videoSwipeTemplate = templates['shortcodes/tmz-video-swipe'](overlays);
        if(videoSwipe === '') {
            videoSwipeTemplate = '';
        }
        var launchQuoteTemplate = templates['shortcodes/tmz-video-launch-quote'](overlays);
        if(launchQuote === '' && videoCredit === '') {
          launchQuoteTemplate = '';
        }

        var source = {
          player_name: playerName,
          custom_height: customHeight,
          custom_width: customWidth,
          video_swipe_template: videoSwipeTemplate,
          launch_quote_template: launchQuoteTemplate,
          endcard: endcard,
          auto_play: autoPlay,
          auto_mute: autoMute,
          live_stream: liveStream,
          video_id: options.id.replace('-', '_')
        };

        if(primaryImage !== '' && typeof primaryImage[0] !== 'undefined') {
          source.primary_image = primaryImage[0].url;
        }
        var embedTemplate = templates['shortcodes/tmz-video-embed'](source);
        $('#' + options.placeholder_id).html(embedTemplate);
      }

      return {
        tmzVideoEmbed: tmzVideoEmbed,
        omnivirtVideoEmbed: omnivirtVideoEmbed
      };

    };

    return shortcodes();
  }
);
