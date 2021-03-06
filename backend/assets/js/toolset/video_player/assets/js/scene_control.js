var vplayer;

var videoWrapper = $('.sf-video-wrapper');

var video_isplaying = true;

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
}

var osStatus = getMobileOperatingSystem();
var _cTmr = 0;
$(document).ready(function () {

    var options = {};
    var sceneH = window.innerHeight;
    var sceneW = window.innerWidth;

    if (!isMobile) {

    }
    $('body').css({
        'width': sceneW,
        'height': sceneH,
        left: 0
    });
    $('video').css({
        'width': sceneW,
        'width': sceneH
    });
    //
    // setTimeout(function () {
    //     $('.start-video-page').hide();
    // }, 3000);
    //
    $('.start-video-page').hide();

    vplayer = videojs('video-player', {
        controls: true,
        preload: 'auto',
        width: sceneW,
        height: sceneH,
        loop: false,
        autoplay: true
    }, function () {
        vplayer.on('play', function () {
            video_isplaying = true;
            hideControls();
			// $('.play_pause_button').show();
            $('.loading-img-wrapper').hide();
            // video_isplaying=true;
            if (osStatus == 'Android' || osStatus == 'iOS')
                $('button.vjs-fullscreen-control').hide()
        });
        vplayer.on("pause", function () {
            video_isplaying = false;
            showControls();
        });
        vplayer.on("ended", function () {
            video_isplaying = false;
            showControls();
        });
        vplayer.on('timeupdate', function () {
            hideControls();
        })
    });
    // resizeWindow();

    if (start_play_status != '') {
        $('.loading-img-wrapper').hide();
        video_isplaying = true;
        play_pause();
    }
    showControls();
    vplayer.on('useractive', function () {
        console.log('user activated');
        showControls();
    })
    $('.loading-img-wrapper').hide();
    resizeWindow();

});

function showControls(){
    clearInterval(_cTmr);
    if(parent.clickedContent) parent.clickedContent();
    _cTmr = setInterval(function () {
        if(parent.clickedContent) parent.clickedContent();
    },1800);
}
function hideControls(){
    clearInterval(_cTmr);
}
function switchVideo(st) {

    if (st) {//True then show video and hide content page area
        videoWrapper.show();
        verticalWrapper.hide();
        if (initStatus === 0) {
            $('.prev-page-btn-1').css('display', 'none');
        } else {
            $('.prev-page-btn-1').css('display', 'block');
        }

    } else {//False then video hide and show content page
        videoWrapper.hide();
        verticalWrapper.show();
        $('.prev-page-btn-1').css('display', 'none');
    }
}

function showVideo(videoFile) {

    vplayer.src({type: 'video/mp4', src: videoFile});
    resizeWindow();

}

function play_pause() {
    return;
    if (video_isplaying) {
        video_isplaying = false;
        vplayer.pause();
    } else {
        video_isplaying = true;
        vplayer.play();
    }
}

var screenApi = {};

(function (lib) {
    lib.isFullscreen = function () {
        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.isFullscreen || document.msIsFullscreen || document.msFullscreenElement) {
            return true;
        }
        return false
    };

    lib.requestFullscreen = function () {
        if (this.isFullscreen()) {
            return;
        }
        var dom = document.getElementById('contentWrap');
        if (dom.requestFullscreen) {
            dom.requestFullscreen();
        } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if (dom.webkitRequestFullscreen) {
            dom.webkitRequestFullscreen();
        } else if (dom.msRequestFullscreen) {
            dom.msRequestFullscreen();
        }
    };
    lib.quitFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };
    lib.toggleFullscreen = function () {

        if (this.isFullscreen()) {
            this.quitFullscreen();
        } else {
            this.requestFullscreen();
        }
    };
    lib.onScreenChange = function () {
        onresize();
    };

    var initRatio, lastRatio, bodyScale;

    function getDevicePixelRatio() {
        if (window.devicePixelRatio) {
            return window.devicePixelRatio;
        }
        return screen.deviceXDPI / screen.logicalXDPI;
    }

    lib.init = function () {
        document.addEventListener("fullscreenchange", this.onScreenChange);
        document.addEventListener("webkitfullscreenchange", this.onScreenChange);
        document.addEventListener("mozfullscreenchange", this.onScreenChange);
        document.addEventListener("MSFullscreenChange", this.onScreenChange);
        document.addEventListener("orientationchange", this.onScreenChange);
        window.addEventListener('resize', function (e) {
            onresize(e);
        });
        window.addEventListener('orientationchange', function (e) {
            onresize(e);
        });

        initRatio = getDevicePixelRatio();
        lastRatio = initRatio;
        bodyScale = 1 / initRatio;
        //$('body').css({width:window.innerWidth * initRatio, height:window.innerHeight * initRatio,transform:'scale(' +(bodyScale)+')'})
        onresize(null);
    };

    function onresize(e) {
        resizeWindow()
    };

})(screenApi);

function gloalHandle(e) {
    screenApi.toggleFullscreen();
}


$(window).resize(function () {
    resizeWindow();
    screenApi.init();
});

function resizeWindow(rate) {
    var sceneH = window.innerHeight;
    var sceneW = window.innerWidth;

    if (rate == undefined) rate = sceneH / sceneW;

    var width = sceneW;
    var height = sceneW * rate;
    var top = (sceneH - height) / 2;
    var left = 0;
    if (sceneH < sceneW * rate) {
        width = sceneH / rate;
        height = sceneH;
        top = 0;
        left = (sceneW - width) / 2;
    }
    $('body').css({
        width: width,
        height: height,
        top: top,
        left: left,
        background: 'transparent'
    });
    $('video').css({
        width: width,
        height: height,
        top: top,
        left: left
    });
    $('.video-js .vjs-control-bar').css({'font-size': '12px'});

    $('.sf-video-wrapper .video-js .custom-video-contain').css({
        width: width,
        height: height,
        top: 0,
        left: 0
    })
    $('.sf-video-wrapper .video-js').css({
        width: width,
        height: height,
        top: 0,
        left: 0
    });
    var fileType = getFiletypeFromURL($('#video-player source').attr('src'));
    if (fileType == 'mp3' || fileType == 'wav') {
        $('a').hide();
        $('.video-js').css({
            background: 'url(./assets/images/audio.gif)',
            'background-size': '40% 30%',
            'background-position': 'center',
            'background-repeat': 'no-repeat'
        });
    }
}

function getFiletypeFromURL(str) {
    if (str == '') return '';
    var str = str.split('.');
    return str[str.length - 1].toLowerCase();
}
