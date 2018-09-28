
if(enableAds){var amazonConfig=null;window['oxDone']=function oxDone(){window.OX.dfp_bidder.setOxTargeting();};function submitOpenXSlots(){if(window.openxBidderConfig.adMappings.length){window.oxhbjs.cmds.push(function(){window.oxhbjs.setConfig(Object.assign({},window.openxBidderConfig));window.oxRequestPromise=oxhbjs.getBids();window.openxBidderConfig.adMappings=[];});}}
function submitAmazonSlots(){if('apstag'in window){amazonConfig=!amazonConfig?initAmazonConfig():amazonConfig;apstag.fetchBids({slots:window.apstagSlots},setBidCallBack('amazon'));}}
function initAmazonConfig(){var config={pubID:'3064',adServer:'googletag',bidTimeout:WB_PAGE.wbgpt_timeout};apstag.init(config);return config;}
function setBidCallBack(vendorName){var callBack;switch(vendorName){case'openx':callBack=function(){};break;case'amazon':callBack=function(){apstag.setDisplayBids();console.log('Amazon bid callback fired and set targeting for designated ad call.');};break;default:callBack=function(){console.log('Callback fired with unknown bidding vendor.');};}
return callBack;}
try{wbkrux.init('kxct','JXlj-zpN','1.9');wbppid.setCookieDomain();wbabt.setCookieDomain();}
catch(err){}
googletag.cmd.push(function(){wbgpt.configure(googletag);});if(typeof String.prototype.normalize==='undefined'){String.prototype.normalize=function(){return String(this);}}}else{var googletag=googletag||{};googletag.cmd=googletag.cmd||[];googletag.pubads=googletag.pubads||[];googletag.pubads.refresh=function(){return true;}
googletag.cmd.push(function(){return true;});function submitOpenXSlots(){return true;}
function submitAmazonSlots(){return true;}}