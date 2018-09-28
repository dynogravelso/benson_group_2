define('blogroll/1.0.3/article-blogroll',
  ['mw', 'templates/jst',
    'lib/infinite-blogroll/1.0.2/infinite-blogroll',
    'article-blogroll-config', 'article-blogroll-hbhelpers', 'article-blogroll-ad', 'logger', 'module'],
  function (mw, jst, infiniteblogroll, config, hbHelpers, ad, logger, module) {
    'use strict';

    var articleBlogRoll;
    var log = logger.getInstance(module.id);


    articleBlogRoll = infiniteblogroll.init({
      config: config,
      template: jst,
      hbHelpers: hbHelpers,
      mw: mw,
      logger: log,
      ad: ad,
      enableAds: enableAds,
    });

    return articleBlogRoll;

  });
