const tryCatch = (func) => {
  try {
    return func()
  } catch (error) {

  }
}

setInterval(function () {
  tryCatch(() => document
    .getElementsByClassName("interrupter-actions")[0]
    .getElementsByClassName("nf-flat-button")[0]
    .click()
  )

  const amazonPeacockChecks = () => {
    const isPeacock = window.location.origin.includes("peacock")
    const isAmazon = window.location.origin.includes("amazon")
    const btnClass = isPeacock ? "autoplay__button--container" : isAmazon ? "atvwebplayersdk-playpause-button" : ""
    const btnEl = document.getElementsByClassName(btnClass)[0]

    if (!btnEl) return

    if (isAmazon && btnEl.getAttribute("aria-label") === "Pause") return

    const videoEl = document.getElementsByTagName("video")[0]
    videoEl.setAttribute("muted", true)
    videoEl.setAttribute("autoplay", true)
    videoEl.setAttribute("webkit-playsinline", true)
    videoEl.setAttribute("playsinline", true)
    btnEl.click()
  }
  tryCatch(amazonPeacockChecks)

}, 5000)

const pageInit = () => {
  var script = document.createElement('script');
  var link = document.createElement('link');

  script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/toastify-js');
  link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  link.setAttribute('rel', 'stylesheet');

  document.head.appendChild(link);
  document.body.appendChild(script);
}
pageInit()

const showToast = (message) => {
  var script = document.createElement(`script`);
  script.innerHTML = `
        Toastify({
          text: \`${message}\`,
          duration: 8000,
          close: true,
          gravity: "top",
          position: "left",
          stopOnFocus: true
        }).showToast();
    `
  document.body.appendChild(script);
  setTimeout(() => {
    script.remove()
  }, 8000)
}


const getNetflixInfo = () => {

  const info = document.querySelector('[data-uia="video-title"]');
  if (!info)
    return

  try {
    if (info.children.length === 0) {
      return encodeURIComponent(info.innerText || '')
    }

    const children = info.children
    return encodeURIComponent(`${children[0].innerText} ${children[1].innerText} ${children[2].innerText}`)
  } catch (e) {
    console.log(e, 'cannot get title')
  }
}

setInterval(function () {
  const setNFTitleHash = () => {
    if (document.location.hash || !document.location.href.startsWith('https://www.netflix.com/watch/'))
      return

    const info = getNetflixInfo()
    console.log('🚀 ~ file: contentScript.js ~ line 93 ~ setNFTitleHash ~ info', info)

    if (info)
      document.location.hash = info
  }

  tryCatch(setNFTitleHash)
}, 1000)

setInterval(function () {
  tryCatch(() => document.getElementsByClassName('bigPlayUIInner')[0].click())
}, 1000)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'show_toast') {
    showToast(message.message)
  }
});