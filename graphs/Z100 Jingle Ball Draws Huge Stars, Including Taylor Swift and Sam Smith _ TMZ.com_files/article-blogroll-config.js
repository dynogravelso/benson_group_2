define('blogroll/1.0.3/article-blogroll-config',
  ['jquery'],
  function ($) {
    'use strict';

    //declare our Configuration values
    return {
      template: 'blogroll/article-blogroll',
      partials: {
        icons: {
          playBtn: 'blogroll/icons/_play-btn',
          galleryBtn: 'blogroll/icons/_gallery-btn'
        }
      },
      throttleDelay: 20,
      display: {
        limit: 10
      },
      sideBar: {
        minHeight: 8000,
      },
      rightRailEnd: {
        //minimum top value of the end of the rail to stick it on the top of the window
        top: 20
      },
      trigger: {
        //minimum top value of the trigger element to stick the right rail on the top
        top: 200,
      },
      ad: {
        cadence: [5, 10], //create an ad slot after the fifth and tenth blogroll
        size: [728, 90] //width & height of the ad to display
      },
      api: {
        baseUrl: '/api/v1/articles',
        extraParams: encodeURIComponent('primaryTabletImage,primaryImage,featuredVideo,channel,headline'),
        postCount: 5, //default post count to return
      },
      ui: {
        window: $(window),
        htmlBody: $('html, body'),
        document: $(document),
        blogRoll: $('.blogroll'),
        blogRollBody: $('.blogroll').find('.body'),
        header: $('.blogroll').find('.header'),
        btn: $('.blogroll').find('button'),
        lazyLoadTrigger: $('.blogroll').find('.bottom'),
        rightRailEnd: $('#sidebar .js-sidebar-tracking').last(),
        rightRailEndPrev: $('div#most-commented-posts'),
        spinner: $('.blogroll').find('.spinner'),
        sidebar: $('#sidebar'),
        native: {
          blogRollBody: document.getElementsByClassName("body")[0]
        }
      },
      showLog: false
    };

  });
