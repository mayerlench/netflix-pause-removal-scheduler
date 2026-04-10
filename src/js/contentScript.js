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

}, 5000)

const pageInit = () => {
  var script = document.createElement('script');
  var link = document.createElement('link');

  script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/toastify-js');
  link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  link.setAttribute('rel', 'stylesheet');

  document.head.appendChild(link);
  document.body.appendChild(script);

  var barcodeScript = document.createElement('script');
  barcodeScript.setAttribute('src', 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js');
  document.body.appendChild(barcodeScript);
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

const BARCODE_SCAN_INTERVAL = 3 * 60 * 1000;

const runBarcodeScan = () => {
  if (!document.location.href.startsWith('https://www.netflix.com/watch/'))
    return

  var scanScript = document.createElement('script');
  scanScript.innerHTML = `
    (function() {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999999;background:rgba(0,0,0,0.9);color:#fff;padding:12px 16px;border-radius:8px;font-size:14px;font-family:sans-serif;border:2px solid #e50914;display:flex;flex-direction:column;align-items:center;gap:8px;';
      document.body.appendChild(overlay);

      var statusEl = document.createElement('div');
      overlay.appendChild(statusEl);

      var preview = document.createElement('video');
      preview.style.cssText = 'width:320px;height:240px;border-radius:4px;background:#000;';
      preview.setAttribute('autoplay', '');
      preview.setAttribute('playsinline', '');
      preview.muted = true;
      overlay.appendChild(preview);

      function log(msg) {
        statusEl.textContent = msg;
        console.log('[BarcodeScan] ' + msg);
      }

      function removeOverlay() {
        setTimeout(function() { overlay.remove(); }, 8000);
      }

      if (typeof Html5Qrcode === 'undefined') {
        log('html5-qrcode library not loaded yet. Try again in a moment.');
        removeOverlay();
        return;
      }

      log('Starting camera...');

      var container = document.createElement('div');
      container.id = 'barcode-reader';
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300px;height:300px;overflow:hidden;';
      document.body.appendChild(container);

      var found = false;
      var scannedCodes = [];
      var scanner = new Html5Qrcode('barcode-reader');

      function cleanup() {
        try { scanner.stop().catch(function() {}); } catch(e) {}
        try { container.remove(); } catch(e) {}
      }

      scanner.start(
        { facingMode: 'user' },
        { fps: 10, qrbox: 250 },
        function(decodedText) {
          scannedCodes.push(decodedText);
          if (decodedText.toLowerCase() === 'play') {
            found = true;
            log('Found "play" barcode! Playback continues.');
            cleanup();
            removeOverlay();
          }
        },
        function() {}
      ).then(function() {
        var vid = container.querySelector('video');
        if (vid && vid.srcObject) {
          preview.srcObject = vid.srcObject;
        }
        log('Camera on. Scanning for 5 seconds...');
        setTimeout(function() {
          if (!found) {
            var msg = scannedCodes.length > 0
              ? 'No "play" barcode. Codes seen: ' + scannedCodes.join(', ') + '. Pausing.'
              : 'No barcodes detected at all. Pausing.';
            var player = document.querySelector('.watch-video--player-view');
            if (!player) {
              msg += ' (player element not found!)';
            } else {
              player.click();
            }
            log(msg);
          }
          cleanup();
          removeOverlay();
        }, 5000);
      }).catch(function(err) {
        log('Failed to start: ' + err);
        container.remove();
        removeOverlay();
      });
    })();
  `;
  document.body.appendChild(scanScript);
  setTimeout(() => { scanScript.remove() }, 10000);
}

setInterval(runBarcodeScan, BARCODE_SCAN_INTERVAL);

const injectTestButton = () => {
  if (!document.location.href.startsWith('https://www.netflix.com/watch/'))
    return

  var btn = document.createElement('button');
  btn.textContent = 'Scan Barcode';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;padding:8px 16px;background:#e50914;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold;opacity:0.85;';
  btn.addEventListener('mouseenter', function() { btn.style.opacity = '1'; });
  btn.addEventListener('mouseleave', function() { btn.style.opacity = '0.85'; });
  btn.addEventListener('click', function() { runBarcodeScan(); });
  document.body.appendChild(btn);
}
injectTestButton();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'show_toast') {
    showToast(message.message)
  }
});