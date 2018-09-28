var is_aol = navigator.userAgent.toLowerCase().indexOf("aol") != -1;
var is_mac = navigator.userAgent.indexOf('Mac') != -1;
var is_ipad = navigator.userAgent.match(/iPad/i) != null;
var lightbox = null;

function tmzLightbox(url, options) {
  lightbox = new TmzLightbox(url, options || {});
  lightbox.show();
  return lightbox;
}

function destroyTmzLightbox(slug) {
  if (lightbox !== null) {
    lightbox.destroy();
    lightbox = null;

    if (typeof slug === 'string') {
      setTimeout(function() {
        tmzPhotosLightbox(slug);
      }, 800);
    }
  }
}

function tmzPhotosLightbox(slug, options) {
  var url = "/lightbox/photos/" + slug;

  setTimeout(function () {
    var photosLightboxFrame = $('.photos-lightbox iframe')[0];
    if (typeof photosLightboxFrame !== 'undefined') {
      photosLightboxFrame.contentWindow.focus();
    }
  }, 250);

  return tmzLightbox(url, $.extend({
    fixedHeight: null,
    where: $('<div class="photos-lightbox"></div>').appendTo('body'),
  }, options || {}));
}

function tmzVideosLightbox(slug, options) {
  slug = slug.replace(/^(.)-/, "$1_"); //CRZ: handle slugs from CF that have dashes instead of kaltura underscores
  if (is_ipad) {
    document.location = "/videos/" + slug;
    return;
  }
  return tmzLightbox("/lightbox/videos/" + slug, $.extend({initialHeight: 550}, options || {}));
}


//CRZ: ### depends highly on format of urls defined in CF, need a js-routes lib
$('a.lightbox-link').live('click', function (e) {
  var f;
  var link = $.url($(this).attr('href'));

  switch (link.segment(1)) {
    case 'photos':
      f = tmzPhotosLightbox;
      break;
    case 'videos':
      f = tmzVideosLightbox;
      break;
  }

  if (f) {
    e.preventDefault();
    f.call(window, link.segment().slice(1).join('/') + (link.attr('query') ? ('?' + link.attr('query')) : "") + (link.attr('fragment') ? ("#" + link.attr('fragment')) : ""));
    return false;
  } else {
    return true;
  }
});


