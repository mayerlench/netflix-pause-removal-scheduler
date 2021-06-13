setInterval(function () {
  try {
    document
      .getElementsByClassName("interrupter-actions")[0]
      .getElementsByClassName("nf-flat-button")[0]
      .click()
  } catch (e) {
    console.log(e)
  }
  try {
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
  } catch (e) { }
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
          newWindow: true,
          close: true,
          gravity: "top", //
          position: "left", //
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
    `
  document.body.appendChild(script);
  setTimeout(() => {
    script.remove()
  }, 8000)
}


const getNetflixInfo = () => {
  const info = document.getElementsByClassName('ellipsize-text')[0]

  try {
    const children = info.children
    if (!children[0].innerText && !children[1].innerText && !children[2].innerText)
      return

    return encodeURIComponent(`${children[0].innerText} ${children[1].innerText} ${children[2].innerText}`)
  } catch (e) {
    try {
      return encodeURIComponent(info.innerText || '')
    } catch (e) {
      return
    }
  }
}

setInterval(function () {
  try {
    if (document.location.hash || !document.location.href.startsWith('https://www.netflix.com/watch/'))
      return

    const info = getNetflixInfo()

    if (info)
      document.location.hash = info
  } catch (e) {
    return
  }
}, 1000)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'show_toast') {
    showToast(message.message)
  }
});