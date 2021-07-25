setInterval(function () {
  tabSchedulerOptions.checkSchedules()
}, 10000)

setInterval(function () {
  tabSchedulerOptions.getSchedules().then(res => {
    const links = res.filter(f => !f.opened).map(m => {
      var dayOfWeek = moment().format("dddd")
      var time = moment(m.time, "h:mm a").format('h:mm a')
      return `${m.title} - ${dayOfWeek} at ${time}`
    })
    if (links.length > 0)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "show_toast", message: `Next up on shabbatlify \n\n${links.join('\n\n')}` }, function (response) { });
      });
  })
}, 3600000)

setInterval(function () {
  try {
    // start rumble player
  
    document.getElementsByClassName('bigPlayUIInner')[0].click()
  } catch (e) {
   
  }

  try {
    var error =
      document.getElementsByClassName("error-page--content")[0].querySelector("h1").innerText ===
      "Pardon the interruption"
    if (error) tabSchedulerOptions.reloadCurrentTab()
  } catch (e) {

  }

  try {
    var error =
      document.getElementById("main-message").querySelector("h1 > span").innerText === "This site can’t be reached"
    if (error) tabSchedulerOptions.reloadCurrentTab()
  } catch (e) {
   
  }

}, 5000)

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    return chrome.tabs.create({
      url: "options/options.html",
    })
  }
})
