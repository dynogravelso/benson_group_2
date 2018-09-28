// A place to consolidate all global event listeners

define('global/event-listeners/1.0.1/event-listeners', ['jquery'], function ($) {

  var eventListeners = {

    initNewsFeed: function () {
      // omniture tracking for inline promos on news feed
      this.trackingInlinePromos.init();
    },

    initArticle: function() {
      // omniture tracking for engagement behavior on articles
      this.trackingArticleEngagement.init();
    },

    // omniture tracking for inline promos on news feed
    trackingInlinePromos: {

      ui: {
        inlinePromo: $('.inline-promo'),
        sharethroughAd: $('#sharethrough-ad')
      },

      init: function () {
        // normal inline promos
        this.ui.inlinePromo.on('click', function (e) {
          var link = $(e.currentTarget).find('a').attr('href');
          this._trackAd($(e.currentTarget).index(), 'Internal', link);
        }.bind(this));

        // sharethrough ad
        this.ui.sharethroughAd.on('click', function (e) {
          this._trackAd($(e.currentTarget).index(), 'Native Ad', '');
        }.bind(this));

        // promos inside of an iframe
        var overIframe = 0;
        this.ui.inlinePromo.on('mouseenter', function () {
          overIframe = $(this);
        }).on('mouseleave', function () {
          overIframe = 0;
        });

        $(window).on('blur', function () {
          if (overIframe && overIframe.find('iframe').length > 0) {
            var link = overIframe.find('iframe').contents().find('a').attr('href');
            this._trackAd(overIframe.index(), 'Native Ad', link);
          }
        }.bind(this));
      },

      // omniture call to track ad
      _trackAd: function (index, type, link) {
        var value = index + ' - ' + type + ' - ' + link;

        s.linkTrackVars = 'prop38,eVar38';
        s.prop38 = s.eVar38 = value;
        s.tl(true, 'o', value);

        s.clearVars();
        s.prop38 = s.eVar38 = '';
      }
    },

    trackingArticleEngagement: {

      ui: {
        viewComments: $('.disqus-switch a'),
        loadMoreStories: $('.blogroll .more-post-loader')
      },

      init: function() {
        this.ui.viewComments.click(function() {
          this._track46('Comments');
        }.bind(this));

        this.ui.loadMoreStories.click(function() {
          this._track46('Load More Stories');
        }.bind(this));
      },

      // omniture call to fire prop/eVar46
      _track46: function(trackingVal) {
        s.linkTrackVars = 'prop46,eVar46';
        s.prop46 = s.eVar46 = trackingVal;
        s.tl(true, 'o', trackingVal);
        s.clearVars();
        s.prop46 = s.eVar46 = '';
      }
    }
  };

  return eventListeners;

});
