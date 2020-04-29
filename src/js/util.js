const getSchedules = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("schedules", (result) => {
      resolve(result.schedules || [])
    })
  })
}

const setSchedules  = (schedules) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ schedules }, () => {
      resolve(schedules)
    })
  })
}

const openUrl = function(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url: url }, function() {
      resolve(true)
    })
  })
}

const options = {
  openUrl,
  getSchedules,
  setSchedules
}
window.tabSchedulerOptions = options


