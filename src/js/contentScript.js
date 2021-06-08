setInterval(function () {
  console.log('stating internal function')
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