const reloadCurrentTab = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    tabs.map((m) => {
      chrome.tabs.reload(m.id)
    })
  })
}

const getSchedules = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("schedules", (result) => {
      resolve(result.schedules || [])
    })
  })
}

const setSchedules = (schedules) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ schedules }, () => {
      resolve(schedules)
    })
  })
}

const openUrl = function(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url: url }, function() {
      chrome.tabs.query({ audible: true }, function(res) {
        var tabs = res || []
        tabs.map((t) => {
          chrome.tabs.remove(t.id)
        })
      })
      resolve(true)
    })
  })
}

var checkSchedules = function() {
  getSchedules().then(function(res) {
    res.map(function(s) {
      var dayOfWeek = moment().format("dddd")
      var timeNow = moment(moment(), "h:mm a")
      var time = moment(s.time, "h:mm a")

      if (!s.opened && dayOfWeek === s.day && timeNow.isAfter(time)) {
        openUrl(s.link)

        setSchedules(
          res.map(function(m) {
            if (m.id === s.id) m.opened = true

            return m
          })
        )
      }
    })
  })
}
const options = {
  checkSchedules,
  openUrl,
  getSchedules,
  setSchedules,
  reloadCurrentTab,
}

window.tabSchedulerOptions = options
