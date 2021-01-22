setInterval(function() {
  tabSchedulerOptions.checkSchedules()
}, 10000)

setInterval(function() {
  console.log('checking for failed page')
  try {
    var error =
      document.getElementsByClassName("error-page--content")[0].querySelector("h1").innerText ===
      "Pardon the interruption"
    if (error) tabSchedulerOptions.reloadCurrentTab()
  } catch (e) {
    console.log(e)
  }

  try {
    var error =
      document.getElementById("main-message").querySelector("h1 > span").innerText === "This site can’t be reached"
    if (error) tabSchedulerOptions.reloadCurrentTab()
  } catch (e) {
    console.log(e)
  }
}, 5000)

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    return chrome.tabs.create({
      url: "options/options.html",
    })
  }
})
