global.browser = require('webextension-polyfill')

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
      return chrome.tabs.create({
        url: "options.html"
      });
    }
  });
  