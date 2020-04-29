setInterval(function() {
  try {
    document
      .getElementsByClassName("interrupter-actions")[0]
      .getElementsByClassName("nf-flat-button")[0]
      .click()
  } catch (e) {}
}, 10000)

var checkSchedules = function() {
  tabSchedulerOptions.getSchedules().then(function(res) {
    res.map(function(s) {
      var dayOfWeek = moment().format("dddd")
      var timeNow = moment(moment(), "h:mm a")
      var time = moment(s.time, "h:mm a")

      if (!s.opened && dayOfWeek === s.day && timeNow.isAfter(time)) {
        tabSchedulerOptions.openUrl(s.link)

        tabSchedulerOptions.setSchedules(
          res.map(function(m) {
            if (m.id === s.id) m.opened = true

            return m
          })
        )
      }
    })
  })
}

setInterval(checkSchedules, 10000)

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    return chrome.tabs.create({
      url: "options.html",
    })
  }
})
