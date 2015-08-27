'use strict';

var DEBUG = false;

var checkWindowClosing = false;

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    DEBUG && console.log('tab removed');

    if (removeInfo.isWindowClosing) {
        DEBUG && console.log('do nothing due to window closing');

        return;
    }

    checkWindowClosing = true;
});

chrome.windows.onRemoved.addListener(function() {
    DEBUG && console.log('window removed');

    if (!checkWindowClosing) {
        return;
    }

    checkWindowClosing = false;

    DEBUG && console.log('tab was closed');

    chrome.windows.getAll(function(windows) {
        var isOtherWindowOpened = windows.some(function(window) {
            return (window.type && window.type === 'normal');
        });

        DEBUG && console.log('all windows count', windows.length);
        DEBUG && console.log('is other “normal” window opened', isOtherWindowOpened);

        if (!isOtherWindowOpened) {
            chrome.windows.create();
        }
    });
});
