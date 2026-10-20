// Hides the "Download CV" button if no CV file has been uploaded to the assets folder yet.
// (Only runs on the live site; opened from your computer, the button always shows.)
if (location.protocol.indexOf('http') === 0) {
  document.querySelectorAll('[data-cv]').forEach(function (a) {
    fetch(a.getAttribute('href'), { method: 'HEAD' }).then(function (r) {
      if (!r.ok) a.hidden = true;
    }).catch(function () { a.hidden = true; });
  });
}
