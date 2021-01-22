setInterval(function() {
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
  } catch (e) {}
}, 5000)
