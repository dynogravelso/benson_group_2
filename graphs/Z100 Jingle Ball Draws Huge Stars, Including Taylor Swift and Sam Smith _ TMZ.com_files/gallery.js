define('photos/1.3.0/gallery', ['jquery', 'jquery.slick/1.5.8/jquery.slick', 'templates/jst', 'lib/pinchzoomer/js/jquery.mousewheel.min', 'lib/pinchzoomer/js/jquery.hammer.min', 'mw', 'underscore', 'logger', 'module', 'periodify'], function ($, slick, jst, mousewheel, hammer, mw, _, logger, module, periodify) {

  var logger = logger.getInstance(module.id);

  // pass object thumbnail-override and preferred sizes in an array
  function getImageBySize(thumbnails, sizes) {
    var image = '';
    for (var y in sizes) {
      for (var i in thumbnails) {
        if (thumbnails[i].value === sizes[y]) {
          image = thumbnails[i].url;
          return image;
        }
      }
    }
  }

  return {

    // renders gallery
    buildGallery: function () {

      // gallery DOM objects
      var $gallery = $('.tmz-gallery');

      // gallery variables needed to build
      var galleryLength = galleryJson.images.length;
      var galleryDescription = galleryJson.description;
      var relatedCategories = galleryJson.relatedCategories;
      var galleryImages = galleryJson.images;
      // if there are related galleries, use them here. otherwise, use recent galleries
      var relatedGalleries = galleryJson.relatedGalleries && galleryJson.relatedGalleries.length > 0 ? galleryJson.relatedGalleries : galleryJson.recentGalleries;
      var galleryTitle = galleryJson.title;
      var adZone = 'noads';
      var imagesLeft = galleryLength;
      var forkBgSrc = '';
      var initialLoad = true;
      var gallerySlug = null;
      var isSports = relatedCategories.indexOf('tmzsports') > -1;
      var $adSlot = null;
      var innerGalleryAdBidsAreFetched = false;
      var outerGalleryAdBidsAreFetched = false;
      var isLightbox = window.frameElement;
      var slideIndex = 0;
      var slickInitialized = false;
      var nextGallery = null;
      var mwSlug = null;
      var replayIndex = 0;

      var REFRESH = 'refresh';
      var NOREFRESH = 'no-refresh';
      var initialValue = NOREFRESH;

      // create an ad refresh pattern
      // Ex. [REFRESH] - pattern will refresh ads all the time
      var adRefreshPattern = [REFRESH, NOREFRESH]; // refresh outer gallery ads every other slide
      periodify.set(adRefreshPattern, initialValue);

      // build HTML
      function buildSlides(container) {
        $.each(galleryImages, function (index, value) {
          if (slickInitialized) {
            buildNextGallery(gallerySlug);
          }

          var slide = $(this)[0];

          if (adZone !== 'noads') {
            // add ads and forks at right places
            if (index > 0 && index % 5 === 0) {
              container.append(jst['photos/ad']());
            }
          }

          var newSlide = jst['photos/slide']({
            slug: slide['Slug'],
            src: slide['original-image'],
            credit: slide['photo-credit-text-current'],
            caption: slide['caption'],
            index: slideIndex,
            relatedPollGuid: slide['related-poll-guid'],
            legacyPollCode: slide['legacy-poll-code'],
            galleryTitle: galleryTitle,
            galleryLength: galleryLength
          });

          if (slickInitialized) { // aka if this is a new gallery in an infinite scroll situation
            // add slide using slick
            $gallery.slick('slickAdd', newSlide);
          } else {
            // add slide manually
            container.append(newSlide);
          }

          slideIndex++;

          // update src for end card
          forkBgSrc = slide['original-image'];

          imagesLeft--;

          // add end card
          if (imagesLeft === 0) {

            // the mwSlug is in different places when it is in galleryJson vs when it is from a previous MW call
            mwSlug = typeof relatedGalleries[0].RecordLink !== 'undefined' ? relatedGalleries[0].RecordLink.split(window.location.origin + '/photos/')[1] : relatedGalleries[0].slug;

            // reduce related galleries to 3
            while (relatedGalleries.length > 3) {
              relatedGalleries.shift();
            }

            var fork = isLightbox ? 'photos/fork-lightbox' : 'photos/fork';

            var endCard = jst[fork]({
              imagesLeft: imagesLeft,
              bgImg: forkBgSrc,
              nextGallery: nextGallery,
              relatedGalleries: relatedGalleries,
              isEnd: true,
              galleryTitle: galleryTitle,
              galleryLength: galleryLength
            });

            if (slickInitialized) { // aka if this is a new gallery in an infinite scroll situation
              $gallery.slick('slickAdd', endCard);
            } else {
              $gallery.append(endCard);
            }

            if (isLightbox) {
              $.each($('.recent-gallery a'), function () {
                $(this).on('click', function (e) {
                  e.preventDefault();
                  // lightbox related galleries open a new lightbox instead of new page load
                  openNewLightboxGallery($(this).attr('href').split(window.location.origin + '/photos/')[1]);
                })
              });
            }
          }
        });
        if (slickInitialized) { // aka if this is a new gallery in an infinite scroll situation
          $slides = $('.gallery-slide');
          slideLength = $slides.length;
        }
        slickInitialized = true;
      }

      function buildNextGallery(newLink) {
        var imgSizes = ['400x300', '322x230', '300w'];
        // use underscore's extendable built-in function to unescape special characters.
        var nextGalleryTitle = _.unescape(relatedGalleries[0].title);
        nextGallery = {
          title: nextGalleryTitle,
          link: newLink
        };

        // the next gallery images are in different places when it is in galleryJson vs when it is from a previous MW call
        if (slickInitialized) {
          nextGallery.img = nextGallery.bg = relatedGalleries[0].thumbnail;
        } else {
          nextGallery.img = nextGallery.bg = getImageBySize(relatedGalleries[0]['thumbnail-override'], imgSizes);
        }
      }

      function getMWImage(thumbnails) {
        if (typeof thumbnails['400x400'] !== 'undefined') {
          return thumbnails['400x400'];
        } else if (typeof thumbnails['400x300'] !== 'undefined') {
          return thumbnails['400x300'];
        } else if (typeof thumbnails['322x230'] !== 'undefined') {
          return thumbnails['322x230'];
        } else {
          return '';
        }
      }

      function formatRelatedGalleries() {
        relatedGalleries.forEach(function (gallery) {
          if (typeof gallery.RecordLink === 'undefined') {
            gallery.RecordLink = window.location.origin + '/photos/' + gallery.slug;
          }
          // the gallery thumbnail is in different places when it is in galleryJson vs when it is from a previous MW call
          gallery.thumbnail = typeof gallery.images !== 'undefined' ? gallery.images[0]['thumbnails-json'][7].url : getMWImage(gallery.assets.primaryImage[0].thumbnailUrls);
        });
      }

      formatRelatedGalleries();

      buildNextGallery(relatedGalleries[0].RecordLink);

      buildSlides($gallery);

      // lightbox specific
      if (isLightbox) {
        var $galleryLeft = $('.gallery-left');
        $galleryLeft.load(
            // fade in left part of gallery
            $galleryLeft.animateCss(
                'fade',
                '0.75s',
                null,
                setTimeout(function () {
                  // pulse in next arrow
                  $('.gallery-arrow-next').animateCss('pulse', '0.5s').removeClass('hidden');
                }, 500)
            ).removeClass('hidden')
        );

        function openNewLightboxGallery(url) {
          if (typeof url !== 'string') {
            // default goes to "up next" gallery
            url = $('.next-gallery').attr('href').split(window.location.origin + '/photos/')[1];
          }

          var $photosSection = $('.photos-section');
          // fade out entire gallery
          $photosSection.animateCss(
              'fade',
              '0.75s',
              'reverse',
              function () {
                $photosSection.addClass('hidden');
                // when provided with a url, this will open a new lightbox after destroying the current one
                parent.destroyTmzLightbox(url);
              }
          );
        }
      }

      function updateCaption(caption, galleryDescription, $readMore, $caption, $ad, $galleryCaption) {
        var shortCaption = '';
        var fullCaption = '';
        var maxLength = '600';

        // default to gallery description if no caption available
        if (typeof caption === 'undefined' || caption === '') {
          caption = $("<div/>").html(galleryDescription).text();
        }

        var acceptableCaptionLength = isLightbox ? 220 : 65;

        if (isLightbox && caption.length > 130 && caption.length <= 410) {
          $('.gallery-caption .caption').addClass('medium-text');
          $('.gallery-caption .caption').removeClass('small-text');
          acceptableCaptionLength = 190;
        } else if (isLightbox && caption.length > 410) {
          $('.gallery-caption .caption').addClass('small-text');
          $('.gallery-caption .caption').removeClass('medium-text');
        } else {
          $('.gallery-caption .caption').removeClass('small-text');
          $('.gallery-caption .caption').removeClass('medium-text');
        }

        if (caption.length > acceptableCaptionLength) {
          shortCaption = caption.substr(0, acceptableCaptionLength - 1) + '...';
          // max length of caption so not to overflow
          if (caption.length > maxLength) {
            fullCaption = caption.substr(0, maxLength - 1) + '...';
          } else {
            fullCaption = caption;
          }
          caption = shortCaption;
          $readMore.show();
        } else {
          $readMore.hide();
        }

        $caption.html(caption).show();

        var expanded = false;

        $readMore.html('READ MORE').off('click').on('click', function () {
          if (!expanded) {
            $caption.html(fullCaption);
            $(this).html('READ LESS');
            if ($ad) {
              $ad.hide();
            }
            $galleryCaption.addClass('auto-height');
            expanded = true;
          } else {
            $caption.html(shortCaption);
            $(this).html('READ MORE');
            if ($ad) {
              $ad.show();
            }
            $galleryCaption.removeClass('auto-height');
            expanded = false;
          }
        });
      }

      // gallery UI
      var $title = $('.gallery-title');
      var $prev = $('.gallery-arrow-prev');
      var $prevLabel = $('.gallery-arrow-label-prev');
      var $next = $('.gallery-arrow-next');
      var $count = $('.gallery-count');
      var $nextLabel = $('.gallery-arrow-label-next');
      var $currentCount = $('.gallery-current');
      var $totalCount = $('.gallery-total');
      var $share = $('.gallery-share');
      var $credit = $('.gallery-credit');
      var $galleryCaption = $('.gallery-caption');
      var $caption = $('.gallery-caption .caption');
      var $readMore = $('.gallery-caption .read-more');
      var $ad = $('.gallery-ad');
      var $arrows = $('.gallery-arrows');
      var $galleryRight = $('.gallery-right');
      var $replay = $('.btn-replay');
      var $related = $('.recent-gallery a');
      var $slides = $('.gallery-slide');
      var $nextGallery = $('.next-gallery');
      var $recentGallery = $('.recent-gallery');
      var slideLength = $slides.length;
      var slickIndex = 0;

      function resizeEndCardElements() {
        if (isLightbox) {
          $recentGallery.css('height', $($recentGallery[0]).width() * .75);
        }
      }

      // set title
      $title.html(galleryTitle);

      $gallery.slick({
        lazyLoad: 'ondemand',
        infinite: false,
        swipe: false,
        nextArrow: '.slick-next',
        cssEase: 'ease-in-out',
        easing: 'ease-in-out',
        speed: 500
      });

      var prevHeight = $('.slick-prev').height();
      var nextHeight = $('.slick-next-bottom').height();

      // used to make poll from Middleware
      function makePoll($slide) {
        mw.get('/api/v1/Polls?ids=' + $slide.data('related-poll-guid')).done(function (response) {
          var poll = response.items[0];
          var total = 0;
          var answers = [];

          // total count
          $.each(poll.answers, function (index, answer) {
            total += answer.count;
          });

          // total count
          $.each(poll.answers, function (index, answer) {
            answer.percent = Math.round((answer.count / total) * 100);
            answers.push(answer);
          });

          // make poll from HBS template
          $slide.find('.gallery-poll').html(jst['photos/poll']({
            title: poll.title,
            answers: answers,
            total: total
          }));

          // click binding for poll answers
          var $answer = $slide.find('.poll-answer');

          // poll answer click binding
          $answer.one('click', function () {
            $(this).addClass('active');
            $slide.find('.percent').show();
            $answer.off('click');

            mw.post('/api/v1/polls/' + $slide.data('related-poll-guid'), {
              VoteId: $(this).data('id')
            }).done(function (response) {
              // populate total with new total from response
              var newCount = 0;
              $.each(response.item.answers, function (index, answer) {
                newCount += answer.count;
              });
              $slide.find('.poll-count span').html(newCount);
              $slide.find('.poll-count').show();
            });

            if (enableFunctional) {
              s.linkTrackVars = 'prop41,eVar41';
              s.prop41 = s.eVar41 = $slide.find('.poll-title').text();
              s.tl(true, 'o', 'Gallery Poll Click');
              s.clearVars();
              s.prop41 = s.eVar41 = '';
            }
          });

          // fix prev/next buttons
          updateButtons($slide);
        });
      }

      // for each slide, we need to lazy load image and init zoom
      function makeSlide($slide, willUpdateCount) {
        // update count
        if (willUpdateCount === true) {
          updateCount($slide);
        }

        // don't need to make slide if already made
        var $img = $slide.find('img');
        if ($img.attr('src')) {
          if (typeof GUMGUM !== 'undefined') {
            return GUMGUM.createInElement($slide[0], $img.attr('src'));
          } else {
            return;
          }
        }

        // lazy load slide, init zoom, unhide
        var imgSrc = $img.data('src');
        $img.attr('src', imgSrc);
        $img.pinchzoomer({
          imageOptions: {
            scaleMode: 'full',
            preloaderUrl: ASSETS_BASEURL + 'img/general/preloader.gif'
          }
        });
        $img.removeClass('hidden');

        if (typeof GUMGUM !== 'undefined') {
          // create GG full width ad
          GUMGUM.createInElement($slide[0], imgSrc);
        }

        // make poll
        if ($slide.data('related-poll-guid')) {
          makePoll($slide);
        } else if ($slide.data('legacy-poll-code')) {
          // make legacy poll
          $slide.find('.gallery-poll').html($slide.data('legacy-poll-code'));
        }

        var currentIndex = $slide.data('index');
        var pz = PinchZoomer.get('slide_' + currentIndex);

        // fire Omniture prop on zoom-in
        // this will execute when the user presses the plus button
        if (enableFunctional) {
          $slide.find('.zoomInOn').on('click', function () {
            s.linkTrackVars = 'prop46,eVar46';
            s.prop46 = s.eVar46 = 'gallery-zoom';
            s.tl(true, 'o', 'gallery-zoom');
            s.clearVars();
            s.prop46 = s.eVar46 = '';

            $('.slick-next, .slick-prev').hide();
          });
        }

        // this will execute when the user presses the minus button
        $slide.find('.zoomOutOff').on('click', function () {
          if (pz.zoom() <= 1) {
            // only show the slick carousel if fully zoomed out
            $('.slick-next, .slick-prev').show();
          }
        });

        // update twitter card meta tags
        updateTwitterCard($slide);
      }

      function updateTwitterCard($slide) {
        var $metaImg = $('meta[name="twitter:image"]');
        var $metaDesc = $('meta[name="twitter:description"]');
        var img = $slide.data('ggsrc');
        var caption = $slide.data('caption');

        if (caption === '') {
          caption = $metaDesc.attr('content');
        }

        //update tags
        $metaImg.attr('content', img);
        $metaDesc.attr('content', caption);
      }

      function updateButtons($slide) {
        if ($slide.data('related-poll-guid')) {
          // need to trim bottom of nav buttons to allow clicks on polls
          var pollHeight = $slide.find('.gallery-poll').height();
          $('.slick-prev').css('height', prevHeight - pollHeight + 'px');
          $('.slick-next-bottom').css({
            height: nextHeight - pollHeight + 'px',
            bottom: pollHeight + 'px'
          });
        } else if ($slide.data('legacy-poll-code')) {
          // need to trim bottom of nav buttons to allow clicks on polls
          var pollHeight = $slide.find('.gallery-poll iframe').height();
          $('.slick-prev').css('height', prevHeight - pollHeight + 'px');
          $('.slick-next-bottom').css({
            height: nextHeight - pollHeight + 'px',
            bottom: pollHeight + 'px'
          });
        } else {
          // reset buttons CSS
          $('.slick-prev, .slick-next-bottom').css({
            height: '',
            bottom: ''
          });
        }
      }

      // update URL on slides
      function updateUrl($slide) {
        var url = galleryJson.RecordLink;

        if ($slide.hasClass('gallery-fork-slide') || $slide.hasClass('gallery-ad-slide')) {
          url = url + 'images/' + $slides.eq(0).data('slug');
        } else {
          url = url + 'images/' + $slide.data('slug');
        }

        window.history.replaceState({}, '', url);
      }

      // update count on slides
      function updateCount($slide) {
        // set current
        $currentCount.html($slide.data('index') + 1);

        // set total
        $totalCount.html($slide.data('galleryLength'));
      }

      // grey out prev/next arrows on first/last slide
      function updateGalleryArrows($slide, length) {
        $prev.add($next).removeClass('inactive');

        var index = $slide.data('slick-index');

        if (index === 0) {
          $prev.addClass('inactive');
        }

        if (index === (length - 1)) {
          $next.addClass('inactive');
        }
      }

      function resolveNewGallery() {
        var nextSlideIndex = $('.gallery-slide').length;
        buildSlides($('.slick-track'));
        makeSlide($slides.eq(nextSlideIndex), true);
        $recentGallery = $('.recent-gallery');
      }

      function fillRelatedWithRecentGalleries(numRecords) {
        mw.get('/api/v1/gallerycollections/featuredgalleries?page=1&numRecords=' + numRecords + '&fields=images,galleries,categories').done(function (response) {
          if (typeof relatedGalleries === 'undefined') {
            relatedGalleries = [];
          }
          response.items.forEach(function (gallery) {
            // put mw result into expected format for formatRelatedGalleries
            gallery.assets.primaryImage = [{
              'thumbnailUrls': {
                '400x300': getMWImage(gallery.assets.images[0].thumbnailUrls)
              }
            }];

            relatedGalleries.push(gallery);
          });
          relatedGalleries.forEach(function (gallery) {
            gallery.RecordLink = window.location.origin + '/photos/' + gallery.slug;
          });

          formatRelatedGalleries();
          resolveNewGallery();
        });
      }

      // adjust arrow appearance and behavior according to position in lightbox
      function updateLightboxArrows($slide, length, currentSlide) {
        $prevLabel.add($nextLabel).add($replay).addClass('hidden');
        $count.removeClass('hidden');
        $('.slick-prev').add('.slick-next-bottom').show();

        if ($slide.hasClass('gallery-fork-slide')) {
          // you are on a fork card, hide count, show replay button, and set replay index
          $count.addClass('hidden');
          $prevLabel.add($nextLabel).add($replay).removeClass('hidden');
          $('.slick-prev').add('.slick-next-bottom').hide();

          var currentGalleryLength = $slide.data('gallery-length');

          replayIndex = $slide.data('slick-index') - currentGalleryLength - Math.floor((currentGalleryLength - 1) / 5);
        }

        var index = $slide.data('slick-index');

        if (index === 1 && currentSlide === 0) {
          // you just moved from the first to the second slide - pulse in previous arrow
          $prev.animateCss('pulse', '0.5s').removeClass('hidden');
        }

        if (index === 0 && currentSlide === 1) {
          // you just moved from the second to the first slide - pulse out previous arrow
          $prev.animateCss(
              'pulse',
              '0.5s',
              'reverse',
              function () {
                $prev.addClass('hidden');
              }
          );
        }

        if (index === (length - 1)) {
          // you are on the end card - currently only working for default view

          var lastChar = mwSlug.substring(mwSlug.length - 1);

          if (lastChar === '/') {
            mwSlug = mwSlug.substring(0, mwSlug.length - 1);
          }

          mw.get('/api/v1/galleries/slug/' + mwSlug + '?fields=images,galleries,categories').done(function (response) {
            var gallery = response.item;
            galleryJson = {}; // won't be needing this anymore, best to remove
            adZone = 'noads';
            slideIndex -= galleryLength;
            gallerySlug = gallery.slug;
            galleryDescription = null;
            galleryLength = imagesLeft = gallery.assets.images.length;
            galleryTitle = gallery.title;

            // turn array of categories into comma separated string
            if (typeof gallery.assets.categories !== 'undefined') {
              relatedCategories = gallery.assets.categories[0].slug;
              for (var i = 1; i < gallery.assets.categories.length; i++) {
                relatedCategories += ', ' + gallery.assets.categories[i].slug
              }
            } else {
              relatedCategories = '';
            }

            var caption;
            var originalImage;
            galleryImages = [];
            gallery.assets.images.forEach(function (image) {
              caption = (image.contentParsed !== null) ? image.contentParsed.content : '';
              originalImage = (typeof image.thumbnailUrls.original !== 'undefined') ? image.thumbnailUrls.original : image.thumbnailUrls['1024x768'];
              galleryImages.push({
                'Slug': image.slug,
                'original-image': originalImage,
                'photo-credit-text-current': gallery.additionalProperties.photoCredit,
                'caption': caption,
                'related-poll-guid': image.relatedItemReferences.polls,
                'legacy-poll-code': ''
              });
            });

            relatedGalleries = gallery.assets.galleries;

            // check to see if related galleries needs to be filled with recent galleries
            if (typeof relatedGalleries === 'undefined') {
              fillRelatedWithRecentGalleries(4);
            } else if (relatedGalleries.length < 4) {
              fillRelatedWithRecentGalleries(4 - relatedGalleries.length);
            } else {
              relatedGalleries.forEach(function (gallery) {
                gallery.RecordLink = window.location.origin + '/photos/' + gallery.slug;
              });

              formatRelatedGalleries();
              resolveNewGallery();
            }
          });
        }
      }

      // show credit if there is one, otherwise hide
      function updateCredit($slide) {
        if ($slide.data('credit')) {
          $credit.find('span').html($slide.data('credit'));
          $credit.show().removeClass('hidden');
        } else {
          $credit.hide().removeClass('hidden');
        }
      }

      // Omniture bindings

      // replay button click
      $replay.on('click', function () {
        if (enableFunctional) {
          s.linkTrackVars = 'prop46,eVar46';
          s.prop46 = s.eVar46 = 'photo-replay';
          s.tl(true, 'o', 'photo-replay');
          s.clearVars();
          s.prop46 = s.eVar46 = '';
        }
        $gallery.slick('slickGoTo', replayIndex);
      });

      // arrow clicks
      if (enableFunctional) {
        $arrows.on('click', function () {
          s.prop46 = s.eVar46 = 'photo-arrow-clicks';
        });


        // clicks on left/right of image
        //var $slickArrows = $('.slick-arrow');
        $('.slick-arrow').on('click', function () {
          s.prop46 = s.eVar46 = 'photo-image-clicks';
        });


        $related.on('click', function () {
          s.linkTrackVars = 'prop46,eVar46,prop28,eVar28';
          s.prop46 = s.eVar46 = 'related-gallery';
          s.prop28 = s.eVar28 = 'relatedgallery-' + $(this).find('.recent-gallery-title').html();
          s.tl(true, 'o', 'related-gallery');
          s.clearVars();
          s.prop46 = s.eVar46 = '';
          s.prop28 = s.eVar28 = '';
        });

        $nextGallery.on('click', function () {
          s.linkTrackVars = 'prop46,eVar46';
          s.prop46 = s.eVar46 = 'featured-related-gallery';
          s.tl(true, 'o', 'featured-related-gallery');
          s.clearVars();
          s.prop46 = s.eVar46 = '';
        });
      }
      function trackSlide($slide, type) {
        if (enableFunctional) {
          // track slide
          s.events = 'event6';
          s.pageName = 'Photos - ' + galleryTitle;

          // slide tracking
          s.prop5 = s.eVar5 = 'Photos - Gallery - ' + type;

          // gallery depth tracking
          s.prop47 = s.eVar47 = $slide.data('slick-index') + 1;

          // set timeout if not initial load as we need to capture arrow/nav clicks
          if (initialLoad) {
            // omniture is already being called initially in the template file.
            initialLoad = false;

            // firing a slimmed down version of prop5, eVar5, prop47, eVar47, prop50, prop1, eVar1
            s.linkTrackVars = 'prop5,eVar5,prop47,eVar47,prop50,prop1,eVar1';
            s.tl(true, 'o', 'initial-load-photo-gallery');
            s.clearVars();
            s.prop5 = s.eVar5 = s.prop47 = s.eVar47 = "";

          } else {
            window.setTimeout(function () {
              s.t();
            }, 100);

            // fire comscore data only when its not the intial load, otherwise it will get double counted
            var comscoreConfig = {
              c1: "2", c2: "3000013"
            };

            if (isSports) {
              comscoreConfig.options = {
                url_append: 'comscorekw=sports'
              };
            }

            // check our consents and if true, send to comscore
            var comScoreConsent = enableFunctional ? 1 : 0;

            if (gdprCountries.includes(VIEWER_COUNTRY)) {
              comscoreConfig.cs_ucfr = comScoreConsent;
            }

            $.get('/comscore.txt?bust=' + (new Date()).getTime());
            COMSCORE.beacon(comscoreConfig);
          }
        }
      }

      function makeAd() {
        googletag.cmd.push(function () {
          wbgpt.createSlot(WB_PAGE.wbgpt_ad_unit_path, [[300, 250], 'fluid'], 'wbgpt-gallery')
              .setTargeting('pos', 'inpost,bottom')
              .setTargeting('tile', WB_PAGE.wbgpt_tile);
          WB_PAGE.wbgpt_tile += 1;
        });
      }

      function getInnerGalleryGptSlots() {
        var gptSlots = [];
        gptSlots.push(wbgpt.getSlotById('wbgpt-gallery').getGptSlot());
        return gptSlots;
      }

      function getOuterGalleryGptSlots() {
        var gptSlots = [];
        wbgpt.getSlotById('wbgpt-1') && gptSlots.push(wbgpt.getSlotById('wbgpt-1').getGptSlot());
        wbgpt.getSlotById('wbgpt-3') && gptSlots.push(wbgpt.getSlotById('wbgpt-3').getGptSlot());
        wbgpt.getSlotById('wbgpt-promotion-1') && gptSlots.push(wbgpt.getSlotById('wbgpt-promotion-1').getGptSlot());
        return gptSlots;
      }

      function clearSlotVendorTargeting(innerGallery) {
        var gptSlots = [];
        if (innerGallery) {
          gptSlots = getInnerGalleryGptSlots();
        }
        else {
          gptSlots = getOuterGalleryGptSlots();
        }
        gptSlots.forEach(function (slot) {
          slot.getTargetingKeys().forEach(function (key) {
            // remove all but our own targeting keys
            if (key !== 'pos' && key !== 'tile') {
              slot.clearTargeting(key);
            }
          });
        });
      }


      function loadInnerGalleryOxSlots() {
        window.OX_dfp_ads.push([WB_PAGE.wbgpt_ad_unit_path, [[300, 250], 'fluid'], 'wbgpt-gallery']);
      }

      function loadOuterGalleryOxSlots() {
        wbgpt.getSlotById('wbgpt-1') && window.OX_dfp_ads.push([WB_PAGE.wbgpt_ad_unit_path, [[300, 250], 'fluid'], 'wbgpt-1']);
        wbgpt.getSlotById('wbgpt-3') && window.OX_dfp_ads.push([WB_PAGE.wbgpt_ad_unit_path, [[300, 250], 'fluid'], 'wbgpt-3']);
        wbgpt.getSlotById('wbgpt-promotion-1') && window.OX_dfp_ads.push([WB_PAGE.wbgpt_ad_unit_path, [[728, 90]], 'wbgpt-promotion-1']);
      }

      function loadInnerGalleryAmazonSlots() {
        var apstagSlots = [];
        apstagSlots.push({
          slotID: 'wbgpt-gallery',
          sizes: [[300, 250], 'fluid']
        });
        window.apstagSlots = apstagSlots;
      }

      function loadOuterGalleryAmazonSlots() {
        var apstagSlots = [];
        wbgpt.getSlotById('wbgpt-1') && apstagSlots.push({
          slotID: 'wbgpt-1',
          sizes: [[300, 250], 'fluid']
        });
        wbgpt.getSlotById('wbgpt-3') && apstagSlots.push({
          slotID: 'wbgpt-3',
          sizes: [[300, 250], 'fluid']
        });
        wbgpt.getSlotById('wbgpt-promotion-1') && apstagSlots.push({
          slotID: 'wbgpt-promotion-1',
          sizes: [[728, 90]]
        });
        window.apstagSlots = apstagSlots;
      }


      function loadAllAmazonSlots() {
        var apstagSlots = [];
        apstagSlots.push({
          slotID: 'wbgpt-gallery',
          sizes: [[300, 250], 'fluid']
        });
        wbgpt.getSlotById('wbgpt-1') && apstagSlots.push({
          slotID: 'wbgpt-1',
          sizes: [[300, 250], 'fluid']
        });
        wbgpt.getSlotById('wbgpt-3') && apstagSlots.push({
          slotID: 'wbgpt-3',
          sizes: [[300, 250], 'fluid']
        });
        wbgpt.getSlotById('wbgpt-promotion-1') && apstagSlots.push({
          slotID: 'wbgpt-promotion-1',
          sizes: [[728, 90]]
        });
        window.apstagSlots = apstagSlots;
      }

      function fetchAllAdBids() {
        if (typeof window.OX_dfp_ads === 'undefined') {
          window.OX_dfp_ads = [];
        }
        loadInnerGalleryOxSlots();
        loadOuterGalleryOxSlots();
        submitOpenXSlots();

        loadAllAmazonSlots();
        submitAmazonSlots();

        innerGalleryAdBidsAreFetched = true;
        outerGalleryAdBidsAreFetched = true;
      }

      function fetchInnerGalleryAdBids() {
        if (typeof window.OX_dfp_ads === 'undefined') {
          window.OX_dfp_ads = [];
        }
        loadInnerGalleryOxSlots();
        submitOpenXSlots();

        loadInnerGalleryAmazonSlots();
        submitAmazonSlots();

        innerGalleryAdBidsAreFetched = true;
      }


      function fetchOuterGalleryAdBids() {
        if (typeof window.OX_dfp_ads === 'undefined') {
          window.OX_dfp_ads = [];
        }
        loadOuterGalleryOxSlots();
        submitOpenXSlots();

        loadOuterGalleryAmazonSlots();
        submitAmazonSlots();

        outerGalleryAdBidsAreFetched = true;
      }


      function clearSlotVendorTargetingAndFetchBids(inGallery) {
        if (!innerGalleryAdBidsAreFetched && inGallery) {
          clearSlotVendorTargeting(inGallery);
          fetchInnerGalleryAdBids();
        }
        if (!outerGalleryAdBidsAreFetched && !inGallery) {
          clearSlotVendorTargeting(inGallery);
          fetchOuterGalleryAdBids();
        }
      }

      function insertAndDisplayAd(slickIndex) {
        var $adSlide = $('div[data-slick-index=' + slickIndex + ']');
        if (isLightbox && $adSlide.hasClass('gallery-fork-slide')) {
          return;
        }
        if (innerGalleryAdBidsAreFetched) {
          if ($adSlot !== null) {
            // the ad has already been inserted, just need to move the node and refresh the slot
            $adSlot.detach().appendTo($($adSlide.find('.gallery-ad-container')[0]));
          } else {
            // the ad doesn't exist yet, need to insert, cache object, and display
            $($adSlide.find('.gallery-ad-container')[0]).html('<div id="wbgpt-gallery"></div>');
            $adSlot = $('#wbgpt-gallery');
          }
          googletag.pubads().refresh(getInnerGalleryGptSlots());
          innerGalleryAdBidsAreFetched = false;
        }
      }


      // change event
      $gallery.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

        var periodifyStatus = periodify.getCurrentStatus();
        var $currentSlide = $slides.eq(currentSlide);

        // make sure image nav is visible
        $('.slick-next, .slick-prev').show();

        // zoom out
        if (!initialLoad && $currentSlide.data('index') > -1) {
          var currentIndex = $currentSlide.data('index');
          var pz = PinchZoomer.get('slide_' + currentIndex);
          pz.zoom(1, 0);
        }

        var $nextSlide = $slides.eq(nextSlide);

        // update stuff
        updateUrl($nextSlide);
        updateCredit($nextSlide);
        updateCaption($nextSlide.data('caption'), galleryDescription, $readMore, $caption, $ad, $galleryCaption);
        if (isLightbox) {
          updateLightboxArrows($nextSlide, slideLength, currentSlide);
        } else {
          updateGalleryArrows($nextSlide, slideLength);
        }
        $title.html($nextSlide.data('galleryTitle'));

        //if gallery has no ads, don't build ads!
        if (adZone !== 'noads') {
          if (initialLoad) {
            makeAd();
            fetchAllAdBids();
          } else if ($nextSlide.hasClass('gallery-ad-slide')) {
            // you will soon be on an ad slide, time to display
            insertAndDisplayAd(nextSlide);
          } else if (nextSlide > currentSlide) {
            // you are moving forward
            if ($nextSlide.prev().prev().hasClass('gallery-ad-slide')) {
              // you will soon be two away from an ad slide, time to clear and re-fetch
              clearSlotVendorTargetingAndFetchBids(true);
            }
          } else {
            // you are moving backward
            if ($nextSlide.next().next().hasClass('gallery-ad-slide')) {
              // you will soon be two away from an ad slide, time to clear and re-fetch
              clearSlotVendorTargetingAndFetchBids(true);
            }
          }
        }

        try {
          periodifyStatus.isInitial && fetchOuterGalleryAdBids();
          if (outerGalleryAdBidsAreFetched && periodifyStatus.value === REFRESH) {
            googletag.pubads().refresh(getOuterGalleryGptSlots());
            outerGalleryAdBidsAreFetched = false;
            clearSlotVendorTargetingAndFetchBids(false);
            logger.debug('SUCCESS: Refreshed outer gallery ad slots.');
          }
        }
        catch (e) {
          logger.debug('ERROR: ' + (e.message || 'An error occurred.'));
        }

        // check if side ad is hidden
        if (!$ad.is(':visible')) {
          $ad.show();
        }

        var slideType;

        // perform actions based on slide type
        if ($nextSlide.hasClass('gallery-ad-slide')) {
          // ad behavior
          slideType = 'Ad';
          $gallery.add('.gallery-left').addClass('ad-active').removeClass('fork-active');
          updateCount($slides.eq(nextSlide - 1));
        } else if ($nextSlide.hasClass('gallery-fork-slide')) {
          // fork behavior
          slideType = 'Fork';
          $gallery.add('.gallery-left').addClass('fork-active').removeClass('ad-active');

          if ($nextSlide.hasClass('gallery-end-slide')) {
            slideType = 'End Card';
            if (!isLightbox) {
              $('.slick-next, .slick-prev').hide();
            }
          }
        } else {
          // slide behavior
          slideType = 'Photo';
          makeSlide($nextSlide, true);

          $gallery.add('.gallery-left').removeClass('fork-active ad-active');

          // trim buttons if there is poll
          updateButtons($nextSlide);
        }

        // preload an additional slide (when possible) for seamless transitions
        var $slideAfterNext = $nextSlide.next();
        if ($slideAfterNext.length > 0 && !$slideAfterNext.hasClass('gallery-ad-slide') && !$slideAfterNext.hasClass('gallery-fork-slide')) {
          makeSlide($slideAfterNext, false);
        }

        if ($nextSlide.hasClass('gallery-fork-slide')) {
          resizeEndCardElements();
          $(window).on('resize', resizeEndCardElements);
        } else {
          $(window).off('resize', resizeEndCardElements);
        }

        trackSlide($nextSlide, slideType);
      });

      // bind previous
      $prev.add($prevLabel).on('click', function () {
        if ($(this).hasClass('inactive')) {
          return;
        }

        $gallery.slick('slickPrev');
      });

      // bind next
      $next.add($nextLabel).on('click', function () {
        if ($(this).hasClass('inactive')) {

          if(enableFunctional) {
            // omniture tracking
            s.linkTrackVars = 'prop46,eVar46';
            s.prop46 = s.eVar46 = 'gallery-next-arrow';
            s.tl(true, 'o', 'gallery-next-arrow');
            s.clearVars();
            s.prop46 = s.eVar46 = '';
          }

          window.location.href = nextGallery.link;
        }

        $gallery.slick('slickNext');
      });

      // handles deep linking
      $.each($slides, function (index, value) {
        if (window.location.href.indexOf($(this).data('slug')) > -1) {
          slickIndex = $(this).data('slick-index');
        }
      });

      // go to appropriate slide on initial load
      $gallery.slick('slickGoTo', slickIndex, true);

      // share functionality
      $share.on('click', function () {
        s.events = 'event5';

        if ($(this).hasClass('facebook')) {
          if(enableFunctional) {
            s.linkTrackVars = 'prop13,eVar13';
            s.prop13 = s.eVar13 = 'facebook';
            s.tl(true, 'o', 'facebook');
            s.clearVars();
            s.prop13 = s.eVar13 = '';
          }

          var url = 'http://www.facebook.com/sharer.php?u=' + window.location.href;
          window.open(url, "_blank", "status=0,width=575,height=450");
        } else if ($(this).hasClass('twitter')) {
          if(enableFunctional) {
            s.linkTrackVars = 'prop13,eVar13';
            s.prop13 = s.eVar13 = 'twitter';
            s.tl(true, 'o', 'twitter');
            s.clearVars();
            s.prop13 = s.eVar13 = '';
          }

          var twitterTitle = encodeURIComponent($title.html());
          var currentUrl = encodeURIComponent(window.location.href);
          var url = 'https://twitter.com/intent/tweet?url=' + currentUrl + '&text=' + twitterTitle + '&via=TMZ&related=HarveyLevinTMZ';

          window.open(url, '_blank', 'status=0,width=575,height=450');
        } else if ($(this).hasClass('email')) {
          if(enableFunctional) {
            s.linkTrackVars = 'prop13,eVar13';
            s.prop13 = s.eVar13 = 'email';
            s.tl(true, 'o', 'email');
            s.clearVars();
            s.prop13 = s.eVar13 = '';
          }

          var title = encodeURIComponent($title.html());
          window.top.location.href = 'mailto:?subject=' + title + '&body=' + window.location.href;
        }
      });

      // set min-height to allow for flexible titles
      //var galleryHeight = $galleryRight.height() + 270;
      $slides.add('.gallery-inner').css('min-height', ($galleryRight.height() + 270) + 'px');

      // key bindings
      $(document).keydown(function (e) {
        switch (e.which) {
          case 37: // left
            $prev.click();
            break;

          case 39: // right
            $next.click();
            break;

          default:
            return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
      });

    }
  };
});
