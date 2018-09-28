function gsaSearch(searchForm) {
    return elasticSearch(searchForm);
}
function elasticSearch(searchForm) {
    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
var querystring = searchForm.elements[0].value;
if (querystring == "") { return false; }

    var queryval = querystring.trim();
    var searchUrl = searchForm.action + queryval.replace(/%2F/g, "").replace(/%/g, "%25");

    var adid = "?adid=TMZ_Web_Nav_Search";
    if (searchForm.target == '_blank') {
        window.open(searchUrl+adid, '_blank', '');
    } else {
        window.location.href = searchUrl+adid;
    }
    return false;
}

$(document).ready(function() {
    var $search = $('nav .search');
    var $form = $search.find('form');
    var $input = $search.find('input');
    var $label = $search.find('label');
    var $body = $('body');
    var $mastheadWrap = $('#masthead-wrap');
    var isMousedown = false;
    var scrollTop = 0;
    var isTouchDevice = 'ontouchstart' in document.documentElement;

    $label.on('mousedown', function() {
        isMousedown = true;
        if($form.hasClass('active')) {
            $form.submit();
        }
    });

    $label.on('click', function(e) {
        $input.focus();
        isMousedown = false;
    });

    $input.on('focus', function() {
        $search.addClass('expanded');
        $form.addClass('active');
        if(isTouchDevice){
            $input.click();
        }
    });

    $input.on('blur', function() { 
        if(!isMousedown) {
            $search.removeClass('expanded');
            $form.removeClass('active');
            $body.removeClass('fixfixed');
            $mastheadWrap.css('top', '0px');
        } else {
            $input.focus();
        }
    });

    $label.on('touchstart', function() {
        if($mastheadWrap.hasClass('is-sticky')) {
            $body.addClass('fixfixed');
            $mastheadWrap.css('top', $(window).scrollTop() + 'px');
            $(window).on('scroll', function(){
                if($body.hasClass('fixfixed')) {
                    $mastheadWrap.css('top', $(window).scrollTop() + 'px');
                }
            });
        }
        $label.click();
    });

});


