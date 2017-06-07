/* jQuery Mobile behavior *********************************************** */
// No animated page transitions
$(document).bind('mobileinit', function () {
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
});

// Keep footer visible at all times
$(document).on('pageinit', ':jqmData(role=page)', function() {
    // $(this).find(':jqmData(role=header)').fixedtoolbar( { tapToggle: false } );
    // $(this).find(':jqmData(role=footer)').fixedtoolbar( { tapToggle: false } );
});

/* CPR ****************************************************************** */
var compressionIntervalId = null;
var breath1IntervalId = null;
var breath2IntervalId = null;
var cprTimeoutIntervalId = null;

function startCPR(isTrained) {
    stopCPR();
    compressionIntervalId = setInterval("stayAlive();", 600);       // (60 seconds / 100 compressions) * 1000 ms = 600 ms
    if (isTrained) {
        breath1IntervalId = setInterval("giveBreath();", 18000);    // 30 compressions * 600 ms = 18,000 ms
        breath2IntervalId = setInterval("giveBreath();", 19000);    // 180,000 ms + 1000 ms = 19,000 ms
    }

    cprTimeoutIntervalId = setInterval("stopCPR();", 1200000);   // 20 minutes * 60 seconds * 1000 ms = 1,200,000 ms
}

function stayAlive() {
    console.log('compression');
    navigator.notification.vibrate(100);
}

function giveBreath() {
    console.log('breath');
    navigator.notification.beep(1);
    // TODO: fallback on vibrate if beep not available
    //navigator.notification.vibrate(800);
}

function stopCPR() {
    if (compressionIntervalId) {
        clearInterval(compressionIntervalId);
    }
    if (breath1IntervalId) {
        clearInterval(breath1IntervalId);
    }
    if (breath2IntervalId) {
        clearInterval(breath2IntervalId);
    }
    if (cprTimeoutIntervalId) {
        clearInterval(cprTimeoutIntervalId);
    }
    compressionIntervalId = null;
    breath1IntervalId = null;
    breath2IntervalId = null;
    cprTimeoutIntervalId = null;
}


/* Illustrations ******************************************************** */
$('#protocol-content-comments img').click(function(image) {
    console.log('clicked on image');
});

$('.photopopup').on({
    popupbeforeposition: function() {
        var maxHeight = $( window ).height() - 60 + 'px';
        $( ".photopopup img" ).css( 'max-height', maxHeight );
    }
});

/* Startup ************************************************************** */

// TODO: move this into onDeviceReady()?
$(document).ready(function () {
    console.log('Document ready');

    wfaApp.init('./json/wfaapp.json');
    wfaApp.populateProtocols();
    wfaApp.populateWildernessKit();

    // $.mobile.loadpage( '#wildernesskit-medications-page' );
    // $.mobile.loadpage( '#wildernesskit-firstaid-page' );
    // $.mobile.loadpage( '#wildernesskit-survival-page' );
    // $.mobile.loadpage( '#emergency-page' );

});

/* Pause **************************************************************** */
document.addEventListener("pause", onPause, false);

function onPause() {
    stopCPR();
}
