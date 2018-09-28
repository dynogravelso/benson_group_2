define('share/1.0.4/share', ['jquery', 'mw', 'templates/jst'],
  function ($, mw, jst) {
    'use strict';

    /**
     * Social Share
     */
    var socialShare = function socialShare() {

      function init() {
        var $stories = $('article.news');
        var storyGuids = [];

        $.each($stories, function () {
          storyGuids.push($(this).data('guid'));
        });

        var storyGuidsString = storyGuids.join(',');
        if (storyGuids.length !== 0) {
          // get FB counts from Middleware
          mw.get('/api/v1/socialactivities?id=' + storyGuidsString).done(function (response) {
            $.each(response.items, function (index, item) {
              var count = item.counts.facebook;
              if (count > 0) {
                $stories.eq(index).find('.facebook-sharrre').attr('data-count', count);
              }
            });

            // FB header
            $('.facebook-sharrre').sharrre({
              share: {
                facebook: true
              },
              template: jst['share/share']({class: 'facebook'}),
              enableHover: false,
              enableTracking: true,
              click: function (api, options) {
                api.simulateClick();
                api.openPopup('facebook');
              }
            }).on('click', function () {
              s.linkTrackVars = 'prop13,eVar13';
              s.prop13 = s.eVar13 = 'facebook-header';
              s.tl(true, 'o', 'facebook-header');
              s.clearVars();
              s.prop13 = s.eVar13 = '';
            });
          });
        }

        // Twitter header
        $('.twitter-sharrre').sharrre({
          share: {
            twitter: true
          },
          template: jst['share/share']({class: 'twitter'}),
          enableHover: false,
          enableTracking: true,
          click: function (api, options) {
            api.simulateClick();
            api.openPopup('twitter');
          }
        }).on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'twitter-header';
          s.tl(true, 'o', 'twitter-header');
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        // header/footer nav social buttons
        $('.logo-fb').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'facebook-' + $(this).data('location');
          s.tl(true, 'o', 'facebook-' + $(this).data('location'));
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        $('.logo-tw').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'twitter-' + $(this).data('location');
          s.tl(true, 'o', 'twitter-' + $(this).data('location'));
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        $('.logo-yt').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'youtube-' + $(this).data('location');
          s.tl(true, 'o', 'youtube-' + $(this).data('location'));
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        $('.logo-ig').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'instagram-' + $(this).data('location');
          s.tl(true, 'o', 'instagram-' + $(this).data('location'));
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        // FB footer
        $('.inpost-social .facebook').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'facebook-footer';
          s.tl(true, 'o', 'facebook-footer');
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        // Twitter footer
        $('.inpost-social .twitter').on('click', function () {
          s.linkTrackVars = 'prop13,eVar13';
          s.prop13 = s.eVar13 = 'twitter-footer';
          s.tl(true, 'o', 'twitter-footer');
          s.clearVars();
          s.prop13 = s.eVar13 = '';
        });

        // Comments footer
        $('.inpost-social .comment-btn').on('click', function (e) {
          s.linkTrackVars = 'prop34,eVar34';
          s.prop34 = s.eVar34 = 'comments';
          s.tl(true, 'o', 'comments');
          s.clearVars();
          s.prop34 = s.eVar34 = '';
        });

        // See Also footer
        $('.article-footer .group li').on('click', function (e) {
          s.linkTrackVars = 'prop35,eVar35';
          s.prop35 = s.eVar35 = 'see-also';
          s.tl(true, 'o', 'see-also');
          s.clearVars();
          s.prop35 = s.eVar35 = '';
        });

        // Story Tags footer
        $('.article-footer .see-more a').on('click', function (e) {
          var tagName = $(e.target).html().toLowerCase().replace(' ', '-');

          s.linkTrackVars = 'prop36,eVar36';
          s.prop36 = s.eVar36 = 'tag-' + tagName;
          s.tl(true, 'o', 'tag-' + tagName);
          s.clearVars();
          s.prop36 = s.eVar36 = '';

        });
      }

      return {
        init: init
      };
    };

    return socialShare();
  }
);
