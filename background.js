'use strict';

var DEBUG = false;

function checkWindows() {
    return new Promise(function(resolve) {
        chrome.windows.getAll(function(windows) {
            var normalWindows = windows.filter(function(window) {
                return (window.type && window.type === 'normal');
            });

            DEBUG && console.log('windows count', windows.length);
            DEBUG && console.log('normal windows count', normalWindows.length);

            if (normalWindows.length <= 1) {
                resolve();
            }
        });
    });
}

function checkTabs() {
    return new Promise(function(resolve) {
        chrome.tabs.query({}, function(tabs) {
            DEBUG && console.log('tabs count', tabs.length);

            if (tabs.length === 0) {
                resolve();
            }
        });
    });
}

function createTab() {
    DEBUG && console.log('before tab created');

    chrome.windows.create();
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    DEBUG && console.log('tab removed');
    if (removeInfo.isWindowClosing) {
        DEBUG && console.log('do nothing due to window closing');
        return;
    }

    checkWindows()
        .then(checkTabs)
        .then(createTab)
        .catch(function(e) {
            throw new Error(e);
        });
});
