window.onload = function(){

    var sT = 0.1
    var rT = 0.75;
    var mT = 0.65;
    var tT = 1;
    var fT = 2;

    function init(){
        TweenLite.delayedCall(tT, fade0);
    }

    function fade0() {
        TweenLite.to(copy, mT, {height: '-1'});
        TweenLite.delayedCall(mT, fade1);
    }

    function fade1() {
		TweenLite.to(slide1, mT, {left: '-100%'});
		TweenLite.to(slide2, mT, {left: '0'});
		TweenLite.to(copy, sT, {'background-image': 'url("./images/copy2.png")', width: '131px', 'background-size': '121px 35px'});
		TweenLite.delayedCall(mT, fade2);
    }

	function fade2() {
		TweenLite.to(copy, mT, {height: '45px'});
		TweenLite.delayedCall(fT, fade3);
	}

	function fade3() {
		TweenLite.to(copy, mT, {height: '-1'});
        TweenLite.delayedCall(mT, fade4);
	}

	function fade4() {
		TweenLite.to(slide2, mT, {left: '-100%'});
		TweenLite.to(slide3, mT, {left: '0'});
		TweenLite.to(copy, sT, {'background-image': 'url("./images/copy3.png")', width: '95px', 'background-size': '85px 15px'});
		TweenLite.delayedCall(mT, fade5);
    }

	function fade5() {
		TweenLite.to(copy, mT, {height: '25px'});
		TweenLite.delayedCall(fT, fade6);
	}

	function fade6() {
		TweenLite.to(copy, mT, {height: '-1'});
        TweenLite.delayedCall(mT, fade7);
	}

	function fade7() {
		TweenLite.to(slide3, mT, {left: '-100%'});
		TweenLite.to(slide4, mT, {left: '0'});
		TweenLite.to(copy, sT, {'background-image': 'url("./images/copy4.png")', width: '141px', 'background-size': '131px 15px'});
		TweenLite.delayedCall(mT, fade8);
    }

	function fade8() {
		TweenLite.to(copy, mT, {height: '25px'});
	}

    init();
};
