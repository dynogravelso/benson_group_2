function WBConsent () {}

WBConsent.serialize = function(obj) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
};

WBConsent.getQueryString = function(url) {
    var vars = [];

    // Get the start index of the query string
    var qsi = url.indexOf('?');
    if (qsi === -1)
        return vars;

    // Get the query string
    var qs = url.slice(qsi + 1);

    // Check if there is a subsection reference
    var sri = qs.indexOf('#');
    if (sri >= 0)
        qs = qs.slice(0, sri);

    // Build the associative array
    var hashes = qs.split('&');
    for (var i = 0; i < hashes.length; i++) {
        var sep = hashes[i].indexOf('=');
        if (sep <= 0)
            continue;
        var key = decodeURIComponent(hashes[i].slice(0, sep));
        var val = decodeURIComponent(hashes[i].slice(sep + 1));
        vars[key] = val;
    }

    return vars;
};

WBConsent.getDestUrl = function(srcUrl, arrParams) {
    var protocol = 'http:';
    if(window.location.protocol.toLowerCase() === 'https:') {
        protocol = window.location.protocol;
    }
    var baseUrl = protocol + '//consent.truste.com/notice';
    var arrDefaults = {
        'js': 'bb',
        'noticeType': 'bb',
        'gtm': 1,
        'c': 'teconsent'
    };
    var country = arrParams['country'], language = arrParams['language'], detectLang = arrParams['detectLang'];

    arrDefaults['domain'] = arrParams['domain'] ? arrParams['domain'] : window.location.hostname;

    WBConsent.merge(arrDefaults, arrParams);

    //populates language with locale
    if(!language && detectLang === 1) {
        var locale = window.navigator.userLanguage || window.navigator.language;
        var arrSplit = locale.split('-');
        language = arrSplit[0];
    }
    if(country) {
        arrDefaults['country'] = country;
    }
    if(language) {
        arrDefaults['language'] = language ? language : '';
        if(country) {
            // arrDefaults['language'] = language + '_' + country;
			// Updated Code for Norway as TrustArc does not support nb_NO Locale. Only nb Locale is added in TrustArc so added the logic.
        	arrDefaults['language'] = (country === 'no' ) ? 'nb': language + '_' + country;
        }
    }

    if(!arrParams['privacypolicylink']) {
        var link = WBConsent.getPrivacyPolicyLink(arrDefaults['language']);
        if(link) {
            arrDefaults['privacypolicylink'] = link;
        }
    }

    return baseUrl + '?' + WBConsent.serialize(arrDefaults);
};

WBConsent.getPrivacyPolicyLink = function(locale) {
    var arrLinks = {
        'da_dk': 'https://policies.warnerbros.com/privacy/da-dk',
        'de_de': 'https://policies.warnerbros.com/privacy/de-de',
        'en_au': 'https://policies.warnerbros.com/privacy/en-au',
        'en_ca': 'https://policies.warnerbros.com/privacy/en-ca',
        'en_gb': 'https://policies.warnerbros.com/privacy/en-gb',
        'en_in': 'https://policies.warnerbros.com/privacy/en-in',
        'en_sg': 'https://policies.warnerbros.com/privacy/en-sg',
        'en_us': 'https://policies.warnerbros.com/privacy/en-us',
        'es_ar': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_bo': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_cl': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_co': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_cr': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_ec': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_es': 'https://policies.warnerbros.com/privacy/es-es',
        'es_gt': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_hn': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_mx': 'https://policies.warnerbros.com/privacy/es-mx',
        'es_ni': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_pa': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_pe': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_pr': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_py': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_sv': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_uy': 'https://policies.warnerbros.com/privacy/es-latam',
        'es_ve': 'https://policies.warnerbros.com/privacy/es-latam',
        'fi_fi': 'https://policies.warnerbros.com/privacy/fi-fi',
        'fr_be': 'https://policies.warnerbros.com/privacy/fr-be',
        'fr_ca': 'https://policies.warnerbros.com/privacy/fr-ca',
        'fr_fr': 'https://policies.warnerbros.com/privacy/fr-fr',
        'it_it': 'https://policies.warnerbros.com/privacy/it-it',
        'ja_jp': 'https://policies.warnerbros.com/privacy/ja-jp',
        'ko_kr': 'https://policies.warnerbros.com/privacy/ko-kr',
        'nb_no': 'https://policies.warnerbros.com/privacy/nb-no',
        'nl_be': 'https://policies.warnerbros.com/privacy/nl-be',
        'nl_nl': 'https://policies.warnerbros.com/privacy/nl-nl',
        'pl_pl': 'https://policies.warnerbros.com/privacy/pl-pl',
        'pt_br': 'https://policies.warnerbros.com/privacy/pt-br',
        'ru_ru': 'https://policies.warnerbros.com/privacy/ru-ru',
        'sv_se': 'https://policies.warnerbros.com/privacy/sv-se',
        'th_th': 'https://policies.warnerbros.com/privacy/th-th',
        'tr_tr': 'https://policies.warnerbros.com/privacy/tr-tr',
        'zh_cn': 'https://policies.warnerbros.com/privacy/zh-cn',
        'zh_hk': 'https://policies.warnerbros.com/privacy/zh-hk'
    };

    locale = arrLinks.hasOwnProperty(locale) ? locale : 'en_gb';
    return arrLinks[locale];
};

/**
 * merge
 *
 * overwrite A's values with B's
 *
 * @return void
 */
WBConsent.merge = function(a, b) {
    for(var idx in b) {
        if (b.hasOwnProperty(idx)) {
            a[idx] = b[idx];
        }
    }
};

WBConsent.injectHTML = function() {
    var scripts = document.getElementsByTagName('script');
    //Current file will always be the last file loaded

    var wbScript;
    for(var i = 0; i<scripts.length; i++) {
        if(scripts[i].src.indexOf('wbconsent') > -1) {
            wbScript = scripts[i];
        }
    }

    var arrParams = WBConsent.getQueryString(wbScript.src);
    var destUrl = WBConsent.getDestUrl(wbScript.src, arrParams);

    var target = document.getElementById("wb_consent");
    if(target) {
        var s = document.createElement('script');
        s.setAttribute('src', destUrl);
        document.head.appendChild(s);

        var blackbar = document.createElement("div");
        blackbar.id = "consent_blackbar";
        var teconsent = document.createElement("div");
        teconsent.id = "teconsent";
        teconsent.style.display = "none";
        target.appendChild(blackbar);
        target.appendChild(teconsent);
    }
};

if (window.addEventListener) { // W3C standard
    window.addEventListener('load', function(){ WBConsent.injectHTML(); }, false);
} else if (window.attachEvent) { // Microsoft
    window.attachEvent('onload', function(){ WBConsent.injectHTML(); });
}
