setInterval(function() {
  try {
    document
      .getElementsByClassName("interrupter-actions")[0]
      .getElementsByClassName("nf-flat-button")[0]
      .click()
  } catch (e) {
      console.log(e)
  }
//   try {
//     var title = document.getElementsByClassName("vjs-play-control")[0].title
//     var fullscreen = document.getElementsByClassName(
//       "vjs-fullscreen-control"
//     )[0].title

//     if (title === "Play")
//       document.getElementsByClassName("vjs-poster")[0].click()

//     if (fullscreen === "Fullscreen") {
    
//     }
//   } catch (e) {
//     console.log(e)
//   }
}, 10000)
