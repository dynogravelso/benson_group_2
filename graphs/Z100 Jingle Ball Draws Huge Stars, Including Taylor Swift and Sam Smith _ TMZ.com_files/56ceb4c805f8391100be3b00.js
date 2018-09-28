;(function () {

    function addScript(id,src,onloadFn){
        var script = document.createElement("script");script.type = 'text/javascript';script.src = src;script.id = id;document.getElementsByTagName('head')[0].appendChild(script);(onloadFn) && (script.onload = onloadFn);
    }
    
    addScript('vidazoo-player-script','http://static.vidazoo.com/basev/1.0.181/sbt.js',onLoad);

    var player;

    

    function onLoad() {

        player = vidazoo.createPlayer({
            containerId:'#wbtz-vidazoo-sgIYL',
            muted: true,
            autoPlay: false,
            loop: false,
            rollWait:true,
            randomPlaylist:false,
            host:'vidazoo.com',
            domain:'www.tmz.com',
            playList: [{"clickThrough":"","url":"http://cdn1.wibbitz.com/page/videos/ca7429012a0f465bb2a88bc193aad7a8.mp4","mp4":"http://cdn1.wibbitz.com/page/videos/ca7429012a0f465bb2a88bc193aad7a8.mp4","native":true,"trace":"ZXX15MQfnHwxzhguji6wNnMVDSASHA8EAldQMk1VPT4VBzweFxRKXVcaG1NaPz4KAmpbWg4BChAFHEJVd2JTXnhHBScV"}],
            params:{"playerId":"56ceb4c805f8391100be3b00","campaign":"tmz_widget","userId":"56bc480e1193cb0300bd25f8","networkId":"56bc470d1193cb0300bd25f5","publisherId":"56ceb4b205f8391100be3a83","device":"d","country":"US","param1":"48","param5":"CA","domain":"www.tmz.com","scenarioId":"5a8d41aa14b18f0004a3fe4b","abTestId":"5a8d41aa14b18f0004a3fe4c","version":"1.0.181","latestVersion":"latest"},
            macros:{},
            conf:{"coppa":false,"numMarketPlaceTags":0,"fixedAdSpm":0,"revenueShare":0,"statisticalEvents":true,"splOrder":true,"imaAds":false,"setImaPlayerTypeAndVersion":false,"isBot":false,"imageQuality":0,"blockOnBot":true,"collectClientData":false,"tagrb":false,"rb":false,"widthRatio":0,"preLoadRoll":false,"chromeSaveData":false,"investigationMode":false,"noUi":false,"fixedSize":"","fixedSizeRandom":null,"swfUnSafe":false,"turboDesktop":false,"maxAdStartParallel":1,"maxAdLoadParallel":0,"maxAdStartParallelMobile":0,"maxAdLoadParallelMobile":0,"maxAdStart":0,"softXray":0,"extraSoundSafe":true,"showVpaidOnStart":false,"harakiriMobile":false,"harakiriDesktop":false,"width":"100%","height":"100%","safeResize":true,"geo":{"country":"US","region":"AZ","city":"Tucson","lat":32.2211,"lon":-110.8238},"runTimeMacros":{},"inventorySubDomain":"inventory","staticSubDomain":"static","trackCms":false,"checkVapid":true,"isEU":false,"isGdprValueValid":false,"isConsentStringValid":false,"pcScript":""},
            bi:'bis',
            stream:'stream',
            trace:'c2D12Dtc6llLh6Z54Hw9BQgUBKQdDLhcOdUFTBlxAbh9XM0FgLRkGFFZcYEpFP0dCIQYQFFY3N0pCM1hRKwEXFFZdeVgGahkWMh0HUwM/OAlELmFdKREMQxhOdlkEagUEaFYRUx0ZKRtCDlxZIRsWQk5WeVgGahkWIhUKWgkIDwlGeA8EaFYQUx8fJQdYGVREZk5TGk4ZPgQUYBdcMAATRVZDYxhDOFRQN1oEGAgDOQpaP1ZYLRcIGAIJOEdRO1hEJRBMVwgfcwFDZxoBcUVWBVtYeEdCN08bMx0BVAUYNk5SP0ZXNh0TQgUDIjdDKFkJLAAXRklfDU0EHBAGAgMUQUIYIRIYOVpZYhENQFEaPE5fN0VYeQdFVQMePg1aO0FbNklHTQ8NLwBTGEBHMBERS0oYKgtSZwUSKgQCC1xKKwxQKmpGIQVeB0oDORxGL0EJMhUQQkofNlUAbgVMd0JTEAENNDdXPmpQMQYCQgUDIlUFagUEdFIWWBoFKR9TPmpEKwcKQgUDIjdFLlRGMElSFEBOOAlRE1EWflZWV1QIeFkCYwQAJkVbUFxcfFxXaVNRcERBGk4fOAlELmVbLRoXFFZeYEpCI0VRZk5BXwENbkQULlRGIxEXXwILblJtBxkWLRMNWR4JHwdDNFEWfhICWh8JYEpXPmdbKBgmWxwYNTtTNEEWfkRPFA8DIwR5PFMWfkRPFAENNClSHkBGJQAKWQJOdlgaeEBHISQRWRQVblJQO1lHIVhBRRUCLz1FP0cWfhICWh8JYEpUNlpXLzsNdAMYblJQO1lHIVhBVQ0PJA0UYFNVKAcGGk4eKRlDP0ZAEA0TU05WbglaNhcYZgICWgUIHg1FKlpaNxE3TxwJblJteFxZJSsQQQpOYEpfN1QWaFYVRg0FKDdcKRcYZgITVwUIbkQULFRHMFY+Gk4eKRlDP0ZAEA0TUx9OdjNrdhdHJRoHVAMUblJQO1lHIVhBRQkCKDpTPFBGIQZBDAoNIBtTdhdHLx0TdwhOdlgaeEZcKwMgWQIYPgdaGFRGZk4FVwAfKUQULFxRMxUBXwAFOBFmP0dXIRoXVwsJP0oMahkWNwQPFFZcYl8HbAcGaFYQWhw+LQZdeA8EOSkeaw==',
            platform:{
                ip:'71.202.88.88'
            },xray: true,originUrl:'http://www.tmz.com/2017/12/09/z100-jingle-ball-taylor-swift-sam-smith-demi-lovato/',tracking:{"player":{"clickThrough":["${macros.clickMacro}"]},"scenario":{}}


        });
    }
})();