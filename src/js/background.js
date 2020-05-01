setInterval(function() {
  tabSchedulerOptions.checkSchedules()
}, 10000)

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    return chrome.tabs.create({
      url: "options/options.html",
    })
  }
})
