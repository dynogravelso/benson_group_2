
if(typeof Object.create!=='function'){Object.create=function(o){var F=function(){};F.prototype=o;return new F();};}
function returnText(string){var txt=document.createElement("textarea");txt.innerHTML=string;return txt.value;}
function revealLightboxIframe(){$('.frame > iframe').css('visibility','inherit');}
if(typeof $.fn.animateCss==='undefined'){$.fn.extend({animateCss:function(name,speed,direction,callback){speed=' animated-'+speed;direction=typeof direction==='string'?' animated-'+direction:'';var animationEnd='webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';this.addClass('animated '+name+speed+direction).one(animationEnd,function(){$(this).removeClass('animated '+name+speed+direction);if(typeof callback==='function'){callback();}});return this;}});}
let scrollRestorationOnLoad=false;(function(){if(performance.navigation.type===1&&'scrollRestoration'in history&&history.scrollRestoration!=='manual'){scrollRestorationOnLoad=history.scrollRestoration;window.history.scrollRestoration='manual';setTimeout(function(){window.scrollTo(0,0);},500);window.onbeforeunload=function(){window.history.scrollRestoration=scrollRestorationOnLoad;};}
if(performance.navigation.type===2&&window.location.pathname==="/"&&window.sessionStorage&&window.sessionStorage.homepageScroll){scrollRestorationOnLoad=history.scrollRestoration;window.history.scrollRestoration='manual';document.addEventListener("DOMContentLoaded",function(event){setTimeout(function(){$(window).scrollTop(window.sessionStorage.homepageScroll);},500);});}
if(window.location.pathname==="/"&&window.sessionStorage){window.onbeforeunload=function(){window.sessionStorage.homepageScroll=$(window).scrollTop();if(scrollRestorationOnLoad){window.history.scrollRestoration=scrollRestorationOnLoad;}};if(/iPad/i.test(navigator.userAgent)===true){document.addEventListener("click",function(){window.sessionStorage.homepageScroll=$(window).scrollTop();},false);}}})();define('requirecss',['module'],function(module){var loadedFiles={};var baseUrl=module.config().baseUrl||'/';var requirecss=function(){var _this=Object.create({});var flagAsLoaded=function(url){var cacheKey=getCacheKey(url);loadedFiles[cacheKey]=true;};var load=function(url,media){var cacheKey=getCacheKey(url);if(isLoaded(cacheKey)){return;}
var link=document.createElement('link');link.type='text/css';link.rel='stylesheet';link.media=media||'screen';link.href=normalizeURL(url);document.getElementsByTagName('head')[0].appendChild(link);loadedFiles[cacheKey]=true;};var normalizeURL=function(url){if(url.indexOf('http')==0||url.indexOf('//')==0){return url;}
if(url.indexOf('/')==0){return baseUrl+url.substr(1);}
return baseUrl+url;};var getCacheKey=function(url){if(url.indexOf('http')==0||url.indexOf('//')==0){return url;}
if(url.indexOf('/')==0){return url.substr(1);}
return url;};var isLoaded=function(url){return loadedFiles[url]===true?true:false;};_this.flagAsLoaded=flagAsLoaded;_this.load=load;return _this;};return requirecss();});var Handlebars=(function(){var __module3__=(function(){"use strict";var __exports__;function SafeString(string){this.string=string;}
SafeString.prototype.toString=function(){return""+this.string;};__exports__=SafeString;return __exports__;})();var __module2__=(function(__dependency1__){"use strict";var __exports__={};var SafeString=__dependency1__;var escape={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};var badChars=/[&<>"'`]/g;var possible=/[&<>"'`]/;function escapeChar(chr){return escape[chr]||"&amp;";}
function extend(obj,value){for(var key in value){if(value.hasOwnProperty(key)){obj[key]=value[key];}}}
__exports__.extend=extend;var toString=Object.prototype.toString;__exports__.toString=toString;var isFunction=function(value){return typeof value==='function';};if(isFunction(/x/)){isFunction=function(value){return typeof value==='function'&&toString.call(value)==='[object Function]';};}
var isFunction;__exports__.isFunction=isFunction;var isArray=Array.isArray||function(value){return(value&&typeof value==='object')?toString.call(value)==='[object Array]':false;};__exports__.isArray=isArray;function escapeExpression(string){if(string instanceof SafeString){return string.toString();}else if(!string&&string!==0){return"";}
string=""+string;if(!possible.test(string)){return string;}
return string.replace(badChars,escapeChar);}
__exports__.escapeExpression=escapeExpression;function isEmpty(value){if(!value&&value!==0){return true;}else if(isArray(value)&&value.length===0){return true;}else{return false;}}
__exports__.isEmpty=isEmpty;return __exports__;})(__module3__);var __module4__=(function(){"use strict";var __exports__;var errorProps=['description','fileName','lineNumber','message','name','number','stack'];function Exception(){var tmp=Error.prototype.constructor.apply(this,arguments);for(var idx=0;idx<errorProps.length;idx++){this[errorProps[idx]]=tmp[errorProps[idx]];}}
Exception.prototype=new Error();__exports__=Exception;return __exports__;})();var __module1__=(function(__dependency1__,__dependency2__){"use strict";var __exports__={};var Utils=__dependency1__;var Exception=__dependency2__;var VERSION="1.1.2";__exports__.VERSION=VERSION;var COMPILER_REVISION=4;__exports__.COMPILER_REVISION=COMPILER_REVISION;var REVISION_CHANGES={1:'<= 1.0.rc.2',2:'== 1.0.0-rc.3',3:'== 1.0.0-rc.4',4:'>= 1.0.0'};__exports__.REVISION_CHANGES=REVISION_CHANGES;var isArray=Utils.isArray,isFunction=Utils.isFunction,toString=Utils.toString,objectType='[object Object]';function HandlebarsEnvironment(helpers,partials){this.helpers=helpers||{};this.partials=partials||{};registerDefaultHelpers(this);}
__exports__.HandlebarsEnvironment=HandlebarsEnvironment;HandlebarsEnvironment.prototype={constructor:HandlebarsEnvironment,logger:logger,log:log,registerHelper:function(name,fn,inverse){if(toString.call(name)===objectType){if(inverse||fn){throw new Exception('Arg not supported with multiple helpers');}
Utils.extend(this.helpers,name);}else{if(inverse){fn.not=inverse;}
this.helpers[name]=fn;}},registerPartial:function(name,str){if(toString.call(name)===objectType){Utils.extend(this.partials,name);}else{this.partials[name]=str;}}};function registerDefaultHelpers(instance){instance.registerHelper('helperMissing',function(arg){if(arguments.length===2){return undefined;}else{throw new Error("Missing helper: '"+arg+"'");}});instance.registerHelper('blockHelperMissing',function(context,options){var inverse=options.inverse||function(){},fn=options.fn;if(isFunction(context)){context=context.call(this);}
if(context===true){return fn(this);}else if(context===false||context==null){return inverse(this);}else if(isArray(context)){if(context.length>0){return instance.helpers.each(context,options);}else{return inverse(this);}}else{return fn(context);}});instance.registerHelper('each',function(context,options){var fn=options.fn,inverse=options.inverse;var i=0,ret="",data;if(isFunction(context)){context=context.call(this);}
if(options.data){data=createFrame(options.data);}
if(context&&typeof context==='object'){if(isArray(context)){for(var j=context.length;i<j;i++){if(data){data.index=i;data.first=(i===0)
data.last=(i===(context.length-1));}
ret=ret+fn(context[i],{data:data});}}else{for(var key in context){if(context.hasOwnProperty(key)){if(data){data.key=key;}
ret=ret+fn(context[key],{data:data});i++;}}}}
if(i===0){ret=inverse(this);}
return ret;});instance.registerHelper('if',function(conditional,options){if(isFunction(conditional)){conditional=conditional.call(this);}
if((!options.hash.includeZero&&!conditional)||Utils.isEmpty(conditional)){return options.inverse(this);}else{return options.fn(this);}});instance.registerHelper('unless',function(conditional,options){return instance.helpers['if'].call(this,conditional,{fn:options.inverse,inverse:options.fn,hash:options.hash});});instance.registerHelper('with',function(context,options){if(isFunction(context)){context=context.call(this);}
if(!Utils.isEmpty(context))return options.fn(context);});instance.registerHelper('log',function(context,options){var level=options.data&&options.data.level!=null?parseInt(options.data.level,10):1;instance.log(level,context);});}
var logger={methodMap:{0:'debug',1:'info',2:'warn',3:'error'},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(level,obj){if(logger.level<=level){var method=logger.methodMap[level];if(typeof console!=='undefined'&&console[method]){console[method].call(console,obj);}}}};__exports__.logger=logger;function log(level,obj){logger.log(level,obj);}
__exports__.log=log;var createFrame=function(object){var obj={};Utils.extend(obj,object);return obj;};__exports__.createFrame=createFrame;return __exports__;})(__module2__,__module4__);var __module5__=(function(__dependency1__,__dependency2__,__dependency3__){"use strict";var __exports__={};var Utils=__dependency1__;var Exception=__dependency2__;var COMPILER_REVISION=__dependency3__.COMPILER_REVISION;var REVISION_CHANGES=__dependency3__.REVISION_CHANGES;function checkRevision(compilerInfo){var compilerRevision=compilerInfo&&compilerInfo[0]||1,currentRevision=COMPILER_REVISION;if(compilerRevision!==currentRevision){if(compilerRevision<currentRevision){var runtimeVersions=REVISION_CHANGES[currentRevision],compilerVersions=REVISION_CHANGES[compilerRevision];throw new Error("Template was precompiled with an older version of Handlebars than the current runtime. "+"Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");}else{throw new Error("Template was precompiled with a newer version of Handlebars than the current runtime. "+"Please update your runtime to a newer version ("+compilerInfo[1]+").");}}}
function template(templateSpec,env){if(!env){throw new Error("No environment passed to template");}
var invokePartialWrapper;if(env.compile){invokePartialWrapper=function(partial,name,context,helpers,partials,data){var result=invokePartial.apply(this,arguments);if(result){return result;}
var options={helpers:helpers,partials:partials,data:data};partials[name]=env.compile(partial,{data:data!==undefined},env);return partials[name](context,options);};}else{invokePartialWrapper=function(partial,name){var result=invokePartial.apply(this,arguments);if(result){return result;}
throw new Exception("The partial "+name+" could not be compiled when running in runtime-only mode");};}
var container={escapeExpression:Utils.escapeExpression,invokePartial:invokePartialWrapper,programs:[],program:function(i,fn,data){var programWrapper=this.programs[i];if(data){programWrapper=program(i,fn,data);}else if(!programWrapper){programWrapper=this.programs[i]=program(i,fn);}
return programWrapper;},merge:function(param,common){var ret=param||common;if(param&&common&&(param!==common)){ret={};Utils.extend(ret,common);Utils.extend(ret,param);}
return ret;},programWithDepth:programWithDepth,noop:noop,compilerInfo:null};return function(context,options){options=options||{};var namespace=options.partial?options:env,helpers,partials;if(!options.partial){helpers=options.helpers;partials=options.partials;}
var result=templateSpec.call(container,namespace,context,helpers,partials,options.data);if(!options.partial){checkRevision(container.compilerInfo);}
return result;};}
__exports__.template=template;function programWithDepth(i,fn,data){var args=Array.prototype.slice.call(arguments,3);var prog=function(context,options){options=options||{};return fn.apply(this,[context,options.data||data].concat(args));};prog.program=i;prog.depth=args.length;return prog;}
__exports__.programWithDepth=programWithDepth;function program(i,fn,data){var prog=function(context,options){options=options||{};return fn(context,options.data||data);};prog.program=i;prog.depth=0;return prog;}
__exports__.program=program;function invokePartial(partial,name,context,helpers,partials,data){var options={partial:true,helpers:helpers,partials:partials,data:data};if(partial===undefined){throw new Exception("The partial "+name+" could not be found");}else if(partial instanceof Function){return partial(context,options);}}
__exports__.invokePartial=invokePartial;function noop(){return"";}
__exports__.noop=noop;return __exports__;})(__module2__,__module4__,__module1__);var __module0__=(function(__dependency1__,__dependency2__,__dependency3__,__dependency4__,__dependency5__){"use strict";var __exports__;var base=__dependency1__;var SafeString=__dependency2__;var Exception=__dependency3__;var Utils=__dependency4__;var runtime=__dependency5__;var create=function(){var hb=new base.HandlebarsEnvironment();Utils.extend(hb,base);hb.SafeString=SafeString;hb.Exception=Exception;hb.Utils=Utils;hb.VM=runtime;hb.template=function(spec){return runtime.template(spec,hb);};return hb;};var Handlebars=create();Handlebars.create=create;__exports__=Handlebars;return __exports__;})(__module1__,__module3__,__module4__,__module2__,__module5__);return __module0__;})();jQuery.cookie=function(key,value,options){if(arguments.length>1&&String(value)!=="[object Object]"){options=jQuery.extend({},options);if(value===null||value===undefined){options.expires=-1;}
if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days);}
value=String(value);return(document.cookie=[encodeURIComponent(key),'=',options.raw?value:encodeURIComponent(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
options=value||{};var result,decode=options.raw?function(s){return s;}:decodeURIComponent;return(result=new RegExp('(?:^|; )'+encodeURIComponent(key)+'=([^;]*)').exec(document.cookie))?decode(result[1]):null;};this["JST"]=this["JST"]||{};Handlebars.registerPartial("blogroll/_ad-slot",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="\n<div class=\"leaderboard-title\">ADVERTISEMENT</div>\n<div align=\"center\"\n     class=\"ad-container row\" ";if(stack1=helpers.displayAdSlot){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.displayAdSlot;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+" id=\"wbgpt-blogroll-";if(stack1=helpers.adCounter){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.adCounter;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n</div>\n";return buffer;}));Handlebars.registerPartial("blogroll/_fragments-text-content",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function",self=this;function program1(depth0,data){var buffer="",stack1,options;buffer+="\n      <span class=\"hf";options={hash:{},data:data};buffer+=escapeExpression(((stack1=helpers.inc||depth0.inc),stack1?stack1.call(depth0,((stack1=data),stack1==null||stack1===false?stack1:stack1.index),options):helperMissing.call(depth0,"inc",((stack1=data),stack1==null||stack1===false?stack1:stack1.index),options)))
+"\">"
+escapeExpression((typeof depth0===functionType?depth0.apply(depth0):depth0))
+"</span>\n    ";return buffer;}
function program3(depth0,data){var buffer="",stack1;buffer+="\n      <span class=\"hf1\">"
+escapeExpression(((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</span>\n    ";return buffer;}
buffer+="<div class=\"text pull-left\">\n  <div class=\"fragments article-callout\">\n    ";stack1=helpers.each.call(depth0,depth0.fragments,{hash:{},inverse:self.program(3,program3,data),fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n  </div>\n  <br />\n  <span class=\"date\">";options={hash:{},data:data};buffer+=escapeExpression(((stack1=helpers.date||depth0.date),stack1?stack1.call(depth0,depth0.publishedDate,options):helperMissing.call(depth0,"date",depth0.publishedDate,options)))
+"</span>\n</div>\n\n";return buffer;}));Handlebars.registerPartial("blogroll/_media-content",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,stack2,functionType="function",escapeExpression=this.escapeExpression,helperMissing=helpers.helperMissing,self=this;function program1(depth0,data){var buffer="",stack1,stack2;buffer+="\n  <div class=\"media pull-left\">\n    ";stack2=helpers.each.call(depth0,((stack1=depth0.assets),stack1==null||stack1===false?stack1:stack1.primaryImage),{hash:{},inverse:self.noop,fn:self.programWithDepth(2,program2,data,depth0),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n  </div>\n";return buffer;}
function program2(depth0,data,depth1){var buffer="",stack1,stack2;buffer+="\n      ";stack2=helpers['if'].call(depth0,((stack1=data),stack1==null||stack1===false?stack1:stack1.first),{hash:{},inverse:self.noop,fn:self.programWithDepth(3,program3,data,depth1),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n    ";return buffer;}
function program3(depth0,data,depth2){var buffer="",stack1,stack2,options;buffer+="\n        <img src=\""
+escapeExpression(((stack1=((stack1=depth0.thumbnailUrls),stack1==null||stack1===false?stack1:stack1['400x300'])),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"/>\n        ";options={hash:{},data:data};stack2=((stack1=helpers.mediaIcon||depth2.mediaIcon),stack1?stack1.call(depth0,depth2.contentParsed,depth2.assets,options):helperMissing.call(depth0,"mediaIcon",depth2.contentParsed,depth2.assets,options));if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n      ";return buffer;}
function program5(depth0,data){var buffer="",stack1;buffer+="\n  <div class=\"media pull-left dummy\">\n    <img src=\"";if(stack1=helpers.ASSETS_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.ASSETS_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"images/tmz_logo_default_100px.gif\"/>\n  </div>\n";return buffer;}
stack2=helpers['if'].call(depth0,((stack1=depth0.assets),stack1==null||stack1===false?stack1:stack1.primaryImage),{hash:{},inverse:self.program(5,program5,data),fn:self.program(1,program1,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n";return buffer;}));Handlebars.registerPartial("blogroll/icons/_gallery-btn",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"none\" viewBox=\"0 0 42 42\" class=\"icon\" data-sprite=\"gallery\">\n  <image overflow=\"visible\" opacity=\".3\" width=\"49\" height=\"49\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsSAAALEgHS3X78AAAA GXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB35JREFUeNrMWv1z2kYQRXCAwBiw jamdpknb3/r//z9t0jiug7ENxiBAH9dT563neTkJObYzZWYHJCTdvtuvd3sKaq/zCfYc64/dc/xi Bb7nXv7OpQ4JSkBkEEsg7EtAmReAYKVzaeB5uTRxHCgAuaROEpKUgGXfCyZ4AQBRuEUSOulAWriO lcqVjp1EkI2TLUkMcNparwokoJlvQ9mek0MnB066+O7hO8Q9Vs10rvDSyYOTFSQ/XuCcAEwJ0KsA YSs0ASBX/tjJqZMTJwMAEWuEuNZillNywVy5NUkOZO7kxsm1k1uAinBvJesEz7RCPtNDJz85eefk 3MkI59mNAgKxhrvIMww9N4CiuUWmTv5xcunkm5MZzleyjqkAwmCWB1D6zMl7ABEQGWZW3EV8f01A DMVQl9zyEM8W6eO/K4CbwzpJGRhTAUQXbiQAchnDMk0oPcegU8wkg9lAgTosIiCGcM0RAHQwRoj/ e/ht4G6rMjBlQBp4+DGU/9XJLxi4DbeZwbcnkPz3PawgsZESEINs1sHMn2BSxvh9gPNtijVDiWJV FC+mxBptzNQZQPwGEHUE45QA5L/v4FprT5BaShoNWHKGmb7GMwTQCNY4I/10zdkB0ygA0YLvMogx /ssV/uLkLyefEZxTWGIFd/INyhU9oRiS2FriOANQyYINXL9Wk1RqEXapIcXFiEB8AoArzCq7kdxf 38OzLLmdZLYl1ZEY1x5h7IjAbnHfE6uYApfqI8VKYLfhTl8B4isskGD22hWJoiWLbMh6CZSXyl7D c5vwjDGAFLnuIxDxX0MB/g4ywMOnAHAFEBaApbI3K1gigxIPyHRzzHJM2a1GevTgYgPoco8JXSkX s2wRqdw9mFOKXQsuNKFClQDEO3K9TkkWZHdaYVIu8B/zqxjA7jDWMWRMOt1Ah4hi8YlFOMhPqNht kF0mGGANwH2A+APffUoetgBIjBkVEOIuQhgtgbmlbHYEXUbQ7RusKVa0hnxbgBzAlFKx55RiFxhI CtsIIH4HkDoFcRGQGRSYYNJCzG5GQbzFWJKaRzSxoluLXDkwKlu1oGAXF62oXtxhQMlOTCD7uCfx ZJRApWBNPge4Z0l0JsVYM7KK6CT6tWjNYxmIcCGh4BZmv4ZfiguwBRtEAhOi5IkihjW1qGoCwDn+ 6xK9WVKdecDYU3KvDun46FGGlOJMEcLUD3i40I5UFdGAFBQWu8S5FlF3vr4DpQTACYpqqGh/ijHv ib8dkI6SXP5zZ6PWGiEeLg+NVJHKClKs5PSEQPSoMgcqBQ9VFurj/AKKb1SxFBIakNd0KOUHvqwl M5nQkpSraVmdCAiEuIJR4C0FdkQxMqF6FNAExVQ8LU04x4i3sssqbouB1jTT+z5yf0jLXl+hFDDi wn0KYF9cbamiNzzxtwOk5gnMrOLaOVAMwRDN8LljSgSxSRzNp8eGSGOrCo3XXRKzp09llRS1igKP gr7/fdcxY5aV5g6NL1qPNMlF2gU9qjIwVTqRQQkAn7ubMj2MB70lMDtB5XG9mOhF+lotUE996xDL 3nF3UxJUbYBoc5pTLHaFlDmjTBdWyHBVQTRoaSx1I6aGXsY0nhWLiCq0iFNJnyqmerFEDbjAQyW4 j1AnMtXPDUrcUbul7qNJTQqorjxZlxjK14kqgJISh/g9o0K1wfEX3DuhllEN1TqhelEvCeLM08AW a4QYewgwdQB4UC2iJ66V0JIzwsMOiTpLS0ZccI57F0QczwH+nNJlVgJk4+n5Mo/rYexTjGFJxyf1 zRcj0o/NCMgY5HFBgy5pfaGtcYPjTMWXBrIFq76nVZ+lvsERLaq6tDpcabZhyH8zajDLElS6f2O4 z4xmIlbdkBSDXcI6Kb6bBfVBCGIO4m8w3BWB50kcYDJYt61vqcsztCDqPKA1/Bjn9Ro7JuZ7A6Uk brqUuoMKS997oi5ijWMAk/7wDXTcyVo1RdAeqKE8QDelh4fe4v+YrrdEue9w/t63ivMUMl6nL/Bt qFE+xthb0mmqdNipIzXKXLfkIpI5ZFkbUctm6UnJ4i7NAnpSthVnMFbeT/sZYzbgTpeQW9LhMW03 SvgTt2WY/9fU5o1WKKHmtSwDVkqEVW9oUtpwp7wz89HJB3jEFpb4E+n+lpbctqhlqk1fV2C4OBoP Y7XK/zPPHqFVnK5DCUWa5R8ASmLtE2LvGm6V7Ov9+iqvWKZNexssoSJ0vFaoq82iBj2LN43ewwof qSmYIR4+A8gVrR6zKuyXi9Wc6LzE0AipsUvbAnpbIaJ2aKaANCnufNsKDYw9hSsJiHkRiNqezmBK gV+jyh/RRs8prb+laM7UzhVv8jB/G1K/akBcTlpAF5CrorioCiSjFg9TGOkO8tabVN4jAhF5tt1C BeaQ+lVSJy4JQOWtt7fYDOWOipBMQ0kiUAH/5puherHFqTVCLNyo7emQRLoyGcWHJUrDqfnNt6ef +8JAl14YaKmuZKDYq2zc/LAXBp7zCkebVnNNT1eS20wSQz/8FY7nvFRjSshiSgonBQXzzV+q+d++ 5vQSIPvaPfuSSNnxsz//CjAA0le/RoUC3hkAAAAASUVORK5CYII=\" transform=\"translate(-3.5 -3.5)\"></image>\n  <g fill=\"#FFF\">\n    <path d=\"M25.9 15.2v-2.7H12.5v13.4h2.7V15.2z\"></path>\n    <path d=\"M17 17h12.6v12.6H17z\"></path>\n  </g>\n  <path fill=\"#FFF\" d=\"M21 41C10 41 1 32 1 21S10 1 21 1v1.4C10.8 2.4 2.4 10.8 2.4 21c0 10.2 8.3 18.6 18.6 18.6S39.6 31.2 39.6 21c0-10.2-8.3-18.6-18.6-18.6V1c11 0 20 9 20 20s-9 20-20 20z\">\n  </path>\n</svg>\n";}));Handlebars.registerPartial("blogroll/icons/_play-btn",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"none\" viewBox=\"0 0 42 42\" class=\"icon\" data-sprite=\"play\">\n  <image overflow=\"visible\" opacity=\".3\" width=\"49\" height=\"49\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsSAAALEgHS3X78AAAA GXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB7VJREFUeNq8Woly2kgQZZC4FA4b fCSO4xxbtf//RXES3/GJzSlAs6Ot166X9gwI7F2quiQB0vTru3tkSm/zMZ5zE/ivVUd9/moGNr3X EJWJjOf5FpQRWaKNQZlXgBCGI6LYUdVRBef6+TnjC0czR6mjOa6FGNx/CkSkHIHZnOmaozqODUcJ qAagrI2cyamjsaOhowmu5ZgC5EJp6U2BiAZiMP7OUdtRx1EL1zk1cazj+SJl+aQAMXA0wvmTo76j RwI499z7KiCshSqY3HK042gfxw5pQSgmM1qQGVqASUk7OYgbR1c4PgBQWlQ7pqAvVCDhXPI9R+8d HTr6gOsGFporW5+SdGMArOKc/SgHc+vowtGpo0tcP+H+2SrfMQVAiBa2He05OiAQXfw+w6IPtLiA mABcBMANmF8bmm0BVC79OwJz7ui3o3vSThCMKQCiCfP56OgTjjsAJ9K8w6LXADMCkBkxIM8TILlg diGcLml1CPM6c3SC4w18KgjGLHHsChbMF/vs6Cs0sY3fJ7Dta9j2NQANSAsLsnFDJlWDJrp4/j6O HZhwBk3kmjl29BPPH5CZ/fGJAiDEDLrQwl+OvuBaFsml9d3RD5xfAsgjtKRD6owcfIL/DIiG+E9E UbEOnmb0rIUvcUYeDUWQWBt+8JVALCCZY4D4RQCewNxMJTirMvpCJcUJQAxxvwQG8acY302WOX7k 0UYMaewBwFecG/jBd9ApQD0SgFDpEaIFSVsYTfFbTeWjlDT9AkyktCGS6JFJfcTDHmBG3+GA93Bq nwOaAqGdayvW0gzfVSjBVrEGg134gHC+aMGkvkEj25DYGUzqFKY0ouyrs39ZlSdmTUAWQk1g4u/A q1QFLMAXQMTJtkkbB3jgDbTxE+Y1DICoqKKxrKpkW0BLol0JOFIG1bDmgHLVMw+R8o0EYfALQu4W 7PIE2jiHT7A5sTZl4TaeVSEg61a0ZTDfpBIoA5C+TpIR2bPkjTymH6EMYW38wrlEllJAm+9BPZhE hczMFiiJSoqnBOae4P4n+Ocj5atSpLJ4G0x8hDbYNy4C2jAq0kny/AQwCdVUuokqUiLVqKIuQxP3 CD4i1GeNsEQP4OwJGD+BNm4D2jAUYfYRJP6Gee7DLBqq0TIepq1HK1wmtQAqBYgHDjix8hGpg+pU 9/Rhl9NASW0ocNRIq4f47gB+14WgzqgmG1JeKKkwvsCa0quM8GzhsUEB5VlKhkr1BhjKKOtOQjWO B4xUy10s2IOZbqPY3AOYSwC6p/qMI2GG6ynlDkPlS4OCiYmVGmP6cQYpjFeV0AoMd5FNsu82QO3D dMVkT1F0is1zUBAwKQkyohD/HN5jT8gzUGsayqIFo4709RXq65vQThfHBGtqZnUZMyWBxr7qIV6S fXXNtO6AoqSmLHxuKLlJi1tR1QBn+5TKk5qPn3Ig5In6quxQr/hYJaA5lfQp+YYN3GuXzMFKPtOS T4VKhE3AsFlIHz9BBLqh3PQD+emBkpsNVORVT3K1Ggj3Chn9JhMRrgBsgVqJI84UQUO6yTMAkM7v HEXoc3Lz1G91EmrJ0+v8AYSdaoqbK74IsUILGUW8jCYkV9SHSy/+GwDHytG1iUuTFZFwOK/9C0QY kMUHeHCdIk2CB4bCsI4wj2A8g7TPwTjnjwdKtNpHOKtLrdXA9xPqJqV3sbFywDEB2aYxUAeJS+zY qD7Ckh/0YffSh18AyAX8o6+S7MJTf3GTJ+G6RUOPAZlipk1LIskIfzZIYrvIyLdU21hPJErhzBfU GPVpwsIamCk7D80NWlh7F7zMwNuIop31OXtK89g5TRb3wMwT2aZRGXgKZk8AoKSGdmOPBmwgB0lv 1MXaPZj52NMhWt2zl5UktiAFmSQOVU1kyTF1wJCe4Z6GE2mBBFtWc4MjtATvsc41yppzCOjZ4SPP Zk1EE4wmzZa0k2WBLDyjuZX4wbxAhcCC7KAe+4IqOoFwThCyr2hYZ3XPrm20SnsdFdzANY+vpLcU OOZL/GBZNdGiBu0zzGuOaMfDjzEN617MtTgSldXmTZWCQshZfbOrIrteMU37d8mkPkCId9DEMWkj 5TWiJYmtpDZ13lGWL63RrvqIAYgZd6CJI3SZh/h+SDPgs1A5EwXKcKsGz7JYQo1XlWqysmK0tAQA 7zUmACDTfh6Wt2DKFzRfviGTsquG2LqxsdRb1LE4N0wJFZaR2iQtq4atQubKAGQ0+xkRKoHUr9Q8 Lbi1sGx/RMxqC333EY2JmmBwihDLWwt9tT+SEZiYRjwd2r7bRQVRo9nVJUIth9uJp7BcCYTBdDy7 VTs0axog899SDz5Su1V1qqYFSA/UxHojmI/etep78tdaW2/sI7LLtA9zOMR5GxKXqmBEOWSstt3q ZGIcDTMqNE/h1FcklOmqXFRkM5T7bxmJ7kArH2AWLVXql9WObkw7vVbtn8j+4zU0IcXlY6CsedU+ uwmEyx4SVoeSZ0IzJ0s5KaZ99hGRzM7uYJpSHU9XtMAbvzCgtVNTzCc0PJOco8Mvz8oGCtBIBYm1 3n7Y5F0UnQ84tFbJqX1dZUa12ETtL65T1rzpSzW+TM0v15QDbwdl6mWa0Fbd//J2UGiO5cvmpQK1 2EbMvzWQTZ9p33LRfwQYAPyxoG5muGjFAAAAAElFTkSuQmCC\" transform=\"translate(-3.5 -3.833)\"></image>\n  <path fill=\"#FFF\" d=\"M21 40.7c-11 0-20-9-20-20s9-20 20-20v1.4c-10.2 0-18.6 8.3-18.6 18.6 0 10.2 8.3 18.6 18.6 18.6S39.6 31 39.6 20.7c0-10.2-8.3-18.6-18.6-18.6V.7c11 0 20 9 20 20s-9 20-20 20z\">\n  </path>\n  <path fill=\"#FFF\" d=\"M28.6 20.8l-11.9 6.9V13.9l11.9 6.9z\">\n  </path>\n</svg>\n";}));Handlebars.registerPartial("polls/_answer-item",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<li class=\"results\">\n<div>\n<div class=\"answer\">";if(stack1=helpers.text){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.text;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\n<span class=\"line-sep\"></span>\n</div>\n<div class=\"pct\">";if(stack1=helpers.percent){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.percent;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</div>\n</div>\n</li>";return buffer;}));Handlebars.registerPartial("polls/_choice-item",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<li class=\"options\">\n<!-- The span is used to display the graphical checkbox -->\n<input type=\"radio\" name=\"answer\" value=\"";if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\"><span></span>\n";if(stack1=helpers.text){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.text;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\n</li>";return buffer;}));Handlebars.registerPartial("search/_search-results",Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){return"articles";}
function program3(depth0,data){return"photos";}
function program5(depth0,data){return"<h3 class=\"search-heading\">Latest News</h3>";}
function program7(depth0,data){var buffer="",stack1,options;buffer+="\n        ";options={hash:{},inverse:self.programWithDepth(8,program8,data,depth0),fn:self.noop,data:data};if(stack1=helpers.last){stack1=stack1.call(depth0,options);}
else{stack1=depth0.last;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.last){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n      ";return buffer;}
function program8(depth0,data,depth1){var buffer="",stack1,stack2;buffer+="\n            <li class=\"";stack1=helpers['if'].call(depth0,depth1.galleries,{hash:{},inverse:self.noop,fn:self.program(9,program9,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="clearfix\">\n                <div class=\"";stack1=helpers['if'].call(depth0,depth1.galleries,{hash:{},inverse:self.program(13,program13,data),fn:self.program(11,program11,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+=" clearfix\">\n                    <a data-adid=\"TMZ_Search_Results\" class=\"has-adid\" href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n                        <img src=\"";stack1=helpers['if'].call(depth0,depth0.primaryImage,{hash:{},inverse:self.program(17,program17,data),fn:self.program(15,program15,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" />\n                    </a>\n                </div>\n                <div class=\"title\"><a data-adid=\"TMZ_Search_Results\" class=\"has-adid\" href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</a><br /></div>\n              ";stack2=((stack1=((stack1=depth1.galleries),typeof stack1===functionType?stack1.apply(depth0):stack1)),blockHelperMissing.call(depth0,stack1,{hash:{},inverse:self.program(19,program19,data),fn:self.noop,data:data}));if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n            </li>\n        ";return buffer;}
function program9(depth0,data){return"photo ";}
function program11(depth0,data){return"thumb";}
function program13(depth0,data){return"all-thumb";}
function program15(depth0,data){var stack1;if(stack1=helpers.primaryImage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.primaryImage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
return escapeExpression(stack1);}
function program17(depth0,data){var buffer="",stack1;if(stack1=helpers.ASSETS_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.ASSETS_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"images/tmz_logo_default_100px.gif";return buffer;}
function program19(depth0,data){var buffer="",stack1;buffer+="\n                  <div class=\"snippet\"><span>";if(stack1=helpers.date){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.date;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+" - </span>";if(stack1=helpers.contents){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.contents;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="<br /></div>\n                  <div class=\"display-url\">";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</div>\n              ";return buffer;}
function program21(depth0,data){var buffer="",stack1;buffer+="\n      <span class=\"previous\"><a href=\"";if(stack1=helpers.SITE_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.SITE_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"search/";if(stack1=helpers.searchType){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.searchType;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"/";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="/page/";if(stack1=helpers.prevPage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.prevPage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">Previous</a></span>\n  ";return buffer;}
function program23(depth0,data){var buffer="",stack1;buffer+="\n      <span class=\"next\"><a href=\"";if(stack1=helpers.SITE_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.SITE_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"search/";if(stack1=helpers.searchType){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.searchType;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"/";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="/page/";if(stack1=helpers.nextPage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.nextPage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">Next >></a></span>\n  ";return buffer;}
buffer+="<div class=\"gsa-results gsa-";stack1=helpers['if'].call(depth0,depth0.news,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
stack1=helpers['if'].call(depth0,depth0.galleries,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="-results\">\n    <div id=\"search_celebs\"></div>\n    ";stack1=helpers['if'].call(depth0,depth0.news,{hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n    <ul>\n      ";options={hash:{},inverse:self.noop,fn:self.program(7,program7,data),data:data};if(stack1=helpers.posts){stack1=stack1.call(depth0,options);}
else{stack1=depth0.posts;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.posts){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n    </ul>\n</div>\n<div class=\"gsa-paging\">\n    <!-- pagination links -->\n  ";options={hash:{},inverse:self.noop,fn:self.program(21,program21,data),data:data};if(stack1=helpers.hasPrevPage){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasPrevPage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasPrevPage){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n  ";options={hash:{},inverse:self.noop,fn:self.program(23,program23,data),data:data};if(stack1=helpers.hasNextPage){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasNextPage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasNextPage){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n";return buffer;}));this["JST"]["blogroll/article-blogroll"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,helperMissing=helpers.helperMissing,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){var buffer="",stack1;buffer+="\n  ";stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
function program2(depth0,data){var buffer="",stack1,stack2,options;buffer+="\n       <div id=\""
+escapeExpression(((stack1=depth0.id),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" class=\"blogroll-item row\"  data-index-number=\"";if(stack2=helpers.articleCounter){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0.articleCounter;stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
buffer+=escapeExpression(stack2)
+"\">\n\n          ";stack2=helpers['if'].call(depth0,((stack1=depth0.additionalProperties),stack1==null||stack1===false?stack1:stack1.softSwipe),{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n\n          ";stack2=helpers['if'].call(depth0,((stack1=depth0.assets),stack1==null||stack1===false?stack1:stack1.featuredVideo),{hash:{},inverse:self.program(7,program7,data),fn:self.program(5,program5,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n            ";stack2=self.invokePartial(partials['blogroll/_media-content'],'blogroll/_media-content',depth0,helpers,partials,data);if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n            ";stack2=self.invokePartial(partials['blogroll/_fragments-text-content'],'blogroll/_fragments-text-content',depth0,helpers,partials,data);if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n          </a>\n\n          <div class=\"clearfix\"></div>\n\n       </div>\n\n       ";options={hash:{},inverse:self.noop,fn:self.program(9,program9,data),data:data};stack2=((stack1=helpers.ifAdSlot||depth0.ifAdSlot),stack1?stack1.call(depth0,((stack1=data),stack1==null||stack1===false?stack1:stack1.index),options):helperMissing.call(depth0,"ifAdSlot",((stack1=data),stack1==null||stack1===false?stack1:stack1.index),options));if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n\n  ";return buffer;}
function program3(depth0,data){var buffer="",stack1;buffer+="\n            <div class=\"primary-image-swipe\">\n              <span>"
+escapeExpression(((stack1=((stack1=depth0.additionalProperties),stack1==null||stack1===false?stack1:stack1.softSwipe)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</span>\n            </div>\n          ";return buffer;}
function program5(depth0,data){var buffer="",stack1,stack2;buffer+="\n            "
+"\n            <a href=\"";if(stack1=helpers.SITE_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.SITE_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+escapeExpression(((stack1=depth0.slug),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"/\" data-vilynx-id=\"";if(stack2=helpers.SITE_BASEURL){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0.SITE_BASEURL;stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
buffer+=escapeExpression(stack2)
+escapeExpression(((stack1=depth0.slug),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"/\" redirecttext=\"Article Will Open In...\">\n          ";return buffer;}
function program7(depth0,data){var buffer="",stack1,stack2;buffer+="\n            <a href=\"";if(stack1=helpers.SITE_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.SITE_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+escapeExpression(((stack1=depth0.slug),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"/\" data-vilynx-id=\"";if(stack2=helpers.SITE_BASEURL){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0.SITE_BASEURL;stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
buffer+=escapeExpression(stack2)
+escapeExpression(((stack1=depth0.slug),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"/\">\n          ";return buffer;}
function program9(depth0,data){var buffer="",stack1;buffer+="\n          ";stack1=self.invokePartial(partials['blogroll/_ad-slot'],'blogroll/_ad-slot',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n       ";return buffer;}
function program11(depth0,data){return"\n  <div>No data.</div>\n";}
options={hash:{},inverse:self.program(11,program11,data),fn:self.program(1,program1,data),data:data};if(stack1=helpers.hasData){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasData;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasData){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["community/member-comments"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){var buffer="",stack1,stack2;buffer+="\n<li class=\"comment-item group\">\n<div class=\"comment-image\">\n<img src=\""
+escapeExpression(((stack1=((stack1=((stack1=((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.author)),stack1==null||stack1===false?stack1:stack1.avatar)),stack1==null||stack1===false?stack1:stack1.small)),stack1==null||stack1===false?stack1:stack1.cache)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" height=\"50\" width=\"50\" alt=\"Avatar\" />\n</div>\n<div class=\"comment-single\">\n<div class=\"left\">\n<h3><a href=\"";stack2=((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.url)),typeof stack1===functionType?stack1.apply(depth0):stack1);if(stack2||stack2===0){buffer+=stack2;}
buffer+="\">";stack2=((stack1=((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.thread)),stack1==null||stack1===false?stack1:stack1.title)),typeof stack1===functionType?stack1.apply(depth0):stack1);if(stack2||stack2===0){buffer+=stack2;}
buffer+="</a></h3>\n<div class=\"comment-text\">"
+escapeExpression(((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.raw_message)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</div>\n<div class=\"comment-meta\">\n<a href=\"/my-tmz/\">"
+escapeExpression(((stack1=((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.author)),stack1==null||stack1===false?stack1:stack1.name)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</a>&nbsp;&nbsp;"
+escapeExpression(((stack1=((stack1=depth0.object),stack1==null||stack1===false?stack1:stack1.daysAgo)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+" DAYS AGO\n</div>\n</div>\n</div>\n</li>\n";return buffer;}
function program3(depth0,data){return"\n<li class=\"comment-item group\" style=\"margin-left:15px;\">No comments.</li>\n";}
function program5(depth0,data){var buffer="",stack1,options;buffer+="\n<div class=\"pagination\">\n";options={hash:{},inverse:self.noop,fn:self.program(6,program6,data),data:data};if(stack1=helpers.hasPrev){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasPrev;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasPrev){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n\n";options={hash:{},inverse:self.noop,fn:self.program(8,program8,data),data:data};if(stack1=helpers.hasNext){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasNext;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasNext){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n";return buffer;}
function program6(depth0,data){return"\n<a href=\"#\" data-cursor=\"prev\">Previous</a>\n";}
function program8(depth0,data){return"\n<a href=\"#\" data-cursor=\"next\">Next</a>\n";}
buffer+="<!-- Comments -->\n<ul class=\"comments-list group\">\n<!-- If comments -->\n";options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};if(stack1=helpers.response){stack1=stack1.call(depth0,options);}
else{stack1=depth0.response;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.response){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n\n<!-- No Comments -->\n";options={hash:{},inverse:self.program(3,program3,data),fn:self.noop,data:data};if(stack1=helpers.response){stack1=stack1.call(depth0,options);}
else{stack1=depth0.response;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.response){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</ul>\n\n<!-- Pagination -->\n";options={hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data};if(stack1=helpers.pagination){stack1=stack1.call(depth0,options);}
else{stack1=depth0.pagination;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.pagination){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
return buffer;});this["JST"]["header/user-nav"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<li class=\"user-wrap\">\n<a href=\"#\" class=\"userThumb\" title=\"";if(stack1=helpers.userTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.userTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\"><img src=\"";if(stack1=helpers.userThumb){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.userThumb;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" alt=\"thumbnail_";if(stack1=helpers.userTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.userTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" width=\"50\" height=\"50\"/></a>\n<aside class=\"my-tmz-box\">\n    <div class=\"arrow-up\"></div>\n    <div class=\"qlf-container\">\n    <h2><a href=\"/my-tmz\">MY TMZ</a></h2>\n    <a href=\"/signout\">SIGN OUT</a>\n    </div>\n  </aside>\n</li>\n";return buffer;});this["JST"]["photos/ad-partial"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<div class=\"category-divider\">\n    <div class=\"ad-title\">ADVERTISEMENT</div>\n    <div align=\"center\" class=\"ad-container wbads\" data-adsize=\"leaderboard\" data-pos=\"bottom\" data-tile=\"";if(stack1=helpers.ad){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.ad;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-refresh=\"true\"></div>\n</div>\n";return buffer;});this["JST"]["photos/ad"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<div class=\"gallery-slide gallery-ad-slide\">\n  <div class=\"gallery-ad-wrap\"> \n    <div class=\"title\">ADVERTISEMENT</div>\n    <div class=\"gallery-ad-container\"></div>\n  </div>\n</div>";});this["JST"]["photos/categories"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){var buffer="",stack1;buffer+="\n\n<div class=\"gallery-featured\">\n    <ul>\n        ";stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n    </ul>\n</div>\n\n";return buffer;}
function program2(depth0,data){var buffer="",stack1,stack2;buffer+="\n        <li class=\"gallery-item\">\n            <a href=\"";if(stack1=helpers.link){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.link;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n                <img class=\"item-bg\" src=\"";if(stack1=helpers.thumbnailUrl){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.thumbnailUrl;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" />\n                <div class=\"image-fade\"></div>\n                <div class=\"content\">\n                    <div class=\"icon-gallery\"></div>\n                    ";stack2=helpers['if'].call(depth0,((stack1=data),stack1==null||stack1===false?stack1:stack1.first),{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n                    <h2 class=\"item-title\">";if(stack2=helpers.title){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0.title;stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
if(stack2||stack2===0){buffer+=stack2;}
buffer+="</h2>\n                </div>\n            </a>\n        </li>\n        ";return buffer;}
function program3(depth0,data){return"\n                      <h3 class=\"item-tag\">Featured Gallery</h3>\n                    ";}
function program5(depth0,data){var buffer="",stack1;buffer+="\n\n<div class=\"category-wrapper\">\n    <div class=\"category-section\">\n        <h1 class=\"category-title\">";if(stack1=helpers.categoryTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.categoryTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</h1>\n        <a class=\"category-link\" href=\"/photos/category/";if(stack1=helpers.slug){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.slug;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\"><span>&#9658;&nbsp;</span> More from this category</a>\n        <ul class=\"";if(stack1=helpers.gridType){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.gridType;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n          ";stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(6,program6,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n        </ul>\n    </div>\n</div>\n\n";return buffer;}
function program6(depth0,data){var buffer="",stack1;buffer+="\n            <li>\n                <a href=\"";if(stack1=helpers.link){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.link;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n                    <div class=\"gallery-bg\">\n                        <img class=\"bg-img\" src=\"";if(stack1=helpers.thumbnailUrl){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.thumbnailUrl;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" />\n                        <div class=\"icon-gallery\"></div>\n                    </div>\n                    <h2 class=\"item-title\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</h2>\n                </a>\n            </li>\n          ";return buffer;}
stack1=helpers['if'].call(depth0,depth0.featured,{hash:{},inverse:self.program(5,program5,data),fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["photos/fork-lightbox"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,stack2,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){return"gallery-end-slide";}
function program3(depth0,data){return"gallery-replay";}
function program5(depth0,data){var buffer="",stack1,stack2;buffer+="\n          <li class=\"recent-gallery\">\n            <a href=\""
+escapeExpression(((stack1=depth0.RecordLink),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" style=\"background-image:url("
+escapeExpression(((stack1=depth0.thumbnail),typeof stack1===functionType?stack1.apply(depth0):stack1))
+");\" target=\"_parent\">\n              <span class=\"recent-gallery-title\">";stack2=((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1);if(stack2||stack2===0){buffer+=stack2;}
buffer+="</span>\n            </a>\n          </li>\n        ";return buffer;}
buffer+="<div class=\"gallery-slide gallery-fork-slide ";stack1=helpers['if'].call(depth0,depth0.isEnd,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" data-gallery-title=\"";if(stack1=helpers.galleryTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.galleryTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-gallery-length=\"";if(stack1=helpers.galleryLength){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.galleryLength;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n  <div class=\"gallery-fork-top-background\" style=\"background-image:url("
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.bg)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+");\"></div>\n  <div class=\"gallery-fork-top\">\n    <div class=\"gallery-fork-top-content ";stack2=helpers['if'].call(depth0,depth0.isEnd,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\">\n      <a class=\"next-gallery\" href=\""
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.link)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" target=\"_parent\">\n        <div class=\"preview-tile\" style=\"background-image:url('"
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.img)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"');\">\n          <div class=\"grid-icon\"></div>\n        </div>\n        <div class=\"preview-info\">\n          <div class=\"up-next\">Up Next</div>\n          <h2 class=\"title\">"
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.title)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</h2>\n        </div>\n      </a>\n      <div class=\"btn-replay\">\n          <span class=\"replay-icon\"></span>\n          <span class=\"replay-text\">Replay</span>\n        </div>\n    </div>\n  </div>\n  <div class=\"gallery-fork-bottom\">\n    <div class=\"gallery-fork-bottom-spacer\">\n      <div class=\"something-else\">MORE GALLERIES</div>\n      <ul class=\"recent-galleries\">\n        ";stack2=helpers.each.call(depth0,depth0.relatedGalleries,{hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n      </ul>\n    </div>\n  </div>\n</div>\n";return buffer;});this["JST"]["photos/fork"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,stack2,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){return"gallery-end-slide";}
function program3(depth0,data){return"gallery-replay";}
function program5(depth0,data){var buffer="",stack1,stack2;buffer+="\n      <li class=\"recent-gallery\">\n        <a href=\""
+escapeExpression(((stack1=depth0.RecordLink),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" style=\"background-image:url("
+escapeExpression(((stack1=((stack1=((stack1=((stack1=((stack1=depth0.images),stack1==null||stack1===false?stack1:stack1[0])),stack1==null||stack1===false?stack1:stack1['thumbnails-json'])),stack1==null||stack1===false?stack1:stack1[5])),stack1==null||stack1===false?stack1:stack1.url)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+");\" target=\"_parent\">\n          <span class=\"recent-gallery-title\">";stack2=((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1);if(stack2||stack2===0){buffer+=stack2;}
buffer+="</span>\n        </a>\n      </li>\n    ";return buffer;}
buffer+="<div class=\"gallery-slide gallery-fork-slide ";stack1=helpers['if'].call(depth0,depth0.isEnd,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" data-gallery-title=\"";if(stack1=helpers.galleryTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.galleryTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n  <div class=\"gallery-fork-top\" style=\"background-image:url("
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.bg)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+");\">\n    <div class=\"gallery-fork-top-content ";stack2=helpers['if'].call(depth0,depth0.isEnd,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\">\n      <a class=\"next-gallery\" href=\""
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.link)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\" target=\"_parent\">\n        <div class=\"preview-tile\" style=\"background-image:url('"
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.img)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"');\">\n          <div class=\"grid-icon\"></div>\n        </div>\n        <div class=\"preview-info\">\n          <div class=\"up-next\">Up Next</div>\n          <h2 class=\"title\">"
+escapeExpression(((stack1=((stack1=depth0.nextGallery),stack1==null||stack1===false?stack1:stack1.title)),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</h2>\n        </div>\n      </a>\n      <div class=\"btn-replay\">\n          <span class=\"replay-icon\"></span>\n          <span class=\"replay-text\">Replay</span>\n        </div>\n    </div>\n  </div>\n  <div class=\"gallery-fork-bottom\">\n    <div class=\"something-else\">MORE GALLERIES</div>\n    <ul class=\"recent-galleries\">\n    ";stack2=helpers.each.call(depth0,depth0.relatedGalleries,{hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n    </ul>\n  </div>\n</div>\n";return buffer;});this["JST"]["photos/grid"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<div class=\"gallery-grid-thumb\" data-index=\"";if(stack1=helpers.index){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.index;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" style=\"background-image: url(";if(stack1=helpers.src){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.src;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+");\"></div>";return buffer;});this["JST"]["photos/more-categories"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){var buffer="",stack1;buffer+="\n    <li><a href=\"";if(stack1=helpers.link){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.link;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-slug=\"";if(stack1=helpers.slug){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.slug;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</a></li>\n  ";return buffer;}
buffer+="<h2 class=\"looking-title\">LOOKING FOR MORE?</h2>\n<ul class=\"looking-list\">\n  ";stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</ul>\n";return buffer;});this["JST"]["photos/poll"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){var buffer="",stack1;buffer+="\n    <li class=\"poll-answer\" data-count=\"";if(stack1=helpers.count){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.count;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-id=\"";if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n      <span class=\"circle\"></span>\n      <span class=\"text\">";if(stack1=helpers.text){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.text;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span>\n      <span class=\"percent\">";if(stack1=helpers.percent){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.percent;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"%</span>\n    </li>\n  ";return buffer;}
buffer+="<div class=\"related-poll clearfix\">\n  <div class=\"poll-title\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</div>\n  <ul class=\"poll-answers\">\n  ";stack1=helpers.each.call(depth0,depth0.answers,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n  </ul>\n  <div class=\"poll-count\"><span>";if(stack1=helpers.total){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.total;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span> VOTES</div>\n</div>";return buffer;});this["JST"]["photos/slide"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<div class=\"gallery-slide gallery-image-slide\" data-index=\"";if(stack1=helpers.index){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.index;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-caption=\"";if(stack1=helpers.caption){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.caption;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-slug=\"";if(stack1=helpers.slug){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.slug;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-credit=\"";if(stack1=helpers.credit){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.credit;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-legacy-poll-code=\"";if(stack1=helpers.legacyPollCode){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.legacyPollCode;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-related-poll-guid=\"";if(stack1=helpers.relatedPollGuid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.relatedPollGuid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-gallery-title=\"";if(stack1=helpers.galleryTitle){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.galleryTitle;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-gallery-length=\"";if(stack1=helpers.galleryLength){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.galleryLength;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n  <img class=\"hidden\" src=\"\" id=\"slide_";if(stack1=helpers.index){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.index;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-src=\"";if(stack1=helpers.src){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.src;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" />\n  <div class=\"gallery-poll\"></div>\n</div>\n";return buffer;});this["JST"]["polls/poll-homepage-post-results"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,stack2,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n";stack1=self.invokePartial(partials['polls/_answer-item'],'polls/_answer-item',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
buffer+="<!-- Results Container -->\n<div id=\"poll-";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"-results\" class=\"poll-results\" data-answers-template=\"polls/poll-homepage-post-results\">\n<div class=\"results-wrapper\">\n\n<!-- Answers -->\n<ul>\n";stack2=helpers.each.call(depth0,((stack1=depth0.item),stack1==null||stack1===false?stack1:stack1.answers),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n</ul>\n\n<span class=\"vote-tally\">\nTotal Votes: <span>";if(stack2=helpers['total-votes']){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0['total-votes'];stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
buffer+=escapeExpression(stack2)
+"</span>\n</span>\n<a href=\"#\" class=\"note-toggle note-on\">*Poll Results</a>\n<div style=\"clear: both;\"></div>\n</div>\n\n<!-- Note on results -->\n<div class=\"note-on-results\">\n<p class=\"note\">\n<strong>NOTE:</strong> Poll results are not scientific and reflect\nthe opinions of only those users who chose to participate. Poll\nresults are not reflected in real time.\n</p>\n<div class=\"back-to-results\">\n<a href=\"#\" class=\"note-toggle\">Back to Poll Results</a>\n</div>\n</div>\n\n<!-- Voted Button -->\n<div class=\"voted-btn\">\n<span>VOTED</span>\n</div>\n</div>";return buffer;});this["JST"]["polls/poll-homepage-post-wide-results"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,stack2,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n";stack1=self.invokePartial(partials['polls/_answer-item'],'polls/_answer-item',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
buffer+="\n<div id=\"poll-";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"-results\" class=\"poll-results\"\n     data-answers-template=\"polls/poll-homepage-post-wide-results\">\n    <div class=\"poll-title\">\n        <h3>";stack2=((stack1=((stack1=depth0.item),stack1==null||stack1===false?stack1:stack1.title)),typeof stack1===functionType?stack1.apply(depth0):stack1);if(stack2||stack2===0){buffer+=stack2;}
buffer+="</h3>\n    </div>\n    <div class=\"poll-answers results-wrapper\">\n      "
+"\n<ul class=\"results-list\">\n";stack2=helpers.each.call(depth0,((stack1=depth0.item),stack1==null||stack1===false?stack1:stack1.answers),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack2||stack2===0){buffer+=stack2;}
buffer+="\n</ul>\n        <div style=\"clear: both;\"></div>\n        <span class=\"vote-tally\">\n            Total Votes: <span>";if(stack2=helpers['total-votes']){stack2=stack2.call(depth0,{hash:{},data:data});}
else{stack2=depth0['total-votes'];stack2=typeof stack2===functionType?stack2.apply(depth0):stack2;}
buffer+=escapeExpression(stack2)
+"</span>\n        </span>\n        <a href=\"#\" class=\"note-toggle note-on\">*Poll Results</a>\n\n    </div>\n\n  "
+"\n  <div class=\"poll-answers note-on-results\">\n    <p class=\"note\">\n        <strong>NOTE:</strong> Poll results are not scientific and reflect\n        the opinions of only those users who chose to participate. Poll\n        results are not reflected in real time.\n    </p>\n\n    <div class=\"back-to-results\">\n        <a href=\"#\" class=\"note-toggle\">Back to Poll Results</a>\n    </div>\n  </div>\n\n  "
+"\n  <div class=\"poll-submit voted-btn\">\n    <span>VOTED</span>\n  </div>\n</div>";return buffer;});this["JST"]["polls/poll-homepage-post-wide"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n                    ";stack1=self.invokePartial(partials['polls/_choice-item'],'polls/_choice-item',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n                ";return buffer;}
buffer+="<div class=\"poll\">\n    <form class=\"poll\" data-guid=\"";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n        "
+"\n        <div class=\"poll-title\">\n            <h3>";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</h3>\n            <input type=\"hidden\" name=\"title\" value=\"";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\"/>\n            "
+"\n            <div id=\"poll-";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"-message\" class=\"polls-message\"></div>\n        </div>\n        <div class=\"poll-answers\">\n            <ul>\n                ";stack1=helpers.each.call(depth0,depth0.answers,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n            </ul>\n        </div>\n        <div class=\"poll-submit\">\n            "
+"\n            <button type=\"button\" value=\"VOTE\" class=\"btn-vote\">VOTE</button>\n        </div>\n    </form>\n</div>";return buffer;});this["JST"]["polls/poll-homepage-post"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n";stack1=self.invokePartial(partials['polls/_choice-item'],'polls/_choice-item',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
buffer+="<!-- Poll Question -->\n<h3>\n<strong>";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</strong>\n</h3>\n\n<!-- Container -->\n<div class=\"poll\">\n<!-- Poll Message (error) -->\n<div id=\"poll-";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"-message\" class=\"polls-message\"></div>\n\n<!-- Form -->\n<form class=\"poll\" data-guid=\"";if(stack1=helpers.guid){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.guid;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n<!-- Choices -->\n<ul>\n";stack1=helpers.each.call(depth0,depth0.answers,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</ul>\n\n<!-- Submit -->\n<button type=\"button\" value=\"VOTE\" class=\"btn-vote\">VOTE</button>\n<div style=\"clear: both;\"></div>\n</form>\n</div>";return buffer;});this["JST"]["search/celebs"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data,depth1){var buffer="",stack1;buffer+="\n      <li class=\"";stack1=helpers['if'].call(depth0,depth1.galleries,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="clearfix\">\n        <a data-adid=\"TMZ_Search_Results\" class=\"has-adid celeb-result\" href=\"";if(stack1=helpers.SITE_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.SITE_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"person/";if(stack1=helpers.slug){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.slug;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"/\">\n          <img src=\"";stack1=helpers['if'].call(depth0,depth0.primaryImage,{hash:{},inverse:self.program(6,program6,data),fn:self.program(4,program4,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" />\n          <div class=\"title\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</div>\n        </a>\n      </li>\n  ";return buffer;}
function program2(depth0,data){return"photo ";}
function program4(depth0,data){var stack1;if(stack1=helpers.primaryImage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.primaryImage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
return escapeExpression(stack1);}
function program6(depth0,data){var buffer="",stack1;if(stack1=helpers.ASSETS_BASEURL){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.ASSETS_BASEURL;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"images/tmz_logo_default_100px.gif";return buffer;}
buffer+="<h3 class=\"search-heading\">Celebs</h3>\n<ul>\n  ";options={hash:{},inverse:self.noop,fn:self.programWithDepth(1,program1,data,depth0),data:data};if(stack1=helpers.posts){stack1=stack1.call(depth0,options);}
else{stack1=depth0.posts;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.posts){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</ul>\n<script>\n  $('.celeb-result').on('click', function() {\n    s.prop37 = s.eVar37 = $(this).find('.title').html();\n    s.tl();\n  });\n</script>\n";return buffer;});this["JST"]["search/search"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,options,self=this,functionType="function",escapeExpression=this.escapeExpression,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){return"current ";}
function program3(depth0,data){var buffer="",stack1;buffer+="\n    ";stack1=self.invokePartial(partials['search/_search-results'],'search/_search-results',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
buffer+="<div class=\"breadcrumbs group\"><a href=\"/\" id=\"breadcrumb-home\">Home</a>Search</div>\n<div id=\"main-content\">\n    <div class=\"gsa-tabs\" id=\"gsa-tabs\">\n        <ul>\n            <li><a id=\"gsa-tabs-articles\" data-search-type=\"news\" data-adid=\"TMZ_Search_Results_Tabs\" class=\"";stack1=helpers['if'].call(depth0,depth0.news,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="has-adid search-tab\" href=\"/search/news/";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="/\">Latest News &amp; Celebs</a></li>\n            <li><a id=\"gsa-tabs-photos\" data-search-type=\"galleries\" data-adid=\"TMZ_Search_Results_Tabs\" class=\"";stack1=helpers['if'].call(depth0,depth0.galleries,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="has-adid search-tab\" href=\"/search/galleries/";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="/\">Photos</a></li>\n            <li><a id=\"gsa-tabs-videos\" data-search-type=\"videos\" data-adid=\"TMZ_Search_Results_Tabs\" class=\"";stack1=helpers['if'].call(depth0,depth0.videos,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="has-adid search-tab\" href=\"/search/videos/";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="/\">Videos</a></li>\n        </ul>\n    </div>\n    <div class=\"gsa-results-header clearfix\">\n        <p>Your search for <strong>";if(stack1=helpers.query){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.query;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</strong> returned about <strong>";if(stack1=helpers.totalResults){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.totalResults;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</strong> results.</p>\n    </div>\n";options={hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data};if(stack1=helpers.hasData){stack1=stack1.call(depth0,options);}
else{stack1=depth0.hasData;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.hasData){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div> <!-- END main-content -->\n";return buffer;});this["JST"]["share/share"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<a class=\"box\" href=\"#\">\n  <div class=\"share\">\n    <span class=\"share-";if(stack1=helpers['class']){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0['class'];stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"-icon\"></span>\n    <span class=\"share-count\">{total}</span>\n  </div>\n</a>";return buffer;});this["JST"]["shortcodes/omnivirt-video-embed"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<script type=\"text/javascript\" src=\"//upload.omnivirt.com/scripts/embed.js\"></script>\n\n<div class=\"";if(stack1=helpers.player_name){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.player_name;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" data-video-type=\"omnivirt\" style=\"height:";if(stack1=helpers.custom_height){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_height;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"px; width:";if(stack1=helpers.custom_width){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_width;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"px;position:relative;clear:both;\">\n  <iframe id=\"ado-";if(stack1=helpers.video_id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" src=\"about:blank\" frameborder=\"0\" width=\"";if(stack1=helpers.custom_width){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_width;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" height=\"";if(stack1=helpers.custom_height){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_height;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" webkitAllowFullScreen=\"1\" mozallowfullscreen=\"1\" allowFullScreen=\"1\"></iframe>\n  <script type=\"text/javascript\">document.getElementById(\"ado-";if(stack1=helpers.video_id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\").setAttribute(\"src\", \"//www.vroptimal-3dx-assets.com/content/";if(stack1=helpers.video_id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="?player=true&autoplay=false&referer=\" + encodeURIComponent(window.location.href))</script>\n</div>\n";return buffer;});this["JST"]["shortcodes/tmz-video-embed"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){var stack1;if(stack1=helpers.video_swipe_template){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_swipe_template;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){return stack1;}
else{return'';}}
function program3(depth0,data){return"false";}
function program5(depth0,data){return"true";}
buffer+="<div class=\"";if(stack1=helpers.player_name){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.player_name;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" data-video-type=\"kaltura\"\n     style=\"height:";if(stack1=helpers.custom_height){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_height;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"px; width:";if(stack1=helpers.custom_width){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_width;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"px;position:relative;clear:both;\">\n     <div class=\"video-container\"></div>\n     ";options={hash:{},inverse:self.program(1,program1,data),fn:self.noop,data:data};if(stack1=helpers.auto_play){stack1=stack1.call(depth0,options);}
else{stack1=depth0.auto_play;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.auto_play){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n<script>\n    var playerName = '";if(stack1=helpers.player_name){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.player_name;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="';\n    $(function (callback) {\n        playerName = new TmzKalturaPlayerView({\n            where: '.' + '";if(stack1=helpers.player_name){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.player_name;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+=" .video-container',\n            height: ";if(stack1=helpers.custom_height){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_height;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+",\n            width: ";if(stack1=helpers.custom_width){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.custom_width;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+",\n            cacheSt: 9999999999,\n            site: 'tmz',\n            endcard: ";if(stack1=helpers.endcard){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.endcard;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+",\n            autoPlay: ";options={hash:{},inverse:self.program(3,program3,data),fn:self.noop,data:data};if(stack1=helpers.auto_play){stack1=stack1.call(depth0,options);}
else{stack1=depth0.auto_play;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.auto_play){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
options={hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data};if(stack1=helpers.auto_play){stack1=stack1.call(depth0,options);}
else{stack1=depth0.auto_play;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.auto_play){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+=",\n            autoMute: ";options={hash:{},inverse:self.program(3,program3,data),fn:self.noop,data:data};if(stack1=helpers.auto_mute){stack1=stack1.call(depth0,options);}
else{stack1=depth0.auto_mute;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.auto_mute){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
options={hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data};if(stack1=helpers.auto_mute){stack1=stack1.call(depth0,options);}
else{stack1=depth0.auto_mute;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.auto_mute){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+=",\n            liveStream: ";options={hash:{},inverse:self.program(3,program3,data),fn:self.noop,data:data};if(stack1=helpers.live_stream){stack1=stack1.call(depth0,options);}
else{stack1=depth0.live_stream;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.live_stream){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
options={hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data};if(stack1=helpers.live_stream){stack1=stack1.call(depth0,options);}
else{stack1=depth0.live_stream;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.live_stream){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+=",\n            autoContinue: false,\n            thumbnail: true,\n            showPlaylist: false,\n            playerOptions: {\n                entryId: '";if(stack1=helpers.video_id){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_id;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="',\n                thumbnailUrl: '";if(stack1=helpers.primary_image){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.primary_image;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"'\n            }\n        });\n        callback(playerName);\n    }(function (player) {\n        player.draw();\n    }));\n</script>\n";if(stack1=helpers.launch_quote_template){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.launch_quote_template;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["shortcodes/tmz-video-launch-quote"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function";buffer+="<div class=\"launch-quote\"><span class=\"launch-quote-text\">";if(stack1=helpers.launch_quote){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.launch_quote;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</span><span\n        class=\"video-credit-text\">";if(stack1=helpers.video_credit){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_credit;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="</span></div>\n";return buffer;});this["JST"]["shortcodes/tmz-video-swipe"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<div class=\"video-swipe\"><span class=\"video-swipe-text\">";if(stack1=helpers.video_swipe){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.video_swipe;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span></div>\n";return buffer;});this["JST"]["sticky-sidebar/promotion-galleries-slider"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;function program1(depth0,data){var buffer="",stack1;buffer+="\n  <div class=\"slide slide--has-caption\"\n       data-tracking=\"sidebar-promo-gallery-"
+escapeExpression(((stack1=depth0.index),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"-"
+escapeExpression(((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n       data-url=\""
+escapeExpression(((stack1=depth0.url),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n       data-adid=\"sidebarwidget-gallery-"
+escapeExpression(((stack1=depth0.index),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n       data-target=\""
+escapeExpression(((stack1=depth0.url_target),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n  >\n\n      <img class=\"rr-featured-photo-gallery\"\n           data-src=\""
+escapeExpression(((stack1=((stack1=depth0.thumbnails),stack1==null||stack1===false?stack1:stack1['300x400'])),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n           alt=\""
+escapeExpression(((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"\"\n           border=\"0\"/>\n\n\n      <h5>"
+escapeExpression(((stack1=depth0.title),typeof stack1===functionType?stack1.apply(depth0):stack1))
+"</h5>\n\n      <div class=\"view__gallery\">\n        <span class=\"camera\"></span>\n        <span class=\"text\">View Gallery!</span>\n      </div>\n\n  </div>\n";return buffer;}
stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["videos/playlist"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n<li class=\"chapterBox";stack1=helpers['if'].call(depth0,depth0.active,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" data-entryId=\"";if(stack1=helpers.slug){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.slug;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\" data-mediabox-index=\"0\">\n    <div class=\"chapterBoxInner\">\n        <div class=\"thumbnailHolder vilynx_enabled\" data-vilynx-id=\"";if(stack1=helpers.vilynxId){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.vilynxId;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n            <img class=\"k-thumb resized\" alt=\"\" data-mediabox-index=\"-1\" src=\"";if(stack1=helpers.thumbnailUrl){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.thumbnailUrl;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\">\n        </div>\n        <div class=\"k-title-container\">\n            <span class=\"k-title\">";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span>\n        </div>\n        <div class=\"k-duration\">\n          <span>";if(stack1=helpers.duration){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.duration;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span>\n        </div>\n    </div>\n</li>\n";return buffer;}
function program2(depth0,data){return" active";}
stack1=helpers.each.call(depth0,depth0.items,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["widgets/account-message"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<div class=\"account-message-container\">\n  <div class=\"modal\">\n    <div class=\"header\">\n      <div class=\"logo\"></div>\n      <span class=\"subtitle\">Account Removal Coming Soon</span>\n      <a class=\"btn-close\" href=\"#\">&#10005;</a>\n    </div>\n    <div class=\"content\">\n      <p>TMZ will be removing the Account Feature in the coming weeks. For those who use it to comment, you can continue\n        to comment on TMZ Articles by signing up for a Disqus account.</p>\n      <a class=\"signup-link\" href=\"https://disqus.com/merge-sso/tmz/\" target=\"_blank\">Sign up for disqus</a>\n    </div>\n  </div>\n</div>\n";});this["JST"]["widgets/newsletter-signup"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<div class=\"newsletter-signup-container\">\n    <div class=\"newsletter-modal\">\n        <div class=\"header\">\n            <div class=\"logo\"></div>\n            <span class=\"subtitle\">Newsletter</span>\n            <a class=\"btn-close\" href=\"#\">&#10005;</a>\n        </div>\n        <div class=\"content\">\n            <div class=\"form-section\">\n                <h2 class=\"headline\">Get the <span class=\"red\">news you need</span> right in your inbox</h2>\n                <input class=\"input-email\" type=\"text\" placeholder=\"Your email address here...\" />\n                <a class=\"btn-signup\" href=\"#\">\n                    <span class=\"text\">Sign Me Up</span>\n                    <div class=\"loading\"></div>\n                </a>\n                <p class=\"fine-print\">By clicking \"Sign me up!\"\" you agree to the <a href=\"http://www.warnerbros.com/privacy-center-wb-privacy-policy\" target=\"_blank\">Privacy Policy</a> and <a href=\"http://www.tmz.com/terms\" target=\"_blank\">Terms of Use</a></p>\n            </div>\n            <div class=\"success\">\n                <div class=\"checkbox\">\n                    <span class=\"checkmark\"></span>\n                </div>\n                <h2 class=\"headline\">You're all set</h2>\n            </div>\n        </div>\n    </div>\n</div>\n";});this["JST"]["widgets/quick-subscribe"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<div class=\"quick-subscribe-block\">\n  <h2>SUBSCRIBE</h2>\n   <form class=\"quick-subscribe-form\">\n    <div class=\"optin-errortxt\"></div>\n    <input type=\"text\" id=\"fteemail2\" class=\"quicksub-email\" name=\"email\" value=\"\" placeholder=\"Email Address\"/>\n    <span class=\"disclaimer\">By clicking \"Sign me up!\", you agree to the <a href=\"\">Privacy Policy</a> and <a href=\"\">Terms\n      of Use</a>.</span>\n    <input class=\"quick-subscribe-submit\" type=\"submit\" value=\"GO\">\n  </form>\n</div>";});this["JST"]["widgets/showtimes/stations"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);partials=this.merge(partials,Handlebars.partials);data=data||{};var buffer="",stack1,self=this,functionType="function",escapeExpression=this.escapeExpression;function program1(depth0,data){var buffer="",stack1;buffer+="\n<div class=\"station\">\n  <div class=\"affiliate\">";if(stack1=helpers.affiliate){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.affiliate;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</div><span class=\"callsign\"> (";if(stack1=helpers.callsign){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.callsign;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+") </span>\n  ";stack1=helpers.each.call(depth0,depth0.showtimes,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div><!--#end_station-->\n";return buffer;}
function program2(depth0,data){var buffer="",stack1;buffer+="\n  <ul class=\"showtimes\">";stack1=self.invokePartial(partials['widgets/showtimes/times'],'widgets/showtimes/times',depth0,helpers,partials,data);if(stack1||stack1===0){buffer+=stack1;}
buffer+="</ul>\n  ";return buffer;}
buffer+="<!--stationsloaded-->\n";stack1=helpers.each.call(depth0,depth0.stations,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;});this["JST"]["widgets/showtimes/times"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;buffer+="<li><span class=\"day\">";if(stack1=helpers.day){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.day;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span><span class=\"time\">";if(stack1=helpers.time){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.time;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</span></li>\n";return buffer;});this["JST"]["widgets/sidebar/follow-tmz"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};return"<div class=\"tabs\">\n    <h3>FOLLOW TMZ</h3>\n    <ul class=\"tab-links first clr\">\n        <li id=\"viaemail\" class=\"arrow_box\"><i></i></li>\n        <li id=\"facebook\"><i></i></li>\n        <li id=\"twitter\"><i></i></li>\n        <li id=\"youtube\"><i></i></li>\n        <li id=\"instagram\"><i></i></li>\n        <li id=\"apps\"><i></i></li>\n        <li id=\"menuMore\"><i></i></li>\n    </ul>\n    <ul class=\"tab-links second clr hidden\">\n        <li id=\"gplus\" class=\"arrow_box\"><i></i></li>\n        <li id=\"tumblr\"><i></i></li>\n        <li id=\"pinterest\"><i></i></li>\n        <li id=\"vine\"><i></i></li>\n        <li id=\"rssfeed\"><i></i></li>\n        <li id=\"sms\"><i></i></li>\n        <li id=\"menuClose\"><i></i></li>\n    </ul>\n    <div class=\"tab-content\">\n        <div class=\"groupA\">\n            <div id=\"tab1\" class=\"viaemail tab clr\"><!-- email -->\n\n                <iframe id=\"opt-in-iframe2\" width=\"0\" height=\"0\"\n                        scrolling=\"no\" name=\"opt-in-iframe2\"></iframe>\n                <form id=\"email-opt-in\"\n                      action=\"https://www.nl.tmz.com/subscribev2.php\"\n                      method=\"post\" class=\"emailForm\"\n                      target=\"opt-in-iframe2\">\n                    <div id=\"optin-errormsg\"></div>\n                    <div class=\"leftcol\">\n                        <input type=\"text\" id=\"ftemail\" name=\"email\"\n                               value=\"Enter your email\"\n                               placeholder=\"Enter your email\"/>\n                        <input type=\"checkbox\" name=\"groups[]\" value=\"3\"\n                               id=\"icymi\" checked onclick=\"customAdId('follow-widget.tmz.newsletter.icymi.checked');\"/>\n                        <input type=\"checkbox\" name=\"groups[]\" value=\"268\"\n                               id=\"breaking\" checked onclick=\"customAdId('follow-widget.tmz.newsletter.breaking.checked');\"/>\n                        <span class=\"policy-link\">By clicking \"Sign me up!\" you agree to the <a\n                                href=\"http://www.warnerbros.com/privacy-center-wb-privacy-policy\"\n                                target=\"_new\"\n                                onclick=\"s_objectID=&quot;http://www.warnerbros.com/privacy-center-wb-privacy-policy_1&quot;;return this.s_oc?this.s_oc(e):true\">Privacy\n                            Policy</a> and <a\n                                href=\"http://www.tmz.com/terms/\"\n                                target=\"_new\"\n                                onclick=\"s_objectID=&quot;http://www.tmz.com/terms/_1&quot;;return this.s_oc?this.s_oc(e):true\">Terms\n                            of Use</a>.</span>\n\n                        <div class=\"form-labels\">\n                            <label for=\"icymi\"><strong>In Case You Missed\n                                It</strong><br/>Receive a breakdown of the\n                                week's top stories.</label><br/><br/>\n                            <label for=\"breaking\"><strong>Breaking\n                                News</strong><br/>Our biggest stories\n                                delivered straight to your inbox.</label>\n                        </div>\n                    </div>\n                    <div class=\"rightcol\">\n                        <input id=\"ftmz-subscribe-btn\" type=\"submit\"\n                               value=\"Sign me Up!\"/>\n                    </div>\n                </form>\n\n            </div>\n            <div id=\"tab2\" class=\"facebook tab hidden\"><!-- facebook -->\n                <div id=\"fb-root\"></div>\n                <div class=\"fb-like\" data-href=\"https://www.facebook.com/tmz\" data-width=\"275\" data-layout=\"standard\" data-action=\"like\" data-show-faces=\"false\" data-share=\"false\"></div>\n            </div>\n            <div id=\"tab3\" class=\"twitter tab hidden\"><!-- twitter -->\n\n            </div>\n            <div id=\"tab4\" class=\"youtube tab hidden\"><!-- youtube -->\n                <div class=\"g-ytsubscribe\" data-channel=\"TMZ\"\n                     data-layout=\"full\" data-count=\"default\"></div>\n            </div>\n            <div id=\"tab5\" class=\"instagram tab hidden\"><!-- instagram -->\n                <a href=\"http://instagram.com/tmz_tv?ref=badge\"\n                   class=\"ig-b- ig-b-v-24\" target=\"_new\" onclick=\"customAdId('follow-widget.tmz.instagram.submit');\"><img\n                        src=\"//badges.instagram.com/static/images/ig-badge-view-24.png\"\n                        alt=\"Instagram\"/></a>\n            </div>\n            <div id=\"tab6\" class=\"apps tab hidden\"><!-- apps -->\n                <a href=\"https://itunes.apple.com/us/app/tmz/id299948601?mt=8\"\n                   target=\"_new\" onclick=\"customAdId('follow-widget.tmz.app.appleStore');\"><i id=\"ios\"></i></a>\n                <hr>\n                <a href=\"https://play.google.com/store/apps/details?id=com.rhythmnewmedia.tmz&hl=en\"\n                   target=\"_new\" onclick=\"customAdId('follow-widget.tmz.app.googleStore');\"><i id=\"googleplay\"></i></a>\n                <hr>\n                <a href=\"http://www.amazon.com/Warner-Bros-TMZ/dp/B004SRD2MY\"\n                   target=\"_new\" onclick=\"customAdId('follow-widget.tmz.app.amazonStore');\"><i id=\"amazonstore\"></i></a>\n            </div>\n        </div>\n        <div class=\"groupB\">\n            <div id=\"tab7\" class=\"gplus tab hidden\"><!-- gplus -->\n                <div class=\"g-follow\" data-annotation=\"bubble\"\n                     data-height=\"24\"\n                     data-href=\"https://plus.google.com/112203561486212102740\"\n                     data-rel=\"publisher\"></div>\n            </div>\n            <div id=\"tab8\" class=\"tumblr tab hidden\"><!-- tumblr -->\n                <iframe class=\"btn\" frameborder=\"0\" border=\"0\"\n                        scrolling=\"no\" allowtransparency=\"true\" height=\"25\"\n                        width=\"116\"\n                        src=\"http://platform.tumblr.com/v1/follow_button.html?button_type=2&tumblelog=tmz&color_scheme=dark\"></iframe>\n            </div>\n            <div id=\"tab9\" class=\"pinterest tab hidden\"><!-- pinterest -->\n                <a data-pin-do=\"buttonFollow\"\n                   href=\"http://www.pinterest.com/tmz/\" onclick=\"customAdId('follow-widget.tmz.pinterest.submit');\">TMZ</a>\n                <script type=\"text/javascript\" async defer\n                        src=\"//assets.pinterest.com/js/pinit.js\"></script>\n            </div>\n            <div id=\"tab10\" class=\"vine tab hidden\"><!-- vine -->\n                <a href=\"https://vine.co/tmz\" target=\"_new\"><i\n                        id=\"vinelink\" onclick=\"customAdId('follow-widget.tmz.vine.submit');\"></i></a>\n            </div>\n            <div id=\"tab11\" class=\"rssfeed tab hidden\"><!-- rssfeeds -->\n                <a href=\"http://www.tmz.com/rss.xml\" target=\"_new\" onclick=\"customAdId('follow-widget.tmz.rss.tmz.submit');\"><i\n                        id=\"rsslink\"></i></a>\n                <hr>\n                <a href=\"http://www.tmz.com/feeds\" class=\"allfeeds\"\n                   target=\"_new\" onclick=\"customAdId('follow-widget.tmz.rss.allfeeds.submit');\">View all RSS feeds.</a>\n            </div>\n            <div id=\"tab12\" class=\"sms tab hidden\"><!-- sms -->\n                <span>To receive Breaking News texted to your mobile phone, sign up for <strong>Mobile\n                    SMS Alerts</strong> by <a\n                        href=\"http://www.tmz.com/tmzmobilealerts\"\n                        target=\"_new\" onclick=\"customAdId('follow-widget.tmz.sms.submit');\">submitting your phone number here</a>.</span>\n            </div>\n        </div>\n        <!-- end .groupB -->\n    </div>\n    <!-- .tab-content -->\n</div>\n<! -- tabs -->";});this["JST"]["widgets/sidebar/most-commented-posts"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",self=this,escapeExpression=this.escapeExpression,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){var buffer="",stack1;buffer+="\n<article class=\"clearfix\">\n    <a href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"?adid=sidebarwidget-most-commented\" rel=\"nofollow\">\n        ";stack1=helpers['if'].call(depth0,depth0.primaryImage,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n\n<div class=\"subheader\" href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"?adid=sidebarwidget-most-commented\">\n";stack1=helpers['if'].call(depth0,depth0.fragments,{hash:{},inverse:self.program(7,program7,data),fn:self.program(4,program4,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n    </a>\n<h5>";if(stack1=helpers.date){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.date;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"</h5>\n</article>\n";return buffer;}
function program2(depth0,data){var buffer="",stack1;buffer+="\n<img src=\"";if(stack1=helpers.primaryImage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.primaryImage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" />\n";return buffer;}
function program4(depth0,data){var buffer="",stack1;buffer+="\n";stack1=helpers.each.call(depth0,depth0.fragments,{hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
function program5(depth0,data){var buffer="",stack1;buffer+="\n";stack1=(typeof depth0===functionType?depth0.apply(depth0):depth0);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
function program7(depth0,data){var buffer="",stack1;buffer+="\n";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\n";return buffer;}
buffer+="<div class=\"sidebar-widget posts-widget tmz-posts\">\n<div class=\"widget-title\">Most Commented</div>\n";options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};if(stack1=helpers.posts){stack1=stack1.call(depth0,options);}
else{stack1=depth0.posts;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.posts){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n";return buffer;});this["JST"]["widgets/sidebar/most-popular-posts"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,'>= 1.0.0'];helpers=this.merge(helpers,Handlebars.helpers);data=data||{};var buffer="",stack1,options,functionType="function",self=this,escapeExpression=this.escapeExpression,blockHelperMissing=helpers.blockHelperMissing;function program1(depth0,data){var buffer="",stack1;buffer+="\n<article class=\"clearfix\">\n    <a href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"?adid=sidebarwidget-most-popular\" rel=\"nofollow\">\n        ";stack1=helpers['if'].call(depth0,depth0.primaryImage,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n    <div class=\"subheader\" href=\"";if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.url;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"?adid=sidebarwidget-most-popular\">\n";stack1=helpers['if'].call(depth0,depth0.fragments,{hash:{},inverse:self.program(7,program7,data),fn:self.program(4,program4,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>\n    </a>\n</article>\n";return buffer;}
function program2(depth0,data){var buffer="",stack1;buffer+="\n      <div class=\"post-thumbnail\">\n        <img src=\"";if(stack1=helpers.primaryImage){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.primaryImage;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\" />\n      </div>\n";return buffer;}
function program4(depth0,data){var buffer="",stack1;buffer+="\n";stack1=helpers.each.call(depth0,depth0.fragments,{hash:{},inverse:self.noop,fn:self.program(5,program5,data),data:data});if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
function program5(depth0,data){var buffer="",stack1;buffer+="\n";stack1=(typeof depth0===functionType?depth0.apply(depth0):depth0);if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n";return buffer;}
function program7(depth0,data){var buffer="",stack1;buffer+="\n";if(stack1=helpers.title){stack1=stack1.call(depth0,{hash:{},data:data});}
else{stack1=depth0.title;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
buffer+=escapeExpression(stack1)
+"\n";return buffer;}
buffer+="<div class=\"sidebar-widget posts-widget most-popular tmz-posts\">\n<div class=\"widget-title\">Most Popular</div>\n";options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};if(stack1=helpers.posts){stack1=stack1.call(depth0,options);}
else{stack1=depth0.posts;stack1=typeof stack1===functionType?stack1.apply(depth0):stack1;}
if(!helpers.posts){stack1=blockHelperMissing.call(depth0,stack1,options);}
if(stack1||stack1===0){buffer+=stack1;}
buffer+="\n</div>";return buffer;});define('document',function(){return document;});define('window',function(){return window;});define('jquery.cookie',['window'],function(window){return window.jQuery.cookie;});define('jquery.tmpl',['window'],function(window){return window.jQuery.template;});define('handlebars',['window'],function(window){return window.Handlebars;});define('templates/jst',['window'],function(window){return window.JST;});require.config({paths:{'backbone':['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min','backbone/1.1.0/backbone-min'],'handlebars':['handlebars/1.1.2/handlebars.runtime'],'jquery':['//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min','jquery/jquery-1.10.2.min'],'jquery.ui':['//ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min','jquery.ui/1.8.14/jquery.ui.min'],'underscore':['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min','underscore/1.5.2/underscore-min'],'async':['//connect.facebook.net/en_US/all']},map:{'*':{'nav':'nav/1.1.2/nav','gallery':'photos/1.3.0/gallery','categories':'photos/1.3.0/categories','tips':'tips/1.0.6/tips','ad-custom':'widgets/sidebar/ad-custom/1.0.3/ad-custom','search':'search/1.0.5/search','playlist':'videos/playlist/1.0.7/playlist','newsletter-signup':'widgets/newsletter-signup/1.0.1/newsletter-signup','tmz-live':'tmz-live/1.0.3/tmz-live','showtimes-zipcode-service':'tmz-live/1.0.3/showtimes-zipcode-service','tmz-slots':'tmz-slots/1.0.1/tmz-slots','share':'share/1.0.4/share','event-listeners':'global/event-listeners/1.0.1/event-listeners','account-message':'widgets/account-message/1.0.0/account-message','sidebar-tracking':'sidebar-tracking/1.0.0/sidebar-tracking','article-blogroll':'blogroll/1.0.3/article-blogroll','article-blogroll-config':'blogroll/1.0.3/article-blogroll-config','article-blogroll-hbhelpers':'blogroll/1.0.3/article-blogroll-hbhelpers','article-blogroll-ad':'blogroll/1.0.3/article-blogroll-ad','disqus':'tmz/disqus/1.1.1/disqus','mw':'tmz/middleware/1.0.1/client','quick-subscribe':'widgets/quick-subscribe/1.0.0/quick-subscribe','redux':'lib/redux/3.7.2/redux.min','promotion-galleries-slider':'widgets/sticky-sidebar/promotion-galleries-slider/1.0.0/promotion-galleries-slider','fastdom':'lib/fastdom','periodify':'lib/periodify','page-visibility':'lib/page-visibility','sticky-sidebar-polyfills':'sticky-sidebar/1.0.1/sticky-sidebar-polyfills','sticky-sidebar-index':'sticky-sidebar/1.0.1/index','sticky-sidebar':'sticky-sidebar/1.0.1/sticky-sidebar','sticky-sidebar-config':'sticky-sidebar/1.0.1/sticky-sidebar-config','sticky-unit':'sticky-sidebar/1.0.1/sticky-unit','sticky-unit-actions':'sticky-sidebar/1.0.1/sticky-unit-actions','sticky-unit-reducers':'sticky-sidebar/1.0.1/sticky-unit-reducers','sticky-unit-tracking':'sticky-sidebar/1.0.1/sticky-unit-tracking','sticky-unit-vendors':'sticky-sidebar/1.0.1/sticky-unit-vendors','vwo-test-article-blogroll':'vwo-test-js/blogroll/article-blogroll','vwo-test-article-blogroll-hbhelpers':'vwo-test-js/blogroll/article-blogroll-hbhelpers','vwo-test-article-blogroll-ad':'vwo-test-js/blogroll/article-blogroll-ad',}},shim:{'backbone':{deps:['underscore','jquery'],exports:'Backbone'},'handlebars':{exports:'Handlebars'},'jquery':{exports:'jQuery'},'jquery.ui':{deps:['jquery'],exports:'jQuery.ui'},'underscore':{exports:'_'},'facebook':{exports:'FB'}},config:{requirecss:{baseUrl:require.s.contexts._.config.baseUrl.substr(0,require.s.contexts._.config.baseUrl.length-3)}}});define('app',['require','jquery','dispatcher','util','logger','module','window','document'],function(require,$,dispatcher,util,loggerFactory,module,window,document,undefined){'use strict';var logger=loggerFactory.getInstance(module.id);var userLoggedIn=false;function app(){var _this=Object.create({});function init(){logger.info('init');}
function setUserLoggedIn(loggedIn){userLoggedIn=loggedIn;if(userLoggedIn){dispatcher.trigger('user:logged_in');}else{dispatcher.trigger('user:logged_out');}}
function isUserLoggedIn(){return userLoggedIn;}
_this.init=init;_this.dispatcher=dispatcher;_this.util=util;_this.setUserLoggedIn=setUserLoggedIn;_this.isUserLoggedIn=isUserLoggedIn;return _this;}
return app();});define('util',['module','jquery','handlebars','window','document'],function(module,$,Handlebars,window,document,undefined){'use strict';Handlebars.registerHelper('SYSTEM_VERSION',function(){return window.SYSTEM_VERSION||'';});Handlebars.registerHelper('SYSTEM_ENV',function(){return window.SYSTEM_ENV||'';});Handlebars.registerHelper('DEVICE_VIEW',function(){return window.DEVICE_VIEW||'';});Handlebars.registerHelper('ASSETS_BASEURL',function(){return window.ASSETS_BASEURL||'';});Handlebars.registerHelper('SITE_BASEURL',function(){return window.SITE_BASEURL||'';});Handlebars.registerHelper('SITE_DOMAIN',function(){return window.SITE_DOMAIN||'';});var domReadyDeferred=$.Deferred();var domReadyPromise=domReadyDeferred.promise();$(document).ready(function(){domReadyDeferred.resolve();});function util(){var _this=Object.create({});function getDomReadyPromise(){return domReadyPromise;}
function parseSharing(domElement){getDomReadyPromise().done(function(){if(window.addthis&&window.addthis.toolbox){window.addthis.toolbox(domElement);}
if(window.twttr&&window.twttr.widgets){window.twttr.widgets.load(domElement);}});}
_this.getDomReadyPromise=getDomReadyPromise;_this.parseSharing=parseSharing;return _this;}
return util();});(function($){window.TmzClass={create:function(className){var args=Array.prototype.slice.call(arguments,0);var options,class_definition,superclass,superclassName;var f;className=args.shift();if(typeof args[0]==="string"){superclassName=args.shift();}
else if(typeof args[0]==="function"){throw("tmzDefineClass: superclass name must be string, not the function itself");}else{if(typeof TmzObject==="function"){superclassName='TmzObject';}else{superclassName='Object';}}
if($.type(window[superclassName])==="null"||$.type(window[superclassName])==="undefined"){throw("TmzClass.create cannot find parent class '"+superclassName+"'");}
superclass=window[superclassName];class_definition=args.shift()||{};if(!class_definition.hasOwnProperty('constructor')){class_definition.constructor=function(){superclass.apply(this,arguments);};}
eval(className+' = function() { class_definition.constructor.apply(this, arguments); }');f=function(){};f.prototype=superclass.prototype;window[className].prototype=new f();$.extend(window[className].prototype,{"className":className,"class":window[className],"superclass":superclass,"superclassName":superclassName},class_definition);return window[className];},abstractMethod:function(msg){throw('Abstract method not overriden by subclass - '+(msg||""));}};})(jQuery);(function($){TmzClass.create('TmzObject','Object',{constructor:function(options){Object.apply(this,[]);this.$options=options||{};this.$___listeners={};},options:function(){return this.$options;},toString:function(){return"[ "+this.className+" ]";},addListener:function(listenerName,callback){if(!this.$___listeners[listenerName]){this.$___listeners[listenerName]=[];}
if($.inArray(callback,this.$___listeners[listenerName])===-1){this.$___listeners[listenerName].push(callback);}},removeListener:function(listenerName,callback){if(!this.$___listeners[listenerName]){return;}else{var index;if((index=$.inArray(callback,this.$___listeners[listenerName]))!==-1){this.$___listeners[listenerName].splice(index,1);}}},fireListener:function(listenerName){var t=this;var args=Array.prototype.slice.call(arguments,1);if(this.$___listeners[listenerName]){$.each(this.$___listeners[listenerName],function(i,callback){if(callback){callback.apply(t,args);}});}},isInstanceOf:function(klass){if($.type(klass)==='string'){klass=window[klass];}
var parent_or_self=this['class'];while(klass!==null){if(klass===parent_or_self){return true;}
parent_or_self=parent_or_self.superclass;}
return false;},log:function(){if(window.console&&window.console.log){console.log([this.className+":"].concat(Array.prototype.slice.call(arguments)));}},error:function(msg){throw(this.className+": "+msg);},report:function(msg){t.log(this.className+": "+msg);},destroy:function(){},__randString:function(){return(Math.random()*10000000000).toString().split('.')[0];},__keyCount:function(obj){var count=0;var k;for(k in obj){if(obj.hasOwnProperty(k)){count++;}}
return count;},___any:function(array,cond){for(var i=0;i<array.length;i++){if(cond.call(this,array[i])){return true;}}
return false;},___all:function(array,cond){for(var i=0;i<array.length;i++){if(!cond.call(this,array[i])){return false;}}
return true;}});})(jQuery);(function($){TmzClass.create('TmzModel',{constructor:function(attributes,options){this.$attributes=attributes||{};TmzObject.apply(this,[options]);}});})(jQuery);(function($){TmzClass.create('TmzCFBackedModel','TmzModel',{constructor:function(attributes,options){if(attributes.activeDate){attributes.activeDate=new Date(Date.parse(attributes.activeDate));}
TmzModel.apply(this,[attributes,options]);},fromGSA:function(){return!this.$attributes.CrawlDate;},title:function(){return this.$attributes.title;},description:function(){return this.$attributes.description;},thumbnailUrl:function(){return this.$attributes.thumbnailUrl;},activeDate:function(){return this.$attributes.activeDate;},url:function(){return this.$attributes.RecordLink;}});})(jQuery);(function($){TmzClass.create('TmzView','TmzObject',{constructor:function(options){$.extend({needsUniqueId:false},options||{});TmzObject.apply(this,[options]);this.$___drawn=false;this.$___where=null;this.$___originalWhere=null;if(this.$options.where){this.setWhere(this.$options.where);}
if(this.where()&&this.$options.draw===true){this.draw();}},hasWhere:function(){return this.where().size()>0;},setWhere:function(where){this.$___where=where;},where:function(){return $(this.$___where);},wasDrawn:function(){return this.$___drawn;},draw:function(options){options=$.extend({showOnlyAfterDrawn:true,secludedDiv:true},options||{});if(this.wasDrawn()){throw(this.className+': already called draw(), try ___redraw()');}
if(options.where){this.setWhere(options.where);}
if(this.where()===null||this.where().length===0){if($.type(this.$___where)==='string'){this.error('You have set where as a selector, but that selector does not match any elements');}else{this.error('Cannot draw() without first setting a valid where');}}
this.fireListener('beforeDraw');if(options.secludedDiv){this.$___originalWhere=this.$___where;this.setWhere($('<div></div>').appendTo(this.where().slice(0,1)));}
if(options.showOnlyAfterDrawn){this.where().css('visibility','hidden');}
this.where().addClass(this.cssClassNames()).data('tmz-this',this);if(this.$options.needsUniqueId){this.where().attr('id',this.___toDash(this.className)+Math.random().toString().substring(2,20));}
if(this.___hardcodedWidth()){this.where().width(this.___hardcodedWidth());}
if(this.___hardcodedHeight()){this.where().height(this.___hardcodedHeight());}
if(this.drawFunction){this.drawFunction.call(this);}
if(options.showOnlyAfterDrawn){this.where().css('visibility','');}
this.$___drawn=true;this.fireListener('afterDraw');},ensureDrawn:function(options){if(!this.wasDrawn()){this.draw(options||{});}},___redraw:function(){if(this.wasDrawn()){this.fireListener('beforeRedraw');this.$___drawn=false;this.where().empty();this.draw({secludedDiv:false});this.fireListener('afterRedraw');}else{throw(this.className+': cannot redraw(), was never draw()n');}},show:function(){this.where().show();},hide:function(){this.where().hide();},destroy:function(){if(this.wasDrawn()){this.where().remove();}},width:function(){if(this.___hardcodedWidth()){return this.___hardcodedWidth();}else if(this.wasDrawn()){return this.where().outerWidth(true);}else{throw(this.className+": Cant get width before element is drawn");}},height:function(){if(this.___hardcodedHeight()){return this.___hardcodedHeight();}else if(this.wasDrawn()){return this.where().outerHeight(true);}else{throw(this.className+": Cant get height before element is drawn");}},scoped:function(selector){return $(selector,this.where());},cssClassNames:function(){return this.___toDash(this.className);},___hardcodedWidth:function(){return this.$options.width;},___hardcodedHeight:function(){return this.$options.height;},___toDash:function(){return this.className.replace(/([A-Z])/g,function($1){return"-"+$1.toLowerCase();}).substring(1).replace(/-view$/,"");}});})(jQuery);(function($){TmzClass.create('TmzLightbox','TmzView',{DEFAULT_INTERVAL:250,constructor:function(url,options){var t=this;t.$url=url;t.$options=$.extend({where:$('<div></div>').appendTo('body'),initialHeight:null,fixedHeight:null,resizeContinuously:true,resizeInterval:t.DEFAULT_INTERVAL,outsideClickCloses:true,offsetFromWindowTop:20},(options||{}));t.$trap=null;t.$resizeIntervalID=null;if(t.$options.fixedHeight){t.$options.initialHeight=t.$options.fixedHeight;t.$options.resizeContinuously=false;}
t.$currentLightboxHeight=null;t.$recenterFrameCallback=function(){t.___recenterFrame();};TmzView.apply(this,[this.$options]);t.draw();},show:function(){if($('.tmz-lightbox-modal-trap').length<1){var t=this;t.$trap=$('<div class="tmz-lightbox-modal-trap"><div class="gallery-canvas"></div></div>').appendTo('body').animateCss('fade','0.75s').click(function(e){e.preventDefault();if(t.$options.outsideClickCloses){t.removeTrap();t.destroy();}});t.___recenterFrame();t.where().show();}},hide:function(){this.where().hide();$(document).find('.photos-lightbox').remove();},removeTrap:function(){$(document).find('.tmz-lightbox-modal-trap > .gallery-canvas').hide();$(document).find('.tmz-lightbox-modal-trap').animateCss('fade','0.75s','reverse',function(){$(document).find('.tmz-lightbox-modal-trap').remove();});this.$trap=null;},destroy:function(){var t=this;$(document).find('.tmz-lightbox').animateCss('fade','0.75s','reverse',function(){t.hide();$(t.___lightboxDocument()).unbind('keyup.tmzLightbox');$(document).unbind('keyup.tmzLightbox');t.where().parent().remove();if(t.$resizeIntervalID){clearInterval(t.$resizeIntervalID);}});},drawFunction:function(){var t=this;var keyupEventHandler=$.proxy(t.___keyupHandler,t);$(document).bind('keyup.tmzLightbox',keyupEventHandler);window.lightboxReadyCallback=function(){$(t.___lightboxDocument()).bind('keyup.tmzLightbox',keyupEventHandler);};t.where().append('<div class="close"></div><div class="frame"><iframe style="visibility: hidden;" scrolling="no" allowfullscreen allowtransparency="true" src="'+this.$url+'"></iframe></div>');t.where().css('top',$(window).scrollTop()+t.$options.offsetFromWindowTop);$(document).on('click','.tmz-lightbox .close',function(e){e.preventDefault();t.removeTrap();t.destroy();});t.scoped('> .frame > iframe').get(0).contentWindow.containingLightbox=t;t.scoped('> .frame > iframe').get(0).contentWindow.containingWindow=window;$(window).resize(t.$recenterFrameCallback);},___keyupHandler:function(e){var t=this;if(e.which===27){e.preventDefault();t.removeTrap();t.destroy();}},___recenterFrame:function(){var offsetLeft=Math.max(($(window).width()-this.where().width())/2,0);this.where().css('left',offsetLeft);},___lightboxRoot:function(){var root=this.scoped('> .frame > iframe').contents().find('html');if($.browser&&$.browser.msie){return root.parent();}
return root;},___lightboxDocument:function(){var iframe=this.scoped('> .frame > iframe').get(0);return iframe.contentWindow?iframe.contentWindow.document:'';}});})(jQuery);function allowfullscreen(){var element=document.body;var requestMethod=element.requestFullScreen||element.webkitRequestFullScreen||element.mozRequestFullScreen||element.msRequestFullScreen;if(requestMethod){requestMethod.call(element);}else if(typeof window.ActiveXObject!=="undefined"){var wscript=new ActiveXObject("WScript.Shell");if(wscript!==null){wscript.SendKeys("{F11}");}}
return false;}
var WbGpt=(function(){'use strict';function sanitize(thing){return thing.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^\w\s,-]/gi,'').replace(/-+/g,'-');}
function processTargeting(thing){if(Array.isArray(thing)){return thing.map(function(item){return sanitize(item.toString());});}else{return sanitize(thing.toString());}}
var classCallCheck=function(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}};var createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}
return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var inherits=function(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}
subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;};var possibleConstructorReturn=function(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}
return call&&(typeof call==="object"||typeof call==="function")?call:self;};var Slot=function(){function Slot(gptSlot,adUnitPath,size,divId){classCallCheck(this,Slot);this.gptSlot=gptSlot;this.config={adUnitPath:adUnitPath,divId:divId};if(size){this.config.size=size;}}
createClass(Slot,[{key:'getGptSlot',value:function getGptSlot(){return this.gptSlot;}},{key:'getConfig',value:function getConfig(){return this.config;}},{key:'updateConfig',value:function updateConfig(key,value){this.config[key]=value;return this;}},{key:'addService',value:function addService(service){this.gptSlot.addService(service);return this;}},{key:'clearCategoryExclusions',value:function clearCategoryExclusions(){this.gptSlot.clearCategoryExclusions();return this;}},{key:'clearTargeting',value:function clearTargeting(){var optKey=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;this.gptSlot.clearTargeting(optKey);return this;}},{key:'defineSizeMapping',value:function defineSizeMapping(sizeMapping){this.gptSlot.defineSizeMapping(sizeMapping);this.config.sizeMapping=sizeMapping;return this;}},{key:'get',value:function get$$1(key){return this.gptSlot.get(key);}},{key:'getAdUnitPath',value:function getAdUnitPath(){return this.gptSlot.getAdUnitPath();}},{key:'getAttributeKeys',value:function getAttributeKeys(){return this.gptSlot.getAttributeKeys();}},{key:'getCategoryExclusions',value:function getCategoryExclusions(){return this.gptSlot.getCategoryExclusions();}},{key:'getResponseInformation',value:function getResponseInformation(){return this.gptSlot.getResponseInformation();}},{key:'getSlotElementId',value:function getSlotElementId(){return this.gptSlot.getSlotElementId();}},{key:'getTargeting',value:function getTargeting(key){return this.gptSlot.getTargeting(key);}},{key:'getTargetingKeys',value:function getTargetingKeys(){return this.gptSlot.getTargetingKeys();}},{key:'set',value:function set$$1(key,value){this.gptSlot.set(key,value);return this;}},{key:'setCategoryExclusion',value:function setCategoryExclusion(categoryExclusion){this.gptSlot.setCategoryExclusion(categoryExclusion);return this;}},{key:'setClickUrl',value:function setClickUrl(value){this.gptSlot.setClickUrl(value);return this;}},{key:'setCollapseEmptyDiv',value:function setCollapseEmptyDiv(collapse){var optCollapseBeforeAdFetch=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;this.gptSlot.setCollapseEmptyDiv(collapse,optCollapseBeforeAdFetch);return this;}},{key:'setForceSafeFrame',value:function setForceSafeFrame(forceSafeFrame){this.gptSlot.setForceSafeFrame(forceSafeFrame);return this;}},{key:'setSafeFrameConfig',value:function setSafeFrameConfig(config){this.gptSlot.setSafeFrameConfig(config);return this;}},{key:'setTargeting',value:function setTargeting(key,value){var sanitizedKey=processTargeting(key);var sanitizedValue=processTargeting(value);this.gptSlot.setTargeting(sanitizedKey,sanitizedValue);return this;}}]);return Slot;}();var OutOfPageSlot=function(_Slot){inherits(OutOfPageSlot,_Slot);function OutOfPageSlot(){classCallCheck(this,OutOfPageSlot);return possibleConstructorReturn(this,(OutOfPageSlot.__proto__||Object.getPrototypeOf(OutOfPageSlot)).apply(this,arguments));}
return OutOfPageSlot;}(Slot);var slots=new Map();var googletag=void 0;var displayProvider=void 0;var slotIndex=1;var slotDivIdPrefix='wbgpt-';var servicesAreEnabled=false;var slotIdQueue=[];var promises=[];var WbGpt=function(){function WbGpt(){classCallCheck(this,WbGpt);}
createClass(WbGpt,[{key:'configure',value:function configure(newGoogletag){var newDisplayProvider=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;googletag=newGoogletag;displayProvider=newDisplayProvider||newGoogletag;return this;}},{key:'setGoogletag',value:function setGoogletag(newGoogletag){googletag=newGoogletag;return this;}},{key:'setDisplayProvider',value:function setDisplayProvider(newDisplayProvider){displayProvider=newDisplayProvider;return this;}},{key:'getSlotDivIdPrefix',value:function getSlotDivIdPrefix(){return slotDivIdPrefix;}},{key:'setSlotDivIdPrefix',value:function setSlotDivIdPrefix(newSlotDivIdPrefix){slotDivIdPrefix=newSlotDivIdPrefix;return this;}},{key:'createSlot',value:function createSlot(adUnitPath){var size=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var id=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;var divId=id||''+slotDivIdPrefix+slotIndex;slotIndex+=1;this.destroySlotById(divId);var slot=new Slot(googletag.defineSlot(adUnitPath,size,divId),adUnitPath,size,divId);slot.addService(googletag.pubads());slots.set(divId,slot);return slot;}},{key:'createOutOfPageSlot',value:function createOutOfPageSlot(adUnitPath){var id=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var divId=id||''+slotDivIdPrefix+slotIndex;slotIndex+=1;this.destroySlotById(divId);var slot=new OutOfPageSlot(googletag.defineOutOfPageSlot(adUnitPath,divId),adUnitPath,null,divId);slot.addService(googletag.pubads());slots.set(divId,slot);return slot;}},{key:'enableServices',value:function enableServices(){var _this=this;googletag.enableServices();servicesAreEnabled=true;if(slotIdQueue.length!==0){slotIdQueue.forEach(function(slotId){return _this.displaySlotById(slotId);});slotIdQueue=[];}
return this;}},{key:'getSlots',value:function getSlots(){return Array.from(slots.values());}},{key:'getSlotById',value:function getSlotById(id){return slots.get(id);}},{key:'setPromises',value:function setPromises(newPromises){promises=newPromises;return this;}},{key:'displaySlotById',value:function displaySlotById(id){if(servicesAreEnabled){Promise.all(promises).then(function(){displayProvider.display(id);}).catch(function(){displayProvider.display(id);});}else{slotIdQueue.push(id);}
return this;}},{key:'refreshAllSlots',value:function refreshAllSlots(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};displayProvider.pubads().refresh(null,options);return this;}},{key:'refreshSlotById',value:function refreshSlotById(id){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var slot=this.getSlotById(id);if(!slot){return this;}
displayProvider.pubads().refresh([slot.getGptSlot()],options);return this;}},{key:'destroyAllSlots',value:function destroyAllSlots(){googletag.destroySlots();slots.clear();return this;}},{key:'destroySlotById',value:function destroySlotById(id){var slot=this.getSlotById(id);if(!slot){return this;}
googletag.destroySlots([slot.getGptSlot()]);slots.delete(id);return this;}},{key:'setTargeting',value:function setTargeting(key,value){var sanitizedKey=processTargeting(key);var sanitizedValue=processTargeting(value);return googletag.pubads().setTargeting(sanitizedKey,sanitizedValue);}}]);return WbGpt;}();var instance=new WbGpt();function getInstance(){return instance;}
return getInstance;}());(function(exports){'use strict';var cookieName='wbppid';var cookieExpires=365;var expiry=new Date();var cookieDomain=void 0;function setCookieDomain(){cookieDomain=document.domain.match(/(.\.)?(\w+\.\w+)$/)[2];}
function setCookieName(newCookieName){cookieName=newCookieName;}
function setCookieExpires(newCookieExpires){cookieExpires=newCookieExpires;expiry=new Date();expiry.setDate(expiry.getDate()+cookieExpires);}
var uuidv4=function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b);};function fromStorage(){var m=void 0;var results=void 0;if(window.localStorage){results=window.localStorage[cookieName]||false;}
if(!results&&navigator.cookieEnabled){m=document.cookie.match(cookieName+'=([^;]*)');results=m&&(encodeURIComponent(m[1])||false);}
return results||false;}
function toStorage(newPpid){if(window.localStorage){window.localStorage[cookieName]=newPpid;}
if(navigator.cookieEnabled){document.cookie=[cookieName,'=',newPpid,'; expires=',expiry.toUTCString(),'; path=/; domain=',cookieDomain].join('');}
return newPpid;}
function set(newValue){var value=newValue.replace(/[\W_]/g,'');if(value.length<32||value.length>150){value='';}
return toStorage(value);}
function generate(){return set(uuidv4());}
function get(){return fromStorage()||generate();}
exports.get=get;exports.setCookieDomain=setCookieDomain;exports.setCookieExpires=setCookieExpires;exports.setCookieName=setCookieName;}((this.wbppid=this.wbppid||{})));(function(exports){'use strict';var cookieName='wbabt';var cookieExpires=7;var expiry=new Date();var cookieDomain=void 0;function randomAbt(){return Math.floor(Math.random()*100)+1;}
function toStorage(value){if(window.localStorage){window.localStorage[cookieName]=value;}
if(navigator.cookieEnabled){document.cookie=[cookieName,'=',value,'; expires=',expiry.toUTCString(),'; path=/; domain=',cookieDomain].join('');}
return value;}
function set(value){return toStorage(value);}
function generate(){return set(randomAbt());}
function fromStorage(){var m=void 0;var results=void 0;if(window.localStorage){results=window.localStorage[cookieName]||false;}
if(!results&&navigator.cookieEnabled){m=document.cookie.match(cookieName+'=([^;]*)');results=m&&(encodeURIComponent(m[1])||false);}
return results||'';}
function get(){return(fromStorage()||generate()).toString();}
function setCookieDomain(){cookieDomain=document.domain.match(/(.\.)?(\w+\.\w+)$/)[2];}
function setCookieName(newCookieName){cookieName=newCookieName;}
function setCookieExpires(newCookieExpires){cookieExpires=newCookieExpires;expiry=new Date();expiry.setDate(expiry.getDate()+cookieExpires);}
exports.get=get;exports.setCookieDomain=setCookieDomain;exports.setCookieExpires=setCookieExpires;exports.setCookieName=setCookieName;}((this.wbabt=this.wbabt||{})));(function(exports){'use strict';var tokenName='wbreferrer';function getReferrer(){var url=void 0;var referrer=void 0;var match=void 0;if(document.referrer){url=document.referrer;match=url.match(/^(?:https?:)?(?:\/\/)?([^/?]+)/i);if(match){referrer=match[1];}}
return referrer;}
function fromStorage(){var results=void 0;if(window.sessionStorage){results=window.sessionStorage[tokenName]||false;}
return results||'';}
function toStorage(value){if(window.sessionStorage){window.sessionStorage[tokenName]=value;}
return value;}
function get(){var hostSite=window.location.hostname;var referrer=getReferrer();if(referrer&&hostSite!==referrer){return toStorage(referrer);}
return fromStorage();}
exports.get=get;}((this.wbreferrer=this.wbreferrer||{})));$(document).on('click','.has-adid',function(){var $link=$(this);var adId=$link.data('adid');var href=$link.attr('href');s.linkTrackVars='prop46,eVar46';s.prop46=s.eVar46=adId+'-click';s.tl(this,'o',adId);s.clearVars();s.prop46=s.eVar46='';$link.attr("href",href+"?adid="+adId);return true;});